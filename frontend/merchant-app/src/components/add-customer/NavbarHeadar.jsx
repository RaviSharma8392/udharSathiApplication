import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavbarHeadar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-5">
      <ArrowLeft
        className="w-5  text-sm font-medium text-gray-800 h-5 cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <h2 className="text-sm font-medium text-gray-800">Send Money</h2>
      <MoreVertical className="w-5 h-5" />
    </div>
  );
};

export default NavbarHeadar;
