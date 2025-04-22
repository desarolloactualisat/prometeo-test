import {axiosInstance} from "../api/apiCore";

// Set your API URL—ensure it's defined in your .env (e.g. VITE_API_URL=http://localhost:8000)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";

// Configure the axiosInstance instance
axiosInstance.defaults.baseURL = API_URL;
axiosInstance.defaults.headers.post["Content-Type"] = "application/json";

/**
 * Logs in the user by calling the backend API, storing user data and token, and
 * setting the Authorization header.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves with the backend response (including access_token and user info).
 */
export const login = async (email: string, password: string): Promise<any> => {
  try {
    // Call the backend login endpoint
    const response = await axiosInstance.post("/api/auth/login/", { email, password });
    console.log(response)
    // Check for expected data
    if (!response.data || !response.data.access_token) {
      throw new Error("Invalid login response");
    }

    // Save data to session storage
    sessionStorage.setItem(
      "prometeo_user",
      JSON.stringify(response.data)
    );

    // Set the Authorization header for subsequent requests
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;

    console.log("Login successful:", response.data); //TODO: remove this line
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.message || error);
    throw error;
  }
};

/**
 * Logs out the user by clearing session storage and Authorization header.
 */
export const logout = (): void => {
  sessionStorage.removeItem("prometeo_user");
  delete axiosInstance.defaults.headers.common["Authorization"];
  console.log("User logged out");
};