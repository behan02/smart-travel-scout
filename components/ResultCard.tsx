import { InventoryItem } from "@/data/inventory";

interface ResultCardProps {
  item: InventoryItem & { reason: string };
}

export default function ResultCard({ item }: ResultCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 mb-3">
      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
      <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>
      <p className="text-indigo-600 font-bold mt-2">
        ${item.price}{" "}
        <span className="text-gray-400 font-normal text-xs">/ person</span>
      </p>
      <div className="flex flex-wrap gap-1 mt-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-full px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-600 mt-3 border-t pt-3">{item.reason}</p>
    </div>
  );
}
