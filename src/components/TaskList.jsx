import { useState } from "react";
import { useTask } from "../contexts/TaskContext";
import TaskCard from "./TaskCard";
import TaskDetailModal from "./TaskDetailModal";

function TaskList() {
  const { filteredTasks } = useTask();
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <>
      <div className="task-list">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
}

export default TaskList;