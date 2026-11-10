/* 1. MOBILE MENU: hamburger pe click karne se menu khulta/band hota hai */
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

/* menu ke bahar click karo toh menu band ho jaye */
document.addEventListener('click', function (e) {
  const nav = document.getElementById('navLinks');
  const ham = document.getElementById('hamburger');
  if (!nav.contains(e.target) && !ham.contains(e.target)) {
    nav.classList.remove('open');
  }
});

/* 2. SCROLL ANIMATION: jaise hi koi section screen pe aaye, usme 'vis' class lag jaye */
const srObs = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('vis');
      srObs.unobserve(en.target);
    }
  });
}, { threshold: 0.07 });
document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

/* 3. COUNTER: 0 se 5000+, 92% jaise numbers ginti karke chalte hain */
function runCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const dur = 1800, t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString() + suffix;
  })(t0);
}
const cntObs = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      runCounter(en.target);
      cntObs.unobserve(en.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => cntObs.observe(el));