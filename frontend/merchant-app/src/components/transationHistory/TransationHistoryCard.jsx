import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const TransactionCard = ({ tx }) => {
  const isPayment = tx.type === "PAYMENT";

  // Format date as "1 Jan 2024, 10:45 AM"
  const formattedDate = new Date(tx.date).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="bg-white p-4 rounded-xl flex justify-between items-center shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Left: Icon + Customer */}
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center `}>
          {isPayment ? (
            <ArrowDownLeft className="w-6 h-6 text-green-600" />
          ) : (
            <ArrowUpRight className="w-6 h-6 text-red-600" />
          )}
        </div>

        <div>
          <p className="font-medium text-gray-900">
            {tx.customerName || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">{tx.customerPhone || "N/A"}</p>
        </div>
      </div>

      {/* Right: Amount + Date */}
      <div className="text-right">
        <p
          className={`font-semibold text-lg ${
            isPayment ? "text-green-600" : "text-red-500"
          }`}>
          {isPayment ? "+" : "-"} ₹{tx.amount.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400">{formattedDate}</p>
      </div>
    </div>
  );
};
