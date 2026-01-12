import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomers } from "../../index-db/customerDB";
import CustomerAvatar from "../../components/customer/CustomerAvatar";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function ManageCustomers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllCustomers();
      setCustomers(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-800">
          Manage Customers
        </h1>

        <button
          onClick={() => navigate("/dashboard/customers/add")}
          className="flex items-center gap-1 bg-[#2F4CD1] text-white px-4 py-2 rounded-xl text-sm">
          <PlusIcon className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center mt-10">
          Loading customers...
        </p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-gray-400 text-center mt-10">
          No customers yet
        </p>
      ) : (
        <div className="space-y-3">
          {customers.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
              {/* Left */}
              <div className="flex items-center gap-3">
                <CustomerAvatar name={c.name} />
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.phone}</p>
                </div>
              </div>

              {/* Edit */}
              <button
                onClick={() => navigate(`/dashboard/customers/edit/${c.id}`)}
                className="p-2 rounded-lg hover:bg-gray-100">
                <PencilIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
