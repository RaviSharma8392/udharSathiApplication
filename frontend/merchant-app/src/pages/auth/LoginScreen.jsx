import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import LanguageSelector from "../../components/languageSelector/LanguageSelector";
import InputField from "../../components/loginScreen/InputField";
import Logo from "../../components/logo/Logo";
import { TEXT } from "../../data/languageText";
import PhoneInputField from "../../components/loginScreen/PhoneInputField";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("hinglish");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const text = TEXT[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter both identifier and password.");
      return;
    }

    // Minimal local auth simulation
    const merchantUser = { id: Date.now(), identifier };
    localStorage.setItem("merchantUser", JSON.stringify(merchantUser));
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex justify-center px-4 relative bg-[#f7f7fb]">
      {/* Background SVG */}
      <img
        src="/login-illustration.svg"
        alt=""
        className="absolute bottom-0 right-0 opacity-20 pointer-events-none"
      />

      {/* LOGIN CARD */}
      <div className="w-full max-w-sm bg-white pt-5 px-6 rounded-lg shadow-lg">
        <LanguageSelector setLanguage={setLanguage} />

        <Logo />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PhoneInputField
            label={text.mobileLabel}
            placeholder={text.mobilePlaceholder}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <InputField
            label={text.passwordLabel}
            type="password"
            placeholder={text.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" text={text.continue} />
        </form>

        {/* SECURE FOOTER */}
        <div className="flex flex-col items-center mt-5 gap-1">
          <img
            src="/certified-antivirus-technology-your-digital-privacy-web-protection_1017-44243.avif"
            alt="secure"
            className="h-6 w-6"
          />
          <p className="text-xs text-green-600 font-medium">{text.secure}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
