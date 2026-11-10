/* MY QUERIES PAGE (student): ask doubts and read replies */

const API = 'http://localhost:8080/api';
const email = localStorage.getItem('userEmail') || '';

const msg = document.getElementById('msg');
const domainSelect = document.getElementById('domainSelect');
const queryText = document.getElementById('queryText');
const queryList = document.getElementById('queryList');

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

/* fill the domain dropdown */
async function loadDomains() {
  try {
    const res = await fetch(API + '/domains');
    const list = await res.json();
    domainSelect.innerHTML = '';
    if (list.length === 0) {
      domainSelect.innerHTML = '<option value="">No domains available</option>';
      return;
    }
    list.forEach(function (d) {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.domainName;
      domainSelect.appendChild(opt);
    });
  } catch (err) {
    domainSelect.innerHTML = '<option value="">Could not load domains</option>';
  }
}

async function loadQueries() {
  try {
    const res = await fetch(API + '/queries/mine?email=' + encodeURIComponent(email));
    const list = await res.json();

    if (!res.ok) {
      queryList.textContent = list.message || 'Could not load your queries.';
      return;
    }
    if (list.length === 0) {
      queryList.textContent = 'You have not asked any doubt yet.';
      return;
    }

    queryList.innerHTML = '';
    list.forEach(function (q) {
      const box = document.createElement('div');
      box.style.cssText = 'border:1px solid var(--line); border-radius:10px; padding:1rem 1.2rem; margin-bottom:1rem;';

      const head = document.createElement('p');
      head.style.cssText = 'font-size:.82rem; color:var(--muted); margin-bottom:.4rem;';
      head.textContent = q.domainName + '  |  ' + niceDate(q.createdAt) + '  |  ' + q.status;

      const ask = document.createElement('p');
      ask.style.cssText = 'font-weight:700; margin-bottom:.6rem; white-space:pre-wrap;';
      ask.textContent = q.queryText;

      const reply = document.createElement('p');
      reply.style.cssText = 'white-space:pre-wrap;';
      if (q.replyText) {
        reply.style.color = 'var(--accent-dark)';
        reply.textContent = 'Reply: ' + q.replyText;
      } else {
        reply.style.color = 'var(--muted)';
        reply.textContent = 'Waiting for the faculty to reply.';
      }

      box.appendChild(head);
      box.appendChild(ask);
      box.appendChild(reply);
      queryList.appendChild(box);
    });
  } catch (err) {
    queryList.textContent = 'Could not load your queries. Is Spring Boot running?';
  }
}

document.getElementById('askForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  showMsg('', 'Sending...');

  try {
    const res = await fetch(API + '/queries?email=' + encodeURIComponent(email), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domainId: parseInt(domainSelect.value, 10),
        queryText: queryText.value.trim()
      })
    });
    const data = await res.json();

    if (res.ok && data.status === 'SUCCESS') {
      showMsg('ok', 'Your doubt was sent.');
      queryText.value = '';
      loadQueries();
    } else {
      showMsg('error', data.message || 'Could not send your doubt.');
    }
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
});

loadDomains();
loadQueries();