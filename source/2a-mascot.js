/* ================= QUBI THE MASCOT + MOVING BACKGROUND ================= */
const QUBI=`<svg viewBox="0 -18 120 168" class="qubi" aria-hidden="true">
  <ellipse class="q-shadow" cx="60" cy="143" rx="30" ry="5" fill="#16233a" opacity=".15"/>
  <g class="q-stars"><path d="M8,20 l3,7 7,1 -5,5 1,7 -6,-3 -6,3 1,-7 -5,-5 7,-1z" fill="#ffb81f"/><path d="M104,48 l2,5 5,1 -4,3 1,5 -4,-2 -4,2 1,-5 -4,-3 5,-1z" fill="#45d08a"/><path d="M110,2 l2,5 5,1 -4,3 1,5 -4,-2 -4,2 1,-5 -4,-3 5,-1z" fill="#5f50ec"/></g>
  <g class="q-all">
    <g class="q-legs"><rect x="38" y="110" width="13" height="22" rx="6.5" fill="#16233a"/><rect x="69" y="110" width="13" height="22" rx="6.5" fill="#16233a"/></g>
    <g class="q-armL"><path d="M20,80 Q6,86 8,100" stroke="#16233a" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="8" cy="101" r="5" fill="#ff8a3d" stroke="#16233a" stroke-width="2.5"/></g>
    <g class="q-armR"><path d="M100,80 Q114,86 112,100" stroke="#16233a" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="112" cy="101" r="5" fill="#ff8a3d" stroke="#16233a" stroke-width="2.5"/></g>
    <line x1="60" y1="36" x2="60" y2="16" stroke="#16233a" stroke-width="3"/>
    <circle class="q-bulb" cx="60" cy="11" r="8" fill="#ffb81f" stroke="#16233a" stroke-width="2.5"/><path d="M56,11h8M60,7v8" stroke="#16233a" stroke-width="2.2"/>
    <rect x="16" y="34" width="88" height="82" rx="24" fill="#ff8a3d" stroke="#16233a" stroke-width="3.5"/>
    <rect x="26" y="44" width="68" height="52" rx="16" fill="#fff4e8" stroke="#16233a" stroke-width="2.5"/>
    <g class="q-eyes-open"><ellipse cx="46" cy="64" rx="6" ry="8" fill="#16233a"/><ellipse cx="74" cy="64" rx="6" ry="8" fill="#16233a"/><circle cx="48" cy="61" r="2.2" fill="#fff"/><circle cx="76" cy="61" r="2.2" fill="#fff"/></g>
    <path class="q-eyes-happy" d="M39,67 Q46,56 53,67 M67,67 Q74,56 81,67" stroke="#16233a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="35" cy="79" r="5" fill="#ff8fa3" opacity=".75"/><circle cx="85" cy="79" r="5" fill="#ff8fa3" opacity=".75"/>
    <path class="q-smile" d="M51,79 Q60,88 69,79" stroke="#16233a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path class="q-grin" d="M48,77 Q60,96 72,77 Z" fill="#16233a"/>
    <path class="q-wavy" d="M48,84 q4,-4 8,0 t8,0 t8,0" stroke="#16233a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <text x="60" y="110" text-anchor="middle" style="font:700 13px var(--display);fill:#16233a;opacity:.55">+ − × ÷</text>
    <g class="q-hat"><path d="M42,32 L60,-10 L78,32Z" fill="#5f50ec" stroke="#16233a" stroke-width="2.5"/><path d="M48,18 L72,18" stroke="#ffb81f" stroke-width="4"/><circle cx="60" cy="-11" r="5.5" fill="#ffb81f" stroke="#16233a" stroke-width="2"/></g>
  </g>
  <text class="q-qm" x="108" y="34" style="font:700 30px var(--display);fill:#5f50ec">?</text>
</svg>`;
const CHEER=['Yay! You got it!','Woohoo!','Maths magic!','High five!','Nailed it!','You’re a star!'];
const OOPS=['Hmm… so close!','Let’s read the working together.','Oops! Mistakes help us learn.'];
const RETRY=['Hmm… have another look!','Almost! One more try.','Think again. You can do it!'];
function qubi(id,state,say,hold){const m=$(id);if(!m)return;const svg=m.querySelector('.qubi');svg.classList.remove('idle','cheer','oops','party','wave');void svg.getBoundingClientRect();svg.classList.add(state);
  if(say!==undefined){const b=m.querySelector('.mbubble');b.textContent=say;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}
  clearTimeout(m._t);if(!hold&&state!=='idle'&&state!=='wave')m._t=setTimeout(()=>{const s=m.querySelector('.qubi');if(s&&s.classList.contains(state)){s.classList.remove(state);s.classList.add('idle')}},2600)}
const qubiBox=(id,say,state='idle')=>`<div class="mbox" id="${id}"><div class="mbubble">${say}</div>${QUBI.replace('class="qubi"',`class="qubi ${state}"`)}</div>`;

/* drifting maths symbols behind the page */
(()=>{const c=$('bgfx');if(!c)return;const x=c.getContext('2d'),SY=['+','−','×','÷','=','%','π','½','¾','∠','7','3','9','<','>','√'],COL=['#0b968b','#ef5240','#ffb81f','#5f50ec'];let W,H,items=[];
  const size=()=>{W=c.width=innerWidth*devicePixelRatio;H=c.height=innerHeight*devicePixelRatio};size();addEventListener('resize',size);
  for(let i=0;i<26;i++)items.push({x:Math.random(),y:Math.random(),s:18+Math.random()*30,v:.00012+Math.random()*.00025,r:Math.random()*6,vr:(Math.random()-.5)*.004,t:pick(SY),c:pick(COL),a:.10+Math.random()*.12});
  const draw=()=>{x.clearRect(0,0,W,H);items.forEach(p=>{x.save();x.globalAlpha=p.a;x.translate(p.x*W,p.y*H);x.rotate(p.r);x.fillStyle=p.c;x.font=`700 ${p.s*devicePixelRatio}px Fredoka, system-ui, sans-serif`;x.textAlign='center';x.fillText(p.t,0,0);x.restore()})};
  const step=()=>{items.forEach(p=>{p.y-=p.v*16;p.r+=p.vr;if(p.y<-.05){p.y=1.05;p.x=Math.random()}});draw();requestAnimationFrame(step)};
  calm?draw():requestAnimationFrame(step)})();
