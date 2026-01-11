export default function CustomerActionPopup({
  customer,
  onClose,
  onPayment,
  onUdhar,
}) {
  // Guard: don't render if no customer
  if (!customer) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      onClick={onClose}>
      {/* Centered Modal */}
      <div
        className=" bg-white w-11/12 max-w-sm rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onUdhar}
          className="w-full mb-3 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition">
          Add Udhar
        </button>

        <button
          onClick={onPayment}
          className="w-full mb-3 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition">
          Accept Payment
        </button>

        <button
          onClick={onClose}
          className="w-full py-2 text-center text-gray-500 hover:text-gray-700 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}
