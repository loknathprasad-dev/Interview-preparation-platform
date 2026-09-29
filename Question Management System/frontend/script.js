const API_URL = "http://localhost:8080/api/questions";
const questionForm = document.getElementById("questionForm");
console.log(questionForm);

const questionInput = document.getElementById("question");
console.log(questionInput.value);

const addQuestionButton = document.getElementById("addQuestionButton");
console.log(addQuestionButton);

const domainInput = document.getElementById("domain");

const difficultyInput = document.getElementById("difficulty");

const questionTypeInput = document.getElementById("question_type");

const questionTable = document.getElementById("questionTable");
console.log(questionTable);

let editingRow = null;
const updateButton = document.getElementById("updateButton");
const resetButton = document.getElementById("resetButton");
console.log(addQuestionButton);
resetButton.addEventListener("click",
    function(){
        console.log("reset button checked");
        questionForm.reset();
    }
);
updateButton.addEventListener("click",
    function(){
        console.log("update button clicked");
        editingRow.cells[0].textContent = questionInput.value;
        editingRow.cells[1].textContent = domainInput.value;
        editingRow.cells[2].textContent = difficultyInput.value;
        editingRow.cells[3].textContent = questionTypeInput.value;
    }
);

questionForm.addEventListener("submit",
    function(event){
        event.preventDefault();
        if (questionInput.value.trim() ===""|| domainInput.value === ""||difficultyInput.value===""||questionTypeInput.value===""){
            alert("please fill all the fields");
            return;
        }

        console.log(questionInput.value);
        console.log(domainInput.value);
        console.log(difficultyInput.value);
        console.log(questionTypeInput.value);

        const questionData = {
            domainId: Number(domainInput.value),
            facultyId : 1,
            questionText: questionInput.value,
            difficultyLevel: difficultyInput.value,
            questionType: questionTypeInput.value
        };
        console.log(questionData);
        fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"},
                body:JSON.stringify(questionData)})
                .then(response=>response.json())
                .then(data=>{console.log("Question Saved:",data);})
                .catch(error=>{console.error("Error:",error);
                });
        
        const row = questionTable.insertRow();
        const questionCell = row.insertCell(0);
        const domainCell = row.insertCell(1);
        const difficultyCell = row.insertCell(2);
        const typeCell = row.insertCell(3);
        const actionCell = row.insertCell(4);

        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        actionCell.appendChild(viewButton);

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        actionCell.appendChild(deleteButton);

        deleteButton.addEventListener("click",
            function(){
                console.log("delete button clicked");
                row.remove();
            }
        );

        editButton.addEventListener("click",
            function(){
                console.log("edit button checked");
                editingRow = row;
                questionInput.value = questionData.question;
                domainInput.value = questionData.domain;
                difficultyInput.value = questionData.difficulty;
                questionTypeInput.value = questionData.questionType;
            }
        );

        viewButton.addEventListener("click",
            function(){
                alert(questionData.question);
            }
        );

        questionCell.textContent = questionData.questionText;
        domainCell.textContent = questionData.domainId;
        difficultyCell.textContent = questionData.difficultyLevel;
        typeCell.textContent = questionData.questionType;

    }
);