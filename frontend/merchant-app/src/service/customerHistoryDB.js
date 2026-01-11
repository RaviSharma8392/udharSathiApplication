const DB_NAME = "UdharSathiDB";
const DB_VERSION = 2;
const CUSTOMER_STORE = "customers";
const TRANSACTION_STORE = "transactions";

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(CUSTOMER_STORE)) {
        const store = db.createObjectStore(CUSTOMER_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("name", "name");
        store.createIndex("phone", "phone", { unique: true });
      }

      if (!db.objectStoreNames.contains(TRANSACTION_STORE)) {
        const store = db.createObjectStore(TRANSACTION_STORE, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("customerId", "customerId");
        store.createIndex("date", "date");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to open IndexedDB");
  });
}


// Add transaction
export async function addTransaction(transaction) {
  const db = await openDatabase();
  return db.add(TRANSACTION_STORE, {
    ...transaction,
    date: new Date().toISOString(),
  });
}

// Get customer history
export async function getCustomerHistory(customerId) {
  const db = await openDatabase();
  const allTx = await db.getAll(TRANSACTION_STORE);
  // Filter by customerId and sort by date
  return allTx
    .filter((tx) => tx.customerId === customerId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}