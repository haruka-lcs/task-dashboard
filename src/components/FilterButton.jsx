function FilterButton({ label, isActive, onClick }) {
  return (
    <button
      className={`filter-button ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export default FilterButton;