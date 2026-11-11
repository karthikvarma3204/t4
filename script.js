// Small frontend-only task manager; tasks persist in localStorage.
const input = document.querySelector('.txt-area');
const list = document.querySelector('.task-list');
let tasks = [];
try { tasks = JSON.parse(localStorage.getItem('todo-tasks') || '[]'); } catch (_) { tasks = []; }
if (!Array.isArray(tasks)) tasks = [];

function save() { localStorage.setItem('todo-tasks', JSON.stringify(tasks)); }
function render() {
  list.replaceChildren();
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'task-list-item';
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'checkbox';
    check.checked = Boolean(task.done);
    check.setAttribute('aria-label', 'Select ' + task.text);
    check.addEventListener('change', () => { tasks[i].done = check.checked; save(); });
    const value = document.createElement('input');
    value.className = 'task-content';
    value.value = task.text;
    value.readOnly = true;
    const edit = document.createElement('button');
    edit.className = 'edit-button';
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => {
      if (value.readOnly) { value.readOnly = false; value.focus(); edit.textContent = 'Save'; }
      else { const text = value.value.trim(); if (!text) return; tasks[i].text = text.slice(0, 100); value.readOnly = true; edit.textContent = 'Edit'; save(); render(); }
    });
    const del = document.createElement('button');
    del.className = 'delete-button';
    del.textContent = 'Delete';
    del.addEventListener('click', () => { tasks.splice(i, 1); save(); render(); });
    li.append(check, value, edit, del);
    list.append(li);
  });
}
function addTask() {
  const text = input.value.trim();
  if (!text) return;
  if (tasks.length >= 7) { alert('Maximum 7 tasks in this demo.'); return; }
  tasks.push({text:text.slice(0, 100),done:false}); input.value=''; save(); render();
}
document.querySelector('.add').addEventListener('click', addTask);
document.querySelector('.clear').addEventListener('click', () => { tasks=tasks.filter(t=>!t.done);save();render(); });
input.addEventListener('keydown', e=>{if(e.key==='Enter'){e.preventDefault();addTask();}});
render();
