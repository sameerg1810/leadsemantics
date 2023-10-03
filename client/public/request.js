// Accessing the notification Window
const delReqButton = document.getElementById("delReq");
const updateReqButton = document.getElementById("updateReq");
const tableCont = document.getElementById("tableContainer");

document.getElementById("savedData").disabled = false;
document.getElementById("usersInfo").disabled = false;
document.getElementById("search-bar").disabled = false;
document.getElementById("notifyBtn").addEventListener("click", function () {
  const uploadWindow = document.getElementById("upload-win");
  const reqestBox = document.getElementById("reqBox");
  if (reqestBox.style.display === "none") {
    document.getElementById("savedData").disabled = true;
    document.getElementById("usersInfo").disabled = true;
    document.getElementById("search-bar").disabled = true;
    reqestBox.style.display = "block";
    uploadWindow.style.display = "none";
    tableCont.style.display = "none";
  } else {
    document.getElementById("savedData").disabled = false;
    document.getElementById("usersInfo").disabled = false;
    document.getElementById("search-bar").disabled = false;
    reqestBox.style.display = "none";
    uploadWindow.style.display = "block";
  }
});

// Disabling and enabling the popup-windows and giving the delete and update counts
const deleteCountElement = document.getElementById("deleteCount");
const updateCountElement = document.getElementById("updateCount");

// Initialize counts to 0
let deleteCount = 0;
let updateCount = 0;
let operation;
// Fetch data when the page loads
window.addEventListener("DOMContentLoaded", async () => {
  updateButtonLabels();
  // Call the function whenever needed, for example:
  // updateButtonLabels();
});
// Update button and Delete Buttons labels with the counts______________________________________________

delReqButton.addEventListener("click", () => fetchDataAndDisplay("delete"));
updateReqButton.addEventListener("click", () => fetchDataAndDisplay("update"));
//fetching notify_____________________________________________________________________________________________________________
async function updateButtonLabels() {
  try {
    const data = await (await fetch(`/getNotifyData`)).json();
    if (data.error) throw new Error(data.error);
    console.log("the data from server to Notify Panel", data);
    // Calculate the initial counts
    // Update button and Delete Buttons labels with the counts
    deleteCount = data.filter((record) => record.operation === "DELETE").length;
    updateCount = data.filter((record) => record.operation === "Update").length;
    delReqButton.textContent = `Delete Requests (${deleteCount})`;
    updateReqButton.textContent = `Update Requests (${updateCount})`;
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire("Error", "Error fetching data", "error");
  }
}
// Notification window______________________________________________________________________________________________________
async function fetchDataAndDisplay(operation) {
  try {
    const data = await (await fetch(`/getNotifyData`)).json();
    if (data.error) throw new Error(data.error);

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    const scrollCards = document.createElement("div");
    scrollCards.classList.add("scrolling-container");
    scrollCards.appendChild(modalContainer);

    let filteredData;

    if (operation === "delete") {
      // Filter data for "Delete" operation
      filteredData = data.filter((record) => record.operation === "DELETE");
    } else if (operation === "update") {
      // Filter data for "Update" operation
      filteredData = data.filter((record) => record.operation === "Update");
    } else {
      // Invalid operation type
      throw new Error("Invalid operation type");
    }

    const modal = document.createElement("div");
    modal.classList.add("notify-card");
    modal.innerHTML = `
      <div class="card-column">
        <button type="button" class="btn-close bg-danger" id="closeModal" aria-label="Close"></button>
        <h5 class="modal-title">Notify Data - ${operation.toUpperCase()} Operations</h5>
        <div class="modal-body">${filteredData
          .map((record) => createRecordHTML(record, operation))
          .join("")}</div>
      </div>
    `;

    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);

    // Close the modal when clicking outside of it
    modalContainer.addEventListener("click", (event) => {
      if (event.target === modalContainer) {
        closeModal();
      }
    });

    // Close the modal when the "Close" button is clicked
    const closeModalButton = modal.querySelector("#closeModal");
    closeModalButton.addEventListener("click", () => {
      closeModal();
    });

    function closeModal() {
      document.body.removeChild(modalContainer);
    }
  } catch (error) {
    console.error(`Error fetching '${operation}' data:`, error);
    Swal.fire("Error", `Error fetching '${operation}' data`, "error");
  }
}
// extract the key and values and seperate them
const createRecordHTML = (
  {
    note_id,
    user_id,
    operation,
    old_value,
    new_value,
    file_name = "filename",
    rowId,
  },
  operationType
) => {
  // Extract values from old_value and new_value
  const oldValues = extractValues(old_value, operationType);
  const newValues = extractValues(new_value, operationType);

  let rowIdHTML = ""; // Initialize the rowIdHTML as an empty string

  // Conditionally include the "Row ID" section based on the operation type
  if (operationType !== "delete") {
    rowIdHTML = `<p><strong>Row ID:</strong> ${rowId}</p>`;
  }

  return `
    <div class="alert alert-primary h-50">
      <p><strong>Note ID:</strong> ${note_id}</p>
      <p><strong>User ID:</strong> ${user_id}</p>
      <p><strong>Operation:</strong> ${operation}</p>
      <p><strong>Old Value:</strong> ${oldValues}</p>
      <p><strong>New Value:</strong> ${newValues}</p>
      <p><strong>File Name:</strong> ${file_name}</p>
      ${rowIdHTML} <!-- Include the "Row ID" section here -->
      <button type="button" class="btn btn-success" onclick="performAction('${user_id}','${operationType}', 'grant', ${note_id}, '${file_name}', ${
    operationType === "delete" ? "null" : rowId
  }, '${newValues}', '${oldValues}')">Grant</button>

  <button type="button" class="btn btn-danger" onclick="performAction('${user_id}','${operationType}', 'deny', ${note_id}, '${file_name}', ${
    operationType === "delete" ? "null" : rowId
  }, '${newValues}', '${oldValues}')">Deny</button>
    </div>`;
};

// extract the key and values and separate them
// extract the key and values and separate them
function extractValues(jsonString, operation) {
  try {
    // Check if the JSON string is not "N/A"
    if (jsonString.trim() !== "N/A") {
      const jsonObject = JSON.parse(jsonString);

      if (operation === "update") {
        // If the operation is "update," format the values as key: value
        const keyValuePairs = Object.entries(jsonObject).map(
          ([key, value]) => `${key}: ${value}`
        );
        return keyValuePairs.join(" ");
      } else {
        // For other operations, just return the JSON string
        return JSON.stringify(jsonObject);
      }
    } else {
      // Return the value as is when it's not valid JSON
      return jsonString.trim();
    }
  } catch (error) {
    console.error("Error extracting values from JSON:", error);
    return ""; // Return an empty string in case of an error
  }
}

// Perform action based on operation type (delete or update)
// Function to display a popup message
function displayPopup(message, type) {
  // Define Swal options based on the provided type (success or error)
  const swalOptions = {
    title: message,
    icon: type, // 'success' or 'error'
    showConfirmButton: false,
    timer: 1500, // Auto-close after 1.5 seconds
  };

  // Display the popup using SweetAlert2
  Swal.fire(swalOptions);
}

// Updated performAction function_j_________________________________________________________________________________________________________
// Inside the performAction function
async function performAction(
  userId,
  operationType,
  action,
  noteId,
  tableName,
  rowId,
  updatedData,
  oldData
) {
  console.log("performAction was initiated", userId);
  console.log("performAction was initiated", operationType);
  console.log("the Values we are getting", action);
  console.log("the Values we are getting", noteId);
  console.log("the Values we are getting", tableName);
  console.log("the Values we are getting", rowId);
  console.log("the Values we are getting", oldData);
  console.log("the Values we are getting", updatedData);

  try {
    if (operationType === "delete") {
      if (action === "grant") {
        // Delete the selected table with tableName
        await deleteSelectedTables([tableName]);
        // Update deleteCount
        deleteCount -= 1;
        delReqButton.textContent = `Delete Requests (${deleteCount})`;
        // Display a success message
        displayPopup(
          `Table ${tableName} has been deleted successfully`,
          "success"
        );
        await deleteRecordFromDatabase(noteId, operationType);
        console.log(`Granted permission for Note ID: ${noteId}`);
        const message = `Granted permission for User ID: ${userId} to delete the data`;
        sendNotificationuser(userId, tableName, message);
      } else if (action === "deny") {
        // Display a denial message
        displayPopup(`Denied permission for Note ID: ${noteId}`, "error");
        console.log(`Denied permission for Note ID: ${noteId}`);
        await deleteRecordFromDatabase(noteId, operationType);
        const message = `Denied permission for User ID: ${userId} to delete the data`;
        sendNotificationuser(userId, tableName, message);
      }
    } else if (operationType === "update") {
      if (action === "grant") {
        // Call updateTableData with the required data
        await updateTableRow(tableName, rowId, updatedData, oldData);
        // Display a success message
        displayPopup(
          `Table ${tableName} has been updated successfully`,
          "success"
        );
        console.log(`Granted permission for Note ID: ${noteId}`);
        const message = `Granted permission for User ID: ${userId} to update the data`;
        sendNotificationuser(userId, tableName, message);
        await deleteRecordFromDatabase(noteId, operationType);
      } else if (action === "deny") {
        // Display a denial message
        displayPopup(`Denied permission for Note ID: ${noteId}`, "error");
        console.log(`Denied permission for Note ID: ${noteId}`);
        await deleteRecordFromDatabase(noteId, operationType);
        const message = `Denied permission for User ID: ${userId} to update the data`;
        sendNotificationuser(userId, tableName, message);
      }
    }
  } catch (error) {
    console.error("Error performing action:", error);
  }
}

// Sending notification to user
async function sendNotificationuser(userId, tableName, message) {
  console.log("the data we got userId", userId);
  console.log("the data we got tableName", tableName);
  console.log("the data we message", message);
  const requestBody = {
    userId,
    tableName,
    message,
  };
  try {
    const response = await fetch(`/sendNotifyUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Error updating table data");
    }

    const data = await response.json();
    console.log("Update response:", data); // Log the response data
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
// Function to fetch update details for a specific noteId
async function fetchUpdateDetailsForNoteId(noteId) {
  modalContainer.innerHTML = "<empty>";
  try {
    const response = await fetch(`/getUpdateDetails/${noteId}`);
    if (!response.ok) {
      throw new Error("Error fetching update details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching update details:", error);
    return null;
  }
}

// Function to update table data
// Function to update table data
// ...

// Function to update table data
async function updateTableRow(tableName, rowId, new_value, old_value) {
  console.log("Updating table data...");
  console.log("the Values we are getting", tableName);
  console.log("the Values we are getting", rowId);
  console.log("the Values we are getting", old_value); // Use oldData directly
  console.log("the Values we are getting", new_value);
  try {
    // Parse the values
    const formatValue = (value) => {
      const parts = value.split(":");
      if (parts.length === 2) {
        return `"${parts[0].trim()}":"${parts[1].trim()}"`;
      }
      return value;
    };

    const updatedData = `{${new_value.split(",").map(formatValue).join(",")}}`;
    const oldData = `{${old_value.split(",").map(formatValue).join(",")}}`;
    console.log("updatedData", updatedData);
    console.log("oldData", oldData);
    console.log("updatedData", updatedData);
    console.log("oldData", oldData);
    const requestBody = {
      updatedData,
      oldData,
    };

    // Check if the table exists
    const tableResponse = await fetch(`/tables/${tableName}`);
    if (!tableResponse.ok) {
      console.error("Table does not exist:", tableName);
      return;
    }

    // Send the request to /updateTableRow/${tableName}/${rowId}
    const response = await fetch(`/updateTableRow/${tableName}/${rowId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Error updating table data");
    }

    const data = await response.json();
    console.log("Update response:", data); // Log the response data
    console.log(`${rowId}: Updated ${tableName}`, updatedData);

    // Display a success message using Swal.fire
    displayPopup(`${rowId}: Updated ${tableName}`, "success");

    initTables();
    DisplayTableData();
  } catch (error) {
    console.error("Error updating table data:", error);
  }
}

// Function to delete selected tables
async function deleteSelectedTables(selectedTableNames) {
  if (selectedTableNames.length === 0) {
    console.log("No tables selected for deletion.");
    return;
  }
  try {
    const response = await fetch(`/deleteSelectedTables`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableNames: selectedTableNames }),
    });

    if (!response.ok) {
      throw new Error(
        `Error deleting tables: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.text();
    console.log("Delete response:", responseData);

    if (responseData === "Tables deleted successfully") {
      console.log("Tables deleted successfully:", selectedTableNames);

      // Display a success message using Swal.fire
      displayPopup("Selected Tables have been deleted successfully", "success");

      initTables();
      const tableBody = document.getElementById("table-body");
      tableBody.innerHTML = "This Table has been deleted";
      tableBody.classList.add("deleted-message"); // Add the CSS class to the tableBody element
      setTimeout(() => {
        tableBody.innerHTML = ""; // Clear the message after a few seconds
        tableBody.classList.remove("deleted-message"); // Remove the CSS class
      }, messageDuration); // Display the message for the specified duration
    } else {
      throw new Error("Error deleting tables");
    }
  } catch (error) {
    console.error(error.message);

    // Display an error message using Swal.fire
    displayPopup("Error deleting tables", "error");
  }
}

// Display a popup message
function displayPopup(message, type) {
  // Use Swal.fire to display the message
  Swal.fire({
    icon: type, // 'success' or 'error'
    title: message,
    showConfirmButton: false,
    timer: 1500, // Auto-close after 1.5 seconds
  });
}
//delete the record with noteId_____________________________________________________________________
async function deleteRecordFromDatabase(noteId, operation) {
  const modalContainer = document.querySelector(".modal-container");
  console.log("deleteRecordFromDatabase function has executed ");
  try {
    const response = await fetch(`/deleteNotify/${noteId}`, {
      method: "DELETE",
    });
    console.log("the response from deleteNotify", response);
    if (!response.ok) {
      throw new Error("Error deleting record");
    }

    const data = await response.json();
    console.log("Record Refresh response:", data);
    console.log("and record was deleted");

    // Remove the modalContainer element and recreate it
    if (modalContainer.parentNode) {
      modalContainer.parentNode.removeChild(modalContainer);
    }

    // Delay fetching and displaying the updated data
    setTimeout(async () => {
      await fetchDataAndDisplay(operation);
      await updateButtonLabels();
    }, 1000); // Adjust the delay time as needed (in milliseconds)
  } catch (error) {
    console.error("Error Refreshing record from database:", error);
    // Handle the error as needed
  }
}
