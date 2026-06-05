import ThemeToggleButton from "./ThemeToggleButton";

function Header() {
  return (
    <header className="header">
      <h1>タスク管理ダッシュボード</h1>

      <ThemeToggleButton />
    </header>
  );
}

export default Header;