import { useState } from "react";
import { useTask } from "../contexts/TaskContext";

function TaskDetailModal({ task, onClose }) {
  const { updateTask } = useTask();

  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [assignee, setAssignee] = useState(task.assignee);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [description, setDescription] = useState(task.description || "");

  if (!task) {
    return null;
  }

  const handleSave = async () => {
    const updatedTask = {
      title: title,
      assignee: assignee,
      priority: priority,
      status: status,
      description: description,
    };

    const savedTask = await updateTask(task.id, updatedTask);

    if (savedTask) {
      setIsEditing(false);
      onClose();
    }
  };

  return (
    <div className="task-form-overlay" onClick={onClose}>
      <div
        className="task-form-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="task-detail-view">
          <div className="task-detail-header">
            <h2>{isEditing ? "タスク編集" : "タスク詳細"}</h2>
          </div>

          <div className="task-form-row">
            <label>タスク名</label>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            ) : (
              <div className="task-detail-value">{task.title}</div>
            )}
          </div>

          <div className="task-form-row">
            <label>担当者名</label>
            {isEditing ? (
              <input
                type="text"
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
              />
            ) : (
              <div className="task-detail-value">{task.assignee}</div>
            )}
          </div>

          <div className="task-form-row">
            <label>優先度</label>
            {isEditing ? (
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            ) : (
              <div className="task-detail-value">{task.priority}</div>
            )}
          </div>

          <div className="task-form-row">
            <label>ステータス</label>
            {isEditing ? (
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
              </select>
            ) : (
              <div className="task-detail-value">{task.status}</div>
            )}
          </div>

          <div className="task-form-row">
            <label>詳細</label>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="タスクの内容・目的・注意点などを入力"
                rows="5"
              />
            ) : (
              <div className="task-detail-description">
                {task.description || "詳細は未入力です。"}
              </div>
            )}
          </div>

          <div className="task-form-actions">
            <button type="button" className="task-form-back" onClick={onClose}>
              戻る
            </button>

            {isEditing ? (
              <button
                type="button"
                className="task-form-submit"
                onClick={handleSave}
              >
                保存する
              </button>
            ) : (
              <button
                type="button"
                className="task-form-submit"
                onClick={() => setIsEditing(true)}
              >
                編集
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;