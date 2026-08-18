const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let CORE=null, mode="explore", audioCtx=null, eventTrain=[], energy=0;

async function loadCore(){
  CORE=await fetch("data/core.json").then(r=>r.json());
  $("#coreRevision").textContent=CORE.canonicalCore;
  const c=CORE.core;
  $("#metrics").innerHTML=[
    ["A₄ sectors",c.A4Sectors],["C₃ bridges",c.C3Bridges],["C₅ gate frames",c.C5GateFrames],["A₄→C₅",c.A4ToC5MinimumDegrees+"°"]
  ].map(x=>`<div class="metric"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("");
}
function log(msg){const d=document.createElement("div");d.className="logline";d.textContent=`${new Date().toLocaleTimeString()}  ${msg}`;$("#log").prepend(d)}
function ensureAudio(){if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==="suspended")audioCtx.resume();}
$("#audioEnable").addEventListener("click",()=>{ensureAudio();log("Audio enabled")});

function noiseBurst(t,dur=.025,gain=.25){
  const len=Math.max(1,Math.floor(audioCtx.sampleRate*dur)),b=audioCtx.createBuffer(1,len,audioCtx.sampleRate),a=b.getChannelData(0);
  for(let i=0;i<len;i++)a[i]=(Math.random()*2-1)*(1-i/len);
  const s=audioCtx.createBufferSource(),g=audioCtx.createGain(),f=audioCtx.createBiquadFilter();
  s.buffer=b;f.type="highpass";f.frequency.value=1600;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f).connect(g).connect(audioCtx.destination);s.start(t);
}
function tone(freq,t,dur=.35,gain=.16,type="sine"){
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+dur);
}
function click(t=audioCtx.currentTime){noiseBurst(t,.018,.18);tone(950,t,.035,.055,"square")}
function ding(t=audioCtx.currentTime,pitch=659.25){tone(pitch,t,.7,.13);tone(pitch*2.01,t,.38,.035)}
function bell(t=audioCtx.currentTime,root=261.63){
  const partials=[[1,.19,2.9],[2.01,.085,2.4],[2.72,.07,2.1],[3.93,.052,1.65],[5.4,.035,1.3]];
  partials.forEach(([r,g,d])=>tone(root*r,t,d,g));
}
function noBell(t=audioCtx.currentTime){tone(92,t,.18,.08,"triangle");noiseBurst(t,.05,.06)}

function addEvent(type,manual=false){
  ensureAudio();
  const growth=+$("#growth").value, threshold=+$("#bellThreshold").value;
  if(type==="click"){
    energy += Math.pow(growth,Math.max(0,eventTrain.filter(x=>x==="click"||x==="ding").length))*0.55;
    click();
    if(mode==="explore" && energy>=threshold){type="bell";setTimeout(()=>bell(audioCtx.currentTime,220),70);energy=0}
  } else if(type==="ding"){
    energy += Math.pow(growth,Math.max(0,eventTrain.length))*0.8;ding();
    if(mode==="explore" && energy>=threshold){type="bell";setTimeout(()=>bell(audioCtx.currentTime,220),80);energy=0}
  } else if(type==="bell"){
    if(mode==="perform"||manual){bell();energy=0}else{log("Bell request rejected: closure threshold controls Explore mode");return}
  } else if(type==="nobell"){noBell();energy=0}
  eventTrain.push(type);renderTrain();log(type.toUpperCase()+` · integration energy ${energy.toFixed(2)}`);
}
function renderTrain(){$("#eventTrain").textContent=eventTrain.map(x=>x==="bell"?"🔔 BELL":x==="ding"?"· ding":x==="click"?"· click":"· NO BELL").join("  ")}
$$(".pad").forEach(b=>b.addEventListener("click",()=>addEvent(b.dataset.sound,true)));
$("#clearSeq").addEventListener("click",()=>{eventTrain=[];energy=0;renderTrain()});
$("#clearLog").addEventListener("click",()=>$("#log").innerHTML="");
$("#playSeq").addEventListener("click",()=>{ensureAudio();const beat=60/+$("#tempo").value;eventTrain.forEach((x,i)=>{const t=audioCtx.currentTime+i*beat;if(x==="click")click(t);if(x==="ding")ding(t);if(x==="bell")bell(t,220);if(x==="nobell")noBell(t)})});

$$(".mode").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;$$(".mode").forEach(x=>x.classList.toggle("active",x===b));log(`Mode: ${mode}`)}));
$$(".tab").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.view;$$(".tab").forEach(x=>x.classList.toggle("active",x===b));$$(".panel").forEach(x=>x.classList.remove("active"));$("#"+v+"View").classList.add("active")}));

// 2D incidence model
function drawIncidence(){
 const svg=$("#incidenceSvg"), cx=450,cy=310,R=220;
 const pts=[...Array(5)].map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/5;return [cx+R*Math.cos(a),cy+R*Math.sin(a)]});
 const edges=[];for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)edges.push([i,j]);
 $("#c3Edges").innerHTML=edges.map(([i,j])=>`<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="#41414e" stroke-width="2"/>`).join("");
 $("#a4Nodes").innerHTML=pts.map((p,i)=>`<g class="a4-node" data-i="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="38" fill="#111117" stroke="#d7b45c" stroke-width="3"/><text x="${p[0]}" y="${p[1]+6}" text-anchor="middle" fill="#f2f0ea">A₄ ${i}</text></g>`).join("");
 const c5=[...Array(6)].map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/6;return [cx+125*Math.cos(a),cy+125*Math.sin(a)]});
 $("#c5Nodes").innerHTML=c5.map((p,i)=>`<g class="c5-node" data-i="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="22" fill="#171720" stroke="#8ba7ff" stroke-width="2"/><text x="${p[0]}" y="${p[1]+5}" text-anchor="middle" fill="#f2f0ea" font-size="12">C₅</text></g>`).join("");
 $("#bridgeSocket").innerHTML=`<circle cx="${cx}" cy="${cy}" r="76" fill="rgba(215,180,92,.05)" stroke="#c26d68" stroke-width="2" stroke-dasharray="8 7"/><text x="${cx}" y="${cy-8}" text-anchor="middle" fill="#f2f0ea">C₂ bridge</text><text x="${cx}" y="${cy+17}" text-anchor="middle" fill="#c26d68" font-size="13">NO BELL</text>`;
 $$(".a4-node").forEach(n=>n.addEventListener("click",()=>{addEvent("click");log(`A₄ sector ${n.dataset.i} selected`)}));
 $$(".c5-node").forEach(n=>n.addEventListener("click",()=>{addEvent("ding");log(`C₅ gate frame ${n.dataset.i} excited`)}));
}
drawIncidence();

// simple 3D canvas dodecahedron
const canvas=$("#geoCanvas"),ctx=canvas.getContext("2d"),phi=(1+Math.sqrt(5))/2,inv=1/phi;
const V=[];[-1,1].forEach(a=>[-1,1].forEach(b=>[-1,1].forEach(c=>V.push([a,b,c]))));
[-1,1].forEach(a=>[-1,1].forEach(b=>{V.push([0,a*inv,b*phi],[a*inv,b*phi,0],[a*phi,0,b*inv])}));
let minD=Infinity;for(let i=0;i<V.length;i++)for(let j=i+1;j<V.length;j++){const d=Math.hypot(...V[i].map((x,k)=>x-V[j][k]));if(d>1e-6)minD=Math.min(minD,d)}
const E=[];for(let i=0;i<V.length;i++)for(let j=i+1;j<V.length;j++){const d=Math.hypot(...V[i].map((x,k)=>x-V[j][k]));if(Math.abs(d-minD)<1e-5)E.push([i,j])}
let aA=0,aB=0,last=performance.now(),phase=0;
function proj(v,a,mirror,scale,rip){
 let [x,y,z]=v;if(mirror)x=-x;const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(.53),sb=Math.sin(.53);
 let X=x*ca-z*sa,Z=x*sa+z*ca,Y=y*cb-Z*sb;Z=y*sb+Z*cb;
 const rr=1+rip*Math.sin(phase+Math.atan2(y,x)*5);X*=rr;Y*=rr;Z*=rr;
 const f=1/(4.6-Z*.34);return [canvas.width/2+X*scale*f,canvas.height/2-Y*scale*f,Z]
}
function drawShell(angle,mirror,color,alpha,scale){
 const rip=+$("#ripple").value,P=V.map(v=>proj(v,angle,mirror,scale,rip));
 E.map(([i,j])=>[i,j,(P[i][2]+P[j][2])/2]).sort((a,b)=>a[2]-b[2]).forEach(([i,j])=>{ctx.beginPath();ctx.moveTo(P[i][0],P[i][1]);ctx.lineTo(P[j][0],P[j][1]);ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.lineWidth=mirror?1.3:2.2;ctx.stroke()});ctx.globalAlpha=1;
}
function frame(now){
 const dt=(now-last)/1000;last=now;if($("#autoScan").checked){aA+=dt*+$("#speedA").value;aB+=dt*+$("#speedB").value;phase+=dt*.8}
 ctx.clearRect(0,0,canvas.width,canvas.height);drawShell(aB,true,"#8ba7ff",.38,760);drawShell(aA,false,"#d7b45c",.9,700);
 if($("#showAxes").checked){ctx.save();ctx.translate(canvas.width/2,canvas.height/2);ctx.strokeStyle="rgba(242,240,234,.18)";for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(-245*Math.cos(a),-245*Math.sin(a));ctx.lineTo(245*Math.cos(a),245*Math.sin(a));ctx.stroke()}ctx.restore()}
 requestAnimationFrame(frame)
}
requestAnimationFrame(frame);
canvas.addEventListener("click",()=>addEvent(Math.random()>.72?"ding":"click"));

loadCore();
