// src/components/Button.jsx
import React from "react";

function Button({ text }) {
  return (
    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl transition duration-200">
      {text}
    </button>
  );
}

export default Button;
