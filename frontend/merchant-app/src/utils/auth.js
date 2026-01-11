export const getMerchantUser = () => {
  const user = localStorage.getItem("merchantUser");
//   console.log(user)
  return user ? JSON.parse(user) : null;
};

export const isPlanExpired = (expiryDate) => {
  if (!expiryDate) return true;
  const today = new Date();
  const expDate = new Date(expiryDate);
  return today > expDate;
};
