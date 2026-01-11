import { openDB } from "idb";

export const DB_NAME = "UdharSathiDB";
export const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("customers")) {
      db.createObjectStore("customers", { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains("transactions")) {
      const store = db.createObjectStore("transactions", { keyPath: "id", autoIncrement: true });
      store.createIndex("customerId", "customerId");
      store.createIndex("date", "date");
    }
  },
});
