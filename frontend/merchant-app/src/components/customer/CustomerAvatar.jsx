const COLORS = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-indigo-500",
];

function getColor(name = "") {
  const index = name.charCodeAt(0) % COLORS.length;
  return COLORS[index];
}

export default function CustomerAvatar({ name }) {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getColor(
        name
      )}`}>
      {name?.charAt(0)?.toUpperCase()}
    </div>
  );
}
