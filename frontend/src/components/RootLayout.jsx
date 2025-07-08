import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function RootLayout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup", "/onboard"];
  const shouldHideNavbar = hideNavbar.includes(window.location.pathname);
  return (
    <div className=" bg-[#f0f2f5] ">
      {!shouldHideNavbar && (
        <div className="pb-20">
          <Navbar />
        </div>
      )}

      <main className={`w-full ${!shouldHideNavbar ? "sm:p-5" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
