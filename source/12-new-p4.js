/* ===== Shared answer boxes that spot common mistakes =====
   askBox wires a Check button to some inputs. judge(vals) returns true (right), a string (a known mistake: shown as the hint),
   or false (wrong, no special hint). First wrong answer at a step → orange retry box with the hint. Second → the round is wrong. */
function askBox(api,o){
  const id=o.id;api.body.insertAdjacentHTML('beforeend',`<div class="askwrap">${o.label?`<p class="asklab">${o.label}</p>`:''}<div class="row askrow">${o.html}<button class="btn primary" id="${id}Go">Check</button></div><div id="${id}M"></div></div>`);
  const ins=[...api.body.querySelectorAll(`[data-ask="${id}"]`)],go=$(id+'Go');
  /* a step already solved before this round's second try stays solved */
  const KB=ctx&&ctx.keep,kk='ab:'+id;if(KB&&KB[kk]){const sv=KB[kk];ins.forEach(i=>{i.value=sv.raw[i.dataset.k]||'';i.disabled=true;i.classList.add('ok')});go.disabled=true;Promise.resolve().then(()=>{if(!api.answered)o.onRight(sv.v,sv.used)});return {focus(){}}}
  const keepIt=(v,u)=>{if(KB)KB[kk]={v,used:u,raw:Object.fromEntries(ins.map(i=>[i.dataset.k,i.value]))}};
  const vals=()=>{const v={};ins.forEach(i=>{const s=i.value.trim().replace(/[$,\s]/g,'').replace(/[−–]/g,'-');v[i.dataset.k]=s===''?NaN:+s;v['_'+i.dataset.k]=i.value.trim()});return v};
  const chk=()=>{if(api.answered||go.disabled)return;const v=vals();
    if(o.zero){if(o.zero.every(k=>v['_'+k]==='')){const f=ins.find(i=>o.zero.includes(i.dataset.k));if(f)f.focus();$(id+'M').innerHTML='<p class="askneed">Type your answer first. You can leave a box empty if it is 0.</p>';return}o.zero.forEach(k=>{if(v['_'+k]===''){v[k]=0;v['_'+k]='0'}})}
    const need=o.need||ins.map(i=>i.dataset.k);if(need.some(k=>v['_'+k]==='')){const f=ins.find(i=>need.includes(i.dataset.k)&&v['_'+i.dataset.k]==='');if(f)f.focus();$(id+'M').innerHTML=`<p class="askneed">Fill in ${need.length>1?'every box':'the box'} first.</p>`;return}
    if(o.numeric!==false&&need.some(k=>isNaN(v[k]))){$(id+'M').innerHTML='<p class="askneed">Type numbers only.</p>';return}
    const res=o.judge(v);
    if(res===true){ins.forEach(i=>{i.disabled=true;i.classList.add('ok')});go.disabled=true;$(id+'M').innerHTML='';const used=ctx&&ctx.st&&ctx.st[id];keepIt(v,used);return o.onRight(v,used)}
    if(res&&res.simp){if(api.first(id+'s')){api.retry($(id+'M'),res.simp);return}ins.forEach(i=>i.disabled=true);go.disabled=true;keepIt(v,true);return o.onRight(v,true)}
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
    onWrong:(msg)=>o.then?revealStep(api,o,msg):api.done(false,(msg?msg+' ':'')+(o.bad||''),o.work||[])})}
/* a middle step answered wrongly twice: show the answer and have the pupil type it in before the next step (the round then scores less) */
function revealStep(api,o,msg){const id=o.id,ins=[...api.body.querySelectorAll(`[data-ask="${id}"]`)],go=$(id+'Go');ctx.keep.pen=1;
  const money=o.pre&&o.pre.includes('$'),r=o.showRight||(money&&!Number.isInteger(o.right)?Number(o.right).toFixed(2):o.right);
  $(id+'M').innerHTML=`<p class="retrymsg">${msg?msg+' ':''}The answer is <b>${money?'$':''}${r}${o.unit?' '+o.unit:''}</b>. Type it in to carry on.</p>`;
  ins.forEach(i=>{i.disabled=false;i.classList.remove('no');i.value=''});go.disabled=false;if(ins[0])ins[0].focus()}

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
const ttm=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+'\u00a0'+String(m%60).padStart(2,'0')};
const t12=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mi=m%60;if(m===0)return '12 midnight';if(m===720)return '12 noon';return `${h%12||12}.${String(mi).padStart(2,'0')} ${h<12?'a.m.':'p.m.'}`};
const tdur=d=>`${Math.floor(d/60)?Math.floor(d/60)+'\u00a0h ':''}${d%60?d%60+'\u00a0min':''}`.trim().replace(/ /g,'\u00a0');
const asDec=m=>Math.floor(m/60)*100+m%60; /* 13 50 → 1350, the 'subtract like ordinary numbers' mistake */
function board(rows,title,icon='🚆'){return `<div class="tboard"><div class="tbh">${icon} ${title||'Departures'}</div>${rows.map(r=>`<div class="tbr">${r.map((c,i)=>`<span class="${i===0?'tbn':'tbt'}">${c}</span>`).join('')}</div>`).join('')}</div>`}
/* the hop-by-hop timeline used in the working */
function hops(a,b){const out=[];let t=a;const nextH=Math.ceil((t+1)/60)*60;if(t%60&&nextH<=b){out.push([t,nextH]);t=nextH}
  if(b-t>=60){const hh=Math.floor((b-t)/60)*60;out.push([t,t+hh]);t+=hh}if(b>t)out.push([t,b]);
  return `<div class="hops">${out.map(([x,y],i)=>`${i?'':`<b>${ttm(x)}</b>`}<span class="hop">+${tdur(y-x)}</span><b>${ttm(y)}</b>`).join('')}</div>`}
const durIn=id=>inBox(id,'h','hours',3.2,'numeric')+'<span class="askunit">h</span>'+inBox(id,'m','minutes',3.6,'numeric')+'<span class="askunit">min</span>';
const timeIn=id=>`<input class="num" style="width:5.4em;letter-spacing:.12em" data-ask="${id}" data-k="t" inputmode="numeric" maxlength="5" placeholder="hh mm" aria-label="Time in 24-hour clock" autocomplete="off">`;
const readT=s=>{const d=String(s).replace(/\D/g,'');if(d.length<3||d.length>4)return NaN;const h=+d.slice(0,-2),m=+d.slice(-2);if(h>24||m>59)return NaN;return h*60+m};
function askDur(api,id,right,dec,ok,work,extra=[]){return askBox(api,{id,label:'',html:durIn(id),need:['h','m'],zero:['h','m'],
  judge:v=>{const g=v.h*60+v.m;
    if(dec!==null&&Math.floor(dec/100)*60+dec%100!==right&&(v.h*100+v.m===dec||g===Math.floor(dec/100)*60+dec%100))return `It looks like you subtracted the times like ordinary numbers (${dec}). One hour is 60 minutes, not 100! Count on to the next hour instead.`;
    const t=extra.find(([x])=>x===g);if(t)return t[1];
    if(g===right&&v.m>=60)return {simp:`Your total is right, but ${v.m} min is more than an hour. Change it: ${v.m} min = ${tdur(v.m)}.`};
    if(g===right)return true;if(v.m>=60)return `There are only 60 minutes in an hour. Write the minutes as a number less than 60.`;return false},
  onRight:(v,u)=>api.done(true,ok,work,ptsUsed(u)),onWrong:m=>api.done(false,(m?m+' ':'')+`The answer is ${tdur(right)}.`,work)})}
function askTime(api,id,right,traps,ok,work){
  api.body.insertAdjacentHTML('beforeend','<p class="qs">Type 4 digits, e.g. 0745 or 19 05.</p>');
  return askBox(api,{id,html:timeIn(id),numeric:false,
  judge:v=>{const g=readT(v._t);const t0=traps.find(([x])=>typeof x==='function'&&x(g,v._t));if(isNaN(g)&&t0)return t0[1];if(isNaN(g))return 'Write the time with 4 digits: two for the hour (00 to 23) and two for the minutes, e.g. 07 05.';if(g%1440===right%1440)return true;const t=traps.find(([x])=>typeof x==='function'?x(g,v._t):x%1440===g);return t?t[1]:false},
  onRight:(v,u)=>api.done(true,ok,work,ptsUsed(u)),onWrong:m=>api.done(false,(m?m+' ':'')+`The answer is ${ttm(right)}.`,work)})}
/* Shared journey player: the vehicle travels the route while each part's time pops up. Before answering there is no clock, so nothing is given away;
   after answering, Replay shows the clock (or running total). */
let jmTok=0,JMD=null;
const MRT={
 NS:{name:'North–South Line',col:'#d42e12',st:[['Jurong East',190,320],['Bukit Batok',190,280],['Bukit Gombak',190,240],['Choa Chu Kang',190,200],['Yew Tee',190,160],['Kranji',200,112],['Marsiling',235,72],['Woodlands',285,44],['Admiralty',340,44],['Sembawang',395,44],['Canberra',450,44],['Yishun',492,72],['Khatib',492,97],['Yio Chu Kang',492,121],['Ang Mo Kio',492,146],['Bishan',492,170],['Braddell',492,194],['Toa Payoh',492,218],['Novena',492,243],['Newton',492,268],['Orchard',492,305],['Somerset',492,345],['Dhoby Ghaut',492,385],['City Hall',527,420],['Raffles Place',527,462],['Marina Bay',590,536],['Marina South Pier',590,598]]},
 EW:{name:'East–West Line',col:'#009645',st:[['Pasir Ris',935,200],['Tampines',910,240],['Simei',890,270],['Tanah Merah',870,301],['Bedok',835,301],['Kembangan',800,301],['Eunos',765,301],['Paya Lebar',728,301],['Aljunied',685,320],['Kallang',645,340],['Lavender',607,365],['Bugis',570,390],['City Hall',527,420],['Raffles Place',527,462],['Tanjong Pagar',478,462],['Outram Park',425,420],['Tiong Bahru',400,415],['Redhill',370,410],['Queenstown',335,400],['Commonwealth',300,390],['Buona Vista',261,377],['Dover',240,362],['Clementi',215,342],['Jurong East',190,320],['Chinese Garden',170,320],['Lakeside',150,320],['Boon Lay',130,320],['Pioneer',110,320],['Joo Koon',90,320],['Gul Circle',70,320],['Tuas Crescent',50,320],['Tuas West Road',30,320],['Tuas Link',10,320]]},
 CG:{name:'East–West Line',col:'#009645',noQ:1,st:[['Tanah Merah',870,301],['Expo',910,340],['Changi Airport',955,340]]},
 NE:{name:'North East Line',col:'#9900aa',st:[['HarbourFront',410,536],['Outram Park',425,420],['Chinatown',460,410],['Clarke Quay',476,398],['Dhoby Ghaut',492,385],['Little India',520,350],['Farrer Park',540,318],['Boon Keng',560,288],['Potong Pasir',578,258],['Woodleigh',596,225],['Serangoon',613,192],['Kovan',638,152],['Hougang',663,122],['Buangkok',688,92],['Sengkang',713,64],['Punggol',738,40],['Punggol Coast',766,16]]},
 CC:{name:'Circle Line',col:'#fa9e0d',loop:1,st:[['Dhoby Ghaut',492,385],['Bras Basah',565,410],['Esplanade',640,430],['Promenade',712,449],['Nicoll Highway',727,421],['Stadium',737,392],['Mountbatten',740,361],['Dakota',737,331],['Paya Lebar',728,301],['MacPherson',710,268],['Tai Seng',684,238],['Bartley',651,212],['Serangoon',613,192],['Lorong Chuan',554,175],['Bishan',492,170],['Marymount',438,176],['Caldecott',387,192],['Botanic Gardens',322,233],['Farrer Road',285,276],['Holland Village',264,325],['Buona Vista',261,377],['one-north',267,406],['Kent Ridge',279,434],['Haw Par Villa',296,461],['Pasir Panjang',319,485],['Labrador Park',346,506],['Telok Blangah',376,523],['HarbourFront',410,536],['Keppel',454,547],['Cantonment',500,550],['Prince Edward Road',546,547],['Marina Bay',590,536],['Bayfront',654,506]]},
 DT:{name:'Downtown Line',col:'#005ec4',st:[['Bukit Panjang',220,140],['Cashew',232,160],['Hillview',244,180],['Hume',256,198],['Beauty World',268,214],['King Albert Park',282,222],['Sixth Avenue',296,228],['Tan Kah Kee',309,231],['Botanic Gardens',322,233],['Stevens',420,268],['Newton',492,268],['Little India',520,350],['Rochor',545,370],['Bugis',570,390],['Promenade',712,449],['Bayfront',654,506],['Downtown',610,495],['Telok Ayer',565,482],['Chinatown',460,410],['Fort Canning',455,372],['Bencoolen',510,362],['Jalan Besar',560,340],['Bendemeer',600,325],['Geylang Bahru',640,305],['Mattar',675,287],['MacPherson',710,268],['Ubi',745,252],['Kaki Bukit',780,237],['Bedok North',815,222],['Bedok Reservoir',850,207],['Tampines West',880,225],['Tampines',910,240],['Tampines East',935,270],['Upper Changi',935,305],['Expo',910,340]]},
 TE:{name:'Thomson–East Coast Line',col:'#9d5b25',st:[['Woodlands North',285,12],['Woodlands',285,44],['Woodlands South',285,72],['Springleaf',300,94],['Lentor',318,114],['Mayflower',336,134],['Bright Hill',354,154],['Upper Thomson',370,173],['Caldecott',387,192],['Stevens',420,268],['Napier',430,290],['Orchard Boulevard',455,305],['Orchard',492,305],['Great World',470,345],['Havelock',448,383],['Outram Park',425,420],['Maxwell',455,452],['Shenton Way',520,492],['Marina Bay',590,536],['Gardens by the Bay',650,578],['Tanjong Rhu',700,578],['Katong Park',745,578],['Tanjong Katong',790,578],['Marine Parade',835,578],['Marine Terrace',880,578],['Siglap',920,578],['Bayshore',960,578]]}};
for(const k in MRT){const L=MRT[k],P=L.st.map(t=>Array.isArray(t)?{n:t[0],x:t[1],y:t[2]}:{n:t});let last=0;
  for(let i=1;i<P.length;i++)if(P[i].x!=null){for(let j=last+1;j<i;j++){const f=(j-last)/(i-last);P[j].x=P[last].x+(P[i].x-P[last].x)*f;P[j].y=P[last].y+(P[i].y-P[last].y)*f}last=i}L.P=P}
const ISLAND=(()=>{const p=[[-10,330],[5,265],[60,215],[125,150],[165,80],[235,18],[330,-8],[450,10],[560,-8],[690,-5],[800,18],[880,85],[955,150],[1005,230],[995,330],[1008,440],[995,560],[945,612],[800,612],[700,612],[620,628],[540,628],[460,604],[375,572],[300,522],[230,452],[150,392],[60,372]];
  const n=p.length;let d=`M${p[0]}`;for(let i=0;i<n;i++){const p0=p[(i-1+n)%n],p1=p[i],p2=p[(i+1)%n],p3=p[(i+2)%n];d+=` C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2}`}return d+'Z'})();
function jmRun(api,clock,instant){const D=JMD,V=$('jmV'),C=$('jmC');if(!D||!V)return;const tok=++jmTok;
  const inP=[...document.querySelectorAll('.jmwrap .jmp')],total=D.segs.reduce((x,y)=>x+y,0);
  const spr=q=>{const m=D.modes[q]==='change'?'walk':D.modes[q];V.querySelectorAll('[data-m]').forEach(g=>g.style.display=g.dataset.m===m?'':'none');const t=V.querySelector('.tc');if(t)t.setAttribute('stroke',D.cols[q]);D.ang=D.angs[q]};
  const put=p=>{V.setAttribute('transform',`translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${D.k}) rotate(${(D.ang||0).toFixed(1)})`);C.setAttribute('transform',`translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) scale(${D.k})`)};
  const lab=t=>{C.setAttribute('opacity',clock?1:0);C.querySelector('text').textContent=D.a!=null?ttm(D.a+t):tdur(t)||'0 min'};
  const end=()=>{inP.forEach(p=>{p.style.opacity=1;p.style.transform=''});if(api.answered)document.querySelectorAll('.jmwrap .jmp[data-real] text').forEach(t=>t.textContent=t.parentNode.dataset.real);
    const q=D.samp.length-1,s=D.samp[q];spr(q);put(s[s.length-1]);lab(total);
    const w=api.body.querySelector('.askwrap');if(w)w.style.visibility='';const sk=$('jmSkip');if(sk)sk.style.display='none'};
  spr(0);put(D.samp[0][0]);lab(0);if(!clock)inP.forEach(p=>{p.style.opacity=0;p.style.transform='scale(.6)'});
  if(instant||calm)return end();
  const sk=$('jmSkip');if(sk)sk.style.display='';
  let k=0,t0=null,base=0;const ms=m=>Math.min(1500,380+m*24);
  const step=ts=>{if(tok!==jmTok||!document.body.contains(V))return;
    if(t0===null){t0=ts;spr(k);const p=inP[k];if(p){p.style.opacity=1;p.style.transform='scale(1.15)';setTimeout(()=>{if(tok===jmTok)p.style.transform=''},260)}}
    const m=D.segs[k],f=Math.min(1,(ts-t0)/ms(m)),s=D.samp[k];put(s[Math.round(f*(s.length-1))]);lab(base+Math.round(m*f));
    if(f<1)return requestAnimationFrame(step);
    base+=m;k++;if(k>=D.segs.length)return end();
    t0=null;setTimeout(()=>{if(tok===jmTok)requestAnimationFrame(step)},260)};
  requestAnimationFrame(step)}
function jmStart(api){const w=api.body.querySelector('.askwrap');if(w&&!calm)w.style.visibility='hidden';
  $('jmPlay').onclick=()=>{sfx.tap();jmRun(api,api.answered,false)};$('jmSkip').onclick=()=>{sfx.tap();jmTok++;jmRun(api,api.answered,true)};
  setTimeout(()=>jmRun(api,false,false),350)}
/* Time jump tool: pupils hop from the start time to the end time (next o'clock, +1 h, +10/5/1 min). It never adds the hops up for them. */
function timeJump(api,a,b){const span=b-a;let hops=[];
  api.body.insertAdjacentHTML('beforeend',`<div class="tjw"><button class="btn" id="tjOpen" aria-expanded="false">🦘 Use the time jump</button><div id="tjP" hidden style="margin-top:10px;border:2px solid var(--line);border-radius:14px;padding:12px;display:grid;gap:10px;background:var(--surface)">
    <p style="margin:0;font-weight:700">Start at <b>${ttm(a)}</b> and jump until you land on <b>${ttm(b)}</b>. Then add up your jumps.</p>
    <svg id="tjS" viewBox="0 0 660 120" style="width:100%;height:auto;display:block" role="img" aria-label="Time jump number line"></svg>
    <div class="row" style="gap:6px">${[['next',"To the next o'clock"],[60,'+1 h'],[10,'+10 min'],[5,'+5 min'],[1,'+1 min']].map(([v,t])=>`<button class="btn" data-j="${v}">${t}</button>`).join('')}<button class="btn" data-j="undo">↩ Undo</button></div>
    <p id="tjM" style="margin:0;font-weight:800" aria-live="polite"></p></div></div>`);
  const S=$('tjS'),M=$('tjM');
  const now=()=>a+hops.reduce((x,y)=>x+y,0);
  const X=t=>20+Math.min(1.08,(t-a)/span)*580;
  const draw=()=>{const t=now();let s=`<line x1="20" y1="86" x2="${Math.max(620,X(t)+10)}" y2="86" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>`;
    s+=`<line x1="20" y1="76" x2="20" y2="96" stroke="var(--ink)" stroke-width="3"/><text x="20" y="114" text-anchor="middle" font-size="14" font-weight="800" fill="var(--ink)">${ttm(a)}</text>`;
    s+=`<line x1="600" y1="74" x2="600" y2="98" stroke="var(--tomato)" stroke-width="3"/><text x="600" y="114" text-anchor="middle" font-size="14" font-weight="800" fill="var(--tomato)">${ttm(b)}</text>`;
    let p=a;const pos=hops.map(h=>{const r=[p,p+h];p+=h;return r});
    pos.forEach(([u,v])=>{const x1=X(u),x2=X(v),mid=(x1+x2)/2,ht=Math.min(46,10+(x2-x1)*.35);s+=`<path d="M${x1} 84 Q${mid} ${84-ht*2} ${x2} 84" fill="none" stroke="var(--teal)" stroke-width="3"/><polygon points="${x2},84 ${x2-6},77 ${x2+1},75" fill="var(--teal)"/>`});
    const grp=[];hops.forEach((h,k)=>{const g=grp[grp.length-1],w=X(pos[k][1])-X(pos[k][0]);if(g&&g.h===h&&w<48&&g.narrow)g.n++,g.e=k;else grp.push({h,n:1,s:k,e:k,narrow:w<48})});
    let row=0;grp.forEach(g=>{const x1=X(pos[g.s][0]),x2=X(pos[g.e][1]),mid=(x1+x2)/2,w=x2-x1,ht=Math.min(46,10+(X(pos[g.s][1])-x1)*.35);
      const y=w<60?(row++%2?20:36):Math.max(13,84-ht-6);s+=`<text x="${mid}" y="${y}" text-anchor="middle" font-size="13" font-weight="800" fill="var(--teal)">${g.n>1?g.n+' × '+tdur(g.h):'+'+tdur(g.h)}</text>`});
    let last=20;pos.forEach(([u,v])=>{const x=X(v);if(v!==b&&x-last>=46&&600-x>=46){s+=`<text x="${x}" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="var(--muted)">${ttm(v)}</text>`;last=x}});
    s+=`<circle cx="${X(t)}" cy="86" r="7" fill="${t===b?'var(--good)':t>b?'var(--bad)':'var(--violet)'}"/>`;S.innerHTML=s;
    M.innerHTML=!hops.length?'Pick a jump.':t===b?`🎉 You landed on ${ttm(b)}! Now add up your jumps: ${hops.map(h=>tdur(h)).join(' + ')}`:t>b?`Too far: you are at ${ttm(t)}, past ${ttm(b)}. Undo and take a smaller jump.`:`You are at <b>${ttm(t)}</b>.`};
  $('tjOpen').onclick=()=>{const P=$('tjP'),o=P.hidden;P.hidden=!o;$('tjOpen').setAttribute('aria-expanded',o);sfx.tap();draw()};
  $('tjP').querySelectorAll('[data-j]').forEach(btn=>btn.onclick=()=>{const v=btn.dataset.j,t=now();sfx.tap();
    if(v==='undo')hops.pop();else if(t<b){const h=v==='next'?(t%60?60-t%60:60):+v;hops.push(h)}draw()})}
const PLACES=['Jurong East','Bishan','Tampines','Woodlands','Changi','Punggol','Bukit Panjang','Pasir Ris','Marina Bay','Serangoon','Kranji','Bedok'];
/* long journeys use real intercity routes with believable times (min–max minutes), so a 2 h trip is never "Tampines to Pasir Ris" */
const LONGTRIPS=[['KL Sentral','Ipoh','ETS train',130,155],['Ipoh','Butterworth','ETS train',100,125],['KL Sentral','Butterworth','ETS train',240,275],['JB Sentral','KL Sentral','ETS train',280,320],['KL Sentral','Seremban','KTM Komuter train',75,95],['Gemas','KL Sentral','ETS train',105,130],['Bangkok','Ayutthaya','train',85,110],['Butterworth','Padang Besar','ETS train',95,120]];
const NIGHTTRIPS=[['Bangkok','Chiang Mai','sleeper train',650,730],['Bangkok','Nong Khai','sleeper train',590,660],['Bangkok','Ubon Ratchathani','sleeper train',540,620]];
/* consecutive stations along one real MRT line: n stops, every `step` stations */
function mrtRun(n,step=1){for(let t=0;t<200;t++){const k=pick(['NS','EW','NE','CC','DT','TE']),L=MRT[k].P,need=(n-1)*step+1;if(L.length<need)continue;const i=R(0,L.length-need);let s=[];for(let q=0;q<n;q++)s.push(L[i+q*step].n);if(Math.random()<.5)s.reverse();if(new Set(s).size===n)return{line:MRT[k].name,st:s}}return{line:MRT.EW.name,st:MRT.EW.P.slice(0,n).map(p=>p.n)}}
function longTrip(fit){for(let t=0;t<400;t++){const T=pick(LONGTRIPS),d=R(Math.ceil(T[3]/5),Math.floor(T[4]/5))*5,o=fit(d);if(o){return{from:T[0],to:T[1],kind:T[2],d,...o}}}}
addGame('p4-train',{level:'P4',strand:'geo',glyph:'🚆',title:'Train Timetable',topic:'24-hour clock and time durations',
 how:'Read the departure board, change between 12-hour and 24-hour clock, and work out how long journeys take.',rounds:8,
 round(api,r){
  const type=['to24','to12','short','arrive','long','depart','table','night'][r];
  const P=shuffle(PLACES);
  if(type==='to24'){const m=pick([R(13,23)*60+R(0,11)*5,R(1,11)*60+R(0,11)*5,R(13,22)*60+R(0,11)*5,pick([R(0,11)*5,720+R(0,11)*5])]);
    api.q(`<p class="qt">The train to <b>${P[0]}</b> leaves at <b>${t12(m).replace('12 midnight','12.00 midnight').replace('12 noon','12.00 noon')}</b> today. Write this time in 24-hour clock.</p>`);
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
    let a,b,fromN=P[0],toN=P[1],kind='train',lineN='';if(type==='short'){a=R(6,21)*60+R(7,11)*5;b=a+R(2,6)*5+(60-a%60);const M=mrtRun(Math.max(5,Math.round((b-a)/2.4)));fromN=M.st[0];toN=M.st[M.st.length-1];lineN=M.line}
    else{const L=longTrip(d=>{for(let u=0;u<60;u++){const a=R(6,17)*60+R(7,11)*5,b=a+d;if(b%60<a%60&&b<23*60)return{a,b}}});a=L.a;b=L.b;fromN=L.from;toN=L.to;kind=L.kind}
    if(type==='table'){const step=R(2,4),M=mrtRun(4,step),st=M.st,t0=R(6,19)*60+R(0,11)*5,gaps=[0,0,0].map(()=>step*2+R(0,step+1));const ts=[t0];gaps.forEach(g=>ts.push(ts[ts.length-1]+g));
      let i=0,j=3;if(Math.random()<.5){i=pick([0,1]);j=i+2}a=ts[i];b=ts[j];fromN=st[i];toN=st[j];
      const[kid,pr]=pick(SGKIDS);
      api.q(`<p class="qt"><b>${kid}</b> takes one ${M.line} train. The list shows the time ${pr} reaches each station, in order. How long does ${pr} take to travel from <b>${fromN}</b> to <b>${toN}</b>?</p>`);
      api.body.innerHTML=board(st.map((s,k)=>[`${k===0?'Gets on at ':''}${s}`,ttm(ts[k])]),`${kid}’s ride: time at each station`);}
    else{api.q(`<p class="qt">The ${kind==='train'?`${lineN} train`:kind} leaves <b>${fromN}</b> at <b>${ttm(a)}</b> and reaches <b>${toN}</b> at <b>${ttm(b)}</b>. How long is the journey?</p>`);
      api.body.innerHTML=board([[`Leaves ${fromN}`,ttm(a)],[`Arrives ${toN}`,ttm(b)]],'Journey')}
    const d=b-a,dec=asDec(b)-asDec(a);timeJump(api,a,b);
    askDur(api,'tD',d,dec,`${ttm(a)} to ${ttm(b)} is ${tdur(d)}.`,['Count on in hops: to the next hour, then whole hours, then the minutes left.',hops(a,b),`Total: ${tdur(d)}`]);return}
  if(type==='arrive'||type==='depart'){
    const L=longTrip(d=>{for(let u=0;u<60;u++){const a=R(6,17)*60+R(5,11)*5;if(a%60+d%60>=60&&a+d<23*60+55)return{a}}}),a=L.a,d=L.d,b=a+d;P[0]=L.from;P[1]=L.to;const K=L.kind;
    if(type==='arrive'){api.q(`<p class="qt">The ${K} leaves <b>${P[0]}</b> at <b>${ttm(a)}</b>. The journey takes <b>${tdur(d)}</b>. When does it arrive in <b>${P[1]}</b>?</p>`);
      api.body.innerHTML=board([[`Leaves ${P[0]}`,ttm(a)],['Journey',tdur(d)],[`Arrives ${P[1]}`,'??  ??']],'Journey');
      const wrongDec=asDec(a)+Math.floor(d/60)*100+d%60;
      askTime(api,'tT',b,[[(x,s)=>+String(s).replace(/\D/g,'')===wrongDec,`${String(wrongDec).padStart(4,'0').replace(/(..)$/,' $1')} is not a real time: minutes only go up to 59. ${a%60} min + ${d%60} min = ${a%60+d%60} min = 1 h ${(a%60+d%60)-60} min, so add 1 to the hour.`]],
        `${ttm(a)} + ${tdur(d)} = ${ttm(b)}`,[hops(a,b)])}
    else{api.q(`<p class="qt">The ${K} reaches <b>${P[1]}</b> at <b>${ttm(b)}</b>. The journey took <b>${tdur(d)}</b>. What time did it leave <b>${P[0]}</b>?</p>`);
      api.body.innerHTML=board([[`Leaves ${P[0]}`,'??  ??'],['Journey',tdur(d)],[`Arrives ${P[1]}`,ttm(b)]],'Journey');
      const wd=asDec(b)-(Math.floor(d/60)*100+d%60);
      askTime(api,'tT',a,[[(x,s)=>+String(s).replace(/\D/g,'')===wd,`${String(wd).padStart(4,'0').replace(/(..)$/,' $1')} is not a real time. When you cannot take away the minutes, take 1 hour and change it to 60 minutes.`],[b+d,'That is later than the arrival! The train left <b>before</b> it arrived, so count back.']],
        `${ttm(b)} − ${tdur(d)} = ${ttm(a)}`,['Count back in hops:',hops(a,b)])}
    return}
  if(type==='night'){let a,b,d,T;do{T=pick(NIGHTTRIPS);a=R(18,22)*60+R(1,11)*5;d=R(Math.ceil(T[3]/5),Math.floor(T[4]/5))*5;b=a+d}while(b<1440+4*60||b>=1440+9*60);P[0]=T[0];P[1]=T[1];
    api.q(`<p class="qt">The overnight ${T[2]} leaves <b>${P[0]}</b> at <b>${ttm(a)}</b> and arrives at <b>${P[1]}</b> at <b>${ttm(b)}</b> the next morning. How long is the journey?</p>`);
    api.body.innerHTML=board([[`Leaves ${P[0]}`,ttm(a)],[`Arrives ${P[1]} (next day)`,ttm(b)]],'Night train');
    const back=a-(b-1440);timeJump(api,a,b);
    askDur(api,'tN',d,null,`${ttm(a)} to ${ttm(b)} the next day is ${tdur(d)}.`,['Split the journey at midnight:',`${ttm(a)} → 24 00 = ${tdur(1440-a)}`,`00 00 → ${ttm(b)} = ${tdur(b-1440)}`,`Total: ${tdur(d)}`],[[back,`You worked out ${ttm(a)} − ${ttm(b)}, going backwards. The train arrives the <b>next day</b>, so count on to midnight (24 00) first, then on to ${ttm(b)}.`]]);return}
 }});

/* ================= All levels. Beat the Clock: SG Journeys — time durations on real MRT journeys (+ walking and buses on Hard) ================= */
const QK=['NS','EW','NE','CC','DT','TE'],MODECOL={walk:'#56667b',change:'#56667b',wait:'#c2410c',bus:'#5f50ec'};
const STN={};QK.forEach(k=>MRT[k].P.forEach((p,i)=>(STN[p.n]=STN[p.n]||[]).push({k,i})));
const SGPLACES=[['Science Centre','Jurong East'],['National Library','Bugis'],['Gardens by the Bay','Bayfront'],['East Coast Park','Marine Parade'],['Singapore Botanic Gardens','Botanic Gardens'],['National Stadium','Stadium'],['Sentosa Boardwalk','HarbourFront'],['Chinatown Heritage Centre','Chinatown'],['Bishan Park','Bishan'],['Esplanade Theatres','Esplanade'],['ION Orchard','Orchard'],['Woodlands Waterfront','Woodlands North'],['Bedok Reservoir Park','Bedok Reservoir'],['Punggol Waterway','Punggol']];
const SGKIDS=[['Aisha','she'],['Wei Jie','he'],['Ravi','he'],['Mei Ling','she'],['Daniel','he'],['Siti','she'],['Arjun','he'],['Hui Min','she']];
const mgap=()=>pick([2,2,3,3,3,4]);
const legIdx=(i,j)=>{const o=[],s=i<j?1:-1;for(let q=i;q!==j+s;q+=s)o.push(q);return o};
/* a route of MRT legs [{k,idx}] with 0–2 line changes, optionally ending at a given station */
function sgRoute(changes,endName){
  for(let t=0;t<800;t++){let legs=[];
    if(endName){const o=pick(STN[endName]),L=MRT[o.k],e=o.i;
      if(changes===0){const g=R(3,6),st=e-pick([1,-1])*g;if(st<0||st>=L.P.length)continue;legs=[{k:o.k,idx:legIdx(st,e)}]}
      else{const x=e-pick([1,-1])*R(2,5);if(x<0||x>=L.P.length)continue;const oth=(STN[L.P[x].n]||[]).filter(z=>z.k!==o.k);if(!oth.length)continue;
        const b=pick(oth),Lb=MRT[b.k],st=b.i+pick([1,-1])*R(2,4);if(st<0||st>=Lb.P.length)continue;legs=[{k:b.k,idx:legIdx(st,b.i)},{k:o.k,idx:legIdx(x,e)}]}}
    else{const k0=pick(QK),L0=MRT[k0];
      if(changes===0){const g=R(3,6),i=R(0,L0.P.length-1-g);const idx=legIdx(i,i+g);if(Math.random()<.5)idx.reverse();legs=[{k:k0,idx}]}
      else{let cur={k:k0,i:R(0,L0.P.length-1)},ok=true;
        for(let c=0;c<=changes;c++){const L=MRT[cur.k];
          if(c<changes){const cand=[];for(const s of[1,-1])for(let g=2;g<=5;g++){const j=cur.i+s*g;if(j<0||j>=L.P.length)break;const oth=(STN[L.P[j].n]||[]).filter(z=>z.k!==cur.k&&!legs.some(l=>l.k===z.k));if(oth.length)cand.push([j,oth])}
            if(!cand.length){ok=false;break}const[j,oth]=pick(cand);legs.push({k:cur.k,idx:legIdx(cur.i,j)});const nx=pick(oth);cur={k:nx.k,i:nx.i}}
          else{const j=cur.i+pick([1,-1])*R(2,4);if(j<0||j>=L.P.length){ok=false;break}legs.push({k:cur.k,idx:legIdx(cur.i,j)})}}
        if(!ok)continue}}
    const names=legs.flatMap((l,li)=>l.idx.slice(li?1:0).map(q=>MRT[l.k].P[q].n));if(new Set(names).size!==names.length)continue;
    if(legs.some((l,li)=>li&&l.k===legs[li-1].k))continue;
    if(names.length>(changes?8:7))continue;
    return legs}
  return endName&&changes>0?sgRoute(0,endName):null}
/* turn legs into nodes + segments. pre: [{node,mode,min}] before the first station; post: [{mode,min,node}] after the last */
function sgBuild(legs,pre=[],post=[]){const nodes=[],segs=[];
  pre.forEach(p=>{nodes.push(p.node);segs.push({mode:p.mode,min:p.min,col:MODECOL[p.mode],hide:p.hide})});
  legs.forEach((l,li)=>{const L=MRT[l.k];l.idx.forEach((q,qi)=>{const P=L.P[q],nd={n:P.n,x:P.x,y:P.y,kind:'stn',col:L.col};
    if(qi===0){if(li>0){segs.push({mode:'change',min:R(3,5),col:MODECOL.change});nd.dup=1}nodes.push(nd)}
    else{segs.push({mode:'mrt',min:mgap(),col:L.col});nodes.push(nd)}})});
  post.forEach(p=>{segs.push({mode:p.mode,min:p.min,col:MODECOL[p.mode],hide:p.hide});nodes.push(p.node)});
  return{nodes,segs,legs}}
const outward=(x,y,dist)=>{const dx=x-500,dy=y-330,l=Math.hypot(dx,dy)||1;return[x+dx/l*dist,y+dy/l*dist]};
const chipTxt=s=>s.hide?`${s.mode} ?`:s.mode==='mrt'?`${s.min} min`:s.mode==='bus'?`bus ride ${s.min} min`:`${s.mode} ${s.min} min`;
function sgStrip(N,S,title){const n=N.length,nar=innerWidth<600,W=Math.max(nar?420:660,96+(n-1)*(nar?66:88)),x0=48,dx=(W-96)/(n-1),y=64,H=136;
  let s=`<rect width="${W}" height="${H}" fill="#fff"/>`;
  S.forEach((g,q)=>{const x1=x0+dx*q,x2=x1+dx;s+=g.mode==='mrt'||g.mode==='bus'?`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${g.col}" stroke-width="8"/>`:`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${g.col}" stroke-width="4" stroke-dasharray="2 7" stroke-linecap="round"/>`});
  let row=0;S.forEach((g,q)=>{const t=chipTxt(g),w=t.length*8+18,mx=x0+dx*(q+.5),cy=w>dx-6?(row++%2?y-50:y-24):y-24;
    s+=`<g class="jmp" data-in="1" ${g.hide?`data-real="${g.mode} ${g.min} min"`:''} style="transition:opacity .25s,transform .25s;transform-origin:${mx}px ${cy}px"><rect x="${mx-w/2}" y="${cy-12}" width="${w}" height="24" rx="12" fill="${g.col}"/><text x="${mx}" y="${cy+5}" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">${t}</text></g>`});
  const rows=[];N.forEach((nd,q)=>{const x=x0+dx*q,end=q===0||q===n-1;if(nd.dup)return;
    s+=nd.kind==='stn'?`<circle cx="${x}" cy="${y}" r="${end?10:7}" fill="${end?'#ffd257':'#fff'}" stroke="${end?'#16233a':nd.col}" stroke-width="3"/>`:`<rect x="${x-9}" y="${y-9}" width="18" height="18" rx="5" fill="${nd.kind==='place'?'#ef5240':nd.kind==='home'?'#0b968b':'#5f50ec'}" stroke="#16233a" stroke-width="2"/>`;
    const lx=q===0?x-12:q===n-1?x+12:x,anc=q===0?'start':q===n-1?'end':'middle',lw=nd.n.length*(end?9.2:8.6)+10,sp=anc==='start'?[lx,lx+lw]:anc==='end'?[lx-lw,lx]:[lx-lw/2,lx+lw/2];
    let row=0;while(rows[row]&&rows[row].some(([p,r])=>sp[0]<r&&sp[1]>p))row++;(rows[row]=rows[row]||[]).push(sp);
    s+=`<text x="${lx}" y="${y+34+row*22}" text-anchor="${anc}" font-size="${end?16:15}" font-weight="${end?800:700}" fill="#16233a">${nd.n}</text>`});
  const H2=Math.max(H,y+34+(rows.length-1)*22+16);s=s.replace(`height="${H}" fill="#fff"`,`height="${H2}" fill="#fff"`);
  return `${title?`<div class="tbh" style="padding:7px 12px">${title}</div>`:''}<svg class="tmap-nozoom" viewBox="0 0 ${W} ${H2}" style="width:100%;height:auto;display:block;border-top:3px solid #2c3446" aria-hidden="true">${s}</svg>`}
const SPRITES=`<g data-m="mrt"><rect class="tc" x="-19" y="-8" width="38" height="16" rx="7" fill="#fff" stroke="#009645" stroke-width="3"/><rect x="-14" y="-4" width="7" height="5" rx="1.5" fill="#2b3a55"/><rect x="-3.5" y="-4" width="7" height="5" rx="1.5" fill="#2b3a55"/><rect x="7" y="-4" width="7" height="5" rx="1.5" fill="#2b3a55"/></g>
  <g data-m="bus"><rect x="-18" y="-9" width="36" height="16" rx="4" fill="#5f50ec" stroke="#16233a" stroke-width="1.5"/><rect x="-14" y="-6" width="23" height="6" rx="1.5" fill="#fff"/><rect x="11" y="-6" width="4" height="9" rx="1" fill="#fff"/><circle cx="-10" cy="8" r="3" fill="#16233a"/><circle cx="10" cy="8" r="3" fill="#16233a"/></g>
  <g data-m="walk"><circle r="13" fill="#fff" stroke="#16233a" stroke-width="2"/><circle cx="0" cy="-6.5" r="2.7" fill="#16233a"/><path d="M0 -3 L0 4 M0 4 L-3.5 9 M0 4 L3.5 9 M-4.5 0.5 L4.5 -1" stroke="#16233a" stroke-width="2" stroke-linecap="round" fill="none"/></g>
  <g data-m="wait"><circle r="13" fill="#fff" stroke="#c2410c" stroke-width="2.5"/><path d="M0 0 L0 -7.5 M0 0 L5.5 2.5" stroke="#c2410c" stroke-width="2.4" stroke-linecap="round"/></g>`;
function sgMap(R0,a){const N=R0.nodes,S=R0.segs,n=N.length;
  const xs=N.map(p=>p.x),ys=N.map(p=>p.y);let w=Math.max(Math.max(...xs)-Math.min(...xs)+170,280),h=Math.max(Math.max(...ys)-Math.min(...ys)+140,w/2.2);w=Math.max(w,h*2.2);
  const cx=(Math.max(...xs)+Math.min(...xs))/2,cy=(Math.max(...ys)+Math.min(...ys))/2,vx=cx-w/2,vy=cy-h/2,k=w/660,f=v=>(v*k).toFixed(2);
  let g=`<rect x="-400" y="-400" width="1800" height="1400" fill="#b9dff0"/><path d="${ISLAND}" fill="#e7efdf" stroke="#cfdcc4" stroke-width="${f(2)}"/>`;
  const line=(P,col,wd,op)=>`<polyline points="${P.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)).join(' ')}" fill="none" stroke="${col}" stroke-width="${f(wd)}" stroke-linejoin="round" stroke-linecap="round" opacity="${op}"/>`;
  const used=new Set(R0.legs.map(l=>l.k));
  for(const kk in MRT){const Q=MRT[kk],op=used.has(kk)?.6:.32,wd=used.has(kk)?6:5;g+=line(Q.P,Q.col,wd,op);if(Q.loop)g+=line([Q.P[Q.P.length-1],Q.P[3]],Q.col,wd,op)}
  const seen=new Set();for(const kk in MRT)MRT[kk].P.forEach(p=>{if(seen.has(p.n))return;seen.add(p.n);g+=`<circle cx="${p.x}" cy="${p.y}" r="${f(3.5)}" fill="#fff" stroke="#7d8796" stroke-width="${f(1.2)}"/>`});
  const samp=[],angs=[];
  S.forEach((sg,q)=>{const p=N[q],r=N[q+1];let pts;
    if(sg.mode==='bus'){const mx=(p.x+r.x)/2,my=(p.y+r.y)/2,dx=r.x-p.x,dy=r.y-p.y,c=[mx-dy*.25,my+dx*.25];pts=Array.from({length:31},(_,t)=>{const u=t/30;return[(1-u)*(1-u)*p.x+2*(1-u)*u*c[0]+u*u*r.x,(1-u)*(1-u)*p.y+2*(1-u)*u*c[1]+u*u*r.y]});
      g+=`<path d="M${p.x} ${p.y} Q${c[0]} ${c[1]} ${r.x} ${r.y}" fill="none" stroke="#5f50ec" stroke-width="${f(6)}" stroke-dasharray="${f(10)} ${f(6)}" stroke-linecap="round"/>`}
    else{pts=Array.from({length:31},(_,t)=>[p.x+(r.x-p.x)*t/30,p.y+(r.y-p.y)*t/30]);
      if(sg.mode==='mrt')g+=line([p,r],sg.col,9,1);else if(sg.mode==='walk')g+=`<line x1="${p.x}" y1="${p.y}" x2="${r.x}" y2="${r.y}" stroke="#56667b" stroke-width="${f(4)}" stroke-dasharray="${f(1)} ${f(8)}" stroke-linecap="round"/>`}
    samp.push(pts);let an=Math.atan2(r.y-p.y,r.x-p.x)*180/Math.PI;if(an>90)an-=180;if(an<=-90)an+=180;angs.push(sg.mode==='mrt'||sg.mode==='bus'?an:0)});
  const halo=`paint-order:stroke;stroke:#fff;stroke-width:${f(5)}px;stroke-linejoin:round`;const lab=new Set();let tl='';const boxes=[],fsc=innerWidth<600?1.3:1;
  N.forEach((nd,q)=>{const end=q===0||q===n-1,chg=nd.dup;
    if(nd.kind==='stn'){if(!nd.dup)g+=`<circle cx="${nd.x}" cy="${nd.y}" r="${f(end?9:chg?8:6)}" fill="${end?'#ffd257':'#fff'}" stroke="${end?'#16233a':nd.col}" stroke-width="${f(end?3:2.5)}"/>`}
    else g+=`<rect x="${(nd.x-k*9).toFixed(1)}" y="${(nd.y-k*9).toFixed(1)}" width="${f(18)}" height="${f(18)}" rx="${f(5)}" fill="${nd.kind==='place'?'#ef5240':nd.kind==='home'?'#0b968b':'#5f50ec'}" stroke="#16233a" stroke-width="${f(2)}"/>`;
    const show=nd.kind!=='stop'&&(end||chg||nd.kind!=='stn'||(q===1&&N[0].kind!=='stn')||(q===n-2&&N[n-1].kind!=='stn'));
    if(show&&!lab.has(nd.n)){lab.add(nd.n);const txt=nd.n+(chg?' (change)':''),fz=(end?15:13)*fsc*k,tw=txt.length*fz*.58,
      cands=[[nd.x+k*13,nd.y-k*11,'start'],[nd.x+k*13,nd.y+fz+k*8,'start'],[nd.x-k*13,nd.y-k*11,'end'],[nd.x-k*13,nd.y+fz+k*8,'end'],[nd.x+k*13,nd.y-k*11-fz*1.2,'start'],[nd.x-k*13,nd.y+fz*2.3,'end']];
      const box=([x,y,a])=>a==='start'?[x,y-fz,x+tw,y+fz*.25]:[x-tw,y-fz,x,y+fz*.25],hit=b=>boxes.some(c=>b[0]<c[2]&&b[2]>c[0]&&b[1]<c[3]&&b[3]>c[1])||N.some(p=>p!==nd&&p.x>b[0]-k*6&&p.x<b[2]+k*6&&p.y>b[1]-k*6&&p.y<b[3]+k*6);
      const pc=cands.find(c=>!hit(box(c)))||cands[0];boxes.push(box(pc));
      tl+=`<text x="${pc[0].toFixed(1)}" y="${pc[1].toFixed(1)}" text-anchor="${pc[2]}" font-size="${fz.toFixed(2)}" font-weight="800" fill="#16233a" style="${halo}">${txt}</text>`}});
  g+=tl;g+=`<g id="jmC" opacity="0"><rect x="-38" y="-74" width="76" height="24" rx="12" fill="#141a26"/><text y="-57" text-anchor="middle" font-size="14" font-weight="800" fill="#ffd257" font-family="ui-monospace,Menlo,monospace"></text></g><g id="jmV">${SPRITES}</g>`;
  JMD={k,segs:S.map(s=>s.min),modes:S.map(s=>s.mode),cols:S.map(s=>s.col),angs,samp,a:a==null?null:a};
  const lines=[...used].map(kk=>`<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:13px;height:13px;border-radius:4px;background:${MRT[kk].col};display:inline-block"></span>${MRT[kk].name}</span>`).join(' · ');
  return `<div class="jmwrap" style="max-width:920px;border:3px solid #2c3446;border-radius:14px;overflow:hidden;background:#141a26"><div class="tbh" style="padding:7px 12px;display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center">${lines}</div><svg id="jmSvg" class="tmap-nozoom" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" style="width:100%;height:auto;display:block" role="img" aria-label="Journey map. ${S.map((s,q)=>`${N[q].n} to ${N[q+1].n}: ${s.mode} ${s.hide?'unknown':s.min+' minutes'}`).join('. ')}.">${g}</svg>${sgStrip(N,S)}</div>
    <div class="row" style="margin-top:8px"><button class="btn" id="jmPlay">▶ Replay journey</button><button class="btn" id="jmSkip">Skip ⏭</button></div>`}
const sgSum=S=>S.reduce((x,s)=>x+s.min,0);
const sgWork=S=>S.map(s=>s.mode==='mrt'?`${s.min}`:`${s.min} (${s.mode})`).join(' + ');
/* a bus timetable: departure times as chips that wrap neatly on phones */
function busBoard(times,title,note){return `<div class="tboard"><div class="tbh">🚌 ${title}</div><div style="padding:6px 2px 2px;font-weight:700">${note||'Buses leave at:'}</div><div style="display:flex;flex-wrap:wrap;gap:8px;padding:6px 2px 4px">${times.map(t=>`<span style="font:800 1.15rem ui-monospace,Menlo,monospace;color:#ffd257;background:#232c3f;border:2px solid #3a4560;border-radius:10px;padding:4px 10px;white-space:nowrap">${t}</span>`).join('')}</div></div>`}
/* Step 1 of a two-step question. It must be right before Step 2 appears: a wrong tap is greyed out with a hint;
   after two wrong taps (or when one choice is left) the right answer glows and must be tapped. A wrong Step 1 lowers the points (pen).
   If Step 2 sends the round to its second try, Step 1 stays solved (ctx.keep survives the rebuild). */
function stepPick(api,o){const K=ctx.keep=ctx.keep||{},id=o.id;
  api.body.insertAdjacentHTML('beforeend',`<div class="askwrap"><p class="asklab">${o.label}</p><div class="choices" id="${id}P"></div><div id="${id}Pm"></div></div>`);
  const box=$(id+'P'),msg=$(id+'Pm'),R=String(o.right);let miss=0;
  const finish=()=>{[...box.children].forEach(x=>{x.disabled=true;x.style.boxShadow='';if(x.dataset.v===R)x.classList.add('ok')});msg.innerHTML=o.okMsg;o.then()};
  (o.keepOrder?o.options:shuffle(o.options.slice())).forEach(v=>{const bt=document.createElement('button');bt.className='btn';bt.style.fontSize='1.1rem';bt.dataset.v=String(v);bt.textContent=o.show?o.show(v):v;
    bt.onclick=()=>{if(api.answered||bt.disabled)return;
      if(String(v)===R){sfx.ok();K[id]=miss?'pen':'ok';if(miss)ctx.st[o.pen]=1;finish();return}
      sfx.no();miss++;bt.classList.add('no');bt.disabled=true;const left=[...box.children].filter(x=>!x.disabled).length;
      if(miss>=2||left<=1){[...box.children].forEach(x=>{if(x.dataset.v===R){x.disabled=false;x.style.boxShadow='0 0 0 4px #ffd257'}else x.disabled=true});msg.innerHTML=`<p class="askneed">${o.reveal(v)}</p>`}
      else msg.innerHTML=`<p class="askneed">${o.hint(v)}</p>`};box.appendChild(bt)});
  if(K[id]){if(K[id]==='pen')ctx.st[o.pen]=1;finish()}}
function routePick(api,faster,id,then){stepPick(api,{id,keepOrder:true,label:'<b>Step 1:</b> which route is faster?',options:['Route A','Route B'],right:faster,pen:id,then,
  hint:()=>'',reveal:()=>`Not quite. Add up <b>all</b> the minutes in each route (walking, waiting and changing lines too), then compare. <b>${faster}</b> is faster. Tap it to carry on.`,
  okMsg:`<p class="askok">Yes! <b>${faster}</b> is faster.</p><p class="asklab"><b>Step 2:</b> by how many minutes is ${faster} faster?</p>`})}
/* bus departures as a time line: a dot per bus, a hop between buses, the child standing at the arrival time; the next bus is a "?" */
function busLine(first,fq,arr,next,kid,no){const n=Math.round((next-first)/fq),nar=innerWidth<600,W=nar?440:660,H=170,x0=nar?34:40,x1=W-(nar?30:40),y=96,sx=t=>x0+(t-first)/(next-first)*(x1-x0);let s=`<rect width="${W}" height="${H}" fill="#eef6ff"/><line x1="${x0-20}" y1="${y}" x2="${x1+20}" y2="${y}" stroke="#2c3446" stroke-width="4"/>`;
  for(let i=0;i<n;i++){const a=sx(first+i*fq),b=sx(first+(i+1)*fq),m=(a+b)/2,h=Math.min(26,(b-a)*.45);s+=`<path d="M${a} ${y-6} Q${m} ${y-6-h*2} ${b} ${y-6}" fill="none" stroke="#5f50ec" stroke-width="2.5"/>`;if(i<3||n<=5)s+=`<text x="${m}" y="${y-12-h}" text-anchor="middle" font-size="14" font-weight="800" fill="#5f50ec">+${fq}</text>`}
  for(let i=0;i<=n;i++){const t=first+i*fq,x=sx(t),last=i===n;s+=`<circle cx="${x}" cy="${y}" r="${last?10:7}" fill="${last?'#ffd257':'#5f50ec'}" stroke="#16233a" stroke-width="2"/>`;
    const gap=sx(first+fq)-sx(first),lbl=gap>=54?3:gap>=30?(i%2===0&&i<4?3:0):1;if(i<lbl)s+=`<text x="${x}" y="${y+30}" text-anchor="middle" font-size="16" font-weight="800" fill="#16233a">${ttm(t)}</text>`;if(last)s+=`<text x="${x}" y="${y+32}" text-anchor="middle" font-size="20" font-weight="900" fill="#c2410c">?</text>`}
  const ax=sx(arr);s+=`<line x1="${ax}" y1="${y+8}" x2="${ax}" y2="${y+44}" stroke="#c2410c" stroke-width="3" stroke-dasharray="4 4"/><g transform="translate(${ax},${y+58})"><circle r="11" fill="#fff" stroke="#c2410c" stroke-width="2.5"/><circle cy="-5" r="2.4" fill="#16233a"/><path d="M0 -2.5 L0 3.5 M0 3.5 L-3 8 M0 3.5 L3 8 M-4 0 L4 -1" stroke="#16233a" stroke-width="1.8" stroke-linecap="round" fill="none"/></g><text x="${ax>W*.55?ax-16:ax+16}" y="${y+64}" text-anchor="${ax>W*.55?'end':'start'}" font-size="15" font-weight="800" fill="#c2410c">${kid} arrives ${ttm(arr)}</text>`;
  return `<div class="jmwrap" style="max-width:920px;border:3px solid #2c3446;border-radius:14px;overflow:hidden;background:#141a26"><div class="tbh" style="padding:7px 12px">🚌 Bus ${no}: first bus ${ttm(first)}, then every ${fq} min</div><svg class="tmap-nozoom" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" role="img" aria-label="Time line of bus ${no}: first bus at ${ttm(first)}, then every ${fq} minutes. ${kid} arrives at ${ttm(arr)}.">${s}</svg></div>`}
/* shared round builder for SG Journeys (P4) and SG Journeys 2 (P5) */
function sgRound(api,type){
  const[kid,pr]=pick(SGKIDS),Pr=pr[0].toUpperCase()+pr.slice(1);
  const durQ=(R0,q,extra)=>{const S=R0.segs,d=sgSum(S),last=S[S.length-1];api.q(q);api.body.innerHTML=sgMap(R0,null);
    const traps=[[d-last.min,`You stopped one stop early, at ${R0.nodes[R0.nodes.length-2].n}. Add every part of the journey, right to the end.`],[S.length,'You counted the stops. Add up the <b>minutes</b> for each part instead.'],...(extra||[])];
    askDur(api,'sgD',d,null,`${R0.nodes[0].n} to ${R0.nodes[R0.nodes.length-1].n}: ${tdur(d)}.`,['Add the minutes for every part of the journey:',`${sgWork(S)} = ${d} min${d>=60?` = ${tdur(d)}`:''}`,'Press ▶ Replay journey to watch it again with the time adding up.'],traps.filter(([x])=>x!==d));jmStart(api)};
  const timeQ=(R0,a,q,extra,arrive=true)=>{const S=R0.segs,d=sgSum(S);api.q(q);api.body.innerHTML=sgMap(R0,a);const ans=arrive?a+d:a;
    const raw=arrive?asDec(a)+Math.floor(d/60)*100+d%60:null;
    const traps=[...(raw!==null?[[(x,s)=>+String(s).replace(/\D/g,'')===raw&&raw%100>59,`${String(raw).padStart(4,'0').replace(/(..)$/,' $1')} is not a real time: minutes only go up to 59. Count on to the next hour instead.`]]:[]),...(extra||[])];
    askTime(api,'sgT',ans,traps,arrive?`${ttm(a)} + ${tdur(d)} = ${ttm(a+d)}`:`${ttm(a+d)} − ${tdur(d)} = ${ttm(a)}`,['Journey time:',`${sgWork(S)} = ${tdur(d)}`,arrive?'Count on from the start time:':'Count back from the arrival time:',hops(a,a+d),'Press ▶ Replay journey to watch it again with the clock.']);jmStart(api)};
  if(type==='line'||type==='linearr'){const R0=sgBuild(sgRoute(0)),L=MRT[R0.legs[0].k],A=R0.nodes[0].n,B=R0.nodes[R0.nodes.length-1].n;
    if(type==='line')return durQ(R0,`<p class="qt">Watch the train on the <b>${L.name}</b>. How long does it take from <b>${A}</b> to <b>${B}</b>?</p>`);
    const a=R(6,20)*60+R(8,11)*5;return timeQ(R0,a,`<p class="qt">${kid} boards the train at <b>${A}</b> at <b>${ttm(a)}</b>. When does ${pr} reach <b>${B}</b>?</p>`)}
  if(type==='lineback'||type==='changeback'){const R0=sgBuild(sgRoute(type==='lineback'?0:1)),A=R0.nodes[0].n,B=R0.nodes[R0.nodes.length-1].n,d=sgSum(R0.segs),T=R(7,20)*60+pick([0,10,15,20,30,40,45,50]),a=T-d;
    const via=type==='lineback'?`the <b>${MRT[R0.legs[0].k].name}</b>`:`the ${MRT[R0.legs[0].k].name}, then the ${MRT[R0.legs[1].k].name}`;
    return timeQ(R0,a,`<p class="qt">${kid} must reach <b>${B}</b> at <b>${ttm(T)}</b>. ${Pr} takes ${via}. What time must ${pr} board the train at <b>${A}</b>?</p>`,
      [[T+d,`That is <b>after</b> ${ttm(T)}! ${Pr} must board <b>before</b> arriving, so count <b>back</b> from ${ttm(T)}.`],...(type==='changeback'?[[a+R0.segs.find(s=>s.mode==='change').min,'You left out the walk to change lines. It takes time too.']]:[])],false)}
  if(type==='change'||type==='changearr'){const R0=sgBuild(sgRoute(1)),S=R0.segs,ci=S.findIndex(s=>s.mode==='change'),X=R0.nodes[ci].n,A=R0.nodes[0].n,B=R0.nodes[R0.nodes.length-1].n,d=sgSum(S);
    const L1=MRT[R0.legs[0].k].name,L2=MRT[R0.legs[1].k].name,cm=S[ci].min;
    const intro=`${kid} travels from <b>${A}</b> to <b>${B}</b>. ${Pr} changes from the ${L1} to the ${L2} at <b>${X}</b>, which takes <b>${cm} min</b> of walking.`;
    if(type==='change')return durQ(R0,`<p class="qt">${intro} How long is the whole journey?</p>`,[[d-cm,`You left out the ${cm} min walk to change lines at ${X}.`]]);
    const a=R(6,20)*60+R(6,11)*5;return timeQ(R0,a,`<p class="qt">${intro} ${Pr} sets off at <b>${ttm(a)}</b>. When does ${pr} arrive?</p>`,[[a+d-cm,`You left out the ${cm} min walk to change lines at ${X}.`]])}
  const place=pick(SGPLACES.filter(p=>STN[p[1]]));
  const homeNode=(R0first)=>{const[x,y]=outward(R0first.x,R0first.y,55);return{n:'Home',x:x-25,y:y+25,kind:'home'}};
  const placeNode=st=>{const p=MRT[STN[st][0].k].P[STN[st][0].i],[x,y]=outward(p.x,p.y,50);return{n:place[0],x,y,kind:'place'}};
  if(type==='trip'||type==='back'){const legs=sgRoute(type==='back'?1:R(0,1),place[1]);const f0=MRT[legs[0].k].P[legs[0].idx[0]];
    const w1=R(4,9),w2=R(4,10),R0=sgBuild(legs,[{node:homeNode(f0),mode:'walk',min:w1}],[{mode:'walk',min:w2,node:placeNode(place[1])}]),S=R0.segs,d=sgSum(S);
    const ch=S.find(s=>s.mode==='change'),walks=w1+w2+(ch?ch.min:0);
    if(type==='trip'){const a=R(7,17)*60+R(0,11)*5;
      return timeQ(R0,a,`<p class="qt">${kid} leaves home at <b>${ttm(a)}</b> to visit <b>${place[0]}</b>. ${Pr} walks to ${f0.n} station, takes the MRT${ch?' (changing lines once)':''}, then walks the rest of the way. When does ${pr} get there?</p>`,[[a+d-walks,'You left out the walking. Walking to the station'+(ch?', changing lines,':'')+' and walking at the end all take time too.'],[a+d-w2,`You forgot the last ${w2} min walk from the station to ${place[0]}.`]])}
    const T=R(8,17)*60+pick([0,15,30,45]),a=T-d;
    return timeQ(R0,a,`<p class="qt">${kid}'s class must reach <b>${place[0]}</b> by <b>${ttm(T)}</b>. Look at the journey. What is the <b>latest</b> time ${pr} can leave home?</p>`,
      [[T+d,`That is <b>after</b> ${ttm(T)}! ${Pr} must leave <b>before</b> arriving, so count <b>back</b> from ${ttm(T)}.`],[T-(d-walks),'You left out the walking. Count back the walking time as well as the train time.'],
       [(x,s)=>{const raw=asDec(T)-(Math.floor(d/60)*100+d%60);return raw%100>59&&+String(s).replace(/\D/g,'')===raw},'That is not a real time: minutes only go up to 59. When you cannot take away the minutes, change 1 hour into 60 minutes.']],false)}
  if(type==='bus'){const legs=sgRoute(0,place[1]),f0=MRT[legs[0].k].P[legs[0].idx[0]],[hx,hy]=outward(f0.x,f0.y,70);
    const home={n:'Home',x:hx,y:hy,kind:'home'},stop={n:'Bus stop',x:hx+(f0.x-hx)*.2,y:hy+(f0.y-hy)*.2,kind:'stop'},stop2={...stop,dup:1};
    const a=R(6,17)*60+R(0,11)*5,w1=R(3,6),fq=pick([10,12,15]),wait=R(2,fq-2),ride=R(8,15),w2=R(3,8),next=a+w1+wait;
    const R0=sgBuild(legs,[{node:home,mode:'walk',min:w1},{node:stop,mode:'wait',min:wait,hide:1},{node:stop2,mode:'bus',min:ride}],[{mode:'walk',min:w2,node:placeNode(place[1])}]),S=R0.segs,d=sgSum(S);
    const sj=R(1,2),sched=[0,1,2,3].map(i=>next+(i-sj)*fq);
    api.q(`<p class="qt">${kid} leaves home at <b>${ttm(a)}</b>, walks <b>${w1} min</b> to the bus stop and catches the <b>next bus</b> to ${f0.n} station. Then ${pr} takes the MRT and walks to <b>${place[0]}</b>. When does ${pr} get there?</p>`);
    api.body.innerHTML=busBoard(sched.map(ttm),'Bus stop near home')+sgMap(R0,a);
    const before=next-fq;
    stepPick(api,{id:'sgB1',pen:'sgT',keepOrder:true,label:`<b>Step 1:</b> ${kid} leaves home at ${ttm(a)} and walks ${w1} min to the bus stop. Which bus does ${pr} catch?`,options:sched,right:next,show:ttm,
      hint:t=>t<next?`${kid} reaches the stop at ${ttm(a)} + ${w1} min = <b>${ttm(a+w1)}</b>. The ${ttm(t)} bus has already left by then. Try again!`:`That bus works, but ${pr} could catch an <b>earlier</b> one. ${Pr} reaches the stop at ${ttm(a)} + ${w1} min. Try again!`,
      reveal:()=>`${kid} reaches the stop at ${ttm(a)} + ${w1} min = <b>${ttm(a+w1)}</b>. The first bus after that is the <b>${ttm(next)}</b> bus. Tap it to carry on.`,
      okMsg:`<p class="askok">Yes! ${kid} reaches the stop at ${ttm(a+w1)} and catches the <b>${ttm(next)}</b> bus (a ${wait} min wait).</p><p class="asklab"><b>Step 2:</b> now add the bus ride, the MRT and the last walk. When does ${pr} get to ${place[0]}?</p>`,
      then:()=>{
    askTime(api,'sgT',a+d,[[a+d-wait,`You forgot to wait for the bus. ${Pr} reaches the stop at ${ttm(a+w1)}, but the next bus leaves at ${ttm(next)}: that is ${wait} min of waiting.`],[a+d-fq,`The ${ttm(before)} bus left before ${pr} reached the stop at ${ttm(a+w1)}. ${Pr} has to take the next one, at ${ttm(next)}.`],[a+d-w2,`You forgot the last ${w2} min walk to ${place[0]}.`]],
        `${kid} arrives at ${ttm(a+d)}.`,[`Reach the bus stop: ${ttm(a)} + ${w1} min = ${ttm(a+w1)}. The next bus is at ${ttm(next)}, so wait ${wait} min.`,`Whole journey: ${sgWork(S)} = ${tdur(d)}`,hops(a,a+d),'Press ▶ Replay journey to watch it again with the clock.']);}});
    jmStart(api);return}
  if(type==='compare'){let RA,RB,dA,dB;
    for(let t=0;t<60;t++){const legs=sgRoute(1,place[1]),f0=MRT[legs[0].k].P[legs[0].idx[0]];
      RA=sgBuild(legs,[{node:{n:'Home',kind:'home'},mode:'walk',min:R(4,8)}],[{mode:'walk',min:R(3,8),node:{n:place[0],kind:'place'}}]);
      const bw=R(2,6),bwait=R(3,10),bride=R(15,40),bw2=R(2,6);
      RB={nodes:[{n:'Home',kind:'home'},{n:'Bus stop',kind:'stop'},{n:'Bus stop',kind:'stop',dup:1},{n:'Stop near '+place[0].split(' ')[0],kind:'stop'},{n:place[0],kind:'place'}],segs:[{mode:'walk',min:bw,col:MODECOL.walk},{mode:'wait',min:bwait,col:MODECOL.wait},{mode:'bus',min:bride,col:MODECOL.bus},{mode:'walk',min:bw2,col:MODECOL.walk}]};
      dA=sgSum(RA.segs);dB=sgSum(RB.segs);if(Math.abs(dA-dB)>=3&&Math.abs(dA-dB)<=20)break}
    const diff=Math.abs(dA-dB),faster=dA<dB?'Route A':'Route B';
    const onlyA=RA.segs.filter(s=>s.mode==='mrt').reduce((x,s)=>x+s.min,0),onlyB=RB.segs.find(s=>s.mode==='bus').min;
    api.q(`<p class="qt">${kid} can get from home to <b>${place[0]}</b> in two ways. Which route is faster, and by how many minutes?</p>`);
    api.body.innerHTML=`<div class="jmwrap" style="max-width:920px;border:3px solid #2c3446;border-radius:14px;overflow:hidden;background:#141a26">${sgStrip(RA.nodes,RA.segs,'Route A · walk + MRT')}${sgStrip(RB.nodes,RB.segs,'Route B · walk + bus')}</div>`;
    routePick(api,faster,'sgC',()=>askDur(api,'sgC',diff,null,`${faster} is faster by ${tdur(diff)}.`,[`Route A: ${sgWork(RA.segs)} = ${tdur(dA)}`,`Route B: ${sgWork(RB.segs)} = ${tdur(dB)}`,`${faster} is faster: ${tdur(Math.max(dA,dB))} − ${tdur(Math.min(dA,dB))} = ${tdur(diff)}`],
      [[dA,`${tdur(dA)} is how long Route A takes. Now work out Route B and find the <b>difference</b>.`],[dB,`${tdur(dB)} is how long Route B takes. Now work out Route A and find the <b>difference</b>.`],[Math.abs(onlyA-onlyB),'You only compared the train and bus times. Walking and waiting count too!']].filter(([x])=>x!==diff)));
    return}
  if(type==='freq'){const no=pick(['14','36','75','190','506','851']),fq=pick([8,10,12,15,20]),first=R(5,6)*60+pick([0,5,10,15,30]),k=R(4,8),next=first+k*fq,arr=next-R(Math.max(2,Math.ceil(fq/4)),Math.floor(fq*3/4));
    api.q(`<p class="qt">The first bus <b>${no}</b> leaves the bus interchange at <b>${ttm(first)}</b>. After that, a bus leaves <b>every ${fq} minutes</b>. Each bus leaves exactly on time and does not wait for anyone.</p><p class="qt">${kid} reaches the interchange at <b>${ttm(arr)}</b>. What time does the next bus that ${pr} can catch leave?</p>`);
    api.body.innerHTML=busLine(first,fq,arr,next,kid,no);
    const list=[];for(let t=first;t<=next;t+=fq)list.push(ttm(t));
    askTime(api,'sgF',next,[[arr+fq,`You added ${fq} min to the time ${kid} arrived. The buses leave at ${ttm(first)}, ${ttm(first+fq)}, ${ttm(first+2*fq)}… Count on in jumps of ${fq} min from <b>${ttm(first)}</b>.`],[next-fq,`The ${ttm(next-fq)} bus has already left when ${kid} arrives at ${ttm(arr)}. Look for the first bus <b>after</b> ${ttm(arr)}.`]],
      `The next bus leaves at ${ttm(next)}.`,[`Count on in jumps of ${fq} min from ${ttm(first)}:`,list.join(' → '),`The first bus after ${ttm(arr)} is at <b>${ttm(next)}</b>.`]);return}
  if(type==='frac'){let w,bm,mm;do{w=R(4,12);bm=R(12,35);mm=R(62,78)}while(w+bm+mm%60<60);const d=w+bm+mm;
    api.q(`<p class="qt">${kid} goes across Singapore to <b>${place[0]}</b>. ${Pr} walks for <b>${tdur(w)}</b>, takes a bus for <b>${tdur(bm)}</b>, then rides the MRT for <b>${tdur(mm)}</b>. How long is the whole journey?</p>`);
    api.body.innerHTML=board([['Walk',tdur(w)],['Bus',tdur(bm)],['MRT',tdur(mm)],['Total','?? h ?? min']],`${kid}’s journey`,'🧭');
    const mins=w+bm+mm%60;
    askDur(api,'sgQ',d,null,`${tdur(w)} + ${tdur(bm)} + ${tdur(mm)} = ${tdur(d)}.`,[`Add the minutes: ${w} + ${bm} + ${mm%60} = ${mins} min = ${tdur(mins)}`,`Add the hour from the MRT ride: 1 h + ${tdur(mins)} = <b>${tdur(d)}</b>`],
      [[d-60,`You left out the <b>1 h</b> in the MRT ride (${tdur(mm)}).`],[d-mm+mm%60+0,`You left out the 1 h in the MRT ride.`]].filter(([x],i,arr)=>x!==d&&arr.findIndex(y=>y[0]===x)===i));return}
  if(type==='delay'){const R0=sgBuild(sgRoute(1)),S=R0.segs,d=sgSum(S),A=R0.nodes[0].n,B=R0.nodes[R0.nodes.length-1].n,a=R(8,18)*60+R(0,11)*5,slack=R(2,6),T=a+d+slack,D=slack+R(3,12),late=D-slack;
    api.q(`<p class="qt">${kid} boards the train at <b>${A}</b> at <b>${ttm(a)}</b> to meet friends at <b>${B}</b> at <b>${ttm(T)}</b>. The map shows the <b>usual</b> times for each part of the journey.</p><p class="qt">Today, a train fault stops the train for <b>${D} extra minutes</b>! How many minutes <b>late</b> is ${pr}?</p>`);
    api.body.innerHTML=board([['Boards at '+A,ttm(a)],['Usual journey','see the map'],['Train fault','+ '+D+' min'],['Meets friends at '+B,ttm(T)]],'Today’s trip','⚠️')+sgMap(R0,a);
    askDur(api,'sgL',late,null,`${kid} arrives at ${ttm(a+d+D)}, which is ${tdur(late)} after ${ttm(T)}.`,[`Journey: ${sgWork(S)} = ${tdur(d)}`,`Without the fault: ${ttm(a)} + ${tdur(d)} = ${ttm(a+d)} (${slack} min early)`,`With the fault: ${ttm(a+d)} + ${D} min = ${ttm(a+d+D)}`,`Late by: ${ttm(a+d+D)} − ${ttm(T)} = ${tdur(late)}`],
      [[D,`${D} min is how long the train stopped. But ${kid} had planned to arrive a few minutes early. Find when ${pr} actually arrives and compare it with ${ttm(T)}.`],[slack,`${slack} min is how early ${pr} would be <b>without</b> the fault. Now add the ${D} min stop.`]].filter(([x])=>x!==late));
    jmStart(api);return}
  if(type==='plan'){const fq=pick([10,12,15]),ride=R(16,35),w=R(3,8),d=ride+w,T=R(9,17)*60+pick([0,15,30,45]),lb=T-d-R(0,fq-1),buses=[lb-2*fq,lb-fq,lb,lb+fq,lb+2*fq];
    api.q(`<p class="qt">${kid} is already waiting at the bus stop. ${Pr} must reach <b>${place[0]}</b> by <b>${ttm(T)}</b>. The bus ride takes <b>${ride} min</b>, then ${pr} walks for <b>${w} min</b>. Which is the <b>latest</b> bus ${pr} can take and still be on time?</p>`);
    api.body.innerHTML=busBoard(buses.map(ttm),'Bus stop timetable')+'<div class="choices" id="sgPc"></div>';
    const ob=pr==='he'?'him':'her',work=[`Bus ride + walk = ${ride} + ${w} = ${d} min`,`Count back from ${ttm(T)}: ${ttm(T)} − ${d} min = ${ttm(T-d)}. A bus that leaves at ${ttm(T-d)} or earlier gets ${ob} there on time.`,`Check: the ${ttm(lb)} bus → arrives ${ttm(lb+d)} ✓ on time`,`the ${ttm(lb+fq)} bus → arrives ${ttm(lb+fq+d)} ✗ too late`,`So the latest bus is the <b>${ttm(lb)}</b> bus.`];
    buses.forEach(t=>{const b=document.createElement('button');b.className='btn';b.style.fontSize='1.1rem';b.textContent=ttm(t);
      b.onclick=()=>{if(api.answered)return;const ok=t===lb;[...$('sgPc').children].forEach(x=>{x.disabled=true;if(x.textContent===ttm(lb))x.classList.add('ok')});if(!ok)b.classList.add('no');
        api.done(ok,ok?`The ${ttm(lb)} bus gets ${ob} there at ${ttm(lb+d)}, in time.`:t>lb?`The ${ttm(t)} bus arrives at ${ttm(t+d)}, which is after ${ttm(T)}: too late!`:`The ${ttm(t)} bus works, but it is not the <b>latest</b>. The ${ttm(lb)} bus still arrives by ${ttm(T)}.`,work)};$('sgPc').appendChild(b)});return}
 }

/* SG Journeys 2 secret bonus (score 80% or more): Jas's real trip to school at SIT, Punggol */
function sgBonus(api){
  const st=(n,k)=>{const p=MRT[k].P.find(q=>q.n===n);return{n,x:p.x,y:p.y,kind:'stn',col:MRT[k].col}};
  const ns=R(26,30),c1=R(3,5),cc=R(4,5),c2=R(3,5),ne=R(13,16),wA=R(2,4),ns2=R(14,17),w1=R(3,5),wait=R(3,10),bus=R(50,58),wB=R(2,4);
  const A={nodes:[st('Choa Chu Kang','NS'),st('Bishan','NS'),{...st('Bishan','CC'),dup:1},st('Serangoon','CC'),{...st('Serangoon','NE'),dup:1},st('Punggol Coast','NE'),{n:'SIT',kind:'place'}],
    segs:[{mode:'mrt',min:ns,col:MRT.NS.col},{mode:'change',min:c1,col:MODECOL.change},{mode:'mrt',min:cc,col:MRT.CC.col},{mode:'change',min:c2,col:MODECOL.change},{mode:'mrt',min:ne,col:MRT.NE.col},{mode:'walk',min:wA,col:MODECOL.walk}]};
  const B={nodes:[st('Choa Chu Kang','NS'),st('Sembawang','NS'),{n:'Sembawang Int',kind:'stop'},{n:'Sembawang Int',kind:'stop',dup:1},{n:'Punggol Coast Int',kind:'stop'},{n:'SIT',kind:'place'}],
    segs:[{mode:'mrt',min:ns2,col:MRT.NS.col},{mode:'walk',min:w1,col:MODECOL.walk},{mode:'wait',min:wait,col:MODECOL.wait},{mode:'bus',min:bus,col:MODECOL.bus},{mode:'walk',min:wB,col:MODECOL.walk}]};
  const dA=sgSum(A.segs),dB=sgSum(B.segs),diff=Math.abs(dA-dB),faster=dA<dB?'Route A':'Route B',rideA=ns+cc+ne,rideB=ns2+bus;
  api.q(`<p class="qt">🎁 <b>Secret bonus!</b> Jas lives near <b>Choa Chu Kang</b> MRT and studies at <b>SIT</b> (Singapore Institute of Technology), next to Punggol Coast MRT. Look at her two ways to get to school. Which route is faster, and by how many minutes?</p><p class="qs">The times are estimates. Real times change with crowds and traffic.</p>`);
  const dot=c=>`<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};margin-right:8px;vertical-align:middle"></span>`;
  const stepsA=[[dot(MRT.NS.col)+'MRT: Choa Chu Kang → Bishan (North–South Line)',ns],[dot(MODECOL.change)+'Change to the Circle Line at Bishan',c1],[dot(MRT.CC.col)+'MRT: Bishan → Serangoon (Circle Line)',cc],[dot(MODECOL.change)+'Change to the North East Line at Serangoon',c2],[dot(MRT.NE.col)+'MRT: Serangoon → Punggol Coast (North East Line)',ne],[dot(MODECOL.walk)+'Walk to SIT',wA]];
  const stepsB=[[dot(MRT.NS.col)+'MRT: Choa Chu Kang → Sembawang (North–South Line)',ns2],[dot(MODECOL.walk)+'Walk to Sembawang Bus Interchange',w1],[dot(MODECOL.wait)+'Wait for bus 117',wait],[dot(MODECOL.bus)+'Ride bus 117 to Punggol Coast Bus Interchange',bus],[dot(MODECOL.walk)+'Walk to SIT',wB]];
  api.body.innerHTML=`<div class="row" style="align-items:flex-start;gap:12px">${board(stepsA.map(([t,m])=>[t,m+' min']),'Route A · MRT all the way','🚇')}${board(stepsB.map(([t,m])=>[t,m+' min']),'Route B · MRT + bus 117','🚌')}</div>`;
  routePick(api,faster,'sgX',()=>askDur(api,'sgX',diff,null,`${faster} is faster by ${tdur(diff)}.`,[`Route A: ${sgWork(A.segs)} = ${tdur(dA)}`,`Route B: ${sgWork(B.segs)} = ${tdur(dB)}`,`${faster} is faster: ${tdur(Math.max(dA,dB))} − ${tdur(Math.min(dA,dB))} = ${tdur(diff)}`,'A bus can feel easier (no changing lines), but here it is much slower!'],
    [[dA,`${tdur(dA)} is how long Route A takes. Now work out Route B and find the <b>difference</b>.`],[dB,`${tdur(dB)} is how long Route B takes. Now work out Route A and find the <b>difference</b>.`],[Math.abs(rideA-rideB),'You only compared the time on the trains and bus. Walking, changing lines and waiting count too!']].filter(([x])=>x!==diff)))}
addGame('sg-journeys',{level:'P4',strand:'geo',glyph:'⏱️',title:'Beat the Clock: SG Journeys',topic:'Time: start, finish and duration on MRT journeys',
 how:'Watch MRT journeys on a map of Singapore, then work out how long they take, when you arrive, or when you must board.',rounds:8,
 round(api,r){sgRound(api,['line','linearr','lineback','change','changearr','changeback','trip','back'][r])}});
addGame('sg-journeys-2',{level:'P5',strand:'geo',glyph:'⏱️',title:'Beat the Clock: SG Journeys 2',topic:'Planning trips: buses, MRT, timetables and delays',
 how:'Plan trips across Singapore by walking, bus and MRT. Work backwards, read bus timetables, compare routes and deal with surprise delays.',rounds:8,
 round(api,r){sgRound(api,['trip','freq','frac','back','bus','compare','delay','plan'][r])},
 bonus(api){sgBonus(api)}});
/* ================= P6. Beat the Clock: World Journeys — speed, distance and time on illustrated maps of real places ================= */
/* Landmark icons: simple, generic drawings (no logos). Each is drawn centred on its x, with its base at y. */
const WIC={
 sky:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-22" y="-34" width="12" height="34" fill="#8fa3bf"/><rect x="-8" y="-50" width="14" height="50" fill="#6f86a8"/><rect x="8" y="-26" width="12" height="26" fill="#9db1cc"/><path d="M-8 -50 L-1 -60 L6 -50Z" fill="#6f86a8"/></g>`,
 peak:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-40 0 L-8 -42 L6 -28 L18 -38 L44 0Z" fill="#5d8a5a"/><path d="M-8 -42 L-1 -33 L6 -28" fill="none" stroke="#3f6b3c" stroke-width="2"/></g>`,
 fuji:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-46 0 L-12 -48 L12 -48 L46 0Z" fill="#7d8fb3"/><path d="M-12 -48 L12 -48 L19 -38 L9 -34 L0 -40 L-9 -34 L-19 -38Z" fill="#fff"/></g>`,
 pagoda:(x,y)=>`<g transform="translate(${x},${y})" fill="#c2410c"><rect x="-6" y="-44" width="12" height="44" fill="#7a2a0c"/><path d="M-18 -8 L18 -8 L12 -14 L-12 -14Z"/><path d="M-15 -20 L15 -20 L10 -26 L-10 -26Z"/><path d="M-12 -32 L12 -32 L8 -38 L-8 -38Z"/><path d="M-1 -38 L1 -38 L0 -50Z" fill="#16233a"/></g>`,
 castle:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-20" y="-14" width="40" height="14" fill="#9aa7b8"/><rect x="-13" y="-30" width="26" height="16" fill="#f4f1ea"/><path d="M-20 -14 L20 -14 L15 -20 L-15 -20Z" fill="#2f5a4a"/><path d="M-17 -30 L17 -30 L10 -38 L-10 -38Z" fill="#2f5a4a"/></g>`,
 arch:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-30 0 Q0 -34 30 0" fill="none" stroke="#f4f1ea" stroke-width="7"/><path d="M-30 0 Q0 -34 30 0" fill="none" stroke="#9a7b5a" stroke-width="2"/><rect x="-10" y="-26" width="20" height="8" fill="#f4f1ea" stroke="#9a7b5a"/></g>`,
 bridge:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-46 0 Q0 -40 46 0" fill="none" stroke="#5e6b7d" stroke-width="5"/><line x1="-50" y1="-4" x2="50" y2="-4" stroke="#5e6b7d" stroke-width="4"/>${[-30,-15,0,15,30].map(v=>`<line x1="${v}" y1="-4" x2="${v}" y2="${-4-Math.round(28*(1-(v/46)**2))}" stroke="#5e6b7d" stroke-width="1.5"/>`).join('')}</g>`,
 bell:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-6" y="-46" width="12" height="46" fill="#b5694a"/><rect x="-7" y="-52" width="14" height="6" fill="#f4f1ea"/><path d="M-7 -52 L0 -64 L7 -52Z" fill="#3f8a6a"/></g>`,
 gondola:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-24 -4 Q0 6 24 -4 L26 -9 Q0 0 -26 -9Z" fill="#16233a"/><line x1="16" y1="-6" x2="22" y2="-26" stroke="#16233a" stroke-width="2"/></g>`,
 clock:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-7" y="-50" width="14" height="50" fill="#c9a96b"/><circle cx="0" cy="-40" r="5" fill="#fff" stroke="#16233a" stroke-width="1.2"/><path d="M-7 -50 L0 -64 L7 -50Z" fill="#6b5a3a"/></g>`,
 wheel:(x,y)=>`<g transform="translate(${x},${y})"><circle cx="0" cy="-24" r="22" fill="none" stroke="#5e6b7d" stroke-width="3"/>${[0,30,60,90,120,150].map(a=>`<line x1="${(22*Math.cos(a*Math.PI/180)).toFixed(1)}" y1="${(-24+22*Math.sin(a*Math.PI/180)).toFixed(1)}" x2="${(-22*Math.cos(a*Math.PI/180)).toFixed(1)}" y2="${(-24-22*Math.sin(a*Math.PI/180)).toFixed(1)}" stroke="#5e6b7d" stroke-width="1"/>`).join('')}<path d="M-8 0 L0 -24 L8 0" fill="none" stroke="#5e6b7d" stroke-width="2"/></g>`,
 tbridge:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-26" y="-34" width="11" height="34" fill="#9aa7b8"/><rect x="15" y="-34" width="11" height="34" fill="#9aa7b8"/><path d="M-26 -34 L-20 -42 L-15 -34Z M15 -34 L21 -42 L26 -34Z" fill="#5e6b7d"/><line x1="-36" y1="-8" x2="36" y2="-8" stroke="#2c6fbf" stroke-width="4"/><line x1="-15" y1="-26" x2="15" y2="-26" stroke="#2c6fbf" stroke-width="3"/></g>`,
 stupa:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-18 0 Q-18 -22 0 -26 Q18 -22 18 0Z" fill="#e8d7a8"/><path d="M-3 -26 L0 -52 L3 -26Z" fill="#c9a96b"/><rect x="-22" y="-4" width="44" height="4" fill="#c9a96b"/></g>`,
 palace:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-22" y="-14" width="44" height="14" fill="#f4f1ea"/><path d="M-26 -14 L26 -14 L16 -24 L-16 -24Z" fill="#c2410c"/><path d="M-16 -24 L16 -24 L8 -32 L-8 -32Z" fill="#2f7a4a"/><path d="M-2 -32 L0 -46 L2 -32Z" fill="#d4a017"/></g>`,
 obelisk:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-16" y="-6" width="32" height="6" fill="#d9d4c7"/><path d="M-5 -6 L-3 -50 L3 -50 L5 -6Z" fill="#f4f1ea" stroke="#9aa7b8"/><path d="M-5 -50 Q0 -64 5 -50Z" fill="#e0b000"/></g>`,
 sails:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-30" y="-4" width="60" height="4" fill="#d9d4c7"/><path d="M-26 -4 Q-24 -30 -6 -34 L-6 -4Z" fill="#fff" stroke="#9aa7b8"/><path d="M-6 -4 Q-4 -34 14 -38 L14 -4Z" fill="#fff" stroke="#9aa7b8"/><path d="M14 -4 Q16 -24 28 -26 L28 -4Z" fill="#fff" stroke="#9aa7b8"/></g>`,
 twin:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-14 0 L-14 -46 L-9 -58 L-4 -46 L-4 0Z" fill="#b8c2cf"/><path d="M4 0 L4 -46 L9 -58 L14 -46 L14 0Z" fill="#b8c2cf"/><line x1="-4" y1="-30" x2="4" y2="-30" stroke="#5e6b7d" stroke-width="2"/></g>`,
 windmill:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-8 0 L-5 -28 L5 -28 L8 0Z" fill="#7a4a2a"/><g transform="translate(0,-28)" stroke="#f4f1ea" stroke-width="4"><line x1="-18" y1="-18" x2="18" y2="18"/><line x1="-18" y1="18" x2="18" y2="-18"/></g></g>`,
 houses:(x,y)=>`<g transform="translate(${x},${y})">${[['#b5694a',-24],['#e0b000',-12],['#2c6fbf',0],['#5d8a5a',12]].map(([c,dx])=>`<path d="M${dx} 0 L${dx} -24 L${dx+5} -32 L${dx+10} -24 L${dx+10} 0Z" fill="${c}"/>`).join('')}</g>`,
 museum:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-22" y="-20" width="44" height="20" fill="#b5694a"/><path d="M-24 -20 L24 -20 L0 -32Z" fill="#7a4a2a"/>${[-14,-5,4,13].map(v=>`<rect x="${v}" y="-16" width="3" height="14" fill="#f4f1ea"/>`).join('')}</g>`,
 stadium:(x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="-10" rx="28" ry="12" fill="#9aa7b8"/><ellipse cx="0" cy="-10" rx="18" ry="6" fill="#5d8a5a"/></g>`,
 fountain:(x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="-4" rx="20" ry="6" fill="#8fc6e8" stroke="#5e6b7d"/><path d="M0 -6 Q-6 -24 0 -30 Q6 -24 0 -6" fill="#8fc6e8"/></g>`,
 oldtown:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-22" y="-20" width="44" height="20" fill="#f4f1ea" stroke="#9aa7b8"/><path d="M-24 -20 L24 -20 L18 -28 L-18 -28Z" fill="#b5694a"/>${[-14,-2,10].map(v=>`<rect x="${v}" y="-15" width="5" height="8" fill="#5e6b7d"/>`).join('')}</g>`,
 tower:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-6 0 L-2 -44 L2 -44 L6 0Z" fill="#9aa7b8"/><rect x="-8" y="-50" width="16" height="7" rx="3" fill="#5e6b7d"/><line x1="0" y1="-50" x2="0" y2="-64" stroke="#5e6b7d" stroke-width="2"/></g>`,
 hills:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-36 0 Q-30 -34 -18 -30 Q-12 -40 -4 -26 Q6 -44 14 -28 Q26 -36 34 0Z" fill="#6f9a5a"/></g>`,
 beach:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-30 0 Q0 -8 30 0Z" fill="#f2dfa7"/><line x1="0" y1="-2" x2="0" y2="-24" stroke="#16233a" stroke-width="2"/><path d="M-14 -22 Q0 -34 14 -22Z" fill="#ef5240"/></g>`,
 plane:(x,y)=>`<g transform="translate(${x},${y-14})"><path d="M-20 0 L20 0 M-4 0 L-12 -12 M-4 0 L-12 12 M14 0 L18 -7" stroke="#16233a" stroke-width="4" stroke-linecap="round"/></g>`,
 chalet:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-14" y="-14" width="28" height="14" fill="#9a6b3a"/><path d="M-18 -14 L0 -28 L18 -14Z" fill="#7a2a0c"/><rect x="-4" y="-9" width="8" height="9" fill="#f4f1ea"/></g>`,
 pine:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-10 0 L0 -26 L10 0Z" fill="#2f6b3c"/><path d="M-12 -10 L0 -34 L12 -10Z" fill="#3f7a4a"/></g>`,
 tree:(x,y)=>`<g transform="translate(${x},${y})"><rect x="-2" y="-12" width="4" height="12" fill="#7a4a2a"/><circle cx="0" cy="-18" r="10" fill="#5d8a5a"/><circle cx="10" cy="-12" r="8" fill="#6f9a5a"/><circle cx="-10" cy="-12" r="8" fill="#6f9a5a"/></g>`,
 boat:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-20 -6 L20 -6 L14 2 L-14 2Z" fill="#2f7a4a"/><rect x="-11" y="-14" width="20" height="8" fill="#fff"/></g>`,
 snow:(x,y)=>`<g transform="translate(${x},${y})"><path d="M-30 0 L0 -40 L30 0Z" fill="#9aa7b8"/><path d="M-11 -25 L0 -40 L11 -25 L4 -28 L0 -23 L-5 -28Z" fill="#fff"/></g>`};
const WJS={
 tram:`<line x1="0" y1="-24" x2="7" y2="-34" stroke="#16233a" stroke-width="2"/><rect x="-16" y="-24" width="32" height="30" rx="4" fill="#0f7a4f" stroke="#16233a" stroke-width="1.5"/><rect x="-12" y="-20" width="24" height="7" rx="1.5" fill="#fff"/><rect x="-12" y="-8" width="24" height="7" rx="1.5" fill="#fff"/><circle cx="-8" cy="7" r="3" fill="#16233a"/><circle cx="8" cy="7" r="3" fill="#16233a"/>`,
 bullet:`<path d="M-24 6 L-24 -8 Q-24 -12 -19 -12 L6 -12 Q20 -12 28 3 L28 6 Z" fill="#fff" stroke="#16233a" stroke-width="1.5"/><rect x="-24" y="-1" width="49" height="3" fill="#1e5bd8"/><rect x="-19" y="-9" width="6" height="4" rx="1" fill="#2b3a55"/><rect x="-10" y="-9" width="6" height="4" rx="1" fill="#2b3a55"/><rect x="-1" y="-9" width="6" height="4" rx="1" fill="#2b3a55"/>`,
 train:`<rect x="-20" y="-12" width="40" height="18" rx="5" fill="#fff" stroke="#c2410c" stroke-width="3"/><rect x="-15" y="-8" width="7" height="6" rx="1.5" fill="#2b3a55"/><rect x="-3.5" y="-8" width="7" height="6" rx="1.5" fill="#2b3a55"/><rect x="8" y="-8" width="7" height="6" rx="1.5" fill="#2b3a55"/>`,
 boat:`<path d="M-24 -2 L24 -2 L17 8 L-17 8 Z" fill="#c2410c" stroke="#16233a" stroke-width="1.5"/><rect x="-13" y="-13" width="22" height="11" rx="2" fill="#fff" stroke="#16233a" stroke-width="1.5"/><path d="M-26 11 Q-20 8 -14 11 T-2 11 T10 11 T22 11" stroke="#2378b5" stroke-width="2" fill="none"/>`,
 tuk:`<path d="M-16 4 L-16 -12 Q-16 -16 -10 -16 L8 -16 Q14 -16 14 -8 L20 0 L20 4 Z" fill="#f6b70f" stroke="#16233a" stroke-width="1.5"/><rect x="-12" y="-12" width="18" height="8" rx="1.5" fill="#fff"/><circle cx="-10" cy="6" r="3.5" fill="#16233a"/><circle cx="14" cy="6" r="3.5" fill="#16233a"/>`,
 bus:`<rect x="-20" y="-14" width="40" height="18" rx="4" fill="#5f50ec" stroke="#16233a" stroke-width="1.5"/><rect x="-16" y="-11" width="26" height="7" rx="1.5" fill="#fff"/><rect x="12" y="-11" width="5" height="11" rx="1" fill="#fff"/><circle cx="-11" cy="5" r="3.5" fill="#16233a"/><circle cx="11" cy="5" r="3.5" fill="#16233a"/>`,
 bike:`<circle cx="-11" cy="2" r="6.5" fill="none" stroke="#16233a" stroke-width="2"/><circle cx="11" cy="2" r="6.5" fill="none" stroke="#16233a" stroke-width="2"/><path d="M-11 2 L-3 -8 L9 -8 L11 2 M-3 -8 L0 2 L-11 2" stroke="#ef5240" stroke-width="2.4" fill="none" stroke-linejoin="round"/><circle cx="1" cy="-24" r="3.6" fill="#16233a"/><path d="M1 -20 L-2 -9 M0 -17 L8 -10" stroke="#16233a" stroke-width="2.4" stroke-linecap="round"/>`,
 cable:`<line x1="0" y1="-30" x2="0" y2="-16" stroke="#16233a" stroke-width="2"/><rect x="-13" y="-16" width="26" height="20" rx="4" fill="#ef5240" stroke="#16233a" stroke-width="1.5"/><rect x="-9" y="-12" width="18" height="7" rx="1.5" fill="#fff"/>`,
 walk:`<circle cy="-8" r="13" fill="#fff" stroke="#16233a" stroke-width="2"/><circle cx="0" cy="-14.5" r="2.7" fill="#16233a"/><path d="M0 -11 L0 -4 M0 -4 L-3.5 1 M0 -4 L3.5 1 M-4.5 -7.5 L4.5 -9" stroke="#16233a" stroke-width="2" stroke-linecap="round" fill="none"/>`};
const W_WATER='#a9d8f0',W_LAND='#e7efdf';
/* maps: bg (shapes), stops [name, distance from the first stop, x, y, label side], marks [icon, x, y, label] */
const WMAPS={
 hk:{u:'km',bg:`<rect width="660" height="320" fill="${W_WATER}"/><path d="M0 0 L660 0 L660 58 C520 72 300 64 0 54Z" fill="${W_LAND}"/><path d="M0 138 C120 122 250 132 330 136 S520 124 660 140 L660 320 L0 320Z" fill="${W_LAND}"/><text x="330" y="30" text-anchor="middle" class="wml">Kowloon</text><text x="500" y="104" text-anchor="middle" class="wmw">Victoria Harbour</text>`,
   stops:[['Kennedy Town',0,40,170,'b'],['Central',4,200,162,'b'],['Admiralty',5,255,166,'a'],['Wan Chai',6,312,162,'b'],['Causeway Bay',8,388,163,'a'],['North Point',10,478,157,'b'],['Shau Kei Wan',13,612,170,'a']],
   marks:[['peak',130,282,'Victoria Peak'],['sky',236,262,'Central skyscrapers'],['boat',300,86,'Star Ferry'],['sky',560,40,'']]},
 jp:{u:'km',bg:`<rect width="660" height="320" fill="${W_WATER}"/><path d="M0 0 L660 0 L660 150 C600 170 560 176 520 200 C470 232 420 244 360 244 C300 238 240 218 180 212 C120 206 60 216 0 222Z" fill="${W_LAND}"/><text x="400" y="296" text-anchor="middle" class="wmw">Pacific Ocean</text>`,
   stops:[['Tokyo',0,610,120,'a'],['Shin-Yokohama',30,566,152,'b'],['Shizuoka',180,440,204,'b'],['Hamamatsu',255,362,214,'b'],['Nagoya',365,276,186,'b'],['Kyoto',515,176,146,'b'],['Shin-Osaka',555,96,170,'b']],
   marks:[['fuji',492,124,'Mount Fuji'],['sky',622,78,''],['pagoda',214,96,'Kyoto temples'],['castle',64,128,'Osaka Castle']]},
 kr:{u:'km',bg:`<rect width="660" height="320" fill="${W_WATER}"/><path d="M0 0 L560 0 C600 80 620 160 600 226 C580 280 520 300 462 320 L0 320Z" fill="${W_LAND}"/><text x="630" y="300" text-anchor="end" class="wmw">Sea</text>`,
   stops:[['Seoul',0,170,62,'a'],['Daejeon',160,240,152,'b'],['Dongdaegu',290,392,202,'a'],['Busan',420,500,282,'b']],
   marks:[['tower',104,74,'N Seoul Tower'],['hills',318,118,'mountains'],['beach',590,262,'Haeundae Beach']]},
 it:{u:'km',bg:`<rect width="660" height="320" fill="${W_WATER}"/><path d="M60 40 C200 10 480 20 600 60 C640 140 620 240 560 280 C420 312 200 302 80 270 C30 200 30 100 60 40Z" fill="${W_LAND}"/><polyline points="110,90 230,130 330,120 400,190 330,232 520,252 640,262" fill="none" stroke="${W_WATER}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/><text x="560" y="300" class="wmw">Venice Lagoon</text>`,
   stops:[['Ferrovia (station)',0,110,90,'a'],['Rialto',2,330,120,'a'],['Accademia',3,330,232,'b'],['San Marco',4,520,252,'b']],
   marks:[['arch',272,150,'Rialto Bridge'],['bell',566,214,'St Mark’s bell tower'],['gondola',432,206,'gondola'],['houses',190,70,'']]},
 uk:{u:'km',bg:`<rect width="660" height="320" fill="${W_LAND}"/><path d="M0 230 C120 210 200 268 300 248 S460 178 560 208 S640 248 660 238" fill="none" stroke="${W_WATER}" stroke-width="26"/><text x="160" y="278" class="wmw">River Thames</text>`,
   stops:[['Heathrow',0,40,120,'b'],['Hammersmith',15,232,140,'b'],['South Kensington',19,330,170,'b'],['Piccadilly Circus',22,424,132,'a'],['King’s Cross',25,502,70,'a']],
   marks:[['plane',70,64,'Heathrow Airport'],['clock',446,224,'Big Ben'],['wheel',500,236,'London Eye'],['tbridge',604,226,'Tower Bridge']]},
 th:{u:'km',bg:`<rect width="660" height="320" fill="${W_LAND}"/><path d="M170 0 C140 80 200 140 160 200 S150 280 190 320" fill="none" stroke="${W_WATER}" stroke-width="30"/><text x="96" y="304" class="wmw">Chao Phraya River</text>`,
   stops:[['Khao San Road',0,242,60,'a'],['Grand Palace',2,226,134,'b'],['Chinatown',4,284,210,'b'],['Siam',8,452,150,'a'],['Sukhumvit',11,592,172,'b']],
   marks:[['palace',300,118,''],['stupa',92,150,'Wat Arun temple'],['sky',474,104,'Siam shopping malls'],['sky',600,128,'']]},
 id:{u:'km',bg:`<rect width="660" height="320" fill="${W_LAND}"/><rect width="660" height="16" fill="${W_WATER}"/><text x="600" y="12" text-anchor="middle" class="wmw" style="font-size:11px">Java Sea</text>`,
   stops:[['Blok M',0,330,292,'a'],['Senayan',3,298,236,'a'],['Bundaran HI',7,318,152,'a'],['Monas',9,330,100,'a'],['Kota',13,340,34,'a']],
   marks:[['obelisk',408,104,'Monas monument'],['stadium',204,244,'Gelora Bung Karno stadium'],['fountain',396,162,'Bundaran HI roundabout'],['oldtown',446,48,'Kota Tua (old town)']]},
 au:{u:'km',bg:`<rect width="660" height="320" fill="${W_WATER}"/><path d="M0 0 L660 0 L660 88 C560 110 520 70 420 96 S250 70 150 100 S40 82 0 96Z" fill="${W_LAND}"/><path d="M0 204 C150 184 250 232 360 212 S560 232 660 212 L660 320 L0 320Z" fill="${W_LAND}"/><text x="430" y="170" text-anchor="middle" class="wmw">Sydney Harbour</text>`,
   stops:[['Circular Quay',0,180,204,'b'],['Taronga Zoo',2,282,104,'a'],['Manly',11,612,96,'a']],
   marks:[['sails',246,250,'Sydney Opera House'],['bridge',110,178,'Harbour Bridge'],['beach',520,52,'Manly Beach']]},
 my:{u:'km',bg:`<rect width="660" height="320" fill="${W_WATER}"/><path d="M120 0 L660 0 L660 320 L230 320 C190 260 170 200 150 140 C140 90 130 40 120 0Z" fill="${W_LAND}"/><text x="60" y="200" class="wmw" transform="rotate(-70 60 200)">Strait of Malacca</text>`,
   stops:[['KL Sentral',0,300,282,'b'],['Tanjung Malim',80,272,212,'a'],['Ipoh',205,232,142,'a'],['Taiping',290,192,86,'a'],['Butterworth',365,162,30,'a']],
   marks:[['twin',420,262,'Petronas Twin Towers'],['hills',350,150,'Ipoh limestone hills'],['bridge',84,46,'Penang Bridge']]},
 nl:{u:'m',bg:`<rect width="660" height="320" fill="${W_LAND}"/><rect width="660" height="28" fill="${W_WATER}"/>${[90,140,190].map(r=>`<path d="M${330-r} 28 A${r} ${r} 0 0 0 ${330+r} 28" fill="none" stroke="${W_WATER}" stroke-width="9"/>`).join('')}<text x="560" y="20" class="wmw">River IJ</text>`,
   stops:[['Centraal Station',0,330,44,'a'],['Dam Square',1200,320,122,'a'],['Rijksmuseum',3000,300,246,'a'],['Vondelpark',3600,196,282,'b']],
   marks:[['houses',430,150,'canal houses'],['windmill',566,250,'windmill'],['museum',360,282,''],['tree',150,250,'']]},
 ch:{u:'m',bg:`<rect width="660" height="320" fill="#d6ecfa"/><path d="M0 320 L0 252 L120 222 L262 152 L380 92 L470 40 L560 82 L660 142 L660 320Z" fill="#b8c2cf"/><path d="M420 64 L470 40 L516 62 L490 70 L470 60 L446 72Z" fill="#fff"/><path d="M0 320 L0 268 L160 250 L300 280 L660 270 L660 320Z" fill="#9cc48a"/>`,
   stops:[['Valley station',0,90,252,'b'],['Middle station',1800,300,140,'a'],['Summit station',3000,470,44,'a']],
   marks:[['chalet',40,284,'village'],['pine',150,262,''],['pine',190,272,''],['snow',600,150,'']]}};
const WJ=[
 {c:'Hong Kong',map:'hk',m:'tram',name:'Ding Ding tram',ex:'an old double-decker tram',u:'kmh',v:[9,10,12]},
 {c:'Japan',map:'jp',m:'bullet',name:'Shinkansen',ex:'a bullet train',u:'kmh',v:[200,240,250,270,300]},
 {c:'South Korea',map:'kr',m:'bullet',name:'KTX',ex:'a high-speed train',u:'kmh',v:[180,200,240]},
 {c:'Italy',map:'it',m:'boat',name:'vaporetto',ex:'a water bus: Venice has canals instead of roads',u:'kmh',v:[8,9,10,12]},
 {c:'the United Kingdom',map:'uk',m:'train',name:'London Underground',ex:'"the Tube", a train that runs in tunnels under London',u:'kmh',v:[30,32,36]},
 {c:'Thailand',map:'th',m:'tuk',name:'tuk-tuk',ex:'a small taxi with three wheels',u:'kmh',v:[12,15,18,20,24]},
 {c:'Indonesia',map:'id',m:'bus',name:'TransJakarta bus',ex:'a city bus with its own road lane',u:'kmh',v:[18,20,24]},
 {c:'Australia',map:'au',m:'boat',name:'Sydney ferry',ex:'a passenger boat',u:'kmh',v:[20,22,24,30]},
 {c:'Malaysia',map:'my',m:'train',name:'ETS train',ex:'an electric train between cities',u:'kmh',v:[100,120,140]},
 {c:'the Netherlands',map:'nl',m:'bike',name:'bicycle',ex:'most people in Amsterdam cycle',u:'mpm',v:[200,240,250,300]},
 {c:'Switzerland',map:'ch',m:'cable',name:'cable car',ex:'a cabin that hangs from a cable',u:'mpm',v:[300,360,400]}];
/* draw a map. o: {from,to} stop indexes to ride (sprite animates), lab: text in the route pill, jam: show a jam,
   extra:{x,y,label,mode} a second leg drawn dashed after the ride, walk:{x1,y1,x2,y2,label} a dashed walk, pins:[[x,y,label]] */
function wjMap(T,o){const M=WMAPS[T.map],S=M.stops,fsc=innerWidth<600?1.3:1,fs=v=>(v*fsc).toFixed(1);let s=M.bg;
  const css=`<style>.wml{font:800 ${fs(15)}px var(--body,sans-serif);fill:#4a5568}.wmw{font:italic 700 ${fs(13)}px var(--body,sans-serif);fill:#2a6f97}</style>`;
  const pts=S.map(p=>[p[2],p[3]]),line=(P,col,w,da)=>`<polyline points="${P.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${da?`stroke-dasharray="${da}"`:''}/>`;
  s+=M.marks.map(([ic,x,y,l])=>WIC[ic](x,y)+(l?`<text x="${x}" y="${y+16*fsc}" text-anchor="middle" style="font:700 ${fs(12.5)}px var(--body,sans-serif);fill:#3b4656;paint-order:stroke;stroke:#fff;stroke-width:3px">${l}</text>`:'')).join('');
  s+=T.m==='cable'?line(pts,'#16233a',2,''):line(pts,'#7d8796',5,'');
  let seg=null;if(o.from!=null){const a=Math.min(o.from,o.to),b=Math.max(o.from,o.to);seg=pts.slice(a,b+1);if(o.from>o.to)seg.reverse();s+=line(seg,o.col||'#ef5240',T.m==='cable'?4:9,'')}
  if(o.extra&&seg){const e=o.extra,l0=seg[seg.length-1];s+=line([l0,[e.x,e.y]],'#5f50ec',6,'10 6')+`<circle cx="${e.x}" cy="${e.y}" r="8" fill="#5f50ec" stroke="#16233a" stroke-width="2"/><text x="${e.x}" y="${e.y-14*fsc}" text-anchor="middle" style="font:800 ${fs(14)}px var(--body,sans-serif);fill:#16233a;paint-order:stroke;stroke:#fff;stroke-width:4px">${e.label}</text>`}
  if(o.walk){const w=o.walk;s+=line([[w.x1,w.y1],[w.x2,w.y2]],'#56667b',4,'2 7')}
  (o.pins||[]).forEach(([x,y,l])=>{s+=`<rect x="${x-9}" y="${y-9}" width="18" height="18" rx="5" fill="#0b968b" stroke="#16233a" stroke-width="2"/><text x="${x}" y="${y-14*fsc}" text-anchor="middle" style="font:800 ${fs(14)}px var(--body,sans-serif);fill:#16233a;paint-order:stroke;stroke:#fff;stroke-width:4px">${l}</text>`});
  S.forEach(([n,,x,y,side],i)=>{const on=seg&&(i===o.from||i===o.to);s+=`<circle cx="${x}" cy="${y}" r="${on?9:6}" fill="${on?'#ffd257':'#fff'}" stroke="#16233a" stroke-width="2.5"/>`;
    s+=`<text x="${x}" y="${side==='a'?y-13*fsc:y+24*fsc}" text-anchor="${x<70?'start':x>590?'end':'middle'}" style="font:800 ${fs(on?15:13.5)}px var(--body,sans-serif);fill:#16233a;paint-order:stroke;stroke:#fff;stroke-width:4px">${n}</text>`});
  if(seg&&o.lab){/* put the distance pill next to the ridden part, in a spot clear of station names, landmarks and dots */
    const w=String(o.lab).length*9.5*fsc+24,h=28*fsc,obs=[];
    S.forEach(([n,,x,y,side])=>{const tw=n.length*8.2*fsc,ty=side==='a'?y-13*fsc:y+24*fsc,ax=x<70?x:x>590?x-tw:x-tw/2;obs.push([ax,ty-15*fsc,ax+tw,ty+4],[x-10,y-10,x+10,y+10])});
    M.marks.forEach(([,x,y,l])=>{obs.push([x-30,y-50,x+30,y+2]);if(l){const tw=l.length*7.4*fsc;obs.push([x-tw/2,y+2,x+tw/2,y+20*fsc])}});
    const cands=[];for(let k=0;k<seg.length-1;k++){const p=seg[k],q=seg[k+1],L=Math.hypot(q[0]-p[0],q[1]-p[1])||1,nx=-(q[1]-p[1])/L,ny=(q[0]-p[0])/L;
      [.5,.3,.7].forEach(f=>[34,-34,52,-52,72,-72].forEach(dd=>cands.push([p[0]+(q[0]-p[0])*f+nx*dd*fsc,p[1]+(q[1]-p[1])*f+ny*dd*fsc,L])))}
    cands.sort((a,b)=>b[2]-a[2]);const fits=([cx,cy])=>cx-w/2>4&&cx+w/2<656&&cy-h/2>4&&cy+h/2<316&&!obs.some(b=>cx-w/2<b[2]&&cx+w/2>b[0]&&cy-h/2<b[3]&&cy+h/2>b[1]);
    const [mx,my]=cands.find(fits)||cands[0];
    s+=`<g><rect x="${(mx-w/2).toFixed(1)}" y="${(my-h/2).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(h/2).toFixed(1)}" fill="#ef5240" stroke="#fff" stroke-width="2"/><text x="${mx.toFixed(1)}" y="${(my+6*fsc).toFixed(1)}" text-anchor="middle" style="font:800 ${fs(16)}px var(--body,sans-serif);fill:#fff">${o.lab}</text></g>`}
  if(o.jam&&seg){const m=seg[Math.floor(seg.length/2)];s+=`<g transform="translate(${m[0]},${m[1]+26})"><rect x="-38" y="-12" width="76" height="24" rx="12" fill="#c2410c"/><text y="5" text-anchor="middle" style="font:800 ${fs(13)}px var(--body,sans-serif);fill:#fff">🚗🚗 jam</text></g>`}
  if(seg&&!o.noSprite&&!calm)s+=`<g id="wjSpr" data-p="${seg.map(p=>p.join(',')).join(' ')}" transform="translate(${seg[0].join(',')})"><g>${WJS[T.m]||WJS.walk}</g></g>`;
  return `<div class="jmwrap" style="max-width:920px;border:3px solid #2c3446;border-radius:14px;overflow:hidden;background:#141a26"><div class="tbh" style="padding:7px 12px">📍 ${o.head||T.c}</div><svg class="wjsvg tmap-nozoom" viewBox="0 0 660 320" style="width:100%;height:auto;display:block" role="img" aria-label="Map of ${T.c} with ${S.map(p=>p[0]).join(', ')}">${css}${s}</svg>${o.note?`<div style="padding:6px 12px;color:#c8d0dc;font-size:.9rem">${o.note}</div>`:''}</div>
  ${calm||o.noSprite?'':'<div class="row" style="margin-top:8px"><button class="btn" id="wjPlay">▶ Replay</button></div>'}`}
let wjTok=0;
/* move the vehicle along the highlighted route (it faces the way it travels), then fade it so it does not cover the labels */
function wjWire(){const g=$('wjSpr');if(!g)return;const P=g.dataset.p.split(' ').map(q=>q.split(',').map(Number)),L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));
  const tot=L[L.length-1]||1,inner=g.firstElementChild;
  const run=()=>{const tok=++wjTok,D=3200;let t0=null;g.style.opacity=1;
    const step=now=>{if(tok!==wjTok||!g.isConnected)return;if(t0===null)t0=now;const u=Math.min(1,(now-t0)/D),d=u*tot;let i=1;while(i<P.length-1&&L[i]<d)i++;
      const f=(d-L[i-1])/((L[i]-L[i-1])||1),x=P[i-1][0]+(P[i][0]-P[i-1][0])*f,y=P[i-1][1]+(P[i][1]-P[i-1][1])*f;
      g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);inner.setAttribute('transform',P[i][0]<P[i-1][0]?'scale(-1,1)':'scale(1,1)');
      if(u<1)requestAnimationFrame(step);else setTimeout(()=>{if(tok===wjTok&&g.isConnected)g.style.opacity=0},900)};
    requestAnimationFrame(step)};
  run();const b=$('wjPlay');if(b)b.onclick=()=>{sfx.tap();run()}}
const gcdN=(a,b)=>b?gcdN(b,a%b):a;
const hstr=t=>{if(t%60===0)return `${t/60} h`;const w=Math.floor(t/60),r=t%60,g=gcdN(r,60);return `${w?w+' ':''}${fr(r/g,60/g)} h`};
const decMis=t=>{const h=t/60;if(t%60===0||Math.round(h*100)!==h*100)return null;return Math.floor(h)*60+Math.round(h%1*100)};
/* pick two stops and a speed so the time is a whole number of minutes (a multiple of `step`) */
function wjTrip(T,o={}){const S=WMAPS[T.map].stops;for(let k=0;k<400;k++){let i=R(0,S.length-1),j=R(0,S.length-1);if(i===j)continue;const d=Math.abs(S[j][1]-S[i][1]),s=pick(T.v);
  if(T.u==='kmh'){if((d*60)%s)continue;const t=d*60/s;if(t%(o.step||5)||t<(o.min||10)||t>(o.max||300))continue;return{i,j,d,s,t}}
  else{if(d%s)continue;const t=d/s;if(t<3||t>30)continue;return{i,j,d,s,t}}}return null}
addGame('world-journeys',{level:'P6',strand:'geo',glyph:'🌏',title:'Beat the Clock: World Journeys',topic:'Speed, distance and time on maps of real places',
 how:'Ride trams, bullet trains, water buses and cable cars on maps of real places. Read distances off the map and work out speed, distance, time and average speed.',rounds:8,
 round(api,r){
  const type=['speed','dist','time','arrive','jam','avg','race','catch'][r];
  const[kid,pr]=pick(SGKIDS),Pr=pr[0].toUpperCase()+pr.slice(1);
  if(['speed','dist','time','arrive'].includes(type)){let T,g;do{T=pick(WJ);g=wjTrip(T,{step:type==='speed'&&T.u==='kmh'?15:5})}while(!g);
    const{i,j,d,s,t}=g,S=WMAPS[T.map].stops,A=S[i][0],B=S[j][0],km=T.u==='kmh',su=km?'km/h':'m/min',du=km?'km':'m',go=['cable','bike'].includes(T.m)?'goes':'travels';
    const intro=`In <b>${T.c}</b>, ${kid} rides the <b>${T.name}</b> (${T.ex}) from <b>${A}</b> to <b>${B}</b>.`;
    const map=wjMap(T,{from:i,to:j,lab:type==='dist'?`? ${du}`:`${d} ${du}`,head:`${T.c} · ${T.name}`,note:'Distances along the route are rounded.'});
    if(type==='speed'){api.q(`<p class="qt">${intro} Read the distance on the map. The trip takes <b>${tdur(t)}</b>. What is the speed?</p>`);api.body.innerHTML=map;wjWire();
      const work=['Speed = distance ÷ time',`Distance from the map: ${d} ${du}`,...(km?[`${tdur(t)} = ${hstr(t)}`,`${d} km ÷ ${hstr(t)} = <b>${s} km/h</b>`]:[`${d} m ÷ ${t} min = <b>${s} m/min</b>`])];
      const traps=[...(km&&t!==60?[[d/t,`You divided by ${t} minutes. km/h means km in 1 <b>hour</b>, so change ${tdur(t)} into hours first: ${hstr(t)}.`]]:[]),[d*t,'Speed = distance <b>÷</b> time, not ×.'],[t/d,'Divide the distance by the time, not the time by the distance.']].filter(([x])=>!near(x,s));
      askOne(api,{id:'wjS',unit:su,w:5,right:s,traps,ok:`The speed is ${s} ${su}.`,bad:`The speed is ${s} ${su}.`,work});return}
    if(type==='dist'){api.q(`<p class="qt">${intro} It ${go} at <b>${s} ${su}</b> and the trip takes <b>${tdur(t)}</b>. How far apart are ${A} and ${B} along the route?</p>`);api.body.innerHTML=map;wjWire();
      const work=['Distance = speed × time',...(km?[`${tdur(t)} = ${hstr(t)}`,`${s} × ${hstr(t)} = <b>${d} km</b>`]:[`${s} × ${t} = <b>${d} m</b>`])];
      const traps=[...(km&&t!==60?[[s*t,`${s} × ${t} uses minutes. ${s} km/h means ${s} km in 1 <b>hour</b>, so change ${tdur(t)} into hours first: ${hstr(t)}.`]]:[]),[s/t,'Distance = speed <b>×</b> time.']].filter(([x])=>!near(x,d));
      askOne(api,{id:'wjD',unit:du,w:5,right:d,traps,ok:`They are ${d} ${du} apart.`,bad:`The distance is ${d} ${du}.`,work});return}
    if(type==='time'){api.q(`<p class="qt">${intro} Read the distance on the map. It ${go} at <b>${s} ${su}</b>. How long does the trip take?</p>`);api.body.innerHTML=map;wjWire();
      const wm=decMis(t),work=['Time = distance ÷ speed',`Distance from the map: ${d} ${du}`,km?`${d} ÷ ${s} = ${hstr(t)} = <b>${tdur(t)}</b>`:`${d} ÷ ${s} = <b>${t} min</b>`];
      askDur(api,'wjT',t,null,`The trip takes ${tdur(t)}.`,work,[...(km&&wm!==null&&wm!==t?[[wm,`${t/60} h is not ${tdur(wm)}! An hour has 60 minutes: ${t/60} h = ${tdur(t)}.`]]:[])]);return}
    const a=R(7,16)*60+R(0,11)*5,wm=decMis(t);
    api.q(`<p class="qt">${intro} It leaves ${A} at <b>${ttm(a)}</b> and ${go} at <b>${s} ${su}</b>. Read the distance on the map. What time does it reach ${B}?</p>`);api.body.innerHTML=map;wjWire();
    askTime(api,'wjA',a+t,[...(km&&wm!==null&&wm!==t?[[a+wm,`${t/60} h is not ${tdur(wm)}. An hour has 60 minutes, so ${t/60} h = ${tdur(t)}.`]]:[]),[a-t,'The arrival is <b>after</b> it leaves. Count on, not back.']],`It reaches ${B} at ${ttm(a+t)}.`,
      ['Time = distance ÷ speed',km?`${d} ÷ ${s} = ${hstr(t)} = ${tdur(t)}`:`${d} ÷ ${s} = ${t} min = ${tdur(t)}`,hops(a,a+t)]);return}
  if(type==='jam'){const C=[];WJ.filter(x=>['tram','tuk','bus'].includes(x.m)).forEach(T=>{const S=WMAPS[T.map].stops;S.forEach((p,i)=>S.forEach((q,j)=>{if(i===j)return;const d=Math.abs(q[1]-p[1]);T.v.forEach(s=>{if((d*60)%s)return;const t=d*60/s;if(t<8||t>90)return;
      [5,10,15,20,25,30].forEach(J=>{if((d*60)%(t+J)===0)C.push({T,g:{i,j,d,s,t},J,Tm:t+J,A:d*60/(t+J)})})})}))});
    const{T,g,J,Tm,A}=pick(C),S=WMAPS[T.map].stops,{i,j,d,s,t}=g;
    api.q(`<p class="qt">In <b>${T.c}</b>, ${kid} takes a <b>${T.name}</b> (${T.ex}) from <b>${S[i][0]}</b> to <b>${S[j][0]}</b>. Read the distance on the map. On the way it is stuck in a traffic jam for <b>${J} min</b>. The whole trip takes <b>${tdur(Tm)}</b>, including the jam. What is the <b>average speed</b> for the whole trip?</p>`);
    api.body.innerHTML=wjMap(T,{from:i,to:j,lab:`${d} km`,jam:true,head:`${T.c} · ${T.name}`,note:'Distances along the route are rounded.'});wjWire();
    askOne(api,{id:'wjJ',unit:'km/h',w:5,right:A,traps:[[s,`${s} km/h is the speed while it was moving. Average speed for the <b>whole trip</b> uses the whole time, including the ${J} min jam.`],[d/Tm,`You divided by ${Tm} minutes. Change ${tdur(Tm)} into hours first: ${hstr(Tm)}.`]].filter(([x])=>!near(x,A)),
      ok:`Average speed = ${A} km/h.`,bad:`The average speed is ${A} km/h.`,work:['Average speed = total distance ÷ total time (stops count too!)',`Distance from the map: ${d} km`,`Total time = ${tdur(Tm)} = ${hstr(Tm)}`,`${d} km ÷ ${hstr(Tm)} = <b>${A} km/h</b>`]});return}
  if(type==='avg'){const X={jp:['Kyoto temples',214,120,5],kr:['Haeundae Beach',590,250,3],my:['Penang Bridge',90,70,4]};let T,i,j,d1,s1,t1,s2,t2,D,TT,av;
    const C=[];WJ.filter(x=>X[x.map]).forEach(T=>{const S=WMAPS[T.map].stops;S.forEach((p,i)=>S.forEach((q,j)=>{if(i===j||j!==X[T.map][3])return;const d1=Math.abs(q[1]-p[1]);T.v.forEach(s1=>{if((d1*60)%s1)return;const t1=d1*60/s1;if(t1%5)return;
      [30,40,50,60].forEach(s2=>[30,60,90,120].forEach(t2=>{if((s2*t2)%60)return;const D=d1+s2*t2/60,TT=t1+t2;if((D*60)%TT)return;const av=D*60/TT;if(av===(s1+s2)/2)return;C.push({T,i,j,d1,s1,t1,s2,t2,D,TT,av})}))})}))});
    ({T,i,j,d1,s1,t1,s2,t2,D,TT,av}=pick(C));
    const S=WMAPS[T.map].stops,x=X[T.map],d2=s2*t2/60;
    api.q(`<p class="qt">${kid}’s family is on holiday in <b>${T.c}</b>. They ride the <b>${T.name}</b> (${T.ex}) from <b>${S[i][0]}</b> to <b>${S[j][0]}</b> in <b>${tdur(t1)}</b>. Read that distance on the map. Then a bus takes them to <b>${x[0]}</b>: <b>${tdur(t2)}</b> at <b>${s2} km/h</b>. What is their <b>average speed</b> for the whole journey?</p>`);
    api.body.innerHTML=wjMap(T,{from:i,to:j,lab:`${d1} km`,extra:{x:x[1],y:x[2],label:'bus'},head:`${T.c} · ${T.name}, then a bus`,note:'Distances along the route are rounded.'});wjWire();
    askOne(api,{id:'wjV',unit:'km/h',w:5,right:av,traps:[[(s1+s2)/2,'You found the average of the two speeds. But they spent different amounts of time at each speed. Use <b>total distance ÷ total time</b>.'],[D,`${D} km is the total distance. Now divide by the total time.`]].filter(([y])=>!near(y,av)),
      ok:`Average speed = ${av} km/h.`,bad:`The average speed is ${av} km/h.`,work:[`${T.name}: ${d1} km (from the map) in ${tdur(t1)}`,`Bus: ${s2} km/h × ${hstr(t2)} = ${d2} km`,`Total: ${d1} + ${d2} = ${D} km in ${tdur(TT)} = ${hstr(TT)}`,`Average speed = ${D} ÷ ${hstr(TT)} = <b>${av} km/h</b>`]});return}
  if(type==='race'){const opts=[{T:WJ.find(x=>x.map==='nl'),mul:1,v:[200,240,250,300],how:'cycles',ex:p=>`needs <b>${p} min</b> to unlock and park the bike`},{T:WJ.find(x=>x.map==='hk'),mul:1000,v:[150,200],how:'takes the Ding Ding tram',ex:p=>`waits <b>${p} min</b> for the tram`}];
    const C=[];opts.forEach(o=>{const S=WMAPS[o.T.map].stops;S.forEach((p,i)=>S.forEach((q,j)=>{if(i===j)return;const D=Math.abs(q[1]-p[1])*o.mul;if(D<900||D>4000)return;[60,75,80].forEach(sw=>o.v.forEach(sb=>{if(D%sw||D%sb)return;for(let P=3;P<=8;P++){const tw=D/sw,tb=D/sb+P;if(tw!==tb&&Math.abs(tw-tb)<=30)C.push({o,i,j,D,sw,sb,P,tw,tb})}}))}))});
    const{o,i,j,D,sw,sb,P,tw,tb}=pick(C);
    const S=WMAPS[o.T.map].stops,[k2]=pick(SGKIDS.filter(k=>k[0]!==kid)),diff=Math.abs(tw-tb),first=tw<tb?kid:k2,dl=o.mul===1000?`${D/1000} km`:`${D} m`;
    api.q(`<p class="qt">In <b>${o.T.c}</b>, ${kid} and ${k2} race from <b>${S[i][0]}</b> to <b>${S[j][0]}</b>. Read the distance on the map${o.mul===1000?' (1 km = 1000 m)':''}. ${kid} walks at <b>${sw} m/min</b>. ${k2} ${o.how} at <b>${sb} m/min</b>, but first ${o.ex(P)}. Who gets there first, and <b>how many minutes earlier</b>?</p>`);
    api.body.innerHTML=wjMap(o.T,{from:i,to:j,lab:dl,head:`${o.T.c} · race`,note:'Distances along the route are rounded.'});wjWire();
    askOne(api,{id:'wjR',unit:'min',w:4,right:diff,traps:[[Math.abs(tw-D/sb),`Don't forget the ${P} min that ${k2} spends before moving!`],[tw,`${tw} min is how long ${kid} takes. Work out ${k2}'s time too, then find the difference.`],[tb,`${tb} min is how long ${k2} takes. Work out ${kid}'s time too, then find the difference.`]].filter(([x])=>!near(x,diff)),
      ok:`${first} gets there first, ${diff} min earlier.`,bad:`${first} gets there ${diff} min earlier.`,work:[`Distance: ${dl}${o.mul===1000?` = ${D} m`:''}`,`${kid}: ${D} ÷ ${sw} = ${tw} min`,`${k2}: ${P} + ${D} ÷ ${sb} = ${P} + ${D/sb} = ${tb} min`,`${first} is first, by ${Math.max(tw,tb)} − ${Math.min(tw,tb)} = <b>${diff} min</b>`]});return}
  /* catch: walk from the hotel to a station on the map */
  const T=pick(WJ.filter(x=>['jp','kr','uk','it','ch','my'].includes(x.map))),S=WMAPS[T.map].stops,si=R(0,S.length-1),st=S[si],s=pick([60,70,75,80]),t=R(6,20),D=s*t,B=R(3,8),Tt=R(7,18)*60+pick([5,10,20,25,35,40,50,55]),ans=Tt-t-B;
  const hx=Math.max(40,Math.min(620,st[2]+(st[2]>330?-90:90))),hy=Math.max(40,Math.min(290,st[3]+(st[3]>160?-50:50)));
  api.q(`<p class="qt">${kid} is on holiday in <b>${T.c}</b>. ${Pr} must catch a train that leaves <b>${st[0]}</b> at <b>${ttm(Tt)}</b>. The station is <b>${D} m</b> from the hotel, and ${pr} walks at <b>${s} m/min</b>. At the station, ${pr} needs <b>${B} min</b> to buy a ticket. What is the <b>latest</b> time ${pr} can leave the hotel?</p>`);
  api.body.innerHTML=wjMap(T,{walk:{x1:hx,y1:hy,x2:st[2],y2:st[3]},pins:[[hx,hy,'Hotel']],head:`${T.c} · catch the train at ${st[0]}`,noSprite:true});
  askTime(api,'wjC',ans,[[Tt+t+B,`That is after the train leaves! Count <b>back</b> from ${ttm(Tt)}.`],[Tt-t,`You forgot the ${B} min to buy a ticket.`],[Tt-B,`You forgot the walk: ${D} ÷ ${s} = ${t} min.`]],`${Pr} must leave by ${ttm(ans)}.`,
    [`Walking time = ${D} ÷ ${s} = ${t} min`,`Walk + ticket = ${t} + ${B} = ${t+B} min`,`${ttm(Tt)} − ${t+B} min = <b>${ttm(ans)}</b>`]);
 },
 /* secret bonus (score 80% or more): time zones */
 bonus(api){const TZ=[['Tokyo','Japan',1,[390,420]],['Seoul','South Korea',1,[380,410]],['Bangkok','Thailand',-1,[140,160]],['Dubai','the United Arab Emirates',-4,[440,470]],['London','the United Kingdom',-8,[830,860]],['Sydney','Australia',3,[460,490]]];
  let Z,a,f,loc;do{Z=pick(TZ);a=R(7,15)*60+pick([0,10,15,20,30,40,45,50]);f=R(Z[3][0]/5,Z[3][1]/5)*5;loc=a+f+Z[2]*60}while(loc>=1440||loc<0);
  const z=Math.abs(Z[2]),dir=Z[2]>0?'ahead of':'behind';
  api.q(`<p class="qt">🎁 <b>Secret bonus: time zones!</b> Different countries set their clocks to different times. In November, the clocks in <b>${Z[0]}</b> (${Z[1]}) are <b>${z} h ${dir}</b> Singapore's. So when it is 12 00 in Singapore, it is <b>${ttm(720+Z[2]*60)}</b> in ${Z[0]}.</p>
    <p class="qt">A plane leaves Singapore at <b>${ttm(a)}</b> (Singapore time). The flight takes <b>${tdur(f)}</b>. What time is it <b>in ${Z[0]}</b> when the plane lands?</p>`);
  api.body.innerHTML=board([['Leaves Singapore (Singapore time)',ttm(a)],['Flight',tdur(f)],['Lands (Singapore time)','??  ??'],[`Lands (${Z[0]} time)`,'??  ??']],'Flight board','✈️');
  askTime(api,'wjZ',loc,[[a+f,`${ttm(a+f)} is the time in <b>Singapore</b> when the plane lands. ${Z[0]}'s clocks are ${z} h ${dir} Singapore's, so ${Z[2]>0?'add':'take away'} ${z} h.`],[a+f-Z[2]*60,`Check the direction: ${Z[0]} is ${z} h <b>${dir}</b> Singapore, so ${Z[2]>0?'add':'take away'} ${z} h.`]],
    `It is ${ttm(loc)} in ${Z[0]}.`,[`Landing time in Singapore time: ${ttm(a)} + ${tdur(f)} = ${ttm(a+f)}`,`${Z[0]} is ${z} h ${dir} Singapore: ${ttm(a+f)} ${Z[2]>0?'+':'−'} ${z} h = <b>${ttm(loc)}</b>`])}});
/* ================= SECONDARY 1 · NUMBER GAMES =================
   One game per topic. Every level plays all 8 question types; the level changes how hard the numbers are:
   Core (easy) → Stretch (mixed) → Challenge (hard). */
const TIER=()=>({easy:0,mixed:1,hard:2}[ctx.level]??1);
const mns=n=>n<0?'−'+String(Math.abs(n)):String(n),br=n=>n<0?`(${mns(n)})`:String(n);
const isPrime=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true};
const PF=n=>{const f={};for(let p=2;n>1;p++)while(n%p===0){f[p]=(f[p]||0)+1;n/=p}return f};
const sup=e=>e===1?'':`<sup>${e}</sup>`,pfs=f=>Object.keys(f).sort((a,b)=>a-b).map(p=>`${p}${sup(f[p])}`).join(' × ');
const fromF=f=>Object.entries(f).reduce((a,[p,e])=>a*Math.pow(+p,e),1),lcm2=(a,b)=>a/gcdN(a,b)*b;
const divSteps=n=>{const s=[String(n)];for(let p=2;n>1;p++)while(n%p===0){n/=p;s.push(`÷ ${p} = ${n}`)}return s.join(' ')};
/* multiple choice with a reason for every wrong option. opts: [{t, ok, why}] */
function secChoice(api,id,opts,work,okMsg){const seen=new Set();opts=opts.filter(o=>!seen.has(o.t)&&seen.add(o.t));
  api.body.insertAdjacentHTML('beforeend',`<div class="choices" id="${id}" style="grid-template-columns:${opts.some(o=>o.t.replace(/<[^>]+>/g,'').length>16)?'1fr':'repeat(2,minmax(0,1fr))'}"></div>`);
  shuffle(opts).forEach(o=>{const b=document.createElement('button');b.className='btn';b.style.fontSize='1.1rem';b.innerHTML=o.t;
    b.onclick=()=>{if(api.answered)return;[...$(id).children].forEach(x=>x.disabled=true);b.classList.add(o.ok?'ok':'no');api.done(!!o.ok,o.ok?okMsg:(o.why||'Not quite.'),work)};$(id).appendChild(b)})}
/* a number answer that may be negative: text keyboard plus a ± button for phones */
function askInt(api,o){const t=o.traps||[];
  const r=askBox(api,{id:o.id,html:(o.pre||'')+inBox(o.id,'x','Answer',o.w||5,'text')+`<button class="btn" type="button" id="${o.id}Pm" title="Switch between + and −" aria-label="Switch sign">±</button>`+(o.unit?`<span class="askunit">${o.unit}</span>`:''),
    judge:v=>{if(near(v.x,o.right))return true;const m=t.find(([x])=>near(v.x,x));return m?m[1]:false},
    onRight:(v,u)=>api.done(true,o.ok,o.work||[],ptsUsed(u)),onWrong:msg=>api.done(false,(msg?msg+' ':'')+(o.bad||''),o.work||[])});
  const i=api.body.querySelector(`[data-ask="${o.id}"]`),pm=$(o.id+'Pm');if(pm&&i)pm.onclick=()=>{const s=i.value.trim();i.value=/^[-−]/.test(s)?s.slice(1):'−'+s;i.focus()};return r}
/* number line with an optional hop from a to b */
function nLine(lo,hi,a,b){const nar=innerWidth<600,W=nar?400:660,H=110,x0=26,x1=W-26,y=64,sx=v=>x0+(v-lo)/(hi-lo)*(x1-x0),span=hi-lo,step=nar?(span>40?10:span>16?5:span>8?2:1):(span>24?5:span>12?2:1);let s=`<rect width="${W}" height="${H}" fill="#eef6ff"/><line x1="${x0-14}" y1="${y}" x2="${x1+14}" y2="${y}" stroke="#2c3446" stroke-width="3"/>`;
  for(let v=Math.ceil(lo/step)*step;v<=hi;v+=step)s+=`<line x1="${sx(v)}" y1="${y-6}" x2="${sx(v)}" y2="${y+6}" stroke="#2c3446" stroke-width="${v===0?3:1.5}"/><text x="${sx(v)}" y="${y+26}" text-anchor="middle" font-size="14" font-weight="${v===0?900:700}" fill="${v<0?'#c2410c':'#16233a'}">${mns(v)}</text>`;
  if(a!=null){s+=`<circle cx="${sx(a)}" cy="${y}" r="7" fill="#5f50ec" stroke="#16233a" stroke-width="2"/><text x="${sx(a)}" y="${y-14}" text-anchor="middle" font-size="13" font-weight="800" fill="#5f50ec">start</text>`;
    if(b!=null&&b!==a){const m=(sx(a)+sx(b))/2;s+=`<path d="M${sx(a)} ${y-8} Q${m} ${y-52} ${sx(b)} ${y-8}" fill="none" stroke="#ef5240" stroke-width="3" stroke-dasharray="6 5"/><text x="${m}" y="${y-36}" text-anchor="middle" font-size="14" font-weight="800" fill="#ef5240">${b>a?'→ right':'← left'}</text><text x="${sx(b)}" y="${y-14}" text-anchor="middle" font-size="16" font-weight="900" fill="#c2410c">?</text>`}}
  return `<div class="jmwrap" style="max-width:720px;border:3px solid #2c3446;border-radius:14px;overflow:hidden"><svg class="tmap-nozoom" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" aria-hidden="true">${s}</svg></div>`}

/* ---------- Sec 1 · Prime Factory: primes, prime factorisation, HCF and LCM, roots ---------- */
function pfGen(T){const lim=[[20,150],[100,600],[400,3000]][T],P=T===2?[2,3,5,7,11]:[2,3,5,7];for(let k=0;k<500;k++){const f={};shuffle(P).slice(0,R(2,3)).forEach(p=>f[p]=R(1,p===2?(T?4:3):p===3?(T?3:2):1+(T===2&&p===5?1:0)));const n=fromF(f);if(n>=lim[0]&&n<=lim[1]&&Object.values(f).some(e=>e>1))return f}return {2:2,3:1,5:1}}
function hlGen(T,three){for(let k=0;k<500;k++){const g=T===0?pick([2,3,4,5,6,8,10,12]):T===1?pick([6,8,9,10,12,14,15,18]):pick([12,15,18,20,24,28,30,36]),xs=shuffle([1,2,3,4,5,7,9]).slice(0,three?3:2);
  if(xs.includes(1)&&T)continue;let ok=true;for(let i=0;i<xs.length;i++)for(let j=i+1;j<xs.length;j++)if(gcdN(xs[i],xs[j])>1)ok=false;if(!ok)continue;const ns=xs.map(x=>g*x).sort((a,b)=>a-b),l=ns.reduce(lcm2);if(ns[ns.length-1]>[72,180,300][T]||l>[200,900,2400][T]||l===ns[ns.length-1])continue;return{ns,g,l}}return{ns:[12,18],g:6,l:36}}
/* ---------- Sec 1 · Below Zero: negative numbers and the four operations ---------- */
addGame('s1-integers',{level:'Sec 1',sec:'s1',strand:'num',glyph:'−5',title:'Below Zero',topic:'Negative numbers: ordering and the four operations',
 how:'Order negative numbers, then add, subtract, multiply and divide them. Use the number line to see what is happening.',rounds:8,
 round(api,r){const T=TIER(),M=[9,15,30][T],type=['order','temp','add','sub','muldiv','ops','story','missing'][r],pos=()=>R(2,M),sg=n=>n<0?'negative':'positive';
  if(type==='order'){let v;do{v=shuffle([-R(1,M),-R(1,M),R(0,M),R(-M,M)].map(x=>T===2&&Math.random()<.4?x+.5:x))}while(new Set(v).size<4||new Set(v.map(Math.abs)).size<4);
    const asc=[...v].sort((a,b)=>a-b),show=a=>a.map(mns).join(', '),abs=[...v].sort((a,b)=>Math.abs(a)-Math.abs(b)),neg=asc.filter(x=>x<0).reverse().concat(asc.filter(x=>x>=0));
    api.q(`<p class="qt">Which list is in order from <b>smallest to largest</b>?</p>`);api.body.innerHTML=nLine(-M-1,M+1);
    secChoice(api,'bzO',[{t:show(asc),ok:1},{t:show(abs),why:'You ordered them as if the signs were not there. On the number line, the number furthest <b>left</b> is the smallest.'},{t:show([...asc].reverse()),why:'That is largest to smallest.'},{t:show(neg),why:`Look at the negatives: ${mns(asc[0])} is further left than ${mns(asc[1])}, so ${mns(asc[0])} is smaller.`}],
      ['On the number line, numbers get bigger from left to right.',`Smallest to largest: <b>${show(asc)}</b>`],'Correct order.');return}
  if(type==='temp'){const C=shuffle(['Harbin','Sapporo','Seoul','Helsinki','Moscow','Oslo','Ulaanbaatar','Montreal']),h=T===2?.5:0,t1=-R(2,M)-h*R(0,1),t2=T===0?R(1,9):pick([R(1,9),-R(1,Math.max(1,Math.floor(-t1)-1))])+(T===2?h*R(0,1):0),d=t2-t1;
    api.q(`<p class="qt">One winter night it is <b>${mns(t1)}°C</b> in ${C[0]} and <b>${mns(t2)}°C</b> in ${C[1]}. How many degrees <b>warmer</b> is ${C[1]} than ${C[0]}?</p>`);api.body.innerHTML=nLine(-M-2,10,t1,t2);
    askOne(api,{id:'bzT',unit:'°C',w:5,right:d,traps:[[Math.abs(Math.abs(t2)-Math.abs(t1)),t2>0?`The two temperatures are on opposite sides of 0. Count from ${mns(t1)} up to 0, then on to ${t2}.`:'Count the steps between them on the number line.'],[Math.abs(t1)+Math.abs(t2),'Both are below zero, so do not add them. Count the steps from one to the other.']].filter(([x])=>!near(x,d)),
      hint:'Count the steps from the colder temperature to the warmer one.',ok:`${C[1]} is ${d}°C warmer.`,bad:`The difference is ${d}°C.`,work:[`Difference = warmer − colder = ${mns(t2)} − (${mns(t1)})`,`= ${mns(t2)} + ${-t1} = <b>${d}°C</b>`]});return}
  if(type==='add'){const a=pos(),b=pos(),[x,y]=pick([[-a,b],[a,-b],[-a,-b]]),ans=x+y;
    api.q(`<p class="qt">Work out <b>${br(x)} + ${br(y)}</b>.</p>`);api.body.innerHTML=nLine(Math.min(x,ans,0)-2,Math.max(x,ans,0)+2,x,T?null:ans);
    askInt(api,{id:'bzA',right:ans,traps:[[-ans,x<0&&y<0?'Both numbers are negative, so the answer is negative too.':`The signs are different. Find the difference between ${a} and ${b}, then take the sign of the one further from 0.`],[x<0&&y<0?Math.abs(a-b):a+b,x<0&&y<0?'Adding two negatives moves further left: add the sizes and keep the minus sign.':'The signs are different, so the sizes do not add. Start at the first number and move.'],[-(a+b),'The signs are different, so the sizes do not add.']].filter(([v])=>!near(v,ans)),
      hint:`Start at ${mns(x)} on the number line. Adding a ${sg(y)} number moves ${y<0?'left':'right'}.`,ok:`${br(x)} + ${br(y)} = ${mns(ans)}.`,bad:`${br(x)} + ${br(y)} = ${mns(ans)}.`,work:[`Start at ${mns(x)}. Adding ${mns(y)} moves ${Math.abs(y)} to the ${y<0?'left':'right'}.`,`${br(x)} + ${br(y)} = <b>${mns(ans)}</b>`]});return}
  if(type==='sub'){const a=pos(),b=pos()+(T?0:0),[x,y]=pick(T===0?[[a,a+b],[-a,b]]:[[a,-b],[-a,b],[-a,-b],[a,a+b]]),ans=x-y;
    api.q(`<p class="qt">Work out <b>${br(x)} − ${br(y)}</b>.</p>`);api.body.innerHTML=nLine(Math.min(x,ans,0)-2,Math.max(x,ans,0)+2,x,T?null:ans);
    askInt(api,{id:'bzS',right:ans,traps:[[x+y,y<0?`Subtracting a negative is the same as <b>adding</b>: ${br(x)} − ${br(y)} = ${mns(x)} + ${-y}.`:`Subtracting ${y} moves ${y} to the <b>left</b> from ${mns(x)}.`],[-ans,'Check the sign. Use the number line: where do you start, and which way do you move?'],[Math.abs(x)-Math.abs(y),'Watch the signs: start at the first number, then decide which way to move.']].filter(([v])=>!near(v,ans)),
      hint:y<0?'Subtracting a negative number is the same as adding its positive.':`Start at ${mns(x)} and move ${y} to the left.`,ok:`${br(x)} − ${br(y)} = ${mns(ans)}.`,bad:`${br(x)} − ${br(y)} = ${mns(ans)}.`,
      work:[y<0?`Subtracting a negative = adding: ${br(x)} − ${br(y)} = ${mns(x)} + ${-y}`:`Start at ${mns(x)} and move ${y} to the left.`,`= <b>${mns(ans)}</b>`]});return}
  if(type==='muldiv'){const a=R(2,[6,9,12][T]),b=R(2,[6,9,12][T]),[sx,sy]=pick([[-1,-1],[-1,1],[1,-1]]),div=Math.random()<.5,x=div?sx*a*b:sx*a,y=sy*b,ans=div?x/y:x*y,op=div?'÷':'×';
    api.q(`<p class="qt">Work out <b>${br(x)} ${op} ${br(y)}</b>.</p>`);
    askInt(api,{id:'bzM',right:ans,traps:[[-ans,sx===sy?'Both numbers are negative. Same signs give a <b>positive</b> answer.':'One number is negative and one is positive. Different signs give a <b>negative</b> answer.']],
      hint:'Same signs give a positive answer. Different signs give a negative answer.',ok:`${br(x)} ${op} ${br(y)} = ${mns(ans)}.`,bad:`${br(x)} ${op} ${br(y)} = ${mns(ans)}.`,work:[`Sizes: ${Math.abs(x)} ${op} ${Math.abs(y)} = ${Math.abs(ans)}`,`Signs: ${sx===sy?'same → positive':'different → negative'}`,`Answer: <b>${mns(ans)}</b>`]});return}
  if(type==='ops'){const a=R(2,9),b=R(2,[5,7,9][T]),c=R(2,[5,7,9][T]);let ex,ans,trap,why,work;
    const k=T===2?pick(['sq','sq2','mix']):T===1?pick(['mix','mix2']):'mix';
    if(k==='mix'){ex=`${mns(-a)} + ${b} × ${br(-c)}`;ans=-a-b*c;trap=(-a+b)*-c;why='Multiply before you add.';work=[`${b} × ${br(-c)} = ${mns(-b*c)}`,`${mns(-a)} + ${br(-b*c)} = <b>${mns(ans)}</b>`]}
    else if(k==='mix2'){ex=`${a} − ${br(-b)} × ${c}`;ans=a+b*c;trap=(a+b)*c;why='Multiply before you subtract.';work=[`${br(-b)} × ${c} = ${mns(-b*c)}`,`${a} − ${br(-b*c)} = ${a} + ${b*c} = <b>${ans}</b>`]}
    else if(k==='sq'){ex=`−${a}² + ${b*c}`;ans=-a*a+b*c;trap=a*a+b*c;why=`−${a}² means −(${a}²) = ${mns(-a*a)}. Only (−${a})² equals ${a*a}.`;work=[`−${a}² = −(${a} × ${a}) = ${mns(-a*a)}`,`${mns(-a*a)} + ${b*c} = <b>${mns(ans)}</b>`]}
    else{ex=`(−${a})² − ${b} × ${br(-c)}`;ans=a*a+b*c;trap=a*a-b*c;why=`${b} × ${br(-c)} = ${mns(-b*c)}, and subtracting a negative is adding.`;work=[`(−${a})² = ${a*a}`,`${b} × ${br(-c)} = ${mns(-b*c)}`,`${a*a} − ${br(-b*c)} = ${a*a} + ${b*c} = <b>${ans}</b>`]}
    api.q(`<p class="qt">Work out <b>${ex}</b>.</p>`);askInt(api,{id:'bzP',right:ans,traps:[[trap,why],[-ans,'Check your signs at each step.']].filter(([v])=>!near(v,ans)),hint:'Order of operations: brackets, then powers, then × and ÷, then + and −.',ok:`${ex} = ${mns(ans)}.`,bad:`${ex} = ${mns(ans)}.`,work});return}
  if(type==='story'){const[kid,pr]=pick(SGKIDS);
    if(T===0){const t=-R(2,9),u=R(3,14),ans=t+u;api.q(`<p class="qt">In Seoul it was <b>${mns(t)}°C</b> at dawn. By noon the temperature had <b>risen by ${u}°C</b>. What was the temperature at noon?</p>`);api.body.innerHTML=nLine(Math.min(t,0)-2,Math.max(ans,0)+2,t,ans);
      askInt(api,{id:'bzY',unit:'°C',right:ans,traps:[[t-u,'The temperature <b>rose</b>, so move to the right on the number line.'],[-ans,'Check the sign: did it pass 0?']].filter(([v])=>!near(v,ans)),hint:`Start at ${mns(t)} and move ${u} to the right.`,ok:`It was ${mns(ans)}°C.`,bad:`It was ${mns(ans)}°C.`,work:[`${mns(t)} + ${u} = <b>${mns(ans)}</b>°C`]});return}
    if(T===1){const d=R(8,30),u=R(3,d-2),s=R(4,20),ans=-d+u-s;api.q(`<p class="qt">A diver is <b>${d} m below</b> sea level, which we write as <b>${mns(-d)} m</b>. The diver rises <b>${u} m</b>, then sinks <b>${s} m</b>. What is the diver's position now?</p>`);
      askInt(api,{id:'bzY',unit:'m',right:ans,traps:[[-d-u+s,'Rising moves <b>up</b> (add). Sinking moves <b>down</b> (subtract).'],[-ans,'The diver is still below sea level, so the answer is negative.'],[-d+u+s,'Sinking moves down, so subtract.']].filter(([v])=>!near(v,ans)),hint:'Rising adds. Sinking subtracts.',ok:`The diver is at ${mns(ans)} m.`,bad:`The diver is at ${mns(ans)} m.`,work:[`${mns(-d)} + ${u} − ${s}`,`= ${mns(-d+u)} − ${s} = <b>${mns(ans)}</b> m`]});return}
    const t=R(2,8),f=R(2,5),h=R(3,7),ans=t-f*h;api.q(`<p class="qt">At 6 p.m. the temperature in Harbin is <b>${t}°C</b>. It then <b>falls by ${f}°C every hour</b>. What is the temperature <b>${h} hours</b> later?</p>`);
    askInt(api,{id:'bzY',unit:'°C',right:ans,traps:[[t-f,`It falls ${f}°C <b>every hour</b>, for ${h} hours.`],[t+f*h,'The temperature is falling, so subtract.'],[-ans,'Check the sign: it has fallen below 0.']].filter(([v])=>!near(v,ans)),hint:`Total fall = ${f} × ${h}.`,ok:`It is ${mns(ans)}°C.`,bad:`It is ${mns(ans)}°C.`,work:[`Total fall = ${f} × ${h} = ${f*h}°C`,`${t} − ${f*h} = <b>${mns(ans)}</b>°C`]});return}
  /* missing number */
  {const a=pos(),b=pos();let ex,ans,work;const k=T===0?'add':T===1?pick(['add','sub']):pick(['mul','div','sub']);
   if(k==='add'){ans=pick([a+b,-(a+b),b-a].filter(v=>v!==0));const c=-a+ans;ex=`${mns(-a)} + ▢ = ${mns(c)}`;work=[`▢ = ${mns(c)} − ${br(-a)} = ${mns(c)} + ${a}`,`= <b>${mns(ans)}</b>`]}
   else if(k==='sub'){ans=pick([-a,a-b-R(1,5)].filter(v=>v!==0));const c=ans-b;ex=`▢ − ${b} = ${mns(c)}`;work=[`▢ = ${mns(c)} + ${b}`,`= <b>${mns(ans)}</b>`]}
   else if(k==='mul'){const m=R(2,9);ans=pick([-1,1])*R(2,9);const c=ans*-m;ex=`▢ × ${br(-m)} = ${mns(c)}`;work=[`▢ = ${mns(c)} ÷ ${br(-m)}`,`= <b>${mns(ans)}</b>`]}
   else{const m=R(2,9);ans=pick([-1,1])*R(2,9);const n=-m*Math.abs(ans)*1;ex=`${br(n)} ÷ ▢ = ${mns(n/ans)}`;work=[`▢ = ${br(n)} ÷ ${br(n/ans)}`,`= <b>${mns(ans)}</b>`]}
   api.q(`<p class="qt">Find the missing number: <b>${ex}</b></p>`);askInt(api,{id:'bzX',pre:'<span class="askunit">▢ =</span>',right:ans,traps:[[-ans,'Check the sign. Put your answer back into the box and work it out.']],hint:'Work backwards using the opposite operation, then check by putting your answer in the box.',ok:`▢ = ${mns(ans)}.`,bad:`▢ = ${mns(ans)}.`,work})}}});

/* ---------- Sec 1 · Close Enough?: decimal places, significant figures and estimation ---------- */
const sfCount=s=>{const d=s.replace('.','').replace(/^0+/,'');return d.length};
const fm=v=>v.toLocaleString('en-SG',{maximumFractionDigits:6}),est1=x=>Number(x.toPrecision(1)),tidy=v=>Math.round(v*1e6)/1e6,nearby=(v)=>{for(let k=0;k<50;k++){const x=Number((v*(1+pick([-1,1])*R(8,40)/1000)).toPrecision(3));if(near(est1(x),v)&&x!==v)return x}return v};
function estNums(T){const m=()=>R(2,9),a1=tidy(m()*pick(T===0?[10]:[10,100,.1])),b1=tidy(m()*pick(T===2?[1,10,.1]:[1,10])),c1=tidy(pick([2,5])*pick([1,.1,10]));return{a:nearby(a1),b:nearby(b1),c:nearby(c1),a1,b1,c1}}
addGame('s1-estimate',{level:'Sec 1',sec:'s1',strand:'num',glyph:'≈',title:'Close Enough?',topic:'Decimal places, significant figures and estimation',
 how:'Round to decimal places and significant figures, then use rounding to estimate answers and spot calculator mistakes.',rounds:8,
 round(api,r){const T=TIER(),type=['dp','count','sf','zero','estimate','sense','story','bound'][r];
  if(type==='dp'){const k=[2,4,4][T],d=[1,2,pick([1,3])][T],n=R(1,9)*Math.pow(10,k)+R(Math.pow(10,k-1),Math.pow(10,k)-1),drop=Math.pow(10,k-d),up=Math.round(n/drop),down=Math.floor(n/drop),xs=(n/Math.pow(10,k)).toFixed(k),ans=up/Math.pow(10,d);
    api.q(`<p class="qt">Round <b>${xs}</b> to <b>${d} decimal place${d>1?'s':''}</b>.</p>`);
    askOne(api,{id:'ceD',w:7,right:ans,traps:[...(up!==down?[[down/Math.pow(10,d),`You cut the extra digits off. Look at the next digit: it is 5 or more, so round <b>up</b>.`]]:[[ (down+1)/Math.pow(10,d),'Look at the next digit: it is less than 5, so the digit stays the same.']]),[Number(Number(xs).toPrecision(d)),`That is ${d} significant figure${d>1?'s':''}. Count ${d} digit${d>1?'s':''} <b>after the decimal point</b>.`]].filter(([x])=>!near(x,ans)),
      hint:`Keep ${d} digit${d>1?'s':''} after the decimal point. The next digit decides: 5 or more rounds up.`,ok:`${xs} ≈ ${ans.toFixed(d)}.`,bad:`${xs} ≈ ${ans.toFixed(d)}.`,work:[`Keep ${d} digit${d>1?'s':''} after the point. The next digit is ${xs.split('.')[1][d]}.`,`${xs.split('.')[1][d]>=5?'5 or more → round up':'Less than 5 → stays the same'}: <b>${ans.toFixed(d)}</b>`]});return}
  if(type==='count'){const s=T===0?pick([`${R(1,9)}.${R(1,9)}${R(1,9)}`,`${R(1,9)}0${R(1,9)}`,`${R(1,9)}00${R(1,9)}`,`${R(1,9)}${R(1,9)}.0${R(1,9)}`]):T===1?pick([`0.0${R(1,9)}${R(1,9)}`,`0.00${R(1,9)}0${R(1,9)}`,`0.${R(1,9)}0${R(1,9)}`,`0.000${R(1,9)}${R(1,9)}`]):pick([`0.0${R(1,9)}${R(1,9)}0`,`0.00${R(1,9)}0${R(1,9)}0`,`${R(1,9)}.${R(1,9)}00`,`0.0${R(1,9)}00`]);
    const ans=sfCount(s),all=s.replace('.','').length,noTrail=sfCount(s.replace(/0+$/,'')),dec=(s.split('.')[1]||'').length;
    api.q(`<p class="qt">How many <b>significant figures</b> does <b>${s}</b> have?</p>`);
    askOne(api,{id:'ceC',w:4,right:ans,traps:[[all,'Zeros in <b>front</b> only show place value. They are not significant. Start counting from the first non-zero digit.'],[dec,'You counted the decimal places. Significant figures start at the first non-zero digit.'],[noTrail,'A zero at the <b>end</b>, after the decimal point, is significant: it shows how precise the number is.']].filter(([x],i,a)=>x!==ans&&a.findIndex(y=>y[0]===x)===i),
      hint:'Start at the first non-zero digit and count every digit from there.',ok:`${s} has ${ans} significant figures.`,bad:`${s} has ${ans} significant figures.`,work:['Start counting at the first non-zero digit.','Zeros in front do not count. Zeros between digits, and zeros at the end after the decimal point, do count.',`${s} has <b>${ans}</b> significant figures.`]});return}
  if(type==='sf'){let x,s,ans,xs;for(let q=0;q<200;q++){if(T===0){x=R(1200,98000);s=pick([1,2]);xs=fm(x)}else if(T===1){x=R(1001,9899)/1e6*pick([1,10]);s=2;xs=String(tidy(x))}else{x=R(10001,98999)/pick([1e3,1e4]);s=3;xs=String(x)}
      ans=Number(x.toPrecision(s));if(sfCount(String(ans).replace(/0+$/,'').replace(/\.$/,''))<=s&&(T===0||sfCount(String(ans))===s)&&ans!==x)break}
    api.q(`<p class="qt">Round <b>${xs}</b> to <b>${s} significant figure${s>1?'s':''}</b>.</p>`);
    const lead=Number(String(x.toPrecision(s)).replace('.','').replace(/^0+/,'').slice(0,s));
    askOne(api,{id:'ceS',w:8,right:ans,traps:[...(T===0?[[lead,`Keep the place value! ${xs} is about ${fm(ans)}, not ${lead}. Fill the other places with zeros.`]]:[]),[Number(x.toFixed(s)),`That is ${s} decimal places. Significant figures start at the first non-zero digit.`]].filter(([v])=>!near(v,ans)),
      hint:`Find the first non-zero digit, keep ${s} digit${s>1?'s':''} from there, and look at the next digit to round.`,ok:`${xs} ≈ ${T===0?fm(ans):ans}.`,bad:`${xs} ≈ ${T===0?fm(ans):ans}.`,work:[`Start at the first non-zero digit and keep ${s} digit${s>1?'s':''}.`,'Look at the next digit: 5 or more rounds up.',`${xs} ≈ <b>${T===0?fm(ans):ans}</b>`]});return}
  if(type==='zero'){const[xs,s,right,wr]=pick([[['4.97',2,'5.0',['5','4.9','5.00']],['6.98',2,'7.0',['7','6.9','7.00']],['39.6',2,'40',['4','39','40.0']]],[['2.996',3,'3.00',['3','2.99','3.0']],['0.0398',2,'0.040',['0.04','0.039','0.0400']],['19.96',3,'20.0',['20','19.9','20.00']]],[['0.03996',3,'0.0400',['0.04','0.0399','0.040']],['59.97',3,'60.0',['60','59.9','60.00']],['0.6997',3,'0.700',['0.7','0.699','0.70']]]][T]);
    api.q(`<p class="qt">Round <b>${xs}</b> to <b>${s} significant figures</b>. Which answer is written correctly?</p>`);
    secChoice(api,'ceZ',[{t:right,ok:1},...wr.map(w=>({t:w,why:Number(w)===Number(right)?`The value is right, but ${w} shows ${sfCount(w)} significant figure${sfCount(w)>1?'s':''}, not ${s}. Use zeros at the end to show ${s}.`:'Look at the digit after the ones you keep: it is 5 or more, so round up.'}))],
      [`Keep ${s} significant figures and round up.`,`Write <b>${right}</b>: the zero${right.replace(/[^0]/g,'').length>1?'s':''} at the end show${right.replace(/[^0]/g,'').length>1?'':'s'} the answer is correct to ${s} significant figures.`],`${xs} ≈ ${right} (${s} s.f.).`);return}
  if(type==='estimate'||type==='sense'){const{a,b,c,a1,b1,c1}=estNums(T),div=T===2,ex=div?`${a} × ${b} ÷ ${c}`:`${a} × ${b}`,ans=tidy(div?a1*b1/c1:a1*b1),wk=[`${a} ≈ ${a1}, ${b} ≈ ${b1}${div?`, ${c} ≈ ${c1}`:''}`,`${a1} × ${b1}${div?` ÷ ${c1}`:''} = <b>${fm(ans)}</b>`];
    if(type==='estimate'){api.q(`<p class="qt">Estimate <b>${ex}</b> by first rounding each number to <b>1 significant figure</b>.</p>`);
      askOne(api,{id:'ceE',w:8,right:ans,traps:[[tidy(ans*10),'Check the place value of each rounded number.'],[tidy(ans/10),'Check the place value of each rounded number.']],hint:'Round each number to 1 significant figure first, then calculate.',ok:`About ${fm(ans)}.`,bad:`The estimate is ${fm(ans)}.`,work:wk});return}
    const exact=tidy(div?a*b/c:a*b),slip=Number((exact*pick([10,.1])).toPrecision(4));
    api.q(`<p class="qt">Jun types <b>${ex}</b> into a calculator and gets <b>${fm(slip)}</b>. Use an estimate to decide: is Jun's answer reasonable?</p>`);
    secChoice(api,'ceN',[{t:`No. It should be about ${fm(ans)}.`,ok:1},{t:'Yes. It is close to the estimate.',why:`Estimate: ${wk[1].replace(/<\/?b>/g,'')}. Jun's answer is about ${slip>exact?'10 times too big':'10 times too small'}.`},{t:`No. It should be about ${fm(tidy(ans*(slip>exact?100:.01)))}.`,why:'Round each number to 1 significant figure and work it out again.'}],[...wk,`Jun's ${fm(slip)} is about ${slip>exact?'10 times too big':'10 times too small'}: a decimal point slipped.`],`It should be about ${fm(ans)}.`);return}
  if(type==='story'){let q,ans,wk,unit;
    if(T===0){const n=pick([198,203,296,304,395]),p=pick([4.85,5.2,2.95,3.1,6.9]),n1=est1(n),p1=est1(p);ans=n1*p1;unit='$';q=`<b>${n} students</b> each pay <b>$${p.toFixed(2)}</b> for a concert ticket. Estimate the total by rounding each number to 1 significant figure.`;wk=[`${n} ≈ ${n1}, $${p.toFixed(2)} ≈ $${p1}`,`${n1} × ${p1} = <b>$${fm(ans)}</b>`]}
    else if(T===1){const l=pick([19.6,20.4,38.6,41.2,49.5]),l1=est1(l),k1=pick([8,10,20]),d=nearby(l1*k1),d1=est1(d);ans=tidy(d1/l1);unit='km/l';q=`A car travels <b>${d} km</b> on <b>${l} litres</b> of petrol. Estimate how many km it travels on 1 litre, by rounding each number to 1 significant figure.`;wk=[`${d} ≈ ${d1}, ${l} ≈ ${l1}`,`${d1} ÷ ${l1} = <b>${ans}</b> km per litre`]}
    else{const L=pick([48.6,51.3,29.4,61.2]),W=pick([21.3,19.6,31.4]),p=pick([1.95,2.1,4.85,5.15]),L1=est1(L),W1=est1(W),p1=est1(p);ans=L1*W1*p1;unit='$';q=`A rectangular field is <b>${L} m</b> by <b>${W} m</b>. Grass seed costs <b>$${p.toFixed(2)} per m²</b>. Estimate the cost of seeding the whole field, by rounding each number to 1 significant figure.`;wk=[`Area ≈ ${L1} × ${W1} = ${fm(L1*W1)} m²`,`Cost ≈ ${fm(L1*W1)} × $${p1} = <b>$${fm(ans)}</b>`]}
    api.q(`<p class="qt">${q}</p>`);askOne(api,{id:'ceY',pre:unit==='$'?'<span class="askunit">$</span>':'',unit:unit==='$'?'':unit,w:8,right:ans,traps:[[tidy(ans*10),'Check the place value of each rounded number.'],[tidy(ans/10),'Check the place value of each rounded number.']],hint:'Round every number to 1 significant figure first.',ok:`About ${unit==='$'?'$':''}${fm(ans)}${unit==='$'?'':' '+unit}.`,bad:`The estimate is ${unit==='$'?'$':''}${fm(ans)}${unit==='$'?'':' '+unit}.`,work:wk});return}
  /* smallest or largest value that rounds to a given number */
  if(T<2){const u=T===0?10:100,N=R(12,97)*u,small=T===0||Math.random()<.5,ans=small?N-u/2:N+u/2-1;
    api.q(`<p class="qt">A whole number is rounded to the nearest <b>${u}</b>. The result is <b>${fm(N)}</b>. What is the <b>${small?'smallest':'largest'}</b> the whole number could be?</p>`);
    askOne(api,{id:'ceB',w:7,right:ans,traps:small?[[N-u/2+1,`${fm(N-u/2)} also rounds up to ${fm(N)}. A 5 rounds up.`],[N-u/2-1,`${fm(N-u/2-1)} rounds down to ${fm(N-u)}.`],[N-u,`${fm(N-u)} is a different multiple of ${u}.`]]:[[N+u/2,`${fm(N+u/2)} rounds up to ${fm(N+u)}.`],[N+u-1,`${fm(N+u-1)} rounds up to ${fm(N+u)}.`]],
      hint:`Halfway between ${fm(small?N-u:N)} and ${fm(small?N:N+u)} is ${fm(small?N-u/2:N+u/2)}. Which way does the halfway number round?`,ok:`The ${small?'smallest':'largest'} is ${fm(ans)}.`,bad:`The ${small?'smallest':'largest'} is ${fm(ans)}.`,work:[`Halfway to the ${small?'multiple below':'next multiple'} is ${fm(small?N-u/2:N+u/2)}, and halfway rounds <b>up</b>.`,small?`So ${fm(N-u/2)} is the smallest that rounds to ${fm(N)}.`:`So the largest whole number that still rounds to ${fm(N)} is <b>${fm(ans)}</b>.`]});return}
  const v=R(21,98)/10,ans=tidy(v-.05);api.q(`<p class="qt">A length is <b>${v.toFixed(1)} cm</b>, correct to <b>1 decimal place</b>. What is the <b>smallest</b> the actual length could be?</p>`);
  askOne(api,{id:'ceB',unit:'cm',w:7,right:ans,traps:[[tidy(v-.1),`${(v-.1).toFixed(1)} cm is a different 1-decimal-place value. Go only halfway down to it.`],[tidy(v-.04),`${(v-.05).toFixed(2)} also rounds up to ${v.toFixed(1)}.`],[tidy(v-.5),'It is correct to 1 decimal place, so go half of 0.1 below, not 0.5.']],
    hint:`Halfway between ${(v-.1).toFixed(1)} and ${v.toFixed(1)} is the smallest value that rounds up to ${v.toFixed(1)}.`,ok:`The smallest is ${ans.toFixed(2)} cm.`,bad:`The smallest is ${ans.toFixed(2)} cm.`,work:[`Halfway between ${(v-.1).toFixed(1)} and ${v.toFixed(1)} is ${ans.toFixed(2)}.`,`${ans.toFixed(2)} rounds up to ${v.toFixed(1)}, so the smallest is <b>${ans.toFixed(2)} cm</b>.`]})}});

/* ================= P4. Treasure Map — 8-point compass and turns ================= */
const DIRS=['N','NE','E','SE','S','SW','W','NW'],DNAME={N:'North',NE:'North-east',E:'East',SE:'South-east',S:'South',SW:'South-west',W:'West',NW:'North-west'};
const DV=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
const ROSE=[['NW','N','NE'],['W','','E'],['SW','S','SE']];
const LAND=[['🌴','palm tree'],['⛰️','mountain'],['🏝️','island'],['🦜','parrot'],['🛶','canoe'],['🐚','shell'],['🗿','statue'],['🛖','hut'],['🌋','volcano'],['🐊','crocodile']];
function mapSvg(N,items,o={}){const S=44,W=N*S;let s=`<rect x="0" y="0" width="${W}" height="${W}" rx="10" class="sea"/>`;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)s+=`<rect x="${x*S+2}" y="${y*S+2}" width="${S-4}" height="${S-4}" rx="6" class="mcell${o.tap?' tapc':''}" data-x="${x}" data-y="${y}"/>`;
  items.forEach(it=>{if(it.e==='🏴‍☠️')s+=`<circle cx="${it.x*S+S/2}" cy="${it.y*S+S/2}" r="19" fill="var(--sun)" fill-opacity=".35" stroke="var(--sun)" stroke-width="3" pointer-events="none"/>`;s+=`<text x="${it.x*S+S/2}" y="${it.y*S+S/2+9}" text-anchor="middle" font-size="26" pointer-events="none">${it.e}</text>`});
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
    api.q(`<p class="qt">The pirate 🏴‍☠️ faces <b>${DNAME[DIRS[f]]}</b>. She turns <b>${turnName(k)} ${cw?'clockwise':'anticlockwise'}</b>. Which way does she face now?</p>`);
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
    api.q(`<p class="qt">The pirate 🏴‍☠️ faces <b>${DNAME[DIRS[f]]}</b> and turns <b>${cw?'clockwise':'anticlockwise'}</b> until she faces <b>${DNAME[DIRS[t]]}</b>. How many degrees did she turn?</p>`);
    api.body.innerHTML=`<div class="facewrap">${faceSvg('cF',f)}<div class="clockhint">Each step between the 8 points is <b>45°</b>.<br>A full turn is 360°.</div></div>`;
    askOne(api,{id:'cA',unit:'°',w:4,right:k*45,traps:[[(8-k)*45,`That is the angle going the <b>other</b> way. Turn ${cw?'clockwise':'anticlockwise'}: ${Array.from({length:k+1},(_,i)=>DIRS[(f+(cw?i:-i)+80)%8]).join(' → ')}.`],[k*90,'Each step between the 8 points is 45°, not 90°. 90° is from N to E (2 steps).'],[k,`You counted ${k} steps. Good! Now each step is 45°, so multiply: ${k} × 45°.`]],
      ok:`${k} steps × 45° = ${k*45}°`,work:[`${Array.from({length:k+1},(_,i)=>DIRS[(f+(cw?i:-i)+80)%8]).join(' → ')}: ${k} steps of 45° = ${k*45}°`]});
    const g=$('cF');$('cAGo').addEventListener('click',()=>{if(api.answered)g.style.transform=`rotate(${(f+(cw?k:-k))*45}deg)`});return}
  if(type==='walk'||type==='quest'){let sx,sy,moves,desc;
    if(type==='walk'){const a=pick([0,4]),b=pick([2,6]),n1=R(1,3),n2=R(1,3);sx=3-DV[a][0]*1;sy=a===0?R(4,6):R(0,2);sx=b===2?R(0,2):R(4,6);moves=[[a,n1],[b,n2]];desc=`Walk <b>${n1}</b> square${n1>1?'s':''} <b>${DNAME[DIRS[a]]}</b>, then <b>${n2}</b> square${n2>1?'s':''} <b>${DNAME[DIRS[b]]}</b>.`}
    else{const f=pick([0,2,4,6]),k=pick([2,6]),cw=Math.random()<.5,h=(f+(cw?k:-k)+8)%8,n=R(2,3);sx=3;sy=3;moves=[[h,n]];desc=`Face <b>${DNAME[DIRS[f]]}</b>. Turn <b>${turnName(k)} ${cw?'clockwise':'anticlockwise'}</b>, then walk <b>${n}</b> squares forward.`;moves.f=f;moves.k=k;moves.cw=cw}
    let x=sx,y=sy;moves.forEach(([d,n])=>{x+=DV[d][0]*n;y+=DV[d][1]*n});
    api.q(`<p class="qt">Start at the pirate 🏴‍☠️ (yellow ring). ${desc} Tap the square where the pirate ends up and dig for treasure!</p><p class="qs">Count the jumps from square to square, not the square you start on.</p>`);
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
