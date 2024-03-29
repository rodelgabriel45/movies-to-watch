const input = document.querySelector("#item-input");
const addButton = document.querySelector(".btn");
const listItems = document.querySelector("#item-list");
const btnClear = document.querySelector(".btn-clear");
const filter = document.querySelector("#filter");
const itemForm = document.querySelector("#item-form");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;


function onAddItemSubmit(e) {
    e.preventDefault();
    const newItemText = input.value;

    if (newItemText === "" ) {
        alert("Please Enter an Item");
        return;
    }

    // Check for edit mode
    if (isEditMode) {
        const itemToEdit = listItems.querySelector(".edit-mode");

        removeItemfromlocalStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        isEditMode = false;

    }else {
        if (checkItemDuplicate(newItemText)) {
            alert("That item already exist!");
            return;
        }   
    }
  
    addItemToDOM(newItemText);

    addItemToStorage(newItemText);
    
    checkUI();

    input.value = "";

}

function addItemToDOM(item) {
    const li = document.createElement("li");
    li.textContent = item;

    const button = document.createElement("button");
    button.className = "remove-item btn-link text-red";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-xmark";

    button.appendChild(icon);
    li.appendChild(button);

    listItems.appendChild(li);
}

function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    // Convert back to JSON and send to localStorage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    }else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage;
}

function fetchItemfromStorage(){
    let itemsFromStorage = getItemsFromStorage();

    if (itemsFromStorage !== null) {
        itemsFromStorage.forEach(item => addItemToDOM(item));
    }

    checkUI();
}

function onClickItem(e) {
    console.log(e.target);
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement)
    }else if (e.target.tagName === "LI"){
        setItemToEdit(e.target);
    }
}

function checkItemDuplicate(item) {
    let itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    listItems
    .querySelectorAll("li")
    .forEach(i => i.classList.remove("edit-mode"));

    item.className = "edit-mode";
    formBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item";
    formBtn.style.backgroundColor = "#228B22";
    input.value = item.textContent;
}


function removeItem(item) {
    if (confirm("Are you sure you want to delete?")) {
        item.remove();
    }
    
    removeItemfromlocalStorage(item.textContent)
    checkUI();
}

function removeItemfromlocalStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage = itemsFromStorage.filter(i => i !== item);

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}


function clearItems() {
    let itemsFromStorage = getItemsFromStorage();

    while (listItems.firstChild) {
        listItems.firstChild.remove();
    }

    itemsFromStorage = [];

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));

    checkUI();
}

function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = document.querySelectorAll("li")

    items.forEach(item => {
        const itemText = item.firstChild.textContent.toLowerCase();
        if (itemText.indexOf(text) != -1) {
            item.style.display = "flex";
        }else {
            item.style.display = "none";

        }
    });


}

function checkUI() {
    input.value = "";

    const items = document.querySelectorAll("li");
    if (items.length === 0) {
        filter.style.display = "none";
        btnClear.style.display = "none"
    }else {
        filter.style.display = "block";
        btnClear.style.display = "block";
    }

    formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
    formBtn.style.backgroundColor = "#333";

    isEditMode = false;
}

checkUI();

fetchItemfromStorage()

// Event Listeners

addButton.addEventListener("click", onAddItemSubmit);

listItems.addEventListener("click", onClickItem);

btnClear.addEventListener("click", clearItems);

filter.addEventListener("input", filterItems);

