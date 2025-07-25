import axios from "axios";
import { createContext, useEffect, useState } from "react";
import baseUrl from "../utils/BaseUrl";
import { toast } from "react-toastify";

// ✅ Set credentials globally
axios.defaults.withCredentials = true;

// Create the context
const UserContext = createContext();

// Create the provider component
const Context = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Get auth state first
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/auth/is-auth`);
      console.log("Auth Response:", data);

      if (data.status === "Success") {
        setIsLoggedIn(true);
        getUserData(); // ✅ Only call this if authenticated
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (err) {
      console.log("Not Authenticated:", err.response?.status);
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  // ✅ Fetch user data (protected route)
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/user/data`);
      console.log("User Data:", data);

      if (data.status.toLowerCase() === "success") {
        setUserData(data.data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("Unauthorized access to user data");
        setIsLoggedIn(false);
        setUserData(null);
      } else {
        toast.error("Something went wrong while fetching user data");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getAuthState(); // 🔄 Run once on initial mount
  }, []);

  // Context value for consumers
  const value = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default Context;
export { UserContext };
