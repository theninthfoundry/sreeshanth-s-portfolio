const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const one = selector => document.querySelector(selector);
const viewer=one('#viewer');
let items=[], position=0, collectionName='';
function displayArtwork(){
  const item=items[position];
  one('#viewer-title').textContent=item.label;
  one('#view-art').src=item.src;
  one('#view-art').alt=item.label;
  one('#view-count').textContent=items.length===1?collectionName:collectionName+' / '+(position+1)+' of '+items.length;
  one('#view-controls').hidden=items.length<2;
}
function openArtwork(images,start,name){
  items=images;position=start;collectionName=name;
  displayArtwork();viewer.showModal();document.documentElement.classList.add('viewing');
}
function turnArtwork(step){position=(position+step+items.length)%items.length;displayArtwork();}
one('#close-view').onclick=()=>viewer.close();
viewer.addEventListener('close',()=>document.documentElement.classList.remove('viewing'));
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('keydown',event=>{if(event.key==='ArrowRight')turnArtwork(1);if(event.key==='ArrowLeft')turnArtwork(-1);});
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>turnArtwork(Number(b.dataset.view)));
