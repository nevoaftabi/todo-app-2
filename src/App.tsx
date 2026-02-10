import { useEffect, useState, type ChangeEvent } from "react";
import type { Task } from "./components/Task";
import TaskForm from "./components/TaskForm";
import ControlsBar from "./components/ControlsBar";
import TaskList from "./components/TaskList";

export type Filter = "all" | "active" | "done";
export type DateSort = "oldest" | "newest";

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [dateSort, setDateSort] = useState<DateSort>("newest");
  const [search, setSearch] = useState("");
  const [taskDueDate, setTaskDueDate] = useState('');
  const [tasks, setTasks] = useState<Task[]>(() => {
    let parsed;
    let valid = false;
    try {
      const storedTasks = localStorage.getItem("tasks");

      if (storedTasks) {
        parsed = JSON.parse(storedTasks);
        valid = Array.isArray(parsed);
      }
    } catch (e: unknown) {
      console.log(e);
    }

    if (valid) {
      return parsed;
    }

    return [];
  });

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
        dueDate: taskDueDate
      },
    ]);

    setTaskTitle("");
    setTaskSubject("");
    setTaskDueDate("");
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

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
          task.subject.toLowerCase().includes(searchTrimmed) || 
          task.dueDate.includes(searchTrimmed),
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

    return (
      <TaskList
        tasks={visibleTasks}
        onDeleteOrCancelEdit={handleDeleteOrCancel}
        onEditOrConfirmTitle={setTaskEdit}
        onSetTaskTitle={setTaskItemTitle}
        onSetCompleted={handleCompleted}
      />
    );
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
        onChangeDate={(e) => setTaskDueDate(e.target.value)}
        dueDate={taskDueDate}
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
