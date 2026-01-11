import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Send, Download, UserPlus } from "lucide-react";

// Reusable Action Button
const Action = ({ icon, label, color = "#2F4CD1", onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 bg-white rounded-xl py-3 px-4 shadow hover:shadow-lg hover:scale-105 transition-transform duration-200">
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ backgroundColor: color + "20", color }}>
      {icon}
    </div>
    <span className="text-sm font-medium text-gray-800">{label}</span>
  </button>
);

// Main Component with Action Buttons Grid
const ActionButtonsGrid = ({ language = "en" }) => {
  const navigate = useNavigate();

  // Multi-language labels
  const texts = {
    en: {
      addPayment: "Add Payment",
      sendRemind: "Send Remind",
      addUdhar: "Add Udhar",
      addCustomer: "Add Customer",
    },
    ta: {
      addPayment: "பணம் சேர்க்கவும்",
      sendBill: "பில் அனுப்பு",
      addUdhar: "உधார் சேர்க்கவும்",
      addCustomer: "புதிய வாடிக்கையாளர் சேர்க்கவும்",
    },
    hi: {
      addPayment: "भुगतान जोड़ें",
      sendBill: "बिल भेजें",
      addUdhar: "उधार जोड़ें",
      addCustomer: "ग्राहक जोड़ें",
    },
  };

  const t = texts[language];

  // Action buttons data with meaningful icons
  const actions = [
    {
      icon: <CreditCard />,
      label: t.addPayment,
      color: "#2F4CD1",
      onClick: () => navigate("/add-payment"),
    },
    {
      icon: <Send />,
      label: t.sendRemind,
      color: "#16A34A",
      onClick: () => navigate("/customers-remind"),
    },
    {
      icon: <Download />,
      label: t.addUdhar,
      color: "#F59E0B",
      onClick: () => navigate("/add-udhar"),
    },
    {
      icon: <UserPlus />,
      label: t.addCustomer,
      color: "#EF4444",
      onClick: () => navigate("/add-customer"),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
      {actions.map((action, idx) => (
        <Action
          key={idx}
          icon={action.icon}
          label={action.label}
          color={action.color}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
};

export default ActionButtonsGrid;
