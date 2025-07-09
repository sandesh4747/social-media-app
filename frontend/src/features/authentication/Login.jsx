import React, { useState } from "react";
import { Loader, Lock, LogIn, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserLoginMutation } from "./authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../user/userSlice";
import logo from "../../assets/mainLogo1.png";

export default function Login() {
  const navigate = useNavigate();
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userLogin({ email, password }).unwrap();

      dispatch(setUser(response?.user));
      toast.success("Login successful");
      // navigate("/");
    } catch (error) {
      toast.error(error.data?.message || "Login failed");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 20 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-10rem)] flex items-center justify-center px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex justify-center mb-6">
          <img className="w-auto h-12 " src={logo} alt="Logo" />
        </div>

        <h2 className="text-center text-2xl font-semibold text-[#1e293b] mb-1">
          Login
        </h2>
        <p className="text-sm text-center mb-4 text-gray-500">
          Welcome back! Please sign in to continue
        </p>

        <div className="relative mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="w-5 h-5 text-gray-400" />
          </span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#1e293b]"
            placeholder="Email address"
          />
        </div>

        <div className="relative mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="w-5 h-5 text-gray-400" />
          </span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#1e293b]"
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg shadow transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin "
                aira-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
              Login
            </>
          )}
        </button>

        <p className="mt-4 text-center text-sm text-[#64748b]">
          Don't have an account{" "}
          <Link
            to={"/signup"}
            className="text-orange-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
