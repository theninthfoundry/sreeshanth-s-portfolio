(() => {
  const reduced = window.reduced || matchMedia('(prefers-reduced-motion: reduce)');
  window.reduced = reduced;
  const one = window.one || (selector => document.querySelector(selector));
  window.one = one;
  const viewer = one('#viewer');
  if (!viewer) return;
  let items = [], position = 0, collectionName = '';
  function displayArtwork() {
    const item = items[position];
    if (!item) return;
    const title = one('#viewer-title');
    const art = one('#view-art');
    const count = one('#view-count');
    const controls = one('#view-controls');
    if (title) title.textContent = item.label;
    if (art) { art.src = item.src; art.alt = item.label; }
    if (count) count.textContent = items.length === 1 ? collectionName : collectionName + ' / ' + (position + 1) + ' of ' + items.length;
    if (controls) controls.hidden = items.length < 2;
  }
  function openArtwork(images, start, name) {
    items = images; position = start; collectionName = name;
    displayArtwork();
    if (typeof viewer.showModal === 'function') viewer.showModal();
    document.documentElement.classList.add('viewing');
  }
  function turnArtwork(step) {
    if (!items.length) return;
    position = (position + step + items.length) % items.length;
    displayArtwork();
  }
  const closeBtn = one('#close-view');
  if (closeBtn) closeBtn.onclick = () => viewer.close();
  viewer.addEventListener('close', () => document.documentElement.classList.remove('viewing'));
  viewer.addEventListener('click', event => {
    if (event.target === viewer) {
      const r = viewer.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) {
        viewer.close();
      }
    }
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') turnArtwork(1);
    if (event.key === 'ArrowLeft') turnArtwork(-1);
  });
  document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => turnArtwork(Number(b.dataset.view)));

  window.openArtwork = openArtwork;
})();
