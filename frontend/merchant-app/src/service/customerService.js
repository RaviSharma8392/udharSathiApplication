import { addCustomer } from "../index-db/customerDB";

export async function createCustomer(data) {
  if (!data.name || !data.phone) {
    throw new Error("Name and phone required");
  }

  return addCustomer(data);
}
