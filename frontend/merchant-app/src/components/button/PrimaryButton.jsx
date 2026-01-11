// src/components/Button.jsx
import React from "react";

// We renamed it to 'PrimaryButton' to signify it's the main action button
function PrimaryButton({
  label,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) {
  // Define our brand red and a secondary style
  const baseStyles =
    "w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] duration-200";

  const variants = {
    primary: "bg-[#D32F2F] text-white shadow-red-200 hover:bg-red-700",
    outline:
      "border-2 border-[#D32F2F] text-[#D32F2F] bg-white hover:bg-red-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}>
      {label}
    </button>
  );
}

export default PrimaryButton;
