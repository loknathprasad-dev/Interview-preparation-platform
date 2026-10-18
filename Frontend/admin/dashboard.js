// Backend API URL
const baseURL = "http://localhost:8080";

// Admin Name
const adminName = sessionStorage.getItem("userName");
const userRole = sessionStorage.getItem("userRole");

// Check Admin Login
if (!adminName || userRole?.toUpperCase() !== "ADMIN") {
    window.location.replace("../login.html");
} else {

    document.getElementById("adminName").textContent = adminName;

    // Load Dashboard Statistics
    loadDashboard();
}

// Load All Statistics
async function loadDashboard() {

    // Total Domains
    try {
        const response = await fetch(baseURL + "/api/domains");

        if (!response.ok) {
            throw new Error("Failed to load domains");
        }

        const domains = await response.json();

        document.getElementById("totalDomains").textContent = domains.length;

    } catch (error) {
        console.log("Domain Error:", error);
        document.getElementById("totalDomains").textContent = "Error";
    }

    // Total Faculty
    try {
        const response = await fetch(baseURL + "/api/faculty");

        if (!response.ok) {
            throw new Error("Failed to load faculty");
        }

        const faculty = await response.json();

        document.getElementById("totalFaculty").textContent = faculty.length;

    } catch (error) {
        console.log("Faculty Error:", error);
        document.getElementById("totalFaculty").textContent = "Error";
    }

    // Total Help Tickets
    try {
        const response = await fetch(baseURL + "/api/help-tickets");

        if (!response.ok) {
            throw new Error("Failed to load tickets");
        }

        const tickets = await response.json();

        document.getElementById("totalTickets").textContent = tickets.length;

        // Count Pending Tickets
        let pendingCount = 0;

        tickets.forEach(function (ticket) {

            if (ticket.status?.toUpperCase() === "PENDING") {
                pendingCount++;
            }

        });

        document.getElementById("pendingTickets").textContent = pendingCount;

    } catch (error) {
        console.log("Ticket Error:", error);

        document.getElementById("totalTickets").textContent = "Error";
        document.getElementById("pendingTickets").textContent = "Error";
    }

}

// Logout
document.getElementById("logoutButton").addEventListener("click", function () {

    sessionStorage.clear();

    alert("Logged Out Successfully!");

    window.location.href = "../login.html";

});