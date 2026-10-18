// Backend URL
const API_URL = "http://localhost:8080/api/domains";

// Temporary Admin ID
const adminId = 1;

// HTML Elements
const domainForm = document.getElementById("domainForm");
const domainName = document.getElementById("domainName");
const description = document.getElementById("description");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const refreshButton = document.getElementById("refreshButton");

const domainsContainer = document.getElementById("domainsContainer");
const formTitle = document.getElementById("formTitle");

// Stores ID while editing
let editingDomainId = null;


// 1. Load domains when page opens
loadDomains();


// 2. Add or Update Domain
domainForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const domain = {
        domainName: domainName.value,
        description: description.value,
        createdBy: adminId
    };

    let url = API_URL;
    let method = "POST";

    if (editingDomainId !== null) {
        url = API_URL + "/" + editingDomainId;
        method = "PUT";
    }

    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(domain)
        });

        if (!response.ok) {
            throw new Error("Unable to save domain");
        }

        alert("Domain saved successfully!");

        resetForm();
        loadDomains();

    } catch (error) {
        alert(error.message);
    }

});


// 3. View All Domains
async function loadDomains() {

    domainsContainer.textContent = "Loading domains...";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load domains");
        }

        const domains = await response.json();

        domainsContainer.innerHTML = "";

        if (domains.length === 0) {
            domainsContainer.textContent = "No domains found.";
            return;
        }

        domains.forEach(function(domain) {

            const card = document.createElement("div");
            card.className = "domain-card";

            const title = document.createElement("h3");
            title.textContent = domain.domainName;

            const details = document.createElement("p");
            details.textContent = domain.description;

            const status = document.createElement("span");
            status.className = "status";
            status.textContent = domain.status;

            const actions = document.createElement("div");
            actions.className = "domain-actions";

            // Edit Button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-btn";

            editButton.addEventListener("click", function() {
                editDomain(domain);
            });

            // Delete Button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", function() {
                deleteDomain(domain.id);
            });

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            card.appendChild(title);
            card.appendChild(details);
            card.appendChild(status);
            card.appendChild(actions);

            domainsContainer.appendChild(card);

        });

    } catch (error) {
        domainsContainer.textContent = error.message;
    }
}


// 4. Edit Domain
function editDomain(domain) {

    editingDomainId = domain.id;

    domainName.value = domain.domainName;
    description.value = domain.description;

    formTitle.textContent = "Update Domain";
    submitButton.textContent = "Update Domain";

    cancelButton.style.display = "block";

    window.scrollTo(0, 0);
}


// 5. Delete Domain
async function deleteDomain(id) {

    const confirmation = confirm("Delete this domain?");

    if (confirmation === false) {
        return;
    }

    try {

        const response = await fetch(API_URL + "/" + id, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Unable to delete domain");
        }

        alert("Domain deleted successfully!");

        loadDomains();

    } catch (error) {
        alert(error.message);
    }
}


// 6. Reset Form
function resetForm() {

    domainForm.reset();

    editingDomainId = null;

    formTitle.textContent = "Add New Domain";
    submitButton.textContent = "Add Domain";

    cancelButton.style.display = "none";
}


// 7. Cancel Editing
cancelButton.addEventListener("click", function() {
    resetForm();
});


// 8. Refresh Domains
refreshButton.addEventListener("click", function() {
    loadDomains();
});