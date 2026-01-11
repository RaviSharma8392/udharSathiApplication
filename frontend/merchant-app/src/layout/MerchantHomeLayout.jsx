import { Outlet } from "react-router-dom";
import MerchantTopNavbar from "../components/shopNavbar/ShopTopNavbar";
import BottomNavbar from "../components/bottomNavbar/BottomNavbar";

const MerchantHomeLayout = () => {
  const merchant = {
    name: "C Muthu Krishnan",
    image: "https://i.pravatar.cc/100?img=32",
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Top Navbar */}
      <div className="px-4 pt-5">
        <MerchantTopNavbar
          merchantName={merchant.name}
          merchantImage={merchant.image}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
};

export default MerchantHomeLayout;
