/* ================= SECONDARY 1 · NUMBER =================
   One game per topic, for G1, G2 and G3 together. The three levels are Core (round types 1 to 4: the essentials),
   Challenge (round types 5 to 8: harder, multi-step) and Stretch (all 8, easy to hard). sec:true switches the level names. */
const pw=(b,e)=>e===1?`${b}`:`${b}<sup>${e}</sup>`;
const pfStr=f=>Object.keys(f).map(Number).sort((a,b)=>a-b).filter(p=>f[p]).map(p=>pw(p,f[p])).join(' × ');
const pfVal=f=>Object.keys(f).reduce((v,p)=>v*Math.pow(+p,f[p]),1);
const pfOf=n=>{const f={};for(let p=2;n>1;p++)while(n%p===0){f[p]=(f[p]||0)+1;n/=p}return f};
const ladder=n=>{const out=[];let m=n;for(let p=2;m>1;p++)while(m%p===0){out.push(`${m} ÷ ${p} = ${m/p}`);m/=p}return out.join(', ')};
/* multiple choice that ends the round: opts are strings, why maps a wrong option to its feedback */
function secPick(api,id,opts,right,okMsg,work,why={}){api.body.insertAdjacentHTML('beforeend',`<div class="choices" id="${id}"></div>`);
  shuffle(uniq(opts)).forEach(c=>{const b=document.createElement('button');b.className='btn';b.style.fontSize='1.1rem';b.innerHTML=c;
    b.onclick=()=>{if(api.answered)return;const ok=c===right;[...$(id).children].forEach(y=>{y.disabled=true;if(y.innerHTML===b.innerHTML&&ok||y.dataset.r)y.classList.add('ok')});if(!ok)b.classList.add('no');
      api.done(ok,ok?okMsg:`${why[c]?why[c]+' ':''}${okMsg}`,work)};if(c===right)b.dataset.r=1;$(id).appendChild(b)})}
const PRIMES=[11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97],ODDCOMP=[21,27,33,39,49,51,57,63,69,77,81,87,91,93];
const why3=n=>n%3===0?`${n} = 3 × ${n/3}`:n%7===0?`${n} = 7 × ${n/7}`:n%11===0?`${n} = 11 × ${n/11}`:`${n} = ${Object.keys(pfOf(n))[0]} × ${n/Object.keys(pfOf(n))[0]}`;

addGame('s1-primes',{level:'S1',sec:true,strand:'num',glyph:'🏭',title:'Prime Factory',topic:'Primes, prime factorisation, HCF and LCM',
 how:'Break numbers into prime factors, then use them to find the HCF, the LCM and square roots.',rounds:8,
 round(api,r){
  const type=['isprime','hcf','lcm','pf','hcfpf','lcmword','hcfword','root'][r];
  if(type==='isprime'){const p=pick(PRIMES),one=Math.random()<.4,ds=shuffle(ODDCOMP).slice(0,one?2:3),opts=[p,...ds,...(one?[1]:[])].map(String);
    api.q(`<p class="qt">Which of these is a <b>prime number</b>?</p><p class="qs">A prime number has exactly two factors: 1 and itself.</p>`);
    const why={};ds.forEach(d=>why[d]=`${d} is not prime: ${why3(d)}.`);why[1]='1 is not prime: it has only one factor.';
    secPick(api,'spA',opts,String(p),`${p} is prime: its only factors are 1 and ${p}.`,[...ds.map(d=>`${why3(d)}, so ${d} is not prime.`),...(one?['1 has only one factor, so it is not prime.']:[]),`${p} cannot be divided exactly by 2, 3, 5 or 7, so it is prime.`],why);return}
  if(type==='pf'){let f,n;do{f={2:R(1,4),3:R(0,3),5:R(0,2),7:R(0,1)};n=pfVal(f)}while(n<60||n>2000||Object.values(f).filter(Boolean).length<2);
    const right=pfStr(f),ks=Object.keys(f).map(Number).filter(p=>f[p]),g={...f};g[2]=f[2]+1;const h={...f},k=ks[ks.length-1];h[k]=f[k]+1;
    const comp=f[2]>=2?`4 × ${pfStr({...f,2:f[2]-2})||'1'}`.replace(' × 1',''):`${pfStr({...f,3:0,2:0})?pfStr({...f,3:0,2:0})+' × ':''}${Math.pow(2,f[2])*Math.pow(3,f[3])}`;
    api.q(`<p class="qt">Write <b>${fmt(n)}</b> as a product of its <b>prime factors</b>.</p>`);
    secPick(api,'spF',[right,pfStr(g),pfStr(h),comp],right,`${fmt(n)} = ${right}`,['Keep dividing by the smallest prime that goes in:',ladder(n),`So ${fmt(n)} = ${right}`],
      {[pfStr(g)]:`That makes ${fmt(pfVal(g))}, not ${fmt(n)}.`,[pfStr(h)]:`That makes ${fmt(pfVal(h))}, not ${fmt(n)}.`,[comp]:'That multiplies to the right number, but one of the factors is not prime.'});return}
  if(type==='hcf'||type==='lcm'||type==='lcmword'||type==='hcfword'){let g,m,n,a,b;do{g=pick(type==='lcmword'?[2,3,4,5,6]:[2,3,4,5,6,7,8,9,10,12]);m=R(2,7);n=R(2,7);a=g*m;b=g*n}while(gcd(m,n)!==1||m===n||(type!=='hcf'&&type!=='hcfword'&&(m===1||n===1||a*b/g>400)));
    if(type==='hcfword'){a*=pick([1,2,3]);b=b*a/(g*m);const gg=gcd(a,b);g=gg}
    const H=gcd(a,b),Lc=lcm(a,b),fa=pfStr(pfOf(a)),fb=pfStr(pfOf(b));
    const workH=[`${a} = ${fa}`,`${b} = ${fb}`,`HCF: take the primes they <b>share</b>, with the <b>lower</b> power: <b>${H}</b>`],workL=[`${a} = ${fa}`,`${b} = ${fb}`,`LCM: take <b>every</b> prime, with the <b>higher</b> power: <b>${Lc}</b>`];
    if(type==='hcf'){api.q(`<p class="qt">Find the <b>highest common factor</b> (HCF) of <b>${a}</b> and <b>${b}</b>.</p>`);
      askOne(api,{id:'spH',w:5,right:H,traps:[[Lc,`${Lc} is the <b>lowest common multiple</b>. A factor of ${a} cannot be bigger than ${a}.`],[x=>x>1&&x<H&&a%x===0&&b%x===0,x=>`${x} is a common factor, but there is a bigger one.`],[1,'1 is a common factor of every pair of numbers. Look for the biggest one.']],ok:`HCF of ${a} and ${b} = ${H}`,bad:`The HCF is ${H}.`,work:workH});return}
    if(type==='lcm'){api.q(`<p class="qt">Find the <b>lowest common multiple</b> (LCM) of <b>${a}</b> and <b>${b}</b>.</p>`);
      askOne(api,{id:'spL',w:5,right:Lc,traps:[[H,`${H} is the <b>highest common factor</b>. A multiple of ${a} cannot be smaller than ${a}.`],...(a*b!==Lc?[[a*b,`${a} × ${b} = ${a*b} is a common multiple, but there is a smaller one.`]]:[])],ok:`LCM of ${a} and ${b} = ${Lc}`,bad:`The LCM is ${Lc}.`,work:workL});return}
    if(type==='lcmword'){const S=pick([['Bus A leaves the interchange every','Bus B leaves every','Both buses leave together at 08 00. After how many minutes will they next leave <b>together</b>?'],['A red light flashes every','A blue light flashes every','They flash together now. After how many seconds will they next flash <b>together</b>?'],['Aisha runs a lap of the track every','Ravi runs a lap every','They start together. After how many minutes are they next at the start line <b>together</b>?']]),u=S[2].includes('seconds')?'s':'min';
      api.q(`<p class="qt">${S[0]} <b>${a} ${u==='s'?'seconds':'minutes'}</b>. ${S[1]} <b>${b} ${u==='s'?'seconds':'minutes'}</b>. ${S[2]}</p>`);
      askOne(api,{id:'spW',w:5,unit:u,right:Lc,traps:[[H,`${H} is the HCF. The answer must be a multiple of both ${a} and ${b}, so it cannot be smaller than them.`],...(a*b!==Lc?[[a*b,`They do meet after ${a*b} ${u}, but they meet earlier too. Find the <b>lowest</b> common multiple.`]]:[]),[a+b,'Adding does not work here. List the multiples of each and find the first one they share.']],ok:`They are next together after ${Lc} ${u}.`,bad:`The answer is ${Lc} ${u}.`,
        work:['"Next together" means the <b>lowest common multiple</b>.',`Multiples of ${a}: ${[1,2,3,4,5,6,7,8].map(k=>a*k).filter(x=>x<=Lc).join(', ')}`,`Multiples of ${b}: ${[1,2,3,4,5,6,7,8].map(k=>b*k).filter(x=>x<=Lc).join(', ')}`,`LCM = <b>${Lc}</b>`]});return}
    const S=pick([[`A ribbon <b>${a} cm</b> long and a ribbon <b>${b} cm</b> long are cut into pieces of <b>equal length</b>, with nothing left over. What is the <b>longest</b> each piece can be?`,'cm'],[`A teacher has <b>${a}</b> pencils and <b>${b}</b> erasers. She packs them into identical goodie bags and uses everything. What is the <b>greatest</b> number of bags she can make?`,'bags'],[`A floor is <b>${a} cm</b> by <b>${b} cm</b>. It is covered exactly with identical <b>square</b> tiles. What is the <b>largest</b> side a tile can have?`,'cm']]);
    api.q(`<p class="qt">${S[0]}</p>`);
    askOne(api,{id:'spX',w:5,unit:S[1],right:H,traps:[[Lc,`${Lc} is the LCM. The answer must divide both ${a} and ${b}, so it cannot be bigger than them.`],[x=>x>1&&x<H&&a%x===0&&b%x===0,x=>`${x} works, but it is not the ${S[1]==='bags'?'greatest':'largest'}. Find the <b>highest</b> common factor.`]],ok:`The answer is ${H} ${S[1]}.`,bad:`The answer is ${H} ${S[1]}.`,work:['Sharing or cutting into equal parts with nothing left means the <b>highest common factor</b>.',...workH]});return}
  if(type==='hcfpf'){let A,B;do{A={2:R(1,4),3:R(0,3),5:R(0,2)};B={2:R(1,4),3:R(0,3),5:R(0,2),7:R(0,1)}}while(pfStr(A)===pfStr(B)||!(A[3]&&B[3])&&!(A[5]&&B[5])||[2,3,5].every(p=>(A[p]||0)===(B[p]||0)));
    const lcmQ=Math.random()<.5,lo={},hi={},shHi={};[2,3,5,7].forEach(p=>{const x=A[p]||0,y=B[p]||0;lo[p]=Math.min(x,y);hi[p]=Math.max(x,y);shHi[p]=x&&y?Math.max(x,y):0});
    const sum={};[2,3,5,7].forEach(p=>sum[p]=(A[p]||0)+(B[p]||0));const right=pfStr(lcmQ?hi:lo);
    api.q(`<p class="qt">P = ${pfStr(A)} &nbsp;and&nbsp; Q = ${pfStr(B)}.</p><p class="qt">Find the <b>${lcmQ?'LCM':'HCF'}</b> of P and Q. Leave your answer in index notation.</p>`);
    secPick(api,'spI',[pfStr(lo),pfStr(hi),pfStr(shHi),pfStr(sum)].filter(Boolean),right,`${lcmQ?'LCM':'HCF'} = ${right}`,
      ['<b>HCF</b>: only the primes in <b>both</b>, each with the <b>lower</b> index.','<b>LCM</b>: <b>every</b> prime that appears, each with the <b>higher</b> index.',`HCF = ${pfStr(lo)} &nbsp; LCM = ${pfStr(hi)}`],
      {[pfStr(lcmQ?lo:hi)]:`That is the ${lcmQ?'HCF':'LCM'}.`,[pfStr(sum)]:'That is P × Q: you added the indices. Compare the indices instead.',[pfStr(shHi)]:lcmQ?'The LCM needs every prime, even one that is in only P or only Q.':'For the HCF use the lower index of each shared prime.'});return}
  /* root */
  const cube=Math.random()<.4,k=cube?3:2;let f,rt;do{f={};rt={};[2,3,5,7].forEach(p=>{const e=pick(cube?[0,0,1,1,2]:[0,1,1,2]);rt[p]=e;f[p]=e*k});}while(pfVal(rt)<6||pfVal(rt)>(cube?45:210)||Object.values(rt).filter(Boolean).length<2);
  const N=pfVal(f),ans=pfVal(rt);
  api.q(`<p class="qt">N = ${pfStr(f)}.</p><p class="qt">Use the prime factors to find <b>${cube?'∛N (the cube root of N)':'√N (the square root of N)'}</b>.</p>`);
  askOne(api,{id:'spR',w:6,right:ans,traps:[[N/k,`${cube?'A cube root is not ÷ 3':'A square root is not ÷ 2'}. Divide each <b>index</b> by ${k} instead.`],[N,`That is N itself. Divide each index by ${k} to find the root.`]],ok:`${cube?'∛N':'√N'} = ${pfStr(rt)} = ${fmt(ans)}`,bad:`The answer is ${fmt(ans)}.`,
    work:[`${cube?'Cube':'Square'} root: divide each index by ${k}.`,`${cube?'∛N':'√N'} = ${pfStr(rt)} = <b>${fmt(ans)}</b>`,`Check: ${Array(k).fill(fmt(ans)).join(' × ')} = ${fmt(N)}`]});
 }});

/* ---------- Below Zero: negative numbers ---------- */
const ng=n=>n<0?`−${Math.abs(n)}`:`${n}`,br=n=>n<0?`(${ng(n)})`:`${n}`;
function numLine(lo,hi,marks=[],hop){const W=660,H=110,x0=30,x1=630,y=58,sx=v=>x0+(v-lo)/(hi-lo)*(x1-x0),big=hi-lo>24?5:hi-lo>12?2:1;let s=`<line x1="${x0-14}" y1="${y}" x2="${x1+14}" y2="${y}" stroke="var(--ink)" stroke-width="3"/>`;
  for(let v=lo;v<=hi;v++){const z=v===0,l=v%big===0;s+=`<line x1="${sx(v)}" y1="${y-(l?9:5)}" x2="${sx(v)}" y2="${y+(l?9:5)}" stroke="var(--ink)" stroke-width="${z?3.5:1.6}"/>`;if(l)s+=`<text x="${sx(v)}" y="${y+30}" text-anchor="middle" style="font:${z?800:700} 15px var(--body);fill:var(--ink)">${ng(v)}</text>`}
  if(hop){const[a,b]=hop,m=(sx(a)+sx(b))/2;s+=`<path d="M${sx(a)} ${y-12} Q${m} ${y-58} ${sx(b)} ${y-12}" fill="none" stroke="var(--tomato)" stroke-width="3" stroke-dasharray="6 5"/><path d="M${sx(b)} ${y-12} l${b>a?-9:9} -3 l${b>a?4:-4} -8z" fill="var(--tomato)"/>`}
  marks.forEach(([v,c,t])=>{s+=`<circle cx="${sx(v)}" cy="${y}" r="8" fill="${c}" stroke="var(--ink)" stroke-width="2.5"/>${t?`<text x="${sx(v)}" y="${y-18}" text-anchor="middle" style="font:800 15px var(--body);fill:var(--ink)">${t}</text>`:''}`});
  return `<svg viewBox="0 0 ${W} ${H}" class="msvg tmap-nozoom" style="max-width:660px" role="img" aria-label="Number line from ${lo} to ${hi}">${s}</svg>`}
const askInt=(api,o)=>askOne(api,{w:5,mode:'text',...o});
addGame('s1-integers',{level:'S1',sec:true,strand:'num',glyph:'🌡️',title:'Below Zero',topic:'Negative numbers and the four operations',
 how:'Order, add, subtract, multiply and divide negative numbers, with a number line to help.',rounds:8,
 round(api,r){
  const type=['order','temp','add','sub','mul','div','mixed','square'][r];
  const note='<p class="qs">Type a minus sign for negative answers, e.g. -7.</p>';
  if(type==='order'){let v;do{v=[R(-12,-1),R(-12,-1),R(-6,6),R(1,9)]}while(new Set(v).size<4);const big=Math.random()<.5,ans=big?Math.max(...v.filter(x=>x<0)):Math.min(...v),neg=v.filter(x=>x<0);
    api.q(big?`<p class="qt">Which of the <b>negative</b> numbers below is the <b>greatest</b>?</p>`:`<p class="qt">Which number is the <b>smallest</b>?</p>`);
    api.body.innerHTML=numLine(-12,10,v.map(x=>[x,'var(--sun)','']));
    const far=String(ng(big?Math.min(...neg):Math.max(...neg)));
    secPick(api,'bzO',shuffle(v).map(ng),ng(ans),`${ng(ans)} is the ${big?'greatest negative number':'smallest'}: it is furthest to the ${big?'right of the negatives':'left'} on the number line.`,['Numbers get <b>smaller</b> as you move <b>left</b> on the number line.',`In order: ${[...v].sort((a,b)=>a-b).map(ng).join(' &lt; ')}`],
      {[far]:big?`${far} has the biggest digits, but it is further left, so it is smaller.`:`${far} is negative, but there is a number further left.`});return}
  if(type==='temp'){const a=R(-9,6),up=a<0?Math.random()<.65:Math.random()<.3,d=up?R(3,12):R(Math.max(2,a+1),a+11),b=up?a+d:a-d;
    const P=pick(['Seoul','Harbin','Sapporo','Moscow','Zurich']);
    api.q(`<p class="qt">The temperature in ${P} is <b>${ng(a)} °C</b>. It ${up?'rises':'falls'} by <b>${d} °C</b>. What is the new temperature?</p>${note}`);
    api.body.innerHTML=numLine(Math.min(a,b,0)-2,Math.max(a,b,0)+2,[[a,'var(--sun)','start']],[a,b]);
    askInt(api,{id:'bzT',unit:'°C',right:b,traps:[[-b,`Check the sign. Start at ${ng(a)} and count ${d} steps ${up?'up (right)':'down (left)'}.`],[up?a-d:a+d,`The temperature <b>${up?'rises':'falls'}</b>, so move ${up?'right':'left'} on the number line.`],[up?-(Math.abs(a)+d):Math.abs(a)+d,`You added ${Math.abs(a)} and ${d}. Count steps from ${ng(a)} on the number line instead.`]],ok:`${ng(a)} ${up?'+':'−'} ${d} = ${ng(b)} °C`,bad:`The answer is ${ng(b)} °C.`,work:[`Start at ${ng(a)}. Move ${d} steps ${up?'right':'left'}.`,`${ng(a)} ${up?'+':'−'} ${d} = <b>${ng(b)}</b>`]});return}
  if(type==='add'){const a=pick([R(-15,-2),R(2,15)]),b=R(-15,-2),ans=a+b;
    api.q(`<p class="qt">Work out &nbsp;<b>${ng(a)} + ${br(b)}</b></p>${note}`);api.body.innerHTML=numLine(Math.min(a,ans,0)-2,Math.max(a,ans,0)+2,[[a,'var(--sun)','start']],[a,ans]);
    askInt(api,{id:'bzA',right:ans,traps:[[a-b,`Adding a negative number means moving <b>left</b>: ${ng(a)} + ${br(b)} = ${ng(a)} − ${-b}.`],[-ans,'Check the sign of your answer on the number line.'],[Math.abs(a)+Math.abs(b),'You added the digits. Start at the first number and move left.']],ok:`${ng(a)} + ${br(b)} = ${ng(ans)}`,bad:`The answer is ${ng(ans)}.`,work:[`Adding ${br(b)} is the same as subtracting ${-b}.`,`${ng(a)} − ${-b} = <b>${ng(ans)}</b>`]});return}
  if(type==='sub'){const a=R(-12,12),b=R(-12,-2),ans=a-b;
    api.q(`<p class="qt">Work out &nbsp;<b>${ng(a)} − ${br(b)}</b></p>${note}`);api.body.innerHTML=numLine(Math.min(a,ans,0)-2,Math.max(a,ans,0)+2,[[a,'var(--sun)','start']]);
    askInt(api,{id:'bzS',right:ans,traps:[[a+b,`Subtracting a negative is the same as <b>adding</b>: ${ng(a)} − ${br(b)} = ${ng(a)} + ${-b}.`],[-ans,'Check the sign of your answer.']],ok:`${ng(a)} − ${br(b)} = ${ng(ans)}`,bad:`The answer is ${ng(ans)}.`,work:[`Subtracting ${br(b)} is the same as adding ${-b}.`,`${ng(a)} + ${-b} = <b>${ng(ans)}</b>`,'Think of taking away a debt: you end up with more.']});return}
  if(type==='mul'||type==='div'){const a=R(2,12)*pick([-1,-1,1]),b=R(2,9)*(a>0?-1:pick([-1,1])),p=a*b;
    if(type==='mul'){api.q(`<p class="qt">Work out &nbsp;<b>${br(a)} × ${br(b)}</b></p>${note}`);
      askInt(api,{id:'bzM',right:p,traps:[[-p,a<0&&b<0?'Negative × negative = <b>positive</b>.':'Negative × positive = <b>negative</b>.'],[a+b,'This is a multiplication, not an addition.']],ok:`${br(a)} × ${br(b)} = ${ng(p)}`,bad:`The answer is ${ng(p)}.`,work:['Same signs → positive. Different signs → negative.',`${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(p)}, and the signs are ${a<0===b<0?'the same':'different'}, so the answer is <b>${ng(p)}</b>.`]});return}
    api.q(`<p class="qt">Work out &nbsp;<b>${br(p)} ÷ ${br(a)}</b></p>${note}`);
    askInt(api,{id:'bzD',right:b,traps:[[-b,p<0===a<0?'Same signs ÷ → <b>positive</b>.':'Different signs ÷ → <b>negative</b>.']],ok:`${br(p)} ÷ ${br(a)} = ${ng(b)}`,bad:`The answer is ${ng(b)}.`,work:['Division follows the same sign rules as multiplication.',`${Math.abs(p)} ÷ ${Math.abs(a)} = ${Math.abs(b)}, and the signs are ${p<0===a<0?'the same':'different'}, so the answer is <b>${ng(b)}</b>.`]});return}
  if(type==='mixed'){const a=R(-9,-2),b=R(2,6),c=R(-6,-2),ans=a+b*c,ltr=(a+b)*c;
    api.q(`<p class="qt">Work out &nbsp;<b>${ng(a)} + ${b} × ${br(c)}</b></p>${note}`);
    askInt(api,{id:'bzX',right:ans,traps:[[ltr,`You worked from left to right. Do the <b>multiplication first</b>: ${b} × ${br(c)} = ${ng(b*c)}.`],[a-b*c,`${b} × ${br(c)} is negative: ${ng(b*c)}.`],[-ans,'Check the sign of your answer.']].filter(([x])=>x!==ans),ok:`${ng(a)} + ${b} × ${br(c)} = ${ng(ans)}`,bad:`The answer is ${ng(ans)}.`,work:[`Multiply first: ${b} × ${br(c)} = ${ng(b*c)}`,`Then add: ${ng(a)} + ${br(b*c)} = <b>${ng(ans)}</b>`]});return}
  const a=R(2,9),inside=Math.random()<.5,ans=inside?a*a:-a*a;
  api.q(`<p class="qt">Work out &nbsp;<b>${inside?`(−${a})²`:`−${a}²`}</b></p>${note}`);
  askInt(api,{id:'bzQ',right:ans,traps:[[-ans,inside?`(−${a})² means (−${a}) × (−${a}), and negative × negative is <b>positive</b>.`:`−${a}² means −(${a} × ${a}). Only the ${a} is squared, because there are no brackets.`],[inside?-2*a:-2*a,'Squaring means multiplying a number by itself, not by 2.'],[2*a,'Squaring means multiplying a number by itself, not by 2.']],ok:`${inside?`(−${a})²`:`−${a}²`} = ${ng(ans)}`,bad:`The answer is ${ng(ans)}.`,
    work:[`(−${a})² = (−${a}) × (−${a}) = ${a*a}`,`−${a}² = −(${a} × ${a}) = −${a*a}`,'The brackets decide whether the minus sign is squared too.']});
 }});

/* ---------- Close Enough: rounding, significant figures and estimation ---------- */
const dstr=(n,sh)=>(n/Math.pow(10,sh)).toFixed(sh);
const sfRound=(n,k)=>{const L=String(n).length,m=Math.pow(10,L-k);return Math.round(n/m)*m};
const trim=s=>s.includes('.')?s.replace(/0+$/,'').replace(/\.$/,''):s;
addGame('s1-estimate',{level:'S1',sec:true,strand:'num',glyph:'🎯',title:'Close Enough',topic:'Rounding, significant figures and estimation',
 how:'Round to decimal places and significant figures, then use estimates to check whether answers make sense.',rounds:8,
 round(api,r){
  const type=['dp','sfcount','sf','sfbig','estimate','reason','context','calc'][r];
  if(type==='dp'){let n,sh=pick([3,4]),dp=pick([1,2]);do{n=R(1000,99999)}while(n%10===0||Math.floor(n/Math.pow(10,sh-dp-1))%10===0);
    const m=Math.pow(10,sh-dp),up=Math.round(n/m)/Math.pow(10,dp),tr=Math.floor(n/m)/Math.pow(10,dp);
    api.q(`<p class="qt">Round <b>${dstr(n,sh)}</b> to <b>${dp} decimal place${dp>1?'s':''}</b>.</p>`);
    askOne(api,{id:'ceD',right:up,traps:[...(tr!==up?[[tr,`You cut the number off. Look at the next digit: it is ${Math.floor(n/(m/10))%10}, which is 5 or more, so round <b>up</b>.`]]:[]),[Math.round(n/(m/10))/Math.pow(10,dp+1),`That has ${dp+1} decimal places. You need ${dp}.`],[Math.round(n/(m*10))/Math.pow(10,dp-1),`That has ${dp-1} decimal place${dp-1===1?'':'s'}. You need ${dp}.`]].filter(([x])=>x!==up),ok:`${dstr(n,sh)} = ${up.toFixed(dp)} (to ${dp} d.p.)`,bad:`The answer is ${up.toFixed(dp)}.`,
      work:[`Keep ${dp} digit${dp>1?'s':''} after the decimal point.`,`The next digit is <b>${Math.floor(n/(m/10))%10}</b>: ${Math.floor(n/(m/10))%10>=5?'5 or more, so round up':'less than 5, so round down'}.`,`${dstr(n,sh)} ≈ <b>${up.toFixed(dp)}</b>`]});return}
  if(type==='sfcount'){const C=pick([()=>{const d=R(11,99);return[`0.0${d}`,2,'Zeros at the <b>front</b> only hold the place. They are not significant.']},()=>{const d=R(1,9),e=R(1,9);return[`${d}0${e}`,3,'A zero <b>between</b> non-zero digits is significant.']},()=>{const d=R(11,99);return[`${d}.0`,3,'A zero at the <b>end, after the decimal point</b>, is significant: it shows the number was measured that accurately.']},()=>{const d=R(1,9),e=R(1,9);return[`0.00${d}0${e}`,3,'Front zeros are not significant, but the zero between two digits is.']},()=>{const d=R(11,99);return[`0.${d}0`,3,'The front zero is not significant. The end zero after the decimal point is.']},()=>{const d=R(101,999);return[`${d}.00`,5,'Zeros at the end, after the decimal point, are significant.']}])();
    api.q(`<p class="qt">How many <b>significant figures</b> does <b>${C[0]}</b> have?</p>`);
    const digits=C[0].replace('.','').length,nz=C[0].replace(/[.0]/g,'').length;
    secPick(api,'ceC',['1','2','3','4','5','6'].filter(x=>Math.abs(+x-C[1])<=2||+x===digits||+x===nz).slice(0,5),String(C[1]),`${C[0]} has ${C[1]} significant figures.`,[C[2],'Start counting from the <b>first non-zero digit</b>.'],
      {[String(digits)]:'You counted every digit. Zeros at the front are not significant.',[String(nz)]:'You counted only the non-zero digits. Some zeros are significant too.'});return}
  if(type==='sf'||type==='sfbig'){const k=pick([1,2,3]);let n,sh;
    if(type==='sf'){do{n=R(1000,9999)}while(n%10===0||Math.floor(n/Math.pow(10,3-k))%10===0||String(sfRound(n,k)).length>4);sh=pick([5,6])}else{do{n=R(10000,999999)}while(n%10===0||String(sfRound(n,k)).length>String(n).length);sh=0}
    const rr=sfRound(n,k),right=rr/Math.pow(10,sh),show=type==='sf'?dstr(n,sh):fmt(n),ans=type==='sf'?trim(dstr(rr,sh)):fmt(rr),L=String(n).length;
    const dpMis=type==='sf'?Math.round(n/Math.pow(10,sh-k))/Math.pow(10,k):null,drop=type==='sfbig'?rr/Math.pow(10,L-k):null,trc=Math.floor(n/Math.pow(10,L-k))*Math.pow(10,L-k)/Math.pow(10,sh);
    api.q(`<p class="qt">Round <b>${show}</b> to <b>${k} significant figure${k>1?'s':''}</b>.</p>`);
    askOne(api,{id:'ceS',w:8,right,traps:[...(dpMis!==null?[[dpMis,`That is ${k} <b>decimal place${k>1?'s':''}</b>. Significant figures start at the first non-zero digit.`]]:[]),...(drop!==null?[[drop,`Keep the place value! ${fmt(n)} is about ${ans}, not ${fmt(drop)}. Fill the other places with zeros.`]]:[]),[trc,'You cut the number off. Check the next digit to see if you should round up.']].filter(([x])=>!near(x,right)),ok:`${show} = ${ans} (to ${k} s.f.)`,bad:`The answer is ${ans}.`,
      work:[`Count ${k} digit${k>1?'s':''} from the first non-zero digit: <b>${String(n).slice(0,k)}</b>${String(n).slice(k)}`,`The next digit is ${String(n)[k]}: ${+String(n)[k]>=5?'round up':'round down'}.`,`${show} ≈ <b>${ans}</b>${type==='sfbig'?' (zeros keep the place value)':''}`]});return}
  if(type==='estimate'){const a=pick([19.7,21.3,48.6,51.2,29.8,31.4,98.7,61.5,79.2]),b=pick([3.9,4.2,5.8,6.1,7.9,8.2,11.8,19.6]),ra=+a.toPrecision(1),rb=+b.toPrecision(1),est=ra*rb,ex=a*b;
    api.q(`<p class="qt">Without a calculator, which is the <b>best estimate</b> of &nbsp;<b>${a} × ${b}</b>?</p><p class="qs">Round each number to 1 significant figure first.</p>`);
    secPick(api,'ceE',[fmt(est),fmt(est*10),fmt(est/10),fmt(ra+rb)].map(String),fmt(est),`${a} × ${b} ≈ ${ra} × ${rb} = ${fmt(est)}`,[`${a} ≈ ${ra} and ${b} ≈ ${rb}`,`${ra} × ${rb} = <b>${fmt(est)}</b>`,`The exact answer is ${+ex.toFixed(2)}, which is close.`],
      {[fmt(est*10)]:'That is 10 times too big. Check the place values.',[fmt(est/10)]:'That is 10 times too small. Check the place values.',[fmt(ra+rb)]:'You added. This is a multiplication.'});return}
  if(type==='reason'){const a=pick([38.2,51.7,62.4,79.1,24.6]),b=pick([4.9,6.2,7.8,9.1,5.1]),ex=+(a*b).toFixed(2),ra=+a.toPrecision(1),rb=+b.toPrecision(1),kid=pick(SGKIDS)[0];
    const wrong=pick([+(ex*10).toFixed(1),+(ex/10).toFixed(3),+(a+b).toFixed(1)]),isOk=Math.random()<.35,shown=isOk?ex:wrong;
    api.q(`<p class="qt">${kid} types <b>${a} × ${b}</b> into a calculator and gets <b>${fmt(shown)}</b>. Use an estimate to decide: is this answer <b>reasonable</b>?</p>`);
    secPick(api,'ceR',['Yes, it is about right','No, it is far too big','No, it is far too small'],isOk?'Yes, it is about right':shown>ex?'No, it is far too big':'No, it is far too small',`Estimate: ${ra} × ${rb} = ${ra*rb}. The exact answer is ${fmt(ex)}.`,[`${a} ≈ ${ra} and ${b} ≈ ${rb}, so the answer should be about <b>${ra*rb}</b>.`,`${fmt(shown)} is ${isOk?'close to that':shown>ex?'much bigger than that':'much smaller than that'}.`,isOk?'':'A slip like a misplaced decimal point or the wrong key is easy to catch with an estimate.'].filter(Boolean));return}
  if(type==='context'){const C=pick([()=>{const cap=pick([18,24,28,36,45]),n=cap*R(3,7)+R(3,cap-3);return[`<b>${n}</b> students go on a learning journey. Each bus seats <b>${cap}</b> students. How many buses are <b>needed</b>?`,'buses',Math.ceil(n/cap),Math.floor(n/cap),`${n} ÷ ${cap} = ${(n/cap).toFixed(2)}`,'Everyone needs a seat, so round <b>up</b>.',`${Math.floor(n/cap)} buses leave ${n-Math.floor(n/cap)*cap} students behind.`]},()=>{const pr=pick([3,4,6,7,8]),m=pr*R(4,9)+R(1,pr-1);return[`Notebooks cost <b>$${pr}</b> each. Mei Ling has <b>$${m}</b>. How many notebooks can she <b>buy</b>?`,'notebooks',Math.floor(m/pr),Math.ceil(m/pr),`${m} ÷ ${pr} = ${(m/pr).toFixed(2)}`,'She cannot buy part of a notebook, so round <b>down</b>.',`${Math.ceil(m/pr)} notebooks cost $${Math.ceil(m/pr)*pr}, more than she has.`]},()=>{const len=pick([15,25,35,45]),tot=len*R(4,9)+R(3,len-3);return[`A rope <b>${tot} cm</b> long is cut into pieces <b>${len} cm</b> long. How many <b>full</b> pieces can be cut?`,'pieces',Math.floor(tot/len),Math.ceil(tot/len),`${tot} ÷ ${len} = ${(tot/len).toFixed(2)}`,'The last bit is too short to count, so round <b>down</b>.',`There is not enough rope for ${Math.ceil(tot/len)} full pieces.`]}])();
    api.q(`<p class="qt">${C[0]}</p>`);
    askOne(api,{id:'ceX',w:4,unit:C[1],right:C[2],traps:[[C[3],C[6]+' Think about what the remainder means.']],ok:`The answer is ${C[2]} ${C[1]}.`,bad:`The answer is ${C[2]} ${C[1]}.`,work:[C[4],C[5],`Answer: <b>${C[2]} ${C[1]}</b>`,'In real situations, the context decides whether you round up or down.']});return}
  /* calc: divide, then give the answer to 3 significant figures */
  let a,b,q;do{a=R(11,97);b=pick([3,6,7,9,11,13]);q=a/b}while(a%b===0||q<1||Math.round(q*100)%10===0||Math.round(q*1000)%10===5);
  const right=+q.toPrecision(3),tr=Math.floor(q*100)/100,dp3=+q.toFixed(3);
  api.q(`<p class="qt">A calculator shows <b>${a} ÷ ${b} = ${q.toFixed(7)}…</b></p><p class="qt">Write the answer correct to <b>3 significant figures</b>.</p>`);
  askOne(api,{id:'ceK',w:7,right,traps:[...(tr!==right?[[tr,'You cut the number off. Check the 4th significant figure to see if you should round up.']]:[]),[dp3,'That is 3 <b>decimal places</b>. Count 3 digits from the first non-zero digit.'],[+q.toPrecision(2),'That has only 2 significant figures.']].filter(([x])=>!near(x,right)),ok:`${q.toFixed(7)}… = ${right} (to 3 s.f.)`,bad:`The answer is ${right}.`,
    work:[`The first three significant figures are <b>${String(q.toFixed(7)).slice(0,4)}</b>.`,`The next digit is ${String(q.toFixed(7))[4]}: ${+String(q.toFixed(7))[4]>=5?'round up':'round down'}.`,`Answer: <b>${right}</b>`]});
 }});
