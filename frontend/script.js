// ========================================
// Backend API URL
// ========================================

// Replace this URL with your Codespace
// Port 3000 forwarded URL.
//
// Example:
// https://your-codespace-name-3000.app.github.dev/api/users

const API_URL =
  "https://super-garbanzo-7756xpr57wv7fx9jp-3000.app.github.dev/api/users";


// ========================================
// HTML Elements
// ========================================

const userForm = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");
const usersContainer = document.getElementById("users");
const loadUsersButton = document.getElementById("loadUsers");


// ========================================
// Add User
// ========================================

userForm.addEventListener("submit", async function (event) {

  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    showMessage("Please enter name and email.", "error");
    return;
  }

  try {

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name: name,
        email: email
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || "Failed to add user.", "error");
      return;
    }

    showMessage("User added successfully!", "success");

    // Clear inputs
    nameInput.value = "";
    emailInput.value = "";

    // Refresh users
    getUsers();

  } catch (error) {

    console.error(error);

    showMessage(
      "Cannot connect to backend. Make sure the server is running.",
      "error"
    );
  }

});


// ========================================
// Load Users Button
// ========================================

loadUsersButton.addEventListener("click", getUsers);


// ========================================
// Get Users
// ========================================

async function getUsers() {

  usersContainer.innerHTML =
    '<p class="empty">Loading users...</p>';

  try {

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch users.");
    }

    const users = await response.json();

    displayUsers(users);

  } catch (error) {

    console.error(error);

    usersContainer.innerHTML = `
      <p class="empty">
        Unable to connect to the backend.
      </p>
    `;
  }

}


// ========================================
// Display Users
// ========================================

function displayUsers(users) {

  usersContainer.innerHTML = "";

  if (users.length === 0) {

    usersContainer.innerHTML = `
      <p class="empty">
        No users found.
      </p>
    `;

    return;
  }

  users.forEach(function (user) {

    const userElement = document.createElement("div");

    userElement.className = "user";

    userElement.innerHTML = `
      <strong>${escapeHTML(user.name)}</strong>
      <span>${escapeHTML(user.email)}</span>
    `;

    usersContainer.appendChild(userElement);

  });

}


// ========================================
// Show Message
// ========================================

function showMessage(text, type) {

  message.textContent = text;

  if (type === "success") {
    message.style.color = "#16a34a";
  } else {
    message.style.color = "#dc2626";
  }

}


// ========================================
// Security Helper
// ========================================

function escapeHTML(value) {

  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}