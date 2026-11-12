/* ===== Shared answer boxes that spot common mistakes =====
   askBox wires a Check button to some inputs. judge(vals) returns true (right), a string (a known mistake: shown as the hint),
   or false (wrong, no special hint). First wrong answer at a step → orange retry box with the hint. Second → the round is wrong. */
function askBox(api,o){
  const id=o.id;api.body.insertAdjacentHTML('beforeend',`<div class="askwrap">${o.label?`<p class="asklab">${o.label}</p>`:''}<div class="row askrow">${o.html}<button class="btn primary" id="${id}Go">Check</button></div><div id="${id}M"></div></div>`);
  const ins=[...api.body.querySelectorAll(`[data-ask="${id}"]`)],go=$(id+'Go');
  const vals=()=>{const v={};ins.forEach(i=>{const s=i.value.trim().replace(/[$,\s]/g,'');v[i.dataset.k]=s===''?NaN:+s;v['_'+i.dataset.k]=i.value.trim()});return v};
  const chk=()=>{if(api.answered||go.disabled)return;const v=vals();
    const need=o.need||ins.map(i=>i.dataset.k);if(need.some(k=>v['_'+k]==='')){const f=ins.find(i=>need.includes(i.dataset.k)&&v['_'+i.dataset.k]==='');if(f)f.focus();$(id+'M').innerHTML=`<p class="askneed">Fill in ${need.length>1?'every box':'the box'} first.</p>`;return}
    if(o.numeric!==false&&need.some(k=>isNaN(v[k]))){$(id+'M').innerHTML='<p class="askneed">Type numbers only.</p>';return}
    const res=o.judge(v);
    if(res===true){ins.forEach(i=>{i.disabled=true;i.classList.add('ok')});go.disabled=true;$(id+'M').innerHTML='';const used=ctx&&ctx.st&&ctx.st[id];return o.onRight(v,used)}
    if(res&&res.simp){if(api.first(id+'s')){api.retry($(id+'M'),res.simp);return}ins.forEach(i=>i.disabled=true);go.disabled=true;return o.onRight(v,true)}
    if(api.first(id)){ins.forEach(i=>i.classList.add('no'));api.retry($(id+'M'),typeof res==='string'?res:(o.hint||'Not quite. Check your working and try again.'));const f=ins[0];if(f)f.select();return}
    ins.forEach(i=>i.disabled=true);go.disabled=true;o.onWrong(typeof res==='string'?res:'',v)};
  go.onclick=chk;ins.forEach(i=>{i.onkeydown=e=>{if(e.key==='Enter')chk()};i.oninput=()=>{ins.forEach(x=>x.classList.remove('no'))}});
  return {focus(){if(ins[0]&&innerWidth>700)ins[0].focus()}}}
const inBox=(id,k,lab,w=6,mode='decimal',ph='')=>`<input class="num" style="width:${w}em" data-ask="${id}" data-k="${k}" inputmode="${mode}" aria-label="${lab}" autocomplete="off" placeholder="${ph}">`;
const near=(a,b)=>Math.abs(a-b)<1e-6;
const ptsUsed=u=>u?6:10;
/* a single number answer */
function askOne(api,o){const t=o.traps||[];
  return askBox(api,{id:o.id,label:o.label,html:(o.pre||'')+inBox(o.id,'x',o.aria||'Answer',o.w||6)+(o.unit?`<span class="askunit">${o.unit}</span>`:''),hint:o.hint,
    judge:v=>{if(near(v.x,o.right))return true;const m=t.find(([x])=>typeof x==='function'?x(v.x):near(v.x,x));return m?(typeof m[1]==='function'?m[1](v.x):m[1]):false},
    onRight:(v,u)=>o.then?o.then(v.x,u):api.done(true,o.ok,o.work||[],ptsUsed(u)),
    onWrong:(msg)=>api.done(false,(msg?msg+' ':'')+(o.bad||''),o.work||[])})}

/* ================= P4. Decimal Diner — + − × ÷ with decimals ================= */
const c2s=(c,dp=2)=>{const neg=c<0;c=Math.abs(Math.round(c));let s=(c/Math.pow(10,dp)).toFixed(dp);if(dp>0)s=s.replace(/0+$/,'').replace(/\.$/,'');return (neg?'−':'')+s};
/* column table lined up on the decimal point. rows: array of strings like "3.5". grey zeros show the empty places filled in */
function colTable(rows,op,ans,wrongAlign){const sp=s=>{const [i,f='']=String(s).split('.');return [i,f]};
  const P=rows.map(sp),A=ans!==undefined?sp(ans):null,all=A?[...P,A]:P;
  const mi=Math.max(...all.map(p=>p[0].length)),mf=Math.max(...all.map(p=>p[1].length));
  const line=(p,k,cls)=>{let cells='';
    if(wrongAlign){const s=(p[0]+p[1]),pad=mi+mf-s.length;const raw=p[0]+(p[1]?'.'+p[1]:'');const tot=mi+mf+1;const l=tot-raw.length;
      for(let c=0;c<tot;c++){const ch=c<l?'':raw[c-l];cells+=`<span class="${ch==='.'?'dp':''}">${ch||''}</span>`}}
    else{for(let c=0;c<mi;c++){const ch=p[0][c-(mi-p[0].length)];cells+=`<span>${ch===undefined?'':ch}</span>`}
      cells+=`<span class="dp">${mf?'.':''}</span>`;for(let c=0;c<mf;c++){const ch=p[1][c];cells+=`<span class="${ch===undefined?'pad':''}">${ch===undefined?'0':ch}</span>`}}
    return `<div class="crow ${cls||''}"><span class="cop">${k===rows.length-1&&op?op:''}</span>${cells}</div>`};
  return `<div class="coltab" style="--cols:${(wrongAlign?mi+mf+1:mi+1+mf)}">${P.map((p,k)=>line(p,k)).join('')}${A?line(A,-1,'cans'):''}</div>`}
/* column subtraction done the wrong way: always smaller digit from larger digit */
function smallFromLarge(a,b,dp){const A=String(Math.round(a)).padStart(8,'0'),B=String(Math.round(b)).padStart(8,'0');let s='';for(let i=0;i<8;i++)s+=Math.abs(+A[i]-+B[i]);return +s/Math.pow(10,dp)}
const ticket=(lines,note)=>`<div class="diner"><div class="dtk"><span class="dtkh">🍳 Order ticket</span>${lines.map(l=>`<div class="dline">${l}</div>`).join('')}</div>${note?`<p class="qs">${note}</p>`:''}</div>`;
const FOOD=[['🍔','Burger'],['🍟','Fries'],['🥤','Bubble tea'],['🍗','Chicken wing'],['🍦','Ice cream'],['🥪','Sandwich'],['🍩','Donut'],['🧃','Juice box']];
addGame('p4-diner',{level:'P4',strand:'num',glyph:'🍳',title:'Decimal Diner',topic:'Adding, subtracting, multiplying and dividing decimals',
 how:'Help the cook with orders that use decimals. Line up the decimal points, then work out the answer.',rounds:8,
 round(api,r){
  const type=['add','sub','mul','div','bill','add3','sub2','mul2'][r];
  if(type==='add'||type==='add3'){
    let A,B,C;do{A=R(11,99)*10;B=R(101,899);C=type==='add3'?R(2,9)*100:0}while((A+B)%10===0);
    const a=c2s(A),b=c2s(B),c=C?c2s(C):'',rows=C?[a,b,c]:[a,b],sum=A+B+C,ans=c2s(sum);
    const [f1,f2]=pick([['🥤','bubble tea'],['🍦','ice cream']]);
    api.q(`<p class="qt">The cook poured <b>${a} ℓ</b> of ${f2==='ice cream'?'milk':'tea'} into one pot and <b>${b} ℓ</b> into another${C?`, then added <b>${c} ℓ</b> of water`:''}. How many litres altogether?</p><p class="qs">Step 1: which way should the numbers be lined up?</p>`);
    api.body.innerHTML=ticket(rows.map((x,i)=>`${['Pot A','Pot B','Water'][i]} <b>${x} ℓ</b>`));
    const good=colTable(rows,'+'),bad=colTable(rows,'+',undefined,true);
    choiceRow(api,'dAl',[good,bad],good,ok=>{if(!ok)return api.done(false,`Line up the decimal points, not the last digits. The ${b.slice(-1)} in ${b} is ${b.slice(-1)} hundredths but the ${a.slice(-1)} in ${a} is ${a.slice(-1)} tenths, so they cannot go in the same column.`,[good]);
      $('dAlM').innerHTML='';
      const rightAligned=rows.reduce((s,x)=>s+ +x.replace('.',''),0)/100;
      askOne(api,{id:'dA',label:'Step 2: add. Write the total.',unit:'ℓ',right:sum/100,
        traps:[[rightAligned,`It looks like you lined up the last digits (${rows.map(x=>x.replace('.','')).join(' + ')}). Fill the empty places with 0 so the points line up: ${rows.map(x=>x.includes('.')?(x.split('.')[1].length<2?x+'0':x):x+'.00').join(' + ')}.`],
          [x=>near(x*1000,sum)||near(x*10,sum),`Check where the decimal point goes. Each column keeps its place: the point in the answer sits under the points above it.`],
          [x=>C&&near(x,(A+B+C/100)/100),`The ${c} is a whole number: it means ${c} ones, so it goes in the ones column (${c}.00), not at the end.`]],
        ok:`${rows.join(' + ')} = ${ans} ℓ`,work:['Line up the decimal points. Empty places are 0.',colTable(rows,'+',ans)]})},'dAl');return}
  if(type==='sub'||type==='sub2'){
    let A,B;if(type==='sub'){A=R(3,9)*100;B=R(101,A-11);if(B%10===0)B+=3}else{do{A=R(31,98)*10;B=R(101,A-15)}while(B%10===0||Math.floor(B/10)%10<=Math.floor(A/10)%10)}
    const a=c2s(A),b=c2s(B),ans=c2s(A-B),wrong=smallFromLarge(A,B,2);
    const [e,f]=pick(FOOD);
    api.q(`<p class="qt">The diner had <b>$${a}</b> in the tips jar${type==='sub'?'':' (in coins)'} and used <b>$${b}</b> to buy ${f.toLowerCase()}s. How much is left?</p>`);
    api.body.innerHTML=ticket([`Tips jar <b>$${a}</b>`,`${e} Spent <b>$${b}</b>`]);
    const fin=()=>askOne(api,{id:'dS',label:`${type==='sub'?'Step 2':'Step 2'}: subtract. How much is left?`,pre:'<span class="askunit">$</span>',right:(A-B)/100,
      traps:[[wrong,`You took the smaller digit from the bigger digit in each column. In ${a.includes('.')?a:a+'.00'} − ${b}, when the top digit is smaller you must rename: take 1 from the next column on the left.`],
        [x=>near(x,(A+B)/100),'That is the sum! The question asks what is <b>left</b>, so subtract.']],
      ok:`$${a} − $${b} = $${((A-B)/100).toFixed(2)}`,work:['Line up the points and fill empty places with 0, then rename where needed.',colTable([(A/100).toFixed(2),b],'−',((A-B)/100).toFixed(2)),`Check: ${((A-B)/100).toFixed(2)} + ${b} = ${(A/100).toFixed(2)}`]});
    if(type==='sub'){const W=A/100,opts=[`${W}.00`,`0.0${W}`,`${W}.${String(B).slice(-2)}`];
      api.q($('gq').innerHTML+`<p class="qs">Step 1: before you subtract, write ${W} with two decimal places.</p>`);
      choiceRow(api,'dW',opts,opts[0],ok=>{if(!ok)return api.done(false,`${W} means ${W} ones, so it is ${W}.00. The 0s fill the tenths and hundredths places.`,[colTable([`${W}.00`,b],'−',((A-B)/100).toFixed(2))]);fin()},'dW')}
    else fin();return}
  if(type==='mul'||type==='mul2'){
    let D,n,dp;if(type==='mul'){dp=1;D=R(2,9);n=R(3,9)}else{dp=2;D=R(105,399);if(D%10===0)D+=1;n=R(3,8)}
    const a=c2s(D,dp),unit=dp===1?'tenths':'hundredths',P=D*n,ans=c2s(P,dp);
    const [e,f]=pick(FOOD);
    api.q(`<p class="qt">One ${f.toLowerCase()} needs <b>${a} kg</b> of ${pick(['flour','rice','potatoes','sugar'])}. How much is needed for <b>${n}</b> of them?</p><p class="qs">Think of ${a} as ${D} ${unit}.</p>`);
    api.body.innerHTML=ticket([`${e.repeat(Math.min(n,6))}${n>6?'…':''}`,`${n} × <b>${a} kg</b>`]);
    askOne(api,{id:'dM1',label:`Step 1: ${D} ${unit} × ${n} = how many ${unit}?`,unit,right:P,w:5,
      traps:[[x=>near(x,P/Math.pow(10,dp)),`Here we count in ${unit}, so write a whole number of ${unit}: ${D} × ${n}.`]],
      then:(x,u1)=>askOne(api,{id:'dM2',label:`Step 2: so ${n} × ${a} = ? kg`,unit:'kg',right:P/Math.pow(10,dp),
        traps:[[x=>near(x,P/Math.pow(10,dp+1)),`Too small! ${n} × ${a} must be more than ${a}. ${P} ${unit} = ${ans}: count ${dp} place${dp>1?'s':''} from the right, not ${dp+1}.`],
          [x=>near(x,P/Math.pow(10,dp-1))&&dp>1,`${P} hundredths is ${ans}. 100 hundredths make 1 whole.`],
          [P,`${P} is the number of ${unit}. Change it back to kg: ${P} ${unit} = ${ans}.`]],
        ok:`${n} × ${a} = ${ans} kg`,work:[`${a} = ${D} ${unit}`,`${D} × ${n} = ${P} ${unit}`,`${P} ${unit} = ${ans}`,`Check: ${ans} is ${n} lots of ${a}, so it must be bigger than ${a}.`]})});return}
  if(type==='div'){
    const n=R(2,9),q=pick([R(2,9),R(11,99),R(101,299)]),T=q*n,J=c2s(T,2),ans=c2s(q,2);
    api.q(`<p class="qt">A jug holds <b>${J} ℓ</b> of juice. It is poured equally into <b>${n}</b> cups. How much juice is in each cup?</p>`);
    api.body.innerHTML=ticket([`🫗 Jug <b>${J} ℓ</b>`,`${'🥤'.repeat(n)} ${n} cups`]);
    askOne(api,{id:'dD',label:'Each cup holds',unit:'ℓ',right:q/100,
      traps:[[x=>near(x,q/10)||near(x,q/1000)||near(x,q),x=>`Check by multiplying back: ${x} × ${n} = ${c2s(Math.round(x*n*1000),3)}, not ${J}. Keep each digit in its place: ${J} = ${T} hundredths, and ${T} ÷ ${n} = ${q} hundredths.`],
        [x=>near(x,T/100*n),`You multiplied. Pouring equally into cups means divide: ${J} ÷ ${n}.`]],
      ok:`${J} ℓ ÷ ${n} = ${ans} ℓ`,work:[`${J} = ${T} hundredths`,`${T} ÷ ${n} = ${q} hundredths = ${ans}`,`Check: ${ans} × ${n} = ${J}`]});return}
  if(type==='bill'){
    const items=shuffle(FOOD).slice(0,3).map(([e,f])=>({e,f,c:pick([R(12,79)*5,R(3,9)*50])}));const tot=items.reduce((s,i)=>s+i.c,0),pay=tot<1000?1000:2000;
    const show=items.map(i=>({...i,s:i.c%100===0?'$'+i.c/100:i.c%10===0?'$'+(i.c/100).toFixed(1):'$'+(i.c/100).toFixed(2)}));
    api.q(`<p class="qt">A customer orders ${show.map(i=>`${i.e} ${i.f.toLowerCase()} (<b>${i.s}</b>)`).join(', ')} and pays with a <b>$${pay/100}</b> note.</p>`);
    api.body.innerHTML=ticket([...show.map(i=>`${i.e} ${i.f} <b>${i.s}</b>`),`Paid <b>$${pay/100}.00</b>`],'Prices like $3.5 mean $3.50.');
    const rightAligned=show.reduce((s,i)=>s+ +i.s.slice(1).replace('.',''),0)/100;
    askOne(api,{id:'dB1',label:'Step 1: what is the total cost?',pre:'<span class="askunit">$</span>',right:tot/100,
      traps:[[x=>!near(rightAligned,tot/100)&&near(x,rightAligned),`Did you line up the last digits? ${show.map(i=>i.s).join(' + ')}: write each with 2 decimal places first (${items.map(i=>'$'+(i.c/100).toFixed(2)).join(' + ')}).`]],
      then:()=>askOne(api,{id:'dB2',label:`Step 2: how much change from $${pay/100}?`,pre:'<span class="askunit">$</span>',right:(pay-tot)/100,
        traps:[[smallFromLarge(pay,tot,2),`Careful with renaming: $${pay/100}.00 − $${(tot/100).toFixed(2)}. You cannot take a bigger digit from 0, so rename first.`]],
        ok:`Total $${(tot/100).toFixed(2)}, change $${((pay-tot)/100).toFixed(2)}`,work:[colTable(items.map(i=>(i.c/100).toFixed(2)),'+',(tot/100).toFixed(2)),colTable([(pay/100).toFixed(2),(tot/100).toFixed(2)],'−',((pay-tot)/100).toFixed(2))]})});return}
 }});

/* ================= P4. Train Timetable — 24-hour clock and time durations ================= */
const ttm=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+' '+String(m%60).padStart(2,'0')};
const t12=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mi=m%60;if(m===0)return '12 midnight';if(m===720)return '12 noon';return `${h%12||12}.${String(mi).padStart(2,'0')} ${h<12?'a.m.':'p.m.'}`};
const tdur=d=>`${Math.floor(d/60)?Math.floor(d/60)+' h ':''}${d%60?d%60+' min':''}`.trim();
const asDec=m=>Math.floor(m/60)*100+m%60; /* 13 50 → 1350, the 'subtract like ordinary numbers' mistake */
function board(rows,title){return `<div class="tboard"><div class="tbh">🚆 ${title||'Departures'}</div>${rows.map(r=>`<div class="tbr">${r.map((c,i)=>`<span class="${i===0?'tbn':'tbt'}">${c}</span>`).join('')}</div>`).join('')}</div>`}
/* the hop-by-hop timeline used in the working */
function hops(a,b){const out=[];let t=a;const nextH=Math.ceil((t+1)/60)*60;if(t%60&&nextH<=b){out.push([t,nextH]);t=nextH}
  if(b-t>=60){const hh=Math.floor((b-t)/60)*60;out.push([t,t+hh]);t+=hh}if(b>t)out.push([t,b]);
  return `<div class="hops">${out.map(([x,y],i)=>`${i?'':`<b>${ttm(x)}</b>`}<span class="hop">+${tdur(y-x)}</span><b>${ttm(y)}</b>`).join('')}</div>`}
const durIn=id=>inBox(id,'h','hours',3.2,'numeric')+'<span class="askunit">h</span>'+inBox(id,'m','minutes',3.6,'numeric')+'<span class="askunit">min</span>';
const timeIn=id=>`<input class="num" style="width:5.4em;letter-spacing:.12em" data-ask="${id}" data-k="t" inputmode="numeric" maxlength="5" placeholder="hh mm" aria-label="Time in 24-hour clock" autocomplete="off">`;
const readT=s=>{const d=String(s).replace(/\D/g,'');if(d.length<3||d.length>4)return NaN;const h=+d.slice(0,-2),m=+d.slice(-2);if(h>24||m>59)return NaN;return h*60+m};
function askDur(api,id,right,dec,ok,work,extra=[]){return askBox(api,{id,label:'',html:durIn(id),need:['h','m'],
  judge:v=>{const g=v.h*60+v.m;
    if(dec!==null&&Math.floor(dec/100)*60+dec%100!==right&&(v.h*100+v.m===dec||g===Math.floor(dec/100)*60+dec%100))return `It looks like you subtracted the times like ordinary numbers (${dec}). One hour is 60 minutes, not 100! Count on to the next hour instead.`;
    const t=extra.find(([x])=>x===g);if(t)return t[1];
    if(g===right&&v.m>=60)return {simp:`Your total is right, but ${v.m} min is more than an hour. Change it: ${v.m} min = ${tdur(v.m)}.`};
    if(g===right)return true;if(v.m>=60)return `There are only 60 minutes in an hour. Write the minutes as a number less than 60.`;return false},
  onRight:(v,u)=>api.done(true,ok,work,ptsUsed(u)),onWrong:m=>api.done(false,(m?m+' ':'')+`The answer is ${tdur(right)}.`,work)})}
function askTime(api,id,right,traps,ok,work){
  api.body.insertAdjacentHTML('beforeend','<p class="qs">Type 4 digits, e.g. 0745 or 19 05.</p>');
  return askBox(api,{id,html:timeIn(id),numeric:false,
  judge:v=>{const g=readT(v._t);if(isNaN(g))return 'Write the time with 4 digits: two for the hour (00 to 23) and two for the minutes, e.g. 07 05.';if(g%1440===right%1440)return true;const t=traps.find(([x])=>typeof x==='function'?x(g,v._t):x%1440===g);return t?t[1]:false},
  onRight:(v,u)=>api.done(true,ok,work,ptsUsed(u)),onWrong:m=>api.done(false,(m?m+' ':'')+`The answer is ${ttm(right)}.`,work)})}
const PLACES=['Jurong East','Bishan','Tampines','Woodlands','Changi','Punggol','Bukit Panjang','Pasir Ris','Marina Bay','Serangoon','Kranji','Bedok'];
addGame('p4-train',{level:'P4',strand:'geo',glyph:'🚆',title:'Train Timetable',topic:'24-hour clock and time durations',
 how:'Read the departure board, change between 12-hour and 24-hour clock, and work out how long journeys take.',rounds:8,
 round(api,r){
  const type=['to24','to12','short','arrive','long','depart','table','night'][r];
  const P=shuffle(PLACES);
  if(type==='to24'){const m=pick([R(13,23)*60+R(0,11)*5,R(1,11)*60+R(0,11)*5,R(13,22)*60+R(0,11)*5,pick([R(0,11)*5,720+R(0,11)*5])]);
    api.q(`<p class="qt">The train to <b>${P[0]}</b> leaves at <b>${t12(m).replace('12 midnight','12.00 midnight').replace('12 noon','12.00 noon')}</b>. Write this in 24-hour clock.</p>`);
    api.body.innerHTML=board([[P[0],'??  ??']]);
    const h=Math.floor(m/60);
    askTime(api,'tA',m,[[x=>m<60&&x===m+720,'12.xx a.m. is just after midnight, so the hour is 00 in 24-hour clock.'],[(x,s)=>m>=720&&m<780&&/^24/.test(String(s).replace(/\D/g,'')),'12.xx p.m. is just after noon. It stays as 12 in 24-hour clock (do not add 12).'],
      [x=>h>=13&&x===m-720,`p.m. times are after 12 noon, so add 12 to the hour: ${h-12} + 12 = ${h}.`],[x=>h<12&&x===m+720,'a.m. times are in the morning: keep the hour as it is (with a 0 in front if needed).']],
      `${t12(m)} = ${ttm(m)}`,[`a.m. → keep the hour. p.m. → add 12 to the hour (except 12 noon to 1 p.m.).`,`12 midnight = 00 00, 12 noon = 12 00`]);return}
  if(type==='to12'){const m=R(13,23)*60+R(0,11)*5,h=Math.floor(m/60),mi=m%60;
    api.q(`<p class="qt">The board says the train to <b>${P[0]}</b> leaves at <b>${ttm(m)}</b>. What time is that in 12-hour clock?</p>`);
    api.body.innerHTML=board([[P[0],ttm(m)]]);
    const right=t12(m),c=uniq([right,`${h-10}.${String(mi).padStart(2,'0')} p.m.`,`${h-12}.${String(mi).padStart(2,'0')} a.m.`,`${h}.${String(mi).padStart(2,'0')} p.m.`]).slice(0,4);
    choiceRow(api,'tB',c,right,ok=>api.done(ok,ok?`${ttm(m)} = ${right}`:`Hours after 12 in 24-hour clock are p.m. Take away 12 (not 10): ${h} − 12 = ${h-12}. So ${ttm(m)} = ${right}.`,[`${h} − 12 = ${h-12} → ${right}`]),'tB');return}
  if(type==='short'||type==='long'||type==='table'){
    let a,b;if(type==='short'){a=R(6,21)*60+R(7,11)*5;b=a+R(3,10)*5+(60-a%60)}else{a=R(6,18)*60+R(7,11)*5;b=a+R(1,3)*60+R(1,8)*5;if(b%60>=a%60)b+=60-(b%60)+R(0,a%60/5-1)*5}
    let fromN=P[0],toN=P[1];
    if(type==='table'){const st=P.slice(0,4),t0=R(6,19)*60+R(0,11)*5,gaps=[R(6,19),R(6,19),R(6,19)].map(x=>x*1+R(0,3)*5);const ts=[t0];gaps.forEach(g=>ts.push(ts[ts.length-1]+g));
      let i=0,j=3;if(Math.random()<.5){i=pick([0,1]);j=i+2}a=ts[i];b=ts[j];fromN=st[i];toN=st[j];
      api.q(`<p class="qt">Look at the timetable. How long does the train take to go from <b>${fromN}</b> to <b>${toN}</b>?</p>`);
      api.body.innerHTML=board(st.map((s,k)=>[s,ttm(ts[k])]),'Timetable: one train');}
    else{api.q(`<p class="qt">The train leaves <b>${fromN}</b> at <b>${ttm(a)}</b> and reaches <b>${toN}</b> at <b>${ttm(b)}</b>. How long is the journey?</p>`);
      api.body.innerHTML=board([[`Leaves ${fromN}`,ttm(a)],[`Arrives ${toN}`,ttm(b)]],'Journey')}
    const d=b-a,dec=asDec(b)-asDec(a);
    askDur(api,'tD',d,dec,`${ttm(a)} to ${ttm(b)} is ${tdur(d)}.`,['Count on in hops: to the next hour, then whole hours, then the minutes left.',hops(a,b),`Total: ${tdur(d)}`]);return}
  if(type==='arrive'||type==='depart'){
    const a=R(6,19)*60+R(5,11)*5,d=R(1,2)*60+R(5,11)*5,b=a+d;
    if(type==='arrive'){api.q(`<p class="qt">The train leaves <b>${P[0]}</b> at <b>${ttm(a)}</b>. The journey takes <b>${tdur(d)}</b>. When does it arrive?</p>`);
      api.body.innerHTML=board([[`Leaves ${P[0]}`,ttm(a)],['Journey',tdur(d)],[`Arrives ${P[1]}`,'??  ??']],'Journey');
      const wrongDec=asDec(a)+Math.floor(d/60)*100+d%60;
      askTime(api,'tT',b,[[(x,s)=>+String(s).replace(/\D/g,'')===wrongDec,`${String(wrongDec).padStart(4,'0').replace(/(..)$/,' $1')} is not a real time: minutes only go up to 59. ${a%60} min + ${d%60} min = ${a%60+d%60} min = 1 h ${(a%60+d%60)-60} min, so add 1 to the hour.`]],
        `${ttm(a)} + ${tdur(d)} = ${ttm(b)}`,[hops(a,b)])}
    else{api.q(`<p class="qt">The train reaches <b>${P[1]}</b> at <b>${ttm(b)}</b>. The journey took <b>${tdur(d)}</b>. What time did it leave <b>${P[0]}</b>?</p>`);
      api.body.innerHTML=board([[`Leaves ${P[0]}`,'??  ??'],['Journey',tdur(d)],[`Arrives ${P[1]}`,ttm(b)]],'Journey');
      const wd=asDec(b)-(Math.floor(d/60)*100+d%60);
      askTime(api,'tT',a,[[(x,s)=>+String(s).replace(/\D/g,'')===wd,`${String(wd).padStart(4,'0').replace(/(..)$/,' $1')} is not a real time. When you cannot take away the minutes, take 1 hour and change it to 60 minutes.`],[b+d,'That is later than the arrival! The train left <b>before</b> it arrived, so count back.']],
        `${ttm(b)} − ${tdur(d)} = ${ttm(a)}`,['Count back in hops:',hops(a,b)])}
    return}
  if(type==='night'){const a=R(20,23)*60+R(1,11)*5,b=1440+R(4,7)*60+R(0,11)*5,d=b-a;
    api.q(`<p class="qt">The overnight train leaves <b>${P[0]}</b> at <b>${ttm(a)}</b> and arrives at <b>${P[1]}</b> at <b>${ttm(b)}</b> the next morning. How long is the journey?</p>`);
    api.body.innerHTML=board([[`Leaves ${P[0]}`,ttm(a)],[`Arrives ${P[1]} (next day)`,ttm(b)]],'Night train');
    const back=a-(b-1440);
    askDur(api,'tN',d,null,`${ttm(a)} to ${ttm(b)} the next day is ${tdur(d)}.`,['Split the journey at midnight:',`${ttm(a)} → 24 00 = ${tdur(1440-a)}`,`00 00 → ${ttm(b)} = ${tdur(b-1440)}`,`Total: ${tdur(d)}`],[[back,`You worked out ${ttm(a)} − ${ttm(b)}, going backwards. The train arrives the <b>next day</b>, so count on to midnight (24 00) first, then on to ${ttm(b)}.`]]);return}
 }});

/* ================= P4. Treasure Map — 8-point compass and turns ================= */
const DIRS=['N','NE','E','SE','S','SW','W','NW'],DNAME={N:'North',NE:'North-east',E:'East',SE:'South-east',S:'South',SW:'South-west',W:'West',NW:'North-west'};
const DV=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
const ROSE=[['NW','N','NE'],['W','','E'],['SW','S','SE']];
const LAND=[['🌴','palm tree'],['⛰️','mountain'],['🏝️','island'],['🦜','parrot'],['🛶','canoe'],['🐚','shell'],['🗿','statue'],['🛖','hut'],['🌋','volcano'],['🐊','crocodile']];
function mapSvg(N,items,o={}){const S=44,W=N*S;let s=`<rect x="0" y="0" width="${W}" height="${W}" rx="10" class="sea"/>`;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)s+=`<rect x="${x*S+2}" y="${y*S+2}" width="${S-4}" height="${S-4}" rx="6" class="mcell${o.tap?' tapc':''}" data-x="${x}" data-y="${y}"/>`;
  items.forEach(it=>{s+=`<text x="${it.x*S+S/2}" y="${it.y*S+S/2+9}" text-anchor="middle" font-size="26" pointer-events="none">${it.e}</text>`});
  const rot=(o.rot||0)*45;
  s+=`<g transform="translate(${W+34} 40) rotate(${rot})"><circle r="26" class="narrbg"/><path d="M0 -22 L8 6 L0 0 L-8 6 Z" fill="var(--tomato)"/><path d="M0 22 L8 6 L0 0 L-8 6 Z" fill="var(--muted)"/><text y="-28" text-anchor="middle" transform="rotate(${-rot} 0 -33)" font-weight="800" font-size="15" fill="var(--tomato)">N</text></g>`;
  return `<svg class="tmap" viewBox="-2 -2 ${W+76} ${W+4}" role="img" aria-label="Treasure map">${s}</svg>`}
function faceSvg(id,idx){let s='';DIRS.forEach((d,i)=>{const a=i*Math.PI/4,x=Math.sin(a)*72,y=-Math.cos(a)*72;s+=`<text x="${x}" y="${y+5}" text-anchor="middle" font-size="${d.length>1?13:17}" font-weight="800" fill="${d==='N'?'var(--tomato)':'var(--ink)'}">${d}</text>`});
  return `<svg class="cmpface" viewBox="-95 -95 190 190" role="img" aria-label="Compass with the explorer facing ${DNAME[DIRS[idx]]}"><circle r="56" class="narrbg"/>${s}<g id="${id}" style="transform:rotate(${idx*45}deg);transition:transform 1.1s ease-in-out"><path d="M0 -50 L12 -18 L4 -18 L4 20 L-4 20 L-4 -18 L-12 -18 Z" fill="var(--teal)" stroke="var(--ink)" stroke-width="1.5"/></g><text y="44" text-anchor="middle" font-size="22">🧑‍✈️</text></svg>`}
function roseAsk(api,id,right,trap,okMsg,work,label,then){
  api.body.insertAdjacentHTML('beforeend',`${label?`<p class="asklab">${label}</p>`:''}<div class="rose" id="${id}">${ROSE.flat().map(d=>d?`<button class="btn rb" data-d="${d}">${d}</button>`:'<span class="rc" aria-hidden="true">🧭</span>').join('')}</div><div id="${id}M"></div>`);
  $(id).querySelectorAll('.rb').forEach(b=>b.onclick=()=>{if(api.answered||b.disabled)return;const d=b.dataset.d;
    if(d===right){$(id).querySelectorAll('.rb').forEach(x=>x.disabled=true);b.classList.add('ok');$(id+'M').innerHTML='';const u=ctx.st&&ctx.st[id];return then?then(u):api.done(true,okMsg,work,ptsUsed(u))}
    const t=trap(d);if(api.first(id)){b.classList.add('no');b.disabled=true;api.retry($(id+'M'),t||'Not that way. Have another go!');return}
    $(id).querySelectorAll('.rb').forEach(x=>{x.disabled=true;if(x.dataset.d===right)x.classList.add('ok')});b.classList.add('no');api.done(false,(t?t+' ':'')+`The answer is ${DNAME[right]} (${right}).`,work)})}
const dirOf=(dx,dy)=>DV.findIndex(([a,b])=>a===Math.sign(dx)&&b===Math.sign(dy));
const turnName=k=>({1:'45°',2:'a ¼ turn (90°)',3:'135°',4:'a ½ turn (180°)',6:'a ¾ turn (270°)'})[k];
addGame('p4-compass',{level:'P4',strand:'geo',glyph:'🧭',title:'Treasure Map',topic:'8-point compass and turns',
 how:'Use the 8-point compass to find directions, make turns and walk to the treasure.',rounds:8,
 round(api,r){
  const type=['dir','turn','reverse','walk','turn2','angle','rotmap','quest'][r];
  const L=shuffle(LAND),N=7,cx=3,cy=3;
  const why=(right,d)=>{const ri=DIRS.indexOf(right),di=DIRS.indexOf(d);
    if((ri+4)%8===di)return `That is the opposite way. Start at the pirate and look towards the object.`;
    if(DV[ri][1]===DV[di][1]&&DV[ri][0]===-DV[di][0]&&DV[ri][0])return `East and West are mixed up. With North at the top, East is on the <b>right</b> and West is on the <b>left</b> (Never Eat Soggy Waffles, going clockwise).`;
    if(Math.abs(((ri-di+12)%8)-4)===3)return right.length===2?`Close! It is not straight up, down or across. It is diagonal: halfway between two directions, so it needs two letters.`:`Close! It is in a straight line ${'NS'.includes(right)?'up or down':'across'} from the pirate, so it needs only one letter.`;
    return ''};
  if(type==='dir'||type==='rotmap'){const rot=type==='rotmap'?pick([2,6,4]):0,si=R(0,7),k=R(2,3),[e,n]=L[0];
    const it={x:cx+DV[si][0]*k,y:cy+DV[si][1]*k,e},right=DIRS[(si-rot+8)%8],asIf=DIRS[si];
    const decoys=L.slice(1,4).map(([e2],j)=>{let x,y;do{x=R(0,6);y=R(0,6)}while((x===cx&&y===cy)||(x===it.x&&y===it.y));return {x,y,e:e2}});
    api.q(`<p class="qt">Which direction is the <b>${e} ${n}</b> from the pirate 🏴‍☠️?</p>${rot?'<p class="qs">Look carefully at the North arrow on this map.</p>':''}`);
    api.body.innerHTML=mapSvg(N,[{x:cx,y:cy,e:'🏴‍☠️'},it,...decoys],{rot});
    roseAsk(api,'cD',right,d=>rot&&d===asIf?`That would be right if North pointed up. On this map North points ${['','','to the right','','down','','to the left'][rot]}, so turn the compass in your head to match the arrow.`:why(right,d),
      `The ${n} is ${DNAME[right]} of the pirate.`,[rot?`North points ${['','','right','','down','','left'][rot]} on this map. Turn the compass to match, then read the direction.`:'With North at the top: up is N, right is E, down is S, left is W. Diagonals are NE, SE, SW and NW.']);return}
  if(type==='turn'||type==='turn2'){const f=R(0,7),k=type==='turn'?pick([2,2,4]):pick([1,3,6,6]),cw=Math.random()<.5,t=(f+(cw?k:-k)+8)%8,wrong=(f+(cw?-k:k)+8)%8;
    api.q(`<p class="qt">The pirate faces <b>${DNAME[DIRS[f]]}</b>. She turns <b>${turnName(k)} ${cw?'clockwise':'anticlockwise'}</b>. Which way does she face now?</p>`);
    api.body.innerHTML=`<div class="facewrap">${faceSvg('cF',f)}<div class="clockhint"><b>Clockwise</b> ↻ is the way clock hands move.<br><b>Anticlockwise</b> ↺ is the other way.<br>Each step between points is 45°.</div></div>`;
    roseAsk(api,'cT',DIRS[t],d=>d===DIRS[wrong]?`You turned the wrong way. ${cw?'Clockwise':'Anticlockwise'} goes ${cw?'N → NE → E → SE …':'N → NW → W → SW …'}`:DIRS.indexOf(d)===(f+(cw?k/2|0:-(k/2|0))+8)%8&&k>1?`That is only half the turn. ${turnName(k)} is ${k} steps of 45°.`:k===1||k===3?`Count the steps: ${k*45}° is ${k} step${k>1?'s':''} of 45°.`:'',
      `${DNAME[DIRS[f]]} + ${turnName(k)} ${cw?'clockwise':'anticlockwise'} → ${DNAME[DIRS[t]]}`,[`Count ${k} steps of 45° ${cw?'clockwise':'anticlockwise'} from ${DIRS[f]}: ${Array.from({length:k+1},(_,i)=>DIRS[(f+(cw?i:-i)+80)%8]).join(' → ')}`]);
    const g=$('cF');
    $('cT').addEventListener('click',()=>{if(api.answered)g.style.transform=`rotate(${(f+(cw?k:-k))*45}deg)`});return}
  if(type==='reverse'){const si=R(0,7),[e1,n1]=L[0],[e2,n2]=L[1],k=2;
    api.q(`<p class="qt">The <b>${e1} ${n1}</b> is <b>${DNAME[DIRS[si]]}</b> of the <b>${e2} ${n2}</b>. So the ${n2} is ___ of the ${n1}?</p>`);
    api.body.innerHTML=mapSvg(N,[{x:cx,y:cy,e:e2},{x:cx+DV[si][0]*k,y:cy+DV[si][1]*k,e:e1}]);
    const right=DIRS[(si+4)%8];
    roseAsk(api,'cR',right,d=>d===DIRS[si]?`That is the direction from the ${n2} to the ${n1}. Now stand at the ${n1} and look back: you face the opposite way.`:why(right,d),
      `${n1} is ${DIRS[si]} of the ${n2}, so the ${n2} is ${right} of the ${n1}.`,[`Opposite directions: N ↔ S, E ↔ W, NE ↔ SW, NW ↔ SE.`]);return}
  if(type==='angle'){const f=R(0,7),k=pick([1,2,3,5,6,3]),cw=Math.random()<.5,t=(f+(cw?k:-k)+8)%8;
    api.q(`<p class="qt">The pirate faces <b>${DNAME[DIRS[f]]}</b> and turns <b>${cw?'clockwise':'anticlockwise'}</b> until she faces <b>${DNAME[DIRS[t]]}</b>. How many degrees did she turn?</p>`);
    api.body.innerHTML=`<div class="facewrap">${faceSvg('cF',f)}<div class="clockhint">Each step between the 8 points is <b>45°</b>.<br>A full turn is 360°.</div></div>`;
    askOne(api,{id:'cA',unit:'°',w:4,right:k*45,traps:[[(8-k)*45,`That is the angle going the <b>other</b> way. Turn ${cw?'clockwise':'anticlockwise'}: ${Array.from({length:k+1},(_,i)=>DIRS[(f+(cw?i:-i)+80)%8]).join(' → ')}.`],[k*90,'Each step between the 8 points is 45°, not 90°. 90° is from N to E (2 steps).'],[k,`You counted ${k} steps. Good! Now each step is 45°, so multiply: ${k} × 45°.`]],
      ok:`${k} steps × 45° = ${k*45}°`,work:[`${Array.from({length:k+1},(_,i)=>DIRS[(f+(cw?i:-i)+80)%8]).join(' → ')}: ${k} steps of 45° = ${k*45}°`]});
    const g=$('cF');$('cAGo').addEventListener('click',()=>{if(api.answered)g.style.transform=`rotate(${(f+(cw?k:-k))*45}deg)`});return}
  if(type==='walk'||type==='quest'){let sx,sy,moves,desc;
    if(type==='walk'){const a=pick([0,4]),b=pick([2,6]),n1=R(1,3),n2=R(1,3);sx=3-DV[a][0]*1;sy=a===0?R(4,6):R(0,2);sx=b===2?R(0,2):R(4,6);moves=[[a,n1],[b,n2]];desc=`Walk <b>${n1}</b> square${n1>1?'s':''} <b>${DNAME[DIRS[a]]}</b>, then <b>${n2}</b> square${n2>1?'s':''} <b>${DNAME[DIRS[b]]}</b>.`}
    else{const f=pick([0,2,4,6]),k=pick([2,6]),cw=Math.random()<.5,h=(f+(cw?k:-k)+8)%8,n=R(2,3);sx=3;sy=3;moves=[[h,n]];desc=`Face <b>${DNAME[DIRS[f]]}</b>. Turn <b>${turnName(k)} ${cw?'clockwise':'anticlockwise'}</b>, then walk <b>${n}</b> squares forward.`;moves.f=f;moves.k=k;moves.cw=cw}
    let x=sx,y=sy;moves.forEach(([d,n])=>{x+=DV[d][0]*n;y+=DV[d][1]*n});
    api.q(`<p class="qt">${desc} Tap the square where the pirate ends up and dig for treasure!</p><p class="qs">Count the jumps from square to square, not the square you start on.</p>`);
    api.body.innerHTML=mapSvg(N,[{x:sx,y:sy,e:'🏴‍☠️'},...L.slice(0,3).map(([e])=>{let a,b;do{a=R(0,6);b=R(0,6)}while((a===sx&&b===sy)||(a===x&&b===y));return {x:a,y:b,e}})],{tap:true})+'<div id="cWM"></div>';
    const svg=api.body.querySelector('.tmap');
    svg.querySelectorAll('.tapc').forEach(c=>c.onclick=()=>{if(api.answered)return;const tx=+c.dataset.x,ty=+c.dataset.y;
      if(tx===x&&ty===y){c.classList.add('okc');svg.insertAdjacentHTML('beforeend',`<text x="${x*44+22}" y="${y*44+31}" text-anchor="middle" font-size="26">💰</text>`);const u=ctx.st&&ctx.st.cW;
        return api.done(true,'Treasure found!',[moves.f!==undefined?`Turn first: ${DIRS[moves.f]} → ${DIRS[moves[0][0]]}. Then walk ${moves[0][1]} squares.`:'Walk one direction at a time, counting jumps.'],ptsUsed(u))}
      let msg='';
      const one=moves.map(([d,n])=>[d,n-1]);let ox=sx,oy=sy;one.forEach(([d,n])=>{ox+=DV[d][0]*n;oy+=DV[d][1]*n});
      if(tx===ox&&ty===oy)msg='You counted the starting square. Count the jumps: 1 jump takes you to the next square.';
      else{let mx=sx,my=sy;moves.forEach(([d,n])=>{mx-=DV[d][0]*n*(DV[d][0]?1:0);my+=DV[d][1]*n});if(tx===mx&&ty===my)msg='East and West are mixed up. East is to the right when North is up.';
        else{let ux=sx,uy=sy;moves.forEach(([d,n])=>{ux+=DV[d][0]*n;uy-=DV[d][1]*n});if(tx===ux&&ty===uy)msg='North and South are mixed up. North is at the top of the map.'}}
      if(moves.f!==undefined){const h2=(moves.f+(moves.cw?-moves.k:moves.k)+8)%8;if(tx===sx+DV[h2][0]*moves[0][1]&&ty===sy+DV[h2][1]*moves[0][1])msg=`You turned the wrong way. ${moves.cw?'Clockwise':'Anticlockwise'} is ${moves.cw?'the way clock hands move':'against the clock hands'}.`;
        if(tx===sx+DV[moves.f][0]*moves[0][1]&&ty===sy+DV[moves.f][1]*moves[0][1])msg='You walked without turning first. Turn, then walk.'}
      c.classList.add('noc');
      if(api.first('cW')){api.retry($('cWM'),msg||'No treasure here. Count again, one step at a time.');api.later(()=>c.classList.remove('noc'),900);return}
      svg.querySelector(`.tapc[data-x="${x}"][data-y="${y}"]`).classList.add('okc');api.done(false,(msg?msg+' ':'')+'The treasure was on the green square.',[])});return}
 }});
