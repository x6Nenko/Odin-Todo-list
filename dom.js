import { findActiveProject, removeTodo, getUniqueIdForLatestItem, updateEditedTodoIntoLocalStorage, removeProject, addProject } from "./index.js";
import { destructureUniqueId } from "./utils.js"

const openFormBtn = document.getElementById("openFormBtn");
openFormBtn.addEventListener("click", function() {
    const formContainer = document.querySelector(".form-container");
    formContainer.style.display = "block";
});

const closeFormBtn = document.getElementById("cancelTodo");
closeFormBtn.addEventListener("click", function() {
    const formContainer = document.querySelector(".form-container");
    formContainer.style.display = "none";
});

const openInputToAddProject = document.getElementById("addProjectBtn");
openInputToAddProject.addEventListener("click", function() {
    const addProjectInputs = document.querySelector(".add-project-inputs");
    addProjectInputs.style.display = "block";
});

const closeAddProjectInput = document.getElementById("cancelProject");
closeAddProjectInput.addEventListener("click", function() {
    const addProjectInputs = document.querySelector(".add-project-inputs");
    addProjectInputs.style.display = "none";
});

const addNewProject = document.getElementById("addProject");
addNewProject.addEventListener("click", function() {
    const projectName = document.getElementById("projectName");
    addProject(projectName.value);
});


// MODALS =====>

function provideModalForTodoItem(uniqueId) {
    const todoItem = document.getElementById(uniqueId);
    const infoModal = document.querySelector(".info-modal");
    const closeModalBtn = document.getElementById("closeModalBtn");

    openModal(todoItem, infoModal, uniqueId);
    closeModal(todoItem, infoModal, closeModalBtn);
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

    handleEditListeners(uniqueId, todoItem, modalHeader, modalDescription, modalDueData, lowPriority, middlePriority, highPriority);
};

function reRenderEditedElement(uniqueId, todoItem) {
    const domTodoElement = document.getElementById(uniqueId);
    const headerAndDescription = domTodoElement.querySelectorAll("div")[0];
    const header = headerAndDescription.querySelector("h2");
    const description = headerAndDescription.querySelector("p");
    const dueDateAndPriority = domTodoElement.querySelectorAll("div")[1];
    const dueData = dueDateAndPriority.querySelectorAll("p")[0];
    const priority = dueDateAndPriority.querySelectorAll("p")[1];

    header.innerText = todoItem.title;
    description.innerText = todoItem.description;
    dueData.innerText = todoItem.dueData;
    priority.innerText = todoItem.priority;
};

function handleEditListeners(uniqueId, todoItem, modalHeader, modalDescription, modalDueData, lowPriority, middlePriority, highPriority) {
    modalHeader.addEventListener("input", function() {
        todoItem.title = modalHeader.innerText;
        updateEditedTodoIntoLocalStorage(uniqueId, todoItem);
        reRenderEditedElement(uniqueId, todoItem);
    });

    modalDescription.addEventListener("input", function() {
        todoItem.description = modalDescription.innerText;
        updateEditedTodoIntoLocalStorage(uniqueId, todoItem);
        reRenderEditedElement(uniqueId, todoItem);
    });

    modalDueData.addEventListener("change", function() {
        todoItem.dueData = modalDueData.value;
        updateEditedTodoIntoLocalStorage(uniqueId, todoItem);
        reRenderEditedElement(uniqueId, todoItem);
    });

    lowPriority.addEventListener("change", function() {
        if (lowPriority.checked) {
            todoItem.priority = lowPriority.value;
            updateEditedTodoIntoLocalStorage(uniqueId, todoItem);
            reRenderEditedElement(uniqueId, todoItem);
        };
    });

    middlePriority.addEventListener("change", function() {
        if (middlePriority.checked) {
            todoItem.priority = middlePriority.value;
            updateEditedTodoIntoLocalStorage(uniqueId, todoItem);
            reRenderEditedElement(uniqueId, todoItem);
        };
    });

    highPriority.addEventListener("change", function() {
        if (highPriority.checked) {
            todoItem.priority = highPriority.value;
            updateEditedTodoIntoLocalStorage(uniqueId, todoItem);
            reRenderEditedElement(uniqueId, todoItem);
        };
    });
};

function stopListeningForPreviousTodoModule() {
    // AbortSignal is the best option but it seems to be buggy on the ios
    const modalHeader = document.querySelector(".modal-header");
    const modalDescription = document.querySelector(".modal-description");
    const modalDueData = document.querySelector(".modal-dueData");
    const lowPriority = document.querySelector("#editLow");
    const middlePriority = document.querySelector("#editMiddle");
    const highPriority = document.querySelector("#editHigh");

    modalHeader.replaceWith(modalHeader.cloneNode(true));
    modalDescription.replaceWith(modalDescription.cloneNode(true));
    modalDueData.replaceWith(modalDueData.cloneNode(true));
    lowPriority.replaceWith(lowPriority.cloneNode(true));
    middlePriority.replaceWith(middlePriority.cloneNode(true));
    highPriority.replaceWith(highPriority.cloneNode(true));
};

function openModal(todoItem, infoModal, uniqueId) {
    const viewEditBtn = todoItem.querySelector(".view-edit-btn");
    viewEditBtn.addEventListener("click", function() {
        loadTodoInfoIntoModal(uniqueId);
        infoModal.style.display = "block";
    });
};

function closeModal(todoItem, infoModal, closeModalBtn) {
    closeModalBtn.addEventListener("click", function() {
        infoModal.style.display = "none";
        stopListeningForPreviousTodoModule();
    });

    window.addEventListener("click", function(event) {
        if (event.target == infoModal) {
            infoModal.style.display = "none";
            stopListeningForPreviousTodoModule();
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
    const buttonsContainer = itemElement.appendChild(document.createElement("div")); 
    const viewEditBtn = buttonsContainer.appendChild(document.createElement("button"));
    viewEditBtn.classList.add("view-edit-btn");
    viewEditBtn.innerText = "View / Edit";
    const removeBtn = buttonsContainer.appendChild(document.createElement("button"));
    removeBtn.classList.add("remove-btn");
    removeBtn.innerText = "Remove";
    removeBtnListener(uniqueId, itemElement, removeBtn);
};

function removeBtnListener(uniqueId, itemElement, removeBtn) {
    removeBtn.addEventListener("click", function() {
        removeTodo(uniqueId);
    });
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
    getUniqueIdForLatestItem(latestItemUniqueDomId);
};

export function updateCopyOfTodoList(todoItemList) {
    latestTodoItemListCopy = [...todoItemList];
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
    refreshDomElementForProjects();
    const projectContainer = document.querySelector(".project-container");
    todoItemList.forEach((item, index) => {
        if (item.name) {
            const projectLabel = projectContainer.appendChild(document.createElement("div"));
            projectLabel.classList.add("project-label");
            projectLabel.id = `Project-${index}`;
            const title = projectLabel.appendChild(document.createElement("p"));
            title.innerText = `${item.name}`;
            const btnsContainer = projectLabel.appendChild(document.createElement("div"));
            const deleteProjectBtn = btnsContainer.appendChild(document.createElement("button"));
            deleteProjectBtn.classList.add("delete-project-btn");
            deleteProjectBtn.innerHTML = "Remove";
            deleteProjectBtnHandler(item, index, deleteProjectBtn);
        };
    });
    setActiveProject();
};

function deleteProjectBtnHandler(item, index, deleteProjectBtn) {
    deleteProjectBtn.addEventListener("click", function() {
        removeProject(item, index);
    });
};

function refreshDomElementForProjects() {
    const projectLabels = document.querySelectorAll(".project-label");
    projectLabels.forEach(project => {
        project.remove();
    });
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