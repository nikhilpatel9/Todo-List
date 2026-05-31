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
                    src="https://staging.svgrepo.com/show/21045/delete-button.svg"
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