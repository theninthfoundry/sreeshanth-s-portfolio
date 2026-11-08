// Sreeshanth Namireddy — Portfolio
const prelude = document.getElementById('prelude');
if (prelude) {
  const enterBtn = prelude.querySelector('.star-entry');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      prelude.classList.add('dismissed');
      setTimeout(() => prelude.close(), 600);
    });
  }
}
