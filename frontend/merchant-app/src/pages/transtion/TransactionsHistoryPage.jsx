import { useEffect, useState, useRef } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getTransactionsPaginated } from "../../index-db/transactionDB";
import { TransactionCard } from "../../components/transationHistory/TransationHistoryCard";
import NavbarHeadar from "../../components/add-customer/NavbarHeadar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const LIMIT = 10;

function groupByMonth(transactions) {
  const groups = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    const today = new Date();

    let label;

    if (date.toDateString() === today.toDateString()) {
      label = "Today";
    } else if (
      new Date(today.setDate(today.getDate() - 1)).toDateString() ===
      date.toDateString()
    ) {
      label = "Yesterday";
    } else {
      label = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });

  return Object.entries(groups);
}

const TransactionsHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);

  /* ---------- LOAD DATA ---------- */
  const loadTransactions = async (reset = false) => {
    if (loading) return;

    setLoading(true);

    const data = await getTransactionsPaginated(LIMIT, reset ? 0 : offset);

    setTransactions((prev) => {
      if (reset) return data;

      const map = new Map();

      [...prev, ...data].forEach((tx) => {
        map.set(`${tx.id}-${tx.date}`, tx);
      });

      return Array.from(map.values());
    });

    setOffset((prev) => (reset ? LIMIT : prev + LIMIT));
    if (data.length < LIMIT) setHasMore(false);

    setLoading(false);
  };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    loadTransactions(true);
  }, []);

  /* ---------- RESET ON FILTER CHANGE ---------- */
  useEffect(() => {
    loadTransactions(true);
  }, [filter]);

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          loadTransactions();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  /* ---------- FILTER + SEARCH ---------- */
  const visibleTransactions = transactions.filter((tx) => {
    const matchType = filter === "ALL" ? true : tx.type === filter;

    const matchSearch =
      tx.customerName.toLowerCase().includes(search.toLowerCase()) ||
      tx.customerPhone.includes(search);

    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-4 pb-24">
      <NavbarHeadar />

      {/* 🔍 Search */}
      <div className="mt-4 flex items-center bg-white rounded-xl px-3 py-2 border border-gray-200">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
        <input
          placeholder="Search customer or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>
      {/* Filters */}
      <div className="flex  gap-6 text-sm my-5">
        {["ALL", "UDHAR", "PAYMENT"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`font-medium ${
              filter === tab
                ? "text-[#2F4CD1] border-b-2 border-[#2F4CD1]"
                : "text-gray-400"
            }`}>
            {tab === "ALL" ? "All" : tab === "UDHAR" ? "Udhar" : "Payment"}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="space-y-6">
        {groupByMonth(visibleTransactions).map(([label, items]) => (
          <div key={label}>
            <p className="text-xs font-semibold text-gray-400 mb-2">{label}</p>

            <div className="space-y-3">
              {items.map((tx) => (
                <TransactionCard key={tx.id} tx={tx} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && <div ref={loaderRef} className="h-10" />}

      {!hasMore && (
        <p className="text-center text-xs text-gray-400 mt-6">
          No more transactions
        </p>
      )}
    </div>
  );
};

export default TransactionsHistoryPage;
