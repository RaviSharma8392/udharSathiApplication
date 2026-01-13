const DB_NAME = "UdharSathiAppDB";
const DB_VERSION = 1;

let db; // native IDBDatabase instance

/**
 * Open IndexedDB
 */
export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
    };

    request.onsuccess = (event) => {
      const database = event.target.result;

      database.onversionchange = () => {
        database.close();
        db = null;
      };

      db = database;
      resolve(database);
    };

    request.onerror = () => reject(request.error);
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
