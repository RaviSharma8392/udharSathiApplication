import React from "react";
import HeaderNavbar from "../components/headerNavbar/HeaderNavbar";
import { Outlet } from "react-router-dom";

const FullScreenPopupLayout = () => {
  return (
    <div>
      <HeaderNavbar />
      <Outlet />
    </div>
  );
};

export default FullScreenPopupLayout;
