/* ================= P6 NUMBER AND ALGEBRA ================= */
const choiceRow=(api,id,cands,right,onPick,step)=>{api.body.insertAdjacentHTML('beforeend',`<div class="choices" id="${id}"></div>${step?`<div id="${id}M"></div>`:''}`);
  shuffle(cands).forEach(c=>{const b=document.createElement('button');b.className='btn';b.innerHTML=c;
    b.onclick=()=>{if(api.answered)return;const ok=c===right;if(step&&!ok&&api.first(step)){b.disabled=true;b.classList.add('no');api.retry($(id+'M'),'Not that one. Have another go!');return}if(step&&$(id+'M'))$(id+'M').innerHTML='';[...$(id).children].forEach(y=>{y.disabled=true;if(y.innerHTML===right)y.classList.add('ok')});if(!ok)b.classList.add('no');onPick(ok)};$(id).appendChild(b)})};
const uniq=a=>a.filter((x,i)=>a.indexOf(x)===i);

/* P6-1. Scoop & Share — Dividing fractions */
function cellsBar(D,W,col,avail){const cw=Math.min(40,400/D);let s='';
  for(let w=0;w<W;w++)for(let k=0;k<D;k++){const i=w*D+k;s+=`<rect x="${k*cw+1}" y="${w*40+1}" width="${cw-2}" height="30" rx="3" style="fill:${col[i]||(i<avail?'var(--surface)':'var(--soft)')}" stroke="${i<avail?'var(--ink)':'var(--line)'}" stroke-width="1.5"/>`}
  return `<svg viewBox="0 0 ${D*cw+2} ${W*40}" style="width:100%;max-width:${D*cw+2}px;height:auto" role="img" aria-label="Fraction bars">${s}</svg>`}
addGame('p6-fdiv',{level:'P6',strand:'num',glyph:'÷',title:'Scoop & Share',topic:'Dividing fractions',
 how:'Share a fraction among friends, or count how many scoops of one fraction fit into another. The bar model shows every step.',rounds:8,
 round(api,r){const type=['fw','fw','wf','wf','ff','ff','ffx','ffx'][r],SC=['#ffb81f','#5fc2b8','#9a8fff','#ff8a72'];
  if(type==='fw'){const b=R(2,5),a=pick([...Array(b-1)].map((_,i)=>i+1).filter(x=>gcd(x,b)===1)),n=R(2,4),who=pick(['friends','children','classmates']);
    api.q(`<p class="qt">${fr(a,b)} of a cake is shared equally among ${n} ${who}. What fraction of the whole cake does each get?</p><p class="qs">${fr(a,b)} ÷ ${n} = ?</p>`);
    const D=b*n,col={};for(let i=0;i<a*n;i++)col[i]='#ffd77a';
    api.body.innerHTML=`<div id="sb">${cellsBar(D,1,col,D)}</div><div><button class="btn primary" id="sCut">Cut each piece into ${n}</button></div>`;
    $('sCut').onclick=()=>{$('sCut').disabled=true;sfx.pop();const c2={};for(let i=0;i<a*n;i++)c2[i]=SC[i%n];$('sb').innerHTML=cellsBar(D,1,c2,D)+`<p class="qs" style="margin-top:6px">Each colour is one share. The whole cake now has ${D} equal pieces.</p>`;
      choiceRow(api,'sCh',uniq([nice(a,D),nice(a*n,b),nice(a,b+n),nice(n,a*b),fr(1,D)]).slice(0,4),nice(a,D),ok=>api.done(ok,`${fr(a,b)} ÷ ${n} = ${nice(a,D)}`,
        [`Cut each of the ${a} piece${a>1?'s':''} into ${n}: the whole cake has ${b} × ${n} = ${D} pieces.`,`Each share gets ${a} piece${a>1?'s':''} of size ${fr(1,D)}: ${nice(a,D)}`,`Shortcut: ${fr(a,b)} ÷ ${n} = ${fr(a,b)} × ${fr(1,n)} = ${nice(a,D)}`]))};return}
  let D,A,c,qText,divTxt,unit;
  if(type==='wf'){const W=R(2,4),d=R(2,6),cc=pick([1,1,2,3].filter(x=>x<d&&(W*d)%x===0));D=d;A=W*d;c=cc;unit=pick(['cup','scoop']);
    qText=`How many ${fr(c,d)}-${unit} scoops of rice are there in ${W} cups?`;divTxt=`${W} ÷ ${fr(c,d)}`}
  else{for(;;){const b=R(2,4),m=R(2,3),d=b*m,a=R(1,b-1);if(gcd(a,b)!==1)continue;const cc=R(1,d-1);if(gcd(cc,d)!==1)continue;A=a*m;D=d;c=cc;const whole=A%c===0;
      if(type==='ff'&&!whole||type==='ffx'&&whole||cc>=A)continue;qText=`How many ${fr(c,d)}-cup scoops are there in ${fr(a,b)} cup of flour?`;divTxt=`${fr(a,b)} ÷ ${fr(c,d)}`;break}}
  const W=Math.ceil(A/D),col={};let filled=0,scoops=0;
  api.q(`<p class="qt">${qText}</p><p class="qs">${divTxt} = ? &nbsp;Tap Scoop until the amount runs out.</p>`);
  api.body.innerHTML=`<div id="sb">${cellsBar(D,W,col,A)}</div><div class="row"><button class="btn primary" id="sSc">Scoop!</button><span class="pill" id="sCnt">Scoops: 0</span></div><div id="sMsg" style="font-weight:700"></div>`;
  $('sSc').onclick=()=>{if(filled>=A)return;const take=Math.min(c,A-filled);for(let i=filled;i<filled+take;i++)col[i]=SC[scoops%4];filled+=take;scoops+=take/c;sfx.pop();
    $('sb').innerHTML=cellsBar(D,W,col,A);$('sCnt').textContent=`Scoops: ${Number.isInteger(scoops)?scoops:`${Math.floor(scoops)} and a part`}`;
    if(filled>=A){$('sSc').disabled=true;if(take<c)$('sMsg').innerHTML=`The last scoop is only ${take} out of ${c} parts full: that is ${fr(take,c)} of a scoop.`;
      const right=nice(A,c);choiceRow(api,'sCh',uniq([right,nice(c,A),nice(A,D*c/gcd(D,c)),nice(A+1,c),String(Math.floor(A/c))]).slice(0,4),right,ok=>api.done(ok,`${divTxt} = ${right}`,
        [`Change to ${D}ths: the amount is ${fr(A,D)} and one scoop is ${fr(c,D)}.`,`Number of scoops = ${A} ÷ ${c} = ${right}`,`Shortcut: divide by a fraction = multiply by its reciprocal: ${divTxt} = ${divTxt.split(' ÷ ')[0]} × ${fr(D,c)} = ${right}`]))}}}});

/* P6-2. Before & After — Percentage: whole from part, percentage increase and decrease */
function pctBars(before,after,lab1,lab2,showAfter){const S=x=>x*2.6;const bar=(y,p,col,lab)=>`<rect x="10" y="${y}" width="${S(p)}" height="30" rx="5" style="fill:${col}" stroke="var(--ink)" stroke-width="2"/><text x="${S(p)+16}" y="${y+21}" class="nlab" style="font-size:14px">${lab}</text>`;
  let g='';for(let p=0;p<=150;p+=10)g+=`<line x1="${10+S(p)}" x2="${10+S(p)}" y1="8" y2="${showAfter?118:72}" stroke="var(--line)" ${p%50?'':'stroke-width="2"'}/>${p%50===0?`<text x="${10+S(p)}" y="${showAfter?136:90}" text-anchor="middle" class="axl" style="font-size:12px;fill:var(--muted)">${p}%</text>`:''}`;
  return `<svg viewBox="0 0 480 ${showAfter?142:96}" style="width:100%;max-width:520px;height:auto" role="img" aria-label="Percentage bar model">${g}${bar(20,before,'#bcd3fb',lab1)}${showAfter?bar(70,after,'#ffd0a8',lab2):''}</svg>`}
addGame('p6-pchange',{level:'P6',strand:'num',glyph:'%↑',title:'Before & After',topic:'Percentage: finding the whole; percentage increase and decrease',
 how:'Drag the slider to build the bar model first, then work out the answer. Before is always 100%.',rounds:8,
 round(api,r){const type=['whole','after','after','pct','whole','before','pct','after'][r];let q,P,lab1,lab2,ans,u='',work,unit;
  if(type==='whole'){const p=pick([10,20,25,40,50,75,15,30]),W=pick([40,60,80,120,200,240,300,400,500]),part=W*p/100;if(!Number.isInteger(part))return this.round(api,r);
    unit=pick(['$','']);q=unit?`David saved $${part} last month. This was ${p}% of his pocket money. How much was his pocket money?`:`${part} pupils in a school walk to school. This is ${p}% of all the pupils. How many pupils are there?`;
    P=p;lab1='?';ans=W;u=unit?'$':'';work=[`${p}% → ${unit}${part}`,`1% → ${unit}${part} ÷ ${p} = ${unit}${part/p}`,`100% → ${unit}${part/p} × 100 = <b>${unit}${W}</b>`]}
  else{const B=pick([80,120,200,250,400,500,800,1200,2200]),c=pick([5,10,15,20,25,30,40]),up=Math.random()<.6,A=B*(100+(up?c:-c))/100;if(!Number.isInteger(A))return this.round(api,r);
    const thing=pick([['membership of a club','members'],['price of a bicycle','$'],['number of visitors to a museum','visitors']]),money=thing[1]==='$',f=v=>money?'$'+v:String(v);
    P=up?100+c:100-c;lab1=f(B);
    if(type==='after'){q=`Last year, the ${thing[0]} was ${f(B)}. This year it ${up?'increased':'decreased'} by ${c}%. What is it this year?`;ans=A;lab2='?';u=money?'$':'';work=[`This year = 100% ${up?'+':'−'} ${c}% = ${P}% of last year`,`1% → ${B} ÷ 100 = ${B/100}`,`${P}% → ${B/100} × ${P} = <b>${f(A)}</b>`]}
    else if(type==='pct'){q=`The ${thing[0]} changed from ${f(B)} to ${f(A)}. What was the percentage ${up?'increase':'decrease'}?`;ans=c;lab2=f(A);u='%';work=[`Change = ${Math.max(A,B)} − ${Math.min(A,B)} = ${Math.abs(A-B)}`,`Percentage ${up?'increase':'decrease'} = ${Math.abs(A-B)} ÷ ${B} × 100% = <b>${c}%</b>`,'Always compare the change with the value <b>before</b>.']}
    else{q=`After a ${c}% ${up?'increase':'decrease'}, the ${thing[0]} is ${f(A)}. What was it before?`;ans=B;lab1='?';lab2=f(A);u=money?'$':'';work=[`After = ${P}% of before`,`${P}% → ${A}`,`1% → ${A} ÷ ${P} = ${A/P}`,`100% → ${A/P} × 100 = <b>${f(B)}</b>`]}}
  const two=type!=='whole';
  api.q(`<p class="qt">${q}</p>`);
  api.body.innerHTML=`<div id="pb"></div><div class="row"><label for="pS" style="font-weight:800">${two?'Step 1: Set the After bar':'Step 1: Shade the part you know'}</label><input type="range" id="pS" min="0" max="150" step="5" value="${two?100:50}" style="flex:1;min-width:180px;accent-color:var(--tomato)"><span class="pill" id="pV"></span><button class="btn" id="pSet">Set</button></div><div id="pS2"></div>`;
  const draw=()=>{const v=+$('pS').value;$('pV').textContent=v+'%';$('pb').innerHTML=two?pctBars(100,v,lab1,lab2,true):pctBars(v,0,type==='whole'?(u?'$':'')+String(q.match(/\d+/)[0]):'',null,false)+`<p class="qs" style="margin:0">The whole bar is 100%.</p>`};
  $('pS').oninput=draw;draw();let s1=null;
  $('pSet').onclick=()=>{if(s1!==null)return;const v=+$('pS').value;if(v!==P&&api.first('bar')){api.retry($('pS2'),`Not quite. ${two?`Think: what percentage of the before amount is the after amount?`:`Read the percentage in the question again.`} Move the slider and press Set again.`);return}s1=v===P;$('pS').disabled=true;$('pSet').disabled=true;s1?sfx.pop():sfx.soft();
    if(!s1){$('pS').value=P;draw()}
    $('pS2').innerHTML=`<p style="margin:0 0 8px;font-weight:800">${s1?'Bar model set correctly!':`The bar should be at ${P}%. I have moved it for you.`}</p><div class="row"><b>Step 2:</b>${u==='$'?'<b>$</b>':''}<input class="num" id="pIn" inputmode="decimal" aria-label="Answer">${u&&u!=='$'?`<span>${u}</span>`:''}<button class="btn primary" id="pChk">Check</button></div>`;
    $('pChk').onclick=()=>{const v2=parseFloat($('pIn').value.replace(/[$,%\s]/g,''));if(isNaN(v2))return;$('pIn').disabled=true;const o=Math.abs(v2-ans)<.001;
      api.done(s1&&o,`The answer is ${u==='$'?'$':''}${ans}${u==='%'?'%':''}.`,work,(s1?4:0)+(o?6:0))}}}});

/* P6-3. Ratio Kitchen — Ratio */
function cupsRow(s,w){return `<div class="cups">${Array.from({length:s},()=>'<span class="cup syr" aria-hidden="true"></span>').join('')}${Array.from({length:w},()=>'<span class="cup wat" aria-hidden="true"></span>').join('')}</div>`}
function unitModel(rows,total){return `<div class="umodel">${rows.map(([n,k,col,lab])=>`<div class="urow"><b>${n}</b><div class="ubar">${Array.from({length:k},()=>`<span style="background:${col}">${lab}</span>`).join('')}</div></div>`).join('')}${total?`<div class="utot">Total: ${total}</div>`:''}</div>`}
/* Ratio Kitchen: every round happens in Chef Qubi's kitchen */
const ING=[['flour','#f6e7c8','🌾'],['sugar','#ffc9dc','🍬'],['cocoa','#8b5a3c','🍫'],['milk','#ffffff','🥛'],['mango','#ffb627','🥭'],['oats','#d9b98a','🥣'],['butter','#ffe58a','🧈'],['berries','#c94f8a','🫐']];
const cupI=(c,small)=>`<svg viewBox="0 0 22 26" width="${small?16:22}" height="${small?19:26}" aria-hidden="true"><path d="M3 5h16l-2.2 18H5.2z" fill="${c}" stroke="#16233a" stroke-width="1.6" stroke-linejoin="round"/><path d="M2 5h18" stroke="#16233a" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const KIT=(title,inner)=>`<div class="kitchen"><div class="kwall"><span class="kchef">👩‍🍳</span><b>${title}</b></div><div class="kcounter">${inner}</div></div>`;
const kRow=(ing,n,small)=>`<div class="krow"><span class="klab">${ing[2]} ${ing[0]}</span><span class="kcups">${n?Array.from({length:n},()=>cupI(ing[1],small)).join(''):'<span class="kq">? ? ?</span>'}</span><b class="kn">${n?`${n} cup${n>1?'s':''}`:'? cups'}</b></div>`;
const DRINK={lemonade:[['lemon juice','#fff176','🍋'],['water','#9fd8ff','💧']],'bubble tea':[['tea','#c58b4f','🍵'],['milk','#ffffff','🥛']],'mango lassi':[['mango','#ffb627','🥭'],['yogurt','#f3f0e6','🥛']],'chocolate milk':[['cocoa','#8b5a3c','🍫'],['milk','#ffffff','🥛']]};
const kCard=(name,lines)=>`<div class="rkcard"><span class="rkpin" aria-hidden="true"></span><b>📜 Recipe: ${name}</b>${lines.map(l=>`<div>${l}</div>`).join('')}</div>`;
const kGroups=(A,B,p,q,k)=>`<div class="kgroups">${Array.from({length:k},(_,i)=>`<div class="kgrp"><small>Group ${i+1}</small><span>${Array.from({length:p},()=>cupI(A[1],1)).join('')}</span><span>${Array.from({length:q},()=>cupI(B[1],1)).join('')}</span></div>`).join('')}</div>`;
addGame('p6-ratio',{level:'P6',strand:'num',glyph:'a:b',title:'Ratio Kitchen',topic:'Ratio: simplest form, equivalent ratios, dividing in a ratio',
 how:'Help Chef Qubi in the kitchen! Read the recipe cards, simplify ratios of cups, scale recipes up, mix drinks and share the baking fairly.',rounds:8,
 round(api,r){const type=['simplify','missing','mix','divide','simplify','three','divide','recipe'][r];
  let p,q;do{p=R(1,5);q=R(1,5)}while(p===q||gcd(p,q)!==1);let [A,B]=shuffle(ING).slice(0,2);
  const ans1=(q2,ans,u,work,pic='')=>{api.q(`<p class="qt">${q2}</p>`);api.body.innerHTML=pic+`<div class="row"><input class="num" id="rkIn" inputmode="numeric" aria-label="Answer"><span>${u}</span><button class="btn primary" id="rkChk">Check</button></div>`;
    const go=()=>{const v=parseFloat($('rkIn').value);if(isNaN(v))return;$('rkIn').disabled=true;api.done(v===ans,`The answer is ${ans} ${u}.`,work)};$('rkChk').onclick=go;$('rkIn').onkeydown=e=>{if(e.key==='Enter')go()}};
  if(type==='simplify'){const k=R(2,r<4?3:5),a=p*k,b=q*k,right=`${p} : ${q}`,dish=pick(['pancakes','brownies','muffins','a birthday cake','cookies']);
    api.q(`<p class="qt">Chef Qubi is making ${dish}. The bowl has <b>${a} cups of ${A[0]}</b> and <b>${b} cups of ${B[0]}</b>. What is the ratio of ${A[0]} to ${B[0]} in its simplest form?</p>`);
    api.body.innerHTML=KIT('Mixing bowl',kRow(A,a)+kRow(B,b));
    const opts=uniq([right,`${q} : ${p}`,`${a} : ${b}`,`${p} : ${p+q}`,k%2===0&&k>2?`${a/2} : ${b/2}`:`${q} : ${p+q}`]).slice(0,4);
    choiceRow(api,'rkC',shuffle(opts),right,ok=>api.done(ok,`${a} : ${b} = ${right}`,
      [`Put the cups into ${k} equal groups. Each group has ${p} cup${p>1?'s':''} of ${A[0]} and ${q} cup${q>1?'s':''} of ${B[0]}:`,kGroups(A,B,p,q,k),`So ${a} : ${b} = ${a} ÷ ${k} : ${b} ÷ ${k} = <b>${right}</b>`,`Order matters: ${A[0]} comes first because the question says "${A[0]} to ${B[0]}".`]));return}
  if(type==='missing'){const k=R(2,6),dish=pick(Object.keys(DRINK)),known=Math.random()<.5;[A,B]=DRINK[dish];
    const card=kCard(dish,[`${A[2]} ${p} cup${p>1?'s':''} of ${A[0]}`,`${B[2]} ${q} cup${q>1?'s':''} of ${B[0]}`]);
    const pot=KIT('Party-size pot',kRow(A,known?p*k:0,1)+kRow(B,known?0:q*k,1));
    ans1(`For a class party, Chef Qubi makes a big pot of ${dish} using the same recipe. She uses <b>${known?p*k:q*k} cups of ${known?A[0]:B[0]}</b>. How many cups of ${known?B[0]:A[0]} does she need?`,known?q*k:p*k,'cups',
      [`Recipe: ${A[0]} : ${B[0]} = ${p} : ${q}`,`${known?p*k:q*k} cups is ${known?p*k:q*k} ÷ ${known?p:q} = ${k} times the recipe.`,`${known?B[0]:A[0]} = ${known?q:p} × ${k} = <b>${known?q*k:p*k} cups</b>`],`<div class="rkside">${card}${pot}</div>`);return}
  if(type==='mix'){const k=R(2,3),T=(p+q)*k;if(T>21)return this.round(api,r);const d={s:0,w:0};
    api.q(`<p class="qt">A customer wants a jug of rose syrup drink with <b>${T} cups altogether</b>. The recipe mixes syrup and water in the ratio <b>${p} : ${q}</b>.<br>How many cups of syrup and how many cups of water should Chef Qubi pour into the jug?</p><p class="qs">Tap <b>+</b> to pour one cup at a time. The jug must have exactly ${T} cups, and syrup : water must be ${p} : ${q}.</p>`);
    api.body.innerHTML=`<div class="rkside">${kCard('Rose syrup drink',[`🌹 ${p} cup${p>1?'s':''} of syrup`,`💧 ${q} cup${q>1?'s':''} of water`,`<small>Makes ${p+q} cups. Bigger jugs use the same ratio.</small>`])}${KIT(`Your jug (needs ${T} cups)`,'<div id="rkCups"></div>')}</div><div class="row"><div class="stepper"><span>Syrup</span><button class="btn" data-k="s" data-d="-1" aria-label="Less syrup">−</button><b id="rkS">0</b><button class="btn" data-k="s" data-d="1" aria-label="More syrup">+</button></div>
      <div class="stepper"><span>Water</span><button class="btn" data-k="w" data-d="-1" aria-label="Less water">−</button><b id="rkW">0</b><button class="btn" data-k="w" data-d="1" aria-label="More water">+</button></div></div>
      <div class="row"><span class="pill" id="rkT"></span><button class="btn primary" id="rkChk">Serve the drink</button></div>`;
    const jug=()=>{const n=d.s+d.w,H=Math.max(T,n),h=150/H,W=110;let g=`<path d="M20 12 h${W} v156 q0 10 -10 10 h${-W+20} q-10 0 -10 -10z" fill="#ffffff" stroke="#16233a" stroke-width="3"/><path d="M${20+W} 40 q30 0 30 30 v40 q0 22 -30 22" fill="none" stroke="#16233a" stroke-width="5"/>`;
      for(let i=0;i<n;i++){const y=168-(i+1)*h;g+=`<rect x="23" y="${y}" width="${W-6}" height="${h}" fill="${i<d.s?'#e8673c':'#8fd3ff'}" stroke="#ffffff" stroke-width="1"/>`}
      const ty=168-T*h;g+=`<line x1="10" y1="${ty}" x2="${W+30}" y2="${ty}" stroke="#16233a" stroke-width="2" stroke-dasharray="6 4"/><text x="${W+34}" y="${ty+5}" font-size="13" font-weight="800" fill="#16233a">${T} cups</text>`;
      return `<div class="jugwrap"><svg viewBox="0 0 220 182" width="220" height="182" role="img" aria-label="Jug with ${d.s} cups of syrup and ${d.w} cups of water">${g}</svg><div class="jugkey"><span><i style="background:#e8673c"></i>Syrup: <b>${d.s}</b> cup${d.s===1?'':'s'}</span><span><i style="background:#8fd3ff"></i>Water: <b>${d.w}</b> cup${d.w===1?'':'s'}</span><span>Poured: <b>${n}</b> of ${T} cups</span><span>Ratio now: <b>${d.s} : ${d.w}</b></span></div></div>`};
    const draw=()=>{$('rkCups').innerHTML=jug();$('rkS').textContent=d.s;$('rkW').textContent=d.w;$('rkT').textContent=d.s+d.w>T?'Too much! The jug only needs '+T+' cups.':d.s+d.w===T?'The jug has '+T+' cups. Is the ratio right?':`${T-d.s-d.w} more cup${T-d.s-d.w===1?'':'s'} to pour`};draw();
    api.body.querySelectorAll('.stepper .btn').forEach(b=>b.onclick=()=>{if(api.answered)return;const k2=b.dataset.k;d[k2]=Math.max(0,Math.min(21,d[k2]+ +b.dataset.d));sfx.tap();draw()});
    $('rkChk').onclick=()=>{const ok=d.s*q===d.w*p&&d.s+d.w===T;api.done(ok,ok?`${d.s} cups of syrup and ${d.w} cups of water. The customer loves it!`:`You made ${d.s} : ${d.w} with ${d.s+d.w} cups.`,
      [`Total units = ${p} + ${q} = ${p+q}`,`1 unit = ${T} ÷ ${p+q} = ${k} cups`,`Syrup = ${p} × ${k} = <b>${p*k}</b> cups, water = ${q} × ${k} = <b>${q*k}</b> cups`])};return}
  if(type==='divide'){const u=R(3,12),tot=(p+q)*u,ask=pick(['A','B','diff']),ans=ask==='A'?p*u:ask==='B'?q*u:Math.abs(p-q)*u,item=pick([['cookies','🍪'],['tarts','🥧'],['cupcakes','🧁'],['buns','🥯']]);
    api.q(`<p class="qt">Chef Qubi baked <b>${tot} ${item[0]}</b>. She packed all of them into a red box and a blue box in the ratio <b>${p} : ${q}</b>. ${ask==='diff'?`How many more ${item[0]} are in the box with more?`:`How many ${item[0]} are in the ${ask==='A'?'red':'blue'} box?`}</p>`);
    api.body.innerHTML=KIT('Packing table',`<div class="ktray">${item[1].repeat(Math.min(tot,40))}${tot>40?` <small>… ${tot} ${item[0]} in all</small>`:''}</div>`)+unitModel([['Red box',p,'#ffb3a7','?'],['Blue box',q,'#a9c8ff','?']],`${tot} ${item[0]}`)+`<div class="row"><b>1 unit =</b><input class="num" id="rk1" inputmode="numeric" aria-label="One unit"></div><div class="row"><b>Answer =</b><input class="num" id="rk2" inputmode="numeric" aria-label="Answer"><button class="btn primary" id="rkChk">Check</button></div>`;
    $('rkChk').onclick=()=>{const a1=+$('rk1').value,a2=+$('rk2').value;if(!$('rk2').value)return;const o1=a1===u,o2=a2===ans;$('rk1').disabled=$('rk2').disabled=true;
      api.done(o1&&o2,`1 unit = ${u}; the answer is ${ans} ${item[0]}.`,[`Total units = ${p} + ${q} = ${p+q}`,`1 unit = ${tot} ÷ ${p+q} = <b>${u}</b>`,ask==='diff'?`Difference = ${Math.abs(p-q)} units = ${Math.abs(p-q)} × ${u} = <b>${ans}</b>`:`${ask==='A'?'Red':'Blue'} box = ${ask==='A'?p:q} units = ${ask==='A'?p:q} × ${u} = <b>${ans}</b>`])};return}
  if(type==='three'){const c=R(1,5),u=R(2,12),tot=(p+q+c)*u,nm=shuffle(['Ali','Bala','Chen']);
    ans1(`Chef Qubi's three helpers, ${nm[0]}, ${nm[1]} and ${nm[2]}, share <b>${tot} eggs</b> in the ratio ${p} : ${q} : ${c}. How many eggs does ${nm[1]} get?`,q*u,'eggs',
      [`Total units = ${p} + ${q} + ${c} = ${p+q+c}`,`1 unit = ${tot} ÷ ${p+q+c} = ${u} eggs`,`${nm[1]} gets ${q} units = ${q} × ${u} = <b>${q*u} eggs</b>`],KIT('Egg tray',`<div class="ktray">${'🥚'.repeat(Math.min(tot,40))}${tot>40?` <small>… ${tot} eggs in all</small>`:''}</div>`)+unitModel([[nm[0],p,'#bcd3fb',''],[nm[1],q,'#ffd0a8',''],[nm[2],c,'#bfe8cf','']],tot+' eggs'));return}
  const dz=pick([2,3,4]),cups=pick([1,2,3]),mult=pick([2,3,4,5]),want=dz*mult,F=ING[0];
  ans1(`The recipe card makes <b>${dz} dozen cookies</b>. The school fair needs <b>${want} dozen cookies</b>. How many cups of flour are needed?`,cups*mult,'cups',
    [`${want} dozen is ${want} ÷ ${dz} = ${mult} times the recipe.`,`Flour = ${cups} × ${mult} = <b>${cups*mult} cups</b>`],`<div class="rkside">${kCard(`Cookies (makes ${dz} dozen)`,[`${F[2]} ${cups} cup${cups>1?'s':''} of flour`,`🧈 1 block of butter`,`🍫 1 bag of chocolate chips`])}${KIT('Fair order',`<div class="ktray">${'🍪'.repeat(Math.min(want,24))}</div><small>${want} dozen needed (each 🍪 = 1 dozen)</small>`)}</div>`)}});
/* P6-4. Balance Scale — Algebra */
function scaleSVG(bags,loose,right,tilt){const W=b=>Array.from({length:b},(_,i)=>`<rect x="${-46+i%5*19}" y="${-28-Math.floor(i/5)*24}" width="17" height="22" rx="5" fill="#9a8fff" stroke="#16233a" stroke-width="1.5"/><text x="${-37.5+i%5*19}" y="${-12-Math.floor(i/5)*24}" text-anchor="middle" style="fill:#fff;font:800 12px var(--body)">x</text>`).join('');
  const wts=(n,ox)=>{const tens=Math.floor(n/10),ones=n%10;let s='';for(let i=0;i<tens;i++)s+=`<rect x="${ox+i%4*20}" y="${-36-Math.floor(i/4)*38}" width="18" height="34" rx="3" fill="#ffb81f" stroke="#16233a" stroke-width="1.5"/><text x="${ox+9+i%4*20}" y="${-14-Math.floor(i/4)*38}" text-anchor="middle" style="font:800 11px var(--body);fill:#16233a">10</text>`;
    for(let i=0;i<ones;i++)s+=`<rect x="${ox+(tens?Math.min(4,tens)*20+4:0)+i%3*13}" y="${-12-Math.floor(i/3)*13}" width="11" height="11" rx="2" fill="#ffd77a" stroke="#16233a" stroke-width="1.2"/>`;return s};
  return `<svg viewBox="0 0 360 230" style="width:100%;max-width:440px;height:auto" role="img" aria-label="Balance scale: ${bags} bags of x and ${loose} on the left, ${right} on the right">
    <polygon points="170,210 190,210 180,120" fill="#3d4b63"/><rect x="120" y="208" width="120" height="10" rx="4" fill="#3d4b63"/>
    <g transform="rotate(${tilt} 180 120)"><line x1="40" y1="120" x2="320" y2="120" stroke="#3d4b63" stroke-width="7" stroke-linecap="round"/>
    <g transform="translate(90,150)"><path d="M-62,0 L62,0 L50,14 L-50,14Z" fill="#9aa6b8"/><line x1="0" y1="-30" x2="0" y2="0" stroke="#3d4b63" stroke-width="0"/>${W(bags)}${wts(loose,bags?50:-46)}</g>
    <g transform="translate(270,150)"><path d="M-62,0 L62,0 L50,14 L-50,14Z" fill="#9aa6b8"/>${wts(right,-50)}</g>
    <line x1="90" y1="120" x2="90" y2="150" stroke="#3d4b63" stroke-width="2"/><line x1="270" y1="120" x2="270" y2="150" stroke="#3d4b63" stroke-width="2"/></g>
    <text x="90" y="200" text-anchor="middle" class="nlab" style="font-size:15px">${bags?bags+'x':''}${bags&&loose?' + ':''}${loose||(!bags?'0':'')}</text><text x="270" y="200" text-anchor="middle" class="nlab" style="font-size:15px">${right}</text></svg>`}
addGame('p6-algebra',{level:'P6',strand:'num',glyph:'x',title:'Balance Scale',topic:'Algebra: expressions and simple linear equations',
 how:'Keep the scale balanced. Take the same amount off both sides, then share equally among the bags to find x. Some rounds ask you to simplify or substitute.',rounds:8,
 round(api,r){const type=['eq','eq','sub','eq','simp','word','eq','word'][r];
  if(type==='sub'){const a=R(2,9),b=R(1,20),v=R(2,9),form=pick(['ax+b','ax−b','b+v/a']);let ex,ans,work;
    if(form==='ax+b'){ex=`${a}y + ${b}`;ans=a*v+b;work=[`Replace y with ${v}: ${a} × ${v} + ${b}`,`= ${a*v} + ${b} = <b>${ans}</b>`]}else if(form==='ax−b'){const bb=Math.min(b,a*v-1);ex=`${a}y − ${bb}`;ans=a*v-bb;work=[`Replace y with ${v}: ${a} × ${v} − ${bb}`,`= ${a*v} − ${bb} = <b>${ans}</b>`]}
    else{const vv=v*a;ex=`${b} + y ÷ ${a}`;ans=b+v;work=[`Replace y with ${vv}: ${b} + ${vv} ÷ ${a}`,`= ${b} + ${v} = <b>${ans}</b>`];api.q(`<p class="qt">Find the value of <b>${ex}</b> when y = ${vv}.</p>`);
      choiceRow(api,'bsC',uniq([String(ans),String(b+vv*a),String(b*a+vv),String(ans+1),String((b+vv)/a)]).filter(x=>!x.includes('.')).slice(0,4),String(ans),ok=>api.done(ok,`${ex} = ${ans}`,work));return}
    api.q(`<p class="qt">Find the value of <b>${ex}</b> when y = ${v}.</p>`);
    choiceRow(api,'bsC',uniq([String(ans),String(a+v+(form==='ax+b'?b:-Math.min(b,a*v-1))),`${a}${v}`,String(ans+a)]).slice(0,4),String(ans),ok=>api.done(ok,`${ex} = ${ans}`,[...work,`${a}y means ${a} × y, not the digits ${a} and y side by side.`]));return}
  if(type==='simp'){const a=R(2,9),b=R(1,9),c=R(1,Math.min(9,a+b-1)),k=R(1,9),right=`${a+b-c}p + ${k}`;
    api.q(`<p class="qt">Simplify <b>${a}p + ${b}p − ${c}p + ${k}</b></p>`);
    choiceRow(api,'bsC',uniq([right,`${a+b+c}p + ${k}`,`${a+b-c+k}p`,`${a+b-c}p`,`${a+b-c}p + ${k}p`]).slice(0,4),right,ok=>api.done(ok,`${a}p + ${b}p − ${c}p + ${k} = ${right}`,
      [`Collect the p terms: ${a} + ${b} − ${c} = ${a+b-c}, so ${a+b-c}p.`,`${k} is a number without p, so it cannot join the p terms.`]));return}
  let a,x,b,q='';
  if(type==='word'){if(r===5){const t=pick([30,40,50,60]),d=pick([4,6,8,10]);if((t-d)%2)return this.round(api,r);a=2;b=d;x=(t-d)/2;q=`There are ${t} children in a dance group. There are ${d} more boys than girls. Let x be the number of girls. How many girls are there?`}
    else{a=R(3,5);x=R(4,12);b=R(2,15);q=`Mei buys ${a} identical books and a $${b} pen. She pays $${a*x+b} altogether. Let x be the cost of one book in dollars. Find x.`}}
  else{a=R(r<2?1:2,r<2?3:5);x=R(2,12);b=R(r<2?2:5,20)}
  const c=a*x+b;let loose=b,right=c,divided=false;
  api.q(`<p class="qt">${q||`Solve for x: <b>${a===1?'':a}x + ${b} = ${c}</b>`}</p>${q?`<p class="qs">Equation: ${a===1?'':a}x + ${b} = ${c}</p>`:''}`);
  api.body.innerHTML=`<div id="bsS"></div><div class="row" id="bsB"><button class="btn" data-n="1">− 1 both sides</button><button class="btn" data-n="5">− 5 both sides</button><button class="btn" data-n="10">− 10 both sides</button><button class="btn" id="bsD">Share among the ${a} bag${a>1?'s':''}</button></div><div id="bsM" style="font-weight:700;min-height:1.4em"></div><div id="bsA"></div>`;
  const draw=t=>{$('bsS').innerHTML=scaleSVG(a,loose,right,t||0);$('bsD').disabled=loose>0||divided};draw();let slip=0;
  $('bsB').querySelectorAll('[data-n]').forEach(btn=>btn.onclick=()=>{if(api.answered||divided)return;const n=+btn.dataset.n;
    if(n>loose){slip++;sfx.soft();$('bsM').textContent=`The left side only has ${loose} loose weight${loose===1?'':'s'} to take off. You cannot take off ${n}.`;draw(n>loose?-6:0);api.later(()=>draw(0),500);return}
    loose-=n;right-=n;sfx.tap();$('bsM').textContent=loose?'':`Now ${a===1?'x':a+'x'} = ${right}.`;draw()});
  $('bsD').onclick=()=>{divided=true;sfx.pop();$('bsM').textContent=`${a} bag${a>1?'s':''} balance ${right}, so one bag balances ${right} ÷ ${a}.`;
    $('bsA').innerHTML=`<div class="row"><b>x =</b><input class="num" id="bsIn" inputmode="numeric" aria-label="x"><button class="btn primary" id="bsChk">Check</button></div>`;
    $('bsChk').onclick=()=>{const v=parseInt($('bsIn').value,10);if(isNaN(v))return;$('bsIn').disabled=true;const ok=v===x;
      api.done(ok,`x = ${x}${q&&r===5?': there are '+x+' girls.':''}`,[`${a===1?'':a}x + ${b} = ${c}`,`Take ${b} off both sides: ${a===1?'':a}x = ${c} − ${b} = ${c-b}`,a>1?`Divide both sides by ${a}: x = ${c-b} ÷ ${a} = <b>${x}</b>`:`x = <b>${x}</b>`,`Check: ${a} × ${x} + ${b} = ${c} ✓`],ok?Math.max(5,10-2*slip):0)}}}});
