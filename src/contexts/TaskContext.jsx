import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

const initialTasks = [
  {
    id: 1,
    title: "ログイン画面制作",
    assignee: "泉",
    priority: "高",
    status: "未着手",
  },
  {
    id: 2,
    title: "サインイン画面制作",
    assignee: "泉",
    priority: "高",
    status: "進行中",
  },
  {
    id: 3,
    title: "アカウント画面制作",
    assignee: "泉",
    priority: "高",
    status: "進行中",
  },
  {
    id: 4,
    title: "サインイン画面制作",
    assignee: "泉",
    priority: "高",
    status: "進行中",
  },
  {
    id: 5,
    title: "サインイン画面制作",
    assignee: "泉",
    priority: "中",
    status: "進行中",
  },
  {
    id: 6,
    title: "サインイン画面制作",
    assignee: "泉",
    priority: "低",
    status: "進行中",
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("すべて");

  const filteredTasks =
    filter === "すべて"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: Date.now(),
        ...newTask,
      },
    ]);
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
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
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  return useContext(TaskContext);
}