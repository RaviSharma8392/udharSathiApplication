const TransactionButton = ({ text, color = "#4CAF50", onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color,
        color: "#fff",
        border: "none",
        width: "100%",
        height: "52px",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
      }}>
      {text}
    </button>
  );
};

export default TransactionButton;
