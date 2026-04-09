import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { API_URL } from "../api/url";
import Title from "../components/Title";

type TaskFromApi = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt?: string;
};

function TaskPages() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [task, setTask] = useState<TaskFromApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID da tarefa em falta.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setError(null);
      const res = await fetch(`${API_URL}/tasks/${id}`);

      if (!res.ok) {
        const text = await res.text();
        if (!cancelled)
          setError(text || `Erro ${res.status}`);
        return;
      }

      const data = (await res.json()) as TaskFromApi | null;
      if (!cancelled) {
        if (data === null) setError("Tarefa não encontrada.");
        else setTask(data);
      }
    }

    load()
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Falha ao carregar");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="w-screen h-screen bg-slate-500 flex p-6">
      <div className="w-screen h-screen bg-slate-500 flex justify-center p-6">
        <div className="w-[500px] space-y-4">
          <div className="flex justify-center relative mb-6">
            <button
              type="button"
              className="absolute left-0 top-0 bottom-0 text-slate-100"
              onClick={() => navigate(`/`)}
            >
              <ChevronLeftIcon />
            </button>
            <Title>Detalhes da Tarefa</Title>
          </div>
          {loading && (
            <p className="text-slate-200 text-center">Carregando…</p>
          )}
          {error && (
            <p className="text-red-100 text-sm bg-red-900/50 p-3 rounded-md">
              {error}
            </p>
          )}
          {!loading && !error && task && (
            <div className="bg-slate-200 p-4 rounded-md shadow space-y-2">
              <h2 className="text-xl text-slate-600 font-bold">{task.title}</h2>
              <p className="text-slate-600">{task.description}</p>
              <p className="text-sm text-slate-500">
                {task.isCompleted ? "Concluída" : "Pendente"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskPages;
