// ThemeContextからuseThemeを読み込んでいる
// 現在のテーマ情報を取得するために使う
import { useTheme } from "../contexts/ThemeContext";

// TaskContextからuseTaskを読み込んでいる
// タスク削除処理などを使うため
import { useTask } from "../contexts/TaskContext";

// TaskCardコンポーネントを定義している
// propsとして task と onClick を受け取っている
function TaskCard({ task, onClick }) {
  // ThemeContextから現在のテーマを取得している
  // 例：light / dark など
  const { theme } = useTheme();

  // TaskContextからdeleteTask関数を取得している
  // タスクを削除するときに使う
  const { deleteTask } = useTask();

  // 削除ボタンが押されたときに実行される関数
  const handleDelete = async (event) => {
    // 親要素のクリックイベントが一緒に動かないようにしている
    // これがないと、削除ボタンを押したときにカードのonClickも動いてしまう
    event.stopPropagation();

    // deleteTask関数を実行して、指定したIDのタスクを削除している
    // task.id は削除したいタスクのID
    await deleteTask(task.id);
  };

  // 画面に表示する内容を返している
  return (
    // タスクカード全体を囲むdiv
    // task-card と 現在のtheme をclassNameに付けている
    // カードがクリックされたら、親から受け取ったonClickを実行する
    <div className={`task-card ${theme}`} onClick={onClick}>
      
      {/* タスクのタイトルを表示している */}
      <h2>{task.title}</h2>

      {/* タスクの担当者を表示している */}
      <p className="assignee">担当：{task.assignee}</p>

      {/* カード下部の情報エリア */}
      <div className="card-footer">

        {/* 優先度を表示するグループ */}
        <div className="info-group">

          {/* 「優先度」というラベルを表示している */}
          <span className="label">優先度</span>

          {/* タスクの優先度をバッジとして表示している */}
          {/* priority-高 / priority-中 / priority-低 などのclassNameになる */}
          <span className={`badge priority-${task.priority}`}>
            {/* 優先度の文字を表示している */}
            {task.priority}
          </span>
        </div>

        {/* ステータスを表示するグループ */}
        <div className="info-group">

          {/* 「ステータス」というラベルを表示している */}
          <span className="label">ステータス</span>

          {/* タスクのステータスをバッジとして表示している */}
          {/* status-未着手 / status-進行中 / status-完了 などのclassNameになる */}
          <span className={`badge status-${task.status}`}>
            {/* ステータスの文字を表示している */}
            {task.status}
          </span>
        </div>
      </div>

      {/* タスクを削除するボタン */}
      <button className="delete-button" onClick={handleDelete}>
        削除
      </button>
    </div>
  );
}

// TaskCardコンポーネントを他のファイルで使えるようにしている
export default TaskCard;