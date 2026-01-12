import { dbPromise } from "./index";

/* ---------------- ADD CUSTOMER ---------------- */
export async function addCustomer(customer) {
  const db = await dbPromise;

  return db.add("customers", {
    ...customer,
    balance: customer.balance ?? 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}


/* ---------------- GET CUSTOMER BY ID ---------------- */
export async function getCustomerById(id) {
  const db = await dbPromise;
  return db.get("customers", Number(id));
}


/* ---------------- GET ALL CUSTOMERS ---------------- */
export async function getAllCustomers() {
  const db = await dbPromise;
  const customers = await db.getAll("customers");

  return customers.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}


/* ---------------- UPDATE CUSTOMER BALANCE ---------------- */
export async function updateCustomerBalance(id, { amount, type }) {
  const db = await dbPromise;

  const normalizedType = String(type).trim().toUpperCase();
  const numericAmount = Number(amount);

  if (!numericAmount || numericAmount <= 0) {
    throw new Error("Invalid amount");
  }

  const customer = await db.get("customers", Number(id));
  if (!customer) throw new Error("Customer not found");

  const currentBalance = Number(customer.balance) || 0;

  let newBalance = currentBalance;

  if (normalizedType === "UDHAR") {
    newBalance += numericAmount;
  } else if (normalizedType === "PAYMENT") {
    newBalance -= numericAmount;
  } else {
    throw new Error("Invalid transaction type");
  }

  customer.balance = newBalance;
  customer.updatedAt = new Date().toISOString();

  return db.put("customers", customer);
}


/* ---------------- DELETE CUSTOMER BY ID ---------------- */
export async function deleteCustomerById(id) {
  const db = await dbPromise;
  return db.delete("customers", Number(id));
}


export async function searchCustomers(query) {
  const db = await dbPromise;
  const customers = await db.getAll("customers");

  return customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(query.toLowerCase()) ||
      c.phone?.includes(query)
  );
}


// UPDATE
export async function updateCustomer(id, data) {
  const db = await dbPromise;
  const existing = await db.get("customers", Number(id));
  if (!existing) throw new Error("Customer not found");

  return db.put("customers", {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  });
}
