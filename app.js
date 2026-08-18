const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const on=(selector,event,handler)=>{
  const el=$(selector);
  if(!el){ console.warn(`[MARL v1.2] missing optional control ${selector}`); return null; }
  el.addEventListener(event,handler);
  return el;
};
const setText=(selector,text)=>{ const el=$(selector); if(el) el.textContent=text; };
window.addEventListener("error",e=>{
  console.error("[MARL v1.2 runtime]", e.error || e.message);
  const hint=$("#audioHint");
  if(hint) hint.textContent="A module reported an error; basic view navigation remains available.";
});
let CORE=null,audioCtx=null,masterGain=null,audioUnlocked=false;
let eventTrain=[],savedTrains=[],transportToken=0,isLooping=false,performanceToken=0,performanceLooping=false;
let liveEnergy=0,scanEnergy=0,lastScanEvent=0,lastScanClass="none";
let captureActive=false,captureEvents=[],captureTrailA=[],captureTrailB=[];
let referenceA={x:.38,y:.50},referenceB={x:.62,y:.50};
let activeRef="A";
let voiceAOn=true,voiceBOn=true,geometryBusOn=true,mercBusOn=true;


function loadCore(){
  CORE={version:"1.2.0",canonicalCore:"ROCK · PETRIFIED"};
  const rev=$("#coreRevision"); if(rev) rev.textContent=CORE.canonicalCore;
}
function flashEvent(type){
  const ids={click:"#eventClick",ding:"#eventDing",bell:"#eventBell",nobell:"#eventNoBell"};
  const el=$(ids[type]); if(!el) return;
  el.classList.add("active");
  setTimeout(()=>el.classList.remove("active"),180);
}
function log(msg){const d=document.createElement("div");d.className="logline";d.textContent=`${new Date().toLocaleTimeString()}  ${msg}`;$("#log").prepend(d)}
async function ensureAudio(){
 if(!audioCtx){
   audioCtx=new (window.AudioContext||window.webkitAudioContext)();
   masterGain=audioCtx.createGain();masterGain.connect(audioCtx.destination);masterGain.gain.value=1;
 }
 if(audioCtx.state==="suspended")try{await audioCtx.resume()}catch(e){}
 audioUnlocked=audioCtx.state==="running";
 if(audioUnlocked)$("#audioHint").textContent="Sound is live.";
 return audioUnlocked;
}
["pointerdown","keydown","touchstart"].forEach(evt=>window.addEventListener(evt,()=>ensureAudio(),{once:true,capture:true}));

function noiseBurst(t,dur=.025,gain=.25){
 if(!audioCtx||!masterGain)return;
 const len=Math.max(1,Math.floor(audioCtx.sampleRate*dur)),b=audioCtx.createBuffer(1,len,audioCtx.sampleRate),a=b.getChannelData(0);
 for(let i=0;i<len;i++)a[i]=(Math.random()*2-1)*(1-i/len);
 const s=audioCtx.createBufferSource(),g=audioCtx.createGain(),f=audioCtx.createBiquadFilter();s.buffer=b;f.type="highpass";f.frequency.value=1600;
 g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f).connect(g).connect(masterGain);s.start(t);
}
function tone(freq,t,dur=.35,gain=.16,type="sine",detune=0){
 if(!audioCtx||!masterGain)return;
 const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.detune.setValueAtTime(detune,t);
 g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(masterGain);o.start(t);o.stop(t+dur);
}

function busAllowed(bus){
  if(bus==="geometry" && !geometryBusOn) return false;
  if(bus==="merc" && !mercBusOn) return false;
  return true;
}

function click(t=audioCtx.currentTime){flashEvent("click");noiseBurst(t,.018,.18);tone(950,t,.035,.055,"square")}
function noBell(t=audioCtx.currentTime){flashEvent("nobell");tone(92,t,.18,.08,"triangle");noiseBurst(t,.05,.06)}

const PENTA=[0,2,4,7,9];
function pentatonicFromRef(ref,root=220){
 const degree=Math.min(4,Math.max(0,Math.floor(ref.x*5)));
 const octave=Math.min(2,Math.max(-1,Math.floor((1-ref.y)*4)-1));
 const semis=PENTA[degree]+12*octave;
 return {degree,octave,semis,freq:root*Math.pow(2,semis/12)};
}
function intervalLabel(a,b){
 const d=((b.semis-a.semis)%12+12)%12;
 const names={0:"unison",2:"major 2nd",3:"minor 3rd",4:"major 3rd",5:"fourth",7:"fifth",8:"minor 6th",9:"major 6th",10:"minor 7th"};
 return names[d]||`${d} semitones`;
}
function relationState(scoreA,scoreB){
 const diff=Math.abs(scoreA-scoreB);
 const phase=Math.abs(Math.sin((aA-aB)/2));
 const harmonic=(diff<.22 && phase<.58);
 const detune=harmonic?0:Math.min(42,8+phase*34+diff*18);
 return {harmonic,detune,phase,diff};
}
function dingPair(pA,pB,rel,t=audioCtx.currentTime,bus="merc"){
 if(!busAllowed(bus)) return;
 flashEvent("ding");
 if(voiceAOn){
   tone(pA.freq,t,.72,.10,"sine",0);
   tone(pA.freq*2,t,.32,.025,"sine",0);
 }
 if(voiceBOn){
   tone(pB.freq,t,.72,.09,"sine",rel.harmonic?0:(referenceB.x>=referenceA.x?rel.detune:-rel.detune));
   tone(pB.freq*2,t,.28,.018,"sine",rel.harmonic?0:(referenceB.x>=referenceA.x?rel.detune:-rel.detune));
 }
}
function bellChord(pA,pB,rel,t=audioCtx.currentTime,bus="merc"){
 if(!busAllowed(bus)) return;
 flashEvent("bell");
 if(voiceAOn){
   tone(pA.freq,t,2.4,.10,"sine",0);
   tone(pA.freq*2,t,1.9,.05,"sine",0);
   tone(pA.freq*2.72,t,1.45,.03,"sine",0);
 }
 if(voiceBOn){
   const d=rel.harmonic?0:(referenceB.x>=referenceA.x?rel.detune:-rel.detune);
   tone(pB.freq,t,2.4,.09,"sine",d);
   tone(pB.freq*2,t,1.9,.045,"sine",d);
   tone(pB.freq*2.72,t,1.45,.028,"sine",d);
 }
}

function threshold(){return +$("#bellThreshold").value}
function growth(){return +$("#growth").value}
function contribution(type,ordinal){return type==="click"?.55*Math.pow(growth(),ordinal):type==="ding"?.80*Math.pow(growth(),ordinal):0}
function durationFor(type){const beat=60/(+$("#tempo").value||108),rate=type==="click"?+$("#clickRate").value:type==="ding"?+$("#dingRate").value:+$("#noBellRate").value;return beat/Math.max(.01,rate)}
function currentHarmony(){
 const pA=pentatonicFromRef(referenceA),pB=pentatonicFromRef(referenceB);
 const rel=relationState(lastScoreA||0,lastScoreB||0);
 return {pA,pB,rel};
}
async function ringBell(source="closure",bus="merc"){
 await ensureAudio();const {pA,pB,rel}=currentHarmony();bellChord(pA,pB,rel,audioCtx.currentTime,bus);
 $("#bellStatusPad").classList.add("active");setTimeout(()=>$("#bellStatusPad").classList.remove("active"),420);log(`BELL · ${source} · ${intervalLabel(pA,pB)}`);
}
async function soundEvent(type,source="manual",record=true,bus="merc"){
 await ensureAudio();
 if(type==="click")click();
 else if(type==="ding"){const {pA,pB,rel}=currentHarmony();dingPair(pA,pB,rel,audioCtx.currentTime,bus)}
 else if(type==="nobell")noBell();
 if(record){eventTrain.push(type);renderTrain()}
 log(`${type.toUpperCase()} · ${source}`);
}
async function addEvent(type){
 if(type==="bell")return;
 if(type==="nobell"){liveEnergy=0;await soundEvent(type,"manual",true,"merc");return}
 liveEnergy+=contribution(type,eventTrain.length);await soundEvent(type,"manual",true,"merc");
 if(liveEnergy>=threshold()){await ringBell("live threshold");liveEnergy=0}
}
$$(".pad[data-sound]").forEach(b=>b.addEventListener("click",()=>addEvent(b.dataset.sound)));
$$("[data-perf-sound]").forEach(b=>b.addEventListener("click",()=>{if($("#armPads").checked)soundEvent(b.dataset.perfSound,"performance pad",false,"merc")}));


function syncVoiceButtons(){
  ["#ocarinaMuteA","#performMuteA"].forEach(s=>{const b=$(s);if(b){b.textContent=`A: ${voiceAOn?"ON":"MUTED"}`;b.classList.toggle("muted",!voiceAOn)}});
  ["#ocarinaMuteB","#performMuteB"].forEach(s=>{const b=$(s);if(b){b.textContent=`B: ${voiceBOn?"ON":"MUTED"}`;b.classList.toggle("muted",!voiceBOn)}});
  const a=$("#muteA"),b=$("#muteB");
  if(a)a.checked=!voiceAOn;
  if(b)b.checked=!voiceBOn;
}
function toggleVoice(which){
  if(which==="A") voiceAOn=!voiceAOn; else voiceBOn=!voiceBOn;
  syncVoiceButtons();
}
on("#ocarinaMuteA","click",()=>toggleVoice("A"));
on("#ocarinaMuteB","click",()=>toggleVoice("B"));
on("#performMuteA","click",()=>toggleVoice("A"));
on("#performMuteB","click",()=>toggleVoice("B"));
on("#muteA","change",e=>{voiceAOn=!e.target.checked;syncVoiceButtons()});
on("#muteB","change",e=>{voiceBOn=!e.target.checked;syncVoiceButtons()});

function renderTrain(){
 const box=$("#eventTrain");box.innerHTML="";
 if(!eventTrain.length){box.textContent="— empty —";return}
 eventTrain.forEach((type,i)=>{
   const chip=document.createElement("span");chip.className=`event-chip ${type}`;
   chip.innerHTML=`<span>${type==="nobell"?"NO BELL":type}</span><button>←</button><button>→</button><button>×</button>`;
   const [l,r,x]=chip.querySelectorAll("button");
   l.onclick=()=>{if(i>0){[eventTrain[i-1],eventTrain[i]]=[eventTrain[i],eventTrain[i-1]];renderTrain()}};
   r.onclick=()=>{if(i<eventTrain.length-1){[eventTrain[i+1],eventTrain[i]]=[eventTrain[i],eventTrain[i+1]];renderTrain()}};
   x.onclick=()=>{eventTrain.splice(i,1);renderTrain()};
   box.appendChild(chip);
 });
}
function renderSaved(){
 const box=$("#savedTrains");box.innerHTML="";
 if(!savedTrains.length)box.innerHTML='<span class="caption">No saved trains this session.</span>';
 savedTrains.forEach((tr,i)=>{
  const row=document.createElement("div");row.className="saved-train";
  row.innerHTML=`<code>${tr.name}: ${tr.events.map(x=>x==="nobell"?"NO BELL":x).join(" · ")}</code>
  <div class="saved-actions"><button>Load</button><button>Duplicate</button><button>Delete</button></div>`;
  const [load,dup,del]=row.querySelectorAll("button");
  load.onclick=()=>{eventTrain=[...tr.events];renderTrain();log(`Loaded ${tr.name}`)};
  dup.onclick=()=>{savedTrains.push({...tr,name:`Train ${savedTrains.length+1}`,events:[...tr.events]});renderSaved();renderPerformTracks()};
  del.onclick=()=>{savedTrains.splice(i,1);renderSaved();renderPerformTracks()};
  box.appendChild(row);
 });
}
$("#saveSeq").onclick=()=>{if(!eventTrain.length)return;savedTrains.push({name:`Train ${savedTrains.length+1}`,events:[...eventTrain],muted:false,solo:false,source:"ocarina"});renderSaved();renderPerformTracks()};
$("#clearSeq").onclick=()=>{stopTransport();eventTrain=[];liveEnergy=0;renderTrain()};
$("#clearLog").onclick=()=>$("#log").innerHTML="";

function stopTransport(){transportToken++;isLooping=false;$("#loopSeq").classList.remove("active");$("#loopStatus").classList.remove("running");$("#loopStatus").textContent="Stopped"}
$("#stopSeq").onclick=stopTransport;
function sleep(ms,token,kind="transport"){return new Promise(resolve=>setTimeout(()=>resolve(kind==="transport"?token===transportToken:token===performanceToken),Math.max(0,ms)))}
async function playTrain(events,token,cycle=0,kind="transport"){
 let e=0,ord=0;if(!events.length)return false;
 for(let i=0;i<events.length;i++){
  const valid=kind==="transport"?token===transportToken:token===performanceToken;if(!valid)return false;
  const type=events[i];await ensureAudio();
  if(type==="click"){click();e+=contribution(type,ord++)}
  else if(type==="ding"){const h=currentHarmony();dingPair(h.pA,h.pB,h.rel,audioCtx.currentTime,"merc");e+=contribution(type,ord++)}
  else{noBell();e=0;ord=0}
  if(e>=threshold()){await sleep(65,token,kind);const still=kind==="transport"?token===transportToken:token===performanceToken;if(!still)return false;await ringBell(`${kind} threshold`,"merc");e=0;ord=0}
  if(kind==="transport")$("#loopStatus").textContent=`Cycle ${cycle+1} · energy ${e.toFixed(2)} / ${threshold().toFixed(1)}`;
  if(!(await sleep(durationFor(type)*1000,token,kind)))return false;
 }
 return true;
}
$("#playSeq").onclick=async()=>{stopTransport();const token=++transportToken;$("#loopStatus").classList.add("running");await playTrain(eventTrain,token,0);if(token===transportToken){$("#loopStatus").classList.remove("running");$("#loopStatus").textContent="Finished"}};
$("#loopSeq").onclick=async()=>{if(isLooping){stopTransport();return}if(!eventTrain.length)return;isLooping=true;let cycle=0;const token=++transportToken;$("#loopSeq").classList.add("active");$("#loopStatus").classList.add("running");while(isLooping&&token===transportToken)if(!(await playTrain(eventTrain,token,cycle++)))break};

function bindOut(id,out,fmt=v=>v){const el=$(id),o=$(out),update=()=>o.textContent=fmt(el.value);el.addEventListener("input",update);update()}
bindOut("#tempo","#tempoOut",v=>v);bindOut("#clickRate","#clickRateOut",v=>(+v).toFixed(2)+"×");bindOut("#dingRate","#dingRateOut",v=>(+v).toFixed(2)+"×");bindOut("#noBellRate","#noBellRateOut",v=>(+v).toFixed(2)+"×");bindOut("#bellThreshold","#bellThresholdOut",v=>(+v).toFixed(1));bindOut("#growth","#growthOut",v=>(+v).toFixed(2)+"×");

bindOut("#speedA","#speedAOut",v=>(+v).toFixed(2));
bindOut("#speedB","#speedBOut",v=>(+v).toFixed(2));
bindOut("#ripple","#rippleOut",v=>(+v).toFixed(3));
bindOut("#scanRate","#scanRateOut",v=>`${v} ms`);


$$(".tab").forEach(b=>b.onclick=()=>{
 const v=b.dataset.view;
 if(window.MARLActivateView) window.MARLActivateView(v);
 else {
   $$(".tab").forEach(x=>x.classList.toggle("active",x===b));
   $$(".panel").forEach(x=>x.classList.remove("active"));
   const target=$("#"+v+"View"); if(target) target.classList.add("active");
 }
 if(v==="perform"){renderPerformTracks();drawPerformIncidence()}
});

// incidence
function incidenceMarkup(){
 const cx=450,cy=310,R=220,pts=[...Array(5)].map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/5;return[cx+R*Math.cos(a),cy+R*Math.sin(a)]});
 const edges=[];for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)edges.push([i,j]);
 const c5=[...Array(6)].map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/6;return[cx+125*Math.cos(a),cy+125*Math.sin(a)]});
 return `${edges.map(([i,j])=>`<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="#41414e" stroke-width="2"/>`).join("")}
 ${pts.map((p,i)=>`<g class="inc-a4" data-i="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="38" fill="#111117" stroke="#d7b45c" stroke-width="3"/><text x="${p[0]}" y="${p[1]+6}" text-anchor="middle" fill="#f2f0ea">A₄ ${i}</text></g>`).join("")}
 ${c5.map((p,i)=>`<g class="inc-c5" data-i="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="22" fill="#171720" stroke="#8ba7ff" stroke-width="2"/><text x="${p[0]}" y="${p[1]+5}" text-anchor="middle" fill="#f2f0ea" font-size="12">C₅</text></g>`).join("")}
 <circle cx="${cx}" cy="${cy}" r="76" fill="rgba(215,180,92,.05)" stroke="#c26d68" stroke-width="2" stroke-dasharray="8 7"/><text x="${cx}" y="${cy-8}" text-anchor="middle" fill="#f2f0ea">C₂ bridge</text><text x="${cx}" y="${cy+17}" text-anchor="middle" fill="#c26d68" font-size="13">NO BELL</text>`;
}
function wireIncidence(svg,perform=false){
 svg.querySelectorAll(".inc-a4").forEach(n=>n.onclick=()=>{if(!perform||$("#armIncidence").checked)soundEvent("click",`A₄ sector ${n.dataset.i}`,!perform)});
 svg.querySelectorAll(".inc-c5").forEach(n=>n.onclick=()=>{if(!perform||$("#armIncidence").checked)soundEvent("ding",`C₅ gate ${n.dataset.i}`,!perform)});
}
$("#incidenceSvg").innerHTML=incidenceMarkup();wireIncidence($("#incidenceSvg"),false);
function drawPerformIncidence(){$("#performIncidenceSvg").innerHTML=incidenceMarkup();wireIncidence($("#performIncidenceSvg"),true)}

// geometry
const phi=(1+Math.sqrt(5))/2,inv=1/phi,V=[];[-1,1].forEach(a=>[-1,1].forEach(b=>[-1,1].forEach(c=>V.push([a,b,c]))));[-1,1].forEach(a=>[-1,1].forEach(b=>{V.push([0,a*inv,b*phi],[a*inv,b*phi,0],[a*phi,0,b*inv])}));
let minD=Infinity;for(let i=0;i<V.length;i++)for(let j=i+1;j<V.length;j++){const d=Math.hypot(...V[i].map((x,k)=>x-V[j][k]));if(d>1e-6)minD=Math.min(minD,d)}
const E=[];for(let i=0;i<V.length;i++)for(let j=i+1;j<V.length;j++){const d=Math.hypot(...V[i].map((x,k)=>x-V[j][k]));if(Math.abs(d-minD)<1e-5)E.push([i,j])}
let aA=0,aB=0,last=performance.now(),phase=0,lastScoreA=0,lastScoreB=0;
function proj(v,a,mirror,w,h,scale,rip){let[x,y,z]=v;if(mirror)x=-x;const ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(.53),sb=Math.sin(.53);let X=x*ca-z*sa,Z=x*sa+z*ca,Y=y*cb-Z*sb;Z=y*sb+Z*cb;const rr=1+rip*Math.sin(phase+Math.atan2(y,x)*5);X*=rr;Y*=rr;Z*=rr;const f=1/(4.6-Z*.34);return[w/2+X*scale*f,h/2-Y*scale*f,Z]}
function drawGeometry(canvas,ctx,performance=false){
 const rip=+$("#ripple").value,w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
 const P_B=V.map(v=>proj(v,aB,true,w,h,760,rip)),P_A=V.map(v=>proj(v,aA,false,w,h,700,rip));
 [[P_B,"#8ba7ff",.38,1.3],[P_A,"#d7b45c",.9,2.2]].forEach(([P,color,alpha,width])=>{
 E.map(([i,j])=>[i,j,(P[i][2]+P[j][2])/2]).sort((a,b)=>a[2]-b[2]).forEach(([i,j])=>{ctx.beginPath();ctx.moveTo(P[i][0],P[i][1]);ctx.lineTo(P[j][0],P[j][1]);ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.lineWidth=width;ctx.stroke()});ctx.globalAlpha=1;
 });
 if($("#showAxes").checked){ctx.save();ctx.translate(w/2,h/2);ctx.strokeStyle="rgba(242,240,234,.18)";for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(-245*Math.cos(a),-245*Math.sin(a));ctx.lineTo(245*Math.cos(a),245*Math.sin(a));ctx.stroke()}ctx.restore()}
 function drawRef(ref,color,label,trail){
   const x=ref.x*w,y=ref.y*h;
   if(performance&&$("#showTrails").checked&&trail.length>1){ctx.beginPath();trail.forEach((p,i)=>i?ctx.lineTo(p.x*w,p.y*h):ctx.moveTo(p.x*w,p.y*h));ctx.strokeStyle=color;ctx.globalAlpha=.24;ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=1}
   ctx.beginPath();ctx.arc(x,y,12,0,Math.PI*2);ctx.fillStyle="rgba(9,9,12,.75)";ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=3;ctx.stroke();ctx.fillStyle=color;ctx.font="14px ui-monospace";ctx.fillText(label,x+16,y-12);
 }
 drawRef(referenceA,"#d7b45c","A",captureTrailA);drawRef(referenceB,"#8ba7ff","B",captureTrailB);
 const nearest=(P,ref)=>{const rx=ref.x*w,ry=ref.y*h;let n=Infinity;P.forEach(p=>n=Math.min(n,Math.hypot(p[0]-rx,p[1]-ry)));return Math.max(0,1-n/115)};
 return {scoreA:nearest(P_A,referenceA),scoreB:nearest(P_B,referenceB)};
}
function updateReadouts(){
 const pA=pentatonicFromRef(referenceA),pB=pentatonicFromRef(referenceB),rel=relationState(lastScoreA,lastScoreB);
 const iv=intervalLabel(pA,pB),rs=rel.harmonic?"harmonic":"dissonant";
 $("#refAReadout").textContent=`${referenceA.x.toFixed(2)}, ${referenceA.y.toFixed(2)}`;$("#refBReadout").textContent=`${referenceB.x.toFixed(2)}, ${referenceB.y.toFixed(2)}`;
 $("#intervalReadout").textContent=iv;$("#relationReadout").textContent=rs;$("#performInterval").textContent=iv;$("#performRelation").textContent=rs;
}
function setReference(canvas,e){
 const r=canvas.getBoundingClientRect(),nx=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),ny=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
 const dA=Math.hypot(nx-referenceA.x,ny-referenceA.y),dB=Math.hypot(nx-referenceB.x,ny-referenceB.y);
 if(e.type==="pointerdown")activeRef=dA<=dB?"A":"B";
 if(activeRef==="A"){referenceA={x:nx,y:ny};if(captureActive)captureTrailA.push({...referenceA})}
 else{referenceB={x:nx,y:ny};if(captureActive)captureTrailB.push({...referenceB})}
 updateReadouts();
}
[$("#geoCanvas"),$("#performGeoCanvas")].forEach(c=>{let drag=false;c.onpointerdown=e=>{drag=true;c.setPointerCapture(e.pointerId);setReference(c,e)};c.onpointermove=e=>{if(drag)setReference(c,e)};c.onpointerup=()=>drag=false});
$("#resetReferences").onclick=()=>{referenceA={x:.38,y:.5};referenceB={x:.62,y:.5};updateReadouts()};

async function maybeScanEvent(now,performanceVisible){
 if(!audioUnlocked)return;
 const rate=+$("#scanRate").value;
 if(now-lastScanEvent<rate)return;
 const combined=(lastScoreA+lastScoreB)/2,rel=relationState(lastScoreA,lastScoreB);
 let cls=combined>.81?"ding":combined>.60?"click":"none";
 if(cls==="none"){lastScanClass="none";return}
 if(cls!==lastScanClass||now-lastScanEvent>rate*2){
   lastScanEvent=now;lastScanClass=cls;
   const inGeometry=$("#geometryView").classList.contains("active");
   const inPerform=$("#performView").classList.contains("active")&&$("#armGeometry").checked;
   if(!(inGeometry||inPerform)||!geometryBusOn)return;
   if(cls==="click"){click();scanEnergy+=.55}
   else{const h=currentHarmony();dingPair(h.pA,h.pB,h.rel,audioCtx.currentTime,"geometry");scanEnergy+=.85}
   if(inPerform&&captureActive){captureEvents.push(cls);renderCapturePath()}
   if(scanEnergy>=threshold()){await ringBell("geometry closure","geometry");scanEnergy=0;if(inPerform&&captureActive){captureEvents.push("bell");renderCapturePath()}}
 }
}
function renderCapturePath(){
 if(!$("#showEventPath").checked){$("#capturedEventPath").textContent="";return}
 $("#capturedEventPath").textContent=captureEvents.length?captureEvents.map(x=>x==="bell"?"BELL":x.toUpperCase()).join(" · "):"— no captured events yet —";
}

function frame(now){
 const dt=(now-last)/1000;last=now;if($("#autoScan").checked){aA+=dt*+$("#speedA").value;aB+=dt*+$("#speedB").value;phase+=dt*.8}
 const g=drawGeometry($("#geoCanvas"),$("#geoCanvas").getContext("2d"),false);
 const p=drawGeometry($("#performGeoCanvas"),$("#performGeoCanvas").getContext("2d"),true);
 lastScoreA=g.scoreA;lastScoreB=g.scoreB;updateReadouts();maybeScanEvent(now);requestAnimationFrame(frame)
}
requestAnimationFrame(frame);

// capture
$("#captureReference").onclick=()=>{captureActive=true;captureEvents=[];captureTrailA=[{...referenceA}];captureTrailB=[{...referenceB}];$("#captureStatus").textContent="recording";$("#captureReference").disabled=true;$("#stopCapture").disabled=false;renderCapturePath();log("Reference capture started")};
$("#stopCapture").onclick=()=>{if(!captureActive)return;captureActive=false;$("#captureStatus").textContent="off";$("#captureReference").disabled=false;$("#stopCapture").disabled=true;
 const musicalEvents=captureEvents.filter(x=>x!=="bell");
 if(musicalEvents.length){savedTrains.push({name:`Ref ${savedTrains.length+1}`,events:musicalEvents,muted:false,solo:false,source:"reference",trailA:[...captureTrailA],trailB:[...captureTrailB]});renderSaved();renderPerformTracks();log("Captured reference became a saved train")}
};

// performance Mercs
function renderPerformTracks(){
 const box=$("#performTracks");box.innerHTML="";
 if(!savedTrains.length){box.innerHTML='<span class="caption">Save Ocarina trains or capture a reference phrase to create Mercs.</span>';return}
 savedTrains.forEach((tr,i)=>{
   const row=document.createElement("div");row.className=`track-row ${tr.muted?"muted":""} ${tr.solo?"solo":""}`;
   row.innerHTML=`<div><strong>${tr.name}</strong> <small>${tr.source||"ocarina"}</small><br><code>${tr.events.join(" · ")}</code></div>
   <div class="track-controls"><button data-action="mute">${tr.muted?"Unmute":"Mute"}</button><button data-action="solo">${tr.solo?"Unsolo":"Solo"}</button><button data-action="load">Load</button><button data-action="delete">Delete</button></div>`;
   row.querySelector('[data-action="mute"]').onclick=()=>{tr.muted=!tr.muted;renderPerformTracks()};
   row.querySelector('[data-action="solo"]').onclick=()=>{tr.solo=!tr.solo;renderPerformTracks()};
   row.querySelector('[data-action="load"]').onclick=()=>{eventTrain=[...tr.events];renderTrain()};
   row.querySelector('[data-action="delete"]').onclick=()=>{savedTrains.splice(i,1);renderSaved();renderPerformTracks()};
   box.appendChild(row);
 });
}
function audibleTracks(){const solo=savedTrains.filter(t=>t.solo&&!t.muted);return solo.length?solo:savedTrains.filter(t=>!t.muted)}
function stopPerformance(){performanceToken++;performanceLooping=false;$("#loopSelected").classList.remove("active")}


function syncBusButtons(){
  const g=$("#muteGeometry");
  if(g){g.textContent=geometryBusOn?"Mute Geometry":"Listen Geometry";g.classList.toggle("muted",!geometryBusOn)}
  const m=$("#muteMercs");
  if(m){m.textContent=mercBusOn?"Mute Mercs":"Listen Mercs";m.classList.toggle("muted",!mercBusOn)}
}
on("#muteGeometry","click",()=>{geometryBusOn=!geometryBusOn;syncBusButtons()});
on("#muteMercs","click",()=>{mercBusOn=!mercBusOn;syncBusButtons()});

async function playStack(loop=false){
 const Mercs=audibleTracks();if(!Mercs.length)return;stopPerformance();performanceLooping=loop;const token=++performanceToken;if(loop)$("#loopSelected").classList.add("active");
 do{await Promise.all(Mercs.map((tr,i)=>new Promise(res=>setTimeout(()=>playTrain(tr.events,token,0,"performance").then(res),i*35))))}while(loop&&performanceLooping&&token===performanceToken)
}
$("#playSelected").onclick=()=>playStack(false);
$("#loopSelected").onclick=()=>{if(performanceLooping)stopPerformance();else playStack(true)};

renderTrain();renderSaved();drawPerformIncidence();updateReadouts();syncVoiceButtons();syncBusButtons();loadCore();


console.info("[MARL] Musical Atlas Relational Lattice v1.2 booted");
