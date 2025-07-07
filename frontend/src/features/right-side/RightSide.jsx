import React from "react";
import BirthdaysEvents from "./BirthdaysEvents";
import SponsoredAds from "./SponsoredAds";
import OnlineFriends from "./OnlineFriends";
import TrendingNews from "./TrendingNews";
import Shortcuts from "./Shortcuts";

export default function RightSide() {
  return (
    <div className="space-y-4  ">
      {/* className="space-y-4 sticky top-4" */}
      <BirthdaysEvents />
      <SponsoredAds />
      <OnlineFriends />
      <TrendingNews />
      <Shortcuts />
    </div>
  );
}
