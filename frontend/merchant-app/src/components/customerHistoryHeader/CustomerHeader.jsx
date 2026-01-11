import React from "react";
import { FaArrowLeft, FaWhatsapp, FaSms, FaPhoneAlt } from "react-icons/fa";

export default function CustomerHeader({ customer, balance, lang }) {
  const goBack = () => window.history.back();
  const callCustomer = () => window.open(`tel:${customer.phone}`, "_self");
  const sendWhatsApp = () =>
    window.open(`https://wa.me/${customer.phone.replace("+", "")}`, "_blank");
  const sendSMS = () => window.open(`sms:${customer.phone}`, "_self");

  const isPositive = balance >= 0;

  return (
    <div className="  bg-[#4A1FB8] px-4 pt-4 pb-5  ">
      {/* HEADER ROW */}
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Back */}
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 active:scale-95">
            <FaArrowLeft className="text-white text-sm" />
          </button>

          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5B2DCC] font-bold text-sm shadow">
            {customer.name?.[0]?.toUpperCase()}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#5B2DCC] rounded-full" />
          </div>

          {/* Name + Balance */}
          <div className="leading-tight">
            <p className="text-white text-sm font-semibold">{customer.name}</p>
            <p
              className={`text-xs font-semibold ${
                isPositive ? "text-emerald-300" : "text-red-300"
              }`}>
              {isPositive ? "You will get" : "You will give"} ₹
              {Math.abs(balance).toLocaleString()}
            </p>
          </div>
        </div>

        {/* CALL */}
        <button
          onClick={callCustomer}
          className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg active:scale-95">
          <FaPhoneAlt className="text-white text-sm" />
        </button>
      </div>

      {/* ACTIONS */}
      {!balance === 0 && (
        <div className="flex gap-3 mt-5">
          <button
            onClick={sendWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl text-sm font-semibold shadow-md active:scale-95">
            <FaWhatsapp className="text-base" />
            WhatsApp
          </button>

          <button
            onClick={sendSMS}
            className="flex-1 flex items-center justify-center gap-2 bg-[#3B82F6] text-white py-2.5 rounded-xl text-sm font-semibold shadow-md active:scale-95">
            <FaSms className="text-base" />
            SMS
          </button>
        </div>
      )}
    </div>
  );
}
