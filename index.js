import {renderNewTodoItem, renderProjects, renderTodosForSelectedProject} from "./dom.js";
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
    };

    showItem() {
        console.log(this);
    };
};

const todoItemList = [{name: "default project", tasks: []}, {name: "Another project", tasks: []}, {name: "Superior project", tasks: []}];

const form = document.getElementById("myForm");
form.addEventListener("submit", function(e) {
    e.preventDefault();
    const formData = new FormData(form);

    const title = formData.get("title");
    const description = formData.get("description");
    const dueData = formData.get("dueData");
    const priority = formData.get("priority");
    const projectIndex = findActiveProject();

    new TodoItem(title, description, dueData, priority, projectIndex);
    
    // for (const [name, value] of formData) {
    //     console.log(`${name}: ${value}`);
    // }
});

export function findActiveProject() {
    //return document.querySelector(".project-label.active");
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
    renderTodosForSelectedProject();
};

function initialTodos() {
    new TodoItem("Random Title", "Some random description", "2023-10-28", "middle", 0);
    new TodoItem("Title", "Some random description", "2023-10-28", "high", 0);
    new TodoItem("Random", "Some random description", "2023-10-28", "middle", 0);
    new TodoItem("Titleee", "Some random description", "2023-10-28", "low", 1);
    new TodoItem("Titleee 123 ", "Some random description", "2023-10-28", "high", 2);
    new TodoItem("Titleee dasadsadsa", "Some random description", "2023-10-28", "high", 2);
    new TodoItem("TI", "Some random description", "2023-10-28", "Low", 2);
    new TodoItem("Titleee Yods", "Some random description", "2023-10-28", "middle", 2);
    renderTodosForSelectedProject();
};

const initialTodosBtn = document.getElementById("initialTodosBtn");
initialTodosBtn.addEventListener("click", function() {
    initialTodos();
});

// in object > this ?
renderProjects(todoItemList);