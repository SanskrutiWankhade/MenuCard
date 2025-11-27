import React, { useEffect, useState } from "react";
import CategoryPage from "./CategoryPage";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch("http://127.0.0.1:8000/categories")
      .then((r) => r.json())
      .then((data) => {
        if (isMounted) setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        if (isMounted) setCategories([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (selected)
    return <CategoryPage category={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="w-full flex flex-col items-center">

      {/* ⭐ TOP RESTAURANT BANNER ⭐ */}
      <div className="w-full h-[300px] sm:h-[380px] bg-[url('https://cdn.magicdecor.in/com/2023/09/29161805/Wallpaper-for-Restaurant-Wall-Brick-Wall-mockup.jpg')] bg-cover bg-center rounded-lg shadow-lg flex items-center justify-center mb-10">
        <div className="bg-black/50 p-6 rounded-xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
            Welcome to FoodX Restaurant
          </h1>
          <p className="text-gray-200 mt-3 text-lg">
            Fresh • Fast • Delicious – Choose your favourite category below
          </p>
        </div>
      </div>

      {/* ⭐ CATEGORY SECTION BELOW IMAGE ⭐ */}
      <div className="w-full bg-white/90 rounded-lg p-6 shadow-xl max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Food Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="relative p-4 rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl bg-white"
            >
              <div className="h-40 w-full overflow-hidden rounded-md mb-3">
                <img
                  src={
                    c.name.toLowerCase().includes("juice")
                      ? "https://img.freepik.com/premium-photo/lemon-orange-strawberry-juice-black_34435-2632.jpg?semt=ais_hybrid&w=740&q=80"
                      : c.name.toLowerCase().includes("pizza")
                      ? "https://media.istockphoto.com/id/1442417585/photo/person-getting-a-piece-of-cheesy-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=k60TjxKIOIxJpd4F4yLMVjsniB4W1BpEV4Mi_nb4uJU="
                      : "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent pointer-events-none rounded-xl" />

              <div className="relative z-10 text-left">
                <h2 className="text-2xl font-bold text-gray-900">{c.name}</h2>
                <p className="mt-1 text-sm text-gray-700">View and place orders</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
