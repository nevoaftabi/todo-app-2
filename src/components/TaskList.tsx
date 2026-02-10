import type { ChangeEvent } from "react";
import { type Task } from "./Task";

type TaskListProps = {
  tasks: Task[];
  onSetCompleted: (e: ChangeEvent<HTMLInputElement>, taskId: string) => void;

  // Toggles edit mode OR confirms edit
  onEditOrConfirmTitle: (task: Task) => void;

  // Updates tempTitle while editing
  onSetTaskTitle: (
    e: ChangeEvent<HTMLInputElement, Element>,
    task: Task,
  ) => void;

  // Updates task title while editing
  onDeleteOrCancelEdit: (task: Task) => void;
};

const TaskList = ({
  tasks,
  onSetCompleted,
  onEditOrConfirmTitle,
  onSetTaskTitle,
  onDeleteOrCancelEdit,
}: TaskListProps) => {
  return (
    <>
      {tasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            onChange={(e) => onSetCompleted(e, task.id)}
            checked={task.isCompleted}
          />
          {task.isEditMode && (
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") onEditOrConfirmTitle(task);
                if(e.key === "Escape") onEditOrConfirmTitle(task);
              }}
              value={task.tempTitle}
              onChange={(e) => onSetTaskTitle(e, task)}
            ></input>
          )}
          {!task.isEditMode && (
            <span>
              {task.title} | {task.subject}
            </span>
          )}
          <button onClick={() => onEditOrConfirmTitle(task)}>{task.isEditMode ? "✅" : "✏️"}</button>
          <button onClick={() => onDeleteOrCancelEdit(task)}>
            {task.isEditMode ? "Cancel" : "🗑️"}{" "}
          </button>
        </li>
      ))}
    </>
  );
};

export default TaskList;
