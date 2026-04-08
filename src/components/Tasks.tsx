import { CheckIcon, ChevronRightIcon, Trash } from "lucide-react";
import Task from "../type/tasks";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function Tasks(props: {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}) {
  const navigate = useNavigate();

  function onSeeDetailsClick(task: Task) {
    const queryParams = new URLSearchParams({
      title: task.title,
      description: task.description,
    }).toString();
    navigate(`/tasks?${queryParams}`);
  }
  return (
    <ul className="space-y-4 p-6  bg-slate-200 rounded-md shadow">
      {props.tasks.map((task) => (
        <li key={task.id} className="flex gap-2">
          <button
            className={`bg-slate-400 hover:bg-slate-700 text-left w-full flex items-center gap-2 text-white p-2 rounded-md${task.isComplited ? " line-through" : ""}`}
            onClick={() => props.onTaskClick(task.id)}
          >
            {task.isComplited ? <CheckIcon /> : ""}
            {task.title}
          </button>
          <Button
            onClick={() => onSeeDetailsClick(task)}
            hoverColor="hover:bg-green-500"
          >
            <ChevronRightIcon />
          </Button>
          <Button
            hoverColor="hover:bg-red-500"
            onClick={() => props.onDeleteTask(task.id)}
          >
            <Trash />
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default Tasks;
