document.addEventListener('DOMContentLoaded', function() {
    const currentWeekElement = document.getElementById('currentWeek');
    const currentWeekNumber = new Date().getWeek();
    currentWeekElement.textContent = currentWeekNumber;

    // Initialize task and battle elements
    const taskContainer = document.getElementById('taskContainer');
    let tasksState = JSON.parse(localStorage.getItem('tasksState')) || {};

    // Score elements and event listeners for the battle
    const jialiScoreElement = document.getElementById('jialiScore');
    const andreasScoreElement = document.getElementById('andreasScore');
    jialiScoreElement.textContent = localStorage.getItem('jialiScore') || '0';
    andreasScoreElement.textContent = localStorage.getItem('andreasScore') || '0';

    document.getElementById('incrementJiali').addEventListener('click', function() {
        incrementScore('jialiScore');
    });

    document.getElementById('incrementAndreas').addEventListener('click', function() {
        incrementScore('andreasScore');
    });

    function incrementScore(player) {
        let score = parseInt(localStorage.getItem(player)) || 0;
        score++;
        localStorage.setItem(player, score.toString());
        document.getElementById(player).textContent = score;
    }

    // Task management logic
    const tasks = [
        { task: "Vacuuming", type: "A" },
        { task: "Washing the Floors", type: "A" },
        { task: "Washing Bathroom", type: "B" },
        { task: "Wash Kitchen", type: "B" }
    ];

    function createTaskElement(week, task, index, owner) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `week${week}-task${index}`;
        checkbox.checked = tasksState[checkbox.id] || false;

        checkbox.addEventListener('change', function() {
            tasksState[this.id] = this.checked;
            localStorage.setItem('tasksState', JSON.stringify(tasksState));
            this.checked ? li.classList.add('done') : li.classList.remove('done');
        });

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = task.task;

        const taskOwner = document.createElement('span');
        taskOwner.className = 'task-owner';
        taskOwner.textContent = ` - ${owner}'s task`;

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(taskOwner);
        return li;
    }

    function renderTasks() {
        taskContainer.innerHTML = '';
        let groupToggle = currentWeekNumber % 2 === 0; // Toggle roles every week

        const weekDiv = document.createElement('div');
        weekDiv.className = 'week';
        const weekTitle = document.createElement('h2');
        weekTitle.textContent = `Week ${currentWeekNumber}`;
        weekDiv.appendChild(weekTitle);
        const ul = document.createElement('ul');

        // Assign tasks by group and toggle weekly
        tasks.forEach((task, index) => {
            const owner = groupToggle ? (task.type === 'A' ? "Jiali" : "Andreas") : (task.type === 'A' ? "Andreas" : "Jiali");
            ul.appendChild(createTaskElement(currentWeekNumber, task, index, owner));
        });
        weekDiv.appendChild(ul);
        taskContainer.appendChild(weekDiv);
    }

    renderTasks();
});

// Helper function to calculate the current week number of the year
Date.prototype.getWeek = function() {
    const firstJan = new Date(this.getFullYear(), 0, 1);
    const today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    const dayOfYear = ((today - firstJan + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7);
};
