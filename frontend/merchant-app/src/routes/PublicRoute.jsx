import { Navigate, Outlet } from "react-router-dom";
import { getMerchantUser } from "../utils/auth";

const PublicRoute = () => {
  const user = getMerchantUser();
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
