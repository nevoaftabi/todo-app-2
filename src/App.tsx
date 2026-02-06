import { useState, type ChangeEvent, type FormEvent } from "react";
import TaskItem from "./components/TaskForm";

export type Task = {
  id: string;
  title: string;
  subject: string;
  isCompleted: boolean;
  isEditMode: boolean;
};

export type TaskProps = Task & {
  onChangeTitle: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSubject: (e: ChangeEvent<HTMLInputElement>) => void;
};

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: crypto.randomUUID(),
      title: "Finish SQL lab",
      subject: "Databases",
      isCompleted: false,
      isEditMode: false
    },
    {
      id: crypto.randomUUID(),
      title: "Node.js application",
      subject: "Backend",
      isCompleted: false,
      isEditMode: false
    },
  ]);

  // const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();

  //   setTasks((tasks) => {
  //     const index = tasks.findIndex((t) => t.id === e.target.id);
  //     tasks[index].title = e.target.value;

  //     return tasks;
  //   });
  // };
  // const onChangeSubject = (e: ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();

  //   setTasks((tasks) => {
  //     const index = tasks.findIndex((t) => t.id === id);
  //     tasks[index].title = e.target.value;

  //     return tasks;
  //   });
  // };

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
        isEditMode: false
      },
    ]);

    setTaskTitle("");
    setTaskSubject("");
  };


  const handleCompleted = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
    setTasks(prev => 
      prev.map(task => {
        return task.id === taskId ? { ...task, isCompleted: e.target.checked } : task;
    }));
  } 

  const setTaskEdit = (task: Task) => {
    if(!task.isEditMode) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isEditMode: true } : t ));
      return;
    }
    
    if(!task.title.trim()) {
      alert("You need a subject")
    }
    else {
      setTasks(prev => prev.map(task => task.id === task.id ? { ...task, isEditMode: false } : task ));
    }
  };

  const setTaskItemTitle = (e: ChangeEvent<HTMLInputElement>, task: Task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, title: e.target.value } : t ));
  }

  const handleDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId ));
  }

  return (
    <>
      <h1>📘 Study Tracker</h1>
      <label htmlFor="task-title">Title </label>
      <input
        type="text" 
        id="task-title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />
      <br /> <br />
      <label htmlFor="task-subject">Task Subject </label>
      <input
        type="text"
        id="task-subject"
        value={taskSubject}
        onChange={(e) => setTaskSubject(e.target.value)}
      />
      <button onClick={addTask}>Add</button>
      <hr />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              onChange={(e) => handleCompleted(e, task.id)}
              checked={task.isCompleted}
            />
            {task.isEditMode &&  
              <input 
              value={task.title}
              onChange={(e) => setTaskItemTitle(e, task)}
              ></input> 
            }
            {!task.isEditMode &&  task.title} | {task.subject} 
            <button onClick={() => setTaskEdit(task)}>{task.isEditMode ? '✅' : '✏️'}</button> 
            <button onClick={() => handleDelete(task.id)}> 🗑️ </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
