// ReactのuseStateを読み込んでいる
// 選択されたタスクを管理するために使う
import { useState } from "react";

// TaskContextからuseTaskを読み込んでいる
// フィルター後のタスク一覧を取得するために使う
import { useTask } from "../contexts/TaskContext";

// タスクカード1枚分を表示するTaskCardコンポーネントを読み込んでいる
import TaskCard from "./TaskCard";

// タスク詳細モーダルを表示するTaskDetailModalコンポーネントを読み込んでいる
import TaskDetailModal from "./TaskDetailModal";

// TaskListコンポーネントを定義している
function TaskList() {
  // TaskContextからfilteredTasksを取得している
  // filteredTasksには、現在のフィルター条件に合うタスクだけが入っている
  const { filteredTasks } = useTask();

  // 現在選択されているタスクを管理している
  // 初期値はnullなので、最初は何も選択されていない状態
  const [selectedTask, setSelectedTask] = useState(null);

  // 画面に表示する内容を返している
  return (
    // React Fragment
    // 余計なdivを増やさずに、複数の要素をまとめて返すために使う
    <>
      {/* タスク一覧全体を囲むdiv */}
      <div className="task-list">

        {/* filteredTasks配列の中身を1つずつ取り出して、TaskCardを表示している */}
        {filteredTasks.map((task) => (

          // タスクカード1枚分を表示している
          <TaskCard

            // Reactがリストを区別するためのkey
            // タスクIDを使っている
            key={task.id}

            // TaskCardにタスク情報を渡している
            task={task}

            // TaskCardがクリックされたときの処理
            // クリックされたタスクをselectedTaskに保存している
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </div>

      {/* selectedTaskがあるときだけ、タスク詳細モーダルを表示している */}
      {selectedTask && (
        <TaskDetailModal

          // 詳細表示したいタスク情報を渡している
          task={selectedTask}

          // モーダルを閉じるための処理を渡している
          // selectedTaskをnullに戻すことでモーダルを非表示にする
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}

// TaskListコンポーネントを他のファイルで使えるようにしている
export default TaskList;