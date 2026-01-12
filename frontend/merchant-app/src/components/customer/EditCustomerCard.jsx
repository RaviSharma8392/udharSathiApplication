import CustomerAvatar from "./CustomerAvatar";
import { PencilIcon } from "@heroicons/react/24/outline";

function EditCustomerCard({ customer, onClick, onEdit, onReminder }) {
  return (
    <div
      className="flex items-center justify-between bg-white p-4 rounded-xl mb-3 shadow-sm"
      onClick={onClick}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <CustomerAvatar name={customer.name} />

        <div>
          <p className="text-sm font-medium text-gray-800">{customer.name}</p>
          <p className="text-xs text-gray-500">{customer.phone}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(customer);
          }}
          className="p-2 rounded-lg hover:bg-gray-100">
          <PencilIcon className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

export default EditCustomerCard;
