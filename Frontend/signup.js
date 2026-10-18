const signupForm = document.getElementById("signupForm");
const showPassword = document.getElementById("showPassword");

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Show / Hide Password
showPassword.addEventListener("change", function () {

    if (showPassword.checked) {
        passwordInput.type = "text";
        confirmPasswordInput.type = "text";
    } else {
        passwordInput.type = "password";
        confirmPasswordInput.type = "password";
    }

});

// Student Signup
signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Check Password
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters!");
        return;
    }

    const signupData = {
        name: name,
        email: email,
        password: password
    };

    try {

        const response = await fetch("http://localhost:8080/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signupData)
        });

        if (!response.ok) {
            const message = await response.text();
            alert(message || "Signup Failed!");
            return;
        }

        alert("Account Created Successfully! Please Login.");

        window.location.href = "login.html";

    } catch (error) {

        alert("Cannot connect to server!");
        console.log(error);

    }

});