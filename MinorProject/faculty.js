/* FACULTY PAGE: welcome line, the faculty's one domain, logout */

const API = 'http://localhost:8080/api';

/* only a logged-in faculty member may see this page */
if (localStorage.getItem('userRole') !== 'FACULTY') {
  window.location.href = 'login.html';
}

document.getElementById('welcome').textContent =
  'Welcome, ' + (localStorage.getItem('userName') || 'Faculty');

document.getElementById('logoutBtn').addEventListener('click', function (e) {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'login.html';
});

const domainLine = document.getElementById('domainLine');
const workGrid = document.getElementById('workGrid');

/* load the domain the admin assigned to this faculty member */
async function loadMyDomain() {
  try {
    const email = localStorage.getItem('userEmail') || '';
    const res = await fetch(API + '/faculty/domains?email=' + encodeURIComponent(email));
    const list = await res.json();

    if (!res.ok || list.length === 0) {
      domainLine.textContent = 'No domain has been assigned to you yet. Please contact the admin.';
      return;
    }

    domainLine.textContent = 'Your domain: ' + list[0].domainName;
    workGrid.style.display = 'grid';
  } catch (err) {
    domainLine.textContent = 'Could not load your domain. Is Spring Boot running?';
  }
}

loadMyDomain();