// ThemeContextからuseThemeを読み込んでいる
// 現在のテーマと、テーマを切り替える関数を使うため
import { useTheme } from "../contexts/ThemeContext";

// ThemeToggleButtonコンポーネントを定義している
function ThemeToggleButton() {
  // ThemeContextからthemeとtoggleThemeを取得している
  // themeは現在のテーマ、toggleThemeはテーマを切り替える関数
  const { theme, toggleTheme } = useTheme();

  // 画面に表示する内容を返している
  return (
    // テーマ切り替え用のbutton
    // クリックされたらtoggleThemeが実行される
    <button className="theme-toggle" onClick={toggleTheme}>

      {/* トグルボタンの丸い部分を表示している */}
      {/* themeがdarkの場合だけ、darkクラスを追加して見た目を変えている */}
      <span className={`toggle-circle ${theme === "dark" ? "dark" : ""}`}></span>
    </button>
  );
}

// ThemeToggleButtonコンポーネントを他のファイルで使えるようにしている
export default ThemeToggleButton;