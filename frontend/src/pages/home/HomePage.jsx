import React from "react";
import ProfilePage from "../../features/profile/ProfilePage";
import PostPage from "../../features/posts/PostPage";
import RightSide from "../../features/right-side/RightSide";

export default function HomePage() {
  return (
    <div className="h-[calc(100vh-4rem)] grid md:grid-cols-[2fr_1fr] xl:grid-cols-[1fr_2fr_1fr] gap-4 w-full 2xl:max-w-7xl 2xl:mx-auto  sm:grid-cols-[2fr_1fr] ">
      <div className="h-full hidden xl:block  overflow-y-auto  ">
        <ProfilePage />
      </div>
      <div className="h-full overflow-y-auto">
        <PostPage />
      </div>
      <div className="h-full hidden sm:block  overflow-y-auto">
        <RightSide />
      </div>
    </div>
  );
}
