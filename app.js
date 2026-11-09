const menu = one('#menu');
const toggle = one('.menu-toggle');
function setMenu(open) {
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'Close index':'Open index');
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
const poses=[
  {from:[-64,38],to:[-132,-16],scale:.78,tilt:-2.6,alpha:.57,sway:1.1,soft:1.1},
  {from:[62,45],to:[136,-14],scale:.82,tilt:2.2,alpha:.52,sway:1.0,soft:.9},
  {from:[0,86],to:[0,-154],scale:.94,tilt:.4,alpha:.56,sway:.55,soft:.45},
  {from:[-30,-8],to:[-116,-62],scale:.72,tilt:-3,alpha:.38,sway:1.3,soft:1.25},
  {from:[20,71],to:[116,13],scale:.88,tilt:1.4,alpha:.46,sway:.7,soft:.55},
  {from:[44,-42],to:[156,-76],scale:.76,tilt:2.6,alpha:.38,sway:1.15,soft:1.3}
];
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
  const aperture=smooth(.12,.40,t)*(1-smooth(.64,.88,t));
  crossing.style.setProperty('--bloom',aperture);
  clouds.forEach((cloud,i)=>{
    const pose=poses[i],delay=i*.012;
    const enter=smooth(.01+delay,.34+delay,t),exit=smooth(.50+delay*.45,.97+delay*.08,t);
    const phase=t*Math.PI*2.1+i*.82;
    const wind=Math.sin(phase),lift=Math.cos(phase*.78);
    const x=pose.from[0]*(1-enter)+pose.to[0]*exit+wind*pose.sway;
    const y=pose.from[1]*(1-enter)+pose.to[1]*exit+lift*pose.sway*.55;
    const scale=pose.scale+enter*.46+exit*1.08+wind*.012;
    const rotation=pose.tilt*(1-enter)-pose.tilt*.38*exit+wind*.18;
    const fadeIn=smooth(.015+delay,.14+delay,t),fadeOut=1-smooth(.75+delay*.3,.98,t);
    cloud.style.transform=`translate3d(${x}%,${y}%,0) rotate(${rotation}deg) scale(${scale})`;
    cloud.style.opacity=fadeIn*fadeOut*pose.alpha;
    cloud.style.setProperty('--cloud-softness',`${pose.soft+(1-enter)*.45}px`);
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
one('#film-sound').onclick=()=>{gatewayFilm.muted=!gatewayFilm.muted;const button=one('#film-sound');button.setAttribute('aria-pressed',String(!gatewayFilm.muted));button.setAttribute('aria-label',gatewayFilm.muted?'Turn sound on':'Turn sound off');button.dataset.sound=gatewayFilm.muted?'off':'on'};
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
function replayEntranceMotion(){
  prelude.querySelectorAll('.corner,.star-art,.enter-label').forEach(element=>{
    element.style.animation='none';
    void element.offsetWidth;
    element.style.removeProperty('animation');
  });
}
function openPrelude(){
  gatewayFilm.pause();livingFilm.pause();ambience=false;scene.classList.remove('living');gatewayFilm.currentTime=0;
  scene.classList.remove('ready');
  prelude.classList.remove('leaving');
  leaving=false;
  replayEntranceMotion();
  document.documentElement.classList.add('prelude-pending');
  prelude.showModal();
  entryButton.focus({preventScroll:true});
}
async function enterPortfolio(){
  if(leaving)return;
  leaving=true;
  scrollTo({top:0,behavior:'instant'});startHero();
  await startFilm();
  if(!reduced.matches){
    const aperture=one('#star-opening'),mark=one('.star-art');
    const base=mark.getBoundingClientRect().width*.073,w=prelude.clientWidth,h=prelude.clientHeight;
    const finish=Math.hypot(w,h)*1.35/base;
    aperture.setAttribute('transform',`translate(${w/2} ${h/2}) scale(.001)`);
    prelude.classList.add('leaving');
    await new Promise(resolve=>{
      const start=performance.now(),duration=1780;
      function fly(time){
        const t=Math.min(1,(time-start)/duration);
        const eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
        const zoom=Math.pow(finish,eased),flare=Math.sin(Math.PI*eased);
        mark.style.setProperty('--star-zoom',zoom);
        mark.style.setProperty('--portal-flare',flare);
        aperture.setAttribute('transform',`translate(${w/2} ${h/2}) scale(${base*zoom*smooth(0,.2,t)})`);
        if(t<1&&!reduced.matches)requestAnimationFrame(fly);else resolve();
      }requestAnimationFrame(fly);
    });
    mark.style.removeProperty('--star-zoom');
    mark.style.removeProperty('--portal-flare');
  }
  prelude.close();prelude.classList.remove('leaving');
  document.documentElement.classList.remove('prelude-pending');
  one('.brand').focus({preventScroll:true});
}
entryButton.onclick=enterPortfolio;
prelude.addEventListener('cancel',event=>{event.preventDefault();enterPortfolio();});
one('#replay').onclick=()=>{scrollTo({top:0,behavior:'instant'});openPrelude();};
if(document.documentElement.classList.contains('prelude-pending'))openPrelude();
else startHero();

const chapters=document.querySelectorAll('.section-head,.colophon');
const appear=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(entry.isIntersecting){entry.target.classList.add('on-page');appear.unobserve(entry.target);}
  }
},{threshold:.16});
chapters.forEach(chapter=>appear.observe(chapter));
reduced.addEventListener('change',()=>{
  if(reduced.matches)one('.cloud-crossing').removeAttribute('data-active');
  schedule();
});
