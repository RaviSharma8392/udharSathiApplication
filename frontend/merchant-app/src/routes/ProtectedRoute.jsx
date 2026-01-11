import { Navigate, Outlet } from "react-router-dom";
import { getMerchantUser, isPlanExpired } from "../utils/auth";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const user = getMerchantUser();

  useEffect(() => {
    if (user && isPlanExpired(user.planExpiryDate)) {
      alert(
        "Your plan has expired.\n\nKindly recharge to continue using the app.\nContact: 8700356606"
      );
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isPlanExpired(user.planExpiryDate)) {
    return null; // block access completely
  }

  return <Outlet />;
};

export default ProtectedRoute;
