const taskInput = document.querySelector('input[name="addedTask"]');
const colorInput = document.querySelector('input[name="color"]');
const sizeInput = document.querySelector('input[name="fontSize"]');
const listForm = document.querySelector('#listForm');
const listItems = document.querySelector('#listItems');

function saveToLocalStorage(taskList) {
    localStorage.setItem('todos', JSON.stringify(taskList));
}

function getFromLocalStorage() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function addNewTask(text, color, size) {
    const taskDisplay = document.createElement('h3');
    if (text.trim() === '') {
        console.error('Must type a task to add it!');
    } else {
        taskDisplay.innerHTML = `<li class="listItem">${text} <button type="button">Remove</button></li>`;
        taskDisplay.style.color = color;
        taskDisplay.style.fontSize = size + 'px';
        taskDisplay.className = 'added-task';
        listItems.appendChild(taskDisplay);
    }
    return taskDisplay;
}

listForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newTask = addNewTask(taskInput.value, colorInput.value, sizeInput.value);
    addToDoToList(taskInput.value, colorInput.value, sizeInput.value);
    taskInput.value = '';
});

function addToDoToList(text, color, size) {
    const taskList = getFromLocalStorage();
    const newTask = { text, color, size, crossedOut: false };
    taskList.push(newTask);
    saveToLocalStorage(taskList);
}

function removeToDoFromList(text) {
    const taskList = getFromLocalStorage();
    const updatedTaskList = taskList.filter(task => task.text !== text);
    saveToLocalStorage(updatedTaskList);
}

function toggleCrossOut(text) {
    const taskList = getFromLocalStorage();
    const taskIndex = taskList.findIndex(task => task.text === text);
    if (taskIndex !== -1) {
        taskList[taskIndex].crossedOut = !taskList[taskIndex].crossedOut;
        saveToLocalStorage(taskList);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const taskList = getFromLocalStorage();
    taskList.forEach(task => {
        const newTaskElement = addNewTask(task.text, task.color, task.size);
        if (task.crossedOut) {
            newTaskElement.querySelector('li').classList.add('crossed-out');
        }
    });
});

listItems.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON' && e.target.textContent.includes('Remove')) {
        const taskText = e.target.closest('h3').querySelector('.listItem').textContent;
        e.target.closest('h3').remove();
        removeToDoFromList(taskText);
    }
});

listItems.addEventListener('dblclick', function (e) {
    let targetElement = e.target;
    if (targetElement.tagName !== 'LI') {
        targetElement = targetElement.closest('li');
    }
    if (targetElement) {
        targetElement.classList.toggle('crossed-out');
        toggleCrossOut(targetElement.textContent.trim());
    }
});
