import mongoose from "mongoose";
import { Order } from "../model/order";
import { Product } from "../model/product";
import { Voucher } from "../model/voucher";

const normalizeOrdersPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.orders)) {
    return payload.orders;
  }

  return payload ? [payload] : [];
};

const getNextOrderCode = async (session) => {
  const lastOrder = await Order.findOne()
    .sort({ madh: -1 })
    .select("madh")
    .session(session);

  return Number(lastOrder?.madh || 1000) + 1;
};

const calculateVoucherDiscount = (voucher, subtotal) => {
  if (!voucher || subtotal <= 0) {
    return 0;
  }

  const now = new Date();
  const isStarted = !voucher.startDate || new Date(voucher.startDate) <= now;
  const isNotExpired = !voucher.endDate || new Date(voucher.endDate) >= now;

  if (!voucher.isActive || voucher.quantity <= 0 || !isStarted || !isNotExpired) {
    throw new Error("Voucher không còn hiệu lực");
  }

  const rawDiscount = Math.round((subtotal * Number(voucher.discount || 0)) / 100);
  const maxDiscount = Number(voucher.maxPriceDis || rawDiscount);

  return Math.min(rawDiscount, maxDiscount);
};

const buildOrderDocument = async (orderInput, session, nextOrderCode, actor) => {
  const normalizedInput = {
    ...orderInput,
    voucherId: orderInput?.voucherId || null,
    invoiceInfo: orderInput?.invoiceInfo || {},
  };

  if (!normalizedInput.customerName?.trim()) {
    throw new Error("Tên khách hàng không được để trống");
  }

  if (!normalizedInput.phone?.trim()) {
    throw new Error("Số điện thoại không được để trống");
  }

  if (!normalizedInput.address?.trim()) {
    throw new Error("Địa chỉ không được để trống");
  }

  if (!Array.isArray(normalizedInput.products) || normalizedInput.products.length === 0) {
    throw new Error("Danh sách sản phẩm không hợp lệ");
  }

  const voucher = normalizedInput.voucherId
    ? await Voucher.findById(normalizedInput.voucherId).session(session)
    : null;

  if (normalizedInput.voucherId && !voucher) {
    throw new Error("Không tìm thấy voucher");
  }

  let subtotal = 0;
  const products = [];

  for (const item of normalizedInput.products) {
    const product = await Product.findById(item.productId).session(session);

    if (!product || product.status !== true) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const variant = product.variants.find(
      (variantItem) =>
        variantItem.color === item.color && variantItem.status === true
    );

    if (!variant) {
      throw new Error(`Không tìm thấy biến thể ${product.name} - ${item.color}`);
    }

    const quantity = Number(item.quantity || 0);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Số lượng của sản phẩm ${product.name} không hợp lệ`);
    }

    if (variant.quantity < quantity) {
      throw new Error(`Sản phẩm ${product.name} - màu ${item.color} không đủ số lượng`);
    }

    const isWholesaleCustomer = normalizedInput.customerType === "wholesale";
    const wholesalePrice = Number(
      variant?.priceWholesale ?? product?.priceWholesale ?? 0
    );
    const retailPrice = Number(variant?.price ?? product?.price ?? 0);

    if (isWholesaleCustomer && wholesalePrice <= 0) {
      throw new Error(`Sản phẩm ${product.name} chưa có giá sỉ`);
    }

    const priceBeforeDis = isWholesaleCustomer ? wholesalePrice : retailPrice;
    const productDiscount = Math.max(0, Number(product.discount || 0));
    const priceAfterDis = Math.max(
      0,
      Math.round(priceBeforeDis * (1 - productDiscount / 100))
    );

    await Product.updateOne(
      {
        _id: item.productId,
        "variants._id": variant._id,
      },
      {
        $inc: {
          "variants.$.quantity": -quantity,
        },
      },
      { session }
    );

    const refreshedProduct = await Product.findById(item.productId).session(session);
    if (refreshedProduct) {
      const totalQuantity = refreshedProduct.variants.reduce(
        (sum, variantItem) => sum + Number(variantItem.quantity || 0),
        0
      );

      await Product.updateOne(
        { _id: item.productId },
        { quantity: totalQuantity },
        { session }
      );
    }

    subtotal += priceAfterDis * quantity;
    products.push({
      productId: item.productId,
      quantity,
      priceBeforeDis,
      priceAfterDis,
      name: product.name,
      color: variant.color,
    });
  }

  const voucherDiscount = calculateVoucherDiscount(voucher, subtotal);
  const totalPrice = Math.max(0, subtotal - voucherDiscount);
  const invoiceRequested = Boolean(normalizedInput.invoiceRequested);

  if (invoiceRequested) {
    if (!normalizedInput.invoiceInfo?.companyName?.trim()) {
      throw new Error("Vui lòng nhập tên công ty để xuất hóa đơn");
    }

    if (!normalizedInput.invoiceInfo?.taxCode?.trim()) {
      throw new Error("Vui lòng nhập mã số thuế để xuất hóa đơn");
    }

    if (!normalizedInput.invoiceInfo?.invoiceAddress?.trim()) {
      throw new Error("Vui lòng nhập địa chỉ xuất hóa đơn");
    }
  }

  const normalizedUserId = normalizedInput.userId || (actor?.role === "user" ? actor.id : null);
  const orderSource =
    actor?.role === "admin" || actor?.role === "manage"
      ? "manual_entry"
      : "customer_self_service";

  return {
    madh:
      Number.isFinite(Number(normalizedInput.madh)) && Number(normalizedInput.madh) > 0
        ? Number(normalizedInput.madh)
        : nextOrderCode,
    customerName: normalizedInput.customerName.trim(),
    phone: normalizedInput.phone.trim(),
    address: normalizedInput.address.trim(),
    email: normalizedInput.email?.trim() || "",
    customerType: normalizedInput.customerType || "retail",
    orderSource,
    products,
    totalPrice,
    status: normalizedInput.status || "Xác nhận",
    payment: normalizedInput.payment || "COD",
    userId: normalizedUserId,
    voucherId: normalizedInput.voucherId,
    note: normalizedInput.note || "",
    isPaymentSucces: Boolean(normalizedInput.isPaymentSucces),
    cancelReason: normalizedInput.cancelReason || "",
    handledBy: normalizedInput.handledBy || null,
    invoiceRequested,
    invoiceInfo: {
      companyName: normalizedInput.invoiceInfo?.companyName?.trim() || "",
      taxCode: normalizedInput.invoiceInfo?.taxCode?.trim() || "",
      invoiceEmail: normalizedInput.invoiceInfo?.invoiceEmail?.trim() || "",
      invoiceAddress: normalizedInput.invoiceInfo?.invoiceAddress?.trim() || "",
      note: normalizedInput.invoiceInfo?.note?.trim() || "",
    },
  };
};

export const GetOrder = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      payment = "",
      source = "",
    } = req.query;

    // Tạo query filter
    const filter = {};

    // Tìm kiếm theo mã đơn hàng / tên khách
    if (search) {
      const regex = new RegExp(search, "i");
      const searchAsNumber = Number(search);
      filter.$or = [
        ...(Number.isNaN(searchAsNumber) ? [] : [{ madh: searchAsNumber }]),
        { customerName: regex }, // tên người mua
        { phone: regex },
        { email: regex },
        { "invoiceInfo.companyName": regex },
        { "invoiceInfo.taxCode": regex },
      ];
    }

    // Lọc theo trạng thái
    if (status) {
      filter.status = status;
    }

    // Lọc theo phương thức thanh toán
    if (payment) {
      filter.payment = payment;
    }

    if (source) {
      filter.orderSource = source;
    }

    // Lấy dữ liệu với filter và phân trang
    const [data] = await Promise.all([
      Order.find(filter)
        .populate("products.productId", "imageUrl")
        .sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.error("GetOrder error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const GetOrderByUser = async (req, res) => {
  try {
    const data = await Order.find({ userId: req.params.userid }).populate(
      "products.productId",
      " imageUrl"
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const AddOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderInputs = normalizeOrdersPayload(req.body);

    if (orderInputs.length === 0) {
      throw new Error("Dữ liệu đơn hàng không hợp lệ");
    }

    let nextOrderCode = await getNextOrderCode(session);
    const preparedOrders = [];

    for (const orderInput of orderInputs) {
      const preparedOrder = await buildOrderDocument(
        orderInput,
        session,
        nextOrderCode,
        req.user
      );

      nextOrderCode = Number(preparedOrder.madh) + 1;
      preparedOrders.push(preparedOrder);
    }

    const createdOrders = await Order.create(preparedOrders, { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message:
        createdOrders.length > 1
          ? `Tạo thành công ${createdOrders.length} đơn hàng`
          : "Tạo đơn hàng thành công",
      count: createdOrders.length,
      data: createdOrders,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: error.message });
  }
};


export const UpdateOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const newStatus = req.body.status;

    // 1️⃣ Lấy order cũ
    const oldOrder = await Order.findById(id).session(session);

    if (!oldOrder) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    // 2️⃣ Nếu chuyển sang HỦY → hoàn kho
    if (newStatus === "Hủy" && oldOrder.status !== "Hủy") {
      for (const item of oldOrder.products) {
        // 2.1️⃣ Hoàn lại quantity cho đúng variant
        await Product.updateOne(
          { _id: item.productId },
          {
            $inc: {
              "variants.$[v].quantity": item.quantity,
            },
          },
          {
            arrayFilters: [
              {
                "v.color": item.color,
                "v.status": true,
              },
            ],
            session,
          }
        );

        // 2.2️⃣ Lấy lại product để tính quantity tổng
        const product = await Product.findById(item.productId).session(session);

        if (!product) continue;

        const totalQuantity = product.variants.reduce(
          (sum, v) => sum + v.quantity,
          0
        );

        // 2.3️⃣ Update quantity tổng
        await Product.updateOne(
          { _id: item.productId },
          { quantity: totalQuantity },
          { session }
        );
      }
    }

    // 3️⃣ Update order
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({ message: error.message });
  }
};

export const DeleteOrder = async (req, res) => {
  try {
    const data = await Order.deleteMany({});
    return res.status(200).json({
      message: "Đã xóa tất cả đơn hàng",
      result: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DetailOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Order.findById(id)
      .populate("products.productId", " imageUrl")
      .populate("handledBy", "username")
      .populate("voucherId", "code discount type");

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetOrderByStatus = async (req, res) => {
  try {
    const data = await Order.find({ status: req.params.status })
      .find({ userId: req.params.userid })
      .populate("voucher", "discount")
      .populate("products.productId", "name price imageUrl");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
