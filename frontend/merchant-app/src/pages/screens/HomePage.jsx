import { useEffect, useState } from "react";
import ActionButtonsGrid from "../../components/home/ActionButtonsGrid";
import RecentTransactions from "../../components/home/RecentTransactions";
import { DashboardCard } from "../../components/home/DashboardCard";
import {
  getRecentTransactions,
  calculateTotals,
} from "../../index-db/transactionDB";

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    today: {
      received: 0,
      udhar: 0,
    },
    last7Days: {
      received: 0,
      udhar: 0,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 🔹 TODAY totals
        const todayTotals = await calculateTotals({ type: "TODAY" });

        // 🔹 LAST 7 DAYS totals
        const last7DaysTotals = await calculateTotals({
          type: "LAST_7_DAYS",
        });

        setTotals({
          today: {
            received: todayTotals.totalPayment,
            udhar: todayTotals.totalUdhar,
          },
          last7Days: {
            received: last7DaysTotals.totalPayment,
            udhar: last7DaysTotals.totalUdhar,
          },
        });

        // 🔹 Recent transactions (NO filtering)
        const recent = await getRecentTransactions(10);
        setTransactions(recent);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Dashboard totals */}
      <DashboardCard
        totalReceived={totals.last7Days.received}
        totalUdhar={totals.last7Days.udhar}
        label="Last 7 Days"
      />

      <ActionButtonsGrid />

      {/* Recent transactions */}
      <RecentTransactions transactions={transactions} loading={loading} />
    </div>
  );
};

export default HomePage;
