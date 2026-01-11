import { ChevronRight } from "lucide-react";

export const MerchantAddressField = ({ address, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-3 py-3 rounded-xl border border-gray-300 bg-white cursor-pointer">
      <p className="text-sm text-gray-900 truncate">
        {address || "Enter business address"}
      </p>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  );
};
