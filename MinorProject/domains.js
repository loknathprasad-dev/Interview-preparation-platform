/* DOMAINS PAGE (admin): add, list, edit and delete domains */

const API = 'http://localhost:8080/api/domains';
const msg = document.getElementById('adminMsg');
const tbody = document.getElementById('domainBody');
const form = document.getElementById('domainForm');
const nameBox = document.getElementById('dName');
const descBox = document.getElementById('dDesc');
const saveBtn = document.getElementById('saveBtn');
const formTitle = document.getElementById('formTitle');

/* id of the domain being edited (null means we are adding) */
let editingId = null;

/* only a logged-in admin may see this page */
if (localStorage.getItem('userRole') !== 'ADMIN') {
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
  formTitle.textContent = 'Add New Domain';
  saveBtn.textContent = 'Add Domain';
}

async function loadDomains() {
  try {
    const res = await fetch(API);
    const list = await res.json();

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-row">No domains added yet.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    list.forEach(function (d, i) {
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' + (i + 1) + '</td>' +
        '<td></td>' +
        '<td></td>' +
        '<td><button class="del-btn edit-btn">Edit</button> <button class="del-btn">Delete</button></td>';
      row.children[1].textContent = d.domainName;
      row.children[2].textContent = d.description || '';

      const buttons = row.querySelectorAll('button');
      buttons[0].addEventListener('click', function () { startEdit(d); });
      buttons[1].addEventListener('click', function () { deleteDomain(d.id, d.domainName); });
      tbody.appendChild(row);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">Could not load domains. Is Spring Boot running?</td></tr>';
  }
}

/* fill the form with the domain to edit */
function startEdit(d) {
  editingId = d.id;
  nameBox.value = d.domainName;
  descBox.value = d.description || '';
  formTitle.textContent = 'Edit Domain';
  saveBtn.textContent = 'Save Changes';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* add or update */
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  showMsg('', 'Saving...');

  const url = editingId === null ? API : API + '/' + editingId;
  const method = editingId === null ? 'POST' : 'PUT';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domainName: nameBox.value.trim(),
        description: descBox.value.trim()
      })
    });
    const data = await res.json();

    if (res.ok) {
      showMsg('ok', editingId === null ? 'Domain added.' : 'Domain updated.');
      resetForm();
      loadDomains();
    } else {
      showMsg('error', data.message || 'Something went wrong.');
    }
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
});

async function deleteDomain(id, name) {
  if (!confirm('Delete ' + name + '?')) return;

  try {
    const res = await fetch(API + '/' + id, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok && data.status === 'SUCCESS') {
      showMsg('ok', 'Domain deleted.');
      loadDomains();
    } else {
      showMsg('error', data.message || 'Could not delete this domain.');
    }
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
}

loadDomains();