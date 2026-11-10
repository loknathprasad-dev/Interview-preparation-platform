/* FAQ: sawaal pe click karo toh jawab khule, dobara click karo toh band ho */

/* saare sawaal wale buttons ko ek list mein le lo */
const faqButtons = document.querySelectorAll('.faq-q');

/* har button ke liye click ka kaam set karo */
faqButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const item = btn.parentElement;            // button ka poora dabba
    const answer = item.querySelector('.faq-a'); // us dabbe ka jawab
    const isOpen = item.classList.contains('open');

    /* pehle saare khule hue dabbe band kar do */
    document.querySelectorAll('.faq-item').forEach(function (other) {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = null;
    });

    /* agar ye pehle band tha, toh ab ise kholo */
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});