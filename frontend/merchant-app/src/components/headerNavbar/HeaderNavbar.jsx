import { Bars3Icon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";

function HeaderNavbar({ title = "Select Customer" }) {
  return (
    <div className="bg-[#5B2DCC] px-4 py-3 flex items-center justify-between">
      {/* Left Icon */}
      <Bars3Icon className="h-6 w-6 text-white" />

      {/* Title */}
      <h1 className="text-sm font-semibold text-white">{title}</h1>

      {/* Right Icon */}
      <EllipsisVerticalIcon className="h-6 w-6 text-white" />
    </div>
  );
}

export default HeaderNavbar;
