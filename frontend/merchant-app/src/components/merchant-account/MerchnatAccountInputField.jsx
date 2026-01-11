import { User, Store, Phone } from "lucide-react";

const MerchantAccountInputField = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder,
  variant = "user",
}) => {
  const Icon =
    variant === "business" ? Store : variant === "phone" ? Phone : User;

  return (
    <div className="space-y-1">
      {/* Label */}
      <label className="ml-1 text-[10px] font-medium tracking-wide text-gray-500 uppercase">
        {label}
      </label>

      {/* Input Box */}
      <div
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg border
          bg-white border-gray-300
        `}>
        {/* Icon */}
        <Icon
          size={18} // slightly bigger icon
          className={disabled ? "text-gray-300" : "text-gray-400"}
        />

        {/* Input */}
        <input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`
            flex-1 bg-transparent outline-none text-sm
            font-sans text-gray-900
            placeholder:text-gray-400
          `}
        />
      </div>
    </div>
  );
};

export default MerchantAccountInputField;
