//Dark Mode
const body = document.querySelector('body');
const icon = document.getElementById('theme-icon');
const initialTheme = 'light';

const setTheme = function(theme){
    localStorage.setItem('theme', theme);
    body.setAttribute('data-theme', theme);
}

const toggleTheme = function(){
    const activeTheme = localStorage.getItem('theme');
    const darkMode = activeTheme === 'dark';

    if (darkMode) {
        setTheme('light');
        icon.className = 'bi bi-toggle-on';
        document.getElementById('theme-btn').style.background = 'yellow';
    } else {
        setTheme('dark');
        icon.className = 'bi bi-toggle2-off';
        document.getElementById('theme-btn').style.background = 'blue';
    }
}

const saveThemeOnStorage = function(){
    const savedTheme = localStorage.getItem('theme');
    savedTheme ? body.setAttribute('data-theme', savedTheme) : setTheme(initialTheme);
}

saveThemeOnStorage();


//FIlterabe BUttons

const filterButtons = document.querySelectorAll('.filter-button');
const imageContainer1 = document.querySelectorAll('.image-container1');

filterButtons.forEach(function(button){
    button.addEventListener('click', function(){
        const btnCategory = button.dataset.category;

        imageContainer1.forEach(function(container){
            const containerCategory = container.dataset.category;

            if (btnCategory === 'all' || containerCategory === btnCategory) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';

            }
        })
    })
})

//To Do Items

let todoItems = [];

// Let us create a rendering function so that it would show to the page
function renderTodo(todo){
    //let us get the list element
    const list = document.querySelector('.js-todo-list');
    //get the data-key of the list as an item
    const item = document.querySelector(`[data-key="${todo.id}"]`);

    //Update the render function with a delete conditional statement
    if(todo.deleted){
        item.remove();
        return; // exit the code after removing.
    }
    //create a checking variable  and set a condition to separate finished and unfinished task
    const isChecked = todo.checked? 'done': '';
    //create a list element
    const node = document.createElement('li');
    //set a class attribute for the list element with the checking variable
    node.setAttribute('class', `todo-item ${isChecked}`);
    //set a data-key attribute for id
    node.setAttribute('data-key', todo.id);
    //set innerHTML contents for the list
    node.innerHTML = 
    `
    <input id="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon"></use></svg>
        </button>
    `;
    //add a condition for item if it exist then replace the item with the node, else add the 
    //node to the list
    if(item){
        list.replaceChild(node,item);
    }
    else{
        list.append(node);
    }
}

//Function for adding task
function addTodo(text){
    const todoObj = {
        text,
        checked: false,
        id: Date.now(),
    };
    todoItems.push(todoObj);

    //to save to the local storage, stringify the todoItems array
    //UPDATE THE LOCAL KEY
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    renderTodo(todoObj);
}

//create function called toggleDone
function toggleDone(key){
    //lets find the index of the list and return its id equivalent to the key
    const index = todoItems.findIndex(function(item){
        return item.id === Number(key);
    })
    //set the checked index of the array not equal to its own
    //in order to finish a task
    todoItems[index].checked = !todoItems[index].checked;
    //to save to the local storage, stringify the todoItems array
    //UPDATE THE LOCAL KEY
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    //add it to the render function
    renderTodo(todoItems[index]);
}

//create a delete function the structure is similar to toggleDone
function deleteTodo(key){
    const index = todoItems.findIndex(function(item){
        return item.id === Number(key);
    })

    //create a variable for the deleted property and set it to true
    const todo = {
        deleted: true,
        //A spread operator for the array and its index
        ...todoItems[index],
    };
    //remove a task by filtering out the array
    todoItems = todoItems.filter(function(item){
        return item.id !== Number(key);
    })
    //to save to the local storage, stringify the todoItems array
    //UPDATE THE LOCAL KEY
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    //pass the variable with the deleted property to the render function
    renderTodo(todo);
}

//Let us get the value of input inside the form
const form = document.querySelector('.js-form');
form.addEventListener('submit', function(event){
    //lets prevent page refrest every submit
    event.preventDefault();
    //get the input
    const input = document.querySelector('.js-todo-input');
    //get the value of the input and remove whitespace
    const text = input.value.trim();
    //if text is not an empty string then pass it to the add function
    //reset the value of input to empty string
    //still the focus of the input
    if (text != '') {
        addTodo(text);
        input.value = '';
        input.focus();
    }
})

//get the list element again
const list = document.querySelector('.js-todo-list');
//add a click event
list.addEventListener('click', function(event){
    //set a condition that targets the event which contains js-tick
    if (event.target.classList.contains('js-tick')) {
        //get the datakey of the parent element
        const itemKey = event.target.parentElement.dataset.key;
        //pass it to a new function called toggleDone
        toggleDone(itemKey);
    }
    //set another similar if block with a different function passed and class it contains
    //this if block is for deletion code
    if (event.target.classList.contains('js-delete-todo')) {
        //get the datakey of the parent element
        const itemKey = event.target.parentElement.dataset.key;
        //pass it to a new function called deleteTodo
        deleteTodo(itemKey);
    }
})

//add an event listener DOMContentLoaded
document.addEventListener('DOMContentLoaded', function(){
    //get the key located in the local storage
    const ref = localStorage.getItem('todoItems');
    //parse the ref and assign it to the todoItems array with the if condition if the ref exist
    if (ref) {
        todoItems = JSON.parse(ref);
        //iterate over each element of the array
        todoItems.forEach(function(save){
            //pass each elements to the function as an argument
            renderTodo(save);
        })
    }
    
})
