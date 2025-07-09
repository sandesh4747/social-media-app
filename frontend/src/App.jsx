import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import RootLayout from "./components/RootLayout";
import HomePage from "./pages/home/HomePage";
import Login from "./features/authentication/Login";
import Signup from "./features/authentication/Signup";
import OnboardingForm from "./features/authentication/OnboardingForm";
import { useDispatch, useSelector } from "react-redux";
import { useGetMeQuery } from "./features/user/userApi";
import { setUser } from "./features/user/userSlice";
import LoadingSpinner from "./components/LoadingSpinner";
import People from "./components/nav-component/People";
import Notification from "./components/nav-component/Notification";

import OtherUserProfile from "./components/nav-component/profile/OtherUserProfile";
import NotFoundPage from "./pages/NotFound";

export default function App() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userSlice);
  // console.log(user);

  const { data, isLoading, refetch } = useGetMeQuery();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data?.user));
    }
  }, [data, dispatch]);

  if (isLoading) return <LoadingSpinner />;
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: user?.isOnboarded ? (
            <HomePage />
          ) : (
            <Navigate to="/onboard" />
          ),
        },

        {
          path: "/login",
          element: user ? <Navigate to="/" /> : <Login />,
        },
        {
          path: "/signup",
          element: user ? <Navigate to="/onboard" /> : <Signup />,
        },
        {
          path: "/friends",
          element: <People />,
        },
        {
          path: "/notification",
          element: <Notification />,
        },

        {
          path: "/profile/:id",
          element: <OtherUserProfile />,
        },

        {
          path: "/onboard",
          element: user ? (
            user.isOnboarded ? (
              <Navigate to="/" />
            ) : (
              <OnboardingForm />
            )
          ) : (
            <Navigate to="/login" />
          ),
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}
