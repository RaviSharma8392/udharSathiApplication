export default function TransactionSuccess({
  customerName,
  amount,
  isUdhar,
  onAddUdhar,
  onAddPayment,
  onDone,
}) {
  console.log(customerName);
  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col">
      {/* ================= TOP SUCCESS AREA ================= */}
      <div className="h-1/2 bg-gradient-to-b from-emerald-500 to-emerald-600 flex flex-col items-center justify-center text-white relative">
        {/* Paytm-style icon */}
        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-xl mb-4">
          <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl">
            ✓
          </div>
        </div>

        <h2 className="text-2xl font-semibold">
          {isUdhar ? "Udhar Added Successfully" : "Payment Successful"}
        </h2>

        <p className="text-sm opacity-90 mt-1">₹{amount} recorded</p>

        <p className="mt-3 text-sm bg-white/20 px-4 py-1 rounded-full">
          Transaction saved for <b>{customerName}</b>
        </p>
      </div>

      {/* ================= BOTTOM ACTION AREA ================= */}
      <div className="flex-1 bg-white rounded-t-3xl px-4 py-6">
        <h3 className="text-center text-gray-600 mb-5">
          Add another transaction for <b>{customerName}</b>
        </h3>

        <div className="flex gap-4 mb-6">
          <button
            onClick={onAddUdhar}
            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold">
            + Add Udhar
          </button>

          <button
            onClick={onAddPayment}
            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold">
            ✓ Accept Payment
          </button>
        </div>

        <button
          onClick={onDone}
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium">
          Done
        </button>
      </div>
    </div>
  );
}
