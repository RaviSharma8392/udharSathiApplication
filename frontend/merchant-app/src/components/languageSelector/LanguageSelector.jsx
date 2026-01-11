import { useState, useRef, useEffect } from "react";

function LanguageSelector({ setLanguage }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close popup on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectLang = (lang) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="relative flex justify-end mb-3" ref={ref}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="text-xs border border-gray-300 rounded-full px-3 py-1 bg-white shadow-sm">
        🌐 भाषा
      </button>

      {/* Small Popup */}
      {open && (
        <div className="absolute top-9 right-0 bg-white border border-gray-200 rounded-lg shadow-md w-32 overflow-hidden z-20">
          <button
            onClick={() => selectLang("hi")}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
            हिंदी
          </button>
          <button
            onClick={() => selectLang("hinglish")}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
            Hinglish
          </button>
          <button
            onClick={() => selectLang("en")}
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
            English
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
