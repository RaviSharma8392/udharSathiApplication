import { Navigate, Outlet } from "react-router-dom";
import { getMerchantUser, isPlanExpired } from "../utils/auth";
import { useEffect, useRef } from "react";

const ProtectedRoute = () => {
  const user = getMerchantUser();
  // const hasAlerted = useRef(false);

  // useEffect(() => {
  //   if (user && isPlanExpired(user.planExpiryDate) && !hasAlerted.current) {
  //     hasAlerted.current = true;
  //     alert(
  //       "Your plan has expired.\n\nKindly recharge to continue using the app.\nContact: 8700356606"
  //     );
  //   }
  // }, [user]);

  //  Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  //  Plan expired → redirect to safe page
  // if (isPlanExpired(user.planExpiryDate)) {
  //   return <Navigate to="/" replace />;
  // }

  //  Access allowed
  return <Outlet />;
};

export default ProtectedRoute;
