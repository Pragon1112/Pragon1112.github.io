const POINTS_KEY = "points";
const TASKS_KEY = "tasks";

const pointsDisplay = document.getElementById("points");
const taskList = document.getElementById("taskList");
let tasks = [];
let points = 0;

function saveTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem(TASKS_KEY);
    tasks = stored ? JSON.parse(stored) : [];
}

function savePoints() {
    localStorage.setItem(POINTS_KEY, String(points));
}

function updatePointsDisplay() {
    pointsDisplay.textContent = `Your points: ${points}`;
    savePoints();
}

function renderTask(task) {
    const container = document.createElement("div");
    container.className = "task-item";

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = task.completed;

    const label = document.createElement("label");
    label.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "del";
    deleteBtn.textContent = "🗑️";

    box.addEventListener("change", () => {
        task.completed = box.checked;
        saveTasks();

        if (box.checked) {
            points += 1;
        } else {
            points -= 1;
        }

        updatePointsDisplay();
    });

    deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        container.remove();
        saveTasks();
        // keep points unchanged when task is deleted
    });

    container.append(box, label, deleteBtn);
    taskList.appendChild(container);
}

function renderAllTasks() {
    taskList.innerHTML = "";
    tasks.forEach(renderTask);
}

function addNewTask() {
    const text = window.prompt("Enter name of task:");
    if (!text || !text.trim()) {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text.trim(),
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    // points stay unchanged when adding a new task (unless checked)
}

function init() {
    const pointValue = localStorage.getItem(POINTS_KEY);
    points = pointValue !== null ? Number(pointValue) : 0;

    loadTasks();
    renderAllTasks();
    updatePointsDisplay();
}

init();

//100