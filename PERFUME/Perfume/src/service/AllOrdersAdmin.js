import api from "./api";

export const getAllOrders = async () => {
  try {
    const res = await api.get("/Order/admin/all");
    return res.data;
  } catch (err) {
    console.error("Error fetching all orders:", err);
    throw err;
  }
};
