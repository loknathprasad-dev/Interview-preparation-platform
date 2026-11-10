/* QUESTIONS PAGE (faculty): add, list, edit and delete questions of my own domain */

const API = 'http://localhost:8080/api';
const email = localStorage.getItem('userEmail') || '';

const domainLine = document.getElementById('domainLine');
const formCard = document.getElementById('formCard');
const formTitle = document.getElementById('formTitle');
const form = document.getElementById('qForm');
const textBox = document.getElementById('qText');
const statusRow = document.getElementById('statusRow');
const statusBox = document.getElementById('qStatus');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelEdit');
const msg = document.getElementById('adminMsg');
const tbody = document.getElementById('qBody');

/* id of the question being edited (null means we are adding) */
let editingId = null;

/* only a logged-in faculty member may see this page */
if (localStorage.getItem('userRole') !== 'FACULTY') {
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'login.html';
});

function showMsg(type, text) {
  msg.className = 'auth-msg ' + type;
  msg.textContent = text;
}

/* put the form back into "add" mode */
function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = 'Add New Question';
  saveBtn.textContent = 'Add Question';
  statusRow.style.display = 'none';
  cancelBtn.style.display = 'none';
}

/* show which domain this faculty member manages */
async function loadDomain() {
  try {
    const res = await fetch(API + '/faculty/domains?email=' + encodeURIComponent(email));
    const list = await res.json();
    if (!res.ok || list.length === 0) {
      domainLine.textContent = 'No domain has been assigned to you yet. Please contact the admin.';
      tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No domain assigned.</td></tr>';
      return false;
    }
    domainLine.textContent = 'Domain: ' + list[0].domainName;
    formCard.style.display = 'block';
    return true;
  } catch (err) {
    domainLine.textContent = 'Could not load your domain. Is Spring Boot running?';
    return false;
  }
}

async function loadQuestions() {
  try {
    const res = await fetch(API + '/questions/mine?email=' + encodeURIComponent(email));
    const list = await res.json();

    if (!res.ok) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-row"></td></tr>';
      tbody.querySelector('td').textContent = list.message || 'Could not load questions.';
      return;
    }
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No questions added yet.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    list.forEach(function (q, i) {
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' + (i + 1) + '</td>' +
        '<td></td>' +
        '<td><span class="status-pill"></span></td>' +
        '<td><button class="del-btn">Edit</button> <button class="del-btn">Delete</button></td>';
      row.children[1].textContent = q.questionText;
      row.querySelector('.status-pill').textContent = q.status;

      const buttons = row.querySelectorAll('button');
      buttons[0].addEventListener('click', function () { startEdit(q); });
      buttons[1].addEventListener('click', function () { deleteQuestion(q.questionId); });
      tbody.appendChild(row);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">Could not load questions. Is Spring Boot running?</td></tr>';
  }
}

/* fill the form with the question to edit */
function startEdit(q) {
  editingId = q.questionId;
  textBox.value = q.questionText;
  statusBox.value = q.status;
  formTitle.textContent = 'Edit Question';
  saveBtn.textContent = 'Save Changes';
  statusRow.style.display = 'block';
  cancelBtn.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

cancelBtn.addEventListener('click', function () {
  resetForm();
  showMsg('', '');
});

/* add or update */
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  showMsg('', 'Saving...');

  const isAdd = editingId === null;
  const url = API + '/questions' + (isAdd ? '' : '/' + editingId) + '?email=' + encodeURIComponent(email);
  const body = { questionText: textBox.value.trim() };
  if (!isAdd) body.status = statusBox.value;

  try {
    const res = await fetch(url, {
      method: isAdd ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (res.ok) {
      showMsg('ok', isAdd ? 'Question added.' : 'Question updated.');
      resetForm();
      loadQuestions();
    } else {
      showMsg('error', data.message || 'Something went wrong.');
    }
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
});

async function deleteQuestion(id) {
  if (!confirm('Delete this question?')) return;

  try {
    const res = await fetch(API + '/questions/' + id + '?email=' + encodeURIComponent(email), { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.status === 'SUCCESS') {
      showMsg('ok', 'Question deleted.');
      if (editingId === id) resetForm();
      loadQuestions();
    } else {
      showMsg('error', data.message || 'Could not delete this question.');
    }
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
}

loadDomain().then(function (ok) {
  if (ok) loadQuestions();
});