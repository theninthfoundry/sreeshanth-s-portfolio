(()=>{
const names=['Otaru','Latent','Veil','SatQueryAI','Reloop'];
const dialog=one('#project-pop'),smoke=one('.smoke-stage');let openedAt=0;
function open(i){if(dialog.open)return;one('#cover-art').src='art/'+names[i].toLowerCase()+'.svg';one('#project-title').textContent=names[i];one('#work-num').textContent='Archive / 0'+(i+1);openedAt=performance.now();dialog.showModal()}
const section=one('.work-depth'),stage=one('.depth-stage'),canvas=one('#depth-canvas');
const controls=one('.depth-projects'),openButton=one('#depth-open');
let manual=false;
let target=0,current=-1.1,active=0,inView=false,frame=0,drag=null,last=0;
const bound=n=>Math.max(0,Math.min(4,n));
const buttons=names.map((name,i)=>{const b=document.createElement('button');b.type='button';b.textContent='0'+(i+1)+' / '+name;b.setAttribute('aria-label','Bring '+name+' forward');b.onclick=()=>{manual=true;target=i;wake()};controls.append(b);return b});
function updateLabels(){const n=Math.round(bound(current));if(active!==n||!buttons[0].hasAttribute('aria-pressed')){active=n;buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));openButton.innerHTML='Open '+names[n]+' <span>↗</span>';one('.depth-number').textContent='0'+(n+1)+' / 05'}}
openButton.onclick=()=>open(active);
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,start:target,moved:false};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>9)drag.moved=true;if(drag.moved){manual=true;target=bound(drag.start-dx/(stage.clientWidth*.22));wake()}});
canvas.addEventListener('pointerup',e=>{if(!drag)return;const moved=drag.moved;drag=null;if(moved){target=Math.round(target);wake()}else{const r=canvas.getBoundingClientRect();if(Math.abs(e.clientX-r.left-r.width/2)<r.width*.22&&Math.abs(e.clientY-r.top-r.height*.53)<r.height*.24)open(active)}});
canvas.addEventListener('pointercancel',()=>{drag=null});
function scrollDepth(){if(manual)return;const r=section.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){target=reduced.matches?target:bound(-r.top/Math.max(1,section.offsetHeight-innerHeight)*4);wa
// trajectory calculations
