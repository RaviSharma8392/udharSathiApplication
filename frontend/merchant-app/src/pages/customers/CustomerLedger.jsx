import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import CustomerHeader from "../../components/customerHistoryHeader/CustomerHeader";
import TransactionTable from "../../components/TransactionTable";
import { TransactionModalPopUP } from "../../components/TransactionModalPopUP";

import { getCustomerLedger } from "../../service/ledgerService";
import { getCustomerById } from "../../index-db/customerDB";

import { getLanguage } from "../../LocalStorage/app_language";
import ledgerText from "../../i18n/ledger";
import { t } from "../../utils/t";

export default function CustomerLedger() {
  const { customerId } = useParams();
  const lang = getLanguage();

  const [customer, setCustomer] = useState(null);
  const [ledger, setLedger] = useState({
    transactions: [],
    balance: 0,
    loading: true,
  });

  // 🔁 trigger refresh after transaction
  const [refreshKey, setRefreshKey] = useState(0);

  /* ================= LOAD CUSTOMER ================= */
  const loadCustomer = useCallback(async () => {
    const data = await getCustomerById(Number(customerId));
    setCustomer(data);
    return data;
  }, [customerId]);

  /* ================= LOAD LEDGER ================= */
  const loadLedger = useCallback(async () => {
    setLedger((prev) => ({ ...prev, loading: true }));

    const customerData = await loadCustomer();
    const ledgerData = await getCustomerLedger(Number(customerId));

    setLedger({
      transactions: ledgerData.transactions,
      balance: customerData.balance, // ✅ always latest
      loading: false,
    });
  }, [customerId, loadCustomer]);

  /* ================= EFFECT ================= */
  useEffect(() => {
    loadLedger();
  }, [loadLedger, refreshKey]);

  if (ledger.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {t(lang, ledgerText, "loading")}
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-4xl space-y-4 pb-32">
        {customer && (
          <CustomerHeader
            lang={lang}
            customer={customer}
            balance={ledger.balance}
          />
        )}

        {ledger.transactions.length > 0 ? (
          <TransactionTable lang={lang} transactions={ledger.transactions} />
        ) : (
          <div className="flex flex-col items-center justify-center mt-16 px-6 text-center">
            <img
              src="/safetyChat.png"
              alt="Secure Ledger"
              className="w-6 h-6 mb-6 opacity-90"
            />

            <p className="text-sm text-gray-500 max-w-xs mb-4">
              {t(lang, ledgerText, "privacy", { name: customer?.name })}
            </p>

            <p className="text-sm text-gray-400">
              {t(lang, ledgerText, "start", { name: customer?.name })}
            </p>
          </div>
        )}

        {/* 🔥 REFRESH LEDGER AFTER TRANSACTION */}
        <TransactionModalPopUP
          balance={ledger.balance}
          lang={lang}
          customer={customer}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}
