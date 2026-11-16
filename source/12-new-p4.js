/* ===== Shared answer boxes that spot common mistakes =====
   askBox wires a Check button to some inputs. judge(vals) returns true (right), a string (a known mistake: shown as the hint),
   or false (wrong, no special hint). First wrong answer at a step → orange retry box with the hint. Second → the round is wrong. */
function askBox(api,o){
  const id=o.id;api.body.insertAdjacentHTML('beforeend',`<div class="askwrap">${o.label?`<p class="asklab">${o.label}</p>`:''}<div class="row askrow">${o.html}<button class="btn primary" id="${id}Go">Check</button></div><div id="${id}M"></div></div>`);
  const ins=[...api.body.querySelectorAll(`[data-ask="${id}"]`)],go=$(id+'Go');
  const vals=()=>{const v={};ins.forEach(i=>{const s=i.value.trim().replace(/[$,\s]/g,'');v[i.dataset.k]=s===''?NaN:+s;v['_'+i.dataset.k]=i.value.trim()});return v};
  const chk=()=>{if(api.answered||go.disabled)return;const v=vals();
    if(o.zero){if(o.zero.every(k=>v['_'+k]==='')){const f=ins.find(i=>o.zero.includes(i.dataset.k));if(f)f.focus();$(id+'M').innerHTML='<p class="askneed">Type your answer first. You can leave a box empty if it is 0.</p>';return}o.zero.forEach(k=>{if(v['_'+k]===''){v[k]=0;v['_'+k]='0'}})}
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
const chipTxt=s=>s.hide?`${s.mode} ?`:s.mode==='mrt'?`${s.min} min`:`${s.mode} ${s.min} min`;
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
/* Step 1 of a compare question: tap the faster route; then Step 2 runs */
function routePick(api,faster,id,then){api.body.insertAdjacentHTML('beforeend',`<div class="askwrap"><p class="asklab"><b>Step 1:</b> which route is faster?</p><div class="choices" id="${id}P"></div><div id="${id}Pm"></div></div>`);
  ['Route A','Route B'].forEach(nm=>{const bt=document.createElement('button');bt.className='btn';bt.style.fontSize='1.1rem';bt.textContent=nm;
    bt.onclick=()=>{const box=$(id+'P');if(api.answered||box.dataset.done)return;box.dataset.done=1;const ok=nm===faster;[...box.children].forEach(x=>{x.disabled=true;if(x.textContent===faster)x.classList.add('ok')});if(!ok){bt.classList.add('no');ctx.st[id]=1}sfx[ok?'ok':'no']();
      $(id+'Pm').innerHTML=`<p class="${ok?'askok':'askneed'}">${ok?'Yes!':'Not quite.'} <b>${faster}</b> is faster.</p><p class="asklab"><b>Step 2:</b> by how many minutes is ${faster} faster?</p>`;then()};$(id+'P').appendChild(bt)})}
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
    const sched=[next-fq,next,next+fq,next+2*fq];
    api.q(`<p class="qt">${kid} leaves home at <b>${ttm(a)}</b>, walks <b>${w1} min</b> to the bus stop and catches the <b>next bus</b> to ${f0.n} station. Then ${pr} takes the MRT and walks to <b>${place[0]}</b>. When does ${pr} get there?</p>`);
    api.body.innerHTML=busBoard(sched.map(ttm),'Bus stop near home')+sgMap(R0,a);
    const before=next-fq;
    api.body.insertAdjacentHTML('beforeend',`<div class="askwrap" id="sgB1"><p class="asklab"><b>Step 1:</b> ${kid} leaves home at ${ttm(a)} and walks ${w1} min to the bus stop. Which bus does ${pr} catch?</p><div class="choices" id="sgB1c"></div><div id="sgB1m"></div></div>`);
    sched.forEach(t=>{const bt=document.createElement('button');bt.className='btn';bt.style.fontSize='1.1rem';bt.textContent=ttm(t);
      bt.onclick=()=>{if(api.answered||$('sgB1c').dataset.done)return;$('sgB1c').dataset.done=1;const ok=t===next;[...$('sgB1c').children].forEach(x=>{x.disabled=true;if(x.textContent===ttm(next))x.classList.add('ok')});if(!ok){bt.classList.add('no');ctx.st.sgT=1}sfx[ok?'ok':'no']();
        $('sgB1m').innerHTML=`<p class="${ok?'askok':'askneed'}">${ok?'Yes!':'Not that one.'} ${kid} reaches the stop at ${ttm(a)} + ${w1} min = <b>${ttm(a+w1)}</b>. ${t<next&&!ok?`The ${ttm(t)} bus has already left. `:''}The next bus is at <b>${ttm(next)}</b>, so ${pr} waits ${wait} min.</p><p class="asklab"><b>Step 2:</b> now add the bus ride, the MRT and the last walk. When does ${pr} get to ${place[0]}?</p>`;
    askTime(api,'sgT',a+d,[[a+d-wait,`You forgot to wait for the bus. ${Pr} reaches the stop at ${ttm(a+w1)}, but the next bus leaves at ${ttm(next)}: that is ${wait} min of waiting.`],[a+d-fq,`The ${ttm(before)} bus left before ${pr} reached the stop at ${ttm(a+w1)}. ${Pr} has to take the next one, at ${ttm(next)}.`],[a+d-w2,`You forgot the last ${w2} min walk to ${place[0]}.`]],
        `${kid} arrives at ${ttm(a+d)}.`,[`Reach the bus stop: ${ttm(a)} + ${w1} min = ${ttm(a+w1)}. The next bus is at ${ttm(next)}, so wait ${wait} min.`,`Whole journey: ${sgWork(S)} = ${tdur(d)}`,hops(a,a+d),'Press ▶ Replay journey to watch it again with the clock.']);
      };$('sgB1c').appendChild(bt)});
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
  if(type==='freq'){const no=pick(['14','36','75','190','506','851']),fq=pick([8,10,12,15,20]),first=R(5,6)*60+pick([0,5,10,15,30]),k=R(4,8),next=first+k*fq,arr=next-R(1,fq-1);
    api.q(`<p class="qt">The first bus <b>${no}</b> leaves the bus interchange at <b>${ttm(first)}</b>. After that, a bus leaves <b>every ${fq} minutes</b>. Each bus leaves exactly on time and does not wait for anyone.</p><p class="qt">${kid} reaches the interchange at <b>${ttm(arr)}</b>. What time does the next bus that ${pr} can catch leave?</p>`);
    api.body.innerHTML=busBoard([ttm(first),ttm(first+fq),ttm(first+2*fq),`… every ${fq} min`],`Bus ${no} timetable`,`Bus ${no} leaves at:`)+board([[`${kid} arrives at`,ttm(arr)],[`Next bus ${kid} can catch`,'??  ??']],'At the interchange','🧍');
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

/* SG Journeys 2 secret bonus (all 8 right first time): Jas's real trip to school at SIT, Punggol */
function sgBonus(api){
  const st=(n,k)=>{const p=MRT[k].P.find(q=>q.n===n);return{n,x:p.x,y:p.y,kind:'stn',col:MRT[k].col}};
  const ns=R(26,30),c1=R(3,5),cc=R(4,5),c2=R(3,5),ne=R(13,16),wA=R(2,4),ns2=R(14,17),w1=R(3,5),wait=R(3,10),bus=R(50,58),wB=R(2,4);
  const A={nodes:[st('Choa Chu Kang','NS'),st('Bishan','NS'),{...st('Bishan','CC'),dup:1},st('Serangoon','CC'),{...st('Serangoon','NE'),dup:1},st('Punggol Coast','NE'),{n:'SIT',kind:'place'}],
    segs:[{mode:'mrt',min:ns,col:MRT.NS.col},{mode:'change',min:c1,col:MODECOL.change},{mode:'mrt',min:cc,col:MRT.CC.col},{mode:'change',min:c2,col:MODECOL.change},{mode:'mrt',min:ne,col:MRT.NE.col},{mode:'walk',min:wA,col:MODECOL.walk}]};
  const B={nodes:[st('Choa Chu Kang','NS'),st('Sembawang','NS'),{n:'Sembawang Int',kind:'stop'},{n:'Sembawang Int',kind:'stop',dup:1},{n:'Punggol Coast Int',kind:'stop'},{n:'SIT',kind:'place'}],
    segs:[{mode:'mrt',min:ns2,col:MRT.NS.col},{mode:'walk',min:w1,col:MODECOL.walk},{mode:'wait',min:wait,col:MODECOL.wait},{mode:'bus',min:bus,col:MODECOL.bus},{mode:'walk',min:wB,col:MODECOL.walk}]};
  const dA=sgSum(A.segs),dB=sgSum(B.segs),diff=Math.abs(dA-dB),faster=dA<dB?'Route A':'Route B',rideA=ns+cc+ne,rideB=ns2+bus;
  api.q(`<p class="qt">🎁 <b>Secret bonus!</b> Jas lives near <b>Choa Chu Kang</b> MRT. She studies at <b>SIT</b> (Singapore Institute of Technology), right next to <b>Punggol Coast</b> MRT. She can go by <b>Route A</b>: MRT all the way, changing lines twice. Or <b>Route B</b>: MRT to Sembawang, then <b>bus 117</b> to Punggol Coast Bus Interchange. Which route is faster, and by how many minutes?</p><p class="qs">The times are estimates. Real times change with crowds and traffic.</p>`);
  api.body.innerHTML=`<div class="jmwrap" style="max-width:920px;border:3px solid #2c3446;border-radius:14px;overflow:hidden;background:#141a26">${sgStrip(A.nodes,A.segs,'Route A · North–South → Circle → North East Line')}${sgStrip(B.nodes,B.segs,'Route B · North–South Line → bus 117')}</div>`;
  routePick(api,faster,'sgX',()=>askDur(api,'sgX',diff,null,`${faster} is faster by ${tdur(diff)}.`,[`Route A: ${sgWork(A.segs)} = ${tdur(dA)}`,`Route B: ${sgWork(B.segs)} = ${tdur(dB)}`,`${faster} is faster: ${tdur(Math.max(dA,dB))} − ${tdur(Math.min(dA,dB))} = ${tdur(diff)}`,'A bus can feel easier (no changing lines), but here it is much slower!'],
    [[dA,`${tdur(dA)} is how long Route A takes. Now work out Route B and find the <b>difference</b>.`],[dB,`${tdur(dB)} is how long Route B takes. Now work out Route A and find the <b>difference</b>.`],[Math.abs(rideA-rideB),'You only compared the time on the trains and bus. Walking, changing lines and waiting count too!']].filter(([x])=>x!==diff)))}
addGame('sg-journeys',{level:'P4',strand:'geo',glyph:'⏱️',title:'Beat the Clock: SG Journeys',topic:'Time: start, finish and duration on MRT journeys',
 how:'Watch MRT journeys on a map of Singapore, then work out how long they take, when you arrive, or when you must board.',rounds:8,
 round(api,r){sgRound(api,['line','linearr','lineback','change','changearr','changeback','trip','back'][r])}});
addGame('sg-journeys-2',{level:'P5',strand:'geo',glyph:'⏱️',title:'Beat the Clock: SG Journeys 2',topic:'Planning trips: buses, MRT, timetables and delays',
 how:'Plan trips across Singapore by walking, bus and MRT. Work backwards, read bus timetables, compare routes and deal with surprise delays.',rounds:8,
 round(api,r){sgRound(api,['trip','freq','frac','back','bus','compare','delay','plan'][r])},
 bonus(api){sgBonus(api)}});
/* ================= P6. Beat the Clock: World Journeys — speed, distance and time with transport around the world ================= */
const WJ=[
 {c:'Hong Kong',at:'along Hong Kong Island',m:'tram',name:'Ding Ding tram',ex:'an old double-decker tram',u:'kmh',v:[9,10,12],d:[2,8]},
 {c:'Japan',at:'from Tokyo',m:'bullet',name:'Shinkansen',ex:'a bullet train',u:'kmh',v:[200,240,250,270,300],d:[150,600]},
 {c:'South Korea',at:'from Seoul',m:'bullet',name:'KTX',ex:'a high-speed train',u:'kmh',v:[180,200,240],d:[100,420]},
 {c:'Italy',at:'along the Grand Canal in Venice',m:'boat',name:'vaporetto',ex:'a water bus: Venice has canals instead of roads',u:'kmh',v:[8,9,10,12],d:[1,4]},
 {c:'the United Kingdom',at:'across London',m:'train',name:'London Underground',ex:'"the Tube", a train that runs in tunnels under the city',u:'kmh',v:[30,32,36],d:[4,24]},
 {c:'Thailand',at:'through Bangkok',m:'tuk',name:'tuk-tuk',ex:'a small taxi with three wheels',u:'kmh',v:[15,18,20,24],d:[2,12]},
 {c:'Indonesia',at:'through Jakarta',m:'bus',name:'TransJakarta bus',ex:'a city bus with its own road lane',u:'kmh',v:[18,20,24],d:[3,15]},
 {c:'Australia',at:'across Sydney Harbour',m:'boat',name:'Sydney ferry',ex:'a passenger boat',u:'kmh',v:[20,22,24,30],d:[4,14]},
 {c:'Malaysia',at:'from KL Sentral',m:'train',name:'ETS train',ex:'an electric train between cities',u:'kmh',v:[100,120,140],d:[60,350]},
 {c:'the Netherlands',at:'across Amsterdam',m:'bike',name:'bicycle',ex:'most people in Amsterdam cycle',u:'mpm',v:[200,240,250,300],d:[800,6000]},
 {c:'Switzerland',at:'up a mountain in the Alps',m:'cable',name:'cable car',ex:'a cabin that hangs from a cable',u:'mpm',v:[300,360,400],d:[900,4000]}];
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
/* one strip: legs [{m,lab}] (m:'stop' = standing still), names [n0..nk] at the dots */
function wjRow(legs,names,label){const W=660,H=140,x0=50,x1=610,y=60,n=legs.length,dx=(x1-x0)/n,dur=2.2;let s=`<rect width="${W}" height="${H}" fill="#eef6ff"/>`,spr='',t0=0;
  const lastMove=legs.map(g=>g.m).lastIndexOf(legs.filter(g=>g.m!=='stop').map(g=>g.m).pop());
  legs.forEach((g,i)=>{const a=x0+dx*i,b=a+dx,mid=(a+b)/2;
    if(g.m==='stop')s+=`<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke="#c2410c" stroke-width="5" stroke-dasharray="3 9" stroke-linecap="round"/>`;
    else{if(g.m==='cable')s+=`<line x1="${a}" y1="${y-30}" x2="${b}" y2="${y-30}" stroke="#16233a" stroke-width="1.5"/>`;s+=`<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke="${g.m==='boat'?'#2378b5':'#2c3446'}" stroke-width="${g.m==='cable'?2:6}" ${g.m==='cable'?'stroke-dasharray="2 6"':''}/>`}
    const w=String(g.lab).replace(/<[^>]+>/g,'').length*10.5+24;
    s+=`<rect x="${mid-w/2}" y="${y+12}" width="${w}" height="30" rx="15" fill="${g.m==='stop'?'#c2410c':'#16233a'}"/><text x="${mid}" y="${y+33}" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">${g.lab}</text>`;
    if(g.m!=='stop'){const st=calm?`translate(${mid},${y})`:`translate(${a},${y})`;
      spr+=`<g transform="${st}"><g opacity="${calm||i===0?1:0}">${WJS[g.m]||WJS.walk}${calm?'':`${i?`<set attributeName="opacity" to="1" begin="${t0}s" fill="freeze"/>`:''}<animateTransform attributeName="transform" type="translate" from="0 0" to="${dx} 0" dur="${dur}s" begin="${t0}s" fill="freeze"/>${i!==lastMove?`<set attributeName="opacity" to="0" begin="${t0+dur}s" fill="freeze"/>`:''}`}</g></g>`;t0+=dur}else t0+=1});
  names.forEach((nm,i)=>{if(!nm)return;const x=x0+dx*i,anc=i===0?'start':i===n?'end':'middle';
    s+=`<circle cx="${x}" cy="${y}" r="7" fill="#ffd257" stroke="#16233a" stroke-width="2.5"/><text x="${i===0?x-10:i===n?x+10:x}" y="${y+68}" text-anchor="${anc}" font-size="18" font-weight="800" fill="#16233a">${nm}</text>`});
  return `${label?`<div class="tbh" style="padding:7px 12px">${label}</div>`:''}<svg class="wjsvg tmap-nozoom" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" aria-hidden="true">${s}${spr}</svg>`}
function wjCard(head,rows){return `<div class="jmwrap" style="max-width:920px;border:3px solid #2c3446;border-radius:14px;overflow:hidden;background:#141a26"><div class="tbh" style="padding:7px 12px">📍 ${head}</div>${rows.join('')}</div>
  ${calm?'':'<div class="row" style="margin-top:8px"><button class="btn" id="wjPlay">▶ Replay</button></div>'}`}
function wjWire(){const b=$('wjPlay');document.querySelectorAll('.wjsvg').forEach(s=>{try{s.setCurrentTime(0)}catch(e){}});if(b)b.onclick=()=>{sfx.tap();document.querySelectorAll('.wjsvg').forEach(s=>{try{s.setCurrentTime(0)}catch(e){}})}}
const gcdN=(a,b)=>b?gcdN(b,a%b):a;
const hstr=t=>{if(t%60===0)return `${t/60} h`;const w=Math.floor(t/60),r=t%60,g=gcdN(r,60);return `${w?w+' ':''}${fr(r/g,60/g)} h`};
function wjGen(T,o={}){for(let k=0;k<300;k++){const s=pick(T.v),ts=[];
  if(T.u==='kmh'){for(let t=5;t<=360;t+=5)if((s*t)%60===0){const d=s*t/60;if(d>=T.d[0]&&d<=T.d[1]&&(!o.half||t%30===0)&&(!o.notHour||t%60))ts.push(t)}}
  else for(let t=3;t<=40;t++){const d=s*t;if(d>=T.d[0]&&d<=T.d[1])ts.push(t)}
  if(ts.length){const t=pick(ts);return{s,t,d:T.u==='kmh'?s*t/60:s*t}}}return wjGen(WJ[0],o)}
const decMis=t=>{const h=t/60;if(t%60===0||Math.round(h*100)!==h*100)return null;return Math.floor(h)*60+Math.round(h%1*100)};
addGame('world-journeys',{level:'P6',strand:'geo',glyph:'🌏',title:'Beat the Clock: World Journeys',topic:'Speed, distance and time with transport around the world',
 how:'Ride trams, bullet trains, water buses and cable cars around the world. Work out speed, distance, time and average speed.',rounds:8,
 round(api,r){
  const type=['speed','dist','time','arrive','jam','avg','race','catch'][r];
  const[kid,pr]=pick(SGKIDS),Pr=pr[0].toUpperCase()+pr.slice(1);
  if(['speed','dist','time','arrive'].includes(type)){const T=pick(WJ),{s,t,d}=wjGen(T,{half:type==='speed'}),km=T.u==='kmh',su=km?'km/h':'m/min',du=km?'km':'m',go=['cable','bike'].includes(T.m)?'goes':'travels';
    const intro=`In <b>${T.c}</b>, the <b>${T.name}</b> (${T.ex})`;
    const card=wjCard(`${T.c} · ${T.name}`,[wjRow([{m:T.m,lab:type==='dist'?`${s}\u00a0${su} for ${tdur(t)}`:type==='speed'?`${d}\u00a0${du} in ${tdur(t)}`:`${d}\u00a0${du} at ${s}\u00a0${su}`}],['Start','End'])]);
    if(type==='speed'){api.q(`<p class="qt">${intro} ${go} <b>${d}\u00a0${du}</b> ${T.at} in <b>${tdur(t)}</b>. What is its speed?</p>`);api.body.innerHTML=card;wjWire();
      const work=['Speed = distance ÷ time',...(km?[`${tdur(t)} = ${hstr(t)}`,`${d} km ÷ ${hstr(t)} = <b>${s}\u00a0km/h</b>`]:[`${d} m ÷ ${t} min = <b>${s}\u00a0m/min</b>`])];
      const traps=[...(km&&t!==60?[[d/t,`You divided by ${t} minutes. km/h means km in 1 <b>hour</b>, so change ${tdur(t)} into hours first: ${hstr(t)}.`]]:[]),[d*t,'Speed = distance <b>÷</b> time, not ×.'],[t/d,'Divide the distance by the time, not the time by the distance.']].filter(([x])=>!near(x,s));
      askOne(api,{id:'wjS',unit:su,w:5,right:s,traps,ok:`Its speed is ${s}\u00a0${su}.`,bad:`The speed is ${s}\u00a0${su}.`,work});return}
    if(type==='dist'){api.q(`<p class="qt">${intro} ${go} ${T.at} at <b>${s}\u00a0${su}</b> for <b>${tdur(t)}</b>. How far does it go?</p>`);api.body.innerHTML=card;wjWire();
      const work=['Distance = speed × time',...(km?[`${tdur(t)} = ${hstr(t)}`,`${s} × ${hstr(t)} = <b>${d}\u00a0km</b>`]:[`${s} × ${t} = <b>${d}\u00a0m</b>`])];
      const traps=[...(km&&t!==60?[[s*t,`${s} × ${t} uses minutes. ${s} km/h means ${s} km in 1 <b>hour</b>, so change ${tdur(t)} into hours first: ${hstr(t)}.`]]:[]),[s/t,'Distance = speed <b>×</b> time.']].filter(([x])=>!near(x,d));
      askOne(api,{id:'wjD',unit:du,w:5,right:d,traps,ok:`It goes ${d}\u00a0${du}.`,bad:`The distance is ${d}\u00a0${du}.`,work});return}
    if(type==='time'){api.q(`<p class="qt">${intro} ${go} <b>${d}\u00a0${du}</b> ${T.at} at <b>${s}\u00a0${su}</b>. How long does the trip take?</p>`);api.body.innerHTML=card;wjWire();
      const wm=decMis(t),work=['Time = distance ÷ speed',km?`${d} ÷ ${s} = ${hstr(t)} = <b>${tdur(t)}</b>`:`${d} ÷ ${s} = <b>${t}\u00a0min</b>`];
      askDur(api,'wjT',t,null,`The trip takes ${tdur(t)}.`,work,[...(km&&wm!==null&&wm!==t?[[wm,`${t/60} h is not ${tdur(wm)}! An hour has 60 minutes: ${t/60} h = ${tdur(t)}.`]]:[])]);return}
    const a=R(7,16)*60+R(0,11)*5,wm=decMis(t);
    api.q(`<p class="qt">${intro} leaves at <b>${ttm(a)}</b>. It ${go} <b>${d}\u00a0${du}</b> ${T.at} at <b>${s}\u00a0${su}</b>. What time does it arrive?</p>`);api.body.innerHTML=card;wjWire();
    askTime(api,'wjA',a+t,[...(km&&wm!==null&&wm!==t?[[a+wm,`${t/60} h is not ${tdur(wm)}. An hour has 60 minutes, so ${t/60} h = ${tdur(t)}.`]]:[]),[a-t,'The arrival is <b>after</b> it leaves. Count on, not back.']],`It arrives at ${ttm(a+t)}.`,
      ['Time = distance ÷ speed',km?`${d} ÷ ${s} = ${hstr(t)} = ${tdur(t)}`:`${d} ÷ ${s} = ${t} min = ${tdur(t)}`,hops(a,a+t)]);return}
  if(type==='jam'){const T=pick(WJ.filter(x=>['tram','tuk','bus'].includes(x.m)));let A,Tm,J,d;
    do{A=pick([6,8,9,10,12,15,16,18,20]);Tm=pick([30,60,90,120]);J=pick([10,15,20,30]);d=A*Tm/60}while(!Number.isInteger(d)||Tm-J<20||d<2);
    const mv=d*60/(Tm-J);
    api.q(`<p class="qt">In <b>${T.c}</b>, ${kid} takes a <b>${T.name}</b> (${T.ex}) ${T.at}. The trip is <b>${d}\u00a0km</b>. On the way, it is stuck in a traffic jam for <b>${J}\u00a0min</b>. The whole trip takes <b>${tdur(Tm)}</b>, including the jam. What is the <b>average speed</b> for the whole trip?</p>`);
    api.body.innerHTML=wjCard(`${T.c} · ${T.name}`,[wjRow([{m:T.m,lab:'moving'},{m:'stop',lab:`jam ${J} min`},{m:T.m,lab:'moving'}],['Start','','','End'],`Whole trip: ${d} km in ${tdur(Tm)}`)]);wjWire();
    askOne(api,{id:'wjJ',unit:'km/h',w:5,right:A,traps:[[mv,`${Number.isInteger(mv)?mv+' km/h':'That'} is the speed while it was moving. Average speed for the <b>whole trip</b> uses the whole time, including the ${J} min jam.`],[d/Tm,`You divided by ${Tm} minutes. Change ${tdur(Tm)} into hours first: ${hstr(Tm)}.`]].filter(([x])=>!near(x,A)),
      ok:`Average speed = ${A} km/h.`,bad:`The average speed is ${A} km/h.`,work:['Average speed = total distance ÷ total time (stops count too!)',`Total time = ${tdur(Tm)} = ${hstr(Tm)}`,`${d} km ÷ ${hstr(Tm)} = <b>${A}\u00a0km/h</b>`]});return}
  if(type==='avg'){const T=pick(WJ.filter(x=>x.u==='kmh'&&x.v[0]>=100));let s1,t1,s2,t2,D,TT,av;
    do{s1=pick(T.v);t1=R(1,3);s2=pick([40,50,60,80]);t2=R(1,2);D=s1*t1+s2*t2;TT=t1+t2;av=D/TT}while(!Number.isInteger(av)||av===(s1+s2)/2);
    api.q(`<p class="qt">${kid}’s family is on holiday in <b>${T.c}</b>. They ride the <b>${T.name}</b> (${T.ex}) for <b>${t1}\u00a0h</b> at <b>${s1}\u00a0km/h</b>. Then they take a bus for <b>${t2}\u00a0h</b> at <b>${s2}\u00a0km/h</b>. What is their <b>average speed</b> for the whole journey?</p>`);
    api.body.innerHTML=wjCard(`${T.c} · ${T.name}, then a bus`,[wjRow([{m:T.m,lab:`${t1} h at ${s1} km/h`},{m:'bus',lab:`${t2} h at ${s2} km/h`}],['Start','','End'])]);wjWire();
    askOne(api,{id:'wjV',unit:'km/h',w:5,right:av,traps:[[(s1+s2)/2,`You found the average of the two speeds. But they spent different amounts of time at each speed. Use <b>total distance ÷ total time</b>.`],[D,`${D} km is the total distance. Now divide by the total time.`]].filter(([x])=>!near(x,av)),
      ok:`Average speed = ${av} km/h.`,bad:`The average speed is ${av} km/h.`,work:[`${T.name}: ${s1} × ${t1} = ${s1*t1} km`,`Bus: ${s2} × ${t2} = ${s2*t2} km`,`Total: ${D} km in ${TT} h`,`Average speed = ${D} ÷ ${TT} = <b>${av}\u00a0km/h</b>`]});return}
  if(type==='race'){const opts=[{place:'Amsterdam, in the Netherlands, where lots of people cycle',m:'bike',v:[200,240,250,300],how:'cycles',ex:p=>`needs <b>${p}\u00a0min</b> to unlock and park the bike`,lab:'unlock/park'},
      {place:'Hong Kong',m:'tram',v:[150,180,200],how:'takes the Ding Ding tram (an old double-decker tram)',ex:p=>`waits <b>${p}\u00a0min</b> for the tram`,lab:'wait'}];
    let o,sw,sb,P,D,tw,tb;do{o=pick(opts);sw=pick([60,75,80]);sb=pick(o.v);P=R(3,8);const L=sw*sb/gcdN(sw,sb),c=[];for(let x=L;x<=4000;x+=L)if(x>=1000)c.push(x);D=c.length?pick(c):0;tw=D/sw;tb=D/sb+P}while(!D||tw===tb||Math.abs(tw-tb)>25);
    const[k2]=pick(SGKIDS.filter(k=>k[0]!==kid)),diff=Math.abs(tw-tb),first=tw<tb?kid:k2;
    api.q(`<p class="qt">In <b>${o.place}</b>, ${kid} and ${k2} both go to a museum <b>${D}\u00a0m</b> away. ${kid} walks at <b>${sw}\u00a0m/min</b>. ${k2} ${o.how} at <b>${sb}\u00a0m/min</b>, but first ${o.ex(P)}. Who gets there first, and <b>how many minutes earlier</b>?</p>`);
    api.body.innerHTML=wjCard(o.place.split(',')[0]+' · race to the museum',[wjRow([{m:'walk',lab:`${D} m at ${sw} m/min`}],['Start','Museum'],`${kid} walks`),wjRow([{m:'stop',lab:`${o.lab} ${P} min`},{m:o.m,lab:`${D} m at ${sb} m/min`}],['Start','','Museum'],`${k2} ${o.m==='bike'?'cycles':'takes the tram'}`)]);wjWire();
    askOne(api,{id:'wjR',unit:'min',w:4,right:diff,traps:[[Math.abs(tw-D/sb),`Don't forget the ${P} min that ${k2} spends before moving!`],[tw,`${tw} min is how long ${kid} takes. Work out ${k2}'s time too, then find the difference.`],[tb,`${tb} min is how long ${k2} takes. Work out ${kid}'s time too, then find the difference.`]].filter(([x])=>!near(x,diff)),
      ok:`${first} gets there first, ${diff} min earlier.`,bad:`${first} gets there ${diff} min earlier.`,work:[`${kid}: ${D} ÷ ${sw} = ${tw} min`,`${k2}: ${P} + ${D} ÷ ${sb} = ${P} + ${D/sb} = ${tb} min`,`${first} is first, by ${Math.max(tw,tb)} − ${Math.min(tw,tb)} = <b>${diff}\u00a0min</b>`]});return}
  /* catch */
  const c=pick(['Japan','South Korea','Switzerland','Italy','the United Kingdom']),s=pick([60,70,75,80]),t=R(6,20),D=s*t,B=R(3,8),T=R(7,18)*60+pick([5,10,20,25,35,40,50,55]),ans=T-t-B;
  api.q(`<p class="qt">${kid} is on holiday in <b>${c}</b>. ${Pr} must catch a train that leaves at <b>${ttm(T)}</b>. The station is <b>${D}\u00a0m</b> from the hotel, and ${pr} walks at <b>${s}\u00a0m/min</b>. At the station, ${pr} needs <b>${B}\u00a0min</b> to buy a ticket. What is the <b>latest</b> time ${pr} can leave the hotel?</p>`);
  api.body.innerHTML=wjCard(`${c} · catch the train`,[wjRow([{m:'walk',lab:`${D} m at ${s} m/min`},{m:'stop',lab:`ticket ${B} min`}],['Hotel','Station','Train']).replace(/(<text[^>]*>)Train/,'$1Train '+ttm(T))]);wjWire();
  askTime(api,'wjC',ans,[[T+t+B,`That is after the train leaves! Count <b>back</b> from ${ttm(T)}.`],[T-t,`You forgot the ${B} min to buy a ticket.`],[T-B,`You forgot the walk: ${D} ÷ ${s} = ${t} min.`]],`${Pr} must leave by ${ttm(ans)}.`,
    [`Walking time = ${D} ÷ ${s} = ${t} min`,`Walk + ticket = ${t} + ${B} = ${t+B} min`,`${ttm(T)} − ${t+B} min = <b>${ttm(ans)}</b>`]);
 },
 /* secret bonus (all 8 right first time): time zones */
 bonus(api){const TZ=[['Tokyo','Japan',1,[390,420]],['Seoul','South Korea',1,[380,410]],['Bangkok','Thailand',-1,[140,160]],['Dubai','the United Arab Emirates',-4,[440,470]],['London','the United Kingdom',-8,[830,860]],['Sydney','Australia',3,[460,490]]];
  let Z,a,f,loc;do{Z=pick(TZ);a=R(7,15)*60+pick([0,10,15,20,30,40,45,50]);f=R(Z[3][0]/5,Z[3][1]/5)*5;loc=a+f+Z[2]*60}while(loc>=1440||loc<0);
  const z=Math.abs(Z[2]),dir=Z[2]>0?'ahead of':'behind';
  api.q(`<p class="qt">🎁 <b>Secret bonus: time zones!</b> Different countries set their clocks to different times. In November, the clocks in <b>${Z[0]}</b> (${Z[1]}) are <b>${z} h ${dir}</b> Singapore's. So when it is 12 00 in Singapore, it is <b>${ttm(720+Z[2]*60)}</b> in ${Z[0]}.</p>
    <p class="qt">A plane leaves Singapore at <b>${ttm(a)}</b> (Singapore time). The flight takes <b>${tdur(f)}</b>. What time is it <b>in ${Z[0]}</b> when the plane lands?</p>`);
  api.body.innerHTML=board([['Leaves Singapore (Singapore time)',ttm(a)],['Flight',tdur(f)],['Lands (Singapore time)','??  ??'],[`Lands (${Z[0]} time)`,'??  ??']],'Flight board','✈️');
  askTime(api,'wjZ',loc,[[a+f,`${ttm(a+f)} is the time in <b>Singapore</b> when the plane lands. ${Z[0]}'s clocks are ${z} h ${dir} Singapore's, so ${Z[2]>0?'add':'take away'} ${z} h.`],[a+f-Z[2]*60,`Check the direction: ${Z[0]} is ${z} h <b>${dir}</b> Singapore, so ${Z[2]>0?'add':'take away'} ${z} h.`]],
    `It is ${ttm(loc)} in ${Z[0]}.`,[`Landing time in Singapore time: ${ttm(a)} + ${tdur(f)} = ${ttm(a+f)}`,`${Z[0]} is ${z} h ${dir} Singapore: ${ttm(a+f)} ${Z[2]>0?'+':'−'} ${z} h = <b>${ttm(loc)}</b>`])}});
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
