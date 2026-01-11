import { useState } from "react";
import languages from "../i18n/customer-history-translation"; // import lang file

const PAGE_SIZE = 10;

export default function TransactionTable({ transactions = [], lang = "hi" }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedTx, setSelectedTx] = useState(null);

  const t = languages[lang]; // current language

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const visibleTx = transactions.slice(0, visibleCount);

  return (
    <>
      <div className="bg-gray-100 rounded-xl shadow overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 text-xs font-semibold text-gray-500 px-4 py-3 bg-white">
          <span>{t.dateBalance}</span>
          <span className="text-center text-red-500">{t.UDHAR}</span>
          <span className="text-center text-emerald-500">{t.PAYMENT}</span>
        </div>

        {/* Rows */}
        {visibleTx.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">
            {t.noTransactions}
          </p>
        ) : (
          visibleTx.map((tx) => {
            const isUDHAR = tx.type === "UDHAR";
            const balanceColor =
              tx.balanceAfter < 0 ? "text-emerald-600" : " text-red-500";

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="grid grid-cols-3 px-4 py-3 mt-2 mx-1 bg-white rounded-lg items-center cursor-pointer active:bg-gray-50">
                {/* Date & Balance */}
                <div>
                  <p className="text-[11px] text-gray-500">
                    {formatDate(tx.date)}
                  </p>
                  <p className={`text-xs font-semibold ${balanceColor}`}>
                    {t.balance}: ₹{Math.abs(tx.balanceAfter)}
                  </p>
                </div>

                {/* You Gave */}
                <div className="text-center">
                  {isUDHAR && (
                    <span className="text-sm font-semibold text-red-500">
                      ₹{tx.amount}
                    </span>
                  )}
                </div>

                {/* You Got */}
                <div className="text-center">
                  {!isUDHAR && (
                    <span className="text-sm font-semibold text-emerald-600">
                      ₹{tx.amount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Load More */}
        {visibleCount < transactions.length && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
              {t.loadMore}
            </button>
          </div>
        )}
      </div>

      {/* FULL PAGE TRANSACTION DETAILS */}
      {/* {selectedTx && (
        <TransactionDetails
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )} */}
    </>
  );
}
