function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-1 text-sm">
          {label}
        </label>
      )}

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm
          focus:outline-none focus:ring-2 focus:ring-yellow-400
          disabled:bg-gray-100"
      />
    </div>
  );
}

export default InputField;
