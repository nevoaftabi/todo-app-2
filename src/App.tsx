import { useEffect, useState, type ChangeEvent } from "react";

export type Task = {
  id: string;
  title: string;
  subject: string;
  isCompleted: boolean;
  isEditMode: boolean;
  tempTitle: string;
};

type Filter = "all" | "active" | "done";

export type TaskProps = Task & {
  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSubject: (e: ChangeEvent<HTMLInputElement>) => void;
};

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [didLoad, setDidLoad] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");

      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);

        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (e: unknown) {
      console.log(e);
    }

    setDidLoad(true);
  }, []);

  useEffect(() => {
    if (!didLoad) return;

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, didLoad]);

  //   {
  //     id: crypto.randomUUID(),
  //     title: "Finish SQL lab",
  //     subject: "Databases",
  //     isCompleted: false,
  //     isEditMode: false,
  //     tempTitle: "",
  //   },
  //   {
  //     id: crypto.randomUUID(),
  //     title: "Node.js application",
  //     subject: "Backend",
  //     isCompleted: false,
  //     isEditMode: false,
  //     tempTitle: "",
  //   },
  // ]);

  const addTask = () => {
    const title = taskTitle.trim();
    const subject = taskSubject.trim();

    if (!title || !subject) {
      alert("The title or subject is missing");
      return;
    }

    setTasks((tasks) => [
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: taskTitle,
        subject: taskSubject,
        isCompleted: false,
        isEditMode: false,
        tempTitle: "",
      },
    ]);

    setTaskTitle("");
    setTaskSubject("");
  };

  const handleCompleted = (
    e: ChangeEvent<HTMLInputElement>,
    taskId: string,
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        return task.id === taskId
          ? { ...task, isCompleted: e.target.checked }
          : task;
      }),
    );
  };

  const setTaskEdit = (task: Task) => {
    if (!task.isEditMode) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, tempTitle: t.title, isEditMode: true } : t,
        ),
      );
      return;
    }

    const newTitle = task.tempTitle.trim();
    
    if (!newTitle) {
      alert("You need a title");
      return;
    }

    task = { ...task, tempTitle: "" };
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, title: newTitle, tempTitle: "", isEditMode: false } : t,
      ),
    );
  };

  const setTaskItemTitle = (e: ChangeEvent<HTMLInputElement>, task: Task) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, tempTitle: e.target.value } : t,
      ),
    );
  };

  const handleDeleteOrCancel = (task: Task) => {
    if (!task.isEditMode) {
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } else {
      // handle edit cancel
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, tempTitle: "", isEditMode: false } : t,
        ),
      );
    }
  };

  const displayTasks = () => {
    const visibleTasks = tasks.filter((t) => {
      if (filter === "active") return !t.isCompleted;
      if (filter === "done") return t.isCompleted;
      return true;
    });
    return visibleTasks.map((task) => (
      <li key={task.id}>
        <input
          type="checkbox"
          onChange={(e) => handleCompleted(e, task.id)}
          checked={task.isCompleted}
        />
        {task.isEditMode && (
          <input
            value={task.tempTitle}
            onChange={(e) => setTaskItemTitle(e, task)}
          ></input>
        )}
        {!task.isEditMode && (
          <span>
            {task.title} | {task.subject}
          </span>
        )}
        <button onClick={() => setTaskEdit(task)}>
          {task.isEditMode ? "✅" : "✏️"}
        </button>
        <button onClick={() => handleDeleteOrCancel(task)}>
          {task.isEditMode ? "Cancel" : "🗑️"}{" "}
        </button>
      </li>
    ));
  };

  return (
    <>
      <h1>📘 Study Tracker</h1>
      <label htmlFor="task-title">Title </label>
      <input
        onKeyDown={(e) => e.key === 'Enter' && addTask() }
        type="text"
        id="task-title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <br /> <br />
      <label htmlFor="task-subject">Task Subject </label>
      <input
        onKeyDown={(e) => e.key === 'Enter' && addTask() }
        type="text"
        id="task-subject"
        value={taskSubject}
        onChange={(e) => setTaskSubject(e.target.value)}
      />
      <button onClick={addTask}>Add</button>
      <hr />
      Filters:
      <button
        onClick={() => setFilter("all")}
        style={{ backgroundColor: filter === "all" ? "green" : "#f0f0f0" }}
      >
        All
      </button>
      |
      <button
        onClick={() => setFilter("active")}
        style={{ backgroundColor: filter === "active" ? "green" : "#f0f0f0" }}
      >
        Active
      </button>
      |
      <button
        onClick={() => setFilter("done")}
        style={{ backgroundColor: filter === "done" ? "green" : "#f0f0f0" }}
      >
        Done
      </button>
      <ul>{displayTasks()}</ul>
    </>
  );
}

export default App;
