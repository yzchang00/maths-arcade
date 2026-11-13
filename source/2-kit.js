/* ================= KIT ================= */
const $=id=>document.getElementById(id);
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const lcm=(a,b)=>a*b/gcd(a,b);
const fmt=n=>n.toLocaleString('en-SG');
const fr=(n,d)=>`<span class="fr"><span>${n}</span><span>${d}</span></span>`;
function nice(n,d){const g=gcd(n,d);n/=g;d/=g;if(d===1)return String(n);if(n<d)return fr(n,d);const w=Math.floor(n/d);return `<span class="whole">${w}</span>${fr(n%d,d)}`}
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const STRANDS={rev:{name:'PSLE revision · all topics',c:'var(--sun)'},num:{name:'Number and Algebra',c:'var(--teal)'},geo:{name:'Measurement and Geometry',c:'var(--tomato)'},stat:{name:'Statistics',c:'var(--violet)'},party:{name:'Party games · play together',c:'#e0559a'}};
const GAMES=Object.create(null),ORDER=[]; /* no prototype, so names like "constructor" are never treated as games */
function addGame(id,g){GAMES[id]=g;ORDER.push(id)}

/* sound: generated live, no files */
let AC=null,muted=false;try{muted=localStorage.getItem('arcMute')==='1'}catch(e){}
const ac=()=>{if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC};
function tone(f,t0,dur,{type='triangle',vol=.16,to=null}={}){const c=ac();if(!c||muted)return;
  const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;o.type=type;o.frequency.setValueAtTime(f,t);
  if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.05)}
const sfx={
  tap(){tone(700,0,.05,{type:'square',vol:.04})},
  pop(){tone(480,0,.1,{type:'sine',vol:.14,to:960})},
  soft(){tone(260,0,.18,{type:'sine',vol:.12,to:180})},
  ok(){[523,659,784,1047].forEach((f,i)=>tone(f,i*.08,.28,{vol:.17}))},
  no(){tone(200,0,.45,{type:'sawtooth',vol:.15,to:100})},
  win(){[523,523,523,784,659,784,1047].forEach((f,i)=>tone(f,[0,.14,.28,.42,.7,.84,.98][i],i===6?1.2:.22,{type:'square',vol:.1}))}
};
function setMute(m){muted=m;try{localStorage.setItem('arcMute',m?'1':'0')}catch(e){}const b=$('mute');b.innerHTML=(m?'🔇':'🔊')+'<span class="tl"> Sound effects: '+(m?'off':'on')+'</span>';b.setAttribute('aria-label','Sound effects '+(m?'off':'on'));b.setAttribute('aria-pressed',String(!m));b.classList.toggle('off',m);b.title=m?'Turn on the beeps, dings and cheers':'Turn off the beeps, dings and cheers (music is separate)'}
$('mute').onclick=()=>{setMute(!muted);if(!muted){ac();sfx.tap()}};setMute(muted);

/* theme: auto (follows the device), light or dark */
let THEME='auto';try{THEME=localStorage.getItem('arcTheme')||'auto'}catch(e){}
function setTheme(t){THEME=t;try{localStorage.setItem('arcTheme',t)}catch(e){}if(t==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',t);
  $('theme').innerHTML=(t==='light'?'☀️<span class="tl"> Light':t==='dark'?'🌙<span class="tl"> Dark':'🌓<span class="tl"> Auto')+' mode</span>';$('theme').setAttribute('aria-label',(t==='light'?'Light':t==='dark'?'Dark':'Auto')+' mode');$('theme').title='Switch between auto, light and dark mode'}
$('theme').onclick=()=>{setTheme(THEME==='auto'?'light':THEME==='light'?'dark':'auto');sfx.tap()};setTheme(THEME);
/* confetti */
const cv=$('fx'),cx=cv.getContext('2d');let parts=[],raf=null;
function confetti(n=60,rain=false){if(calm)return;cv.width=innerWidth;cv.height=innerHeight;
  const cols=['#ffb81f','#ef5240','#0b968b','#5f50ec','#45d08a'];
  for(let i=0;i<n;i++)parts.push({x:rain?Math.random()*cv.width:cv.width/2+(Math.random()-.5)*160,y:rain?-20-Math.random()*cv.height*.4:cv.height*.5,
    vx:(Math.random()-.5)*(rain?3:13),vy:rain?2+Math.random()*3:-7-Math.random()*8,s:5+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:pick(cols),l:0});
  if(!raf)raf=requestAnimationFrame(tick)}
function tick(){cx.clearRect(0,0,cv.width,cv.height);parts=parts.filter(p=>p.y<cv.height+30&&p.l<380);
  parts.forEach(p=>{p.l++;p.vy+=.25;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});
  raf=parts.length?requestAnimationFrame(tick):null;if(!raf)cx.clearRect(0,0,cv.width,cv.height)}

/* best scores (this device only) */
const getBest=id=>{try{return +localStorage.getItem('arcBest_'+id)||0}catch(e){return 0}};
const setBest=(id,s)=>{try{if(s>getBest(id))localStorage.setItem('arcBest_'+id,s)}catch(e){}};
const starStr=n=>'★'.repeat(n)+'☆'.repeat(3-n);

/* game shell */
const PRAISE=['Correct!','Brilliant!','Spot on!','Nailed it!','Well done!','Superb!'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let ctx=null;
function cleanup(){if(typeof ONLINE!=='undefined')ONLINE.hook=null;if($('rqCalc')){$('rqCalc').hidden=true;document.body.classList.remove('rqco')}if(ctx){ctx.timers.forEach(clearTimeout);ctx.dead=true}ctx=null}
/* ---------- nickname filter (used for leaderboard names, classes and online-room names) ----------
   Checks a "squashed" copy of the name: lower case, look-alike digits/symbols turned into letters
   (0→o, 1→i, 3→e, 4→a, 5→s, 7→t, @→a, $→s), everything except letters removed, repeated letters collapsed.
   So "N1GG3R", "f.u.c.k", "Fuuuck" and "s h i t" are all caught. */
const BADWORDS=/(n[i1]g(?:er|a|ah|uh|az|ers)|fuk|fuc|fck|fvk|fvc|phuk|shit|sht|bitch|bich|biatch|cunt|dick|pusy|puss|sex|porn|fag|cock|slut|whore|rape|penis|vagina|boob|tits|tity|wank|retard|ashole|arse|bastard|idiot|stupid|dumb|bodoh|knn|kanina|ccb|lanji|lanjio|chibai|cibai|cheebai|pukimak|puki|nabeh|sohai|diulei|hitler|nazi|kys|kilyour|suicid|damn|crap|bastad|motherf|stfu|wtf|gay|lesbian|homo|negro|chink|paki|kling|keling)/;
function squashNick(s){return String(s||'').toLowerCase().replace(/[0-9@$!|]/g,c=>({'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','8':'b','9':'g','@':'a','$':'s','!':'i','|':'i'}[c]||'')).replace(/[^a-z]/g,'').replace(/(.)\1+/g,'$1')}
const OKWORDS=/(nigam|nigamm|sussex|essex|middlesex|dickson|dicksen|dickens|benedick|susex|esex|midlesex|peacock|hancock|cockato|cockpit|cockerel|scunthorpe|shitake|shiitake|pakistan|klingon|sexton|titus|titan)/g;
function isBadNick(s){const a=squashNick(s).replace(OKWORDS,''),b=String(s||'').toLowerCase().replace(/[^a-z]/g,'').replace(OKWORDS,'');return BADWORDS.test(a)||BADWORDS.test(b)}
const safeNick=s=>isBadNick(s)?'Player':String(s||'');
/* Play modes: solo, vs robot, pass & play on one device, online room. */
const MODES=[['solo','Solo'],['bot','vs Robot'],['pass','Pass & play'],['online','Online room']];
let MODE='solo',PASS=null;
const BOT={easy:{name:'Robo Rookie',acc:.55},mixed:{name:'Robo',acc:.7},hard:{name:'Robo Pro',acc:.85}};
const totalRounds=c=>c.mode==='pass'?c.per*c.players.length:c.G.rounds;
function passR(k,per,N){let r=Math.floor(k*N/per);if(r%2!==k%2&&r+1<N)r++;return Math.min(r,N-1)}
const api={
  first(k){const c=ctx;if(!c)return false;c.st=c.st||{};c.st[k]=(c.st[k]||0)+1;return c.st[k]===1},
  retry(el,msg){if(!el)return;el.innerHTML=`<p class="retrymsg">🔁 ${msg||'Not quite. Have another go!'}</p>`;sfx.no();qubi('gQ','oops',pick(RETRY))},
  q(html){$('gq').innerHTML=html},
  get body(){return $('gb')},
  get answered(){return !!(ctx&&ctx.answered)},
  log(t){const c=ctx;if(!c)return;c.log=c.log||{};const k=c.mode==='pass'?c.r%c.players.length:0;(c.log[k]=c.log[k]||[]).push(t)},
  later(fn,ms){const c=ctx;const t=setTimeout(()=>{if(c&&!c.dead)fn()},ms);c.timers.push(t)},
  done(ok,msg,work=[],pts,opt={}){const c=ctx;if(!c||c.answered)return;c.answered=true;if(pts===undefined)pts=ok?10:0;
    if(!ok&&c.try===1&&!opt.noRetry){ /* noRetry: the round already gave its own extra practice */c.try=2;sfx.no();qubi('gQ','oops',pick(RETRY));const st=$('gStage');st.classList.remove('shake');void st.offsetWidth;st.classList.add('shake');startRound(true);return}
    if(c.try===2){pts=Math.ceil(pts/2);if(ok)msg=`Got it on the second try (half points). ${msg}`}
    let extra='';
    if(c.mode==='pass'){const p=c.players[c.r%c.players.length];p.score+=pts}else c.score+=pts;
    c.streak=ok&&c.try===1?c.streak+1:0;
    if(c.mode==='bot'){const b=BOT[c.level],roll=Math.random(),bp=roll<b.acc?10:roll<b.acc+.15?5:0;c.botScore+=bp;
      extra=`<p class="botline">🤖 ${b.name} ${bp===10?'got it right first time (+10)':bp===5?'got it on the second try (+5)':'got it wrong (+0)'}.</p>`}
    if(c.mode==='online')onlineReport();
    if(ok){sfx.ok();confetti(c.streak>=3?90:45);qubi('gQ','cheer',c.streak>=3?`Streak ×${c.streak}! Unstoppable!`:pick(CHEER))}else{sfx.no();qubi('gQ','oops',pick(OOPS))}
    renderScore();
    const last=c.r+1>=totalRounds(c),nextName=c.mode==='pass'&&!last?c.players[(c.r+1)%c.players.length].name:'';
    $('gf').innerHTML=`<div class="fb ${ok?'ok':'no'}"><p class="fbt">${ok?pick(PRAISE)+' ':''}${msg}</p>${extra}
      ${c.streak>=3&&c.mode!=='pass'?`<p class="streak">Streak ×${c.streak}</p>`:''}
      ${work.length?`<div class="work"><span class="tag">Working</span>${work.map(w=>`<div>${w}</div>`).join('')}</div>`:''}
      <div><button class="btn primary" id="gNext">${last?(c.mode==='solo'?'See my stars':'See the results'):nextName?`Pass to ${esc(nextName)} →`:'Next round →'}</button></div></div>`;
    $('gNext').onclick=()=>{sfx.tap();if(last)finish();else{c.r++;startRound();window.scrollTo({top:0,behavior:calm?'auto':'smooth'})}};
    $('gf').scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})}
};
/* Levels: Easy replays the first half of a game's round types, Hard the second half, Mixed runs the full warm-up-to-hard sequence. */
const LEVELS=[['easy','Easy'],['mixed','Mixed'],['hard','Hard']];
const getLvl=id=>{try{return localStorage.getItem('arcLvl_'+id)||'mixed'}catch(e){return 'mixed'}};
function effR(r,N,lv){if(lv==='mixed'||N<2)return r;let span=Math.ceil(N/2);if(span%2&&span<N)span++;if(lv==='easy')return r%span;let st=N-span;if(st%2&&st+1<N)st++;return st+(r%(N-st))}
function renderScore(){const c=ctx;if(!c||!$('gVs'))return;
  if(c.mode==='solo'){$('gVs').innerHTML='';$('gScore').hidden=false;$('gScore').textContent=`Score ${c.score}`;return}
  $('gScore').hidden=true;let rows;
  if(c.mode==='bot')rows=[{n:'You',s:c.score,me:1},{n:'🤖 '+BOT[c.level].name,s:c.botScore}];
  else if(c.mode==='pass')rows=c.players.map((p,i)=>({n:p.name,s:p.score,me:i===c.r%c.players.length&&c.r<totalRounds(c)}));
  else if(c.G.custom){$('gVs').innerHTML='';return} /* online party games draw their own scoreboard */
  else rows=onlineRows();
  $('gVs').innerHTML=`<div class="vs">${rows.map(x=>`<span class="vsp ${x.me?'me':''}"><b>${esc(x.n)}</b> ${x.s}${x.sub?`<small>${x.sub}</small>`:''}</span>`).join('')}</div>`}
const LVNAME={easy:'Easy',mixed:'Medium',hard:'Hard'},MODENAME={solo:'Solo',bot:'vs Robot',pass:'Pass & play',online:'Online room',class:'Whole class'};
function playGame(id,opts={}){cleanup();if(opts.setup||opts.go)arcLog('start',id);document.body.classList.remove('playing');const G=GAMES[id];
  ctx={id,G,r:0,score:0,botScore:0,streak:0,timers:[],answered:false,dead:false,level:opts.level||getLvl(id),mode:MODE,seedBase:opts.seedBase,go:!!opts.go};
  const s=STRANDS[G.strand];
  $('view').innerHTML=`<div style="display:grid;gap:14px;--c:${s.c}">
    <div class="gbar"><a class="back" href="#">← All games</a><div class="row">${window.ARCB?'<button class="btn gbtn" id="gLb" title="See the top scores for this game">🏆 Leaderboard</button>':''}<span class="pill" id="gRound" hidden></span><span class="pill" id="gScore" hidden>Score 0</span></div></div>
    <div class="gtop"><div class="ghead"><span class="tag">${G.level} · ${G.topic}</span><h2>${G.title}</h2></div>${qubiBox('gQ',pick(['Let’s go!','You can do this!','I believe in you!']))}</div>
    <div id="gSet" class="row"></div><div id="gVs"></div>
    <div class="stagewrap"><button class="stagemenu" id="gMenu" hidden title="Leave this round and go back to this game's start screen">↩ Back to game menu</button><section class="stage" id="gStage"><div id="gq"></div><div id="gb" style="display:grid;gap:14px;min-width:0"></div><div id="gf"></div></section></div></div>`;
  {const st=$('gStage'),sync=()=>{const b=$('gMenu');if(b)b.hidden=!!st.querySelector('.wiz,.rqhome')&&!st.querySelector('.rqhead')};new MutationObserver(sync).observe(st,{childList:true});sync()}
  $('gMenu').onclick=()=>{sfx.tap();playGame(id)};if($('gLb'))$('gLb').onclick=()=>{sfx.tap();lbPopup(id)};
  if(G.ownStart){$('gSet').hidden=true;G.custom($('gStage'),'solo');return}
  if(!opts.go&&!opts.setup)return startWizard(id);
  $('gSet').innerHTML=`<span class="setchip">${MODENAME[MODE]||''}${G.custom||(MODE==='online'&&!opts.go)?'':' · '+LVNAME[ctx.level]}</span><button class="btn" id="gChange">Change settings</button>`;
  $('gChange').onclick=()=>{sfx.tap();playGame(id)};
  if(G.custom){$('gStage').innerHTML='';G.custom($('gStage'),MODE);return}
  if(MODE==='pass'&&!opts.go)return passSetup(id);
  if(MODE==='online'&&!opts.go)return onlinePanel(id);
  $('gRound').hidden=false;
  if(MODE==='pass'){ctx.players=PASS.map(n=>({name:n,score:0}));ctx.per=Math.max(3,Math.floor(G.rounds/PASS.length))}
  if((opts.setup||opts.how)&&MODE!=='online')return showHow(id);
  if(MODE==='online'&&ONLINE.resuming&&ONLINE.cur){ONLINE.resuming=false;const d=olResGet(ONLINE.cur);if(d){ctx.r=Math.min(d.r,G.rounds-1);ctx.score=d.score;setTimeout(()=>olToast('Welcome back! Carrying on from round '+(ctx.r+1)+'.'),300)}}
  renderScore();startRound()}
function showHow(id){const G=GAMES[id],H=(typeof HOWTO!=='undefined'&&HOWTO[id])||{},tips=H.steps||G.how.split(/(?<=[.!?])\s+/).filter(Boolean);
  $('gStage').innerHTML=`<div class="howcard"><span class="howic" aria-hidden="true">📖</span><span class="tag">Before you start</span><h3>How to play ${esc(G.title)}</h3><ol class="howlist">${tips.map(t=>`<li>${t}</li>`).join('')}</ol>${H.eg?`<p class="howeg"><b>Example:</b> ${H.eg}</p>`:''}
    <p class="howset">${MODE==='pass'&&ctx.players?ctx.players.map(p=>esc(p.name)).join(' vs ')+' (take turns on this device)':MODENAME[MODE]||''} · ${LVNAME[ctx.level]} · ${MODE==='pass'&&ctx.per?ctx.per+' rounds each':G.rounds+' rounds'}${id==='p4-flip'?'':' · Wrong the first time? You get one more try for half the points.'}</p><button class="btn primary" id="howGo">I'm ready, let's play! ▶</button></div>`;
  qubi('gQ','wave','Read the rules first!',true);$('gRound').hidden=true;$('howGo').onclick=()=>{sfx.ok();$('gStage').innerHTML='<div id="gq"></div><div id="gb" style="display:grid;gap:14px;min-width:0"></div><div id="gf"></div>';$('gRound').hidden=false;renderScore();startRound()};fitView()}
/* Game start: Solo or Multiplayer → (Robot / Pass & play / Online room) → Easy / Medium / Hard */
function startWizard(id){const G=GAMES[id],modes=G.custom?G.modes.map(m=>m[0]):['solo','bot','pass','online'],multi=modes.filter(m=>m!=='solo');
  const st={step:1,mode:MODE,level:getLvl(id)},steps=G.custom?2:3;
  const tile=(k,ic,t,d,on)=>`<button class="wtile ${on?'on':''}" data-k="${k}"><span class="wic" aria-hidden="true">${ic}</span><b>${t}</b><small>${d}</small></button>`;
  const go=()=>{try{localStorage.setItem('arcLvl_'+id,st.level)}catch(e){}MODE=st.mode;sfx.ok();playGame(id,{setup:true,level:st.level})};
  const draw=()=>{let body='',title='';
    if(st.step===1){title='How do you want to play?';body=tile('solo','🎯','Solo','Play on your own and beat your best.',st.mode==='solo')+tile('multi','👥','Multiplayer',G.custom?'Race a friend or Robo.':'Play against Robo or with friends.',st.mode!=='solo')}
    else if(st.step===2){title='Who are you playing with?';body=multi.map(m=>m==='bot'?tile('bot','🤖','vs Robot','Race Robo, the computer player.',st.mode==='bot'):m==='pass'?tile('pass','📱',G.custom?'2 players':'Pass & play',G.custom?'Two players take turns on this device.':'2 to 4 players take turns on this device.',st.mode==='pass'):m==='online'?tile('online','🌐','Online room','Friends join with a room code on their own devices.',st.mode==='online'):(e=>tile(m,e[3]||'👥',e[1],e[2]||'',st.mode===m))(G.modes.find(x=>x[0]===m))).join('')}
    else{title='Choose your level';body=tile('easy','🌱','Easy','Easier question types to warm up.',st.level==='easy')+tile('mixed','⚡','Medium','Starts easy and gets harder each round.',st.level==='mixed')+tile('hard','🔥','Hard','Only the toughest question types.',st.level==='hard')}
    const n=st.step===1?1:st.step===2?2:(st.mode==='solo'?2:3),of=st.mode==='solo'?(G.custom?1:2):steps;
    $('gStage').innerHTML=`<div class="wiz"><div class="row" style="justify-content:space-between"><span class="tag">Game start · step ${n}</span>${st.step>1?'<button class="btn" id="wBack">← Back</button>':''}</div>
      <h3>${title}</h3><div class="wtiles">${body}</div></div>`;
    $('gStage').querySelectorAll('.wtile').forEach(b=>b.onclick=()=>{const k=b.dataset.k;sfx.pop();
      if(st.step===1){if(k==='solo'){st.mode='solo';if(G.custom)return go();st.step=3}else{if(!multi.includes(st.mode))st.mode=multi[0];st.step=2}}
      else if(st.step===2){st.mode=k;if(G.custom)return go();if(k==='online'){st.level='mixed';return go()}st.step=3}
      else{st.level=k;return go()}
      draw()});
    if($('wBack'))$('wBack').onclick=()=>{sfx.tap();st.step=st.step===3?(st.mode==='solo'?1:2):1;draw()}};
  qubi('gQ','wave','Pick how you want to play!',true);draw()}
function mulberry(a){return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
/* Each round is built from a saved random seed, so a second try rebuilds exactly the same question with a fresh board.
   In an online room every player derives the same seeds from the host's game seed, so everyone gets identical questions. */
function startRound(retry){const c=ctx;c.answered=false;c.st={};c.timers.forEach(clearTimeout);c.timers=[];if(c.mode==='online'&&!retry)olResSave({r:c.r,score:c.score});
  if(!retry){c.seed=c.seedBase!==undefined?(c.seedBase+Math.imul(c.r+1,2654435761))>>>0:Math.floor(Math.random()*4294967296);c.try=1}
  ['gq','gb','gf'].forEach(i=>$(i).innerHTML='');const T=totalRounds(c);
  const who=c.mode==='pass'?` · ${esc(c.players[c.r%c.players.length].name)}'s turn`:'';
  $('gRound').innerHTML=`Round ${c.r+1} of ${T}${who}${c.try===2?' · second try':''}`;
  const rr=c.mode==='pass'?effR(passR(Math.floor(c.r/c.players.length),c.per,c.G.rounds),c.G.rounds,c.level):effR(c.r,c.G.rounds,c.level);
  const real=Math.random;Math.random=mulberry(c.seed);try{c.G.round(api,rr)}finally{Math.random=real}
  if(c.mode==='pass')$('gq').insertAdjacentHTML('afterbegin',`<p class="turn">${esc(c.players[c.r%c.players.length].name)}, it's your turn!</p>`);
  if(retry)$('gq').insertAdjacentHTML('afterbegin','<p class="retry" role="status">Not quite. Look carefully and have one more try!</p>');
  renderScore();document.body.classList.add('playing');if(!retry)fitView()}
function fitView(){requestAnimationFrame(()=>{const st=$('gStage');if(!st)return;const r=st.getBoundingClientRect();if(r.bottom>innerHeight||r.top<0)window.scrollTo({top:Math.max(0,r.top+scrollY-(innerWidth<600?44:24)),behavior:calm?'auto':'smooth'})})}
function finish(){document.body.classList.remove('playing');const c=ctx;qubi('gQ','party','Game over! Great playing!',true);
  if(c.mode==='solo'){const max=c.G.rounds*10,p=c.score/max,st=p>=.9?3:p>=.6?2:p>=.3?1:0;setBest(c.id,st);if(st>=2){sfx.win();confetti(180,true)}setTimeout(()=>arcReport(c.id,c.score,{stars:st,mode:'solo'}),60);
    $('gStage').innerHTML=`<div class="end"><span class="tag">Game complete</span><div class="stars" aria-label="${st} out of 3 stars">${starStr(st)}</div>
      <h3>You scored ${c.score} out of ${max}</h3>${c.log&&c.log[0]?`<div class="glog"><b>Round by round</b><ul>${c.log[0].map(t=>`<li>${t}</li>`).join('')}</ul></div>`:''}<p style="margin:0;color:var(--muted)">${st===3?'Outstanding! You have mastered this topic.':st===2?'Great work! One more game to get all three stars?':'Good effort. Read the working in each round, then try again.'}</p>
      <div class="row"><button class="btn primary" id="again">Play again</button><button class="btn" id="again2">Change settings</button><a class="btn" href="#" style="text-decoration:none;display:inline-flex;align-items:center">Choose another game</a></div></div>`;
    $('again').onclick=()=>playGame(c.id,{go:true});$('again2').onclick=()=>playGame(c.id);return}
  if(c.mode==='online'){c.finished=true;try{localStorage.removeItem(OLRES)}catch(e){}onlineReport(true);onlineEnd();setTimeout(()=>arcReport(c.id,c.score,{mode:'online'}),60);return}
  let title,rows;
  if(c.mode==='bot'){const b=BOT[c.level].name;title=c.score>c.botScore?'You beat '+b+'!':c.score<c.botScore?b+' wins this time':'It’s a draw!';rows=[['You',c.score],['🤖 '+b,c.botScore]]}
  else{rows=c.players.map(p=>[p.name,p.score]).sort((a,b)=>b[1]-a[1]);const top=rows.filter(r=>r[1]===rows[0][1]);title=top.length>1?'It’s a tie between '+top.map(t=>esc(t[0])).join(' and ')+'!':esc(rows[0][0])+' wins!'}
  if(c.mode==='pass'||c.score>=c.botScore){sfx.win();confetti(180,true)}if(c.mode==='bot')setTimeout(()=>arcReport(c.id,c.score,{mode:'bot'}),60);
  $('gStage').innerHTML=`<div class="end"><span class="tag">Final scores</span><h3>${title}</h3><ol class="board">${rows.map(r=>`<li><b>${esc(r[0])}</b><span>${r[1]}</span></li>`).join('')}</ol>${c.mode==='pass'&&c.log?`<div class="glogs">${c.players.map((p,i)=>c.log[i]?`<div class="glog"><b>${esc(p.name)}</b><ul>${c.log[i].map(t=>`<li>${t}</li>`).join('')}</ul></div>`:'').join('')}</div>`:''}
    <div class="row"><button class="btn primary" id="again">Rematch</button><button class="btn" id="again2">Change settings</button><a class="btn" href="#" style="text-decoration:none;display:inline-flex;align-items:center">Choose another game</a></div></div>`;
  $('again').onclick=()=>playGame(c.id,{go:true});$('again2').onclick=()=>playGame(c.id)}
function passSetup(id){const names=PASS||['Player 1','Player 2'];
  $('gStage').innerHTML=`<div class="end"><span class="tag">Pass & play</span><h3>Who is playing?</h3><p style="margin:0;color:var(--muted)">Take turns on this device. Each player gets the same kinds of questions with different numbers.</p>
    <div class="row"><b>Players:</b>${[2,3,4].map(n=>`<button class="btn ${names.length===n?'sel':''}" data-n="${n}">${n}</button>`).join('')}</div>
    <div id="ppN" style="display:grid;gap:8px"></div><button class="btn primary" id="ppGo">Start</button></div>`;
  let cur=[...names];const draw=()=>{$('ppN').innerHTML=cur.map((n,i)=>`<label class="row"><span style="min-width:70px;font-weight:800">Player ${i+1}</span><input class="num" style="width:12em" maxlength="16" data-i="${i}" value="${esc(n)}"></label>`).join('');
    $('ppN').querySelectorAll('input').forEach(inp=>inp.oninput=()=>{cur[+inp.dataset.i]=inp.value})};draw();
  $('gStage').querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{const n=+b.dataset.n;cur=Array.from({length:n},(_,i)=>cur[i]||`Player ${i+1}`);$('gStage').querySelectorAll('[data-n]').forEach(x=>x.classList.toggle('sel',x===b));draw()});
  $('ppGo').onclick=()=>{PASS=cur.map((n,i)=>isBadNick(n)?`Player ${i+1}`:n.trim().slice(0,16)||`Player ${i+1}`);sfx.tap();playGame(id,{go:true,how:true})}}

/* ---------- online room (Firebase rooms on the class website, or the Claude room capability; presence only) ---------- */
let ROOMNS,ONLINE={my:{level:null,topic:null},code:null,room:null,host:false,nick:'',peers:[],lastStart:null,unsub:null,salt:0,seen:{},deadline:null,timeUp:false,gid:null,tick:null};
const OL_GRACE=60; /* seconds everyone else gets once the first player finishes */
const roomReady=(async()=>{try{if(window.claude&&window.claude.use){ROOMNS=await window.claude.use('room');if(ROOMNS)return ROOMNS}}catch(e){ROOMNS=null}
  if(!window.ARCROOM)await new Promise(r=>{addEventListener('arcb-ready',r,{once:true});setTimeout(r,8000)});ROOMNS=window.ARCROOM||null;return ROOMNS})();
try{ONLINE.nick=localStorage.getItem('arcNick')||''}catch(e){}
/* The host is whoever joined the room first and is still in it (the server stamps "joined", so nobody can fake it).
   If the host leaves, the next player in line becomes host automatically. */
const hostPeer=()=>{const ps=ONLINE.peers.filter(p=>p.presence&&p.presence.nick);if(!ps.length)return null;
  if(ps.every(p=>p.joined==null))return ps.find(p=>p.presence.host)||null; /* Claude room capability has no join time */
  return ps.reduce((a,b)=>(b.joined<a.joined||(b.joined===a.joined&&b.id<a.id))?b:a)};
/* games that can be played in an online room: every normal game, plus party games that have an online version */
const olCan=id=>!!(GAMES[id]&&!GAMES[id].ownStart&&(!GAMES[id].custom||GAMES[id].online));
/* host's level: whatever the host picked for themselves (also the starting suggestion for everyone) */
const olValid=p=>!!(p&&olCan(p.game)&&p.level==='mixed'&&Number.isFinite(+p.seed));
const olThisGame=p=>p.presence&&ONLINE.lastStart&&p.presence.startAt===ONLINE.lastStart;
function onlineRows(){const here=new Set(ONLINE.peers.map(p=>p.id));
  const hp=hostPeer();const rows=ONLINE.peers.filter(p=>p.presence&&p.presence.nick).map(p=>{const done=p.presence.status==='done'&&(!ONLINE.lastStart||olThisGame(p)||p.sameTab);
    const lvTag='';
    return {n:(hp&&p.id===hp.id?'★ ':'')+safeNick(p.presence.nick)+lvTag+(p.sameTab?' (you)':''),s:+p.presence.score||0,me:p.sameTab,done,left:false,
      sub:done?' done':p.presence.status==='playing'?(ONLINE.timeUp&&!p.sameTab?' · out of time':` · round ${p.presence.round||1}`):' · in lobby'}});
  Object.entries(ONLINE.seen).forEach(([id,pr])=>{if(!here.has(id)&&pr.nick)rows.push({n:safeNick(pr.nick),s:+pr.score||0,me:false,done:false,left:true,sub:' · left the room'})});
  return rows.sort((a,b)=>b.s-a.s)}
function onlineReport(done){const c=ctx;if(!ONLINE.room||!c)return;ONLINE.room.presence({score:c.score,round:Math.min(c.r+1,c.G.rounds),status:done?'done':'playing'}).catch(()=>{})}
function onPeersChange(ch){ONLINE.peers=ch.peers.filter(p=>p.sameTab||!p.presence||p.presence.status!=='away');if(ONLINE.code&&!(onPeersChange.t>Date.now()-10000)){onPeersChange.t=Date.now();olSave({gid:ONLINE.gid})}
  if(ctx&&ctx.mode==='online'&&ONLINE.lastStart){ch.peers.forEach(p=>{if(!p.sameTab&&olThisGame(p))ONLINE.seen[p.id]={nick:p.presence.nick,score:p.presence.score,team:p.presence.team}});
    if(!ONLINE.deadline&&!(GAMES[ONLINE.gid]||{}).custom&&ch.peers.some(p=>olThisGame(p)&&p.presence.status==='done'))olStartClock()}
  if(ONLINE.hook)try{ONLINE.hook()}catch(e){console.warn(e)}
  if(ctx&&ctx.mode==='online')renderScore();
  if($('olLobby'))drawLobby();if(ctx&&ctx.finished&&$('olEnd'))onlineEnd();
  /* guests waiting in the room follow the host when the host picks a different game */
  {const h=hostPeer();if($('olLobby')&&h&&!h.sameTab&&h.presence.status!=='playing'&&h.presence.game&&h.presence.game!==ctx.id&&olCan(h.presence.game)&&!ONLINE.pending){const id=h.presence.game;ONLINE.gid=id;ONLINE.pending=()=>playGame(id,{setup:true,level:'mixed'});location.hash=id;return}}
  {const h=hostPeer(),wasHost=ONLINE.host;ONLINE.host=!!(h&&h.sameTab);
    /* the host themselves came back after a refresh: carry on with the game they were running */
    if(h&&h.sameTab&&ONLINE.firstSnap){ONLINE.firstSnap=false;const st=h.presence.status==='playing'&&h.presence.startAt;
      if(st&&ONLINE.resumeAt===h.presence.startAt&&olValid(h.presence)){ONLINE.resuming=true;ONLINE.cfg={topic:h.presence.topic||null,teams:+h.presence.teams||2};startOnline(h.presence)}else if(ONLINE.resumeAt){ONLINE.resumeAt=null;olBackToRoom(h)}}
    if(h&&!h.sameTab){const st=h.presence.status==='playing'&&h.presence.startAt;
      /* a game that was already running when we joined: wait for the next one instead of starting late */
      if(ONLINE.firstSnap){ONLINE.firstSnap=false;if(st&&ONLINE.resumeAt===h.presence.startAt&&olValid(h.presence)){ONLINE.resuming=true;startOnline(h.presence)}else if(st){ONLINE.lastStart=h.presence.startAt;ONLINE.lateWait=true}else if(ONLINE.resumeAt){ONLINE.resumeAt=null;olBackToRoom(h)}}
      else if(st&&h.presence.startAt!==ONLINE.lastStart&&olValid(h.presence)){ONLINE.lateWait=false;startOnline(h.presence)}}
    if(wasHost!==ONLINE.host){if($('olLobby'))drawLobby();if(ctx&&ctx.finished&&$('olEnd'))onlineEnd()}}}
/* when the first player finishes, everyone still playing gets OL_GRACE seconds, then the game ends for all */
function olStartClock(){ONLINE.deadline=Date.now()+OL_GRACE*1000;clearInterval(ONLINE.tick);
  const step=()=>{const left=Math.max(0,Math.ceil((ONLINE.deadline-Date.now())/1000));
    if(!ctx||ctx.mode!=='online'){clearInterval(ONLINE.tick);return}
    if(!ctx.finished){let b=$('olClock');if(!b&&$('gVs')){$('gVs').insertAdjacentHTML('afterend','<div id="olClock" class="olclock" role="status"></div>');b=$('olClock')}
      if(b)b.innerHTML=`⏱ Someone has finished! You have <b>${left}s</b> left. Answer as many as you can!`}
    else if($('olWait'))$('olWait').textContent=left?`Others have ${left}s left to finish.`:'';
    if(!left){clearInterval(ONLINE.tick);ONLINE.timeUp=true;if($('olClock'))$('olClock').remove();
      if(!ctx.finished){ctx.timers.forEach(clearTimeout);sfx.no&&sfx.no();finish()}else onlineEnd()}};
  step();ONLINE.tick=setInterval(step,500)}
function olResetGame(startAt){ONLINE.lastStart=startAt;ONLINE.seen={};ONLINE.peers.forEach(p=>{if(!p.sameTab&&p.presence&&p.presence.nick)ONLINE.seen[p.id]={nick:p.presence.nick,score:0}});ONLINE.deadline=null;ONLINE.timeUp=false;clearInterval(ONLINE.tick);if($('olClock'))$('olClock').remove()}
/* each player gets the same kinds of questions at the same level, but different numbers, so copying a neighbour's screen doesn't help */
const olSeed=seed=>(seed^ONLINE.salt)>>>0;
async function onlineLeave(){clearInterval(ONLINE.tick);olForget();try{sessionStorage.removeItem('arcTabRoom')}catch(e){}const r=ONLINE.room;if(ONLINE.unsub)ONLINE.unsub();Object.assign(ONLINE,{code:null,room:null,host:false,peers:[],unsub:null,seen:{},deadline:null,timeUp:false,gid:null,lastStart:null});try{if(r)await r.leave()}catch(e){}}
/* This device remembers the room it is in (so an accidental refresh, Back or closed tab can rejoin as the same player).
   Leaving on purpose (Leave room / All games) forgets it. */
const OLKEY='arcRoom',OLRES='arcResume';
const olSaved=()=>{try{const s=JSON.parse(localStorage.getItem(OLKEY)||'null');return s&&!s.left&&Date.now()-s.at<20*60000?s:null}catch(e){return null}};
/* the seat is kept per tab (sessionStorage, survives a refresh) and as "last room on this device" (localStorage, for reopening a closed tab) */
const olTabSeat=()=>{try{const s=JSON.parse(sessionStorage.getItem(OLKEY)||'null');return s&&Date.now()-s.at<20*60000?s:null}catch(e){return null}};
const olSave=x=>{try{const v=JSON.stringify({...(olTabSeat()||olSaved()||{}),...x,at:Date.now()});sessionStorage.setItem(OLKEY,v);localStorage.setItem(OLKEY,v)}catch(e){}};
const olForget=()=>{try{localStorage.removeItem(OLKEY);localStorage.removeItem(OLRES);sessionStorage.removeItem(OLKEY);sessionStorage.removeItem(OLRES)}catch(e){}};
/* game progress for resuming after a refresh: {code,startAt,game,data} */
function olResSave(data){if(!ONLINE.code||!ONLINE.lastStart)return;try{const v=JSON.stringify({code:ONLINE.code,startAt:ONLINE.lastStart,game:ONLINE.gid,data,at:Date.now()});sessionStorage.setItem(OLRES,v);localStorage.setItem(OLRES,v)}catch(e){}}
function olResGet(cur){try{const r=JSON.parse(sessionStorage.getItem(OLRES)||localStorage.getItem(OLRES)||'null');return r&&r.code===ONLINE.code&&r.startAt===cur.startAt&&r.game===cur.game?r.data:null}catch(e){return null}}
async function joinCode(code,asHost,reuse){const R=await roomReady;if(!R)return 'unavailable';
  try{if(ONLINE.room)await ONLINE.room.leave();ONLINE.salt=reuse&&Number.isFinite(reuse.salt)?reuse.salt:Math.floor(Math.random()*4294967296);ONLINE.firstSnap=true;ONLINE.lateWait=false;ONLINE.resumeAt=reuse&&reuse.startAt||null;setTimeout(()=>{ONLINE.firstSnap=false},4000);
    const room=await R.join('arc-'+code,reuse&&reuse.sfx);ONLINE.room=room;ONLINE.code=code;ONLINE.host=asHost;ONLINE.lastStart=null;
    olSave({code,sfx:room.sfx||null,nick:ONLINE.nick,salt:ONLINE.salt,left:false});try{sessionStorage.setItem('arcTabRoom',code)}catch(e){}
    if(ONLINE.unsub)ONLINE.unsub();ONLINE.unsub=room.onPeers(onPeersChange,()=>{});
    if(room.rejoined){await room.presence({nick:ONLINE.nick,code,status:ONLINE.resumeAt?'playing':'lobby'});return 'ok'} /* keep score, team and place */
    if(asHost)olCfgDefaults(ctx.id);ctx.level='mixed';
    await room.presence({nick:ONLINE.nick,code,host:asHost,status:'lobby',score:0,round:0,game:asHost?ctx.id:null,level:asHost?'mixed':null,startAt:null,seed:null,...(asHost?{topic:ONLINE.cfg.topic,teams:ONLINE.cfg.teams}:{})});return 'ok'}
  catch(e){return e&&e.code==='not_permitted'?'unavailable':'error'}}
function startOnline(p){if(!olValid(p))return;MODE='online';olResetGame(p.startAt);olSave({startAt:p.startAt});ONLINE.gid=p.game;ONLINE.cur={game:p.game,level:p.level,seed:+p.seed,startAt:p.startAt,topic:p.topic||null,teams:+p.teams||2};
  const go=()=>{ONLINE.room.presence(ONLINE.resuming?{status:'playing'}:{status:'playing',score:0,round:GAMES[p.game].custom?0:1,startAt:p.startAt}).catch(()=>{});playGame(p.game,{go:true,seedBase:olSeed(p.seed),level:'mixed'})};
  if(location.hash!=='#'+p.game){ONLINE.pending=go;location.hash=p.game}else go()}
function onlinePanel(id){
  $('gStage').innerHTML=`<div class="end" id="olBox"><span class="tag">Online room</span><h3>Play with friends on their own devices</h3><p style="margin:0;color:var(--muted)" id="olNote">Checking whether online play works here…</p></div>`;
  roomReady.then(R=>{if(!$('olBox'))return;
    if(!R){$('olNote').textContent='Online rooms need an internet connection to the class website. Try vs Robot or Pass & play instead.';return}
    if(ONLINE.code){drawLobby();return}
    $('olBox').insertAdjacentHTML('beforeend',`<label class="row"><b>Your nickname</b><input class="num" style="width:12em" id="olNick" maxlength="16" value="${esc(ONLINE.nick||(arcMe()||{}).nick||"")}"></label>
      <div class="row"><button class="btn primary" id="olNew">Create a room</button><span style="color:var(--muted)">or</span><input class="num" style="width:7em;text-transform:uppercase" id="olCode" maxlength="4" placeholder="CODE" aria-label="Room code"><button class="btn" id="olJoin">Join</button></div><div id="olErr" style="font-weight:700;color:var(--bad)"></div>`);
    $('olNote').textContent='One person creates a room and shares the 4-letter code. Everyone gets the same questions at the same time, with a live leaderboard.';
    if(ONLINE.autoCode){const c=ONLINE.autoCode;ONLINE.autoCode=null;$('olCode').value=c.toUpperCase();$('olNew').hidden=true;$('olNew').nextElementSibling.hidden=true;
      $('olNote').innerHTML=`You've been invited to room <b class="code">${esc(c.toUpperCase())}</b>! Type your nickname and tap <b>Join</b>.`;$('olJoin').classList.add('primary');$('olJoin').textContent='Join the room ▶';
      if(!$('olNick').value)$('olNick').focus()}
    const nick=()=>{const n=$('olNick').value.trim().replace(/\s+/g,' ').slice(0,16);if(n.length<2){$('olErr').textContent='Type a nickname with at least 2 letters.';return null}if(isBadNick(n)){$('olErr').textContent='Please choose a kinder nickname.';return null}ONLINE.nick=n;try{localStorage.setItem('arcNick',n)}catch(e){}return n};
    $('olNew').onclick=async()=>{if(!nick())return;$('olNew').disabled=true;const mk=()=>Array.from({length:4},()=>'abcdefghjkmnpqrstuvwxyz23456789'[Math.floor(Math.random()*31)]).join('');
      let code=mk();try{if(R.isFree)for(let i=0;i<5&&!(await R.isFree('arc-'+code));i++)code=mk()}catch(e){}$('olNew').disabled=false;
      const r=await joinCode(code,true);if(r!=='ok'){$('olErr').textContent=r==='unavailable'?'Online rooms are not available for you here.':'Could not open a room. Try again.';return}drawLobby()};
    $('olJoin').onclick=async()=>{if(!nick())return;const code=$('olCode').value.trim().toLowerCase();if(!/^[a-z0-9]{4}$/.test(code)){$('olErr').textContent='Room codes have 4 letters or numbers.';return}
      const r=await joinCode(code,false);if(r!=='ok'){$('olErr').textContent='Could not join that room. Check the code.';return}drawLobby()}})}
const olLink=()=>location.origin+location.pathname+'#join/'+ONLINE.code+'/'+ctx.id;
function olShareBox(){let qr='';try{qr=qrSvg(olLink())}catch(e){}
  return `<div class="olshare">${qr?`<button class="qrbox" id="olBig" title="Show a big QR code for the class to scan">${qr}<small>🔍 Tap to enlarge</small></button>`:''}<div class="olsharetxt"><b>Invite classmates</b><span>Scan the QR code, or open this link:</span>
    <input class="num ollink" id="olLink" readonly value="${esc(olLink())}" aria-label="Room link"><div class="row"><button class="btn sm" id="olCopy">📋 Copy link</button>${navigator.share?'<button class="btn sm" id="olShare">📤 Share</button>':''}<span id="olCopied" class="olcopied" role="status"></span></div></div></div>`}
function wireShare(){const link=olLink();
  if($('olLink'))$('olLink').onclick=()=>$('olLink').select();
  if($('olCopy'))$('olCopy').onclick=async()=>{try{await navigator.clipboard.writeText(link)}catch(e){$('olLink').select();try{document.execCommand('copy')}catch(e2){}}sfx.tap();$('olCopied').textContent='Copied! Paste it in your class chat.'};
  if($('olShare'))$('olShare').onclick=()=>navigator.share({title:'Maths Arcade room '+ONLINE.code.toUpperCase(),text:`Join my Maths Arcade room (${ctx.G.title}). Code: ${ONLINE.code.toUpperCase()}`,url:link}).catch(()=>{});
  if($('olBig'))$('olBig').onclick=()=>{const o=document.createElement('div');o.className='zoomov lbmodal';
    o.innerHTML=`<div class="end olbig"><span class="tag">Scan to join</span><h3>Room ${ONLINE.code.toUpperCase()} · ${esc(ctx.G.title)}</h3>${qrSvg(link)}<p class="ollinkbig">${esc(link.replace(/^https?:\/\//,''))}</p><button class="btn primary" id="olBigX">Close</button></div>`;
    document.body.appendChild(o);sfx.pop();const x=()=>o.remove();$('olBigX').onclick=x;o.addEventListener('click',e=>{if(e.target===o)x()})}}
function drawLobby(){const box=$('olBox');if(!box)return;ONLINE.gid=ctx.id;const h=hostPeer(),list=onlineRows(),hg=h&&h.presence.game&&GAMES[h.presence.game];
  box.innerHTML=`<span class="tag">Online room</span><h3>Room code: <span class="code">${ONLINE.code.toUpperCase()}</span></h3>
    ${ONLINE.lateWait&&!ONLINE.host?'<p class="olclock" style="margin:0">⏳ A game is already running in this room. You will join the next one when the host starts it.</p>':''}
    <p style="margin:0;color:var(--muted)">${ONLINE.host?`You are the host. Invite classmates with the QR code or link below, or tell them the code. When everyone is in, press Start.`:hg?`Host is setting up <b>${esc(hg.title)}</b>. The game starts when the host presses Start.`:'Waiting for the host…'}</p>
    <p class="olfair">${ctx.id==='party-bingo'?'🎱 Everyone gets a <b>different bingo card</b>, so peeking at a friend\'s card won\'t help!':ctx.id==='party-wall'?'🧱 Everyone gets the <b>same bricks</b>. The fastest, most accurate builder wins!':'🔢 Everyone gets <b>different numbers</b>, so peeking at a friend\'s screen won\'t help!'}</p>
    ${olSettingsBox(h)}
    <div id="olLobby">${olTeamBox()||`<ol class="board">${list.map(x=>`<li><b>${esc(x.n)}</b><span>${x.sub}</span></li>`).join('')||'<li>Connecting…</li>'}</ol>`}</div>
    ${olShareBox()}
    <div class="row">${ONLINE.host?`<button class="btn primary" id="olStart">Start ${esc(ctx.G.title)} for everyone</button>`:''}<button class="btn" id="olLeave">Leave room</button></div>`;
  if($('olStart'))$('olStart').onclick=olHostStart;wireSettings();wireTeams();
  wireShare();
  $('olLeave').onclick=async()=>{await onlineLeave();onlinePanel(ctx.id)}}
function onlineEnd(){const list=onlineRows(),all=ONLINE.timeUp||list.every(x=>x.done||x.left);
  if(!$('olEnd')){$('gStage').innerHTML=`<div class="end" id="olEnd"></div>`;sfx.win();confetti(120,true)}
  $('olEnd').innerHTML=`<span class="tag">${all?'Final leaderboard':'Waiting for others to finish…'}</span><h3>${all&&list[0]?esc(list[0].n.replace(/^★ /,'').replace(' (you)',''))+' wins!':ONLINE.timeUp?'Time\'s up!':'You finished!'}</h3>${all?'':'<p id="olWait" class="olwait"></p>'}
    <ol class="board">${list.map(x=>`<li class="${x.me?'me':''}${x.left?' olleft':''}"><b>${esc(x.n)}</b><span>${x.s}${x.done?'':x.sub}</span></li>`).join('')}</ol>
    <div class="row">${ONLINE.host?'<button class="btn primary" id="olAgain">Rematch for everyone</button>':'<span style="color:var(--muted)">The host can start a rematch.</span>'}<a class="btn" href="#" style="text-decoration:none;display:inline-flex;align-items:center">Choose another game</a></div>`;
  if($('olAgain'))$('olAgain').onclick=()=>{ctx.finished=false;olHostStart()};
  olEndExtras()}
