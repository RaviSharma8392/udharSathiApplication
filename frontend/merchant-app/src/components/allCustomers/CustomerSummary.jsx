function CustomerSummary() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl p-4">
      <p className="text-sm opacity-90">Net Balance</p>
      <p className="text-2xl font-bold mt-1">₹ 2,500</p>
      <p className="text-xs opacity-90 mt-1">You will receive this amount</p>
    </div>
  );
}

export default CustomerSummary;
