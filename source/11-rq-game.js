/* ================= PSLE QUEST: game =================
   One revision game across all topics, laid out like the real P6 paper:
   Stage A = Paper 1 Booklet A (MCQ), Stage B = Paper 1 Booklet B (short answer), both without a calculator;
   Stage C = Paper 2 (short + long answer) with an on-screen calculator. Long questions are "boss battles". */
const RQSTAGE={A:{name:'Paper 1 · Booklet A',sub:'Multiple choice',calc:false,icon:'🅰️',how:'Choose the correct option. The 1-mark questions come first, then the 2-mark questions.'},
  B:{name:'Paper 1 · Booklet B',sub:'Short answer',calc:false,icon:'✏️',how:'Write your answer in the box. Work it out on paper first. Each question carries 2 marks.'},
  C:{name:'Paper 2',sub:'Short and long answer',calc:true,icon:'🧮',how:'Calculator allowed! Long questions are boss battles: every mark you score hits the boss.'}};
const RQLINK={pct:'p6-pchange',ratio:'p6-ratio',alg:'p6-algebra',circ:'p6-circle',avg:'p6-average',frac:'p6-fdiv',angle:'p6-chain',vol:'p6-cuberoot',rate:'p5-rate',whole:'p5-vault',dec:'p4-decimals',data:'p4-graphs',area:'p5-tarea',solid:'p4-nets',meas:'p4-cashier',pat:'p4-factors'};
const RQBOSS={vol:'Tank Titan',circ:'Circle Cyclops',pct:'Percent Phantom',ratio:'Ratio Rex',frac:'Fraction Fiend',alg:'Algebra Ogre',angle:'Angle Goblin',data:'Graph Gremlin',rate:'Rate Wraith',avg:'Average Imp',area:'Area Golem',whole:'Number Ninja',meas:'Measure Mummy',dec:'Decimal Dragon',pat:'Pattern Python',solid:'Cube Kraken'};
const RQQUEST={
  full:{icon:'🏆',name:'Full mock quest',desc:'10 MCQs, 6 short answers, then Paper 2: 2 short answers and 3 boss battles. About 45 marks, 40 to 60 minutes.',plan:[['A',[['mcq1',6],['mcq2',4]]],['B',[['saq1',6]]],['C',[['saq2',2],['long',3]]]]},
  quick:{icon:'⚡',name:'Quick quest',desc:'A shorter run through all three stages: 5 MCQs, 3 short answers and 2 boss battles. About 20 minutes.',plan:[['A',[['mcq1',3],['mcq2',2]]],['B',[['saq1',3]]],['C',[['long',2]]]]},
  boss:{icon:'👾',name:'Boss rush',desc:'Paper 2 practice only: 4 long questions with the calculator switched on.',plan:[['C',[['long',4]]]]},
  topic:{icon:'🎯',name:'Topic training',desc:'Pick one topic. You get MCQs, short answers and long questions on just that topic.',plan:null}};
let RQ=null;

function rqPool(kind){return RQB.filter(g=>kind==='mcq1'?g.kind==='mcq1':kind==='mcq2'?g.kind==='mcq2':kind==='saq1'?g.kind==='saq'&&g.paper===1:kind==='saq2'?g.kind==='saq':g.kind==='long')}
const RQMIX={mixed:{name:'Mixed ability',sub:'Recommended. Like the PSLE: mostly Foundation and Standard, a few Challenge questions at the end of each section.',w:[.4,.4,.2]},
  gentle:{name:'Gentler',sub:'More Foundation questions. Good for building confidence.',w:[.6,.4,0]},
  stretch:{name:'Stretch',sub:'More Standard and Challenge questions, like the hardest prelim papers.',w:[.2,.4,.4]}};
let RQMIXK='mixed';try{RQMIXK=localStorage.getItem('rqMix')||'mixed'}catch(e){}if(!RQMIX[RQMIXK])RQMIXK='mixed';
const RQLVN=['','Foundation','Standard','Challenge'];
function rqTiers(n,w){let c=Math.round(n*w[2]),a=Math.round(n*w[0]);if(w[2]>0&&n>=4&&c===0)c=1;if(a+c>n)a=n-c;const out=[];for(let i=0;i<n;i++)out.push(i<a?1:i<n-c?2:3);return out}
function rqPool(kind){return RQB.filter(g=>kind==='mcq1'?g.kind==='mcq1':kind==='mcq2'?g.kind==='mcq2':kind==='saq1'?g.kind==='saq'&&g.paper===1:kind==='saq2'?g.kind==='saq':g.kind==='long')}
function rqBuild(qk,topic){const list=[],used=new Set(),tUse={},w=RQMIX[RQMIXK].w;
  if(qk==='topic'){const tg=RQB.filter(g=>g.topic===topic),grab=(f,n,st)=>{const pool=shuffle(tg.filter(f));for(let i=0;i<n&&pool.length;i++)list.push({gen:pool[i%pool.length],st})};
    grab(g=>g.kind==='mcq1'||g.kind==='mcq2',3,'A');grab(g=>g.kind==='saq'&&g.paper===1,2,'B');grab(g=>(g.kind==='saq'&&g.paper===2)||g.kind==='long',3,'C');
    while(list.length<6){const g=pick(tg);list.push({gen:g,st:g.kind.startsWith('mcq')?'A':g.kind==='long'||g.paper===2?'C':'B'})}
    const ord={A:0,B:1,C:2};list.sort((a,b)=>ord[a.st]-ord[b.st]||(a.gen.kind==='long')-(b.gen.kind==='long')||a.gen.lv-b.gen.lv);return list}
  RQQUEST[qk].plan.forEach(([st,items])=>items.forEach(([k,n])=>{const tiers=k==='mcq1'?Array(n).fill(1):rqTiers(n,w);
    tiers.forEach(lv=>{const all=rqPool(k).filter(g=>!used.has(g.id));let pool=[];for(const d of [0,1,-1,2,-2]){pool=all.filter(g=>g.lv===lv+d);if(pool.length)break}
      pool=shuffle(pool);pool.sort((a,b)=>(tUse[a.topic]||0)-(tUse[b.topic]||0));const g=pool[0]||pick(rqPool(k));used.add(g.id);tUse[g.topic]=(tUse[g.topic]||0)+1;list.push({gen:g,st})})}));return list}

addGame('p6-quest',{level:'P6',strand:'rev',topic:'All topics',title:'PSLE Quest',glyph:'★',ownStart:true,modes:[['solo','Solo']],
  how:'Revise every topic the way the real paper is set: Booklet A MCQs, Booklet B short answers, then Paper 2 with a calculator.',
  custom(stage){rqHome(stage)}});

function rqHome(stage){rqCalcShow(false);const tiles=Object.entries(RQQUEST).map(([k,q])=>`<button class="wtile" data-q="${k}"><span class="wic" aria-hidden="true">${q.icon}</span><b>${q.name}</b><small>${q.desc}</small></button>`).join('');
  stage.innerHTML=`<div class="rqhome"><div class="rqmap">${['A','B','C'].map((s,i)=>`<div class="rqisle s${s}"><span class="rqic">${RQSTAGE[s].icon}</span><b>${RQSTAGE[s].name}</b><small>${RQSTAGE[s].sub}</small><span class="rqcalc-tag ${RQSTAGE[s].calc?'on':''}">${RQSTAGE[s].calc?'🧮 Calculator allowed':'🚫 No calculator'}</span></div>${i<2?'<span class="rqarrow" aria-hidden="true">→</span>':''}`).join('')}</div>
    <div class="rqrules"><b>How it works</b><ul><li>Questions follow the real paper: <b>MCQs first</b>, then <b>short answers</b>, then <b>Paper 2</b>.</li><li>Paper 1 has <b>no calculator</b>. In Paper 2, tap <b>🧮 Calculator</b> to open one.</li><li>Every question shows its marks, like <span class="rqmk">[2]</span>. Wrong the first time? You get <b>one more try</b> for half the marks.</li><li>Long questions are <b>boss battles</b>: each mark you score knocks off one of the boss's hearts.</li><li>A <b>timer</b> counts up for each question, each section and the whole paper, with a suggested time for each question.</li><li>At the end you get a <b>report card</b>: marks and time for each topic, plus tips on what to work on next.</li></ul></div>
    <div class="rqmixbox"><b>Paper difficulty</b><div class="rqmix" role="group" aria-label="Paper difficulty">${Object.entries(RQMIX).map(([k,m])=>`<button class="btn" data-mix="${k}" aria-pressed="${k===RQMIXK}">${m.name}</button>`).join('')}</div><small id="rqMixSub">${RQMIX[RQMIXK].sub}</small></div>
    <h3 style="margin:4px 0 0">Choose your quest</h3><div class="wtiles">${tiles}</div><div id="rqTop" hidden></div></div>`;
  stage.querySelectorAll('[data-mix]').forEach(b=>b.onclick=()=>{RQMIXK=b.dataset.mix;try{localStorage.setItem('rqMix',RQMIXK)}catch(e){}sfx.tap();stage.querySelectorAll('[data-mix]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('rqMixSub').textContent=RQMIX[RQMIXK].sub});
  stage.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{sfx.pop();const k=b.dataset.q;if(k!=='topic')return rqGo(k);
    const tp=Object.keys(RQT).filter(t=>RQB.some(g=>g.topic===t)),box=$('rqTop');box.hidden=false;
    box.innerHTML=`<h3 style="margin:8px 0">Which topic?</h3><div class="rqtopics">${tp.map(t=>`<button class="btn" data-t="${t}">${RQT[t]} <small>(${RQB.filter(g=>g.topic===t).length} kinds)</small></button>`).join('')}</div>`;
    box.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{sfx.pop();rqGo('topic',x.dataset.t)});box.scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})});
  qubi('gQ','wave','Ready for PSLE Quest?',true)}

function rqGo(qk,topic){clearInterval(RQ&&RQ.iv);RQ={qk,topic,mix:RQMIXK,running:false,iv:0,last:0,list:rqBuild(qk,topic),i:0,got:0,max:0,byT:{},byS:{},streak:0,t0:Date.now(),res:[]};RQ.list.forEach(x=>{x.q=null;x.ms=0});rqStageIntro()}
const RQPACE={A:60,B:90,C:100}; /* suggested seconds per mark: PSLE Paper 1 is 60 min for 45 marks, Paper 2 is 90 min for 55 marks */
const rqAim=it=>it.q?it.q.marks*RQPACE[it.st]:0,mmss=ms=>{const s=Math.round(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`};
function rqTick(){if(!RQ||!$('rqTm')){if(RQ){clearInterval(RQ.iv);RQ.iv=0}return}const now=performance.now(),it=RQ.list[RQ.i];if(RQ.running&&!document.hidden)it.ms+=now-RQ.last;RQ.last=now;
  const sec=RQ.list.filter(x=>x.st===it.st).reduce((a,x)=>a+x.ms,0),tot=RQ.list.reduce((a,x)=>a+x.ms,0),aim=rqAim(it)*1000,cls=it.ms>aim*1.5?'over2':it.ms>aim?'over':'';
  $('rqTm').innerHTML=`<span class="${cls}">⏱ This question <b>${mmss(it.ms)}</b> <small>(aim ${mmss(aim)})</small></span><span>${RQSTAGE[it.st].icon} Section <b>${mmss(sec)}</b></span><span>📝 Paper <b>${mmss(tot)}</b></span>`}
function rqClock(on){if(!RQ)return;rqTick();RQ.running=on;RQ.last=performance.now();if(on&&!RQ.iv)RQ.iv=setInterval(rqTick,500);rqTick()}
function rqStageIntro(){if(RQ)RQ.running=false;const it=RQ.list[RQ.i],S=RQSTAGE[it.st],stage=$('gStage'),n=RQ.list.filter(x=>x.st===it.st).length;rqCalcShow(false);
  stage.innerHTML=`${rqTrack()}<div class="rqintro s${it.st}"><span class="rqbig" aria-hidden="true">${S.icon}</span><span class="tag">Stage ${'ABC'.indexOf(it.st)+1}${RQ.qk==='boss'?'':' of 3'}</span><h3>${S.name}: ${S.sub}</h3><p>${S.how}</p>
    <p><span class="rqcalc-tag ${S.calc?'on':''}">${S.calc?'🧮 Calculator allowed in this stage':'🚫 No calculator in this stage'}</span> · ${n} question${n>1?'s':''}</p><button class="btn primary" id="rqStart">Start ${S.name} →</button></div>`;
  $('rqStart').onclick=()=>{sfx.ok();rqShow()};qubi('gQ','wave',S.calc?'Calculator time!':'Pencils ready!',true)}
function rqTrack(){return `<div class="rqtrack">${['A','B','C'].filter(s=>RQ.list.some(x=>x.st===s)).map(s=>`<div class="rqtr ${RQ.list[Math.min(RQ.i,RQ.list.length-1)].st===s?'cur':''}"><b>${RQSTAGE[s].icon} ${RQSTAGE[s].name}</b><span>${RQ.list.map((x,i)=>x.st===s?`<i class="d ${x.r===undefined?(i===RQ.i?'now':''):x.r>=1?'ok':x.r>0?'half':'no'}" title="Question ${i+1}"></i>`:'').join('')}</span></div>`).join('')}</div>`}

function rqShow(){document.body.classList.add('playing');requestAnimationFrame(()=>fitView());const it=RQ.list[RQ.i],S=RQSTAGE[it.st];let q=it.q;
  if(!q){for(let t=0;t<5&&!q;t++){try{q=it.gen.make()}catch(e){q=null}}it.q=q;q.parts.forEach(p=>{p.tries=0;p.got=null});q.marks=q.parts.reduce((a,p)=>a+p.marks,0)}
  const isBoss=it.gen.kind==='long',stage=$('gStage'),name=RQBOSS[it.gen.topic]||'Exam Boss';
  stage.innerHTML=`${rqTrack()}<div class="rqhead"><span class="pill">Q${RQ.i+1} of ${RQ.list.length}</span><span class="pill">${S.name}</span><span class="pill rqtopic">${RQT[it.gen.topic]}</span><span class="pill rqlv l${it.gen.lv}">${RQLVN[it.gen.lv]}</span><span class="rqmk">[${q.marks} mark${q.marks>1?'s':''}]</span>
      <span style="flex:1"></span>${S.calc?'<button class="btn" id="rqCalcBtn" aria-expanded="false">🧮 Calculator</button>':'<span class="rqcalc-tag" title="Calculators are not allowed in Paper 1">🚫 No calculator</span>'}</div><div class="rqtm" id="rqTm" aria-live="off"></div>
    ${isBoss?`<div class="rqboss" id="rqBoss"><div class="rqmon">${rqMonster(it.gen.topic)}</div><div><b>Boss battle: ${name}</b><div class="rqhp" id="rqHp">${'<i class="h"></i>'.repeat(q.marks)}</div><small>Score marks to knock off its ${q.marks} hearts.</small></div></div>`:''}
    <div class="rqq">${q.stem?`<div class="rqstem">${q.stem}</div>`:''}${q.fig?`<div class="rqfig">${q.fig}</div>`:''}<div class="rqparts">${q.parts.map((p,j)=>rqPartHTML(p,j,q.parts.length)).join('')}</div></div><div id="gf"></div>`;
  if(S.calc)$('rqCalcBtn').onclick=()=>{sfx.tap();rqCalcShow(!$('rqCalc')||$('rqCalc').hidden)};else rqCalcShow(false);
  if(isBoss&&!calm){const m=stage.querySelector('.rqmon');m.classList.add('enter')}
  q.parts.forEach((p,j)=>rqWire(p,j));rqActivate(0);rqClock(true);qubi('gQ',isBoss?'wave':'idle',isBoss?`${name} appears!`:pick(['You got this!','Read carefully!','Take your time.']),true)}

function rqPartHTML(p,j,n){const lb=n>1?`<b class="rqlb">(${'abcd'[j]})</b>`:'';const qq=p.q?`<div class="rqpq">${lb}<span>${p.q}</span><span class="rqmk">[${p.marks}]</span></div>`:'';
  let inp='';
  if(p.type==='choice')inp=`<div class="choices one rqch">${p.opts.map((o,k)=>`<button class="btn" data-k="${k}"><span class="rqon">(${k+1})</span> ${o}</button>`).join('')}</div>`;
  else if(p.type==='num'||p.type==='expr'||p.type==='set')inp=`<div class="row rqin">${n>1||p.q?'':''}<b>Ans:</b>${p.pre?`<span>${p.pre}</span>`:''}<input class="num" ${p.type==='num'?'inputmode="decimal"':''} autocomplete="off" aria-label="Answer ${n>1?'('+'abcd'[j]+')':''}" style="width:${p.type==='num'?'9em':'11em'}">${p.unit?`<span>${p.unit}</span>`:''}<button class="btn primary rqchk">Check</button></div>${p.type==='set'?'<small class="rqhint">Separate the numbers with commas, e.g. 1, 2, 4</small>':p.type==='expr'?'<small class="rqhint">Type it like 6k + 3</small>':p.simp?'<small class="rqhint">Fractions: type 3/4, or a mixed number like 1 2/3</small>':''}`;
  else if(p.type==='multi')inp=`<div class="row rqin"><b>Ans:</b>${p.v.map((_,k)=>`${p.labels?`<span>${p.labels[k]}:</span>`:''}<input class="num sm" inputmode="decimal" autocomplete="off" aria-label="${p.labels?p.labels[k]:p.units[k]}"><span>${p.units[k]}</span>`).join(' ')}<button class="btn primary rqchk">Check</button></div>`;
  else if(p.type==='tfn')inp=`<table class="rqt rqtfn"><tr><th>Statement</th><th>True</th><th>False</th><th>Not possible to tell</th></tr>${p.rows.map((r,k)=>`<tr><td>${r[0]}</td>${[0,1,2].map(c=>`<td><button class="tf" data-r="${k}" data-c="${c}" aria-label="${['True','False','Not possible to tell'][c]}" aria-pressed="false"></button></td>`).join('')}</tr>`).join('')}</table><div class="row"><button class="btn primary rqchk">Check</button></div>`;
  return `<div class="rqpart" id="rqP${j}" data-j="${j}">${qq}${p.q||n>1?'':''}<div class="rqarea">${inp}</div><div class="rqfb" aria-live="polite"></div></div>`}

function rqActivate(j){const q=RQ.list[RQ.i].q;RQ.part=j;q.parts.forEach((p,k)=>{const el=$('rqP'+k);el.classList.toggle('act',k===j);el.classList.toggle('wait',k>j);el.querySelectorAll('button,input').forEach(b=>{if(b.closest('.rqfb'))return;if(p.got!==null)return;b.disabled=k!==j||b.dataset.dead==='1'})});
  const el=$('rqP'+j);if(el){const i=el.querySelector('input');if(i&&!('ontouchstart' in window))i.focus({preventScroll:true});RQ.input=i||null;if(j>0)el.scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})}}

function rqParse(s){s=String(s).trim().replace(/[$,°%]/g,'').replace(/\s*(cm²|cm³|cm|m²|m|kg|g|ℓ|l|ml|min|h|km)$/i,'').replace(/−/g,'-').trim();let m;
  if((m=s.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/)))return {v:+m[1]+ +m[2]/+m[3],n:+m[1]*+m[3]+ +m[2],d:+m[3],fr:true};
  if((m=s.match(/^(-?\d+)\s*\/\s*(\d+)$/)))return +m[2]?{v:+m[1]/+m[2],n:+m[1],d:+m[2],fr:true}:null;
  if(/^-?(\d+\.?\d*|\.\d+)$/.test(s))return {v:+s};return null}
function rqExpr(s,x){s=s.replace(/\s|×|\*/g,'').replace(/−/g,'-').toLowerCase();if(!s)return null;let c=0,k=0;const terms=s.match(/[+-]?[^+-]+/g);if(!terms||terms.join('')!==s)return null;
  for(const t of terms){const m=t.match(/^([+-]?)(\d*\.?\d*)([a-z]?)$/);if(!m)return null;const sg=m[1]==='-'?-1:1;if(m[3]){if(m[3]!==x)return null;c+=sg*(m[2]===''?1:+m[2])}else{if(m[2]==='')return null;k+=sg*+m[2]}}return {c,k}}
function rqGrade(p,el){/* returns {ok,msg} or null if nothing entered */
  if(p.type==='num'){const r=rqParse(el.querySelector('input').value);if(!r)return null;const ok=Math.abs(r.v-p.v)<=(p.tol||1e-6);
    if(ok&&p.simp&&r.fr&&gcd(Math.abs(r.n),r.d)>1)return {ok:false,msg:'Right value, but give the fraction in its simplest form.'};
    if(ok&&p.simp&&r.fr&&Math.abs(r.n)>r.d&&false)return {ok:true};return {ok}}
  if(p.type==='expr'){const r=rqExpr(el.querySelector('input').value,p.v.x);if(!r)return el.querySelector('input').value.trim()?{ok:false,msg:`Write it using ${p.v.x}, like 4${p.v.x} + 7.`}:null;return {ok:r.c===p.v.c&&r.k===p.v.k}}
  if(p.type==='set'){const v=el.querySelector('input').value;if(!v.trim())return null;const a=[...new Set((v.match(/\d+/g)||[]).map(Number))].sort((x,y)=>x-y);return {ok:a.join()===p.v.slice().sort((x,y)=>x-y).join(),msg:a.length&&a.length<p.v.length?'Some common factors are missing.':''}}
  if(p.type==='multi'){const ins=[...el.querySelectorAll('input')],vs=ins.map(i=>rqParse(i.value));if(vs.some(v=>!v))return null;const oks=vs.map((v,k)=>Math.abs(v.v-p.v[k])<=(p.tol||1e-6));ins.forEach((i,k)=>{i.classList.toggle('okc',oks[k]);i.classList.toggle('noc',!oks[k])});return {ok:oks.every(Boolean)}}
  if(p.type==='tfn'){const pk=p.rows.map((_,k)=>{const b=el.querySelector(`.tf[data-r="${k}"][aria-pressed="true"]`);return b?+b.dataset.c:-1});if(pk.includes(-1))return {ok:false,msg:'Tick one box in every row first.',skip:true};
    const oks=pk.map((c,k)=>c===p.rows[k][1]);el.querySelectorAll('tr').forEach((tr,k)=>{if(k)tr.classList.toggle('bad',!oks[k-1])});return {ok:oks.every(Boolean),msg:oks.every(Boolean)?'':`${oks.filter(x=>!x).length} row${oks.filter(x=>!x).length>1?'s are':' is'} not right yet.`}}}
function rqShowAns(p){if(p.type==='choice')return `(${p.ans+1}) ${p.opts[p.ans]}`;if(p.type==='num')return (p.pre||'')+(p.show||fmtN(p.v))+(p.unit?(p.unit==='°'||p.unit==='%'?'':' ')+p.unit:'');if(p.type==='expr'||p.type==='set')return p.show;
  if(p.type==='multi')return p.v.map((v,k)=>(p.labels?p.labels[k]+' ':'')+fmtN(v)+' '+p.units[k]).join(', ');if(p.type==='tfn')return p.rows.map(r=>`${['True','False','Not possible to tell'][r[1]]}`).join(' · ')}

function rqWire(p,j){const el=$('rqP'+j);
  const submit=(res,btn)=>{if(!res)return;if(res.skip){el.querySelector('.rqfb').innerHTML=`<p class="rqmsg">${res.msg}</p>`;return}
    p.tries++;const fb=el.querySelector('.rqfb');
    if(res.ok){p.got=p.tries===1?p.marks:p.marks/2;fb.innerHTML=`<p class="rqmsg ok">✓ ${p.tries===1?pick(['Correct!','Spot on!','Nailed it!','Brilliant!']):'Correct on the second try'} <b>+${fmtN(p.got)} mark${p.got===1?'':'s'}</b></p>`;sfx.ok();if(!calm)confetti(30);
      if(btn&&p.type==='choice')btn.classList.add('right');rqHit(p.got)}
    else if(p.tries===1){fb.innerHTML=`<p class="rqmsg no">✗ ${res.msg||'Not quite.'} Check your working and try once more (for half the marks).</p>`;sfx.no();qubi('gQ','oops',pick(RETRY));
      if(btn){btn.classList.add('wrong');btn.disabled=true;btn.dataset.dead='1'}el.querySelectorAll('input').forEach(i=>i.classList.add('noc'));const s=$('gStage');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');return}
    else{p.got=0;fb.innerHTML=`<p class="rqmsg no">✗ ${res.msg?res.msg+' ':''}The answer is <b>${rqShowAns(p)}</b>.</p>`;sfx.no();qubi('gQ','oops',pick(OOPS));if(btn)btn.classList.add('wrong');
      if(p.type==='choice')el.querySelector(`[data-k="${p.ans}"]`).classList.add('right')}
    el.querySelectorAll('.rqarea button,.rqarea input').forEach(b=>b.disabled=true);el.classList.add('done');
    const q=RQ.list[RQ.i].q,next=q.parts.findIndex(x=>x.got===null);if(next>=0)rqActivate(next);else rqDone()};
  if(p.type==='choice')el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(p.got!==null)return;submit({ok:+b.dataset.k===p.ans},b)});
  else if(p.type==='tfn'){el.querySelectorAll('.tf').forEach(b=>b.onclick=()=>{if(p.got!==null)return;sfx.tap();el.querySelectorAll(`.tf[data-r="${b.dataset.r}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
    el.querySelector('.rqchk').onclick=()=>submit(rqGrade(p,el))}
  else{const go=()=>{if(p.got!==null)return;el.querySelectorAll('input').forEach(i=>i.classList.remove('okc','noc'));const r=rqGrade(p,el);if(!r){el.querySelector('.rqfb').innerHTML='<p class="rqmsg">Type your answer first.</p>';return}submit(r)};
    el.querySelector('.rqchk').onclick=go;el.querySelectorAll('input').forEach(i=>{i.onkeydown=e=>{if(e.key==='Enter')go()};i.onfocus=()=>{RQ.input=i}})}}

function rqHit(n){const hp=$('rqHp');if(!hp)return;let k=n;const hs=[...hp.querySelectorAll('.h:not(.gone):not(.half)')],half=hp.querySelector('.h.half');
  if(half&&k>=.5){half.classList.replace('half','gone');k-=.5}
  for(const h of hs){if(k>=1){h.classList.add('gone');k-=1}else if(k>=.5){h.classList.add('half');k-=.5}}
  const m=$('rqBoss').querySelector('.rqmon');m.classList.remove('hit');void m.offsetWidth;m.classList.add('hit');const dmg=document.createElement('span');dmg.className='rqdmg';dmg.textContent='−'+fmtN(n)+(n===1?' heart':' hearts');m.appendChild(dmg);setTimeout(()=>dmg.remove(),1200)}

function rqDone(){rqClock(false);const it=RQ.list[RQ.i],q=it.q,got=q.parts.reduce((a,p)=>a+p.got,0),isBoss=it.gen.kind==='long';
  it.r=got/q.marks;RQ.got+=got;RQ.max+=q.marks;const t=it.gen.topic;RQ.byT[t]=RQ.byT[t]||[0,0];RQ.byT[t][0]+=got;RQ.byT[t][1]+=q.marks;RQ.byS[it.st]=RQ.byS[it.st]||[0,0];RQ.byS[it.st][0]+=got;RQ.byS[it.st][1]+=q.marks;
  const perfect=got===q.marks&&q.parts.every(p=>p.tries===1);RQ.streak=perfect?RQ.streak+1:0;
  let head='';if(isBoss){const m=$('rqBoss').querySelector('.rqmon');if(got===q.marks){rqKO(m,t);head=`<p class="fbt">💥 You defeated ${RQBOSS[t]||'the boss'}!</p>`;sfx.win();confetti(120,true);qubi('gQ','party','Boss down!',true)}
    else{m.classList.add('escape');head=`<p class="fbt">${RQBOSS[t]||'The boss'} escaped with ${fmtN(q.marks-got)} heart${q.marks-got===1?'':'s'} left. Study the working and get it next time!</p>`;qubi('gQ','oops','So close!')}}
  else head=`<p class="fbt">${got===q.marks?(perfect?'Full marks!':'Got there!'):got>0?'Some marks.':'No marks this time.'} ${fmtN(got)} / ${q.marks}</p>${RQ.streak>=3?`<p class="streak">🔥 Streak ×${RQ.streak}</p>`:''}`;
  if(!isBoss)qubi('gQ',got===q.marks?'cheer':'oops',got===q.marks?(RQ.streak>=3?`Streak ×${RQ.streak}!`:pick(CHEER)):pick(OOPS));
  const work=q.parts.length>1?q.parts.map((p,j)=>`<div class="rqw"><b>(${'abcd'[j]})</b> ${(p.work||[]).map(w=>`<div>${w}</div>`).join('')}</div>`).join(''):(q.parts[0].work||q.work||[]).map(w=>`<div>${w}</div>`).join('')+(q.parts[0].work&&q.work?q.work.map(w=>`<div>${w}</div>`).join(''):'');
  const last=RQ.i+1>=RQ.list.length,nextSt=!last&&RQ.list[RQ.i+1].st!==it.st;
  $('gf').innerHTML=`<div class="fb ${got===q.marks?'ok':'no'}">${head}<p class="rqtline">⏱ You took <b>${mmss(it.ms)}</b> (aim about ${mmss(rqAim(it)*1000)}). ${it.ms<=rqAim(it)*1000?'Good pace.':it.ms<=rqAim(it)*1500?'A little slow. That is fine while you are learning.':'This took a while. In the exam, if you are stuck for 2 minutes, move on and come back later.'}</p><div class="work"><span class="tag">Working</span>${work||(q.work||[]).map(w=>`<div>${w}</div>`).join('')}</div>
    <div><button class="btn primary" id="gNext">${last?'See my report card':nextSt?`On to ${RQSTAGE[RQ.list[RQ.i+1].st].name} →`:'Next question →'}</button></div></div>`;
  $('gNext').onclick=()=>{sfx.tap();if(last)return rqReport();RQ.i++;nextSt?rqStageIntro():rqShow();window.scrollTo({top:0,behavior:calm?'auto':'smooth'})};
  $('gf').scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})}

const RQTIP={whole:'Do brackets first, then × and ÷, then + and −. For "least number of rolls or boxes", always round UP.',
  frac:'Draw a model. For "the remaining" questions, work out the fraction of what is left, one step at a time. If equal amounts are given away, make the numerators the same.',
  dec:'Line up the decimal points. To multiply by 20 or 60, multiply by 2 or 6 first, then by 10.',
  pct:'Percentage change is always compared with the ORIGINAL amount. Write "100% → original" before you start.',
  ratio:'When one person appears in two ratios, make their units the same (use the LCM) before you compare.',
  rate:'Write every rate "per 1": per minute, per unit. For "or part thereof", round the number of blocks UP.',
  alg:'Collect the letter terms and the number terms separately. Substitute the value only at the end, using brackets.',
  avg:'Average × number of items = total. Work with totals, not with averages.',
  meas:'Change everything to the smaller unit first (min, g, ml, cm). Remember 1 h = 60 min, not 100 min.',
  angle:'Mark every angle you find on the figure. Look for equal sides (isosceles), parallel lines and straight lines (180°).',
  area:'Split the figure into rectangles and triangles. The height of a triangle must be at right angles to its base.',
  circ:'For perimeter, trace only the outside edges. Use the π the question gives. A semicircle arc is ½ × π × diameter.',
  vol:'Volume = base area × height. When water is poured, the volume stays the same: find it, then divide by the new base area.',
  pat:'Find what repeats or what is added each time. Write the rule (e.g. 3 × figure number + 1) and test it on Figure 1.',
  data:'Read the scale on the axis before reading any bar or point. "Not possible to tell" is right when a chart shows percentages but no total.'};
function rqReport(){rqClock(false);clearInterval(RQ.iv);RQ.iv=0;rqCalcShow(false);const pc=RQ.max?Math.round(RQ.got/RQ.max*100):0,stars=pc>=85?3:pc>=65?2:pc>=40?1:0;setBest('p6-quest',stars);setTimeout(()=>arcReport('p6-quest',pc,{stars,mode:'solo'}),300);
  const L=RQ.list.filter(x=>x.q),tot=L.reduce((a,x)=>a+x.ms,0),aimTot=L.reduce((a,x)=>a+rqAim(x)*1000,0);
  const T={};L.forEach(x=>{const t=x.gen.topic,got=x.q.parts.reduce((a,p)=>a+(p.got||0),0);T[t]=T[t]||{t,g:0,m:0,ms:0,aim:0,n:0};T[t].g+=got;T[t].m+=x.q.marks;T[t].ms+=x.ms;T[t].aim+=rqAim(x)*1000;T[t].n++});
  const tops=Object.values(T).map(o=>{o.acc=o.g/o.m;o.pace=o.ms/Math.max(1,o.aim);o.v=o.acc>=.75?(o.pace<=1.1?'strong':'slow'):o.acc<.6&&o.pace<.6?'rush':'revise';return o}).sort((a,b)=>a.acc-b.acc||b.pace-a.pace);
  const VN={strong:['✅ Strong','good'],slow:['🐢 Accurate but slow','sun'],rush:['⚡ Rushing','sun'],revise:['📘 Revise','bad']};
  const bar=(g,m)=>{const p=Math.round(g/m*100);return `<span class="rqbar"><i style="width:${p}%;background:${p>=75?'var(--good)':p>=50?'var(--sun)':'var(--bad)'}"></i></span>`};
  const pbar=(ms,aim)=>{const r=ms/Math.max(1,aim),w=Math.min(100,r*66);return `<span class="rqbar rqpbar" title="66% mark = suggested time"><i style="width:${w}%;background:${r<=1?'var(--good)':r<=1.5?'var(--sun)':'var(--bad)'}"></i><em></em></span>`};
  const tips=[];
  tops.filter(o=>o.v!=='strong').slice(0,4).forEach(o=>{const link=RQLINK[o.t]&&GAMES[RQLINK[o.t]]?` <a href="#${RQLINK[o.t]}">Practise with ${GAMES[RQLINK[o.t]].title} →</a>`:'';
    if(o.v==='slow')tips.push(`<b>${RQT[o.t]}:</b> you scored well but took ${mmss(o.ms)} (aim ${mmss(o.aim)}). You know this, so build speed: time yourself on 5 quick questions a day. ${RQTIP[o.t]||''}`);
    else if(o.v==='rush')tips.push(`<b>${RQT[o.t]}:</b> you went fast (${mmss(o.ms)}) but lost marks. Slow down: underline the key words, check the units, and re-read what the question asks for.`);
    else tips.push(`<b>${RQT[o.t]}:</b> ${RQTIP[o.t]||'Go through the working for each question you missed.'}${link}`)});
  const slowQ=L.map((x,i)=>({x,i})).filter(o=>o.x.ms>rqAim(o.x)*2000);
  if(slowQ.length)tips.push(`<b>Pacing:</b> ${slowQ.map(o=>`Q${o.i+1}`).join(', ')} took more than twice the suggested time. In the exam, if you are stuck for about 2 minutes, mark the question, move on, and come back at the end.`);
  ['A','B','C'].forEach(s=>{const xs=L.filter(x=>x.st===s);if(!xs.length)return;const ms=xs.reduce((a,x)=>a+x.ms,0),aim=xs.reduce((a,x)=>a+rqAim(x)*1000,0);
    if(ms>aim*1.25)tips.push(`<b>${RQSTAGE[s].name}:</b> took ${mmss(ms)} against a suggested ${mmss(aim)}. ${s==='A'?'Aim for about 1 minute per mark on MCQs. Eliminate options that are clearly wrong first.':s==='B'?'Short answers should take about 3 minutes each. Write neat working so you do not have to restart.':'Plan the long questions: write what you know, draw a model, then calculate. Use the calculator for big numbers, not for thinking.'}`)});
  if(tot<aimTot*.5&&pc<70)tips.push('<b>Use your time:</b> you finished well within the suggested time but lost marks. In the real paper, use the spare time to check every answer, starting with the ones you were unsure of.');
  if(!tips.length)tips.push('<b>Great balance of speed and accuracy!</b> Try the Stretch difficulty or a full mock quest to keep improving. In the real exam, use any spare time to check Paper 2 with the calculator.');
  const qrows=L.map((x,i)=>{const got=x.q.parts.reduce((a,p)=>a+(p.got||0),0),r=x.ms/(rqAim(x)*1000);return `<tr><td>Q${i+1}</td><td>${RQSTAGE[x.st].icon}</td><td style="text-align:left">${RQT[x.gen.topic]}</td><td>${RQLVN[x.gen.lv]}</td><td>${fmtN(got)}/${x.q.marks}</td><td class="${r>1.5?'tbad':r>1?'tmid':'tgood'}">${mmss(x.ms)}</td><td>${mmss(rqAim(x)*1000)}</td></tr>`}).join('');
  $('gStage').innerHTML=`<div class="end rqrep"><span class="tag">${RQQUEST[RQ.qk].name}${RQ.topic?': '+RQT[RQ.topic]:''} · ${RQMIX[RQ.mix].name} · report card</span><h3>You scored ${fmtN(RQ.got)} out of ${RQ.max} marks (${pc}%)</h3>
    <p class="big">${starStr(stars)}</p><p>${stars===3?'Outstanding! You are exam-ready on these topics.':stars===2?'Solid work! A little more practice on the topics below and you will be flying.':stars===1?'A good start. Use the working to learn from each mistake, then try again.':'Every expert started here. Go through the topics below one at a time.'}</p>
    <div class="rqtimes"><div><small>Total time</small><b>${mmss(tot)}</b><small>suggested ${mmss(aimTot)}</small></div>${['A','B','C'].filter(s=>RQ.byS[s]).map(s=>{const xs=L.filter(x=>x.st===s),ms=xs.reduce((a,x)=>a+x.ms,0),aim=xs.reduce((a,x)=>a+rqAim(x)*1000,0);return `<div><small>${RQSTAGE[s].icon} ${RQSTAGE[s].name}</small><b class="${ms>aim*1.25?'tbad':ms>aim?'tmid':'tgood'}">${mmss(ms)}</b><small>${fmtN(RQ.byS[s][0])}/${RQ.byS[s][1]} marks · aim ${mmss(aim)}</small></div>`}).join('')}</div>
    <h4>Marks and time by topic</h4><div class="rqtt"><div class="rqtr2 hd"><span>Topic</span><span>Marks</span><span>Time (bar ends at 1.5 × aim)</span><span>Verdict</span></div>${tops.map(o=>`<div class="rqtr2"><span>${RQT[o.t]}</span><span>${bar(o.g,o.m)}<b>${fmtN(o.g)}/${o.m}</b></span><span>${pbar(o.ms,o.aim)}<b>${mmss(o.ms)}</b><small> / ${mmss(o.aim)}</small></span><span class="rqv ${VN[o.v][1]}">${VN[o.v][0]}</span></div>`).join('')}</div>
    <div class="rqweak"><h4>Tips to improve</h4><ul>${tips.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <details class="rqdet"><summary>Question by question</summary><table class="rqt"><tr><th>Q</th><th>Paper</th><th>Topic</th><th>Level</th><th>Marks</th><th>Time</th><th>Aim</th></tr>${qrows}</table></details>
    <div class="row"><button class="btn primary" id="rqAgain">Play this quest again</button><button class="btn" id="rqHome">Choose another quest</button></div></div>`;
  $('rqAgain').onclick=()=>{sfx.tap();RQMIXK=RQ.mix;rqGo(RQ.qk,RQ.topic)};$('rqHome').onclick=()=>{sfx.tap();rqHome($('gStage'))};
  if(stars>=2){sfx.win();confetti(160,true)}qubi('gQ','party',stars>=2?'What a quest!':'Keep going, you are improving!',true);window.scrollTo({top:0,behavior:calm?'auto':'smooth'})}

function rqKO(m,t){const box=$('rqBoss');m.classList.add('ko');sfx.win&&sfx.win();
  setTimeout(()=>{m.innerHTML=rqMonster(t,true)+'<span class="rqghost" aria-hidden="true">👻</span>';m.classList.remove('ko');m.classList.add('dead');
    box.classList.add('won');const bb=box.querySelector('b');if(bb)bb.innerHTML=`${RQBOSS[t]||'Boss'} is <span class="rqdefeat">DEFEATED!</span>`;
    const sm=box.querySelector('small');if(sm)sm.textContent='All hearts gone. You knocked it out!';box.insertAdjacentHTML('beforeend','<span class="rqstamp" aria-hidden="true">K.O.!</span>')},calm?0:650)}
function rqMonster(t,dead){const cols={vol:'#0b968b',circ:'#ef5240',pct:'#5f50ec',ratio:'#e08a00',frac:'#d13f8a',alg:'#2f7de1',angle:'#12985a',data:'#8a5cf6',rate:'#e0552b',avg:'#0f8fb0'},c=dead?'#9aa3ad':(cols[t]||'#5f50ec');
  return `<svg viewBox="0 0 120 110" width="96" height="88" aria-hidden="true"><path d="M30 26 L22 4 L42 20Z M90 26 L98 4 L78 20Z" fill="${c}"/><path d="M14 70 Q10 22 60 18 Q110 22 106 70 Q104 100 60 100 Q16 100 14 70Z" fill="${c}"/>
    <path d="M20 96 l8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10 8-10 8 10" fill="${c}"/>${dead?`<path d="M33 43 L51 61 M51 43 L33 61 M69 43 L87 61 M87 43 L69 61" stroke="#16233a" stroke-width="6" stroke-linecap="round"/>`:`<circle cx="42" cy="52" r="13" fill="#fff"/><circle cx="78" cy="52" r="13" fill="#fff"/><circle class="pu" cx="45" cy="54" r="6" fill="#16233a"/><circle class="pu" cx="75" cy="54" r="6" fill="#16233a"/>`}
    <path d="M30 36 L52 44 M90 36 L68 44" stroke="#16233a" stroke-width="5" stroke-linecap="round"/>${dead?`<path d="M42 82 Q60 74 78 82" stroke="#16233a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M60 80 q0 16 8 16 q8 0 6 -14z" fill="#ff7aa2" stroke="#16233a" stroke-width="2"/>`:`<path d="M40 78 Q60 70 80 78 L76 84 L70 78 L64 84 L58 78 L52 84 L46 78Z" fill="#16233a"/>`}</svg>`}

/* ---------- on-screen calculator (Paper 2 only) ----------
   Works like a school scientific calculator: editable expression, brackets, fractions and mixed numbers
   (exact fraction answers), S⇔D to switch fraction / mixed number / decimal, and a history tape. */
const CALC={ans:{n:0,d:1},last:null,mode:0,just:false,hist:[]};
const FRK=`<span class="fr"><span>□</span><span>□</span></span>`,MXK=`<span class="mxw">□</span>${FRK}`;
const CKEYS=[['C','C'],['(','('],[')',')'],['⌫','⌫'],['÷','÷'],['7','7'],['8','8'],['9','9'],['⁄',FRK],['×','×'],['4','4'],['5','5'],['6','6'],['‿',MXK],['−','−'],['1','1'],['2','2'],['3','3'],['²','x²'],['+','+'],['0','0'],['.','.'],['π','π'],['√','√'],['=','='],['Ans','Ans'],['SD','S⇔D'],['◀','◀'],['▶','▶'],['CH','Clear tape']];
function rqCalcShow(on){let c=$('rqCalc');if(!c){if(!on)return;document.body.insertAdjacentHTML('beforeend',`<div class="rqcalc" id="rqCalc" hidden role="dialog" aria-label="Calculator">
    <div class="rqcbar"><b>🧮 Calculator</b><button class="btn" id="rqCx" aria-label="Close calculator">✕</button></div>
    <div class="rqhist" id="rqcH" aria-label="Previous calculations"><small>Your calculations will be listed here. Tap one to reuse its answer.</small></div>
    <div class="rqcd"><div class="rqcpre" id="rqcP">&nbsp;</div><input class="rqcin" id="rqcE" inputmode="none" autocomplete="off" spellcheck="false" aria-label="Calculation"><div class="rqchint" id="rqcHint" aria-live="polite"></div><div class="rqcr" id="rqcR">0</div></div>
    <div class="rqck">${CKEYS.map(([k,l])=>`<button class="btn ${'÷×−+'.includes(k)?'op':''} ${k==='='?'eq':''} ${k==='CH'?'wide':''}" data-k="${k}" aria-label="${{'⁄':'Fraction','‿':'Mixed number','²':'Square','SD':'Switch fraction or decimal','◀':'Move left','▶':'Move right','⌫':'Delete','CH':'Clear the calculation list'}[k]||k}">${l}</button>`).join('')}</div>
    <button class="btn" id="rqcUse">Copy answer into the answer box</button>
    <small class="rqctip">Fraction: type the top number, tap ${FRK}, then type the bottom number. Mixed number: type the whole number, tap ${MXK}, type the top number, tap ▶, then type the bottom number. If a question says "Take π = 3.14" or "22/7", type that number instead of using the π key.</small></div>`);
    c=$('rqCalc');c.querySelectorAll('[data-k]').forEach(b=>{b.onpointerdown=e=>e.preventDefault();b.onclick=()=>{calcKey(b.dataset.k);sfx.tap()}});$('rqCx').onclick=()=>rqCalcShow(false);
    const E=$('rqcE');E.oninput=()=>{const p=E.selectionStart,v=E.value.replace(/\*/g,'×').replace(/\//g,'÷').replace(/-/g,'−').replace(/\^2/g,'²');if(v!==E.value){E.value=v;E.setSelectionRange(p,p)}CALC.just=false;calcPreview()};
    E.onclick=E.onkeyup=()=>calcHint();E.onkeydown=e=>{if(CALC.just&&e.key.length===1&&!e.ctrlKey&&!e.metaKey){CALC.just=false;E.value=/[*\/+\-^×÷−]/.test(e.key)?'Ans':''}if(e.key==='Enter'){e.preventDefault();calcKey('=')}else if(e.key==='Escape'){e.preventDefault();calcKey('C')}};
    $('rqcUse').onclick=()=>{const i=RQ&&RQ.input;if(CALC.last===null){$('rqcR').textContent='Press = first';return}if(!i||i.disabled){$('rqcR').innerHTML='Tap an answer box first';return}i.value=calcText(CALC.last,CALC.mode,true);i.focus();sfx.pop()}}
  c.hidden=!on;document.body.classList.toggle('rqco',on);const b=$('rqCalcBtn');if(b){b.setAttribute('aria-expanded',String(on));b.classList.toggle('primary',on)}if(on&&!('ontouchstart' in window))$('rqcE').focus()}
function calcIns(s){const E=$('rqcE'),op=s.length===1&&'÷×−+²'.includes(s);
  if(CALC.just){CALC.just=false;E.value=op?'Ans':'';E.setSelectionRange(E.value.length,E.value.length)}
  let a=E.selectionStart??E.value.length,b=E.selectionEnd??a;if(document.activeElement!==E){a=b=E.value.length}
  E.value=E.value.slice(0,a)+s+E.value.slice(b);const p=a+s.length;E.focus({preventScroll:true});E.setSelectionRange(p,p);calcPreview()}
function calcHint(){const E=$('rqcE'),v=E.value,c=document.activeElement===E?E.selectionStart:v.length,b=v.slice(0,c),a=v.slice(c);let h='';
  if(a.startsWith('⁄'))h=/‿\d*$/.test(b)?'Mixed number: type the TOP number, then press ▶ to move to the BOTTOM number.':'Type the TOP number, then press ▶ to move to the BOTTOM number.';
  else if(/⁄$/.test(b))h='Now type the BOTTOM number (denominator).';
  else if(/‿\d+$/.test(b)&&!a.startsWith('⁄'))h='Press the fraction key, then type the bottom number.';
  else if(!v)h='Fraction: tap the fraction key, type the top number, ▶, then the bottom number.';
  $('rqcHint').textContent=h}
function calcPreview(){const v=$('rqcE').value;$('rqcP').innerHTML=calcPretty(v)||'&nbsp;';calcHint();if(!CALC.just)$('rqcR').textContent=v?'…':'0'}
function calcPretty(s){return s.replace(/(\d+(?:\.\d+)?)‿(\d*)⁄(\d*)/g,(m,w,n,d)=>`${w}${fr(n||'<span class="cbox">□</span>',d||'<span class="cbox">□</span>')}`).replace(/(\d+(?:\.\d+)?)‿(\d*)/g,(m,w,n)=>`${w}${fr(n||'<span class="cbox">□</span>','<span class="cbox">□</span>')}`).replace(/(\d+(?:\.\d+)?|Ans|\))?⁄(\d+(?:\.\d+)?)?/g,(m,n,d)=>fr(n||'<span class="cbox">□</span>',d||'<span class="cbox">□</span>'))}
function calcKey(k){const E=$('rqcE');
  if(k==='C'){E.value='';CALC.just=false;$('rqcR').textContent='0';calcPreview();return}
  if(k==='CH'){CALC.hist=[];calcHist();return}
  if(k==='⌫'){if(CALC.just){CALC.just=false}let a=document.activeElement===E?E.selectionStart:E.value.length,b=document.activeElement===E?E.selectionEnd:a;if(a===b&&a>0){a=E.value.slice(0,a).endsWith('Ans')?a-3:a-1}E.value=E.value.slice(0,a)+E.value.slice(b);E.focus({preventScroll:true});E.setSelectionRange(a,a);calcPreview();return}
  if(k==='◀'||k==='▶'){E.focus({preventScroll:true});const p=Math.max(0,Math.min(E.value.length,(E.selectionStart??E.value.length)+(k==='◀'?-1:1)));E.setSelectionRange(p,p);calcHint();return}
  if(k==='⁄'||k==='‿'){if(CALC.just){CALC.just=false;E.value='';$('rqcR').textContent='0'}const c=document.activeElement===E?E.selectionStart:E.value.length,b=E.value.slice(0,c),a=E.value.slice(c);
    const put=(str,back)=>{E.value=b+str+a;E.focus({preventScroll:true});const q=c+str.length-back;E.setSelectionRange(q,q);calcPreview()};
    if(k==='⁄'){if(a.startsWith('⁄')){E.focus({preventScroll:true});E.setSelectionRange(c+1,c+1);calcPreview();return}return /(\d|\)|Ans)$/.test(b)?put('⁄',0):put('⁄',1)}
    if(!/\d$/.test(b)){$('rqcHint').textContent='Type the WHOLE number first (e.g. 2), then press the mixed-number key.';return}return put('‿⁄',1)}
  if(k==='SD'){if(CALC.last===null)return;CALC.mode=CALC.last.f!==undefined||CALC.last.d===1?2:(CALC.mode+1)%3;$('rqcR').innerHTML=calcShowV(CALC.last,CALC.mode);return}
  if(k==='='){const s=E.value;if(!s.trim())return;try{const v=calcEval(s);CALC.ans=v;CALC.last=v;CALC.mode=/[⁄‿]/.test(s)&&v.f===undefined&&v.d!==1?0:2;if(v.f!==undefined||v.d===1)CALC.mode=2;
      $('rqcR').innerHTML=calcShowV(v,CALC.mode);CALC.hist.unshift({s,v,m:CALC.mode});CALC.hist=CALC.hist.slice(0,30);calcHist();CALC.just=true;$('rqcP').innerHTML=calcPretty(s)+' =';E.setSelectionRange(s.length,s.length)}
    catch(e){$('rqcR').textContent={div0:'Cannot divide by 0',mix:'Finish the mixed number: it needs a bottom number',den:'A fraction is missing its bottom number',num:'A fraction is missing its top number'}[e]||'Check the brackets or signs';CALC.last=null}return}
  calcIns(k==='√'?'√(':k)}
function calcHist(){const H=$('rqcH');if(!CALC.hist.length){H.innerHTML='<small>Your calculations will be listed here. Tap one to reuse its answer.</small>';return}
  H.innerHTML=CALC.hist.map((h,i)=>`<button class="rqhrow" data-i="${i}" title="Use this answer"><span>${calcPretty(h.s)}</span><b>= ${calcShowV(h.v,h.m)}</b></button>`).join('');
  H.querySelectorAll('.rqhrow').forEach(b=>b.onclick=()=>{const h=CALC.hist[+b.dataset.i];calcIns(calcText(h.v,h.m===2?2:0));sfx.tap()});H.scrollTop=0}
/* exact fractions where possible, decimals otherwise */
const cMk=(n,d=1)=>{if(d===0)throw 'div0';if(d<0){n=-n;d=-d}if(!Number.isInteger(n)||!Number.isInteger(d)||Math.abs(n)>1e15||d>1e15)return {f:n/d};const g=gcd(Math.abs(n),d)||1;return {n:n/g,d:d/g}};
const cF=x=>x.f!==undefined?x.f:x.n/x.d,cEx=(a,b)=>a.f===undefined&&b.f===undefined;
const cAdd=(a,b)=>cEx(a,b)?cMk(a.n*b.d+b.n*a.d,a.d*b.d):{f:cF(a)+cF(b)},cSub=(a,b)=>cEx(a,b)?cMk(a.n*b.d-b.n*a.d,a.d*b.d):{f:cF(a)-cF(b)};
const cMul=(a,b)=>cEx(a,b)?cMk(a.n*b.n,a.d*b.d):{f:cF(a)*cF(b)},cDiv=(a,b)=>{if(cF(b)===0)throw 'div0';return cEx(a,b)?cMk(a.n*b.d,a.d*b.n):{f:cF(a)/cF(b)}};
function cSqrt(a){if(cF(a)<0)throw 0;if(a.f===undefined){const n=Math.round(Math.sqrt(a.n)),d=Math.round(Math.sqrt(a.d));if(n*n===a.n&&d*d===a.d)return cMk(n,d)}return {f:Math.sqrt(cF(a))}}
function calcShowV(v,mode){if(v.f!==undefined||v.d===1||mode===2){const x=+cF(v).toPrecision(10);const [i,d]=String(Math.abs(x)).split('.');return (x<0?'−':'')+i.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(d?'.'+d:'')}
  if(mode===1&&Math.abs(v.n)>v.d){const w=Math.trunc(v.n/v.d),r=Math.abs(v.n%v.d);return `${w<0?'−':''}${Math.abs(w)}${fr(r,v.d)}`}return (v.n<0?'−':'')+fr(Math.abs(v.n),v.d)}
function calcText(v,mode,forBox){if(v.f!==undefined||v.d===1||mode===2)return String(+cF(v).toPrecision(10));const sl=forBox?'/':'⁄';
  if(mode===1&&Math.abs(v.n)>v.d){const w=Math.trunc(v.n/v.d);return forBox?`${w} ${Math.abs(v.n%v.d)}/${v.d}`:`${w}‿${Math.abs(v.n%v.d)}⁄${v.d}`}return `${v.n}${sl}${v.d}`}
function calcEval(s){if(/⁄(?![\d(π√A])/.test(s))throw 'den';if(/(^|[^\d)s])⁄/.test(s))throw 'num';const t=[];let i=0;
  while(i<s.length){const ch=s[i];if(/[0-9.]/.test(ch)){let j=i;while(j<s.length&&/[0-9.]/.test(s[j]))j++;const tx2=s.slice(i,j);if((tx2.match(/\./g)||[]).length>1||tx2==='.')throw 0;const dp=(tx2.split('.')[1]||'').length;t.push({k:'n',v:cMk(Math.round(parseFloat(tx2)*10**dp),10**dp)});i=j;continue}
    if(ch==='π'){t.push({k:'n',v:{f:Math.PI}});i++;continue}if(s.startsWith('Ans',i)){t.push({k:'n',v:CALC.ans});i+=3;continue}if(ch==='√'){t.push({k:'f'});i++;continue}
    if('+-−×÷*/()²^⁄‿'.includes(ch)){t.push({k:'o',v:ch});i++;continue}if(ch===' '){i++;continue}throw 0}
  const u=[];t.forEach(x=>{const p=u[u.length-1];if(p&&(p.k==='n'||(p.k==='o'&&(p.v===')'||p.v==='²')))&&(x.k==='n'||x.k==='f'||(x.k==='o'&&x.v==='(')))u.push({k:'o',v:'×'});u.push(x)});
  let p=0;const pk=()=>u[p],is=(...o)=>pk()&&pk().k==='o'&&o.includes(pk().v);
  const expr=()=>{let v=term();while(is('+','-','−')){const o=u[p++].v,r=term();v=o==='+'?cAdd(v,r):cSub(v,r)}return v};
  const term=()=>{let v=un();while(is('×','÷','*','/')){const o=u[p++].v,r=un();v=o==='×'||o==='*'?cMul(v,r):cDiv(v,r)}return v};
  const un=()=>{if(is('-','−')){p++;return cMul({n:-1,d:1},un())}if(is('+')){p++;return un()}return pw()};
  const pw=()=>{let v=post();if(is('^')){p++;const e=un();const ev=cF(e);if(Number.isInteger(ev)&&ev>=0&&ev<=12&&v.f===undefined){let r={n:1,d:1};for(let k=0;k<ev;k++)r=cMul(r,v);v=r}else v={f:Math.pow(cF(v),ev)}}return v};
  const post=()=>{let v=mixed();while(is('²')){p++;v=cMul(v,v)}return v};
  const mixed=()=>{let v=frac();if(is('‿')){p++;let f=atom();if(!is('⁄'))throw 'mix';while(is('⁄')){p++;f=cDiv(f,atom())}v=cF(v)<0?cSub(v,f):cAdd(v,f)}return v};
  const frac=()=>{let v=atom();while(is('⁄')){p++;v=cDiv(v,atom())}return v};
  const atom=()=>{const x=u[p++];if(!x)throw 0;if(x.k==='n')return x.v;if(x.k==='f')return cSqrt(atom());if(x.v==='('){const v=expr();if(is(')'))p++;return v}throw 0};
  const v=expr();if(p<u.length||!isFinite(cF(v)))throw 0;return v}
