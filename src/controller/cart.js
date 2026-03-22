import { Cart } from "../model/cart";
import { Order } from "../model/order";
import { Product } from "../model/product";
export const AddCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const { productid, quantity, color, size } = req.body;
    const product = await Product.findById(productid).select("name status variants");

    if (!product || product.status !== true) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const activeVariants = Array.isArray(product.variants)
      ? product.variants.filter((variantItem) => variantItem.status === true)
      : [];

    if (activeVariants.length === 0) {
      return res.status(400).json({ message: "Sản phẩm hiện không còn biến thể khả dụng" });
    }

    const requestedColor = String(color || "").trim();
    let selectedVariant = null;

    if (!requestedColor || requestedColor === "Mặc định") {
      selectedVariant = activeVariants[0];
    } else {
      selectedVariant = activeVariants.find((variantItem) => variantItem.color === requestedColor);
    }

    if (!selectedVariant) {
      return res
        .status(400)
        .json({ message: `Không tìm thấy biến thể ${product.name} - ${requestedColor}` });
    }

    const normalizedColor = selectedVariant.color;
    const normalizedQuantity = Math.max(1, Number(quantity || 1));

    // Tìm sản phẩm trong giỏ hàng của người dùng
    let cartItem = await Cart.findOne({
      user: userid,
      product: productid,
      color: normalizedColor,
    });

    if (!cartItem) {
      // Nếu sản phẩm chưa có trong giỏ hàng, tạo sản phẩm mới với số lượng
      cartItem = new Cart({
        user: userid,
        product: productid,
        quantity: normalizedQuantity, // Mặc định là 1 nếu không có quantity
        color: normalizedColor,
        size,
      });
    }
    // else if (cartItem.color !== color || cartItem.size !== size) {
    //   cartItem = new Cart({
    //     user: userid,
    //     product: productid,
    //     quantity: quantity || 1, // Mặc định là 1 nếu không có quantity
    //     color,
    //     size,
    //   });
    // }
    else {
      // Nếu sản phẩm đã có, tăng số lượng
      cartItem.quantity += normalizedQuantity;
      cartItem.color = normalizedColor;
    }

    // Lưu thay đổi vào cơ sở dữ liệu
    await cartItem.save();
    console.log(cartItem);
    return res.status(201).json({ message: "Thêm thành công", data: cartItem });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const GetCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const cart = await Cart.find({ user: userid }).populate({
      path: "product",
      select: "name price imageUrl",
    });
    const total = cart.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );
    return res.status(200).json({ data: cart, totalPrice: total });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DeleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    const isAdminOrManage = req.user?.role === "admin" || req.user?.role === "manage";
    const isOwner = String(cartItem.user) === String(req.user?.id);

    if (!isAdminOrManage && !isOwner) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: You can only access your own data" });
    }

    await Cart.findByIdAndDelete(id);
    return res.status(200).json({ message: "Xóa thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DeleteAllCart = async (req, res) => {
  try {
    const { userid } = req.params;
    await Cart.deleteMany({ user: userid });
    return res.status(200).json({ message: "Xóa thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// export const DeleteAllOrder = async (req, res) => {
//   try {
//     const { userid } = req.params;
//     await Order.deleteMany();
//     return res.status(200).json({ message: "Xóa thanh cong" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
export const UpdateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const normalizedQuantity = Number(quantity);
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    const isAdminOrManage = req.user?.role === "admin" || req.user?.role === "manage";
    const isOwner = String(cartItem.user) === String(req.user?.id);

    if (!isAdminOrManage && !isOwner) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: You can only access your own data" });
    }

    if (!Number.isFinite(normalizedQuantity)) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    if (normalizedQuantity <= 0) {
      await Cart.findByIdAndDelete(id);
      return res.status(200).json({ message: "Xóa sản phẩm khỏi giỏ hàng" });
    }

    await Cart.findByIdAndUpdate(id, { quantity: normalizedQuantity }, { new: true });
    return res.status(200).json({ message: "Cap nhat thanh cong" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
