import React, { useState, useEffect } from "react";
import { useSearchUsersQuery } from "../../../features/user/userApi";
import { Link } from "react-router-dom";
import profile from "../../../assets/profile.png";
import { Search } from "lucide-react";

export default function SearchBar({ setShowSearchBar, autoFocus }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const { data: searchResults } = useSearchUsersQuery(debouncedTerm, {
    skip: debouncedTerm.trim().length === 0,
  });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          autoFocus={autoFocus}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800 shadow-sm transition duration-150"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>

      {/* Dropdown */}
      {searchTerm && searchResults?.users?.length > 0 && (
        <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto mt-1">
          {searchResults.users.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              onClick={() => {
                setSearchTerm("");
                setShowSearchBar(false);
              }}
              className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 transition"
            >
              <img
                src={user?.profilePic?.url || profile}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <span className="text-sm font-medium text-gray-700">
                {user.username}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
