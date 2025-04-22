import jwtDecode from "jwt-decode";
import axios from "axios";

import config from "../../config";

// content type
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = config.API_URL;


export const axiosInstance = axios.create({
  baseURL: config.API_URL, // or omit for relative URL calls if using proxy
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const fullUrl = new URL(config.url ?? "", config.baseURL ?? "").toString();
  // console.log("Request:", config.method?.toUpperCase(), fullUrl, config.data);
  return config;
});

// intercepting to capture errors
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     let message;

//     if (error && error.response && error.response.status === 404) {
//       // window.location.href = '/not-found';
//     } else if (error && error.response && error.response.status === 403) {
//       window.location.href = "/access-denied";
//     } else {
//       switch (error.response.status) {
//         case 401:
//           message = "Invalid credentials";
//           break;
//         case 403:
//           message = "Access Forbidden";
//           break;
//         case 404:
//           message = "Sorry! the data you are looking for could not be found";
//           break;
//         default: {
//           message =
//             error.response && error.response.data
//               ? error.response.data["message"]
//               : error.message || error;
//         }
//       }
//       return Promise.reject(message);
//     }
//   }
// );

const AUTH_SESSION_KEY = "prometeo_user"; // Key for storing user session

// Set the Authorization header for all requests
const setAuthorization = (token: string | null) => {
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

// Get the user from session storage
const getUserFromSession = () => {
  const user = sessionStorage.getItem(AUTH_SESSION_KEY);
  return user ? JSON.parse(user) : null;
};

class APICore {
  /**
   * Logs in the user by storing the token and user data in session storage
   */
  login = (token: string, user: any) => {
    // Store token and user in session storage
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ token, ...user }));
    setAuthorization(token); // Set the Authorization header
  };

  /**
   * Logs out the user by clearing session storage and Authorization header
   */
  logout = () => {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setAuthorization(null);
  };

  /**
   * Checks if the user is authenticated by validating the JWT token
   */
  isUserAuthenticated = () => {
    const user = getUserFromSession();
    if (!user || !user.access_token
    ) return false;

    try {
      const decoded: any = jwtDecode(user.access_token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      if (decoded.exp < currentTime) {
        console.warn("Access token expired");
        this.logout(); // Clear session if token is expired
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token", error);
      this.logout();
      return false;
    }
  };

  /**
   * Returns the logged-in user from session storage
   */
  getLoggedInUser = () => {
    return getUserFromSession();
  };

  /**
   * Sets the logged-in user in session storage
   */
  setLoggedInUser = (user: any) => {
    const currentSession = getUserFromSession();
    if (currentSession) {
      sessionStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ ...currentSession, ...user })
      );
    }
  };

  /**
   * Fetches data from the given URL with optional query parameters
   */
  get = (url: string, params: any) => {
    const queryString = params
      ? Object.keys(params)
          .map((key) => `${key}=${params[key]}`)
          .join("&")
      : "";
    return axiosInstance.get(`${url}?${queryString}`);
  };

  /**
   * Posts data to the given URL
   */
  post = (url: string, data: any) => {
    return axiosInstance.post(url, data);
  };



  getFile = (url: string, params: any) => {
    let response;
    if (params) {
      const queryString = params
        ? Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&")
        : "";
      response = axiosInstance.get(`${url}?${queryString}`, { responseType: "blob" });
    } else {
      response = axiosInstance.get(`${url}`, { responseType: "blob" });
    }
    return response;
  };

  getMultiple = (urls: string, params: any) => {
    const reqs = [];
    let queryString = "";
    if (params) {
      queryString = params
        ? Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&")
        : "";
    }

    for (const url of urls) {
      reqs.push(axiosInstance.get(`${url}?${queryString}`));
    }
    return axios.all(reqs);
  };

  /**
   * post given data to url
   */
  create = (url: string, data: any) => {
    return axiosInstance.post(url, data).then((res) => {
      // console.log(res, 'res');
      return res;
    });
  };

  /**
   * Updates patch data
   */
  updatePatch = (url: string, data: any) => {
    return axiosInstance.patch(url, data);
  };

  /**
   * Updates data
   */
  update = (url: string, data: any) => {
    return axiosInstance.put(url, data);
  };

  /**
   * Deletes data
   */
  delete = (url: string) => {
    return axiosInstance.delete(url);
  };

  /**
   * post given data to url with file
   */
  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axiosInstance.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axiosInstance.post(url, formData, config);
  };

  /**
   * post given data to url with file
   */
  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }

    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.patch(url, formData, config);
  };

  setUserInSession = (modifiedUser: any) => {
    const userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (userInfo) {
      const { token, user } = JSON.parse(userInfo);
      this.setLoggedInUser({ token, ...user, ...modifiedUser });
    }
  };
}


export { APICore, setAuthorization };
