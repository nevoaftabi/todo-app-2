import { useEffect, useState, type ChangeEvent } from "react";
import type { Task } from "./components/Task";
import TaskForm from "./components/TaskForm";
import ControlsBar from "./components/ControlsBar";

export type Filter = "all" | "active" | "done";
export type DateSort = "oldest" | "newest";

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [didLoad, setDidLoad] = useState(false);
  const [dateSort, setDateSort] = useState<DateSort>("newest");
  const [search, setSearch] = useState("");

  const addTask = () => {
    const trimmedTitle = taskTitle.trim();
    const trimmedSubject = taskSubject.trim();

    if (!trimmedTitle || !trimmedSubject) {
      alert("The title or subject is missing");
      return;
    }

    setTasks((tasks) => [
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        subject: trimmedSubject,
        isCompleted: false,
        isEditMode: false,
        tempTitle: "",
        createdAt: Date.now(),
      },
    ]);

    setTaskTitle("");
    setTaskSubject("");
  };

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");

      if (storedTasks) {
        const parsed = JSON.parse(storedTasks);

        if (Array.isArray(parsed)) {
          console.log(parsed);
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

  const handleDateSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "newest" || e.target.value === "oldest") {
      setDateSort(e.target.value);
    }
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
          t.id === task.id
            ? { ...t, tempTitle: t.title, isEditMode: true }
            : { ...t, isEditMode: false },
        ),
      );
      return;
    }

    const newTitle = task.tempTitle.trim();

    if (!newTitle) {
      alert("You need a title");
      return;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, title: newTitle, tempTitle: "", isEditMode: false }
          : t,
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
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, tempTitle: "", isEditMode: false } : t,
        ),
      );
    }
  };

  const displayTasks = () => {
    let visibleTasks = tasks.filter((t) => {
      if (filter === "active") return !t.isCompleted;
      if (filter === "done") return t.isCompleted;
      return true;
    });

    const searchTrimmed = search.trim().toLowerCase();
    if (searchTrimmed) {
      visibleTasks = [...visibleTasks].filter(
        (task) =>
          task.title.toLowerCase().includes(searchTrimmed) ||
          task.subject.toLowerCase().includes(searchTrimmed),
      );
    }

    if (dateSort === "newest") {
      visibleTasks = [...visibleTasks].sort(
        (a, b) => b.createdAt - a.createdAt,
      );
    } else {
      visibleTasks = [...visibleTasks].sort(
        (a, b) => a.createdAt - b.createdAt,
      );
    }

    return visibleTasks.map((task) => (
      <li key={task.id}>
        <input
          type="checkbox"
          onChange={(e) => handleCompleted(e, task.id)}
          checked={task.isCompleted}
        />
        {task.isEditMode && (
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTaskEdit(task);
              } else if (e.key === "Escape") {
                handleDeleteOrCancel(task);
              }
            }}
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
      <TaskForm
        onAdd={addTask}
        title={taskTitle}
        subject={taskSubject}
        onChangeSubject={(e) => setTaskSubject(e.target.value)}
        onChangeTitle={(e) => setTaskTitle(e.target.value)}
      />
      <hr />

      <ControlsBar
        dateSort={dateSort}
        filter={filter}
        onDateSortChange={handleDateSortChange}
        onSearchChange={(e) => setSearch(e.target.value)}
        search={search}
        setFilter={(filter: Filter) => setFilter(filter)}
      />

      <ul>{displayTasks()}</ul>
    </>
  );
}
export default App;
