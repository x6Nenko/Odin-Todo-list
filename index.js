import {renderNewTodoItem, renderProjects} from "./dom.js";

class TodoItem {

    constructor(title, description, dueData, priority, projectIndex) {
        this.title = title;
        this.description = description;
        this.dueData = dueData;
        this.priority = priority;
        //todoItemList[projectIndex].tasks.push(this);
        todoItemList[projectIndex].tasks.push(this);
        renderNewTodoItem(todoItemList);
        console.log(todoItemList);
    }

    showItem() {
        console.log(this);
    }

}

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

// in object > this ?
renderProjects(todoItemList);
