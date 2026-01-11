import { useState } from "react";

export default function BusinessTypePopup({ onClose, onSave }) {
  const [selected, setSelected] = useState(null);

  const categories = [
    { id: "kirana", label: "Kirana Store", color: "bg-blue-500" },
    { id: "medical", label: "Medical Store", color: "bg-green-500" },
    { id: "restaurant", label: "Restaurant", color: "bg-orange-500" },
    { id: "hardware", label: "Hardware", color: "bg-purple-500" },
  ];

  const handleSave = () => {
    if (!selected) return;
    onSave({ label: selected });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end">
      <div className="bg-white w-full rounded-t-3xl p-5 animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Business Type</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.label)}
              className={`p-4 rounded-xl border text-left transition
                ${
                  selected === cat.label
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}>
              <div
                className={`w-10 h-10 rounded-full text-white flex items-center justify-center ${cat.color}`}>
                🏪
              </div>
              <p className="mt-2 text-sm font-medium">{cat.label}</p>
            </button>
          ))}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!selected}
          className={`mt-6 w-full py-3 rounded-xl font-semibold text-white
            ${selected ? "bg-blue-600" : "bg-gray-400"}`}>
          Save
        </button>
      </div>
    </div>
  );
}
