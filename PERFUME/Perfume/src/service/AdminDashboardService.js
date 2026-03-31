import api from "./api"; 

export async function GetAdminDashboardStats() {
  try {
    const response = await api.get("/Order/admin/dashboard?type=all");

    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalRevenue: 0,
      totalProductsPurchased: 0,
      deliveredOrdersCount: 0,
    };
  }
}
