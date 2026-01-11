const SelectedCustomerBar = ({ customer, onContinue }) => {
  if (!customer) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 shadow-lg">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <div>
          <p className="text-xs text-gray-500">Selected</p>
          <p className="text-sm font-semibold">{customer.name}</p>
        </div>

        <button
          onClick={onContinue}
          className="bg-emerald-500 text-white px-6 py-2 rounded-xl
                     text-sm font-semibold active:scale-95 transition">
          Continue →
        </button>
      </div>
    </div>
  );
};

export default SelectedCustomerBar;
