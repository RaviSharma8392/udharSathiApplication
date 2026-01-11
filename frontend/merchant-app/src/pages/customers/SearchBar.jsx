import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="mt-4 flex items-center bg-gray-50 rounded-2xl px-3 py-2">
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
      <input
        placeholder="Search by name or number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm outline-none bg-transparent"
      />
    </div>
  );
};

export default SearchBar;
