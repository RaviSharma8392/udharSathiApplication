import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const options = [
  { name: "Settings", icon: Cog6ToothIcon, route: "/settings" },
  { name: "Help & Support", icon: QuestionMarkCircleIcon, route: "/help" },
  { name: "About Us", icon: QuestionMarkCircleIcon, route: "/about" }, // correct route
];

const OtherOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 bg-gray-100 py-3">
      <div className="flex flex-col gap-3">
        {options.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(item.route)}
              className="flex items-center justify-between px-4 py-3 bg-white cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-blue-600" />
                <span className="text-gray-800 font-medium">{item.name}</span>
              </div>

              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OtherOptions;
