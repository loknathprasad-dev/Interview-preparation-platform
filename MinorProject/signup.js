/* SIGNUP: sends the student's name, email and password to the backend */

const API = 'http://localhost:8080/api';
const msg = document.getElementById('signupMsg');

document.getElementById('signupForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  msg.className = 'auth-msg';

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  /* both passwords must match */
  if (password !== confirm) {
    msg.className = 'auth-msg error';
    msg.textContent = 'Passwords do not match.';
    return;
  }

  msg.textContent = 'Creating your account...';

  try {
    const res = await fetch(API + '/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, password: password })
    });
    const data = await res.json();

    if (data.status === 'SUCCESS') {
      msg.className = 'auth-msg ok';
      msg.textContent = 'Account created! Redirecting to login...';
      setTimeout(function () { window.location.href = 'login.html'; }, 1500);
    } else if (data.status === 'EMAIL_EXISTS') {
      msg.className = 'auth-msg error';
      msg.textContent = 'An account with this email already exists. Please log in.';
    } else {
      msg.className = 'auth-msg error';
      msg.textContent = 'Something went wrong. Please try again.';
    }
  } catch (err) {
    msg.className = 'auth-msg error';
    msg.textContent = 'Could not connect to the server. Is Spring Boot running?';
  }
});