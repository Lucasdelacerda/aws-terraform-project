const API_URL = window.location.origin;

async function loadTasks() {
    try {
        const res = await fetch(`${API_URL}/tasks`);
        if (!res.ok) throw new Error("Falha ao carregar tarefas");
        const tasks = await res.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

        tasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task";

            const title = document.createElement("span");
            title.textContent = task.title;

            const button = document.createElement("button");
            button.className = "delete";
            button.textContent = "X";
            button.addEventListener("click", () => deleteTask(task.id));

            div.append(title, button);
            list.appendChild(div);
        });
    } catch (error) {
        document.getElementById("taskList").textContent = error.message;
    }
}

async function createTask() {
    const input = document.getElementById("taskInput");

    const title = input.value.trim();
    if (!title) return;

    const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    if (!res.ok) return alert("Não foi possível criar a tarefa.");

    input.value = "";
    loadTasks();
}

async function deleteTask(id) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) return alert("Não foi possível remover a tarefa.");

    loadTasks();
}

loadTasks();
