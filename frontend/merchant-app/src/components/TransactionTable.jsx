import { useEffect, useMemo, useRef, useState } from "react";
import languages from "../i18n/customer-history-translation";

const PAGE_SIZE = 7;

export default function TransactionTable({ transactions = [], lang = "hi" }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filterType, setFilterType] = useState("ALL");
  const [filterDate, setFilterDate] = useState("ALL");
  const loadMoreRef = useRef(null);

  const t = languages[lang] || languages.hi;

  /* ------------------ Utils ------------------ */
  const formatDate = (date) => {
    if (!date) return "--";
    const d = new Date(date);
    if (isNaN(d)) return "--";

    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ------------------ Filtering (Optimized) ------------------ */
  const filteredTx = useMemo(() => {
    const now = new Date();
    let fromDate = null;

    switch (filterDate) {
      case "TODAY":
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "LAST_7_DAYS":
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "THIS_MONTH":
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "THIS_YEAR":
        fromDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        fromDate = null;
    }

    return transactions.filter((tx) => {
      const isTypeMatch = filterType === "ALL" || tx.type === filterType;
      const txDate = new Date(tx.date);
      const isDateMatch = !fromDate || txDate >= fromDate;
      return isTypeMatch && isDateMatch;
    });
  }, [transactions, filterType, filterDate]);

  const visibleTx = filteredTx.slice(0, visibleCount);

  /* ------------------ Infinite Scroll ------------------ */
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, filteredTx.length)
          );
        }
      },
      { rootMargin: "80px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredTx.length]);

  /* Reset pagination on filter change */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filterType, filterDate]);

  /* ------------------ UI ------------------ */
  return (
    <div className="overflow-hidden">
      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap gap-2 p-3 bg-white border-b text-xs font-semibold">
        <select
          aria-label="Transaction type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-2 py-1 border rounded-lg bg-gray-50">
          <option value="ALL">{t.all}</option>
          <option value="UDHAR">{t.UDHAR}</option>
          <option value="PAYMENT">{t.PAYMENT}</option>
        </select>

        <select
          aria-label="Date filter"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-2 py-1 border rounded-lg bg-gray-50">
          <option value="ALL">{t.allTime}</option>
          <option value="TODAY">{t.today}</option>
          <option value="LAST_7_DAYS">{t.last7Days}</option>
          <option value="THIS_MONTH">{t.thisMonth}</option>
          <option value="THIS_YEAR">{t.thisYear}</option>
        </select>

        <span className="ml-auto text-gray-500">
          {filteredTx.length} {t.records}
        </span>
      </div>

      {/* ================= HEADER ================= */}
      <div className="grid grid-cols-3 px-4 py-3 bg-white border-b text-[11px] font-semibold text-gray-500">
        <span>{t.dateBalance}</span>
        <span className="text-center text-red-500">{t.UDHAR}</span>
        <span className="text-center text-emerald-600">{t.PAYMENT}</span>
      </div>

      {/* ================= BODY ================= */}
      {visibleTx.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400">
          {t.noTransactions}
        </div>
      ) : (
        visibleTx.map((tx) => {
          const isUDHAR = tx.type === "UDHAR";
          const amount = Number(tx.amount) || 0;
          const balance = Number(tx.balanceAfter) || 0;

          return (
            <div
              key={tx.id}
              className="mx-2 mt-2 p-3 bg-white rounded-xl shadow-sm grid grid-cols-3 gap-2">
              {/* DATE + BALANCE */}
              <div>
                <p className="text-[11px] text-gray-500">
                  {formatDate(tx.date)}
                </p>
                <p
                  className={`text-xs font-semibold ${
                    balance < 0 ? "text-emerald-600" : "text-red-500"
                  }`}>
                  {t.balance}: ₹{Math.abs(balance)}
                </p>

                {/* NOTE */}
                {tx.note && (
                  <p className="mt-1 text-[11px] text-gray-400 italic">
                    📝 {tx.note}
                  </p>
                )}
              </div>

              {/* UDHAR */}
              <div className="text-center flex items-center justify-center">
                {isUDHAR && (
                  <span className="px-2 py-1 text-sm font-semibold rounded-full bg-red-50 text-red-600">
                    ₹{amount}
                  </span>
                )}
              </div>

              {/* PAYMENT */}
              <div className="text-center flex items-center justify-center">
                {!isUDHAR && (
                  <span className="px-2 py-1 text-sm font-semibold rounded-full bg-emerald-50 text-emerald-600">
                    ₹{amount}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* ================= LOAD MORE ================= */}
      {visibleCount < filteredTx.length && (
        <div
          ref={loadMoreRef}
          className="h-12 flex items-center justify-center">
          <span className="text-xs text-gray-400">{t.loadingMore}...</span>
        </div>
      )}
    </div>
  );
}
