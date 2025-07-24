import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/Context";
import baseUrl from "../utils/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setUserData, setIsLoggedIn } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${baseUrl}/auth/logout`);
      console.log(data);
      if (data.status.toLowerCase() === "success") {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const verifyAccount = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${baseUrl}/auth/send-verify-otp`);
      if (data.status.toLowerCase() === "success") {
        navigate("/email-verify");
        toast.success(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-30">
      <img
        src={assets.logo}
        alt="App Logo"
        onClick={() => navigate("/")}
        className="w-28 sm:w-32 cursor-pointer"
      />

      {userData?.name ? (
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-9 h-9 cursor-pointer rounded-full flex items-center justify-center bg-neutral-800 text-white text-sm font-semibold select-none shadow-sm"
          >
            {userData.name[0]?.toUpperCase() || "?"}
          </div>

          {dropdownOpen && (
            <div className="absolute top-12 right-0 flex flex-col bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-48 py-2 transition-all">
              <ul className="text-sm">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {
                    verifyAccount();
                    setDropdownOpen(false);
                  }}
                >
                  {userData.isAccountVerified
                    ? "✅ Verified Account"
                    : "🔐 Verify Account"}
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors border-t border-gray-200"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                >
                  🚪 Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 transition-colors text-gray-800 hover:bg-gray-100 shadow-sm"
        >
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
