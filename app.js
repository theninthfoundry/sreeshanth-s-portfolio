const menu = one('#menu');
const toggle = one('.menu-toggle');
function setMenu(open) {
  toggle.setAttribute('aria-expanded',String(open));
  menu.hidden = !open;
}
toggle.onclick = () => setMenu(menu.hidden);
menu.onclick = () => setMenu(false);
document.addEventListener('keydown',event => {
  if(event.key === 'Escape' && !menu.hidden){ setMenu(false); toggle.focus(); }
});
document.addEventListener('click',event => {
  if(!event.target.closest('header')) setMenu(false);
});

const clamp=n=>Math.max(0,Math.min(1,n));
const orbitPath=one('#orbit-path');
const orbitLength=orbitPath.getTotalLength();
const smooth=(start,end,value)=>{const t=clamp((value-start)/(end-start));return t*t*(3-2*t)};
const crossing=one('.cloud-crossing'),clouds=[...crossing.querySelectorAll('.flight-cloud')];
const poses=[[-60,40,-120,-20],[60,50,120,-15],[0,80,0,-140],[-40,-30,-130,-40],[40,20,130,-25],[0,-80,0,-150]];
function renderFlight(t,scene){
  const gate=scene.closest('.gate')||one('.gate');
  const active=t>.003&&t<.97;
  crossing.toggleAttribute('data-active',active);
  scene.classList.toggle('portal-opening',t>.35);
  
  const ended=t>=.95;
  scene.classList.toggle('flight-ended',ended);
  if(gate) gate.classList.toggle('flight-ended',ended);
  
  if(ended){
    scene.style.visibility='hidden';
    scene.style.opacity='0';
    scene.style.pointerEvents='none';
    if(gate) gate.style.visibility='hidden';
  }else{
    scene.style.visibility='visible';
    scene.style.pointerEvents=t>.65?'none':'auto';
    scene.style.opacity=t>.65?String(1-smooth(.65,.95,t)):'1';
    if(gate) gate.style.visibility='visible';
  }
  
  scene.style.setProperty('--film-opacity',1-smooth(.25,.55,t));
  scene.style.setProperty('--type-opacity',1-smooth(.04,.28,t));
  crossing.style.setProperty('--bloom',smooth(.10,.35,t)*(1-smooth(.55,.82,t)));
  crossing.style.setProperty('--words',smooth(.16,.36,t)*(1-smooth(.48,.68,t)));
  clouds.forEach((cloud,i)=>{
    const [x,y,ex,ey]=poses[i],enter=smooth(.01*i,.38+.01*i,t),exit=smooth(.48+.008*i,.95,t);
    cloud.style.transform=`translate3d(${x*(1-enter)+ex*exit}%,${y*(1-enter)+ey*exit}%,0) scale(${.85+enter*.7+exit*1.3})`;
    cloud.style.opacity=smooth(0,.14+.01*i,t)*(1-smooth(.65,.93,t));
  });
}
let pending=false;
function paint(){
  pending=false;
  if(reduced.matches) return;
  const gate=one('.gate'), scene=one('.scene'), ride=one('.ride');
  
// cloud zoom interpolation
