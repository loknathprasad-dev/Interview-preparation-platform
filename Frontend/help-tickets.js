const API_URL = "http://localhost:8080/api/help-tickets";
const REPLY_API = "http://localhost:8080/api/help-replies";

// Temporary user ID for testing
const userId = 1;

let editingTicketId = null;

const ticketForm = document.getElementById("ticketForm");
const subjectInput = document.getElementById("subject");
const descriptionInput = document.getElementById("description");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const refreshButton = document.getElementById("refreshButton");
const ticketsContainer = document.getElementById("ticketsContainer");

// Load tickets when page opens
loadTickets();


// 1. Submit or Update Ticket
ticketForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const ticket = {
        userId: userId,
        subject: subjectInput.value.trim(),
        description: descriptionInput.value.trim()
    };

    if (!ticket.subject || !ticket.description) {
        alert("Please fill all fields.");
        return;
    }

    try {

        let url = API_URL;
        let method = "POST";

        if (editingTicketId !== null) {
            url = API_URL + "/" + editingTicketId;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticket)
        });

        if (!response.ok) {
            throw new Error("Unable to save ticket");
        }

        if (editingTicketId === null) {
            alert("Ticket submitted successfully!");
        } else {
            alert("Ticket updated successfully!");
        }

        resetForm();
        loadTickets();

    } catch (error) {
        alert("Error: " + error.message);
    }
});


// 2. View Tickets
async function loadTickets() {

    ticketsContainer.innerHTML = "<p>Loading tickets...</p>";

    try {

        const response = await fetch(
            API_URL + "/user/" + userId
        );

        if (!response.ok) {
            throw new Error("Unable to load tickets");
        }

        const tickets = await response.json();

        ticketsContainer.innerHTML = "";

        if (tickets.length === 0) {
            ticketsContainer.textContent = "No tickets found.";
            return;
        }

        tickets.forEach(function(ticket) {

            const card = document.createElement("div");
            card.className = "ticket-card";

            // Ticket Subject
            const title = document.createElement("h3");
            title.textContent = ticket.subject;

            // Ticket Description
            const description = document.createElement("p");
            description.textContent = ticket.description;

            // Ticket ID
            const ticketId = document.createElement("p");
            ticketId.textContent = "Ticket ID: " + ticket.ticketId;

            // Ticket Status
            const status = document.createElement("span");
            status.className = "status";
            status.textContent = ticket.status;

            // Action Buttons Container
            const actions = document.createElement("div");
            actions.className = "ticket-actions";

            // Edit Button
            const editButton = document.createElement("button");
            editButton.className = "edit-btn";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function() {
                editTicket(ticket);
            });

            // Delete Button
            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-btn";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteTicket(ticket.ticketId);
            });

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            // Admin Replies Section
            const repliesSection = document.createElement("div");
            repliesSection.className = "admin-replies";

            const repliesHeading = document.createElement("h4");
            repliesHeading.textContent = "Admin Replies";

            const repliesContainer = document.createElement("div");
            repliesContainer.textContent = "Loading replies...";

            repliesSection.appendChild(repliesHeading);
            repliesSection.appendChild(repliesContainer);

            // Add Elements to Ticket Card
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(ticketId);
            card.appendChild(status);
            card.appendChild(repliesSection);
            card.appendChild(actions);

            // Initially hide buttons until replies are checked
            actions.style.display = "none";

            ticketsContainer.appendChild(card);

            // Load Replies and Control Edit/Delete Buttons
            loadAdminReplies(
                ticket.ticketId,
                repliesContainer,
                actions
            );
        });

    } catch (error) {

        ticketsContainer.textContent =
            "Error: " + error.message;
    }
}


// 3. Load Admin Replies
async function loadAdminReplies(ticketId, container, actions) {

    try {

        const response = await fetch(
            REPLY_API + "/ticket/" + ticketId
        );

        if (!response.ok) {
            throw new Error("Unable to load admin replies");
        }

        const replies = await response.json();

        container.innerHTML = "";

        // No admin reply yet
        if (replies.length === 0) {

            container.textContent = "No admin replies yet.";

            // Show Edit and Delete buttons
            actions.style.display = "";

            return;
        }

        // Admin has replied
        // Hide Edit and Delete buttons
        actions.style.display = "none";

        // If currently editing this ticket, reset form
        if (editingTicketId === ticketId) {
            resetForm();
        }

        // Display Admin Replies
        replies.forEach(function(reply) {

            const replyCard = document.createElement("div");
            replyCard.className = "admin-reply-card";

            const replyText = document.createElement("p");
            replyText.textContent = reply.replyText;

            const replyDate = document.createElement("small");

            if (reply.createdAt) {

                replyDate.textContent =
                    "Replied on: " +
                    new Date(reply.createdAt).toLocaleString();
            }

            replyCard.appendChild(replyText);
            replyCard.appendChild(replyDate);

            container.appendChild(replyCard);
        });

    } catch (error) {

        container.textContent = "Unable to load admin replies.";

        // Keep buttons hidden if reply status cannot be checked
        actions.style.display = "none";

        console.error(error);
    }
}


// 4. Edit Ticket
function editTicket(ticket) {

    editingTicketId = ticket.ticketId;

    subjectInput.value = ticket.subject;
    descriptionInput.value = ticket.description;

    submitButton.textContent = "Update Ticket";
    cancelButton.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// 5. Delete Ticket
async function deleteTicket(ticketId) {

    const confirmation = confirm(
        "Are you sure you want to delete this ticket?"
    );

    if (!confirmation) {
        return;
    }

    try {

        const response = await fetch(
            API_URL + "/" + ticketId,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to delete ticket");
        }

        alert("Ticket deleted successfully!");

        if (editingTicketId === ticketId) {
            resetForm();
        }

        loadTickets();

    } catch (error) {

        alert("Error: " + error.message);
    }
}


// 6. Reset Form
function resetForm() {

    ticketForm.reset();

    editingTicketId = null;

    submitButton.textContent = "Submit Ticket";
    cancelButton.style.display = "none";
}


// 7. Cancel Editing
cancelButton.addEventListener("click", function() {

    resetForm();
});


// 8. Refresh Tickets
refreshButton.addEventListener("click", function() {

    loadTickets();
});