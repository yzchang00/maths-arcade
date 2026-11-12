/* 8. Canteen Cashier — Decimals: four operations 2.1, 3.1, 3.2 */
const MENU=[['Chicken rice',350],['Fishball noodles',320],['Nasi lemak',280],['Mee goreng',300],['Milo',120],['Kopi',110],['Apple juice',150],['Banana',60],['Curry puff',140],['Kaya toast',180],['Ice cream',130]];
const $c=c=>'$'+(c/100).toFixed(2);
const CASH=[[1000,'$10','note n10'],[500,'$5','note n5'],[200,'$2','note n2'],[100,'$1','coin'],[50,'50¢','coin c50'],[20,'20¢','coin c20'],[10,'10¢','coin c10']];
const parseMoney=s=>{const v=parseFloat(String(s).replace(/[$\s,]/g,''));return isNaN(v)?null:Math.round(v*100)};
/* Canteen scene: a customer brings a tray, the student scans each item, tabulates the bill, then gives change. */
const ART={
  'Chicken rice':`<ellipse cx="30" cy="38" rx="26" ry="10" fill="#f4f6f8" stroke="#16233a" stroke-width="2"/><ellipse cx="24" cy="32" rx="13" ry="8" fill="#fffdf4" stroke="#16233a" stroke-width="1.5"/><path d="M33,28 l14,-3 3,6 -14,4z M35,34 l14,-2 1,5 -14,2z" fill="#f2c27b" stroke="#16233a" stroke-width="1.5"/><circle cx="16" cy="30" r="2.5" fill="#5fbf73"/>`,
  'Fishball noodles':`<path d="M6,26 h48 q-2,22 -24,24 q-22,-2 -24,-24z" fill="#ffffff" stroke="#16233a" stroke-width="2"/><path d="M10,26 q6,-6 12,0 t12,0 t12,0" fill="none" stroke="#f2d27b" stroke-width="3"/><circle cx="20" cy="22" r="5" fill="#f7f1e3" stroke="#16233a" stroke-width="1.5"/><circle cx="34" cy="21" r="5" fill="#f7f1e3" stroke="#16233a" stroke-width="1.5"/><path d="M44,6 l-6,22 M50,8 l-8,20" stroke="#8b5a2b" stroke-width="2.5"/>`,
  'Nasi lemak':`<path d="M8,44 L30,8 L52,44z" fill="#4caf50" stroke="#16233a" stroke-width="2"/><path d="M16,40 L30,16 L44,40z" fill="#fffdf4"/><circle cx="26" cy="34" r="4" fill="#d84315"/><ellipse cx="35" cy="32" rx="5" ry="4" fill="#ffcc80" stroke="#16233a" stroke-width="1"/>`,
  'Mee goreng':`<ellipse cx="30" cy="40" rx="26" ry="10" fill="#f4f6f8" stroke="#16233a" stroke-width="2"/><path d="M12,36 q6,-14 12,-4 t12,-4 t12,6" fill="none" stroke="#e8772e" stroke-width="5" stroke-linecap="round"/><path d="M14,40 q8,-10 16,-2 t16,-2" fill="none" stroke="#d9622b" stroke-width="4" stroke-linecap="round"/><circle cx="40" cy="30" r="3" fill="#5fbf73"/>`,
  'Milo':`<path d="M16,14 h28 l-4,38 h-20z" fill="#2e7d32" stroke="#16233a" stroke-width="2"/><rect x="14" y="10" width="32" height="6" rx="2" fill="#a1683a" stroke="#16233a" stroke-width="1.5"/><text x="30" y="38" text-anchor="middle" style="font:800 9px var(--body);fill:#fff">MILO</text>`,
  'Kopi':`<ellipse cx="30" cy="50" rx="22" ry="5" fill="#ffffff" stroke="#16233a" stroke-width="2"/><path d="M14,22 h30 q0,24 -15,26 q-15,-2 -15,-26z" fill="#ffffff" stroke="#16233a" stroke-width="2"/><ellipse cx="29" cy="23" rx="15" ry="4" fill="#6d4c41"/><path d="M44,28 q10,0 6,10 q-3,4 -8,2" fill="none" stroke="#16233a" stroke-width="2"/><path d="M24,14 q3,-4 0,-8 M32,14 q3,-4 0,-8" stroke="#9aa6b8" stroke-width="1.5" fill="none"/>`,
  'Apple juice':`<rect x="16" y="14" width="26" height="40" rx="3" fill="#c5e86c" stroke="#16233a" stroke-width="2"/><path d="M36,14 l4,-10 h4" stroke="#ef5240" stroke-width="2.5" fill="none"/><circle cx="29" cy="34" r="7" fill="#ef5240"/><path d="M29,27 v-3" stroke="#2e7d32" stroke-width="2"/>`,
  'Banana':`<path d="M8,20 q4,30 40,26 q6,-1 4,-5 q-30,4 -38,-23z" fill="#ffd54f" stroke="#16233a" stroke-width="2"/><path d="M8,20 l-2,-6" stroke="#6d4c41" stroke-width="3"/>`,
  'Curry puff':`<path d="M6,40 q24,-40 48,0z" fill="#f2b84b" stroke="#16233a" stroke-width="2"/><path d="M10,34 q20,-30 40,0" fill="none" stroke="#c98a20" stroke-width="2" stroke-dasharray="3 3"/>`,
  'Kaya toast':`<rect x="8" y="16" width="32" height="30" rx="8" fill="#e9b872" stroke="#16233a" stroke-width="2"/><rect x="12" y="20" width="24" height="22" rx="5" fill="#f6dfb0"/><rect x="20" y="22" width="32" height="30" rx="8" fill="#e9b872" stroke="#16233a" stroke-width="2"/><rect x="24" y="26" width="24" height="22" rx="5" fill="#9ccc65"/>`,
  'Ice cream':`<path d="M20,28 L30,56 L40,28z" fill="#e0a96d" stroke="#16233a" stroke-width="2"/><circle cx="30" cy="22" r="12" fill="#f8bbd0" stroke="#16233a" stroke-width="2"/><circle cx="26" cy="18" r="3" fill="#fff" opacity=".6"/>`};
const artSVG=(n,cls='')=>`<svg viewBox="0 0 60 60" class="iart ${cls}" aria-hidden="true">${ART[n]||''}</svg>`;
function kidSVG(k,mood){return `<svg viewBox="0 0 120 180" class="kid ${mood}" aria-hidden="true"><ellipse cx="60" cy="174" rx="30" ry="5" fill="#16233a" opacity=".15"/>
  <g class="kb"><rect x="44" y="128" width="12" height="42" rx="5" fill="${k.skin}"/><rect x="64" y="128" width="12" height="42" rx="5" fill="${k.skin}"/><rect x="40" y="162" width="18" height="10" rx="4" fill="#16233a"/><rect x="62" y="162" width="18" height="10" rx="4" fill="#16233a"/>
  <path d="M38,118 h44 l6,24 h-56z" fill="${k.bottom}" stroke="#16233a" stroke-width="2"/>
  <g class="ka"><path d="M34,92 q-14,16 -8,34" stroke="${k.skin}" stroke-width="10" stroke-linecap="round" fill="none"/></g><g class="kar"><path d="M86,92 q14,16 8,34" stroke="${k.skin}" stroke-width="10" stroke-linecap="round" fill="none"/></g>
  <rect x="34" y="84" width="52" height="40" rx="12" fill="#ffffff" stroke="#16233a" stroke-width="2"/><path d="M50,84 l10,12 10,-12" fill="none" stroke="#16233a" stroke-width="2"/><circle cx="74" cy="104" r="4" fill="${k.badge}"/>
  <circle cx="60" cy="52" r="30" fill="${k.skin}" stroke="#16233a" stroke-width="2"/>${k.hairPath}
  <g class="keo"><circle cx="49" cy="54" r="3.6" fill="#16233a"/><circle cx="71" cy="54" r="3.6" fill="#16233a"/></g><path class="keh" d="M44,56 q5,-6 10,0 M66,56 q5,-6 10,0" stroke="#16233a" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="42" cy="64" r="4.5" fill="#ff8fa3" opacity=".6"/><circle cx="78" cy="64" r="4.5" fill="#ff8fa3" opacity=".6"/>
  <path class="ksm" d="M52,66 q8,7 16,0" stroke="#16233a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path class="kgr" d="M50,64 q10,14 20,0z" fill="#16233a"/></g></svg>`}
const KIDS=[{name:'Wei Ling',skin:'#f6d3b3',hairPath:'<path d="M30,50 q0,-34 30,-34 q30,0 30,34 q-4,-16 -18,-20 q-10,8 -30,8 q-8,4 -12,12z" fill="#1f1a17"/><circle cx="88" cy="40" r="7" fill="#1f1a17"/>',bottom:'#3f6fb5',badge:'#ef5240'},
  {name:'Arjun',skin:'#a86b44',hairPath:'<path d="M30,48 q-2,-32 30,-32 q32,0 30,32 q-6,-14 -30,-14 q-24,0 -30,14z" fill="#1b1b1b"/>',bottom:'#2e3d5c',badge:'#0b968b'},
  {name:'Nur Aisyah',skin:'#d9a37b',hairPath:'<path d="M26,58 q-2,-44 34,-44 q36,0 34,44 q2,24 -6,34 h-56 q-8,-10 -6,-34z" fill="#ffffff" stroke="#16233a" stroke-width="2"/><circle cx="60" cy="54" r="26" fill="#d9a37b"/>',bottom:'#3f6fb5',badge:'#ffb81f'},
  {name:'Jun Hao',skin:'#f2cfae',hairPath:'<path d="M30,46 q4,-30 30,-30 q28,0 30,30 l-8,-6 -6,6 -8,-8 -8,8 -8,-8 -8,8 -6,-6z" fill="#2b2420"/>',bottom:'#2e3d5c',badge:'#5f50ec'}];
addGame('p4-cashier',{level:'P4',strand:'num',glyph:'$',title:'Canteen Cashier',topic:'Decimals: adding, subtracting, multiplying and dividing money',
 how:'You run the school canteen stall. Scan everything on the customer’s tray, fill in the bill, then give the correct change.',rounds:8,
 round(api,r){const kid=pick(KIDS);
  if(r>=6){const n=R(2,5),each=R(8,45)*10,bill=n*each;
    api.q(`<p class="qt">${n} friends share a bill of <b>${$c(bill)}</b> equally. How much does each friend pay?</p>`);
    api.body.innerHTML=`<div class="shop"><div class="cust group" style="--n:${n}">${Array.from({length:n},(_,i)=>kidSVG(KIDS[(KIDS.indexOf(kid)+i)%4],'in')).join('')}<div class="say">We are ${n} friends. We want to split the bill!</div></div></div>
      <div class="row"><b>Each pays $</b><input class="num" id="cIn" inputmode="decimal" aria-label="Amount each pays"><button class="btn primary" id="cChk">Check</button></div>`;
    $('cChk').onclick=()=>{const v=parseMoney($('cIn').value);if(v===null)return;const ok=v===each;$('cIn').disabled=true;
      api.done(ok,`Each friend pays ${$c(each)}.`,[`${$c(bill)} ÷ ${n} = <b>${$c(each)}</b>`,`Check: ${$c(each)} × ${n} = ${$c(bill)}`])};return}
  const items=shuffle(MENU).slice(0,R(2,3)).map(([nm,p])=>({nm,p,q:r>=2&&p<200?R(1,3):1}));
  const total=items.reduce((s,i)=>s+i.p*i.q,0),note=[500,1000,2000,5000].find(x=>x>total),change=note-total;
  const tray=shuffle(items.flatMap(it=>Array.from({length:it.q},()=>it.nm)));let scanned=[];
  api.q(`<p class="qt">Step 1: Scan every item on ${kid.name}’s tray.</p><p class="qs">Tap an item to scan it.</p>`);
  api.body.innerHTML=`<div class="shop"><div class="cust" id="ccCust">${kidSVG(kid,'in')}<div class="say">Hi! I’d like these, please.</div></div>
    <div class="counter"><div class="tray" id="ccTray">${tray.map((nm,i)=>`<button class="titem" data-i="${i}" aria-label="Scan ${nm}">${artSVG(nm)}<small>${nm}</small></button>`).join('')}</div>
      <div class="scanner" id="ccScan"><div class="laser"></div><b>SCAN</b></div></div>
    <div class="pos"><div class="posh"><span>Canteen POS</span><span id="ccCnt">0 / ${tray.length} scanned</span></div><div class="posl" id="ccLines"><div class="pose">Waiting for items…</div></div></div></div>
    <div id="ccS2" style="display:grid;gap:10px"></div><div id="ccS3" style="display:grid;gap:10px"></div>`;
  const beep=()=>{tone(1650,0,.09,{type:'square',vol:.08});tone(2200,.09,.07,{type:'square',vol:.06})};
  api.body.querySelectorAll('.titem').forEach(b=>b.onclick=()=>{if(b.disabled||api.answered)return;b.disabled=true;const nm=tray[+b.dataset.i];
    const fin=()=>{beep();$('ccScan').classList.remove('flash');void $('ccScan').offsetWidth;$('ccScan').classList.add('flash');scanned.push(nm);b.classList.add('gone');
      $('ccLines').innerHTML=scanned.map(n=>`<div><span>${n}</span><span>${$c(MENU.find(m=>m[0]===n)[1])}</span></div>`).join('');$('ccLines').scrollTop=9999;$('ccCnt').textContent=`${scanned.length} / ${tray.length} scanned`;
      if(scanned.length===tray.length)tabulate()};
    if(calm)return fin();const a=b.getBoundingClientRect(),z=$('ccScan').getBoundingClientRect(),cl=b.querySelector('svg').cloneNode(true);
    cl.style.cssText=`position:fixed;left:${a.left+a.width/2-28}px;top:${a.top+6}px;width:56px;height:56px;z-index:60;pointer-events:none`;document.body.appendChild(cl);
    cl.animate([{transform:'none'},{transform:`translate(${z.left+z.width/2-a.left-a.width/2}px,${z.top-a.top-20}px) scale(.8) rotate(12deg)`,offset:.7},{transform:`translate(${z.left+z.width/2-a.left-a.width/2}px,${z.top-a.top+10}px) scale(.3)`,opacity:0}],{duration:520,easing:'ease-in'}).onfinish=()=>{cl.remove();fin()}});
  function tabulate(){api.q(`<p class="qt">Step 2: Fill in the bill.</p><p class="qs">Count each item from the screen, then work out each amount and the total.</p>`);
    $('ccS2').innerHTML=`<div style="overflow-x:auto"><table class="bill"><thead><tr><th>Item</th><th>Price each</th><th>Qty</th><th>Amount</th></tr></thead><tbody>${items.map((it,i)=>`<tr><td><span class="bi">${artSVG(it.nm)}</span>${it.nm}</td><td>${$c(it.p)}</td><td><input class="num sm" id="bq${i}" inputmode="numeric" aria-label="Quantity of ${it.nm}"></td><td>$<input class="num sm" id="ba${i}" inputmode="decimal" aria-label="Amount for ${it.nm}"></td></tr>`).join('')}
      <tr class="tot"><td colspan="3">Total</td><td>$<input class="num sm" id="bt" inputmode="decimal" aria-label="Total"></td></tr></tbody></table></div><div><button class="btn primary" id="bChk">Check the bill</button></div><div id="bMsg" style="font-weight:800"></div>`;
    $('bChk').onclick=()=>{const marks=[];items.forEach((it,i)=>{marks.push([`bq${i}`,+$('bq'+i).value===it.q],[`ba${i}`,parseMoney($('ba'+i).value)===it.p*it.q])});marks.push(['bt',parseMoney($('bt').value)===total]);
      if(marks.some(m=>!m[1])&&api.first('bill')){marks.forEach(([id,g])=>{$(id).classList.remove('okc','noc');$(id).classList.add(g?'okc':'noc');if(g)$(id).disabled=true});api.retry($('bMsg'),'Some boxes are not right yet (the red ones). Fix them and press Check the bill again.');return}
      let ok=true;marks.slice(0,-1).forEach(([id,g])=>{$(id).classList.remove('okc','noc');$(id).classList.add(g?'okc':'noc');$(id).disabled=true;if(!g)ok=false});
      const t=parseMoney($('bt').value),tok=t===total;$('bt').classList.remove('okc','noc');$('bt').classList.add(tok?'okc':'noc');$('bt').disabled=true;$('bChk').disabled=true;
      const billOk=ok&&tok;billOk?sfx.pop():sfx.soft();$('bMsg').textContent=billOk?'Bill correct!':`Not quite. The total is ${$c(total)}.`;pay(billOk)}}
  function pay(billOk){api.q(`<p class="qt">Step 3: ${kid.name} pays with a <b>${$c(note)}</b> note. Give the change.</p>`);
    $('ccCust').querySelector('.say').textContent=`Here’s ${$c(note)}!`;$('ccCust').insertAdjacentHTML('beforeend',`<div class="paynote">${$c(note)}</div>`);
    $('ccS3').innerHTML=`<div class="money" id="cM">${CASH.filter(c=>c[0]<note).map(c=>`<button class="cash ${c[2]}" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
      <span class="tag">Change tray (tap to take back)</span><div class="tray2" id="cT"></div><div class="row"><span class="pill" id="cSum">Change: $0.00</span><button class="btn primary" id="cGive">Give change</button></div>`;
    const tr=[];const drawT=()=>{$('cT').innerHTML=tr.map((v,k)=>{const c=CASH.find(x=>x[0]===v);return `<button class="cash ${c[2]}" data-k="${k}">${c[1]}</button>`}).join('');
      $('cSum').textContent=`Change: ${$c(tr.reduce((a,b)=>a+b,0))}`;$('cT').querySelectorAll('button').forEach(b=>b.onclick=()=>{tr.splice(+b.dataset.k,1);sfx.tap();drawT()})};
    $('cM').querySelectorAll('button').forEach(b=>b.onclick=()=>{tr.push(+b.dataset.v);tone(1200,0,.05,{type:'triangle',vol:.08});drawT()});drawT();
    $('ccS3').scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'});
    $('cGive').onclick=()=>{const given=tr.reduce((a,b)=>a+b,0),cok=given===change;let rest=change;const way=[];CASH.forEach(([v,l])=>{while(rest>=v){way.push(l);rest-=v}});
      const k=$('ccCust').querySelector('.kid');k.classList.remove('in');k.classList.add(cok?'yay':'huh');$('ccCust').querySelector('.say').textContent=cok?'Thank you!':'Hmm, is this right?';
      api.done(billOk&&cok,cok?`You gave ${$c(change)} change.`:`You gave ${$c(given)}. The change should be ${$c(change)}.`,
        [...items.map(i=>`${i.nm}: ${i.q} × ${$c(i.p)} = ${$c(i.p*i.q)}`),`Total = ${items.map(i=>$c(i.p*i.q)).join(' + ')} = <b>${$c(total)}</b>`,
         `Change = ${$c(note)} − ${$c(total)} = <b>${$c(change)}</b>`,`One way to give it: ${way.join(' + ')}`],(billOk?5:0)+(cok?5:0))}}}});

/* ================= P4 MEASUREMENT AND GEOMETRY ================= */

/* 9. Garden Builder — Area and perimeter 1.1–1.3 */
const GC=9,GR=7,gk=(x,y)=>x+','+y;
function gPerim(s){let p=0;s.forEach(k=>{const [x,y]=k.split(',').map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{if(!s.has(gk(x+a,y+b)))p++})});return p}
function gConn(s){if(!s.size)return false;const st=[[...s][0]],seen=new Set(st);while(st.length){const [x,y]=st.pop().split(',').map(Number);[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const k=gk(x+a,y+b);if(s.has(k)&&!seen.has(k)){seen.add(k);st.push(k)}})}return seen.size===s.size}
function gHole(s){const out=new Set([gk(-1,-1)]),st=[[-1,-1]];while(st.length){const [x,y]=st.pop();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const nx=x+a,ny=y+b,k=gk(nx,ny);if(nx<-1||ny<-1||nx>GC||ny>GR||out.has(k)||s.has(k))return;out.add(k);st.push([nx,ny])})}
  for(let x=0;x<GC;x++)for(let y=0;y<GR;y++){const k=gk(x,y);if(!s.has(k)&&!out.has(k))return true}return false}
function gRect(s){const c=[...s].map(k=>k.split(',').map(Number)),xs=c.map(p=>p[0]),ys=c.map(p=>p[1]);return (Math.max(...xs)-Math.min(...xs)+1)*(Math.max(...ys)-Math.min(...ys)+1)===s.size}
function gGrow(A){for(;;){const s=new Set([gk(4,3)]);for(let g=0;s.size<A&&g<600;g++){const [x,y]=pick([...s]).split(',').map(Number),[a,b]=pick([[1,0],[-1,0],[0,1],[0,-1]]),nx=x+a,ny=y+b;
  if(nx<0||ny<0||nx>=GC||ny>=GR)continue;const k=gk(nx,ny);if(s.has(k))continue;s.add(k);if(gHole(s))s.delete(k)}if(s.size===A&&!gRect(s))return s}}
function miniGrid(s){const c=[...s].map(k=>k.split(',').map(Number)),mx=Math.min(...c.map(p=>p[0])),my=Math.min(...c.map(p=>p[1])),W=Math.max(...c.map(p=>p[0]))-mx+1,H=Math.max(...c.map(p=>p[1]))-my+1;
  return `<svg viewBox="-1 -1 ${W*22+2} ${H*22+2}" style="width:${Math.min(220,W*22)}px;max-width:100%;height:auto" role="img" aria-label="Example garden">${c.map(([x,y])=>`<rect x="${(x-mx)*22}" y="${(y-my)*22}" width="22" height="22" fill="#5fbf73" stroke="#3c8f4f" stroke-width="1.5"/>`).join('')}</svg>`}
addGame('p4-garden',{level:'P4',strand:'geo',glyph:'▦',title:'Garden Builder',topic:'Area and perimeter of rectangles and composite figures',
 how:'Each square of grass is 1 m by 1 m. Tap squares to build a garden that matches the area and the perimeter.',rounds:8,
 round(api,r){
  const rect=r<3;let A,P,ex,w,h;
  if(rect){do{w=R(2,6);h=R(2,5)}while(w===h&&Math.random()<.6);A=w*h;P=2*(w+h);ex=new Set();for(let x=0;x<w;x++)for(let y=0;y<h;y++)ex.add(gk(x,y))}
  else{A=r<6?R(6,10):R(10,14);ex=gGrow(A);P=gPerim(ex)}
  api.q(`<p class="qt">Build ${rect?'a <b>rectangle</b>':'a garden'} with area <b>${A} m²</b> and perimeter <b>${P} m</b>.</p>${rect?'':'<p class="qs">Any shape works, as long as the squares join along their sides and there are no holes.</p>'}`);
  api.body.innerHTML=`<div class="readout"><span id="gA">Area: 0 m²</span><span id="gP">Perimeter: 0 m</span></div><div class="ggrid" id="gG"></div>
    <div class="row"><button class="btn primary" id="gChk">Check my garden</button><button class="btn" id="gClr">Clear</button></div>`;
  const s=new Set(),btns={};
  const upd=()=>{const p=gPerim(s);$('gA').textContent=`Area: ${s.size} m²`;$('gP').textContent=`Perimeter: ${p} m`;$('gA').classList.toggle('hit',s.size===A);$('gP').classList.toggle('hit',p===P&&s.size>0)};
  for(let y=0;y<GR;y++)for(let x=0;x<GC;x++){const k=gk(x,y),b=document.createElement('button');b.className='gc';b.setAttribute('aria-label',`Square ${x+1},${y+1}`);
    b.onclick=()=>{if(api.answered)return;s.has(k)?s.delete(k):s.add(k);b.classList.toggle('on',s.has(k));sfx.tap();upd()};btns[k]=b;$('gG').appendChild(b)}
  $('gClr').onclick=()=>{if(api.answered)return;s.clear();Object.values(btns).forEach(b=>b.classList.remove('on'));upd()};
  $('gChk').onclick=()=>{if(!s.size)return;const p=gPerim(s),issues=[];
    if(s.size!==A)issues.push(`the area is ${s.size} m², not ${A} m²`);if(p!==P)issues.push(`the perimeter is ${p} m, not ${P} m`);
    if(!gConn(s))issues.push('some squares are not joined to the rest');if(gHole(s))issues.push('there is a hole in the middle');
    if(rect&&gConn(s)&&!gRect(s))issues.push('the shape is not a rectangle');
    Object.values(btns).forEach(b=>b.disabled=true);const ok=!issues.length;
    api.done(ok,ok?`Area ${A} m², perimeter ${P} m.`:`Not yet: ${issues.join(', ')}.`,
      [rect?`A ${w} m by ${h} m rectangle works. Area = ${w} m × ${h} m = <b>${A} m²</b>`:`Area = number of squares = <b>${A} m²</b>`,
       rect?`Perimeter = ${w} + ${h} + ${w} + ${h} = <b>${P} m</b>`:`Perimeter = count every outside edge of the garden = <b>${P} m</b>`,
       'Tip: squares packed close together give a smaller perimeter; spreading them out in a line gives a bigger one.',`Here is one garden that works:`,miniGrid(ex)])}}});

/* 10. Angle Sniper — Angles 1.1–1.3 */
function protractorSVG(){let s=`<path d="M30,190 A150,150 0 0 1 330,190 Z" class="pro"/>`;
  for(let a=0;a<=180;a+=5){const t=a*Math.PI/180,big=a%10===0,c=Math.cos(t),n=Math.sin(t);
    s+=`<line class="ptk" x1="${(180+150*c).toFixed(1)}" y1="${(190-150*n).toFixed(1)}" x2="${(180+(big?138:144)*c).toFixed(1)}" y2="${(190-(big?138:144)*n).toFixed(1)}"/>`;
    if(big){s+=`<text class="pout" x="${(180+128*c).toFixed(1)}" y="${(193-128*n).toFixed(1)}" text-anchor="middle">${180-a}</text><text class="pin" x="${(180+111*c).toFixed(1)}" y="${(193-111*n).toFixed(1)}" text-anchor="middle">${a}</text>`}}
  return s+`<circle cx="180" cy="190" r="3" style="fill:var(--ink)"/>`}
function arm(t,len=150){const r=t*Math.PI/180;return [(180+len*Math.cos(r)).toFixed(1),(190-len*Math.sin(r)).toFixed(1)]}
function arcPath(t0,t1,rad=32){const [x0,y0]=arm(t0,rad),[x1,y1]=arm(t1,rad);return `M${x0},${y0} A${rad},${rad} 0 0 0 ${x1},${y1}`}
function balloonSVG(t,col,hidden){const [x,y]=arm(t,158);return `<g id="aBal" style="opacity:${hidden?0:1};transition:opacity .35s"><g transform="translate(${x},${y})"><path d="M0,15 Q-4,24 1,32" stroke="#16233a" fill="none" stroke-width="1.3"/><ellipse rx="12" ry="15" style="fill:${col}" stroke="#16233a" stroke-width="1.6"/><ellipse cx="-4" cy="-6" rx="3" ry="4.5" fill="#fff" fill-opacity=".6"/><path d="M-3,15 L3,15 L0,11Z" style="fill:${col}" stroke="#16233a" stroke-width="1"/></g></g>`}
function skySVG(){return `<rect x="0" y="-30" width="360" height="220" fill="#bfe3fb" fill-opacity=".55"/><rect x="0" y="190" width="360" height="40" fill="#7cc77f" fill-opacity=".7"/>
  ${[[60,20,1],[250,5,1.2],[150,-12,.8],[320,60,.7],[30,90,.75]].map(([x,y,s])=>`<g transform="translate(${x},${y}) scale(${s})" fill="#fff" fill-opacity=".9"><ellipse cx="0" cy="0" rx="26" ry="11"/><ellipse cx="-14" cy="-6" rx="13" ry="10"/><ellipse cx="10" cy="-9" rx="15" ry="12"/></g>`).join('')}`}
const GUN=`<g transform="translate(180,190)"><g id="aBar"><rect x="0" y="-7" width="58" height="14" rx="6" fill="#3d4b63" stroke="#16233a" stroke-width="2"/><rect x="52" y="-9" width="10" height="18" rx="3" fill="#16233a"/></g><circle r="17" style="fill:var(--tomato)" stroke="#16233a" stroke-width="2.5"/><rect x="-26" y="12" width="52" height="11" rx="4" fill="#16233a"/></g>`;
function fireAt(svg,ang,hit,balT,done){const b=document.createElementNS('http://www.w3.org/2000/svg','circle');b.setAttribute('r','4.5');b.setAttribute('fill','#16233a');svg.appendChild(b);
  tone(900,0,.18,{type:'sawtooth',vol:.12,to:120});tone(140,0,.25,{type:'square',vol:.1,to:60});
  const t0=performance.now(),dur=calm?1:520,end=hit?158:210;
  const step=now=>{if(!b.isConnected)return;const k=Math.min(1,(now-t0)/dur),[x,y]=arm(ang,62+(end-62)*k);b.setAttribute('cx',x);b.setAttribute('cy',y);
    if(k<1)requestAnimationFrame(step);else{b.remove();$('aBal').style.opacity=1;
      if(hit){const [x2,y2]=arm(balT,158);$('aBal').innerHTML=`<g transform="translate(${x2},${y2})">${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return `<line x1="${(9*Math.cos(r)).toFixed(1)}" y1="${(9*Math.sin(r)).toFixed(1)}" x2="${(22*Math.cos(r)).toFixed(1)}" y2="${(22*Math.sin(r)).toFixed(1)}" stroke="var(--tomato)" stroke-width="3" stroke-linecap="round"/>`}).join('')}<text y="-28" text-anchor="middle" style="font:700 18px var(--display);fill:var(--tomato)">POP!</text></g>`;
        tone(1400,0,.08,{type:'square',vol:.15,to:300});confetti(40)}
      done()}};
  requestAnimationFrame(step)}
function roughPro(step){let s=`<path d="M30,190 A150,150 0 0 1 330,190 Z" class="pro" style="fill-opacity:.45"/>`;
  for(let a=0;a<=180;a+=step){const t=a*Math.PI/180,c=Math.cos(t),n=Math.sin(t);
    s+=`<line x1="${(180+150*c).toFixed(1)}" y1="${(190-150*n).toFixed(1)}" x2="${(180+128*c).toFixed(1)}" y2="${(190-128*n).toFixed(1)}" stroke="var(--teal)" stroke-width="2.5"/><text x="${(180+112*c).toFixed(1)}" y="${(195-112*n-(a%180===0?16:0)).toFixed(1)}" text-anchor="middle" style="font:800 13px var(--body);fill:var(--teal);paint-order:stroke;stroke:var(--surface);stroke-width:3px">${a}°</text>`}
  return s+`<circle cx="180" cy="190" r="3" style="fill:var(--ink)"/>`}
const BCOL=['#ff5a5f','#ffb81f','#8a7bff','#2fc48d','#ff7ac6'];
addGame('p4-angles',{level:'P4',strand:'geo',glyph:'∠',title:'Angle Sniper',topic:'Angles: estimating, measuring and drawing',
 how:'Aim the balloon cannon by angle and fire! Odd rounds: use the protractor to aim within 2°. Even rounds: read the protractor to set your sights.',rounds:10,
 round(api,r){const col=pick(BCOL);
  if(r%2===0){const pro=true,rough=30,T=Math.min(170,Math.max(15,R(2,17)*10+pick([0,5])+(pro?pick([-2,-1,1,2,3]):0))),tol=pro?2:6;let ang=90;
    api.q(pro?`<p class="qt">A balloon is hiding in the clouds at <b>∠ABC = ${T}°</b>. Use the protractor to aim exactly, then fire!</p><p class="qs">Read the protractor yourself; no reading is shown until you fire. You must be within 2° to pop it.</p>`
             :`<p class="qt">A balloon is hiding in the clouds at <b>∠ABC = ${T}°</b>. Aim by eye and fire!</p><p class="qs">Your rough protractor only shows every ${rough}°, so estimate between the marks. Get within 6° to pop it.</p>`);
    api.body.innerHTML=`<svg viewBox="0 -30 360 250" class="asvg" id="aS" role="img" aria-label="Balloon cannon">${skySVG()}${pro?'':`<g id="aRough" style="transition:opacity .4s">${roughPro(rough)}</g>`}<g id="aPro" style="opacity:${pro?1:0};transition:opacity .4s">${protractorSVG()}</g>
      ${balloonSVG(T,col,true)}<path id="aArc" fill="none" stroke="var(--tomato)" stroke-width="3"/><line class="arm" x1="180" y1="190" x2="335" y2="190"/>
      <line id="aArm" x1="180" y1="190" stroke="#16233a" stroke-width="2" stroke-dasharray="6 5"/>${GUN}
      <text class="lab" x="146" y="218">B</text><text class="lab" x="338" y="210">A</text><text class="lab" id="aC">C</text></svg>
      <div class="row"><button class="btn" id="aM">−1°</button><button class="btn" id="aP">+1°</button><button class="btn primary" id="aL">🎯 Fire!</button><span class="pill" id="aRead" hidden></span></div>`;
    const draw=()=>{const [x,y]=arm(ang,150),[lx,ly]=arm(ang,168);$('aArm').setAttribute('x2',x);$('aArm').setAttribute('y2',y);$('aBar').setAttribute('transform',`rotate(${-ang})`);
      $('aC').setAttribute('x',+lx-6);$('aC').setAttribute('y',+ly+6);$('aArc').setAttribute('d',arcPath(0,ang));};draw();
    const sv=$('aS');let drag=false,fired=false;
    const setFrom=e=>{const p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(sv.getScreenCTM().inverse());let t=Math.atan2(190-q.y,q.x-180)*180/Math.PI;
      if(t<0)t=q.x>180?0:180;ang=Math.round(Math.min(180,Math.max(0,t)));draw()};
    sv.addEventListener('pointerdown',e=>{if(fired)return;drag=true;sv.setPointerCapture(e.pointerId);setFrom(e)});
    sv.addEventListener('pointermove',e=>{if(drag&&!fired)setFrom(e)});sv.addEventListener('pointerup',()=>drag=false);
    $('aM').onclick=()=>{if(!fired){ang=Math.max(0,ang-1);sfx.tap();draw()}};$('aP').onclick=()=>{if(!fired){ang=Math.min(180,ang+1);sfx.tap();draw()}};
    $('aL').onclick=()=>{if(fired)return;fired=true;['aM','aP','aL'].forEach(i=>$(i).disabled=true);const d=Math.abs(ang-T),hit=d<=tol;
      fireAt(sv,ang,hit,T,()=>{if($('aRough'))$('aRough').style.opacity=0;$('aPro').style.opacity=1;$('aRead').hidden=false;$('aRead').textContent=`You aimed at ${ang}°`;
        const pts=pro?(d<=1?10:d<=2?8:d<=4?4:0):(d<=3?10:d<=6?8:d<=10?5:d<=20?2:0);
        api.done(hit,hit?(d===0?`Bullseye! Exactly ${T}°.`:`Popped! You aimed at ${ang}°, just ${d}° off.`):`Missed! You aimed at ${ang}°, but the balloon was at ${T}°. That is ${d}° ${ang>T?'too far left':'too far right'}.`,
          [`Arm BA lies on the 0° line on the right, so read the <b style="color:var(--teal)">inner (teal)</b> scale, starting from 0.`,pro?'Line up B with the centre of the protractor, then find the mark on the teal scale.':`Use the rough marks: ${T}° is ${T%rough===0?`exactly on the ${T}° mark`:`between ${Math.floor(T/rough)*rough}° and ${Math.floor(T/rough)*rough+rough}°, ${T-Math.floor(T/rough)*rough<rough/2?'closer to '+Math.floor(T/rough)*rough+'°':T-Math.floor(T/rough)*rough>rough/2?'closer to '+(Math.floor(T/rough)*rough+rough)+'°':'halfway between them'}`}.`,
           T<90?`${T}° is less than 90°, so it is an acute angle.`:T===90?'90° is a right angle.':`${T}° is between 90° and 180°, so it is an obtuse angle.`],pts)})};return}
  let s;do{s=R(2,16)*10+pick([0,5])}while(s===90);const left=Math.random()<.5,t1=left?180-s:s,base=left?180:0;
  const opts=shuffle([...new Set([s,180-s,s+10<180?s+10:s-20,s-10>0?s-10:s+20])]);
  api.q(`<p class="qt">Set your sights! Read the protractor: the balloon is at <b>∠PQR = ?</b></p><p class="qs">Pick the angle and the cannon will fire at it.</p>`);
  const [px,py]=arm(base,165),[lx,ly]=arm(base,178),[mx,my]=arm(t1,182);
  api.body.innerHTML=`<svg viewBox="0 -30 360 250" class="asvg" id="aS" role="img" aria-label="Balloon on a protractor">${skySVG()}${protractorSVG()}${balloonSVG(t1,col,false)}
    <path d="${left?arcPath(t1,180):arcPath(0,t1)}" fill="none" stroke="var(--tomato)" stroke-width="3"/><line class="arm" x1="180" y1="190" x2="${px}" y2="${py}"/>
    <line x1="180" y1="190" x2="${arm(t1,145)[0]}" y2="${arm(t1,145)[1]}" stroke="#16233a" stroke-width="2" stroke-dasharray="6 5"/>${GUN}
    <text class="lab" x="146" y="218">Q</text><text class="lab" x="${Math.min(340,Math.max(8,+lx-6))}" y="${+ly+22}">P</text><text class="lab" x="${+mx+8}" y="${+my+6}">R</text></svg><div class="choices" id="aCh"></div>`;
  $('aBar').style.transform=`rotate(${-base}deg)`;
  opts.forEach(v=>{const b=document.createElement('button');b.className='btn';b.textContent=v+'°';
    b.onclick=()=>{if(api.answered||$('aCh').dataset.busy)return;$('aCh').dataset.busy=1;[...$('aCh').children].forEach(x=>x.disabled=true);
      const aim=left?180-v:v,hit=v===s;$('aBar').style.transition=calm?'none':'transform .6s';void $('aBar').getBoundingClientRect();$('aBar').style.transform=`rotate(${-aim}deg)`;
      setTimeout(()=>fireAt($('aS'),aim,hit,t1,()=>{[...$('aCh').children].forEach(x=>{if(x.textContent===s+'°')x.classList.add('ok')});if(!hit)b.classList.add('no');
        api.done(hit,hit?`Popped! ∠PQR = ${s}°.`:`Missed! ∠PQR is ${s}°, not ${v}°.`,[`Arm QP lies along the 0° line on the <b>${left?'left':'right'}</b>, so read the <b style="color:${left?'var(--tomato)':'var(--teal)'}">${left?'outer (orange)':'inner (teal)'}</b> scale, starting from 0.`,
          `∠PQR is ${s<90?'smaller':'bigger'} than a right angle, so it ${s<90?'must be less':'must be more'} than 90°. That rules out ${180-s}°, the reading on the other scale.`])}),calm?0:650)};$('aCh').appendChild(b)})}});

/* 11. Mirror Maker — Line symmetry 3.1–3.3 */
addGame('p4-mirror',{level:'P4',strand:'geo',glyph:'⫼',title:'Mirror Maker',topic:'Line symmetry',
 how:'Half of the picture is shaded. Tap squares on the other side to make the figure symmetric about the red dashed line.',rounds:8,
 round(api,r){
  const v=r%3!==2,C=v?10:8,Rw=v?8:10,cs=34,n=5+Math.min(r,5),src=new Set(),inSrc=(x,y)=>v?x>=0&&x<=4&&y>=0&&y<Rw:y>=0&&y<=4&&x>=0&&x<C;
  let sx=v?R(1,4):R(1,C-2),sy=v?R(1,Rw-2):R(1,4);src.add(gk(sx,sy));
  while(src.size<n){const [x,y]=pick([...src]).split(',').map(Number),[a,b]=pick([[1,0],[-1,0],[0,1],[0,-1]]);if(inSrc(x+a,y+b))src.add(gk(x+a,y+b))}
  const mir=k=>{const [x,y]=k.split(',').map(Number);return v?gk(9-x,y):gk(x,9-y)},want=new Set([...src].map(mir));
  api.q(`<p class="qt">Complete the symmetric figure about the <b>${v?'vertical':'horizontal'}</b> line.</p>`);
  let h='';for(let y=0;y<Rw;y++)for(let x=0;x<C;x++){const k=gk(x,y);h+=`<rect class="c ${src.has(k)?'src':''}" data-k="${k}" x="${x*cs+2}" y="${y*cs+2}" width="${cs-2}" height="${cs-2}" rx="3"/>`}
  const line=v?`<line class="mline" x1="${5*cs+1}" y1="0" x2="${5*cs+1}" y2="${Rw*cs+4}"/>`:`<line class="mline" x1="0" y1="${5*cs+1}" x2="${C*cs+4}" y2="${5*cs+1}"/>`;
  api.body.innerHTML=`<svg viewBox="0 0 ${C*cs+4} ${Rw*cs+4}" class="msvg" role="img" aria-label="Grid with mirror line">${h}${line}</svg><div class="row"><button class="btn primary" id="mChk">Check</button></div>`;
  const sel=new Set();
  api.body.querySelectorAll('rect.c').forEach(el=>{const k=el.dataset.k;if(src.has(k))return;const [x,y]=k.split(',').map(Number);if(inSrc(x,y))return;
    el.addEventListener('click',()=>{if(api.answered)return;sel.has(k)?sel.delete(k):sel.add(k);el.classList.toggle('on',sel.has(k));sfx.tap()})});
  $('mChk').onclick=()=>{let err=0;api.body.querySelectorAll('rect.c').forEach(el=>{const k=el.dataset.k;if(src.has(k))return;const w=want.has(k),s=sel.has(k);
      if(w&&!s){el.classList.add('miss');err++}else if(!w&&s){el.classList.remove('on');el.classList.add('bad');err++}});
    $('mChk').disabled=true;const ok=!err;
    api.done(ok,ok?'The two halves match like a mirror image.':`${err} square${err>1?'s are':' is'} not right. Dashed = missing, red = extra.`,
      ['Each shaded square has a partner on the other side of the line, the same distance away.','Count squares from the line: a square 2 squares from the line needs its partner 2 squares from the line on the other side.',
       'Squares that touch the line have partners that touch it too.'],ok?10:Math.max(0,10-2*err))}}});

/* 12. Net Detective — Nets 4.1–4.4 */
function foldCube(cells){const set=new Set(cells.map(([x,y])=>gk(x,y))),face={},start=cells[0];face[gk(...start)]={D:0,U:1,N:2,S:3,E:4,W:5};const q=[start];
  while(q.length){const [x,y]=q.shift(),o=face[gk(x,y)];
    [[1,0,o=>({D:o.E,E:o.U,U:o.W,W:o.D,N:o.N,S:o.S})],[-1,0,o=>({D:o.W,W:o.U,U:o.E,E:o.D,N:o.N,S:o.S})],[0,-1,o=>({D:o.N,N:o.U,U:o.S,S:o.D,E:o.E,W:o.W})],[0,1,o=>({D:o.S,S:o.U,U:o.N,N:o.D,E:o.E,W:o.W})]].forEach(([a,b,f])=>{
      const k=gk(x+a,y+b);if(set.has(k)&&!face[k]){face[k]=f(o);q.push([x+a,y+b])}})}
  const byFace={},clash=[];cells.forEach(([x,y])=>{const d=face[gk(x,y)].D;if(byFace[d]!==undefined)clash.push(byFace[d],gk(x,y));else byFace[d]=gk(x,y)});
  return {ok:!clash.length,clash:[...new Set(clash)],down:k=>face[k].D}}
function hexomino(){const s=new Set([gk(3,3)]);while(s.size<6){const [x,y]=pick([...s]).split(',').map(Number),[a,b]=pick([[1,0],[-1,0],[0,1],[0,-1]]);s.add(gk(x+a,y+b))}
  const c=[...s].map(k=>k.split(',').map(Number)),mx=Math.min(...c.map(p=>p[0])),my=Math.min(...c.map(p=>p[1]));return c.map(([x,y])=>[x-mx,y-my])}
/* Nets as polygons. Each face folds about the edge it shares with its parent by angle a (degrees). */
const T3=Math.sqrt(3),sqr=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
const SPA=180-Math.acos(25/40)*180/Math.PI,TPA=180-Math.acos(1/3)*180/Math.PI;
const SOLIDS={
  'Cube':{faces:'6 squares, all the same size',w:120,h:90,f:[{p:sqr(30,30,30,30)},{p:sqr(30,0,30,30),par:0,a:90},{p:sqr(0,30,30,30),par:0,a:90},{p:sqr(60,30,30,30),par:0,a:90},{p:sqr(90,30,30,30),par:3,a:90},{p:sqr(30,60,30,30),par:0,a:90}]},
  'Cuboid':{faces:'6 rectangles in 3 matching pairs',w:120,h:140,f:[{p:sqr(30,30,60,40)},{p:sqr(30,0,60,30),par:0,a:90},{p:sqr(0,30,30,40),par:0,a:90},{p:sqr(90,30,30,40),par:0,a:90},{p:sqr(30,70,60,30),par:0,a:90},{p:sqr(30,100,60,40),par:4,a:90}]},
  'Triangular prism':{faces:'2 triangles and 3 rectangles',w:120,h:140,f:[{p:sqr(40,35,40,70)},{p:sqr(0,35,40,70),par:0,a:120},{p:sqr(80,35,40,70),par:0,a:120},{p:[[40,35],[80,35],[60,35-20*T3]],par:0,a:90},{p:[[40,105],[80,105],[60,105+20*T3]],par:0,a:90}]},
  'Square pyramid':{faces:'1 square and 4 triangles',w:130,h:130,f:[{p:sqr(40,40,50,50)},{p:[[40,40],[90,40],[65,0]],par:0,a:SPA},{p:[[40,90],[90,90],[65,130]],par:0,a:SPA},{p:[[40,40],[40,90],[0,65]],par:0,a:SPA},{p:[[90,40],[90,90],[130,65]],par:0,a:SPA}]},
  'Triangular pyramid':{faces:'4 triangles',w:120,h:60*T3,f:[{p:[[30,30*T3],[90,30*T3],[60,60*T3]]},{p:[[30,30*T3],[90,30*T3],[60,0]],par:0,a:TPA},{p:[[0,60*T3],[30,30*T3],[60,60*T3]],par:0,a:TPA},{p:[[60,60*T3],[90,30*T3],[120,60*T3]],par:0,a:TPA}]}};
function rotAbout(p,a,u,ang){const x=p[0]-a[0],y=p[1]-a[1],z=p[2]-a[2],c=Math.cos(ang),s=Math.sin(ang),d=u[0]*x+u[1]*y+u[2]*z,cr=[u[1]*z-u[2]*y,u[2]*x-u[0]*z,u[0]*y-u[1]*x];
  return [a[0]+x*c+cr[0]*s+u[0]*d*(1-c),a[1]+y*c+cr[1]*s+u[1]*d*(1-c),a[2]+z*c+cr[2]*s+u[2]*d*(1-c)]}
function prepFaces(F){F.forEach(f=>{f.p3=f.p.map(([x,y])=>[x,y,0]);if(f.par===undefined)return;const P=F[f.par].p;
  const sh=f.p.filter(q=>P.some(r=>Math.hypot(q[0]-r[0],q[1]-r[1])<.01)),A=[...sh[0],0],B=[...sh[1],0],L=Math.hypot(B[0]-A[0],B[1]-A[1]),u=[(B[0]-A[0])/L,(B[1]-A[1])/L,0];
  const n=f.p.length,cen=[f.p.reduce((t,q)=>t+q[0],0)/n,f.p.reduce((t,q)=>t+q[1],0)/n,0];f.h={a:A,u,sg:rotAbout(cen,A,u,.3)[2]>0?1:-1}})}
function posed(F,t){return F.map((f,i)=>{let pts=f.p3,j=i;while(F[j].par!==undefined){const g=F[j];pts=pts.map(q=>rotAbout(q,g.h.a,g.h.u,g.h.sg*g.a*t*Math.PI/180));j=g.par}return pts})}
/* folding animation: a tiny 3D renderer drawing the faces into SVG, far faces first */
function foldView(F,cols,ghost=[]){prepFaces(F);const all=F.flatMap(f=>f.p),xs=all.map(q=>q[0]),ys=all.map(q=>q[1]),sc=200/Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys));
  const wrap=document.createElement('div');wrap.className='fold3d';wrap.innerHTML=`<svg viewBox="-170 -150 340 300" style="width:100%;height:100%" role="img" aria-label="Animation of the net folding into a solid"></svg>`;const svg=wrap.firstChild;
  let t=0,target=0,spin=-30,last=0,wait=0,running=false;const tilt=56*Math.PI/180,cT=Math.cos(tilt),sT=Math.sin(tilt);
  const draw=()=>{const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,P=posed(F,e),flat=P.flat(),n=flat.length,c=[0,1,2].map(k=>flat.reduce((s,q)=>s+q[k],0)/n),sp=spin*Math.PI/180,cs=Math.cos(sp),sn=Math.sin(sp);
    const faces=P.map((pts,i)=>{const v=pts.map(([x,y,z])=>{const x1=(x-c[0])*cs-(y-c[1])*sn,y1=(x-c[0])*sn+(y-c[1])*cs,z1=z-c[2];return [x1,y1*cT-z1*sT,y1*sT+z1*cT]});
      const [a,b,d]=v,u1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],u2=[d[0]-a[0],d[1]-a[1],d[2]-a[2]],nn=[u1[1]*u2[2]-u1[2]*u2[1],u1[2]*u2[0]-u1[0]*u2[2],u1[0]*u2[1]-u1[1]*u2[0]],L=Math.hypot(...nn)||1;
      const shade=Math.abs((nn[0]*.3-nn[1]*.5+nn[2]*.8)/L/Math.hypot(.3,.5,.8));
      return {i,v,depth:v.reduce((s,q)=>s+q[2],0)/v.length,shade}});
    faces.sort((p,q)=>p.depth-q.depth);
    svg.innerHTML=faces.map(f=>{const k=sc*(1+.45*e),pts=f.v.map(q=>`${(q[0]*k).toFixed(1)},${(q[1]*k).toFixed(1)}`).join(' ');
      return `<polygon points="${pts}" style="fill:${cols[f.i]}" fill-opacity="${ghost.includes(f.i)?.45:1}" stroke="#16233a" stroke-width="2" stroke-linejoin="round"/><polygon points="${pts}" fill="#000" fill-opacity="${((1-f.shade)*.32).toFixed(2)}"/>`}).join('')};
  const loop=now=>{if(!wrap.isConnected){running=false;return}const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
    if(wait>0)wait-=dt;else if(t!==target)t=target>t?Math.min(target,t+dt/2.4):Math.max(target,t-dt/1.2);spin+=dt*18;draw();requestAnimationFrame(loop)};
  const go=v=>{target=v;if(calm){t=v;draw();return}if(!running){running=true;last=0;requestAnimationFrame(loop)}};
  draw();return {el:wrap,play(){t=0;wait=.6;go(1)},unfold(){wait=0;go(0)}}}
function showFoldFaces(F,cols,caption,ghost){const fb=$('gf').querySelector('.fb');if(!fb)return;const f=foldView(F,cols,ghost);
  const box=document.createElement('div');box.style.cssText='display:grid;gap:8px';box.innerHTML=`<span class="tag">Watch it fold</span><p style="margin:0;font-weight:700">${caption}</p>`;
  box.appendChild(f.el);const row=document.createElement('div');row.className='row';
  row.innerHTML='<button class="btn" type="button">Fold again</button><button class="btn" type="button">Unfold</button>';
  row.children[0].onclick=()=>{sfx.tap();f.play()};row.children[1].onclick=()=>{sfx.tap();f.unfold()};box.appendChild(row);
  fb.insertBefore(box,fb.children[1]);f.play()}
function showFold(cells,res,pal){const n=cells.length,mx=cells.reduce((a,c)=>a+c[0],0)/n,my=cells.reduce((a,c)=>a+c[1],0)/n;
  const root=cells.slice().sort((a,b)=>Math.hypot(a[0]-mx,a[1]-my)-Math.hypot(b[0]-mx,b[1]-my))[0],set=new Set(cells.map(c=>gk(...c)));
  const F=[{p:sqr(root[0]*30,root[1]*30,30,30),k:gk(...root)}],idx={[gk(...root)]:0},q=[root];
  while(q.length){const [x,y]=q.shift();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const k=gk(x+a,y+b);if(!set.has(k)||k in idx)return;idx[k]=F.length;F.push({p:sqr((x+a)*30,(y+b)*30,30,30),par:idx[gk(x,y)],a:90,k});q.push([x+a,y+b])})}
  showFoldFaces(F,F.map(f=>res.ok?pal[res.down(f.k)]:res.clash.includes(f.k)?'var(--bad)':'var(--sun)'),
    res.ok?'Every square folds onto its own side, so the cube closes up with no gaps.':'Watch the red squares: they fold onto the <b>same</b> side and crash into each other, so another side of the cube is left open. The other faces are see-through so you can spot the clash.',res.ok?[]:F.map((f,i)=>res.clash.includes(f.k)?-1:i).filter(i=>i>=0))}
addGame('p4-nets',{level:'P4',strand:'geo',glyph:'⧉',title:'Net Detective',topic:'Nets of cubes, cuboids, prisms and pyramids',
 how:'Decide whether each net folds into a cube. Some rounds ask which solid a net makes.',rounds:10,
 round(api,r){
  if(r%3===2){const names=Object.keys(SOLIDS),ans=pick(names),S=SOLIDS[ans],rot=pick([0,90,180,270]);
    const opts=shuffle([ans,...shuffle(names.filter(n=>n!==ans)).slice(0,3)]);
    api.q(`<p class="qt">Which solid does this net fold into?</p>`);
    api.body.innerHTML=`<svg viewBox="-100 -100 200 200" class="nsvg" role="img" aria-label="A net"><g transform="rotate(${rot}) translate(${-S.w/2},${-S.h/2})" style="fill:var(--sun);stroke:var(--ink);stroke-width:2;stroke-linejoin:round">${S.f.map(f=>`<polygon points="${f.p.map(q=>q.map(v=>v.toFixed(2)).join(',')).join(' ')}"/>`).join('')}</g></svg><div class="choices" id="nCh"></div>`;
    opts.forEach(o=>{const b=document.createElement('button');b.className='btn';b.style.fontSize='1.05rem';b.textContent=o;
      b.onclick=()=>{if(api.answered)return;[...$('nCh').children].forEach(x=>{x.disabled=true;if(x.textContent===ans)x.classList.add('ok')});if(o!==ans)b.classList.add('no');
        setTimeout(()=>showFoldFaces(S.f.map(f=>({...f})),S.f.map((f,i)=>i===0?'var(--violet)':f.p.length===3?'var(--teal)':'var(--sun)'),`${S.faces[0].toUpperCase()+S.faces.slice(1)} fold up into a ${ans.toLowerCase()}.`),0);api.done(o===ans,`It is a ${ans.toLowerCase()}.`,[`Count the faces: ${S.faces}.`,...Object.entries(SOLIDS).filter(([n])=>n!==ans).slice(0,2).map(([n,x])=>`A ${n.toLowerCase()} would need ${x.faces}.`)])};$('nCh').appendChild(b)});return}
  const wantOk=Math.random()<.5;let cells,res;do{cells=hexomino();res=foldCube(cells)}while(res.ok!==wantOk);
  const W=Math.max(...cells.map(c=>c[0]))+1,H=Math.max(...cells.map(c=>c[1]))+1,cs=44;
  api.q(`<p class="qt">Is this a net of a cube?</p><p class="qs">Imagine folding the squares up along the lines.</p>`);
  api.body.innerHTML=`<svg viewBox="-3 -3 ${W*cs+6} ${H*cs+6}" class="nsvg" style="max-width:${Math.min(340,W*cs+6)}px" role="img" aria-label="Six squares joined together">${cells.map(([x,y])=>`<rect class="sq" data-k="${gk(x,y)}" x="${x*cs}" y="${y*cs}" width="${cs}" height="${cs}"/>`).join('')}<g id="nT"></g></svg>
    <div class="choices" id="nCh"><button class="btn" data-v="1">Yes, it folds into a cube</button><button class="btn" data-v="0">No, it does not</button></div>`;
  $('nCh').querySelectorAll('button').forEach(b=>{b.style.fontSize='1.05rem';b.onclick=()=>{if(api.answered)return;const v=b.dataset.v==='1',ok=v===res.ok;
    [...$('nCh').children].forEach(x=>{x.disabled=true});b.classList.add(ok?'ok':'no');
    const pal=['var(--teal)','var(--teal)','var(--sun)','var(--sun)','var(--violet)','var(--violet)'];let t='';
    api.body.querySelectorAll('rect.sq').forEach(el=>{const k=el.dataset.k;if(res.ok){el.style.fill=pal[res.down(k)]}else if(res.clash.includes(k)){el.style.fill='var(--bad)';const [x,y]=k.split(',').map(Number);t+=`<text class="tl" x="${x*cs+cs/2}" y="${y*cs+cs/2+5}" text-anchor="middle" style="fill:#fff">!</text>`}});
    $('nT').innerHTML=t;setTimeout(()=>showFold(cells,res,pal),0);
    api.done(ok,res.ok?'Yes, it folds into a cube.':'No, it does not fold into a cube.',res.ok?['Squares of the same colour become <b>opposite</b> faces of the cube (top and bottom, front and back, left and right).','Every face appears exactly once, so the cube closes up.']
      :['The red squares would fold onto the <b>same</b> face, so one face of the cube is left open.','Clues: a cube net never has 4 squares in a 2 by 2 block, and never more than 4 squares in a row.'])}})}});

/* ================= P4 STATISTICS ================= */

/* 13. Graph Reporter — Tables, line graphs and pie charts 1.2 */
const DSETS=[
  {t:'Temperature at the school field',u:'°C',xs:['8 am','9 am','10 am','11 am','12 pm','1 pm','2 pm'],step:1,lo:24,hi:33,thing:'temperature',when:'at',hiQ:'Tap the point that shows the <b>highest</b> temperature.',loQ:'Tap the point that shows the <b>lowest</b> temperature.'},
  {t:'Visitors to the school library',u:'visitors',xs:['Mon','Tue','Wed','Thu','Fri','Sat'],step:20,lo:20,hi:200,thing:'number of visitors',when:'on',hiQ:'Tap the point that shows the day with the <b>most</b> visitors.',loQ:'Tap the point that shows the day with the <b>fewest</b> visitors.'},
  {t:'Height of a bean plant',u:'cm',xs:['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6'],step:2,lo:2,hi:26,thing:'height',when:'in',up:true,hiQ:'Tap the point where the plant was the <b>tallest</b>.'}];
function pieSVG(secs){const C=110,Rr=100;let a=-90,s='';
  secs.forEach(x=>{const sw=x.n/x.d*360,a1=a+sw,p=t=>[(C+Rr*Math.cos(t*Math.PI/180)).toFixed(2),(C+Rr*Math.sin(t*Math.PI/180)).toFixed(2)];
    s+=`<path d="M${C},${C} L${p(a)} A${Rr},${Rr} 0 ${sw>180?1:0} 1 ${p(a1)} Z" style="fill:${x.c}" stroke="var(--ink)" stroke-width="2"/>`;
    if(x.n*4===x.d){const q=t=>[(C+16*Math.cos(t*Math.PI/180)),(C+16*Math.sin(t*Math.PI/180))],u=q(a),v=q(a1);s+=`<path d="M${u[0].toFixed(1)},${u[1].toFixed(1)} L${(u[0]+v[0]-C).toFixed(1)},${(u[1]+v[1]-C).toFixed(1)} L${v[0].toFixed(1)},${v[1].toFixed(1)}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`}
    const m=(a+sw/2)*Math.PI/180,cs=Math.cos(m),sn=Math.sin(m);
    if(sw>=80){const lx=C+58*cs,ly=C+58*sn;
      s+=`<text class="pl" x="${lx.toFixed(1)}" y="${(ly-2).toFixed(1)}" text-anchor="middle">${x.name}</text>${svgLab(x.lab,lx,ly+16,'middle','pl')}`}
    else{/* thin slice: label outside the pie with a pointer line, so it never spills over the slice edges */
      const e=[C+(Rr-14)*cs,C+(Rr-14)*sn],o=[C+(Rr+12)*cs,C+(Rr+12)*sn],anc=cs>.3?'start':cs<-.3?'end':'middle',lx=o[0]+(anc==='start'?4:anc==='end'?-4:0),ly=o[1]+(sn>.3?12:sn<-.3?-14:0);
      s+=`<circle cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="2.5" style="fill:#16233a"/><line x1="${e[0].toFixed(1)}" y1="${e[1].toFixed(1)}" x2="${o[0].toFixed(1)}" y2="${o[1].toFixed(1)}" stroke="var(--ink)" stroke-width="1.5"/>`+
        `<text class="pl plout" x="${lx.toFixed(1)}" y="${(ly-2).toFixed(1)}" text-anchor="${anc}">${x.name}</text>${svgLab(x.lab,lx,ly+16,anc,'pl plout')}`}
    a=a1});
  return `<svg viewBox="-80 -30 380 280" class="psvg" role="img" aria-label="Pie chart">${s}<circle cx="${C}" cy="${C}" r="3" style="fill:var(--ink)"/></svg>`}
const fs=(n,d)=>{const g=gcd(n,d);return `${n/g}/${d/g}`};
/* a fraction label inside an SVG chart, drawn stacked (numerator over a bar over denominator) instead of "1/4" */
function svgLab(lab,x,y,anc,cls){if(!/^\d+\/\d+$/.test(lab))return `<text class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anc}">${lab}</text>`;
  const [n,d]=lab.split('/'),w=Math.max(n.length,d.length)*8+4,cx=anc==='start'?x+w/2:anc==='end'?x-w/2:x;
  return `<text class="${cls}" x="${cx.toFixed(1)}" y="${(y-3).toFixed(1)}" text-anchor="middle">${n}</text><line x1="${(cx-w/2).toFixed(1)}" y1="${(y+1).toFixed(1)}" x2="${(cx+w/2).toFixed(1)}" y2="${(y+1).toFixed(1)}" stroke="currentColor" stroke-width="1.6" class="${cls}"/><text class="${cls}" x="${cx.toFixed(1)}" y="${(y+15).toFixed(1)}" text-anchor="middle">${d}</text>`}
addGame('p4-graphs',{level:'P4',strand:'stat',glyph:'↗',title:'Graph Reporter',topic:'Reading line graphs and pie charts',
 how:'Read the graph like a news reporter. Some questions ask you to tap a point or a line segment on the graph.',rounds:10,
 round(api,r){
  const type=['high','read','inc','diff','pie','low','read','dec','diff','pie2'][r];
  if(type==='pie'||type==='pie2'){
    const sets=[[[1,2],[1,4],[1,8],[1,8]],[[1,4],[1,4],[1,2]],[[1,3],[1,3],[1,6],[1,6]],[[1,2],[1,6],[1,6],[1,6]],[[1,2],[1,3],[1,6]],[[1,4],[3,8],[1,8],[1,4]]];
    const set=shuffle(pick(sets)),names=shuffle(['Football','Swimming','Badminton','Netball','Basketball']).slice(0,set.length),cols=['#ffd0a8','#bcd3fb','#bfe8cf','#f4cfe9'];
    const L=set.reduce((a,[,d])=>lcm(a,d),1);
    if(type==='pie'){const k=R(0,set.length-1),[an,ad]=set[k];
      const secs=set.map(([n,d],i)=>({n,d,c:cols[i],name:names[i],lab:i===k?'?':fs(n,d)}));
      api.q(`<p class="qt">The pie chart shows the favourite sports of some pupils. What fraction of the pupils chose <b>${names[k]}</b>?</p>`);
      const others=set.filter((_,i)=>i!==k),opts=[...new Set([fs(an,ad),fs(1,2),fs(1,4),fs(1,3),fs(1,6),fs(1,8),fs(3,8)])].filter(x=>x===fs(an,ad)||true);
      const choice=shuffle([fs(an,ad),...shuffle(opts.filter(x=>x!==fs(an,ad))).slice(0,3)]);
      api.body.innerHTML=pieSVG(secs)+`<div class="choices" id="pCh"></div>`;
      choice.forEach(o=>{const b=document.createElement('button');b.className='btn';const [n,d]=o.split('/');b.innerHTML=fr(n,d);
        b.onclick=()=>{if(api.answered)return;[...$('pCh').children].forEach(x=>x.disabled=true);b.classList.add(o===fs(an,ad)?'ok':'no');
          api.done(o===fs(an,ad),`${names[k]}: ${nice(an,ad)} of the pupils.`,[`The whole circle is 1 whole = ${fr(L,L)}.`,`The other parts: ${others.map(([n,d])=>`${fr(n,d)} = ${fr(n*L/d,L)}`).join(', ')}`,
            `${fr(L,L)} − ${others.map(([n,d])=>fr(n*L/d,L)).join(' − ')} = ${fr(an*L/ad,L)} = ${nice(an,ad)}`])};$('pCh').appendChild(b)})}
    else{const N=L*R(2,5),k=R(0,set.length-1),[an,ad]=set[k],ans=N*an/ad;
      const secs=set.map(([n,d],i)=>({n,d,c:cols[i],name:names[i],lab:fs(n,d)}));
      api.q(`<p class="qt">${N} pupils took part in the survey. How many pupils chose <b>${names[k]}</b>?</p>`);
      const choice=shuffle([...new Set([ans,N-ans,N/ad,ans+N/L,ans-N/L,ans*2,ans+2*N/L])].filter(x=>x>0&&Number.isInteger(x)).slice(0,4));
      api.body.innerHTML=pieSVG(secs)+`<div class="choices" id="pCh"></div>`;
      choice.forEach(o=>{const b=document.createElement('button');b.className='btn';b.textContent=o;
        b.onclick=()=>{if(api.answered)return;[...$('pCh').children].forEach(x=>{x.disabled=true;if(+x.textContent===ans)x.classList.add('ok')});if(o!==ans)b.classList.add('no');
          api.done(o===ans,`${ans} pupils chose ${names[k]}.`,[`${names[k]} is ${fr(an,ad)} of the pupils.`,`${fr(an,ad)} of ${N} = ${N} ÷ ${ad}${an>1?` × ${an}`:''} = <b>${ans}</b>`])};$('pCh').appendChild(b)})}
    return}
  const ds=type==='dec'||type==='low'?pick(DSETS.filter(d=>!d.up)):pick(DSETS);let v,ok=false;const n=ds.xs.length,steps=(ds.hi-ds.lo)/ds.step;
  while(!ok){v=Array.from({length:n},()=>ds.lo+R(0,steps)*ds.step);if(ds.up)v.sort((a,b)=>a-b);
    const df=v.slice(1).map((x,i)=>x-v[i]),mx=Math.max(...v),mn=Math.min(...v),mi=Math.max(...df),md=Math.min(...df);
    ok=new Set(v).size>=n-1&&v.filter(x=>x===mx).length===1&&v.filter(x=>x===mn).length===1&&mi>0&&df.filter(x=>x===mi).length===1&&(type!=='dec'||(md<0&&df.filter(x=>x===md).length===1))}
  const yMin=Math.max(0,Math.min(...v)-ds.step),yMax=Math.max(...v)+ds.step,X=i=>70+i*(450/(n-1)),Y=y=>250-(y-yMin)/(yMax-yMin)*220;
  let g='';for(let y=yMin;y<=yMax;y+=ds.step){g+=`<line class="grid" x1="70" x2="540" y1="${Y(y)}" y2="${Y(y)}"/><text class="axl" x="62" y="${Y(y)+4}" text-anchor="end">${y}</text>`}
  ds.xs.forEach((x,i)=>{g+=`<text class="axl" x="${X(i)}" y="272" text-anchor="middle">${x}</text>`});
  const segs=v.slice(1).map((y,i)=>`<line class="seg ln" data-i="${i}" x1="${X(i)}" y1="${Y(v[i])}" x2="${X(i+1)}" y2="${Y(y)}"/><line class="hits" data-i="${i}" x1="${X(i)}" y1="${Y(v[i])}" x2="${X(i+1)}" y2="${Y(y)}"/>`).join('');
  const pts=v.map((y,i)=>`<circle class="pt" data-i="${i}" cx="${X(i)}" cy="${Y(y)}" r="6"/><circle class="hitp" data-i="${i}" cx="${X(i)}" cy="${Y(y)}" r="17"/>`).join('');
  const svg=`<svg viewBox="0 0 560 290" class="gsvg" role="img" aria-label="Line graph: ${ds.t}"><text class="axl" x="70" y="16" style="font-size:13px;fill:var(--ink)">${ds.t} (${ds.u})</text>${g}${segs}${pts}</svg>`;
  const df=v.slice(1).map((x,i)=>x-v[i]),u=ds.u==='visitors'?' visitors':ds.u==='°C'?'°C':' cm';
  const tapMode=['high','low','inc','dec'].includes(type);
  if(tapMode){const isPt=type==='high'||type==='low',target=type==='high'?v.indexOf(Math.max(...v)):type==='low'?v.indexOf(Math.min(...v)):type==='inc'?df.indexOf(Math.max(...df)):df.indexOf(Math.min(...df));
    const q={high:ds.hiQ,low:ds.loQ,inc:`Tap the line segment that shows the <b>greatest increase</b> in ${ds.thing}.`,dec:`Tap the line segment that shows the <b>greatest decrease</b> in ${ds.thing}.`}[type];
    api.q(`<p class="qt">${q}</p>`);api.body.innerHTML=svg;api.body.querySelectorAll(isPt?'.hits':'.hitp').forEach(e=>e.remove());
    api.body.querySelectorAll(isPt?'.hitp':'.hits').forEach(el=>el.addEventListener('click',()=>{if(api.answered)return;const i=+el.dataset.i,ok=i===target;
      const pick_=api.body.querySelector(`${isPt?'.pt':'.seg'}[data-i="${i}"]`),right=api.body.querySelector(`${isPt?'.pt':'.seg'}[data-i="${target}"]`);right.classList.add('ok');if(!ok)pick_.classList.add('no');
      const work=isPt?[`The ${type==='high'?'highest':'lowest'} point on the graph is ${ds.when} ${ds.xs[target]}: <b>${v[target]}${u}</b>.`]
        :[`The steepest line ${type==='inc'?'going up':'going down'} is from ${ds.xs[target]} to ${ds.xs[target+1]}.`,`${type==='inc'?'Increase':'Decrease'} = ${Math.max(v[target],v[target+1])} − ${Math.min(v[target],v[target+1])} = <b>${Math.abs(df[target])}${u}</b>`,'The steeper the line, the bigger the change.'];
      api.done(ok,isPt?`${ds.xs[target]}: ${v[target]}${u}.`:`${ds.xs[target]} to ${ds.xs[target+1]}.`,work)}));return}
  let qt,ans,opts,work;
  if(type==='read'){const i=R(0,n-1);ans=v[i];qt=`What was the ${ds.thing} ${ds.when} <b>${ds.xs[i]}</b>?`;opts=[ans,ans+ds.step,ans-ds.step,ans+2*ds.step].filter(x=>x>=0);
    work=[`Find ${ds.xs[i]} on the bottom axis, go straight up to the point, then across to the side axis.`,`The ${ds.thing} was <b>${ans}${u}</b>.`]}
  else{let i,j;do{i=R(0,n-2);j=R(i+1,n-1)}while(v[i]===v[j]);ans=Math.abs(v[j]-v[i]);
    qt=`By how much did the ${ds.thing} ${v[j]>v[i]?'increase':'decrease'} from <b>${ds.xs[i]}</b> to <b>${ds.xs[j]}</b>?`;opts=[ans,v[i]+v[j],Math.max(v[i],v[j]),ans+ds.step,Math.max(ds.step,ans-ds.step)];
    work=[`${ds.xs[i]}: ${v[i]}${u}`,`${ds.xs[j]}: ${v[j]}${u}`,`${v[j]>v[i]?'Increase':'Decrease'} = ${Math.max(v[i],v[j])} − ${Math.min(v[i],v[j])} = <b>${ans}${u}</b>`]}
  opts=shuffle([...new Set(opts)].slice(0,4));
  api.q(`<p class="qt">${qt}</p>`);api.body.innerHTML=svg+`<div class="choices" id="gCh"></div>`;
  opts.forEach(o=>{const b=document.createElement('button');b.className='btn';b.textContent=o+u;
    b.onclick=()=>{if(api.answered)return;[...$('gCh').children].forEach(x=>{x.disabled=true;if(x.textContent===ans+u)x.classList.add('ok')});if(o!==ans)b.classList.add('no');
      api.done(o===ans,`The answer is ${ans}${u}.`,work)};$('gCh').appendChild(b)})}});
