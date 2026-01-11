import { FaArrowLeft } from "react-icons/fa";

export function CustomerLedger({ tx, onClose }) {
  const isGive = tx.type === "GIVE";

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#5B2DCC] text-white">
        <button onClick={onClose}>
          <FaArrowLeft />
        </button>
        <p className="font-semibold text-sm">Transaction Details</p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 text-sm">
        <Detail label="Type" value={isGive ? "You Gave" : "You Got"} />
        <Detail
          label="Amount"
          value={`₹${tx.amount}`}
          valueClass={isGive ? "text-red-500" : "text-emerald-600"}
        />
        <Detail label="Date" value={new Date(tx.date).toLocaleString()} />
        <Detail
          label="Balance After"
          value={`₹${tx.balanceAfter}`}
          valueClass={tx.balanceAfter < 0 ? "text-red-500" : "text-emerald-600"}
        />
        {tx.note && <Detail label="Note" value={tx.note} />}
      </div>
    </div>
  );
}

function Detail({ label, value, valueClass = "" }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
