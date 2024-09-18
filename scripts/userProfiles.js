// Future Development

// document.addEventListener("DOMContentLoaded", () => {
//     const usersList = document.querySelector(".users-list");
//     const addUserButton = document.getElementById("add-user-button");
//     const userCount = document.getElementById("user-count");

//     const updateUserCount = () => {
//         const userItems = usersList.querySelectorAll(".user-item");
//         userCount.textContent = userItems.length;
//     };

//     const addUser = (userName) => {
//         const userId = `user-${userName.toLowerCase()}`;

//         // Add new user to the users list
//         const userItem = document.createElement("div");
//         userItem.className = "user-item";

//         const newUser = document.createElement("p");
//         newUser.id = userId;
//         newUser.textContent = userName;

//         const editButton = document.createElement("button");
//         editButton.className = "edit-user-button";
//         editButton.textContent = "Edit";
//         editButton.addEventListener("click", () => editUser(newUser));

//         const removeButton = document.createElement("button");
//         removeButton.className = "remove-user-button";
//         removeButton.textContent = "Remove";
//         removeButton.addEventListener("click", () => removeUser(userItem));

//         userItem.appendChild(newUser);
//         userItem.appendChild(editButton);
//         userItem.appendChild(removeButton);
//         usersList.appendChild(userItem);

//         // Update user count
//         updateUserCount();
//     };

//     const editUser = (userElement) => {
//         const newName = prompt("Edit user name:", userElement.textContent);
//         if (newName) {
//             userElement.textContent = newName;
//         }
//     };

//     const removeUser = (userItem) => {
//         usersList.removeChild(userItem);
//         updateUserCount();
//     };

//     addUserButton.addEventListener("click", () => {
//         const userName = prompt("Enter the name of the new user:");
//         if (userName) {
//             addUser(userName);
//         }
//     });

//     // Initial user count update
//     updateUserCount();
// });