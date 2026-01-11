import React from "react";

// helper to format large numbers
const formatAmount = (amount) => {
  const num = Number(amount);

  // invalid numbers
  if (!Number.isFinite(num) || num <= 0) return "0";

  // remove decimals, count digits only
  const digitCount = Math.floor(Math.abs(num)).toString().length;

  // ❌ more than 10 digits → don't show
  if (digitCount > 10) return "—";

  // normal Indian formatting
  return num.toLocaleString("en-IN");
};

const DashboardCard = ({ totalReceived = 0, totalUdhar = 0 }) => {
  return (
    <div className="bg-[#EEF2FF] rounded-xl p-4 shadow-sm">
      <p className="font-semibold text-gray-900">Payment Summary</p>
      <p className="text-xs text-gray-500 mb-3">Last 7 Days</p>

      <div className="flex justify-between items-center">
        {/* Received */}
        <div>
          <p className="font-semibold text-gray-900">Received</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{formatAmount(totalReceived)}
          </p>
        </div>

        <div className="h-8 w-px bg-gray-300" />

        {/* Udhar */}
        <div>
          <p className="font-semibold text-gray-900">Udhar</p>
          <p className="text-lg font-semibold text-red-500">
            ₹{formatAmount(totalUdhar)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
