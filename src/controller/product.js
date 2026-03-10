import { Order } from "../model/order";
import { Product } from "../model/product";

const parseJsonField = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (Array.isArray(value) || typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseBooleanField = (value, fallback = true) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() === "true";
};

const buildUploadedImageUrls = (req) =>
  (req.files || []).map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`
  );

const buildProductPayload = ({ req, existingImages = [] }) => {
  const variants = parseJsonField(req.body.variants, []).map((item) => ({
    color: item?.color,
    price: Number(item?.price || 0),
    quantity: Number(item?.quantity || 0),
    status: item?.status !== undefined ? parseBooleanField(item.status, true) : true,
  }));

  const uploadedImages = buildUploadedImageUrls(req);
  const abumImage = [...existingImages, ...uploadedImages].filter(Boolean);

  const totalQuantity = variants.length
    ? variants.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    : Number(req.body.quantity || 0);

  const productPrice = variants.length
    ? Number(variants[0]?.price || 0)
    : Number(req.body.price || 0);

  return {
    name: req.body.name,
    caterori: req.body.caterori,
    brand: req.body.brand || "",
    origin: req.body.origin || "",
    price: productPrice,
    variants,
    imageUrl: abumImage[0] || "",
    abumImage,
    discount: Number(req.body.discount || 0),
    description: req.body.description,
    status: parseBooleanField(req.body.status, true),
    quantity: totalQuantity,
  };
};

const GetAllProduct = async (req, res) => {
  try {
    // đếm tổng số sản phẩm
    const total = await Product.countDocuments();

    // lấy dữ liệu theo trang
    const data = await Product.find()
      .populate("caterori", "name")
      .populate("createdBy", "username")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 }); // optional: sắp xếp mới nhất

    return res.status(200).json({
      data, // hoặc transformedData
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const Pagination = async (req, res) => {
  try {
    const page = req.query.page || req.params.page || 1;
    const totalProduct = await Product.countDocuments();
    const limit = req.query.limit || 12;
    const skip = (page - 1) * limit;
    const data = await Product.find().skip(skip).limit(limit).where("_id");
    const toatalPages = Math.ceil(totalProduct / limit);
    return res.status(200).json({
      currentPage: page,
      toatalPages,
      totalProduct,
      limit,
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const GetProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "caterori",
      "name"
    );

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      message: `Product found with ID: ${req.params.id}`,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const GetProductsCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ caterori: category });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm nào trong danh mục này." });
    }

    res.status(200).json(products); // Trả về danh sách sản phẩm
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
};
const AddProduct = async (req, res) => {
  try {
    const data = await Product.create({
      ...buildProductPayload({ req }),
      createdBy: req.user.id, // Thêm ID của user tạo sản phẩm
    });

    return res.status(201).json({
      message: "Thêm thành công",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const UpdateProduct = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);

    if (!currentProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingImages = parseJsonField(
      req.body.existingImages,
      currentProduct.abumImage || []
    );

    const data = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...buildProductPayload({ req, existingImages }),
        updatedBy: req.user.id, // Thêm ID của user cập nhật sản phẩm
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Update success",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const DeleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Kiểm tra xem sản phẩm có xuất hiện trong đơn hàng nào không
    const ordersWithProduct = await Order.countDocuments({
      "products.productId": productId,
    });

    // Nếu sản phẩm có trong bất kỳ đơn hàng nào => không cho xoá
    if (ordersWithProduct > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa sản phẩm vì đang tồn tại trong ${ordersWithProduct} đơn hàng`,
      });
    }

    // Nếu không có trong đơn hàng nào => cho phép xoá
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để xóa",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  Pagination,
  GetProductDetails,
  GetAllProduct,
  AddProduct,
  UpdateProduct,
  DeleteProduct,
  GetProductsCategory,
};
