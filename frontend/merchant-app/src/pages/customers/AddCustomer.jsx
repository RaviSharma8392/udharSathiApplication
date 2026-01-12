import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomerById,
} from "../../index-db/customerDB";

import { addCustomerTranslations } from "../../i18n/customerLedger/add-customer-translations";
import NavbarHeader from "../../components/add-customer/NavbarHeadar";
import BottomNavbar from "../../components/bottomNavbar/BottomNavbar";
import SuccessSheet from "../../ui/SuccessSheet";
import InputField from "../../components/loginScreen/InputField";
import MerchantAddressField from "../../components/merchant-account/AddressField";

export default function AddCustomer() {
  const { id: customerId } = useParams();
  const isEdit = Boolean(customerId);

  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [lang] = useState("en");
  const t = addCustomerTranslations[lang];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // 🔹 FETCH CUSTOMER (EDIT MODE)
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      const customer = await getCustomerById(customerId);
      if (!customer) return navigate("/dashboard/customers");

      setForm({
        name: customer.name,
        phone: customer.phone.replace("+91", ""),
        address: customer.address ?? "",
      });
    })();
  }, [isEdit, customerId, navigate]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // 🔹 CREATE / UPDATE
  const handleSubmit = async () => {
    if (isEdit) {
      await updateCustomer(customerId, {
        name: form.name,
        phone: "+91" + form.phone,
        address: form.address,
      });
    } else {
      await addCustomer({
        name: form.name,
        phone: "+91" + form.phone,
        address: form.address,
      });
    }

    setShowSuccess(true);
    setTimeout(() => navigate("/dashboard/customers"), 1500);
  };

  // 🔹 DELETE
  const handleDelete = async () => {
    if (!window.confirm("Delete this customer?")) return;
    await deleteCustomerById(customerId);
    navigate("/dashboard/customers");
  };

  return (
    <div className="min-h-screen px-4 pt-5 bg-[#F7F8FA]">
      <NavbarHeader
        title={isEdit ? "Edit Customer" : "Add Customer"}
        menuItems={isEdit ? [{ label: "Delete", onClick: handleDelete }] : []}
      />

      <main className="px-4 pt-6 pb-24 max-w-md mx-auto">
        {/* Name */}
        <InputField
          label={t.nameLabel}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t.namePlaceholder}
        />

        {/* Phone */}

        <InputField
          label={t.phoneLabel}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder={t.phonePlaceholder}
          prefix="+91"
        />
        {/* Address */}
        <MerchantAddressField
          label={t.addressLabel}
          value={form.address}
          onChange={handleChange}
          placeholder={t.addressPlaceholder}
        />

        <button
          disabled={!form.name || !form.phone}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-semibold text-white bg-[#2F4CD1]">
          {isEdit ? "Update Customer" : t.button}
        </button>
      </main>

      <SuccessSheet
        open={showSuccess}
        message={isEdit ? "Customer Updated" : "Customer Added"}
        onClose={() => setShowSuccess(false)}
      />
      <BottomNavbar />
    </div>
  );
}
