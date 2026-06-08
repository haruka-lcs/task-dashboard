function TaskForm({ onClose }) {
  return (
    <div className="task-form-overlay">
      <div className="task-form-modal">
        <form className="task-form">
          <div className="task-form-row">
            <label htmlFor="title">タスク名</label>
            <input id="title" type="text" />
          </div>

          <div className="task-form-row">
            <label htmlFor="assignee">担当者名</label>
            <input id="assignee" type="text" />
          </div>

          <div className="task-form-row select-row">
            <label htmlFor="priority">優先度</label>
            <select id="priority" defaultValue="中">
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
          </div>

          <div className="task-form-row select-row">
            <label htmlFor="status">ステータス</label>
            <select id="status" defaultValue="未着手">
              <option value="未着手">未着手</option>
              <option value="進行中">進行中</option>
              <option value="完了">完了</option>
            </select>
          </div>

          <div className="task-form-actions">
            <button
              type="button"
              className="task-form-back"
              onClick={onClose}
            >
              戻る
            </button>

            <button type="submit" className="task-form-submit">
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;