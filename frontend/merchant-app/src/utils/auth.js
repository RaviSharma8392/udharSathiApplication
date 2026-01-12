export const getMerchantUser = () => {
  try {
    const user = localStorage.getItem("merchantUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Invalid merchantUser in localStorage", error);
    localStorage.removeItem("merchantUser");
    return null;
  }
};


export const isPlanExpired = (expiryDate) => {
  if (!expiryDate) return true;

  const expDate = new Date(expiryDate);
  if (isNaN(expDate.getTime())) return true;

  expDate.setHours(23, 59, 59, 999);
  return new Date() > expDate;
};
