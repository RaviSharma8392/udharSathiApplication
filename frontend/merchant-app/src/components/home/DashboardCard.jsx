import React from "react";

const DashboardCard = ({ totalReceived = 18500, totalUdhar = 3200 }) => {
  return (
    <div className="bg-[#EEF2FF] rounded-xl p-4 shadow-sm">
      <p className="font-semibold text-gray-900 mb-2">Payment Summary</p>

      <div className="flex justify-between items-center">
        {/* Received */}
        <div>
          <p className="font-semibold text-gray-900">Received</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{totalReceived.toLocaleString()}
          </p>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300" />

        {/* Udhar */}
        <div>
          <p className=" font-semibold text-gray-900">Udhar</p>
          <p className="text-lg font-semibold text-red-500">
            ₹{totalUdhar.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
