import { useState } from "react";

export default function Calculator({
  onClose,
  onResult,
  setAmount,
  handleSave,
  isUdhar,
}) {
  const [value, setValue] = useState("");

  // Sync amount live
  setAmount(value);

  const press = (v) => {
    if (v === "C") return setValue("");
    if (v === "⌫") return setValue((p) => p.slice(0, -1));

    // Percentage logic (kirana style)
    if (v === "%") {
      try {
        const parts = value.split(/([+\-*/])/);
        const lastNum = Number(parts[parts.length - 1]);
        if (isNaN(lastNum)) return;

        const percent = lastNum / 100;
        parts[parts.length - 1] = percent.toString();
        setValue(parts.join(""));
      } catch {
        return;
      }
      return;
    }

    if (v === "=") {
      try {
        if (!/^[0-9+\-*/.]+$/.test(value)) throw new Error();
        const res = Function(`return ${value}`)();
        onResult(Number(res.toFixed(2)));
        onClose();
      } catch {
        alert("Invalid calculation");
      }
      return;
    }

    setValue((p) => p + v);
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "+",
  ];

  return (
    <div className="fixed inset-0 flex items-end px-2 pb-4">
      <div className="bg-gray-100 w-full ">
        {/* Save bar */}
        <div className="pb-4">
          <button
            onClick={handleSave}
            className={`w-full py-2 rounded-md text-white font-semibold ${
              isUdhar ? "bg-orange-600" : "bg-emerald-600"
            }`}>
            Save
          </button>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {buttons.map((b) => (
            <button
              key={b}
              onClick={() => press(b)}
              className="bg-white shadow rounded-lg py-1 text-lg font-medium">
              {b}
            </button>
          ))}
          <button
            onClick={() => press("%")}
            className="bg-yellow-100 font-bold rounded-lg py-1">
            %
          </button>

          <button
            onClick={() => press("C")}
            className="bg-red-100  font-bold rounded-lg py-2">
            C
          </button>

          <button
            onClick={() => press("⌫")}
            className="bg-red-200 font-bold rounded-lg py-2 ">
            ⌫
          </button>

          <button
            onClick={() => press("=")}
            className="bg-emerald-600 font-bold  text-white rounded-lg py-2 col-span-2 ">
            =
          </button>
        </div>
      </div>
    </div>
  );
}
