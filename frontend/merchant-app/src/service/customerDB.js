const DB_NAME = "UdharSathiDB";
const DB_VERSION = 1;
const STORE_NAME = "customers";

export function openCustomerDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        store.createIndex("name", "name");
        store.createIndex("phone", "phone", { unique: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to open IndexedDB");
  });
}

export async function addCustomerToDB(customer) {
  const db = await openCustomerDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const request = store.add({
      ...customer,
      createdAt: new Date().toISOString(),
    });

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject("Failed to add customer");
  });
}

export async function getCustomerById(id) {
  const db = await openCustomerDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const request = store.get(id);

    request.onsuccess = () => {
      if (request.result) resolve(request.result);
      else resolve(null); // return null if customer not found
    };

    request.onerror = () => reject("Failed to get customer");
  });
}
