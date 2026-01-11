import { openDB } from "./index";


// ADD TRANSACTION (Udhar or Payment)
export async function addTransaction(txData) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("transactions", "readwrite");
    tx.objectStore("transactions").add({
      ...txData,
      createdAt: new Date().toISOString(),
    });

    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject("Add transaction failed");
  });
}

export async function getTransactionsByCustomer(customerId) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("transactions", "readonly");
    const store = tx.objectStore("transactions");
    const index = store.index("customerId");
    const req = index.getAll(customerId);
    req.onsuccess = () => resolve(req.result);
  });
}


// ✅ GET RECENT TRANSACTIONS WITH CUSTOMER INFO
export async function getRecentTransactions(limit = 10) {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["transactions", "customers"], "readonly");
    const txStore = tx.objectStore("transactions");
    const customerStore = tx.objectStore("customers");

    const req = txStore.openCursor(null, "prev"); // Latest transactions first
    const results = [];

    req.onsuccess = async (event) => {
      const cursor = event.target.result;
      if (cursor && results.length < limit) {
        const transaction = cursor.value;

        // Try to get customer info
        const customerReq = customerStore.get(transaction.customerId);
        customerReq.onsuccess = () => {
          const customer = customerReq.result || {
            name: "Unknown",
            phone: "N/A",
          };

          results.push({
            ...transaction,
            customerName: customer.name,
            customerPhone: customer.phone,
          });

          cursor.continue();
        };
        customerReq.onerror = () => {
          // If customer fetch fails, still push transaction
          results.push({
            ...transaction,
            customerName: "Unknown",
            customerPhone: "N/A",
          });
          cursor.continue();
        };
      } else {
        resolve(results);
      }
    };

    req.onerror = () => reject("Failed to fetch recent transactions");
  });
}

export async function getTransactionsPaginated(limit = 10, offset = 0) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(["transactions", "customers"], "readonly");
    const txStore = tx.objectStore("transactions");
    const customerStore = tx.objectStore("customers");

    const req = txStore.openCursor(null, "prev");
    const results = [];
    let skipped = 0;

    req.onsuccess = () => {
      const cursor = req.result;

      if (!cursor) {
        resolve(results);
        return;
      }

      if (skipped < offset) {
        skipped++;
        cursor.continue();
        return;
      }

      if (results.length < limit) {
        const transaction = cursor.value;

        const customerReq = customerStore.get(transaction.customerId);
        customerReq.onsuccess = () => {
          const customer = customerReq.result || {
            name: "Unknown",
            phone: "N/A",
          };

          results.push({
            ...transaction,
            customerName: customer.name,
            customerPhone: customer.phone,
          });

          cursor.continue();
        };
      } else {
        resolve(results);
      }
    };

    req.onerror = () => reject("Failed to load transactions");
  });
}



export async function calculateTotals({ type = "ALL", customerId = null } = {}) {
  const db = await openDB();
  const tx = db.transaction("transactions", "readonly");
  const store = tx.objectStore("transactions");

  return new Promise((resolve, reject) => {
    const req = store.openCursor(null, "prev"); // latest first
    let totalUdhar = 0;
    let totalPayment = 0;

    const now = new Date();
    let fromDate = null;

    switch (type) {
      case "TODAY":
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "LAST_7_DAYS":
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "LAST_MONTH":
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "LAST_YEAR":
        fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case "ALL":
      default:
        fromDate = null;
    }

    req.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const txData = cursor.value;

        // Filter by customer if provided
        if (!customerId || txData.customerId === customerId) {
          const txDate = new Date(txData.date || txData.createdAt);
          if (!fromDate || txDate >= fromDate) {
            const amount = Number(txData.amount) || 0;
            if (txData.type === "UDHAR") totalUdhar += amount;
            else if (txData.type === "PAYMENT") totalPayment += amount;
          }
        }

        cursor.continue();
      } else {
        resolve({ totalUdhar, totalPayment });
      }
    };

    req.onerror = () => reject("Failed to calculate totals");
  });
}