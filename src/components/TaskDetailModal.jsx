function TaskDetailModal({ task, onClose }) {
  if (!task) {
    return null;
  }

  return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-modal" onClick={(event) => event.stopPropagation()}>
        <div className="task-detail-view">
          <div className="task-detail-header">
            <h2>タスク詳細</h2>
          </div>

          <div className="task-form-row">
            <label>タスク名</label>
            <div className="task-detail-value">{task.title}</div>
          </div>

          <div className="task-form-row">
            <label>担当者名</label>
            <div className="task-detail-value">{task.assignee}</div>
          </div>

          <div className="task-form-row">
            <label>優先度</label>
            <div className="task-detail-value">{task.priority}</div>
          </div>

          <div className="task-form-row">
            <label>ステータス</label>
            <div className="task-detail-value">{task.status}</div>
          </div>

          <div className="task-form-row">
            <label>詳細</label>
            <div className="task-detail-description">
              {task.description || "詳細は未入力です。"}
            </div>
          </div>

          <div className="task-form-actions">
            <button type="button" className="task-form-back" onClick={onClose}>
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;