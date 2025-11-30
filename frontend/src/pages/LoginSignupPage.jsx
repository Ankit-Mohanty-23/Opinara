import React, { useState } from "react";
import axios from "axios";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OpinaraAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.fullname?.trim()) {
      newErrors.fullname = "Fullname is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (!isLogin) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/user/signup`,
            formData
          );
          alert("Signup successful!");
          setIsLogin(true);
        } else {
          console.log("Login url: ", import.meta.env.VITE_API_URL);
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/login`,
            {
              email: formData.email,
              password: formData.password,
            }
          );
          alert("Login successful!");
          localStorage.setItem("token", response.data.token);
          // get user id and navigate to /dashboard/userid
        }
      } catch (err) {
        console.log("Signup/Login Error", err);

        let errorMessage = "An error occurred!";

        if (err.response) {
          const status = err.response.status;
          if (isLogin) {
            switch (status) {
              case 401:
                errorMessage = "Wrong Email or Password!";
                break;
              case 404:
                errorMessage = "User not found!";
                break;
              case 400:
                errorMessage = "Invalid credentials!";
                break;
              case 500:
                errorMessage = "Server error. Please try again later!";
                break;
              default:
                errorMessage = "Login failed. Please try again!";
            }
          } else {
            // Signup error cases
            switch (status) {
              case 409:
                errorMessage = "Email already exists!";
                break;
              case 400:
                errorMessage = "Invalid data. Please check your inputs!";
                break;
              case 422:
                errorMessage = "Validation failed. Please check your inputs!";
                break;
              case 500:
                errorMessage = "Server error. Please try again later!";
                break;
              default:
                errorMessage = "Signup failed. Please try again!";
            }
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your connection!";
        } else {
          errorMessage = err.message || "An unexpected error occurred!";
        }

        alert(
          isLogin
            ? `Login failed: ${errorMessage}`
            : `Signup failed: ${errorMessage}`
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-5 gap-0 bg-white rounded-xl shadow-2xl overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="fixed top-6 left-6 flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition font-medium text-sm z-50"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Left Side - Branding */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#007BFF] via-[#0056D2] to-[#003d99] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#FFC107] rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">
                Opinara<span className="text-[#FFC107]">.</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-3 leading-tight">
              {isLogin ? "Welcome Back!" : "Join Your Community"}
            </h2>

            <p className="text-white/90 text-sm mb-6">
              {isLogin
                ? "Sign in to continue making your locality better."
                : "Create an account and start making a difference today."}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">Report local issues instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">Vote with your community</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">Track real-time progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:col-span-3 p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#212529] mb-1">
              {isLogin ? "Sign In" : "Create Account"}
            </h3>
            <p className="text-gray-600 text-sm">
              {isLogin ? "Enter your credentials" : "Fill in your details"}
            </p>
          </div>

          <div className="space-y-4">
            {/* Name Field - Only for Signup */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#212529] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#007BFF] transition text-sm ${
                      errors.fullname ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.fullname && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.fullname}</span>
                  </div>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#212529] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#007BFF] transition text-sm ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#212529] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 border-2 rounded-lg focus:outline-none focus:border-[#007BFF] transition text-sm ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#007BFF] transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me / Forgot Password - Only for Login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 text-[#007BFF] border-gray-300 rounded"
                  />
                  <span className="text-xs text-gray-600">Remember me</span>
                </label>
                <button className="text-xs text-[#007BFF] hover:text-[#0056D2] font-semibold transition">
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Terms - Only for Signup */}
            {!isLogin && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 mt-0.5 text-[#007BFF] border-gray-300 rounded"
                  required
                />
                <span className="text-xs text-gray-600">
                  I agree to the{" "}
                  <button className="text-[#007BFF] hover:text-[#0056D2] font-semibold">
                    Terms
                  </button>{" "}
                  and{" "}
                  <button className="text-[#007BFF] hover:text-[#0056D2] font-semibold">
                    Privacy Policy
                  </button>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-[#007BFF] to-[#0056D2] hover:shadow-lg text-white py-2.5 rounded-lg font-bold text-sm transition transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid mx-30">
              <button className="flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 rounded-lg hover:border-[#007BFF] hover:bg-[#F8F9FA] transition font-semibold text-[#212529] text-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>

            {/* Toggle Login/Signup */}
            <div className="text-center pt-3">
              <span className="text-gray-600 text-sm">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({
                    fullname: "",
                    email: "",
                    password: "",
                  });
                }}
                className="text-[#007BFF] hover:text-[#0056D2] font-bold transition text-sm"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
