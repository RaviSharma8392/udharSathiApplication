const DB_NAME = "UdharSathiDB";
const DB_VERSION = 1;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains("customers")) {
        db.createObjectStore("customers", {
          keyPath: "id",
          autoIncrement: true,
        });
      }

      if (!db.objectStoreNames.contains("transactions")) {
        const store = db.createObjectStore("transactions", {
          keyPath: "id",
          autoIncrement: true,
        });

        store.createIndex("customerId", "customerId", { unique: false });
        store.createIndex("date", "date");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to open DB");
  });
}
