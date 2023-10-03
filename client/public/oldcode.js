<!DOCTYPE html>
<html>
<head>
    <!-- Your head content -->
</head>
<body>
    <form id="loginForm" action="/login" method="POST">
        <!-- Your form fields -->

        <input type="submit" value="Login"
            class="w-50 btn btn-success position-relative start-50 bottom-0 m-1 translate-middle-x p-1 shadow-lg border-2">
   
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const loginForm = document.getElementById("loginForm");

            loginForm.addEventListener("submit", function (event) {
                // Prevent the default form submission
                event.preventDefault();

                // Create and dispatch a message event
                const messageEvent = new MessageEvent("message", {
                    data: "performFetch",
                    origin: window.location.origin
                });
                window.dispatchEvent(messageEvent);

                // Redirect the user to Google authentication
                window.location.href = "/auth/google";
            });
        });
    </script>


//-------------------------------------
// Corrected event listener for showTable button
const showButton = document.getElementById("showTable");
showButton.addEventListener("click", toggleTableContainer);

//___________________________
// Variables declared at the global scope
let fileData = [];
let currentFileIndex = 0;
let tableName;
let columns = [];
let jsonData;
let currentTableData;
let headers;

// Fetch '/connect' to check server status and display spinner/popup
document.addEventListener('DOMContentLoaded', () => {
    const spinnerContainer = document.querySelector('.spinner-container');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const closePopupButton = document.getElementById('close-popup');

    fetch('/connect')
        .then(response => {
            if (response.ok) {
                spinnerContainer.style.display = 'none';
            } else {
                spinnerContainer.style.display = 'none';
                popupMessage.textContent = 'Server crashed!';
                popup.style.display = 'block';
            }
        })
        .catch(error => {
            console.log('Error connecting to server:', error);
            spinnerContainer.style.display = 'none';
            popupMessage.textContent = 'Error connecting to server!';
            popup.style.display = 'block';
        });

    closePopupButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });
});

// Upload file and call `uploadFile` function
document.getElementById("uploadFilebtn").addEventListener("click", () => {
    uploadFile();
});

// Function to upload file and do necessary processing
function uploadFile() {
    // Your file upload logic...
    // Make sure to set `tableName`, `columns`, and `jsonData` appropriately
    // Also, handle the fileData array and other related functionalities
}

// Rest of your code...

// Assuming you have the 'abortButton' element in your HTML

document.addEventListener('DOMContentLoaded', () => {
    const abortButton = document.getElementById("abortButton");

    // Function to handle the abort button click
    const handleAbortClick = () => {
        fetch('/abort')
            .catch(error => {
                console.log('Error aborting the server:', error);
                popupMessage.textContent = 'Error aborting the server!';
                popup.style.display = 'block';
            });
    };

    // Event listener for the abort button
    abortButton.addEventListener('click', handleAbortClick);
});
//this is new code________________
function generateTable(data, pageNumber, fileIndex, tableName) {
  // ... (your existing code)

  console.log("the data of the table at line number 512:", data);
  console.log("Generate table function is working");

  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  const tableHeader = document.getElementById("table-header");
  tableHeader.innerHTML = "";

  // Create table headers
  currentFileData.columns.forEach((header) => {
      const th = document.createElement("th");
      const trimmedHeader = header.trim();
      th.textContent = trimmedHeader;
      tableHeader.appendChild(th);
  });

  // ... (your existing code for generating table rows)

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
          showPage(i);
      });

      paginationContainer.appendChild(pageButton);
  }

  jsonData = currentFileData.data;
  showPage(currentFileIndex, 1);
  updatePagination(jsonData, pageNumber);
}
//the dashboard_______________showPPage()
async function showPage(currentFileIndex, pageNumber = 1) {
  const currentFileData = fileData[currentFileIndex];
  console.log("currentFileData from showPage function", currentFileData);

  if (!currentFileData?.columns || !Array.isArray(currentFileData?.data)) {
      console.error("currentFileData is not properly initialized or does not contain the 'columns' property.");
      return;
  }

  const { tableName, data } = currentFileData;

  try {
      const popupWin = document.getElementById("popup-win");
      const tableBody = document.getElementById("table-body");
      const paginationContainer = document.getElementById("pagination-container");

      // Clear the table body and pagination container
      tableBody.innerHTML = "";
      paginationContainer.innerHTML = "";

      // Validate the pageNumber argument
      const totalPages = Math.ceil(data.length / 10);
      if (pageNumber < 1 || pageNumber > totalPages) {
          console.error("Invalid page number. The page number should be between 1 and", totalPages);
          return;
      }

      // Get the data for the current page
      const startIndex = (pageNumber - 1) * 10;
      const endIndex = Math.min(startIndex + 10, data.length);
      const pageData = data.slice(startIndex, endIndex); // Use slice to get a subset of the data for the current page

      // Generate the table rows
      console.log("jsonData before populating the table:", jsonData);

      for (let i = startIndex; i < endIndex; i++) {
          const item = pageData[i - startIndex]; // Use pageData to get the item for the current page
          console.log("item at index", i, ":", item);
          const row = document.createElement("tr");

          currentFileData.columns.forEach((header) => {
              const cell = document.createElement("td");
              const columnName = header.trim(); // Trim the column name to remove any extra spaces
              const value = (item[columnName] || "").trim(); // Trim the value and provide a default empty string if the value is undefined
              cell.textContent = value;
              row.appendChild(cell);
          });

          tableBody.appendChild(row);
      }

      // Log the contents of jsonData after populating the table
      console.log("jsonData after populating the table:", jsonData);

      // Generate the page number buttons
      const maxButtonsToShow = 5;
      const maxButtonsToHide = totalPages - maxButtonsToShow;
      const maxButtonsToHideStart = Math.floor(maxButtonsToHide / 2);
      const visibleButtonsStart = Math.max(1, pageNumber - maxButtonsToHideStart);
      const visibleButtonsEnd = Math.min(totalPages, visibleButtonsStart + maxButtonsToShow - 1);

      // Add the "Previous" button
      if (visibleButtonsStart > 1) {
          const prevButton = createPageButton(pageNumber - 1, "< Prev");
          paginationContainer.appendChild(prevButton);
      }

      // Add the page number buttons
      for (let i = visibleButtonsStart; i <= visibleButtonsEnd; i++) {
          const pageButton = createPageButton(i, i.toString());
          if (i === pageNumber) {
              pageButton.classList.add("btn-info"); // Add the 'btn-info' class to indicate the selected button
          }
          paginationContainer.appendChild(pageButton);
      }

      // Add the "Next" button
      if (visibleButtonsEnd < totalPages) {
          const nextButton = createPageButton(pageNumber + 1, "Next >");
          paginationContainer.appendChild(nextButton);
      }
  } catch (error) {
      console.error("Error fetching data:", error);
      displayPopup("Error", "Failed to fetch data. Please try again later.");
  }
}
//____________________________________
async function showPage(currentFileIndex, pageNumber) {
  const currentFileData = fileData[currentFileIndex];
  console.log("currentFileData from showPage function", currentFileData);
  if (!currentFileData || !currentFileData.columns || !Array.isArray(currentFileData?.data)) {
      console.error("currentFileData is not properly initialized or does not contain the 'columns' property.");
      return;
  }

  const { tableName, data } = currentFileData;

  try {
      if (!Array.isArray(data)) {
          throw new Error("Invalid data");
      }

      const popupWin = document.getElementById("popup-win");
      const tableBody = document.getElementById("table-body");
      const paginationContainer = document.getElementById("pagination-container");

      // Clear the table body and pagination container
      tableBody.innerHTML = "";
      paginationContainer.innerHTML = "";

      // Get the data for the current page
      const startIndex = (pageNumber - 1) * 10;
      const endIndex = Math.min(startIndex + 10, data.length);
      console.log("startIndex:", startIndex);
      console.log("endIndex:", endIndex);
      console.log("data.length:", data.length);
      const pageData = data.slice(startIndex, endIndex); // Use slice to get a subset of the data for the current page
      console.log("pageData:", pageData);

      // Generate the table rows
      console.log("jsonData before populating the table:", jsonData);

      for (let i = startIndex; i < endIndex; i++) {
          const item = pageData[i - startIndex]; // Use pageData to get the item for the current page
          console.log("item at index", i, ":", item);
          const row = document.createElement("tr");

          currentFileData.columns.forEach((header) => {
              const cell = document.createElement("td");
              const columnName = header.trim(); // Trim the column name to remove any extra spaces
              const value = (item[columnName] || "").trim(); // Trim the value and provide a default empty string if the value is undefined
              cell.textContent = value;
              row.appendChild(cell);
          });

          tableBody.appendChild(row);
      }

      // Log the contents of jsonData after populating the table
      console.log("jsonData after populating the table:", jsonData);

      // Generate the page number buttons
      const totalPages = Math.ceil(data.length / 10);
      if (pageNumber < 0 || pageNumber > totalPages) {
          console.error("Invalid page number. The page number should be between 1 and", totalPages);
          return;
      }
      const maxButtonsToShow = 5;
      const maxButtonsToHide = totalPages - maxButtonsToShow;
      const maxButtonsToHideStart = Math.floor(maxButtonsToHide / 2);
      const visibleButtonsStart = Math.max(1, pageNumber - maxButtonsToHideStart);
      const visibleButtonsEnd = Math.min(totalPages, visibleButtonsStart + maxButtonsToShow - 1);

      // Add the "Previous" button
      if (visibleButtonsStart > 1) {
          const prevButton = createPageButton(pageNumber - 1, "< Prev");
          paginationContainer.appendChild(prevButton);
      }

      // Add the page number buttons
      for (let i = visibleButtonsStart; i <= visibleButtonsEnd; i++) {
          const pageButton = createPageButton(i, i.toString());
          if (i === pageNumber) {
              pageButton.classList.add("btn-info"); // Add the 'btn-info' class to indicate the selected button
          }
          paginationContainer.appendChild(pageButton);
      }

      // Add the "Next" button
      if (visibleButtonsEnd < totalPages) {
          const nextButton = createPageButton(pageNumber + 1, "Next >");
          paginationContainer.appendChild(nextButton);
      }
  } catch (error) {
      console.error("Error fetching data:", error);
      displayPopup("Error", "Failed to fetch data. Please try again later.");
  }
}
async function showPage(currentFileIndex, pageNumber) {
  const currentFileData = fileData[currentFileIndex];
  if (!currentFileData || !currentFileData.columns || !Array.isArray(currentFileData.data)) {
      console.error("currentFileData is not properly initialized or does not contain the 'columns' property.");
      return;
  }

  try {
      const { tableName, data } = currentFileData;
     

      if (pageNumber < 1 || pageNumber > totalPages) {
          console.error("Invalid page number. The page number should be between 1 and", totalPages);
          return;
      }

      // Fetch the data for the current page if not already available
      if (!data || data.length === 0) {
          const currentPageData = await fetchDataForPage(tableName, pageNumber);
          if (!currentPageData || !Array.isArray(currentPageData)) {
              throw new Error("Invalid data received from the server.");
          }
          currentFileData.data = currentPageData;
      }

      // Continue with generating the table and pagination
      const popupWin = document.getElementById("popup-win");
      const tableBody = document.getElementById("table-body");
      const paginationContainer = document.getElementById("pagination-container");

      // Clear the table body and pagination container
      tableBody.innerHTML = "";
      paginationContainer.innerHTML = "";

      // Get the data for the current page
      const startIndex = (pageNumber - 1) * 10;
      const endIndex = Math.min(startIndex + 10, data.length);
      const pageData = data.slice(startIndex, endIndex);

      // Generate the table rows
      for (let i = 0; i < pageData.length; i++) {
          const item = pageData[i];
          const row = document.createElement("tr");

          currentFileData.columns.forEach((header) => {
              const cell = document.createElement("td");
              const columnName = header.trim(); // Trim the column name to remove any extra spaces

              // Check if the item and the property exist before accessing them
              const value = (item && typeof item === 'object' && item.hasOwnProperty(columnName))
                  ? (item[columnName] || "").trim()
                  : ""; // Trim the value and provide a default empty string if the value is undefined

              cell.textContent = value;
              row.appendChild(cell);
          });

          tableBody.appendChild(row);
      }

      // Generate the page number buttons
      const maxButtonsToShow = 5;
      const maxButtonsToHide = totalPages - maxButtonsToShow;
      const maxButtonsToHideStart = Math.floor(maxButtonsToHide / 2);
      const visibleButtonsStart = Math.max(1, pageNumber - maxButtonsToHideStart);
      const visibleButtonsEnd = Math.min(totalPages, visibleButtonsStart + maxButtonsToShow - 1);

      // Add the "Previous" button
      if (visibleButtonsStart > 1) {
          const prevButton = createPageButton(pageNumber - 1, "< Prev");
          paginationContainer.appendChild(prevButton);
      }

      // Add the page number buttons
      for (let i = visibleButtonsStart; i <= visibleButtonsEnd; i++) {
          const pageButton = createPageButton(i, i.toString());
          if (i === pageNumber) {
              pageButton.classList.add("btn-info"); // Add the 'btn-info' class to indicate the selected button
          }
          paginationContainer.appendChild(pageButton);
      }

      // Add the "Next" button
      if (visibleButtonsEnd < totalPages) {
          const nextButton = createPageButton(pageNumber + 1, "Next >");
          paginationContainer.appendChild(nextButton);
      }
  } catch (error) {
  }

//----------------------
// Function to show a specific page
async function showPage(currentFileIndex, pageNumber) {
  const currentFileData = fileData[currentFileIndex];
  console.log("currentFileData from showPage function", currentFileData);
  if (!currentFileData || !currentFileData.columns || !Array.isArray(currentFileData?.data)) {
      console.error("currentFileData is not properly initialized or does not contain the 'columns' property.");
      return;
  }

  const data = currentFileData.data;
  const totalPages = Math.ceil(data.length / 10);

  try {
      if (pageNumber < 1 || pageNumber > totalPages) {
          console.error("Invalid page number. The page number should be between 1 and", totalPages);
          return;
      }

      const popupWin = document.getElementById("popup-win");
      const tableBody = document.getElementById("table-body");
      const paginationContainer = document.getElementById("pagination-container");

      // Clear the table body and pagination container
      tableBody.innerHTML = "";
      paginationContainer.innerHTML = "";

      // Get the data for the current page
      const startIndex = (pageNumber - 1) * 10;
      const endIndex = Math.min(startIndex + 10, data.length);
      console.log("startIndex:", startIndex);
      console.log("endIndex:", endIndex);
      console.log("data.length:", data.length);
      const pageData = data.slice(startIndex, endIndex);
      console.log("pageData:", pageData); // Use slice to get a subset of the data for the current page

      // Generate the table rows
      console.log("jsonData before populating the table:", jsonData);

      for (let i = 0; i < pageData.length; i++) {
          const item = pageData[i]; // Use pageData to get the item for the current page
          console.log("item at index", i, ":", item);
          const row = document.createElement("tr");

          currentFileData.columns.forEach((header) => {
              const cell = document.createElement("td");
              const columnName = header.trim(); // Trim the column name to remove any extra spaces

              // Check if the item and the property exist before accessing them
              const value = (item && typeof item === 'object' && item.hasOwnProperty(columnName))
                  ? (item[columnName] || "").trim()
                  : ""; // Trim the value and provide a default empty string if the value is undefined

              cell.textContent = value;
              row.appendChild(cell);
          });

          tableBody.appendChild(row);
      }

      // Log the contents of jsonData after populating the table
      console.log("jsonData after populating the table:", jsonData);

      // Generate the page number buttons

      if (pageNumber < 0 || pageNumber > totalPages) {
          console.error("Invalid page number. The page number should be between 1 and", totalPages);
          return;
      }
      const maxButtonsToShow = 5;
      const maxButtonsToHide = totalPages - maxButtonsToShow;
      const maxButtonsToHideStart = Math.floor(maxButtonsToHide / 2);
      const visibleButtonsStart = Math.max(1, pageNumber - maxButtonsToHideStart);
      const visibleButtonsEnd = Math.min(totalPages, visibleButtonsStart + maxButtonsToShow - 1);

      // Add the "Previous" button
      if (visibleButtonsStart > 1) {
          const prevButton = createPageButton(pageNumber - 1, "< Prev");
          paginationContainer.appendChild(prevButton);
      }

      // Add the page number buttons
      for (let i = visibleButtonsStart; i <= visibleButtonsEnd; i++) {
          const pageButton = createPageButton(i, i.toString());
          if (i === pageNumber) {
              pageButton.classList.add("btn-info"); // Add the 'btn-info' class to indicate the selected button
          }
          paginationContainer.appendChild(pageButton);
      }

      // Add the "Next" button
      if (visibleButtonsEnd < totalPages) {
          const nextButton = createPageButton(pageNumber + 1, "Next >");
          paginationContainer.appendChild(nextButton);
      }
  } catch (error) {
      console.error("Error fetching data:", error);
      displayPopup("Error", "Failed to fetch data. Please try again later.");
  }
}
//______________________________
/* Add this to your CSS */
// Function to show next table
function showNextTable() {
  if (currentFileIndex < fileData.length - 1) {
      currentFileIndex++;
      showPage(currentFileIndex, 1); // Show the first page of the new file
      jsonData = fileData[currentFileIndex].data; // Update jsonData with the current file's data
      document.getElementById("prevBtn").classList.remove("disabled"); // Enable "Previous" button
  }
  // Disable "Next" button if there are no more tables to show
  if (currentFileIndex === fileData.length - 1) {
      document.getElementById("nextBtn").classList.add("disabled");
  }
}

function showPreviousTable() {
  if (currentFileIndex > 0) {
      currentFileIndex--;
      showPage(currentFileIndex, 1); // Show the first page of the new file
      jsonData = fileData[currentFileIndex].data; // Update jsonData with the current file's data
      document.getElementById("nextBtn").classList.remove("disabled"); // Enable "Next" button
  }
  // Disable "Previous" button if there are no more tables to show
  if (currentFileIndex === 0) {
      document.getElementById("prevBtn").classList.add("disabled");
  }
}
}
// Function to show a specific page
async function showPage(currentFileIndex, pageNumber) {
  // ... (existing code)

  // Add the "Previous" button
  const prevButton = createPageButton(pageNumber - 1, "&laquo; Prev");
  if (pageNumber === 1) {
      prevButton.classList.add("disabled");
  }
  document.getElementById("file-navigation").innerHTML = ""; // Clear the file navigation container
  document.getElementById("file-navigation").appendChild(prevButton);

  // Add the page number buttons
  for (let i = visibleButtonsStart; i <= visibleButtonsEnd; i++) {
      const pageButton = createPageButton(i, i.toString());
      if (i === pageNumber) {
          pageButton.classList.add("active");
      }
      document.getElementById("file-navigation").appendChild(pageButton);
  }

  // Add the "Next" button
  const nextButton = createPageButton(pageNumber + 1, "Next &raquo;");
  if (pageNumber === totalPages) {
      nextButton.classList.add("disabled");
  }
  document.getElementById("file-navigation").appendChild(nextButton);
}


//new html code
Certainly! After analyzing the entire code, I have identified some issues and areas for improvement. I'll provide the suggested corrections in the form of code. Please note that I will address the code issues and try to improve the code flow to make it more organized and efficient.

1. Unused variable and unnecessary log:
There is a variable `columns` declared but not used in the `uploadFile()` function. We can remove it. Additionally, there is an unnecessary log statement that can be removed.

```javascript
// Remove the unused variable
// Remove the unnecessary log statement
columns = Object.keys(parsedData[0]);
console.log("type of columns pushing into fileData", typeof fileData);
```

2. Redundant calls to `generateTable()`:
In the `uploadFile()` function, the `generateTable()` function is called twice. We can remove the first call and only call it once at the end when the data is completely ready.

```javascript
// Remove the redundant call to generateTable()
// generateTable(parsedData, 1, fileData.length - 1, tableName);
// ...

// Call generateTable() only once after all the data is processed
generateTable(parsedData, 1, fileData.length - 1, tableName);
```

3. Incorrect argument in `showPage()`:
In the `generateTable()` function, the argument `fileData[currentFileIndex]` should be replaced with `currentFileIndex` when calling `showPage()`.

```javascript
// Correct the argument to showPage()
// generateTable(data, 1, currentFileIndex, fileData[currentFileIndex], tableName);
generateTable(data, 1, currentFileIndex, tableName);
```

4. Incorrect variable name in `showNextTable()`:
In the `showNextTable()` function, the variable `FileIndex` should be replaced with `currentFileIndex`.

```javascript
// Correct the variable name to currentFileIndex
function showNextTable() {
    if (currentFileIndex < fileData.length - 1) {
        currentFileIndex++;
        showPage(currentFileIndex, 1); // Show the first page of the new file
        jsonData = fileData[currentFileIndex].data; // Update jsonData with the current file's data
    }
}
```

5. Correct event listener in pagination buttons:
In the `generateTable()` function, the event listener for pagination buttons should call `showPage()` with the correct file index (`currentFileIndex`).

```javascript
// Correct the event listener for pagination buttons
pageLink.addEventListener("click", () => {
    showPage(currentFileIndex, i);
});
```

6. Avoid redundant function calls:
In the `checkFileinput()` function, there is a redundant call to `initTables()`. We can remove it.

```javascript
function checkFileinput() {
    // ...
    if (fileInput.value === '') {
        table.innerHTML = '';
    }
    // Remove the redundant call to initTables()
    // initTables();
}
```
7. Properly handle errors in `showData()`:
In the `showData()` function, we should catch and display errors properly when fetching data from CSV.

```javascript
async function showData(fileIndex) {
    try {
        const currentFileData = fileData[fileIndex];

        if (!currentFileData || !currentFileData.columns) {
            console.error("In showData line 869 currentFileData is not properly initialized or does not contain the 'columns' property.");
            return;
        }
        console.log("showData is now working");
        const popupWin = document.getElementById("popup-win");
        popupWin.style.display = "block";

        const data = await getDataFromCSV(); // Wait for the data to be fetched
        console.log("the data iam getting from showData 828", data);
        fileData[currentFileIndex].data = data;
        jsonData = data;
        generateTable(data, 1, currentFileIndex, tableName);
    } catch (error) {
        console.error("Error fetching data:", error);
        displayPopup("Error", "Failed to fetch data. Please try again later.");
    }
}
```

These are some of the corrections and improvements to the code based on the provided snippet. However, please keep in mind that the code might still require additional modifications depending on the complete context of the application and its interaction with the HTML structure. It's essential to test the code thoroughly with various scenarios and data to ensure it works as expected.
function generateTable(data, pageNumber, fileIndex, tableName) {
  // Existing code for generateTable()
  // ...
}
async function showData(fileIndex) {
  try {
    const currentFileData = fileData[fileIndex];

    if (!currentFileData || !currentFileData.columns) {
      console.error("currentFileData is not properly initialized or does not contain the 'columns' property.");
      return;
    }

    console.log("showData is now working");
    const popupWin = document.getElementById("popup-win");
    popupWin.style.display = "block";

    const data = await getDataFromCSV(); // Wait for the data to be fetched
    console.log("the data iam getting from showData 828", data);
    fileData[currentFileIndex].data = data;
    jsonData = data;

    // Remove tableName from the generateTable() call
    generateTable(data, 1, currentFileIndex); // Update jsonData with the current file's data
  } catch (error) {
    console.error("Error fetching data:", error);
    displayPopup("Error", "Failed to fetch data. Please try again later.");
  }
}
From the provided code, it looks like you have implemented a functionality to upload CSV files, parse their data, and display it in a table format with pagination. However, there are a few areas that can be improved and some issues that need to be addressed. Let's go through them:

1. Properly handle asynchronous operations: There are some parts of the code where asynchronous operations are not properly handled, leading to issues with data and function calls. For example, in the `showData` function, the data is fetched using the `getDataFromCSV()` function, which is an asynchronous operation. However, the code tries to use the `jsonData` variable immediately after the `await` statement. Since `getDataFromCSV()` is asynchronous, you need to wait for it to complete before accessing the data.

2. Remove unnecessary code: There are some redundant code blocks in the `uploadFile` function, such as displaying a popup and setting a button's click event multiple times.

3. Correct the code flow: The code flow for handling file input and table display can be improved. The `showData` function should be responsible for fetching the data and updating the `fileData`, while the `generateTable` function should handle the table rendering based on the `fileData`.

4. Properly initialize `fileData`: The `fileData` array should be initialized before using it to store data from multiple files.

5. Fix the pagination logic: The pagination logic seems to be implemented multiple times. Ensure that the pagination logic is consistent and works correctly with the provided data.

Below is the refactored version of the code with the mentioned improvements:

```javascript
// Initialize the fileData array to store data from multiple files
const fileData = [];

// Upload file function
function uploadFile(Id) {
  // Existing code for the uploadFile function
  // ...
}

// Function to parse CSV data and return an array of objects
function parseCSV(csvData) {
  // Existing code for the parseCSV function
  // ...
}

// Function to fetch data from the CSV file and parse it
async function getDataFromCSV(file) {
  // Existing code for the getDataFromCSV function
  // ...
}

// Function to create page number buttons for pagination
function createPageButton(pageNumber, buttonText) {
  // Existing code for the createPageButton function
  // ...
}

// Function to update pagination based on the data length and current page number
function updatePagination(data, pageNumber) {
  // Existing code for the updatePagination function
  // ...
}

// Function to show a specific page in the table
async function showPage(currentFileIndex, pageNumber) {
  // Existing code for the showPage function
  // ...
}

// Function to handle file input changes and show/hide buttons
function checkFileInput() {
  // Existing code for the checkFileInput function
  // ...
}

// Function to display the table for a specific file
async function showData(fileIndex) {
  try {
    const currentFileData = fileData[fileIndex];

    if (!currentFileData || !currentFileData.columns) {
      throw new Error("currentFileData is not properly initialized or does not contain the 'columns' property.");
    }

    console.log("showData is now working");
    const popupWin = document.getElementById("popup-win");
    popupWin.style.display = "block";

    const data = await getDataFromCSV(); // Wait for the data to be fetched
    console.log("the data iam getting from showData", data);
    fileData[fileIndex].data = data;
    jsonData = data;

    showPage(fileIndex, 1);
    updatePagination(jsonData, 1);
  } catch (error) {
    console.error("Error fetching data:", error);
    displayPopup("Error", "Failed to fetch data. Please try again later.");
  }
}
```

Please note that this is only a refactored version of the code. There might still be other areas that need improvement or adjustments based on your specific requirements. Make sure to test the code thoroughly and handle any edge cases accordingly.
Sure, as a mentor and senior developer, I can provide some corrections and improvements to the code. I'll address the main issues and provide suggestions for improvements:

1. **Pagination Logic**:
   The pagination logic in the `updatePagination` and `showPage` functions has some issues. Let's fix it to correctly display the page buttons and navigate between pages.

```javascript
// Corrected updatePagination function
function updatePagination(data, pageNumber) {
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(data.length / 10);

    const maxButtonsToShow = 5;
    const maxButtonsToHide = totalPages - maxButtonsToShow;
    let visibleButtonsStart;
    let visibleButtonsEnd;

    if (totalPages <= maxButtonsToShow) {
        visibleButtonsStart = 1;
        visibleButtonsEnd = totalPages;
    } else {
        visibleButtonsStart = Math.max(1, pageNumber - Math.floor(maxButtonsToShow / 2));
        visibleButtonsEnd = Math.min(totalPages, visibleButtonsStart + maxButtonsToShow - 1);

        if (visibleButtonsEnd - visibleButtonsStart < maxButtonsToShow - 1) {
            visibleButtonsStart = Math.max(1, visibleButtonsEnd - maxButtonsToShow + 1);
        }
    }

    const previousButton = createPageButton(pageNumber - 1, "Prev");
    if (pageNumber === 1) {
        previousButton.classList.add("disabled");
    }
    paginationContainer.appendChild(previousButton);

    for (let i = visibleButtonsStart; i <= visibleButtonsEnd; i++) {
        const pageButton = createPageButton(i, i.toString());
        if (i === pageNumber) {
            pageButton.classList.add("active");
        }
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = createPageButton(pageNumber + 1, "Next");
    if (pageNumber === totalPages) {
        nextButton.classList.add("disabled");
    }
    paginationContainer.appendChild(nextButton);
}

// Corrected showPage function
async function showPage(currentFileIndex, pageNumber) {
    // ... (rest of the function remains the same)

    // Get the data for the current page
    const startIndex = (pageNumber - 1) * 10;
    const endIndex = Math.min(startIndex + 10, data.length);
    const pageData = data.slice(startIndex, endIndex);

    // ... (rest of the function remains the same)

    // Generate the page number buttons
    updatePagination(data, pageNumber);
}
```

2. **Handle Page Number Limits**:
   In the `generateTable` and `showPage` functions, you should ensure that the `pageNumber` stays within valid limits.

```javascript
// Inside generateTable function, replace the following line:
if (pageNumber < 1 || pageNumber > Math.ceil(data.length / 10)) {

// Inside showPage function, replace the following line:
if (pageNumber < 1 || pageNumber > totalPages) {
```

3. **Avoid Multiple Intervals**:
   In the `generateTable` function, it looks like there is an issue with handling multiple intervals. Let's refactor the `checkFileinput` function to handle this correctly.

```javascript
// Move the CheckInputTime variable outside the checkFileinput function to avoid multiple intervals.
let CheckInputTime;

// Update the checkFileinput function
function checkFileinput() {
    const fileInput = document.getElementById("inputGroupFile03");
    const showDbBtn = document.getElementById("savedData");
    const showTableBtn = document.getElementById("showTable");
    const tableContainer = document.getElementById("tableContainer");

    if (fileInput.value === '') {
        table.innerHTML = '';
    }

    if (fileInput.value !== "") {
        console.log("fileInput is not empty");
        showDbBtn.style.display = "block";
        showTableBtn.style.display = "block";
    } else {
        console.log("No file was uploaded");
        showTableBtn.style.display = "none";
    }
}

// Remove the CheckInputTime from the generateTable function.
```

These are the main corrections and improvements I would suggest based on the provided code and the issue you mentioned with navigating between pages. Always make sure to check for other parts of your application that might affect the behavior of these functions. If you encounter any other issues or have specific error messages, please let me know, and I'll be happy to help further!
function generateTable(data, pageNumber, fileIndex, tableName) {
  // ... (previous code remains unchanged)

  const startIndex = (pageNumber - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);
  const pageData = data.slice(startIndex, endIndex);

  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  for (let i = 0; i < pageData.length; i++) {
      const rowData = pageData[i]; // Access the data for the current row
      const row = document.createElement("tr");

      currentFileData.columns.forEach((header) => {
          const cell = document.createElement("td");
          const columnName = header.trim();
          const value = rowData[columnName]?.trim(); // Access the value for the current cell
          cell.textContent = value;
          row.appendChild(cell);
      });

      tableBody.appendChild(row);
  }

  // ... (rest of the code remains unchanged)
}
----------------------------------------
function generateTable(data, pageNumber, fileIndex, tableName) {
  console.log("this is fileIndex 501", fileIndex);
  console.log("this is data i got from upload from line 501", data);
  console.log("this is tableName from generate table line 500", tableName);
  console.log("the type of data i got to generateTable function is", typeof data);
  if (!data || data.length === 0) {
      console.error("Invalid or empty data array:", data);
      // Handle this scenario or display an error message as needed
      return;
  }
  const currentFileData = fileData[fileIndex];

  if (!currentFileData || !currentFileData.columns) {
      console.error("currentFileData is not properly initialized or does not contain the 'columns' property.");
      return;
  }


  console.log("this is tablename at generateTable", tableName);
  console.log(" the currentFileData we getting into generateTable 511", currentFileData);
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
  tableHeader.innerHTML = "";
  currentFileData.columns.forEach((header) => {
      const th = document.createElement("th");
      const trimmedHeader = header.trim();
      th.textContent = trimmedHeader;
      tableHeader.appendChild(th);
  });

  const startIndex = (pageNumber - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);
  const pageData = data.slice(startIndex, endIndex);

  for (let i = startIndex; i < endIndex; i++) {
      const row = document.createElement("tr");
      const item = pageData[i - startIndex];
      console.log("item at index", i, ":", item);
      currentFileData.columns.forEach((header) => {
          const cell = document.createElement("td");
          const columnName = header.trim(); // Remove quotes and extra spaces from header
          const value = item[columnName]?.trim(); // Remove quotes and extra spaces from item value
          cell.textContent = value;
          row.appendChild(cell);
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
      if (fileInput.value === '') {
          table.innerHTML = '';
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
          const table = document.getElementById('data-table');

          fileInput.addEventListener('input', () => {
              if (inputField.value === '') {
                  table.innerHTML = '';
              }
          });

          // If the interval is not running, start it to check for file input changes
          if (!CheckInputTime) {
              CheckInputTime = setInterval(checkFileinput, 500);
          }
      }

  }
  //when ever the input field becomes empty make the table empty;
  // Start the interval initially
  CheckInputTime = setInterval(checkFileinput, 500);

  jsonData = currentFileData.data;
  showPage(currentFileIndex, pageNumber);

}
--------------------------------------------------------------------------------
function generateTable(data, pageNumber, fileIndex, tableName) {
  const currentFileData = fileData[fileIndex];

  if (!currentFileData || !currentFileData.columns || !Array.isArray(currentFileData.data)) {
      console.error("Invalid or incomplete currentFileData:", currentFileData);
      return;
  }

  const tableBody = document.getElementById("table-body");
  const tableHeader = document.getElementById("table-header");
  const paginationContainer = document.getElementById("pagination-container");

  tableBody.innerHTML = "";
  tableHeader.innerHTML = "";
  paginationContainer.innerHTML = "";

  // Create table headers
  currentFileData.columns.forEach((header) => {
      const th = document.createElement("th");
      const trimmedHeader = header.trim();
      th.textContent = trimmedHeader;
      tableHeader.appendChild(th);
  });

  const startIndex = (pageNumber - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);
  const pageData = data.slice(startIndex, endIndex);

  for (const rowData of pageData) {
      const row = document.createElement("tr");
      currentFileData.columns.forEach((header) => {
          const cell = document.createElement("td");
          const columnName = header.trim();
          const value = rowData[columnName]?.trim() || "";
          cell.textContent = value;
          row.appendChild(cell);
      });
      tableBody.appendChild(row);
  }

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
          showPage(fileIndex, i);
      });

      paginationContainer.appendChild(pageButton);
  }

  // Rest of the code to handle file input and other functionality
}
function generateTable(data, pageNumber, fileIndex, tableName) {
  const currentFileData = fileData[fileIndex];

  if (!currentFileData || !currentFileData.columns || !Array.isArray(currentFileData.data)) {
      console.error("Invalid or incomplete currentFileData:", currentFileData);
      return;
  }

  const tableBody = document.getElementById("table-body");
  const tableHeader = document.getElementById("table-header");
  const paginationContainer = document.getElementById("pagination-container");

  tableBody.innerHTML = "";
  tableHeader.innerHTML = "";
  paginationContainer.innerHTML = "";

  // Create table headers
  currentFileData.columns.forEach((header) => {
      const th = document.createElement("th");
      const trimmedHeader = header.trim();
      th.textContent = trimmedHeader;
      tableHeader.appendChild(th);
  });

  const pageSize = 10; // Number of rows per page
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length); // Adjust endIndex

  const pageData = data.slice(startIndex, endIndex);

  for (const rowData of pageData) {
      const row = document.createElement("tr");
      currentFileData.columns.forEach((header) => {
          const cell = document.createElement("td");
          const columnName = header.trim();
          const value = rowData[columnName]?.trim() || "";
          cell.textContent = value;
          row.appendChild(cell);
      });
      tableBody.appendChild(row);
  }

  for (let i = 1; i <= Math.ceil(data.length / pageSize); i++) {
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
          showPage(fileIndex, i);
      });

      paginationContainer.appendChild(pageButton);
  }

  // Rest of the code to handle file input and other functionality
}


function displayTableWindow(data, tableName) {
  // ... Existing code ...

  data.forEach((row) => {
    const tr = document.createElement("tr");
    columns.forEach((column) => {
      // ... Existing code ...
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-primary", "btn-sm", "m-1", "edit-cells");
    editButton.addEventListener("click", () => {
      toggleEditingMode(tr);
    });
    tr.appendChild(editButton);

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("btn", "btn-success", "btn-sm", "m-1", "save-cells");
    saveButton.style.display = "none"; // Initially hide the "Save" button
    saveButton.addEventListener("click", () => {
      // Implement save functionality here
      // For example, update the data in the server or perform any other action
      toggleEditingMode(tr);
    });
    tr.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("btn", "btn-danger", "btn-sm", "m-1", "cancel-cells");
    cancelButton.style.display = "none"; // Initially hide the "Cancel" button
    cancelButton.addEventListener("click", () => {
      toggleEditingMode(tr);
    });
    tr.appendChild(cancelButton);

    tableBody.appendChild(tr);
  });

  // ... Existing code ...
}


<div id="popup-win" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: none; justify-content: center; align-items: center; z-index: 9999; overflow: auto; border: 2px;" class="card border border-warning">
  <div style="max-width: 100%; max-height: 90%; background-color: #fff; padding: 20px;">
    <h3 id="windowTitle" class="text-center text-dark text-bg-info p-1 z-0 position-fixed start-50 top-0 translate-middle-x bg-body-primary w-100">
      Uploaded Data
    </h3>
    <table id="data-table" class="table table-striped table-bordered table-hover">
      <thead class="thead-dark">
        <tr id="table-header"></tr>
      </thead>
      <tbody id="table-body" class="mt-2">
        <tr>
          <td colspan="11">
            <h1 class="text-center">NO DATA</h1>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="d-flex justify-content-between mb-3">
    <button type="button" class="btn btn-danger btn-sm" onclick="closeTable()">Close</button>
    <button type="button" class="btn btn-primary btn-sm" id="editTableButton" style="display:none;">Edit Table</button>
  </div>
  <button type="button" class="btn btn-primary btn-sm" id="saveDB">Save to DATA-BASE</button>
  <button type="button" class="btn btn-warning btn-sm" id="deleteButton" onclick="deleteTable()">Delete</button>
  <div class="pagination mt-3 justify-content-center">
    <ul id="pagination-container" class="pagination"></ul>
  </div>
</div>
------------------------------------------------------------------------------
function generateTable(data, pageNumber, fileIndex, tableName) {
  // ... Existing code ...

  // Create table headers
  tableHeader.innerHTML = "";
  currentFileData.columns.forEach((header) => {
      const th = document.createElement("th");
      const trimmedHeader = header.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters
      th.textContent = trimmedHeader;
      tableHeader.appendChild(th);
  });

  const startIndex = (pageNumber - 1) * 10;
  const endIndex = Math.min(startIndex + 10, data.length);
  const pageData = data.slice(startIndex, endIndex);

  for (let i = startIndex; i < endIndex; i++) {
      const item = pageData[i - startIndex];
      const row = document.createElement("tr");

      currentFileData.columns.forEach((header) => {
          const cell = document.createElement("td");
          const columnName = header.trim(); // Remove extra whitespace
          const value = (item && typeof item === 'object' && item.hasOwnProperty(columnName))
              ? String(item[columnName] || "").trim() // Convert entire item to string
              : "";
          cell.textContent = value.replace(/\r/g, ""); // Remove \r characters
          row.appendChild(cell);
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

  jsonData = currentFileData.data;
  showPage(currentFileIndex, pageNumber);
}

//---------------------------------------------
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

// Configure the Facebook strategy for use by passport
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Here you can find or create a user in your database based on the profile information from Facebook
    // Once you have a user object, call done(null, user) to complete the authentication process
  }
));

// Set up the route to handle login with Facebook
app.get('/login/federated/facebook',
  passport.authenticate('facebook'));

// Set up the route to handle the callback from Facebook
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

  
//function displayTableWindow(data, tableName) {
    // ... existing code ...

    data.forEach((row) => {
        const tr = document.createElement("tr");
        columns.forEach((column) => {
            const td = document.createElement("td");
            td.textContent = row[column];
            tr.appendChild(td);
        });

        // ... existing code ...

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.classList.add("btn", "btn-success", "btn-sm", "m-1", "save-cells");
        saveButton.style.display = "none"; // Initially hide the "Save" button
        saveButton.addEventListener("click", () => {
            updateTableData(tableName); // Call the updateTableData function
            toggleEditingMode(tr);
        });
        tr.appendChild(saveButton);

        // ... existing code ...

        tableBody.appendChild(tr);
    });

    // ... existing code ...
    //update::Alter entire table on clicking save button , or may be we can record previous value and alter the updated value,modify the code as required
}

----------------------------------------------------------------
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

  if (isEditing) {
    // Show the "Edit" button and hide the "Cancel" and "Save" buttons
    editButton.style.display = "block";
    cancelButton.style.display = "none";
    saveButton.style.display = "none";
  } else {
    // Show the "Cancel" and "Save" buttons and hide the "Edit" button
    editButton.style.display = "none";
    cancelButton.style.display = "block";
    saveButton.style.display = "block";
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

// Update the updateTableData function to send updated data to the server
function updateTableData(tableName) {
  const tableRows = document.querySelectorAll("#table-body tr");
  const updatedData = [];

  tableRows.forEach((row) => {
    const rowData = {};
    const cells = row.querySelectorAll("td");
    rowData.id = cells[0].textContent; // Assuming the "id" column is the first column in each row

    // Include other columns in the rowData object
    for (let i = 1; i < cells.length; i++) {
      const column = tableHeaderRow.children[i].textContent;
      rowData[column] = cells[i].textContent;
    }

    updatedData.push(rowData);
  });

  // Send the updated data to the server using a PATCH request
  fetch(`/updateTableData/${tableName}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updatedData }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      // Handle the response from the server if needed
    })
    .catch((error) => {
      console.error("Error updating table data:", error);
      // Handle the error if needed
    });
}

----------------------------07-08-2023--------------------
// Modify the displayTableWindow function to pass tableHeaderRow as a parameter to updateTableData function
function displayTableWindow(data, tableName) {
  // Existing code...

  // Pass tableHeaderRow to the updateTableData function
  saveButton.addEventListener("click", () => {
    console.log("Save button clicked");
    updateTableData(tableName, tableHeaderRow);
    toggleEditingMode(tr);
  });

  // Existing code...
}

// Modify the updateTableData function to accept tableHeaderRow as a parameter
function updateTableData(tableName, tableHeaderRow) {
  // Existing code...

  tableRows.forEach((row) => {
    // Existing code...

    // Include other columns in the rowData object using tableHeaderRow
    for (let i = 1; i < cells.length; i++) {
      const column = tableHeaderRow.children[i].textContent;
      rowData[column] = cells[i].textContent;
    }

    updatedData.push(rowData);
  });

  // Existing code...
}


pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      // Handle the error
      return;
    }
  
    // Use the database connection here
    // ...
  
    // Release the connection when done
    connection.release();
  });
  
-----------------------------------------------------------
  saveButton.addEventListener("click", () => {
    console.log("Save button clicked");
    // Collect the updated data from the table
    const tableRows = document.querySelectorAll("#table-body tr");
    const updatedData = [];

    tableRows.forEach((row) => {
        const rowData = {};
        const cells = row.querySelectorAll("td");
        rowData.id = cells[0].textContent; // Assuming the "id" column is the first column in each row
        for (let i = 1; i < cells.length; i++) {
            const column = tableHeaderRow.children[i].textContent;
            rowData[column] = cells[i].textContent;
        }
        updatedData.push(rowData);
    });

    // Call the updateTableData function to send the updated data to the server
    updateTableData(tableName, updatedData);
    // Toggle editing mode after saving
    toggleEditingMode(tr);
});
-----------------------------------------------------------------------------------------------
async function updateTableData(tableName, updatedData) {
    try {
        // Send the updated data to the server using a PATCH request
        const response = await fetch(`/updateTableData/${tableName}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedData }),
        });

        if (!response.ok) {
            throw new Error("Error updating table data");
        }

        const data = await response.json();
        console.log(data.message);
        // Handle the response from the server if needed
    } catch (error) {
        console.error("Error updating table data:", error);
        // Handle the error if needed
    }
}
//___________________________________________________________________________________________________________________
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
      tr.dataset.id = row.id; // Assuming each row has an "id" property

      columns.forEach((column) => {
          tableBody.style.margin = "1rem";
          const td = document.createElement("td");
          td.textContent = row[column];
          tr.appendChild(td);
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("btn", "btn-primary", "btn-sm", "m-1", "edit-cells");
      editButton.addEventListener("click", () => {
          toggleEditingMode(tr);
      });
      tr.appendChild(editButton);

      const saveButton = document.createElement("button");
      saveButton.textContent = "Save";
      saveButton.classList.add("btn", "btn-success", "btn-sm", "m-1", "save-cells");
      saveButton.style.display = "none"; // Initially hide the "Save" button

      saveButton.addEventListener("click", async () => {
          console.log("Save button clicked");

          const rowId = tr.dataset.id;
          const cells = tr.querySelectorAll("td");

          cells.forEach((cell, index) => {
              const columnName = columns[index];
              const newValue = cell.textContent;
              const oldValue = cell.dataset.originalValue;

              if (newValue !== oldValue) {
                  const updatedData = {
                      id: rowId,
                      [columnName]: newValue,
                  };
                  await updateTableData(tableName, updatedData);
                  cell.dataset.originalValue = newValue;
              }
          });

          toggleEditingMode(tr);
      });

      // ...

      tr.appendChild(saveButton);

      // ... (other parts of the row creation)
  });

  // ... (other parts of the displayTableWindow function)
}

// ... (other functions)

async function updateTableData(tableName, updatedData) {
  try {
      const response = await fetch(`/updateTableData/${tableName}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ updatedData }),
      });

      if (!response.ok) {
          throw new Error("Error updating table data");
      }

      const data = await response.json();
      console.log(data.message);
      // Handle the response from the server if needed
  } catch (error) {
      console.error("Error updating table data:", error);
      // Handle the error if needed
  }
}
//-----------------------------------------------
saveButton.addEventListener("click", async () => {
  console.log("Save button clicked");

  // Get the row element associated with the clicked "Save" button
  const row = saveButton.closest("tr");

  // Get the row ID from the data-id attribute
  const rowId = row.dataset.id;

  // Collect the updated data from the row's cells
  const updatedData = [];
  const cells = row.querySelectorAll("td");
  cells.forEach((cell, index) => {
      const columnName = columns[index]; // Assuming columns and cells match
      const newValue = cell.textContent;
      const oldValue = cell.dataset.originalValue;

      if (newValue !== oldValue) {
          // If the new value is different from the original value, add it to the updatedData array
          const rowData = {
              id: rowId,
              [columnName]: newValue,
          };
          updatedData.push(rowData);
          cell.dataset.originalValue = newValue; // Update the original value
      }
  });

  // Call the updateTableData function to send the updated data to the server
  if (updatedData.length > 0) {
      await updateTableData(tableName, updatedData);
      // Toggle editing mode after saving
      toggleEditingMode(row);
  }
});
//------------------------------------
data.forEach((rowData) => {
  const tr = document.createElement("tr");
  columns.forEach((column) => {
    // ...
  });

  // ...

  const cells = tr.querySelectorAll("td"); // Use tr instead of row
  cells.forEach((cell, index) => {
    const columnName = columns[index];
    // ...
  });

  // ...
});

// Attach the event listener to the entire table body
tableBody.addEventListener("click", (event) => {
    const clickedElement = event.target;

    // Check if the clicked element is an edit button
    if (clickedElement.classList.contains("edit-cells")) {
        // Find the parent <tr> element
        const tableRow = clickedElement.closest("tr");
        
        // Call the toggleEditingMode function with the found <tr> element
        toggleEditingMode(tableRow);
    }
});

// Function to enable/disable editing mode for cells
function toggleEditingMode(tableRow) {
    // Rest of your toggleEditingMode function code
    // ...
}

//--------------------------------------------
function displayTableWindow(data, tableName) {
  // ... (your existing code)

  data.forEach((row) => {
      const tr = document.createElement("tr");
      columns.forEach((column) => {
          const td = document.createElement("td");
          td.textContent = row[column];
          tr.appendChild(td);
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("btn", "btn-primary", "btn-sm", "m-1", "edit-cells");
      editButton.addEventListener("click", (event) => {
          const clickedEditButton = event.target;
          const tr = clickedEditButton.closest("tr");
          toggleEditingMode(tr);
      });
      tr.appendChild(editButton);

      // ... (rest of your code)
  });

  // ... (rest of your code)
}
//________________________________________
// Create a table element
const table = document.createElement("table");

// Create table rows with data
data.forEach((row) => {
  // Create a table row element
  const tr = document.createElement("tr");
  // Append it to the table element
  table.appendChild(tr);

  // Loop through the columns of each row
  columns.forEach((column) => {
    // Create a table cell element
    const td = document.createElement("td");
    // Set its text content to the value of the column
    td.textContent = row[column];
    // Append it to the table row element
    tr.appendChild(td);
  });

  // Add your buttons and event listeners here
  // ...
});

// Now you can use querySelectorAll on the table element
const cells = table.querySelectorAll("td");
//-------------------------------------------
// Create table rows with data
data.forEach((row) => {
  // Create a table row element
  const tr = document.createElement("tr");

  // Loop through the columns of each row
  columns.forEach((column) => {
    // Create a table cell element
    const td = document.createElement("td");
    // Set its text content to the value of the column
    td.textContent = row[column];
    // Append it to the table row element
    tr.appendChild(td);
  });

  // Add your buttons and event listeners here
  // ...

  // Get the cells from the row using the children property
  const cells = tr.children;
});
//_____________________________________________
function displayTableWindow(data, tableName) {
  const windowTitle = document.getElementById("windowTitle");
  windowTitle.textContent = tableName;

  const tableContainer = document.getElementById("popup-win");
  tableContainer.style.display = "block";

  const tableHeaderRow = document.getElementById("table-header");
  const tableBody = document.getElementById("table-body");
  tableHeaderRow.innerHTML = "";
  tableBody.innerHTML = "";

  if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="11"><h1 class="text-center">NO DATA</h1></td></tr>`;
      return;
  }

  const columns = Object.keys(data[0]);

  columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column;
      tableHeaderRow.appendChild(th);
  });

  data.forEach((row) => {
      const tr = document.createElement("tr");

      columns.forEach((column) => {
          const td = document.createElement("td");
          td.textContent = row[column];
          tr.appendChild(td);
      });

      const editButton = createButton("Edit", "edit-cells", () => toggleEditingMode(tr));
      const saveButton = createButton("Save", "save-cells", () => saveRowData(tr));
      const cancelButton = createButton("Cancel", "cancel-cells", () => toggleEditingMode(tr));

      tr.appendChild(editButton);
      tr.appendChild(saveButton);
      tr.appendChild(cancelButton);

      tableBody.appendChild(tr);
  });
}

function createButton(text, className, clickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("btn", className, "btn-sm", "m-1");
  button.style.display = "none";
  button.addEventListener("click", clickHandler);
  return button;
}

function toggleEditingMode(tableRow) {
  const cells = tableRow.querySelectorAll("td");
  const isEditing = cells[0].getAttribute("contenteditable") === "true";

  cells.forEach((cell) => {
      cell.setAttribute("contenteditable", isEditing ? "false" : "true");
  });

  const editButton = tableRow.querySelector(".edit-cells");
  const saveButton = tableRow.querySelector(".save-cells");
  const cancelButton = tableRow.querySelector(".cancel-cells");

  editButton.style.display = isEditing ? "block" : "none";
  saveButton.style.display = isEditing ? "none" : "block";
  cancelButton.style.display = isEditing ? "none" : "block";
}

async function saveRowData(tableRow) {
  const rowId = tableRow.dataset.id;
  const cells = tableRow.querySelectorAll("td");

  const updatedData = Array.from(cells).reduce((data, cell, index) => {
      const columnName = columns[index];
      const newValue = cell.textContent;
      if (newValue !== cell.dataset.originalValue) {
          data[columnName] = newValue;
      }
      return data;
  }, {});

  if (Object.keys(updatedData).length > 0) {
      await updateTableData(rowId, updatedData);
      toggleEditingMode(tableRow);
  }
}

// Rest of your code
data.forEach((row) => {
    const tr = document.createElement("tr");

    columns.forEach((column) => {
        const td = document.createElement("td");
        td.textContent = row[column];

        // Attach an event listener to each cell
        td.addEventListener("input", () => {
            // Mark the cell as edited
            td.dataset.isEdited = "true";
        });

        tr.appendChild(td);
    });

    const editButton = createButton("Edit", "edit-cells", () => toggleEditingMode(tr));
    const saveButton = createButton("Save", "save-cells", () => saveRowData(tr));
    const cancelButton = createButton("Cancel", "cancel-cells", () => toggleEditingMode(tr));

    tr.appendChild(editButton);
    tr.appendChild(saveButton);
    tr.appendChild(cancelButton);

    tableBody.appendChild(tr);
});

// ...

async function saveRowData(tableRow) {
    const cells = tableRow.querySelectorAll("td");

    const updatedData = {};

    cells.forEach((cell, index) => {
        const columnName = columns[index];
        if (cell.dataset.isEdited === "true") {
            updatedData[columnName] = cell.textContent;
            cell.dataset.isEdited = "false"; // Reset the flag
        }
    });

    if (Object.keys(updatedData).length > 0) {
        await updateTableData(rowId, updatedData);
        toggleEditingMode(tableRow);
    }
}
//----------------
data.forEach((row) => {
  const tr = document.createElement("tr");

  columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = row[column];

      // Attach an event listener to each cell
      td.addEventListener("input", () => {
          // Mark the cell as edited
          td.dataset.isEdited = "true";
      });

      tr.appendChild(td);
  });

  const editButton = createButton("Edit", "edit-cells", () => toggleEditingMode(tr));
  const saveButton = createButton("Save", "save-cells", () => saveRowData(tr));
  const cancelButton = createButton("Cancel", "cancel-cells", () => toggleEditingMode(tr));

  tr.appendChild(editButton);
  tr.appendChild(saveButton);
  tr.appendChild(cancelButton);

  tableBody.appendChild(tr);
});

// ...

async function saveRowData(tableRow) {
  const cells = tableRow.querySelectorAll("td");

  const updatedData = {};

  cells.forEach((cell, index) => {
      const columnName = columns[index];
      if (cell.dataset.isEdited === "true") {
          updatedData[columnName] = cell.textContent;
          cell.dataset.isEdited = "false"; // Reset the flag
      }
  });

  if (Object.keys(updatedData).length > 0) {
      await updateTableData(rowId, updatedData);
      toggleEditingMode(tableRow);
  }
}
//-----------------------------------------------------
passport.use(
    new GoogleStrategy(
      {
        clientID: "your-client-id",
        clientSecret: "your-client-secret",
        callbackURL: "http://localhost:8080/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile || !profile.id) {
            return done(new Error("Invalid profile data"));
          }
          const { id, displayName, emails } = profile;
          const email = emails[0].value;
  
          // Check if the user already exists in the database
          const userExistsQuery = "SELECT COUNT(*) AS userCount FROM users WHERE google_Id = ?";
          const userExistsValues = [id];
          const userExistsResult = await executeQuery(userExistsQuery, userExistsValues);
  
          if (userExistsResult[0].userCount > 0) {
            console.log("User already exists in the database:", email);
            return done(null, { id, email, displayName });
          }
  
          // Store the user data in the MySQL database
          const insertUserQuery =
            "INSERT INTO users (google_Id, email, user_name) VALUES (?, ?, ?)";
          const insertUserValues = [id, email, displayName];
          await executeQuery(insertUserQuery, insertUserValues);
  
          console.log("User data stored in the database:", email);
          console.log("google_Id stored in the database:", id);
          console.log("Username in the database:", displayName);
  
          return done(null, { id, email, displayName });
        } catch (error) {
          console.error("Error in verification:", error);
          return done(error);
        }
      }
    )
  );
  
  // Rest of the code including helper functions...


  passport.use(
    new GoogleStrategy(
      {
        clientID: "your-client-id",
        clientSecret: "your-client-secret",
        callbackURL: "http://localhost:8080/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile || !profile.id) {
            return done(new Error("Invalid profile data"));
          }
          const { id, displayName, emails } = profile;
          const email = emails[0].value;
  
          // Check if the user already exists in the database
          const userExistsQuery = "SELECT COUNT(*) AS userCount FROM users WHERE google_Id = ?";
          const userExistsValues = [id];
          const userExistsResult = await executeQuery(userExistsQuery, userExistsValues);
  
          if (userExistsResult[0].userCount > 0) {
            console.log("User already exists in the database:", email);
            return done(null, { id, email, displayName });
          }
  
          // Store the user data in the MySQL database
          const insertUserQuery =
            "INSERT INTO users (google_Id, email, user_name) VALUES (?, ?, ?)";
          const insertUserValues = [id, email, displayName];
          await executeQuery(insertUserQuery, insertUserValues);
  
          console.log("User data stored in the database:", email);
          console.log("google_Id stored in the database:", id);
          console.log("Username in the database:", displayName);
  
          return done(null, { id, email, displayName });
        } catch (error) {
          console.error("Error in verification:", error);
          return done(error);
        }
      }
    )
  );
  
  // Rest of the code including helper functions...

  passport.use(
    new GoogleStrategy(
      {
        clientID: "your-client-id",
        clientSecret: "your-client-secret",
        callbackURL: "http://localhost:8080/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile || !profile.id) {
            return done(new Error("Invalid profile data"));
          }
          const { id, displayName, emails } = profile;
          const email = emails[0].value;
  
          // Check if the user already exists in the database
          const userExistsQuery = "SELECT COUNT(*) AS userCount FROM users WHERE google_Id = ?";
          const userExistsValues = [id];
          const userExistsResult = await executeQuery(userExistsQuery, userExistsValues);
  
          if (userExistsResult[0].userCount > 0) {
            console.log("User already exists in the database:", email);
            return done(null, { id, email, displayName });
          }
  
          // Store the user data in the MySQL database
          const insertUserQuery =
            "INSERT INTO users (google_Id, email, user_name) VALUES (?, ?, ?)";
          const insertUserValues = [id, email, displayName];
          await executeQuery(insertUserQuery, insertUserValues);
  
          console.log("User data stored in the database:", email);
          console.log("google_Id stored in the database:", id);
          console.log("Username in the database:", displayName);
  
          return done(null, { id, email, displayName });
        } catch (error) {
          console.error("Error in verification:", error);
          return done(error);
        }
      }
    )
  );
  
  // Rest of the code including helper functions..._____________

  passport.use(new GoogleStrategy(/* ... */), (accessToken, refreshToken, profile, done) => {
    // Extract relevant data from the profile
    const { id, displayName, emails } = profile;
    const email = emails[0].value;
  
    // Check if the user already exists by their Google ID or email
    const findUserQuery = "SELECT * FROM users WHERE google_id = ? OR email = ?";
    const findUserValues = [id, email];
  
    pool.query(findUserQuery, findUserValues, (err, result) => {
      if (err) {
        console.error("Error querying the database:", err);
        return done(err);
      }
  
      if (result.length === 0) {
        // User does not exist, create a new entry
        const insertUserQuery = "INSERT INTO users (google_id, email, user_name) VALUES (?, ?, ?)";
        const insertUserValues = [id, email, displayName];
        
        pool.query(insertUserQuery, insertUserValues, (err) => {
          if (err) {
            console.error("Error creating a new user:", err);
            return done(err);
          }
          return done(null, { id, email, displayName });
        });
      } else {
        // User exists, retrieve their data
        const user = result[0];
        return done(null, user);
      }
    });
  });
  //--------------------------------------------
  passport.use(
    new GoogleStrategy(
      {
        clientID: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        callbackURL: "YOUR_CALLBACK_URL",
      },
      (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile || !profile.id) {
            return done(new Error("Invalid profile data"));
          }
          const { id, displayName, emails } = profile;
          // Extract relevant data from the profile
          const email = emails[0].value;
  
          // Check if the user already exists in the database by email
          const findUserQuery = "SELECT * FROM users WHERE email = ?";
          pool.query(findUserQuery, [email], (err, result) => {
            if (err) {
              console.error("Error querying the database:", err);
              return done(err);
            }
  
            if (result.length === 0) {
              // User does not exist, create a new entry
              const insertUserQuery =
                "INSERT INTO users (google_Id, email, user_name) VALUES (?, ?, ?)";
              const values = [id, email, displayName];
              pool.query(insertUserQuery, values, (err) => {
                if (err) {
                  console.error("Error storing user in the database:", err);
                  return done(err);
                }
                console.log("User data stored in the database:", email);
                console.log("google_Id stored in the database:", id);
                console.log("Username in the database:", displayName);
                return done(null, { id, email, displayName });
              });
            } else {
              // User exists, proceed with authentication
              return done(null, { id, email, displayName });
            }
          });
        } catch (error) {
          console.error("Error in verification:", error);
          return done(error);
        }
      }
    )
  );
  //__________

  passport.use(
    new GoogleStrategy(
      {
        clientID: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        callbackURL: "YOUR_CALLBACK_URL",
      },
      (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile || !profile.id) {
            return done(new Error("Invalid profile data"));
          }
          const { id, displayName, emails } = profile;
          // Extract relevant data from the profile
          const email = emails[0].value;
  
          // Check if the user already exists in the database by Google ID
          const findUserQuery = "SELECT * FROM users WHERE google_Id = ?";
          pool.query(findUserQuery, [id], (err, result) => {
            if (err) {
              console.error("Error querying the database:", err);
              return done(err);
            }
  
            if (result.length === 0) {
              // User does not exist, create a new entry
              const insertUserQuery =
                "INSERT INTO users (google_Id, email, user_name) VALUES (?, ?, ?)";
              const values = [id, email, displayName];
              pool.query(insertUserQuery, values, (err) => {
                if (err) {
                  console.error("Error storing user in the database:", err);
                  return done(err);
                }
                console.log("User data stored in the database:", email);
                console.log("google_Id stored in the database:", id);
                console.log("Username in the database:", displayName);
                return done(null, { id, email, displayName });
              });
            } else {
              // User exists, proceed with authentication
              return done(null, { id, email, displayName });
            }
          });
        } catch (error) {
          console.error("Error in verification:", error);
          return done(error);
        }
      }
    )
  );
  //--------------------------------------
  passport.use(
    new GoogleStrategy(
      {
        clientID: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        callbackURL: "YOUR_CALLBACK_URL",
      },
      (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile || !profile.id) {
            return done(new Error("Invalid profile data"));
          }
          const { id, displayName, emails } = profile;
          // Extract relevant data from the profile
          const email = emails[0].value;
  
          // Check if the user already exists in the database by Google ID
          const findUserQuery = "SELECT * FROM users WHERE google_Id = ?";
          pool.query(findUserQuery, [id], (err, result) => {
            if (err) {
              console.error("Error querying the database:", err);
              return done(err);
            }
  
            if (result.length === 0) {
              // User does not exist, create a new entry
              const insertUserQuery =
                "INSERT INTO users (google_Id, email, user_name) VALUES (?, ?, ?)";
              const values = [id, email, displayName];
              pool.query(insertUserQuery, values, (err) => {
                if (err) {
                  console.error("Error storing user in the database:", err);
                  return done(err);
                }
                console.log("User data stored in the database:", email);
                console.log("google_Id stored in the database:", id);
                console.log("Username in the database:", displayName);
                return done(null, { id, email, displayName });
              });
            } else {
              // User exists, proceed with authentication
              return done(null, { id, email, displayName });
            }
          });
        } catch (error) {
          console.error("Error in verification:", error);
          return done(error);
        }
      }
    )
  );

  //_________________________

  // Check if the user already exists in the database by Google ID
const findUserQuery = "SELECT * FROM users WHERE google_Id = ?";
pool.query(findUserQuery, [id], (err, result) => {
  if (err) {
    console.error("Error querying the database:", err);
    return done(err);
  }

  console.log("Query Result:", result); // Add this line to log the query result

  if (result.length === 0) {
    // ... rest of the code
  } else {
    // ... rest of the code
  }
});

  //_______________________________
  passport.use(
    new GoogleStrategy(
      {
        clientID: "your-client-id",
        clientSecret: "your-client-secret",
        callbackURL: "your-callback-url",
      },
      (accessToken, refreshToken, profile, done) => {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;
  
        // Check if the email already exists in the database
        const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
        pool.query(checkEmailQuery, [email], (err, result) => {
          if (err) {
            console.error("Error querying the database:", err);
            return done(err);
          }
  
          if (result.length > 0) {
            // User with the email already exists, retrieve user data
            const user = result[0];
            console.log("User already exists:", user);
            return done(null, user);
          } else {
            // User does not exist, insert into the database
            const insertUserQuery =
              "INSERT INTO users (user_name, email) VALUES (?, ?)";
            const values = [displayName, email];
            pool.query(insertUserQuery, values, (err) => {
              if (err) {
                console.error("Error inserting user into the database:", err);
                return done(err);
              }
  
              // Retrieve the inserted user data and pass it to done
              const insertedUserQuery = "SELECT * FROM users WHERE email = ?";
              pool.query(insertedUserQuery, [email], (err, result) => {
                if (err) {
                  console.error("Error retrieving inserted user:", err);
                  return done(err);
                }
                const insertedUser = result[0];
                return done(null, insertedUser);
              });
            });
          }
        });
      }
    )
  );
  
  
  <div class="spinner-container">
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>

    <div id="errorMessage" class="alert alert-danger" style="display: none;"></div>
    <h4 id="successMessage" class="text-center text-dark text-bg-info p-1 z-3 m-0" style="display: none;">"You have Logged in successfully...!"</h4>

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">User Dashboard</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <span class="nav-link text-light" id="username"></span>
                    </li>
                    <li class="nav-item">
                        <span class="nav-link text-light" id="email"></span>
                    </li>
                    <li class="nav-item">
                        <button id="logout-btn" type="button" class="btn btn-danger btn-sm">Logout</button>
                    </li>
                    <li class="nav-item">
                        <button id="abortButton" type="button" class="btn btn-danger btn-sm">ABORT</button>
                    </li>
                    <li class="nav-item ms-2">
                        <div class="timer card p-3 bg-danger-subtle" id="session-timer"></div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mx-auto position-absolute start-50 top-50 translate-middle">
        <div class="row justify-content-center mt-3">
            <div class="col-md-6">
                <div class="card p-3 mx-auto bg-danger-subtle">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg"
                        class="card-img-top" style="width: 50px;" alt="excel sheet">
                    <div class="card-body">
                        <button type="button" class="btn btn-primary m-2 position-absolute end-0 top-0 z-2 btn-sm" id="savedData">SAVED DATA</button>
                        <h5 class="card-title">Upload your file here</h5>
                        <p class="card-text">Note: Only upload files with a .csv file extension. After successfully uploading the data, click on the "Show" button to display your data.</p>
                        <h5 class="card-title">Click here to show the file content</h5>
                        <button type="button" class="btn btn-info m-2" id="showTable" onclick="showData()" style="display:none;">SHOW</button>
                        <form id="doc" enctype="multipart/form-data">
                            <div class="input-group mb-3">
                                <input type="file" class="form-control" name="csvFile" id="inputGroupFile03" multiple>
                                <button type="button" class="btn btn-success m-2" onclick="uploadFile(Id)" id="uploadFilebtn">UPLOAD</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div id="tableContainer" class="container mx-auto position-relative start-50 bottom-0 translate-middle-x" style="display: none;">
            <div class="row justify-content-center mt-3 mb-0">
                <div class="col-md-6">
                    <div class="card p-3 mx-auto bg-danger-subtle">
                        <div class="card-body">
                            <h5 class="card-title">Tables in Database</h5>
                            <div id="tableList" class="my-3"></div>
                            <div id="paginationContainer"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="popup-win" class="position-fixed start-0 top-0 w-100 h-100 overflow-auto" style="display: none;">
            <!-- ... content of popup window ... -->
        </div>
    </div>

    <div id="alertWindow" class="card position-absolute start-50 top-50 translate-middle shadow-sm border-4" style="display: none;">
        <!-- ... content of alert window ... -->
    </div>

    <div id="popup" class="position-fixed start-50 top-50 translate-middle text-center" style="display: none;">
        <p id="popup-message">Error message goes here</p>
        <button id="close-popup" class="btn btn-secondary mt-2">Close</button>
    </div>
  