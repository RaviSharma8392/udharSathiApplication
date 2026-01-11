import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchCustomer({ value = "", onChange, lang = "hi" }) {
  const placeholder = lang === "hi" ? "ग्राहक खोजें..." : "Search customer...";

  return (
    <div className="px-4 py-2">
      <div className="flex items-center bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
        {/* Search Icon */}
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

export default SearchCustomer;
