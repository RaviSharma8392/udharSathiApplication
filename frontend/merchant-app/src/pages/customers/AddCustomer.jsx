import { useState } from "react";
import { addCustomerTranslations } from "../../i18n/customerLedger/add-customer-translations";
import { createCustomer } from "../../service/customerService";
import { useNavigate } from "react-router-dom";
import NavbarHeadar from "../../components/add-customer/NavbarHeadar";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import SuccessSheet from "../../ui/SuccessSheet";

export default function AddCustomer() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const [lang, setLang] = useState("en");
  const t = addCustomerTranslations[lang];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createCustomer({
        name: form.name,
        phone: "+91" + form.phone,
        address: form.address,
      });

      setShowSuccess(true);
      setForm({ name: "", phone: "", address: "" });

      setTimeout(() => {
        navigate("/customers");
      }, 2000);
    } catch {
      toast.error("Mobile number already exists");
    }
  };

  return (
    <div className="min-h-screen px-4 pt-5 bg-[#F7F8FA]">
      <NavbarHeadar />

      <main className="px-4 pt-6 pb-24 max-w-md mx-auto">
        {/* Name */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.nameLabel}
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t.namePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
              focus:ring-2 focus:ring-[#2F4CD1] focus:border-transparent outline-none"
          />
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.phoneLabel}
          </label>

          <div className="flex gap-3">
            {/* Country Code */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl">
              <img src="/flag.png" className="h-5 w-5" alt="India" />
              <span className="text-sm font-medium text-gray-700">+91</span>
            </div>

            {/* Phone Input */}
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder={t.phonePlaceholder}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                focus:ring-2 focus:ring-[#2F4CD1] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.addressLabel}
          </label>
          <textarea
            name="address"
            rows="3"
            value={form.address}
            onChange={handleChange}
            placeholder={t.addressPlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
              focus:ring-2 focus:ring-[#2F4CD1] focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={!form.name || !form.phone}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-semibold text-white transition bg-[#2F4CD1] hover:bg-[#253CC7]">
          {t.button}
        </button>
      </main>
      <SuccessSheet
        open={showSuccess}
        message="Customer Added Successfully"
        onClose={() => setShowSuccess(false)}
      />
      <BottomNavbar />
    </div>
  );
}
