import { PencilIcon } from "@heroicons/react/24/outline";

const BusinessProfileHeader = ({ businessName }) => {
  return (
    <div className="bg-white px-3  pt-2 pb-2 ">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-lg">
            {businessName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>

          {/* Name */}
          <h2 className="font-semibold text-gray-800">{businessName}</h2>
        </div>

        {/* Edit */}
        <button className="flex items-center gap-1 text-blue-600 text-sm font-medium">
          <PencilIcon className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
  );
};

export default BusinessProfileHeader;
