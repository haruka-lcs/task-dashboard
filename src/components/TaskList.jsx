import TaskCard from "./TaskCard";
import { useTask } from "../contexts/TaskContext";

function TaskList() {
  const { filteredTasks } = useTask();

  return (
    <div className="task-list">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;