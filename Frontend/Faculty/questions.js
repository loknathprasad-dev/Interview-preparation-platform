// Spring Boot REST API
const apiUrl = "http://localhost:8080/api/questions";

// Logged-in Faculty Details
const domainId = Number(sessionStorage.getItem("domainId"));
const facultyId = Number(sessionStorage.getItem("facultyId"));

// Question ID for updating
let editingQuestionId = null;


// Page Load
window.onload = function() {

    const userRole = sessionStorage.getItem("userRole");

    if (
        !sessionStorage.getItem("userId") ||
        !userRole ||
        userRole.toUpperCase() !== "FACULTY"
    ) {
        window.location.replace("../login.html");
        return;
    }

    if (!domainId || !facultyId) {
        alert("Faculty details not found. Please open Faculty Dashboard.");
        window.location.replace("dashboard.html");
        return;
    }

    loadQuestions();
};


// 1. VIEW QUESTIONS (GET)

function loadQuestions() {

    fetch(apiUrl + "/domain/" + domainId)

    .then(response => {

        if (!response.ok) {
            throw new Error("Failed to load questions");
        }

        return response.json();
    })

    .then(questions => {

        let table = document.getElementById("questionTable");

        table.innerHTML = "";

        // Show only questions added by logged-in faculty
        const facultyQuestions = questions.filter(question =>
            Number(question.facultyId) === facultyId
        );

        facultyQuestions.forEach(question => {

            let row = document.createElement("tr");

            let idCell = document.createElement("td");
            idCell.textContent = question.questionId;

            let questionCell = document.createElement("td");
            questionCell.textContent = question.questionText;

            let difficultyCell = document.createElement("td");
            difficultyCell.textContent = question.difficultyLevel;

            let typeCell = document.createElement("td");
            typeCell.textContent = question.questionType;

            let actionCell = document.createElement("td");

            // Edit Button
            let editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.onclick = function() {
                editQuestion(question);
            };

            // Delete Button
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.onclick = function() {
                deleteQuestion(question.questionId);
            };

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(idCell);
            row.appendChild(questionCell);
            row.appendChild(difficultyCell);
            row.appendChild(typeCell);
            row.appendChild(actionCell);

            table.appendChild(row);

        });

    })

    .catch(error => {
        console.log(error);
        alert("Questions load nahi hue!");
    });

}


// 2. ADD QUESTION (POST)

document.getElementById("questionForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let question = {

        domainId: domainId,
        facultyId: facultyId,

        difficultyLevel:
            document.getElementById("difficultyLevel").value,

        questionType:
            document.getElementById("questionType").value,

        questionText:
            document.getElementById("questionText").value

    };

    fetch(apiUrl, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(question)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Question save failed");
        }

        return response.json();
    })

    .then(data => {

        alert("Question Added Successfully!");

        resetForm();

        loadQuestions();

    })

    .catch(error => {

        console.log(error);

        alert("Question add nahi hua!");

    });

});


// 3. EDIT QUESTION

function editQuestion(question) {

    editingQuestionId = question.questionId;

    document.getElementById("difficultyLevel").value =
        question.difficultyLevel;

    document.getElementById("questionType").value =
        question.questionType;

    document.getElementById("questionText").value =
        question.questionText;

    document.getElementById("addButton").style.display = "none";

    document.getElementById("updateButton").style.display = "block";

    window.scrollTo(0, 0);

}


// 4. UPDATE QUESTION (PUT)

document.getElementById("updateButton").onclick = function() {

    if (editingQuestionId === null) {
        return;
    }

    let form = document.getElementById("questionForm");

    if (!form.reportValidity()) {
        return;
    }

    let question = {

        domainId: domainId,
        facultyId: facultyId,

        difficultyLevel:
            document.getElementById("difficultyLevel").value,

        questionType:
            document.getElementById("questionType").value,

        questionText:
            document.getElementById("questionText").value,

        status: "ACTIVE"

    };

    fetch(apiUrl + "/" + editingQuestionId, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(question)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Update failed");
        }

        return response.json();

    })

    .then(data => {

        alert("Question Updated Successfully!");

        resetForm();

        loadQuestions();

    })

    .catch(error => {

        console.log(error);

        alert("Question update nahi hua!");

    });

};


// 5. DELETE QUESTION (DELETE)

function deleteQuestion(questionId) {

    let confirmDelete = confirm(
        "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) {
        return;
    }

    fetch(apiUrl + "/" + questionId, {

        method: "DELETE"

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Question Deleted Successfully!");

        resetForm();

        loadQuestions();

    })

    .catch(error => {

        console.log(error);

        alert("Question delete nahi hua!");

    });

}


// 6. RESET FORM

function resetForm() {

    document.getElementById("questionForm").reset();

    document.getElementById("addButton").style.display = "block";

    document.getElementById("updateButton").style.display = "none";

    editingQuestionId = null;

}


// Reset Button

document.getElementById("resetButton").onclick = function() {

    resetForm();

};