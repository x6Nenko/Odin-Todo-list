import { findActiveProject } from "./index.js";

const openFormBtn = document.getElementById("openFormBtn");
openFormBtn.addEventListener("click", function() {
    const formContainer = document.querySelector(".form-container");
    formContainer.style.display = "block";
});

function createTodoDomElement(todosContainer, uniqueId, title, description, dueData, priority) {
    todosContainer.appendChild(document.createElement("article")).id = uniqueId;
    const itemElement = document.getElementById(uniqueId);
    itemElement.classList.add("todo-item");
    const infoDivElement = itemElement.appendChild(document.createElement("div"));
    infoDivElement.appendChild(document.createElement("h2")).innerText = `${title}`;
    infoDivElement.appendChild(document.createElement("p")).innerText = `${description}`;
    const extraInfoDivElement = itemElement.appendChild(document.createElement("div")); 
    extraInfoDivElement.appendChild(document.createElement("p")).innerText = `${dueData}`;
    extraInfoDivElement.appendChild(document.createElement("p")).innerText = `${priority}`;
};

let latestTodoItemListCopy = [];
export function renderNewTodoItem(todoItemList) {
    latestTodoItemListCopy = [...todoItemList];
    const todosContainer = document.querySelector(".todos-container");
    const activeProjectIndex = findActiveProject();
    const idOfLatestItem = todoItemList[activeProjectIndex].tasks.length - 1;
    const latestItem = todoItemList[activeProjectIndex].tasks[idOfLatestItem];
    const latestItemUniqueDomId = `${activeProjectIndex}-${idOfLatestItem}`;

    createTodoDomElement(todosContainer, latestItemUniqueDomId, latestItem.title, latestItem.description, latestItem.dueData, latestItem.priority);
};

function removeCurrentlyDisplayedTodos() {
    const currentlyDisplayedTodos = document.querySelectorAll(".todo-item");
    currentlyDisplayedTodos.forEach(item => {
        item.remove();
    });
};

function renderTodosForSelectedProject() {
    removeCurrentlyDisplayedTodos();
    const activeProjectIndex = findActiveProject();
    const activeProjectTodos = latestTodoItemListCopy[activeProjectIndex].tasks;
    const todosContainer = document.querySelector(".todos-container");
 
    if (activeProjectTodos.length > 0) {
        activeProjectTodos.forEach((item, index) => {
            const itemUniqueDomId = `${activeProjectIndex}-${index}`;
            createTodoDomElement(todosContainer, itemUniqueDomId, item.title, item.description, item.dueData, item.priority);
        }); 
    };
};

export function renderProjects(todoItemList) {
    const projectContainer = document.querySelector(".project-container");
    todoItemList.forEach(item => {
        const projectLabel = projectContainer.appendChild(document.createElement("div"));
        projectLabel.classList.add("project-label");
        projectLabel.innerText = `${item.name}`;
    });
    setActiveProject();
};

function setActiveProject() {
    const allProjectLabels = document.querySelectorAll(".project-label");
    allProjectLabels[0].classList.add("active");

    allProjectLabels.forEach(label => {
        label.addEventListener("click", function() {
            unsetUnactiveProjects();
            label.classList.add("active");
            renderTodosForSelectedProject();
        });
    });
};

function unsetUnactiveProjects() {
    const allProjectLabels = document.querySelectorAll(".project-label");

    allProjectLabels.forEach(label => {
        label.classList.remove("active");
    });
};

// Get todo form into normal conditions +
// Make title input required and make a tip +
// expand a single todo to see/edit its details
// delete a todo
// localstorage