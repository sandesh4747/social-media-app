import { ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import { useToogleLikeMutation } from "./postApi";
import { toast } from "react-hot-toast";

export default function ToggleLike({ id, isLikedByUser }) {
  const [toggleLike, { isLoading }] = useToogleLikeMutation(id);
  const [isLiked, setIsLiked] = useState(isLikedByUser);

  const handleToggleLike = async () => {
    const prev = isLiked;
    setIsLiked(!isLiked);
    try {
      await toggleLike(id).unwrap();
    } catch (error) {
      setIsLiked(prev);
      console.error("Failed to toggle like:", error);
      toast.error(error.data?.message || "Failed to toggle like");
    }
  };

  return (
    <div>
      <button
        onClick={handleToggleLike}
        className="rounded-full p-2 transition-colors duration-200 hover:bg-orange-100 flex items-center justify-center"
        aria-label="Like"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isLiked ? "#f97316" : "none"} // actual orange hex color
          stroke={isLiked ? "#f97316" : "#6b7280"} // orange or gray stroke
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={18}
          height={18}
        >
          <path d="M2 21h2v-9H2v9zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32a1 1 0 00-1-1.11l-4.2 4.21V19h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05a.996.996 0 00-.82-1.43z" />
        </svg>
      </button>
    </div>
  );
}
