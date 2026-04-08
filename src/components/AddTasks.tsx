import { useState } from "react";
import Input from "./Input";

function AddTasks(props: {
  onAddTask: (title: string, description: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-4 p-6  bg-slate-200 rounded-md shadow flex flex-col">
      <Input
        type="text"
        placeholder="Digite o Titulo da Tarefa"
        value={title}
        onChange={(events) => setTitle(events.target.value)}
      />
      <Input
        type="text"
        placeholder="Digite a Descrição da Tarefa"
        value={description}
        onChange={(events) => setDescription(events.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        onClick={() => {
          if (title.trim() === "" || description.trim() === "") {
            alert("Preencha todos os campos");
            return;
          }
          props.onAddTask(title, description);
          setTitle("");
          setDescription("");
        }}
      >
        Adicionar Tarefa
      </button>
    </div>
  );
}

export default AddTasks;
