/* ================= P5. Pizza Party Orders — adding and subtracting fractions and mixed numbers ================= */
const frq=(n,d)=>{const g=gcd(Math.abs(n),d)||1;return [n/g,d/g]};
const radd=([a,b],[c,d],s=1)=>frq(a*d+s*c*b,b*d);
const rshow=([n,d])=>nice(n,d);
const rtxt=([n,d])=>{const w=Math.floor(n/d),r=n%d;return r?(w?`${w} ${r}/${d}`:`${r}/${d}`):String(w)};
const mixIn=id=>`<span class="mixin">${inBox(id,'w','whole number',2.6,'numeric')}<span class="mixfr">${inBox(id,'n','numerator',2.8,'numeric')}<span class="mixbar"></span>${inBox(id,'d','denominator',2.8,'numeric')}</span></span>`;
/* right: [n,d] improper. traps: [[[n,d] or fn(v), msg]] */
function askFrac(api,o){return askBox(api,{id:o.id,label:o.label,html:mixIn(o.id)+(o.unit?`<span class="askunit">${o.unit}</span>`:''),need:['n','d'],
  judge:v=>{const w=isNaN(v.w)?0:v.w;if(!v.d)return 'The denominator (bottom number) cannot be 0.';const g=[w*v.d+v.n,v.d],eq=x=>g[0]*x[1]===x[0]*g[1];
    if(eq(o.right)){if(v.n>=v.d)return {simp:`That is equal to the answer, but ${v.n}/${v.d} is more than 1 whole. Change it to a mixed number.`};if(gcd(v.n,v.d)>1)return {simp:`Equal, but not in simplest form yet. Divide the top and bottom by ${gcd(v.n,v.d)}.`};return true}
    const t=(o.traps||[]).find(([x])=>typeof x==='function'?x(v,g):eq(x));return t?t[1]:false},
  onRight:(v,u)=>o.then?o.then(u):api.done(true,o.ok,o.work||[],ptsUsed(u)),onWrong:m=>api.done(false,(m?m+' ':'')+`The answer is ${rshow(o.right)}.`,o.work||[])})}
function pizzaSvg([n,d],col='var(--sun)',showD){const w=Math.floor(n/d),r=n%d,R0=30,cnt=w+(r?1:0);let s='';const D=showD||d;
  for(let k=0;k<cnt;k++){const cx=k*70+36,filled=k<w?D:Math.round(r*D/d);
    s+=`<circle cx="${cx}" cy="36" r="${R0+3}" fill="#d9a35b"/>`;
    for(let i=0;i<D;i++){const a0=i/D*2*Math.PI-Math.PI/2,a1=(i+1)/D*2*Math.PI-Math.PI/2,big=0;
      const p=D===1?`M${cx} ${36-R0} A${R0} ${R0} 0 1 1 ${cx-.01} ${36-R0}Z`:`M${cx} 36 L${cx+R0*Math.cos(a0)} ${36+R0*Math.sin(a0)} A${R0} ${R0} 0 ${big} 1 ${cx+R0*Math.cos(a1)} ${36+R0*Math.sin(a1)}Z`;
      s+=`<path d="${p}" fill="${i<filled?col:'var(--surface)'}" stroke="#7a4b1c" stroke-width="1.6"/>`;if(i<filled&&D<=12)s+=`<circle cx="${cx+R0*.55*Math.cos((a0+a1)/2)}" cy="${36+R0*.55*Math.sin((a0+a1)/2)}" r="3" fill="var(--tomato)"/>`}}
  return `<svg class="pizzas" viewBox="0 0 ${Math.max(1,cnt)*70+2} 74" style="max-width:${Math.max(1,cnt)*70+2}px" role="img" aria-label="${rtxt([n,d])} pizzas">${s}</svg>`}
const PAIRS=[[2,3],[3,4],[2,5],[4,6],[2,6],[3,6],[2,4],[4,8],[2,8],[3,12],[4,12],[6,4],[3,2]];
const PFRIENDS=['Aisha','Ben','Chen Wei','Devi','Farhan','Grace','Hui Min','Iskandar','Jun Jie','Kavya'];
function pizzaRow(lines){return `<div class="pzrow">${lines.map(([lab,q,col])=>`<div class="pzbox"><b>${lab}</b>${pizzaSvg(q,col)}<span>${rshow(q)}</span></div>`).join('')}</div>`}
addGame('p5-pizza',{level:'P5',strand:'num',glyph:'🍕',title:'Pizza Party Orders',topic:'Adding and subtracting fractions and mixed numbers',
 how:'Add and take away pizzas. Pick a common denominator first, then work out the answer.',rounds:8,
 round(api,r){
  const type=['add','mixAdd','mixAddR','wholeSub','mixSubR','storyAdd','storySub','three'][r];
  const F=shuffle(PFRIENDS);let b,d,a,c,w1=0,w2=0;
  const pickPair=(needCarry,needBorrow)=>{for(let t=0;t<200;t++){[b,d]=pick(PAIRS);a=R(1,b-1);c=R(1,d-1);const s=a*d+c*b,L=b*d;
    if(gcd(a,b)>1||gcd(c,d)>1)continue;if(needCarry===true&&s<=L)continue;if(needCarry===false&&s>=L)continue;if(needBorrow&&a*d>=c*b)continue;if(needBorrow===false&&a*d<=c*b)continue;return}};
  const L=()=>lcm(b,d);
  const cdStep=(then)=>{const l=L(),opts=uniq([l,b+d,b*d,Math.max(b,d)].filter((x,i)=>i===0||x!==l)).slice(0,4);
    const msg={[b+d]:`We never add the denominators. The new denominator must be a number that both ${b} and ${d} go into exactly.`,[b*d]:`${b} × ${d} = ${b*d} works, but ${l} is smaller and keeps the numbers easy. Use the smallest number both ${b} and ${d} go into.`,[Math.max(b,d)]:`${Math.max(b,d)} is not a multiple of ${Math.min(b,d)}, so the ${Math.min(b,d)}ths cannot be cut into ${Math.max(b,d)}ths evenly.`};
    api.body.insertAdjacentHTML('beforeend',`<p class="asklab">Step 1: cut the pizzas into equal slices. What is the <b>smallest</b> common denominator for ${fr(a,b)} and ${fr(c,d)}?</p><div class="choices" id="pzC"></div><div id="pzCM"></div>`);
    opts.forEach(x=>{const btn=document.createElement('button');btn.className='btn';btn.textContent=x;btn.onclick=()=>{if(api.answered||btn.disabled)return;
      if(x===l){[...$('pzC').children].forEach(y=>y.disabled=true);btn.classList.add('ok');$('pzCM').innerHTML=`<p class="asknote">${fr(a,b)} = ${fr(a*l/b,l)} and ${fr(c,d)} = ${fr(c*l/d,l)}</p>`;return then()}
      if(api.first('pzC')){btn.disabled=true;btn.classList.add('no');api.retry($('pzCM'),msg[x]||'Not that one.');return}
      [...$('pzC').children].forEach(y=>{y.disabled=true;if(+y.textContent===l)y.classList.add('ok')});btn.classList.add('no');api.done(false,(msg[x]||'')+` The smallest common denominator is ${l}.`,[])};$('pzC').appendChild(btn)})};
  const workAdd=(A,B,res,sub)=>{const l=L();return [`${rshow(A)} ${sub?'−':'+'} ${rshow(B)}`,`Change to ${l}ths: ${fr(a*l/b,l)} ${sub?'−':'+'} ${fr(c*l/d,l)}${w1||w2?` (wholes: ${w1} ${sub?'−':'+'} ${w2})`:''}`,`= ${rshow(res)}`]};
  if(type==='add'){pickPair(Math.random()<.5);const A=[a,b],B=[c,d],S=radd(A,B);
    api.q(`<p class="qt">${F[0]} ate ${fr(a,b)} of a pizza and ${F[1]} ate ${fr(c,d)} of a pizza. How much pizza did they eat altogether?</p>`);
    api.body.innerHTML=pizzaRow([[F[0],A,'var(--sun)'],[F[1],B,'var(--tomato)']]);
    cdStep(()=>askFrac(api,{id:'pzA',label:'Step 2: add. Write your answer in simplest form.',right:S,unit:'pizza',
      traps:[[[a+c,b+d],`You added the tops and the bottoms. Look: ${fr(a,b)} + ${fr(c,d)} must be more than ${fr(a,b)}, but ${fr(a+c,b+d)} is smaller! Change both to ${L()}ths first.`],
        [[a+c,L()],`You changed the denominator but not the numerators. ${fr(a,b)} = ${fr(a*L()/b,L())}: multiply the top by the same number as the bottom.`]],
      ok:`${fr(a,b)} + ${fr(c,d)} = ${rshow(S)}`,work:workAdd(A,B,S)}));return}
  if(type==='mixAdd'||type==='mixAddR'||type==='storyAdd'){pickPair(type!=='mixAdd');w1=R(1,3);w2=R(type==='storyAdd'?0:1,2);
    const A=[w1*b+a,b],B=[w2*d+c,d],S=radd(A,B),l=L(),fs=a*l/b+c*l/d;
    api.q(type==='storyAdd'?`<p class="qt">The class ordered pizzas. The teachers ate <b>${rtxt(A)}</b> pizzas and the pupils ate <b>${rtxt(B)}</b> pizzas. How many pizzas were eaten in all?</p>`
      :`<p class="qt">Table 1 has <b>${rtxt(A)}</b> pizzas left and Table 2 has <b>${rtxt(B)}</b> pizzas left. They put them together. How many pizzas is that?</p>`);
    api.body.innerHTML=pizzaRow([[type==='storyAdd'?'Teachers':'Table 1',A,'var(--sun)'],[type==='storyAdd'?'Pupils':'Table 2',B,'var(--tomato)']]);
    cdStep(()=>askFrac(api,{id:'pzA',label:'Step 2: add the wholes, then add the fractions. Simplest form, please.',right:S,unit:'pizzas',
      traps:[[[(w1+w2)*(b+d)+a+c,b+d],`You added the tops and the bottoms. Change the fractions to ${l}ths first.`],
        [(v,g)=>fs>l&&g[0]*S[1]===(S[0]-S[1])*g[1],`${fr(a*l/b,l)} + ${fr(c*l/d,l)} = ${fr(fs,l)}, which is more than 1 whole! ${fr(fs,l)} = 1 ${fr(fs-l,l)}, so add 1 more to the wholes.`],
        [[w1+w2+0,1],'Do not forget the fraction parts.']],
      ok:`${rtxt(A)} + ${rtxt(B)} = ${rtxt(S)}`,work:[...workAdd(A,B,S),fs>l?`${fr(fs,l)} = 1 ${fr(fs-l,l)}, so carry 1 whole: ${w1+w2} + 1 ${fr(fs-l,l)}`:'' ].filter(Boolean)}));return}
  if(type==='wholeSub'){const W=R(2,5);b=pick([3,4,5,6,8]);a=R(1,b-1);while(gcd(a,b)>1)a=R(1,b-1);const A=[W*b,b],B=[a,b],S=radd(A,B,-1);
    api.q(`<p class="qt">There are <b>${W}</b> whole pizzas. ${F[0]} takes <b>${fr(a,b)}</b> of a pizza. How much pizza is left?</p>`);
    api.body.innerHTML=pizzaRow([['Before',A,'var(--sun)'],[F[0]+' takes',B,'var(--tomato)']]);
    askFrac(api,{id:'pzW',label:`Rename 1 whole as ${fr(b,b)} first. How much is left?`,right:S,unit:'pizzas',
      traps:[[[W*b+a,b],`${W} ${fr(a,b)} is ${W} wholes <b>plus</b> ${fr(a,b)}. We are taking ${fr(a,b)} away, so the answer must be less than ${W}.`],
        [[(W-1)*b+a,b],`You took 1 whole but kept ${fr(a,b)}. 1 whole = ${fr(b,b)}, and ${fr(b,b)} − ${fr(a,b)} = ${fr(b-a,b)}.`],
        [[(W-1)*b+(b-a)-b,b],`Only 1 whole is cut up. The other ${W-1} stay whole.`]],
      ok:`${W} − ${fr(a,b)} = ${rtxt(S)}`,work:[`${W} = ${W-1} + ${fr(b,b)}`,`${fr(b,b)} − ${fr(a,b)} = ${fr(b-a,b)}`,`Answer: ${W-1} ${fr(b-a,b)}`]});return}
  if(type==='mixSubR'||type==='storySub'){pickPair(undefined,true);w1=R(2,4);w2=R(1,w1-1);
    const A=[w1*b+a,b],B=[w2*d+c,d],S=radd(A,B,-1),l=L(),an=a*l/b,cn=c*l/d;
    api.q(type==='storySub'?`<p class="qt">The canteen had <b>${rtxt(A)}</b> pizzas. The P5 class ate <b>${rtxt(B)}</b> pizzas. How many pizzas were left?</p>`
      :`<p class="qt">${F[0]} brought <b>${rtxt(A)}</b> pizzas to the party. <b>${rtxt(B)}</b> pizzas were eaten. How much is left?</p>`);
    api.body.innerHTML=pizzaRow([['At first',A,'var(--sun)'],['Eaten',B,'var(--tomato)']]);
    cdStep(()=>{$('pzCM').insertAdjacentHTML('beforeend',`<p class="asknote">${fr(an,l)} is smaller than ${fr(cn,l)}, so you will need to rename 1 whole as ${fr(l,l)}.</p>`);
      askFrac(api,{id:'pzS',label:'Step 2: subtract. Simplest form, please.',right:S,unit:'pizzas',
      traps:[[radd([w1-w2,1],[cn-an,l]),`You did ${fr(cn,l)} − ${fr(an,l)} because it was easier, but you must take ${fr(cn,l)} <b>away from</b> ${fr(an,l)}. Rename: ${w1} ${fr(an,l)} = ${w1-1} ${fr(an+l,l)}.`],
        [radd([w1-w2,1],[0,1]),'Do not forget the fractions.'],[radd(A,B),'That is the sum. Some pizza was eaten, so subtract.']],
      ok:`${rtxt(A)} − ${rtxt(B)} = ${rtxt(S)}`,work:[`Change to ${l}ths: ${w1} ${fr(an,l)} − ${w2} ${fr(cn,l)}`,`Rename 1 whole: ${w1-1} ${fr(an+l,l)} − ${w2} ${fr(cn,l)}`,`= ${rtxt(S)}`]})});return}
  if(type==='three'){pickPair(true);w1=R(1,2);w2=1;const A=[w1*b+a,b],B=[w2*d+c,d],S0=radd(A,B),e=pick([1,2]),E=[e,1],S=radd(S0,E,-1);
    if(S[0]<=0){api.q('');return this.round(api,r)}
    api.q(`<p class="qt">${F[0]} ordered <b>${rtxt(A)}</b> pizzas and ${F[1]} ordered <b>${rtxt(B)}</b> pizzas. Then the class ate <b>${e}</b> whole pizza${e>1?'s':''}. How much pizza is left?</p>`);
    api.body.innerHTML=pizzaRow([[F[0],A,'var(--sun)'],[F[1],B,'var(--tomato)']]);
    cdStep(()=>askFrac(api,{id:'pzT',label:'Step 2: add, then take away the whole pizzas.',right:S,unit:'pizzas',traps:[[S0,`That is how much was ordered. Now take away the ${e} pizza${e>1?'s':''} that ${e>1?'were':'was'} eaten.`],[radd(S0,E),'Add the orders, but <b>take away</b> what was eaten.']],
      ok:`${rtxt(A)} + ${rtxt(B)} − ${e} = ${rtxt(S)}`,work:[`${rtxt(A)} + ${rtxt(B)} = ${rtxt(S0)}`,`${rtxt(S0)} − ${e} = ${rtxt(S)}`]}));return}
 }});

/* ================= P5. Percent Shop — percentage of a whole, discount, GST, interest ================= */
const pmoney=x=>'$'+(Math.round(x*100)/100).toFixed(Number.isInteger(Math.round(x*100)/100)?0:2);
const tag=(item,price,extra)=>`<div class="ptag"><span class="ptagh">${item}</span><b>${price}</b>${extra?`<span class="ptags">${extra}</span>`:''}</div>`;
const SHOP=[['🎒','School bag'],['👟','Running shoes'],['🎧','Headphones'],['⌚','Watch'],['🧸','Teddy bear'],['🎮','Game controller'],['🚲','Bicycle'],['🛴','Scooter'],['📚','Book set'],['🪁','Kite']];
addGame('p5-pshop',{level:'P5',strand:'num',glyph:'%',title:'Percent Shop',topic:'Percentage: part of a whole, discount, GST and interest',
 how:'Shop with percentages: shade bars, find discounts, add GST and work out interest.',rounds:8,
 round(api,r){
  const type=['shade','frac','pctOf','discount','gst','whatPct','interest','compare'][r];
  const [ic,item]=pick(SHOP);
  if(type==='shade'){const [N,cols,ps]=pick([[20,10,[15,35,45,65,85]],[25,5,[12,24,36,48,64]],[50,10,[14,22,38,46,62]]]),p=pick(ps),k=p*N/100;
    api.q(`<p class="qt">This loyalty card has <b>${N}</b> squares. Shade <b>${p}%</b> of the card.</p><p class="qs">Tap squares to shade or unshade them.</p>`);
    api.body.innerHTML=`<div class="pgrid" id="psG" style="--c:${cols}">${Array.from({length:N},(_,i)=>`<button class="pcell" data-i="${i}" aria-label="square ${i+1}"></button>`).join('')}</div><div class="row"><span class="pill" id="psN">0 shaded</span><button class="btn primary" id="psGo">Check</button></div><div id="psM"></div>`;
    const on=new Set();$('psG').querySelectorAll('.pcell').forEach(b=>b.onclick=()=>{if(api.answered)return;const i=+b.dataset.i;on.has(i)?on.delete(i):on.add(i);b.classList.toggle('on');sfx.pop();$('psN').textContent=`${on.size} shaded`});
    const work=[`${p}% = ${fr(p,100)}`,`${fr(p,100)} × ${N} = ${k} squares`,`Or: ${N} squares is 100%, so 1 square is ${100/N}%, and ${p}% ÷ ${100/N}% = ${k} squares.`];
    $('psGo').onclick=()=>{if(api.answered)return;const n=on.size;if(n===k){$('psGo').disabled=true;return api.done(true,`${p}% of ${N} squares is ${k} squares.`,work,ptsUsed(ctx.st.psG))}
      const msg=n===p?`${p}% does not mean ${p} squares! It means ${p} out of every <b>100</b>. This card has only ${N} squares, so find ${p}% of ${N}.`:n===N-k?`You shaded the part that is <b>not</b> ${p}%. Shade ${p}%.`:`${p}% means ${fr(p,100)} of the whole card. How many of the ${N} squares is that?`;
      if(api.first('psG')){api.retry($('psM'),msg);return}$('psGo').disabled=true;api.done(false,msg+` The answer is ${k} squares.`,work)};return}
  if(type==='frac'){const [n,d]=pick([[3,5],[7,20],[9,25],[1,4],[3,4],[2,5],[11,20],[13,50],[4,5],[17,25]]),p=n*100/d;
    api.q(`<p class="qt"><b>${fr(n,d)}</b> of the shoppers paid by card. What percentage of the shoppers is that?</p>`);
    api.body.innerHTML=`<div class="pbar">${Array.from({length:d},(_,i)=>`<span class="${i<n?'on':''}"></span>`).join('')}</div>`;
    askOne(api,{id:'psF',unit:'%',w:4,right:p,traps:[[+(String(n)+String(d)),`${n}${d}% just puts the digits together. Make the denominator 100: ${fr(n,d)} = ${fr(p,100)} = ${p}%.`],[n/d,`${n/d} is the decimal. To get a percentage, multiply by 100.`],[n,`${n} is the numerator. Percent means "out of 100", so change ${fr(n,d)} to hundredths first.`],[100-p,'That is the percentage who did <b>not</b> pay by card.']],
      ok:`${fr(n,d)} = ${fr(p,100)} = ${p}%`,work:[`${fr(n,d)} = ${fr(n*100/d,100)} (× ${100/d} top and bottom)`,`= ${p}%`]});return}
  if(type==='pctOf'){const p=pick([10,20,25,30,40,75,15,60]),Q=pick([40,60,80,120,200,160,240]).valueOf(),A=p*Q/100;
    if(!Number.isInteger(A))return this.round(api,r);
    api.q(`<p class="qt">The shop had <b>${Q}</b> ${item.toLowerCase()}s. <b>${p}%</b> of them were sold today. How many were sold?</p>`);
    api.body.innerHTML=`<div class="row">${tag(ic+' '+item,Q+' in stock')}</div>`;
    askOne(api,{id:'psO',w:5,right:A,traps:[[Q/p,`${Q} ÷ ${p} is not ${p}%. ${p}% of ${Q} means ${fr(p,100)} × ${Q}.`],[Q*p,`${p}% of ${Q} is <b>part</b> of ${Q}, so it must be smaller than ${Q}. Multiply by ${fr(p,100)}, not by ${p}.`],[Q-A,`That is how many were <b>not</b> sold.`],[p,`${p}% is not the same as ${p} items. Find ${p} out of every 100.`]],
      ok:`${p}% of ${Q} = ${A}`,work:[`${p}% of ${Q} = ${fr(p,100)} × ${Q} = ${A}`,`Or: 10% of ${Q} = ${Q/10}, so ${p}% = ${p/10} × ${Q/10} = ${A}`]});return}
  if(type==='discount'||type==='compare'){const P=pick([40,60,80,120,150,200,90,240]),p=pick([10,20,25,30,15]),D=P*p/100,pay=P-D;
    if(!Number.isInteger(D*100))return this.round(api,r);
    if(type==='discount'){api.q(`<p class="qt">The ${item.toLowerCase()} costs <b>$${P}</b>. Today there is a <b>${p}% discount</b>. How much does it cost now?</p>`);
      api.body.innerHTML=`<div class="row">${tag(ic+' '+item,'$'+P,`${p}% off!`)}</div>`;
      askOne(api,{id:'psD1',label:'Step 1: how much is the discount?',pre:'<span class="askunit">$</span>',right:D,traps:[[P-D,'That is the new price. First find just the discount (the amount you save).'],[p,`The discount is ${p}% of $${P}, not $${p}.`],[P*p,`${p}% of $${P} is ${fr(p,100)} × ${P}. Remember to divide by 100.`]],
        then:()=>askOne(api,{id:'psD2',label:'Step 2: how much do you pay?',pre:'<span class="askunit">$</span>',right:pay,traps:[[D,`${pmoney(D)} is the amount you save. You still pay the rest: $${P} − ${pmoney(D)}.`],[P+D,'A discount makes the price lower, so subtract.'],[P-p,`Take away the discount in dollars (${pmoney(D)}), not ${p}.`]],
          ok:`$${P} − ${pmoney(D)} = ${pmoney(pay)}`,work:[`Discount = ${p}% of $${P} = ${pmoney(D)}`,`Price now = $${P} − ${pmoney(D)} = ${pmoney(pay)}`,`Or: you pay ${100-p}% of $${P} = ${pmoney(pay)}`]})});return}
    let off=Math.max(1,Math.round(D+pick([-1,1])*pick([2,3,4,5])));if(off===Math.round(D)&&Number.isInteger(D))off+=2;const payB=P-off,cheap=pay<payB?'A':'B',diff=Math.abs(payB-pay);
    api.q(`<p class="qt">Two shops sell the same ${item.toLowerCase()} for <b>$${P}</b>. Shop A gives <b>${p}% off</b>. Shop B gives <b>$${off} off</b>. Which shop is cheaper?</p>`);
    api.body.innerHTML=`<div class="row">${tag('Shop A · '+ic,'$'+P,`${p}% off`)}${tag('Shop B · '+ic,'$'+P,`$${off} off`)}</div><div class="choices" id="psC"></div><div id="psCM"></div>`;
    ['A','B'].forEach(x=>{const btn=document.createElement('button');btn.className='btn';btn.textContent='Shop '+x;btn.onclick=()=>{if(api.answered||btn.disabled)return;
      if(x===cheap){[...$('psC').children].forEach(y=>y.disabled=true);btn.classList.add('ok');return askOne(api,{id:'psC2',label:'How much cheaper is it?',pre:'<span class="askunit">$</span>',right:diff,traps:[[Math.abs(p-off),`Compare dollars with dollars: ${p}% of $${P} is ${pmoney(D)}, not $${p}.`]],
        ok:`Shop ${cheap} is ${pmoney(diff)} cheaper.`,work:[`Shop A: ${p}% of $${P} = ${pmoney(D)} off → ${pmoney(pay)}`,`Shop B: $${off} off → $${payB}`,`Difference: ${pmoney(diff)}`]})}
      const m=p>off&&cheap!==(p>off?'A':'B')?`${p} is bigger than ${off}, but ${p}% is not $${p}. Work out ${p}% of $${P} first.`:`Work out ${p}% of $${P} in dollars, then compare.`;
      if(api.first('psC')){btn.disabled=true;btn.classList.add('no');api.retry($('psCM'),m);return}api.done(false,m,[`Shop A: ${p}% of $${P} = ${pmoney(D)} off`,`Shop B: $${off} off`])};$('psC').appendChild(btn)});return}
  if(type==='gst'){const P=pick([20,50,80,120,150,200,300,60]),G=P*9/100;
    api.q(`<p class="qt">The ${item.toLowerCase()} costs <b>$${P}</b> before GST. GST is <b>9%</b>. How much do you pay altogether?</p>`);
    api.body.innerHTML=`<div class="row">${tag(ic+' '+item,'$'+P,'+ 9% GST')}</div>`;
    askOne(api,{id:'psG1',label:'Step 1: how much is the GST?',pre:'<span class="askunit">$</span>',right:G,traps:[[9,`GST is 9% of $${P}, not $9.`],[P+G,'That is the total. First find just the GST.'],[P/9,`Do not divide by 9. 9% of $${P} = ${fr(9,100)} × $${P}.`]],
      then:()=>askOne(api,{id:'psG2',label:'Step 2: total price with GST?',pre:'<span class="askunit">$</span>',right:P+G,traps:[[G,`$${pmoney(G).slice(1)} is only the GST. Add it to the price.`],[P-G,'GST is a tax that is <b>added</b> to the price, not taken away.'],[P+9,`Add $${pmoney(G).slice(1)}, not $9.`]],
        ok:`$${P} + ${pmoney(G)} = ${pmoney(P+G)}`,work:[`GST = 9% of $${P} = ${fr(9,100)} × ${P} = ${pmoney(G)}`,`Total = $${P} + ${pmoney(G)} = ${pmoney(P+G)}`,`Or: 109% of $${P} = ${pmoney(P+G)}`]})});return}
  if(type==='whatPct'){const P=pick([40,50,80,60,120,200,25]),p=pick([10,20,25,30,40,15,5]),D=P*p/100;if(!Number.isInteger(D))return this.round(api,r);
    api.q(`<p class="qt">The ${item.toLowerCase()} was <b>$${P}</b>. Now it is <b>$${P-D}</b>. What percentage discount is that?</p>`);
    api.body.innerHTML=`<div class="row">${tag(ic+' Was','<s>$'+P+'</s>')}${tag(ic+' Now','$'+(P-D),'? % off')}</div>`;
    const wrongBase=Math.round(D/(P-D)*10000)/100;
    askOne(api,{id:'psP',unit:'%',w:4,right:p,traps:[[x=>near(x,wrongBase)||Math.abs(x-wrongBase)<.6,`You compared the discount with the <b>new</b> price. A discount percentage is always out of the <b>original</b> price ($${P}).`],[D,`$${D} is the discount in dollars. Write it as a percentage of $${P}.`],[100-p,'That is the percentage you still pay. The discount is the part you save.']],
      ok:`${pmoney(D)} out of $${P} = ${p}%`,work:[`Discount = $${P} − $${P-D} = ${pmoney(D)}`,`${fr(D,P)} × 100% = ${p}%`]});return}
  if(type==='interest'){const A=pick([500,800,1000,1200,2000,2500,4000]),p=pick([2,3,4,5,1.5,2.5]),I=A*p/100;
    api.q(`<p class="qt">Mrs Tan saves <b>$${fmt(A)}</b> in the bank to buy a ${item.toLowerCase()}. The bank pays <b>${p}% interest per year</b>. How much money will she have after 1 year?</p>`);
    api.body.innerHTML=`<div class="row">${tag('🏦 Savings','$'+fmt(A),p+'% per year')}</div>`;
    askOne(api,{id:'psI1',label:'Step 1: how much interest after 1 year?',pre:'<span class="askunit">$</span>',right:I,traps:[[A*p,`${p}% of $${A} is ${fr(p,100)} × ${A}, so divide by 100 as well.`],[p,`The interest is ${p}% of the savings, not $${p}.`]],
      then:()=>askOne(api,{id:'psI2',label:'Step 2: how much will she have?',pre:'<span class="askunit">$</span>',right:A+I,traps:[[I,`That is only the interest. She keeps her $${fmt(A)} too.`],[A-I,'Interest is extra money the bank <b>gives</b> you, so add.']],
        ok:`$${fmt(A)} + ${pmoney(I)} = ${pmoney(A+I)}`,work:[`Interest = ${p}% of $${fmt(A)} = ${pmoney(I)}`,`After 1 year: $${fmt(A)} + ${pmoney(I)} = ${pmoney(A+I)}`]})});return}
 }});

/* ================= P6. Pie Chart Bakery — reading and solving problems with pie charts ================= */
const BAKE=[['🧁','Cupcakes','#ffb3c7'],['🍩','Donuts','#ffd27a'],['🥐','Croissants','#f3c28b'],['🍪','Cookies','#c6a07b'],['🥧','Tarts','#bcd3fb'],['🍞','Bread','#bfe8cf'],['🎂','Cakes','#d9c6ff']];
function pieSvg(secs,o={}){const R0=96;let s='',a=-90;
  secs.forEach(sc=>{const a0=a,a1=a+sc.deg;a=a1;const r0=a0*Math.PI/180,r1=a1*Math.PI/180,big=sc.deg>180?1:0;
    s+=`<path d="M0 0 L${R0*Math.cos(r0)} ${R0*Math.sin(r0)} A${R0} ${R0} 0 ${big} 1 ${R0*Math.cos(r1)} ${R0*Math.sin(r1)} Z" fill="${sc.c}" stroke="var(--ink)" stroke-width="2"/>`;
    if(sc.deg===90&&o.rightMark){const m=14;s+=`<path d="M${m*Math.cos(r0)} ${m*Math.sin(r0)} L${m*Math.SQRT2*Math.cos((r0+r1)/2)} ${m*Math.SQRT2*Math.sin((r0+r1)/2)} L${m*Math.cos(r1)} ${m*Math.sin(r1)}" fill="none" stroke="var(--ink)" stroke-width="2"/>`}
    const mid=(r0+r1)/2,lr=sc.deg<40?R0+26:R0*.6;
    s+=`<text x="${lr*Math.cos(mid)}" y="${lr*Math.sin(mid)-4}" text-anchor="middle" font-size="18">${sc.e}</text><text x="${lr*Math.cos(mid)}" y="${lr*Math.sin(mid)+14}" text-anchor="middle" font-size="13" font-weight="800" fill="#16233a" class="${sc.deg<40?'pieout':''}">${sc.lab}</text>`});
  return `<div class="piewrap"><svg class="piec" viewBox="-130 -125 260 250" role="img" aria-label="Pie chart">${s}</svg><div class="pieleg">${secs.map(sc=>`<span><i style="background:${sc.c}"></i>${sc.e} ${sc.name}</span>`).join('')}</div></div>`}
addGame('p6-pie',{level:'P6',strand:'stat',glyph:'◔',title:'Pie Chart Bakery',topic:'Pie charts',
 how:'Read the bakery’s pie charts and solve problems about what was sold.',rounds:8,
 round(api,r){
  const type=['frac','pctQty','missing','total','angleQty','more','angleOf','fromAngle'][r];
  const B=shuffle(BAKE);
  const mk=(vals,labF)=>vals.map((v,i)=>({e:B[i][0],name:B[i][1],c:B[i][2],deg:v,lab:labF(v,i)}));
  if(type==='frac'){const set=pick([[90,180,90],[90,90,120,60],[180,90,45,45],[90,120,150],[60,90,90,120]]),k=set.indexOf(90),secs=mk(set,(v,i)=>i===k?'?':'');
    api.q(`<p class="qt">The pie chart shows the items sold at a bakery. What fraction of the items sold were <b>${secs[k].name.toLowerCase()}</b>?</p><p class="qs">The small square mark means a right angle.</p>`);
    api.body.innerHTML=pieSvg(secs,{rightMark:true});
    choiceRow(api,'pbF',[fr(1,4),fr(9,10),fr(1,3),fr(90,100)],fr(1,4),ok=>{if(ok)return api.done(true,`A right angle is 90°, and ${fr(90,360)} = ${fr(1,4)}.`,[`The whole circle is 360°.`,`${fr(90,360)} = ${fr(1,4)}`]);
      api.done(false,'A whole circle is 360°, not 100. The right angle is 90° out of 360°, so it is ¼ of the pie.',[`${fr(90,360)} = ${fr(1,4)}`])},'pbF');
    const box=$('pbFM');const orig=[...$('pbF').children];orig.forEach(b=>b.addEventListener('click',()=>{if(!api.answered&&box&&box.querySelector('.retrymsg')){const t=b.innerHTML;box.innerHTML=`<p class="retrymsg">🔁 ${t===fr(9,10)||t===fr(90,100)?'A whole circle is 360°, not 100. Compare 90° with 360°.':'Look at the angle mark: it is 90°. How many 90° parts make a full circle?'}</p>`}}));return}
  const total=pick([120,160,200,240,300,400,360,180]);
  if(type==='pctQty'||type==='more'||type==='missing'){let ps;do{ps=shuffle(pick([[40,25,20,15],[50,25,15,10],[35,30,20,15],[45,30,15,10],[30,30,25,15],[40,35,15,10]]))}while(false);
    if(type==='missing'){const k=R(0,3),secs=mk(ps.map(p=>p*3.6),(v,i)=>i===k?'?':ps[i]+'%');
      api.q(`<p class="qt">What percentage of the items sold were <b>${secs[k].name.toLowerCase()}</b>?</p>`);api.body.innerHTML=pieSvg(secs);const rest=100-ps[k];
      askOne(api,{id:'pbM',unit:'%',w:4,right:ps[k],traps:[[360-rest,'The percentages add up to <b>100%</b>, not 360. (360° is for angles.)'],[rest,`${rest}% is all the others added together. Take that away from 100%.`]],
        ok:`100% − ${rest}% = ${ps[k]}%`,work:[`The whole pie = 100%`,`${ps.filter((_,i)=>i!==k).join('% + ')}% = ${rest}%`,`100% − ${rest}% = ${ps[k]}%`]});return}
    const T=pick([200,400,600,800,120,240,1000].filter(t=>ps.every(p=>Number.isInteger(p*t/100))));const secs=mk(ps.map(p=>p*3.6),(v,i)=>ps[i]+'%');
    if(type==='pctQty'){const k=R(0,3),A=ps[k]*T/100;
      api.q(`<p class="qt">The bakery sold <b>${T}</b> items. How many <b>${secs[k].name.toLowerCase()}</b> were sold?</p>`);api.body.innerHTML=pieSvg(secs);
      askOne(api,{id:'pbQ',w:5,right:A,traps:[[ps[k],`${ps[k]}% is not ${ps[k]} items. Find ${ps[k]}% of ${T}.`],[ps[k]*3.6,'That is the angle of the sector. Use the percentage and the total.'],[T-A,'That is everything else.']],
        ok:`${ps[k]}% of ${T} = ${A}`,work:[`${ps[k]}% of ${T} = ${fr(ps[k],100)} × ${T} = ${A}`]});return}
    let i=0,j=1;while(ps[i]===ps[j]){j++}if(ps[i]<ps[j])[i,j]=[j,i];const dA=(ps[i]-ps[j])*T/100;
    api.q(`<p class="qt">The bakery sold <b>${T}</b> items. How many more <b>${secs[i].name.toLowerCase()}</b> than <b>${secs[j].name.toLowerCase()}</b> were sold?</p>`);api.body.innerHTML=pieSvg(secs);
    askOne(api,{id:'pbD',w:5,right:dA,traps:[[ps[i]-ps[j],`${ps[i]-ps[j]}% is the difference in percent. Change it to items: ${ps[i]-ps[j]}% of ${T}.`],[(ps[i]+ps[j])*T/100,'That is how many altogether. The question asks how many <b>more</b>.']],
      ok:`(${ps[i]}% − ${ps[j]}%) of ${T} = ${dA}`,work:[`Difference = ${ps[i]}% − ${ps[j]}% = ${ps[i]-ps[j]}%`,`${ps[i]-ps[j]}% of ${T} = ${dA}`]});return}
  if(type==='total'){const ps=shuffle(pick([[40,30,20,10],[50,20,20,10],[25,25,30,20],[45,25,20,10]])),k=R(0,3),n=pick([15,30,45,60,24,36]);
    const T=n*100/ps[k];if(!Number.isInteger(T))return this.round(api,r);const secs=mk(ps.map(p=>p*3.6),(v,i)=>ps[i]+'%');
    api.q(`<p class="qt">The bakery sold <b>${n}</b> ${secs[k].name.toLowerCase()}. How many items did it sell altogether?</p>`);api.body.innerHTML=pieSvg(secs);
    askOne(api,{id:'pbT',w:5,right:T,traps:[[n*ps[k],`${n} × ${ps[k]} is too big. ${ps[k]}% → ${n} items, so 1% → ${n} ÷ ${ps[k]}, then 100% → × 100.`],[n*ps[k]/100,`That would be ${ps[k]}% of ${n}. But ${n} <b>is</b> the ${ps[k]}%. Work back to 100%.`],[100-n,'Use the percentage, not 100 − the number.']],
      ok:`${ps[k]}% → ${n}, so 100% → ${T}`,work:[`${ps[k]}% → ${n}`,`1% → ${n} ÷ ${ps[k]} = ${n/ps[k]}`,`100% → ${n/ps[k]} × 100 = ${T}`]});return}
  if(type==='angleQty'||type==='angleOf'||type==='fromAngle'){const degs=shuffle(pick([[72,108,90,90],[120,90,90,60],[144,72,72,72],[60,120,150,30],[36,144,108,72],[45,135,90,90]])),T=pick([180,240,720,120,480,600].filter(t=>degs.every(d=>Number.isInteger(d*t/360))));
    const k=degs.findIndex(d=>d!==90&&d!==180)>=0?degs.findIndex(d=>d!==90&&d!==180):0,A=degs[k]*T/360;
    if(type==='angleQty'){const secs=mk(degs,(v,i)=>v+'°');
      api.q(`<p class="qt">The bakery sold <b>${T}</b> items. How many were <b>${secs[k].name.toLowerCase()}</b>?</p>`);api.body.innerHTML=pieSvg(secs);
      askOne(api,{id:'pbA',w:5,right:A,traps:[[degs[k],`${degs[k]} is the angle, not the number of items. The angle tells you the fraction: ${fr(degs[k],360)} of the whole.`],[degs[k]*T/100,'A whole circle is 360°, not 100. Use the angle out of 360°.']],
        ok:`${fr(degs[k],360)} × ${T} = ${A}`,work:[`Fraction = ${fr(degs[k],360)} = ${nice(degs[k],360)}`,`${nice(degs[k],360)} × ${T} = ${A}`]});return}
    if(type==='angleOf'){const secs=mk(degs,(v,i)=>i===k?'?':'');
      api.q(`<p class="qt">The bakery sold <b>${T}</b> items. <b>${A}</b> of them were ${secs[k].name.toLowerCase()}. What is the angle of the ${secs[k].name.toLowerCase()} sector?</p>`);api.body.innerHTML=pieSvg(secs);
      askOne(api,{id:'pbG',unit:'°',w:4,right:degs[k],traps:[[A,`${A} is the number of ${secs[k].name.toLowerCase()}. Change it to a fraction of ${T}, then of 360°.`],[A*100/T,`${A*100/T} is the percentage. A whole circle is 360°, so find ${fr(A,T)} of 360°.`]],
        ok:`${fr(A,T)} × 360° = ${degs[k]}°`,work:[`Fraction = ${fr(A,T)} = ${nice(A,T)}`,`${nice(A,T)} × 360° = ${degs[k]}°`]});return}
    const secs=mk(degs,(v,i)=>i===k?v+'°':'');
    api.q(`<p class="qt">The ${secs[k].name.toLowerCase()} sector is <b>${degs[k]}°</b> and stands for <b>${A}</b> items. How many items were sold altogether?</p>`);api.body.innerHTML=pieSvg(secs);
    askOne(api,{id:'pbW',w:5,right:T,traps:[[A*degs[k],`${A} × ${degs[k]} is far too many. ${degs[k]}° → ${A} items, so work out what 1° stands for, then 360°.`],[A*100/degs[k],'A whole circle is 360°, not 100°.'],[A*360,`That would be if 1° stood for ${A} items. But ${degs[k]}° stands for ${A}.`]],
      ok:`${degs[k]}° → ${A}, so 360° → ${T}`,work:[`${degs[k]}° → ${A}`,`360° is ${nice(360,degs[k])} times as much`,`${A} × ${nice(360,degs[k])} = ${T}`]});return}
 }});
