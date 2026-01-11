import { useLocation, useNavigate } from "react-router-dom";
import { bottomTabs } from "../../config/bottomTabs";
import { translations } from "../../i18n/bottom-navabr/menuTranslation";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lang = "en";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t py-2 px-4 flex justify-between items-center">
      {bottomTabs.map((tab, idx) => {
        const Icon = tab.icon;

        const isActive =
          tab.route === "/" ? pathname === "/" : pathname.startsWith(tab.route);

        return (
          <div
            key={idx}
            onClick={() => navigate(tab.route)}
            className={`flex flex-col items-center justify-center cursor-pointer ${
              tab.center
                ? "bg-[#2F4CD1] text-white w-14 h-14 rounded-full -mt-6 shadow-lg"
                : isActive
                ? "text-[#2F4CD1]"
                : "text-gray-400"
            }`}>
            <Icon className="w-6 h-6" />

            {!tab.center && (
              <span className="text-xs mt-1">
                {translations[lang]?.[tab.name] ?? tab.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavbar;
