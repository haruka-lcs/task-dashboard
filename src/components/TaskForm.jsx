import { useEffect, useState } from "react";
import { useTask } from "../contexts/TaskContext";

function TaskForm({ onClose }) {
  const { addTask } = useTask();

  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState("中");
  const [status, setStatus] = useState("未着手");
  const [description, setDescription] = useState("");

  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5228/api/users");

        if (!response.ok) {
          throw new Error("担当者一覧の取得に失敗しました");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUserName.trim()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5228/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserName,
        }),
      });

      if (!response.ok) {
        throw new Error("担当者の追加に失敗しました");
      }

      const addedUser = await response.json();

      setUsers((prevUsers) => {
        const exists = prevUsers.some((user) => user.id === addedUser.id);

        if (exists) {
          return prevUsers;
        }

        return [...prevUsers, addedUser];
      });

      setAssignee(addedUser.name);
      setNewUserName("");
      setIsAddingUser(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newTask = {
      title: title,
      assignee: assignee,
      priority: priority,
      status: status,
      description: description,
    };

    const isSuccess = await addTask(newTask);

    if (isSuccess) {
      setTitle("");
      setAssignee("");
      setPriority("中");
      setStatus("未着手");
      setDescription("");
      setNewUserName("");
      setIsAddingUser(false);

      onClose();
    }
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

            <div className="assignee-select-row">
              <select
                id="assignee"
                value={assignee}
                onChange={(event) => setAssignee(event.target.value)}
              >
                <option value="">担当者を選択</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="assignee-add-button"
                onClick={() => setIsAddingUser(true)}
              >
                ＋追加
              </button>
            </div>

            {isAddingUser && (
              <div className="assignee-add-row">
                <input
                  type="text"
                  value={newUserName}
                  onChange={(event) => setNewUserName(event.target.value)}
                  placeholder="新しい担当者名"
                />

                <button
                  type="button"
                  className="assignee-save-button"
                  onClick={handleAddUser}
                >
                  保存
                </button>

                <button
                  type="button"
                  className="assignee-cancel-button"
                  onClick={() => {
                    setNewUserName("");
                    setIsAddingUser(false);
                  }}
                >
                  キャンセル
                </button>
              </div>
            )}
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

          <div className="task-form-row">
            <label htmlFor="description">詳細</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="タスクの内容・目的・注意点などを入力"
              rows="5"
            />
          </div>

          <div className="task-form-actions">
            <button type="button" className="task-form-back" onClick={onClose}>
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