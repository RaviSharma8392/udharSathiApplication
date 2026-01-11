import { useEffect, useState } from "react";
import DashboardCard from "../../components/home/DashboardCard";
import ActionButtonsGrid from "../../components/home/ActionButtonsGrid";
import RecentTransactions from "../../components/home/RecentTransactions";
import {
  getRecentTransactions,
  calculateTotals,
} from "../../index-db/transactionDB";

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totals, setTotals] = useState({ totalReceived: 0, totalUdhar: 0 });

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        // 1️⃣ Calculate totals for TODAY
        const todayTotals = await calculateTotals({ type: "TODAY" });
        setTotals({
          totalReceived: todayTotals.totalPayment,
          totalUdhar: todayTotals.totalUdhar,
        });

        // 2️⃣ Load recent transactions (limit 10) for today
        const recentToday = await getRecentTransactions(10);

        // Filter transactions to TODAY only
        const now = new Date();
        const startOfDay = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const todayTransactions = recentToday.filter((tx) => {
          const txDate = new Date(tx.date || tx.createdAt);
          return txDate >= startOfDay;
        });

        setTransactions(todayTransactions);
      } catch (err) {
        console.error("Error loading transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Dashboard totals */}
      <DashboardCard
        totalReceived={totals.totalReceived}
        totalUdhar={totals.totalUdhar}
      />

      <ActionButtonsGrid />

      {/* Recent transactions today */}
      <RecentTransactions transactions={transactions} loading={loading} />
    </div>
  );
};

export default HomePage;
