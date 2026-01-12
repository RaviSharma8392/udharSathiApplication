import { useEffect, useRef, useState, useCallback } from "react";
import { getCustomerById } from "../../index-db/customerDB";
import { getTransactionsPaginated } from "../../index-db/transactionDB";
import { TransactionCard } from "../../components/transationHistory/TransationHistoryCard";
import NavbarHeader from "../../components/add-customer/NavbarHeadar";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const LIMIT = 10;

// Group transactions into "Today", "Yesterday", "Month Year"
function groupByMonth(transactions) {
  const groups = {};
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  transactions.forEach((tx) => {
    const date = new Date(tx.date || tx.createdAt);
    let label;

    if (date.toDateString() === today.toDateString()) label = "Today";
    else if (date.toDateString() === yesterday.toDateString())
      label = "Yesterday";
    else
      label = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });

  return Object.entries(groups);
}

const TransactionsHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [filterType, setFilterType] = useState("ALL"); // ALL | UDHAR | PAYMENT
  const [filterDate, setFilterDate] = useState("ALL"); // ALL | TODAY | LAST_7_DAYS | THIS_MONTH | THIS_YEAR
  const [search, setSearch] = useState("");

  const loaderRef = useRef(null);

  /* ---------- FETCH TRANSACTIONS PAGINATED ---------- */
  const loadTransactions = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);

      const data = await getTransactionsPaginated(
        LIMIT,
        reset ? 0 : offset,
        "ALL" // always get all, filter later in frontend
      );

      // Remove duplicates by id
      const map = new Map();
      [...(reset ? [] : transactions), ...data].forEach((tx) =>
        map.set(tx.id, tx)
      );

      setTransactions(Array.from(map.values()));
      setOffset((prev) => (reset ? LIMIT : prev + LIMIT));
      if (data.length < LIMIT) setHasMore(false);
      setLoading(false);
    },
    [loading, offset, transactions]
  );

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    loadTransactions(true);
  }, []);

  /* ---------- RESET ON FILTER CHANGE ---------- */
  useEffect(() => {
    setOffset(0);
    setTransactions([]);
    setHasMore(true);
    loadTransactions(true);
  }, [filterType, filterDate]);

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) loadTransactions();
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loaderRef.current]);

  /* ---------- FILTER + SEARCH ---------- */
  const filteredTransactions = transactions.filter((tx) => {
    // 1️⃣ Filter by type
    const matchType = filterType === "ALL" || tx.type === filterType;

    // 2️⃣ Filter by date
    const now = new Date();
    const txDate = new Date(tx.date || tx.createdAt);
    let matchDate = true;

    switch (filterDate) {
      case "TODAY":
        matchDate = txDate.toDateString() === new Date().toDateString();
        break;
      case "LAST_7_DAYS":
        matchDate = txDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "THIS_MONTH":
        matchDate =
          txDate.getFullYear() === now.getFullYear() &&
          txDate.getMonth() === now.getMonth();
        break;
      case "THIS_YEAR":
        matchDate = txDate.getFullYear() === now.getFullYear();
        break;
      default:
        matchDate = true;
    }

    // 3️⃣ Filter by search (customer ID)
    const matchSearch = search
      ? tx.customerId.toString().includes(search)
      : true;

    return matchType && matchDate && matchSearch;
  });

  /* ---------- DYNAMIC CUSTOMER NAMES ---------- */
  const [customerMap, setCustomerMap] = useState({});
  useEffect(() => {
    filteredTransactions.forEach((tx) => {
      if (!customerMap[tx.customerId]) {
        getCustomerById(tx.customerId).then((c) => {
          setCustomerMap((prev) => ({
            ...prev,
            [tx.customerId]: c?.name || "Unknown",
          }));
        });
      }
    });
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-4 pb-24">
      <NavbarHeader />

      {/* 🔍 Search */}
      <div className="mt-4 flex items-center bg-white rounded-xl px-3 py-2 border border-gray-200">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
        <input
          placeholder="Search customer ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      {/* Filters */}
      <div className=" hidden  gap-6 text-sm my-5">
        {["ALL", "UDHAR", "PAYMENT"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`font-medium ${
              filterType === tab
                ? "text-[#2F4CD1] border-b-2 border-[#2F4CD1]"
                : "text-gray-400"
            }`}>
            {tab === "ALL" ? "All" : tab === "UDHAR" ? "Udhar" : "Payment"}
          </button>
        ))}
        {["ALL", "TODAY", "LAST_7_DAYS", "THIS_MONTH", "THIS_YEAR"].map((d) => (
          <button
            key={d}
            onClick={() => setFilterDate(d)}
            className={`font-medium ${
              filterDate === d
                ? "text-[#2F4CD1] border-b-2 border-[#2F4CD1]"
                : "text-gray-400"
            }`}>
            {d.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="space-y-6">
        {groupByMonth(filteredTransactions).map(([label, items]) => (
          <div key={label}>
            <p className="text-xs font-semibold text-gray-400 mb-2">{label}</p>
            <div className="space-y-3">
              {items.map((tx) => (
                <TransactionCard
                  key={`${tx.id}-${tx.date}`}
                  tx={{
                    ...tx,
                    customerName: customerMap[tx.customerId] || "Loading...",
                  }}
                />
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
