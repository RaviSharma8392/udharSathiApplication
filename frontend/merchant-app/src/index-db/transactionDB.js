import { dbPromise } from "./index";

/**
 * Add a transaction
 * @param {Object} txData
 * @param {number} txData.customerId
 * @param {"UDHAR"|"PAYMENT"} txData.type
 * @param {number} txData.amount
 * @param {number} [txData.balanceBefore]
 */
export async function addTransaction(txData) {
  const db = await dbPromise;

  if (!txData?.customerId) throw new Error("customerId is required");
  if (!["UDHAR", "PAYMENT"].includes(txData.type))
    throw new Error("Invalid transaction type");
  if (txData.amount == null) throw new Error("Transaction amount is required");

  const customerId = Number(txData.customerId);
  const amount = Number(txData.amount);
  const balanceBefore = Number(txData.balanceBefore ?? 0);

  let balanceAfter = balanceBefore;
  if (txData.type === "UDHAR") balanceAfter += amount;
  if (txData.type === "PAYMENT") balanceAfter -= amount;

  const transactionId = `TX-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  return db.add("transactions", {
    id: transactionId,
    customerId,
    type: txData.type,
    amount,
    balanceBefore,
    balanceAfter,
    date: new Date().toISOString(),
  });
}

/* ================================
   GET TRANSACTIONS BY CUSTOMER
================================ */

export async function getTransactionsByCustomer(customerId) {
  const db = await dbPromise;
  return db.getAllFromIndex(
    "transactions",
    "customerId",
    Number(customerId)
  );
}

/* ================================
   GET RECENT TRANSACTIONS
================================ */

// export async function getRecentTransactions(limit = 10) {
//   const db = await dbPromise;
//   const results = [];

//   let cursor = await db
//     .transaction(["transactions", "customers"], "readonly")
//     .objectStore("transactions")
//     .openCursor(null, "prev");

//   while (cursor && results.length < limit) {
//     const tx = cursor.value;
//     const customer = (await db.get("customers", tx.customerId)) || {};

//     results.push({
//       ...tx,
//       customerName: customer.name || "Unknown",
//       customerPhone: customer.phone || "N/A",
//     });

//     cursor = await cursor.continue();
//   }

//   return results;
// }
// export async function getRecentTransactions(limit = 10) {
//   const db = await dbPromise;
//   const results = [];

//   const transaction = db.transaction(
//     ["transactions", "customers"],
//     "readonly"
//   );

//   const txStore = transaction.objectStore("transactions");
//   const customerStore = transaction.objectStore("customers");

//   let cursor = await txStore.openCursor(null, "prev");

//   while (cursor && results.length < limit) {
//     const tx = cursor.value;

//     // ✅ SAFE: same transaction
//     const customer = await customerStore.get(tx.customerId);

//     results.push({
//       ...tx,
//       customerName: customer?.name || "Unknown",
//       customerPhone: customer?.phone || "N/A",
//     });

//     cursor = await cursor.continue();
//   }

//   await transaction.done;
//   return results;
// }
export async function getRecentTransactions(limit = 10) {
  const db = await dbPromise;
  const results = [];

  const transaction = db.transaction(
    ["transactions", "customers"],
    "readonly"
  );

  const txStore = transaction.objectStore("transactions");
  const customerStore = transaction.objectStore("customers");

  let cursor = await txStore.openCursor(null, "prev");

  while (cursor && results.length < limit) {
    const tx = cursor.value;

    // ✅ SAME TRANSACTION → SAFE
    const customer = await customerStore.get(tx.customerId);

    results.push({
      ...tx,
      customerName: customer?.name || "Unknown",
      customerPhone: customer?.phone || "N/A",
    });

    cursor = await cursor.continue();
  }

  await transaction.done;
  return results;
}

export async function getTodayTransactions(limit = 10) {
  const db = await dbPromise;
  const results = [];

  const transaction = db.transaction(
    ["transactions", "customers"],
    "readonly"
  );

  const txStore = transaction.objectStore("transactions");
  const customerStore = transaction.objectStore("customers");

  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  let cursor = await txStore.openCursor(null, "prev");

  while (cursor && results.length < limit) {
    const tx = cursor.value;
    const txDate = new Date(tx.date);

    if (txDate >= startOfDay) {
      const customer = await customerStore.get(tx.customerId);
      results.push({
        ...tx,
        customerName: customer?.name || "Unknown",
        customerPhone: customer?.phone || "N/A",
      });
    }

    cursor = await cursor.continue();
  }

  await transaction.done;
  return results;
}



/* ================================
   CALCULATE TOTALS
================================ */

export async function calculateTotals({ type = "ALL", customerId } = {}) {
  const db = await dbPromise;

  let totalUdhar = 0;
  let totalPayment = 0;

  customerId = customerId != null ? Number(customerId) : null;

  const now = new Date();
  let fromDate = null;

  if (type === "TODAY")
    fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  else if (type === "LAST_7_DAYS")
    fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  else if (type === "LAST_MONTH")
    fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  else if (type === "LAST_YEAR")
    fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  let cursor = await db
    .transaction("transactions", "readonly")
    .objectStore("transactions")
    .openCursor();

  while (cursor) {
    const tx = cursor.value;

    if (!customerId || tx.customerId === customerId) {
      const txDate = new Date(tx.date);
      if (!isNaN(txDate) && (!fromDate || txDate >= fromDate)) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === "UDHAR") totalUdhar += amt;
        if (tx.type === "PAYMENT") totalPayment += amt;
      }
    }

    cursor = await cursor.continue();
  }

  return { totalUdhar, totalPayment };
}

/* ================================
   PAGINATED TRANSACTIONS (GLOBAL)
================================ */

// export async function getTransactionsPaginated(
//   limit = 10,
//   offset = 0,
//   type = "ALL"
// ) {
//   const db = await dbPromise;
//   const results = [];
//   let skipped = 0;

//   let cursor = await db
//     .transaction(["transactions", "customers"], "readonly")
//     .objectStore("transactions")
//     .openCursor(null, "prev");

//   while (cursor && results.length < limit) {
//     const tx = cursor.value;

//     if (type === "ALL" || tx.type === type) {
//       if (skipped < offset) {
//         skipped++;
//       } else {
//         const customer = (await db.get("customers", tx.customerId)) || {};
//         results.push({
//           ...tx,
//           customerName: customer.name || "Unknown",
//           customerPhone: customer.phone || "N/A",
//         });
//       }
//     }

//     cursor = await cursor.continue();
//   }

//   return results;
// }

/* ================================
   CUSTOMER PAGINATION (CURSOR)
================================ */

const PAGE_SIZE = 7;

/**
 * Get paginated transactions for a customer
 * @param {number} customerId
 * @param {any} lastCursor
 */
export async function getCustomerTransactionsPaginated(
  customerId,
  lastCursor = null
) {
  const db = await dbPromise;
  const transaction = db.transaction(
    ["transactions", "customers"],
    "readonly"
  );

  const txStore = transaction.objectStore("transactions");
  const customerStore = transaction.objectStore("customers");
  const index = txStore.index("customerId");

  const transactions = [];
  let lastKey = null;

  let cursor = await index.openCursor(
    IDBKeyRange.only(Number(customerId)),
    "prev"
  );

  if (lastCursor) {
    while (cursor && cursor.key !== lastCursor) {
      cursor = await cursor.continue();
    }
    if (cursor) cursor = await cursor.continue();
  }

  while (cursor && transactions.length < PAGE_SIZE) {
    lastKey = cursor.key;

    const txData = cursor.value;
    const customer = await customerStore.get(txData.customerId);

    transactions.push({
      ...txData,
      customerName: customer?.name || "Unknown",
      customerPhone: customer?.phone || "N/A",
    });

    cursor = await cursor.continue();
  }

  await transaction.done;

  return {
    transactions,
    lastCursor: lastKey,
    hasMore: transactions.length === PAGE_SIZE,
  };
}
export async function getTransactionsPaginated(
  limit = 10,
  offset = 0,
  type = "ALL"
) {
  const db = await dbPromise;
  const results = [];
  let skipped = 0;

  const transaction = db.transaction(
    ["transactions", "customers"],
    "readonly"
  );

  const txStore = transaction.objectStore("transactions");
  const customerStore = transaction.objectStore("customers");

  let cursor = await txStore.openCursor(null, "prev");

  while (cursor && results.length < limit) {
    const tx = cursor.value;

    if (type === "ALL" || tx.type === type) {
      if (skipped < offset) {
        skipped++;
      } else {
        // ✅ SAFE: same transaction, no db.get
        const customer = await customerStore.get(tx.customerId);

        results.push({
          ...tx,
          customerName: customer?.name || "Unknown",
          customerPhone: customer?.phone || "N/A",
        });
      }
    }

    cursor = await cursor.continue();
  }

  await transaction.done;
  return results;
}
