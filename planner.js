const planner = document.getElementById('planner');
const currentDateEl = document.getElementById('currentDate');
const clearBtn = document.getElementById('clearBtn');

const BUSINESS_HOURS = [9,10,11,12,13,14,15,16,17]; 

function formatHour(hour24) {
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12} ${ampm}`;
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('simpleDayPlannerTasks')) || {};
  } catch {
    return {};
  }
}

function saveTasks(tasks) {
  localStorage.setItem('simpleDayPlannerTasks', JSON.stringify(tasks));
}

function createTimeBlocks() {
  const tasks = loadTasks();
  const now = new Date();
  const currentHour = now.getHours();

  planner.innerHTML = '';

  BUSINESS_HOURS.forEach(hour => {
    const block = document.createElement('section');
    block.classList.add('time-block');

    if (hour < currentHour) {
      block.classList.add('past');
    } else if (hour === currentHour) {
      block.classList.add('present');
    } else {
      block.classList.add('future');
    }

    const hourLabel = document.createElement('div');
    hourLabel.className = 'hour';
    hourLabel.textContent = formatHour(hour);
    hourLabel.setAttribute('aria-label', `Hour ${formatHour(hour)}`);

    const taskInput = document.createElement('textarea');
    taskInput.className = 'task';
    taskInput.rows = 3;
    taskInput.value = tasks[hour] || '';
    taskInput.setAttribute('aria-label', `Task for ${formatHour(hour)}`);
    taskInput.dataset.hour = hour;

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = '💾';
    saveBtn.setAttribute('aria-label', `Save task for ${formatHour(hour)}`);

    saveBtn.addEventListener('click', () => {
      const tasks = loadTasks();
      const val = taskInput.value.trim();

      if (val) {
        tasks[hour] = val;
      } else {
        delete tasks[hour];
      }

      saveTasks(tasks);

      saveBtn.textContent = '✔️';
      setTimeout(() => (saveBtn.textContent = '💾'), 1500);
    });

    block.appendChild(hourLabel);
    block.appendChild(taskInput);
    block.appendChild(saveBtn);

    planner.appendChild(block);
  });
}

function updateCurrentDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDateEl.textContent = now.toLocaleDateString(undefined, options);
}

function clearAllTasks() {
  if (confirm('Are you sure you want to clear all tasks?')) {
    localStorage.removeItem('simpleDayPlannerTasks');
    createTimeBlocks();
  }
}

function init() {
  createTimeBlocks();
  updateCurrentDate();
  clearBtn.addEventListener('click', clearAllTasks);
}

window.addEventListener('DOMContentLoaded', init);
