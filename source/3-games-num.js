/* ================= P4 NUMBER GAMES ================= */

/* 1. Rounding Rocket — Whole numbers 1.5, 1.6 */
addGame('p4-rounding',{level:'P4',strand:'num',glyph:'≈',title:'Rounding Rocket',topic:'Whole numbers: rounding and ≈',
 how:'A rocket is hovering over the number line. First choose the two landing pads it is between, then land it on the NEARER pad. That is your rounded number!',rounds:9,
 round(api,r){
  const place=r<3?10:r<6?100:1000;let N;
  do{N=R(10000,99999)}while(N%place===0||N%place===place/2);
  const lo=Math.floor(N/place)*place,hi=lo+place,mid=lo+place/2,ans=N-lo<place/2?lo:hi;
  const digName={10:'ones',100:'tens',1000:'hundreds'}[place],d=Math.floor((N%place)/(place/10));
  const s=fmt(N),di=s.length-1-(s.replace(/,/g,'').length-1-String(place).length+1>=0?0:0);
  /* highlight the deciding digit: the digit one place to the right of the rounding place */
  const raw=String(N),pos=raw.length-String(place).length+1,hl=[...raw].map((c,i)=>i===pos?`<tspan class="rrdig">${c}</tspan>`:c),hs=hl.map((c,i)=>(i>0&&(raw.length-i)%3===0?',':'')+c).join('');
  api.q(`<p class="qt">🚀 Rocket <b>${fmt(N)}</b> must land on the nearest <b>${fmt(place)}</b>.</p><p class="qs">Step 1: Which two landing pads is the rocket between?</p>`);
  const x0=60,x1=540,xp=x0+(x1-x0)*(N-lo)/place,Y=200;let tk='';
  for(let i=0;i<=10;i++){const x=x0+(x1-x0)*i/10,big=i%5===0;tk+=`<line class="tk" x1="${x}" x2="${x}" y1="${big?Y-14:Y-8}" y2="${big?Y+14:Y+8}"/>`}
  const stars=Array.from({length:18},()=>`<circle cx="${R(10,590)}" cy="${R(8,120)}" r="${R(1,2)}" class="rrstar"/>`).join('');
  const pad=(x,id)=>`<g id="${id}" class="rrpad"><rect x="${x-34}" y="${Y+18}" width="68" height="10" rx="3"/><rect x="${x-4}" y="${Y}" width="8" height="18"/><text class="nlab" x="${x}" y="${Y+46}" text-anchor="middle">?</text></g>`;
  api.body.innerHTML=`<svg viewBox="0 0 600 262" class="nl rrsky" role="img" aria-label="Rocket ${fmt(N)} hovering over a number line">
    <rect x="0" y="0" width="600" height="${Y-20}" class="rrbg"/>${stars}
    <line class="ax" x1="${x0-20}" x2="${x1+20}" y1="${Y}" y2="${Y}"/>${tk}${pad(x0,'rPadL')}${pad(x1,'rPadR')}
    <g id="rMidG" opacity="0"><line x1="${(x0+x1)/2}" x2="${(x0+x1)/2}" y1="40" y2="${Y}" class="rrmid"/><text class="nlab mid" x="${(x0+x1)/2}" y="${Y+46}" text-anchor="middle">${fmt(mid)}</text><text x="${(x0+x1)/2}" y="34" text-anchor="middle" class="rrmidt">halfway</text></g>
    <g id="rRocket" class="rrrocket" style="transform:translate(${xp}px,-140px)"><g>
      <rect x="-44" y="0" width="88" height="26" rx="13" fill="#ffffff" stroke="#16233a" stroke-width="2"/><text x="0" y="18" text-anchor="middle" style="fill:#16233a;font-weight:800;font-size:15px">${hs}</text>
      <path d="M0,30 C14,46 14,80 11,100 L-11,100 C-14,80 -14,46 0,30Z" style="fill:var(--tomato)" stroke="var(--ink)" stroke-width="2"/>
      <circle cx="0" cy="60" r="5" style="fill:var(--surface)" stroke="var(--ink)" stroke-width="2"/>
      <path d="M-11,86 L-21,108 L-10,101Z M11,86 L21,108 L10,101Z" style="fill:var(--sun)" stroke="var(--ink)" stroke-width="2"/>
      <path class="rrflame" d="M-7,102 Q0,132 7,102Z" fill="#ffb81f"/></g></g></svg>
    <div class="choices" id="rCh"></div><p class="qs" id="rMsg" aria-live="polite"></p>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const g=$('rRocket');if(g)g.style.transform=`translate(${xp}px,40px)`}));
  const big=place===1000?10000:place*10;
  const pair=(a,b)=>`${fmt(a)} and ${fmt(b)}`,right=pair(lo,hi);
  const wrongs=[pair(lo-place,lo),pair(hi,hi+place),pair(Math.floor(N/big)*big,Math.floor(N/big)*big+big),pair(Math.floor(N/(place/10||1))*(place/10||1),Math.floor(N/(place/10||1))*(place/10||1)+(place/10||1))].filter(x=>x!==right);
  let step1ok=true;
  const opts=shuffle([right,...shuffle([...new Set(wrongs)]).slice(0,3)]);
  opts.forEach(v=>{const b=document.createElement('button');b.className='btn';b.textContent=v;b.onclick=()=>{if(api.answered||$('rCh').dataset.s==='2')return;
    if(v!==right&&api.first('pads')){b.disabled=true;b.classList.add('no');api.retry($('rMsg'),`Not quite. Look at the ${place===10?'tens':place===100?'hundreds':'thousands'} in ${fmt(N)} and try once more.`);return}
    step1ok=v===right;[...$('rCh').children].forEach(x=>{x.disabled=true;if(x.textContent===right)x.classList.add('ok')});if(!step1ok){b.classList.add('no');sfx.no()}else sfx.ok();
    $('rPadL').querySelector('text').textContent=fmt(lo);$('rPadR').querySelector('text').textContent=fmt(hi);$('rMidG').setAttribute('opacity','1');$('rPadL').classList.add('lit');$('rPadR').classList.add('lit');
    $('rMsg').innerHTML=`${step1ok?'✓ Pads ready!':'Not quite. The rocket is between <b>'+right+'</b>.'} The halfway mark is <b>${fmt(mid)}</b>. Look at the <b>${digName}</b> digit (in red on the rocket).`;
    api.later(()=>step2(),650)};$('rCh').appendChild(b)});
  const step2=()=>{$('rCh').dataset.s='2';api.q(`<p class="qt">🚀 Rocket <b>${fmt(N)}</b> must land on the nearest <b>${fmt(place)}</b>.</p><p class="qs">Step 2: Land the rocket on the nearer pad. Tap a pad or a button.</p>`);
    $('rCh').innerHTML='';[lo,hi].forEach(v=>{const b=document.createElement('button');b.className='btn';b.innerHTML=`🛬 Land on ${fmt(v)}`;b.onclick=()=>land(v);$('rCh').appendChild(b)});
    $('rPadL').onclick=()=>land(lo);$('rPadR').onclick=()=>land(hi)};
  const land=v=>{if(api.answered||$('rCh').dataset.s==='3')return;$('rCh').dataset.s='3';[...$('rCh').children].forEach(x=>x.disabled=true);
    const ok=v===ans&&step1ok,tx=v===lo?x0:x1,g=$('rRocket');g.classList.add('fly');g.style.transform=`translate(${tx}px,${Y-92}px)`;sfx.pop();
    api.later(()=>{if(v===ans){g.classList.add('landed');(v===lo?$('rPadL'):$('rPadR')).classList.add('win')}else{g.classList.add('wobble')}
      api.done(ok,v===ans?(step1ok?`Perfect landing! ${fmt(N)} ≈ ${fmt(ans)}`:`Good landing, but check the pads in Step 1. ${fmt(N)} ≈ ${fmt(ans)}`):`Bumpy landing! ${fmt(N)} is nearer to ${fmt(ans)}.`,
        [`${fmt(N)} is between the pads ${fmt(lo)} and ${fmt(hi)}. The halfway mark is ${fmt(mid)}.`,
         `Look at the <b>${digName}</b> digit: it is <b>${d}</b>.`,
         d>=5?`${d} is 5 or more, so the rocket is past halfway: round <b>up</b> to ${fmt(hi)}.`:`${d} is less than 5, so the rocket has not reached halfway: round <b>down</b> to ${fmt(lo)}.`,
         `${fmt(N)} ≈ <b>${fmt(ans)}</b> (to the nearest ${fmt(place)})`])},1000)};
 }});

/* 2. Factor Hunt — Factors and multiples 2.1–2.5 */
const divs=n=>{const a=[];for(let i=1;i<=n;i++)if(n%i===0)a.push(i);return a};
const CRITTERS=['🐒','🦜','🐸','🦎','🐢','🦋','🐞','🐿️','🦔','🐨','🐼','🦊'];
addGame('p4-factors',{level:'P4',strand:'num',glyph:'÷',title:'Factor Hunt',topic:'Factors and multiples',
 how:'Animals are hiding in the jungle, each holding a number. Read the clue, then tap only the animals that fit it. The counter shows how many you still need to catch. Catch them all with no mistakes for full points!',rounds:8,
 round(api,r){const type=['factors','multiples','factors','partner','factors','multiples','commonF','commonM'][r];
  let clue,sub,nums,good,why,work,lead=0;
  if(type==='factors'){const N=r<4?pick([12,18,20,14,15,16]):pick([28,30,32,40,42,45,50]),fs=divs(N);
    const others=shuffle([...Array(N).keys()].map(i=>i+1).filter(x=>N%x&&x>1)).slice(0,Math.max(3,10-fs.length));
    nums=shuffle([...fs,...others]);good=x=>N%x===0;clue=`Catch every <b>factor of ${N}</b>.`;sub=`A factor of ${N} divides ${N} exactly, with no remainder.`;
    why=x=>N%x===0?`${x} is a factor: ${N} ÷ ${x} = ${N/x} (${x} × ${N/x} = ${N})`:`${N} ÷ ${x} = ${Math.floor(N/x)} remainder ${N%x}, so ${x} is not a factor`;
    work=[`Factors of ${N} come in pairs that multiply to ${N}: ${fs.filter(f=>f*f<=N).map(f=>`${f} × ${N/f}`).join(', ')}`,`So the factors of ${N} are <b>${fs.join(', ')}</b>.`,`Tip: start with 1 × ${N}, then try 2, 3, 4… and stop when the pairs start repeating.`]}
  else if(type==='multiples'){const m=r<4?pick([3,4,5,6]):pick([6,7,8,9]),top=m*R(6,8),ms=[...Array(Math.floor(top/m)).keys()].map(k=>m*(k+1)),pickM=shuffle(ms).slice(0,5);
    const others=shuffle([...Array(top).keys()].map(i=>i+1).filter(x=>x%m&&x>2)).slice(0,5);nums=shuffle([...pickM,...others]);good=x=>x%m===0;
    clue=`Catch every <b>multiple of ${m}</b>.`;sub=`Multiples of ${m} are the answers in the ${m} times table: ${m}, ${2*m}, ${3*m}, …`;
    why=x=>x%m===0?`${x} is a multiple of ${m}: ${m} × ${x/m} = ${x}`:`${x} ÷ ${m} = ${Math.floor(x/m)} remainder ${x%m}, so ${x} is not in the ${m} times table`;
    work=[`Count in ${m}s: ${ms.join(', ')}`,`The multiples of ${m} here are <b>${pickM.slice().sort((a,b)=>a-b).join(', ')}</b>.`]}
  else if(type==='partner'){const N=pick([24,30,36,40,48]),fs=divs(N).filter(f=>f>1&&f<N),a=pick(fs),b=N/a;lead=a;
    const others=shuffle(divs(N).filter(f=>f!==b&&f!==a).concat([b+1,b-1,a+b].filter(x=>x>1&&x!==b))).slice(0,5);nums=shuffle([b,...new Set(others)]).slice(0,6);if(!nums.includes(b))nums[0]=b;
    good=x=>x===b;clue=`The monkey has <b>${a}</b>. Catch its <b>partner</b> so that ${a} × <b>?</b> = ${N}.`;sub=`Factor pairs are two numbers that multiply to make ${N}.`;
    why=x=>x===b?`${a} × ${b} = ${N}, so ${a} and ${b} are a factor pair of ${N}`:`${a} × ${x} = ${a*x}, not ${N}`;work=[`${N} ÷ ${a} = ${b}`,`So ${a} × <b>${b}</b> = ${N}. They are a factor pair.`]}
  else if(type==='commonF'){const [x,y]=pick([[12,18],[16,24],[12,20],[18,27],[20,30],[24,36]]),cf=divs(x).filter(f=>y%f===0);
    const others=shuffle([...Array(12).keys()].map(i=>i+1).filter(f=>!cf.includes(f))).slice(0,Math.max(4,10-cf.length));nums=shuffle([...cf.filter(f=>f<=12),...others]);good=f=>x%f===0&&y%f===0;
    clue=`Catch every number that is a factor of <b>both ${x} and ${y}</b>.`;sub=`These are the common factors of ${x} and ${y}.`;
    why=f=>x%f===0&&y%f===0?`${f} divides both: ${x} ÷ ${f} = ${x/f} and ${y} ÷ ${f} = ${y/f}`:x%f===0?`${f} is a factor of ${x} but not of ${y}`:y%f===0?`${f} is a factor of ${y} but not of ${x}`:`${f} is not a factor of ${x} or ${y}`;
    work=[`Factors of ${x}: ${divs(x).join(', ')}`,`Factors of ${y}: ${divs(y).join(', ')}`,`In both lists: <b>${cf.join(', ')}</b>`]}
  else{const [a,b]=pick([[2,3],[3,4],[2,5],[4,6],[3,5],[4,5],[6,8],[4,10]]),L=lcm(a,b),cm=[L,2*L,3*L].filter(v=>v<=60);
    const others=shuffle([...Array(60).keys()].map(i=>i+1).filter(v=>(v%a===0)!==(v%b===0))).slice(0,10-cm.length);nums=shuffle([...cm,...others]);good=v=>v%a===0&&v%b===0;
    clue=`Catch every number that is a multiple of <b>both ${a} and ${b}</b>.`;sub=`These are the common multiples of ${a} and ${b}.`;
    why=v=>v%a===0&&v%b===0?`${v} is in both times tables: ${a} × ${v/a} and ${b} × ${v/b}`:v%a===0?`${v} is a multiple of ${a} but not of ${b}`:`${v} is a multiple of ${b} but not of ${a}`;
    work=[`Multiples of ${a}: ${[1,2,3,4,5,6,7,8,9,10].map(k=>a*k).join(', ')}…`,`Multiples of ${b}: ${[1,2,3,4,5,6,7,8,9,10].map(k=>b*k).join(', ')}…`,`In both: <b>${cm.join(', ')}</b> (the smallest is ${L})`]}
  const need=nums.filter(good).length;let caught=0,miss=0;const crit=shuffle(CRITTERS);
  api.q(`<p class="qt">🔎 ${clue}</p><p class="qs">${sub}</p>`);
  api.body.innerHTML=`${lead?`<div class="fhlead"><span class="cr">🐒</span><span class="sign">${lead}</span><b>needs a partner!</b></div>`:''}<div class="fhbar"><span class="pill" id="fhC">🧺 Caught <b>0</b> of ${need}</span><span class="pill" id="fhM">Mistakes: <b>0</b></span></div>
    <div class="jungle" id="fhJ">${nums.map((n,i)=>`<button class="critter" data-n="${n}" aria-label="Animal holding ${n}"><span class="cr" aria-hidden="true">${type==='partner'&&false?'':crit[i%crit.length]}</span><span class="sign">${n}</span></button>`).join('')}</div>
    <p class="fhmsg" id="fhMsg" aria-live="polite">Tap an animal to catch it.</p><div class="basket" id="fhB" aria-label="Your basket"><span class="bl">🧺 Basket:</span></div>`;
  api.body.querySelectorAll('.critter').forEach(c=>c.onclick=()=>{if(api.answered||c.disabled)return;const n=+c.dataset.n;c.disabled=true;
    if(good(n)){caught++;c.classList.add('caught');sfx.ok();$('fhMsg').innerHTML=`<span class="okc">✓ ${why(n)}.</span>`;$('fhB').insertAdjacentHTML('beforeend',`<span class="bk">${c.querySelector('.cr').textContent}<b>${n}</b></span>`)}
    else{miss++;c.classList.add('flee');sfx.no();$('fhMsg').innerHTML=`<span class="noc">✗ ${why(n)}. It ran away!</span>`;}
    $('fhC').innerHTML=`🧺 Caught <b>${caught}</b> of ${need}`;$('fhM').innerHTML=`Mistakes: <b>${miss}</b>`;
    if(caught===need){api.body.querySelectorAll('.critter').forEach(x=>x.disabled=true);api.later(()=>api.done(miss===0,miss===0?`You caught all ${need} with no mistakes!`:`You caught them all, but made ${miss} mistake${miss>1?'s':''}.`,work),500)}});
 }});

/* 3. Digit Duel — Four operations 3.1 */
function perms(a){if(a.length<=1)return [a];const out=[];a.forEach((x,i)=>perms([...a.slice(0,i),...a.slice(i+1)]).forEach(p=>out.push([x,...p])));return out}
addGame('p4-product',{level:'P4',strand:'num',glyph:'×',title:'Digit Duel',topic:'Multiplication: 3 digits × 1 digit, 2 digits × 2 digits, 3 digits × 2 digits',
 how:'Place the digit cards to make the biggest (or smallest) product. Then work out the multiplication yourself for bonus points.',rounds:9,
 round(api,r){
  const sh=r<3?[3,1]:r<6?[2,2]:[3,2],n=sh[0]+sh[1],goal=r%2===0?'big':'small';
  const digs=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,n);let best=null;
  perms(digs).forEach(p=>{const A=+p.slice(0,sh[0]).join(''),B=+p.slice(sh[0]).join(''),v=A*B;if(!best||(goal==='big'?v>best.v:v<best.v))best={A,B,v}});
  api.q(`<p class="qt">Use all ${n} cards to make the <b>${goal==='big'?'BIGGEST':'SMALLEST'}</b> product.</p><p class="qs">Tap a card to place it. Tap a box to take a card back.</p>`);
  api.body.innerHTML=`<div class="frame" id="dF"></div><div class="row" id="dC"></div><div class="row"><button class="btn primary" id="dLock" disabled>Lock in</button><button class="btn" id="dClr">Clear all cards</button></div><div id="dS2"></div>`;
  const slots=Array(n).fill(null);let locked=false;
  function draw(){let h='';slots.forEach((s,k)=>{if(k===sh[0])h+='<span>×</span>';h+=`<button class="slot ${s!==null?'full':''}" data-k="${k}" aria-label="Box ${k+1}">${s!==null?digs[s]:''}</button>`});
    $('dF').innerHTML=h;$('dC').innerHTML=digs.map((d,i)=>`<button class="dcard" data-i="${i}" ${slots.includes(i)||locked?'disabled':''}>${d}</button>`).join('');
    $('dF').querySelectorAll('.slot').forEach(b=>b.onclick=()=>{if(locked)return;slots[+b.dataset.k]=null;sfx.tap();draw()});
    $('dC').querySelectorAll('.dcard').forEach(b=>b.onclick=()=>{const k=slots.indexOf(null);if(k<0)return;slots[k]=+b.dataset.i;sfx.pop();draw()});
    $('dLock').disabled=locked||slots.includes(null)}
  draw();
  $('dClr').onclick=()=>{if(locked)return;slots.fill(null);sfx.tap();draw()};
  $('dLock').onclick=()=>{const ds=slots.map(i=>digs[i]),A=+ds.slice(0,sh[0]).join(''),B=+ds.slice(sh[0]).join(''),v=A*B,aok=v===best.v;
    if(!aok&&api.first('arr')){api.retry($('dS2'),`${A} × ${B} is not the ${goal==='big'?'biggest':'smallest'} product yet. Tap a box to take a card back and try a different arrangement.`);return}
    locked=true;draw();$('dClr').disabled=true;
    $('dS2').innerHTML=`<p style="margin:0 0 8px;font-weight:800">${aok?'That is the best possible arrangement!':`Not the ${goal==='big'?'biggest':'smallest'} possible (the best is ${best.A} × ${best.B} = ${fmt(best.v)}). Now multiply your numbers.`}</p>
      <div class="row"><b style="font:700 1.5rem var(--display)">${A} × ${B} =</b><input class="num" id="dIn" inputmode="numeric" aria-label="Product"><button class="btn primary" id="dChk">Check</button></div>`;
    $('dIn').focus();
    $('dChk').onclick=()=>{const g=parseInt($('dIn').value.replace(/[,\s]/g,''),10);if(isNaN(g))return;const pok=g===v;$('dIn').disabled=true;
      const part=B<10?[`${fmt(A)} × ${B} = <b>${fmt(v)}</b>`]:[`${fmt(A)} × ${B%10} = ${fmt(A*(B%10))}`,`${fmt(A)} × ${B-B%10} = ${fmt(A*(B-B%10))}`,`${fmt(A*(B%10))} + ${fmt(A*(B-B%10))} = <b>${fmt(v)}</b>`];
      api.done(aok&&pok,aok&&pok?'Best arrangement and the right product.':`${aok?'Best arrangement. ':''}${pok?'Your multiplication is right.':`${A} × ${B} = ${fmt(v)}.`}`,
        [aok?`${A} × ${B} is the ${goal==='big'?'biggest':'smallest'} product you can make.`:`The ${goal==='big'?'biggest':'smallest'} product is <b>${best.A} × ${best.B} = ${fmt(best.v)}</b>. Yours was ${fmt(v)}.`,
         goal==='big'?'Tip: the biggest digits should go in the highest place values. Try a few arrangements and compare.':'Tip: the smallest digits should go in the highest place values.',
         `Working for ${A} × ${B}:`,...part],(aok?5:0)+(pok?5:0))}}}});

/* 4. Fraction Flip — Mixed numbers and improper fractions 1.1 (fraction card game) */
function piesSVG(n,d){const w=Math.floor(n/d),rem=n%d,cnt=w+(rem?1:0);let s='';
  for(let c=0;c<cnt;c++){const cx=26+c*54,sh=c<w?d:rem;for(let k=0;k<d;k++){const a0=(-90+k*360/d)*Math.PI/180,a1=(-90+(k+1)*360/d)*Math.PI/180;
    s+=`<path d="M${cx},26 L${(cx+23*Math.cos(a0)).toFixed(2)},${(26+23*Math.sin(a0)).toFixed(2)} A23,23 0 0 1 ${(cx+23*Math.cos(a1)).toFixed(2)},${(26+23*Math.sin(a1)).toFixed(2)}Z" style="fill:${k<sh?'var(--sun)':'var(--surface)'}"/>`}}
  return `<svg viewBox="0 0 ${cnt*54-2} 52" class="pies" role="img" aria-label="${w} whole${w===1?'':'s'} and ${rem} ${d===2?'half':'parts of '+d}">${s}</svg>`}
addGame('p4-flip',{level:'P4',strand:'num',glyph:'¾',title:'Fraction Flip',topic:'Mixed numbers and improper fractions',
 how:'Flip two cards at a time to find pairs that show the same amount: an improper fraction, a mixed number or a pizza picture. Each board has 6 pairs. One move = flipping 2 cards. Finish in 6 moves for 10 points; every 2 extra moves cost 1 point (lowest 1 point). Fewer moves = more points.',rounds:3,
 round(api,r){
  const pairs=[],seen=new Set();
  while(pairs.length<6){const d=pick([2,3,4,5,6,8]),n=R(d+1,3*d-1);if(n%d===0||gcd(n,d)!==1||seen.has(n/d))continue;seen.add(n/d);
    pairs.push({n,d,k:pick(r===0?[['pic','imp'],['pic','mix']]:[['pic','imp'],['pic','mix'],['imp','mix'],['imp','mix']])})}
  const face=(p,k)=>k==='pic'?piesSVG(p.n,p.d):`<span class="big">${k==='imp'?fr(p.n,p.d):`<span class="whole">${Math.floor(p.n/p.d)}</span>${fr(p.n%p.d,p.d)}`}</span>`;
  const cards=shuffle(pairs.flatMap((p,i)=>p.k.map(k=>({i,html:face(p,k)}))));
  const ptsFor=m=>Math.max(1,Math.min(10,10-Math.floor((m-6)/2)));
  api.q(`<p class="qt">Board ${r+1} of 3: find all 6 matching pairs.</p>`);
  api.body.innerHTML=`<div class="mstat" id="mMv"><span>Moves: <b>0</b></span><span>Pairs found: <b>0</b> of 6</span><span>Points if you finish now: <b>10</b></span></div><div class="mgrid" id="mG"></div>`;
  const stat=()=>{$('mMv').innerHTML=`<span>Moves: <b>${moves}</b></span><span>Pairs found: <b>${got}</b> of 6</span><span>Points if you finish now: <b>${ptsFor(Math.max(moves,6))}</b></span>`};
  let open=[],lock=false,moves=0,got=0;
  cards.forEach((c,ci)=>{const b=document.createElement('button');b.className='mcard';b.textContent='?';b.setAttribute('aria-label','Hidden card');
    b.onclick=()=>{if(lock||b.classList.contains('up')||b.classList.contains('got'))return;sfx.tap();b.classList.add('up');b.innerHTML=c.html;open.push({b,c});
      if(open.length===2){moves++;const [x,y]=open;open=[];
        if(x.c.i===y.c.i){x.b.classList.add('got');y.b.classList.add('got');sfx.pop();got++;stat();
          if(got===6){const pts=ptsFor(moves);api.log(`Board ${r+1}: ${moves} moves → ${pts} points`);api.done(true,`Board cleared in ${moves} moves → ${pts} points${moves>6?` (6 moves = 10 points; you used ${moves-6} extra move${moves-6>1?'s':''}, which costs ${Math.min(9,Math.floor((moves-6)/2))} point${Math.floor((moves-6)/2)===1?'':'s'})`:' (a perfect board!)'}.`,
            pairs.map(p=>`${fr(p.n,p.d)} = <span class="whole">${Math.floor(p.n/p.d)}</span>${fr(p.n%p.d,p.d)} &nbsp;because ${p.n} ÷ ${p.d} = ${Math.floor(p.n/p.d)} remainder ${p.n%p.d}`),pts)}}
        else{lock=true;sfx.soft();stat();api.later(()=>{[x,y].forEach(o=>{o.b.classList.remove('up');o.b.textContent='?'});lock=false},950)}}};
    $('mG').appendChild(b)})}});

/* 5. Sweet Share — Fraction of a set 2.1 */
addGame('p4-share',{level:'P4',strand:'num',glyph:'⅓',title:'Sweet Share',topic:'Fraction of a set',
 how:'Share the sweets into equal groups, pick the groups the fraction describes, then count.',rounds:8,
 round(api,r){
  const b=pick([2,3,4,5,6,8]),k=R(2,b>=6?4:6),N=b*k,a=pick([...Array(b-1)].map((_,i)=>i+1).filter(x=>gcd(x,b)===1)),left=r%2===1;
  const who=pick(['Ali','Mei Ling','Ravi','Siti','Jun Wei','Aisha']),cols=['var(--tomato)','var(--sun)','var(--teal)','var(--violet)'];
  const sweet=i=>`<span class="sweet" style="background:${cols[i%4]}"></span>`;
  api.q(left?`<p class="qt">${who} has ${N} sweets and gives away ${fr(a,b)} of them. How many sweets are <b>left</b>?</p>`
            :`<p class="qt">${who} takes ${fr(a,b)} of the ${N} sweets. How many sweets does ${who} take?</p>`);
  api.body.innerHTML=`<div id="sSt" style="font-weight:800">Step 1: Share the sweets into equal groups. How many groups?</div>
    <div class="row" id="sG">${[2,3,4,5,6,8].map(g=>`<button class="btn" data-g="${g}">${g} groups</button>`).join('')}</div>
    <div class="groups" id="sP"><div class="grp static" style="max-width:none">${Array.from({length:N},(_,i)=>sweet(i)).join('')}</div></div><div id="sMsg" style="font-weight:700"></div><div id="sS3"></div>`;
  let mistakes=0;const chosen=new Set();
  $('sG').querySelectorAll('button').forEach(btn=>btn.onclick=()=>{if(api.answered)return;const g=+btn.dataset.g;sfx.tap();
    const per=Math.floor(N/g),rem=N%g;let h='';for(let j=0;j<g;j++)h+=`<div class="grp static">${Array.from({length:per},(_,i)=>sweet(j)).join('')}</div>`;
    if(rem)h+=`<div class="grp static" style="border-style:dashed">${Array.from({length:rem},()=>sweet(9)).join('')}</div>`;$('sP').innerHTML=h;
    if(g!==b){mistakes++;$('sMsg').textContent=rem?`${N} sweets cannot be shared equally into ${g} groups. Look at the fraction again.`:`These are equal groups, but the bottom number of ${a}/${b} tells you how many groups you need.`;return}
    $('sG').querySelectorAll('button').forEach(x=>x.disabled=true);btn.classList.add('ok');
    $('sMsg').textContent=`${N} ÷ ${b} = ${k} sweets in each group.`;
    $('sSt').innerHTML=`Step 2: Tap ${a} group${a>1?'s':''} to show the ${fr(a,b)} ${left?'that is given away':`that ${who} takes`}.`;
    $('sP').innerHTML=Array.from({length:b},(_,j)=>`<button class="grp" data-j="${j}" aria-pressed="false">${Array.from({length:k},()=>sweet(j)).join('')}</button>`).join('');
    $('sP').querySelectorAll('.grp').forEach(gb=>gb.onclick=()=>{if(api.answered)return;const j=+gb.dataset.j;chosen.has(j)?chosen.delete(j):chosen.add(j);sfx.tap();
      gb.classList.toggle('sel',chosen.has(j));gb.setAttribute('aria-pressed',String(chosen.has(j)));
      if(chosen.size===a){$('sSt').innerHTML='Step 3: Count the sweets.';
        $('sS3').innerHTML=`<div class="row"><b>${left?'Sweets left:':`Sweets ${who} takes:`}</b><input class="num" id="sIn" inputmode="numeric" aria-label="Answer"><button class="btn primary" id="sChk">Check</button></div>`;
        $('sChk').onclick=()=>{const v=parseInt($('sIn').value,10);if(isNaN(v))return;const ans=left?(b-a)*k:a*k,ok=v===ans;$('sIn').disabled=true;
          api.done(ok,ok?`${left?'There are':who+' takes'} ${ans} sweets${left?' left':''}.`:`The answer is ${ans} sweets.`,
            [`${N} ÷ ${b} = ${k} sweets in each group`,left?`${a} group${a>1?'s are':' is'} given away, so ${b-a} group${b-a>1?'s are':' is'} left: ${b-a} × ${k} = <b>${ans}</b>`:`${fr(a,b)} of ${N} is ${a} group${a>1?'s':''}: ${a} × ${k} = <b>${ans}</b>`],
            ok?Math.max(4,10-3*mistakes):0)}}
      else $('sS3').innerHTML=''})})}});

/* 6. Fraction Target — Addition and subtraction of fractions 3.1 */
function barsSVG(cells,D){const rows=Math.ceil(cells.length/D),cw=400/D;let s='';
  cells.forEach((c,i)=>{const x=(i%D)*cw,y=Math.floor(i/D)*36;s+=`<rect x="${x+1}" y="${y+1}" width="${cw-2}" height="28" rx="3" style="fill:${c==='a'?'var(--teal)':c==='b'?'var(--violet)':c==='x'?'var(--surface)':'var(--surface)'}" stroke="var(--ink)" stroke-width="1.5"/>${c==='x'?`<path d="M${x+5},${y+5} L${x+cw-5},${y+25} M${x+cw-5},${y+5} L${x+5},${y+25}" stroke="var(--tomato)" stroke-width="2.5"/>`:''}`});
  return `<svg viewBox="0 0 402 ${rows*36}" class="bars" role="img" aria-label="Fraction bar model">${s}</svg>`}
addGame('p4-target',{level:'P4',strand:'num',glyph:'+',title:'Fraction Target',topic:'Adding and subtracting fractions',
 how:'Pick the two fraction cards that hit the target. Change them to the same denominator first.',rounds:10,
 round(api,r){
  const sub=r>=5&&r%2===1;let hand,T,D,pair,m;
  for(;;){const d1=pick([2,3,4,5,6]);m=pick([2,3,4,5,6].filter(x=>d1*x<=12));const d2=d1*m;D=d2;
    const a=pick([...Array(d1-1)].map((_,i)=>i+1).filter(x=>gcd(x,d1)===1)),b=pick([...Array(d2-1)].map((_,i)=>i+1).filter(x=>gcd(x,d2)===1));
    const p={n:a,d:d1,v:a*m},q={n:b,d:d2,v:b};if(sub&&p.v===q.v)continue;T=sub?Math.abs(p.v-q.v):p.v+q.v;hand=[p,q];
    for(let g=0;hand.length<5&&g<60;g++){const dd=pick([d1,d2]),nn=R(1,dd-1);if(gcd(nn,dd)!==1)continue;const v=nn*(D/dd);if(!hand.some(h=>h.v===v))hand.push({n:nn,d:dd,v})}
    if(hand.length<5)continue;let cnt=0;for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)if((sub?Math.abs(hand[i].v-hand[j].v):hand[i].v+hand[j].v)===T)cnt++;
    if(cnt===1){pair=[p,q];break}}
  hand=shuffle(hand);
  api.q(`<p class="qt">${sub?'Pick two cards: <b>bigger − smaller</b> must equal the target.':'Pick two cards that <b>add up</b> to the target.'}</p>`);
  api.body.innerHTML=`<div><span class="target">Target: ${nice(T,D)}</span></div><div class="hand" id="tH"></div><div><button class="btn primary" id="tChk" disabled>Check</button></div>`;
  let sel=[];
  hand.forEach((h,i)=>{const b=document.createElement('button');b.className='fcard';b.innerHTML=fr(h.n,h.d);b.setAttribute('aria-label',`${h.n} over ${h.d}`);
    b.onclick=()=>{if(api.answered)return;sfx.tap();if(sel.includes(i))sel=sel.filter(x=>x!==i);else{sel.push(i);if(sel.length>2)sel.shift()}
      [...$('tH').children].forEach((c,j)=>c.classList.toggle('sel',sel.includes(j)));$('tChk').disabled=sel.length!==2};$('tH').appendChild(b)});
  $('tChk').onclick=()=>{const [x,y]=sel.map(i=>hand[i]),got=sub?Math.abs(x.v-y.v):x.v+y.v,ok=got===T;
    [...$('tH').children].forEach((c,j)=>{c.disabled=true;const h=hand[j];if(pair.includes(h))c.classList.add('ok');else if(sel.includes(j))c.classList.add('no');c.classList.remove('sel')});
    const [p,q]=pair,big=p.v>=q.v?p:q,small=big===p?q:p,conv=m>1?[`Change to ${D}ths: ${fr(p.n,p.d)} = ${fr(p.v,D)}`]:[];
    const cells=sub?Array.from({length:big.v},(_,i)=>i>=big.v-small.v?'x':'a'):[...Array(p.v).fill('a'),...Array(q.v).fill('b')];
    while(cells.length%D)cells.push('');
    api.done(ok,ok?`That hits the target exactly.`:`Your two cards make ${nice(got,D)}. The right pair is highlighted.`,
      [...conv,sub?`${fr(big.v,D)} − ${fr(small.v,D)} = ${fr(T,D)}${nice(T,D)!==fr(T,D)?` = ${nice(T,D)}`:''}`:`${fr(p.v,D)} + ${fr(q.v,D)} = ${fr(T,D)}${nice(T,D)!==fr(T,D)?` = ${nice(T,D)}`:''}`,
       barsSVG(cells,D),`Each bar is 1 whole cut into ${D} equal parts.`])}}});

/* 7. Decimal Line-Up — Decimals 1.1, 1.2 */
addGame('p4-decimals',{level:'P4',strand:'num',glyph:'.5',title:'Decimal Line-Up',topic:'Decimals: place value, comparing and ordering',
 how:'Tap the decimals in order to line them up. Watch out for look-alikes such as 0.7 and 0.07.',rounds:8,
 round(api,r){
  const d3=r>=3,desc=r>=5&&r%2===1;let vals;
  do{const w=R(0,3),[a,b,c]=shuffle([1,2,3,4,5,6,7,8,9]);
    let cs=[`${w}.${a}`,`${w}.${a}${b}`,`${w}.0${a}`,`${w}.${b}${a}`,`${w}.${b}`,`${w+1}.0${b}`,`${w}.0${b}`];
    if(d3)cs.push(`${w}.${a}0${b}`,`${w}.00${a}`,`${w}.${a}${b}${c}`,`${w}.0${a}${b}`,`${w}.${b}0${a}`);
    vals=[];const seen=new Set();for(const s of shuffle(cs)){if(seen.has(+s))continue;seen.add(+s);vals.push(s);if(vals.length===5)break}
  }while(vals.length<5||(d3&&!vals.some(s=>s.split('.')[1].length===3)));
  const sorted=[...vals].sort((x,y)=>desc?y-x:x-y),dp=d3?3:2;
  api.q(`<p class="qt">Arrange in <b>${desc?'decreasing':'increasing'}</b> order, ${desc?'greatest':'smallest'} first.</p>`);
  api.body.innerHTML=`<div class="row" id="lP"></div><div class="dslots" id="lS"></div><div><button class="btn primary" id="lChk" disabled>Check</button></div>`;
  const slots=Array(5).fill(null);
  function draw(){$('lP').innerHTML=vals.map((v,i)=>`<button class="dpick" data-i="${i}" ${slots.includes(i)||api.answered?'disabled':''}>${v}</button>`).join('');
    $('lS').innerHTML=slots.map((s,k)=>(k?`<span class="lt">${desc?'&gt;':'&lt;'}</span>`:'')+`<button class="dslot ${s!==null?'full':''}" data-k="${k}">${s!==null?vals[s]:''}</button>`).join('');
    $('lP').querySelectorAll('.dpick').forEach(b=>b.onclick=()=>{const k=slots.indexOf(null);if(k<0)return;slots[k]=+b.dataset.i;sfx.pop();draw()});
    $('lS').querySelectorAll('.dslot').forEach(b=>b.onclick=()=>{if(api.answered)return;slots[+b.dataset.k]=null;sfx.tap();draw()});
    $('lChk').disabled=slots.includes(null)||api.answered}
  draw();
  $('lChk').onclick=()=>{let right=0;const got=slots.map(i=>vals[i]);
    const pad=s=>{const [w,f]=s.split('.');return [w,...f.padEnd(dp,'0').split('')]};
    const table=`<table class="pvt"><tr><th>Ones</th><th>.</th><th>Tenths</th><th>Hundredths</th>${d3?'<th>Thousandths</th>':''}</tr>${sorted.map(s=>{const p=pad(s);return `<tr><td>${p[0]}</td><td>.</td>${p.slice(1).map(x=>`<td>${x}</td>`).join('')}</tr>`}).join('')}</table>`;
    const ok=got.every((g,k)=>g===sorted[k]);
    [...$('lS').querySelectorAll('.dslot')].forEach((b,k)=>{if(got[k]===sorted[k]){right++;b.classList.add('ok')}else b.classList.add('no')});
    $('lChk').disabled=true;
    api.done(ok,ok?`${sorted.join(desc?' > ':' < ')}`:`The correct order is ${sorted.join(desc?' > ':' < ')}`,
      ['Line up the place values. Fill empty places with 0, then compare the ones, then the tenths, then the hundredths'+(d3?', then the thousandths.':'.'),table],ok?10:right*2)}}});
