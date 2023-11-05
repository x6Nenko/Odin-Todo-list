import {renderNewTodoItem, renderProjects, renderTodosForSelectedProject, updateCopyOfTodoList} from "./dom.js";
import { destructureUniqueId } from "./utils.js";

class TodoItem {

    constructor(title, description, dueData, priority, projectIndex) {
        this.title = title;
        this.description = description;
        this.dueData = dueData;
        this.priority = priority;
        //todoItemList[projectIndex].tasks.push(this);
        todoItemList[projectIndex].tasks.push(this);
        renderNewTodoItem(todoItemList);
        saveDataToLocalStorage();
    };

    showItem() {
        console.log(this);
    };
};

const todoItemList = [{name: "default project", tasks: []}, {name: "Another project", tasks: []}, {name: "Superior project", tasks: []}];
const localStorageTodosClipboard = [];
const unpackedProjectsLocalStorage = localStorage.getItem("localStorageProjectsClipboard");
const projects = JSON.parse(unpackedProjectsLocalStorage);
let localStorageProjectsClipboard = [{name: "default project", tasks: []}, {name: "Another project", tasks: []}, {name: "Superior project", tasks: []}];
if (projects) {
    localStorageProjectsClipboard = projects;
};

const form = document.getElementById("myForm");
form.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(form);

    const title = formData.get("title");
    const description = formData.get("description");
    const dueData = formData.get("dueData");
    const priority = formData.get("priority");
    const projectIndex = findActiveProject();

    localStorageTodosClipboard.push({title, description, dueData, priority, projectIndex});
    new TodoItem(title, description, dueData, priority, projectIndex);
    // for (const [name, value] of formData) {
    //     console.log(`${name}: ${value}`);
    // }
});

export function findActiveProject() {
    const currentProjects = document.querySelectorAll(".project-label");
    let activeProjectIndex;
    currentProjects.forEach((project, index) => {
        if (project.classList.contains('active')) {
            const destructuredId = destructureUniqueId(project.id);
            activeProjectIndex = destructuredId[1];
        }
    });
    return activeProjectIndex;
};

export function removeTodo(uniqueId) {
    const destructuredId = destructureUniqueId(uniqueId);
    const projectId = destructuredId[0];
    const todoItemId = destructuredId[1];
    todoItemList[projectId].tasks.splice(todoItemId, 1);
    renderTodosForSelectedProject();
    removeTodoForLocalStorage(uniqueId);
};

export function updateEditedTodoIntoLocalStorage(uniqueId, todoItem) { 
    const updateInLocalStorage = localStorageTodosClipboard.find(item => item.uniqueId === uniqueId);

    if (updateInLocalStorage) {
        updateInLocalStorage.title = todoItem.title;
        updateInLocalStorage.description = todoItem.description;
        updateInLocalStorage.dueData = todoItem.dueData;
        updateInLocalStorage.priority = todoItem.priority;
    };

    saveDataToLocalStorage();
};

function removeTodoForLocalStorage(uniqueId) {
    const indexToRemove = localStorageTodosClipboard.findIndex(todo => todo.uniqueId === uniqueId);

    if (indexToRemove !== -1 && localStorageTodosClipboard.length - 1 == indexToRemove) {
        localStorageTodosClipboard.splice(indexToRemove, 1);
    } else if (indexToRemove !== -1 && localStorageTodosClipboard.length - 1 !== indexToRemove) {
        const currentUniqueId = localStorageTodosClipboard[indexToRemove].uniqueId;
        localStorageTodosClipboard.splice(indexToRemove, 1);
        // const currentIdOfNextItem = localStorageTodosClipboard[indexToRemove].uniqueId
        localStorageTodosClipboard[indexToRemove].uniqueId = currentUniqueId;
    };

    saveDataToLocalStorage();
};

function saveDataToLocalStorage() {
    const todosData = JSON.stringify(localStorageTodosClipboard);
    const projectsData = JSON.stringify(localStorageProjectsClipboard);
    localStorage.setItem("localStorageTodosClipboard", todosData);
    localStorage.setItem("localStorageProjectsClipboard", projectsData);
};

function takeDataFromLocalStorage() {
    const unpackedTodosLocalStorage = localStorage.getItem("localStorageTodosClipboard");
    const todos = JSON.parse(unpackedTodosLocalStorage);

    const unpackedProjectsLocalStorage = localStorage.getItem("localStorageProjectsClipboard");
    const projects = JSON.parse(unpackedProjectsLocalStorage);

    if (projects) {
        todoItemList.splice(0, todoItemList.length);
        projects.forEach(project => {
            todoItemList.push(project);
        });

        // localStorageProjectsClipboard.splice(0, localStorageProjectsClipboard.length);
        // projects.forEach(project => {
        //     localStorageProjectsClipboard.push(project);
        // });

        // copyProjectsToLocalStorageArr();
    };

    if (todos) {
        renderProjects(todoItemList);

        todos.forEach(item => {
            localStorageTodosClipboard.push({
                title: item.title,
                description: item.description,
                dueData: item.dueData,
                priority: item.priority,
                projectIndex: item.projectIndex
              });
            new TodoItem(item.title, item.description, item.dueData, item.priority, item.projectIndex);
        });

        updateCopyOfTodoList(todoItemList);
        renderTodosForSelectedProject();
    };
};

function copyProjectsToLocalStorageArr() {
    localStorageProjectsClipboard.splice(0, localStorageProjectsClipboard.length);
    todoItemList.forEach(project => {
        localStorageProjectsClipboard.push(project);
    });
};

export function addProject(projectName) {
    todoItemList.push({name: projectName, tasks: []});
    localStorageProjectsClipboard.push({name: projectName, tasks: []});

    updateCopyOfTodoList(todoItemList);
    renderProjects(todoItemList);
    saveDataToLocalStorage();
};

export function removeProject(item, index) {
    todoItemList[index] = {name: null};
    localStorageProjectsClipboard[index] = {name: null};

    updateCopyOfTodoList(todoItemList);
    renderProjects(todoItemList);
    saveDataToLocalStorage();
};

export function getUniqueIdForLatestItem(uniqueId) {
    setUniqueIdForLatestItem(uniqueId);
};

function setUniqueIdForLatestItem(uniqueId) {
    const lastTodoIndex = localStorageTodosClipboard.length - 1;
    const lastTodoItem = localStorageTodosClipboard[lastTodoIndex];
    lastTodoItem.uniqueId = uniqueId;
};

function initialTodos() {
    const todos = [
    {
        title: "Random Title 1",
        description: "Some random description",
        dueData: "2023-10-28",
        priority: "middle",
        projectIndex: 0
    },
    {
        title: "Random Title 2",
        description: "Some random description",
        dueData: "2023-10-28",
        priority: "middle",
        projectIndex: 0
    },
    {
        title: "Random Title 3",
        description: "Some random description",
        dueData: "2023-10-28",
        priority: "middle",
        projectIndex: 0
    },
    // {
    //     title: "Random Title",
    //     description: "Some random description",
    //     dueData: "2023-10-28",
    //     priority: "middle",
    //     projectIndex: 1
    // },
    // {
    //     title: "Random Title",
    //     description: "Some random description",
    //     dueData: "2023-10-28",
    //     priority: "middle",
    //     projectIndex: 2
    // },
    // {
    //     title: "Random Title",
    //     description: "Some random description",
    //     dueData: "2023-10-28",
    //     priority: "middle",
    //     projectIndex: 2
    // },
    // {
    //     title: "Random Title",
    //     description: "Some random description",
    //     dueData: "2023-10-28",
    //     priority: "middle",
    //     projectIndex: 2
    // },
    // {
    //     title: "Random Title",
    //     description: "Some random description",
    //     dueData: "2023-10-28",
    //     priority: "middle",
    //     projectIndex: 2
    // }
    ];

    todos.forEach(todo => {
        localStorageTodosClipboard.push({
            title: todo.title,
            description: todo.description,
            dueData: todo.dueData,
            priority: todo.priority,
            projectIndex: todo.projectIndex
          });
        new TodoItem(todo.title, todo.description, todo.dueData, todo.priority, todo.projectIndex)
    });

    renderTodosForSelectedProject();
};

const initialTodosBtn = document.getElementById("initialTodosBtn");
initialTodosBtn.addEventListener("click", function() {
    initialTodos();
});

renderProjects(todoItemList);
takeDataFromLocalStorage();