const itemInput = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const checklist = document.getElementById("checklist");
const emptyMessage = document.getElementById("emptyMessage");

let items = JSON.parse(localStorage.getItem("trekplan_checklist")) || [];

function saveItems() {
    localStorage.setItem("trekplan_checklist", JSON.stringify(items));
}

function displayItems() {

    checklist.innerHTML = "";

    if (items.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    items.forEach((item, index) => {

        const li = document.createElement("li");
        li.className = "checklist-item";

        li.innerHTML = `
            <div class="item-left">
                <input type="checkbox" ${item.completed ? "checked" : ""}>
                <span class="${item.completed ? "completed" : ""}">
                    ${item.text}
                </span>
            </div>

            <button class="delete-btn">Delete</button>
        `;

        const checkbox = li.querySelector("input");

        checkbox.addEventListener("change", () => {
            items[index].completed = checkbox.checked;
            saveItems();
            displayItems();
        });

        const deleteBtn = li.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {
            items.splice(index, 1);
            saveItems();
            displayItems();
        });

        checklist.appendChild(li);
    });
}

function addItem() {

    const text = itemInput.value.trim();

    if (text === "") {
        alert("Please enter a checklist item.");
        return;
    }

    items.push({
        text: text,
        completed: false
    });

    saveItems();

    itemInput.value = "";

    displayItems();
}

addBtn.addEventListener("click", addItem);

itemInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addItem();
    }

});

displayItems();