import { useState } from "react";
import BusinessTypePopup from "../../components/merchant-account/BusinessSelectPopup";
import NavbarHeadar from "../../components/add-customer/NavbarHeadar";
import MerchantProfilePhoto from "../../components/merchant-account/MerchantProfilePhoto";
import MerchnatAccountInputField from "../../components/merchant-account/MerchnatAccountInputField";
import BusinessCategoryInput from "../../components/merchant-account/BusinessCategoryInput";
import { MerchantAddressField } from "../../components/merchant-account/MerchantTextareaField";
import { AddressPopup } from "../../components/merchant-account/AddressPopup";

/* ---------- COMPONENTS ---------- */

function Section({ title }) {
  return (
    <p className="text-[10px] bg-gray-50 p-2 text-gray-400 tracking-widest ml-1">
      {title}
    </p>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MerchantEditProfile() {
  const [showBusinessPopup, setShowBusinessPopup] = useState(false);
  const [openAddressPopup, setOpenAddressPopup] = useState(false);

  const [profile, setProfile] = useState({
    merchantName: "Ramesh Kumar",
    mobile: "+91 9876543210",
    businessName: "Ramesh Kirana Store",
    address: "Main Road, Sector 12, Jaipur, Rajasthan",
    category: "Kirana Store",
    photo: "",
    id: "US-99210",
  });

  const [address, setAddress] = useState({
    full: profile.address,
    building: "",
    locality: "",
    city: "",
    pincode: "",
  });

  const handleChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen px-4 pt-5 bg-white flex flex-col">
      {/* Header */}
      <NavbarHeadar title="Edit Profile" />

      {/* Content */}
      <div className="flex-1 pt-5 overflow-y-auto pb-28">
        {/* Profile Photo */}
        <MerchantProfilePhoto getInitials={getInitials} profile={profile} />

        {/* Form */}
        <div className="px-4 mt-6 space-y-5">
          <Section title="PERSONAL INFO" />

          <MerchnatAccountInputField
            label="Merchant Name"
            value={profile.merchantName}
            onChange={(v) => handleChange("merchantName", v)}
            placeholder="Enter your name"
            variant="user"
          />

          <MerchnatAccountInputField
            label="Registered Number"
            value={profile.mobile}
            disabled
            variant="phone"
          />

          <Section title="BUSINESS INFO" />

          <MerchnatAccountInputField
            label="Business Name"
            value={profile.businessName}
            onChange={(v) => handleChange("businessName", v)}
            placeholder="Shop name"
            variant="business"
          />

          {/* Business Category */}
          <BusinessCategoryInput
            profile={profile}
            setShowBusinessPopup={setShowBusinessPopup}
          />

          {/* Address Field */}
          <MerchantAddressField
            address={address.full}
            onClick={() => setOpenAddressPopup(true)}
          />

          {/* Address Popup */}
          <AddressPopup
            open={openAddressPopup}
            onClose={() => setOpenAddressPopup(false)}
            initialAddress={address}
            onSave={(newAddr) => {
              const fullAddress = `${newAddr.building}, ${newAddr.locality}, ${newAddr.city}`;
              setAddress({ ...newAddr, full: fullAddress });
              handleChange("address", fullAddress);
              setOpenAddressPopup(false);
            }}
          />
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <button className="w-full uppercase py-2 bg-[#5B2DCC] text-white text-md rounded-xs active:scale-95 transition">
          Save Changes
        </button>
      </div>

      {/* Business Category Popup */}
      {showBusinessPopup && (
        <BusinessTypePopup
          onClose={() => setShowBusinessPopup(false)}
          onSave={(data) => handleChange("category", data.label)}
        />
      )}
    </div>
  );
}
