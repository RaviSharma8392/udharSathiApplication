function AddressField({
  label = "Address",
  name = "address",
  value,
  onChange,
  placeholder = "Enter address",
  rows = 3,
}) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
          focus:ring-2 focus:ring-[#2F4CD1] focus:border-transparent outline-none resize-none"
      />
    </div>
  );
}

export default AddressField;
