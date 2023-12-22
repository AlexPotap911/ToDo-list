const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
  event.preventDefault();
  taskInput.focus();

  const taskTekst = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskTekst,
    done: false,
  };

  tasks.push(newTask);

  safeToLocalStorage();

  renderTask(newTask);

  taskInput.value = '';

  checkEmptyList();
}

function deleteTask(event) {
  if (event.target.dataset.action !== 'delete') return;

  const parentNode = event.target.closest('li');

  const id = Number(parentNode.id);

  tasks = tasks.filter((task) => task.id !== id);

  safeToLocalStorage();

  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  if (event.target.dataset.action !== 'done') return;

  const parentNode = event.target.closest('.task-item');
  const id = Number(parentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });
  task.done = !task.done;

  safeToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done');
}

function safeToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyList = ` <li class="empty-list" id="emptyList">
                <img src="./img/start.svg" alt="start image" />
                <div class="empty-list__title">ToDo list is empty</div>
              </li>`;
    tasksList.insertAdjacentHTML('afterbegin', emptyList);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
  const taskHTML = `<li class="task-item" id="${task.id}">
                <h3 class="${cssClass}">${task.text}</h3>
                <div class="task-buttons">
                  <button type="button" class="btn-action" data-action="done">
                    <img src="./img/tick.svg" width="18" height="18 alt="done">
                  </button>
                  <button type="button" class="btn-action" data-action="delete">
                    <img src="./img/cross.svg" width="18" height="18 alt="delete">
                  </button>
                </div>
              </li>`;

  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
