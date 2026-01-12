import { Navigate, Outlet } from "react-router-dom";
import { getMerchantUser } from "../utils/auth";

const PublicRoute = () => {
  const user = getMerchantUser();

  // If logged in → go to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in → allow access
  return <Outlet />;
};

export default PublicRoute;
