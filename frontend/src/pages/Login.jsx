import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import baseUrl from "../utils/BaseUrl";
import { UserContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const { setIsLoggedIn, getUserData, isLoggedIn } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(`${baseUrl}/auth/signup`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (data.status.toLowerCase() === "success") {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${baseUrl}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        if (data.status.toLowerCase() === "success") {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#f4f4f5]">
      {/* Hero Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-light text-gray-800 tracking-tight">
          {state === "Sign Up" ? "Join the experience" : "Welcome back"}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {state === "Sign Up"
            ? "Effortless, elegant authentication."
            : "Login to continue your journey."}
        </p>
      </div>

      {/* Logo */}
      <img
        src={assets.logo}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 w-24 sm:w-28 object-contain cursor-pointer"
        alt="logo"
      />

      {/* Form Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-10 border border-[#e5e7eb]">
        <h2 className="text-xl font-light text-gray-900 text-center mb-1">
          {state === "Sign Up" ? "Create an account" : "Sign in"}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          {state === "Sign Up"
            ? "Start your journey with us."
            : "Welcome back. Please login."}
        </p>

        <form className="space-y-6" onSubmit={submitHandler}>
          {state === "Sign Up" && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={changeHandler}
              placeholder="Full Name"
              className="w-full bg-[#f9fafb] rounded-xl px-5 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Email address"
            className="w-full bg-[#f9fafb] rounded-xl px-5 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          />

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              placeholder="Password"
              className="w-full bg-[#f9fafb] rounded-xl px-5 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            />
            {state === "Login" && (
              <div className="text-right mt-2">
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition"
                  onClick={() => navigate("/reset-password")}
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white py-3.5 rounded-xl text-sm tracking-tight hover:bg-neutral-800 transition disabled:opacity-60"
          >
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {state === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}
            <button
              onClick={() =>
                setState(state === "Sign Up" ? "Login" : "Sign Up")
              }
              className="ml-2 text-neutral-800 hover:underline hover:opacity-80 transition"
            >
              {state === "Sign Up" ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
