import { useEffect, useState } from "react";
import { API_URL } from "./api/url";
import AddTasks from "./components/AddTasks";
import Tasks from "./components/Tasks";
import Task from "./type/tasks";
import Title from "./components/Title";

type TaskFromApi = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
};

function mapApiToTask(row: TaskFromApi): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    isComplited: row.isCompleted,
  };
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      setLoadError(null);
      const res = await fetch(`${API_URL}/tasks`);

      if (!res.ok) {
        const text = await res.text();
        if (!cancelled)
          setLoadError(text || `Erro ${res.status}`);
        return;
      }

      const data = (await res.json()) as TaskFromApi[];
      if (!cancelled) setTasks(data.map(mapApiToTask));
    }

    loadTasks()
      .catch((e: unknown) => {
        if (!cancelled)
          setLoadError(e instanceof Error ? e.message : "Falha ao carregar");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function onTaskClick(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const nextCompleted = !task.isComplited;

    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: nextCompleted }),
    });

    if (!res.ok) {
      const text = await res.text();
      alert(`Erro ao atualizar: ${text || res.status}`);
      return;
    }

    const updated = (await res.json()) as TaskFromApi;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? mapApiToTask(updated) : t)),
    );
  }

  async function onDeleteTask(taskId: string) {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      alert(`Erro ao deletar: ${text || res.status}`);
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }

  async function onAddTask(title: string, description: string) {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      const text = await res.text();
      alert(`Erro ao criar: ${text || res.status}`);
      return;
    }

    const created = (await res.json()) as TaskFromApi;
    setTasks((prev) => [...prev, mapApiToTask(created)]);
  }

  return (
    <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
      <div className="w-[500px] space-y-4">
        <Title>Gerenciador de Tarefas</Title>
        {loadError && (
          <p className="text-red-100 text-sm bg-red-900/50 p-3 rounded-md">
            {loadError}
          </p>
        )}
        {loading ? (
          <p className="text-slate-200">Carregando tarefas…</p>
        ) : (
          <>
            <AddTasks onAddTask={onAddTask} />
            <Tasks
              tasks={tasks}
              onTaskClick={onTaskClick}
              onDeleteTask={onDeleteTask}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
