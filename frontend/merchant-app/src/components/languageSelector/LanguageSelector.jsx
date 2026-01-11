import { useState } from "react";
import { LANGUAGES } from "../../data/languages";
import { getLanguage, setLanguage } from "../../LocalStorage/app_language";

// Reusable Language Select Component
const LanguageSelect = ({ className }) => {
  const [language, setLang] = useState(getLanguage());

  // Handle change
  const handleChange = (e) => {
    const selectedCode = e.target.value;
    setLang(selectedCode);
    setLanguage(selectedCode);
  };

  return (
    <select
      value={language}
      onChange={handleChange}
      className={`text-sm   px-2 py-1 outline-none text-blue-400 ${className}`}>
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelect;
