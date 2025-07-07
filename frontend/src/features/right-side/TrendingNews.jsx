export default function TrendingNews() {
  const trends = [
    { id: 1, topic: "Technology", text: "Next.js just released v15!" },
    { id: 2, topic: "Travel", text: "Top 10 places to visit in 2024" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-2">Trending News</h3>
      <ul className="space-y-3">
        {trends.map((trend) => (
          <li key={trend.id}>
            <p className="text-gray-500 text-sm">{trend.topic}</p>
            <p className="font-medium">{trend.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
