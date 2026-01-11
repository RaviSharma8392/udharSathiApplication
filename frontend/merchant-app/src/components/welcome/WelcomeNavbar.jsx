import LanguageSelect from "../languageSelector/LanguageSelector";

const WelcomeNavbar = () => {
  return (
    <nav className=" flex items-center justify-between bg-gray-50 ">
      {/* Left - Logo */}
      <div className="flex object-cover items-center gap-2">
        <img src="/logo/udharSathiLogo.png" alt="Logo" className="h-15" />
      </div>

      {/* Right - Language Select */}
      <LanguageSelect />
    </nav>
  );
};

export default WelcomeNavbar;
