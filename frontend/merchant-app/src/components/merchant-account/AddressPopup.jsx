import React, { useState } from "react";

export const AddressPopup = ({ open, onClose, initialAddress, onSave }) => {
  const [building, setBuilding] = useState(initialAddress.building || "");
  const [locality, setLocality] = useState(initialAddress.locality || "");
  const [city, setCity] = useState(initialAddress.city || "");
  const [pincode, setPincode] = useState(initialAddress.pincode || "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Business Address</h2>
          <button className="text-gray-500 text-xl" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Address Preview */}
        <div className="mb-4 p-3 rounded-lg bg-gray-100">
          <p className="text-sm font-bold text-gray-900">
            {initialAddress.full}
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          {/* Building / Flat */}
          <div>
            <label className="text-[11px] text-gray-500 uppercase">
              Building / Flat
            </label>
            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 text-sm outline-none"
            />
          </div>

          {/* Locality / City */}
          <div>
            <label className="text-[11px] text-gray-500 uppercase">
              Locality / City
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 text-sm outline-none mb-1"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 text-sm outline-none"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="text-[11px] text-gray-500 uppercase">
              Pincode
            </label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 text-sm outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => onSave({ building, locality, city, pincode })}
          className="mt-5 w-full py-3 bg-blue-600 text-white rounded-xl font-medium">
          Save
        </button>
      </div>
    </div>
  );
};
