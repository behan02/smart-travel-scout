"use client";

import { useState } from "react";
import { inventory } from "@/data/inventory";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);

    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ userQuery: query }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();

    const enriched = data.results?.map((r: any) => ({
      ...inventory.find(i => i.id === r.id),
      reason: r.reason
    }));

    setResults(enriched || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-center p-10">
      <h1 className="text-3xl font-bold text-gray-800">Smart Travel Scout</h1>

      <div className="flex flex-col items-center justify-center">
          <input
            className="border border-gray-300 bg-white p-2 mt-5 w-100 rounded-md"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your travel vibe..."
          />

        <button onClick={handleSearch} className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold rounded-md px-6 py-2 mt-5 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">Search</button>
      </div>
      

      {loading && <p className="text-sm text-gray-500 mt-4">Thinking...</p>}

      <div className="w-lg max-w-md mx-auto mt-8 text-left">
        {results.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 m-2">
            <h3 className="text-lg font-semibold text-gray-800">{r.title}</h3>
            <p className="text-sm text-gray-500 mt-1">📍 {r.location}</p>
            <p className="text-indigo-600 font-bold mt-2">${r.price} <span className="text-gray-400 font-normal text-xs">/ person</span></p>
            <p className="text-sm text-gray-600 mt-3 border-t pt-3">{r.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}