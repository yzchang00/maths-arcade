/* ================= P5 NUMBER GAMES ================= */

/* P5-1. Vault Cracker — Whole numbers up to 10 million */
const ONES=['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function w3(n){const h=Math.floor(n/100),r=n%100;let s=h?ONES[h]+' hundred':'';if(r)s+=(h?' and ':'')+(r<20?ONES[r]:TENS[Math.floor(r/10)]+(r%10?'-'+ONES[r%10]:''));return s}
function words(n){const m=Math.floor(n/1e6),t=Math.floor(n/1000)%1000,u=n%1000,p=[];if(m)p.push(w3(m)+' million');if(t)p.push(w3(t)+' thousand');let s=p.join(', ');if(u)s+=(s?(u<100?' and ':', '):'')+w3(u);return s}
const genBig=(hard=true)=>{let s=String(R(1,9));for(let i=0;i<(hard?6:5);i++)s+=Math.random()<(hard?.4:.2)?'0':String(R(0,9));return +s};
const PVN=['millions','hundred thousands','ten thousands','thousands','hundreds','tens','ones'],PVS=['M','HTh','TTh','Th','H','T','O'];
/* Vault Cracker: a maze of vaults. Solo = level-up mode; Race = 2 players (same device) or vs Robot, taking turns. */
const VT={50:{c:'#d39a5c',label:'Bronze'},100:{c:'#c3ccd8',label:'Silver'},150:{c:'#ffc94a',label:'Gold'}};
const tint=c=>QUBI.replace(/#ff8a3d/g,c);
function genMaze(W,H){const g=Array.from({length:H},()=>Array(W).fill(1)),st=[[1,1]];g[1][1]=0;
  while(st.length){const [x,y]=st[st.length-1],nb=shuffle([[2,0],[-2,0],[0,2],[0,-2]]).filter(([a,b])=>x+a>0&&x+a<W-1&&y+b>0&&y+b<H-1&&g[y+b][x+a]===1);
    if(!nb.length){st.pop();continue}const [a,b]=nb[0];g[y+b/2][x+a/2]=0;g[y+b][x+a]=0;st.push([x+a,y+b])}
  for(let k=0;k<Math.floor(W*H/12);k++){const x=R(1,W-2),y=R(1,H-2);if(g[y][x]===1&&((g[y][x-1]===0&&g[y][x+1]===0)||(g[y-1][x]===0&&g[y+1][x]===0)))g[y][x]=0}return g}
function bfs(g,sx,sy){const H=g.length,W=g[0].length,d=Array.from({length:H},()=>Array(W).fill(-1)),pr={},q=[[sx,sy]];d[sy][sx]=0;
  while(q.length){const [x,y]=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const nx=x+a,ny=y+b;if(g[ny]&&g[ny][nx]===0&&d[ny][nx]<0){d[ny][nx]=d[y][x]+1;pr[nx+','+ny]=[x,y];q.push([nx,ny])}})}return {d,pr}}
function vaultQ(val){const hard=val>=100,N=genBig(val===150||hard&&Math.random()<.5),kind=val===150?pick(['dial','card']):val===100?pick(['dial','card']):'dial';
  const vs=new Set([N]),ds=String(N).padStart(7,'0').split('').map(Number);for(let g=0;vs.size<4&&g<200;g++){const a=[...ds],i=R(1,5);if(Math.random()<.5){if(a[i]===a[i+1])continue;[a[i],a[i+1]]=[a[i+1],a[i]]}else a[i]=(a[i]+R(1,9))%10;vs.add(+a.join(''))}
  return {N,kind,cards:shuffle([...vs])}}
const vWork=N=>{const ds=String(N).padStart(7,'0').split('').map(Number);return [`<table class="pvt"><tr>${PVS.map(x=>`<th>${x}</th>`).join('')}</tr><tr>${ds.map(d=>`<td>${d}</td>`).join('')}</tr></table>`,`${fmt(N)} = ${ds.map((d,i)=>d?fmt(d*10**(6-i)):null).filter(Boolean).join(' + ')}`,`In words: <b>${words(N)}</b>`]};
let VG=null;
const vIcon=(val,state='shut')=>`<svg viewBox="0 0 34 34" class="vicon" aria-hidden="true"><rect x="3" y="3" width="28" height="28" rx="5" fill="${state==='jam'?'#8a8f99':'#7d8aa0'}" stroke="#16233a" stroke-width="2"/>${state==='open'?'<rect x="7" y="7" width="20" height="20" rx="3" fill="#2a3242"/>':`<circle cx="17" cy="18" r="9" fill="${state==='jam'?'#b9bdc6':VT[val].c}" stroke="#16233a" stroke-width="1.5"/><text x="17" y="22" text-anchor="middle" style="font:800 ${val>99&&state!=='jam'?9:11}px var(--body);fill:#16233a">${state==='jam'?'✕':val}</text>`}</svg>`;
function vaultRules(mode){const race=mode!=='solo',who=mode==='bot'?'You and Robo':'The two players';
  return `<div class="vrules"><div class="vlegend"><span class="tag">What the vaults mean</span>
      <div class="vlg">${vIcon(50)}<div><b>Bronze vault: 50 gold</b><small>The number on a vault is the gold inside. Bronze vaults have 6-digit numbers.</small></div></div>
      <div class="vlg">${vIcon(100)}<div><b>Silver vault: 100 gold</b><small>7-digit numbers in the millions.</small></div></div>
      <div class="vlg">${vIcon(150)}<div><b>Gold vault: 150 gold</b><small>7-digit numbers with tricky zeros, like 4,030,206.</small></div></div>
      <div class="vlg">${vIcon(50,'open')}<div><b>Opened</b><small>Already cracked. The gold has been taken.</small></div></div>
      <div class="vlg">${vIcon(50,'jam')}<div><b>Jammed</b><small>Two wrong answers jam a vault for good. Nobody can open it.</small></div></div></div>
    <div class="vsteps"><span class="tag">How to play</span><ol>
      <li><b>Move</b> with the arrow keys or W A S D. On a tablet, use the ▲ ◀ ▶ ▼ buttons under the maze.</li>
      ${race?`<li><b>Take turns.</b> ${who} take turns. Each turn you can walk up to <b>8 steps</b> (shown as <span class="pipdemo">●●●●●●●●</span> at the top). Your turn ends when the steps run out, when you try a vault, or when you press <b>End my turn</b>.</li>`:''}
      <li><b>Walk into a vault</b> to try to crack it: turn the dials to the number in words, or pick the keycard with the right words.</li>
      <li><b>Two tries per vault.</b> Right answer: the gold is yours. Wrong twice: the vault jams.</li>
      ${race?`<li><b>Fair start:</b> a coin toss decides who goes first. Each player has their own bronze, silver and gold vault, the same number of steps away. Two more vaults sit exactly halfway: race for those!</li><li><b>Goal:</b> reach <b>400 gold</b>. If the player who went first gets there, the other player gets <b>one last turn</b> so you both have the same number of turns. Most gold wins. If every vault is opened or jammed first, whoever has more gold wins.</li><li><b>Tip:</b> a nearby bronze vault is quick, but a gold vault further away is worth three times as much!</li>`
        :`<li><b>Goal:</b> each level has a gold target shown at the top. Reach it to go to the next level. You keep all your gold, but the next target is higher and the vaults get harder. Clear all <b>10 levels</b> to crack the bank and win!</li><li><b>Game over</b> when too many vaults are jammed and there isn\u2019t enough gold left to reach the target. There is no time limit, so take care with each number!</li>`}
    </ol></div></div>`}
function vaultGame(stage,mode){
  const W=15,H=11,T=34,race=mode!=='solo';
  const S={mode,level:1,gold0:0,players:[],turn:0,steps:0,busy:false,map:null,vaults:[],target:0,over:false};VG=S;
  const P=(name,col,bot)=>({name,col,bot,gold:0,x:1,y:1});
  if(mode==='solo')S.players=[P('You','#ff8a3d')];
  else S.players=[P(PASS&&PASS[0]?PASS[0]:'Player 1','#ff8a3d'),mode==='bot'?P('Robo','#9aa6b8',true):P(PASS&&PASS[1]?PASS[1]:'Player 2','#5fa8ff')];
  const RACE_GOAL=400,STEPS=8,MAXL=10;
  function newMap(){const g=genMaze(W,H);S.map=g;const starts=race?[[1,1],[W-2,H-2]]:[[1,1]];S.players.forEach((p,i)=>{[p.x,p.y]=starts[i]});
    const D=starts.map(([x,y])=>bfs(g,x,y).d),cells=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]===0&&D.every(d=>d[y][x]>=4))cells.push([x,y]);
    const deadEnd=([x,y])=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>g[y+b][x+a]===0).length===1;
    if(race){S.vaults=[];const [dA,dB]=D,far=c=>S.vaults.every(v=>Math.abs(v.x-c[0])+Math.abs(v.y-c[1])>=3),add=(c,val)=>S.vaults.push({x:c[0],y:c[1],val,state:'shut',q:vaultQ(val),tries:0});
      const own=(da,db)=>cells.filter(([x,y])=>db[y][x]>=da[y][x]+3);let ok=true;
      /* fair race: each player gets a 50, 100 and 150 vault at exactly the same walking distance, plus 2 contested vaults halfway between them */
      for(const val of [150,100,50]){let done=false;for(const a of shuffle(own(dA,dB))){if(!far(a))continue;const k=dA[a[1]][a[0]],b=shuffle(own(dB,dA)).find(c=>dB[c[1]][c[0]]===k&&far(c)&&Math.abs(c[0]-a[0])+Math.abs(c[1]-a[1])>=3);if(b){add(a,val);add(b,val);done=true;break}}if(!done){ok=false;break}}
      if(ok)for(const val of [150,100]){const m=shuffle(cells.filter(([x,y])=>dA[y][x]===dB[y][x]&&far([x,y])));if(!m.length){ok=false;break}add(m[0],val)}
      S.fairTries=(S.fairTries||0)+1;if(!ok&&S.fairTries<60)return newMap();S.fairTries=0;if(ok)return}
    const n=race?8:Math.min(9,4+S.level),pool=shuffle(cells.filter(deadEnd)).concat(shuffle(cells.filter(c=>!deadEnd(c))));S.vaults=[];
    const mix=race?[50,50,100,100,100,150,150,150]:Array.from({length:n},(_,i)=>pick(S.level<2?[50,50,100]:S.level<4?[50,100,100,150]:S.level<7?[100,150,150]:[100,150,150,150]));
    for(const [x,y] of pool){if(S.vaults.length>=n)break;if(S.vaults.some(v=>Math.abs(v.x-x)+Math.abs(v.y-y)<3))continue;const val=mix[S.vaults.length];S.vaults.push({x,y,val,state:'shut',q:vaultQ(val),tries:0})}
    if(!race){const total=S.vaults.reduce((a,v)=>a+v.val,0),f=Math.min(.9,.45+.045*S.level);S.gold0=S.players[0].gold;S.target=S.gold0+Math.ceil(total*f/10)*10}}
  stage.innerHTML=`<div class="vmhud" id="vmHud"></div><div class="vmwrap"><svg id="vmMap" viewBox="0 0 ${W*T} ${H*T}" class="vmmap" role="img" aria-label="Maze of vaults"></svg><div class="vmover" id="vmOver" hidden></div></div>
    <div class="vmctl"><div class="dpad"><button class="btn" data-d="0,-1" aria-label="Up">▲</button><button class="btn" data-d="-1,0" aria-label="Left">◀</button><button class="btn" data-d="1,0" aria-label="Right">▶</button><button class="btn" data-d="0,1" aria-label="Down">▼</button></div>
    <div style="display:grid;gap:6px"><span class="tag">Arrow keys or WASD to move</span><div class="row">${race?'<button class="btn" id="vmEnd">End my turn</button>':''}<button class="btn" id="vmHelp">? How to play</button></div></div>
    <div class="vkey">${[50,100,150].map(v=>`<span>${vIcon(v)} ${v} gold</span>`).join('')}<span>${vIcon(50,'jam')} jammed</span></div></div><div id="vmPanel"></div>`;
  const hud=()=>{const cur=S.players[S.turn];
    if(race)$('vmHud').innerHTML=S.players.map((p,i)=>`<div class="vmp ${i===S.turn&&!S.over?'on':''}" style="--pc:${p.col}"><b>${esc(p.name)}</b><span>${p.gold} / ${RACE_GOAL} gold</span><i style="width:${Math.min(100,p.gold/RACE_GOAL*100)}%"></i></div>`).join('')+(S.over?'':`<div class="vmturn now" style="--pc:${cur.col}">▶ ${esc(cur.name)}'s turn<span class="pips" aria-label="${S.steps} of ${STEPS} steps left">${Array.from({length:STEPS},(_,i)=>`<i class="${i<S.steps?'on':''}"></i>`).join('')}</span><small>${S.steps} step${S.steps===1?'':'s'} left</small></div>`);
    else{const left=S.vaults.filter(v=>v.state==='shut').reduce((a,v)=>a+v.val,0),p=S.players[0];
      $('vmHud').innerHTML=`<div class="vmp on" style="--pc:${p.col}"><b>Level ${S.level} of ${MAXL}</b><span>${p.gold} / ${S.target} gold</span><i style="width:${Math.min(100,(p.gold-S.gold0)/(S.target-S.gold0)*100)}%"></i></div><div class="vmturn">Gold still in shut vaults: ${left}</div>`}};
  const draw=()=>{const g=S.map;let s=`<rect width="${W*T}" height="${H*T}" fill="#e9e2d0"/>`;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y][x])s+=`<rect x="${x*T}" y="${y*T}" width="${T}" height="${T}" fill="#3a3f52"/><rect x="${x*T}" y="${y*T}" width="${T}" height="${T/4}" fill="#4a5068"/>`;
    S.vaults.forEach((v,i)=>{const cx=v.x*T,cy=v.y*T,vt=VT[v.val];
      s+=`<g class="vmv ${v.state}" id="vmv${i}"><rect x="${cx+3}" y="${cy+3}" width="${T-6}" height="${T-6}" rx="5" fill="${v.state==='jam'?'#8a8f99':'#7d8aa0'}" stroke="#16233a" stroke-width="2"/>
        ${v.state==='open'?`<rect x="${cx+7}" y="${cy+7}" width="${T-14}" height="${T-14}" rx="3" fill="#2a3242"/>`:`<circle cx="${cx+T/2}" cy="${cy+T/2+1}" r="${T/2-8}" fill="${vt.c}" stroke="#16233a" stroke-width="1.5"/><text x="${cx+T/2}" y="${cy+T/2+5}" text-anchor="middle" style="font:800 ${v.val>99?9:11}px var(--body);fill:#16233a">${v.state==='jam'?'✕':v.val}</text>`}</g>`});
    S.players.forEach((p,i)=>{if(race&&i===S.turn&&!S.over)s+=`<circle class="vmring" cx="${p.x*T+T/2}" cy="${p.y*T+T/2}" r="${T*.75}" fill="none" stroke="${p.col}" stroke-width="3"/><text x="${p.x*T+T/2}" y="${p.y*T-14}" text-anchor="middle" style="font:900 11px var(--body);fill:${p.col};paint-order:stroke;stroke:#fff;stroke-width:3px">▼ ${esc(p.name)}</text>`;s+=`<svg class="vmtok qubi idle ${race&&i!==S.turn&&!S.over?'dim':''}" x="${p.x*T-4+(race?i*6-3:0)}" y="${p.y*T-12}" width="${T+8}" height="${T+14}" viewBox="0 -18 120 168">${tint(p.col).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>`});
    $('vmMap').innerHTML=s;if(race){const cp=S.players[S.turn];$('vmMap').style.borderColor=S.over?'':cp.col;$('vmMap').style.boxShadow=S.over?'':`0 0 0 4px ${cp.col}`}hud()};
  const vaultAt=(x,y)=>S.vaults.findIndex(v=>v.x===x&&v.y===y&&v.state==='shut');
  function move(dx,dy){if(S.over||S.busy)return;const p=S.players[S.turn];if(p.bot)return;if(race&&S.steps<=0)return;const nx=p.x+dx,ny=p.y+dy;
    if(!S.map[ny]||S.map[ny][nx]!==0){tone(120,0,.06,{type:'square',vol:.05});return}p.x=nx;p.y=ny;tone(500+(nx+ny)%5*40,0,.04,{type:'triangle',vol:.05});if(race)S.steps--;draw();
    const vi=vaultAt(nx,ny);if(vi>=0)return openVault(vi);if(race&&S.steps<=0)setTimeout(()=>endTurn('Out of steps!'),350)}
  function announce(first,why){const p=S.players[S.turn],o=$('vmOver'),other=S.players.find(x=>x!==p),human=!p.bot,pass=!S.players.some(x=>x.bot);S.busy=true;
    o.innerHTML=`<div class="vmturncard" style="--pc:${p.col}">${why?`<p class="vmwhy">${why}</p>`:''}<div class="vmtc-tok">${tint(p.col)}</div>${first?`<p class="vmcoin">🪙 Coin toss: <b>${esc(p.name)}</b> goes first.</p>`:''}<span class="tag">${S.finalFor===S.turn?'⏱ Last turn':first?'First turn':'Next turn'}</span>
      <h3>${p.bot?'🤖 ':''}${esc(p.name)}${p.bot?'’s':'’s'} turn!</h3><p>${p.gold} gold so far${other?` · ${esc(other.name)} has ${other.gold}`:''}${S.finalFor===S.turn?'':` · reach ${RACE_GOAL} gold to win`}</p>${S.finalFor===S.turn?`<p><b>You need more than ${other.gold-p.gold} gold this turn to win${other.gold-p.gold<=150?'':' (that is more than one vault can give, so aim for the best vault you can reach)'}.</b></p>`:''}
      <p><b>${STEPS} steps</b> this turn. Trying a vault ends your turn.</p>${human?`${pass?`<p class="vmpass">📱 Pass the device to <b>${esc(p.name)}</b></p>`:''}<button class="btn primary" id="vmGo">Start ${p.name==='You'?'my':esc(p.name)+'’s'} turn ▶</button>`:'<p class="vmpass">The robot is thinking…</p>'}</div>`;
    o.hidden=false;tone(523,0,.12,{type:'triangle',vol:.08});tone(784,.13,.18,{type:'triangle',vol:.08});qubi('gQ','wave',`${p.name}’s turn!`,true);
    const go=()=>{o.hidden=true;S.busy=false;S.tt[S.turn]++;draw();if(p.bot)setTimeout(botTurn,400)};if(human)$('vmGo').onclick=()=>{sfx.tap();go()};else setTimeout(()=>{if($('vmMap'))go()},1500)}
  function endTurn(why){if(S.over)return;if(race&&S.finalFor!==undefined&&S.turn===S.finalFor)return finishRace();$('vmPanel').innerHTML='';S.busy=false;if(!race)return;S.turn=(S.turn+1)%S.players.length;S.steps=STEPS;draw();announce(false,S.finalFor===S.turn&&S.finalWhy?S.finalWhy:typeof why==='string'?why:'')}
  function award(vi,ok){const v=S.vaults[vi],p=S.players[S.turn];
    if(ok){v.state='open';p.gold+=v.val;[0,.12,.24].forEach(t=>tone(900,t,.05,{type:'square',vol:.08}));tone(1320,.4,.5,{type:'triangle',vol:.12});confetti(50)}else{v.state='jam';sfx.no()}
    draw();if(ok){const el=$('vmv'+vi);if(el)el.classList.add('pop')}
    if(race&&p.gold>=RACE_GOAL&&S.finalFor===undefined){const oi=1-S.turn;if(S.tt[oi]<S.tt[S.turn]){S.finalFor=oi;S.finalWhy=`${p.name} reached ${RACE_GOAL} gold! ${S.players[oi].name} gets one last turn so both players have the same number of turns.`;return}return finishRace()}
    if(race&&!S.vaults.some(v=>v.state==='shut'))return finishRace();
    if(!race)return checkSolo()}
  function openVault(vi){S.busy=true;const v=S.vaults[vi],q=v.q,p=S.players[S.turn];v.tries=0;sfx.pop();
    const ask=`<div class="vmq"><div class="row" style="justify-content:space-between"><b class="vmqt">${VT[v.val].label} vault · ${v.val} gold</b><span class="pill" id="vmTry">2 tries</span></div>
      ${q.kind==='dial'?`<p class="qt" style="font-size:1.1rem">Enter the code: <b>${words(q.N)}</b></p><div class="dials" id="vD"></div><div class="row"><span class="pill" id="vN">0</span><button class="btn primary" id="vGo">🔓 Try the vault</button></div>`
        :`<p class="qt" style="font-size:1.1rem">The vault screen shows <b>${fmt(q.N)}</b>. Swipe the matching keycard.</p><div class="choices one" id="vCh"></div>`}<div id="vMsg" style="font-weight:800"></div></div>`;
    $('vmPanel').innerHTML=ask;$('vmPanel').scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'});
    const result=(ok,given)=>{v.tries++;if(ok){$('vMsg').innerHTML=`<span style="color:var(--good)">Unlocked! +${v.val} gold for ${esc(p.name)}.</span>`;lockPanel();award(vi,true);setTimeout(endIfNeeded,1200);return}
      const el=$('vmv'+vi);if(el){el.classList.remove('deny');void el.getBoundingClientRect();el.classList.add('deny')}tone(160,0,.3,{type:'sawtooth',vol:.12});
      if(v.tries<2){$('vMsg').innerHTML=`<span style="color:var(--bad)">DENIED. ${given} One more try!</span>`;$('vmTry').textContent='1 try left';return}
      lockPanel();$('vMsg').innerHTML=`<span style="color:var(--bad)">The vault jammed shut. ${given}</span><div class="work" style="margin-top:8px"><span class="tag">Working</span>${vWork(q.N).map(w=>`<div>${w}</div>`).join('')}</div><button class="btn primary" id="vmGoOn" style="margin-top:8px">Continue</button>`;
      award(vi,false);if($('vmGoOn'))$('vmGoOn').onclick=endIfNeeded};
    const lockPanel=()=>$('vmPanel').querySelectorAll('.vmq button').forEach(b=>b.disabled=true);
    if(q.kind==='dial'){const val=Array(7).fill(0);const dr=()=>{$('vD').innerHTML=val.map((d,i)=>`<div class="dial ${i===0||i===3?'grp':''}"><button class="btn" data-i="${i}" data-d="1" aria-label="${PVN[i]} up">▲</button><span class="dv">${d}</span><button class="btn" data-i="${i}" data-d="-1" aria-label="${PVN[i]} down">▼</button><small>${PVS[i]}</small></div>`).join('');
        $('vN').textContent=fmt(+val.join(''));$('vD').querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;val[i]=(val[i]+ +b.dataset.d+10)%10;tone(1400,0,.03,{type:'square',vol:.05});dr()})};dr();
      $('vGo').onclick=()=>{const g=+val.join('');result(g===q.N,`You entered ${fmt(g)}.`)}}
    else q.cards.forEach(c=>{const b=document.createElement('button');b.className='btn keycard';b.innerHTML=`<span class="kc">🔑</span>${words(c)}`;
      b.onclick=()=>{if(c===q.N){b.classList.add('ok')}else{b.classList.add('no');b.disabled=true}result(c===q.N,`That card reads ${fmt(c)}.`)};$('vCh').appendChild(b)})}
  function endIfNeeded(){if(S.over)return;if(race)endTurn();else{$('vmPanel').innerHTML='';S.busy=false}}
  function checkSolo(){const p=S.players[0],left=S.vaults.filter(v=>v.state==='shut').reduce((a,v)=>a+v.val,0);
    if(p.gold>=S.target&&S.level>=MAXL){S.over=true;S.busy=true;try{localStorage.setItem('vmBest',MAXL)}catch(e){}sfx.win&&sfx.win();
      setTimeout(()=>{overlay(`<span class="tag">All ${MAXL} levels cleared!</span><h3>You cracked the bank!</h3><p>You opened your way through every level and finished with <b>${p.gold} gold</b>. You are a Vault Cracker champion!</p><button class="btn primary" id="vmAgain">Play again</button>`,()=>{$('vmAgain').onclick=()=>vaultGame(stage,mode)},true);arcReport('p5-vault',p.gold,{mode:'solo'})},900);return}
    if(p.gold>=S.target){S.busy=true;setTimeout(()=>overlay(`<span class="tag">Level ${S.level} cleared!</span><h3>${p.gold} gold</h3><p>You kept all your gold. The next level has more vaults, tougher numbers and a higher goal.</p><button class="btn primary" id="vmNext">Go to level ${S.level+1}</button>`,()=>{$('vmNext').onclick=()=>{S.level++;$('vmOver').hidden=true;$('vmPanel').innerHTML='';S.busy=false;newMap();draw()}},true),900);return}
    if(p.gold+left<S.target){S.over=true;let best=0;try{best=+localStorage.getItem('vmBest')||0;if(S.level>best)localStorage.setItem('vmBest',S.level)}catch(e){}
      setTimeout(()=>{overlay(`<span class="tag">Game over</span><h3>You reached level ${S.level}</h3><p>Not enough gold is left in the shut vaults to reach ${S.target}. You finished with <b>${p.gold} gold</b>.${best&&best>S.level?` Your best is level ${best}.`:''}</p><button class="btn primary" id="vmAgain">Play again</button>`,()=>{$('vmAgain').onclick=()=>vaultGame(stage,mode)});arcReport('p5-vault',p.gold,{mode:'solo'})},1500)}}
  function finishRace(){S.over=true;const [a,b]=S.players,w=a.gold===b.gold?null:a.gold>b.gold?a:b;hud();
    setTimeout(()=>overlay(`<span class="tag">Race over</span><h3>${w?esc(w.name)+' wins!':'It’s a draw!'}</h3><ol class="board">${[...S.players].sort((x,y)=>y.gold-x.gold).map(p=>`<li><b>${esc(p.name)}</b><span>${p.gold} gold</span></li>`).join('')}</ol><button class="btn primary" id="vmAgain">Rematch</button>`,()=>{$('vmAgain').onclick=()=>vaultGame(stage,mode)},w&&!w.bot),1300)}
  function overlay(html,wire,party){const o=$('vmOver');o.innerHTML=`<div class="end">${html}</div>`;o.hidden=false;wire();if(party){sfx.win();confetti(160,true);qubi('gQ','party','What a haul!',true)}}
  function botTurn(){if(S.over)return;const p=S.players[S.turn];const {d,pr}=bfs(S.map,p.x,p.y);let best=null;
    S.vaults.forEach((v,i)=>{if(v.state!=='shut'||d[v.y][v.x]<0)return;const sc=v.val/(d[v.y][v.x]+4);if(!best||sc>best.sc)best={i,sc}});if(!best)return endTurn();
    const v=S.vaults[best.i],path=[];let cur=[v.x,v.y];while(cur&&!(cur[0]===p.x&&cur[1]===p.y)){path.unshift(cur);cur=pr[cur[0]+','+cur[1]]}
    let k=0;const step=()=>{if(S.over||!$('vmMap'))return;if(k>=path.length||S.steps<=0){if(p.x===v.x&&p.y===v.y)return botVault(best.i);return endTurn()}
      [p.x,p.y]=path[k++];S.steps--;tone(420,0,.04,{type:'triangle',vol:.04});draw();setTimeout(step,170)};step()}
  function botVault(vi){const v=S.vaults[vi];S.busy=true;$('vmPanel').innerHTML=`<div class="vmq"><b class="vmqt">🤖 Robo is cracking a ${VT[v.val].label.toLowerCase()} vault…</b><div id="vMsg"></div></div>`;
    const acc={50:.8,100:.7,150:.6}[v.val],ok1=Math.random()<acc,ok2=!ok1&&Math.random()<.5;
    setTimeout(()=>{if(!$('vMsg'))return;$('vMsg').innerHTML=ok1||ok2?`<b style="color:var(--good)">Robo unlocked it${ok2?' on the second try':''}! +${v.val} gold.</b>`:'<b style="color:var(--bad)">Robo jammed the vault!</b>';award(vi,ok1||ok2);setTimeout(endIfNeeded,1400)},1300)}
  stage.querySelectorAll('.dpad button').forEach(b=>b.onclick=()=>{const [a,c]=b.dataset.d.split(',').map(Number);move(a,c)});
  $('vmHelp').onclick=()=>{sfx.tap();overlay(`<span class="tag">How to play</span>${vaultRules(mode)}<button class="btn primary" id="vmBack">Back to the game</button>`,()=>{$('vmBack').onclick=()=>{$('vmOver').hidden=true}})};
  if($('vmEnd'))$('vmEnd').onclick=()=>{if(!S.busy&&!S.players[S.turn].bot)endTurn()};
  const kd=e=>{if(!$('vmMap')){removeEventListener('keydown',kd);return}if(e.target.tagName==='INPUT')return;const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0],W:[0,-1],S:[0,1],A:[-1,0],D:[1,0]}[e.key];
    if(m){e.preventDefault();move(...m)}};
  document.body.classList.add('playing');fitView();addEventListener('keydown',kd);S.steps=STEPS;newMap();if(race){S.tt=[0,0];S.turn=R(0,1)}draw();if(race)announce(true)}
addGame('p5-vault',{level:'P5',strand:'num',glyph:'7',title:'Vault Cracker',topic:'Whole numbers up to 10 million',
 how:'Explore the maze and crack vaults by reading numbers in the millions. Bronze vaults hold 50 gold, silver 100 and gold 150. Wrong twice and the vault jams for good.',rounds:1,
 modes:[['solo','Solo levels'],['bot','vs Robot'],['pass','2 players']],
 custom(stage,mode){if(mode==='pass'&&!(PASS&&PASS.length>=2))PASS=['Player 1','Player 2'];
   stage.innerHTML=`<div class="end"><span class="tag">${mode==='solo'?'Solo levels':'Race to 400 gold'}</span><h3>${mode==='solo'?'Collect enough gold to reach the next level':'First to 400 gold wins'}</h3>
     ${vaultRules(mode)}
     ${mode==='pass'?`<div class="row">${[0,1].map(i=>`<label class="row"><b>Player ${i+1}</b><input class="num" style="width:10em" maxlength="14" id="vmN${i}" value="${esc(PASS[i])}"></label>`).join('')}</div>`:''}
     <button class="btn primary" id="vmStart">Start</button></div>`;
   $('vmStart').onclick=()=>{if(mode==='pass')PASS=[0,1].map(i=>{const v=$('vmN'+i).value.trim().slice(0,14);return isBadNick(v)?`Player ${i+1}`:v||`Player ${i+1}`});sfx.tap();vaultGame(stage,mode)}}});

/* P5-2. Operation Order — Order of operations and brackets */
function exStep(t){let l=0,r=t.length-1;const lp=t.findIndex(x=>x.lp);if(lp>=0){l=lp+1;r=t.findIndex(x=>x.rp)-1}
  for(let i=l;i<=r;i++)if(t[i].op==='×'||t[i].op==='÷')return i;for(let i=l;i<=r;i++)if(t[i].op)return i}
function exApply(t,i){const a=t[i-1].n,b=t[i+1].n,o=t[i].op,v=o==='+'?a+b:o==='−'?a-b:o==='×'?a*b:a/b;const nt=[...t.slice(0,i-1),{n:v},...t.slice(i+2)];
  const lp=nt.findIndex(x=>x.lp);if(lp>=0&&nt[lp+2]&&nt[lp+2].rp){nt.splice(lp+2,1);nt.splice(lp,1)}return {nt,v,a,b,o}}
const exShow=t=>t.map(x=>x.lp?'(':x.rp?')':x.op?` ${x.op} `:x.n).join('');
function exRun(t){const steps=[];while(t.length>1){const i=exStep(t);const s=exApply(t,i);if(!Number.isInteger(s.v)||s.v<=0||s.v>999||((s.o==='÷'||s.o==='×')&&s.b===1))return null;steps.push({...s,before:t});t=s.nt}return {steps,ans:t[0].n}}
function genExpr(r){for(;;){const k=r<2?2:3,nums=Array.from({length:k+1},()=>R(2,12)),ops=Array.from({length:k},()=>pick(['+','−','×','÷']));
  if(!ops.some(o=>o==='×'||o==='÷')||!ops.some(o=>o==='+'||o==='−'))continue;
  let t=[];nums.forEach((n,i)=>{t.push({n});if(i<k)t.push({op:ops[i]})});
  if(r>=3){const len=r>=6?pick([1,2]):1;if(len>=k)continue;const s=R(0,k-len),L=2*s,E=2*(s+len);t=[...t.slice(0,L),{lp:true},...t.slice(L,E+1),{rp:true},...t.slice(E+1)];
    const nb=exRun(t.filter(x=>!x.lp&&!x.rp)),wb=exRun(t);if(!wb||(nb&&nb.ans===wb.ans))continue}
  if(exRun(t))return t}}
addGame('p5-order',{level:'P5',strand:'num',glyph:'( )',title:'Operation Order',topic:'Order of operations and brackets',
 how:'Tap the operation that must be done first. The expression shrinks one step at a time until one number is left.',rounds:8,
 round(api,r){let t=genExpr(r);const start=exShow(t),hist=[];let mistakes=0;
  api.q(`<p class="qt">Work out <b>${start}</b> one step at a time.</p><p class="qs">Tap the operation sign you would do first.</p>`);
  api.body.innerHTML=`<div class="hist" id="oH"></div><div class="expr" id="oE"></div><div id="oMsg" style="font-weight:700;min-height:1.5em"></div>`;
  const draw=()=>{$('oH').innerHTML=hist.map((h,k)=>`<div>${k?'= ':''}${h}</div>`).join('');
    $('oE').innerHTML=(hist.length?'<span class="eq">=</span>':'')+t.map((x,i)=>x.op?`<button class="opb" data-i="${i}">${x.op}</button>`:`<span>${x.lp?'(':x.rp?')':x.n}</span>`).join('');
    $('oE').querySelectorAll('.opb').forEach(b=>b.onclick=()=>{if(api.answered)return;const i=+b.dataset.i,want=exStep(t);
      if(i!==want){mistakes++;sfx.soft();b.classList.add('no');api.later(()=>b.classList.remove('no'),500);
        const lp=t.findIndex(x=>x.lp),inB=lp>=0&&i>lp&&i<t.findIndex(x=>x.rp);
        $('oMsg').textContent=lp>=0&&!inB?'Brackets come first.':(t[want].op==='×'||t[want].op==='÷')&&(t[i].op==='+'||t[i].op==='−')?'Do × and ÷ before + and −.':'Work from left to right.';return}
      sfx.pop();$('oMsg').textContent='';hist.push(exShow(t));const s=exApply(t,i);t=s.nt;
      if(t.length===1){hist.push(String(t[0].n));$('oE').innerHTML='';$('oH').innerHTML=hist.map((h,k)=>`<div>${k?'= ':''}${h}</div>`).join('');
        api.done(mistakes===0,mistakes===0?`${start} = ${t[0].n}`:`You got there: ${start} = ${t[0].n}, with ${mistakes} wrong tap${mistakes>1?'s':''}.`,
          ['Rules: 1. Brackets first. 2. × and ÷ from left to right. 3. + and − from left to right.',...hist.slice(0,-1).map((h,k)=>`${h} &nbsp;→&nbsp; ${hist[k+1]}`)],Math.max(2,10-3*mistakes));return}
      draw()})};
  draw()}});

/* P5-3. Place-Value Slide — × and ÷ by 10, 100, 1000; converting measurements */
const PVCOL=[4,3,2,1,0,-1,-2,-3],PVLAB={4:'TTh',3:'Th',2:'H',1:'T',0:'O','-1':'t','-2':'h','-3':'th'};
const pvStr=V=>{const ip=Math.floor(V/1000),f=String(V%1000).padStart(3,'0').replace(/0+$/,'');return fmt(ip)+(f?'.'+f:'')};
const pvDigits=V=>{const s=String(Math.floor(V/1000)),f=String(V%1000).padStart(3,'0').replace(/0+$/,''),m={};
  s.split('').forEach((d,i)=>m[s.length-1-i]=d);f.split('').forEach((d,i)=>m[-(i+1)]=d);return m};
const pvFits=V=>Number.isInteger(V)&&V>0&&V<1e8;
addGame('p5-slide',{level:'P5',strand:'num',glyph:'×10',title:'Place-Value Slide',topic:'× and ÷ by 10, 100, 1000; converting measurements',
 how:'Slide the digits along the place-value chart. Each move left multiplies by 10; each move right divides by 10.',rounds:8,
 round(api,r){const CONV=[['km','m',3],['m','km',-3],['m','cm',2],['cm','m',-2],['kg','g',3],['g','kg',-3],['ℓ','ml',3],['ml','ℓ',-3]];
  let V,k,q,why;
  for(;;){const sig=R(2,4);let d=String(R(1,9));for(let i=1;i<sig;i++)d+=String(R(0,9));if(d.endsWith('0'))continue;const lp=R(-3,1);V=+d*10**(lp+3);if(!Number.isInteger(V))continue;
    if(r%2===0){k=(r<4?pick([1,2]):pick([2,3]))*pick([1,-1]);q=`${pvStr(V)} ${k>0?'×':'÷'} ${fmt(10**Math.abs(k))} = ?`;why=`${k>0?'×':'÷'} ${fmt(10**Math.abs(k))} moves every digit ${Math.abs(k)} place${Math.abs(k)>1?'s':''} to the ${k>0?'left':'right'}.`}
    else{const [a,b,kk]=pick(r<4?CONV.filter(c=>Math.abs(c[2])===2):CONV.filter(c=>Math.abs(c[2])===3));k=kk;q=`${pvStr(V)} ${a} = ? ${b}`;const big={km:'1 km = 1000 m',m:'1 m = 100 cm',cm:'1 m = 100 cm',kg:'1 kg = 1000 g',g:'1 kg = 1000 g','ℓ':'1 ℓ = 1000 ml',ml:'1 ℓ = 1000 ml'}[a];
      why=`${big}. Changing ${a} to ${b} means ${k>0?'×':'÷'} ${fmt(10**Math.abs(k))}, so the digits move ${Math.abs(k)} places to the ${k>0?'left':'right'}.`}
    const T=V*10**k;if(pvFits(T)&&Math.max(...Object.keys(pvDigits(V)).map(Number))+Math.max(k,0)<=4&&Math.max(...Object.keys(pvDigits(T)).map(Number))<=4&&Number.isInteger(T))break}
  let cur=0;const val=()=>V*10**cur;
  api.q(`<p class="qt">${q}</p><p class="qs">Slide the digits, then press Done.</p>`);
  api.body.innerHTML=`<div style="overflow-x:auto"><div class="pvchart" id="pC"></div></div>
    <div class="row"><button class="btn" id="pL">◀ × 10</button><button class="btn" id="pR">÷ 10 ▶</button><span class="pill" id="pV" style="font-size:1.1rem"></span></div>
    <div class="row"><button class="btn primary" id="pD">Done</button><button class="btn" id="pX">Reset</button></div>`;
  const draw=()=>{const m=pvDigits(val()),hi=Math.max(...Object.keys(m).map(Number));
    $('pC').innerHTML=PVCOL.map(p=>`${p===-1?'<div class="pvh dot">.</div>':''}<div class="pvh">${PVLAB[p]}</div>`).join('')+PVCOL.map(p=>`${p===-1?'<div class="pvd dot">.</div>':''}<div class="pvd">${m[p]!==undefined?m[p]:''}</div>`).join('');
    $('pV').textContent=pvStr(val())+(cur?`  (moved ${Math.abs(cur)} ${cur>0?'left':'right'})`:'');
    $('pL').disabled=api.answered||hi>=4;$('pR').disabled=api.answered||!Number.isInteger(val()/10)};
  $('pL').onclick=()=>{cur++;sfx.tap();draw()};$('pR').onclick=()=>{cur--;sfx.tap();draw()};$('pX').onclick=()=>{if(!api.answered){cur=0;draw()}};
  $('pD').onclick=()=>{const ok=cur===k;$('pD').disabled=true;draw();
    api.done(ok,ok?`Answer: ${pvStr(V*10**k)}`:`The answer is ${pvStr(V*10**k)}. You had ${pvStr(val())}.`,[why,`${q.replace('?',`<b>${pvStr(V*10**k)}</b>`)}`])};draw()}});

/* P5-4. Fair Share — Fraction and division */
function pizzaSVG(g,col){if(g===1)return `<svg viewBox="0 0 60 60" style="width:76px;height:76px"><circle cx="30" cy="30" r="27" style="fill:${col(0)}" stroke="#16233a" stroke-width="1.5"/></svg>`;let s='';for(let k=0;k<g;k++){const a0=(-90+k*360/g)*Math.PI/180,a1=(-90+(k+1)*360/g)*Math.PI/180;
  s+=`<path d="M30,30 L${(30+27*Math.cos(a0)).toFixed(2)},${(30+27*Math.sin(a0)).toFixed(2)} A27,27 0 0 1 ${(30+27*Math.cos(a1)).toFixed(2)},${(30+27*Math.sin(a1)).toFixed(2)}Z" style="fill:${col(k)}" stroke="#16233a" stroke-width="1.5"/>`}
  return `<svg viewBox="0 0 60 60" style="width:76px;height:76px">${s}</svg>`}
const KIDC=['#ff8a72','#7fb3ff','#7ed6a1','#c9a2ff','#ffd166','#5fd3d0','#f4a3c8','#b5c96a'];
addGame('p5-share',{level:'P5',strand:'num',glyph:'÷',title:'Fair Share',topic:'Fraction and division',
 how:'Share pizzas equally. Choose how to cut them, watch the slices get shared out, then say how much each child gets as a fraction.',rounds:8,
 round(api,r){let a,b;if(r<4){b=R(3,8);a=R(1,b-1)}else{b=R(2,5);do{a=R(b+1,3*b-1)}while(a%b===0)}
  api.q(`<p class="qt">${a} pizza${a>1?'s are':' is'} shared equally among ${b} children. How much pizza does each child get?</p>`);
  api.body.innerHTML=`<div style="font-weight:800" id="zSt">Step 1: Cut each pizza into how many equal slices?</div>
    <div class="row" id="zC">${[2,3,4,5,6,8].map(g=>`<button class="btn" data-g="${g}">${g} slices</button>`).join('')}</div>
    <div class="row" id="zP">${Array.from({length:a},()=>pizzaSVG(1,()=>'#ffcf6e')).join('')}</div><div id="zMsg" style="font-weight:700"></div><div id="zS2"></div>`;
  let tries=0;
  $('zC').querySelectorAll('button').forEach(btn=>btn.onclick=()=>{if(api.answered)return;const g=+btn.dataset.g,total=a*g;sfx.tap();
    $('zP').innerHTML=Array.from({length:a},()=>pizzaSVG(g,()=>'#ffcf6e')).join('');
    if(total%b){tries++;$('zMsg').textContent=`${a} × ${g} = ${total} slices. ${total} slices cannot be shared equally among ${b} children. Try another cut.`;return}
    $('zC').querySelectorAll('button').forEach(x=>x.disabled=true);btn.classList.add('ok');const each=total/b;
    $('zMsg').textContent=`${total} slices ÷ ${b} children = ${each} slice${each>1?'s':''} each.`;
    $('zP').innerHTML=Array.from({length:a},(_,p)=>pizzaSVG(g,k=>KIDC[(p*g+k)%b])).join('');
    $('zSt').textContent='Step 2: Each colour is one child’s share. How much pizza does each child get?';
    const right=nice(a,b),cand=[right,nice(b,a),fr(1,b),fr(each,a*g),nice(a+1,b),fr(a,a+b)].filter((x,i,arr)=>arr.indexOf(x)===i).slice(0,4);
    $('zS2').innerHTML=`<div class="row" style="margin-bottom:10px">${Array.from({length:b},(_,i)=>`<span class="pill" style="background:${KIDC[i]};color:#16233a;border-color:#16233a">Child ${i+1}</span>`).join('')}</div><div class="choices" id="zA"></div>`;
    shuffle(cand).forEach(c=>{const x=document.createElement('button');x.className='btn';x.innerHTML=c;
      x.onclick=()=>{if(api.answered)return;const ok=c===right;[...$('zA').children].forEach(y=>{y.disabled=true;if(y.innerHTML===right)y.classList.add('ok')});if(!ok)x.classList.add('no');
        api.done(ok,`Each child gets ${right} of a pizza.`,[`${a} ÷ ${b} = ${fr(a,b)}${a>b?` = ${right}`:gcd(a,b)>1?` = ${right}`:''}`,`Each child gets ${each} slice${each>1?'s':''}, and each slice is ${fr(1,g)} of a pizza: ${each} × ${fr(1,g)} = ${fr(each,g)}${fr(each,g)!==right?` = ${right}`:''}.`,
          'Dividing a whole number by a whole number can give a fraction: the number shared goes on top, the number of shares goes below.'],ok?Math.max(5,10-2*tries):0)};$('zA').appendChild(x)})})}});

/* P5-5. Fraction Grid — Multiplying fractions */
addGame('p5-fgrid',{level:'P5',strand:'num',glyph:'⊞',title:'Fraction Grid',topic:'Multiplying fractions',
 how:'Use an area model. Shade one fraction as columns, then take a fraction of it as rows. The overlap is the answer.',rounds:8,
 round(api,r){const b=R(2,r<4?5:6),d=R(2,r<4?5:6),a=R(1,b-1),c=R(1,d-1);
  api.q(`<p class="qt">Find ${fr(a,b)} of ${fr(c,d)}.</p><p class="qs">${fr(a,b)} × ${fr(c,d)} = ?</p>`);
  api.body.innerHTML=`<div style="font-weight:800" id="xSt">Step 1: Tap ${c} column${c>1?'s':''} to shade ${fr(c,d)} of the square.</div><svg viewBox="0 0 244 244" class="msvg" id="xG" style="max-width:280px" role="img" aria-label="Area model grid"></svg><div id="xS"></div>`;
  const cols=new Set(),rows=new Set();let step=1;
  const draw=()=>{let s='';for(let y=0;y<b;y++)for(let x=0;x<d;x++){const C=cols.has(x),Rw=rows.has(y);
      s+=`<rect data-x="${x}" data-y="${y}" x="${2+x*240/d}" y="${2+y*240/b}" width="${240/d}" height="${240/b}" style="fill:${C&&Rw?'var(--tomato)':C?'#ffd77a':Rw?'#c9c2ff':'var(--surface)'};cursor:pointer" stroke="var(--ink)" stroke-width="1.5"/>`}
    $('xG').innerHTML=s+`<rect x="2" y="2" width="240" height="240" fill="none" stroke="var(--ink)" stroke-width="3"/>`;
    $('xG').querySelectorAll('rect[data-x]').forEach(el=>el.addEventListener('click',()=>{if(api.answered)return;sfx.tap();
      if(step===1){const x=+el.dataset.x;cols.has(x)?cols.delete(x):cols.add(x);if(cols.size===c){step=2;$('xSt').innerHTML=`Step 2: Now tap ${a} row${a>1?'s':''} to take ${fr(a,b)} of the shaded part.`}}
      else if(step===2){const y=+el.dataset.y;rows.has(y)?rows.delete(y):rows.add(y);
        if(rows.size===a){step=3;$('xSt').innerHTML=`Step 3: The orange part is ${fr(a,b)} of ${fr(c,d)}. What fraction of the whole square is it?`;ask()}else $('xS').innerHTML=''}
      draw()}))};
  const ask=()=>{const right=nice(a*c,b*d),cand=[right,fr(a*c,b+d),nice(a+c,b*d),nice(a*d,b*c),fr(a*c,b*d+1),nice(a+c,b+d)].filter((x,i,arr)=>arr.indexOf(x)===i).slice(0,4);
    $('xS').innerHTML=`<div class="choices" id="xA"></div>`;
    shuffle(cand).forEach(cc=>{const x=document.createElement('button');x.className='btn';x.innerHTML=cc;
      x.onclick=()=>{if(api.answered)return;const ok=cc===right;[...$('xA').children].forEach(y=>{y.disabled=true;if(y.innerHTML===right)y.classList.add('ok')});if(!ok)x.classList.add('no');
        api.done(ok,`${fr(a,b)} × ${fr(c,d)} = ${right}`,[`The square is cut into ${b} × ${d} = ${b*d} equal pieces.`,`${a} × ${c} = ${a*c} pieces are in both the columns and the rows (orange).`,
          `${fr(a,b)} × ${fr(c,d)} = ${fr(a+' × '+c,b+' × '+d)} = ${fr(a*c,b*d)}${fr(a*c,b*d)!==right?` = ${right}`:''}`,'Shortcut: multiply the numerators, multiply the denominators, then simplify.'])};$('xA').appendChild(x)})};
  draw()}});

/* P5-6. Rate Station — Rate */
const RSC=[
  {ctx:(q,t)=>`A tap fills ${q} litres of water in ${t} minutes.`,ask:t=>`How many litres does it fill in ${t} minutes?`,back:q=>`How many minutes does it take to fill ${q} litres?`,ru:'litres per minute',u1:'min',u2:'ℓ'},
  {ctx:(q,t)=>`A printer prints ${q} pages in ${t} minutes.`,ask:t=>`How many pages does it print in ${t} minutes?`,back:q=>`How many minutes does it take to print ${q} pages?`,ru:'pages per minute',u1:'min',u2:'pages'},
  {ctx:(q,t)=>`A car travels ${q} km on ${t} litres of petrol.`,ask:t=>`How far can it travel on ${t} litres?`,back:q=>`How many litres of petrol does it need to travel ${q} km?`,ru:'km per litre',u1:'ℓ',u2:'km'},
  {ctx:(q,t)=>`Aunty Lim makes ${q} curry puffs in ${t} hours.`,ask:t=>`How many curry puffs does she make in ${t} hours?`,back:q=>`How many hours does she need to make ${q} curry puffs?`,ru:'curry puffs per hour',u1:'h',u2:'puffs'}];
function dnl(t1,q1,t2,q2,u1,u2,hide){const mx=Math.max(t1,t2),X=t=>30+t/mx*480;
  const tk=(t,q,lab)=>`<line x1="${X(t)}" y1="38" x2="${X(t)}" y2="72" stroke="var(--ink)" stroke-width="2"/><text x="${X(t)}" y="28" text-anchor="middle" class="nlab" style="font-size:15px">${t===null?'?':t}</text><text x="${X(t)}" y="96" text-anchor="middle" class="nlab" style="font-size:15px">${lab}</text>`;
  return `<svg viewBox="0 0 560 110" class="nl" role="img" aria-label="Double number line"><line x1="30" x2="530" y1="45" y2="45" class="ax"/><line x1="30" x2="530" y1="65" y2="65" class="ax"/>
    <text x="540" y="50" class="axl" style="font-size:13px;fill:var(--muted)">${u1}</text><text x="540" y="70" class="axl" style="font-size:13px;fill:var(--muted)">${u2}</text>
    ${tk(0,0,'0')}${tk(t1,q1,q1)}<line x1="${X(t2)}" y1="38" x2="${X(t2)}" y2="72" stroke="var(--tomato)" stroke-width="3"/><text x="${X(t2)}" y="28" text-anchor="middle" class="nlab" style="font-size:15px;fill:var(--tomato)">${hide==='t'?'?':t2}</text><text x="${X(t2)}" y="96" text-anchor="middle" class="nlab" style="font-size:15px;fill:var(--tomato)">${hide==='q'?'?':q2}</text></svg>`}
addGame('p5-rate',{level:'P5',strand:'num',glyph:'⏱',title:'Rate Station',topic:'Rate',
 how:'Find the rate (how much for 1 unit) first, then use it. Later rounds include step rates with "or part thereof".',rounds:8,
 round(api,r){
  if(r>=6){const park=r===6;let ans,q,work;
    if(park){const first=pick([120,150,200]),add=pick([50,60,80]),mins=R(2,4)*60+pick([10,20,40,50]),extra=mins-60,n=Math.ceil(extra/30);ans=first+n*add;
      q=`Car park charges: ${$c(first)} for the first hour, then ${$c(add)} for every additional 30 minutes or part thereof. Mr Tan parks for ${Math.floor(mins/60)} h ${mins%60} min. How much does he pay?`;
      work=[`After the first hour, there are ${extra} more minutes.`,`${extra} min = ${Math.floor(extra/30)} × 30 min${extra%30?` + ${extra%30} min (part of another 30 min, so it still counts)`:''} → <b>${n}</b> charges`,`Total = ${$c(first)} + ${n} × ${$c(add)} = <b>${$c(ans)}</b>`]}
    else{const first=pick([60,80,90]),add=pick([20,25,30]),g=R(4,12)*10+pick([5,2,8]),n=Math.ceil((g-20)/10);ans=first+n*add;
      q=`Postage: ${$c(first)} for the first 20 g, then ${$c(add)} for every additional 10 g or part thereof. How much does it cost to post a letter of ${g} g?`;
      work=[`After the first 20 g, there are ${g-20} g more.`,`${g-20} g needs <b>${n}</b> lots of 10 g (the last part still counts as a full 10 g).`,`Total = ${$c(first)} + ${n} × ${$c(add)} = <b>${$c(ans)}</b>`]}
    api.q(`<p class="qt">${q}</p>`);
    api.body.innerHTML=`<div class="row"><b>$</b><input class="num" id="rIn" inputmode="decimal" aria-label="Cost"><button class="btn primary" id="rChk">Check</button></div>`;
    $('rChk').onclick=()=>{const v=parseMoney($('rIn').value);if(v===null)return;$('rIn').disabled=true;api.done(v===ans,`The cost is ${$c(ans)}.`,work)};return}
  const S=pick(RSC),k=R(3,12),t1=R(2,6);let t2;do{t2=R(2,12)}while(t2===t1);const q1=k*t1,q2=k*t2,back=r>=4;
  api.q(`<p class="qt">${S.ctx(q1,t1)} ${back?S.back(q2):S.ask(t2)}</p>`);
  api.body.innerHTML=dnl(t1,q1,t2,q2,S.u1,S.u2,back?'t':'q')+`<div class="row"><b>Step 1: Rate =</b><input class="num" id="r1" inputmode="numeric" aria-label="Rate"><span>${S.ru}</span></div>
    <div class="row"><b>Step 2: Answer =</b><input class="num" id="r2" inputmode="numeric" aria-label="Answer"><span>${back?S.u1:S.u2}</span><button class="btn primary" id="rChk">Check</button></div>`;
  $('rChk').onclick=()=>{const a1=parseFloat($('r1').value),a2=parseFloat($('r2').value);if(isNaN(a2))return;const ans=back?t2:q2,o1=a1===k,o2=a2===ans;$('r1').disabled=$('r2').disabled=true;
    api.done(o1&&o2,`${o1?'Rate correct. ':`The rate is ${k} ${S.ru}. `}${o2?'Answer correct.':`The answer is ${ans} ${back?S.u1:S.u2}.`}`,
      [`Rate = ${q1} ÷ ${t1} = <b>${k}</b> ${S.ru}`,back?`Time = ${q2} ÷ ${k} = <b>${t2}</b> ${S.u1}`:`In ${t2} ${S.u1}: ${k} × ${t2} = <b>${q2}</b> ${S.u2}`],(o1?4:0)+(o2?6:0))}}});
