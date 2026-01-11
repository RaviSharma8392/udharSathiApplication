import CustomerCard from "./CustomerCard";

const CustomerList = ({
  customers,
  selectedCustomer,
  onSelect,
  onAddPayment,
  onAddUdhar,
}) => {
  return (
    <div className="mt-6">
      <p className="text-xs text-gray-500 mb-3">All Customers</p>

      {customers.map((c) => (
        <CustomerCard
          key={c.id}
          customer={c}
          isSelected={selectedCustomer?.id === c.id}
          onSelect={onSelect}
          onAddPayment={onAddPayment}
          onAddUdhar={onAddUdhar}
        />
      ))}
    </div>
  );
};

export default CustomerList;
