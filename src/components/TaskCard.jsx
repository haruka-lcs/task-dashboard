function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h2>{task.title}</h2>

      <p>担当者：{task.assignee}</p>
      <p>優先度：{task.priority}</p>
      <p>ステータス：{task.status}</p>
    </div>
  );
}

export default TaskCard;