const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');


function fetchTasks() {
    fetch('http://localhost:3000/tasks') 
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.task} (${task.status})`;
                li.appendChild(createEditButton(task));
                li.appendChild(createDeleteButton(task.id));
                taskList.appendChild(li);
            });
        });
}


function createEditButton(task) {
    const button = document.createElement('button');
    button.textContent = 'Edit';
    button.onclick = () => editTask(task);
    return button;
}


function createDeleteButton(taskId) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.onclick = () => deleteTask(taskId);
    return button;
}


function addTask() {
    const task = taskInput.value;
    if (!task) return;

    fetch('http://localhost:3000/tasks', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task })
    })
    .then(() => {
        taskInput.value = '';
        fetchTasks();
    });
}


function editTask(task) {
    const newTask = prompt('Edit task:', task.task);
    if (newTask) {
        fetch(`http://localhost:3000/tasks/${task.id}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: newTask, status: task.status })
        })
        .then(() => fetchTasks());
    }
}


function deleteTask(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`, { 
        method: 'DELETE'
    })
    .then(() => fetchTasks());
}


fetchTasks();