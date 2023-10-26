import { findActiveProject } from "./index.js";

const openFormBtn = document.getElementById("openFormBtn");
openFormBtn.addEventListener("click", function() {
    const formContainer = document.querySelector(".form-container");
    formContainer.style.display = "block";
});

export function renderNewTodoItem(todoItemList) {
    const todosContainer = document.querySelector(".todos-container");
    const activeProjectIndex = findActiveProject();
    const idOfLatestItem = todoItemList[activeProjectIndex].tasks.length - 1;
    const latestItem = todoItemList[activeProjectIndex].tasks[idOfLatestItem];
    const latestItemUniqueDomId = `${activeProjectIndex}-${idOfLatestItem}`;
    
    todosContainer.appendChild(document.createElement("article")).id = latestItemUniqueDomId;
    const itemElement = document.getElementById(latestItemUniqueDomId);
    itemElement.classList.add("todo-item");
    const infoDivElement = itemElement.appendChild(document.createElement("div"));
    infoDivElement.appendChild(document.createElement("h2")).innerText = `${latestItem.title}`;
    infoDivElement.appendChild(document.createElement("p")).innerText = `${latestItem.description}`;
    const extraInfoDivElement = itemElement.appendChild(document.createElement("div")); 
    extraInfoDivElement.appendChild(document.createElement("p")).innerText = `${latestItem.dueData}`;
    extraInfoDivElement.appendChild(document.createElement("p")).innerText = `${latestItem.priority}`;
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
        });
    });
};

function unsetUnactiveProjects() {
    const allProjectLabels = document.querySelectorAll(".project-label");

    allProjectLabels.forEach(label => {
        label.classList.remove("active");
    });
};

//renderNewTodoItem()