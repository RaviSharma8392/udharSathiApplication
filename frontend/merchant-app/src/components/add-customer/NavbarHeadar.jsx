import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const NavbarHeader = ({
  title = "Header",
  showBack = true,
  onBack,
  menuItems = [],
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative flex items-center justify-between mb-5">
      {/* Back */}
      {showBack ? (
        <ArrowLeft
          className="w-5 h-5 cursor-pointer text-gray-800"
          onClick={handleBack}
        />
      ) : (
        <div className="w-5" />
      )}

      {/* Title */}
      <h2 className="text-sm font-medium text-gray-800">{title}</h2>

      {/* Menu */}
      {menuItems.length ? (
        <div ref={menuRef} className="relative">
          <MoreVertical
            className="w-5 h-5 cursor-pointer"
            onClick={() => setOpen((v) => !v)}
          />

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setOpen(false);
                    item.onClick();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-5" />
      )}
    </div>
  );
};

export default NavbarHeader;
