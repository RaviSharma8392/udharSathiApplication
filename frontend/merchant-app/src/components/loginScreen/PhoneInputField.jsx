function PhoneInputField({ label, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1 text-sm">
        {label}
      </label>

      <div className="flex items-center border border-blue-500 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-yellow-400">
        {/* Country Code */}
        <span className="text-gray-800 font-medium text-sm mr-2">+91</span>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-300 mr-3"></div>

        {/* Input */}
        <input
          type="tel"
          placeholder={placeholder}
          className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>
    </div>
  );
}

export default PhoneInputField;
