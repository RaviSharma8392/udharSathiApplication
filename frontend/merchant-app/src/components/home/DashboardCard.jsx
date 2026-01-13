const formatAmount = (amount) => {
  const num = Number(amount);
  if (!Number.isFinite(num)) return "0";

  const abs = Math.abs(num);
  if (abs >= 1e10) return "10,00,00,000+";

  return num.toLocaleString("en-IN");
};

export const DashboardCard = ({
  totalReceived = 0,
  totalUdhar = 0,
  label = "Last 7 Days",
}) => {
  return (
    <div className="bg-[#EEF2FF] rounded-xl p-4 shadow-sm">
      <p className="font-semibold text-gray-900">Payment Summary</p>
      <p className="text-xs text-gray-500 mb-3">{label}</p>

      <div className="flex justify-between items-center">
        {/* Received */}
        <div>
          <p className="text-sm text-gray-700">Received</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{formatAmount(totalReceived)}
          </p>
        </div>

        <div className="h-8 w-px bg-gray-300" />

        {/* Udhar */}
        <div>
          <p className="text-sm text-gray-700">Udhar</p>
          <p className="text-lg font-semibold text-red-500">
            ₹{formatAmount(totalUdhar)}
          </p>
        </div>
      </div>
    </div>
  );
};
