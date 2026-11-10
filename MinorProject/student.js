/* STUDENT PAGE: welcome line, domain cards (from the database), logout */

const API = 'http://localhost:8080/api/domains';

/* only a logged-in student may see this page */
if (localStorage.getItem('userRole') !== 'STUDENT') {
  window.location.href = 'login.html';
}

document.getElementById('welcome').textContent =
  'Welcome, ' + (localStorage.getItem('userName') || 'Student');

document.getElementById('logoutBtn').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'login.html';
});

const grid = document.getElementById('domainGrid');
const portalMsg = document.getElementById('portalMsg');

/* load the domains added by the admin */
async function loadDomains() {
  try {
    const res = await fetch(API);
    const list = await res.json();

    if (list.length === 0) {
      portalMsg.textContent = 'No domains available yet. Please check back later.';
      return;
    }

    grid.innerHTML = '';
    list.forEach(function (d) {
      const card = document.createElement('div');
      card.className = 'portal-card';
      card.innerHTML = '<div class="p-icon">🎯</div><div class="p-name"></div><div class="p-desc"></div>';
      card.querySelector('.p-name').textContent = d.domainName;
      card.querySelector('.p-desc').textContent = d.description || '';
      card.addEventListener('click', function () {
        window.location.href = 'practice.html?domainId=' + d.id +
          '&name=' + encodeURIComponent(d.domainName);
      });
      grid.appendChild(card);
    });
  } catch (err) {
    portalMsg.textContent = 'Could not load domains. Is Spring Boot running?';
  }
}

loadDomains();