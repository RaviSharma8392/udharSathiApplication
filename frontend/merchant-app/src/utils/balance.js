export function calculateBalanceAfter({
  currentBalance,
  amount,
  type,
}) {
  if (type === "UDHAR") {
    return currentBalance + amount;
  }

  if (type === "PAYMENT") {
    return currentBalance - amount;
  }

  return currentBalance; // fallback safety
}
