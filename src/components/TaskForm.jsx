import { useState } from "react";
import { useTask } from "../contexts/TaskContext";

function TaskForm({ onClose }) {
  const { addTask } = useTask();

  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("中");
  const [status, setStatus] = useState("未着手");

  const handleSubmit = (event) => {
    event.preventDefault();

    const newTask = {
      title: title,
      assignee: assignee,
      priority: priority,
      status: status,
    };

    addTask(newTask);
    onClose();
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-modal">
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="task-form-row">
            <label htmlFor="title">タスク名</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="task-form-row">
            <label htmlFor="assignee">担当者名</label>
            <input
              id="assignee"
              type="text"
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
            />
          </div>

          <div className="task-form-row">
            <label htmlFor="priority">優先度</label>
            <select
              id="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
          </div>

          <div className="task-form-row">
            <label htmlFor="status">ステータス</label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
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