import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
} from "@heroicons/react/24/outline";

const CustomerCard = ({
  customer,
  isSelected,
  onSelect,
  onAddUdhar,
  onAddPayment,
}) => {
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    return (
      (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase()
    );
  };

  return (
    <div
      onClick={() => onSelect(customer)}
      className={`flex items-center justify-between p-3 mb-3 rounded-xl cursor-pointer border transition
        ${"bg-white border-gray-100 hover:shadow-sm"}
      `}>
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2F4CD1] text-white flex items-center justify-center font-semibold">
          {getInitials(customer.name)}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {customer.name}
          </p>
          <p className="text-xs text-gray-500">{customer.phone}</p>
        </div>
      </div>

      {/* Right Buttons */}
      <div className="flex gap-3">
        {/* Add Payment */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddPayment(customer);
          }}
          className="flex flex-col items-center gap-0.5">
          <div className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition">
            <ArrowDownLeftIcon className="w-4 h-4 text-green-600" />
          </div>
          <span className="text-[10px] text-green-700 font-medium">
            Payment
          </span>
        </button>

        {/* Add Udhar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddUdhar(customer);
          }}
          className="flex flex-col items-center gap-0.5">
          <div className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition">
            <ArrowUpRightIcon className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-[10px] text-red-700 font-medium">Udhar</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;
