import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

const SuccessSheet = ({ open, message, onClose }) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Popup */}
      <div className="relative bg-white w-[260px] rounded-2xl px-6 py-6 shadow-xl animate-scaleIn">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
          <p className="text-base font-semibold text-gray-900">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessSheet;
