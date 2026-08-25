import api from "../api/api";

// Get all categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Get single Category
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create category
export const createCategory = async (formData) => {
  // ✅ Axios handles the multipart boundary automatically!
  const response = await api.post("/categories", formData);
  return response.data;
};

// Update category
export const updateCategory = async (id, formData) => {
  // ✅ Axios handles the multipart boundary automatically!
  const response = await api.put(`/categories/${id}`, formData);
  return response.data;
};

// Delete category
export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
