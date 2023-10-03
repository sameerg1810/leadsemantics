const data2 = {
  State: [
    "Name",
    "Telangana",
    "Andhra_Pradesh",
    "Uttarakhand",
    "Haryana",
    "Punjab",
  ],
  Questions: {
    Telangana: [
      "What is Telangana language",
      "What is the Telangana Geography",
      "Who is Telangana cheif Minister",
      "What is Telangana GDP",
      "Whatis Telangana Population",
    ],
    Andhra_Pradesh: [
      "What is Andhra Pradesh language",
      "What is the Andhra Pradesh Geography",
      "Who is Andhra Pradesh cheif Minister",
      "What is Andhra Pradesh GDP",
      "What is Andhra Pradesh Population",
    ],
    Uttarakhand: [
      "What is Uttarakhand language",
      "What is the Uttarakhand Geography",
      "Who is Uttarakhand cheif Minister",
      "What is Uttarakhand GDP",
      "What is Uttarakhand Population",
    ],
    Haryana: [
      "What is Haryana language",
      "What is the Haryana Geography",
      "Who is Haryana cheif Minister",
      "What is Haryana GDP",
      "What is Haryana Population",
    ],
    Punjab: [
      "What is Punjab language",
      "What is the Punjab Geography",
      "Who is Punjab cheif Minister",
      "What is Punjab GDP",
      "What is Punjab Population",
    ],
  },
};

const searchBtn = document.getElementById("search-bar"); //this is button in user profile on click it will give you states
const statePop = document.getElementById("state-Drop"); //this popup will comes after clicking search-bar button ("searchBtn")
const searchPop = document.getElementById("search-Pop"); //this popup will gives you search input field after clicking the ("selecting the State from statePopup")
const selectState = document.querySelectorAll(".State"); //this is the option from state drop down button
const dropdownButton = document.getElementById("dropdownButton"); //these are dropdownButton in UI
const dropdownList = document.getElementById("dropdownList"); //this is list in which  we fill the state names
const uploadWindow = document.getElementById("upload-win"); //this is background div that is objecting the search bar in UI
const searchInput = document.getElementById("datatable-search-input"); // this is input field for search to clear and give inputs
const searchSuggestions = document.getElementById("search-suggestions"); //these are suggestion box to render the data coming from backend
const mainContianer = document.getElementById("main"); // the background container
let matchingSuggestions;
console.log("the search button inside profile dropdown", searchBtn);
console.log(
  "the state Dropdown button appears after search button is clicked",
  statePop
);
console.log("the search input that comes after selecting a state", searchPop);
console.log("the dropdownbutton to slect the state", dropdownButton);
console.log("the search button inside profile dropdown", searchBtn);
console.log("the search button inside profile dropdown", searchBtn);

searchBtn.addEventListener("click", function () {
  dropdownButton.innerText = "Select a State";
  console.log("Dropdown displayed");
  if (statePop.style.display === "none") {
    uploadWindow.style.opacity = 0.2;
    statePop.style.display = "block";
  } else {
    statePop.style.display = "none";
    uploadWindow.style.opacity = 1;
  }
});

// This function Displays the searchBar input field in the UI when selectState button is clicked in the drop-down menu of States
for (let state of selectState) {
  state.addEventListener("click", function () {
    console.log("Search Displayed");
    if (searchPop.style.display === "none") {
      searchPop.style.display = "block";
      uploadWindow.style.opacity = 0.2;
    } else {
      searchPop.style.display = "none";
      uploadWindow.style.opacity = 1;
    }
  });
}
dropdownButton.addEventListener("change", () => {
  uploadWindow.style.opacity = 0.9;
});
// Dropdown menu
dropdownButton.addEventListener("click", () => {
  if (
    dropdownList.style.display === "none" ||
    dropdownList.style.display === ""
  ) {
    dropdownList.style.display = "block";
  } else {
    dropdownList.style.display = "none";
  }
});

// Close the dropdown when clicking outside of it
window.addEventListener("click", (event) => {
  if (
    !dropdownButton.contains(event.target) &&
    !dropdownList.contains(event.target)
  ) {
    dropdownList.style.display = "none";
  }
});

//click on outside to display:none the popups
mainContianer.addEventListener("click", function () {
  statePop.style.display = "none";
  searchPop.style.display = "none";
  uploadWindow.style.opacity = 1;
  searchInput.value = "";
});
// Handle item selection and show search suggestions
const dropdownItems = document.querySelectorAll(".dropdown-item.State");
dropdownItems.forEach((item) => {
  item.addEventListener("click", async () => {
    searchSuggestions.innerHTML = "<p>Loading suggestions...</p>";
    uploadWindow.style.opacity = 0.2;
    dropdownButton.textContent = item.textContent;
    dropdownList.style.display = "none";
    searchPop.style.display = "block";

    // Get the selected state's questions and display as suggestions
    const selectedState = item.textContent;
    console.log(`Selected state: ${selectedState}`);
  });
});

// Render search suggestions
// function renderSearchSuggestions(suggestions) {
//   uploadWindow.style.opacity = 0.2;
//   searchSuggestions.innerHTML = "";
//   if (searchInput === "" || dropdownButton.textContent === "") {
//     uploadWindow.style.opacity = 0.2;
//     searchSuggestions.innerHTML = "";
//   } else if (suggestions.length === 0) {
//     searchSuggestions.innerHTML =
//       "<p>No suggestions available for this state.</p>";
//   } else {
//     const ul = document.createElement("ul");
//     suggestions.forEach((suggestion) => {
//       const li = document.createElement("li");
//       li.style.cursor = "default";
//       li.textContent = suggestion;
//       li.addEventListener("click", () => {
//         const Value = li.textContent;
//         searchInput.value = Value;
//         searchSuggestions.innerHTML = "";
//       });
//       ul.appendChild(li);
//     });
//     searchSuggestions.appendChild(ul);
//   }
// }

//search inputs ________________________________
searchInput.addEventListener("input", async () => {
  searchSuggestions.style.display = "block";
  uploadWindow.style.opacity = 0.2;
  console.log("upload Window opacity decreased to 0.2");
  console.log("search input clicked");
  if (searchInput === "" || dropdownButton.textContent === "") {
    searchSuggestions.innerHTML = "";
    renderSearchSuggestions([]);
  } else {
    const searchText = searchInput.value.toLowerCase();
    const selectedState = dropdownButton.textContent;
    try {
      // Fetch suggestions for the selected state and await the promise
      const suggestions = await fetchData(selectedState);
      console.log("the data from fetchData", suggestions);
      matchingSuggestions = suggestions.filter((suggestion) => {
        suggestion.question.includes(searchText);
        // suggestion.toLowerCase().includes(searchText);
      });
      renderSearchSuggestions(matchingSuggestions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});

// Add a keyup event listener to the search input element
searchInput.addEventListener("keyup", (event) => {
  uploadWindow.style.opacity = 0.2;
  if (event.code === "Backspace") {
    // Check if the search input value is empty
    if (searchInput.value === "") {
      // Clear the suggestion box
      renderSearchSuggestions([]);
      searchSuggestions.innerHTML = "";
      searchSuggestions.style.display = "none";
    }
  }
});

async function fetchData(selectedState) {
  console.log("line 201 getting search data from server");
  try {
    const response = await fetch(`/stateQuestions?state=${selectedState}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json(); // Await the JSON parsing
    console.log("you got search suggestions", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Function to render the fetched data as suggestions-----------------------------------------
let timeoutId;

async function renderSearchSuggestions(matchedSuggestions) {
  const selectedState = dropdownButton.textContent;
  searchSuggestions.innerHTML = "<p>Fetching suggestions...</p>";

  try {
    const suggestions = await fetchData(selectedState);

    // Check if there are suggestions to display
    if (suggestions.length === 0) {
      searchSuggestions.innerHTML = "<p>No suggestions available.</p>";
    } else {
      const ul = document.createElement("ul");
      ul.setAttribute("role", "listbox"); // For accessibility

      suggestions.forEach((suggestion, index) => {
        const li = document.createElement("li");
        li.style.cursor = "pointer";
        li.setAttribute("role", "option"); // For accessibility
        li.id = `suggestion-${index}`; // For keyboard navigation

        const suggestionText = suggestion.question;

        // Highlight the matching text
        const searchText = searchInput.value.toLowerCase();
        const matchIndex = suggestionText.toLowerCase().indexOf(searchText);
        if (matchIndex !== -1) {
          const beforeMatch = suggestionText.substring(0, matchIndex);
          const matchedText = suggestionText.substring(
            matchIndex,
            matchIndex + searchText.length
          );
          const afterMatch = suggestionText.substring(
            matchIndex + searchText.length
          );

          // Use innerHTML to apply the HTML formatting for highlighting
          li.innerHTML = `${beforeMatch}<span class="match">${matchedText}</span><span class="no-match">${afterMatch}</span>`;
          li.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
          });
        } else {
          li.textContent = suggestionText;
        }

        li.addEventListener("click", () => {
          const value = suggestionText;
          searchInput.value = value;
          searchSuggestions.innerHTML = "";
        });

        ul.appendChild(li);
      });

      // Clear existing suggestions and append the updated list
      searchSuggestions.innerHTML = "";
      searchSuggestions.style.opacity = 0.85;
      searchSuggestions.appendChild(ul);
    }
  } catch (error) {
    searchSuggestions.innerHTML =
      "<p>Sorry, there was an error fetching the suggestions. Please try again later.</p>";
  }
}

// Add keyboard navigation
searchInput.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowDown":
      break;
    case "ArrowUp":
      break;
    case "Enter":
      break;
  }
});
