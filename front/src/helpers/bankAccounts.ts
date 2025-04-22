import { axiosInstance } from "./api/apiCore";

export const getBankAccounts = async () => {
  try {
    const response = await axiosInstance.get("/api/bank-accounts");
    return response.data;
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    throw error;
  }
};

export const createBankAccount = async (data: any) => {
  try {
    const response = await axiosInstance.post("/api/bank-accounts", data);
    return response.data;
  } catch (error) {
    console.error("Error creating bank account:", error);
    throw error;
  }
}

export const updateBankAccount = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(`/api/bank-accounts/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating bank account:", error);
    throw error;
  }
}

export const deleteBankAccount = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/bank-accounts/${id}`);
    return response.status
  } catch (error) {
    console.error("Error deleting bank account:", error);
    throw error;
  }
}