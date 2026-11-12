/* ================= PARTY GAMES (all levels) =================
   Custom games with their own start screen. Each start screen shows the How-to-play steps first. */
const PT={timer(fn,ms){const c=ctx;const t=setTimeout(()=>{if(ctx===c&&!c.dead)fn()},ms);c.timers.push(t);return t},
  every(fn,ms){const c=ctx;const t=setInterval(()=>{if(ctx===c&&!c.dead)fn();else clearInterval(t)},ms);c.timers.push(t);return t}};
const PLV=()=>(typeof level!=='undefined'&&level)||'P4';
function partyStart(stage,id,mode,extra,onGo){const H=HOWTO[id]||{steps:[]},G=GAMES[id];
  if(mode==='pass'&&!(PASS&&PASS.length>=2))PASS=['Player 1','Player 2'];
  stage.innerHTML=`<div class="howcard"><span class="howic" aria-hidden="true">📖</span><span class="tag">Before you start</span><h3>How to play ${esc(G.title)}</h3><ol class="howlist">${H.steps.map(t=>`<li>${t}</li>`).join('')}</ol>${H.eg?`<p class="howeg"><b>Example:</b> ${H.eg}</p>`:''}
    <div class="pset">${extra||''}
    ${mode==='pass'?`<div class="row">${[0,1].map(i=>`<label class="row"><b>Player ${i+1}</b><input class="num" style="width:9em" maxlength="14" id="ptN${i}" value="${esc(PASS[i])}"></label>`).join('')}</div>`:''}
    ${mode==='bot'||(mode==='solo'&&id!=='party-bingo')?`<div class="row"><b>Robot:</b>${['easy','mixed','hard'].map(l=>`<label class="pchip"><input type="radio" name="ptBot" value="${l}" ${l==='mixed'?'checked':''}> ${BOT[l].name}</label>`).join('')}</div>`:''}</div>
    <button class="btn primary" id="ptGo">I'm ready, let's play! ▶</button></div>`;
  qubi('gQ','wave','Read the rules first!',true);
  $('ptGo').onclick=()=>{if(mode==='pass')PASS=[0,1].map(i=>{const v=$('ptN'+i).value.trim().slice(0,14);return isBadNick(v)?`Player ${i+1}`:v||`Player ${i+1}`});
    const bl=(stage.querySelector('input[name=ptBot]:checked')||{}).value||'mixed';const sel={};stage.querySelectorAll('[data-pset]').forEach(x=>{if(x.type==='radio'){if(x.checked)sel[x.name]=x.value}else sel[x.dataset.pset]=x.value});
    sfx.ok();document.body.classList.add('playing');onGo({bot:bl,names:mode==='pass'?PASS.slice(0,2):mode==='class'?['Class']:['You','🤖 '+BOT[bl].name],sel});fitView()};fitView()}
const topicPick=(name,opts,def)=>`<div class="row"><b>Questions:</b>${opts.map(([k,t])=>`<label class="pchip"><input type="radio" data-pset name="${name}" value="${k}" ${k===def?'checked':''}> ${t}</label>`).join('')}</div>`;
function partyEnd(stage,title,lines,again){document.body.classList.remove('playing');sfx.win();confetti(110);qubi('gQ','party','What a game!');
  const o=document.createElement('div');o.className='ptover';o.innerHTML=`<div class="end"><span class="tag">Game over</span><h3>${title}</h3>${lines.map(l=>`<p>${l}</p>`).join('')}<div class="row"><button class="btn primary" id="ptAgain">Play again</button><button class="btn" id="ptMenu">Game menu</button></div></div>`;
  stage.appendChild(o);$('ptAgain').onclick=()=>{sfx.tap();again()};$('ptMenu').onclick=()=>{sfx.tap();playGame(ctx.id)}}

/* ---------- Times Table Tug-of-War ---------- */
function tugQ(kind){
  const opt=(v,why)=>({v,why});
  if(kind==='t29'||kind==='t212'){const hi=kind==='t29'?9:12;let a=R(2,hi),b=R(2,hi);if(Math.random()<.5&&kind==='t29'){a=R(6,9);b=R(6,9)}
    if(Math.random()<.3){const p=a*b;const o=[opt(p+a,`${p+a} ÷ ${a} is ${b+1}, so that is ${a} × ${b+1}.`),opt(p-b,`${p-b} is ${a-1} × ${b}. Count one more group of ${b}.`),opt(a+b,`${a+b} is ${a} + ${b}. The sign is ×, not +.`)];
      return {q:`${p} ÷ ${a}`,a:b,o:[opt(b+1,`${a} × ${b+1} = ${a*(b+1)}, not ${p}.`),opt(b-1,`${a} × ${b-1} = ${a*(b-1)}, not ${p}.`),opt(p-a,`Divide, don't subtract: ${p} − ${a} = ${p-a}.`)],tip:`${a} × ${b} = ${p}, so ${p} ÷ ${a} = ${b}.`}}
    const p=a*b,sw=+String(p).split('').reverse().join('');
    return {q:`${a} × ${b}`,a:p,o:[opt(p+a,`${p+a} is ${a} × ${b+1}. One group too many.`),opt(p-a,`${p-a} is ${a} × ${b-1}. One group too few.`),opt(sw!==p&&sw>9?sw:a+b,sw!==p&&sw>9?`The digits are swapped: it is ${p}, not ${sw}.`:`${a+b} is ${a} + ${b}. The sign is ×, not +.`),opt(p+b,`${p+b} is ${a+1} × ${b}.`)].slice(0,3),tip:`${a} × ${b} = ${p}`}}
  if(kind==='p5'){const t=pick(['m10','d10','m10','tab']);if(t==='tab')return tugQ('t212');
    const n=pick([R(2,99)/10,R(11,999)/100,R(3,99)]),k=pick([10,100,1000]),m=t==='m10',v=m?n*k:n/k,f=x=>+x.toPrecision(10);
    return {q:`${fmtN(n)} ${m?'×':'÷'} ${fmt(k)}`,a:f(v),o:[opt(f(m?n*k/10:n/k*10),`That moved the digits only ${String(k).length-2} place${String(k).length-2===1?'':'s'}. ${m?'×':'÷'} ${fmt(k)} moves every digit ${String(k).length-1} places.`),opt(f(m?n/k:n*k),`That is the wrong way. ${m?'× makes it bigger':'÷ makes it smaller'}.`),opt(f(m?n*k*10:n/k/10),`That moved ${String(k).length} places. ${fmt(k)} has ${String(k).length-1} zeros, so move ${String(k).length-1} places.`)],tip:`${fmtN(n)} ${m?'×':'÷'} ${fmt(k)} = ${fmtN(f(v))}: move each digit ${String(k).length-1} place${k>10?'s':''} ${m?'left':'right'}.`}}
  const t=pick(['sq','cu','fof','pct','sq']);
  if(t==='sq'){const a=R(4,15);return {q:`${a}²`,a:a*a,o:[opt(a*2,`${a}² means ${a} × ${a}, not ${a} × 2.`),opt(a*a+a,`That is ${a} × ${a+1}.`),opt(a*a-a,`That is ${a} × ${a-1}.`)],tip:`${a}² = ${a} × ${a} = ${a*a}`}}
  if(t==='cu'){const a=R(2,6);return {q:`${a}³`,a:a**3,o:[opt(a*3,`${a}³ means ${a} × ${a} × ${a}, not ${a} × 3.`),opt(a*a,`That is ${a}², only two ${a}s.`),opt(a**3+a*a,'Multiply three times.')],tip:`${a}³ = ${a} × ${a} × ${a} = ${a**3}`}}
  if(t==='fof'){const d=pick([3,4,5,6,8]),n=R(1,d-1),m=R(3,9)*d;return {q:`${n}/${d} of ${m}`,a:m/d*n,o:[opt(m/d,`${m/d} is only 1/${d} of ${m}. You need ${n} of those parts.`),opt(m*n,`Find ${n}/${d} of ${m}: divide by ${d} first.`),opt(m-m/d*n,`That is the part that is left over.`)].filter((x,i,a)=>x.v!==m/d*n),tip:`${m} ÷ ${d} = ${m/d}, × ${n} = ${m/d*n}`}}
  const p=pick([10,20,25,50,75,30]),m=pick([40,60,80,120,200]);return {q:`${p}% of ${m}`,a:p*m/100,o:[opt(m-p,`${p}% of ${m} is not ${m} − ${p}.`),opt(p,`${p}% is not ${p}. Find ${p} out of every 100.`),opt(m-p*m/100,'That is the part that is left.')].filter(x=>x.v!==p*m/100),tip:`${p}% of ${m} = ${p/100} × ${m} = ${p*m/100}`}}
addGame('party-tug',{level:'All levels',strand:'party',glyph:'🪢',title:'Times Table Tug-of-War',topic:'Quick-fire facts race',
 how:'Two players pull a rope by answering quick-fire questions. Each right answer pulls the rope one step your way.',rounds:1,
 modes:[['solo','vs Robot'],['bot','vs Robot'],['pass','2 players']],
 custom(stage,mode){const lv=PLV();partyStart(stage,'party-tug',mode,topicPick('tugK',[['t29','Tables 2 to 9'],['t212','Tables 2 to 12'],['p5','× ÷ by 10, 100, 1000'],['p6','Squares, cubes, fractions, %']],lv==='P4'?'t29':lv==='P5'?'p5':'p6'),o=>tugGame(stage,mode,o))}});
function tugGame(stage,mode,o){const kind=o.sel.tugK||'t29',WIN=6,TIME=90,bot=mode!=='pass',B=BOT[o.bot];
  const S={pos:0,t:TIME,score:[0,0],wrong:[[],[]],lock:[0,0],over:false,q:[null,null]};
  stage.innerHTML=`<div class="tug"><div class="tughead"><span class="pill" id="tgT">⏱ ${TIME}s</span><span class="tag">First to pull the knot ${WIN} steps wins</span></div>
    <svg class="tugrope" viewBox="-170 -34 340 60" role="img" aria-label="Rope"><rect x="-170" y="-34" width="${170-WIN*24}" height="60" class="tgzone z0"/><rect x="${WIN*24}" y="-34" width="${170-WIN*24}" height="60" class="tgzone z1"/>
      ${Array.from({length:2*WIN+1},(_,i)=>`<line x1="${(i-WIN)*24}" y1="14" x2="${(i-WIN)*24}" y2="22" stroke="var(--muted)" stroke-width="${i===WIN?3:1.5}"/>`).join('')}
      <path d="M-150 -2 C-80 -8 80 4 150 -2" stroke="#b07a3c" stroke-width="7" fill="none" stroke-linecap="round"/><text x="-156" y="-8" font-size="26" text-anchor="middle">🧒</text><text x="156" y="-8" font-size="26" text-anchor="middle">${bot?'🤖':'👧'}</text>
      <g id="tgK" style="transition:transform .35s cubic-bezier(.3,1.6,.5,1)"><line x1="0" y1="-16" x2="0" y2="12" stroke="var(--tomato)" stroke-width="3"/><circle r="9" fill="var(--tomato)" stroke="var(--ink)" stroke-width="2"/></g></svg>
    <div class="tugsides">${[0,1].map(p=>`<div class="tgside s${p}" id="tgS${p}"><div class="tgname"><b>${esc(o.names[p])}</b><span class="pill" id="tgP${p}">0 right</span></div><div class="tgq" id="tgQ${p}"></div><div class="tgopts" id="tgO${p}"></div><div class="tgmsg" id="tgM${p}"></div></div>`).join('')}</div></div>`;
  const knot=()=>{$('tgK').style.transform=`translateX(${S.pos*24}px)`};
  const ask=p=>{if(S.over)return;const q=tugQ(kind);S.q[p]=q;$('tgQ'+p).innerHTML=`${q.q} = ?`;
    const opts=shuffle([{v:q.a},...q.o.filter((x,i,a)=>x.v!==q.a&&a.findIndex(y=>y.v===x.v)===i)].slice(0,4));
    $('tgO'+p).innerHTML=opts.map(x=>`<button class="btn tgb" ${p===1&&bot?'disabled':''} data-v="${x.v}">${fmtN(x.v)}</button>`).join('');
    if(!(p===1&&bot))$('tgO'+p).querySelectorAll('.tgb').forEach(b=>b.onclick=()=>answer(p,+b.dataset.v,b));
    if(p===1&&bot){const spd=[4200,3000,2200][['easy','mixed','hard'].indexOf(o.bot)]*(kind==='t29'?1:1.25);PT.timer(()=>{if(S.over||S.q[1]!==q)return;const right=Math.random()<B.acc;
      const pickV=right?q.a:(opts.find(x=>x.v!==q.a)||{v:q.a}).v;const btn=[...$('tgO1').children].find(b=>+b.dataset.v===pickV);answer(1,pickV,btn)},spd*(.7+Math.random()*.6))}};
  const answer=(p,v,btn)=>{if(S.over||S.lock[p]>Date.now())return;const q=S.q[p];
    if(v===q.a){S.score[p]++;S.pos+=p?1:-1;sfx.ok();btn&&btn.classList.add('ok');$('tgP'+p).textContent=`${S.score[p]} right`;$('tgM'+p).innerHTML='';knot();
      if(Math.abs(S.pos)>=WIN)return end();PT.timer(()=>ask(p),250)}
    else{sfx.no();btn&&btn.classList.add('no');const w=q.o.find(x=>x.v===v);S.wrong[p].push(`${q.q} = ${fmtN(q.a)}${w?` (not ${fmtN(v)}: ${w.why})`:''}`);
      $('tgM'+p).innerHTML=`<p class="retrymsg">❌ ${w?w.why:'Not that one.'} <b>${q.tip}</b></p>`;S.lock[p]=Date.now()+1800;
      $('tgO'+p).querySelectorAll('.tgb').forEach(b=>b.disabled=true);$('tgS'+p).classList.add('locked');PT.timer(()=>{$('tgS'+p).classList.remove('locked');ask(p)},1800)}};
  const end=()=>{if(S.over)return;S.over=true;const w=S.pos<0?0:S.pos>0?1:-1;
    const lines=[`${esc(o.names[0])}: ${S.score[0]} right · ${esc(o.names[1])}: ${S.score[1]} right`];
    [0,1].forEach(p=>{if(S.wrong[p].length&&!(p===1&&bot))lines.push(`<b>${esc(o.names[p])}, facts to practise:</b><br>${S.wrong[p].slice(0,6).join('<br>')}`)});
    if(w===0&&mode!=='pass'){const s=S.score[0]*10;setBest('party-tug',s>=60?3:s>=30?2:1)}
    if(mode!=='pass')setTimeout(()=>arcReport('party-tug',S.score[0],{mode}),80);partyEnd(stage,w<0?(mode==='pass'?`${esc(o.names[0])} wins!`:'You win! 🏆'):w>0?`${esc(o.names[1])} wins!`:'It’s a draw!',lines,()=>tugGame(stage,mode,o))};
  ask(0);ask(1);knot();
  PT.every(()=>{if(S.over)return;S.t--;$('tgT').textContent=`⏱ ${S.t}s`;if(S.t<=10)$('tgT').classList.add('hot');if(S.t<=0)end()},1000)}

/* ---------- Number Bingo ---------- */
function bingoClues(kind){const out=[],used=new Set(),add=c=>{if(c.a<1||c.a>200||!Number.isInteger(c.a)||used.has(c.a))return;used.add(c.a);out.push(c)};let guard=0;
  while(out.length<24&&guard++<4000){let c;const t=R(0,5);
    if(kind==='P4'){if(t<2){const a=R(3,9),b=R(3,12);c={c:`${a} × ${b}`,a:a*b,trap:[a+b,`${a} + ${b} = ${a+b}, but the sign is ×.`]}}
      else if(t===2){const d=pick([3,4,5,6,8]),n=R(1,d-1),m=d*R(2,9);c={c:`${n}/${d} of ${m}`,a:m/d*n,trap:[m/d,`${m/d} is only 1/${d} of ${m}. Take ${n} parts.`]}}
      else if(t===3){const a=R(2,9)*10+R(1,9);c={c:`${a} rounded to the nearest 10`,a:Math.round(a/10)*10,trap:[Math.floor(a/10)*10===Math.round(a/10)*10?Math.ceil(a/10)*10:Math.floor(a/10)*10,'Look at the ones digit: 5 or more rounds up, 4 or less rounds down.']}}
      else if(t===4){const a=pick([4,6,8,9,10,12]),b=pick([6,8,9,10,12,15]);if(a===b)continue;c={c:`the smallest common multiple of ${a} and ${b}`,a:lcm(a,b),trap:[a*b,`${a} × ${b} is a common multiple, but not the smallest.`]}}
      else{const p=R(3,9)*R(3,9),a=R(3,9);if(p%a)continue;c={c:`${p} ÷ ${a}`,a:p/a,trap:[p-a,'Divide, don’t subtract.']}}}
    else if(kind==='P5'){if(t<2){const a=R(2,9),b=R(2,9),cc=R(2,9);c={c:`${a} + ${b} × ${cc}`,a:a+b*cc,trap:[(a+b)*cc,`Multiply before you add: ${b} × ${cc} first.`]}}
      else if(t===2){const a=R(2,6),b=R(2,9),cc=R(2,5);c={c:`(${a} + ${b}) × ${cc}`,a:(a+b)*cc,trap:[a+b*cc,'Brackets first!']}}
      else if(t===3){const p=pick([10,20,25,50,75]),m=pick([40,60,80,120,200]);c={c:`${p}% of ${m}`,a:p*m/100,trap:[m-p,`${p}% of ${m} is not ${m} − ${p}.`]}}
      else if(t===4){const n=R(11,99)/10,k=pick([10,100]);c={c:`${n} × ${k}`,a:Math.round(n*k),trap:[Math.round(n*k/10),`× ${k} moves the digits ${k===10?1:2} place${k===10?'':'s'} left.`]}}
      else{const b=R(4,12),h=R(2,10)*2;c={c:`area of a triangle with base ${b} cm and height ${h} cm (in cm²)`,a:b*h/2,trap:[b*h,'Triangle area is ½ × base × height. Don’t forget the ½.']}}}
    else{if(t<2){const a=R(3,13);c={c:`${a}²`,a:a*a,trap:[2*a,`${a}² is ${a} × ${a}, not ${a} × 2.`]}}
      else if(t===2){const a=R(2,5);c={c:`${a}³`,a:a**3,trap:[3*a,`${a}³ is ${a} × ${a} × ${a}.`]}}
      else if(t===3){const x=R(2,12),k=R(2,6),b=R(1,15);c={c:`x when ${k}x + ${b} = ${k*x+b}`,a:x,trap:[(k*x+b)/k-b,`Take away ${b} from both sides first, then divide by ${k}.`]}}
      else if(t===4){const [a,b]=pick([[2,3],[3,5],[1,4],[2,5],[3,4]]),u=R(3,12);c={c:`the bigger share when ${(a+b)*u} is split in the ratio ${a} : ${b}`,a:b*u,trap:[(a+b)*u/b,`Total units = ${a} + ${b} = ${a+b}. 1 unit = ${(a+b)*u} ÷ ${a+b}.`]}}
      else{const p=pick([10,20,25,50]),n=pick([40,60,80,120,160]);c={c:`${n} increased by ${p}%`,a:n+n*p/100,trap:[n*p/100,'That is only the increase. Add it on.']}}}
    add(c)}
  return out}
addGame('party-bingo',{level:'All levels',strand:'party',glyph:'🎱',title:'Number Bingo',topic:'Whole-class or solo bingo with maths clues',
 how:'A clue is called. Work it out and mark the answer on your bingo card. Four in a row wins!',rounds:1,
 modes:[['solo','On my own'],['bot','vs Robot'],['class','Whole class','Project the clues. Pupils use paper cards.','🏫']],
 custom(stage,mode){const lv=PLV();partyStart(stage,'party-bingo',mode,topicPick('bgK',[['P4','P4 clues'],['P5','P5 clues'],['P6','P6 clues']],lv),o=>(mode==='class'?bingoClass:bingoGame)(stage,mode,o))}});
const lines4=[...[0,1,2,3].map(r=>[0,1,2,3].map(c=>r*4+c)),...[0,1,2,3].map(c=>[0,1,2,3].map(r=>r*4+c)),[0,5,10,15],[3,6,9,12]];
function bingoGame(stage,mode,o){const clues=shuffle(bingoClues(o.sel.bgK||'P4')),answers=clues.map(c=>c.a),bot=mode==='bot';
  const mine=shuffle(answers).slice(0,16),rob=shuffle(answers).slice(0,16),S={i:-1,mk:new Set(),rk:new Set(),over:false,miss:[],calls:0};
  stage.innerHTML=`<div class="bingo"><div class="bgcall" id="bgC"></div><div id="bgM"></div><div class="bgboards"><div><span class="tag">Your card</span><div class="bgcard" id="bgMine">${mine.map((n,i)=>`<button class="bgcell" data-i="${i}">${n}</button>`).join('')}</div>
    <div class="row"><button class="btn" id="bgNo">Not on my card ➜</button></div></div>${bot?`<div><span class="tag">🤖 ${BOT[o.bot].name}'s card</span><div class="bgcard rob" id="bgRob">${rob.map(n=>`<span class="bgcell">${n}</span>`).join('')}</div></div>`:''}</div></div>`;
  const won=set=>lines4.some(l=>l.every(i=>set.has(i)));
  const next=()=>{if(S.over)return;S.i++;if(S.i>=clues.length)return end(-1);const c=clues[S.i];S.calls++;S.first=true;
    $('bgC').innerHTML=`<span class="tag">Call ${S.i+1} of ${clues.length}</span><div class="bgclue">${c.c}</div>`;$('bgM').innerHTML='';sfx.pop();
    if(bot){const k=rob.indexOf(c.a);if(k>=0)PT.timer(()=>{{S.rk.add(k);$('bgRob').children[k].classList.add('on');if(won(S.rk))end(1)}},900+Math.random()*900)}};
  const wrong=msg=>{sfx.no();if(S.first){S.first=false;$('bgM').innerHTML=`<p class="retrymsg">🔁 ${msg}</p>`;return}
    const c=clues[S.i];S.miss.push(`${c.c} = ${c.a}`);$('bgM').innerHTML=`<p class="retrymsg">❌ The answer was <b>${c.a}</b>. ${mine.includes(c.a)?'It was on your card, but this chance is gone.':'It was not on your card.'}</p>`;PT.timer(next,2200)};
  $('bgMine').querySelectorAll('.bgcell').forEach(b=>b.onclick=()=>{if(S.over||S.i<0||b.classList.contains('on'))return;const c=clues[S.i],v=+b.textContent;
    if(v===c.a){b.classList.add('on');S.mk.add(+b.dataset.i);sfx.ok();$('bgM').innerHTML='';if(won(S.mk))return end(0);PT.timer(next,500);return}
    b.classList.add('shake');PT.timer(()=>b.classList.remove('shake'),400);wrong(c.trap&&v===c.trap[0]?c.trap[1]:`${v} is not the answer to “${c.c}”. Work it out again.`)});
  $('bgNo').onclick=()=>{if(S.over||S.i<0)return;const c=clues[S.i];if(!mine.includes(c.a)){sfx.tap();$('bgM').innerHTML=`<p class="asknote">Right, ${c.a} is not on your card.</p>`;PT.timer(next,900);return}
    wrong('Look again. The answer <b>is</b> on your card. Work the clue out carefully.')};
  const end=w=>{if(S.over)return;S.over=true;const lines=[`Calls used: ${S.calls}`];if(S.miss.length)lines.push(`<b>Clues to look at again:</b><br>${S.miss.join('<br>')}`);
    if(w===0)setBest('party-bingo',S.calls<=14?3:S.calls<=19?2:1);
    if(w===0)setTimeout(()=>arcReport('party-bingo',Math.max(1,30-S.calls),{mode}),80);partyEnd(stage,w===0?'BINGO! You win! 🏆':w===1?'🤖 Robo got Bingo first!':'Out of clues!',lines,()=>bingoGame(stage,mode,o))};
  PT.timer(next,600)}
function bingoClass(stage,mode,o){const clues=shuffle(bingoClues(o.sel.bgK||'P4')),S={i:-1};
  stage.innerHTML=`<div class="bingo class"><div class="bgprep" id="bgP"><span class="tag">Step 1 · pupils make their cards</span><h3>Draw a 4 × 4 grid. Write any 16 of these numbers in it.</h3>
    <div class="bgpool">${[...clues.map(c=>c.a)].sort((a,b)=>a-b).map(n=>`<span>${n}</span>`).join('')}</div><button class="btn primary" id="bgStart">Start calling ▶</button></div>
    <div id="bgRun" hidden><div class="bgcall big" id="bgC"></div><div class="row"><button class="btn" id="bgRev">Reveal answer</button><button class="btn primary" id="bgNext">Next clue ▶</button></div><div id="bgA"></div>
    <details class="bglog"><summary>Called so far (check a Bingo here)</summary><div id="bgL"></div></details></div></div>`;
  const show=()=>{const c=clues[S.i];$('bgC').innerHTML=`<span class="tag">Clue ${S.i+1} of ${clues.length}</span><div class="bgclue">${c.c}</div>`;$('bgA').innerHTML='';$('bgRev').disabled=false;sfx.pop()};
  $('bgStart').onclick=()=>{$('bgP').hidden=true;$('bgRun').hidden=false;S.i=0;show()};
  $('bgRev').onclick=()=>{const c=clues[S.i];$('bgRev').disabled=true;sfx.tap();$('bgA').innerHTML=`<p class="bgans">Answer: <b>${c.a}</b></p>${c.trap?`<p class="asknote">⚠️ Watch out: anyone who marked <b>${c.trap[0]}</b>? ${c.trap[1]}</p>`:''}`;
    $('bgL').insertAdjacentHTML('afterbegin',`<div>${S.i+1}. ${c.c} = <b>${c.a}</b></div>`)};
  $('bgNext').onclick=()=>{if(!$('bgRev').disabled)$('bgRev').onclick();if(S.i+1>=clues.length){$('bgC').innerHTML='<div class="bgclue">All clues called!</div>';$('bgNext').disabled=true;return}S.i++;show()}}

/* ---------- Fraction Wall Race ---------- */
const FW=[[1,2],[1,3],[1,4],[1,6],[1,12],[2,3],[3,4],[5,12],[1,6],[1,4],[1,3],[1,12],[5,6],[7,12]];
const FWROWS=[1,2,3,4,6,12];
function fwWall(){return `<div class="fwref">${FWROWS.map(d=>`<div class="fwr">${Array.from({length:d},()=>`<span>${d===1?'1':fr(1,d)}</span>`).join('')}</div>`).join('')}</div>`}
addGame('party-wall',{level:'All levels',strand:'party',glyph:'🧱',title:'Fraction Wall Race',topic:'Equivalent fractions and adding fractions',
 how:'Take turns to add fraction bricks to your wall. Fill exactly 2 whole bars first to win.',rounds:1,
 modes:[['solo','vs Robot'],['bot','vs Robot'],['pass','2 players']],
 custom(stage,mode){partyStart(stage,'party-wall',mode,'',o=>wallGame(stage,mode,o))}});
function wallGame(stage,mode,o){const bot=mode!=='pass',GOAL=2,S={turn:R(0,1),bars:[[[]],[[]]],done:[0,0],over:false,miss:[[],[]]};
  const used=b=>b.reduce((s,[n,d])=>s+n*12/d,0);
  stage.innerHTML=`<div class="fwall"><details class="fwhelp"><summary>📐 Show the fraction wall</summary>${fwWall()}</details>
    <div class="fwplayers">${[0,1].map(p=>`<div class="fwp" id="fwP${p}" style="--pc:${p?'var(--violet)':'var(--teal)'}"><div class="row"><b>${esc(o.names[p])}</b><span class="pill" id="fwD${p}">0 of ${GOAL} bars</span></div><div class="fwbar" id="fwB${p}"></div></div>`).join('')}</div>
    <div class="fwturn" id="fwT"></div></div>`;
  const cols=['#ffd27a','#ffb3c7','#bcd3fb','#bfe8cf','#d9c6ff','#f3c28b','#c6f0f0'];
  const draw=()=>{[0,1].forEach(p=>{const b=S.bars[p][S.bars[p].length-1];$('fwB'+p).innerHTML=`<div class="fwtrack">${b.map(([n,d],i)=>`<span class="fwbrick" style="flex:${n*12/d};background:${cols[(d+n)%cols.length]}">${fr(n,d)}</span>`).join('')}${used(b)<12?`<span class="fwgap" style="flex:${12-used(b)}"></span>`:''}</div><div class="fwticks">${Array.from({length:12},()=>'<i></i>').join('')}</div>`;
    $('fwD'+p).textContent=`${S.done[p]} of ${GOAL} bars`;$('fwP'+p).classList.toggle('now',S.turn===p&&!S.over)})};
  const qFor=(b,[n,d])=>{const before=used(b),after=before+n*12/d,right=frq(after,12),opts=[];
    if(b.length){const last=b.reduce((acc,x)=>radd(acc,x),[0,1]);const tt=frq(last[0]+n,last[1]+d);opts.push({v:tt,why:`You added the tops and the bottoms (${last[0]}+${n})/(${last[1]}+${d}). Use the wall: change both to twelfths, ${fr(before,12)} + ${fr(n*12/d,12)}.`});
      opts.push({v:frq(last[0]+n,Math.max(last[1],d)),why:`You added the tops but kept one bottom number. The pieces are different sizes, so change both to twelfths first.`})}
    else{if(d!==n*12/d&&d<12)opts.push({v:frq(d,12),why:`${fr(n,d)} is ${fr(n*12/d,12)}, not ${fr(d,12)}. A bigger bottom number means <b>smaller</b> pieces: ${d} of them make the whole bar.`});opts.push({v:frq(12-n*12/d||1,12),why:'That is how much is <b>left</b>, not how much is filled.'})}
    opts.push({v:frq(after+1,12),why:`Count the twelfths carefully: ${fr(before,12)} + ${fr(n*12/d,12)} = ${fr(after,12)}.`});
    const clean=opts.filter((x,i,a)=>x.v[0]*right[1]!==right[0]*x.v[1]&&a.findIndex(y=>y.v[0]*x.v[1]===x.v[0]*y.v[1])===i).slice(0,2);
    return {right,opts:shuffle([{v:right,ok:1},...clean]),before,after}};
  const turn=()=>{if(S.over)return;draw();const p=S.turn,b=S.bars[p][S.bars[p].length-1],left=12-used(b),cards=[pick(FW),pick(FW)];const isBot=bot&&p===1;
    $('fwT').innerHTML=`<div class="fwtc" style="--pc:${p?'var(--violet)':'var(--teal)'}"><h3>${isBot?'🤖 Robo’s turn':esc(o.names[p])+'’s turn'}</h3><p class="qs">Space left on the bar: <b>${fr(left,12)}</b>${frq(left,12)[1]!==12?` = ${rshow(frq(left,12))}`:''}. Pick a brick that fits.</p>
      <div class="row fwcards">${cards.map((c,i)=>`<button class="btn fwcard" data-i="${i}" ${isBot?'disabled':''}>${fr(c[0],c[1])}</button>`).join('')}<button class="btn" id="fwPass" ${isBot?'disabled':''}>Neither fits: pass</button></div><div id="fwM"></div></div>`;
    let tries=0;
    const choose=i=>{const c=cards[i],sz=c[0]*12/c[1];
      if(sz>left){tries++;sfx.no();$('fwM').innerHTML=`<p class="retrymsg">🔁 ${fr(c[0],c[1])} = ${fr(sz,12)}, but only ${fr(left,12)} is left. It will not fit!${c[1]>4&&sz>left?` (A bigger bottom number means <b>smaller</b> pieces, but ${c[0]} of them is still too many.)`:''}</p>`;if(tries>=2){S.miss[p].push(`${fr(c[0],c[1])} does not fit in ${fr(left,12)}`);return endTurn()}return}
      ask(c)};
    const ask=c=>{const Q=qFor(b,c);$('fwT').querySelector('.fwcards').innerHTML=`<span class="fwchosen">${fr(c[0],c[1])}</span><b>How much of the bar will be filled?</b>${Q.opts.map((x,i)=>`<button class="btn fwans" data-i="${i}" ${isBot?'disabled':''}>${rshow(x.v)}</button>`).join('')}`;$('fwM').innerHTML='';
      const pickA=(i)=>{const x=Q.opts[i],btn=$('fwT').querySelectorAll('.fwans')[i];if(x.ok){btn.classList.add('ok');sfx.ok();b.push(c);if(used(b)===12){S.done[p]++;confetti(50);$('fwM').innerHTML=`<p class="asknote">🎉 Bar complete! ${b.map(y=>fr(y[0],y[1])).join(' + ')} = 1 whole.</p>`;if(S.done[p]>=GOAL){draw();return PT.timer(()=>end(p),900)}S.bars[p].push([])}
          else $('fwM').innerHTML=`<p class="asknote">✅ ${fr(Q.before,12)} + ${fr(Q.after-Q.before,12)} = ${fr(Q.after,12)}${frq(Q.after,12)[1]!==12?` = ${rshow(Q.right)}`:''}</p>`;draw();return PT.timer(endTurn,isBot?1400:1500)}
        btn.classList.add('no');sfx.no();S.miss[p].push(x.why);$('fwM').innerHTML=`<p class="retrymsg">❌ ${x.why} The brick bounces off this turn.</p>`;PT.timer(endTurn,isBot?2200:3400)};
      if(isBot){const acc=BOT[o.bot].acc;PT.timer(()=>{const bad=Q.opts.findIndex(x=>!x.ok);pickA(Math.random()<acc||bad<0?Q.opts.findIndex(x=>x.ok):bad)},1300)}
      else $('fwT').querySelectorAll('.fwans').forEach((bt,i)=>bt.onclick=()=>{if($('fwT').querySelector('.fwans.ok,.fwans.no'))return;pickA(i)})};
    const pass=()=>{const fits=cards.some(c=>c[0]*12/c[1]<=left);if(fits&&!isBot){sfx.no();$('fwM').innerHTML=`<p class="retrymsg">🔁 One of these bricks does fit! Change each one to twelfths and compare with ${fr(left,12)}.</p>`;return}sfx.tap();endTurn()};
    if(isBot){const fit=cards.map((c,i)=>[c[0]*12/c[1],i]).filter(([s])=>s<=left).sort((a,b)=>b[0]-a[0]);PT.timer(()=>{if(!fit.length){$('fwM').innerHTML='<p class="asknote">🤖 Neither fits. Robo passes.</p>';return PT.timer(endTurn,1200)}
      $('fwT').querySelectorAll('.fwcard')[fit[0][1]].classList.add('ok');PT.timer(()=>ask(cards[fit[0][1]]),600)},1100)}
    else{$('fwT').querySelectorAll('.fwcard').forEach(bt=>bt.onclick=()=>choose(+bt.dataset.i));$('fwPass').onclick=pass}
    fitView()};
  const endTurn=()=>{if(S.over)return;S.turn=1-S.turn;turn()};
  const end=p=>{S.over=true;draw();const lines=[`${esc(o.names[0])}: ${S.done[0]} bars · ${esc(o.names[1])}: ${S.done[1]} bars`];
    [0,1].forEach(q=>{if(S.miss[q].length&&!(bot&&q===1))lines.push(`<b>${esc(o.names[q])}, things to remember:</b><br>${uniq(S.miss[q]).slice(0,4).join('<br>')}`)});
    if(p===0&&mode!=='pass')setBest('party-wall',S.miss[0].length===0?3:S.miss[0].length<3?2:1);
    if(p===0&&mode!=='pass')setTimeout(()=>arcReport('party-wall',Math.max(10,100-10*S.miss[0].length),{mode}),80);partyEnd(stage,mode==='pass'?`${esc(o.names[p])} wins!`:p===0?'You win! 🏆':'🤖 Robo wins this time!',lines,()=>wallGame(stage,mode,o))};
  turn()}
