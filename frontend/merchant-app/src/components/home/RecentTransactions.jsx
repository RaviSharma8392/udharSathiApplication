import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { TransactionCard } from "../transationHistory/TransationHistoryCard";

const RecentTransactions = ({ transactions, loading }) => {
  const [filter, setFilter] = useState("ALL");

  if (loading) {
    return (
      <p className="text-sm text-gray-400 mt-6">Loading transactions...</p>
    );
  }

  if (!transactions.length) {
    return (
      <div className="mt-6 text-center text-gray-400 text-sm">
        No transactions yet
      </div>
    );
  }

  // 🔹 Filter logic
  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "ALL") return true;
    return tx.type === filter;
  });

  return (
    <div className="mt-7">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">Transactions History</h3>
        <span className="text-sm text-[#2F4CD1]">See all</span>
      </div>

      {/* 🔹 Filter Tabs */}
      <div className="flex gap-6 text-sm mb-4">
        {["ALL", "UDHAR", "PAYMENT"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`font-medium transition ${
              filter === tab
                ? "text-[#2F4CD1] border-b-2 border-[#2F4CD1]"
                : "text-gray-400"
            }`}>
            {tab === "ALL" ? "All" : tab === "UDHAR" ? "Udhar" : "Payment"}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {" "}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <TransactionCard key={tx.id} tx={tx} />
          ))}
        </div>
      </div>

      {/* Empty state after filter */}
      {!filteredTransactions.length && (
        <p className="text-center text-sm text-gray-400 mt-6">
          No {filter.toLowerCase()} transactions
        </p>
      )}
    </div>
  );
};

export default RecentTransactions;
