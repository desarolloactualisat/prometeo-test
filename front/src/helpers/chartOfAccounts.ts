import { axiosInstance } from "./api/apiCore";

export const getChartOfAccounts = async () => {
  try {
    const response = await axiosInstance.get("/api/chart-accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching chart accounts:", error);
    throw error;
  }
};