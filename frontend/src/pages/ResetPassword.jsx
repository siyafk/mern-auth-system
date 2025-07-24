import React, { useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../utils/BaseUrl";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const inputRefs = useRef([]);

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

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${baseUrl}/auth/send-reset-otp`, {
        email,
      });

      if (data.status.toLowerCase() === "success") {
        setIsEmailSent(true);
        toast.success(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitOtp = async (e) => {
    try {
      e.preventDefault();
      const otp = inputRefs.current.map((e) => e.value);
      setOtp(otp.join(""));
      setIsOtpSubmitted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmitPassword = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${baseUrl}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (data.status.toLowerCase() === "success") {
        navigate(-1);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-[#f4f4f5] flex items-center justify-center gap-12">
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 w-24 sm:w-28 object-contain cursor-pointer"
        alt="Logo"
      />
      {!isEmailSent && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 border border-[#e5e7eb]">
          <h2 className="text-xl font-light text-gray-900 text-center mb-1">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Enter your email to receive an OTP.
          </p>

          <form onSubmit={onSubmitEmail} className="space-y-6">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full bg-[#f9fafb] rounded-xl px-5 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white py-3.5 rounded-xl text-sm tracking-tight hover:bg-neutral-800 transition"
            >
              Send OTP
            </button>
          </form>
        </div>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 border border-[#e5e7eb]">
          <h2 className="text-xl font-light text-gray-900 text-center mb-1">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Enter the 6-digit OTP sent to your email.
          </p>

          <form onSubmit={onSubmitOtp} className="space-y-6">
            <div onPaste={handlePaste}>
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
              Verify OTP
            </button>
          </form>
        </div>
      )}

      {/* OTP Card */}

      {isOtpSubmitted && isEmailSent && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 border border-[#e5e7eb]">
          <h2 className="text-xl font-light text-gray-900 text-center mb-1">
            Set New Password
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Create a new password for your account.
          </p>

          <form onSubmit={onSubmitPassword} className="space-y-6">
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full bg-[#f9fafb] rounded-xl px-5 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white py-3.5 rounded-xl text-sm tracking-tight hover:bg-neutral-800 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      )}
      {/* New Password Card */}
    </div>
  );
};

export default ResetPassword;
