interface PromptFormProps {
  query: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function PromptForm({ query, loading, onChange, onSearch }: PromptFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        className="border border-gray-300 bg-white p-2 mt-5 w-80 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your travel vibe..."
        disabled={loading}
      />
      <button
        onClick={onSearch}
        disabled={loading || !query.trim()}
        className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-md px-6 py-2 mt-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
