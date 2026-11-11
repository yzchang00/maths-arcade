/* ================= LEADERBOARD + USAGE LOG =================
   Works only when backend.js (GitHub Pages version) has connected to Firebase and set window.ARCB.
   Without it (e.g. the Claude artifact), none of this shows and the games work exactly as before. */
const SID=Math.random().toString(36).slice(2,10);
function arcMe(){try{return JSON.parse(localStorage.getItem('arcMe')||'null')}catch(e){return null}}
function arcSetMe(m){try{localStorage.setItem('arcMe',JSON.stringify(m))}catch(e){}}
const BADNICK=/(fuck|shit|bitch|cunt|dick|pussy|sex|porn|nigg|fag|idiot|stupid|bodoh|knn|ccb|lanjiao|chibai|pukimak)/i;
function arcLog(event,game,score){if(!window.ARCB)return;const me=arcMe();
  window.ARCB.log({event,game:game||'',score:score==null?-1:Math.max(0,Math.min(1000,Math.round(score))),nick:me?me.nick:'',cls:me?me.cls:'',sid:SID,device:innerWidth<600?'phone':innerWidth<1000?'tablet':'computer'}).catch(()=>{})}
async function arcReport(id,score,o={}){if(!window.ARCB)return;const me=arcMe();if(!o.again)arcLog('finish',id,score);
  if(!me||!me.nick){lbNote('<button class="btn" id="lbJoin">🏆 Add my name to the leaderboard</button>',()=>$('lbJoin').onclick=()=>playerPrompt(()=>arcReport(id,score,{...o,again:1})));return}
  const G=GAMES[id];
  try{await window.ARCB.post({game:id,title:G.title,level:G.level,nick:me.nick,cls:me.cls||'',score:Math.max(0,Math.min(1000,Math.round(score))),stars:o.stars==null?-1:o.stars,mode:o.mode||'solo'});
    const rows=bestPer(await window.ARCB.top(id));const k=rows.findIndex(r=>r.nick===me.nick&&r.cls===(me.cls||''));
    lbNote(`🏆 Score saved to the leaderboard${k>=0?` · you are <b>#${k+1}</b> of ${rows.length} for ${esc(G.title)}`:''}. <a href="#leaderboard/${id}">See the leaderboard →</a>`)}
  catch(e){lbNote('Could not reach the leaderboard just now. Your game still counts on this device.')}}
function lbNote(html,wire){const end=document.querySelector('#gStage .end, #vmOver .end, .ptover .end, .rqrep');if(!end)return;let n=end.querySelector('.lbnote');if(!n){n=document.createElement('p');n.className='lbnote';end.appendChild(n)}n.innerHTML=html;if(wire)wire()}
/* keep each player's best score only, highest first */
function bestPer(rows){const m=new Map();rows.forEach(r=>{const k=r.nick+'|'+(r.cls||'');if(!m.has(k)||m.get(k).score<r.score||(m.get(k).score===r.score&&r.t<m.get(k).t))m.set(k,r)});return [...m.values()].sort((a,b)=>b.score-a.score||a.t-b.t)}
function playerPrompt(after){const old=arcMe()||{nick:'',cls:''};const o=document.createElement('div');o.className='zoomov lbmodal';
  o.innerHTML=`<div class="end"><span class="tag">Who's playing?</span><h3>Pick a nickname</h3><p style="margin:0">Use a nickname, <b>not your full name</b>. It shows on the leaderboard.</p>
    <label class="row"><b>Nickname</b><input class="num" id="lbNick" maxlength="14" style="width:10em" value="${esc(old.nick)}" placeholder="e.g. Speedy Sam"></label>
    <label class="row"><b>Class</b><input class="num" id="lbCls" maxlength="8" style="width:6em" value="${esc(old.cls)}" placeholder="e.g. 5B"></label><p id="lbErr" class="askneed"></p>
    <div class="row"><button class="btn primary" id="lbOk">Save</button><button class="btn" id="lbGuest">Play as guest</button></div></div>`;
  document.body.appendChild(o);$('lbNick').focus();
  const close=()=>{o.remove();if(location.hash===''||location.hash==='#')hub()};
  $('lbGuest').onclick=()=>{arcSetMe({nick:'',cls:'',guest:1});close()};
  $('lbOk').onclick=()=>{const nick=$('lbNick').value.trim().replace(/\s+/g,' '),cls=$('lbCls').value.trim().toUpperCase().replace(/\s+/g,'');
    if(nick.length<2)return $('lbErr').textContent='Type a nickname with at least 2 letters.';if(BADNICK.test(nick))return $('lbErr').textContent='Please choose a kinder nickname.';
    arcSetMe({nick,cls});arcLog('join');sfx.ok();close();if(after)after()}}
function hubPlayerBar(){if(!window.ARCB)return '';const me=arcMe();
  return `<div class="row lbbar">${me&&me.nick?`<span class="pill">👤 ${esc(me.nick)}${me.cls?' · '+esc(me.cls):''}</span>`:'<span class="pill">👤 Guest</span>'}<button class="btn" id="lbWho">${me&&me.nick?'Change':'Add my name'}</button><a class="btn primary" href="#leaderboard" style="text-decoration:none;display:inline-flex;align-items:center">🏆 Leaderboard</a></div>`}
function wireHubPlayer(){const b=$('lbWho');if(b)b.onclick=()=>playerPrompt()}
async function boardView(gid){const ids=ORDER.filter(id=>id!=='p6-quest'||true);if(!gid||!GAMES[gid])gid=ids.find(id=>GAMES[id].level===level)||ids[0];
  const me=arcMe()||{};let span='all',cls='';
  $('view').innerHTML=`<div style="display:grid;gap:14px"><div class="gbar"><a class="back" href="#">← All games</a></div><h2 style="margin:0;font:700 2rem var(--display)">🏆 Leaderboard</h2>
    <div class="row"><select id="lbG" class="num" style="width:auto">${['P4','P5','P6','All levels'].map(l=>`<optgroup label="${l}">${ids.filter(id=>GAMES[id].level===l).map(id=>`<option value="${id}" ${id===gid?'selected':''}>${esc(GAMES[id].title)}</option>`).join('')}</optgroup>`).join('')}</select>
    <select id="lbC" class="num" style="width:auto"><option value="">All classes</option>${me.cls?`<option value="${esc(me.cls)}">Only ${esc(me.cls)}</option>`:''}</select></div><div id="lbList" class="lblist"><p>Loading…</p></div><p class="qs">Each player's best score is shown.</p></div>`;
  let rows=[];
  const draw=()=>{const now=Date.now(),cut=span==='today'?new Date().setHours(0,0,0,0):span==='week'?now-7*864e5:0;
    const r=bestPer(rows.filter(x=>x.t>=cut&&(!cls||x.cls===cls))).slice(0,30);
    $('lbList').innerHTML=r.length?`<ol class="lbrows">${r.map((x,i)=>`<li class="${x.nick===me.nick&&x.cls===(me.cls||'')?'me':''}"><span class="lbr">${i<3?['🥇','🥈','🥉'][i]:i+1}</span><b>${esc(x.nick)}</b><span class="lbc">${esc(x.cls||'')}</span><span class="lbs">${x.score}${x.stars>=0?` <small>${'★'.repeat(x.stars)}</small>`:''}</span></li>`).join('')}</ol>`:'<p>No scores yet. Be the first!</p>'};
  const load=async()=>{$('lbList').innerHTML='<p>Loading…</p>';try{rows=await window.ARCB.top(gid);draw()}catch(e){$('lbList').innerHTML='<p>Could not load the leaderboard. Check your internet connection.</p>'}};
  $('lbG').onchange=()=>{gid=$('lbG').value;history.replaceState(null,'','#leaderboard/'+gid);load()};$('lbC').onchange=()=>{cls=$('lbC').value;draw()};
  if(!window.ARCB){$('lbList').innerHTML='<p>The leaderboard is only available on the class website.</p>';return}load()}
addEventListener('arcb-ready',()=>{const h=location.hash.slice(1);if(!h||h==='')hub();else if(h.startsWith('leaderboard'))boardView(h.split('/')[1]);arcLog('open');
  const me=arcMe();if(!me&&(!h||h===''))setTimeout(()=>{if(!arcMe())playerPrompt()},400)});
