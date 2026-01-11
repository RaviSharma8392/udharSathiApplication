import { useState } from "react";
import Button from "../../components/button/Button";
import LanguageSelector from "../../components/languageSelector/LanguageSelector";
import InputField from "../../components/loginScreen/InputField";
import Logo from "../../components/logo/Logo";
import { TEXT } from "../../data/languageText";
import PhoneInputField from "../../components/loginScreen/PhoneInputField ";

function LoginScreen() {
  const [language, setLanguage] = useState("hinglish");

  const text = TEXT[language];
  console.log(text);

  return (
    // FULL PAGE CONTAINER
    <div className="min-h-screen w-full flex  justify-center  px-4">
      {/* Background SVG */}
      <img
        src="/login-illustration.svg"
        alt=""
        className="absolute bottom-0 right-0  opacity-20 pointer-events-none"
      />
      {/* LOGIN CARD */}
      <div className="w-full max-w-sm bg-white pt-5 px-6 ">
        <LanguageSelector setLanguage={setLanguage} />

        <Logo />

        <PhoneInputField
          label={text.mobileLabel}
          placeholder={text.mobilePlaceholder}
        />

        <InputField
          label={text.passwordLabel}
          type="password"
          placeholder={text.passwordPlaceholder}
        />

        <Button text={text.continue} />

        {/* SECURE FOOTER */}
        <div className="flex bottom-0 flex-col items-center mt-5 gap-1">
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
}

export default LoginScreen;
