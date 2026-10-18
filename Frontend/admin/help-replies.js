// Backend API URLs
const TICKET_API = "http://localhost:8080/api/help-tickets";
const REPLY_API = "http://localhost:8080/api/help-replies";

// Logged-in Admin Details
const adminId = Number(sessionStorage.getItem("userId"));
const userRole = sessionStorage.getItem("userRole");

// HTML Elements
const ticketsContainer = document.getElementById("ticketsContainer");
const repliesContainer = document.getElementById("repliesContainer");
const replyForm = document.getElementById("replyForm");
const ticketIdInput = document.getElementById("ticketId");
const replyTextInput = document.getElementById("replyText");
const message = document.getElementById("message");


// Page Load
document.addEventListener("DOMContentLoaded", function () {

    // Check Admin Login
    if (
        !adminId ||
        !userRole ||
        userRole.toUpperCase() !== "ADMIN"
    ) {
        window.location.replace("../login.html");
        return;
    }

    loadTickets();

});


// 1. Load All Help Tickets
async function loadTickets() {

    ticketsContainer.textContent = "Loading tickets...";

    try {

        const response = await fetch(TICKET_API);

        if (!response.ok) {
            throw new Error("Failed to load tickets");
        }

        const tickets = await response.json();

        ticketsContainer.innerHTML = "";

        if (tickets.length === 0) {
            ticketsContainer.textContent = "No help tickets found.";
            return;
        }

        tickets.forEach(ticket => {

            const card = document.createElement("div");
            card.className = "ticket-card";

            const title = document.createElement("h3");
            title.textContent = `Ticket #${ticket.ticketId}`;

            const subject = document.createElement("p");
            subject.textContent = `Subject: ${ticket.subject}`;

            const description = document.createElement("p");
            description.textContent = `Description: ${ticket.description}`;

            const status = document.createElement("p");
            status.textContent = `Status: ${ticket.status}`;

            const button = document.createElement("button");
            button.textContent = "View / Reply";

            button.addEventListener("click", () => {
                selectTicket(ticket.ticketId);
            });

            card.appendChild(title);
            card.appendChild(subject);
            card.appendChild(description);
            card.appendChild(status);
            card.appendChild(button);

            ticketsContainer.appendChild(card);

        });

    } catch (error) {

        ticketsContainer.textContent = "Error loading help tickets.";
        console.error(error);

    }
}


// 2. Select Ticket
function selectTicket(ticketId) {

    ticketIdInput.value = ticketId;

    message.textContent = "";

    loadReplies(ticketId);

    document.querySelector(".reply-section").scrollIntoView({
        behavior: "smooth"
    });
}


// 3. Load Replies By Ticket ID
async function loadReplies(ticketId) {

    repliesContainer.textContent = "Loading replies...";

    try {

        const response = await fetch(
            `${REPLY_API}/ticket/${ticketId}`
        );

        if (!response.ok) {
            throw new Error("Failed to load replies");
        }

        const replies = await response.json();

        repliesContainer.innerHTML = "";

        if (replies.length === 0) {
            repliesContainer.textContent = "No replies found for this ticket.";
            return;
        }

        replies.forEach(reply => {

            const card = document.createElement("div");
            card.className = "reply-card";

            const admin = document.createElement("p");
            admin.textContent = `Admin ID: ${reply.adminId}`;

            const replyText = document.createElement("p");
            replyText.textContent = `Reply: ${reply.replyText}`;

            const date = document.createElement("p");
            date.textContent = `Date: ${reply.createdAt}`;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete Reply";

            deleteButton.addEventListener("click", () => {
                deleteReply(reply.replyId, ticketId);
            });

            card.appendChild(admin);
            card.appendChild(replyText);
            card.appendChild(date);
            card.appendChild(deleteButton);

            repliesContainer.appendChild(card);

        });

    } catch (error) {

        repliesContainer.textContent = "Error loading replies.";
        console.error(error);

    }
}


// 4. Send Reply
replyForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const ticketId = Number(ticketIdInput.value);
    const replyText = replyTextInput.value.trim();

    if (!ticketId || !replyText) {
        message.textContent = "Please enter Ticket ID and reply.";
        return;
    }

    const replyData = {
        ticketId: ticketId,
        adminId: adminId,
        replyText: replyText
    };

    try {

        const response = await fetch(REPLY_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(replyData)
        });

        if (!response.ok) {
            throw new Error("Failed to send reply");
        }

        message.textContent = "Reply sent successfully!";
        message.style.color = "#22c55e";

        replyTextInput.value = "";

        loadReplies(ticketId);

    } catch (error) {

        message.textContent = "Error sending reply.";
        message.style.color = "#ef4444";

        console.error(error);

    }

});


// 5. Delete Reply
async function deleteReply(replyId, ticketId) {

    try {

        const response = await fetch(
            `${REPLY_API}/${replyId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete reply");
        }

        message.textContent = "Reply deleted successfully!";
        message.style.color = "#22c55e";

        loadReplies(ticketId);

    } catch (error) {

        message.textContent = "Error deleting reply.";
        message.style.color = "#ef4444";

        console.error(error);

    }
}


// 6. Ticket ID manually change hone par replies load karo
ticketIdInput.addEventListener("change", function () {

    const ticketId = Number(ticketIdInput.value);

    if (ticketId > 0) {
        loadReplies(ticketId);
    }

});