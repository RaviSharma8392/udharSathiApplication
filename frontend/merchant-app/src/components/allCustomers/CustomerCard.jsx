import React from "react";
import { formatDistanceToNow } from "date-fns";

export default function CustomerCard({ customer, onClick, onReminder }) {
  const { name, createdAt, balance, lastTransactionDate } = customer;

  // ✅ Normalize balance safely
  const numericBalance = Number(balance) || 0;

  // ----------------- DYNAMIC STATUS -----------------
  const getCustomerStatus = () => {
    let statusText = "";
    let statusColor = "";

    if (numericBalance > 0) {
      statusText = "Pending"; // customer owes you
      statusColor = "text-green-700";
    } else if (numericBalance < 0) {
      statusText = "Advanced"; // customer has credit
      statusColor = "text-red-700";
    } else {
      statusText = "Cleared"; // fully paid
      statusColor = "text-gray-500";
    }

    // Check overdue: if last transaction >30 days ago and balance >0
    if (
      numericBalance > 0 &&
      lastTransactionDate &&
      (new Date() - new Date(lastTransactionDate)) / (1000 * 60 * 60 * 24) > 30
    ) {
      statusText += " • Overdue";
      statusColor = "text-orange-500";
    }

    return { statusText, statusColor };
  };

  const { statusText, statusColor } = getCustomerStatus();

  // ----------------- BALANCE COLOR -----------------
  const balanceClass =
    numericBalance > 0
      ? "bg-red-100 text-red-700"
      : numericBalance < 0
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-500";

  return (
    <div
      onClick={onClick}
      className="
        bg-white px-4 py-3 mb-2 rounded-xl
        shadow-sm active:scale-[0.98]
        transition cursor-pointer
        flex items-center justify-between
      ">
      {/* LEFT */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>

        {createdAt && (
          <p className="text-[11px] text-gray-500 mt-0.5">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
        {/* Balance */}
        <div
          className={`px-2.5 py-0.5 rounded-md text-sm font-semibold ${balanceClass}`}>
          {numericBalance > 0
            ? `₹ ${numericBalance.toFixed(2)}`
            : numericBalance < 0
            ? `₹ ${Math.abs(numericBalance).toFixed(2)}`
            : `₹ 0.00`}
        </div>

        {/* Status */}
        <p className={`text-[10px] font-medium ${statusColor}`}>{statusText}</p>

        {/* Reminder */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReminder(customer);
          }}
          className="
            text-[10px] font-medium
            text-yellow-700
            opacity-80 hover:opacity-100
            active:scale-95
          ">
          remind
        </button>
      </div>
    </div>
  );
}
