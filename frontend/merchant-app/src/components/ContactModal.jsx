import { useState } from "react";

/* ---------- IndexedDB ---------- */
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ContactDB", 1);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      const store = db.createObjectStore("contacts", {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("username", "username", { unique: true });
      store.createIndex("phone", "phone", { unique: true });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("DB Error");
  });
};

const addContact = async (contact) => {
  const db = await openDB();
  const tx = db.transaction("contacts", "readwrite");
  tx.objectStore("contacts").add(contact);
};

/* ---------- Modal ---------- */
export default function ContactModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    phone: "",
    address: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await addContact(form);
    onClose();
    setForm({ name: "", username: "", phone: "", address: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full md:w-[420px] bg-white rounded-t-2xl md:rounded-2xl p-6 animate-slideUp shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Add New Contact</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl">
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="phone"
            placeholder="Contact Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="address"
            placeholder="Address"
            rows="3"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="w-1/2 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Save Contact
          </button>
        </div>
      </div>
    </div>
  );
}
