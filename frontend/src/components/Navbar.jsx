import React, { useEffect, useState } from "react";
import profile from "../assets/profile.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUserFriends, FaBell, FaSearch } from "react-icons/fa";
import mainLogo from "../assets/mainLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { useUserLogoutMutation } from "../features/authentication/authApi";
import toast from "react-hot-toast";
import { setUser } from "../features/user/userSlice";
import Notification from "./nav-component/Notification";
import SearchBar from "./nav-component/search/SearchBar";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { Search } from "lucide-react";

export default function Navbar() {
  const [userLogout] = useUserLogoutMutation();
  const { user } = useSelector((state) => state.userSlice);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome className="text-2xl" />,
      activeIcon: <FaHome className="text-2xl text-orange-600" />,
    },
    {
      name: "Friends",
      path: "/friends",
      icon: <FaUserFriends className="text-2xl" />,
      activeIcon: <FaUserFriends className="text-2xl text-orange-600" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
      dispatch(setUser(null));
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to logout. Please try again."
      );
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 bg-white shadow-sm   ${
          isScrolled ? "py-2" : "py-3"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex  justify-between items-center ">
          {/* Logo */}
          <Link to="/" className="flex items-center  pr-5 w-1/3">
            <img src={mainLogo} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Search Bar */}

          <div className="w-1/2 pr-5">
            <SearchBar autoFocus={false} />
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-1 relative">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center p-3 mx-1 rounded-lg ${
                  location.pathname === link.path
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {location.pathname === link.path ? link.activeIcon : link.icon}
              </Link>
            ))}

            {/* Notification Button (Desktop Only) */}
            <button
              onClick={() => setShowNotification((prev) => !prev)}
              className={`flex items-center p-3 mx-1 rounded-lg ${
                showNotification
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FaBell className="text-2xl" />
            </button>

            {/* Notification Dropdown (Desktop Only) */}
            {showNotification && (
              <div className="absolute top-12 right-0 z-50 md:block hidden">
                <Notification setShowNotification={setShowNotification} />
              </div>
            )}

            {/* Profile */}
            <div className="flex items-center space-x-2 ml-5 relative group">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white hover:shadow-lg transition duration-300 cursor-pointer">
                <img
                  onClick={() => navigate(`/profile/${user?._id}`)}
                  src={user?.profilePic?.url || profile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="hidden md:block text-gray-800 font-semibold">
                {user?.username || "Guest"}
              </span>

              <div className="absolute top-10 left-0 flex flex-col justify-center bg-white shadow-md p-2 rounded-md opacity-0 group-hover:opacity-100 transition duration-200 z-30">
                <Link
                  to={`/profile/${user?._id}`}
                  className="hover:text-orange-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-700 text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showSearchBar && (
        <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 pt-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="w-6"></div>
            <h2 className="text-xl font-semibold text-gray-800">SearchBar</h2>
            <button
              onClick={() => {
                setShowSearchBar(false);
              }}
              className="text-red-600 text-lg"
            >
              Cancel
            </button>
          </div>
          <SearchBar autoFocus={true} setShowSearchBar={setShowSearchBar} />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center py-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center p-2 ${
                location.pathname === link.path
                  ? "text-orange-600"
                  : "text-gray-600"
              }`}
            >
              {location.pathname === link.path ? link.activeIcon : link.icon}
              <span className="text-xs mt-1">{link.name}</span>
            </Link>
          ))}

          {/* Mobile Search Bar */}
          <button
            onClick={() => setShowSearchBar(true)}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <FaSearch className="text-xl" />
            <span className="text-xs mt-1">Search</span>
          </button>

          {/* Notification Icon (Mobile Only) */}
          <button
            onClick={() => setShowNotification((prev) => !prev)}
            className={`flex flex-col items-center p-2 text-gray-600 ${
              showNotification
                ? "text-orange-600 "
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaBell className="text-xl" />
            <span className="text-xs mt-1">Notifications</span>
          </button>

          {/* Profile (Mobile) */}
          <Menu placement="bottom-end">
            <MenuHandler>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white hover:shadow-lg transition duration-300 cursor-pointer">
                <img
                  src={user?.profilePic?.url || profile}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </MenuHandler>
            <MenuList className="p-2">
              <MenuItem onClick={() => navigate(`/profile/${user?._id}`)}>
                <Typography variant="small" className="text-gray-800">
                  Profile
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography variant="small" className="text-red-500">
                  Logout
                </Typography>
              </MenuItem>
            </MenuList>
          </Menu>
          <span className="hidden md:block text-gray-800 font-semibold ml-2">
            {user?.username || "Guest"}
          </span>
        </div>
      </nav>

      {/* Notification Dropdown (Mobile Only) */}
      {showNotification && (
        <div className="md:hidden fixed bottom-16 right-[5%] z-50">
          <Notification setShowNotification={setShowNotification} />
        </div>
      )}
    </>
  );
}
