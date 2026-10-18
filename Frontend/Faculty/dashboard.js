const baseURL = "http://localhost:8080";

// Login Details
const userId = sessionStorage.getItem("userId");
const userRole = sessionStorage.getItem("userRole");

// Check Faculty Login
if (!userId || !userRole || userRole.toUpperCase() !== "FACULTY") {
    window.location.replace("../login.html");
} else {
    loadFacultyDetails();
}

// Load Logged-in Faculty Details
async function loadFacultyDetails() {

    try {
        // Get Faculty Records
        const facultyResponse = await fetch(baseURL + "/api/faculty");

        if (!facultyResponse.ok) {
            throw new Error("Failed to load faculty");
        }

        const facultyList = await facultyResponse.json();

        // Find Logged-in Faculty
        const faculty = facultyList.find(function (item) {
            return Number(item.userId) === Number(userId);
        });

        if (!faculty) {
            alert("Faculty details not found!");
            return;
        }

        // Save Faculty Details
        sessionStorage.setItem("facultyId", faculty.facultyId);
        sessionStorage.setItem("domainId", faculty.domainId);

        // Display Faculty Name
        const facultyName = document.getElementById("facultyName");

        if (facultyName) {
            facultyName.textContent = faculty.facultyName;
        }

        // Get Domain Details
        const domainResponse = await fetch(baseURL + "/api/domains");

        if (!domainResponse.ok) {
            throw new Error("Failed to load domains");
        }

        const domainList = await domainResponse.json();

        const domain = domainList.find(function (item) {
            return Number(item.id) === Number(faculty.domainId);
        });

        // Display Assigned Domain
        const assignedDomain = document.getElementById("assignedDomain");

        if (assignedDomain) {
            assignedDomain.textContent = domain
                ? domain.domainName
                : "Not Assigned";
        }

    } catch (error) {
        console.log("Faculty Dashboard Error:", error);
        alert("Failed to load faculty details!");
    }
}

// Logout
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        sessionStorage.clear();

        window.location.href = "../login.html";
    });

}