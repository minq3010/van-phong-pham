import { User } from "../model/User";
import { Order } from "../model/order";
import hash from "bcryptjs";
import { reqSchma, loginSchema, addUserSchma } from "../Schma/auth";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import nodemailer from "nodemailer";

export const singup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate
    const { error } = reqSchma.validate(req.body, { abortEarly: false });
    if (error) {
      const list = error.details.map((issue) => ({
        message: issue.message,
      }));
      return res.status(400).json(list);
    }

    // Check username & email
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });

    if (emailUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (usernameUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await hash.hash(password, 10);

    // Đăng ký công khai chỉ được tạo tài khoản user, không được tự đặt role
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
      avatar: req.body.avatar || null,
      address: req.body.address || null,
      phone: req.body.phone || null,
      active: req.body.active ?? false,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đăng Ký thất bại",
      error: error.message,
    });
  }
};

export const addUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const { error } = addUserSchma.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const list = error.details.map((issue) => ({
        message: issue.message,
      }));
      return res.status(400).json(list);
    }

    // Chỉ được tạo 1 tài khoản manage duy nhất trong hệ thống
    if (role === "manage") {
      const existingManage = await User.findOne({ role: "manage" });
      if (existingManage) {
        return res.status(400).json({
          message: "A manage account already exists. Only one manage account is allowed.",
        });
      }
    }

    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });
    if (emailUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    if (usernameUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }
    // Mật khẩu mặc định, admin bắt buộc đổi khi đăng nhập lần đầu
    const DEFAULT_PASSWORD = "Admin@12345";
    const hashedPassword = await hash.hash(DEFAULT_PASSWORD, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      mustChangePassword: role === "admin",  // chỉ admin mới bắt buộc đổi
      active: true,
    });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Đăng Ký thất bại",
      error: error.message,
    });
  }
};
const ACCESS_TOKEN_SECRET =
  "76ca127f19145007f2723d48ce8cbf296fb7427ac4ffe557daa38952697dabb272c181f843bccfd89065158f44470be37eca0f6e6ba9da90a107f2dc0b90164a";
const REFRESH_TOKEN_SECRET =
  "040fecc7c403886ec097dc0e001ab80598ba0bdac391e72b8aeef0797f6dee72dedd5c97a2016bcbd3b641dfcc3706149313b7ca8e17c8511fafcc33763d2590";

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const list = error.details.map((issue) => ({ message: issue.message }));
      return res.status(400).json({ errors: list });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ" });
    }

    const isMatch = await hash.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Để false nếu bạn chạy bằng IP mà chưa có chứng chỉ HTTPS
      sameSite: "lax", // Lax cho phép cross-origin ở mức độ giới hạn (tốt cho hai port khác nhau)
      maxAge: 1 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      user,
      token: accessToken,
      mustChangePassword: user.mustChangePassword === true,
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Lỗi máy chủ", detail: error.message, stack: error.stack });
  }
};

export const refreshTokenHandler = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Không có refresh token" });
    }

    jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Refresh token không hợp lệ" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      const newAccessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
        domain: "https://nextnode-mu.vercel.app",
        path: "/",
      });

      return res.status(200).json({
        message: "Làm mới token thành công",
      });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const logout = async (req, res) => {
  try {
    // Xóa cả accessToken và refreshToken từ cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Lỗi server khi đăng xuất" });
  }
};

export const GetUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const includeOrderCount =
      req.query.includeOrderCount === "1" ||
      req.query.includeOrderCount === "true";

    const skip = (page - 1) * limit;

    const baseFilter = {
      role: { $nin: ["manage"] },
    };

    // Tìm kiếm theo username (nếu có)
    const searchFilter = search
      ? {
          username: { $regex: search, $options: "i" },
          ...baseFilter,
        }
      : baseFilter;

    const total = await User.countDocuments(searchFilter);

    const data = await User.find(searchFilter)
      .select("-password") // Ẩn mật khẩu (nên làm)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước (tùy chọn)

    let normalizedData = data;

    if (includeOrderCount && data.length > 0) {
      const userIds = data.map((item) => item._id);
      const orderCounts = await Order.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]);
      const orderCountMap = new Map(
        orderCounts.map((item) => [String(item._id), item.count])
      );

      normalizedData = data.map((item) => ({
        ...item.toObject(),
        orderCount: orderCountMap.get(String(item._id)) || 0,
      }));
    }

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: normalizedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in GetUser:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, phone, role } = req.body;

    // Không cho phép đổi role thành manage nếu đã tồn tại tài khoản manage khác
    if (role === "manage") {
      const existingManage = await User.findOne({ role: "manage" });
      if (existingManage && existingManage._id.toString() !== id) {
        return res.status(400).json({
          message: "A manage account already exists. Only one manage account is allowed.",
        });
      }
    }

    // Không cho phép hạ role của tài khoản manage
    const targetUser = await User.findById(id);
    if (targetUser?.role === "manage" && role && role !== "manage") {
      return res.status(403).json({
        message: "Cannot change role of the manage account.",
      });
    }

    // Check username trùng
    if (username) {
      const checkUsername = await User.findOne({ username });
      if (checkUsername && checkUsername._id.toString() !== id) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }
    }

    // ❌ Không cho cập nhật SDT nếu đã tồn tại
    if (phone) {
      const checkPhone = await User.findOne({ phone });
      if (checkPhone && checkPhone._id.toString() !== id) {
        return res.status(400).json({
          message: "Phone number already exists",
        });
      }
    }

    // Update user
    await User.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      message: "Update success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const DeleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (targetUser?.role === "manage") {
      return res.status(403).json({
        message: "Cannot delete the manage account.",
      });
    }
    await User.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      message: "Delete success",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const DetailUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const UpdatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { beforePassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(id);
    const isMatch = await hash.compare(beforePassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu hiện tại không đúng",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "2 mật khẩu k trùng nhau",
      });
    }
    const hashedPassword = await hash.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      id,
      { password: hashedPassword, mustChangePassword: false },
      { new: true }
    );
    return res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Force change password - không cần mật khẩu cũ, chỉ dùng khi mustChangePassword = true
export const forceChangePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, confirmPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }
    if (!user.mustChangePassword) {
      return res.status(403).json({ message: "Tài khoản không yêu cầu đổi mật khẩu" });
    }
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 8 ký tự" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "2 mật khẩu không khớp" });
    }
    const hashedPassword = await hash.hash(newPassword, 10);
    const updated = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword, mustChangePassword: false },
      { new: true }
    ).select("-password");
    return res.status(200).json({
      message: "Đổi mật khẩu thành công",
      user: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    console.log(req.body);
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    // Tạo token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút

    await user.save();

    // Gửi mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "samtrung0809@gmail.com",
        pass: "fxkv ohaj zqgy tnim",
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Đặt lại mật khẩu",
      html: `
        <p>Bạn đã yêu cầu đặt lại mật khẩu</p>
        <P>Mã xác nhận là ${resetToken}</P>
        
        <p>Link hết hạn sau 15 phút</p>
      `,
    });

    res.json({ message: "Đã gửi email reset mật khẩu" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // ✅ HASH GIỐNG ĐĂNG KÝ
    const hashedPassword = await hash.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 🔥 BẮT BUỘC
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

