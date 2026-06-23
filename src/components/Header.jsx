// ThemeToggleButtonコンポーネントを読み込んでいる
// ダークモード・ライトモードを切り替えるボタンを表示するために使う
import ThemeToggleButton from "./ThemeToggleButton";

// Headerコンポーネントを定義している
function Header() {
  // 画面に表示する内容を返している
  return (
    // ヘッダー部分を表すheaderタグ
    // classNameを付けて、CSSで見た目を整えられるようにしている
    <header className="header">

      {/* 画面上部に表示するタイトル */}
      <h1>タスク管理ダッシュボード</h1>

      {/* テーマ切り替えボタンを表示している */}
      <ThemeToggleButton />
    </header>
  );
}

// Headerコンポーネントを他のファイルで使えるようにしている
export default Header;