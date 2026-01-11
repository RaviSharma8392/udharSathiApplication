import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

import CustomerHeader from "../../components/customerHistoryHeader/CustomerHeader";
import TransactionTable from "../../components/TransactionTable";
import { TransactionModalPopUP } from "../../components/TransactionModalPopUP";

import { getCustomerById } from "../../index-db/customerDB";
import { getCustomerTransactionsPaginated } from "../../index-db/transactionDB";

import { getLanguage } from "../../LocalStorage/app_language";
import ledgerText from "../../i18n/ledger";
import { t } from "../../utils/t";

const PAGE_SIZE = 7;

export default function CustomerLedger() {
  const { customerId } = useParams();
  const lang = getLanguage();

  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const lastCursorRef = useRef(null);

  const loadCustomer = useCallback(async () => {
    const data = await getCustomerById(Number(customerId));
    setCustomer(data);
  }, [customerId]);

  const loadMoreTransactions = useCallback(async () => {
    if (!hasMore) return;

    const {
      transactions: newTx,
      lastCursor,
      hasMore: more,
    } = await getCustomerTransactionsPaginated(
      Number(customerId),
      lastCursorRef.current
    );

    lastCursorRef.current = lastCursor;

    // Append new transactions without duplicates
    setTransactions((prev) => [
      ...prev,
      ...newTx.filter((tx) => !prev.some((p) => p.id === tx.id)),
    ]);

    setHasMore(more);
  }, [customerId, hasMore]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await loadCustomer();
      await loadMoreTransactions();
      setLoading(false);
    }
    init();
  }, [loadCustomer, loadMoreTransactions]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {t(lang, ledgerText, "loading")}
      </div>
    );
  }
  console.log(transactions);

  return (
    <div className="h-screen bg-gray-50 flex mb-32 justify-center">
      <div className="w-full max-w-4xl space-y-4">
        {customer && (
          <CustomerHeader
            lang={lang}
            customer={customer}
            balance={customer.balance}
          />
        )}

        {transactions.length > 0 ? (
          <TransactionTable
            lang={lang}
            transactions={transactions}
            loadMore={loadMoreTransactions} // optional: trigger on scroll
          />
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

        <TransactionModalPopUP lang={lang} customer={customer} />
      </div>
    </div>
  );
}
