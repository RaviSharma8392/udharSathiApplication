import { ChevronRight } from "lucide-react";

const BusinessCategoryInput = ({ profile, setShowBusinessPopup }) => {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-medium tracking-wide text-gray-500 uppercase ml-1">
        Business Category
      </label>
      <button
        onClick={() => setShowBusinessPopup(true)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <span className="flex items-center gap-3">
          <span className="font-medium text-gray-800">{profile.category}</span>
        </span>
        <ChevronRight className="text-gray-400" size={18} />
      </button>
    </div>
  );
};

export default BusinessCategoryInput;
