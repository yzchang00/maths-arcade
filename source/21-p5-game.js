/* ================= HAWKER CENTRE TYCOON: game =================
   P5 exam practice dressed up as running a hawker centre. Each topic is a stall; correct answers earn coins,
   coins upgrade stalls, and bigger stalls look better, earn more per mark and attract VIP customers (Paper 2 long questions).
   Rushes and Exam Days follow the real P5 paper layout (Paper 1 no calculator, Paper 2 with calculator).
   Surprise NEA inspections are Trap Hunter rounds: find the wrong line in Careless Cal's working, then fix it.
   Rules on every part: a miss gives the "why it's wrong" note and a hint; a second miss shows the answer.
   Later parts unlock only after the earlier part is done. Progress is saved on this device. */
const HWSTALL=[
  {t:'whole',n:'Kopi Corner',i:'☕',d:['kopi O','teh tarik','Milo dinosaur','kopi C']},
  {t:'frac',n:'Prata Place',i:'🫓',d:['egg prata','plain prata','cheese prata','murtabak']},
  {t:'dec',n:'Chicken Rice',i:'🍗',d:['roasted chicken rice','steamed chicken rice','chicken drumstick rice']},
  {t:'pct',n:'Bubble Tea Bar',i:'🧋',d:['brown sugar milk tea','lychee tea','taro milk tea']},
  {t:'rate',n:'Satay Stall',i:'🍢',d:['10 chicken satay','10 mutton satay','satay set with ketupat']},
  {t:'area',n:'Kaya Toast',i:'🍞',d:['kaya toast set','butter kaya toast','French toast']},
  {t:'angle',n:'Ice Kacang',i:'🍧',d:['ice kacang','chendol','mango snow ice']},
  {t:'vol',n:'Sugarcane Juice',i:'🥤',d:['sugarcane juice','sugarcane with lemon','barley water']},
  {t:'data',n:'Fruit Stall',i:'🍉',d:['watermelon slices','mixed fruit cup','papaya plate']},
  {t:'pat',n:'Kueh Corner',i:'🍡',d:['ondeh-ondeh','kueh lapis','ang ku kueh']},
  {t:'word',n:'Nasi Lemak',i:'🍛',d:['nasi lemak with otah','nasi lemak with chicken wing','nasi lemak special']},
  {t:'ratio',n:'Laksa House',i:'🍜',d:['laksa','prawn mee','lor mee']}];
const HWCUST=['🧑','👩','👨','👵','👴','🧕','👲','🧑‍🎓','👩‍🔧','👨‍🍳','🧒','👮'];
const HWUP=[0,80,180,320,500]; /* coins to go from level L to L+1 */
const HWLVN=['','Pushcart','Stall','Busy stall','Famous stall','Michelin stall'];
const HWKINDS={1:['mcq1','mcq1','mcq2','saq','saq','saq'],2:['mcq1','mcq2','saq','saq','saq','saq'],3:['mcq2','saq','saq','saq','long','long'],4:['mcq2','saq','saq','long','long','long'],5:['mcq2','saq','saq','long','long','long']};
const HWMODES={
  lunch:{i:'🍱',n:'Lunch Rush',sub:'Paper 1 style · 10 orders · no calculator',plan:[['mcq1',4],['mcq2',3],['saq1',3]],insp:true},
  dinner:{i:'🌙',n:'Dinner Rush',sub:'Paper 2 style · 2 short + 3 long · calculator',plan:[['saq2',2],['long',3]],insp:true},
  exam1:{i:'📝',n:'Exam Day: Paper 1',sub:'Full paper: 18 MCQs + 12 short answers · 50 marks · about 70 min',plan:[['mcq1',10],['mcq2',8],['saq1',12]],exam:70},
  exam2:{i:'🧮',n:'Exam Day: Paper 2',sub:'Full paper: 5 short + 10 long questions · about 50 marks · 80 min',plan:[['saq2',5],['long',10]],exam:80}};
const HWTIP={whole:'Brackets first, then × and ÷ from left to right, then + and −. "Least number of rolls/bottles" means round UP.',
  frac:'"Of the remainder" means find the remainder first. Draw a bar model and cut it step by step.',
  dec:'Change everything to the same unit first. 1 kg = 1000 g, 1 ℓ = 1000 ml, 1 h = 60 min.',
  pct:'Discounts come off the price; GST is added on. A second discount is a percentage of the NEW price.',
  rate:'Find the amount for one group first. "Or part thereof" means any extra bit costs a full block.',
  area:'Area of triangle = ½ × base × height. The height must meet the base at a right angle.',
  angle:'Mark every angle you know. Straight line 180°, at a point 360°, isosceles base angles are equal, parallel lines give 180° pairs.',
  vol:'Volume = length × breadth × height. 1000 cm³ = 1 ℓ. Only the part that is filled has water.',
  data:'Read the scale first. A pie chart of percentages with no total means "not possible to tell" how many.',
  pat:'Find the repeating group or the amount added each time. Test your rule on Figure 1.',
  word:'Draw before-and-after bars. When one person gives to another, the difference changes by TWICE the amount.',
  ratio:'Ratio is only about the things named in it. Average × number = total: work with totals.'};
function hwLoad(){let s=null;try{s=JSON.parse(localStorage.getItem('hwTycoon'))}catch(e){}if(!s||typeof s!=='object')s={};s.coins=Math.max(0,+s.coins||0);s.st=s.st&&typeof s.st==='object'?s.st:{};
  HWSTALL.forEach(x=>{const o=s.st[x.t]=s.st[x.t]&&typeof s.st[x.t]==='object'?s.st[x.t]:{};o.lv=Math.min(5,Math.max(1,Math.round(+o.lv||1)));o.g=+o.g||0;o.m=+o.m||0});
  s.insp=s.insp&&typeof s.insp==='object'?s.insp:{p:0,n:0};s.served=+s.served||0;s.name=typeof s.name==='string'?s.name.slice(0,14):'';s.seen=s.seen?1:(s.served?1:0);return s}
let HWS=hwLoad(),HW=null;
const hwSave=()=>{try{localStorage.setItem('hwTycoon',JSON.stringify(HWS))}catch(e){}};
const hwGrade=()=>{const {p,n}=HWS.insp;if(!n)return '–';const r=p/n;return r>=.8?'A':r>=.6?'B':r>=.4?'C':'D'};
const hwStall=t=>HWSTALL.find(s=>s.t===t);
const hwMoney=n=>`🪙 ${fmtN(Math.round(n))}`;
const hwEsc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
/* the player's name goes on every signboard: saved name, else the leaderboard nickname */
function hwName(){let n=HWS.name||'';if(!n){try{const m=typeof arcMe==='function'&&arcMe();n=(m&&m.nick)||localStorage.getItem('arcNick')||''}catch(e){}}n=String(n).trim().slice(0,14);return n&&!(typeof isBadNick==='function'&&isBadNick(n))?n:''}
const hwOwn=lc=>{const n=hwName();return n?hwEsc(n)+"'s":lc?'your':'Your'};

addGame('p5-hawker',{level:'P5',strand:'rev',topic:'All topics',title:'Hawker Centre Tycoon',glyph:'🍜',ownStart:true,music:'hawker',modes:[['solo','Solo']],
  how:'Run your own hawker centre! Each stall is a P5 topic. Answer orders to earn coins, upgrade your stalls to make them look better and attract VIP customers with big orders, and pass surprise hygiene inspections by spotting Careless Cal\'s mistakes. Rushes and Exam Days follow the real P5 paper.',
  custom(stage){hwHome(stage)}});

/* ---------- what each stall level gives (shown on every stall card) ---------- */
const HWMULT=[0,1,1.25,1.5,1.75,2];
const HWLVD=['','A simple pushcart','🏮 Red lanterns and bigger orders','💡 Neon sign and VIP customers with big orders','⭐ Star plaque and bigger tips','🏅 Gold Michelin sign and double coins'];
/* what the stall looks like at each level */
const HWDECO=['','','🏮','🏮💡','🏮💡⭐','🏅💡⭐'];
const hwPerMark=lv=>Math.round(10*HWMULT[lv]);
/* the stall to suggest next: one never opened, else the weakest */
function hwSuggest(){const fresh=HWSTALL.find(x=>!HWS.st[x.t].m);if(fresh)return fresh;return HWSTALL.slice().sort((a,b)=>HWS.st[a.t].g/HWS.st[a.t].m-HWS.st[b.t].g/HWS.st[b.t].m)[0]}

/* ---------- upgrade panel: says exactly what the upgrade gives before you pay ---------- */
function hwUpPop(stage,t){const S=hwStall(t),o=HWS.st[t],c=HWUP[o.lv],can=HWS.coins>=c,n=o.lv+1;const old=$('hwPop');if(old)old.remove();
  const row=(lv,cls)=>`<div class="hwuprow ${cls}"><span class="hwlv">${'<i class="on">★</i>'.repeat(lv)+'<i>★</i>'.repeat(5-lv)}</span><b>${HWLVN[lv]}</b><small>${HWLVD[lv]}</small><small>🪙${hwPerMark(lv)} for every mark</small></div>`;
  const d=document.createElement('div');d.id='hwPop';d.className='hwpop';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
  d.innerHTML=`<div class="hwpopc"><h3>${S.i} Upgrade ${S.n}?</h3><div class="hwuprows">${row(o.lv,'now')}<span class="hwuparr" aria-hidden="true">➜</span>${row(n,'next')}</div>
    <p>${can?`It costs <b>🪙${c}</b>. You have 🪙${fmtN(HWS.coins)}.`:`It costs <b>🪙${c}</b>. You have 🪙${fmtN(HWS.coins)}, so you need <b>🪙${c-HWS.coins} more</b>. Serve customers to earn coins!`}</p>
    <div class="row">${can?`<button class="btn primary" id="hwUpYes">Upgrade for 🪙${c}</button>`:''}<button class="btn" id="hwUpNo">${can?'Not now':'OK'}</button></div></div>`;
  document.body.appendChild(d);const close=()=>d.remove();d.onclick=e=>{if(e.target===d)close()};$('hwUpNo').onclick=()=>{sfx.tap();close()};
  if(can)$('hwUpYes').onclick=()=>{HWS.coins-=c;o.lv++;hwSave();close();sfx.win&&sfx.win();if(!calm)confetti(80);hwHome(stage);qubi('gQ','party',`${S.n} is now a ${HWLVN[o.lv]}! ${HWLVD[o.lv]}.`,true)};
  ($('hwUpYes')||$('hwUpNo')).focus()}

/* ---------- first visit: how to play (same style as the other games) ---------- */
function hwIntro(stage){stage=stage||$('gStage');hwStop();rqCalcShow(false);document.body.classList.remove('playing');
  const steps=['You own a <b>hawker centre</b>. Each stall sells one P5 topic, e.g. the <b>Satay Stall</b> is Rate and the <b>Kaya Toast</b> stall is Area of triangle.',
    'Tap a stall to open it. Customers queue up, and <b>each order is a maths question</b> about that stall.',
    'Right answer: the dish is served and you earn <b>🪙 coins</b>. Wrong answer: you see why it is wrong and get a hint, then one more try for half the marks.',
    'Spend coins to <b>upgrade</b> a stall: lanterns, a neon sign, then a gold Michelin sign. Bigger stalls earn more coins for every mark, and from level 3 <b>VIP customers</b> arrive with big orders that pay a lot (Paper 2 long questions).',
    '🕵️ Watch out for <b>surprise hygiene inspections</b>: find the wrong line in Careless Cal\'s working, then fix it.',
    'Ready for the real thing? <b>Rushes</b> and <b>Exam Days</b> follow the real P5 paper, with a 🧮 calculator for Paper 2.'];
  stage.innerHTML=`<div class="howcard rqhome hwintro2"><span class="howic" aria-hidden="true">🍜</span><span class="tag">Before you start</span><h3>How to play Hawker Centre Tycoon</h3><ol class="howlist">${steps.map(t=>`<li>${t}</li>`).join('')}</ol>
    <p class="howeg"><b>Example:</b> at the Kopi Corner a customer says <i>"5 kopi and 1 teh, please. Here's $10."</i> You work out the change to give.</p>
    <label class="hwname1"><span>Your name for the signboard</span><input id="hwNameIn" maxlength="14" placeholder="e.g. Zac" value="${hwEsc(hwName())}"></label><small id="hwNameErr" class="hwnameerr"></small>
    <button class="btn primary" id="howGo">Open my hawker centre ▶</button></div>`;
  const go=()=>{const v=$('hwNameIn').value.trim().replace(/\s+/g,' ').slice(0,14);if(v&&typeof isBadNick==='function'&&isBadNick(v)){$('hwNameErr').textContent='Please choose a kinder name.';return}HWS.name=v;HWS.seen=1;hwSave();sfx.ok();hwHome(stage)};
  $('howGo').onclick=go;$('hwNameIn').onkeydown=e=>{if(e.key==='Enter')go()};qubi('gQ','wave','Read the rules first!',true);if(typeof fitView==='function')fitView()}

/* ---------- home: the hawker centre ---------- */
function hwHome(stage){stage=stage||$('gStage');hwStop();rqCalcShow(false);document.body.classList.remove('playing');HWS=hwLoad();if(!HWS.seen)return hwIntro(stage);
  const lvStars=l=>'<i class="on">★</i>'.repeat(l)+'<i>★</i>'.repeat(5-l),sug=hwSuggest();
  const stalls=HWSTALL.map(s=>{const o=HWS.st[s.t],pc=o.m?Math.round(o.g/o.m*100):null,cost=HWUP[o.lv]||0,can=HWS.coins>=cost;
    return `<div class="hwstall l${o.lv}"><button class="hwserve" data-t="${s.t}" aria-label="Open ${s.n}: ${HWT[s.t]}"><span class="hwic" aria-hidden="true">${s.i}</span>${HWDECO[o.lv]?`<span class="hwdeco" aria-hidden="true">${HWDECO[o.lv]}</span>`:''}<b>${s.n}</b><small>${HWT[s.t]}</small>
      <span class="hwlv" title="Level ${o.lv}: ${HWLVN[o.lv]}">${lvStars(o.lv)}</span><small class="hwlvn">${HWLVN[o.lv]}${pc===null?'':` · ${pc}% correct`}</small></button>
      ${o.lv<5?`<button class="hwup ${can?'can':''}" data-up="${s.t}" aria-label="Upgrade ${s.n}">⬆ Upgrade · 🪙${cost}</button>`:'<span class="hwgold">🏅 Top level</span>'}</div>`}).join('');
  const rush=Object.entries(HWMODES).map(([k,m])=>`<button class="hwmode" data-m="${k}"><span aria-hidden="true">${m.i}</span><b>${m.n}</b><small>${m.sub}</small></button>`).join('');
  stage.innerHTML=`<div class="hwhome rqhome"><div class="hwsign"><div class="hwbanner">🏮 ${hwOwn()} Hawker Centre 🏮</div>
      <div class="hwstats"><span class="pill">${hwMoney(HWS.coins)}</span><span class="pill" title="Hygiene grade from inspections">🧼 Hygiene ${hwGrade()}</span><span class="pill">🍽️ ${fmtN(HWS.served)} served</span></div></div>
    <button class="hwgo" data-t="${sug.t}"><span class="hwic" aria-hidden="true">${sug.i}</span><span><b>${HWS.served?'Next shift':'Start here'}: ${sug.n}</b><small>${HWT[sug.t]} · 6 customers are waiting</small></span><span class="hwgoarr" aria-hidden="true">▶</span></button>
    <div class="hwbar"><h3 class="hwh">Your stalls</h3><button class="btn sm" id="hwHowBtn">📖 How to play</button></div>
    <p class="hwnote">Tap a stall to serve customers. Upgrade it to make it look better, earn more coins per mark and bring in VIP customers.</p>
    <div class="hwstalls">${stalls}</div>
    <h3 class="hwh">Practice papers</h3><div class="hwmodes">${rush}</div>
    <p class="hwnote">Your name, coins and stall levels are saved on this device. <button class="linkbtn" id="hwRename">Change name</button></p></div>`;
  stage.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{sfx.pop();hwGo('stall',b.dataset.t)});
  stage.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{sfx.pop();hwGo(b.dataset.m)});
  $('hwHowBtn').onclick=()=>{sfx.tap();hwIntro(stage)};$('hwRename').onclick=()=>{sfx.tap();hwIntro(stage)};
  stage.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{sfx.tap();hwUpPop(stage,b.dataset.up)});
  qubi('gQ','wave',HWS.served?'Welcome back, boss!':'Customers are waiting!',true)}

/* ---------- building a session ---------- */
function hwPoolFor(slot,topic,maxLv){const k=slot==='saq1'||slot==='saq2'?'saq':slot;
  let pool=HWB.filter(g=>g.k.includes(k)&&(!topic||g.t===topic)&&g.lv<=maxLv);
  if(slot==='saq1')pool=pool.filter(g=>g.p===1);if(slot==='saq2'){const p2=pool.filter(g=>g.p===2);if(p2.length>=2)pool=p2}
  return pool}
function hwBuild(mode,topic){const list=[],used={},tUse={},exam=mode.startsWith('exam');
  const add=(slot,topic,maxLv)=>{let pool=hwPoolFor(slot,topic,maxLv);if(exam){const pl=pool.filter(g=>!g.ctx);if(pl.length)pool=pl}if(!pool.length)pool=hwPoolFor(slot,topic,3);if(!pool.length&&topic){pool=HWB.filter(g=>g.t===topic&&g.lv<=maxLv);if(!pool.length)pool=HWB.filter(g=>g.t===topic&&g.lv<=2);if(!pool.length)pool=HWB.filter(g=>g.t===topic);slot=null}
    const wantCtx=!exam&&(mode==='stall'||Math.random()<.75);
    pool=shuffle(pool);pool.sort((a,b)=>(used[a.id]||0)-(used[b.id]||0)||(wantCtx?(b.ctx?1:0)-(a.ctx?1:0):0)||(tUse[a.t]||0)-(tUse[b.t]||0));const g=pool[0];if(!g)return;used[g.id]=(used[g.id]||0)+1;tUse[g.t]=(tUse[g.t]||0)+1;
    const kind=slot?(slot.startsWith('saq')?'saq':slot):pick(g.k);list.push({gen:g,kind,p2:kind==='long'||(kind==='saq'&&(slot==='saq2'||(slot!=='saq1'&&g.p===2)))})};
  if(mode==='stall'){const lv=HWS.st[topic].lv,maxLv=lv>=4?3:lv>=2?2:1;HWKINDS[lv].forEach(k=>add(k==='saq'?(lv>=2&&Math.random()<.4?'saq2':'saq1'):k,topic,maxLv))}
  else HWMODES[mode].plan.forEach(([slot,n])=>{for(let i=0;i<n;i++)add(slot,null,mode.startsWith('exam')?(i<n*.5?2:3):(i<n*.6?2:3))});
  const ord={mcq1:0,mcq2:1,saq:2,long:3};list.sort((a,b)=>ord[a.kind]-ord[b.kind]||(a.p2-b.p2)||a.gen.lv-b.gen.lv);return list}
function hwGo(mode,topic){hwStop();const exam=mode.startsWith('exam');
  HW={mode,topic,list:hwBuild(mode,topic),i:0,got:0,max:0,coins:0,streak:0,byT:{},insp:0,input:null,t0:Date.now(),exam:!!exam,iv:0,inspLog:[]};
  if(!HW.list.length){hwHome();return}HW.list.forEach(it=>it.cust=pick(HWCUST));
  const S=topic?hwStall(topic):null,M=HWMODES[mode];
  $('gStage').innerHTML=`<div class="rqintro hwintro"><span class="rqbig" aria-hidden="true">${S?S.i:M.i}</span><h3>${S?S.n:M.n}</h3><p>${S?`${HWT[topic]} · ${HWLVN[HWS.st[topic].lv]} · ${HW.list.length} orders`:M.sub}</p>
    <p>${exam?'Exam conditions: work it out on paper first. Paper 2 questions have the 🧮 calculator.':'Answer each order. A miss gives you a hint and one more try.'}</p>${exam?'':`<p class="hwqline" aria-hidden="true">${HW.list.slice(0,8).map(x=>x.cust).join(' ')}</p><p>${HW.list.length} customers are queuing at <b>${hwOwn(1)} ${S?S.n:'hawker centre'}</b>. Each order is a problem only you can solve!</p>`}<button class="btn primary" id="hwStart">${exam?'Start the paper →':'Open for business →'}</button> <button class="btn" id="hwBack">Back to the hawker centre</button></div>`;
  $('hwStart').onclick=()=>{sfx.ok();HW.t0=Date.now();if(exam)hwClock();hwShow()};$('hwBack').onclick=()=>{sfx.tap();hwHome()};qubi('gQ','wave',exam?'Pencils ready!':'Customers are coming!',true)}
function hwStop(){if(HW&&HW.iv){clearInterval(HW.iv);HW.iv=0}}
function hwClock(){HW.iv=setInterval(()=>{const el=$('hwTm');if(!el){if(!$('gStage')||!HW)hwStop();return}const s=Math.round((Date.now()-HW.t0)/1000),lim=HWMODES[HW.mode].exam*60;
  el.innerHTML=`⏱ ${mmss(s*1000)} <small>/ ${HWMODES[HW.mode].exam} min</small>`;el.classList.toggle('late',s>lim)},500)}

/* ---------- one order ---------- */
const HWSEC=it=>it.kind.startsWith('mcq')?'Paper 1 · Booklet A':it.p2?'Paper 2':'Paper 1 · Booklet B';
function hwMake(it){for(let t=0;t<40;t++){let q=null;try{q=it.gen.make(it.kind)}catch(e){q=null}if(q&&q.parts&&q.parts.length)return q}return null}
function hwShow(){document.body.classList.add('playing');requestAnimationFrame(()=>typeof fitView==='function'&&fitView());const it=HW.list[HW.i];
  if(!it.q){it.q=hwMake(it);if(!it.q){HW.list.splice(HW.i,1);if(HW.i>=HW.list.length)return hwReport();return hwShow()}it.q.parts.forEach(p=>{p.tries=0;p.got=null});it.q.marks=it.q.parts.reduce((a,p)=>a+p.marks,0)}
  const q=it.q,S=hwStall(it.gen.t),cust=(!HW.exam&&q.marks>=3)?pick(['🤵','🧑‍💼','👩‍💼','👸']):it.cust||pick(HWCUST),dish=pick(S.d),calc=it.p2;
  it.dish=dish;const say=q.say||pick([`One ${dish}, please! While you cook, can you help me with my homework?`,`One ${dish}! My kid is stuck on this question. Can you help, boss?`,`I'll have the ${dish}. Quick question while I wait…`]);
  const vip=!HW.exam&&q.marks>=3;const meta=`${HWT[it.gen.t]} · ${HWSEC(it)} · <span class="rqmk">[${q.marks} mark${q.marks>1?'s':''}]</span>`,wait=HW.list.slice(HW.i+1,HW.i+5).map(x=>x.cust).join(' '),more=Math.max(0,HW.list.length-HW.i-5);
  const head=HW.exam?`<div class="hwticket hwexamq"><span class="hwcust" aria-hidden="true">📝</span><div><b>Question ${HW.i+1}</b><small>${meta}</small></div></div>`
    :`<div class="hwscene"><div class="hwawn" aria-hidden="true"></div><div class="hwboard">${HWDECO[HWS.st[it.gen.t].lv]?`<span class="hwdeco" aria-hidden="true">${HWDECO[HWS.st[it.gen.t].lv]}</span> `:''}${S.i} ${hwOwn()} ${S.n}</div>${vip?`<span class="hwvip">⭐ VIP order · worth up to ${hwMoney(q.marks*hwPerMark(HW.mode==='stall'?HWS.st[it.gen.t].lv:1))}</span>`:''}<small class="hwmeta">${meta}</small>
      <div class="hwfront"><span class="hwcust hwwalk" id="hwCust" aria-hidden="true">${cust}</span><div class="hwbub" id="hwBub" aria-live="polite">${say}</div></div>
      <div class="hwcounter"><span class="hwplate" id="hwPlate" aria-hidden="true">🍽️</span>${wait?`<span class="hwwait">Waiting: <span aria-hidden="true">${wait}</span>${more?` +${more}`:''}</span>`:'<span class="hwwait">Last customer!</span>'}</div></div>`;
  $('gStage').innerHTML=`<div class="hwtop"><span class="pill">${HW.exam?'Question':'Order'} ${HW.i+1} of ${HW.list.length}</span><span class="pill hwcoin">${hwMoney(HWS.coins)}</span>${HW.exam?'<span class="pill hwtm" id="hwTm">⏱</span>':''}<span style="flex:1"></span>
      ${calc?'<button class="btn" id="rqCalcBtn" aria-expanded="false">🧮 Calculator</button>':'<span class="rqcalc-tag" title="No calculator in Paper 1">🚫 No calculator</span>'}</div>
    <div class="hwprog" aria-hidden="true">${HW.list.map((x,i)=>`<i class="${x.r===undefined?(i===HW.i?'now':''):x.r>=1?'ok':x.r>0?'half':'no'}"></i>`).join('')}</div>
    ${head}
    <div class="rqq">${q.stem?`<div class="rqstem">${q.stem}</div>`:''}${q.fig?`<div class="rqfig">${q.fig}</div>`:''}<div class="rqparts">${q.parts.map((p,j)=>hwPartHTML(p,j,q.parts.length)).join('')}</div></div><div id="gf"></div>`;
  if(calc)$('rqCalcBtn').onclick=()=>{sfx.tap();rqCalcShow(!$('rqCalc')||$('rqCalc').hidden)};else rqCalcShow(false);
  it.react=HW.exam?null:hwReact;q.parts.forEach((p,j)=>hwWire(p,j,it,()=>hwDone(it)));hwActivate(q,0);it.ts=Date.now();
  qubi('gQ','idle',pick(['Read carefully!','Underline the key words.','Check the units!','You got this!']),true)}
/* the customer at the counter reacts to each answer, and the dish lands on the counter when the order is right */
function hwReact(state,it){const c=$('hwCust'),b=$('hwBub'),pl=$('hwPlate');if(!c||!b)return;const m={
    part:['😋',pick(['Yes! And the next part?','Shiok, that part is right. Next one!','Correct! Now the next bit…'])],
    miss1:['🤔',pick(['Hmm, are you sure? That doesn\'t look right.','Eh boss, check again leh.','Wait ah… I don\'t think that\'s correct.'])],
    miss2:['😕',pick(['Never mind, let\'s look at the right answer together.','Aiyo, OK, here is how it should be.'])],
    served:['😋',pick(['Thank you, boss! Exactly what I wanted!','Wah, so fast and correct! I\'ll come again!','Perfect! Keep the change!'])],
    half:['🙂',pick(['Not bad, mostly right. Thanks, boss!','Can lah, almost perfect.'])],
    sent:['😞',pick(['Aiyo, that\'s not right… I\'ll study the working with you.','Hmm, I\'ll wait for the correct one next time.'])]}[state];if(!m)return;
  b.innerHTML=`<span class="hwface">${m[0]}</span> ${m[1]}`;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');
  c.classList.remove('hwwalk','hwhop','hwshake');void c.offsetWidth;c.classList.add(state==='miss1'||state==='miss2'||state==='sent'?'hwshake':'hwhop');
  if(pl&&(state==='served'||state==='half')){pl.textContent=hwStall(it.gen.t).i;pl.classList.add('served');pl.title=it.dish||''}}
function hwPartHTML(p,j,n){let h=rqPartHTML(p,j,n);if(p.type==='choice')h=h.replace(/<div class="choices one rqch">/,'<div class="choices one rqch hwch">');return h}
function hwActivate(q,j){q.parts.forEach((p,k)=>{const el=$('rqP'+k);if(!el)return;el.classList.toggle('act',k===j);el.classList.toggle('wait',k>j);
    if(k>j&&!el.querySelector('.hwlock'))el.insertAdjacentHTML('afterbegin','<span class="hwlock">🔒 Finish the part above first</span>');if(k<=j){const l=el.querySelector('.hwlock');if(l)l.remove()}
    el.querySelectorAll('.rqarea button,.rqarea input').forEach(b=>{if(p.got!==null)return;b.disabled=k!==j||b.dataset.dead==='1'})});
  const el=$('rqP'+j);if(el){const i=el.querySelector('input');if(i&&!('ontouchstart' in window))i.focus({preventScroll:true});HW.input=i||null;if(j>0)el.scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})}}
function hwShowAns(p){if(p.type==='num'&&p.pre==='$')return $m(p.v);if(p.type==='num'&&p.pre&&p.pre!=='$')return p.pre+(p.show||fmtN(p.v));return rqShowAns(p)}
/* why a typed answer is wrong: listed traps first, then common slips */
function hwWhy(p,el){if(p.type==='choice')return null;if(p.type!=='num')return null;const r=rqParse(el.querySelector('input').value);if(!r)return null;
  for(const t of p.traps||[])if(Math.abs(r.v-t[0])<1e-6)return t[1];
  if(p.v&&r.v){const q=r.v/p.v;for(const f of [10,100,1000])if(Math.abs(q-f)<1e-6||Math.abs(q-1/f)<1e-6)return 'The digits look right, but the size is wrong. Check the place value, the decimal point or the units.'}
  if(p.pre==='$'&&Math.abs(r.v*100-p.v)<1e-6)return 'Give your answer in dollars, not cents.';return null}
function hwWire(p,j,it,onAll){const el=$('rqP'+j),q=it.q;
  const submit=(res,btn,why)=>{if(!res)return;const fb=el.querySelector('.rqfb');if(res.skip){fb.innerHTML=`<p class="rqmsg">${res.msg}</p>`;return}
    p.tries++;
    const more=q.parts.filter(x=>x.got===null).length>1;
    if(res.ok){if(it.react&&more)it.react('part');p.got=p.tries===1?p.marks:p.marks/2;fb.innerHTML=`<p class="rqmsg ok">✓ ${p.tries===1?pick(['Correct!','Order up!','Shiok!','Spot on!']):'Correct on the second try.'} <b>+${fmtN(p.got)} mark${p.got===1?'':'s'}</b></p>`;sfx.ok();if(btn&&p.type==='choice')btn.classList.add('right')}
    else if(p.tries===1){if(it.react)it.react('miss1');const hint=p.hint||q.hint;fb.innerHTML=`<div class="hwmiss"><p class="rqmsg no">✗ ${why||res.msg||'Not quite.'}</p>${hint?`<p class="hwhint">💡 <b>Hint:</b> ${hint}</p>`:''}<p class="hwmore">Try once more for half the marks.</p></div>`;sfx.no();qubi('gQ','oops',pick(RETRY));
      if(btn){btn.classList.add('wrong');btn.disabled=true;btn.dataset.dead='1'}el.querySelectorAll('input').forEach(i=>i.classList.add('noc'));const s=$('gStage');s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');return}
    else{if(it.react&&more)it.react('miss2');p.got=0;fb.innerHTML=`<div class="hwmiss"><p class="rqmsg no">✗ ${why?why+' ':''}The answer is <b>${hwShowAns(p)}</b>.</p>${(p.work||[]).length?`<div class="hwpw">${p.work.map(w=>`<div>${w}</div>`).join('')}</div>`:''}</div>`;sfx.no();qubi('gQ','oops',pick(OOPS));
      if(btn)btn.classList.add('wrong');if(p.type==='choice')el.querySelector(`[data-k="${p.ans}"]`).classList.add('right')}
    el.querySelectorAll('.rqarea button,.rqarea input').forEach(b=>b.disabled=true);el.classList.add('done');
    const next=q.parts.findIndex(x=>x.got===null);if(next>=0)hwActivate(q,next);else onAll()};
  if(p.type==='choice')el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(p.got!==null)return;const k=+b.dataset.k;submit({ok:k===p.ans},b,k!==p.ans&&p.why?p.why[k]:null)});
  else if(p.type==='tfn'){el.querySelectorAll('.tf').forEach(b=>b.onclick=()=>{if(p.got!==null)return;sfx.tap();el.querySelectorAll(`.tf[data-r="${b.dataset.r}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});el.querySelector('.rqchk').onclick=()=>{if(p.got!==null)return;submit(rqGrade(p,el))}}
  else{const go=()=>{if(p.got!==null)return;el.querySelectorAll('input').forEach(i=>i.classList.remove('okc','noc'));const r=rqGrade(p,el);if(!r){el.querySelector('.rqfb').innerHTML='<p class="rqmsg">Type your answer first.</p>';return}submit(r,null,r.ok?null:(r.msg||hwWhy(p,el)))};
    el.querySelector('.rqchk').onclick=go;el.querySelectorAll('input').forEach(i=>{i.onkeydown=e=>{if(e.key==='Enter')go()};i.onfocus=()=>{HW.input=i}})}}
function hwDone(it){const q=it.q,got=q.parts.reduce((a,p)=>a+p.got,0),t=it.gen.t,lv=HWS.st[t].lv;it.r=got/q.marks;it.ms=Date.now()-(it.ts||Date.now());
  HW.got+=got;HW.max+=q.marks;HW.byT[t]=HW.byT[t]||[0,0];HW.byT[t][0]+=got;HW.byT[t][1]+=q.marks;HWS.st[t].g+=got;HWS.st[t].m+=q.marks;HWS.served++;
  const perfect=got===q.marks&&q.parts.every(p=>p.tries===1);HW.streak=perfect?HW.streak+1:0;
  let coins=Math.round(got*10*(HW.mode==='stall'?HWMULT[lv]:1))+(perfect&&HW.streak>=3?5*Math.min(HW.streak,6):0);HW.coins+=coins;HWS.coins+=coins;hwSave();
  const cc=$('gStage').querySelector('.hwcoin');if(cc)cc.textContent=hwMoney(HWS.coins);if(it.react)it.react(got===q.marks?'served':got>0?'half':'sent',it);
  const work=q.parts.length>1?q.parts.map((p,j)=>`<div class="rqw"><b>(${'abcd'[j]})</b> ${(p.work||[]).map(w=>`<div>${w}</div>`).join('')}</div>`).join(''):(q.parts[0].work||[]).map(w=>`<div>${w}</div>`).join('');
  const last=HW.i+1>=HW.list.length;const willInspect=!last&&HWMODES[HW.mode]?HWMODES[HW.mode].insp&&HW.insp<1&&Math.random()<.35:(!last&&HW.mode==='stall'&&HW.insp<1&&HW.i>=1&&Math.random()<.3);
  HW.next=willInspect?'insp':'q';
  $('gf').innerHTML=`<div class="fb ${got===q.marks?'ok':'no'}"><p class="fbt">${HW.exam?(got===q.marks?'Full marks!':got>0?'Some marks.':'No marks this time.'):got===q.marks?(perfect?'Perfect order!':'Order served!'):got>0?'Part of the order is right.':'The customer sent it back.'} ${fmtN(got)} / ${q.marks}</p>
    <p class="hwearn">${coins?`+${hwMoney(coins)}`:'No coins this time.'}${perfect&&HW.streak>=3?` <span class="streak">🔥 Streak ×${HW.streak}</span>`:''}</p>
    <div class="work"><span class="tag">Working</span>${work}</div><div><button class="btn primary" id="gNext">${last?(HW.exam?'Hand in the paper':'Close the stall and count the coins'):HW.exam?'Next question →':'Next customer →'}</button></div></div>`;
  $('gNext').onclick=()=>{sfx.tap();if(last)return hwReport();HW.i++;HW.next==='insp'?hwInspect(it.gen.t):hwShow();window.scrollTo({top:0,behavior:calm?'auto':'smooth'})};
  qubi('gQ',got===q.marks?'cheer':'oops',got===q.marks?(HW.streak>=3?`Streak ×${HW.streak}!`:pick(CHEER)):pick(OOPS));
  $('gf').scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})}

/* ---------- Trap Hunter: surprise hygiene inspection ---------- */
function hwCalQ(topic){const gens=shuffle(HWB.filter(g=>g.t===topic)).concat(shuffle(HWB));
  for(const g of gens){const kinds=g.k.filter(k=>k!=='long');if(!kinds.length)continue;for(let t=0;t<6;t++){let q=null;try{q=g.make(pick(kinds))}catch(e){}if(q&&q.cal&&q.parts.length===1)return {g,q}}}return null}
function hwInspect(topic){HW.insp++;const pk=hwCalQ(topic);if(!pk)return hwShow();const {g,q}=pk,c=q.cal,p=q.parts[0];p.tries=0;p.got=null;const I={g,q,step1:null,tries:0};HW.cur=I;rqCalcShow(false);
  $('gStage').innerHTML=`<div class="hwinsp"><span class="hwbig" aria-hidden="true">🕵️</span><div><b>Surprise inspection!</b><small>Your helper Careless Cal answered this order. One line of his working is wrong.</small></div></div>
    <ol class="hwsteps"><li class="on" id="hwS1">Find Cal's mistake</li><li id="hwS2">Give the right answer</li></ol>
    <div class="rqq">${q.stem?`<div class="rqstem">${q.stem}</div>`:''}${q.fig?`<div class="rqfig">${q.fig}</div>`:''}
    <div class="hwcal"><div class="hwcalh">🙃 Cal's working: <span>tap the wrong line</span></div>${c.lines.map((l,i)=>`<button class="hwline" data-l="${i}"><span class="hwln">${i+1}</span><span>${l}</span></button>`).join('')}<div class="rqfb" id="hwCalFb" aria-live="polite"></div></div>
    <div class="rqparts" id="hwStep2" hidden><div class="hwstep">Now work out the correct answer yourself.</div>${hwPartHTML(p,0,1)}</div></div><div id="gf"></div>`;
  const fb=$('hwCalFb');qubi('gQ','wave','Spot the mistake!',true);
  $('gStage').querySelectorAll('.hwline').forEach(b=>b.onclick=()=>{if(I.step1!==null)return;const k=+b.dataset.l;I.tries++;
    if(k===c.bad){I.step1=I.tries===1?1:.5;b.classList.add('bad');fb.innerHTML=`<p class="rqmsg ok">✓ Found it! ${c.why}</p>`;sfx.ok();step2()}
    else if(I.tries===1){b.classList.add('okl');b.disabled=true;fb.innerHTML=`<p class="rqmsg no">✗ Line ${k+1} is fine.</p><p class="hwhint">💡 <b>Hint:</b> check each line against the question. Which rule or unit did Cal forget?</p>`;sfx.no();qubi('gQ','oops','Look again!')}
    else{I.step1=0;$('gStage').querySelector(`.hwline[data-l="${c.bad}"]`).classList.add('bad');fb.innerHTML=`<p class="rqmsg no">✗ The mistake is in line ${c.bad+1}. ${c.why}</p>`;sfx.no();step2()}});
  function step2(){$('gStage').querySelectorAll('.hwline').forEach(x=>x.disabled=true);$('hwS1').className='done';$('hwS2').className='on';const s2=$('hwStep2');s2.hidden=false;
    hwWire(p,0,{q},()=>{const ok2=p.got>0,pass=I.step1>0&&ok2,full=I.step1===1&&p.tries===1;HWS.insp.n++;if(pass)HWS.insp.p++;const coins=(I.step1===1?15:I.step1?8:0)+Math.round(p.got*10);HWS.coins+=coins;HW.coins+=coins;hwSave();
      HW.inspLog.push(pass);
      $('gf').innerHTML=`<div class="fb ${pass?'ok':'no'}"><p class="fbt">${full?'🧼 Grade A! The inspector is impressed.':pass?'🧼 Inspection passed.':'🧽 The inspector wants you to clean up. Study the working.'}</p><p class="hwearn">${coins?`+${hwMoney(coins)}`:'No coins this time.'} · Hygiene grade now <b>${hwGrade()}</b></p>
        <div class="work"><span class="tag">Correct working</span>${(p.work||[]).map(w=>`<div>${w}</div>`).join('')}</div><div><button class="btn primary" id="gNext">Back to the orders →</button></div></div>`;
      $('gNext').onclick=()=>{sfx.tap();hwShow();window.scrollTo({top:0,behavior:calm?'auto':'smooth'})};if(full){sfx.win&&sfx.win();if(!calm)confetti(70)}qubi('gQ',pass?'party':'oops',pass?'Clean as a whistle!':'We will get it next time.',true);$('gf').scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})});
    hwActivate({parts:[p]},0);s2.scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})}}

/* ---------- end of session ---------- */
function hwReport(){hwStop();rqCalcShow(false);document.body.classList.remove('playing');const pc=HW.max?Math.round(HW.got/HW.max*100):0,stars=pc>=85?3:pc>=65?2:pc>=40?1:0;
  setBest('p5-hawker',stars);setTimeout(()=>typeof arcReport==='function'&&arcReport('p5-hawker',pc,{stars,mode:'solo'}),300);
  const tops=Object.entries(HW.byT).map(([t,[g,m]])=>({t,g,m,a:g/m})).sort((a,b)=>a.a-b.a);const weak=tops.filter(o=>o.a<.75).slice(0,3);
  const bar=(g,m)=>{const p=Math.round(g/m*100);return `<span class="rqbar"><i style="width:${p}%;background:${p>=75?'var(--good)':p>=50?'var(--sun)':'var(--bad)'}"></i></span>`};
  const secs=HW.exam?Math.round((Date.now()-HW.t0)/1000):0;
  $('gStage').innerHTML=`<div class="end rqrep hwrep"><span class="tag">${HW.topic?hwStall(HW.topic).n:HWMODES[HW.mode].n} · end of service</span><h3>You scored ${fmtN(HW.got)} out of ${HW.max} marks (${pc}%)</h3><p class="big">${starStr(stars)}</p>
    <div class="hwsum"><div><small>Coins earned</small><b>${hwMoney(HW.coins)}</b></div><div><small>Coins in the bank</small><b>${hwMoney(HWS.coins)}</b></div>${HW.inspLog.length?`<div><small>Inspection</small><b>${HW.inspLog.every(Boolean)?'Passed 🧼':'Failed 🧽'}</b></div>`:''}${HW.exam?`<div><small>Time</small><b>${mmss(secs*1000)}</b><small>of ${HWMODES[HW.mode].exam} min</small></div>`:''}</div>
    <h4>Marks by topic</h4><div class="rqcols">${tops.map(o=>`<div class="rqrow"><span>${hwStall(o.t).i} ${HWT[o.t]}</span>${bar(o.g,o.m)}<b>${fmtN(o.g)}/${o.m}</b></div>`).join('')}</div>
    ${weak.length?`<div class="rqweak"><h4>Tips from Qubi</h4><ul>${weak.map(o=>`<li><b>${HWT[o.t]}:</b> ${HWTIP[o.t]}</li>`).join('')}</ul></div>`:'<p>Every topic above 75%. Try an Exam Day or upgrade a stall to bring in VIP customers!</p>'}
    ${HWS.coins>=Math.min(...HWSTALL.map(s=>HWS.st[s.t].lv<5?HWUP[HWS.st[s.t].lv]:1e9))?'<p class="hwtipup">⬆ You have enough coins to upgrade a stall!</p>':''}
    <div class="row"><button class="btn primary" id="hwAgain">Serve again</button><button class="btn" id="hwHome">Back to the hawker centre</button></div></div>`;
  $('hwAgain').onclick=()=>{sfx.tap();hwGo(HW.mode,HW.topic)};$('hwHome').onclick=()=>{sfx.tap();hwHome()};
  if(stars>=2){sfx.win();if(!calm)confetti(140,true)}qubi('gQ','party',stars>=2?'What a service!':'Every order makes you better!',true);window.scrollTo({top:0,behavior:calm?'auto':'smooth'})}
