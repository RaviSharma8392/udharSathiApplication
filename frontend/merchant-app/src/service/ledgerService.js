import { getTransactionsByCustomer } from "../index-db/transactionDB"

export async function getCustomerLedger(customerId) {
  const txs = await getTransactionsByCustomer(customerId);

  const balance = txs.reduce(
    (sum, tx) => (tx.type === "GIVE" ? sum + tx.amount : sum - tx.amount),
    0
  );

  return {
    transactions: txs,
    balance,
  };
}
