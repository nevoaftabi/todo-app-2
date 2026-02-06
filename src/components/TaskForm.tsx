import type { TaskProps } from '../App';

const TaskItem = ({ task } : TaskProps) => {
  return (
    <>
        <form action="" >
            <label htmlFor="title">Title</label>
            <input type="text" id='title' />

            <label htmlFor="subject">Subject</label>
            <input type="text" id='subject' />
        </form>
    </>
  )
}

export default TaskItem;