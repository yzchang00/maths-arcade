/* ================= ONLINE PARTY GAMES =================
   Party games played in an online room, each pupil on their own device.
   Everything travels through each player's own room entry ("presence"): score, round, status, team.
   - Team Battle (new) and Times Table Tug-of-War: teams race; every right answer adds to the team.
   - Number Bingo: the host's device calls the clues; everyone has their own card.
   - Fraction Wall Race: everyone builds their own wall with the same bricks; first to 2 bars wins. */

const TEAMS=[{n:'Blue',e:'🔵',c:'#2f7de1'},{n:'Red',e:'🔴',c:'#e2504a'},{n:'Green',e:'🟢',c:'#2fa45a'},{n:'Yellow',e:'🟡',c:'#e0a400'}];
const QUICK_TOPICS=[['t29','Times tables 2 to 9'],['t212','Times tables 2 to 12'],['P4','P4 mix'],['P5','P5 mix'],['P6','P6 mix'],['p5','× ÷ by 10, 100, 1000'],['p6','Squares, cubes, fractions, %']];
const defQuick=()=>({P4:'t29',P5:'P5',P6:'P6'})[PLV()]||'t29';

/* one quick multiple-choice question for team games */
function olQuick(kind){
  if(['t29','t212','p5','p6'].includes(kind))return tugQ(kind);
  const c=bingoClues(kind)[0];const near=[c.a+1,c.a-1,c.a+2,c.a+10,c.a-10,c.a*2].filter(v=>v>0&&v!==c.a);
  const o=[];if(c.trap&&c.trap[0]!==c.a&&c.trap[0]>0)o.push({v:c.trap[0],why:c.trap[1]});
  shuffle(near).forEach(v=>{if(o.length<3&&!o.some(x=>x.v===v))o.push({v,why:`Not quite. Work out ${c.c} again.`})});
  return {q:c.c,a:c.a,o,tip:`${c.c} = ${c.a}`}}

/* ---------- shared helpers ---------- */
/* players taking part in the game that is running now (sorted by join order, so every device agrees) */
function olPlayers(){return ONLINE.peers.filter(p=>p.presence&&p.presence.nick&&(p.sameTab||olThisGame(p)))
  .sort((a,b)=>(a.joined||0)-(b.joined||0)||(a.id<b.id?-1:1))}
/* everyone in the room right now (for the lobby) */
function olRoomPlayers(){return ONLINE.peers.filter(p=>p.presence&&p.presence.nick).sort((a,b)=>(a.joined||0)-(b.joined||0)||(a.id<b.id?-1:1))}
/* a player's team: the one they picked in the lobby, or a fair share by join order */
function olTeamOf(p,list,n){const t=p.presence.team;if(Number.isInteger(t)&&t>=0&&t<n)return t;return Math.max(0,list.indexOf(p))%n}
/* in the lobby of a team game, make sure I have a team saved: join the smallest team (so teams stay even) */
function olEnsureTeam(){const O=ctx&&ctx.G.online;if(!O||!(O.teamsChoice||O.fixedTeams)||!ONLINE.room)return;const n=O.fixedTeams||olHostCfg().teams||2,list=olRoomPlayers(),me=list.find(p=>p.sameTab);
  if(!me)return;const t=me.presence.team;if(Number.isInteger(t)&&t>=0&&t<n)return;
  const size=Array(n).fill(0);list.forEach(p=>{if(p.sameTab)return;const q=p.presence.team;if(Number.isInteger(q)&&q>=0&&q<n)size[q]++});
  const pickT=size.indexOf(Math.min(...size));if(ONLINE._teamAsk===pickT+':'+n)return;ONLINE._teamAsk=pickT+':'+n;ONLINE.room.presence({team:pickT}).catch(()=>{})}
/* send my score/round to the room at most about once a second (keeps Firebase writes low) */
let OLQ={},OLT=0;
function olPush(f,now){Object.assign(OLQ,f);const send=()=>{OLT=0;const q=OLQ;OLQ={};if(ONLINE.room)ONLINE.room.presence(q).catch(()=>{})};
  if(now){clearTimeout(OLT);return send()}if(!OLT)OLT=setTimeout(send,1100)}
function olTimer(fn,ms){return PT.timer(fn,ms)}
function olEvery(fn,ms){return PT.every(fn,ms)}
function olToLobby(){const h=hostPeer(),hg=h&&!h.sameTab&&h.presence.game,id=olCan(hg)?hg:(ONLINE.gid||ctx.id);ONLINE.gid=id;if(id!==ctx.id){ONLINE.pending=()=>playGame(id,{setup:true,level:'mixed'});ONLINE.hook=null;location.hash=id;return}ONLINE.hook=null;if(ONLINE.host&&ONLINE.room)ONLINE.room.presence({status:'lobby'}).catch(()=>{});MODE='online';playGame(id,{setup:true,level:ctx&&ctx.level})}
/* buttons at the end of an online game */
function olEndButtons(){return `<div class="row">${ONLINE.host?'<button class="btn primary" id="olAgain2">Rematch for everyone</button>':'<span style="color:var(--muted)">The host can start a rematch.</span>'}<button class="btn" id="olLobbyBtn">Back to the room</button><a class="btn" href="#" style="text-decoration:none;display:inline-flex;align-items:center">Leave the room</a></div>`}
function olWireEnd(){if($('olAgain2'))$('olAgain2').onclick=()=>{sfx.tap();olHostStart()};if($('olLobbyBtn'))$('olLobbyBtn').onclick=()=>{sfx.tap();olToLobby()}}
/* normal games: add "Back to the room" to the online end screen */
function olEndExtras(){const e=$('olEnd');if(!e||$('olLobbyBtn'))return;const r=e.querySelector('.row');if(r)r.insertAdjacentHTML('beforeend','<button class="btn" id="olLobbyBtn">Back to the room</button>');olWireEnd()}

/* ---------- lobby settings (host chooses; everyone sees) ---------- */
function olCfgDefaults(id){const G=GAMES[id],O=G&&G.online;ONLINE.cfg=ONLINE.cfg||{};
  if(O&&O.topics&&!O.topics.some(t=>t[0]===ONLINE.cfg.topic))ONLINE.cfg.topic=(O.defTopic?O.defTopic():O.topics[0][0]);
  if(!(O&&O.topics))ONLINE.cfg.topic=null;
  if(!ONLINE.cfg.teams)ONLINE.cfg.teams=2;if(O&&O.fixedTeams)ONLINE.cfg.teams=O.fixedTeams}
function olHostCfg(){const h=hostPeer();if(ONLINE.host||!h)return ONLINE.cfg||{};return {topic:h.presence.topic||null,teams:+h.presence.teams||2}}
function olSettingsBox(h){const G=ctx.G,O=G.online,cfg=olHostCfg(),topicName=O&&O.topics?((O.topics.find(t=>t[0]===cfg.topic)||O.topics[0])[1]):'';
  if(!ONLINE.host){const parts=[`<b>${esc(G.title)}</b>`];if(O&&(O.teamsChoice||O.fixedTeams))parts.push(`${O.fixedTeams||cfg.teams} teams`);if(ctx.id==='party-bingo'&&topicName)parts.push(topicName);
    if(!G.custom)parts.push('Medium: starts easy, gets harder');else if(topicName)parts.push(topicName);return `<p class="olset">🎮 ${[...new Set(parts)].filter(Boolean).join(' · ')}</p>`}
  const games=ORDER.filter(olCan),lv=['P4','P5','P6','All levels'];
  return `<div class="olsettings"><label><b>Game</b><select id="olGame" class="num">${lv.map(l=>`<optgroup label="${l==='All levels'?'Party games':l}">${games.filter(id=>GAMES[id].level===l).map(id=>`<option value="${id}" ${id===ctx.id?'selected':''}>${esc(GAMES[id].title)}</option>`).join('')}</optgroup>`).join('')}</select></label>
    ${G.custom?'':`<span class="olfix"><b>Level</b>Medium: starts easy, gets harder</span>`}
    ${O&&O.topics?`<label><b>${ctx.id==='party-bingo'?'Clues':'Questions'}</b><select id="olTopic" class="num">${O.topics.map(([k,t])=>`<option value="${k}" ${k===cfg.topic?'selected':''}>${t}</option>`).join('')}</select></label>`:''}
    ${O&&O.teamsChoice?`<label><b>Teams</b><select id="olTeams" class="num">${O.teamsChoice.map(n=>`<option value="${n}" ${n===cfg.teams?'selected':''}>${n} teams</option>`).join('')}</select></label>`:''}</div>
    <p class="qs" style="margin:0">Everyone in the room gets the same mix of questions, from easy to harder, so the game is fair for all.</p>`}
function wireSettings(){

  if($('olGame'))$('olGame').onchange=()=>{const id=$('olGame').value;if(!olCan(id))return;sfx.tap();olCfgDefaults(id);ONLINE.gid=id;MODE='online';
    const lvl='mixed';ONLINE.room.presence({game:id,level:lvl,topic:ONLINE.cfg.topic,teams:ONLINE.cfg.teams,status:'lobby'}).catch(()=>{});
    ONLINE.pending=()=>playGame(id,{setup:true,level:lvl});location.hash=id};
  if($('olTopic'))$('olTopic').onchange=()=>{ONLINE.cfg.topic=$('olTopic').value;ONLINE.room.presence({topic:ONLINE.cfg.topic}).catch(()=>{});sfx.tap()};
  if($('olTeams'))$('olTeams').onchange=()=>{ONLINE.cfg.teams=+$('olTeams').value;ONLINE.room.presence({teams:ONLINE.cfg.teams}).catch(()=>{});sfx.tap();drawLobby()}}
/* team picker: shown for team games */
function olTeamBox(){const O=ctx.G.online;if(!O||!(O.teamsChoice||O.fixedTeams))return '';const n=O.fixedTeams||olHostCfg().teams||2,list=olRoomPlayers(),hp=hostPeer();
  const cols=Array.from({length:n},()=>[]);list.forEach(p=>cols[olTeamOf(p,list,n)].push(p));
  const me=list.find(p=>p.sameTab),myT=me?olTeamOf(me,list,n):-1;
  return `<div class="olteams" style="--n:${n}">${cols.map((ps,t)=>`<div class="olteam" style="--tc:${TEAMS[t].c}"><b>${TEAMS[t].e} ${TEAMS[t].n} <small>${ps.length}</small></b>
    <ul>${ps.map(p=>`<li class="${p.sameTab?'me':''}">${hp&&p.id===hp.id?'★ ':''}${esc(safeNick(p.presence.nick))}${p.sameTab?' (you)':''}</li>`).join('')||'<li class="empty">No one yet</li>'}</ul>
    ${t!==myT&&me?`<button class="btn sm" data-team="${t}">Join ${TEAMS[t].n}</button>`:''}</div>`).join('')}</div><p class="qs" style="margin:4px 0 0">Tap a team to switch. Try to keep the teams the same size!</p>`}
function wireTeams(){document.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>{sfx.tap();ONLINE.room.presence({team:+b.dataset.team}).catch(()=>{})})}
/* host presses Start (or Rematch) */
function olHostStart(){if(!ONLINE.host||!ONLINE.room)return;const id=ctx.id;olCfgDefaults(id);const seed=Math.floor(Math.random()*4294967296),startAt=Date.now(),lvl='mixed'; /* online rooms: everyone gets the same easy-to-harder mix */
  olResetGame(startAt);ONLINE.gid=id;ONLINE.cur={game:id,level:lvl,seed,startAt,topic:ONLINE.cfg.topic,teams:ONLINE.cfg.teams};
  ONLINE.room.presence({game:id,level:lvl,seed,startAt,status:'playing',score:0,round:GAMES[id].custom?0:1,topic:ONLINE.cfg.topic,teams:ONLINE.cfg.teams}).catch(()=>{});
  playGame(id,{go:true,seedBase:olSeed(seed),level:lvl})}
/* party games call this from custom(): play if the room has started this game, otherwise show the room */
function olPartyCustom(stage,id){if(ctx.go&&ONLINE.cur&&ONLINE.cur.game===id&&ONLINE.room){document.body.classList.add('playing');stage.innerHTML='';return GAMES[id].online.run(stage,ONLINE.cur)}
  return onlinePanel(id)}
/* final standings card for party games */
function olPartyEnd(stage,title,body,id,myScore){ONLINE.hook=null;document.body.classList.remove('playing');sfx.win();confetti(110,true);qubi('gQ','party','What a game!');
  const o=document.createElement('div');o.className='ptover';o.innerHTML=`<div class="end"><span class="tag">Game over</span><h3>${title}</h3>${body}${olEndButtons()}</div>`;stage.appendChild(o);olWireEnd();
  if(myScore!=null)setTimeout(()=>arcReport(id,myScore,{mode:'online'}),80)}

/* ---------- Team Battle and Tug-of-War (online) ---------- */
function olTeamGame(stage,cur,id){const rope=id==='party-tug',N=rope?2:Math.max(2,Math.min(4,cur.teams||2)),SECS=rope?90:120,kind=cur.topic||'t29';
  const S={score:0,lock:0,q:null,over:false,wrong:[],end:Date.now()+SECS*1000};
  const me=()=>olPlayers().find(p=>p.sameTab);
  const roster=olRoomPlayers();
  const tally=()=>{const list=olPlayers(),sum=Array(N).fill(0),size=Array(N).fill(0),pl=[];
    list.forEach(p=>{const t=olTeamOf(p,roster.includes(p)?roster:list,N),s=p.sameTab?S.score:(+p.presence.score||0);sum[t]+=s;size[t]++;pl.push({n:safeNick(p.presence.nick),t,s,me:p.sameTab})});
    Object.entries(ONLINE.seen).forEach(([pid,pr])=>{if(!list.some(p=>p.id===pid)&&pr.nick&&Number.isInteger(pr.team)){sum[pr.team]+=+pr.score||0}});
    const m=me();return {sum,size,pl,my:m?olTeamOf(m,roster.includes(m)?roster:list,N):0}};
  const WIN=()=>{const t=tally();return Math.min(24,6+2*Math.max(1,...t.size))};
  const myT=tally().my,TM=TEAMS[myT];
  stage.innerHTML=`<div class="olbattle"><div class="tughead"><span class="pill" id="obT">⏱ ${SECS}s</span><span class="tag">${rope?'Pull the knot to your side!':'Every right answer scores for your team'}</span><span class="pill" style="border-color:${TM.c}">You are ${TM.e} ${TM.n}</span></div>
    <div id="obBoard"></div><div class="obq" style="--tc:${TM.c}"><div class="tgq" id="obQ"></div><div class="tgopts" id="obO"></div><div class="tgmsg" id="obM"></div><p class="qs" id="obMine">You: 0 right</p></div></div>`;
  const board=()=>{const t=tally();if(rope){const W=WIN(),pos=Math.max(-W,Math.min(W,t.sum[1]-t.sum[0])),pct=50+pos/W*42;
      $('obBoard').innerHTML=`<div class="obrope"><span class="obend" style="color:${TEAMS[0].c}">${TEAMS[0].e} ${TEAMS[0].n}<b>${t.sum[0]}</b></span><div class="obline"><i class="obzone l"></i><i class="obzone r"></i><span class="obknot" style="left:${pct}%"></span></div><span class="obend" style="color:${TEAMS[1].c}">${TEAMS[1].e} ${TEAMS[1].n}<b>${t.sum[1]}</b></span></div><p class="qs" style="text-align:center;margin:4px 0 0">Pull ${W} steps ahead to win, or be ahead when time runs out.</p>`;return {t,pos,W}}
    const mx=Math.max(1,...t.sum);$('obBoard').innerHTML=`<div class="obbars">${t.sum.map((s,i)=>`<div class="obbar ${i===t.my?'mine':''}" style="--tc:${TEAMS[i].c}"><span>${TEAMS[i].e} ${TEAMS[i].n} <small>(${t.size[i]})</small></span><div><i style="width:${s/mx*100}%"></i></div><b>${s}</b></div>`).join('')}</div>`;return {t}};
  const ask=()=>{if(S.over)return;const q=olQuick(kind);S.q=q;const plain=String(q.q).replace(/<[^>]+>/g,'');$('obQ').innerHTML=/^[a-z]/i.test(plain)&&!/^\d/.test(plain)?`${q.q}?`:`${q.q} = ?`;
    const opts=shuffle([{v:q.a},...q.o.filter((x,i,a)=>x.v!==q.a&&a.findIndex(y=>y.v===x.v)===i)].slice(0,4));
    $('obO').innerHTML=opts.map(x=>`<button class="btn tgb" data-v="${x.v}">${fmtN(x.v)}</button>`).join('');
    $('obO').querySelectorAll('.tgb').forEach(b=>b.onclick=()=>answer(+b.dataset.v,b))};
  const answer=(v,btn)=>{if(S.over||S.lock>Date.now())return;const q=S.q;
    if(v===q.a){S.score++;sfx.ok();btn.classList.add('ok');$('obM').innerHTML='';$('obMine').textContent=`You: ${S.score} right`;olPush({score:S.score});board();check();if(!S.over)olTimer(ask,250)}
    else{sfx.no();btn.classList.add('no');const w=q.o.find(x=>x.v===v);S.wrong.push(`${q.q} = ${fmtN(q.a)}`);$('obM').innerHTML=`<p class="retrymsg">❌ ${w?w.why:'Not that one.'} <b>${q.tip}</b></p>`;
      S.lock=Date.now()+1600;$('obO').querySelectorAll('.tgb').forEach(b=>b.disabled=true);olTimer(ask,1600)}};
  const check=()=>{if(S.over)return;if(rope){const b=board();if(Math.abs(b.pos)>=b.W)return end()}if(Date.now()>=S.end)end()};
  const end=()=>{if(S.over)return;S.over=true;olPush({score:S.score,status:'done'},true);$('obO').innerHTML='';$('obQ').innerHTML='<b>Time!</b> Collecting the final scores…';
    olTimer(()=>{const t=tally(),best=Math.max(...t.sum),win=t.sum.map((s,i)=>s===best?i:-1).filter(i=>i>=0);
      const title=win.length>1?`It's a draw between ${win.map(i=>TEAMS[i].e+' '+TEAMS[i].n).join(' and ')}!`:`${TEAMS[win[0]].e} ${TEAMS[win[0]].n} wins!${win[0]===t.my?' 🏆':''}`;
      const stars=t.pl.sort((a,b)=>b.s-a.s).slice(0,3);
      const body=`<ol class="board">${t.sum.map((s,i)=>[s,i]).sort((a,b)=>b[0]-a[0]).map(([s,i])=>`<li class="${i===t.my?'me':''}"><b>${TEAMS[i].e} ${TEAMS[i].n}</b><span>${s} right</span></li>`).join('')}</ol>
        <p><b>Top scorers:</b> ${stars.map(p=>`${esc(p.n)}${p.me?' (you)':''} ${TEAMS[p.t].e} ${p.s}`).join(' · ')}</p><p>You got <b>${S.score}</b> right for ${TEAMS[t.my].e} ${TEAMS[t.my].n}.</p>
        ${S.wrong.length?`<p><b>Facts to practise:</b><br>${uniq(S.wrong).slice(0,6).join('<br>')}</p>`:''}`;
      $('obBoard').innerHTML='';board();olPartyEnd(stage,title,body,id,S.score)},2500)};
  /* keep my team on my room entry so it still counts if I leave */
  olPush({team:myT,score:0},true);
  ONLINE.hook=()=>{if(!S.over){board();check()}};
  board();ask();
  olEvery(()=>{if(S.over)return;const left=Math.max(0,Math.ceil((S.end-Date.now())/1000));$('obT').textContent=`⏱ ${left}s`;if(left<=10)$('obT').classList.add('hot');board();check()},500)}

/* ---------- Number Bingo (online): the host's device calls the clues ---------- */
function olBingo(stage,cur){
  const real=Math.random;Math.random=mulberry(cur.seed);const clues=shuffle(bingoClues(cur.topic||'P4'));const answers=clues.map(c=>c.a);
  Math.random=mulberry(olSeed(cur.seed));const mine=shuffle(answers).slice(0,16);Math.random=real;
  const S={idx:-1,resp:0,mk:new Set(),over:false,miss:[],first:true,hostI:null,hostAt:0,wrongs:0};
  stage.innerHTML=`<div class="bingo"><div class="bgcall" id="bgC"><span class="tag">Get ready…</span><div class="bgclue">The host will call the first clue.</div></div><div id="bgM"></div>
    <div class="bgboards"><div><span class="tag">Your card</span><div class="bgcard" id="bgMine">${mine.map((n,i)=>`<button class="bgcell" data-i="${i}">${n}</button>`).join('')}</div>
    <div class="row"><button class="btn" id="bgNo">Not on my card ➜</button></div></div><div><span class="tag">Players</span><ol class="board" id="bgP"></ol></div></div></div>`;
  const won=set=>lines4.some(l=>l.every(i=>set.has(i)));
  const players=()=>olPlayers();
  const curIdx=()=>{if(ONLINE.host)return S.hostI==null?-1:S.hostI;const h=hostPeer();return h&&olThisGame(h)?(+h.presence.round||0)-1:-1};
  const respond=()=>{S.resp=S.idx+1;if(!ONLINE.host)olPush({round:S.resp},true)};
  const show=i=>{S.idx=i;S.first=true;S.wrongs=0;$('bgM').innerHTML='';if(i>=clues.length)return end([]);
    $('bgC').innerHTML=`<span class="tag">Clue ${i+1} of ${clues.length}</span><div class="bgclue">${clues[i].c}</div>`;sfx.pop()};
  const people=()=>{const ps=players(),hp=hostPeer();$('bgP').innerHTML=ps.map(p=>{const m=p.sameTab?S.mk.size:(+p.presence.score||0);return `<li class="${p.sameTab?'me':''}"><b>${hp&&p.id===hp.id?'★ ':''}${esc(safeNick(p.presence.nick))}${p.sameTab?' (you)':''}</b><span>${m} marked</span></li>`}).join('')};
  const wrong=msg=>{sfx.no();if(S.first){S.first=false;$('bgM').innerHTML=`<p class="retrymsg">🔁 ${msg}</p>`;return}
    const c=clues[S.idx];S.miss.push(`${c.c} = ${c.a}`);$('bgM').innerHTML=`<p class="retrymsg">❌ The answer was <b>${c.a}</b>. ${mine.includes(c.a)?'It was on your card, but this chance is gone.':'It was not on your card.'} Wait for the next clue.</p>`;respond()};
  $('bgMine').querySelectorAll('.bgcell').forEach(b=>b.onclick=()=>{if(S.over||S.idx<0||S.resp>S.idx||b.classList.contains('on'))return;const c=clues[S.idx],v=+b.textContent;
    if(v===c.a){b.classList.add('on');S.mk.add(+b.dataset.i);sfx.ok();$('bgM').innerHTML='<p class="asknote">✅ Marked! Wait for the next clue.</p>';olPush({score:S.mk.size});respond();people();if(won(S.mk)){olPush({status:'done',score:S.mk.size},true);return end([me()])}return}
    b.classList.add('shake');PT.timer(()=>b.classList.remove('shake'),400);wrong(c.trap&&v===c.trap[0]?c.trap[1]:`${v} is not the answer to “${c.c}”. Work it out again.`)});
  $('bgNo').onclick=()=>{if(S.over||S.idx<0||S.resp>S.idx)return;const c=clues[S.idx];if(!mine.includes(c.a)){sfx.tap();$('bgM').innerHTML=`<p class="asknote">Right, ${c.a} is not on your card. Wait for the next clue.</p>`;respond();return}
    wrong('Look again. The answer <b>is</b> on your card. Work the clue out carefully.')};
  const me=()=>players().find(p=>p.sameTab);
  const end=winners=>{if(S.over)return;S.over=true;const names=winners.filter(Boolean).map(p=>safeNick(p.presence.nick)+(p.sameTab?' (you)':''));const iWon=winners.some(p=>p&&p.sameTab);
    const body=`<p>Clues called: ${Math.min(S.idx+1,clues.length)}</p>${S.miss.length?`<p><b>Clues to look at again:</b><br>${S.miss.join('<br>')}</p>`:''}`;
    if(iWon)setBest('party-bingo',S.idx<14?3:S.idx<19?2:1);
    olPartyEnd(stage,names.length?`BINGO! ${esc(names.join(' and '))} ${names.length>1?'win':'wins'}!${iWon?' 🏆':''}`:'Out of clues! No Bingo this time.',body,'party-bingo',iWon?Math.max(1,30-(S.idx+1)):null)};
  /* host: call the next clue when everyone has answered, or after 20 seconds */
  const drive=()=>{if(!ONLINE.host||S.over)return;const now=Date.now();
    if(S.hostI==null){S.hostI=Math.max(-1,S.idx);S.hostAt=now}
    const others=players().filter(p=>!p.sameTab&&p.presence.status!=='done');const allIn=S.resp>S.hostI&&others.every(p=>(+p.presence.round||0)>S.hostI);
    if(S.hostI<0?now-S.hostAt>2500:(allIn&&now-S.hostAt>2500||now-S.hostAt>20000)){S.hostI++;S.hostAt=now;ONLINE.room.presence({round:S.hostI+1}).catch(()=>{})}};
  const sync=()=>{if(S.over)return;people();const done=players().filter(p=>!p.sameTab&&p.presence.status==='done');if(done.length)return end(done);
    if(!ONLINE.host)S.hostI=null;drive();const i=curIdx();if(i>S.idx){if(S.idx>=0&&S.resp<=S.idx&&mine.includes(clues[S.idx].a))S.miss.push(`${clues[S.idx].c} = ${clues[S.idx].a}`);show(i)}};
  olPush({score:0,round:0},true);ONLINE.hook=sync;people();
  olEvery(()=>{sync();if(ONLINE.host&&S.idx>=0&&!S.over){const left=Math.max(0,Math.ceil((S.hostAt+20000-Date.now())/1000));const t=$('bgC').querySelector('.tag');if(t)t.textContent=`Clue ${S.idx+1} of ${clues.length} · next in ${left}s`}},500)}

/* ---------- Fraction Wall Race (online): same bricks for everyone, first to 2 bars wins ---------- */
function olWall(stage,cur){const GOAL=2,real=Math.random;Math.random=mulberry(cur.seed);const deck=Array.from({length:300},()=>[pick(FW),pick(FW)]);Math.random=real;
  const S={t:0,bars:[[]],done:0,over:false,miss:[]},used=fwUsed,prog=()=>S.done*12+used(S.bars[S.bars.length-1]);
  stage.innerHTML=`<div class="fwall"><details class="fwhelp"><summary>📐 Show the fraction wall</summary>${fwWall()}</details>
    <div class="fwrace" id="fwR"></div><div class="fwp" style="--pc:var(--teal)"><div class="row"><b>Your wall</b><span class="pill" id="fwD">0 of ${GOAL} bars</span></div><div class="fwbar" id="fwB"></div></div><div class="fwturn" id="fwT"></div></div>`;
  const cols=['#ffd27a','#ffb3c7','#bcd3fb','#bfe8cf','#d9c6ff','#f3c28b','#c6f0f0'];
  const race=()=>{const ps=olPlayers();$('fwR').innerHTML=ps.map(p=>{const v=p.sameTab?prog():(+p.presence.score||0);return `<div class="fwrrow ${p.sameTab?'me':''}"><span>${esc(safeNick(p.presence.nick))}${p.sameTab?' (you)':''}</span><div><i style="width:${Math.min(100,v/(GOAL*12)*100)}%"></i></div><b>${Math.floor(v/12)}/${GOAL}</b></div>`}).join('')};
  const draw=()=>{const b=S.bars[S.bars.length-1];$('fwB').innerHTML=`<div class="fwtrack">${b.map(([n,d])=>`<span class="fwbrick" style="flex:${n*12/d};background:${cols[(d+n)%cols.length]}">${fr(n,d)}</span>`).join('')}${used(b)<12?`<span class="fwgap" style="flex:${12-used(b)}"></span>`:''}</div><div class="fwticks">${Array.from({length:12},()=>'<i></i>').join('')}</div>`;
    $('fwD').textContent=`${S.done} of ${GOAL} bars`;race()};
  const turn=()=>{if(S.over)return;draw();const b=S.bars[S.bars.length-1],left=12-used(b),cards=deck[S.t%deck.length];S.t++;
    $('fwT').innerHTML=`<div class="fwtc" style="--pc:var(--teal)"><h3>Pick a brick</h3><p class="qs">Space left on the bar: <b>${fr(left,12)}</b>${frq(left,12)[1]!==12?` = ${rshow(frq(left,12))}`:''}. Pick a brick that fits.</p>
      <div class="row fwcards">${cards.map((c,i)=>`<button class="btn fwcard" data-i="${i}">${fr(c[0],c[1])}</button>`).join('')}<button class="btn" id="fwPass">Neither fits: new bricks</button></div><div id="fwM"></div></div>`;
    let tries=0;
    const choose=i=>{const c=cards[i],sz=c[0]*12/c[1];
      if(sz>left){tries++;sfx.no();$('fwM').innerHTML=`<p class="retrymsg">🔁 ${fr(c[0],c[1])} = ${fr(sz,12)}, but only ${fr(left,12)} is left. It will not fit!</p>`;if(tries>=2){S.miss.push(`${fr(c[0],c[1])} does not fit in ${fr(left,12)}`);olTimer(turn,1500)}return}
      ask(c)};
    const ask=c=>{const Q=fwQ(b,c);$('fwT').querySelector('.fwcards').innerHTML=`<span class="fwchosen">${fr(c[0],c[1])}</span><b>How much of the bar will be filled?</b>${Q.opts.map((x,i)=>`<button class="btn fwans" data-i="${i}">${rshow(x.v)}</button>`).join('')}`;$('fwM').innerHTML='';
      $('fwT').querySelectorAll('.fwans').forEach((bt,i)=>bt.onclick=()=>{if(S.over||$('fwT').querySelector('.fwans.ok,.fwans.no'))return;const x=Q.opts[i];
        if(x.ok){bt.classList.add('ok');sfx.ok();b.push(c);if(used(b)===12){S.done++;confetti(50);$('fwM').innerHTML=`<p class="asknote">🎉 Bar complete! ${b.map(y=>fr(y[0],y[1])).join(' + ')} = 1 whole.</p>`;
            if(S.done>=GOAL){draw();olPush({score:prog(),status:'done'},true);return olTimer(()=>end([me()]),600)}S.bars.push([])}
          else $('fwM').innerHTML=`<p class="asknote">✅ ${fr(Q.before,12)} + ${fr(Q.after-Q.before,12)} = ${fr(Q.after,12)}</p>`;
          olPush({score:prog()});draw();return olTimer(turn,1100)}
        bt.classList.add('no');sfx.no();S.miss.push(x.why);$('fwM').innerHTML=`<p class="retrymsg">❌ ${x.why} The brick bounces off.</p>`;olTimer(turn,2600)})};
    const pass=()=>{if(cards.some(c=>c[0]*12/c[1]<=left)){sfx.no();$('fwM').innerHTML=`<p class="retrymsg">🔁 One of these bricks does fit! Change each one to twelfths and compare with ${fr(left,12)}.</p>`;return}sfx.tap();turn()};
    $('fwT').querySelectorAll('.fwcard').forEach(bt=>bt.onclick=()=>choose(+bt.dataset.i));$('fwPass').onclick=pass;fitView()};
  const me=()=>olPlayers().find(p=>p.sameTab);
  const end=winners=>{if(S.over)return;S.over=true;const names=winners.filter(Boolean).map(p=>safeNick(p.presence.nick)+(p.sameTab?' (you)':''));const iWon=winners.some(p=>p&&p.sameTab);
    const ps=olPlayers().map(p=>({n:safeNick(p.presence.nick),v:p.sameTab?prog():(+p.presence.score||0),me:p.sameTab})).sort((a,b)=>b.v-a.v);
    const body=`<ol class="board">${ps.map(p=>`<li class="${p.me?'me':''}"><b>${esc(p.n)}${p.me?' (you)':''}</b><span>${Math.floor(p.v/12)} bar${Math.floor(p.v/12)===1?'':'s'} + ${fr(p.v%12,12)}</span></li>`).join('')}</ol>${S.miss.length?`<p><b>Things to remember:</b><br>${uniq(S.miss).slice(0,4).join('<br>')}</p>`:''}`;
    if(iWon)setBest('party-wall',S.miss.length===0?3:S.miss.length<3?2:1);
    olPartyEnd(stage,`${esc(names.join(' and '))||'Someone'} ${names.length>1?'win':'wins'} the race!${iWon?' 🏆':''}`,body,'party-wall',iWon?Math.max(10,100-10*S.miss.length):null)};
  olPush({score:0},true);
  ONLINE.hook=()=>{if(S.over)return;race();const done=olPlayers().filter(p=>!p.sameTab&&p.presence.status==='done');if(done.length)end(done)};
  turn()}

/* ---------- Team Battle (new) ---------- */
addGame('party-team',{level:'All levels',strand:'party',glyph:'⚔️',title:'Team Battle',topic:'Class teams race to answer quick-fire questions',
 how:'Split into 2 to 4 teams in an online room. Every right answer scores a point for your team. The team with the most points after 2 minutes wins.',rounds:1,
 modes:[['online','Online room','Teams play on their own devices.','🌐']],
 online:{topics:QUICK_TOPICS,defTopic:defQuick,teamsChoice:[2,3,4],run:(st,cur)=>olTeamGame(st,cur,'party-team')},
 custom(stage,mode){if(mode!=='online'){MODE='online';return onlinePanel('party-team')}olPartyCustom(stage,'party-team')}});
/* online versions of the existing party games */
Object.assign(GAMES['party-tug'],{online:{topics:QUICK_TOPICS,defTopic:defQuick,fixedTeams:2,run:(st,cur)=>olTeamGame(st,cur,'party-tug')}});
Object.assign(GAMES['party-bingo'],{online:{topics:[['P4','P4 clues'],['P5','P5 clues'],['P6','P6 clues']],defTopic:()=>PLV(),run:olBingo}});
Object.assign(GAMES['party-wall'],{online:{run:olWall}});
['party-tug','party-bingo','party-wall'].forEach(id=>{const G=GAMES[id],orig=G.custom;if(!G.modes.some(m=>m[0]==='online'))G.modes.push(['online','Online room','Play with classmates on their own devices.','🌐']);
  G.custom=function(stage,mode){if(mode==='online')return olPartyCustom(stage,id);return orig.call(this,stage,mode)}});
