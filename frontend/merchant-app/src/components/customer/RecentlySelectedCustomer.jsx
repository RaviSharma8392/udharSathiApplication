const RecentlySelectedCustomer = ({ recentCustomers, handleSelect }) => {
  return (
    <div className="mt-5 bg-gray-50 rounded-lg p-4">
      <p className="text-sm font-semibold text-gray-900 mb-3">
        Recently Selected
      </p>

      <div className="grid grid-cols-4 gap-3">
        {recentCustomers.slice(0, 4).map((c) => (
          <div
            key={c.id}
            onClick={() => handleSelect(c)}
            className="bg-white rounded-xl p-3 flex flex-col items-center
                       cursor-pointer active:scale-95 transition">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {c.name?.charAt(0)?.toUpperCase()}
            </div>

            <p className="text-xs font-semibold text-gray-900 mt-2 truncate">
              {c.name.split(" ")[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlySelectedCustomer;
