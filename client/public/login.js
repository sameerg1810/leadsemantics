//verify the user with JWT ___________________________________________________________________________________
document.getElementById("loginForm");
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("login-password");

    const email = emailInput.value;
    const password = passwordInput.value;

    // Client-side validation (you can add more validation as needed)
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // Create a JSON object with the email and password
    const data = {
      email: email,
      password: password,
    };

    // Send a POST request to the server
    fetch(`/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send the data as JSON
    })
      .then((response) => {
        if (response.status === 200) {
          // Redirect to a success page or perform any necessary actions
          window.location.href = "/dashboard.html";
        } else {
          // Handle login errors, e.g., display an error message to the user
          console.error("Login failed.");

          document.getElementById("errorMessage").textContent = "Login failed.";
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        // Handle network or other errors here
      });
  });

// let reloaded = false;
window.onload = function () {
  const sessionStorage = window.sessionStorage || {};
  Object.keys(sessionStorage).forEach((key) => {
    if (key !== "__proto__") {
      delete sessionStorage[key];
    }
  });
};
// };

//LinkedIn login________________________________________________________________________________________________
function loginWithLinkedIn() {
  window.location.href = "/login/linkedin";
}
document.getElementById("login-linkedin").onclick = loginWithLinkedIn;
//   Google login button
document.addEventListener("DOMContentLoaded", function () {
  sessionStorage.clear();
  localStorage.clear();
  const googleButton = document.getElementById("gbutton");
  googleButton.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "/auth/google";
  });
  // Function to fetch user data after successful login
});

//ERROR MESSAGES________________________________________________________
const emailMessageElement = document.getElementById("errorMessage");
const urlParams = new URLSearchParams(window.location.search);
const emailError = urlParams.get("emailError");

if (emailError === "true") {
  emailMessageElement.style.display = "block";

  setTimeout(() => {
    emailMessageElement.style.display = "none";
  }, 4000);
}
// Getting success and error messages from server
const url = new URL(window.location.href);
const registrationSuccess = urlParams.get("success");
if (registrationSuccess) {
  document.getElementById("successMessage").style.display = "block";
  document.getElementById("regdiv").style.display = "none";
}
// Fetch error message from the URL and display it
const errorMessage = url.searchParams.get("error");

if (errorMessage) {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = errorMessage;
  errorMessageElement.style.display = "block";
}

// Show register form
document
  .getElementById("showRegisterForm")
  .addEventListener("click", function () {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("regdiv").style.display = "block";
  });

// Show login form
document.getElementById("showLoginForm").addEventListener("click", function () {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("regdiv").style.display = "none";
});

// Show password of login
const passwordInput = document.getElementById("login-password");
const showPasswordBtn = document.getElementById("shwPassword");

showPasswordBtn.addEventListener("click", () => {
  showPassword(passwordInput);
});
function showPassword(passwordInput) {
  const type = passwordInput.getAttribute("type");

  if (type === "password") {
    passwordInput.setAttribute("type", "text");
  } else {
    passwordInput.setAttribute("type", "password");
  }
}
// Session Timeout Message
// Session Timeout Message
const timeoutMessageElement = document.getElementById("timeoutMessage");
const sessionTimeoutMessage = urlParams.get("sessionTimeout");
// Display the session timeout message if present
if (sessionTimeoutMessage) {
  timeoutMessageElement.textContent = sessionTimeoutMessage;
  timeoutMessageElement.style.display = "block";
}
// Attach the session timeout handler to the window object
window.addEventListener("session-timeout", (event) => {
  const sessionTimeoutMessage = event.detail.message;
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
  })
    .then((res) => res.json()) // Parse the JSON response
    .then((data) => {
      console.log(data);
      // Display the session timeout message
      const sessionTimeoutMessage = data.sessionTimeoutMessage;
      timeoutMessageElement.textContent = sessionTimeoutMessage;
      timeoutMessageElement.style.display = "block";

      setTimeout(() => {
        timeoutMessageElement.style.display = "none";
      }, 5000);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });

  if (!isLoggedIn()) {
    window.location.href = "http://localhost:8080/";
  }
});

// Password validation--------------------------------------------------
function isValidPassword(password) {
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  return passwordRegex.test(password);
}
document.getElementById("regForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const passwordInput = document.getElementById("register-password");
  const password = passwordInput.value;
  if (!isValidPassword(password)) {
    const errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.textContent =
      "Password must have at least one uppercase letter,one symbol,one special charecter, and one number.";
    errorMessageElement.style.display = "block";
    return;
  }
  this.submit();
});

//Facebook handling
//   Facebook login button

const loginButton = document.getElementById("loginWithFacebook");

loginButton.addEventListener("click", () => {
  // Redirect the user to the Facebook authentication route
  window.location.href = "/auth/facebook";
});
