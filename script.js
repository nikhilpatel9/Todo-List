const todyTodo = document.getElementById('today');
const futureTodo = document.getElementById('future');
const doneTodo = document.getElementById('done');

const itemName = document.getElementById('item');
const itemDate = document.getElementById('date');
const itemPriority = document.getElementById('priority');

const todayBox = document.getElementById('today-list');
const futureBox = document.getElementById('future-list');
const doneBox = document.getElementById('done-list');

const btn = document.getElementById('btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

btn.addEventListener('click', handleSubmit);

function handleSubmit() {

    const itemValue = itemName.value.trim();
    const itemTime = itemDate.value;
    const itemPri = itemPriority.value;

    if (!itemValue || !itemTime || !itemPri) {
        alert("Please Enter all detail");
        return;
    }

    const selectedDate = new Date(itemTime);
    const today = new Date();

    selectedDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (selectedDate < today) {
        alert("You Can not Enter past Date");
        return;
    }

    const todo = {
        id: Date.now(),
        task: itemValue,
        date: itemTime,
        priority: itemPri,
        status: "pending"
    };

    todos.push(todo);

    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodos();

    itemName.value = "";
    itemDate.value = "";
    itemPriority.selectedIndex = 0;
}

function renderTodos() {

    todayBox.innerHTML = "";
    futureBox.innerHTML = "";
    doneBox.innerHTML = "";

    const today = new Date();
    today.setHours(0,0,0,0);

    todos.forEach(todo => {

        const todoDate = new Date(todo.date);
        todoDate.setHours(0,0,0,0);

      const li = `
        <li class="todo-item">
            <span class="task">${todo.task}</span>
            <span class="date">${new Date(todo.date).toLocaleDateString()}</span>
            <span class="priority">${todo.priority}</span>

            <div class="actions">
                ${
                    todo.status === "pending"
                    ? `<img
                        src="https://img.magnific.com/free-vector/check-mark-hand-drawn-circle_78370-5986.jpg?semt=ais_hybrid&w=740&q=80"
                        onclick="startTodo(${todo.id})"
                        alt="complete"
                    >`
                    : ""
                }
 
                <img
                    src="data:image/png;base64,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"
                    onclick="deleteTodo(${todo.id})"
                    alt="delete"
                >
            </div>
        </li>
        `;
        if (todo.status === "done") {
            doneBox.innerHTML += li;

        } else if (todoDate.getTime() === today.getTime()) {

            todayBox.innerHTML += li;

        } else {

            futureBox.innerHTML += li;
        }
    });
}

function startTodo(id) {

    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.status = "done";
        }
        return todo;
    });

    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodos();
}

function deleteTodo(id) {

    todos = todos.filter(todo => todo.id !== id);

    localStorage.setItem("todos", JSON.stringify(todos));

    renderTodos();
}

renderTodos();