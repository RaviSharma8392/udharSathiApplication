import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { getAllCustomers } from "../../index-db/customerDB";
import { addTransaction } from "../../index-db/transactionDB";

import SearchBar from "../../pages/customers/SearchBar";
import CustomerList from "../../pages/customers/CustomerList";
import SelectedCustomerBar from "../../pages/customers/SelectedCustomerBar";
import RecentlySelectedCustomer from "../../components/customer/RecentlySelectedCustomer";
import CustomerActionPopup from "../../components/customer/CustomerActionPopup";
import TransactionModal from "../../components/TransactionModal";
import NavbarHeadar from "../../components/add-customer/NavbarHeadar";
import { getLanguage } from "../../LocalStorage/app_language";

const RECENT_KEY = "recent_customers";
const ITEMS_PER_LOAD = 20;

function SelectCustomerPage() {
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);

  const lang = getLanguage();

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  // 🔹 Popup + Modal State
  const [actionCustomer, setActionCustomer] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState(null); // PAYMENT | UDHAR

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    async function load() {
      const data = await getAllCustomers();
      setCustomers(data);

      const recent = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
      setRecentCustomers(recent);
    }
    load();
  }, []);

  /* ---------------- SELECT CUSTOMER ---------------- */
  const handleSelect = (customer) => {
    setSelectedCustomer(customer);

    const updated = [
      customer,
      ...recentCustomers.filter((c) => c.id !== customer.id),
    ].slice(0, 8);

    setRecentCustomers(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  /* ---------------- ADD PAYMENT / UDHAR ---------------- */
  const handleAddPayment = (customer) => {
    setSelectedCustomer(customer);
    setTransactionType("PAYMENT");
    setShowTransactionModal(true);
  };

  const handleAddUdhar = (customer) => {
    setSelectedCustomer(customer);
    setTransactionType("UDHAR");
    setShowTransactionModal(true);
  };

  /* ---------------- FILTER + LAZY LOAD ---------------- */
  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  const visibleCustomers = filteredCustomers.slice(0, visibleCount);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_LOAD, filteredCustomers.length)
        );
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredCustomers.length]);

  return (
    <div className="min-h-screen bg-white px-3 pt-4 pb-32">
      <NavbarHeadar />

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Recently Selected → Popup */}
      {recentCustomers.length > 0 && (
        <RecentlySelectedCustomer
          recentCustomers={recentCustomers}
          handleSelect={(customer) => setActionCustomer(customer)}
        />
      )}

      {/* Customer List */}
      <CustomerList
        customers={visibleCustomers}
        selectedCustomer={selectedCustomer}
        onSelect={handleSelect}
        onAddPayment={handleAddPayment}
        onAddUdhar={handleAddUdhar}
      />

      {/* Empty State */}
      {filteredCustomers.length === 0 && search && (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">No customer found</p>

          <button
            onClick={() =>
              navigate("/customers/add", {
                state: { phone: search },
              })
            }
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white">
            ➕ Add Customer
          </button>
        </div>
      )}

      {/* Lazy Load Trigger */}
      <div ref={loadMoreRef} className="h-10" />

      {/* 🔹 SMALL ACTION POPUP */}
      <CustomerActionPopup
        customer={actionCustomer}
        onClose={() => setActionCustomer(null)}
        onPayment={() => {
          handleAddPayment(actionCustomer);
          setActionCustomer(null);
        }}
        onUdhar={() => {
          handleAddUdhar(actionCustomer);
          setActionCustomer(null);
        }}
      />

      {/* 🔹 TRANSACTION MODAL */}
      {showTransactionModal && selectedCustomer && (
        <TransactionModal
          isOpen={showTransactionModal}
          type={transactionType}
          lang={lang}
          balance={selectedCustomer.balance || 0}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={async (tx) => {
            await addTransaction({
              ...tx,
              customerId: selectedCustomer.id,
              customerName: selectedCustomer.name,
              customerPhone: selectedCustomer.phone,
            });

            setShowTransactionModal(false);
            navigate(`/customers/${selectedCustomer.id}/ledger`);
          }}
        />
      )}
    </div>
  );
}

export default SelectCustomerPage;
