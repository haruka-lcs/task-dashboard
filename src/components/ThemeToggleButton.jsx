import { useTheme } from "../contexts/ThemeContext";

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <span className={`toggle-circle ${theme === "dark" ? "dark" : ""}`}></span>
    </button>
  );
}

export default ThemeToggleButton;