/* LOGIN: sends email, password and role to the backend */

const API = 'http://localhost:8080/api';

const roleBox = document.getElementById('role');
const emailBox = document.getElementById('email');
const emailLabel = document.getElementById('emailLabel');
const msg = document.getElementById('loginMsg');

/* Show "Username" instead of "Email" when Admin is selected */
roleBox.addEventListener('change', function () {
  if (roleBox.value === 'ADMIN') {
    emailLabel.textContent = 'Username';
    emailBox.placeholder = 'Admin';
  } else {
    emailLabel.textContent = 'Email';
    emailBox.placeholder = 'you@example.com';
  }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();   // stop the page from reloading
  msg.className = 'auth-msg';
  msg.textContent = 'Checking...';

  try {
    const res = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailBox.value.trim(),
        password: document.getElementById('password').value,
        role: roleBox.value
      })
    });
    const data = await res.json();

    if (data.status === 'SUCCESS') {
      /* remember who is logged in */
      localStorage.setItem('userEmail', emailBox.value.trim());
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.name);

      msg.className = 'auth-msg ok';
      msg.textContent = 'Login successful!';

      /* open a different page for each role */
      if (data.role === 'ADMIN') window.location.href = 'admin.html';
      else if (data.role === 'FACULTY') window.location.href = 'faculty.html';
      else window.location.href = 'student.html';
    } else if (data.status === 'BLOCKED') {
      msg.className = 'auth-msg error';
      msg.textContent = 'Your account is blocked.';
    } else {
      msg.className = 'auth-msg error';
      msg.textContent = 'Incorrect email/username, password or role.';
    }
  } catch (err) {
    msg.className = 'auth-msg error';
    msg.textContent = 'Could not connect to the server. Is Spring Boot running?';
  }
});