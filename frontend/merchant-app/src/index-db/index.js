const DB_NAME = "UdharSathiDB";
const DB_VERSION = 1;

let db; // native IDBDatabase instance

/**
 * Open IndexedDB
 */
export function openDatabase() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db); // already opened

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

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Add a new customer
 * @param {Object} customer { name: string, phone?: string, balance?: number }
 * @returns {Promise<Object>} the added customer
 */
export function addCustomer(customer) {
  return new Promise(async (resolve, reject) => {
    if (!customer.name) return reject(new Error("Customer name is mandatory"));

    try {
      const database = await openDatabase();

      const tx = database.transaction("customers", "readwrite");
      const store = tx.objectStore("customers");

      // Generate ID
      const timestamp = Date.now();
      const random4 = Math.floor(Math.random() * 9000 + 1000);
      const customerId = `CUS-${timestamp}-${random4}`;

      const newCustomer = {
        id: customerId,
        name: customer.name,
        phone: customer.phone || null,
        balance: Number(customer.balance || 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const request = store.add(newCustomer);

      request.onsuccess = () => resolve(newCustomer);
      request.onerror = (event) => reject(event.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Example usage:
 * addCustomer({ name: "Ravi", phone: "9876543210" })
 *   .then(c => console.log("Added", c))
 *   .catch(err => console.error(err));
 */
