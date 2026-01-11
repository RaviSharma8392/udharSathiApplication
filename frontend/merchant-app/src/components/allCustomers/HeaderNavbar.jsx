function CustomerHeader({ customer }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-lg font-semibold text-gray-900">{customer.name}</p>
      <p className="text-sm text-gray-500">{customer.phone}</p>

      <div className="mt-2 flex gap-2">
        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
          Customer
        </span>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          Since {new Date(customer.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default CustomerHeader;
