import axios from "axios";

// ✅ Set credentials globally for all axios requests
axios.defaults.withCredentials = true;

import { createContext, useEffect, useState } from "react";
import baseUrl from "../utils/BaseUrl";
import { toast } from "react-toastify";

// Create the context
const UserContext = createContext();

// Create the context provider component
const Context = ({ children }) => {
  axios.defaults.withCredentials = true;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/auth/is-auth`, {
        withCredentials: true,
      });
      console.log(data);

      if (data.status === "Success") {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/user/data`, {
        withCredentials: true,
      });

      if (data.status.toLowerCase() === "success") {
        setUserData(data.data.user);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

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
