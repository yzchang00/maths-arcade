/* ---------- Sec 1 · Prime Bouncer: prime and composite numbers ----------
   A queue outside the "PRIMES ONLY" club. Each guest steps forward and hands over a card with its name (a number).
   Let it in or turn it away. Right: a prime jumps for joy and goes in; a composite walks off sad.
   Wrong: a composite sneaks in and gets kicked out (or a real prime is turned away), the manager scolds you, and a NEW guest
   comes forward. There is no second try: the round is only complete when you get a guest right. Help (equal rows, divisibility
   tests, a nudge) is only shown when the pupil asks for a hint. Round types follow the usual mistakes:
   warm-up · 1 and 2 · odd impostors · numbers ending in 1, 3, 7, 9 · the 7 trap · big numbers · squares of primes · mixed. */
document.head.insertAdjacentHTML('beforeend',`<style>
.pbscene{position:relative;height:250px;max-width:760px;margin:0 auto;width:100%;border:3px solid #16233a;border-radius:18px;overflow:hidden;background:linear-gradient(#2b2560 0 62%,#3b3247 62%);--g:64px}
@media (max-width:600px){.pbscene{height:220px;--g:50px}}
.pbdoor{position:absolute;right:3%;bottom:38%;width:16%;min-width:64px;height:40%;background:#0e0b1f;border:4px solid #d4af37;border-bottom:0;border-radius:40px 40px 0 0;box-shadow:inset 0 0 22px #ffb81f55}
.pbneon{position:absolute;right:1%;top:4%;font:700 clamp(13px,3.2vw,19px) var(--display);letter-spacing:.1em;color:#ffd257;text-shadow:0 0 6px #ffb81f,0 0 16px #ff8a3d;border:2.5px solid #ffd257;border-radius:10px;padding:1px 10px;box-shadow:0 0 12px #ffb81f88}
.pbmgr{position:absolute;right:21%;bottom:30%;width:calc(var(--g)*1.05)}.pbmgr svg{width:100%;height:auto}
.pbsay{position:absolute;left:22%;top:5%;max-width:min(48%,300px);background:#fff;color:#16233a;border:2.5px solid #16233a;border-radius:14px;padding:5px 10px;font:800 13px/1.3 var(--body);box-shadow:3px 3px 0 #16233a;opacity:0;transform:scale(.8);transition:.2s;z-index:13}
.pbsay.on{opacity:1;transform:none}.pbsay.mad{background:#ffe1dc;border-color:#c2410c}
.pbguy{position:absolute;bottom:14%;left:2%;width:var(--g);transition:left .9s ease,bottom .5s ease,opacity .5s,transform .5s;z-index:3}
.pbguy svg{width:100%;height:auto;display:block}.pbguy.wait{opacity:.85;filter:saturate(.7)}
.pbguy .m,.pbguy .e2,.pbguy .tear{display:none}.pbguy .m0{display:inline}
.pbguy.happy .m0{display:none}.pbguy.happy .m1{display:inline}.pbguy.happy .e1{display:none}.pbguy.happy .e2.hp{display:inline}
.pbguy.sad .m0{display:none}.pbguy.sad .m2{display:inline}.pbguy.sad .tear{display:inline}
.pbguy.sly .m0{display:none}.pbguy.sly .m3{display:inline}.pbguy.sly .e1{display:none}.pbguy.sly .e2.sl{display:inline}
.pbguy.jump{animation:pbjump .45s ease 2}.pbguy.tip{animation:pbtip .3s ease-in-out infinite}
.pbguy.kick{transition:left .7s cubic-bezier(.2,.8,.3,1),bottom .7s ease,transform .7s;transform:rotate(-540deg) scale(.8)}
@keyframes pbjump{50%{transform:translateY(-34px)}}@keyframes pbtip{50%{transform:translateY(-5px) rotate(-4deg)}}
.pbcard{position:absolute;left:50%;top:6%;color:#16233a;transform:translateX(-50%) scale(.3) rotate(-12deg);opacity:0;transition:left .6s ease,top .6s ease,transform .55s cubic-bezier(.3,1.4,.5,1),opacity .2s;transform-origin:50% 50%;background:#fff;border:3px solid #16233a;border-radius:14px;padding:4px 16px 6px;text-align:center;box-shadow:4px 4px 0 #ff8a3d;z-index:12;min-width:118px}
.pbcard.on{opacity:1;transform:translateX(-50%) scale(1) rotate(-3deg)}.pbcard.hand{opacity:1;transform:translateX(-50%) scale(.2) rotate(12deg)}.pbcard.give{opacity:1;transform:translateX(-50%) scale(.26) rotate(-10deg)}.pbmgr.pbhop{animation:pbjump .4s ease}.pbcard span{display:block;font:800 11px var(--body);letter-spacing:.1em;text-transform:uppercase;color:#5b6475}.pbcard b{font:700 clamp(2rem,8vw,2.8rem)/1.05 var(--display);color:#16233a}
.pbboom{position:absolute;font-size:34px;z-index:14;left:78%;bottom:40%;animation:pbboom .6s ease both}@keyframes pbboom{0%{transform:scale(.2);opacity:0}40%{transform:scale(1.4);opacity:1}100%{transform:scale(1);opacity:0}}
.pbask{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;justify-items:center;text-align:center}.pbask .qt{margin:0}
.pbbtns{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:520px}.pbbtns .btn{font-size:1.15rem;padding:12px}
.pbwrong{background:#ffe9e4;color:#16233a;border:2.5px solid #c2410c;border-radius:14px;padding:10px 14px;max-width:620px;font:600 15px/1.5 var(--body);text-align:left;display:grid;gap:6px}.pbwrong b{color:#16233a}.pbwrong .pbwhy{background:#fff;border-radius:10px;padding:8px 10px;border:2px solid #f3c1b6}.pbwrong .pbfac{font-weight:800;color:#5f50ec}
.pbhintbox{background:var(--bg);color:var(--ink);border-left:5px solid #ffd257;border-radius:10px;padding:8px 12px;max-width:620px;font:600 14px/1.45 var(--body);text-align:left;width:100%;box-sizing:border-box}
.pbtiles{display:grid;gap:8px;justify-items:center;margin-top:6px}.pbtiles svg{width:100%;max-width:440px;height:auto;display:block;background:#eef6ff;border:2.5px solid #2c3446;border-radius:12px}
.pbctl{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center}.pbctl .btn{min-height:34px;padding:4px 10px;font-size:13px}.pbctl .btn[aria-pressed="true"]{background:var(--ink);color:var(--bg)}
.pbmsg{font:800 14px var(--body);text-align:center;margin:0}
.pbnote{background:#fff3cc;color:#16233a;border:2px solid #ffb81f;border-radius:12px;padding:6px 10px;font:600 14px/1.4 var(--body);margin:6px 0 0}
.pbpat{display:flex;align-items:center;gap:8px;width:100%;max-width:520px;font:800 14px var(--body)}.pbpat i{flex:1;height:14px;border:2.5px solid var(--ink);border-radius:99px;overflow:hidden;background:var(--surface)}
.pbpat b{display:block;height:100%;width:100%;background:linear-gradient(90deg,#ef5240,#ffd257 40%,#45d08a)}.pbpat b.out{background:#ef5240}.pbpat span{white-space:nowrap}
.pbcards{display:grid;grid-template-columns:repeat(var(--n,3),minmax(0,1fr));gap:8px;width:100%;max-width:620px}
.pbgc{display:grid;justify-items:center;gap:2px;background:#fff;color:#16233a;border:3px solid #16233a;border-radius:14px;padding:8px 6px;cursor:pointer;box-shadow:3px 3px 0 #ff8a3d;font-family:var(--body)}
.pbgc span{font:800 10px var(--body);letter-spacing:.08em;text-transform:uppercase;color:#5b6475}.pbgc b{font:700 clamp(1.4rem,6vw,2rem)/1.1 var(--display)}.pbgc em{font:800 13px var(--body);font-style:normal;color:#c2410c}
.pbgc[aria-pressed="true"]{background:#e3fbef;box-shadow:3px 3px 0 #0b968b;border-color:#0b968b}.pbgc[aria-pressed="true"] em{color:#0b7a6f}.pbgc:disabled{opacity:.8;cursor:default}
@media (max-width:600px){.pbcard{min-width:96px;padding:3px 12px 5px}.pbsay{left:3%;max-width:58%}.pbneon{font-size:12px;padding:1px 6px}}
</style>`);
const PBP=n=>{const ps=[];for(let p=2;p*p<=n;p++)if(isPrime(p))ps.push(p);return ps}; /* primes you must test for n */
const pbSmall=n=>{for(let d=2;d*d<=n;d++)if(n%d===0)return d;return n};
const pbFactors=n=>{const f=[];for(let d=1;d<=n;d++)if(n%d===0)f.push(d);return f};
const pbList=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const PBCOL=['#ff8a3d','#5f50ec','#0b968b','#e0559a','#3aa0ff','#ffb81f','#45d08a'];
/* a guest: a round blob with a face. Expressions are switched with classes: happy, sad, sly */
const PBHATS=['',
 '<path d="M28 16 L40 -18 L52 16Z" fill="#ff5fa2" stroke="#16233a" stroke-width="2.5"/><circle cx="40" cy="-18" r="4" fill="#ffd257" stroke="#16233a" stroke-width="2"/><path d="M33 4 l14 0 M31 10 l18 0" stroke="#ffd257" stroke-width="2.5"/>',
 '<rect x="24" y="-12" width="32" height="26" rx="3" fill="#16233a"/><rect x="16" y="11" width="48" height="6" rx="3" fill="#16233a"/><rect x="24" y="4" width="32" height="5" fill="#ef5240"/>',
 '<path d="M24 14 L26 -6 L33 6 L40 -10 L47 6 L54 -6 L56 14Z" fill="#ffd257" stroke="#16233a" stroke-width="2.5"/><circle cx="40" cy="2" r="2.5" fill="#ef5240"/>',
 '<ellipse cx="40" cy="14" rx="30" ry="6" fill="#45d08a" stroke="#16233a" stroke-width="2.5"/><path d="M26 14 q14 -30 28 0" fill="#45d08a" stroke="#16233a" stroke-width="2.5"/><path d="M52 6 q10 -10 4 -16" stroke="#ff8a3d" stroke-width="3" fill="none"/>'];
const PBGLASS='<g><rect x="20" y="33" width="17" height="12" rx="5" fill="#16233a"/><rect x="43" y="33" width="17" height="12" rx="5" fill="#16233a"/><path d="M37 38 h6" stroke="#16233a" stroke-width="3"/><path d="M23 36 l5 0" stroke="#fff" stroke-width="2" opacity=".6"/></g>';
const PBBOW='<path d="M32 78 l8 4 l-8 4z M48 78 l-8 4 l8 4z" fill="#ef5240" stroke="#16233a" stroke-width="2"/><circle cx="40" cy="82" r="2.5" fill="#16233a"/>';
/* a guest: a round blob with a face. Expressions are switched with classes: happy, sad, sly. outfit 1-4 adds a costume */
const pbGuySvg=(c,o)=>`<svg viewBox="0 -24 80 120" aria-hidden="true"><ellipse cx="40" cy="92" rx="22" ry="4" fill="#000" opacity=".25"/>
 <rect x="24" y="74" width="10" height="16" rx="5" fill="#16233a"/><rect x="46" y="74" width="10" height="16" rx="5" fill="#16233a"/>
 <rect x="8" y="14" width="64" height="66" rx="30" fill="${c}" stroke="#16233a" stroke-width="3"/>${o?'':'<path d="M40 14 q-4 -10 4 -12" stroke="#16233a" stroke-width="3" fill="none"/>'}
 <g class="e1"><circle cx="29" cy="40" r="5" fill="#16233a"/><circle cx="51" cy="40" r="5" fill="#16233a"/><circle cx="30.5" cy="38.5" r="1.6" fill="#fff"/><circle cx="52.5" cy="38.5" r="1.6" fill="#fff"/></g>
 <path class="e2 hp" d="M23 42 q6 -8 12 0 M45 42 q6 -8 12 0" stroke="#16233a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
 <path class="e2 sl" d="M23 40 h12 M45 40 h12 M25 36 l8 3 M55 36 l-8 3" stroke="#16233a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
 <path class="m m0" d="M32 56 h16" stroke="#16233a" stroke-width="3.5" stroke-linecap="round"/>
 <path class="m m1" d="M28 52 q12 16 24 0 z" fill="#16233a"/>
 <path class="m m2" d="M30 60 q10 -9 20 0" stroke="#16233a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
 <path class="m m3" d="M30 56 q12 6 22 -4" stroke="#16233a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
 <path class="tear" d="M52 46 q4 7 0 9 q-4 -2 0 -9z" fill="#7cc8ff"/>${o?(PBHATS[o]||'')+(o%2?PBGLASS:'')+(o>2?PBBOW:''):''}</svg>`;
/* why a number is or isn't prime, aimed at the mistake a pupil probably made */
function pbWhy(n){if(n===0)return '<b>0 is not prime</b> (and not composite either). Every whole number divides 0 (0 = 0 × 5 = 0 × 7…), so 0 has endless factors. A prime must be a whole number <b>greater than 1</b> with exactly two factors.';
  if(n<0)return `<b>${n}</b> is negative. A prime must be a whole number <b>greater than 1</b>, so ${n} is <b>not prime</b>${isPrime(-n)?` (even though ${-n} is)`:''}.`;
  if(n===1)return '1 has only <b>one</b> factor (1 itself). A prime needs exactly <b>two different</b> factors, so 1 is <b>not prime</b>. It is not composite either.';
  if(n===2)return '2 is even, but its only factors are 1 and 2. That is exactly two factors, so <b>2 is prime</b>. It is the only even prime.';
  if(isPrime(n)){const t=PBP(n);return `${n} cannot be divided exactly by ${pbList(t.length?t:[2])}, so its only factors are 1 and ${n}. <b>${n} is prime.</b>${n>50?' Big numbers can be prime too!':''}`}
  const d=pbSmall(n),e=n/d,end=n%10;
  if(d===2)return `${n} is even, so 2 divides it: <b>${n} = 2 × ${e}</b>. It is composite.`;
  if(d===e)return `${n} = <b>${d} × ${d}</b>, so it has three factors: 1, ${d} and ${n}. It is composite.`;
  if(d>=7)return `${n} is odd${[1,3,7,9].includes(end)?` and ends in ${end}`:''}, and 2, 3 and 5 don't divide it${d>7?', nor does 7':''}. But <b>${n} = ${d} × ${e}</b>. Did you try ${d}?`;
  return `Being odd${[1,3,7,9].includes(end)?` or ending in ${end}`:''} is not enough. <b>${n} = ${d} × ${e}</b>, so ${n} is composite.`}
/* the factor list that settles it */
function pbFacts(n){if(n===0)return 'Every whole number is a factor of 0 → not prime';if(n<0)return `${n} is less than 2 → not prime`;const f=pbFactors(n);return `Factors of ${n}: ${pbList(f)} → ${f.length===1?'only <b>one</b> factor, so not prime':f.length===2?'exactly <b>two</b> factors, so prime':`<b>${f.length}</b> factors, so not prime`}`}
/* hint tool: can n guests stand in equal rows? (at least 2 rows, the same number in each) */
function pbRowsTool(el,n){const rmax=Math.min(10,Math.floor(n/2));
  el.innerHTML=`<div class="pbtiles"><div class="pbT"></div><p class="pbmsg" role="status">Tap a number of rows to try.</p><div class="pbctl">${Array.from({length:Math.max(0,rmax-1)},(_,i)=>i+2).map(r=>`<button class="btn" data-r="${r}">${r} rows</button>`).join('')}</div></div>`;
  const pic=r=>{const c=Math.floor(n/r),left=n%r,cols=c+(left?1:0),size=Math.max(10,Math.min(28,Math.floor(400/Math.max(cols,1)),Math.floor(200/r))),g=3,gap=left?size*.5:0,W=cols*(size+g)+g+12+gap,H=r*(size+g)+g+12;let s='';
    for(let row=0;row<r;row++)for(let col=0;col<c;col++)s+=`<rect x="${6+g+col*(size+g)}" y="${6+g+row*(size+g)}" width="${size}" height="${size}" rx="${size*.3}" fill="#0b968b" stroke="#16233a" stroke-width="1.2"/>`;
    for(let k=0;k<left;k++)s+=`<rect x="${6+g+c*(size+g)+gap}" y="${6+g+k*(size+g)}" width="${size}" height="${size}" rx="${size*.3}" fill="#ef5240" stroke="#16233a" stroke-width="1.2"/>`;
    el.querySelector('.pbT').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${n} guests in ${r} rows">${s}</svg>`;
    el.querySelector('.pbmsg').innerHTML=left?`<span style="color:#c2410c">✗ ${r} rows of ${c}, ${left} left over</span>`:`<span style="color:var(--teal)">✓ ${r} equal rows of ${c}: ${r} × ${c} = ${n}</span>`};
  el.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{sfx.tap();pic(+b.dataset.r);el.querySelectorAll('[data-r]').forEach(x=>x.setAttribute('aria-pressed',x===b))})}
/* number pools: [composites, primes] for each round type and level (Core to about 50, Stretch to 100, Challenge to about 200) */
const pbPrimesIn=(a,b)=>{const p=[];for(let n=a;n<=b;n++)if(isPrime(n))p.push(n);return p};
const PBPOOL={
  warm:[[[4,6,8,9,10,12,14,15,16,18,20],[2,3,5,7,11,13,17,19]],[[22,24,25,26,28,30,32,34,35,38,40],[23,29,31,37]],[[42,44,45,46,48,50,52,54,55,56,58,60],[41,43,47,53,59]]],
  odd:[[[9,15,21,25,27],[11,13,17,19,23]],[[33,39,45,51,57,63,69],[41,43,47,53,59,61]],[[111,117,123,129,141,159],[101,103,107,109,113,127]]],
  ends:[[[21,27,33,39,49],[23,29,31,37,41,43,47]],[[51,57,63,69,77,81,87,91,93,99],[53,59,61,67,71,73,79,83,89,97]],[[121,133,143,147,153,161,169,171,177,183,187,189],pbPrimesIn(131,199)]],
  seven:[[[49,77,91],[41,43,47,53]],[[49,77,91],[71,73,79,83,89,97]],[[119,133,161,203,217],pbPrimesIn(127,199)]],
  big:[[[39,45,42,48,50],[41,43,47]],[[85,87,93,95,99],[73,79,83,89,97]],[[171,177,183,185,195],[173,179,181,191,193,197,199]]],
  square:[[[4,9,25,49],[5,7,23,29]],[[9,25,49,81],[37,47,53,59]],[[121,169,49,289],[127,131,163,167]]]};
const PBTYPES=['warm','tiny','odd','ends','seven','big','square','mix'];
function pbNumber(type,T){const seen=ctx.pbSeen=ctx.pbSeen||new Set();
  if(type==='mix')return pbNumber(pick(['odd','ends','seven','big','square']),T);
  if(type==='tiny'){const o=[1,2].filter(x=>!seen.has(x));if(o.length){const n=pick(o);seen.add(n);return n}return pbNumber('warm',0)}
  const [C,P]=PBPOOL[type][T],comp=Math.random()<(type==='warm'||type==='big'?.5:.6);
  let list=(comp?C:P).filter(x=>!seen.has(x));if(!list.length)list=(comp?P:C).filter(x=>!seen.has(x));if(!list.length)list=comp?C:P;const n=pick(list);seen.add(n);return n}
/* the hint ladder for one guest: equal rows → quick tests → a nudge */
function pbHint(n,k){if(n<=0)return {h:['<b>Hint 1:</b> read the house rule: a prime must be a whole number <b>greater than 1</b>.',`<b>Hint 2:</b> is ${n} greater than 1?`,'<b>Hint 3:</b> numbers less than 2 (like 0, 1 and negatives) are never prime.'][Math.min(k,2)]};const ps=PBP(n),dg=String(n).split(''),sum=dg.reduce((a,b)=>a+ +b,0);
  if(k===0)return n<4?{h:`<b>Hint 1:</b> list every factor of ${n}. A prime has <b>exactly two different</b> factors: 1 and itself.`}:{h:`<b>Hint 1:</b> could <b>${n}</b> guests stand in <b>equal rows</b> (at least 2 rows, the same number in every row)? If yes, ${n} is not prime. Try it:`,tool:1};
  if(k===1)return {h:`<b>Hint 2:</b> quick tests. Is ${n} even? Do its digits add up to a multiple of 3${dg.length>1?` (${dg.join(' + ')} = ${sum})`:''}? Does it end in 0 or 5? If none of those work, keep testing 7, 11, 13…`};
  if(n===1)return {h:'<b>Hint 3:</b> how many different factors does 1 have? A prime needs exactly two.'};
  if(n===2||n===3)return {h:`<b>Hint 3:</b> the factors of ${n} are 1 and ${n}. How many is that?`};
  return {h:isPrime(n)?`<b>Hint 3:</b> you only need to test the primes up to √${n} ≈ ${Math.sqrt(n).toFixed(1)}: ${pbList(ps)}. Try dividing ${n} by each of them.`:`<b>Hint 3:</b> try dividing ${n} by <b>${pbSmall(n)}</b>.`}}
/* a group for Challenge (3) or the outfit party (4): a mix of primes and look-alikes, all different */
function pbGroup(type,T,size,bonus){const seen=ctx.pbSeen=ctx.pbSeen||new Set(),out=[],add=n=>{if(!out.includes(n)){out.push(n);seen.add(n)}};
  if(bonus){const hi=T===2?199:99,ps=pbPrimesIn(11,hi),cs=[];for(let n=10;n<=hi;n++)if(!isPrime(n)&&n%2&&n%5)cs.push(n);const k=R(1,size-1);
    shuffle(ps).filter(x=>!seen.has(x)).slice(0,k).forEach(add);shuffle(cs).filter(x=>!seen.has(x)).slice(0,size-k).forEach(add);return shuffle(out)}
  if(type==='tiny'){add(pick([0,1]));add(2);add(pick([-2,-3,-5,-7]));return shuffle(out)}
  const trick=Math.random()<.45?pick([0,1,2,-3,-5,-7,-11,-13].filter(x=>!seen.has(x))):undefined;if(trick!==undefined)add(trick);
  let g=0;while(out.length<size&&g++<40){const n=pbNumber(out.length===size-1&&Math.random()<.5?'mix':type,T);add(n)}return shuffle(out)}
/* one round: a guest (or a group) walks up from the moving queue and hands its card(s) to Qubi */
function pbRound(api,o){const T=o.T,size=o.size,nar=innerWidth<600,secs=o.patience||0,bonus=!!o.bonus;
  const st=ctx.pbR={misses:0,hints:0,log:[],k:0},base=T>=1||bonus?8:10;
  const lead=bonus?`<p class="qt">🎭 <b>Surprise outfit party!</b> Four guests in costume arrive together, and they are <b>very impatient</b>. Tap every guest who may enter, then press <b>Done</b>.</p>`
    :size>1?`<p class="qt">A group of <b>${size}</b> guests arrives. Tap <b>every</b> guest who may enter (only prime numbers), then press <b>Done</b>.</p><p class="qs">House rule: a prime is a whole number <b>greater than 1</b> with exactly two different factors. Watch out for tricky guests like 0 and negative numbers!</p>`
    :`<p class="qt">You're the bouncer at the <b>PRIMES ONLY</b> club. Check each guest's card. Only <b>prime numbers</b> may enter.</p>`;
  const banner=(api.r0&&!bonus)?(T===1?`<p class="pbnote">⏳ <b>Medium level: guests have a patience bar.</b> Decide before it runs out for <b>+2 bonus points</b>. If it runs out, you lose nothing but the bonus.</p>`:T===2?`<p class="pbnote">👥 <b>Challenge level: guests come in groups of 3.</b> Each group has a patience bar for <b>+2 bonus points</b>.</p>`:''):'';
  api.q(lead+banner);
  const W=[[30,20,10,0,-10],[28,18,8,-2,-12]][nar?1:0]; /* queue slots, front of the line first */
  api.body.innerHTML=`<div class="pbscene" id="pbScene"><div class="pbneon">PRIMES ONLY</div><div class="pbdoor"></div><div class="pbmgr">${QUBI.replace('class="qubi"','class="qubi idle"')}</div><div class="pbsay" id="pbSay"></div>
    <div class="pbcard" id="pbCard"><span>🪪 Guest card</span><b id="pbName"></b></div></div>
    <div class="pbask" id="pbAsk"></div>`;
  const scene=$('pbScene'),Q=[];
  const mk=(left,wait)=>{const g=document.createElement('div');g.className='pbguy'+(wait?' wait':'');g.style.left=left+'%';g.innerHTML=pbGuySvg(pick(PBCOL),bonus?R(1,4):0);scene.appendChild(g);return g};
  for(let i=0;i<4;i++){const g=mk(W[i],1);g.style.zIndex=5-i;Q.push(g)}
  const say=(t,mad)=>{const x=$('pbSay');if(x){x.innerHTML=t;x.className='pbsay on'+(mad?' mad':'')}};
  const wait=ms=>new Promise(r=>api.later(r,calm?Math.min(ms,150):ms));
  const fronts=size===1?[nar?44:57]:size===3?(nar?[20,36,52]:[36,46,56]):(nar?[2,18,34,50]:[30,40,50,60]);
  let timer=null,t0=0,late=false;
  const patience=()=>{if(!secs)return;const b=$('pbBar');late=false;b.style.transition='none';b.style.width='100%';b.className='';void b.offsetWidth;b.style.transition=`width ${secs}s linear`;b.style.width='0%';t0=Date.now();
    clearTimeout(timer);timer=setTimeout(()=>{if(st.busy||api.answered)return;late=true;b.className='out';st.guys.forEach(g=>g.classList.add('tip'));
      if(bonus){say('We\'re leaving! This party is boring!',true);decide(null)}else say(size>1?'Hurry up! We\'ve been waiting ages!':'Hurry up! I\'m waiting!',true)},secs*1000);ctx.timers.push(timer)};
  const stopPat=()=>{clearTimeout(timer);const b=$('pbBar');if(b){const w=getComputedStyle(b).width;b.style.transition='none';b.style.width=w}};
  const patUI=()=>secs?`<div class="pbpat" id="pbPat"><span>⏳ ${bonus?'Very impatient!':'Patience'}</span><i><b id="pbBar"></b></i></div>`:'';
  const next=async()=>{if(api.answered)return;(st.guys||[]).forEach(g=>g.remove());st.k=0;st.busy=false;late=false;
    const nums=size===1?[pbNumber(o.type,T)]:pbGroup(o.type,T,size,bonus);st.nums=nums;st.pick=new Set();
    $('pbSay').className='pbsay';$('pbCard').className='pbcard';$('pbAsk').innerHTML='';
    /* the front of the queue steps up to the door, everyone behind shuffles forward, and new guests join the back */
    const guys=Q.splice(0,size);st.guys=guys;
    guys.forEach((g,i)=>{g.classList.remove('wait');g.style.zIndex=8+i;g.style.bottom='3%';g.style.left=fronts[i]+'%'});
    Q.forEach((g,i)=>{g.style.left=W[i]+'%';g.style.zIndex=5-i});
    while(Q.length<4){const g=mk(-16,1);Q.push(g);await wait(40);g.style.left=W[Q.length-1]+'%';g.style.zIndex=5-Q.length}
    await wait(1000);
    const cd=$('pbCard'),mg=scene.querySelector('.pbmgr');
    for(let i=0;i<size;i++){ /* each guest hands a card to Qubi */
      $('pbName').textContent=nums[i];cd.style.transition='none';cd.style.left=(fronts[i]+(nar?6:4))+'%';cd.style.top='62%';cd.className='pbcard';void cd.offsetWidth;cd.style.transition='';
      cd.className='pbcard hand';await wait(size>1?180:300);cd.style.left=nar?'70%':'76%';cd.style.top='46%';cd.className='pbcard give';await wait(size>1?420:650)}
    mg.classList.remove('pbhop');void mg.offsetWidth;mg.classList.add('pbhop');say(size>1?'Let me see these…':'Let me see…');sfx.tap();await wait(500);$('pbSay').className='pbsay';
    if(size===1){$('pbName').textContent=nums[0];cd.style.left=nar?'40%':'50%';cd.style.top='6%';cd.className='pbcard on';await wait(600);
      $('pbAsk').innerHTML=`${patUI()}<p class="qt">Only prime numbers are allowed. Let <b>${nums[0]}</b> in?</p><div class="pbbtns"><button class="btn" id="pbIn">✅ Let in</button><button class="btn" id="pbOut">🚫 Turn away</button></div>`+hintUI();
      $('pbIn').onclick=()=>decide(true);$('pbOut').onclick=()=>decide(false)}
    else{cd.className='pbcard';
      $('pbAsk').innerHTML=`${patUI()}<p class="qt">Tap the guests who may enter.</p><div class="pbcards" style="--n:${size}">${nums.map((n,i)=>`<button class="pbgc" data-i="${i}" aria-pressed="false"><span>🪪 Guest ${i+1}</span><b>${n}</b><em>🚫 Stays out</em></button>`).join('')}</div>
        <div class="pbbtns" style="grid-template-columns:1fr"><button class="btn primary" id="pbDone">Done ✅</button></div>`+hintUI();
      $('pbAsk').querySelectorAll('.pbgc').forEach(b=>b.onclick=()=>{if(st.busy)return;const i=+b.dataset.i,on=!st.pick.has(i);on?st.pick.add(i):st.pick.delete(i);b.setAttribute('aria-pressed',on);b.querySelector('em').textContent=on?'✅ Let in':'🚫 Stays out';sfx.tap()});
      $('pbDone').onclick=()=>decide(true)}
    $('pbHint').onclick=hint;patience()};
  const hintUI=()=>`<button class="btn" id="pbHint" style="font-size:14px">💡 Hint</button><div id="pbHints" style="display:grid;gap:8px;width:100%;justify-items:center"></div>`;
  const hint=()=>{if(st.k>=3||st.busy||!$('pbHint'))return;const k=st.k;st.k++;st.hints++;ctx.hint=(ctx.hint||0)+1;sfx.tap();const box=document.createElement('div');box.className='pbhintbox';
    if(size===1){const H=pbHint(st.nums[0],k);box.innerHTML=H.h+(H.tool?'<div class="pbrt"></div>':'');$('pbHints').appendChild(box);if(H.tool)pbRowsTool(box.querySelector('.pbrt'),st.nums[0])}
    else{box.innerHTML=k===0?'<b>Hint 1:</b> check each card on its own. A prime is a whole number <b>greater than 1</b> with exactly two different factors. Anything less than 2 stays out.'
      :k===1?'<b>Hint 2:</b> quick tests for each card:<br>'+st.nums.map(n=>n<2?`${n}: less than 2`:`${n}: ${n%2===0?'even':'odd'}, digit sum ${String(n).split('').reduce((a,b)=>a+ +b,0)}${n%10===5||n%10===0?', ends in '+n%10:''}`).join('<br>')
      :'<b>Hint 3:</b><br>'+st.nums.map(n=>n<2?`${n}: not prime (less than 2)`:isPrime(n)?`${n}: test ${pbList(PBP(n).length?PBP(n):[2])}. Do any of them divide it?`:`${n}: try dividing by ${pbSmall(n)}`).join('<br>');$('pbHints').appendChild(box)}
    $('pbHint').textContent=st.k>=3?'No more hints':`💡 Another hint (${3-st.k} left)`;if(st.k>=3)$('pbHint').disabled=true};
  pbQueue.hint=hint; /* Ask Qubi uses the same hints */
  const decide=async letIn=>{if(api.answered||st.busy)return;st.busy=true;stopPat();const quick=secs&&!late&&Date.now()-t0<secs*1000;
    $('pbAsk').querySelectorAll('button').forEach(b=>b.disabled=true);$('pbCard').className='pbcard';
    const nums=st.nums,ins=size===1?[letIn]:nums.map((_,i)=>st.pick.has(i)),timeout=letIn===null;
    const wrong=timeout?nums.map((_,i)=>i):nums.map((n,i)=>ins[i]!==isPrime(n)).map((w,i)=>w?i:-1).filter(i=>i>=0);
    if(!wrong.length){ /* everyone judged right */
      nums.forEach((n,i)=>{const g=st.guys[i];g.classList.remove('tip');g.classList.add(isPrime(n)?'happy':'sad');if(isPrime(n))g.classList.add('jump')});
      say(nums.every(n=>!isPrime(n))?'Good call! None of them get in.':pick(['Welcome in, primes!','Perfect door work!','Nice! Only the primes get in.']));await wait(900);
      nums.forEach((n,i)=>{const g=st.guys[i];if(isPrime(n)){g.style.left='84%';g.style.opacity='0'}else g.style.left='-24%'});await wait(800);
      const pts=bonus?0:Math.min(st.misses===0?base+(quick?2:0):st.misses===1?5:2,st.hints?6:10);
      const work=nums.map(n=>`${pbWhy(n)}<br><span style="color:#5f50ec;font-weight:800">${pbFacts(n)}</span>`);
      api.done(true,`${size===1?(isPrime(nums[0])?`${nums[0]} is prime, so it's in.`:`${nums[0]} is not prime, so it's out.`):`Primes let in: ${nums.filter(isPrime).join(', ')||'none'}.`}${quick&&!st.misses&&!bonus?' ⏳ +2 speed bonus!':''}${st.misses?` Round complete after ${st.misses} mistake${st.misses>1?'s':''}.`:''}`,[...work,...(st.log.length?['Earlier in this round: '+st.log.join(' ')]:[])],pts);return}
    /* a mistake: no second try. Wrong guests are dealt with, the manager scolds, and new guests come forward */
    st.misses++;ctx.hint=(ctx.hint||0)+1;sfx.no();
    if(!timeout){for(const i of wrong){const g=st.guys[i],n=nums[i];if(ins[i]){g.classList.add('sly','tip');g.style.left='84%';g.style.opacity='.35';st.log.push(`you let in ${n} (not prime).`)}else{g.classList.add('sad');g.style.left='-24%';st.log.push(`you turned away ${n} (prime).`)}}
      say('Hmm…');await wait(1100);
      for(const i of wrong)if(ins[i]){const g=st.guys[i];g.classList.remove('tip');const b=document.createElement('div');b.className='pbboom';b.textContent='💥';scene.appendChild(b);g.style.opacity='1';g.classList.add('kick','sad');g.style.left='-25%';g.style.bottom='60%'}
      nums.forEach((n,i)=>{if(!wrong.includes(i)){const g=st.guys[i];if(ins[i]){g.classList.add('happy');g.style.left='84%';g.style.opacity='0'}else{g.classList.add('sad');g.style.left='-24%'}}});
      const wi=wrong.filter(i=>ins[i]).map(i=>nums[i]),wo=wrong.filter(i=>!ins[i]).map(i=>nums[i]);
      say(wi.length?`Hey! ${pbList(wi.map(n=>'<b>'+n+'</b>'))} ${wi.length>1?'aren\'t':'isn\'t'} prime. You let an impostor in!`:`Wait! ${pbList(wo.map(n=>'<b>'+n+'</b>'))} ${wo.length>1?'ARE':'IS'} prime. You turned away a real member!`,true)}
    else{st.guys.forEach(g=>{g.classList.add('sad');g.style.left='-24%'});st.log.push('the guests ran out of patience.')}
    qubi('gQ','oops','Do better!');const stg=$('gStage');if(stg){stg.classList.remove('shake');void stg.offsetWidth;stg.classList.add('shake')}await wait(500);
    const why=(timeout?nums.map((_,i)=>i):wrong).map(i=>`<div class="pbwhy"><b>${nums[i]}:</b> ${pbWhy(nums[i])}<div class="pbfac">${pbFacts(nums[i])}</div></div>`).join('');
    if(bonus){api.done(false,timeout?'The costumed guests ran out of patience and left. Here is who was who:':'Not quite! Here is who was who:',nums.map(n=>`${pbWhy(n)} <span style="color:#5f50ec;font-weight:800">${pbFacts(n)}</span>`),0,{noRetry:true});return}
    const head=size===1?(ins[0]?`You let <b>${nums[0]}</b> in, but it is not prime.`:`You turned <b>${nums[0]}</b> away, but it is prime.`):`You got <b>${wrong.length}</b> guest${wrong.length>1?'s':''} wrong.`;
    $('pbAsk').innerHTML=`<div class="pbwrong" role="status"><div>😠 <b>The manager is not happy.</b> ${head}</div>${why}<div><b>You need to do better!</b> This round isn't complete until you get ${size===1?'a guest':'a whole group'} right.</div></div><button class="btn primary" id="pbNext">${size===1?'Next guest →':'Next group →'}</button>`;
    $('pbNext').onclick=()=>{sfx.tap();next()};$('pbNext').focus()};
  next()}
function pbQueue(api,type,T){pbRound(api,{type,T,size:T===2?3:1,patience:T===1?20:T===2?30:0})}
addGame('s1-bouncer',{level:'Sec 1',sec:'s1',strand:'num',glyph:'🚪',title:'Prime Bouncer',topic:'Prime and composite numbers',
 how:'Guard the door of the Primes Only club. Let prime numbers in and turn the rest away. Medium adds a patience bar; Challenge brings groups of 3 and tricky guests.',rounds:8,
 round(api,r){api.r0=r===0;pbQueue(api,PBTYPES[r],TIER())},
 bonus(api){api.r0=false;pbRound(api,{type:'mix',T:TIER(),size:4,patience:20,bonus:1})},
 ownHint:()=>pbQueue.hint&&pbQueue.hint()});
/* show it first in the Secondary 1 list */
ORDER.splice(ORDER.indexOf('s1-bouncer'),1);ORDER.splice(Math.max(0,ORDER.indexOf('s1-integers')),0,'s1-bouncer');
