import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getAllCustomers } from "../../index-db/customerDB";
import CustomerCard from "../../components/allCustomers/CustomerCard";

const ITEMS_PER_LOAD = 20;

function AllCustomers() {
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        const data = await getAllCustomers();
        setCustomers(data);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

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

  // Handle Reminder click
  const handleReminder = (customer) => {
    alert(`Send reminder to ${customer.name} (${customer.phone})`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-4">
      {/* Search */}
      <div className="flex items-center bg-white rounded-xl px-3 py-2 border border-gray-200">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by name or number"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(ITEMS_PER_LOAD); // reset scroll
          }}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      {/* Customer List */}
      <div className="mt-5">
        {loading ? (
          <p className="text-sm text-gray-400 text-center mt-10">
            Loading customers...
          </p>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center mt-16 px-6">
            <p className="text-gray-500 text-sm mb-3">No customers found</p>
            <p className="text-xs text-gray-400 mb-6">
              Add customers to start tracking Udhar and payments
            </p>
            <button
              onClick={() => navigate("/add/customers")}
              className="bg-rose-600 text-white px-6 py-2 rounded-xl text-sm">
              Add Customer
            </button>
          </div>
        ) : (
          <>
            {visibleCustomers.map((c) => (
              <CustomerCard
                key={c.id}
                customer={c}
                onClick={() => navigate(`/customers/${c.id}/ledger`)}
                onReminder={handleReminder}
              />
            ))}
            <div ref={loadMoreRef} className="h-10" />
          </>
        )}
      </div>
    </div>
  );
}

export default AllCustomers;
