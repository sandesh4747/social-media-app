export default function SponsoredAds() {
  const ads = [
    {
      id: 1,
      text: "🚀 Learn MERN Stack - 50% Off!",
      link: "https://www.freecodecamp.org/news/mern-stack-roadmap-what-you-need-to-know-to-build-full-stack-apps/",
    },
    {
      id: 2,
      text: "📱 Upgrade to the new iPhone!",
      link: "https://www.apple.com/shop/iphone/iphone-upgrade-program",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-2">Sponsored</h3>
      <ul className="space-y-3">
        {ads.map((ad) => (
          <li key={ad.id}>
            <a href={ad.link} className="text-orange-500 hover:underline">
              {ad.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
