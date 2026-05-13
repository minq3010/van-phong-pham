import { StoreSetting } from "../model/storeSetting.js";

export const getStoreSetting = async (req, res) => {
  try {
    let setting = await StoreSetting.findOne();
    if (!setting) {
      setting = await StoreSetting.create({});
    }
    return res.status(200).json({
      message: "Lấy thông tin cài đặt thành công",
      data: setting,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const updateStoreSetting = async (req, res) => {
  try {
    let setting = await StoreSetting.findOne();
    if (!setting) {
      setting = await StoreSetting.create(req.body);
    } else {
      setting = await StoreSetting.findByIdAndUpdate(setting._id, req.body, { new: true });
    }
    return res.status(200).json({
      message: "Cập nhật thông tin cài đặt thành công",
      data: setting,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};
