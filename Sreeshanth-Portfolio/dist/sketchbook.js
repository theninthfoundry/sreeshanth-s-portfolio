const one = window.one || (selector => document.querySelector(selector));
const reduced = window.reduced || matchMedia('(prefers-reduced-motion: reduce)');
const pages = [
  {name:'Built for speed', images:[[4,7,6,34,69,-6],[3,48,6,34,46,8],[7,79,27,15,63,5],[9,39,44,13,17,-10],[5,53,55,26,37,-7]]},
  {name:'A little louder', images:[[8,8,6,27,69,-5],[12,46,12,36,50,5],[10,33,9,12,20,-12],[13,57,68,27,19,-6],[6,83,20,11,22,6]]},
  {name:'Small obsessions', images:[[16,7,18,40,48,-6],[15,57,9,26,61,8],[17,77,62,20,34,-8],[11,39,38,17,40,6],[14,0,0,26,21,2]]}
];
const labels = ['Toyota engine','Japanese racing poster','Modified sports car','Hand-drawn star','Formula racing car','Guitar-playing Liberty','Lightning sketch','Crown sticker','Banana cat','Sitcom cutout','Hehehe sticker','Spiderweb drawing','Painted soda can','Violet cat','Halftone berries'];
let page = 0;
function paperFace(content,side){
  const face=document.createElement('div');
  face.className='leaf-face '+side;
  face.append(content);
  return face;
}
function copyPage(spread){
  const copy=document.createElement('div');
  copy.className='leaf-art';
  for(const node of spread.querySelectorAll(':scope > .scrap, :scope > h3')){
    copy.append(node.cloneNode(true));
  }
  return copy;
}
function turnPaper(oldPage,newPage,direction){
  const host=document.createElement('div');
  host.className='page-turn '+(direction>0?'forward':'backward');
  host.setAttribute('aria-hidden','true');
  host.inert=true;
  const under=paperFace(oldPage.cloneNode(true),'under');
  const leaf=document.createElement('div');
  leaf.className='turning-leaf';
  leaf.append(paperFace(oldPage,'face-front'),paperFace(newPage,'face-back'));
  host.append(under,leaf);
  one('#spread').append(host);
  const angle=direction>0?-180:180;
  leaf.animate([{transform:'rotateY(0deg)'},{transform:'rotateY('+angle+'deg)'}],
    {duration:820,easing:'cubic-bezier(.32,.05,.18,1)',fill:'forwards'}).finished.then(()=>host.remove(),()=>host.remove());
}
function showPage(step=0){
  page=(page+step+pages.length)%pages.length;
  const spread=one('#spread');
  const oldPage=step && !reduced.matches ? copyPage(spread) : null;
  spread.replaceChildren();
  for(const [id,x,y,w,h,rotation] of pages[page].images){
    const img=new Image();
    img.src='original/'+String(id).padStart(2,'0')+'.png'; img.alt=labels[id-3];
    const clipping=document.createElement('button');
    clipping.type='button';clipping.className='scrap';
    clipping.setAttribute('aria-label','Enlarge '+img.alt);
    clipping.style.setProperty('--rot',rotation+'deg');
    clipping.onclick=()=>{
      const images=pages[page].images.map(([n])=>({src:'original/'+String(n).padStart(2,'0')+'.png',label:labels[n-3]}));
      openArtwork(images,pages[page].images.findIndex(([n])=>n===id),pages[page].name);
    };
    clipping.append(img);
    Object.assign(clipping.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});
    spread.append(clipping);
  }
  const h=document.createElement('h3'); h.textContent=pages[page].name; spread.append(h);
  if(oldPage) turnPaper(oldPage,copyPage(spread),step);
  one('#sheet').textContent='Spread 0'+(page+1)+' / 03 — '+pages[page].name;
}
document.querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>showPage(Number(b.dataset.book)));
showPage();
// Horizontal intent turns a leaf. Vertical movement always belongs to the page.
const spread=one('#spread');
let touchStart=null;
spread.addEventListener('touchstart',event=>{
  if(event.touches.length!==1){touchStart=null;return;}
  touchStart=[event.touches[0].clientX,event.touches[0].clientY];
},{passive:true});
spread.addEventListener('touchend',event=>{
  if(!touchStart) return;
  const touch=event.changedTouches[0];
  const dx=touch.clientX-touchStart[0],dy=touch.clientY-touchStart[1];
  touchStart=null;
  if(Math.abs(dx)>64 && Math.abs(dx)>Math.abs(dy)*1.6)showPage(dx<0?1:-1);
},{passive:true});
spread.addEventListener('touchcancel',()=>{touchStart=null;});



document.addEventListener('keydown',event=>{
  if(viewer.open||event.altKey||event.ctrlKey||event.metaKey)return;
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
    event.preventDefault();showPage(event.key==='ArrowLeft'?-1:1);
  }
});
