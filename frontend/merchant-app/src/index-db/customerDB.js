// transactionDB.js
export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UdharSathiDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("customers")) {
        const store = db.createObjectStore("customers", { keyPath: "id", autoIncrement: true });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("phone", "phone", { unique: false });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

/* ---------------- ADD CUSTOMER ---------------- */
export function addCustomer(customer) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction("customers", "readwrite");
      const store = tx.objectStore("customers");

      const now = new Date().toISOString();
      const newCustomer = {
        ...customer,
        balance: customer.balance ?? 0,
        createdAt: now,
        updatedAt: now,
      };

      const request = store.add(newCustomer);

      request.onsuccess = () => resolve(request.result); // returns generated id
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ---------------- GET CUSTOMER BY ID ---------------- */
export function getCustomerById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction("customers", "readonly");
      const store = tx.objectStore("customers");

      const request = store.get(Number(id));
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ---------------- GET ALL CUSTOMERS ---------------- */
export function getAllCustomers() {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction("customers", "readonly");
      const store = tx.objectStore("customers");

      const request = store.getAll();
      request.onsuccess = () => {
        const sorted = request.result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(sorted);
      };
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ---------------- UPDATE CUSTOMER ---------------- */
export function updateCustomer(id, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction("customers", "readwrite");
      const store = tx.objectStore("customers");

      const getRequest = store.get(Number(id));
      getRequest.onsuccess = () => {
        const existing = getRequest.result;
        if (!existing) return reject(new Error("Customer not found"));

        const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
        const putRequest = store.put(updated);

        putRequest.onsuccess = () => resolve(putRequest.result);
        putRequest.onerror = (e) => reject(e.target.error);
      };
      getRequest.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ---------------- UPDATE BALANCE ---------------- */
export function updateCustomerBalance(id, { amount, type }) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction("customers", "readwrite");
      const store = tx.objectStore("customers");

      const getRequest = store.get(Number(id));
      getRequest.onsuccess = () => {
        const customer = getRequest.result;
        if (!customer) return reject(new Error("Customer not found"));

        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0)
          return reject(new Error("Invalid amount"));

        if (type === "UDHAR") customer.balance += numericAmount;
        else if (type === "PAYMENT") customer.balance -= numericAmount;
        else return reject(new Error("Invalid transaction type"));

        customer.updatedAt = new Date().toISOString();
        const putRequest = store.put(customer);

        putRequest.onsuccess = () => resolve(putRequest.result);
        putRequest.onerror = (e) => reject(e.target.error);
      };
      getRequest.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ---------------- DELETE CUSTOMER ---------------- */
export function deleteCustomerById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction("customers", "readwrite");
      const store = tx.objectStore("customers");

      const request = store.delete(Number(id));
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}

/* ---------------- SEARCH CUSTOMERS ---------------- */
export function searchCustomers(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const tx = db.transaction("customers", "readonly");
      const store = tx.objectStore("customers");

      const request = store.getAll();
      request.onsuccess = () => {
        const filtered = request.result.filter(
          (c) =>
            c.name?.toLowerCase().includes(query.toLowerCase()) ||
            c.phone?.includes(query)
        );
        resolve(filtered);
      };
      request.onerror = (e) => reject(e.target.error);
    } catch (err) {
      reject(err);
    }
  });
}
