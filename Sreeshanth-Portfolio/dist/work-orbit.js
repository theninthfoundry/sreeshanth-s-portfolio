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
function scrollDepth(){if(manual)return;const r=section.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){target=reduced.matches?target:bound(-r.top/Math.max(1,section.offsetHeight-innerHeight)*4);wake()}}
addEventListener('wheel',()=>{manual=false},{passive:true});addEventListener('touchmove',e=>{if(!drag?.moved)manual=false},{passive:true});
addEventListener('scroll',scrollDepth,{passive:true});
const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});
let draw=()=>{};
if(gl){
const vs=`attribute vec3 aPos;attribute vec2 aUV;attribute vec3 aNormal;uniform vec3 uOffset;uniform vec3 uRotation;uniform vec3 uScale;uniform float uAspect;varying vec2 vUV;varying vec3 vNormal;varying float vDepth;void main(){float cy=cos(uRotation.y),sy=sin(uRotation.y),cx=cos(uRotation.x),sx=sin(uRotation.x),cz=cos(uRotation.z),sz=sin(uRotation.z);mat3 ry=mat3(cy,0.,-sy,0.,1.,0.,sy,0.,cy);mat3 rx=mat3(1.,0.,0.,0.,cx,sx,0.,-sx,cx);mat3 rz=mat3(cz,sz,0.,-sz,cz,0.,0.,0.,1.);mat3 rot=rz*ry*rx;vec3 p=rot*(aPos*uScale)+uOffset;vNormal=rot*aNormal;vUV=aUV;vDepth=-p.z;gl_Position=vec4(p.x*1.8/uAspect,p.y*1.8,-1.004*p.z-.2004,-p.z);}`;
const fs=`precision mediump float;uniform sampler2D uTexture;uniform float uMode;uniform float uAlpha;varying vec2 vUV;varying vec3 vNormal;varying float vDepth;void main(){vec3 light=normalize(vec3(-.5,.8,1.));float lum=.46+.54*max(0.,dot(normalize(vNormal),light));vec3 col;if(uMode>1.5){col=vec3(.72,.68,.50);}else if(uMode>.5){col=vec3(.34,.42,.57)*lum;float edge=step(.93,fract(vUV.y*15.));col+=edge*.12;}else{col=texture2D(uTexture,vUV).rgb*lum;}float fog=clamp((vDepth-7.)/30.,0.,.84);col=mix(col,vec3(.045,.105,.23),fog);gl_FragColor=vec4(col,uAlpha);}`;
function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const u={};['Offset','Rotation','Scale','Aspect','Mode','Alpha','Texture'].forEach(n=>u[n]=gl.getUniformLocation(program,'u'+n));
const attrs=['aPos','aUV','aNormal'].map(n=>gl.getAttribLocation(program,n));
function buffer(data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return {b,count:data.length/8}}
function bind(mesh){gl.bindBuffer(gl.ARRAY_BUFFER,mesh.b);[3,2,3].forEach((size,i)=>{gl.enableVertexAttribArray(attrs[i]);gl.vertexAttribPointer(attrs[i],size,gl.FLOAT,false,32,[0,12,20][i])})}
function quad(points,normal){const uv=[[0,0],[1,0],[1,1],[0,1]];return [0,1,2,0,2,3].flatMap(i=>[...points[i],...uv[i],...normal])}
const front=buffer(quad([[-1,-.76,.12],[1,-.76,.12],[1,.76,.12],[-1,.76,.12]],[0,0,1]));
const body=buffer([...quad([[1,-.76,-.12],[-1,-.76,-.12],[-1,.76,-.12],[1,.76,-.12]],[0,0,-1]),...quad([[-1,-.76,-.12],[-1,-.76,.12],[-1,.76,.12],[-1,.76,-.12]],[-1,0,0]),...quad([[1,-.76,.12],[1,-.76,-.12],[1,.76,-.12],[1,.76,.12]],[1,0,0]),...quad([[-1,.76,.12],[1,.76,.12],[1,.76,-.12],[-1,.76,-.12]],[0,1,0]),...quad([[-1,-.76,-.12],[1,-.76,-.12],[1,-.76,.12],[-1,-.76,.12]],[0,-1,0])]);
let ringData=[];for(let i=0;i<=144;i++){const a=i/144*Math.PI*2;ringData.push(Math.cos(a),Math.sin(a),0,0,0,0,0,1)}const ring=buffer(ringData);
const textures=names.map((name,i)=>{const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([25,46,80,255]));gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);const im=new Image();im.onload=async()=>{await document.fonts.ready;const c=document.createElement('canvas');c.width=1024;c.height=778;const ctx=c.getContext('2d');ctx.fillStyle='#faf6eb';ctx.fillRect(0,0,1024,778);ctx.drawImage(im,0,0,1024,650);ctx.fillStyle='#173048';ctx.font='17px monospace';ctx.fillText('ARCHIVE / 0'+(i+1),38,725);ctx.textAlign='right';ctx.font='italic 62px Folio';ctx.fillText(name,980,735);gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);wake()};im.src='art/'+name.toLowerCase()+'-still.svg';return tex});
gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
function pose(pos,rotation,scale,mode,alpha=1){gl.uniform3fv(u.Offset,pos);gl.uniform3fv(u.Rotation,rotation);gl.uniform3fv(u.Scale,scale);gl.uniform1f(u.Mode,mode);gl.uniform1f(u.Alpha,alpha)}
draw=(time)=>{const dpr=Math.min(devicePixelRatio,2),w=Math.round(canvas.clientWidth*dpr),h=Math.round(canvas.clientHeight*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform1f(u.Aspect,w/h);
// Receding brass hoops are actual scene geometry, not a flat background.
bind(ring);for(let j=0;j<14;j++){const z=-5-j*2.6;pose([0,.15,z],[0,.15*Math.sin(j*.6),j*.12],[3.8,2.5,1],2,.16+j*.012);gl.drawArrays(gl.LINE_STRIP,0,ring.count)}
const mobile=w/h<.8,scale=mobile?(w/h)*2.15:1.8;
for(let i=4;i>=0;i--){const d=i-current;const x=d>=0?Math.sin(d*.75)*5.8:d*5.4;const y=d>=0?d*1.4:-d*.6;const z=-4.8-Math.abs(d)*5.3;const tilt=reduced.matches?0:Math.sin(time*.00055+i)*.025;const rot=[-.07+tilt,d>=0?.18-d*.38:Math.min(1.2,.18-d*.5),d*.07];const pos=[x,y-.16,z];gl.bindTexture(gl.TEXTURE_2D,textures[i]);pose(pos,rot,[scale,scale,scale],1);bind(body);gl.drawArrays(gl.TRIANGLES,0,body.count);pose(pos,rot,[scale,scale,scale],0);bind(front);gl.drawArrays(gl.TRIANGLES,0,front.count)}
};
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;stage.classList.add('depth-fallback')});
 }else{
// The same perspective geometry is projected in Canvas when WebGL is unavailable.
const ctx=canvas.getContext('2d'),maps=[];
names.forEach((name,i)=>{const im=new Image();im.onload=async()=>{await document.fonts.ready;const c=document.createElement('canvas');c.width=820;c.height=624;const t=c.getContext('2d');t.fillStyle='#faf6eb';t.fillRect(0,0,820,624);t.drawImage(im,0,0,820,520);t.fillStyle='#173048';t.font='14px monospace';t.fillText('ARCHIVE / 0'+(i+1),30,582);t.textAlign='right';t.font='italic 49px Folio';t.fillText(name,785,590);maps[i]=c;wake()};im.src='art/'+name.toLowerCase()+'-still.svg'});
function triangle(img,source,dest){const [a,b,c]=source,[p,q,r]=dest;const det=a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]);if(Math.abs(det)<.01)return;function coeff(k){return [(p[k]*(b[1]-c[1])+q[k]*(c[1]-a[1])+r[k]*(a[1]-b[1]))/det,(p[k]*(c[0]-b[0])+q[k]*(a[0]-c[0])+r[k]*(b[0]-a[0]))/det,(p[k]*(b[0]*c[1]-c[0]*b[1])+q[k]*(c[0]*a[1]-a[0]*c[1])+r[k]*(a[0]*b[1]-b[0]*a[1]))/det]}const x=coeff(0),y=coeff(1);ctx.save();ctx.beginPath();const center=[(p[0]+q[0]+r[0])/3,(p[1]+q[1]+r[1])/3];const expand=v=>{const dx=v[0]-center[0],dy=v[1]-center[1],length=Math.hypot(dx,dy);return [v[0]+dx/length*.7,v[1]+dy/length*.7]};ctx.moveTo(...expand(p));ctx.lineTo(...expand(q));ctx.lineTo(...expand(r));ctx.closePath();ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(img,0,0);ctx.restore()}
draw=time=>{const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio,1.5);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
const project=p=>[w/2+p[0]*h*.9/-p[2],h/2-p[1]*h*.9/-p[2]];
ctx.strokeStyle='#ceb78355';ctx.lineWidth=.7;for(let j=13;j>=0;j--){ctx.beginPath();for(let k=0;k<=120;k++){const a=k/120*Math.PI*2;const pt=project([Math.cos(a)*3.8,Math.sin(a)*2.5+.15,-5-j*2.6]);k?ctx.lineTo(...pt):ctx.moveTo(...pt)}ctx.stroke()}
const order=names.map((n,i)=>i).sort((a,b)=>Math.abs(b-current)-Math.abs(a-current));
for(const i of order){const d=i-current,scale=w/h<.8?(w/h)*2.15:1.8;const cy=Math.cos(d>=0?.18-d*.38:Math.min(1.2,.18-d*.5)),sy=Math.sin(d>=0?.18-d*.38:Math.min(1.2,.18-d*.5)),rx=-.07+(reduced.matches?0:Math.sin(time*.00055+i)*.025),cx=Math.cos(rx),sx=Math.sin(rx),cz=Math.cos(d*.07),sz=Math.sin(d*.07);const offset=[d>=0?Math.sin(d*.75)*5.8:d*5.4,(d>=0?d*1.4:-d*.6)-.16,-4.8-Math.abs(d)*5.3];
function vertex(x,y,z){x*=scale;y*=scale;z*=scale;let xx=x*cy+z*sy,zz=-x*sy+z*cy,yy=y*cx-zz*sx;zz=y*sx+zz*cx;return project([xx*cz-yy*sz+offset[0],xx*sz+yy*cz+offset[1],zz+offset[2]])}
function face(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((v,k)=>{const pt=vertex(...v);k?ctx.lineTo(...pt):ctx.moveTo(...pt)});ctx.closePath();ctx.fill();ctx.strokeStyle='#cbbd9e88';ctx.lineWidth=.7;ctx.stroke()}
face([[-1,-.76,-.12],[1,-.76,-.12],[1,.76,-.12],[-1,.76,-.12]],'#152544');face([[-1,-.76,-.12],[-1,-.76,.12],[-1,.76,.12],[-1,.76,-.12]],'#718099');face([[1,-.76,.12],[1,-.76,-.12],[1,.76,-.12],[1,.76,.12]],'#657388');face([[-1,.76,.12],[1,.76,.12],[1,.76,-.12],[-1,.76,-.12]],'#c1c7d0');face([[-1,-.76,-.12],[1,-.76,-.12],[1,-.76,.12],[-1,-.76,.12]],'#344259');
const im=maps[i];if(im){for(let iy=0;iy<6;iy++)for(let ix=0;ix<8;ix++){const u=ix/8,v=iy/6,du=1/8,dv=1/6;const uv=[[u,v],[u+du,v],[u+du,v+dv],[u,v+dv]];const src=uv.map(p=>[p[0]*im.width,p[1]*im.height]);const dst=uv.map(p=>vertex(p[0]*2-1,.76-p[1]*1.52,.12));triangle(im,[src[0],src[1],src[2]],[dst[0],dst[1],dst[2]]);triangle(im,[src[0],src[2],src[3]],[dst[0],dst[2],dst[3]])}const fog=Math.min(.8,Math.max(0,(-offset[2]-7)/30));face([[-1,-.76,.121],[1,-.76,.121],[1,.76,.121],[-1,.76,.121]],'rgba(11,27,59,'+fog+')')}
}
};
}
const fallback=document.createElement('img');fallback.className='depth-static';fallback.alt='Selected project artwork';stage.append(fallback);
function tick(time){frame=0;const dt=Math.min(60,time-last||16);last=time;current=reduced.matches?target:current+(target-current)*(1-Math.exp(-dt/150));if(Math.abs(target-current)<.001)current=target;updateLabels();if(!fallback.src.endsWith(names[active].toLowerCase()+'-still.svg'))fallback.src='art/'+names[active].toLowerCase()+'-still.svg';draw(time);if(inView&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick)}
function wake(){if(!frame&&!document.hidden)frame=requestAnimationFrame(tick)}
new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;if(inView)wake();else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'100px'}).observe(section);
new ResizeObserver(wake).observe(stage);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else if(inView)wake()});reduced.addEventListener('change',wake);updateLabels();wake();
  function burst(){
    if(reduced.matches)return;
    const ns='http://www.w3.org/2000/svg';
    const puff='M-41 9Q-52 -8 -37 -17Q-39 -32 -22 -32Q-12 -44 2 -36Q22 -47 30 -27Q49 -27 45 -10Q60 1 46 15Q45 31 27 29Q19 42 3 34Q-10 44 -22 31Q-41 34 -41 19Z';
    for(let i=0;i<12;i++){
      const shape=document.createElementNS(ns,'svg');
      shape.setAttribute('viewBox','-58 -50 116 100');shape.classList.add('smoke-puff');
      shape.innerHTML='<path d="'+puff+'" fill="'+['#fff3dc','#bfd0de','#e8c4d6'][i%3]+'" stroke="#17263b" stroke-width="3"/><path d="M-29 7q6 10 15 7m22 8q10 4 16-3M-19-19q7-7 14-4" fill="none" stroke="#52627a" stroke-width="1.8" stroke-linecap="round"/>';
      smoke.append(shape);
      const theta=i*Math.PI/6+.08*Math.random(),distance=Math.min(innerWidth*.37,260)*(0.65+Math.random()*.5);
      const x=Math.cos(theta)*distance,y=Math.sin(theta)*distance;
      const frames=[{transform:'translate(-50%,-50%) scale(.2)',opacity:0},{offset:.16,opacity:1},{offset:.65,transform:'translate(calc(-50% + '+x*.87+'px),calc(-50% + '+y*.87+'px)) rotate('+i*9+'deg) scale(1.1)',opacity:.95},{transform:'translate(calc(-50% + '+x+'px),calc(-50% + '+(y-20)+'px)) rotate('+i*12+'deg) scale(.56)',opacity:0}];
      const animation=shape.animate(frames,{duration:670+Math.random()*180,easing:'ease-out',fill:'both'});
      animation.finished.then(()=>shape.remove(),()=>shape.remove());
    }
  }
  one('#close-pop').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{
    const r=dialog.getBoundingClientRect();
    if(performance.now()-openedAt>400&&e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();
  });
  dialog.addEventListener('close',()=>{burst()});

})();
