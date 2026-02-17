import { useState, useEffect } from "react"
import { Plus, Moon, Sun, ClipboardText } from "phosphor-react"
import "./App.css"
import { AnimatePresence, motion } from "framer-motion"
import { TaskItem } from "./components/TaskItem"

type Task = {
  id: number
  text: string
  completed: boolean
}

type Filter = "all" | "completed" | "pending"
type Theme = "light" | "dark"

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks")
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [text, setText] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed)
  const completedCount = completedTasks.length
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState("")

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme === "dark" ? "dark" : "light"
  })

  useEffect(() => {
    document.body.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch {
        localStorage.removeItem("tasks")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])


  function deleteTask(id: number) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  function startEditing(task: Task) {
    setEditingId(task.id)
    setEditingText(task.text)
  }

  function clearCompleted() {
    setTasks(tasks.filter(task => !task.completed))
  }

  function toggleTask(id: number) {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  function saveEdit(id: number) {
    if (!editingText.trim()) {
      setEditingId(null)
      return
    }

    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editingText } : task
    ))

    setEditingId(null)
    setEditingText("")
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true
  })


  return (
    <main className="app">
      <h1>To-Do List</h1>

      <button
        className="theme-toggle"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light"
          ? <Moon size={20} weight="bold" />
          : <Sun size={20} weight="bold" />
        }
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!text.trim()) return

          setTasks([
            ...tasks,
            {
              id: Date.now(),
              text,
              completed: false
            }
          ])
          setText("")
        }}
      >
        <input
          value={text}
          placeholder="Digite uma tarefa..."
          onChange={(e) => setText(e.target.value)}
        />
          <button type="submit">
            <Plus size={18} weight="bold" />
          </button>
        </form>

        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>

          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pendentes
          </button>

          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Concluídas
          </button>
      </div>
      {filteredTasks.length === 0 ? (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ClipboardText size={48} />
        {filter === "all" && <p>Nenhuma tarefa ainda</p>}
        {filter === "pending" && <p>Nenhuma tarefa pendente 🎉</p>}
        {filter === "completed" && <p>Nenhuma tarefa concluída</p>}
      </motion.div>
    ) : (
      <ul>
        <AnimatePresence>
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={startEditing}
              editing={editingId === task.id}
              editingText={editingText}
              setEditingText={setEditingText}
              onSaveEdit={saveEdit}
            />
          ))}
        </AnimatePresence>
      </ul>
      )}
      {filter === "completed" && completedTasks.length > 0 && (
        <motion.button
          className="clear-completed"
          onClick={clearCompleted}
        >
          Excluir concluídas
        </motion.button>
      )}
      <div className="progress">
        <span>{completedCount} de {totalTasks} concluídas</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: totalTasks === 0
                ? "0%"
                : `${(completedCount / totalTasks) * 100}%`
            }}
          />
        </div>
      </div>
    </main>
  )
}

export default App
