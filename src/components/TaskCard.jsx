import { useTheme } from "../contexts/ThemeContext";
import { useTask } from "../contexts/TaskContext";

function TaskCard({ task }) {
  const { theme } = useTheme();
  const { deleteTask } = useTask();

  return (
    <div className={`task-card ${theme}`}>
      <h2>{task.title}</h2>

      <p className="assignee">担当：{task.assignee}</p>

      <div className="card-footer">
        <div className="info-group">
          <span className="label">優先度</span>
          <span className={`badge priority-${task.priority}`}>
            {task.priority}
          </span>
        </div>

        <div className="info-group">
          <span className="label">ステータス</span>
          <span className={`badge status-${task.status}`}>
            {task.status}
          </span>
        </div>
      </div>

      <button className="delete-button" onClick={() => deleteTask(task.id)}>
        削除
      </button>
    </div>
  );
}

export default TaskCard;