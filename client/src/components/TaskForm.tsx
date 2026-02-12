import { useState } from "react";
import { z } from "zod";

export type TaskFormData = {
  title: string;
  subject: string;
  dueDate: string;
};

export type TaskFormProps = {
  onAdd: (data: TaskFormData) => void;
};
const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is too short")
    .max(20, "Title is too long"),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is too short")
    .max(20, "Subject is too long"),
});

type FormErrors = Partial<Record<"title" | "subject", string>>;

const TaskForm = ({ onAdd }: TaskFormProps) => {
  const [errors, setErrors] = useState<{ title?: string; subject?: string }>(
    {},
  );
  const [title, setTaskTitle] = useState("");
  const [subject, setTaskSubject] = useState("");
  const [dueDate, setTaskDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();

    const result = formSchema.safeParse({ title: trimmedTitle, subject: trimmedSubject });
    if (!result.success) {
      const nextErrors: FormErrors = {};
      
      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if ((field === "title" || field === "subject") && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }

        setErrors(nextErrors);
        return;
      }

      setErrors(nextErrors);
      return;
    }
    setErrors({});

    onAdd({
      title: trimmedTitle,
      subject: trimmedSubject,
      dueDate: dueDate,
    });

    setTaskTitle("");
    setTaskSubject("");
    setTaskDueDate("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>{errors.title}</div>
        <div>{errors.subject}</div>
        <div className="space-y-1">
          <label
            className="block text-sm font-medium text-slate-700 mb-1"
            htmlFor="task-title"
          >
            Title
          </label>
          <input
            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            id="task-title"
            value={title}
            minLength={1}
            maxLength={30}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>
        <label htmlFor="task-subject">Task Subject </label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          id="task-subject"
          minLength={1}
          maxLength={30}
          value={subject}
          onChange={(e) => setTaskSubject(e.target.value)}
        />
        <label htmlFor="">Due Date</label>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          type="submit"
        >
          Add
        </button>
      </form>
    </>
  );
};

export default TaskForm;
