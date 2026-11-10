/* PRACTICE PAGE (student): one question at a time, then submit */

const API = 'http://localhost:8080/api';
const email = localStorage.getItem('userEmail') || '';

/* only a logged-in student may see this page */
if (localStorage.getItem('userRole') !== 'STUDENT') {
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'login.html';
});

const params = new URLSearchParams(window.location.search);
const domainId = parseInt(params.get('domainId'), 10);
const domainName = params.get('name') || 'Practice';

const titleEl = document.getElementById('title');
const counter = document.getElementById('counter');
const qCard = document.getElementById('qCard');
const qText = document.getElementById('qText');
const answerBox = document.getElementById('answerBox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const msg = document.getElementById('msg');

titleEl.textContent = domainName;

let questions = [];
let answers = [];   /* answers[i] belongs to questions[i] */
let index = 0;

function showMsg(type, text) {
  msg.className = 'auth-msg ' + type;
  msg.textContent = text;
}

/* draw the current question */
function render() {
  qText.textContent = questions[index].questionText;
  answerBox.value = answers[index];
  counter.textContent = 'Question ' + (index + 1) + ' of ' + questions.length;

  prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
  const last = index === questions.length - 1;
  nextBtn.style.display = last ? 'none' : 'inline-block';
  submitBtn.style.display = last ? 'inline-block' : 'none';
}

/* keep what the student typed before moving */
function saveCurrent() {
  answers[index] = answerBox.value;
}

prevBtn.addEventListener('click', function () {
  saveCurrent();
  index--;
  render();
});

nextBtn.addEventListener('click', function () {
  saveCurrent();
  index++;
  render();
});

submitBtn.addEventListener('click', async function () {
  saveCurrent();
  if (!confirm('Submit your test? You cannot change answers after this.')) return;

  showMsg('', 'Submitting...');
  submitBtn.disabled = true;

  try {
    const res = await fetch(API + '/submissions?email=' + encodeURIComponent(email), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domainId: domainId,
        answers: questions.map(function (q, i) {
          return { questionId: q.questionId, answerText: answers[i] };
        })
      })
    });
    const data = await res.json();

    if (res.ok && data.status === 'SUCCESS') {
      qCard.style.display = 'none';
      counter.textContent = 'Test submitted.';
      showMsg('ok', 'Your answers were submitted. Your faculty will check them and your marks will appear in your results.');
    } else {
      submitBtn.disabled = false;
      showMsg('error', data.message || 'Could not submit the test.');
    }
  } catch (err) {
    submitBtn.disabled = false;
    showMsg('error', 'Could not connect to the server. Is Spring Boot running?');
  }
});

async function loadQuestions() {
  if (!domainId) {
    counter.textContent = 'No domain selected. Go back and pick one.';
    return;
  }
  try {
    const res = await fetch(API + '/questions/domain/' + domainId);
    questions = await res.json();

    if (!res.ok || questions.length === 0) {
      counter.textContent = 'No questions have been added to this domain yet.';
      return;
    }
    answers = questions.map(function () { return ''; });
    qCard.style.display = 'block';
    render();
  } catch (err) {
    counter.textContent = 'Could not load questions. Is Spring Boot running?';
  }
}

loadQuestions();