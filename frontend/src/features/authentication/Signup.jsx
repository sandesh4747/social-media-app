import React, { useState } from "react";
import { Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { data, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserSignupMutation } from "./authApi";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../user/userSlice";
import logo from "../../assets/mainLogo1.png";

export default function Signup() {
  const [userSignup, { isLoading }] = useUserSignupMutation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await userSignup({ username, email, password }).unwrap();

      dispatch(setUser(response?.user));
      toast.success("Signup successful");
      await new Promise((resolve) => setTimeout(resolve, 100));
      navigate("/onboard");
    } catch (error) {
      toast.error(error.data?.message || "Signup failed");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 20 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-10rem)]   flex items-center justify-center px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <div className="flex justify-center mb-6">
          <img className="w-auto h-12 " src={logo} alt="Logo" />
        </div>

        <h2 className=" text-center text-2xl font-semibold text-[#1e293b] mb-1">
          Create your account
        </h2>
        <p className="text-sm text-center mb-4 text-gray-500">
          Welcome! Please signup to continue
        </p>

        <div className="relative mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <User className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#1e293b]"
            placeholder="Username"
          />
        </div>

        <div className="relative mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#1e293b]"
            placeholder="Email address"
          />
        </div>

        <div className="relative mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#1e293b]"
            placeholder="Password"
          />
        </div>

        <div className="relative mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#1e293b]"
            placeholder="Confirm Password"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg shadow transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
              Sign up
            </>
          )}
        </button>

        <p className="mt-4 text-center text-sm text-[#64748b]">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-orange-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
