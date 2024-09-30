document.addEventListener('DOMContentLoaded', function() {
    const taskGroups = {
        A: ["Vacuuming", "Washing the Floors"],
        B: ["Washing Bathroom", "Wash Kitchen"]
    };

    const taskContainer = document.getElementById('taskContainer');
    const currentWeekElement = document.getElementById('currentWeek');
    const currentWeekNumber = new Date().getWeek();
    currentWeekElement.textContent = currentWeekNumber;

    let tasksState = JSON.parse(localStorage.getItem('tasksState')) || {};

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
        label.textContent = task;

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
        let groupToggle = currentWeekNumber % 2 === 0;

        const weekDiv = document.createElement('div');
        weekDiv.className = 'week';

        const weekTitle = document.createElement('h2');
        weekTitle.textContent = `Week ${currentWeekNumber}`;
        weekDiv.appendChild(weekTitle);

        const ul = document.createElement('ul');
        Object.keys(taskGroups).forEach(group => {
            taskGroups[group].forEach((task, index) => {
                const owner = groupToggle ? (group === 'A' ? "Jiali" : "Andreas") : (group === 'A' ? "Andreas" : "Jiali");
                ul.appendChild(createTaskElement(currentWeekNumber, task, index, owner));
            });
            groupToggle = !groupToggle;
        });
        weekDiv.appendChild(ul);
        taskContainer.appendChild(weekDiv);
    }

    renderTasks();

    const shoppingListState = JSON.parse(localStorage.getItem('shoppingListState')) || [];
    const shoppingListElement = document.getElementById('shoppingList');

    function renderShoppingList() {
        shoppingListElement.innerHTML = '';
        shoppingListState.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = item.bought ? 'done' : '';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.bought;
            checkbox.addEventListener('change', function() {
                item.bought = this.checked;
                localStorage.setItem('shoppingListState', JSON.stringify(shoppingListState));
                renderShoppingList();
            });
            const label = document.createElement('label');
            label.textContent = item.name;

            li.appendChild(checkbox);
            li.appendChild(label);
            shoppingListElement.appendChild(li);
        });
    }

    function addItem() {
        const newItemInput = document.getElementById('newItem');
        const newItem = newItemInput.value.trim();
        if (newItem !== '') {
            shoppingListState.push({ name: newItem, bought: false });
            localStorage.setItem('shoppingListState', JSON.stringify(shoppingListState));
            newItemInput.value = '';
            renderShoppingList();
        }
    }

    renderShoppingList();
});

Date.prototype.getWeek = function() {
    const firstJan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - firstJan) / 86400000) + firstJan.getDay() + 1) / 7);
};
