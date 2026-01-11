import { addTransaction } from "../index-db/transactionDB";

export async function addPayment({
  customerId,
  amount,
  type,
  note = "",
  balanceAfter,
}) {
  return addTransaction({
    customerId,
    amount,
    type, // GIVE | GET
    note,
    date: new Date().toISOString(),
    balanceAfter,
  });
}
