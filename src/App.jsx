import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import { useTheme } from "./contexts/ThemeContext";
import "./App.css";

function App() {
  const { theme } = useTheme();

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

        <FilterBar />

        <TaskList />
      </main>
    </div>
  );
}

export default App;