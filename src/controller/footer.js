import { Policy } from "../model/policy.js";
import { Navigation } from "../model/navigation.js";

const createSlug = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// --- Policies ---
export const getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    return res.status(200).json({ data: policies });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPolicy = async (req, res) => {
  try {
    const { title, content, isActive } = req.body;
    const slug = createSlug(title);
    const policy = await Policy.create({ title, slug, content, isActive });
    return res.status(201).json({ message: "Thêm chính sách thành công", data: policy });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPolicyBySlug = async (req, res) => {
  try {
    const policy = await Policy.findOne({ slug: req.params.slug, isActive: true });
    if (!policy) return res.status(404).json({ message: "Không tìm thấy chính sách" });
    return res.status(200).json({ data: policy });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isActive } = req.body;
    const slug = title ? createSlug(title) : undefined;
    
    const updateData = { content, isActive };
    if (title) {
        updateData.title = title;
        updateData.slug = slug;
    }

    const policy = await Policy.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json({ message: "Cập nhật chính sách thành công", data: policy });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePolicy = async (req, res) => {
  try {
    await Policy.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Xóa chính sách thành công" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// --- Navigations ---
export const getNavigations = async (req, res) => {
  try {
    const navs = await Navigation.find().sort({ order: 1 });
    return res.status(200).json({ data: navs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createNavigation = async (req, res) => {
  try {
    const nav = await Navigation.create(req.body);
    return res.status(201).json({ message: "Thêm điều hướng thành công", data: nav });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateNavigation = async (req, res) => {
  try {
    const nav = await Navigation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json({ message: "Cập nhật điều hướng thành công", data: nav });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteNavigation = async (req, res) => {
  try {
    await Navigation.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Xóa điều hướng thành công" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
