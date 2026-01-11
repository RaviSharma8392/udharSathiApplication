function InputField({ label, type = "text", placeholder }) {
  return (
    <div className="mb-4">
      {" "}
      <label className="block text-gray-700 font-medium mb-1 text-sm">
        {" "}
        {label}{" "}
      </label>{" "}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
      />{" "}
    </div>
  );
}
export default InputField;
