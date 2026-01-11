import { LANGUAGES } from "../../data/languages";

function LanguageScreen({ onSelect }) {
  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col">
      <div className="pt-14 pb-8 px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">भाषा चुनें</h1>
        <p className="text-sm text-gray-600 mt-2">
          UdhaarSathi को अपनी भाषा में इस्तेमाल करें
        </p>
      </div>

      {/* Language Cards */}
      <div className="flex-1 px-6">
        <div className="grid grid-cols-1 gap-4">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="
                flex items-center gap-4
                bg-white border border-gray-200
                rounded-2xl px-5 py-4
                shadow-sm
                hover:border-blue-500
                active:scale-[0.98]
                transition
              ">
              {/* Icon Circle */}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-base">
                {lang.short}
              </div>

              {/* Language Text */}
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {lang.label}
                </p>
                <p className="text-xs text-gray-500">
                  {lang.subLabel || "Select to continue"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-xs text-gray-500">
        बाद में भी भाषा बदली जा सकती है
      </div>
    </div>
  );
}

export default LanguageScreen;
