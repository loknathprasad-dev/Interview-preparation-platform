const baseURL = "http://localhost:8080";

const facultyForm = document.getElementById("facultyForm");
const formSection = document.getElementById("facultyFormSection");
const tableBody = document.getElementById("facultyTableBody");

let facultyList = [];
let domainList = [];

// Check Admin Login
const userRole = sessionStorage.getItem("userRole");

if (!userRole || userRole.toUpperCase() !== "ADMIN") {
    window.location.replace("../login.html");
} else {
    loadData();
}

// Load Domains First, Then Faculty
async function loadData() {
    await loadDomains();
    await loadFaculty();
}

// Show Add Faculty Form
document.getElementById("showFormButton").addEventListener("click", function () {

    facultyForm.reset();

    document.getElementById("facultyId").value = "";

    document.getElementById("formTitle").textContent = "Add New Faculty";
    document.getElementById("saveButton").textContent = "Save Faculty";

    document.getElementById("passwordGroup").style.display = "block";
    document.getElementById("facultyPassword").required = true;

    document.getElementById("statusGroup").style.display = "none";

    formSection.style.display = "block";
});

// Cancel Form
document.getElementById("cancelButton").addEventListener("click", function () {

    facultyForm.reset();
    formSection.style.display = "none";
});

// Load Domains
async function loadDomains() {

    try {
        const response = await fetch(baseURL + "/api/domains");

        if (!response.ok) {
            throw new Error("Failed to load domains");
        }

        domainList = await response.json();

        const domainDropdown = document.getElementById("domainId");

        domainDropdown.innerHTML = '<option value="">Select Domain</option>';

        domainList.forEach(function (domain) {

            if (domain.status?.toUpperCase() === "ACTIVE") {

                const option = document.createElement("option");

                option.value = domain.id;
                option.textContent = domain.domainName;

                domainDropdown.appendChild(option);
            }
        });

    } catch (error) {
        console.log("Domain Error:", error);
        alert("Failed to load domains!");
    }
}

// Load Faculty
async function loadFaculty() {

    try {
        const response = await fetch(baseURL + "/api/faculty");

        if (!response.ok) {
            throw new Error("Failed to load faculty");
        }

        facultyList = await response.json();

        displayFaculty();

    } catch (error) {
        console.log("Faculty Error:", error);

        tableBody.innerHTML =
            '<tr><td colspan="7">Failed to load faculty!</td></tr>';
    }
}

// Display Faculty Table
function displayFaculty() {

    tableBody.innerHTML = "";

    document.getElementById("facultyCount").textContent =
        "Total Faculty: " + facultyList.length;

    if (facultyList.length === 0) {

        tableBody.innerHTML =
            '<tr><td colspan="7">No faculty found.</td></tr>';

        return;
    }

    facultyList.forEach(function (faculty) {

        let domainName = "Not Assigned";

        const domain = domainList.find(function (item) {
            return Number(item.id) === Number(faculty.domainId);
        });

        if (domain) {
            domainName = domain.domainName;
        }

        const row = document.createElement("tr");

        const values = [
            faculty.facultyId,
            faculty.employeeId,
            faculty.facultyName,
            faculty.email,
            domainName,
            faculty.status
        ];

        values.forEach(function (value) {

            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function () {
            editFaculty(faculty.facultyId);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteFaculty(faculty.facultyId);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        tableBody.appendChild(row);
    });
}

// Edit Faculty
function editFaculty(facultyId) {

    const faculty = facultyList.find(function (item) {
        return Number(item.facultyId) === Number(facultyId);
    });

    if (!faculty) {
        alert("Faculty not found!");
        return;
    }

    document.getElementById("facultyId").value = faculty.facultyId;
    document.getElementById("facultyName").value = faculty.facultyName;
    document.getElementById("employeeId").value = faculty.employeeId;
    document.getElementById("facultyEmail").value = faculty.email;
    document.getElementById("domainId").value = faculty.domainId;
    document.getElementById("facultyStatus").value = faculty.status;

    document.getElementById("passwordGroup").style.display = "none";
    document.getElementById("facultyPassword").required = false;

    document.getElementById("statusGroup").style.display = "block";

    document.getElementById("formTitle").textContent = "Edit Faculty";
    document.getElementById("saveButton").textContent = "Update Faculty";

    formSection.style.display = "block";

    window.scrollTo(0, 0);
}

// Add or Update Faculty
facultyForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const facultyId = document.getElementById("facultyId").value;

    const facultyName = document.getElementById("facultyName").value.trim();
    const employeeId = document.getElementById("employeeId").value.trim();
    const email = document.getElementById("facultyEmail").value.trim();

    const domainId = Number(document.getElementById("domainId").value);
    const status = document.getElementById("facultyStatus").value;

    const saveButton = document.getElementById("saveButton");

    let url;
    let method;
    let facultyData;

    // Add New Faculty
    if (facultyId === "") {

        const password = document.getElementById("facultyPassword").value;

        if (password.length < 8) {
            alert("Password must be at least 8 characters!");
            return;
        }

        url = baseURL + "/api/admin/faculty/create";
        method = "POST";

        facultyData = {
            facultyName: facultyName,
            employeeId: employeeId,
            email: email,
            password: password,
            domainId: domainId
        };

    } else {

        // Update Existing Faculty
        url = baseURL + "/api/faculty/" + facultyId;
        method = "PUT";

        facultyData = {
            facultyName: facultyName,
            employeeId: employeeId,
            email: email,
            domainId: domainId,
            status: status
        };
    }

    try {

        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(facultyData)
        });

        if (!response.ok) {
            const message = await response.text();
            alert(message || "Failed to save faculty!");
            return;
        }

        if (facultyId === "") {
            alert("Faculty Account Created Successfully!");
        } else {
            alert("Faculty Updated Successfully!");
        }

        facultyForm.reset();
        formSection.style.display = "none";

        await loadFaculty();

    } catch (error) {

        console.log("Save Faculty Error:", error);
        alert("Cannot connect to server!");

    } finally {

        saveButton.disabled = false;

        saveButton.textContent =
            facultyId === "" ? "Save Faculty" : "Update Faculty";
    }
});

// Delete Faculty
async function deleteFaculty(facultyId) {

    const confirmation = confirm(
        "Are you sure you want to delete this faculty?"
    );

    if (!confirmation) {
        return;
    }

    try {

        const response = await fetch(
            baseURL + "/api/faculty/" + facultyId,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete faculty");
        }

        alert("Faculty Deleted Successfully!");

        await loadFaculty();

    } catch (error) {

        console.log("Delete Faculty Error:", error);
        alert("Failed to delete faculty!");
    }
}

// Logout
document.getElementById("logoutButton").addEventListener("click", function () {

    sessionStorage.clear();

    window.location.href = "../login.html";
});