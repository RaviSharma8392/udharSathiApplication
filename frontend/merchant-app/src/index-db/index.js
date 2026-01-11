import { openDB } from "idb";

export const DB_NAME = "UdharSathiDB";
export const DB_VERSION = 1;

// Open DB and create stores
export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Customers store
    if (!db.objectStoreNames.contains("customers")) {
      const store = db.createObjectStore("customers", {
        keyPath: "id", // dynamic generated ID
      });
      store.createIndex("name", "name");
      store.createIndex("phone", "phone");
    }

    // Transactions store
    if (!db.objectStoreNames.contains("transactions")) {
      const store = db.createObjectStore("transactions", {
        keyPath: "id", // transaction ID (dynamic)
      });
      store.createIndex("customerId", "customerId");
      store.createIndex("date", "date");
      store.createIndex("type", "type");
    }
  },
});

/**
 * Add a new customer with dynamic ID
 * @param {Object} customer - { name: string, phone?: string, balance?: number }
 */
export async function addCustomer(customer) {
  if (!customer.name) throw new Error("Customer name is mandatory");

  const db = await dbPromise;

  // Generate dynamic long ID: CUS-{timestamp}-{random4}
  const timestamp = Date.now(); // milliseconds
  const random4 = Math.floor(Math.random() * 9000 + 1000); // 1000-9999
  const customerId = `CUS-${timestamp}-${random4}`;

  const newCustomer = {
    id: customerId,
    name: customer.name,
    phone: customer.phone || null,
    balance: Number(customer.balance || 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.add("customers", newCustomer);

  return newCustomer;
}


