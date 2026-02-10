import { useState, type ChangeEvent } from "react";
import { z } from "zod";

export type TaskFormProps = {
  title: string;
  subject: string;
  dueDate: string;
  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSubject: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeDate: (e: ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
};

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is too short").max(20, "Title is too long"),
  subject: z.string().trim().min(1, "Subject is too short").max(20, "Subject is too long"),
});

type FormErrors = Partial<Record<"title" | "subject", string>>;

const TaskForm = ({
  title,
  subject,
  dueDate,
  onChangeTitle,
  onChangeSubject,
  onChangeDate,
  onAdd,
}: TaskFormProps) => {
  const [errors, setErrors] = useState<{ title?: string; subject?: string }>(
    {},
  );
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = formSchema.safeParse({ title, subject });
          if (!result.success) {
            const nextErrors: FormErrors = {};

            for (const issue of result.error.issues) {
              const field = issue.path[0];

              if (
                (field === "title" || field === "subject") &&
                !nextErrors[field]
              ) {
                nextErrors[field] = issue.message;
              }
              setErrors(nextErrors);
              return;
            }

            setErrors(nextErrors);
            return;
          }
          setErrors({});
          onAdd();
        }}
      >
        <div>{errors.title}</div>
        <div>{errors.subject}</div>
        <label htmlFor="task-title">Title </label>
        <input
          type="text"
          id="task-title"
          value={title}
          minLength={1}
          maxLength={30}
          onChange={onChangeTitle}
        />
        <br /> <br />
        <label htmlFor="task-subject">Task Subject </label>
        <input
          type="text"
          id="task-subject"
          minLength={1}
          maxLength={30}
          value={subject}
          onChange={onChangeSubject}
        />
        <br />
        <br />
        <label htmlFor="">Due Date</label>
        <input 
          type="date"
          value={dueDate}
          onChange={onChangeDate}
        />
        <button type="submit">Add</button>
      </form>
    </>
  );
};

export default TaskForm;
