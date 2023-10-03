// This code will connect to the Node.js server and authenticate the user with LinkedIn.
function login() {
  // Get the client ID and client secret from the LinkedIn Developer Console.
  const clientID = "YOUR_CLIENT_ID";
  const clientSecret = "YOUR_CLIENT_SECRET";

  // Create a new LinkedIn OAuth 2.0 client.
  const linkedin = new window.LinkedIn(clientID, clientSecret);

  // Redirect the user to the LinkedIn login page.
  linkedin.authorize({
    scope: ["r_emailaddress", "r_liteprofile"],
    state: "some_random_string",
    redirectUri: "http://localhost:8080/auth/linkedin/callback",
  });
}

// Attach the login function to the onclick event of the button.
document.querySelector(".btn").addEventListener("click", login);
