//accessing the Users Table data//
let userId;
let fileData = [];
let currentFileIndex = 0;
let tableName; // Declaring the tableName variable at the global scope
let columns = []; // Declaring the columns variable at the global scope
let jsonData; // Declaring the jsonData variable at the global scope
let currentTableData;
let headers;
const params = new URLSearchParams(window.location.search);
const urlParams = new URLSearchParams(window.location.search);
//__________________________________________________________________________________________________________________
const deleteButton = document.getElementById("deleteButton");
console.log("what are params?", params);
const successParam = params.get("success");
console.log("what are successParam?", successParam);
const usernameParam = params.get("username");
console.log("what is usernameParam?", usernameParam);
const emailParam = params.get("email");
console.log("what is email?", emailParam);
const editTableButton = document.getElementById("editTableButton");
let currentFileData;
//this is edit table button---------------------------------------------------------------------------------------------------------------------------------
const showButton = document.getElementById("showTable");
showButton.addEventListener("click", () => {
  showData(currentFileIndex); // Pass the currentFileIndex as an argument to showData function
});

console.log("what is showButton", showButton);
// Update the navbar with the username and email
const usernameElement = document.getElementById("username");
console.log("what is usernameElement?", usernameElement);
const emailElement = document.getElementById("email");
console.log("what is emailElement?", emailElement);
const saveButton = document.getElementById("saveDB"); //save button for saving the table to database
saveButton.addEventListener("click", storeTableData);
console.log("what is saveButton?", saveButton);
// });//_____________________Navigation check____________________

// Get a reference to the spinner element
// JavaScript____________________________________________________
document.addEventListener("DOMContentLoaded", () => {
  const spinnerContainer = document.querySelector(".spinner-container");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const closePopupButton = document.getElementById("close-popup");

  fetch(`/connect`)
    .then((response) => {
      if (response.ok) {
        // If the server is reachable, hide the spinner
        spinnerContainer.style.display = "none";
      } else {
        // If the server is not reachable, show a popup message
        spinnerContainer.style.display = "none";
        popupMessage.textContent = "Server crashed or not reachable!";
        popup.style.display = "block";
      }
    })
    .catch((error) => {
      // If there was an error connecting to the server, show a popup message
      console.log("Error connecting to server:", error);
      spinnerContainer.style.display = "none";
      popupMessage.textContent = "Error connecting to server!";
      popup.style.display = "block";
    });

  closePopupButton.addEventListener("click", () => {
    // Close the popup when the close button is clicked
    popup.style.display = "none";
  });
});

//the server___________________________________________________________________________________
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const closePopupButton = document.getElementById("close-popup");
// const abortButton = document.getElementById("abortButton");

// // Function to handle the abort button click
// const handleAbortClick = () => {
//   fetch(`/abort`)
//     .then((response) => response.json()) // Parse the JSON response
//     .then((data) => {
//       // Show the alert message from the response
//       alert(data.message);
//     })
//     .catch((error) => {
//       console.log("Error aborting the server:", error);
//       popupMessage.textContent = "Error aborting the server!";
//       popup.style.display = "block";
//     });
// };

// // Event listener for the abort button
// abortButton.addEventListener("click", handleAbortClick);

// // Event listener for closing the error popup
// closePopupButton.addEventListener("click", () => {
//   popup.style.display = "none";
// });
// // Fetch data from '/connect' endpoint as before...Assuming the rest of your client-side code remains the same.Event listener for the abort button Event listener for closing the error popup
// closePopupButton.addEventListener("click", () => {
//   popup.style.display = "none";
// });

//_____________________________________________Displaying the Toggle table container_______________________________________________________
const toggleTableContainer = () => {
  console.log("toggleTableContainer is working now");
  const tableContainer = document.getElementById("tableContainer");
  console.log("what is tableContainer", tableContainer);
  const showTableButton = document.getElementById("savedData");
  console.log("what is showTableButton", showTableButton);

  if (tableContainer.style.display === "none") {
    tableContainer.style.display = "block";
    showTableButton.textContent = "HIDE SAVED DATA";
    initTables();
  } else {
    tableContainer.style.display = "none";
    showTableButton.textContent = "SAVED DATA";
  }
};
// Event listener for the showTable button
document
  .getElementById("savedData")
  .addEventListener("click", toggleTableContainer);
// __________________________________________________Display the success message if 'success' is true___________________
const successMessageElement = document.getElementById("successMessage");
// _____________________________________________Get the value of the 'success' query parameter from the URL______________

const success = urlParams.get("success");
if (successParam) {
  usernameElement.textContent = usernameParam;
  emailElement.textContent = emailParam;
}
if (success) {
  successMessageElement.style.display = "block";
  setTimeout(() => {
    successMessageElement.style.display = "none";
  }, 3000);
}
// Function to upload file__________________________________________Uploading the csv files________________________________
// <!-- Your HTML code remains the same -->

//fetching user_Id was used to add csvfile name with userID
//fetching userID--------------------------------------------------------------------------------------------------
//uploading the file__________________________________________________________________________________________________________________
function uploadFile(Id) {
  console.log("uploadFile function is working now");
  var userIds = Id;
  currentFileIndex = fileData.length - 1;
  const nextButton = document.createElement("button");
  nextButton.textContent = "Previous File";
  nextButton.classList.add("btn", "btn-sm", "btn-primary", "m-0");
  nextButton.setAttribute("id", "nextButton");
  nextButton.addEventListener("click", showNextTable);

  const previousButton = document.createElement("button");
  previousButton.textContent = "Next File";
  previousButton.classList.add("btn", "btn-sm", "btn-primary", "m-0");
  previousButton.setAttribute("id", "previousButton");
  previousButton.addEventListener("click", showPreviousTable);

  const fileNavigationContainer = document.getElementById("file-navigation");
  fileNavigationContainer.innerHTML = "";
  fileNavigationContainer.appendChild(previousButton);
  fileNavigationContainer.appendChild(nextButton);
  // Fetch the user ID only once
  console.log("user id at 293 userIds", userIds);
  console.log("uploadFile function got executed");

  // Get the file input and selected files
  const fileInput = document.getElementById("inputGroupFile03");
  const files = Array.from(fileInput.files);

  // Check if files are selected
  if (!files || files.length === 0) {
    displayPopup("No file selected. Please select a file.");
    return;
  }

  // Calculate the total file size
  let totalFileSize = files.reduce(
    (totalSize, file) => totalSize + file.size,
    0
  );

  // Check the file size limit
  if (totalFileSize * 0.001 > 100) {
    alert(totalFileSize);
    displayPopup("Error", "File size limit is 100KB.");
    return;
  }

  // Check the file count limit
  if (files.length > 5) {
    displayPopup("Error", "File limit is 5.");
    return;
  }

  // Create a FormData to store all files
  const formData = new FormData();
  console.log("this is formData got 512", formData);
  // Append each file to the FormData
  files.forEach((file) => {
    formData.append("csvFile", file);
    console.log("the formData at line 361", formData);
    console.log("the formData at line 361", typeof formData);
    displayPopup("File has been uploaded", file.name);
    console.log("the file.name at line 361", typeof file.name);

    // Read the file content using FileReader
    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result;
      console.log("after using Filereader CSV data:", csvData);

      // Parse the CSV data
      try {
        const parsedData = parseCSV(csvData);
        console.log("Parsed data:", parsedData);
        let fileIndex = 0;
        const updatedFileName = file.name.replace(".csv", ""); // Extract the table name from the file name
        console.log("the updated file name is", updatedFileName);
        console.log("the type of updatedFileName", typeof updatedFileName);
        tableName = `${updatedFileName}_${userIds}`;
        console.log("line 347", userIds);
        console.log("the type of userId", typeof userIds);
        console.log(
          "This is the tableName passed from .csv file into upload",
          tableName
        );
        console.log(
          "the type of tableName pushing into fileData",
          typeof tableName
        );
        columns = Object.keys(parsedData[0]); // Get the column names
        console.log("type of columns pushing into fileData", typeof fileData);
        console.log(
          "This is the columns passed from .csv file into upload",
          columns
        );
        // sessionStorage.setItem("file_name", tableName);
        fileData.push({ tableName, columns, data: parsedData });
        console.log("the data was pushed into array 385", fileData);
        console.log(
          "type of file Data after pushing the columns ,tableName and columns",
          typeof fileData
        );
        currentFileIndex = fileData.length - 1;
        // Set jsonData to the parsedData
        jsonData = fileData[currentFileIndex].data;
        console.log(
          "the table name iam sending to generateTable function is at line 392",
          tableName
        );
      } catch (error) {
        console.error("Error parsing CSV:", error);
        displayPopup(
          "Error",
          "Invalid CSV format. Please check the file content."
        );
      }
    };
    reader.onerror = () => {
      console.error("Error reading the file.");
      displayPopup("Error", "Error reading the file.");
    };
    reader.readAsText(file);
    console.log("what we are reading", file);
    console.log("the type of file", typeof file);
  });

  // Make a single fetch call to upload all files
  fetch(`/upload`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data from server:", data);
      displayPopup("File has been uploaded");
      generateTable(
        fileData[currentFileIndex].data,
        1,
        currentFileIndex,
        tableName
      );
      console.log(
        "After the data we are sending to generateTable function",
        data
      );
      console.log(
        "the type of data we are sending to generateTable function after Upload",
        typeof data
      );
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      displayPopup("Only files with .csv extension are allowed.", error);
    });
}
//________________________________________________________________________Parsing the CSV DATA_________________________________________
//removing the Quotes
function getDataFromCSV(file) {
  return new Promise((resolve, reject) => {
    const fileInput = document.getElementById("inputGroupFile03");
    console.log(fileInput, "something file was given as input");
    const file = fileInput.files[0];
    console.log("getDataFromCSV function is working", typeof file);
    if (!file) {
      reject(new Error("No file selected. Please select a file."));
      return;
    }

    const reader = new FileReader();
    console.log("what does reader has", reader);
    reader.onload = () => {
      const csvData = reader.result;
      const parsedData = parseCSV(csvData);
      resolve(parsedData);
      console.log("csvData was parsed to", typeof parsedData);
    };

    reader.onerror = () => {
      reject(new Error("Error reading the file."));
    };

    reader.readAsText(file);
    console.log("reader reading as text", file);
  });
}

function parseCSV(csvData) {
  const lines = csvData.split("\n");
  const headers = lines[0].split(",");
  const data = [];

  // Check if the CSV data contains a valid header row
  if (headers.length === 0) {
    throw new Error("Invalid CSV format: Missing header row.");
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    // Check if the number of values in the row matches the number of headers
    if (values.length === headers.length) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        const columnName = headers[j].trim(); // Remove extra whitespace
        let value = values[j].trim(); // Remove extra whitespace from values

        // Remove carriage return characters (\r) from the value
        value = value.replace(/\r/g, "");

        // Remove extra double quotes from the value
        value = value.replace(/^"+|"+$/g, "");

        obj[columnName] = value;
      }
      data.push(obj);
    } else {
      console.warn(`Skipping invalid row at line ${i + 1}:`, lines[i]);
    }
  }
  return data;
}

// Rest of the code remains the same as before
//generating the tableName_____________________________________________________________________________________________________________
function generateTable(data, pageNumber, fileIndex, tableName) {
  console.log("this is fileIndex 501", fileIndex);
  console.log("this is data i got from upload from line 501", data);
  console.log("this is tableName from generate table line 500", tableName);
  console.log(
    "the type of data i got to generateTable function is",
    typeof data
  );
  if (!data || data.length === 0) {
    console.error("Invalid or empty data array:", data);
    // Handle this scenario or display an error message as needed
    return;
  }
  const currentFileData = fileData[fileIndex];

  if (!currentFileData || !currentFileData.columns) {
    console.error(
      "currentFileData is not properly initialized or does not contain the 'columns' property."
    );
    return;
  }
  console.log("this is tablename at generateTable", tableName);
  console.log(
    " the currentFileData we getting into generateTable 511",
    currentFileData
  );
  const fileInput = document.getElementById("inputGroupFile03");
  console.log(fileInput.value);
  console.log("This is the data of the table at line number 512:", data);
  console.log("Generate table function is working");

  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  const tableHeader = document.getElementById("table-header");

  console.log("headers at 520", headers);
  console.log("line number 520..... ", Object.keys(data[0]));

  // Create table headers
  // Create table headers
  tableHeader.innerHTML = "";
  currentFileData.columns.forEach((header) => {
    const th = document.createElement("th");
    const trimmedHeader = header.replace(/[^a-zA-Z0-9]/g, ""); // Remove non-alphanumeric characters
    th.textContent = trimmedHeader;
    tableHeader.appendChild(th);
  });
  const startIndex = (pageNumber - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);
  const pageData = data.slice(startIndex, endIndex);

  for (let i = startIndex; i <= endIndex; i++) {
    const item = pageData[i - startIndex];
    const row = document.createElement("tr");

    currentFileData.columns.forEach((header) => {
      const cell = document.createElement("td");
      const columnName = header.trim(); // Remove extra whitespace
      const value =
        item && typeof item === "object" && item.hasOwnProperty(columnName)
          ? String(item[columnName] || "").trim() // Convert entire item to string
          : "";
      cell.textContent = value.replace(/\r/g, ""); // Remove \r characters
      row.appendChild(cell);
      console.log("this is printed data", value);
    });

    tableBody.appendChild(row);
  }

  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= Math.ceil(data.length / 10); i++) {
    const pageButton = document.createElement("li");
    pageButton.classList.add("page-item");
    const pageLink = document.createElement("a");
    pageLink.textContent = i;
    pageLink.classList.add("page-link");
    pageButton.appendChild(pageLink);

    if (i === pageNumber) {
      pageButton.classList.add("active");
    }

    pageLink.addEventListener("click", () => {
      showPage(currentFileIndex, 1);
    });

    paginationContainer.appendChild(pageButton);
  }
  let CheckInputTime;

  function checkFileinput() {
    const fileInput = document.getElementById("inputGroupFile03");
    const showDbBtn = document.getElementById("savedData");
    const showTableBtn = document.getElementById("showTable");
    const tableContainer = document.getElementById("tableContainer");
    if (fileInput.value === "") {
      table.innerHTML = "";
    }
    if (fileInput.value !== "") {
      console.log("fileInput is not empty");
      showDbBtn.style.display = "block";
      showTableBtn.style.display = "block";

      // If the interval is already running, clear it to avoid multiple intervals
      if (CheckInputTime) {
        clearInterval(CheckInputTime);
      }
    } else {
      console.log("No file was uploaded");
      showTableBtn.style.display = "none";
      const table = document.getElementById("data-table");

      fileInput.addEventListener("input", () => {
        if (inputField.value === "") {
          table.innerHTML = "";
        }
      });

      // If the interval is not running, start it to check for file input changes
      if (!CheckInputTime) {
        CheckInputTime = setInterval(checkFileinput, 500);
      }
    }
  }
  const saveButton = document.getElementById("saveDB");
  saveButton.onclick = () => {
    storeTableData(currentFileData);
    console.log(
      "the currentFileData we are sending to storeTableData",
      currentFileData
    );
    console.log(
      "the type of currentFileData we are sending to storeTableData",
      typeof currentFileData
    );
  };
  //when ever the input field becomes empty make the table empty;
  // Start the interval initially
  CheckInputTime = setInterval(checkFileinput, 500);

  jsonData = currentFileData.data;
  showPage(currentFileIndex, pageNumber);
}
//________________________Update pagination__________________________________

//______________________________________________________Function For POPUP WINDOW THAT DISPLAYS TABLE______________________________________________________________________
async function showData(fileIndex) {
  const currentFileData = fileData;
  console.log("line 831*****", currentFileData);
  console.log("line 832*****", fileData);
  if (!currentFileData || currentFileData == null) {
    console.error(
      "In showData line 869 currentFileData is not properly initialized or does not contain the 'columns' property."
    );
    return;
  }
  console.log("showData is now working");
  const popupWin = document.getElementById("popup-win");
  popupWin.style.display = "block";
}

// Function to show a specific page_____________________________PAGES IN TABLE WINDOW________________________________
let currentPageNumber = 1;
const maxButtonsToShow = 2;

function showPage(currentFileIndex, pageNumber) {
  console.log("showPageFunction is working now");
  const currentFileData = fileData[currentFileIndex];
  console.log("this is currentFileIndex", currentFileIndex);
  console.log("this is pageNumber", pageNumber);
  console.log("this is currentFileData", currentFileData);
  const tableHeader = document.getElementById("table-header");
  const tableBody = document.getElementById("table-body");
  const paginationContainer = document.getElementById("pagination-container");

  // Clear the table header, body, and pagination container
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";
  paginationContainer.innerHTML = "";

  if (
    !currentFileData ||
    !currentFileData.columns ||
    !Array.isArray(currentFileData?.data)
  ) {
    console.error(
      "currentFileData is not properly initialized or does not contain the 'columns' property."
    );
    return;
  }

  // Generate table headers
  currentFileData.columns.forEach((header) => {
    const th = document.createElement("th");
    const trimmedHeader = header.trim();
    th.textContent = trimmedHeader;
    tableHeader.appendChild(th);
  });

  // Get the data for the current page
  const data = currentFileData.data;
  const totalPages = Math.ceil(data.length / 10);

  // Ensure the pageNumber is within valid limits
  pageNumber = Math.max(1, Math.min(pageNumber, totalPages));
  currentPageNumber = pageNumber;

  // Calculate the start and end indices for the current page
  const startIndex = (pageNumber - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);
  const pageData = data.slice(startIndex, endIndex + 1);
  console.log("this is page data that was printed in the page", pageData);
  // Generate the table rows for the current page
  for (let i = 0; i < pageData.length; i++) {
    const item = pageData[i];
    const row = document.createElement("tr");

    currentFileData.columns.forEach((header) => {
      const cell = document.createElement("td");
      const columnName = header.trim();
      const value =
        item && typeof item === "object" && item.hasOwnProperty(columnName)
          ? (item[columnName] || "").trim()
          : "";
      cell.textContent = value;
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  }

  // Update the pagination buttons
  if (totalPages > 1) {
    if (currentPageNumber > 1) {
      const prevButton = createPageButton(currentPageNumber - 1, "Prev");
      paginationContainer.appendChild(prevButton);
    }

    if (currentPageNumber > maxButtonsToShow + 1) {
      const firstButton = createPageButton(1, "1");
      paginationContainer.appendChild(firstButton);
      if (currentPageNumber > maxButtonsToShow + 2) {
        const ellipsisButton = createPageButton(null, "...");
        paginationContainer.appendChild(ellipsisButton);
      }
    }

    for (
      let i = currentPageNumber - maxButtonsToShow;
      i <= currentPageNumber + maxButtonsToShow;
      i++
    ) {
      if (i >= 1 && i <= totalPages) {
        const pageButton = createPageButton(i, i.toString());
        paginationContainer.appendChild(pageButton);
      }
    }

    if (currentPageNumber < totalPages - maxButtonsToShow) {
      if (currentPageNumber < totalPages - maxButtonsToShow - 1) {
        const ellipsisButton = createPageButton(null, "...");
        paginationContainer.appendChild(ellipsisButton);
      }
      const lastButton = createPageButton(totalPages, totalPages.toString());
      paginationContainer.appendChild(lastButton);
    }

    if (currentPageNumber < totalPages) {
      const nextButton = createPageButton(currentPageNumber + 1, "Next");
      paginationContainer.appendChild(nextButton);
    }
  }
  console.log("at the end of showPage function", pageData);
}

// Helper function to create a page number button
function createPageButton(pageNumber, label) {
  const pageButton = document.createElement("li");
  const pageLink = document.createElement("a");
  pageLink.textContent = label;
  pageLink.classList.add("page-link");
  pageLink.addEventListener("click", () =>
    showPage(currentFileIndex, pageNumber)
  );
  pageButton.appendChild(pageLink);
  pageButton.classList.add("page-item");
  pageButton.classList.add("btn-sm");
  pageButton.classList.add("page-item-horizontal");

  if (pageNumber === currentPageNumber) {
    pageButton.classList.add("active");
  }

  // Make the buttons horizontally side by side
  pageButton.style.display = "inline-block";

  return pageButton;
}

// Attach the onclick event to the button
function closeTable() {
  document.getElementById("popup-win").style.display = "none";
}
//--------------------------------creating table buttons NEXT and PREVIOUS for navigating between the tables_______________________________________
// Function to show next table
// Function to show next table

function showNextTable() {
  currentFileIndex = Math.min(currentFileIndex, fileData.length - 1);
  if (currentFileIndex < fileData.length - 1) {
    currentFileIndex++;
    showPage(currentFileIndex, 1);
    updateNavigationButtons();
  }
}

function showPreviousTable() {
  currentFileIndex = Math.max(currentFileIndex, 0);
  if (currentFileIndex > 0) {
    currentFileIndex--;
    showPage(currentFileIndex, 1);
    updateNavigationButtons();
  }
}
//update Navigation Buttons
function updateNavigationButtons() {
  currentFileIndex = Math.min(
    Math.max(0, currentFileIndex),
    fileData.length - 1
  );
  const nextButton = document.getElementById("nextButton");
  const previousButton = document.getElementById("previousButton");

  if (currentFileIndex >= fileData.length - 1) {
    nextButton.style.display = "none";
  } else {
    nextButton.style.display = "block";
  }

  if (currentFileIndex <= 0) {
    previousButton.style.display = "none";
  } else {
    previousButton.style.display = "block";
  }
}

//storing the data into database_________________________________________________________________________________________________________________________
function storeTableData(data) {
  const tableName = data.tableName;
  console.log("this is Data ur getting", data);
  console.log("storeTableData is working");
  console.log("Table name:", tableName);
  console.log("Columns:", columns);
  console.log("Data:", data);
  console.log("Table name:", typeof tableName);
  console.log("Columns:", typeof columns);
  console.log("Data:", typeof data);

  // Check if the required parameters are provided
  if (!data || !tableName || !columns) {
    console.error("Missing required data. Cannot store the table.");
    return;
  }

  // Create the request body for checking table existence
  const checkTableRequest = {
    tableName: tableName,
  };

  // Make the HTTP POST request to check if the table exists
  fetch(`/checkTable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checkTableRequest),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Error checking table existence:", response.statusText);
        displayPopup("ERROR checking table existence", response.statusText);
        throw new Error("Failed to check table existence");
      }
      return response.json();
    })
    .then((result) => {
      if (result.exists) {
        // The table already exists; ask for confirmation
        console.log("Table already exists. Asking for confirmation.");
        displayConfirmationPopup(
          "This Table Already exists in Data base do you want to save?",
          "ooohoo! Request sent to Admin to store the Data"
        );
      } else {
        // The table does not exist; proceed to store the table data directly
        console.log("Table does not exist. Proceeding to store table data.");
        displayConfirmationPopup(
          `Do you want to send a request for Saving the Data of ${tableName}? `,
          "Yaay! Your Request has been sent successfully"
        );
        // Call the inner function directly
      }
    })
    .catch((error) => {
      console.error("Error checking table existence:", error);
      displayPopup("ERROR checking table existence", error);
    });
}
// Function to display popup________________________________CSV VALIDATION POPUP________________________________________________________
function displayPopup(message, error) {
  Swal.fire(message, error);
}
//table save confirmation_______________________________________________________________________________________________________
// Display the confirmation popup with a message and callback function

// displaypopup for table save confirmation
function displayConfirmationPopup(message, callback) {
  const swalWithCustomStyles = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
  });

  swalWithCustomStyles
    .fire({
      title: "Confirmation",
      text: message, // Use the provided custom message
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Do it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      customClass: {
        popup: "custom-popup-class", // Add a custom class to the container
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithCustomStyles.fire("Success", callback, "success");
        callback(true); // Invoke the callback with true
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithCustomStyles.fire("Cancelled", callback, "error");
        callback(false); // Invoke the callback with false
      }
    });
}

// Function to close popup_________________________________TABLE CLOSE BUTTON____________________________________________

//__________________________________________________function to call the tables from server and displaying display Table in upload Window___________________________________________________________
function DisplayTableData(tableName) {
  console.log("DisplaytableData function is working");
  axios
    .get(`/tables/${tableName}`)
    .then((response) => {
      if (tableName !== "users") {
        displayTableWindow(response.data, tableName);
        console.log("response sent to displayTableWindow", response.data);
        console.log(
          "type of data iam sending to displayTableWindow is",
          typeof response.data
        );
      } else {
        console.log("Table with name 'users' will not be displayed.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  console.log("axios has sent request to get the tables with tableName");
}

//displaying Table in upload window _________________________________________________________________________________________________________
function displayTableWindow(data, tableName) {
  console.log("displayTableWindow function is working", data);
  console.log("the type of data I am getting from the server is", typeof data);
  const windowTitle = document.getElementById("windowTitle");
  windowTitle.textContent = tableName;

  const tableContainer = document.getElementById("popup-win");
  tableContainer.style.display = "block";

  const tableHeaderRow = document.getElementById("table-header");
  const tableBody = document.getElementById("table-body");
  const pageContainer = document.getElementById("pagination-container");
  // Clear existing table data
  tableHeaderRow.innerHTML = "";
  tableBody.innerHTML = "";
  if (data.length === 0) {
    // If no data, display "NO DATA" message
    tableBody.innerHTML = `<tr><td colspan="11"><h1 class="text-center">NO DATA</h1></td></tr>`;
    return;
  }
  const columns = Object.keys(data[0]);
  // Create table header with column names
  columns.forEach((column) => {
    tableHeaderRow.style.margin = "1rem";
    const th = document.createElement("th");
    th.textContent = column;
    tableHeaderRow.appendChild(th);
  });
  // Create table rows with data
  data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.dataset.id = row.id;
    columns.forEach((column) => {
      tableBody.style.margin = "1rem";
      const td = document.createElement("td");
      td.textContent = row[column];
      td.addEventListener("input", () => {
        td.dataset.isEdited = "true";
      });
      tr.appendChild(td);
    });
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add(
      "btn",
      "btn-primary",
      "btn-sm",
      "m-1",
      "edit-cells"
    );
    editButton.addEventListener("click", () => {
      toggleEditingMode(tr);
    });
    tr.appendChild(editButton);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add(
      "btn",
      "btn-success",
      "btn-sm",
      "m-1",
      "save-cells"
    );
    saveButton.style.display = "none"; // Initially hide the "Save" button

    saveButton.addEventListener("click", async () => {
      console.log("Save button clicked");
      const rowId = tr.dataset.id;
      console.log("this is rowId", rowId);
      saveRowData(tr, rowId, tableName); // Pass tableName to saveRowData
    });

    tr.appendChild(saveButton);
    const deleteRecord = document.createElement("button");
    deleteRecord.textContent = "Delete Row";
    deleteRecord.classList.add(
      "btn",
      "btn-danger",
      "btn-sm",
      "m-1",
      "delete-cells"
    );
    deleteRecord.style.display = "none";
    deleteRecord.addEventListener("click", () => {
      deleteRow(tr, row.id, tableName);
    });
    tr.appendChild(deleteRecord);
    // ...
    async function saveRowData(tableRow, rowId, tableName) {
      const cells = tableRow.querySelectorAll("td");
      const updatedData = {};
      const oldData = {}; // Object to store old values
      cells.forEach((cell, index) => {
        const columnName = columns[index];
        if (cell.dataset.isEdited === "true") {
          updatedData[columnName] = cell.textContent;
          oldData[columnName] = cell.dataset.originalValue; // Store old value
          cell.dataset.isEdited = "false"; // Reset the flag
        }
      });

      if (Object.keys(updatedData).length > 0) {
        await updateTableData(tableName, rowId, updatedData, oldData); // Pass oldData
        toggleEditingMode(tableRow);
      }
    }

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add(
      "btn",
      "btn-danger",
      "btn-sm",
      "m-1",
      "cancel-cells"
    );
    cancelButton.style.display = "none"; // Initially hide the "Cancel" button
    cancelButton.addEventListener("click", () => {
      toggleEditingMode(tr);
    });
    tr.appendChild(cancelButton);
  });
  //DELETE RECORD FUNCTIONALITY____________________________________________________________________________
  async function deleteRow(tableRow, rowId, tableName) {
    try {
      const response = await fetch(
        `/deleteRecord?tableName=${tableName}&recordId=${rowId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert(`Record with ID ${rowId} has been deleted.`);
        tableRow.remove();
      } else {
        alert("Failed to delete the record.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while deleting the record.");
    }
  }

  //Send a request to server to delete the specific record

  // declaring delete button_______________________________________
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Table";
  deleteButton.classList.add(
    "btn",
    "btn-danger",
    "btn-sm",
    "m-1",
    "z-3",
    "fixed-bottom",
    "listDelete"
  );
  deleteButton.style.width = "75px";
  pageContainer.appendChild(deleteButton);
  deleteButton.addEventListener("click", () => {
    deleteTable(tableName);
  });
}

// Function to enable/disable editing mode for cells
function toggleEditingMode(tableRow) {
  const cells = tableRow.querySelectorAll("td");
  const isEditing = cells[0].getAttribute("contenteditable") === "true";

  if (isEditing) {
    // Cancel editing mode and revert to original values
    cancelEditing(cells);
  } else {
    // Enter editing mode and save original values
    enterEditing(cells);
  }

  // Update "edit" buttons
  const editButton = tableRow.querySelector(".edit-cells");
  const cancelButton = tableRow.querySelector(".cancel-cells");
  const saveButton = tableRow.querySelector(".save-cells");
  const deleteRecord = tableRow.querySelector(".delete-cells");
  if (isEditing) {
    // Show the "Edit" button and hide the "Cancel" and "Save" buttons
    editButton.style.display = "block";
    cancelButton.style.display = "none";
    saveButton.style.display = "none";
    deleteRecord.style.display = "none";
  } else {
    // Show the "Cancel" and "Save" buttons and hide the "Edit" button
    editButton.style.display = "none";
    cancelButton.style.display = "block";
    saveButton.style.display = "block";
    deleteRecord.style.display = "block";
  }
}

// Function to enable editing mode for cells and save original values
function enterEditing(cells) {
  cells.forEach((cell) => {
    // Save the original value in the data-original-value attribute
    cell.dataset.originalValue = cell.textContent;
    cell.setAttribute("contenteditable", "true");
  });
}

// Function to cancel editing mode and revert to original values
function cancelEditing(cells) {
  cells.forEach((cell) => {
    // Restore the original value from the data-original-value attribute
    cell.textContent = cell.dataset.originalValue;
    cell.removeAttribute("contenteditable");
  });
}
//______________________________________________________________________________________________________________

// Update the updateTableData function to send updated data to the server
async function updateTableData(tableName, rowId, updatedData, oldData) {
  console.log("this is tableName", tableName);
  console.log("this is updatedData", updatedData);
  console.log("this is rowId", rowId);
  console.log("this is oldData", oldData);
  console.log("typeof is tableName", typeof tableName);
  console.log("typeof is updatedData", typeof updatedData);
  console.log("this is typeof rowId", typeof rowId);
  console.log("this is uploadTableData function is working");

  if (!tableName || !rowId || !updatedData || !oldData) {
    alert("Error in sending the Request to Admin");
    throw new Error(
      "Error in sending the update Request to admin, this may happens when there are no tableName, rowId, updatedData, oldData"
    );
  }
  displayConfirmationPopup(
    "Requesting Admin for Table data Updation",
    "Request Sent Successfully"
  );
}

//Delete the table ____________________________________________________________________________________________________
function deleteTable(tableName) {
  const confirmation = window.confirm(
    `Are you sure you want to delete the table "${tableName}"?`
  );
  if (!confirmation) {
    return; // User clicked Cancel, do nothing
  } else if (!tableName) {
    console.error("Error deleting the table:", error);
  }
  displayConfirmationPopup(
    "Requesting Admin for Deleting the Data",
    "Data Deletion Request sent Successfully "
  );
}

//_____________________________________________________________________________________________________________________________________________

// Function to initialize the table
let tableData = []; //Declaring Table data
let StoredTable = [];
// Function to handle button click event
function handleButtonClick(tableName) {
  DisplayTableData(tableName);
  console.log("table got selected", tableName);
  displayPopup(tableName, "has been selected");
}

// Call the init function to initialize the table buttons

//CREATING PAGINATION IN TABLE-LIST ____________ the current page, starting from 1_________________________________________________________________________________________________________________
let currentPage = 1,
  totalPages = 0,
  buttonsPerPage = 3;
// The total number of pages, calculated from the response data length

//__________creating tableList___________________________________________________________________________***_TABLE LIST___*****____________________
// Create the delete button element
// Define a function to fetch the table data from the backend
// Declare and assign the deleteTableItem variable before using it
let deleteTableItem = document.createElement("button");
deleteTableItem.textContent = "Delete";
deleteTableItem.classList.add("btn", "btn-danger", "btn-sm", "m-1");
deleteTableItem.disabled = true;

// Variable to store the message duration
let messageDuration = 3000; // Adjust as per your requirements
// Declare and assign the selectedTableNames variable before using it
let selectedTableNames = [];

// Define a function to update the selected table names array
function updateSelectedTableNames() {
  // Clear the array
  selectedTableNames = [];
  // Get all the checkboxes
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  // Loop through each checkbox
  checkboxes.forEach((checkbox, index) => {
    // If the checkbox is checked
    if (checkbox.checked) {
      // Push the table name of the checkbox into the array
      selectedTableNames.push(StoredTable[index].Tables_in_leads);
    }
  });
}
// Call the updateSelectedTableNames function whenever you need to update the array
updateSelectedTableNames();
// Function to update the table list
function updateTableList(data) {
  console.log("updateTableList function is working", data);
  tableList.innerHTML = " ";
  tableList.style.display = "flex";
  tableList.style.flexDirection = "row";
  tableList.style.justifyContent = "space-evenly";
  let startIndex = (currentPage - 1) * buttonsPerPage;
  let endIndex = currentPage * buttonsPerPage;
  console.log("now the page number startIndex", startIndex);
  console.log("now the page number endIndex", endIndex);
  for (let i = startIndex; i < endIndex && i < data.length; i++) {
    let table = data[i];
    // Create a tiny card element
    let tinyCard = document.createElement("div");
    tinyCard.classList.add(
      "card",
      "m-0",
      "p-0",
      "tiny-card",
      "bg-opacity-10",
      "bg-danger-subtle"
    );
    tinyCard.style.display = "flex";
    tinyCard.style.flexDirection = "row";
    tinyCard.style.justifyContent = "space-evenly";
    tinyCard.style.width = "60%";
    // Add the table button to the tiny card element
    let tableButton = document.createElement("button");
    tableButton.classList.add(
      "btn",
      "btn-primary",
      "btn-sm",
      "m-0",
      "tableButton"
    );
    tableButton.textContent = table.Tables_in_leads;
    tableButton.style.fontSize = "12px";
    tableButton.style.width = "70%";
    tableButton.style.float = "right";
    tableButton.onclick = function () {
      DisplayTableData(table.Tables_in_leads);
    };
    tinyCard.appendChild(tableButton);
    // Add the checkbox to the tiny card element
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "table" + i;
    checkbox.style.fontSize = "18px";
    checkbox.style.lineHeight = "2";
    checkbox.style.height = "30px";
    checkbox.style.width = "30px";
    checkbox.style.float = "right";
    tinyCard.appendChild(checkbox);

    // Attach an event handler to the checkbox
    checkbox.addEventListener("change", function () {
      // Update the selected table names array
      updateSelectedTableNames();
      // Enable/disable the delete button based on checkbox selection
      deleteTableItem.disabled = selectedTableNames.length === 0;
    });
    // Append the tiny card element to the table list
    tableList.appendChild(tinyCard);
  }
  // Append the delete button element to the table list only once
  tableList.appendChild(deleteTableItem);
  // Add an event listener to the delete button only once
  deleteTableItem.addEventListener("click", function () {
    // Use the selectedTableNames variable in the delete button event handler
    // Call the deleteSelectedTables function with the array as an argument
    deleteSelectedTables(selectedTableNames);
  });
}

// Function to delete selected tables____________________________________________________________________________
function deleteSelectedTables(selectedTableNames) {
  if (selectedTableNames.length === 0) {
    console.log("No tables selected for deletion.");
    displayPopup("No Tables Selected", error);
    return;
  }
  // Send a request to the backend to delete the selected tables
  displayConfirmationPopup(
    "Tables Selected for deletion. Do you want to Send request to Admin?",
    "Yaay!Requst for removing of Tables\n sent Successfully"
  );
}

// Function to initialize the tables

// Add an event handler to the delete button

// Function to initialize the tables
function initTables() {
  axios
    .get(`/tables`)
    .then((response) => {
      // Store the fetched data in a local variable
      let tableData = response.data;
      StoredTable = tableData;
      console.log("the data we are getting into tableData", tableData);
      // Call the updateTableList and createPaginationButtons functions initially with the data as an argument
      updateTableList(tableData);
      console.log("updateTableList Function called", tableData);
      console.log("updateTableList type of data is", typeof tableData);
      createPaginationButtons(tableData);
      console.log("createPaginationButtons was initaited");
    })
    .catch((error) => {
      console.error(error);
    });
}

// Attach an event handler to each checkbox

//  ________pagination buttons for TableList_______________________________
// Accept the response data as a parameter

function createPaginationButtons(data) {
  console.log("createPaginationButtons function is working", data);
  let paginationContainer = document.getElementById("paginationContainer");
  paginationContainer.innerHTML = "";

  let prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.classList.add("btn", "btn-secondary", "btn-sm", "m-1");
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", function () {
    currentPage--;
    updateTableList(data);
    createPaginationButtons(data);
  });
  paginationContainer.appendChild(prevButton);

  let endIndex = currentPage * buttonsPerPage;
  let nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.classList.add("btn", "btn-secondary", "btn-sm", "m-1");
  nextButton.disabled = currentPage === totalPages || endIndex >= data.length;
  nextButton.addEventListener("click", function () {
    currentPage++;
    updateTableList(data);
    createPaginationButtons(data);
  });
  paginationContainer.appendChild(nextButton);
}
//generate checkboxes_________________________________________________________________________________________________________

//____________________________*****____Onclick get the TableDATA and display it in upload window_____****___________________________________________________
// Function for session timeout___________________________________________________________________SESSION___________________
// Track user activity
let sessionTimeout;

function trackUserActivity() {
  // Reset session timeout on user activity

  document.addEventListener("keydown", resetSessionTimeout);
  document.addEventListener("click", resetSessionTimeout);
  document.addEventListener("onscroll", resetSessionTimeout);
}

// Reset session timeout
function resetSessionTimeout() {
  clearTimeout(sessionTimeout);
  startSessionTimeout();
}

// Redirect to login page on session timeout
function redirectOnSessionTimeout() {
  window.location.href = "/";
}

// Start the session timeout_______________________________________________SESSION TIMEOUT STOP CLOCK____________________
function startSessionTimeout() {
  const sessionTimeout = setTimeout(redirectOnSessionTimeout, 2890000); // 4.5 minutes (289000 milliseconds)

  // Display the session timeout countdown dynamically
  const timerElement = document.getElementById("session-timer");
  const errorMessageElement = document.getElementById("errorMessage");
  let timeLeft = 300; // 1 minute in seconds

  // Update the timer element and show the session timeout message every second
  const timer = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // Display the time left in the timer element
    timerElement.textContent = `Session Timeout in ${minutes}:${seconds}`;

    // Decrease the time left by 1 second
    timeLeft--;

    // If the timer reaches 0, redirect the user to the login page
    if (timeLeft < 0) {
      clearInterval(timer);
      redirectOnSessionTimeout();
    } else if (timeLeft === 10) {
      errorMessageElement.textContent = "Your session is about to timeout.";
      errorMessageElement.style.display = "block";
    }
  }, 1000);

  // Reset the timer and hide the session timeout message on user activity
  document.addEventListener("keydown", () => {
    timeLeft = 300; // Reset time left to 1 minute (60 seconds)
    errorMessageElement.style.display = "none";
  });
  document.addEventListener("click", () => {
    timeLeft = 300; // Reset time left to 1 minute (60 seconds)
    errorMessageElement.style.display = "none";
  });

  document.addEventListener("onscroll", () => {
    timeLeft = 300; // Reset time left to 1 minute (60 seconds)
    errorMessageElement.style.display = "none";
  });
}
// Initialize session timeout tracking
trackUserActivity();
startSessionTimeout();
//--------------------------------------------------------------------------------------------------------------------------
// Check whether the session timeouts or not?
function sessionTimeoutHandler(sessionTimeoutMessage) {
  console.log("Session Timeout Handler is working");
  // Send a response to the HTML page
  const response = {
    status: "Session timeout",
    message: sessionTimeoutMessage,
  };
  fetch(`/session-timeout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  });

  // Check if the user is logged in
  if (!isLoggedIn()) {
    // Redirect the user to the login page
    window.location.href = "http://localhost:8080/";
  }

  // Display the session timeout message
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = sessionTimeoutMessage;
  console.log(errorMessageElement.textContent);
  // Show the `errorMessage` element
  errorMessageElement.style.display = "block";
  alert("Your session has expired.Please log in again.");

  // Delay the message
  setTimeout(() => {
    errorMessageElement.style.display = "none";
  }, 5000);
}

// Attach the session timeout handler to the window object
window.addEventListener("sessiontimeout", sessionTimeoutHandler);

//FETCHING USERDATA FROM SERVER----------------------------------________________USER DATA IN DASHBOARD NAVBAR__________________
// Fetch the user details

function displayUserData(userData) {
  // Implement your code to display user data here
}

//function to display fetched user-Data
function displayUserData(userData) {
  const usernameElement = document.getElementById("username");
  const emailElement = document.getElementById("email");
  emailElement.textContent = userData.email;
  usernameElement.textContent = userData.username;
  const Id = userData.user_id;
  console.log("got user_id", Id);

  const onUploadButtonClick = () => {
    uploadFile(Id);
  };
  const uploadButton = document.querySelector("#uploadFilebtn");
  uploadButton.onclick = onUploadButtonClick;
}
//--------------------------------------------------------------------------___________LOGOUT BUTTON________________--------------
// Function to handle the button click and redirect to the login URL--------------------------------------------
// Add an event listener to the logout button on DOM loading
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-btn");
  logoutButton.addEventListener("click", redirectToLogin);
});
function redirectToLogin() {
  console.log("Session destroyed by client");

  fetch(`/logout`, { method: "GET" })
    .then((response) => response.json()) // Parse the JSON response
    .then((data) => {
      const sessionTimeoutMessage = data.message;
      console.log("Session timeout message:", sessionTimeoutMessage);
      const successMessageElement = document.getElementById("successMessage");
      successMessageElement.innerHTML = "You have Logged Out successfully.";
      sessionStorage.clear();
      localStorage.clear();
      // Cookies.remove("connect.sid");
      location.reload();
      window.location.href = "http://localhost:8080/";
      // Redirect to the login page
    })
    .catch((error) => {
      console.error("Error logging out:", error);
    });
  clearAllCookiesAndSessions();
}
//deleteAllCookies___________________________________________________
function clearAllCookiesAndSessions() {
  sessionStorage.clear();
  localStorage.clear();
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    // Set the expiration date to a past time
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  }
  clearAllCookies();
}

//google-authentication__________user-details_______________________________________________________________

function googleData() {
  fetch(`/google-user`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `An error occurred while fetching Google user data: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((user) => {
      console.log(user);
      localStorage.setItem("user_data", JSON.stringify(user));
      sessionStorage.setItem("user_data", JSON.stringify(user));
      displayUserData(user);
      const user_id = user.user_id;
      console.log("User ID:", user_id);
    })
    .catch((error) => {
      console.error(error);
    });
}
//facebook user fetch________________________________________________________________________________________
function facebookData() {
  fetch("/facebook-user")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `An error occurred while fetching Facebook user data: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((user) => {
      console.log(user);
      localStorage.setItem("user_data", JSON.stringify(user));
      sessionStorage.setItem("user_data", JSON.stringify(user));
      displayUserData(user);
      const user_id = user.user_id;
      console.log("User ID:", user_id);
    })
    .catch((error) => {
      console.error(error);
    });
}
//linkedin user fetch____________________________________________
// Function to fetch LinkedIn user data from the server-side
async function LinkedinData() {
  try {
    const response = await fetch(`/linkedin-user-data`);
    if (!response.ok) {
      console.error(
        `An error occurred while fetching LinkedIn user data: ${response.statusText}`,
        error
      );
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(error);
    // Re-throw the error to handle it elsewhere if needed
    throw error;
  }
}

// Usage example
LinkedinData()
  .then((user) => {
    // Now you have the LinkedIn user data, and you can pass it to displayUserData
    displayUserData(user);
    localStorage.setItem("user_data", JSON.stringify(user));
    sessionStorage.setItem("user_data", JSON.stringify(user));
    // You can also access user properties like user_id, user_name, email here
    const user_id = user.user_id;
    console.log("User ID:", user_id);
  })
  .catch((error) => {
    // Handle errors here
    console.error("Error fetching LinkedIn user data:", error.message);
  });

// password validation----------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Check if the user data is already stored in localStorage
    const storedUserData = localStorage.getItem("user_data");

    // If data is there, parse and use it directly
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      displayUserData(userData);
    } else {
      const response = await fetch(`/user-data`);
      if (!response.ok) {
        googleData();
        facebookData();
        LinkedinData();
        throw new Error(
          `An error occurred while fetching user data: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("User details fetched", data);

      if (!data.user_id) {
        googleData();
        facebookData();
        LinkedinData();
        console.log("Invalid user_id received from the server");
      }
      // Store the user data that was fetched from the server in localStorage
      localStorage.setItem("user_data", JSON.stringify(data));
      // Calling a function to display the user data
      displayUserData(data);
    }
  } catch (error) {
    console.log("Error fetching or processing user data:", error);
    // Handle the error and proceed with the rest of the code
    googleData();
  }
});
//table verification message_________________________________________________
// Example using fetch API
//creating list of MLA_________________________________________________________
document.addEventListener("DOMContentLoaded", () => {
  const mlaButton = document.getElementById("mla-btn");
  mlaButton.addEventListener("click", redirectTomlaList);
});
function redirectTomlaList() {
  console.log("user tried to redirect to mlaList");
  window.location.href = "http://localhost:8080/mla.html";
}
