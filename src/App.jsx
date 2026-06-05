import { useState } from "react";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import { useTheme } from "./contexts/ThemeContext";
import "./App.css";

function App() {
  const { theme } = useTheme();

  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className={`app ${theme}`}>
      <aside className="sidebar">
        <nav>
          <ul>
            <li className="active">ダッシュボード</li>
            <li>タスク一覧</li>
            <li>カレンダー</li>
            <li>チーム</li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Header />

        {isFormOpen && (
          <div>
            タスク追加フォームを表示する場所
          </div>
        )}

        <FilterBar />

        <TaskList />

        <button
          className="add-task-floating-button"
          onClick={() => setIsFormOpen(true)}
        >
          +
        </button>
      </main>
    </div>
  );
}

export default App;