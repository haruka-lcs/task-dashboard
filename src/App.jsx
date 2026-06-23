// ReactのuseStateを読み込んでいる
// useStateは、画面の状態を管理するために使う
import { useState } from "react";

// ヘッダー部分のコンポーネントを読み込んでいる
import Header from "./components/Header";

// フィルター切り替え部分のコンポーネントを読み込んでいる
import FilterBar from "./components/FilterBar";

// タスク一覧を表示するコンポーネントを読み込んでいる
import TaskList from "./components/TaskList";

// タスク追加フォームのコンポーネントを読み込んでいる
import TaskForm from "./components/TaskForm";

// ThemeContextからテーマ情報を使うためのuseThemeを読み込んでいる
import { useTheme } from "./contexts/ThemeContext";

// App全体に適用するCSSファイルを読み込んでいる
import "./App.css";

// Appコンポーネントを定義している
function App() {
  // ThemeContextから現在のテーマ情報を取得している
  // 例：lightやdarkなど
  const { theme } = useTheme();

  // タスク追加フォームが開いているかどうかを管理するstate
  // isFormOpenがtrueならフォームを表示、falseなら非表示
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 画面に表示する内容を返している
  return (
    // アプリ全体を囲むdiv
    // classNameにappと現在のthemeを付けて、テーマごとに見た目を変えられるようにしている
    <div className={`app ${theme}`}>

      {/* 左側のサイドバー部分 */}
      <aside className="sidebar">

        {/* ナビゲーションメニューを表している */}
        <nav>

          {/* メニュー項目をまとめるリスト */}
          <ul>

            {/* 現在選択中のメニュー項目 */}
            <li className="active">ダッシュボード</li>

            {/* タスク一覧メニュー */}
            <li>タスク一覧</li>

            {/* カレンダーメニュー */}
            <li>カレンダー</li>

            {/* チームメニュー */}
            <li>チーム</li>

          </ul>
        </nav>
      </aside>

      {/* メインの表示エリア */}
      <main className="main-content">

        {/* ヘッダーコンポーネントを表示している */}
        <Header />

        {/* isFormOpenがtrueのときだけTaskFormを表示している */}
        {/* onCloseには、フォームを閉じるための関数を渡している */}
        {isFormOpen && <TaskForm onClose={() => setIsFormOpen(false)} />}

        {/* フィルター切り替えコンポーネントを表示している */}
        <FilterBar />

        {/* タスク一覧コンポーネントを表示している */}
        <TaskList />

        {/* タスク追加フォームを開くためのボタン */}
        <button
          // ボタンにCSS用のクラス名を付けている
          className="add-task-floating-button"

          // ボタンがクリックされたらisFormOpenをtrueにしてフォームを開く
          onClick={() => setIsFormOpen(true)}
        >
          {/* ボタンに表示する文字 */}
          +
        </button>
      </main>
    </div>
  );
}

// Appコンポーネントを他のファイルで使えるようにしている
export default App;