import type { ChangeEvent } from "react";

export type TaskFormProps = {
  title: string;
  subject: string;
  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSubject: (e: ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
};

const TaskForm = ({
  title,
  subject,
  onChangeTitle,
  onChangeSubject,
  onAdd,
}: TaskFormProps) => {
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAdd();
        }}
      >
        <label htmlFor="task-title">Title </label>
        <input
          type="text"
          id="task-title"
          value={title}
          onChange={onChangeTitle}
        />
        <br /> <br />
        <label htmlFor="task-subject">Task Subject </label>
        <input
          type="text"
          id="task-subject"
          value={subject}
          onChange={onChangeSubject}
        />
        <button type="submit">Add</button>
      </form>
    </>
  );
};

export default TaskForm;
