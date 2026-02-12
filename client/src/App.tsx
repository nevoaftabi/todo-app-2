import { useEffect, useState, type ChangeEvent, type JSX } from "react";
import type { Task } from "./components/Task";
import TaskForm, { type TaskFormProps } from "./components/TaskForm";
import ControlsBar from "./components/ControlsBar";
import TaskList from "./components/TaskList";
import { Routes, Route } from "react-router-dom";

export type Filter = "all" | "active" | "done";
export type DateSort = "oldest" | "newest";

type HomeProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  filter: Filter;
  setFilter: (f: Filter) => void;
  dateSort: DateSort;
  handleDateSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  search: string;
  setSearch: (s: string) => void;
  displayTasks: () => JSX.Element;
};

function Home({
  setTasks,
  filter,
  setFilter,
  dateSort,
  handleDateSortChange,
  search,
  setSearch,
  displayTasks,
}: HomeProps) {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">📖 Study Tracker</h1>
            <p className="text-sm text-slate-500">Add tasks, filter, and track due dates</p>
          </div>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-lg space-y-6">
          <TaskForm
            onAdd={({ title, subject, dueDate }) => {
              setTasks((tasks) => [
                ...tasks,
                {
                  id: crypto.randomUUID(),
                  title,
                  subject,
                  dueDate,
                  isCompleted: false,
                  isEditMode: false,
                  tempTitle: "",
                  createdAt: Date.now(),
                },
              ]);
            }}
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <ControlsBar
              dateSort={dateSort}
              filter={filter}
              onDateSortChange={handleDateSortChange}
              onSearchChange={(e) => setSearch(e.target.value)}
              search={search}
              setFilter={setFilter}
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-slate-700">Tasks</h2>
            <ul className="space-y-2">{displayTasks()}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}


function App() {
  const [filter, setFilter] = useState<Filter>("all");
  const [dateSort, setDateSort] = useState<DateSort>("newest");
  const [search, setSearch] = useState("");
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

  // const addTask = () => {
  //   setTasks((tasks) => [
  //     ...tasks,
  //     {
  //       id: crypto.randomUUID(),
  //       title: trimmedTitle,
  //       subject: trimmedSubject,
  //       isCompleted: false,
  //       isEditMode: false,
  //       tempTitle: "",
  //       createdAt: Date.now(),
  //       dueDate: taskDueDate,
  //     },
  //   ]);
  // };

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
  <Routes>
    <Route
      path="/"
      element={
        <Home
          tasks={tasks}
          setTasks={setTasks}
          filter={filter}
          setFilter={setFilter}
          dateSort={dateSort}
          handleDateSortChange={handleDateSortChange}
          search={search}
          setSearch={setSearch}
          displayTasks={displayTasks}
        />
      }
    />
  </Routes>
  );
  // <div className="min-h-screen bg-slate-100 p-6">
  //   <div className="mx-auto w-full max-w-3xl space-y-6">
  //     <header className="flex items-center gap-3">
  //       <div>
  //         <h1 className="text-2xl font-semibold text-slate-900">
  //           📖 Study Tracker
  //         </h1>
  //         <p className="text-sm text-slate-500">
  //           Add tasks, filter, and track due dates
  //         </p>
  //       </div>
  //     </header>

  //     <div className="rounded-2xl bg-white p-6 shadow-lg space-y-6">
  //       <TaskForm
  //         onAdd={addTask}
  //         title={taskTitle}
  //         subject={taskSubject}
  //         onChangeSubject={(e) => setTaskSubject(e.target.value)}
  //         onChangeTitle={(e) => setTaskTitle(e.target.value)}
  //         onChangeDate={(e) => setTaskDueDate(e.target.value)}
  //         dueDate={taskDueDate}
  //       />

  //       <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
  //         <ControlsBar
  //           dateSort={dateSort}
  //           filter={filter}
  //           onDateSortChange={handleDateSortChange}
  //           onSearchChange={(e) => setSearch(e.target.value)}
  //           search={search}
  //           setFilter={(filter: Filter) => setFilter(filter)}
  //         />
  //       </div>

  //       <div className="space-y-3">
  //         <h2 className="text-sm font-medium text-slate-700">Tasks</h2>
  //         <ul className="space-y-2">{displayTasks()}</ul>
  //       </div>
  //     </div>
  //   </div>
  // </div>
}
export default App;
