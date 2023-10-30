import { findActiveProject } from "./index.js";

const openFormBtn = document.getElementById("openFormBtn");
openFormBtn.addEventListener("click", function() {
    const formContainer = document.querySelector(".form-container");
    formContainer.style.display = "block";
});



// UTILS =====>

function destructureUniqueId(uniqueId) {
    return uniqueId.split("-");
};

// <===== UTILS



// MODALS =====>

function provideModalForTodoItem(uniqueId) {
    const todoItem = document.getElementById(uniqueId);
    const infoModal = document.querySelector(".info-modal");
    const closeModalBtn = document.getElementById("closeModalBtn");

    openModal(todoItem, infoModal, uniqueId);
    closeModal(infoModal, closeModalBtn);
};

function loadTodoInfoIntoModal(uniqueId) {
    const destructuredId = destructureUniqueId(uniqueId);
    const projectId = destructuredId[0];
    const todoItemId = destructuredId[1];
    const todoItem = latestTodoItemListCopy[projectId].tasks[todoItemId];
    
    const modalHeader = document.querySelector(".modal-header");
    const modalDescription = document.querySelector(".modal-description");
    const modalDueData = document.querySelector(".modal-dueData");
    const lowPriority = document.querySelector("#editLow");
    const middlePriority = document.querySelector("#editMiddle");
    const highPriority = document.querySelector("#editHigh");

    modalHeader.innerText = todoItem.title;
    // console.log(modalDescription.innerText === "");
    modalDescription.innerText = todoItem.description;
    modalDueData.value = todoItem.dueData;
    todoItem.priority === "low" ? lowPriority.checked = true :
    todoItem.priority === "middle" ? middlePriority.checked = true :
    todoItem.priority === "high" ? highPriority.checked = true : null;

    listenForEdits(todoItem, modalHeader, modalDescription, modalDueData, lowPriority, middlePriority, highPriority);
};

let isEditedTodoItem = false;

function checkIfItWasEdited() {
    if (isEditedTodoItem === true) {
        isEditedTodoItem = false;
        return renderTodosForSelectedProject();
    };

    return null;
};

function listenForEdits(todoItem, modalHeader, modalDescription, modalDueData, lowPriority, middlePriority, highPriority) {
    modalHeader.addEventListener("input", function() {
        todoItem.title = modalHeader.innerText;
        isEditedTodoItem = true;
    });

    modalDescription.addEventListener("input", function() {
        todoItem.description = modalDescription.innerText;
        isEditedTodoItem = true;
    });

    modalDueData.addEventListener("change", function() {
        todoItem.dueData = modalDueData.value;
        isEditedTodoItem = true;
    });

    lowPriority.addEventListener("change", function() {
        if (lowPriority.checked) {
            todoItem.priority = lowPriority.value;
            isEditedTodoItem = true;
        }
    });

    middlePriority.addEventListener("change", function() {
        if (middlePriority.checked) {
            todoItem.priority = middlePriority.value;
            isEditedTodoItem = true;
        }
    });

    highPriority.addEventListener("change", function() {
        if (highPriority.checked) {
            todoItem.priority = highPriority.value;
            isEditedTodoItem = true;
        }
    });
};

function openModal(todoItem, infoModal, uniqueId) {
    todoItem.addEventListener("click", function() {
        loadTodoInfoIntoModal(uniqueId);
        infoModal.style.display = "block";
    });
};

function closeModal(infoModal, closeModalBtn) {
    closeModalBtn.addEventListener("click", function() {
        infoModal.style.display = "none";
        checkIfItWasEdited();
    });

    window.addEventListener("click", function(event) {
        if (event.target == infoModal) {
            infoModal.style.display = "none";
            checkIfItWasEdited();
        }
    });
};

// <===== MODALS



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
    provideModalForTodoItem(latestItemUniqueDomId);
};

function removeCurrentlyDisplayedTodos() {
    const currentlyDisplayedTodos = document.querySelectorAll(".todo-item");
    currentlyDisplayedTodos.forEach(item => {
        item.remove();
    });
};

// Function below exported just to generate initial todos.
export function renderTodosForSelectedProject() {
    removeCurrentlyDisplayedTodos();
    const activeProjectIndex = findActiveProject();
    const activeProjectTodos = latestTodoItemListCopy[activeProjectIndex].tasks;
    const todosContainer = document.querySelector(".todos-container");
 
    if (activeProjectTodos.length > 0) {
        activeProjectTodos.forEach((item, index) => {
            const itemUniqueDomId = `${activeProjectIndex}-${index}`;
            createTodoDomElement(todosContainer, itemUniqueDomId, item.title, item.description, item.dueData, item.priority);
            provideModalForTodoItem(itemUniqueDomId);
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

// expand a single todo to see/edit its details +
// delete a todo
// localstorage