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
            activeProjectIndex = index;
        }
    });
    return activeProjectIndex;
};

export function removeTodo(uniqueId) {
    const destructuredId = destructureUniqueId(uniqueId);
    const projectId = destructuredId[0];
    const todoItemId = destructuredId[1];
    todoItemList[projectId].tasks.splice(todoItemId, 1);
    console.log(uniqueId, todoItemList[projectId].tasks);
    renderTodosForSelectedProject();
    removeTodoForLocalStorage(uniqueId);
};

function removeTodoForLocalStorage(uniqueId) {
    const indexToRemove = localStorageTodosClipboard.findIndex(todo => todo.uniqueId === uniqueId);

    if (indexToRemove !== -1 && localStorageTodosClipboard.length - 1 == indexToRemove) {
        localStorageTodosClipboard.splice(indexToRemove, 1);
    } else if (indexToRemove !== -1 && localStorageTodosClipboard.length - 1 !== indexToRemove) {
        const currentUniqueId = localStorageTodosClipboard[indexToRemove].uniqueId;
        localStorageTodosClipboard.splice(indexToRemove, 1);
        const currentIdOfNextItem = localStorageTodosClipboard[indexToRemove].uniqueId
        localStorageTodosClipboard[indexToRemove].uniqueId = currentUniqueId;
    };

    saveDataToLocalStorage();
};

function saveDataToLocalStorage() {
    const data = JSON.stringify(localStorageTodosClipboard);
    localStorage.setItem("localStorageTodosClipboard", data);
};

function takeDataFromLocalStorage() {
    const unpackedLocalStorage = localStorage.getItem("localStorageTodosClipboard");
    const todos = JSON.parse(unpackedLocalStorage);
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

// in object > this ?
renderProjects(todoItemList);
takeDataFromLocalStorage();