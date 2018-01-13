let todos = [];

window.addEventListener("load", async function () {
    document.getElementById("todo-create").onclick = createTodo;
    try {
        todos = await loadTodos();
        renderTodos();
    } catch (error) {
        if (error.code === "ENOENT") {
            // The file could not be found.
            // Ignore this error and assume no prior todos exist.
            return;
        }

        alert("An error ocurred while loading your todos: " + error.message);
        console.log(error);
    }
});

class Todo {
    constructor(text, date, completed) {
        this.text = text;
        if (date !== undefined) {
            this.date = date;
        } else {
            this.date = new Date();
        }
        if (completed !== undefined) {
            this.completed = completed;
        } else {
            this.completed = false;
        }
        // Use milliseconds since January 1, 1970 as the id.
        this.id = this.date.getTime();
    }

    getElement() {
        let element = document.createElement("div");
        element.id = this.id;
        element.classList.add("todo");

        // Format the date and time.
        let date = this.date.toString().substring(0, 15);
        let hours = this.date.getHours();
        let minutes = this.date.getMinutes() < 10 ? "0" + this.date.getMinutes() : this.date.getMinutes();
        let time = hours + ":" + minutes;
        let dateAndTime = date + " @ " + time;

        element.innerHTML = `
            <p class="todo-text">
                <input class="todo-complete" type="checkbox" ${this.completed ? "checked": ""}/>
                ${this.text}
            </p>
            <p class="todo-date">${dateAndTime}</p>
            <button class="todo-edit btn">
                <i class="material-icons">edit</i>
            </button>
            <button class="todo-delete btn">
                <i class="material-icons">delete</i>
            </button>
        `;
        element.querySelector(".todo-complete").onclick = () => completeTodo(this.id);
        element.querySelector(".todo-edit").onclick = () => editTodo(this.id);
        element.querySelector(".todo-delete").onclick = () => deleteTodo(this.id);
        return element;
    }
}

function createTodo() {
    let textInputElement = document.getElementById("todo-text-input");
    let text = textInputElement.value;
    textInputElement.value = "";
    todos.push(new Todo(text));
    renderTodos();
    saveTodos();
}

function editTodo(id) {
    // Make the text editable.
    let todoElement = document.getElementById(id);
    let textElement = todoElement.querySelector(".todo-text");
    textElement.contentEditable = "true";
    textElement.style.backgroundColor = "white";
    // Replace the edit button with a save button.
    let editButton = todoElement.querySelector(".todo-edit");
    editButton.innerHTML = `<i class="material-icons">save</i>`;
    editButton.onclick = () => saveTodo(id);
}

function completeTodo(id) {
    let index = getTodoIndexById(id);
    let todo = todos[index];
    if (todo.completed) {
        todo.completed = false;
    } else {
        todo.completed = true;
    }
    saveTodos();
}

function saveTodo(id) {
    // Reset all the elements back to their original states.
    let todoElement = document.getElementById(id);
    let textElement = todoElement.querySelector(".todo-text");
    textElement.contentEditable = "false";
    textElement.style.backgroundColor = "transparent";
    let editButton = todoElement.querySelector(".todo-edit");
    editButton.innerHTML = `<i class="material-icons">edit</i>`;
    editButton.onclick = () => editTodo(id);
    // Update the text in the todos array and save.
    let newText = textElement.innerHTML;
    let index = getTodoIndexById(id);
    todos[index] = new Todo(newText);
    renderTodos();
    saveTodos();
}

function deleteTodo(id) {
    let index = getTodoIndexById(id);
    todos.splice(index, 1);
    renderTodos();
    saveTodos();
}

function renderTodos() {
    let todoList = document.getElementById("todo-list");
    // Delete all currently displayed todos.
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
    // Show the new list of todos.
    for (let todo of todos) {
        let element = todo.getElement();
        todoList.appendChild(element);
    }
}

function getTodoIndexById(id) {
    // Find the todo in the todos array.
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        if (todo.id === id) {
            return i;
        }
    }
    throw new Error("Todo not found in array.");
}

// Loading and saving todos to the filesystem.
const fs = require('fs');
const file = "./todos.json";

function loadTodos() {
    return new Promise((resolve, reject) => {
        fs.readFile(file, "utf-8", (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            let todos = JSON.parse(data);
            todos = todos.map(todo => new Todo(todo.text, new Date(todo.date), todo.completed));
            resolve(todos);
        });
    });
}

function saveTodos() {
    fs.writeFile(file, JSON.stringify(todos), error => {
        if (error) {
            alert("An error ocurred while saving your todos: " + error.message);
            console.log(error);
            return;
        }
    });
}
