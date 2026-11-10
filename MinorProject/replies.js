/* REPLIES PAGE (faculty): read student doubts and reply */

const API = 'http://localhost:8080/api/queries';
const email = localStorage.getItem('userEmail') || '';

const msg = document.getElementById('msg');
const queryList = document.getElementById('queryList');

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

async function loadQueries() {
  try {
    const res = await fetch(API + '/faculty?email=' + encodeURIComponent(email));
    const list = await res.json();

    if (!res.ok) {
      queryList.textContent = list.message || 'Could not load queries.';
      return;
    }
    if (list.length === 0) {
      queryList.textContent = 'No student has asked a doubt yet.';
      return;
    }

    queryList.innerHTML = '';
    list.forEach(function (q) {
      const box = document.createElement('div');
      box.style.cssText = 'border:1px solid var(--line); border-radius:10px; padding:1rem 1.2rem; margin-bottom:1rem;';

      const head = document.createElement('p');
      head.style.cssText = 'font-size:.82rem; color:var(--muted); margin-bottom:.4rem;';
      head.textContent = q.studentName + '  |  ' + niceDate(q.createdAt) + '  |  ' + q.status;

      const ask = document.createElement('p');
      ask.style.cssText = 'font-weight:700; margin-bottom:.8rem; white-space:pre-wrap;';
      ask.textContent = q.queryText;

      const reply = document.createElement('textarea');
      reply.placeholder = 'Write your reply';
      reply.value = q.replyText || '';
      reply.style.cssText = 'width:100%; min-height:80px; font-family:inherit; font-size:.95rem; padding:.6rem .8rem; border:1px solid var(--line); border-radius:8px; background:var(--bg); outline:none; margin-bottom:.6rem;';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'auth-btn';
      btn.style.cssText = 'width:auto; padding:.6rem 1.4rem;';
      btn.textContent = q.replyText ? 'Update Reply' : 'Send Reply';
      btn.addEventListener('click', function () { sendReply(q.queryId, reply.value); });

      box.appendChild(head);
      box.appendChild(ask);
      box.appendChild(reply);
      box.appendChild(btn);
      queryList.appendChild(box);
    });
  } catch (err) {
    queryList.textContent = 'Could not load queries. Is Spring Boot running?';
  }
}

async function sendReply(id, text) {
  showMsg('', 'Saving...');
  try {
    const res = await fetch(API + '/' + id + '/reply?email=' + encodeURIComponent(email), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyText: text.trim() })
    });
    const data = await res.json();
    if (res.ok && data.status === 'SUCCESS') {
      showMsg('ok', 'Reply saved.');
      loadQueries();
    } else {
      showMsg('error', data.message || 'Could not save the reply.');
    }
  } catch (err) {
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
}

loadQueries();