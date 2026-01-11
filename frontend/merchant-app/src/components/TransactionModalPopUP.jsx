import { useState } from "react";
import TransactionModal from "./TransactionModal";
import TransactionButton from "./button/TransactionButton";
import TransactionSuccess from "./TransactionSuccess";

import { addTransaction } from "../index-db/transactionDB";
import { updateCustomerBalance, getCustomerById } from "../index-db/customerDB";

import transactionPopupText from "../i18n/transactionPopup";
import { t } from "../utils/t";

export const TransactionModalPopUP = ({ lang, customer }) => {
  const [modalType, setModalType] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const customerId = customer.id;

  /* ================= HANDLE TRANSACTION ================= */
  const handleSubmit = async (tx) => {
    const numericAmount = Number(tx.amount);

    // 🔥 Fetch the latest balance directly from DB
    const latestCustomer = await getCustomerById(customerId);
    const currentBalance = Number(latestCustomer.balance || 0);

    const newBalance =
      tx.type === "UDHAR"
        ? currentBalance + numericAmount
        : currentBalance - numericAmount;

    const finalTx = {
      ...tx,
      amount: numericAmount,
      customerId,
      balanceAfter: newBalance, // Store actual balance after transaction
      date: new Date().toISOString(),
    };

    // 1️⃣ Add transaction to DB
    await addTransaction(finalTx);

    // 2️⃣ Update customer's balance
    await updateCustomerBalance(customerId, {
      amount: numericAmount,
      type: tx.type,
    });

    // 3️⃣ Show success
    setSuccessData(finalTx);
  };

  /* ================= SUCCESS SCREEN ================= */
  if (successData) {
    return (
      <TransactionSuccess
        lang={lang}
        customerName={customer.name}
        amount={successData.amount}
        isUdhar={successData.type === "UDHAR"}
        onAddUdhar={() => {
          setSuccessData(null);
          setModalType("UDHAR");
        }}
        onAddPayment={() => {
          setSuccessData(null);
          setModalType("PAYMENT");
        }}
        onDone={() => setSuccessData(null)}
      />
    );
  }

  return (
    <>
      {/* ================= BOTTOM ACTION BAR ================= */}
      <div
        className="
          fixed bottom-0 left-0 w-full z-40
          bg-white/95 backdrop-blur
          border-t border-gray-200
          shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
          px-7 py-3
        ">
        <div className="max-w-md mx-auto flex gap-3">
          <TransactionButton
            text={t(lang, transactionPopupText, "addUdhar")}
            color="#F59E0B"
            className="flex-1 py-3 text-white font-semibold rounded-xl"
            onClick={() => setModalType("UDHAR")}
          />

          <TransactionButton
            text={t(lang, transactionPopupText, "acceptPayment")}
            color="#10B981"
            className="flex-1 py-3 text-white font-semibold rounded-xl"
            onClick={() => setModalType("PAYMENT")}
          />
        </div>
      </div>

      {/* ================= TRANSACTION MODAL ================= */}
      <TransactionModal
        isOpen={!!modalType}
        type={modalType}
        customer={customer}
        onClose={() => setModalType(null)}
        onSubmit={handleSubmit}
        balance={customer.balance} // Can also pass latestCustomer.balance if needed
        lang={lang}
      />
    </>
  );
};
