const USERS_KEY = "trekplan_users";

const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const formError = document.getElementById("formError");


signupForm.addEventListener("submit", function(event) {

    // Stop page from refreshing
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;


    // Check password
    if (password !== confirmPassword) {

        formError.textContent = "Passwords do not match.";
        formError.style.display = "block";

        return;
    }


    // Get existing users
    const users = JSON.parse(
        localStorage.getItem(USERS_KEY)
    ) || [];


    // Check duplicate email
    const existingUser = users.find(function(user) {

        return user.email === email;

    });


    if (existingUser) {

        formError.textContent =
            "An account with this email already exists.";

        formError.style.display = "block";

        return;
    }


    // Create new user
    const newUser = {

        name: name,

        email: email,

        password: password

    };


    // Add user
    users.push(newUser);


    // Save users
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );


    // Success
    alert("Account created successfully!");


    // Go to login
    window.location.href = "login.html";

});