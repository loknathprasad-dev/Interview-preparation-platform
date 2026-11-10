/* ADMIN PAGE: add, edit, list and delete faculty, and assign one domain each */

const API = 'http://localhost:8080/api';
const msg = document.getElementById('adminMsg');
const tbody = document.getElementById('facultyBody');
const editCard = document.getElementById('editCard');
const editTitle = document.getElementById('editTitle');
const editDomainChecks = document.getElementById('editDomainChecks');
const addDomainChecks = document.getElementById('addDomainChecks');

/* id of the faculty member being edited */
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

/* draw one radio button per domain; selectedId is pre-selected */
function renderChoices(container, allDomains, selectedId, groupName) {
  container.innerHTML = '';
  if (allDomains.length === 0) {
    container.textContent = 'No domains yet. Add domains first on the Domains page.';
    return;
  }
  allDomains.forEach(function (d) {
    const label = document.createElement('label');
    label.style.cssText = 'display:flex; align-items:center; gap:.5rem; font-weight:600; cursor:pointer; margin:0;';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = groupName;
    radio.value = d.id;
    radio.checked = (d.id === selectedId);
    radio.style.cssText = 'width:auto; margin:0;';
    const text = document.createElement('span');
    text.textContent = d.domainName;
    label.appendChild(radio);
    label.appendChild(text);
    container.appendChild(label);
  });
}

/* returns [id] of the selected radio, or [] if none */
function selectedIds(container) {
  const chosen = container.querySelector('input[type=radio]:checked');
  return chosen ? [parseInt(chosen.value, 10)] : [];
}

/* load all domains into the "Add Faculty" form */
async function loadAddFormDomains() {
  try {
    const res = await fetch(API + '/domains');
    const all = await res.json();
    renderChoices(addDomainChecks, all, null, 'addDomain');
  } catch (err) {
    addDomainChecks.textContent = 'Could not load domains. Is Spring Boot running?';
  }
}

/* load the faculty list together with their domain */
async function loadFaculty() {
  try {
    const res = await fetch(API + '/admin/faculty');
    const list = await res.json();

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No faculty added yet.</td></tr>';
      return;
    }

    const domainLists = await Promise.all(list.map(function (f) {
      return fetch(API + '/admin/faculty/' + f.userId + '/domains').then(function (r) { return r.json(); });
    }));

    tbody.innerHTML = '';
    list.forEach(function (f, i) {
      const mine = domainLists[i];
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' + (i + 1) + '</td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td><span class="status-pill">' + f.status + '</span></td>' +
        '<td><button class="del-btn">Edit</button> <button class="del-btn">Delete</button></td>';
      row.children[1].textContent = f.name;
      row.children[2].textContent = f.email;
      row.children[3].textContent = f.password;
      row.children[4].textContent = mine.length ? mine[0].domainName : 'Not assigned';

      const buttons = row.querySelectorAll('button');
      buttons[0].addEventListener('click', function () { openEdit(f, mine.length ? mine[0].id : null); });
      buttons[1].addEventListener('click', function () { deleteFaculty(f.userId, f.name); });
      tbody.appendChild(row);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-row">Could not load faculty. Is Spring Boot running?</td></tr>';
  }
}

/* add a new faculty member, then assign the chosen domain */
document.getElementById('facultyForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  showMsg('', 'Adding...');

  const email = document.getElementById('fEmail').value.trim();
  const domainIds = selectedIds(addDomainChecks);

  try {
    const res = await fetch(API + '/admin/faculty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('fName').value.trim(),
        email: email,
        password: document.getElementById('fPassword').value
      })
    });
    const data = await res.json();

    if (data.status === 'EMAIL_EXISTS') {
      showMsg('error', 'An account with this email already exists.');
      return;
    }
    if (data.status !== 'SUCCESS') {
      showMsg('error', 'Something went wrong. Please try again.');
      return;
    }

    /* find the new faculty member to get the id, then assign the domain */
    if (domainIds.length > 0) {
      const listRes = await fetch(API + '/admin/faculty');
      const list = await listRes.json();
      const created = list.find(function (f) { return f.email === email; });

      if (created) {
        const assignRes = await fetch(API + '/admin/faculty/' + created.userId + '/domains', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domainIds: domainIds })
        });
        if (!assignRes.ok) {
          showMsg('error', 'Faculty added, but the domain could not be assigned. Use Edit.');
          document.getElementById('facultyForm').reset();
          loadFaculty();
          return;
        }
      }
    }

    showMsg('ok', 'Faculty added successfully.');
    document.getElementById('facultyForm').reset();
    loadFaculty();
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
});

/* delete a faculty member */
async function deleteFaculty(id, name) {
  if (!confirm('Delete ' + name + '?')) return;

  try {
    const res = await fetch(API + '/admin/faculty/' + id, { method: 'DELETE' });
    const data = await res.json();
    if (data.status === 'SUCCESS') {
      showMsg('ok', 'Faculty deleted.');
      editCard.style.display = 'none';
      loadFaculty();
    } else {
      showMsg('error', 'Could not delete this faculty member.');
    }
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
}

/* open the edit panel for one faculty member */
async function openEdit(f, currentDomainId) {
  editingId = f.userId;
  editTitle.textContent = 'Edit Faculty: ' + f.name;
  document.getElementById('eName').value = f.name;
  document.getElementById('eEmail').value = f.email;
  document.getElementById('ePassword').value = f.password;
  editDomainChecks.innerHTML = 'Loading...';
  editCard.style.display = 'block';
  editCard.scrollIntoView({ behavior: 'smooth' });

  try {
    const res = await fetch(API + '/domains');
    const all = await res.json();
    renderChoices(editDomainChecks, all, currentDomainId, 'editDomain');
  } catch (err) {
    editDomainChecks.textContent = 'Could not load domains. Is Spring Boot running?';
  }
}

/* save name, email, password and domain */
document.getElementById('saveEdit').addEventListener('click', async function () {
  showMsg('', 'Saving...');

  try {
    const res = await fetch(API + '/admin/faculty/' + editingId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('eName').value.trim(),
        email: document.getElementById('eEmail').value.trim(),
        password: document.getElementById('ePassword').value
      })
    });
    const data = await res.json();

    if (data.status === 'EMAIL_EXISTS') {
      showMsg('error', 'Another account already uses this email.');
      return;
    }
    if (data.status === 'INVALID') {
      showMsg('error', 'Name and email are required, and the password needs at least 6 characters.');
      return;
    }
    if (data.status !== 'SUCCESS') {
      showMsg('error', 'Could not save the changes.');
      return;
    }

    const domRes = await fetch(API + '/admin/faculty/' + editingId + '/domains', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domainIds: selectedIds(editDomainChecks) })
    });
    if (!domRes.ok) {
      const domData = await domRes.json();
      showMsg('error', domData.message || 'Details saved, but the domain could not be saved.');
      loadFaculty();
      return;
    }

    showMsg('ok', 'Faculty updated.');
    editCard.style.display = 'none';
    loadFaculty();
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
});

document.getElementById('cancelEdit').addEventListener('click', function () {
  editCard.style.display = 'none';
});

loadAddFormDomains();
loadFaculty();