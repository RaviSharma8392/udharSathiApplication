const translations = {
  en: {
    merchantName: "UdhaarSathi",
    welcome: "Welcome! Here’s your today’s snapshot",
    get: "You Will Get",
    give: "You Will Give",
  },
  hi: {
    merchantName: "उधार साथी",
    welcome: "स्वागत है! आज का आपका हिसाब",
    get: "आपको मिलने हैं",
    give: "आपको देने हैं",
  },
};

function DashboardHeader({
  totalGet = 5880,
  totalGive = 8888888880,
  lang = "hi",
}) {
  const t = translations[lang];

  return (
    <div className="bg-[#FDF2F3]  px-4 py-2">
      {/* Header */}
      <h1 className="text-sm font-semibold text-gray-900 tracking-wide">
        {t.merchantName}
      </h1>
      <p className="text-[11px] text-gray-500 mt-0.5">{t.welcome}</p>

      {/* Summary Card */}
      <div className="mt-3">
        <div className="bg-white rounded-lg shadow px-4 py-2 flex justify-between text-center">
          <div>
            <p className="text-green-600 ">{t.get}</p>
            <p className="text-sm font-bold">₹{totalGet}</p>
          </div>
          <div className="border-l border-gray-200"></div>
          <div>
            <p className="text-red-700 ">{t.give}</p>
            <p className="text-sm font-bold">₹{totalGive}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
