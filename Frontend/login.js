const loginForm = document.getElementById("loginForm");

const showPassword = document.getElementById("showPassword");
const passwordInput = document.getElementById("password");

// Show / Hide Password
showPassword.addEventListener("change", function () {

    if (showPassword.checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }

});

// Login
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = passwordInput.value;

    const loginData = {
        email: email,
        password: password
    };

    try {

        const response = await fetch("http://localhost:8080/loginUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            alert("Invalid Email or Password!");
            return;
        }

        const user = await response.json();

        // Store user details
        sessionStorage.setItem("userId", user.userId);
        sessionStorage.setItem("userName", user.name);
        sessionStorage.setItem("userRole", user.role);

        alert("Login Successful!");

        // Redirect according to role
        const role = user.role.toUpperCase();

        if (role === "ADMIN") {

            window.location.href = "admin/dashboard.html";

        } else if (role === "FACULTY") {

            window.location.href = "faculty/dashboard.html";

        } else if (role === "STUDENT") {

            window.location.href = "student/dashboard.html";

        } else {

            alert("Unknown user role!");

        }

    } catch (error) {

        alert("Cannot connect to server!");
        console.log(error);

    }

});