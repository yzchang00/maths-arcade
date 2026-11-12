/* ================= LEADERBOARD + USAGE LOG =================
   Works only when backend.js (GitHub Pages version) has connected to Firebase and set window.ARCB.
   Without it (e.g. the Claude artifact), none of this shows and the games work exactly as before. */
const SID=Math.random().toString(36).slice(2,10);
function arcMe(){try{return JSON.parse(localStorage.getItem('arcMe')||'null')}catch(e){return null}}
function arcSetMe(m){try{localStorage.setItem('arcMe',JSON.stringify(m))}catch(e){}}
function arcLog(event,game,score){if(!window.ARCB)return;const me=arcMe();
  window.ARCB.log({event,game:game||'',score:score==null?-1:Math.max(0,Math.min(1000,Math.round(score))),nick:me?me.nick:'',cls:me?me.cls:'',sid:SID,device:innerWidth<600?'phone':innerWidth<1000?'tablet':'computer'}).catch(()=>{})}
/* difficulty of the game just played: Easy / Medium / Hard for normal games, '-' for games with their own start screen */
const DIFFS=[['easy','Easy'],['mixed','Medium'],['hard','Hard'],['old','Older']],DIFFPTS={easy:1,mixed:2,hard:3,old:1};
/* Champion points for one result: 3 stars in Solo. Easy/Medium/Hard = 1/2/3; scores saved before levels existed ("old") = 1; PSLE Quest = 3. */
const CHAMP_EXTRA={'p6-quest':3};
/* Vault Cracker gold adds up over 10 levels, so it needs a bigger cap than other games (must match maxScore in firestore.rules) */
const SCORECAP={'p5-vault':20000};
const champPts=(game,diff,stars)=>stars!==3?0:hasDiff(game)?(DIFFPTS[diff]||0):(CHAMP_EXTRA[game]||0);
/* class must look like a class: letters, numbers or a dash, starting with a letter or number (e.g. 5B, P5-2, 6E1) */
const okClass=c=>c===''||/^[A-Z0-9][A-Z0-9-]{0,7}$/.test(c);
const hasDiff=id=>GAMES[id]&&!GAMES[id].custom&&!GAMES[id].ownStart;
async function arcReport(id,score,o={}){if(!window.ARCB)return;const me=arcMe();if(!o.again)arcLog('finish',id,score);
  if(!me||!me.nick){lbNote('<button class="btn" id="lbJoin">🏆 Add my name to the leaderboard</button>',()=>$('lbJoin').onclick=()=>playerPrompt(()=>arcReport(id,score,{...o,again:1})));return}
  if(me.cls&&!okClass(String(me.cls).toUpperCase()))return lbNote(`Your class "${esc(me.cls)}" doesn't look like a class. <button class="btn sm" id="lbFix">Fix my class</button>`,()=>$('lbFix').onclick=()=>playerPrompt(()=>arcReport(id,score,{...o,again:1})));
  const G=GAMES[id],diff=o.diff||(hasDiff(id)&&ctx&&ctx.id===id?ctx.level:'-');
  try{const res=await window.ARCB.post({game:id,title:G.title,level:G.level,diff,nick:me.nick,cls:me.cls||'',score:Math.max(0,Math.min(SCORECAP[id]||1000,Math.round(score))),stars:o.stars==null?-1:o.stars,mode:o.mode||'solo'});
    if(res&&res.taken)return lbNote(`Someone on another device already uses the name <b>${esc(me.nick)}</b>${me.cls?' in '+esc(me.cls):''}. <button class="btn sm" id="lbRename">Pick a different nickname</button>`,()=>$('lbRename').onclick=()=>playerPrompt(()=>arcReport(id,score,{...o,again:1})));
    const rows=bestPer(window.ARCB.rank?await window.ARCB.rank(id,diff):(await window.ARCB.top(id)).filter(r=>r.diff===diff));const k=rows.findIndex(r=>r.nick===me.nick&&r.cls===(me.cls||''));
    const dn=diff!=='-'?` (${LVNAME[diff]})`:'',pts=champPts(id,diff,o.stars);
    lbNote(`🏆 Score saved${k>=0?` · you are <b>#${k+1}</b> of ${rows.length} for ${esc(G.title)}${dn}`:''}. <button class="btn sm" id="lbSee">See the leaderboard</button>${pts?`<br>⭐ 3 stars${diff!=='-'?' on '+LVNAME[diff]:''}: worth ${pts} Champion point${pts>1?'s':''}!`:''}`,
      ()=>$('lbSee').onclick=()=>lbPopup(id,diff))}
  catch(e){lbNote('Could not reach the leaderboard just now. Your game still counts on this device.')}}
function lbNote(html,wire){const end=document.querySelector('#gStage .end, #vmOver .end, .ptover .end, .rqrep');if(!end)return;let n=end.querySelector('.lbnote');if(!n){n=document.createElement('p');n.className='lbnote';end.appendChild(n)}n.innerHTML=html;if(wire)wire()}
/* keep each player's best score only, highest first */
function bestPer(rows){const m=new Map();rows.forEach(r=>{const k=r.nick+'|'+(r.cls||'');if(!m.has(k)||m.get(k).score<r.score||(m.get(k).score===r.score&&r.t<m.get(k).t))m.set(k,r)});return [...m.values()].sort((a,b)=>b.score-a.score||a.t-b.t)}
function playerPrompt(after){const old=arcMe()||{nick:'',cls:''};const o=document.createElement('div');o.className='zoomov lbmodal';
  o.innerHTML=`<div class="end"><span class="tag">Who's playing?</span><h3>Pick a nickname</h3><p style="margin:0">Use a nickname, <b>not your full name</b>. It shows on the leaderboard.</p>
    <label class="row"><b>Nickname</b><input class="num" id="lbNick" maxlength="14" style="width:10em" value="${esc(old.nick)}" placeholder="e.g. Speedy Sam"></label>
    <label class="row"><b>Class</b><input class="num" id="lbCls" maxlength="8" style="width:6em" value="${esc(old.cls)}" placeholder="e.g. 5B"></label><p id="lbErr" class="askneed"></p>
    <div class="row"><button class="btn primary" id="lbOk">Save</button><button class="btn" id="lbGuest">Play as guest</button></div>
    ${window.ARCB&&window.ARCB.canSignIn&&!window.ARCB.user?`<p style="margin:6px 0 0">Have a Google account? Sign in to keep your progress on any device. (Optional)</p><div class="row"><button class="btn" id="lbGoogle">☁️ Sign in with Google</button></div>`:''}</div>`;
  document.body.appendChild(o);$('lbNick').focus();
  const close=()=>{o.remove();if(location.hash===''||location.hash==='#')hub()};
  $('lbGuest').onclick=()=>{arcSetMe({nick:'',cls:'',guest:1});close()};
  const g=$('lbGoogle');if(g)g.onclick=async()=>{$('lbErr').textContent='';try{await arcSignIn();const m=arcMe();if(m&&m.nick){close();if(after)after()}else{g.parentNode.previousElementSibling.textContent='Signed in! Now type a nickname and press Save.';g.remove();$('lbNick').focus()}}catch(e){$('lbErr').textContent='Sign-in did not finish. You can still type a nickname and press Save.'}};
  $('lbOk').onclick=()=>{const nick=$('lbNick').value.trim().replace(/\s+/g,' '),cls=$('lbCls').value.trim().toUpperCase().replace(/\s+/g,'');
    if(nick.length<2)return $('lbErr').textContent='Type a nickname with at least 2 letters.';if(isBadNick(nick))return $('lbErr').textContent='Please choose a kinder nickname.';if(isBadNick(cls)||!okClass(cls))return $('lbErr').textContent='Type your class like 5B or P5-2 (letters and numbers only), or leave it empty.';
    arcSetMe({nick,cls});arcLog('join');sfx.ok();close();if(after)after()}}
function hubPlayerBar(){if(!window.ARCB)return '';const me=arcMe();
  return `<div class="row lbbar">${me&&me.nick?`<span class="pill">👤 ${esc(me.nick)}${me.cls?' · '+esc(me.cls):''}</span>`:'<span class="pill">👤 Guest</span>'}<button class="btn" id="lbWho">${me&&me.nick?'Change':'Add my name'}</button><a class="btn primary" href="#leaderboard" style="text-decoration:none;display:inline-flex;align-items:center">🏆 Champions</a>${!window.ARCB.canSignIn?'':window.ARCB.user?`<span class="pill" title="Your progress is saved to your Google account">☁️ Saved${window.ARCB.user.first?' · '+esc(window.ARCB.user.first):''}</span><button class="btn" id="lbOut">Sign out</button>`:'<button class="btn" id="lbIn">☁️ Save my progress</button>'}</div>`}
function wireHubPlayer(){const b=$('lbWho');if(b)b.onclick=()=>playerPrompt();
  const i=$('lbIn');if(i)i.onclick=async()=>{try{await arcSignIn();if(!(arcMe()||{}).nick)playerPrompt()}catch(e){}};
  const o=$('lbOut');if(o)o.onclick=async()=>{if(!confirm('Sign out? Your progress stays saved in your Google account, and this device will start fresh.'))return;await window.ARCB.signOut();hub()}}
async function arcSignIn(){await window.ARCB.signIn();for(let k=0;k<40&&!window.ARCB.user;k++)await new Promise(r=>setTimeout(r,150));arcLog('signin')}
addEventListener('arcb-auth',()=>{const h=location.hash.slice(1);if(!h&&!document.querySelector('.lbmodal'))hub()});
const lbRows=(r,me)=>{if(!r.length)return '<p>No scores yet. Be the first!</p>';
  const isMe=x=>x.nick===me.nick&&x.cls===(me.cls||''),val=x=>`${x.score}${x.stars>=0?` <small>${'★'.repeat(x.stars)}</small>`:''}${x.sub?` <small class="pts">${x.sub}</small>`:''}`,mood=['party','wave','cheer'];
  const step=i=>{const x=r[i];if(!x)return `<div class="lbp-col lbp-${i+1} lbp-none"><div class="lbp-who"><b>—</b><span class="lbc">No one yet</span></div><div class="lbp-block"><span>${i+1}</span></div></div>`;
    return `<div class="lbp-col lbp-${i+1}${isMe(x)?' lbp-me':''}"><div class="lbp-who"><span class="lbp-medal">${['🥇','🥈','🥉'][i]}</span><b>${esc(safeNick(x.nick))}</b><span class="lbc">${esc(isBadNick(x.cls)?'':x.cls||'')}</span><span class="lbs">${val(x)}</span></div><div class="lbp-q">${QUBI.replace('class="qubi"',`class="qubi ${mood[i]}"`)}</div><div class="lbp-block"><span>${i+1}</span></div></div>`};
  return `<div class="lbp">${step(1)}${step(0)}${step(2)}</div>${r.length>3?`<ol class="lbrows" start="4">${r.slice(3).map((x,i)=>`<li class="${isMe(x)?'me':''}"><span class="lbr">${i+4}</span><b>${esc(safeNick(x.nick))}</b><span class="lbc">${esc(isBadNick(x.cls)?'':x.cls||'')}</span><span class="lbs">${val(x)}</span></li>`).join('')}</ol>`:''}`};
/* one game's leaderboard, in a pop-up so pupils can check it from the game's start screen */
function lbPopup(gid,diff){const G=GAMES[gid];if(!G)return;const me=arcMe()||{},dd=hasDiff(gid);let cls='',rows=null;diff=dd?(diff&&diff!=='-'?diff:(ctx&&ctx.id===gid?ctx.level:getLvl(gid))):'-';
  const o=document.createElement('div');o.className='zoomov lbmodal';
  o.innerHTML=`<div class="end lbpop"><div class="row" style="justify-content:space-between"><span class="tag">🏆 Leaderboard</span><button class="btn sm" id="lpX" aria-label="Close">✕ Close</button></div><h3>${esc(G.title)}</h3>
    ${dd?`<div class="levels lbtabs" role="group" aria-label="Difficulty">${DIFFS.map(([k,t])=>`<button aria-pressed="${k===diff}" data-d="${k}" ${k==='old'?'hidden title="Scores saved before Easy/Medium/Hard levels were added"':''}>${t}</button>`).join('')}</div>`:''}
    <div class="row"><select id="lpC" class="num" style="width:auto"><option value="">All classes</option>${me.cls?`<option value="${esc(me.cls)}">Only ${esc(me.cls)}</option>`:''}</select></div>
    <div id="lpList" class="lblist"><p>Loading…</p></div><p class="qs">Each player's best score${dd?' on this level':''}. Solo, vs Robot and online-room games count. Pass &amp; play does not.</p></div>`;
  document.body.appendChild(o);sfx.pop();
  const close=()=>o.remove();$('lpX').onclick=close;o.addEventListener('click',e=>{if(e.target===o)close()});
  const draw=()=>{if(!rows)return;$('lpList').innerHTML=lbRows(bestPer(rows.filter(x=>(!dd||x.diff===diff)&&(!cls||x.cls===cls))).slice(0,30),me)};
  o.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{diff=b.dataset.d;o.querySelectorAll('[data-d]').forEach(x=>x.setAttribute('aria-pressed',x===b));sfx.tap();draw()});
  $('lpC').onchange=()=>{cls=$('lpC').value;draw()};
  if(!window.ARCB){$('lpList').innerHTML='<p>The leaderboard is only available on the class website.</p>';return}
  window.ARCB.top(gid).then(r=>{rows=r;const ob=o.querySelector('[data-d=old]');if(ob&&r.some(x=>x.diff==='old'))ob.hidden=false;
    /* if the chosen level has no scores yet, open the first level that does */
    if(dd&&!r.some(x=>x.diff===diff)){const k=DIFFS.map(d=>d[0]).find(k=>r.some(x=>x.diff===k));if(k){diff=k;o.querySelectorAll('[data-d]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.d===k))}}
    draw()}).catch(()=>{$('lpList').innerHTML='<p>Could not load the leaderboard. Check your internet connection.</p>'})}
/* Arcade Champions: 3-star solo results (see champPts), each game counted once at its best value */
function champRows(rows){const P=new Map();
  rows.forEach(r=>{const pts=GAMES[r.game]?champPts(r.game,r.diff,r.stars):0;if(!pts)return;const k=r.nick+'|'+(r.cls||'');const p=P.get(k)||{nick:r.nick,cls:r.cls,g:{},t:0};
    p.g[r.game]=Math.max(p.g[r.game]||0,pts);p.t=Math.max(p.t,r.t);P.set(k,p)});
  return [...P.values()].map(p=>{const v=Object.values(p.g);return {nick:p.nick,cls:p.cls,score:v.reduce((a,b)=>a+b,0),games:v.length,hard:v.filter(x=>x===3).length,t:p.t,stars:-1}})
    .sort((a,b)=>b.score-a.score||b.hard-a.hard||a.t-b.t)}
async function boardView(gid){if(gid&&GAMES[gid]){history.replaceState(null,'','#leaderboard');setTimeout(()=>lbPopup(gid),50)}
  const me=arcMe()||{};let cls='',rows=null;const ids=ORDER.filter(id=>GAMES[id]);
  $('view').innerHTML=`<div style="display:grid;gap:14px"><div class="gbar"><a class="back" href="#">← All games</a></div><h2 style="margin:0;font:700 2rem var(--display)">🏆 Arcade Champions</h2>
    <div class="howcard champhow"><b>How to earn Champion points</b><ol class="howlist"><li>Play a game in <b>Solo</b> and get <b>3 stars</b>.</li><li>⭐ Easy = <b>1 point</b>, ⚡ Medium = <b>2 points</b>, 🔥 Hard = <b>3 points</b>.</li><li>🗺️ <b>PSLE Quest</b>: 3 stars = <b>3 points</b>. Scores saved before levels were added count as Easy.</li><li>Each game counts once, at the hardest level you got 3 stars on. Master more games to climb!</li><li class="qs" style="list-style:none">Party games, Vault Cracker and multiplayer games have their own leaderboards but don't give Champion points.</li></ol></div>
    <div class="row"><select id="lbC" class="num" style="width:auto"><option value="">All classes</option>${me.cls?`<option value="${esc(me.cls)}">Only ${esc(me.cls)}</option>`:''}</select>
    <select id="lbG" class="num" style="width:auto"><option value="">See one game's leaderboard…</option>${['P4','P5','P6','All levels'].map(l=>`<optgroup label="${l}">${ids.filter(id=>GAMES[id].level===l).map(id=>`<option value="${id}">${esc(GAMES[id].title)}</option>`).join('')}</optgroup>`).join('')}</select></div>
    <div id="lbList" class="lblist"><p>Loading…</p></div></div>`;
  const draw=()=>{if(!rows)return;const r=champRows(rows.filter(x=>!cls||x.cls===cls)).slice(0,30).map(x=>({...x,sub:`pts · ${x.games} game${x.games===1?'':'s'}${x.hard?`, ${x.hard} worth 3`:''}`}));
    $('lbList').innerHTML=r.length?lbRows(r,me):'<p>No champions yet. Get 3 stars in any Solo game to be the first!</p>'};
  $('lbC').onchange=()=>{cls=$('lbC').value;draw()};$('lbG').onchange=()=>{const g=$('lbG').value;$('lbG').value='';if(g)lbPopup(g)};
  if(!window.ARCB){$('lbList').innerHTML='<p>The leaderboard is only available on the class website.</p>';return}
  try{rows=await window.ARCB.champs();draw()}catch(e){$('lbList').innerHTML='<p>Could not load the leaderboard. Check your internet connection.</p>'}}
addEventListener('arcb-ready',()=>{const h=location.hash.slice(1);if(GAMES[h]&&!$('gLb')){const r=document.querySelector('.gbar .row');if(r){r.insertAdjacentHTML('afterbegin','<button class="btn gbtn" id="gLb" title="See the top scores for this game">🏆 Leaderboard</button>');$('gLb').onclick=()=>{sfx.tap();lbPopup(h)}}}if(!h||h==='')hub();else if(h.startsWith('leaderboard'))boardView(h.split('/')[1]);arcLog('open');
  const me=arcMe();if(!me&&(!h||h===''))setTimeout(()=>{if(!arcMe())playerPrompt()},400)});
