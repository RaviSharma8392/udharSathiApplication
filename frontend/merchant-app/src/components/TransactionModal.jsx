import { useEffect, useState } from "react";
import Calculator from "./calculator/Calculator";
import { calculateBalanceAfter } from "../utils/balance";

import transactionModalText from "../i18n/customerLedger/transactionModal";
import { t } from "../utils/t";

export default function TransactionModal({
  isOpen,
  type,
  onClose,
  onSubmit,
  balance,
  lang,
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showCalc, setShowCalc] = useState(false);

  const isUdhar = type === "UDHAR";

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setDate(now.toISOString().slice(0, 10));
      setTime(now.toTimeString().slice(0, 5));
      setAmount("");
      setNote("");
      setShowCalc(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!amount || !date || !time) return;

    const combinedDateTime = new Date(`${date}T${time}`).toISOString();

    await onSubmit({
      type,
      amount: Number(amount),
      note,
      balanceBefore: balance,
      balanceAfter: calculateBalanceAfter({
        currentBalance: balance,
        amount,
        type,
      }),
      date: combinedDateTime,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col">
      {/* HEADER */}
      <div
        className={`px-4 py-3 flex items-center shadow-sm ${
          isUdhar ? "bg-orange-500" : "bg-emerald-500"
        } text-white`}>
        <button onClick={onClose}>←</button>

        <h1 className="flex-1 text-center font-semibold">
          {isUdhar
            ? t(lang, transactionModalText, "addUdhar")
            : t(lang, transactionModalText, "acceptPayment")}
        </h1>

        <div className="w-6" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 space-y-5">
        {/* AMOUNT */}
        <div className="bg-white mx-2 p-3">
          <label className="text-sm text-gray-500">
            {t(lang, transactionModalText, "amount")}
          </label>

          <input
            value={amount}
            readOnly
            onClick={() => setShowCalc(true)}
            placeholder={t(lang, transactionModalText, "amountPlaceholder")}
            className="w-full mt-2 text-lg font-semibold border rounded px-3 py-2"
          />
        </div>

        {/* DATE & TIME */}
        <div className="bg-white p-4">
          <label className="text-xs text-gray-500 block mb-2">
            {t(lang, transactionModalText, "dateTime")}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* NOTE */}
        <div className="bg-white p-4">
          <label className="text-xs text-gray-500">
            {t(lang, transactionModalText, "note")}
          </label>

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full mt-2 border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* SAVE */}
      <div className="p-4 bg-white">
        <button
          disabled={!amount}
          onClick={handleSave}
          className={`w-full py-3 text-white font-semibold rounded-lg
            ${isUdhar ? "bg-orange-500" : "bg-emerald-500"}
            disabled:opacity-50`}>
          {t(lang, transactionModalText, "save")}
        </button>
      </div>

      {/* CALCULATOR */}
      {showCalc && (
        <Calculator
          isUdhar={isUdhar}
          onClose={() => setShowCalc(false)}
          onResult={(val) => setAmount(val)}
          setAmount={setAmount}
          handleSave={handleSave}
        />
      )}
    </div>
  );
}
