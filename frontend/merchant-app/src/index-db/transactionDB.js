const DB_NAME = "UdharSathiDB";
const DB_VERSION = 1;

let db; // native IndexedDB instance

// Open DB
export function openDatabase() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Customers store
      if (!database.objectStoreNames.contains("customers")) {
        const store = database.createObjectStore("customers", { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("phone", "phone", { unique: false });
      }

      // Transactions store
      if (!database.objectStoreNames.contains("transactions")) {
        const store = database.createObjectStore("transactions", { keyPath: "id" });
        store.createIndex("customerId", "customerId", { unique: false });
        store.createIndex("date", "date", { unique: false });
        store.createIndex("type", "type", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => reject(event.target.error);
  });
}

/* ================================
   ADD TRANSACTION
================================ */
export function addTransaction(txData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!txData?.customerId) throw new Error("customerId is required");
      if (!["UDHAR", "PAYMENT"].includes(txData.type))
        throw new Error("Invalid transaction type");
      if (txData.amount == null) throw new Error("Transaction amount is required");

      const database = await openDatabase();

      const customerId = Number(txData.customerId);
      const amount = Number(txData.amount);
      const balanceBefore = Number(txData.balanceBefore ?? 0);

      let balanceAfter = balanceBefore;
      if (txData.type === "UDHAR") balanceAfter += amount;
      if (txData.type === "PAYMENT") balanceAfter -= amount;

      const transactionId = `TX-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const tx = database.transaction("transactions", "readwrite");
      const store = tx.objectStore("transactions");

      const request = store.add({
        id: transactionId,
        customerId,
        type: txData.type,
        amount,
        balanceBefore,
        balanceAfter,
        date: new Date().toISOString(),
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ================================
   GET TRANSACTIONS BY CUSTOMER
================================ */
export function getTransactionsByCustomer(customerId) {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await openDatabase();
      const tx = database.transaction("transactions", "readonly");
      const store = tx.objectStore("transactions");
      const index = store.index("customerId");

      const request = index.getAll(Number(customerId));
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ================================
   GET RECENT TRANSACTIONS
================================ */
export function getRecentTransactions(limit = 10) {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await openDatabase();
      const results = [];

      // Load customers first to avoid multiple async calls
      const customerTx = database.transaction("customers", "readonly");
      const customerStore = customerTx.objectStore("customers");
      const customerRequest = customerStore.getAll();

      customerRequest.onsuccess = async () => {
        const customersArray = customerRequest.result;
        const customerMap = {};
        customersArray.forEach((c) => (customerMap[c.id] = c));

        // Transactions
        const tx = database.transaction("transactions", "readonly");
        const store = tx.objectStore("transactions");
        const cursorRequest = store.openCursor(null, "prev");

        cursorRequest.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor && results.length < limit) {
            const txData = cursor.value;
            const customer = customerMap[txData.customerId];

            results.push({
              ...txData,
              customerName: customer?.name || "Unknown",
              customerPhone: customer?.phone || "N/A",
            });

            cursor.continue();
          } else {
            resolve(results);
          }
        };

        cursorRequest.onerror = (e) => reject(e.target.error);
      };

      customerRequest.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ================================
   CALCULATE TOTALS
================================ */
export function calculateTotals({ type = "ALL", customerId } = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await openDatabase();
      let totalUdhar = 0;
      let totalPayment = 0;
      customerId = customerId != null ? Number(customerId) : null;

      const now = new Date();
      let fromDate = null;

      if (type === "TODAY") fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      else if (type === "LAST_7_DAYS")
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else if (type === "LAST_MONTH") fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      else if (type === "LAST_YEAR") fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

      const tx = database.transaction("transactions", "readonly");
      const store = tx.objectStore("transactions");
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const txData = cursor.value;

          if (!customerId || txData.customerId === customerId) {
            const txDate = new Date(txData.date);
            if (!isNaN(txDate) && (!fromDate || txDate >= fromDate)) {
              const amt = Number(txData.amount) || 0;
              if (txData.type === "UDHAR") totalUdhar += amt;
              if (txData.type === "PAYMENT") totalPayment += amt;
            }
          }

          cursor.continue();
        } else {
          resolve({ totalUdhar, totalPayment });
        }
      };

      cursorRequest.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}


const PAGE_SIZE = 7;

/**
 * Get paginated transactions for a customer
 * @param {string|number} customerId
 * @param {any} lastCursor - last cursor key from previous page
 */
export function getCustomerTransactionsPaginated(customerId, lastCursor = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const transactions = [];

      // Load all customers
      const customerTx = db.transaction("customers", "readonly");
      const customerStore = customerTx.objectStore("customers");
      const getAllCustReq = customerStore.getAll();

      getAllCustReq.onsuccess = () => {
        const customerMap = {};
        getAllCustReq.result.forEach(c => customerMap[c.id] = c);

        // Transactions
        const tx = db.transaction("transactions", "readonly");
        const txStore = tx.objectStore("transactions");
        const index = txStore.index("customerId");

        const range = IDBKeyRange.only(Number(customerId));
        const cursorRequest = index.openCursor(range, "prev");

        let lastKey = null;

        cursorRequest.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor && transactions.length < PAGE_SIZE) {
            const txData = cursor.value;
            lastKey = cursor.key;

            const customer = customerMap[txData.customerId];
            transactions.push({
              ...txData,
              customerName: customer?.name || "Unknown",
              customerPhone: customer?.phone || "N/A"
            });

            cursor.continue();
          } else {
            resolve({
              transactions,
              lastCursor: lastKey,
              hasMore: transactions.length === PAGE_SIZE
            });
          }
        };

        cursorRequest.onerror = (e) => reject(e.target.error);
      };

      getAllCustReq.onerror = (e) => reject(e.target.error);

    } catch (err) {
      reject(err);
    }
  });
}



/**
 * Get paginated transactions (global, all customers)
 * @param {number} limit - number of transactions per page
 * @param {number} offset - number of transactions to skip
 * @param {"ALL"|"UDHAR"|"PAYMENT"} type
 */
export function getTransactionsPaginated(limit = 10, offset = 0, type = "ALL") {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const results = [];
      let skipped = 0;

      // 1️⃣ Load all customers first
      const customerTx = db.transaction("customers", "readonly");
      const customerStore = customerTx.objectStore("customers");
      const customerReq = customerStore.getAll();

      customerReq.onsuccess = () => {
        const customerMap = {};
        customerReq.result.forEach(c => (customerMap[c.id] = c));

        // 2️⃣ Transactions cursor
        const tx = db.transaction(["transactions"], "readonly");
        const txStore = tx.objectStore("transactions");
        const cursorReq = txStore.openCursor(null, "prev"); // newest first

        cursorReq.onsuccess = (e) => {
          const cursor = e.target.result;
          if (!cursor || results.length >= limit) {
            return resolve(results);
          }

          const txData = cursor.value;

          // Filter type
          if (type === "ALL" || txData.type === type) {
            if (skipped < offset) {
              skipped++;
            } else {
              const customer = customerMap[txData.customerId];
              results.push({
                ...txData,
                customerName: customer?.name || "Unknown",
                customerPhone: customer?.phone || "N/A"
              });
            }
          }

          cursor.continue();
        };

        cursorReq.onerror = (e) => reject(e.target.error);
      };

      customerReq.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}
 