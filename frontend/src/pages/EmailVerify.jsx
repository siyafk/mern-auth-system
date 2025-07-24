import React, { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../utils/BaseUrl";
import { UserContext } from "../context/Context";
import { toast } from "react-toastify";

const OtpVerification = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { getUserData, isLoggedIn, userData } = useContext(UserContext);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      const otpArray = inputRefs.current.map((item, index) => {
        return item.value;
      });
      const otp = otpArray.join("");

      const { data } = await axios.post(`${baseUrl}/auth/verify-email`, {
        otp,
      });

      if (data.status.toLowerCase() === "success") {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#f4f4f5]">
      {/* Logo */}
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 w-24 sm:w-28 object-contain cursor-pointer"
        alt="logo"
      />

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light text-gray-800 tracking-tight">
          OTP Verification
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Enter the 6-digit code sent to your email.
        </p>
      </div>

      {/* OTP Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-10 border border-[#e5e7eb]">
        <form onSubmit={submitHandler}>
          <div
            className="flex items-center justify-between gap-2 sm:gap-4 mb-8"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => {
                return (
                  <input
                    key={index}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(e) => (inputRefs.current[index] = e)}
                    type="text"
                    maxLength="1"
                    placeholder="•"
                    className="w-12 sm:w-14 h-14 sm:h-16 text-center text-xl sm:text-2xl rounded-xl bg-[#f9fafb] text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
                  />
                );
              })}
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white py-3.5 rounded-xl text-sm tracking-tight hover:bg-neutral-800 transition"
          >
            Verify Code
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?
            <span className="ml-2 text-neutral-800 hover:underline hover:opacity-80 cursor-pointer transition">
              Resend
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
