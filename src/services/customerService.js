import api from "../api/api";

export const getCustomerDashboard = async () => {
  const response = await api.get("/customer/dashboard");
  return response.data;
};
