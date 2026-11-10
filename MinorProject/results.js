/* RESULTS PAGE (student): my tests and marks */

const API = 'http://localhost:8080/api/results';
const email = localStorage.getItem('userEmail') || '';

const msg = document.getElementById('msg');
const tbody = document.getElementById('resultBody');
const detailCard = document.getElementById('detailCard');
const detailTitle = document.getElementById('detailTitle');
const detailList = document.getElementById('detailList');

/* only a logged-in student may see this page */
if (localStorage.getItem('userRole') !== 'STUDENT') {
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

function niceDate(text) {
  if (!text) return '';
  return text.replace('T', ' ').substring(0, 16);
}

async function loadResults() {
  try {
    const res = await fetch(API + '?email=' + encodeURIComponent(email));
    const list = await res.json();

    if (!res.ok) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row"></td></tr>';
      tbody.querySelector('td').textContent = list.message || 'Could not load results.';
      return;
    }
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">You have not taken any test yet.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    list.forEach(function (s, i) {
      const checked = s.status === 'CHECKED';
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' + (i + 1) + '</td>' +
        '<td></td>' +
        '<td></td>' +
        '<td><span class="status-pill"></span></td>' +
        '<td></td>' +
        '<td><button class="del-btn">View</button></td>';
      row.children[1].textContent = s.domainName;
      row.children[2].textContent = niceDate(s.submittedAt);
      row.querySelector('.status-pill').textContent = checked ? 'CHECKED' : 'WAITING FOR CHECK';
      row.children[4].textContent = checked && s.totalMarks !== null ? s.totalMarks : '-';
      row.querySelector('button').addEventListener('click', function () { openDetail(s.submissionId); });
      tbody.appendChild(row);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Could not load results. Is Spring Boot running?</td></tr>';
  }
}

async function openDetail(id) {
  try {
    const res = await fetch(API + '/' + id + '?email=' + encodeURIComponent(email));
    const data = await res.json();
    if (!res.ok) {
      showMsg('error', data.message || 'Could not open this test.');
      return;
    }

    const checked = data.status === 'CHECKED';
    detailTitle.textContent = data.domainName + (checked ? ' – Total: ' + data.totalMarks : ' – Not checked yet');
    detailList.innerHTML = '';

    data.answers.forEach(function (a, i) {
      const box = document.createElement('div');
      box.style.cssText = 'border:1px solid var(--line); border-radius:10px; padding:1rem 1.2rem; margin-bottom:1rem;';

      const q = document.createElement('p');
      q.style.cssText = 'font-weight:700; margin-bottom:.5rem;';
      q.textContent = (i + 1) + '. ' + a.questionText;

      const ans = document.createElement('p');
      ans.style.cssText = 'color:var(--muted); margin-bottom:.6rem; white-space:pre-wrap;';
      ans.textContent = a.answerText ? a.answerText : '(No answer given)';

      const marks = document.createElement('p');
      marks.style.cssText = 'font-weight:700; color:var(--accent-dark);';
      marks.textContent = checked && a.marks !== null ? 'Marks: ' + a.marks : 'Marks: waiting for faculty';

      box.appendChild(q);
      box.appendChild(ans);
      box.appendChild(marks);
      detailList.appendChild(box);
    });

    detailCard.style.display = 'block';
    detailCard.scrollIntoView({ behavior: 'smooth' });
    showMsg('', '');
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
}

document.getElementById('closeDetail').addEventListener('click', function () {
  detailCard.style.display = 'none';
});

loadResults();