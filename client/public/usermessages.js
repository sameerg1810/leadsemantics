//displaying the notification window for user from admin___________________
const userNoteWin = document.getElementById("userNotes");
const userNoteBtn = document.getElementById("notifyBtn");

userNoteBtn.addEventListener("click", () => {
  if (userNoteWin.style.display !== "block") {
    userNoteWin.style.display = "block";
    userNoteBtn.style.backgroundColor = "green";
    console.log("this click event worked userNoteWin", userNoteWin);
  } else {
    userNoteWin.style.display = "none";
    userNoteBtn.style.backgroundColor = "rgb(23, 162, 184)";
    console.log("this click event worked userNoteWin", userNoteWin);
  }
});

async function fetchAndRenderNotifications() {
  try {
    const response = await fetch(`/getUserNotifications`);
    const data = await response.json();

    if (data.error) {
      console.error("Error fetching user notifications:", data.error);
      return;
    }

    const notificationCards = document.getElementById("notificationCards");

    // Loop through the retrieved data and create cards for each notification
    data.forEach((notification) => {
      const card = document.createElement("div");
      card.classList.add("col-md-12", "mb-3");

      card.innerHTML = `
          <div class="card fs-6 p-0 w-100">
            <div class="card-body h-25">
              <h5 class="card-title fs-6 p-0">${notification.file_name}</h5>
              <p class="card-text p-0">${notification.message}</p>
              <p class="card-text p-0"><small class="text-muted">User ID: ${notification.user_id}</small></p>
            </div>
          </div>
        `;

      notificationCards.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching and rendering notifications:", error);
  }
}

// Call the function to fetch and render notifications when the page loads
window.addEventListener("DOMContentLoaded", fetchAndRenderNotifications);
