/* TESTS PAGE (faculty): list student tests, check answers and give marks */

const API = 'http://localhost:8080/api/review';
const email = localStorage.getItem('userEmail') || '';

const msg = document.getElementById('msg');
const tbody = document.getElementById('testBody');
const checkCard = document.getElementById('checkCard');
const checkTitle = document.getElementById('checkTitle');
const answerList = document.getElementById('answerList');

/* id of the test being checked */
let openId = null;

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

function niceDate(text) {
  if (!text) return '';
  return text.replace('T', ' ').substring(0, 16);
}

async function loadTests() {
  try {
    const res = await fetch(API + '?email=' + encodeURIComponent(email));
    const list = await res.json();

    if (!res.ok) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row"></td></tr>';
      tbody.querySelector('td').textContent = list.message || 'Could not load tests.';
      return;
    }
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No student has taken a test yet.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    list.forEach(function (s, i) {
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' + (i + 1) + '</td>' +
        '<td></td>' +
        '<td></td>' +
        '<td><span class="status-pill"></span></td>' +
        '<td></td>' +
        '<td><button class="del-btn"></button></td>';
      row.children[1].textContent = s.studentName;
      row.children[2].textContent = niceDate(s.submittedAt);
      row.querySelector('.status-pill').textContent = s.status;
      row.children[4].textContent = s.totalMarks === null ? '-' : s.totalMarks;
      const btn = row.querySelector('button');
      btn.textContent = s.status === 'CHECKED' ? 'View / Edit' : 'Check';
      btn.addEventListener('click', function () { openTest(s.submissionId); });
      tbody.appendChild(row);
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Could not load tests. Is Spring Boot running?</td></tr>';
  }
}

/* open one test and show every answer with a marks box */
async function openTest(id) {
  try {
    const res = await fetch(API + '/' + id + '?email=' + encodeURIComponent(email));
    const data = await res.json();
    if (!res.ok) {
      showMsg('error', data.message || 'Could not open this test.');
      return;
    }

    openId = id;
    checkTitle.textContent = 'Check Test: ' + data.studentName;
    answerList.innerHTML = '';

    data.answers.forEach(function (a, i) {
      const box = document.createElement('div');
      box.style.cssText = 'border:1px solid var(--line); border-radius:10px; padding:1rem 1.2rem; margin-bottom:1rem;';

      const q = document.createElement('p');
      q.style.cssText = 'font-weight:700; margin-bottom:.5rem;';
      q.textContent = (i + 1) + '. ' + a.questionText;

      const ans = document.createElement('p');
      ans.style.cssText = 'color:var(--muted); margin-bottom:.8rem; white-space:pre-wrap;';
      ans.textContent = a.answerText ? a.answerText : '(No answer given)';

      const label = document.createElement('label');
      label.style.cssText = 'font-size:.85rem; font-weight:600; margin-right:.6rem;';
      label.textContent = 'Marks';

      const input = document.createElement('input');
      input.type = 'number';
      input.min = '0';
      input.max = '100';
      input.step = '0.5';
      input.dataset.answerId = a.answerId;
      input.value = a.marks === null ? '' : a.marks;
      input.style.cssText = 'width:100px; font-family:inherit; padding:.5rem .7rem; border:1px solid var(--line); border-radius:8px; background:var(--bg);';

      box.appendChild(q);
      box.appendChild(ans);
      box.appendChild(label);
      box.appendChild(input);
      answerList.appendChild(box);
    });

    checkCard.style.display = 'block';
    checkCard.scrollIntoView({ behavior: 'smooth' });
    showMsg('', '');
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
}

document.getElementById('saveMarks').addEventListener('click', async function () {
  const marks = [];
  const inputs = answerList.querySelectorAll('input[type=number]');
  for (const input of inputs) {
    if (input.value === '') {
      showMsg('error', 'Please enter marks for every answer (use 0 if none).');
      return;
    }
    marks.push({ answerId: parseInt(input.dataset.answerId, 10), marks: parseFloat(input.value) });
  }

  try {
    const res = await fetch(API + '/' + openId + '/marks?email=' + encodeURIComponent(email), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marks: marks })
    });
    const data = await res.json();
    if (res.ok && data.status === 'SUCCESS') {
      showMsg('ok', 'Marks saved.');
      checkCard.style.display = 'none';
      loadTests();
    } else {
      showMsg('error', data.message || 'Could not save marks.');
    }
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
});

document.getElementById('closeCheck').addEventListener('click', function () {
  checkCard.style.display = 'none';
});

loadTests();