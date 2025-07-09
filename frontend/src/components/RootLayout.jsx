import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function RootLayout() {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup", "/onboard"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      {!shouldHideNavbar && <Navbar />}

      <main className={`w-full ${!shouldHideNavbar ? "md:mt-20 sm:p-5" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
