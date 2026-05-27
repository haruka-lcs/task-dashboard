import TaskList from "./components/TaskList";
import "./index.css";

function App() {
  const tasks = [
    {
      id: 1,
      title: "ログイン画面を作成",
      assignee: "泉",
      priority: "高",
      status: "未着手",
    },
    {
      id: 2,
      title: "タスク一覧画面を実装",
      assignee: "田中",
      priority: "中",
      status: "進行中",
    },
    {
      id: 3,
      title: "READMEを作成",
      assignee: "佐藤",
      priority: "低",
      status: "完了",
    },
  ];

  return (
    <div>
      <h1>タスク管理ダッシュボード</h1>

      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;