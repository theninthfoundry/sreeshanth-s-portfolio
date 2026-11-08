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
  const scrollRange=Math.max(1,gate.offsetHeight-scene.offsetHeight);
  const progress=clamp(-gate.getBoundingClientRect().top/scrollRange);
  scene.style.setProperty('--drift',progress);
  renderFlight(progress,scene);
  if(progress<.06&&scene.classList.contains('ready')&&(ambience||gatewayFilm.ended||gatewayFilm.currentTime>4.5)){
    if(!scene.classList.contains('living'))scene.classList.add('living');
    if(livingFilm.paused)livingFilm.play().catch(()=>{});
  }
  const riderTop=ride.getBoundingClientRect().top;
  const p=clamp((innerHeight*.65-riderTop)/(ride.offsetHeight-innerHeight*.35));
  ride.style.setProperty('--p',p);
  const trace=clamp((innerHeight*.96-riderTop)/(ride.offsetHeight+innerHeight*.12));
  ride.style.setProperty('--trace',trace);
  const point=orbitPath.getPointAtLength(trace*orbitLength);
  one('#orbit-star').setAttribute('transform','translate('+point.x+' '+point.y+')');
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(paint)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);paint();

const gatewayFilm=one('#gateway-film');
const livingFilm=one('#gateway-living');
let ambience=false;
gatewayFilm.addEventListener('ended',async()=>{
  if(reduced.matches)return;
  ambience=true;
  livingFilm.currentTime=0;
  scene.classList.add('living');
  try{await livingFilm.play()}catch{}
});
const prelude=one('#prelude');
const scene=one('.scene');
const entryButton=one('.star-entry');
let leaving=false;
function startHero(){scene.classList.add('ready')}
async function startFilm(){
  ambience=false;
  livingFilm.pause();
  livingFilm.currentTime=0;
  scene.classList.remove('living');
  gatewayFilm.currentTime=0;
  gatewayFilm.controls=false;
  try{await gatewayFilm.play()}catch{gatewayFilm.controls=true}
}
one('#film-sound').onclick=()=>{gatewayFilm.muted=!gatewayFilm.muted;one('#film-sound').textContent=gatewayFilm.muted?'Sound off':'Sound on';one('#film-sound').setAttribute('aria-pressed',String(!gatewayFilm.muted))};
one('#film-replay').onclick=startFilm;
new IntersectionObserver(([entry])=>{
  if(!entry.isIntersecting){
    gatewayFilm.pause();
    livingFilm.pause();
  }else if(!reduced.matches){
    if(ambience||gatewayFilm.ended||gatewayFilm.currentTime>4.5){
      scene.classList.add('living');
      livingFilm.play().catch(()=>{});
    }else if(gatewayFilm.paused&&scene.classList.contains('ready')&&!prelude.open){
      gatewayFilm.play().catch(()=>{});
    }
  }
},{threshold:.05}).observe(scene);
function openPrelude(){
  gatewayFilm.pause();livingFilm.pause();ambience=false;scene.classList.remove('living');gatewayFilm.currentTime=0;
  scene.classList.remove('ready');
  prelude.classList.remove('leaving');
  leaving=false;
  document.documentElement.classList.add('prelude-pending');
  prelude.showModal();
  entryButton.focus({preventScroll:true});
}
async function enterPortfolio(){
  if(leaving)return;
  leaving=true;
  scrollTo({top:0,behavior:'instant'});startHero(
// pointer inertia
