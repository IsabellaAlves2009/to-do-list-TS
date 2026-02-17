import { PencilSimple, Trash, Circle, Check } from "phosphor-react";
import { motion } from "framer-motion";
import "../index.css"

export type Task = {
    id: number,
    text: string,
    completed: boolean
}

type TaskItemProps = {
    task: Task,
    onToggle: (id: number) => void
    onDelete: (id: number) => void
    onEdit: (task: Task) => void
    editing: boolean
    editingText: string
    setEditingText: (text: string) => void
    onSaveEdit: (id:number) => void
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
  editing,
  editingText,
  setEditingText,
  onSaveEdit,
}: TaskItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={task.completed ? "completed" : ""}
    >
      {editing ? (
        <input
          className="edit-input"
          value={editingText}
          autoFocus
          onChange={(e) => setEditingText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveEdit(task.id)
            if (e.key === "Escape") onSaveEdit(task.id)
          }}
          onBlur={() => onSaveEdit(task.id)}
        />
      ) : (
        <>
          <span
            className="task-text"
            onClick={() => onToggle(task.id)}
          >
            {task.text}
          </span>

          <div className="task-buttons">
            <button onClick={() => onToggle(task.id)}>
              {task.completed ? <Check size={18} weight="bold" /> : <Circle size={18} weight="bold" />}
            </button>
            <button
              className="edit"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(task)
              }}
            >
              <PencilSimple size={16} />
            </button>

            <button
              className="delete"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(task.id)
              }}
            >
              <Trash size={18} />
            </button>
          </div>
        </>
      )}
    </motion.li>
  )
}