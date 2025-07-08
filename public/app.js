const list = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");

async function loadTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  list.innerHTML = "";
  todos.forEach(addTodoToList);
}

function addTodoToList(todo) {
  const li = document.createElement("li");
  li.textContent = todo.text;
  const del = document.createElement("button");
  del.textContent = "Delete";
  del.onclick = async () => {
    await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
    li.remove();
  };
  li.appendChild(del);
  list.appendChild(li);
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const text = input.value;
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const newTodo = await res.json();
  addTodoToList(newTodo);
  input.value = "";
};

loadTodos();
