const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const one = selector => document.querySelector(selector);
const viewer=one('#viewer');
let items=[], position=0, collectionName='';
function displayArtwork(){
  const item=items[position];
  one('#viewer-title').textContent=item.label;
  one('#view-art').src=item.src;
  one('#view-art').alt=item.label;
  one('#view-count').textContent=i
// viewer initial
