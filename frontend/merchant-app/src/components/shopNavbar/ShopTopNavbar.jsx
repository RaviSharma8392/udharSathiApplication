import { Bell } from "lucide-react";

function MerchantTopNavbar({
  merchantName = "Ravi SHarma",
  merchantImage = "https://lh3.googleusercontent.com/a/ACg8ocIwpj58aEAJ93c_iO7XgkorGFW7A_9ruqw1B5v1tmKyyKEH2m0Z=s360-c-no",
  greeting = "Welcome back!",
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <img
          src={merchantImage}
          className="w-10 h-10 rounded-full"
          alt="profile"
        />
        <div>
          <p className="text-sm font-medium text-gray-900">
            Hi, {merchantName}
          </p>
          <p className="text-xs text-gray-500">{greeting}</p>
        </div>
      </div>
      <Bell className="w-5 h-5 text-gray-700" />
    </div>
  );
}

export default MerchantTopNavbar;
