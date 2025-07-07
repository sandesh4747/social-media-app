// src/components/PrivateRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.userSlice);
  return user ? children : <Navigate to="/login" />;
}
