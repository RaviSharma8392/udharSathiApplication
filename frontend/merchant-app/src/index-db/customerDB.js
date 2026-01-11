import { openDB } from "./index";

/* ---------------- ADD CUSTOMER ---------------- */
export async function addCustomer(customer) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("customers", "readwrite");
    tx.objectStore("customers").add({
      ...customer,
      balance: customer.balance ?? 0, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject("Add customer failed");
  });
}

/* ---------------- GET CUSTOMER BY ID ---------------- */
export async function getCustomerById(id) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("customers", "readonly");
    const store = tx.objectStore("customers");
    const request = store.get(Number(id));

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject("Failed to get customer");
  });
}

/* ---------------- GET ALL CUSTOMERS ---------------- */
export async function getAllCustomers() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("customers", "readonly");
    const store = tx.objectStore("customers");
    const request = store.getAll();

    request.onsuccess = () => {
      const customers = request.result || [];

      customers.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      resolve(customers);
    };

    request.onerror = () => reject("Failed to get customers");
  });
}

export async function updateCustomerBalance(id, { amount, type }) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("customers", "readwrite");
    const store = tx.objectStore("customers");

    const getReq = store.get(Number(id));

    getReq.onsuccess = () => {
      const customer = getReq.result;
      if (!customer) return reject("Customer not found");

      const currentBalance = Number(customer.balance) || 0;
      const numericAmount = Number(amount) || 0;

      let newBalance = currentBalance;

      if (type === "UDHAR") {
        newBalance = currentBalance + numericAmount;
      } else if (type === "PAYMENT") {
        newBalance = currentBalance - numericAmount;
      }

      store.put({
        ...customer,
        balance: newBalance,
        updatedAt: new Date().toISOString(),
      });
    };

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject("Update customer balance failed");
  });
}

/* ---------------- DELETE CUSTOMER BY ID ---------------- */
export async function deleteCustomerById(id) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("customers", "readwrite");
    tx.objectStore("customers").delete(Number(id));

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject("Delete customer failed");
  });
}
