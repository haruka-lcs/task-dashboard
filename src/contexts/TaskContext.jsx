import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const TaskContext = createContext();

const API_URL = "http://localhost:5228/api/tasks";

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("すべて");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("タスクの取得に失敗しました");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
        setError("タスクを取得できませんでした");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks =
    filter === "すべて"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  const addTask = async (newTask) => {
    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("タスクの追加に失敗しました");
      }

      const createdTask = await response.json();

      setTasks((prevTasks) => [...prevTasks, createdTask]);

      return true;
    } catch (error) {
      console.error(error);
      setError("タスクを追加できませんでした");

      return false;
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("タスクの削除に失敗しました");
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== id)
      );

      return true;
    } catch (error) {
      console.error(error);
      setError("タスクを削除できませんでした");

      return false;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filter,
        setFilter,
        filteredTasks,
        addTask,
        deleteTask,
        loading,
        error,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTaskはTaskProviderの内側で使用してください"
    );
  }

  return context;
}