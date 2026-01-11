import { dbPromise } from "./index";

/**
 * Add a transaction with dynamic transaction ID
 * Minimal storage: only customerId, amount, type, balanceBefore, balanceAfter, date
 * @param {Object} txData - { customerId, type: "UDHAR"|"PAYMENT", amount, balanceBefore }
 */
export async function addTransaction(txData) {
  const db = await dbPromise;

  if (!txData.customerId) throw new Error("customerId is required");
  if (!txData.type) throw new Error("Transaction type is required");
  if (txData.amount == null) throw new Error("Transaction amount is required");

  // 1️ Calculate balances if not already provided
  const balanceBefore = Number(txData.balanceBefore ?? 0);
  const amount = Number(txData.amount);

  let balanceAfter = balanceBefore;
  if (txData.type === "UDHAR") balanceAfter += amount;
  else if (txData.type === "PAYMENT") balanceAfter -= amount;

  // 2 Generate dynamic transaction ID
  const timestamp = Date.now(); // milliseconds
  const random2Digits = Math.floor(Math.random() * 90 + 10); // 10-99
  const transactionId = `TX-${timestamp}-${txData.customerId}-${random2Digits}`;

  // 3️ Save minimal transaction
  return db.add("transactions", {
    id: transactionId,
    customerId: txData.customerId,
    type: txData.type,
    amount,
    balanceBefore,
    balanceAfter,
    date: new Date().toISOString(),
  });
}


// GET TRANSACTIONS BY CUSTOMER
export async function getTransactionsByCustomer(customerId) {
  const db = await dbPromise;

  return db.getAllFromIndex(
    "transactions",
    "customerId",
    Number(customerId)
  );
}


// GET RECENT TRANSACTIONS (with customer info)


export async function getRecentTransactions(limit = 10) {
  const db = await dbPromise;
  const results = [];

  let cursor = await db
    .transaction(["transactions", "customers"])
    .objectStore("transactions")
    .openCursor(null, "prev");

  while (cursor && results.length < limit) {
    const tx = cursor.value;
    const customer =
      (await db.get("customers", tx.customerId)) || {};

    results.push({
      ...tx,
      customerName: customer.name || "Unknown",
      customerPhone: customer.phone || "N/A",
    });

    cursor = await cursor.continue();
  }

  return results;
}


// CALCULATE TOTALS (FAST & CLEAN)

export async function calculateTotals({ type = "ALL", customerId } = {}) {
  const db = await dbPromise;

  let totalUdhar = 0;
  let totalPayment = 0;

  const now = new Date();
  let fromDate = null;

  if (type === "TODAY")
    fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  else if (type === "LAST_7_DAYS")
    fromDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
  else if (type === "LAST_MONTH")
    fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  else if (type === "LAST_YEAR")
    fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  let cursor = await db
    .transaction("transactions")
    .objectStore("transactions")
    .openCursor();

  while (cursor) {
    const tx = cursor.value;

    if (!customerId || tx.customerId === customerId) {
      const txDate = new Date(tx.date || tx.createdAt);
      if (!fromDate || txDate >= fromDate) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === "UDHAR") totalUdhar += amt;
        if (tx.type === "PAYMENT") totalPayment += amt;
      }
    }

    cursor = await cursor.continue();
  }

  return { totalUdhar, totalPayment };
}
// PAGINATED TRANSACTIONS


export async function getTransactionsPaginated(
  limit = 10,
  offset = 0,
  type = "ALL"
) {
  const db = await dbPromise;
  const results = [];
  let skipped = 0;

  let cursor = await db
    .transaction(["transactions", "customers"])
    .objectStore("transactions")
    .openCursor(null, "prev");

  while (cursor && results.length < limit) {
    const tx = cursor.value;

    if (type === "ALL" || tx.type === type) {
      if (skipped < offset) {
        skipped++;
      } else {
        const customer =
          (await db.get("customers", tx.customerId)) || {};

        results.push({
          ...tx,
          customerName: customer.name || "Unknown",
          customerPhone: customer.phone || "N/A",
        });
      }
    }

    cursor = await cursor.continue();
  }

  return results;
}


// Number of transactions per page
const PAGE_SIZE = 7;

/**
 * Get paginated transactions for a customer
 * @param {number} customerId - The customer ID
 * @param {any} lastCursor - last transaction key from previous page
 * @returns {Promise<{transactions: Array, lastCursor: any, hasMore: boolean}>}
 */
export async function getCustomerTransactionsPaginated(customerId, lastCursor = null) {
  const db = await dbPromise;
  const tx = db.transaction(["transactions", "customers"], "readonly");
  const txStore = tx.objectStore("transactions");
  const customerStore = tx.objectStore("customers");
  const index = txStore.index("customerId");

  const transactions = [];
  let cursor = await index.openCursor(IDBKeyRange.only(customerId), "prev"); // latest first

  // Skip until lastCursor
  if (lastCursor) {
    while (cursor && cursor.key !== lastCursor) {
      cursor = await cursor.continue();
    }
    if (cursor) cursor = await cursor.continue();
  }

  // Collect PAGE_SIZE items
  while (cursor && transactions.length < PAGE_SIZE) {
    const txData = cursor.value;

    // Get customer info
    const customer = await customerStore.get(txData.customerId);
    transactions.push({
      ...txData,
      customerName: customer?.name || "Unknown",
      customerPhone: customer?.phone || "N/A",
    });

    cursor = await cursor.continue();
  }

  await tx.done;

  return {
    transactions,
    lastCursor: transactions.length ? cursor?.key ?? null : null,
    hasMore: transactions.length === PAGE_SIZE,
  };
}
