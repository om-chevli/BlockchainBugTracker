// jQuery is a JS library designed to simplify working with the DOM (Document Object Model) and event handling.
// This code runs the function createBugList() only after the DOM has completely loaded, ensuring safe DOM element interaction.
$(document).ready(createBugList());

//auto focus on input of add task modal
$("#add-bug-container").on("shown.bs.modal", function () {
  $("#new-bug").trigger("focus");
});

async function createBugList() {
  // Get first account provided by Ganache
  try {
    await getAccount();
    contract = new web3.eth.Contract(contractABI, contractAddress);
    try {
      bugNum = await contract.methods.getBugCount().call({
        from: web3.eth.defaultAccount,
      });
      // If there is at least one bug present...
      if (bugNum != 0) {
        // fetch all of the bugs and create the list to display
        let bugIndex = 0;
        while (bugIndex < bugNum) {
          try {
            let bug = await contract.methods.getTask(bugIndex).call({
              from: web3.eth.defaultAccount,
            });
            if (bug[0] != "") {
              // addBugToList adds a bug as a child of the <ul> tag
              addBugToList(bugIndex, bug[1], bug[3], bug[2]);
            } else {
              console.log("The index is empty: " + bugIndex);
            }
          } catch {
            console.log("Failed to get bug: " + bugIndex);
          }
          bugIndex++;
        }
        // update the bug count
        // updateBugCount();
      }
    } catch {
      console.log("Failed to retrieve bug count from blockchain.");
    }
  } catch {
    console.log("Failed to retrieve default account from blockchain.");
  }
}

function addBugToList(id, name, priority, status) {
  // get the id of the <ul> then append children to it
  let list = document.getElementById("list");
  let item = document.createElement("li");
  item.classList.add(
    "list-group-item",
    "border-0",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  item.id = "item-" + id;
  // add text to the <li> element
  let bug = document.createTextNode(name);

  // create a checkbox and set its id and status
  var checkbox = document.createElement("INPUT");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", "item-" + id + "-checkbox");
  checkbox.checked = status;
  // if status is true then add bug-done class to <li> element so that the text font has a line through
  if (status) {
    item.classList.add("bug-done");
  }

  // Create a span element for priority
  let prioritySpan = document.createElement("span");
  prioritySpan.classList.add("priority");

  // Set priority text and styling
  let bugPriorityText = "";
  if (priority == 0) {
    bugPriorityText = "Low";
    prioritySpan.style.color = "green"; // Set color for Low priority
  } else if (priority == 1) {
    bugPriorityText = "Medium";
    prioritySpan.style.color = "orange"; // Set color for Medium priority
  } else {
    bugPriorityText = "High";
    prioritySpan.style.color = "red"; // Set color for High priority
  }
  prioritySpan.textContent = bugPriorityText;

  // Create edit button
  let editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("btn", "btn-info", "btn-sm", "mx-1");
  editButton.onclick = function () {
    populateEditBugModal(id, name, priority);
  };

  // Create delete button
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn", "btn-danger", "btn-sm");
  deleteButton.onclick = function () {
    deleteBug(id);
  };

  list.appendChild(item);
  item.appendChild(bug);
  item.appendChild(prioritySpan); // Append priority span
  item.appendChild(checkbox);
  item.appendChild(editButton); // Append edit button
  item.appendChild(deleteButton); // Append delete button

  checkbox.onclick = function () {
    changeBugStatus(checkbox.id, id);
  };
}

// Function to populate the edit bug modal with current bug details
function populateEditBugModal(id, name, priority) {
  document.getElementById("edit-bug-name").value = name;
  document.getElementById("edit-bug-priority").value = priority;
  document.getElementById("edit-id").value = id;
  // You might also want to store the bug id somewhere accessible to the saveEditedBug function
  // For example, using a global variable or data attribute in the modal
  $("#edit-bug-container").data("bug-id", id);
  $("#edit-bug-container").modal("show"); // Show the modal
}

// Function to handle editing a bug
async function editBug() {
  const id = document.getElementById("edit-id").value;
  const name = document.getElementById("edit-bug-name").value;
  const priority = document.getElementById("edit-bug-priority").value;
  try {
    await contract.methods.updateBugDescription(id, name).send({
      from: web3.eth.defaultAccount,
    });
    await contract.methods.updateBugPriority(id, priority).send({
      from: web3.eth.defaultAccount,
    });
  } catch (error) {
    console.log(error);
    console.log("Failed to change status of bug. Index: " + id);
  }
  $("#edit-bug-container").modal("hide");
  updateBugInList(id, name, priority);
}

// Function to handle deleting a bug
async function deleteBug(id) {
  // Find the bug item in the list
  let bugItem = document.getElementById("item-" + id);
  if (bugItem) {
    // Remove the bug item from the list
    bugItem.remove();
    try {
      await contract.methods.deleteBug(id).send({
        from: web3.eth.defaultAccount,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Bug with ID " + id + " not found.");
  }
}

// change the status of the bug stored on the blockchain
async function changeBugStatus(id, bugIndex) {
  // get checkbox element
  let checkbox = document.getElementById(id);
  // get the id of the <li> element
  let textId = id.replace("-checkbox", "");
  // get the <li> element
  let text = document.getElementById(textId);
  try {
    await contract.methods.updateBugStatus(bugIndex, checkbox.checked).send({
      from: web3.eth.defaultAccount,
    });
    if (checkbox.checked) {
      text.classList.add("bug-done");
    } else {
      text.classList.remove("bug-done");
    }
  } catch (error) {
    console.log("Failed to change status of bug. Index: " + bugIndex);
  }
}

async function addBug(name, priority) {
  let form = document.getElementById("add-bug-container");
  document.getElementById("new-bug").value = "";
  form.classList.remove("was-validated");
  contract.methods
    .getBugCount()
    .call({
      from: web3.eth.defaultAccount,
    })
    .then(
      (bugNum) => {
        addBugToList(bugNum, name, priority, false);
      },
      (err) => {
        console.log("Failed to retrieve the number of bugs from Ganache.");
      }
    );
  try {
    console.log(name);
    await contract.methods.addBug(name, priority, false).send({
      from: web3.eth.defaultAccount,
    });
  } catch (e) {
    console.log("Failed to save bug to blockchain.");
    console.log(e);
  }
}

// Function to update the bug item in the list
function updateBugInList(id, newName, newPriority) {
  // Find the bug item in the list
  let bugItem = document.getElementById("item-" + id);
  if (bugItem) {
    // Update bug name
    let bugName = bugItem.childNodes[0]; // Assuming the first child node is the bug name
    bugName.textContent = newName;

    // Update bug priority
    // Set priority text and styling
    let prioritySpan = bugItem.querySelector(".priority");
    if (newPriority == 0) {
      prioritySpan.textContent = "Low";
      prioritySpan.style.color = "green"; // Set color for Low priority
    } else if (newPriority == 1) {
      prioritySpan.textContent = "Medium";
      prioritySpan.style.color = "orange"; // Set color for Medium priority
    } else {
      prioritySpan.textContent = "High";
      prioritySpan.style.color = "red"; // Set color for High priority
    }
  }
}
