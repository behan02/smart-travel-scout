"use client";

import { useState } from "react";
import { inventory, InventoryItem } from "@/data/inventory";
import PromptForm from "@/components/PromptForm";
import ResultCard from "@/components/ResultCard";

type ResultItem = InventoryItem & { reason: string };

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ userQuery: query }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Search failed. Please try again.");

      const data = await res.json();

      const enriched: ResultItem[] = (data.results ?? []).map((r: { id: number; reason: string }) => ({
        ...(inventory.find((i) => i.id === r.id) as InventoryItem),
        reason: r.reason,
      }));

      setResults(enriched);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="min-h-screen text-center p-10">
      <h1 className="text-3xl font-bold text-gray-800">Smart Travel Scout</h1>
      <p className="text-gray-500 mt-2 text-sm">Describe your ideal trip and we'll find the best match.</p>

      <PromptForm
        query={query}
        loading={loading}
        onChange={setQuery}
        onSearch={handleSearch}
      />

      {loading && <p className="text-sm text-gray-400 mt-6">Finding the best matches...</p>}

      {error && (
        <p className="text-sm text-red-500 mt-6">{error}</p>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <p className="text-sm text-gray-500 mt-6">
          No matches found — try refining your query (e.g. "beach under $100" or "cultural history").
        </p>
      )}

      <div className="max-w-md mx-auto mt-8 text-left">
        {results.map((r) => (
          <ResultCard key={r.id} item={r} />
        ))}
      </div>
    </div>
  );
}