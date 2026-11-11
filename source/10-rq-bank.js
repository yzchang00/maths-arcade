/* ================= PSLE QUEST: question bank =================
   Modelled on the 2026 P6 prelim papers: Paper 1 Booklet A (MCQ, no calculator),
   Paper 1 Booklet B (short answer, no calculator), Paper 2 (short + long answer, calculator allowed).
   Each generator returns {stem, fig, parts:[...], work:[...]} with fresh numbers every time. */
const RQB=[];const rq=o=>RQB.push(o);
const RQT={whole:'Whole numbers',frac:'Fractions',dec:'Decimals',pct:'Percentage',ratio:'Ratio',rate:'Rate',alg:'Algebra',avg:'Average',meas:'Time, money and units',angle:'Angles and figures',area:'Area and perimeter',circ:'Circles',vol:'Volume',solid:'Solids and nets',pat:'Patterns',data:'Graphs and charts'};
const r6=x=>Math.round(x*1e6)/1e6;
function fmtN(x){x=r6(x);const neg=x<0;x=Math.abs(x);let [i,d]=String(x).split('.');i=i.replace(/\B(?=(\d{3})+(?!\d))/g,',');return (neg?'−':'')+i+(d?'.'+d:'')}
const $m=x=>{x=r6(x);if(Number.isInteger(x))return '$'+fmtN(x);const [i,d]=x.toFixed(2).split('.');return '$'+fmtN(+i)+'.'+d};
const vi=v=>`<i>${v}</i>`;
const lin=(c,v,k)=>{let s=c===0?'':(c===1?'':c===-1?'−':c)+vi(v);if(k)s+=s?(k>0?` + ${k}`:` − ${-k}`):String(k);return s||'0'};
const Qn=(n,d=1)=>{if(d<0){n=-n;d=-d}const g=gcd(Math.abs(n),d)||1;return [n/g,d/g]};
const Qadd=(a,b)=>Qn(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),Qsub=(a,b)=>Qn(a[0]*b[1]-b[0]*a[1],a[1]*b[1]),Qmul=(a,b)=>Qn(a[0]*b[0],a[1]*b[1]),Qdiv=(a,b)=>Qn(a[0]*b[1],a[1]*b[0]);
const Qh=q=>q[1]===1?String(q[0]):nice(q[0],q[1]),Qv=q=>q[0]/q[1];
const Qf=q=>q[1]===1?String(q[0]):fr(q[0],q[1]); // proper/improper, no mixed
/* MCQ options: answer + distractors, deduped; numbers sorted ascending like the papers */
function mc(a,ds,f=String,keep){const seen=new Set([f(a)]),o=[a];
  for(const d of ds){if(d===undefined||d===null||(typeof d==='number'&&(!isFinite(d)||d<=0)))continue;const s=f(d);if(seen.has(s))continue;seen.add(s);o.push(d);if(o.length===4)break}
  let k=1;while(o.length<4&&typeof a==='number'&&k<60){const d=r6(a+Math.ceil(k/2)*(k%2?1:-1)*Math.max(1,Math.round(Math.abs(a)*.1)));k++;const s=f(d);if(d>0&&!seen.has(s)){seen.add(s);o.push(d)}}
  const opts=typeof a==='number'&&!keep?o.slice().sort((x,y)=>x-y):shuffle(o);return {type:'choice',opts:opts.map(f),ans:opts.indexOf(a)}}
const num=(v,o={})=>Object.assign({type:'num',v,marks:1},o);
const RQPV=['ones','tens','hundreds','thousands','ten thousands','hundred thousands'];
const tm=m=>{const h=Math.floor(m/60),mm=m%60;return (h?`${h} h`:'')+(h&&mm?' ':'')+(mm||!h?`${mm} min`:'')};
const clock=m=>{m=((m%1440)+1440)%1440;let h=Math.floor(m/60);const mm=m%60,ap=h<12?'a.m.':'p.m.';h=h%12||12;return `${h}.${String(mm).padStart(2,'0')} ${ap}`};

/* ---------- SVG helpers ---------- */
const svgW=(w,h,inner,mw)=>`<svg class="gsvg rqf" viewBox="0 0 ${w} ${h}" style="max-width:${mw||w}px" role="img">${inner}</svg>`;
const tx=(x,y,s,a='middle',c='')=>`<text x="${r6(x)}" y="${r6(y)}" text-anchor="${a}" ${c?`class="${c}"`:''}>${s}</text>`;
const ln=(a,b,c='')=>`<line x1="${r6(a[0])}" y1="${r6(a[1])}" x2="${r6(b[0])}" y2="${r6(b[1])}" ${c?`class="${c}"`:''}/>`;
const PG=(pts,c='')=>`<polygon points="${pts.map(p=>r6(p[0])+','+r6(p[1])).join(' ')}" ${c?`class="${c}"`:''}/>`;
const deg=Math.PI/180;
/* angle arc at vertex v between directions to a and b, with label */
function angArc(v,a,b,label,r=22){const a1=Math.atan2(a[1]-v[1],a[0]-v[0]),a2=Math.atan2(b[1]-v[1],b[0]-v[0]);let d=a2-a1;while(d<=-Math.PI)d+=2*Math.PI;while(d>Math.PI)d-=2*Math.PI;
  const p1=[v[0]+r*Math.cos(a1),v[1]+r*Math.sin(a1)],p2=[v[0]+r*Math.cos(a1+d),v[1]+r*Math.sin(a1+d)],m=a1+d/2,lr=r+15;
  return `<path class="arc" d="M${r6(p1[0])} ${r6(p1[1])} A${r} ${r} 0 0 ${d>0?1:0} ${r6(p2[0])} ${r6(p2[1])}"/>`+(label?tx(v[0]+lr*Math.cos(m),v[1]+lr*Math.sin(m)+4,label,'middle','ang'):'')}
const tk=(a,b)=>{const m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),nx=-dy/l*6,ny=dx/l*6;return ln([m[0]-nx,m[1]-ny],[m[0]+nx,m[1]+ny],'thin')};
const lab=(p,s,dx=0,dy=0)=>tx(p[0]+dx,p[1]+dy,s,'middle','ptl');
function barChart(cats,vals,max,step,minor,ylab,hide){const W=460,H=250,x0=70,y0=20,y1=205,x1=W-12,bw=(x1-x0)/cats.length;let s='';
  for(let v=0;v<=max;v+=minor){const y=y1-(y1-y0)*v/max;s+=ln([x0,y],[x1,y],v%step===0?'gr2':'gr');if(v%step===0)s+=tx(x0-6,y+4,v,'end')}
  s+=ln([x0,y0],[x0,y1])+ln([x0,y1],[x1,y1]);
  cats.forEach((c,i)=>{const cx=x0+bw*(i+.5);if(!(hide&&hide.includes(i))){const h=(y1-y0)*vals[i]/max;s+=`<rect class="bar" x="${r6(cx-bw*.28)}" y="${r6(y1-h)}" width="${r6(bw*.56)}" height="${r6(h)}"/>`}s+=tx(cx,y1+18,c)});
  s+=`<text x="16" y="${(y0+y1)/2}" text-anchor="middle" transform="rotate(-90 16 ${(y0+y1)/2})">${ylab}</text>`;return svgW(W,H,s,460)}
function lineGraph(series,xmax,xstep,ymax,ystep,yminor,xlab,ylab,xfmt=v=>v){const W=470,H=290,x0=70,x1=W-16,y0=16,y1=232;let s='';const X=v=>x0+(x1-x0)*v/xmax,Y=v=>y1-(y1-y0)*v/ymax;
  for(let v=0;v<=ymax;v+=yminor){s+=ln([x0,Y(v)],[x1,Y(v)],v%ystep===0?'gr2':'gr');if(v%ystep===0)s+=tx(x0-6,Y(v)+4,v,'end')}
  for(let v=0;v<=xmax;v+=xstep){s+=ln([X(v),y0],[X(v),y1],'gr2');s+=tx(X(v),y1+17,xfmt(v))}
  s+=ln([x0,y0],[x0,y1])+ln([x0,y1],[x1,y1]);
  series.forEach(pts=>{s+=`<polyline class="plot" points="${pts.map(p=>r6(X(p[0]))+','+r6(Y(p[1]))).join(' ')}"/>`});
  s+=tx((x0+x1)/2,H-6,xlab)+`<text x="16" y="${(y0+y1)/2}" text-anchor="middle" transform="rotate(-90 16 ${(y0+y1)/2})">${ylab}</text>`;return svgW(W,H,s,470)}
function pieChart(secs){/* secs: [{f:fraction of circle, label, right:bool}] starting at 12 o'clock clockwise */
  const cx=150,cy=125,r=100;let s=`<circle cx="${cx}" cy="${cy}" r="${r}"/>`,a=-90;
  secs.forEach(sc=>{const a2=a+sc.f*360,p=[cx+r*Math.cos(a*deg),cy+r*Math.sin(a*deg)];s+=ln([cx,cy],p);
    const m=(a+a2)/2,lr=sc.f<.12?r*.72:r*.55;s+=tx(cx+lr*Math.cos(m*deg),cy+lr*Math.sin(m*deg)+4,sc.label);
    if(sc.right){const u=[Math.cos(a*deg),Math.sin(a*deg)],w=[Math.cos(a2*deg),Math.sin(a2*deg)],k=13;s+=`<polyline class="thin" points="${r6(cx+u[0]*k)},${r6(cy+u[1]*k)} ${r6(cx+(u[0]+w[0])*k)},${r6(cy+(u[1]+w[1])*k)} ${r6(cx+w[0]*k)},${r6(cy+w[1]*k)}"/>`}
    if(sc.sub)s+=tx(cx+lr*Math.cos(m*deg),cy+lr*Math.sin(m*deg)+20,sc.sub);a=a2});return svgW(300,250,s,300)}
function tableH(head,rows){return `<table class="rqt"><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</table>`}

/* =============== BOOKLET A: 1-mark MCQ =============== */
rq({id:'place',kind:'mcq1',topic:'whole',make(){const p=R(1,5),d=R(2,9);let n='';for(let i=5;i>=0;i--)n+=i===p?d:pick([0,1,2,3,4,5,6,7,8,9].filter(x=>x!==d&&!(i===5&&x===0)));
  const v=d*10**p;return {stem:`What does the digit ${d} in ${fmtN(+n)} stand for?`,parts:[Object.assign(mc(v,[1,2,3,4,5,0].filter(x=>x!==p).map(x=>d*10**x),fmtN),{marks:1})],
  work:[`The digit ${d} is in the <b>${RQPV[p]}</b> place.`,`So it stands for ${d} × ${fmtN(10**p)} = <b>${fmtN(v)}</b>.`]}}});
rq({id:'decplace',kind:'mcq1',topic:'dec',make(){if(Math.random()<.5){const ds=shuffle([1,2,3,4,5,6,7,8,9]).slice(0,4),x=`${ds[0]}${ds[1]}.${ds[2]}${ds[3]}`,w=pick([['tenths',2],['hundredths',3],['tens',0]]);
    return {stem:`In ${x}, which digit is in the <b>${w[0]}</b> place?`,parts:[Object.assign(mc(ds[w[1]],ds.filter((_,i)=>i!==w[1])),{marks:1})],work:[`${x}: ${ds[0]} tens, ${ds[1]} ones, ${ds[2]} tenths, ${ds[3]} hundredths.`,`The ${w[0]} digit is <b>${ds[w[1]]}</b>.`]}}
  let n;do n=R(1001,9999);while(n%10===0||n%100<10);const c=Math.round(n/10)/100;
  return {stem:`Round ${fmtN(n/1000)} to 2 decimal places.`,parts:[Object.assign(mc(c,[Math.floor(n/10)/100===c?r6(c+.01):Math.floor(n/10)/100,Math.round(n/100)/10,r6(c-.01),r6(c+.02)],x=>x.toFixed(2)),{marks:1})],
    work:[`Look at the 3rd decimal place: ${n%10}. It is ${n%10>=5?'5 or more, so round up':'less than 5, so round down'}.`,`${fmtN(n/1000)} ≈ <b>${c.toFixed(2)}</b>`]}}});
rq({id:'numline',kind:'mcq1',topic:'dec',make(){const span=pick([1,2]),n=span===1?pick([4,5,8,10]):pick([4,8,10]),a=R(1,8),k=R(1,n-1),st=span/n,v=r6(a+k*st);
  const W=440,x0=40,x1=400,y=70;let s=ln([x0-18,y],[x1+18,y]);for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n;s+=ln([x,y-8],[x,y+8])}
  s+=tx(x0,y+30,a)+tx(x1,y+30,a+span);const xa=x0+(x1-x0)*k/n;s+=ln([xa,y-42],[xa,y-16])+`<path class="fi" d="M${xa} ${y-10} l-6 -10 h12z"/>`+tx(xa,y-48,'A','middle','ptl');
  return {stem:'In the number line, what is the value represented by A?',fig:svgW(W,110,s,440),parts:[Object.assign(mc(v,[r6(a+k*.1),r6(a+(k+1)*st),r6(a+k*st*2),r6(a+(k-1)*st),r6(a+k/(n+1)*span)],x=>fmtN(x)),{marks:1})],
    work:[`From ${a} to ${a+span} there are ${n} equal intervals, so each interval is ${span} ÷ ${n} = ${fmtN(st)}.`,`A is ${k} intervals after ${a}: ${a} + ${k} × ${fmtN(st)} = <b>${fmtN(v)}</b>`]}}});
rq({id:'improper',kind:'mcq1',topic:'frac',make(){const w=R(2,9),b=R(3,12),a=R(1,b-1),v=w*b+a;
  return {stem:`What is the missing number in the box?<div class="rqeq">${w}${fr(a,b)} = ${fr('<span class="rqbox"></span>',b)}</div>`,parts:[Object.assign(mc(v,[w*b,w*a+b,a*b+w,w*b-a,(w+a)*b]),{marks:1})],
    work:[`${w} wholes = ${w} × ${b} = ${w*b} ${b}ths.`,`${w*b} + ${a} = <b>${v}</b>, so ${w}${fr(a,b)} = ${fr(v,b)}.`]}}});
rq({id:'convert',kind:'mcq1',topic:'meas',make(){const t=R(0,2);
  if(t===0){const k=R(1,9),g=pick([R(1,9),R(11,99)]),v=r6(k+g/1000);return {stem:`${k} kg ${g} g = ______ kg`,parts:[Object.assign(mc(v,[r6(k+g/100),r6(k+g/10000),r6(k+g/10)],fmtN),{marks:1})],work:[`1 kg = 1000 g, so ${g} g = ${g} ÷ 1000 = ${fmtN(g/1000)} kg.`,`${k} kg ${g} g = <b>${fmtN(v)} kg</b>`]}}
  if(t===1){const l=R(1,9),ml=pick([R(1,9),R(11,99)]),v=l*1000+ml;return {stem:`${l} ℓ ${ml} ml = ______ ml`,parts:[Object.assign(mc(v,[l*1000+ml*10,l*100+ml,l*1000+ml*100,l*10000+ml]),{marks:1})],work:[`1 ℓ = 1000 ml, so ${l} ℓ = ${fmtN(l*1000)} ml.`,`${fmtN(l*1000)} + ${ml} = <b>${fmtN(v)} ml</b>`]}}
  const h=R(1,5),d=pick([5,15,2,25,35,4,45,55,6,65,75,8,85,95]),dd=d<10?d/10:d/100,mn=Math.round(dd*60),f=(a,b)=>`${a} h ${b} min`,dstr=String(dd).slice(1);
  return {stem:`${h}${dstr} h = ______`,parts:[Object.assign(mc(f(h,mn),[f(h,Math.round(dd*100)),f(h,Math.round(dd*10)),f(h,(mn+10)%60||5),f(h+1,mn)]),{marks:1})],work:[`${dstr} h = ${dstr} × 60 min = ${mn} min.`,`${h}${dstr} h = <b>${f(h,mn)}</b>`]}}});
rq({id:'pctof',kind:'mcq1',topic:'pct',make(){if(Math.random()<.5){const p=pick([5,15,20,25,30,35,40,45,60,75]),N=R(4,30)*20,v=p*N/100;
    return {stem:`What is ${p}% of ${fmtN(N)}?`,parts:[Object.assign(mc(v,[N*p/10,N-v,v*2,v+p]),{marks:1})],work:[`${p}% of ${fmtN(N)} = ${fr(p,100)} × ${fmtN(N)} = <b>${fmtN(v)}</b>`]}}
  const [a,b]=pick([[3,8],[5,8],[7,8],[1,8],[3,4],[2,5],[7,20],[9,25],[3,40],[13,50],[4,25],[11,20]]),v=r6(a/b*100);
  return {stem:`Express ${fr(a,b)} as a percentage.`,parts:[Object.assign(mc(v,[r6(a/b),r6(a/b*10),Math.round(v)===v?v+5:Math.round(v),r6(b/a*10)],x=>fmtN(x)+'%'),{marks:1})],work:[`${fr(a,b)} × 100% = <b>${fmtN(v)}%</b>`]}}});
rq({id:'simplify',kind:'mcq1',topic:'alg',make(){const v=pick(['k','p','m','y','w','n']),c=R(1,6),a=c+R(2,8),d=R(1,6),b=d+R(1,9);
  return {stem:`Simplify ${a}${vi(v)} + ${b} − ${c}${vi(v)} − ${d}.`,parts:[Object.assign(mc(lin(a-c,v,b-d),[lin(a+c,v,b-d),lin(a-c,v,b+d),lin(a-c+b-d,v,0),lin(a+c,v,b+d)]),{marks:1})],
    work:[`Group the ${vi(v)} terms: ${a}${vi(v)} − ${c}${vi(v)} = ${lin(a-c,v,0)}`,`Group the numbers: ${b} − ${d} = ${b-d}`,`Answer: <b>${lin(a-c,v,b-d)}</b>`]}}});
rq({id:'commult',kind:'mcq1',topic:'whole',make(){if(Math.random()<.5){let a,b;do{[a,b]=shuffle([4,6,8,9,10,12,15]).slice(0,2)}while(lcm(a,b)>72);const L2=lcm(a,b),v=L2*R(1,2);
    const ds=shuffle([...Array(140).keys()].filter(m=>m>9&&((m%a===0)!==(m%b===0))));
    return {stem:`Which of the following is a common multiple of ${a} and ${b}?`,parts:[Object.assign(mc(v,ds),{marks:1})],work:[`Multiples of ${a} and ${b} in common are multiples of their LCM, ${L2}.`,`<b>${v}</b> = ${L2} × ${v/L2}, so it is a multiple of both.`]}}
  const [x,y]=pick([[24,36],[18,30],[16,40],[20,30],[27,45],[24,42],[28,42],[32,48]]),cf=[...Array(x+1).keys()].filter(f=>f>1&&x%f===0&&y%f===0),v=pick(cf);
  const ds=shuffle([...Array(Math.max(x,y)+1).keys()].filter(f=>f>1&&((x%f===0)!==(y%f===0))));
  return {stem:`Which of the following is a common factor of ${x} and ${y}?`,parts:[Object.assign(mc(v,ds),{marks:1})],work:[`Common factors of ${x} and ${y}: 1, ${cf.join(', ')}.`,`So <b>${v}</b> is a common factor.`]}}});
rq({id:'bargraph',kind:'mcq1',topic:'data',make(){const days=['Mon','Tue','Wed','Thu','Fri'];let vals,S,pairs;
  do{vals=days.map(()=>R(5,29)*2);pairs=[];for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)pairs.push([i,j,vals[i]+vals[j]]);const p=pick(pairs);S=p[2];var good=pairs.filter(q=>q[2]===S).length===1;var ans=p}while(!good);
  const full=['Monday','Tuesday','Wednesday','Thursday','Friday'],f=p=>`${full[p[0]]} and ${full[p[1]]}`;
  return {stem:`The bar graph shows the number of apples sold in a shop from Monday to Friday. On which two days were ${S} apples sold altogether?`,fig:barChart(days,vals,60,10,2,'Number of apples sold'),
    parts:[Object.assign(mc(f(ans),shuffle(pairs.filter(q=>q!==ans)).map(f)),{marks:1})],work:[`Read each bar: ${days.map((d,i)=>`${d} ${vals[i]}`).join(', ')}.`,`${vals[ans[0]]} + ${vals[ans[1]]} = ${S}, so the answer is <b>${f(ans)}</b>.`]}}});
rq({id:'ratiosimp',kind:'mcq1',topic:'ratio',make(){let a,b;do{a=R(2,9)*R(2,6);b=R(2,9)*R(2,6)}while(a===b||gcd(a,b)<2);const g=gcd(a,b),G=gcd(b,a+b);
  return {stem:`There are ${a} boys and ${b} girls in a club. What is the ratio of the number of girls to the total number of children?`,parts:[Object.assign(mc(`${b/G} : ${(a+b)/G}`,[`${b/g} : ${a/g}`,`${a/g} : ${b/g}`,`${a/gcd(a,a+b)} : ${(a+b)/gcd(a,a+b)}`,`${(a+b)/G} : ${b/G}`]),{marks:1})],
    work:[`Total = ${a} + ${b} = ${a+b}.`,`Girls : Total = ${b} : ${a+b} = <b>${b/G} : ${(a+b)/G}</b> (divide both by ${G}).`]}}});
rq({id:'avgmiss1',kind:'mcq1',topic:'avg',make(){const X=R(12,40),a=R(X-8,X+8),b=R(X-8,X+8),c=R(X-8,X+8),v=4*X-a-b-c;if(v<=0)return this.make();
  return {stem:`The average of 4 numbers is ${X}. Three of the numbers are ${a}, ${b} and ${c}. What is the fourth number?`,parts:[Object.assign(mc(v,[X,3*X-a-b-c>0?3*X-a-b-c:v+X,Math.round((a+b+c)/3),v+4]),{marks:1})],
    work:[`Total of 4 numbers = 4 × ${X} = ${4*X}`,`Fourth number = ${4*X} − ${a} − ${b} − ${c} = <b>${v}</b>`]}}});
rq({id:'endtime',kind:'mcq1',topic:'meas',make(){const s=R(14,40)*30+pick([0,15,45]),d=R(1,2)*60+R(2,11)*5,e=s+d;
  return {stem:`A movie started at ${clock(s)} It lasted ${tm(d)}. At what time did it end?`,parts:[Object.assign(mc(clock(e),[clock(e-60),clock(e+60),clock(e-10),clock(e+10)]),{marks:1})],
    work:[`${clock(s)} + ${Math.floor(d/60)} h = ${clock(s+Math.floor(d/60)*60)}`,`+ ${d%60} min = <b>${clock(e)}</b>`]}}});

/* =============== BOOKLET A: 2-mark MCQ =============== */
rq({id:'discount',kind:'mcq2',topic:'pct',make(){const d=pick([10,15,20,25,30,35,40]),U=R(6,40)*20,P=U*(100-d)/100;
  return {stem:`<div class="rqsale"><b>SALE</b><span>${d}% discount off the usual price</span></div>Raju paid ${$m(P)} for a smart watch during the sale. What was the usual price of the smart watch before the discount?`,
    parts:[Object.assign(mc(U,[r6(P*(100+d)/100),r6(P*(100-d)/100),P+d,r6(U+P*d/100)],$m),{marks:2})],
    work:[`After a ${d}% discount, Raju paid ${100-d}% of the usual price.`,`${100-d}% → ${$m(P)}, so 1% → ${$m(P)} ÷ ${100-d} = ${$m(P/(100-d))}`,`100% → <b>${$m(U)}</b>`]}}});
rq({id:'shortleft',kind:'mcq2',topic:'meas',make(){const p=R(8,25)*10,n1=R(7,12),n2=R(2,n1-3),l=R(1,p/10-1)*10,M=n2*p+l,s=n1*p-M;
  return {stem:`Mathew wanted to buy ${n1} buns but found that he was short of ${$m(s/100)}. In the end, he bought ${n2} buns and had ${$m(l/100)} left. How much money did Mathew have at first?`,
    parts:[Object.assign(mc(M/100,[n1*p/100,(M+s)/100+.5,n2*p/100,(s+l)/100,(n1*p+s)/100],$m),{marks:2})],
    work:[`${n1} buns − ${n2} buns = ${n1-n2} buns cost ${$m(s/100)} + ${$m(l/100)} = ${$m((s+l)/100)}`,`1 bun costs ${$m((s+l)/100)} ÷ ${n1-n2} = ${$m(p/100)}`,`Money at first = ${n2} × ${$m(p/100)} + ${$m(l/100)} = <b>${$m(M/100)}</b>`]}}});
rq({id:'patsum',kind:'mcq2',topic:'pat',make(){const blk=shuffle([1,2,3,4,5].slice(0,R(3,4)).concat([R(1,5)])).slice(0,R(3,4)),k=blk.length,S=blk.reduce((a,b)=>a+b,0);let n;do n=R(40,99);while(n%k===0);
  const full=Math.floor(n/k),rem=n%k,v=full*S+blk.slice(0,rem).reduce((a,b)=>a+b,0),shown=[];for(let i=0;i<k*3+1;i++)shown.push(blk[i%k]);
  return {stem:`The first ${shown.length} numbers of a number pattern are given below.<div class="rqeq rqpat">${shown.join('&ensp;')}&ensp;…</div>What is the sum of the first ${n} numbers?`,
    parts:[Object.assign(mc(v,[full*S,v+blk[rem],v-blk[rem-1],(full+1)*S]),{marks:2})],
    work:[`The group ${blk.join(', ')} repeats every ${k} numbers. Sum of one group = ${S}.`,`${n} ÷ ${k} = ${full} groups remainder ${rem}.`,`Sum = ${full} × ${S} + (${blk.slice(0,rem).join(' + ')}) = <b>${v}</b>`]}}});
rq({id:'steprate',kind:'mcq2',topic:'rate',make(){const a=R(10,36)*25/100,b=R(4,12)*10/100,st=R(16,40)*30+R(0,5)*5,e=R(12,13)+R(1,9)*10,ex=e,dur=60+ex,blocks=Math.ceil(ex/10),v=r6(a+blocks*b);
  const fig=tableH(['Charging duration','Rate'],[['First 1 hour',$m(a)],['Every additional 10 minutes or part thereof',$m(b)]]);
  return {stem:`Mohan charged his electric car from ${clock(st)} to ${clock(st+dur)} The charging rates are shown in the table. How much did Mohan pay?`,fig,
    parts:[Object.assign(mc(v,[r6(a+Math.floor(ex/10)*b),r6(a+Math.ceil(dur/10)*b),r6(a+(blocks+1)*b),r6(Math.ceil(dur/10)*b)],$m),{marks:2})],
    work:[`Time charged = ${tm(dur)} = 1 h + ${ex} min.`,`${ex} min = ${Math.floor(ex/10)} × 10 min${ex%10?` + ${ex%10} min (part of 10 min counts as a whole block)`:''} → ${blocks} blocks.`,`Cost = ${$m(a)} + ${blocks} × ${$m(b)} = <b>${$m(v)}</b>`]}}});
rq({id:'rolls',kind:'mcq2',topic:'whole',make(){let Lp,Rl,N,per,v;do{Lp=pick([3,4,6,7]);Rl=pick([20,25,30,50]);N=R(30,120);per=Math.floor(Rl/Lp);v=Math.ceil(N/per)}while(Rl%Lp===0||Math.ceil(N*Lp/Rl)===v);
  return {stem:`Alex needs ${N} pieces of wire, each ${Lp} m long. The wire is sold in rolls of ${Rl} m. What is the least number of rolls Alex must buy?`,
    parts:[Object.assign(mc(v,[Math.ceil(N*Lp/Rl),Math.floor(N/per),v+1,Math.floor(N*Lp/Rl)]),{marks:2})],
    work:[`Each ${Rl} m roll gives ${Rl} ÷ ${Lp} = ${per} pieces (remainder ${Rl%Lp} m is wasted).`,`${N} ÷ ${per} = ${Math.floor(N/per)} rem ${N%per}${N%per?', so 1 more roll is needed':''}.`,`Least number of rolls = <b>${v}</b>`]}}});
rq({id:'sqangle',kind:'mcq2',topic:'angle',make(){const th=pick([20,24,28,30,32,36,40,44,48,50,56,60,64,70]),v=(90-th)/2;
  const B=[50,30],C=[230,30],A=[50,210],D=[230,210],E=[C[0]-180*Math.cos(th*deg),C[1]+180*Math.sin(th*deg)];
  const s=PG([B,C,D,A])+ln(B,E)+ln(C,E)+ln(E,D)+tk(B,C)+tk(C,E)+angArc(C,B,E,th+'°',26)+lab(B,'B',-10,-6)+lab(C,'C',10,-6)+lab(A,'A',-10,14)+lab(D,'D',10,14)+lab(E,'E',-12,4);
  return {stem:`In the figure, ABCD is a square. BC = CE and ∠BCE = ${th}°. Find ∠EDA.`,fig:svgW(280,240,s,280),parts:[Object.assign(mc(v,[th,(90+th)/2,90-th,(180-th)/2]),{marks:2})].map(p=>(p.opts=p.opts.map(x=>x+'°'),p)),
    work:[`CE = BC = CD (sides of a square), so triangle CDE is isosceles.`,`∠ECD = 90° − ${th}° = ${90-th}°`,`∠CDE = (180° − ${90-th}°) ÷ 2 = ${(90+th)/2}°`,`∠EDA = 90° − ${(90+th)/2}° = <b>${v}°</b>`]}}});
rq({id:'ring',kind:'mcq2',topic:'circ',make(){const use7=Math.random()<.5,D=use7?pick([14,28,42]):pick([10,20,30,40]),d=D/2,pi=use7?22/7:3.14,v=r6(pi*D/2+pi*d/2+(D-d));
  const cx=150,cy=130,Rr=120,rr=60;const s=`<path class="sh" d="M${cx-Rr} ${cy} A${Rr} ${Rr} 0 0 1 ${cx+Rr} ${cy} L${cx+rr} ${cy} A${rr} ${rr} 0 0 0 ${cx-rr} ${cy} Z"/>`+ln([cx-rr,cy+16],[cx+rr,cy+16],'thin')+tx(cx,cy+30,d+' cm')+ln([cx-Rr,cy+44],[cx+Rr,cy+44],'thin')+tx(cx,cy+58,D+' cm');
  return {stem:`The diameters of the big semicircle and the small semicircle are ${D} cm and ${d} cm. Find the perimeter of the shaded figure. (Take π = ${use7?'22/7':'3.14'})`,fig:svgW(300,200,s,300),
    parts:[Object.assign(mc(v,[r6(pi*D/2+pi*d/2),r6(pi*D/2+pi*d/2+D),r6(pi*D+pi*d+(D-d)),r6(pi*D/2+(D-d))],x=>fmtN(x)+' cm'),{marks:2})],
    work:[`Big arc = ½ × π × ${D} = ${fmtN(pi*D/2)} cm`,`Small arc = ½ × π × ${d} = ${fmtN(pi*d/2)} cm`,`Two straight ends = 2 × ${(D-d)/2} = ${D-d} cm`,`Perimeter = <b>${fmtN(v)} cm</b>`]}}});
rq({id:'givenaway',kind:'mcq2',topic:'frac',make(){let f1,f2,v,g1,g2;do{[f1,f2]=shuffle([[1,2],[2,3],[3,4],[3,5],[2,5],[1,3],[4,5],[5,8]]).slice(0,2);g1=Qsub([1,1],f1);g2=Qsub([1,1],f2);v=Qdiv(Qmul([2,1],Qmul(g1,g2)),Qadd(g1,g2))}while(v[1]>30);
  const dd=[Qadd(g1,g2),Qn(g1[0]*g2[1]+g2[0]*g1[1],2*g1[1]*g2[1]),Qmul(g1,g2),Qsub([1,1],v),Qmul(v,[1,2]),Qn(1,2),Qn(1,3),Qn(2,5),Qmul(Qadd(g1,g2),[1,3])].filter(q=>Qv(q)<1&&Qv(q)>0);
  return {stem:`Mrs Tan bought some purple and blue pens. After giving away an equal number of purple and blue pens, she had ${fr(f1[0],f1[1])} of the purple pens and ${fr(f2[0],f2[1])} of the blue pens left. What fraction of the pens Mrs Tan bought were given away?`,
    parts:[Object.assign(mc(Qf(v),dd.map(Qf)),{marks:2})],
    work:[`Given away: ${Qf(g1)} of purple = ${Qf(g2)} of blue.`,`Make the numerators the same: purple : blue = ${Qf(g2)} : ${Qf(g1)} → ${Qv(g2)*g1[1]*g2[1]} : ${Qv(g1)*g1[1]*g2[1]} units.`,
      `Given away = 2 × ${Qv(Qmul(g1,g2))*g1[1]*g2[1]} = ${2*Qv(Qmul(g1,g2))*g1[1]*g2[1]} units out of ${(Qv(g1)+Qv(g2))*g1[1]*g2[1]} units = <b>${Qf(v)}</b>`]}}});
rq({id:'overlap',kind:'mcq2',topic:'frac',make(){let a,b,x,A,B;do{a=pick([[2,7],[1,3],[2,5],[3,8],[1,4],[2,9],[3,7]]);b=pick([[1,6],[1,5],[1,8],[1,7],[1,9],[1,10]]);x=lcm(a[0],b[0])*R(1,6);A=x*a[1]/a[0];B=x*b[1]/b[0]}while(!(B>A)||B-A>60||A>90);
  const sc=380/(A+B-x),y=20;let s='';const ax=10,bx=ax+(A-x)*sc;
  for(let i=0;i<a[1];i++)s+=`<rect x="${r6(ax+i*A*sc/a[1])}" y="${y}" width="${r6(A*sc/a[1])}" height="22"/>`;s+=tx(ax+A*sc*.25,y+16,'A');
  for(let i=0;i<b[1];i++)s+=`<rect x="${r6(bx+i*B*sc/b[1])}" y="${y+22}" width="${r6(B*sc/b[1])}" height="22"/>`;s+=tx(bx+B*sc*.75,y+38,'B');
  return {stem:`Amber put two sticks, A and B, side by side as shown. ${fr(a[0],a[1])} of A and ${fr(b[0],b[1])} of B overlap exactly. Stick B is ${B-A} cm longer than stick A. What is the length of stick A?`,fig:svgW(400,80,s,400),
    parts:[Object.assign(mc(A,[B,B-A,x,A+B-x],v=>v+' cm'),{marks:2})],
    work:[`${Qf([a[0],a[1]])} of A = ${Qf([b[0],b[1]])} of B. Let the overlap be ${lcm(a[0],b[0])} units.`,`A = ${lcm(a[0],b[0])*a[1]/a[0]} units, B = ${lcm(a[0],b[0])*b[1]/b[0]} units.`,`B − A = ${lcm(a[0],b[0])*(b[1]/b[0]-a[1]/a[0])} units = ${B-A} cm → 1 unit = ${fmtN((B-A)/(lcm(a[0],b[0])*(b[1]/b[0]-a[1]/a[0])))} cm`,`A = <b>${A} cm</b>`]}}});
rq({id:'pctinc',kind:'mcq2',topic:'pct',make(){const p=pick([20,25,40,50,60,75,80]),a=R(2,12)*20,b=a*(100+p)/100;
  return {stem:`The price of 10 litres of petrol increased from ${$m(a/10)} to ${$m(b/10)}. Find the percentage increase in price.`,parts:[Object.assign(mc(p,[r6((b-a)/b*100),r6(b/a*100),r6(a/b*100),r6((b-a)/10)].filter(x=>Number.isInteger(x*10)),x=>fmtN(x)+'%'),{marks:2})],
    work:[`Increase = ${$m(b/10)} − ${$m(a/10)} = ${$m((b-a)/10)}`,`Percentage increase = ${fr($m((b-a)/10),$m(a/10))} × 100% = <b>${p}%</b>`,`(Always divide by the <b>original</b> price.)`]}}});
rq({id:'cubeface',kind:'mcq2',topic:'vol',make(){const e=R(3,12),V=e**3;
  return {stem:`A cube has a volume of ${fmtN(V)} cm³. What is the total area of all its faces?`,parts:[Object.assign(mc(6*e*e,[e*e,4*e*e,6*e,Number.isInteger(V/6)?V/6:e*e*e*2],x=>fmtN(x)+' cm²'),{marks:2})],
    work:[`Length of one edge = ∛${fmtN(V)} = ${e} cm`,`Area of one face = ${e} × ${e} = ${e*e} cm²`,`A cube has 6 faces: 6 × ${e*e} = <b>${fmtN(6*e*e)} cm²</b>`]}}});
rq({id:'tvguide',kind:'mcq2',topic:'meas',make(){const ds=[R(5,10)*5,R(9,30)*5,R(9,30)*5];if(ds[1]===ds[2])ds[2]+=15;const s0=R(14,20)*30,st=[s0,s0+ds[0],s0+ds[0]+ds[1],s0+ds[0]+ds[1]+ds[2]],nm=['News','Sports','Movie','Documentary'];
  const lo=ds[1]<ds[2]?1:2,hi=3-lo,v=ds[hi]-ds[lo],f=m=>tm(m);
  return {stem:`In the television guide shown, one programme leads to another without any break in between. How much shorter is the ${nm[lo]} programme than the ${nm[hi]}?`,fig:tableH(['Start time','Programme'],st.map((t,i)=>[clock(t),nm[i]])),
    parts:[Object.assign(mc(f(v),[f(v+40),f(Math.abs(v-40))||f(v+20),f(ds[lo]),f(v+10),f(v+5),f(v+15),f(v+30),f(v+60)]),{marks:2})],
    work:[`${nm[1]}: ${clock(st[1])} to ${clock(st[2])} = ${tm(ds[1])}`,`${nm[2]}: ${clock(st[2])} to ${clock(st[3])} = ${tm(ds[2])}`,`Difference = <b>${tm(v)}</b>`]}}});

/* =============== BOOKLET B / PAPER 2: short answer (2 marks) =============== */
rq({id:'arith2',kind:'saq',paper:1,topic:'whole',make(){const b=R(2,9),c=R(2,9),a=b*c+R(3,60),d=R(3,9),q=R(201,Math.floor(9999/d)),N=d*q;
  return {stem:'',parts:[num(a-b*c,{q:`Find the value of ${a} − ${b} × ${c}.`,work:[`× before −: ${b} × ${c} = ${b*c}`,`${a} − ${b*c} = <b>${a-b*c}</b>`]}),num(q,{q:`Find the value of ${fmtN(N)} ÷ ${d}.`,work:[`${fmtN(N)} ÷ ${d} = <b>${fmtN(q)}</b>`]})]}}});
rq({id:'frac2',kind:'saq',paper:1,topic:'frac',make(){let b,d;do{b=R(2,9);d=R(2,9)}while(b===d);const a=R(1,b-1),c=R(1,d-1),s=Qadd([a,b],[c,d]),e=R(1,8),f=R(e+1,9),n=R(2,6),q=Qn(e,f*n);
  return {stem:'Give your answers in the simplest form.',parts:[num(Qv(s),{q:`Find the value of ${fr(a,b)} + ${fr(c,d)}.`,simp:true,show:Qh(s),work:[`${fr(a,b)} + ${fr(c,d)} = ${fr(a*d,b*d)} + ${fr(c*b,b*d)} = ${fr(a*d+c*b,b*d)} = <b>${Qh(s)}</b>`]}),
    num(Qv(q),{q:`Find the value of ${fr(e,f)} ÷ ${n}.`,simp:true,show:Qh(q),work:[`${fr(e,f)} ÷ ${n} = ${fr(e,f)} × ${fr(1,n)} = <b>${Qh(q)}</b>`]})]}}});
rq({id:'dec2',kind:'saq',paper:1,topic:'dec',make(){const X=R(1001,2999),Y=R(101,X-200),z=R(101,999),n=pick([20,30,40,60,80]);
  return {stem:'',parts:[num((X-Y)/100,{q:`Find the value of ${fmtN(X/100)} − ${fmtN(Y/100)}.`,work:[`${fmtN(X/100)} − ${fmtN(Y/100)} = <b>${fmtN((X-Y)/100)}</b>`]}),
    num(z*n/1000,{q:`Find the value of ${fmtN(z/1000)} × ${n}.`,work:[`${fmtN(z/1000)} × ${n/10} = ${fmtN(z*n/10000)}`,`${fmtN(z*n/10000)} × 10 = <b>${fmtN(z*n/1000)}</b>`]})]}}});
rq({id:'kgg',kind:'saq',paper:1,topic:'meas',make(){const k=R(2,9),g=pick([R(1,9)*10,R(1,99)]),n=pick([2,3,4,5,6,8]),qt=R(11,99);
  return {stem:`At a café, ${k} kg ${g} g of coffee beans were used in the morning.`,parts:[num(k+g/1000,{q:'Express the mass of coffee beans used in kilograms.',unit:'kg',work:[`${g} g = ${fmtN(g/1000)} kg`,`${k} kg ${g} g = <b>${fmtN(k+g/1000)} kg</b>`]}),
    num(qt/10,{q:`In the afternoon, ${fmtN(qt*n/10)} kg of coffee beans were repacked equally into ${n} packets. How many kilograms of coffee beans were in each packet?`,unit:'kg',work:[`${fmtN(qt*n/10)} ÷ ${n} = <b>${fmtN(qt/10)} kg</b>`]})]}}});
rq({id:'cloth',kind:'saq',paper:1,topic:'meas',make(){const c=R(35,95),n=R(6,15),left=R(30,450),T=n*c+left;
  return {stem:`Mindy had ${fmtN(T/100)} m of cloth. She cut ${n} shorter pieces of length ${c} cm each from it. How much cloth had she left? Give your answer in metres and centimetres.`,
    parts:[{type:'multi',marks:2,v:[Math.floor(left/100),left%100],units:['m','cm'],work:[`${fmtN(T/100)} m = ${T} cm`,`${n} × ${c} cm = ${n*c} cm`,`${T} − ${n*c} = ${left} cm = <b>${Math.floor(left/100)} m ${left%100} cm</b>`]}]}}});
rq({id:'paraang',kind:'saq',paper:1,topic:'angle',make(){let p,s,P,Q,Rr,S,Y,ok=false,t=0;
  while(!ok&&t++<200){p=R(25,45);s=R(40,70);const Lr=330;P=[0,0];Rr=[Lr,0];Q=[Lr*.42*Math.cos(p*deg),Lr*.42*Math.sin(p*deg)];S=[Rr[0]-Q[0],-Q[1]];
    const sr=Math.atan2(Rr[1]-S[1],Rr[0]-S[0]),sp=Math.atan2(P[1]-S[1],P[0]-S[0]),dir=sr+(sp>sr?1:-1)*s*deg,tt=-S[1]/Math.sin(dir);Y=[S[0]+tt*Math.cos(dir),0];ok=tt>0&&Y[0]>Lr*.2&&Y[0]<Lr*.8}
  const F=pt=>[pt[0]+25,130-pt[1]],pP=F(P),pQ=F(Q),pR=F(Rr),pS=F(S),pY=F(Y);
  const g=PG([pP,pQ,pR,pS])+ln(pP,pR)+ln(pS,pY)+angArc(pP,pQ,pR,p+'°',30)+angArc(pS,pY,pR,s+'°',30)+lab(pP,'P',-12,4)+lab(pQ,'Q',0,-8)+lab(pR,'R',12,4)+lab(pS,'S',0,18)+lab(pY,'Y',0,-10);
  return {stem:`PQRS is a parallelogram. PYR is a straight line. ∠QPY = ${p}° and ∠YSR = ${s}°. Find ∠PYS.`,fig:svgW(390,230,g,390),parts:[num(p+s,{marks:2,unit:'°',work:[`PQ ∥ SR, so ∠SRY = ∠QPY = ${p}° (alternate angles).`,`In triangle SYR: ∠SYR = 180° − ${s}° − ${p}° = ${180-s-p}°`,`∠PYS = 180° − ${180-s-p}° = <b>${p+s}°</b>`]})]}}});
rq({id:'algsaq',kind:'saq',paper:1,topic:'alg',make(){const v=pick(['p','k','y','m']),c=R(2,9),a=c+R(4,20),d=R(2,9),b=d+R(1,9),k2=pick(['k','n','x']),m=R(3,9),q=pick([2,3,4,5]),nn=R(1,q-1)+q,val=q*R(1,4),res=m*val-nn*val/q;
  return {stem:'',parts:[{type:'expr',marks:1,v:{c:a-c,k:b-d,x:v},show:lin(a-c,v,b-d),q:`Simplify the expression ${a}${vi(v)} + ${b} − ${c}${vi(v)} − ${d}.`,work:[`${a}${vi(v)} − ${c}${vi(v)} = ${lin(a-c,v,0)}; ${b} − ${d} = ${b-d}`,`Answer: <b>${lin(a-c,v,b-d)}</b>`]},
    num(res,{q:`Find the value of ${m}${vi(k2)} − ${fr(nn+vi(k2),q)} when ${vi(k2)} = ${val}.`,work:[`${m} × ${val} − ${fr(nn+' × '+val,q)} = ${m*val} − ${nn*val/q} = <b>${fmtN(res)}</b>`]})]}}});
rq({id:'avgmiss2',kind:'saq',paper:1,topic:'avg',make(){const X=R(12,30),sc=[R(X-8,X+8),R(X-8,X+8),R(X-8,X+8)],v=4*X-sc[0]-sc[1]-sc[2],pos=R(0,3);if(v<1)return this.make();const all=[...sc];all.splice(pos,0,'?');
  return {stem:`The table shows Chloe's scores for 4 games. The score for one game is missing. The average score for the 4 games is ${X}.`,fig:tableH(['Game','Score'],all.map((s,i)=>[['1st','2nd','3rd','4th'][i],s])),
    parts:[num(v,{marks:2,q:`What is Chloe's score for the ${['1st','2nd','3rd','4th'][pos]} game?`,work:[`Total score = 4 × ${X} = ${4*X}`,`Missing score = ${4*X} − ${sc.join(' − ')} = <b>${v}</b>`]})]}}});
rq({id:'ratio2',kind:'saq',paper:1,topic:'ratio',make(){const a=R(2,7),c=R(2,7);if(a===c||gcd(a,c)>1)return this.make();const g=R(2,6),u=c*R(2,8),D=(g-1)*u,ch=(1+g)*u,ad=ch*a/c;
  return {stem:`At a concert, the ratio of the number of adults to the number of children is ${a} : ${c}. The ratio of the number of boys to the number of girls is 1 : ${g}. There are ${D} more girls than boys.`,
    parts:[num(ad,{marks:2,q:'How many adults are there?',work:[`Girls − boys = ${g} − 1 = ${g-1} units = ${D} → 1 unit = ${u}`,`Children = ${1+g} units = ${ch}`,`Adults = ${ch} ÷ ${c} × ${a} = <b>${ad}</b>`]})]}}});
rq({id:'plantbar',kind:'saq',paper:1,topic:'data',make(){const [fa,fb]=pick([[2,5],[1,4],[1,3],[3,8],[1,5],[2,7]]);let v;do v=[R(2,13)*10,R(2,13)*10,R(2,13)*10];while((v[0]+v[1]+v[2])%(fb-fa)!==0||(v[0]+v[1]+v[2])*fb/(fb-fa)*fa/fb>140);
  const S=v[0]+v[1]+v[2],Tt=S*fb/(fb-fa);
  return {stem:`The bar graph shows the heights of some plants. The bar for Plant D is not shown. The height of Plant D is ${fr(fa,fb)} of the total height of all the plants.`,fig:barChart(['Plant A','Plant B','Plant C','Plant D'],[...v,0],140,20,10,'Height (cm)',[3]),
    parts:[num(Tt,{marks:2,unit:'cm',q:'Find the total height of the 4 plants.',work:[`A + B + C = ${v.join(' + ')} = ${S} cm`,`This is 1 − ${fr(fa,fb)} = ${fr(fb-fa,fb)} of the total.`,`${fb-fa} units = ${S} → 1 unit = ${S/(fb-fa)}; total = ${fb} units = <b>${Tt} cm</b>`]})]}}});
rq({id:'rectY',kind:'saq',paper:1,topic:'area',make(){const [m,n]=pick([[1,2],[1,3],[2,3],[1,4],[3,4]]),h=(m+n)*R(3,9)%2===0?(m+n)*R(3,9):(m+n)*2*R(2,5),side=2*h;const BC=side*n/(m+n),Y=BC*h;if(side%(m+n)!==0)return this.make();
  const x0=30,y0=20,S=180,b=x0+S*m/(m+n),g='';const s=PG([[x0,y0],[x0+S,y0],[x0+S,y0+S],[x0,y0+S]])+ln([x0,y0+S/2],[x0+S,y0+S/2])+ln([b,y0],[b,y0+S/2])+tx((x0+b)/2,y0+S/4+5,'X')+tx((b+x0+S)/2,y0+S/4+5,'Y')+tx(x0+S/2,y0+S*.75+5,'Z')
    +lab([x0,y0],'A',-10,-4)+lab([b,y0],'B',0,-6)+lab([x0+S,y0],'C',10,-4)+lab([x0+S,y0+S/2],'D',12,4)+lab([x0+S,y0+S],'E',10,14)+lab([x0,y0+S],'F',-10,14)+lab([x0,y0+S/2],'G',-12,4);
  return {stem:`ACEF is a square made up of 3 rectangles X, Y and Z. The area of Z is ${fr(1,2)} of the area of square ACEF. ${n===2*m?'BC is twice the length of AB':`The ratio AB : BC is ${m} : ${n}`}. The length of DE is ${h} cm.`,fig:svgW(240,220,s,240),
    parts:[num(Y,{marks:2,unit:'cm²',q:'Find the area of rectangle Y.',work:[`Z is half the square, so CD = DE = ${h} cm and the side of the square is ${side} cm.`,`AB : BC = ${m} : ${n}, so BC = ${side} ÷ ${m+n} × ${n} = ${BC} cm`,`Area of Y = ${BC} × ${h} = <b>${fmtN(Y)} cm²</b>`]})]}}});
rq({id:'leak',kind:'saq',paper:2,topic:'rate',make(){const r=pick([150,200,250,300,400,450]),t=pick([30,40,45,60,90]),V=Math.ceil(r*t/1000)+R(5,40);
  return {stem:'',parts:[num(r6(V-r*t/1000),{marks:2,unit:'ℓ',q:`A tank was filled with ${V} litres of water. Water flowed out of the tank at a rate of ${r} ml per minute. How many litres of water were left in the tank after ${t===60?'1 hour':tm(t)}?`,work:[`Water out = ${r} × ${t} = ${fmtN(r*t)} ml = ${fmtN(r*t/1000)} ℓ`,`Left = ${V} − ${fmtN(r*t/1000)} = <b>${fmtN(V-r*t/1000)} ℓ</b>`]})]}}});
rq({id:'multfac',kind:'saq',paper:1,topic:'whole',make(){const m=R(6,9),N=R(50,99),v=Math.floor((N-1)/m)*m,[x,y]=pick([[24,9],[18,12],[16,24],[20,15],[27,18],[30,42],[36,27]]),cf=[...Array(Math.min(x,y)+1).keys()].filter(f=>f>0&&x%f===0&&y%f===0);
  return {stem:'',parts:[num(v,{q:`Find the largest multiple of ${m} that is smaller than ${N}.`,work:[`${N} ÷ ${m} = ${Math.floor(N/m)} rem ${N%m}`,`${Math.floor((N-1)/m)} × ${m} = <b>${v}</b>`]}),
    {type:'set',marks:1,v:cf,show:cf.join(', '),q:`Find all the common factors of ${x} and ${y}.`,work:[`Factors of ${x}: ${[...Array(x+1).keys()].filter(f=>f>0&&x%f===0).join(', ')}`,`Factors of ${y}: ${[...Array(y+1).keys()].filter(f=>f>0&&y%f===0).join(', ')}`,`Common factors: <b>${cf.join(', ')}</b>`]}]}}});
rq({id:'pietfn',kind:'saq',paper:2,topic:'data',make(){const p=pick([30,35,40,45]),fr2=[R(10,100-25-p-10)];fr2.push(100-25-p-fr2[0]);const nm=shuffle(['Apple','Orange','Pear','Grape']).slice(0,2);
  const fig=pieChart([{f:.25,label:'Mango',right:true},{f:p/100,label:'Durian',sub:p+'%'},{f:fr2[0]/100,label:nm[0]},{f:fr2[1]/100,label:nm[1]}]);
  const pool=shuffle([[`${R(3,9)*10} students chose durian as their favourite fruit.`,2],[`25% of the students chose mango as their favourite fruit.`,0],[`${pick([20,30,35])}% of the students chose mango as their favourite fruit.`,1],
    [`${nm[0]} and ${nm[1]} together make up ${100-25-p}% of the students.`,0],[`${nm[0]} and ${nm[1]} together make up ${100-25-p+pick([-10,10,5])}% of the students.`,1],[`More students chose durian than mango.`,0],[`The school has ${R(2,6)*100} students.`,2]]);
  const rows=[];const need=[0,1,2];need.forEach(k=>{const r=pool.find(x=>x[1]===k&&!rows.includes(x));if(r)rows.push(r)});
  return {stem:'The pie chart shows the favourite fruits chosen by the students in a school. Each statement is either true, false or not possible to tell from the pie chart.',fig,
    parts:[{type:'tfn',marks:2,rows:shuffle(rows),work:[`The right angle means mango is ¼ = 25%.`,`Durian is ${p}%, so the other two fruits make up 100% − 25% − ${p}% = ${100-25-p}%.`,`The chart shows only percentages, not the number of students, so any statement about a number of students is <b>not possible to tell</b>.`]}]}}});
rq({id:'semiarea',kind:'saq',paper:2,topic:'circ',make(){const use7=Math.random()<.5,d=use7?R(1,4)*14:R(2,10)*2,pi=use7?22/7:3.14,A=r6(pi*(d/2)**2/2),P=r6(pi*d/2+d);
  const s=`<path class="sh" d="M20 110 A100 100 0 0 1 220 110 Z"/>`+ln([20,128],[220,128],'thin')+tx(120,145,d+' cm');
  return {stem:`The figure shows a semicircle of diameter ${d} cm. (Take π = ${use7?'22/7':'3.14'})`,fig:svgW(240,155,s,240),parts:[num(A,{q:'Find the area of the semicircle.',unit:'cm²',tol:.01,work:[`Radius = ${d/2} cm`,`Area = ½ × π × ${d/2} × ${d/2} = <b>${fmtN(A)} cm²</b>`]}),num(P,{q:'Find the perimeter of the semicircle.',unit:'cm',tol:.01,work:[`Curved edge = ½ × π × ${d} = ${fmtN(pi*d/2)} cm`,`Perimeter = ${fmtN(pi*d/2)} + ${d} (the diameter) = <b>${fmtN(P)} cm</b>`]})]}}});
rq({id:'gst',kind:'saq',paper:2,topic:'pct',make(){const c=R(3,20)*20,g=r6(c*1.09),dd=pick([10,20,25]),sale=c*(100-dd)/100;
  return {stem:`A pair of shoes has a usual price of ${$m(c)} before GST. During a sale, there is a ${dd}% discount off the usual price. GST of 9% is then charged on the sale price.`,
    parts:[num(sale,{q:'What is the sale price before GST?',pre:'$',work:[`${100-dd}% × ${$m(c)} = <b>${$m(sale)}</b>`]}),num(r6(sale*1.09),{q:'How much must be paid after GST?',pre:'$',tol:.006,work:[`109% × ${$m(sale)} = <b>${$m(sale*1.09)}</b>`]})]}}});
rq({id:'cuberootsaq',kind:'saq',paper:2,topic:'vol',make(){const e=R(4,15),V=e**3,n=R(2,4);
  return {stem:`A cubical box has a volume of ${fmtN(V)} cm³.`,parts:[num(e,{q:'Find the length of one edge of the box.',unit:'cm',work:[`Edge = ∛${fmtN(V)} = <b>${e} cm</b>`]}),
    num(n*e*e*e,{q:`A rectangular box is ${n} times as long as the cubical box, with the same width and height. Find its volume.`,unit:'cm³',work:[`Volume = ${n*e} × ${e} × ${e} = <b>${fmtN(n*e**3)} cm³</b>`]})]}}});

/* =============== PAPER 2: long questions (3–5 marks) =============== */
rq({id:'Lalgcost',kind:'long',topic:'alg',make(){let a,H,S,n,W;do{a=R(2,5);H=R(15,30);S=R(3,H-4);n=pick([3,4,5,6]);W=R(6,20)}while((2*a*W+H-S)%n||a*W-S<=0);const k=H-S,each=(2*a*W+k)/n;
  const ex=(c,kk)=>fr(`${c}${vi('w')} ${kk>=0?'+':'−'} ${Math.abs(kk)}`,n);
  return {stem:`A bottle of perfume cost $${a}${vi('w')}. It cost $${H} less than a handbag but $${S} more than a scarf. A group of ${n} friends bought a handbag and a scarf as a gift and shared the cost equally.`,
    parts:[Object.assign(mc(ex(2*a,k),[ex(2*a,H+S),ex(a,k),ex(2*a,-k),ex(a,H+S)]),{marks:2,q:'How much did each person pay for the gift? Choose the expression in the simplest form.',work:[`Handbag = $(${a}${vi('w')} + ${H}); scarf = $(${a}${vi('w')} − ${S})`,`Total = $(${2*a}${vi('w')} + ${k})`,`Each person = <b>$${ex(2*a,k)}</b>`]}),
      num(each,{q:`What was the amount each person paid when ${vi('w')} = ${W}?`,pre:'$',work:[`${fr(`${2*a} × ${W} + ${k}`,n)} = ${fr(2*a*W+k,n)} = <b>${$m(each)}</b>`]})]}}});
rq({id:'Lpct2',kind:'long',topic:'pct',make(){let J,x,y,F,M,res;do{x=pick([20,25,40,50,60]);y=pick([10,20,25,30,40]);J=R(4,40)*20;F=J*(100+x)/100;M=F*(100-y)/100;res=r6((M-J)/J*100)}while(!Number.isInteger(F)||!Number.isInteger(M)||res===0||!Number.isInteger(res*10));
  const up=res>0;
  return {stem:`The Green Club collected ${fmtN(F)} bottles in February. This was an increase of ${x}% from January. In March, the number of bottles collected decreased by ${y}% from February.`,
    parts:[num(Math.abs(res),{marks:3,unit:'%',q:`What was the percentage ${up?'increase':'decrease'} in the number of bottles collected in March compared to January?`,work:[`January: ${100+x}% → ${fmtN(F)}, so January = ${fmtN(F)} ÷ ${100+x} × 100 = ${fmtN(J)}`,`March = ${100-y}% of ${fmtN(F)} = ${fmtN(M)}`,`Change = ${fmtN(Math.abs(M-J))}; ${fr(fmtN(Math.abs(M-J)),fmtN(J))} × 100% = <b>${fmtN(Math.abs(res))}%</b> ${up?'increase':'decrease'}`]})]}}});
rq({id:'Lcourt',kind:'long',topic:'rate',make(){let P,C,Tt,m;do{P=R(5,9);C=R(2,4);Tt=pick([90,120,150,180,210,240]);m=Tt*C/P}while(C>=P||!Number.isInteger(m));
  return {stem:`${P} players booked a tennis court and took turns to play on it. At any time, there were ${C} players on the court. Each player played for ${m} minutes.`,
    parts:[num(Tt/60,{marks:3,unit:'h',q:'How long did they book the tennis court for? Give your answer in hours.',work:[`Total player-minutes = ${P} × ${m} = ${P*m}`,`${C} players were on court at a time, so booking time = ${P*m} ÷ ${C} = ${Tt} min`,`${Tt} min = <b>${fmtN(Tt/60)} h</b>`]})]}}});
rq({id:'Lavg',kind:'long',topic:'avg',make(){let ms;do ms=[R(30,52),R(30,52),R(30,52)];while((ms[0]+ms[1]+ms[2])%3);const av=(ms[0]+ms[1]+ms[2])/3,nw=av+pick([-1,1])*R(4,14),na=r6((av*3+nw)/4),nm=['Ahmad','Bala','Caleb'];
  return {stem:`The table shows the masses of 3 boys.`,fig:tableH(['Name','Mass'],nm.map((n,i)=>[n,ms[i]+' kg'])),
    parts:[num(av,{q:'Find the average mass of the 3 boys.',unit:'kg',work:[`(${ms.join(' + ')}) ÷ 3 = ${ms[0]+ms[1]+ms[2]} ÷ 3 = <b>${av} kg</b>`]}),
      Object.assign(mc(nw>av?'Increase':'Decrease',[nw>av?'Decrease':'Increase','Stay the same'],String,true),{marks:1,q:`Another boy, Daniel, with a mass of ${nw} kg, joined the 3 boys. Will the average mass of the 4 boys increase, decrease or stay the same?`,work:[`Daniel's mass (${nw} kg) is ${nw>av?'more':'less'} than the average (${av} kg), so the average will <b>${nw>av?'increase':'decrease'}</b>.`]}),
      num(na,{q:'Find the new average mass of the 4 boys.',unit:'kg',work:[`(${ms[0]+ms[1]+ms[2]} + ${nw}) ÷ 4 = ${ms[0]+ms[1]+ms[2]+nw} ÷ 4 = <b>${fmtN(na)} kg</b>`]})]}}});
rq({id:'Ltaps',kind:'long',topic:'rate',make(){let a,t1,t2,b,cap;do{a=pick([1.25,2,2.5,3,4,5]);t1=pick([2,4,6]);t2=pick([2,4,6]);b=pick([5,6,8,10,12,15]);cap=a*t1+(a+b)*t2}while(cap>100||cap%5||(a*t1)%5||t1+t2>10);
  const tb=b*t2,f=Qn(tb,cap);
  const fig=lineGraph([[[0,0],[t1,a*t1],[t1+t2,cap],[12,cap]]],12,2,100,10,5,'Time in minutes','Volume of water (litres)');
  return {stem:`Fiona filled a tank with water using two taps. She turned on Tap A first. After ${t1} minutes, she also turned on Tap B. Both taps were turned off at the same time when the tank was completely filled without overflowing. The graph shows the amount of water in the tank over 12 minutes.`,fig,
    parts:[num(a,{q:'How many litres of water flowed from Tap A per minute?',unit:'ℓ',work:[`In the first ${t1} min only Tap A was on: ${a*t1} ℓ ÷ ${t1} = <b>${fmtN(a)} ℓ per minute</b>`]}),
      num(cap,{q:'What was the capacity of the tank?',unit:'ℓ',work:[`The graph levels off at <b>${cap} ℓ</b> when the tank is full.`]}),
      num(Qv(f),{marks:2,simp:true,show:Qh(f),q:'After both taps were turned off, what fraction of the tank was filled with water from Tap B? Give your answer in the simplest form.',work:[`Both taps ran for ${t2} min: water from A = ${fmtN(a)} × ${t2} = ${fmtN(a*t2)} ℓ`,`Water from B = ${cap} − ${a*t1} − ${fmtN(a*t2)} = ${tb} ℓ`,`Fraction = ${fr(tb,cap)} = <b>${Qh(f)}</b>`]})]}}});
rq({id:'Lrhombus',kind:'long',topic:'angle',make(){let a,b,t;do{a=R(28,38)*2;b=R(18,40);t=Math.sin(b*deg)/Math.sin((180-a-b)*deg)}while(t>.85||t<.35);
  const S=170,F=p=>[60+p[0]*S,190-p[1]*S],A=[0,0],B=[1,0],D=[Math.cos(a*deg),Math.sin(a*deg)],C=[1+D[0],D[1]],E=[t*D[0],t*D[1]];
  const pA=F(A),pB=F(B),pC=F(C),pD=F(D),pE=F(E);
  const g=PG([pA,pB,pC,pD])+ln(pA,pC)+ln(pB,pE)+tk(pA,pB)+tk(pB,pC)+tk(pC,pD)+tk(pD,pA)+angArc(pA,pB,pD,a+'°',28)+angArc(pB,pE,pA,b+'°',30)+lab(pA,'A',-10,12)+lab(pB,'B',8,14)+lab(pC,'C',10,-4)+lab(pD,'D',-6,-8)+lab(pE,'E',-12,0);
  return {stem:`ABCD is a rhombus. AC is a straight line. E is a point on AD. ∠DAB = ${a}° and ∠ABE = ${b}°.`,fig:svgW(430,215,g,430),
    parts:[num(a/2,{marks:2,unit:'°',q:'Find ∠ACD.',work:[`∠ADC = 180° − ${a}° = ${180-a}° (AB ∥ DC)`,`DA = DC, so triangle ACD is isosceles: ∠ACD = (180° − ${180-a}°) ÷ 2 = <b>${a/2}°</b>`]}),
      num(a+b,{marks:2,unit:'°',q:'Find ∠BED.',work:[`In triangle ABE: ∠AEB = 180° − ${a}° − ${b}° = ${180-a-b}°`,`AED is a straight line: ∠BED = 180° − ${180-a-b}° = <b>${a+b}°</b>`]}),
      num(180-a-b,{q:'Find ∠EBC.',unit:'°',work:[`∠ABC = 180° − ${a}° = ${180-a}°`,`∠EBC = ${180-a}° − ${b}° = <b>${180-a-b}°</b>`]})]}}});
rq({id:'Lcookies',kind:'long',topic:'frac',make(){let f1,Lt,f2,St,big,sm,give,T,a,b,ok=false;
  while(!ok){f1=pick([[3,5],[2,3],[3,4],[1,2],[2,5]]);Lt=pick([2,3,4,5,6]);f2=pick([[1,4],[1,3],[2,5],[1,2],[3,4]]);St=pick([2,3,4,5]);
    big=Qn(f1[0],f1[1]*Lt);sm=Qmul(Qsub([1,1],f1),Qn(f2[0],f2[1]*St));give=Qmul(Qsub([1,1],f1),Qsub([1,1],f2));const D=lcm(lcm(big[1],sm[1]),give[1]);T=D*R(1,Math.max(1,Math.floor(1500/D)));a=R(1,Math.min(3,Lt));b=R(1,Math.min(4,St));ok=T>=100&&T<=2000}
  const N=T*Qv(Qadd(Qmul([a,1],big),Qmul([b,1],sm)));
  return {stem:`Mrs Menon baked some cookies. She packed ${fr(f1[0],f1[1])} of the cookies equally into ${Lt} large tins and ${fr(f2[0],f2[1])} of the remaining cookies equally into ${St} small tins. The rest of the cookies were given away.`,
    parts:[num(Qv(give),{marks:2,simp:true,show:Qh(give),q:'What fraction of the cookies was given away?',work:[`Remaining after large tins = ${Qf(Qsub([1,1],f1))}`,`Given away = (1 − ${fr(f2[0],f2[1])}) × ${Qf(Qsub([1,1],f1))} = <b>${Qh(give)}</b>`]}),
      num(T,{marks:3,q:`There are ${fmtN(N)} cookies in ${a} large tin${a>1?'s':''} and ${b} small tin${b>1?'s':''}. How many cookies did Mrs Menon bake?`,work:[`1 large tin = ${Qf(f1)} ÷ ${Lt} = ${Qf(big)} of the cookies`,`1 small tin = ${Qf(Qsub([1,1],f1))} × ${fr(f2[0],f2[1])} ÷ ${St} = ${Qf(sm)} of the cookies`,`${a} large + ${b} small = ${Qf(Qadd(Qmul([a,1],big),Qmul([b,1],sm)))} of the cookies = ${fmtN(N)}`,`Total = <b>${fmtN(T)}</b> cookies`]})]}}});
rq({id:'Ltanks',kind:'long',topic:'vol',make(){let o=null;for(let t=0;t<4000&&!o;t++){const l1=pick([30,40,45,50,60]),b1=pick([20,25,30]),l2=pick([20,25,28,30,35,40]),b2=pick([15,20,25]),f=pick([[1,3],[1,4],[1,2],[2,5]]),r=R(4,12);
    const V=l2*b2*r,TX=V*f[1]/f[0];if(!Number.isInteger(TX)||TX%(l1*b1))continue;const h1=TX/(l1*b1),xf=h1*(f[1]-f[0])/f[1];if(!Number.isInteger(xf))continue;const y0=xf-r;if(y0<2||h1>60||h1<10)continue;o={l1,b1,l2,b2,f,r,V,h1,xf,y0}}
  if(!o)o={l1:45,b1:20,l2:28,b2:25,f:[1,3],r:9,V:6300,h1:21,xf:14,y0:5};const {l1,b1,l2,b2,f,r,V,h1,xf,y0}=o,H2=xf+R(4,10),lit=l2*b2*y0/1000;
  const box=(x,y,w,h,d,lw,lb,lh,name)=>{const g=PG([[x,y],[x+w,y],[x+w,y+h],[x,y+h]])+PG([[x,y],[x+d,y-d*.6],[x+w+d,y-d*.6],[x+w,y]])+PG([[x+w,y],[x+w+d,y-d*.6],[x+w+d,y+h-d*.6],[x+w,y+h]]);return g+tx(x+w/2,y+h+18,lw)+tx(x+w+d+4,y+h-d*.3+4,lb,'start')+(lh?tx(x+w+d+4,y+h/2-d*.3,lh,'start'):'')+tx(x+w/2,y+h+38,name,'middle','ptl')};
  const fig=svgW(470,190,box(20,50,150,80,30,l1+' cm',b1+' cm','','Tank X')+box(280,40,90,95,26,l2+' cm',b2+' cm',H2+' cm','Tank Y'),470);
  return {stem:`The figure shows two rectangular tanks, X and Y. At first, Tank X was completely filled with water and Tank Y had some water in it. After ${fr(f[0],f[1])} of the water from Tank X was poured into Tank Y, the height of the water level in Tank Y increased by ${r} cm. The heights of the water levels in both tanks then became the same.`,fig,
    parts:[num(xf,{marks:3,unit:'cm',q:'What was the height of the water level in Tank X in the end?',work:[`Water poured = ${l2} × ${b2} × ${r} = ${fmtN(V)} cm³`,`This is ${fr(f[0],f[1])} of Tank X, so Tank X held ${fmtN(V)} ÷ ${f[0]} × ${f[1]} = ${fmtN(V*f[1]/f[0])} cm³ → height ${fmtN(V*f[1]/f[0])} ÷ (${l1} × ${b1}) = ${h1} cm`,`Height in the end = ${h1} × ${fr(f[1]-f[0],f[1])} = <b>${xf} cm</b>`]}),
      num(lit,{marks:2,unit:'ℓ',q:'How many litres of water were in Tank Y at first?',work:[`Height in Tank Y at first = ${xf} − ${r} = ${y0} cm`,`Volume = ${l2} × ${b2} × ${y0} = ${fmtN(l2*b2*y0)} cm³ = <b>${fmtN(lit)} ℓ</b>`]})]}}});
rq({id:'Lsemi',kind:'long',topic:'circ',make(){const use7=Math.random()<.5,pi=use7?22/7:3.14,pis=use7?'22/7':'3.14';
  if(Math.random()<.5){const D=use7?pick([28,56]):pick([20,40,60]),P=r6(pi*D),A=r6(pi*D*D/16);
    const cx=170,cy=150,Rr=140,rr=70,s=`<path class="sh" d="M${cx-Rr} ${cy} A${Rr} ${Rr} 0 0 1 ${cx+Rr} ${cy} A${rr} ${rr} 0 0 0 ${cx} ${cy} A${rr} ${rr} 0 0 0 ${cx-Rr} ${cy} Z"/>`+ln([cx-Rr,cy+16],[cx+Rr,cy+16],'thin')+tx(cx,cy+32,D+' cm');
    return {stem:`The figure is made up of a large semicircle and 2 identical small semicircles. The diameter of the large semicircle is ${D} cm. (Take π = ${pis})`,fig:svgW(340,190,s,340),
      parts:[num(P,{marks:2,unit:'cm',tol:.01,q:'Find the perimeter of the shaded part.',work:[`Large arc = ½ × π × ${D} = ${fmtN(pi*D/2)} cm`,`2 small arcs = 2 × ½ × π × ${D/2} = ${fmtN(pi*D/2)} cm`,`Perimeter = <b>${fmtN(P)} cm</b>`]}),
        num(A,{marks:2,unit:'cm²',tol:.01,q:'Find the area of the shaded part.',work:[`Large semicircle = ½ × π × ${D/2} × ${D/2} = ${fmtN(pi*D*D/8)} cm²`,`2 small semicircles = 2 × ½ × π × ${D/4} × ${D/4} = ${fmtN(pi*D*D/16)} cm²`,`Shaded = ${fmtN(pi*D*D/8)} − ${fmtN(pi*D*D/16)} = <b>${fmtN(A)} cm²</b>`]})]}}
  const sd=use7?pick([14,28,21*2]):pick([10,20,30]),P=r6(2*sd+pi*sd/2),A=r6(sd*sd-pi*sd*sd/4),x=40,y=20,S=180;
  const s=`<path class="sh" d="M${x+S} ${y} L${x+S} ${y+S} L${x} ${y+S} A${S} ${S} 0 0 1 ${x+S} ${y} Z"/>`+PG([[x,y],[x+S,y],[x+S,y+S],[x,y+S]],'thin')+tx(x+S/2,y+S+20,sd+' cm')+lab([x,y],'O',-10,-4);
  return {stem:`The figure shows a square of side ${sd} cm. A quarter circle with centre O is drawn inside it. (Take π = ${pis})`,fig:svgW(260,230,s,260),
    parts:[num(P,{marks:2,unit:'cm',tol:.01,q:'Find the perimeter of the shaded part.',work:[`Quarter arc = ¼ × 2 × π × ${sd} = ${fmtN(pi*sd/2)} cm`,`Two straight sides = 2 × ${sd} = ${2*sd} cm`,`Perimeter = <b>${fmtN(P)} cm</b>`]}),
      num(A,{marks:2,unit:'cm²',tol:.01,q:'Find the area of the shaded part.',work:[`Square = ${sd} × ${sd} = ${sd*sd} cm²`,`Quarter circle = ¼ × π × ${sd} × ${sd} = ${fmtN(pi*sd*sd/4)} cm²`,`Shaded = <b>${fmtN(A)} cm²</b>`]})]}}});
rq({id:'Lstickers',kind:'long',topic:'ratio',make(){let a,b,c,d;do{a=R(2,7);b=R(2,9);c=R(2,9);d=R(2,9)}while(gcd(a,b)>1||gcd(c,d)>1||a===b||c===d);const Lu=lcm(a,d),E=Lu,Dv=Lu*b/a,Fz=Lu*c/d;if(Fz===E)return this.make();
  const k=R(2,9),diff=Math.abs(Fz-E)*k,f=Qn(Fz,Dv);
  return {stem:`The ratio of Eli's number of stickers to Devi's number of stickers is ${a} : ${b}. The ratio of Faizal's number of stickers to Eli's number of stickers is ${c} : ${d}.`,
    parts:[num(Qv(f),{marks:2,simp:true,show:Qh(f),q:"What fraction of Devi's number of stickers is Faizal's number of stickers?",work:[`Make Eli's units the same: Eli = ${E} units`,`Devi = ${E} ÷ ${a} × ${b} = ${Dv} units; Faizal = ${E} ÷ ${d} × ${c} = ${Fz} units`,`Faizal ÷ Devi = ${fr(Fz,Dv)} = <b>${Qh(f)}</b>`]}),
      num(Dv*k,{marks:2,q:`The difference between Faizal's and Eli's number of stickers is ${diff}. How many stickers does Devi have?`,work:[`${Math.abs(Fz-E)} units = ${diff} → 1 unit = ${k}`,`Devi = ${Dv} × ${k} = <b>${Dv*k}</b>`]})]}}});
rq({id:'Lmuffin',kind:'long',topic:'frac',make(){let p,q,m,c;do{p=pick([[4,7],[2,3],[3,5],[1,4],[3,4],[2,5]]);q=pick([[5,8],[1,3],[3,4],[2,5],[1,2],[5,6]]);m=p[1]*R(4,30);c=q[1]*R(4,30)}while((p[1]-p[0])*q[1]===(q[1]-q[0])*p[1]||m+c>800);
  const left=m*(p[1]-p[0])/p[1]+c*(q[1]-q[0])/q[1],gc=c*q[0]/q[1];
  return {stem:`Mrs Ang baked a total of ${m+c} cookies and muffins. After she gave away ${fr(p[0],p[1])} of the muffins and ${fr(q[0],q[1])} of the cookies, she had a total of ${left} cookies and muffins left.`,
    parts:[num(gc,{marks:3,q:'How many cookies did Mrs Ang give away?',work:[`Muffins left = ${Qf(Qsub([1,1],p))} of muffins; cookies left = ${Qf(Qsub([1,1],q))} of cookies.`,`Try muffins = M, cookies = ${m+c} − M: ${Qf(Qsub([1,1],p))}M + ${Qf(Qsub([1,1],q))}(${m+c} − M) = ${left}`,`Solving gives M = ${m} muffins and ${c} cookies.`,`Cookies given away = ${fr(q[0],q[1])} × ${c} = <b>${gc}</b>`]})]}}});
rq({id:'Lpie',kind:'long',topic:'data',make(){let ch,k,W,Cf,G,g;do{ch=pick([[2,3],[1,2],[1,3],[3,5],[1,5],[2,5]]);k=pick([1,2,3,4]);W=Qdiv([3,4],Qadd([1,1],Qn(ch[0],ch[1])));Cf=Qsub([3,4],W);G=Qdiv(Cf,[k+1,1]);g=r6(Qv(G)*100)}while(!Number.isInteger(g*100)||g<4);
  const fig=pieChart([{f:.25,label:'Men',right:true},{f:Qv(W),label:'Women'},{f:Qv(G),label:'Girls'},{f:Qv(G)*k,label:'Boys'}]);
  return {stem:`The pie chart shows the number of visitors who went to a museum on a Saturday. The number of children was ${fr(ch[0],ch[1])} the number of women. The number of boys was ${k===1?'the same as':['','','twice','3 times','4 times'][k]} the number of girls.`,fig,
    parts:[num(Qv(W),{marks:2,simp:true,show:Qh(W),q:'What fraction of the total number of visitors were women? Give your answer in the simplest form.',work:[`Men = ¼ (right angle), so women + children = ¾.`,`Women : children = ${ch[1]} : ${ch[0]}, so women = ${fr(ch[1],ch[1]+ch[0])} × ¾ = <b>${Qh(W)}</b>`]}),
      num(g,{marks:2,unit:'%',q:'What percentage of the total number of visitors were girls?',work:[`Children = ¾ − ${Qf(W)} = ${Qf(Cf)}`,`Girls : boys = 1 : ${k}, so girls = ${Qf(Cf)} ÷ ${k+1} = ${Qf(G)}`,`${Qf(G)} × 100% = <b>${fmtN(g)}%</b>`]})]}}});
rq({id:'Lcubetank',kind:'long',topic:'vol',make(){const hq=pick([[3,2],[1,2],[2,3],[5,4],[3,4]]),Lb=hq[1]*R(2,Math.floor(16/hq[1])),h=Lb*hq[0]/hq[1],V=Lb*Lb*h;
  return {stem:`Tank A is a rectangular tank with a square base. Tank A has a volume of ${fmtN(V)} cm³. The height of Tank A is ${fr(hq[0],hq[1])} of the length of Tank A.`,
    parts:[num(Lb,{marks:3,unit:'cm',q:'What is the length of Tank A?',work:[`Volume = length × length × ${fr(hq[0],hq[1])} length`,`length³ = ${fmtN(V)} × ${fr(hq[1],hq[0])} = ${fmtN(Lb**3)}`,`length = ∛${fmtN(Lb**3)} = <b>${Lb} cm</b>`]}),
      num(8*Lb**3,{unit:'cm³',q:'Tank B is a cubical tank. The length of Tank B is twice the length of Tank A. Find the volume of Tank B.',work:[`Edge of B = 2 × ${Lb} = ${2*Lb} cm`,`Volume = ${2*Lb} × ${2*Lb} × ${2*Lb} = <b>${fmtN(8*Lb**3)} cm³</b>`]})]}}});
rq({id:'Lbeads',kind:'long',topic:'pct',make(){const [a,b]=pick([[5,8],[3,5],[2,3],[3,4],[3,8],[2,5]]),mw=pick([8,10,12]),mg=pick([15,18,20,25]),N=b*R(4,20)*5,Wd=N*a/b,G=N-Wd,M=Wd*mw+G*mg,x=pick([10,20,25,40,50]);
  if(!Number.isInteger(Wd*x/100))return this.make();const M2=M+Wd*x/100*mw;
  return {stem:`Melissa had some beads. ${fr(a,b)} of the beads were wooden beads and the rest were glass beads. The mass of each wooden bead was ${mw} g and the mass of each glass bead was ${mg} g.`,
    parts:[num(N,{marks:3,q:`The total mass of all the beads was ${fmtN(M/1000)} kg. How many beads did Melissa have in total?`,work:[`Take ${b} beads: ${a} wooden + ${b-a} glass = ${a*mw+(b-a)*mg} g`,`${fmtN(M/1000)} kg = ${fmtN(M)} g → ${fmtN(M)} ÷ ${a*mw+(b-a)*mg} = ${N/b} groups of ${b}`,`Total beads = ${N/b} × ${b} = <b>${N}</b>`]}),
      num(M2/1000,{unit:'kg',q:`Melissa then bought more wooden beads. The number of wooden beads increased by ${x}%. What is the total mass of all the beads in the end? Give your answer in kilograms.`,work:[`Wooden beads = ${Wd}; ${x}% more = ${Wd*x/100} beads = ${fmtN(Wd*x/100*mw)} g`,`Total = ${fmtN(M)} + ${fmtN(Wd*x/100*mw)} = ${fmtN(M2)} g = <b>${fmtN(M2/1000)} kg</b>`]})]}}});
rq({id:'Lcamp',kind:'long',topic:'pct',make(){let g,bo,d;do{g=R(5,40)*2;bo=R(2,24)*5;d=bo-g}while(d<=0);const gn=g/2,bn=bo*1.4,Tt=gn+bn,e=R(1,4),c=R(2,6),C=bn*c+gn*(c+e);
  return {stem:`There were ${d} more boys than girls who joined a sports camp last year. This year, the number of girls decreased by 50% while the number of boys increased by 40%. As a result, the camp has ${Tt} participants this year.`,
    parts:[num(bn,{marks:3,q:'How many boys joined the camp this year?',work:[`Let girls last year = G. Boys last year = G + ${d}.`,`This year: 0.5G + 1.4(G + ${d}) = ${Tt} → 1.9G + ${fmtN(1.4*d)} = ${Tt} → G = ${g}`,`Boys this year = 1.4 × ${bo} = <b>${bn}</b>`]}),
      num(c,{marks:2,q:`At the camp this year, each girl received ${e} more activity card${e>1?'s':''} than each boy. A total of ${C} activity cards were given out. How many activity cards did each boy receive?`,work:[`Girls this year = ${gn}. Extra cards for girls = ${gn} × ${e} = ${gn*e}`,`${C} − ${gn*e} = ${C-gn*e} cards shared equally by all ${Tt} children`,`Each boy = ${C-gn*e} ÷ ${Tt} = <b>${c}</b>`]})]}}});
rq({id:'Lpoints',kind:'long',topic:'rate',make(){const P=R(40,160)*5+R(0,4)*1;let k=0;const pts=k=>12*k+80*Math.floor(k/20);while(pts(k)<P)k++;
  return {stem:`At a supermarket, 12 points are earned for every $2.50 spent. For every $50 spent, an additional 80 bonus points are given. Mrs Tan wants to earn ${P} points to exchange for a gift.`,
    parts:[num(k*2.5,{marks:3,pre:'$',q:'What is the least amount of money Mrs Tan needs to spend?',work:[`Every $50 = 20 × $2.50 → 20 × 12 + 80 = 320 points.`,`${P} ÷ 320 = ${Math.floor(P/320)} rem ${P%320}: ${Math.floor(P/320)} × $50 gives ${Math.floor(P/320)*320} points.`,`Remaining ${P-Math.floor(P/320)*320} points need ${Math.ceil(Math.max(0,P-Math.floor(P/320)*320)/12)} more lots of $2.50 (12 points each).`,`Least amount = <b>${$m(k*2.5)}</b>`]})]}}});
rq({id:'Lequal',kind:'long',topic:'vol',make(){let o=null;for(let t=0;t<4000&&!o;t++){const la=pick([40,50,60]),wa=pick([20,25,30]),ha=pick([40,48,50,60]),lb=pick([30,50,60,75]),wb=pick([10,12,15,20]),r=pick([1.2,1.5,1.8,2,2.4,3]),f=pick([[1,4],[1,5],[1,3],[1,6]]);
    const ra=r*1000/(la*wa),rb=r*1000/(lb*wb),h0=ha*f[0]/f[1];if(!(rb>ra)||!Number.isInteger(r6(ra*100))||!Number.isInteger(r6(rb*100))||!Number.isInteger(h0))continue;const tt=r6(h0/(rb-ra));if(!Number.isInteger(tt)||tt>60)continue;const hb=pick([30,36,40,45]);if(tt*rb>hb||h0+tt*ra>ha)continue;o={la,wa,ha,lb,wb,r,f,ra:r6(ra),rb:r6(rb),h0,tt,hb}}
  if(!o)o={la:50,wa:25,ha:48,lb:75,wb:10,r:1.5,f:[1,4],ra:1.2,rb:2,h0:12,tt:15,hb:40};const {la,wa,ha,lb,wb,r,f,ra,rb,h0,tt,hb}=o;
  return {stem:`Tank A measures ${la} cm by ${wa} cm by ${ha} cm. Tank B measures ${lb} cm by ${wb} cm by ${hb} cm. At first, ${fr(f[0],f[1])} of Tank A was filled with water and Tank B was empty. Two taps were turned on at the same time. Water flowed into each tank at the same rate of ${fmtN(r)} ℓ/min.`,
    parts:[{type:'multi',marks:1,v:[ra,rb],labels:['Tank A','Tank B'],units:['cm','cm'],q:'What is the increase in the water level of each tank in one minute?',work:[`${fmtN(r)} ℓ = ${fmtN(r*1000)} cm³`,`Tank A: ${fmtN(r*1000)} ÷ (${la} × ${wa}) = ${fmtN(ra)} cm; Tank B: ${fmtN(r*1000)} ÷ (${lb} × ${wb}) = ${fmtN(rb)} cm`]},
      num(tt,{marks:3,unit:'min',q:'How long did it take for the height of the water to be the same in both tanks?',work:[`At first, Tank A's water is ${fr(f[0],f[1])} × ${ha} = ${h0} cm high.`,`Tank B catches up by ${fmtN(rb)} − ${fmtN(ra)} = ${fmtN(rb-ra)} cm each minute.`,`Time = ${h0} ÷ ${fmtN(rb-ra)} = <b>${tt} min</b>`]})]}}});
rq({id:'Ljackets',kind:'long',topic:'pct',make(){let d,P,s,l,k;do{d=pick([20,25,30,35,40]);P=R(5,30)*20;s=R(2,40);l=R(1,30)+.5;k=r6(P*d/100-s-l)}while(!(k>5&&k<P/2&&Number.isInteger(k*100)));const money=r6(P-k-s);
  return {stem:`Jacket A and Jacket B had the same usual price. During a sale, Jacket A was sold at a ${d}% discount and Jacket B was sold at a ${$m(k)} discount. Mr Chan could not buy Jacket B as he was short of ${$m(s)}, so he bought Jacket A and still had ${$m(l)} left.`,
    parts:[num(P,{marks:2,pre:'$',q:'What was the usual price of each jacket?',work:[`Money = usual − ${$m(k)} − ${$m(s)} and also = ${100-d}% of usual + ${$m(l)}`,`So ${d}% of usual = ${$m(k)} + ${$m(s)} + ${$m(l)} = ${$m(k+s+l)}`,`Usual price = ${$m(k+s+l)} ÷ ${d} × 100 = <b>${$m(P)}</b>`]}),
      num(money,{marks:2,pre:'$',q:'How much money did Mr Chan have at first?',work:[`${$m(P)} − ${$m(k)} − ${$m(s)} = <b>${$m(money)}</b>`]})]}}});
rq({id:'Lboxes',kind:'long',topic:'alg',make(){const a=pick([2,3,4]),m=R(2,5),N=a*(m+1),v=R(3,8);
  return {stem:`${N} students were asked to pack some boxes of cards equally. However, ${a} students did not turn up. As a result, each of the remaining students had to pack ${vi('p')} more boxes of cards.`,
    parts:[Object.assign(mc(m+vi('p'),[(m+1)+vi('p'),N+vi('p'),(N-a)+vi('p'),a+vi('p')],String),{marks:2,q:'What was the number of boxes each student had to pack at first? Express your answer in terms of '+vi('p')+'.',work:[`The ${a} absent students' boxes were shared by ${N-a} students, each packing ${vi('p')} more.`,`So 1 student's share × ${a} = ${N-a}${vi('p')} → each student at first = ${N-a}${vi('p')} ÷ ${a} = <b>${m}${vi('p')}</b>`]}),
      num(N*m*v,{q:`Find the total number of boxes of cards that were packed when ${vi('p')} = ${v}.`,work:[`Total = ${N} × ${m}${vi('p')} = ${N*m}${vi('p')} = ${N*m} × ${v} = <b>${N*m*v}</b>`]})]}}});
rq({id:'Lphones',kind:'long',topic:'data',make(){let sL,sM;do{sL=pick([1,1.5,2]);sM=pick([1,1.5,2])}while(sL===sM);const tq=pick([10,20,30]),yq=10+sL*tq,yM30=10+sM*30,t100=90/sL;
  const fmtT=v=>`12 ${String(v).padStart(2,'0')}`;const fig=lineGraph([[[0,10],[40,10+40*sL]],[[0,10],[40,10+40*sM]]].map((p,i)=>p),40,10,100,10,5,'Time','Battery (%)',fmtT).replace('</svg>',tx(400,Math.max(30,232-216*(10+40*sL)/100-8),'L','middle','ptl')+tx(400,Math.max(30,232-216*(10+40*sM)/100-8),'M','middle','ptl')+'</svg>');
  return {stem:`The graph shows the battery percentage of two mobile phones, L and M, from 12 00 to 12 40. At 12 00, both phones had a battery percentage of 10% and were plugged into different chargers. The battery percentage of each phone increased at a steady rate.`,fig,
    parts:[num(tq,{unit:'min',q:`How many minutes after 12 00 did Phone L reach a battery percentage of ${yq}%?`,work:[`Read across from ${yq}% to line L, then down: 12 ${tq} → <b>${tq} min</b>`]}),
      num(yM30,{unit:'%',q:'What was the battery percentage of Phone M at 12 30?',work:[`Read up from 12 30 to line M: <b>${yM30}%</b>`]}),
      Object.assign(mc(sL>sM?'Phone L':'Phone M',[sL>sM?'Phone M':'Phone L','Both the same'],String,true),{marks:1,q:'Which phone has a higher rate of increase in battery percentage per minute?',work:[`L: ${40*sL}% in 40 min = ${fmtN(sL)}% per min; M: ${40*sM}% in 40 min = ${fmtN(sM)}% per min.`,`<b>${sL>sM?'Phone L':'Phone M'}</b> charges faster.`]}),
      num(t100,{marks:2,unit:'min',q:'Phone L kept charging at the same rate. How many minutes after 12 00 did it reach 100%?',work:[`At 12 00 Phone L was at 10%. To reach 100% it still needs 100% − 10% = <b>90%</b> more.`,`From part (c), Phone L charges <b>${fmtN(sL)}% every minute</b> (${40*sL}% in 40 minutes).`,`Minutes needed = 90% ÷ ${fmtN(sL)}% per minute = <b>${t100} minutes</b>.`,`So Phone L reaches 100% ${t100} minutes after 12 00, which is at ${clock(12*60+t100)}.`]})]}}});

/* ---------- extra: area and patterns ---------- */
rq({id:'triarea',kind:'mcq1',topic:'area',make(){const b=R(3,12)*2,h=R(4,14),v=b*h/2,sl=R(h+2,h+8);
  const W=300,x0=30,y1=170,S=230/Math.max(b,1),Bx=x0+b*S*(Math.min(b,24)/b),px=x0+pick([.68,.75,.8])*b*S*(Math.min(b,24)/b),top=[px,y1-h*9];
  const g=PG([[x0,y1],[x0+b*S*(Math.min(b,24)/b),y1],top])+`<line class="thin" x1="${r6(px)}" y1="${r6(top[1])}" x2="${r6(px)}" y2="${y1}" stroke-dasharray="5 4"/>`+`<polyline class="thin" points="${r6(px)},${y1-10} ${r6(px+10)},${y1-10} ${r6(px+10)},${y1}"/>`
    +tx(px-6,(top[1]+y1)/2+18,h+' cm','end')+tx((x0+Bx)/2,y1+18,b+' cm')+tx((x0+px)/2-8,(top[1]+y1)/2-10,sl+' cm','end');
  return {stem:'Find the area of the triangle.',fig:svgW(W,195,g,300),parts:[Object.assign(mc(v,[b*h,b*sl/2,sl*h/2,b+h+sl]),{marks:1})].map(p=>(p.opts=p.opts.map(x=>fmtN(+x)+' cm²'),p)),
    work:[`Area of triangle = ½ × base × height. The height must be at right angles to the base, so use ${h} cm (not ${sl} cm).`,`½ × ${b} × ${h} = <b>${fmtN(v)} cm²</b>`]}}});
rq({id:'lshape',kind:'saq',paper:1,topic:'area',make(){const W=R(8,16),H=R(8,16),a=R(3,W-3),c=R(3,H-3),P=2*(W+H),A=W*H-(W-a)*(H-c);
  const S=200/Math.max(W,H),x0=40,y0=20,X=v=>x0+v*S,Y=v=>y0+v*S;
  const g=PG([[X(0),Y(0)],[X(a),Y(0)],[X(a),Y(H-c)],[X(W),Y(H-c)],[X(W),Y(H)],[X(0),Y(H)]],'sh')+tx(X(a/2),Y(0)-6,a+' cm')+tx(X(0)-6,Y(H/2)+4,H+' cm','end')+tx(X(W/2),Y(H)+18,W+' cm')+tx(X(W)+6,Y(H-c/2)+4,c+' cm','start');
  return {stem:'The figure is made up of rectangles. All the angles are right angles.',fig:svgW(300,Y(H)+30,g,300),
    parts:[num(P,{q:'Find the perimeter of the figure.',unit:'cm',work:[`The two short top edges add up to ${W} cm and the two short right edges add up to ${H} cm.`,`Perimeter = 2 × (${W} + ${H}) = <b>${P} cm</b>`]}),
      num(A,{q:'Find the area of the figure.',unit:'cm²',work:[`Big rectangle = ${W} × ${H} = ${W*H} cm²`,`Missing corner = ${W-a} × ${H-c} = ${(W-a)*(H-c)} cm²`,`Area = ${W*H} − ${(W-a)*(H-c)} = <b>${A} cm²</b>`]})]}}});
rq({id:'sticks',kind:'saq',paper:1,topic:'pat',make(){const shp=pick([{n:'squares',k:3,c:1},{n:'triangles',k:2,c:1}]),f=R(6,12),N=shp.k*f+shp.c,g2=R(20,60),N2=shp.k*g2+shp.c;
  const fig1=n=>{let s='';const u=22;if(shp.n==='squares'){for(let i=0;i<n;i++)s+=`<rect x="${10+i*u}" y="10" width="${u}" height="${u}"/>`;return svgW(20+n*u,44,s,20+n*u)}
    for(let i=0;i<n;i++){const x=10+Math.floor(i/2)*u;s+=i%2===0?PG([[x,36],[x+u,36],[x+u/2,10]]):PG([[x+u/2,10],[x+u*1.5,10],[x+u,36]])}return svgW(30+Math.ceil(n/2)*u,46,s,30+Math.ceil(n/2)*u)};
  const fig=`<div class="row" style="gap:18px;align-items:flex-end">${[1,2,3].map(n=>`<div style="display:grid;justify-items:center;gap:4px">${fig1(n)}<small>Figure ${n}</small></div>`).join('')}</div>`;
  return {stem:`Ali used sticks to make a pattern of ${shp.n}. Figure 1 uses ${shp.k+shp.c} sticks, Figure 2 uses ${2*shp.k+shp.c} sticks and Figure 3 uses ${3*shp.k+shp.c} sticks.`,fig,
    parts:[num(N,{q:`How many sticks are needed for Figure ${f}?`,work:[`Each new ${shp.n.slice(0,-1)} adds ${shp.k} sticks: sticks = ${shp.k} × figure number + ${shp.c}`,`Figure ${f}: ${shp.k} × ${f} + ${shp.c} = <b>${N}</b>`]}),
      num(g2,{q:`Which figure uses ${N2} sticks?`,work:[`(${N2} − ${shp.c}) ÷ ${shp.k} = <b>${g2}</b>, so it is Figure ${g2}.`]})]}}});

/* ---------- extra: styles seen in the 2025 prelim papers ---------- */
rq({id:'ooo',kind:'saq',paper:1,topic:'whole',make(){const k=R(2,5),d=R(1,6),c=d+k,b=k*R(2,9),e=R(2,9),a=R(2,20),v1=a+b/k*e,d2=R(2,6),df=d2*R(2,9),c2=R(2,9),b2=R(2,30),a2=b2+df,v2=df*c2/d2;
  return {stem:'',parts:[num(v1,{q:`Find the value of ${a} + ${b} ÷ (${c} − ${d}) × ${e}.`,work:[`Brackets first: ${c} − ${d} = ${k}`,`Then ÷ and × from left to right: ${b} ÷ ${k} = ${b/k}, ${b/k} × ${e} = ${b/k*e}`,`Then +: ${a} + ${b/k*e} = <b>${v1}</b>`]}),
    num(v2,{q:`Find the value of (${a2} − ${b2}) × ${c2} ÷ ${d2}.`,work:[`Brackets first: ${a2} − ${b2} = ${df}`,`${df} × ${c2} = ${df*c2}; ${df*c2} ÷ ${d2} = <b>${v2}</b>`]})]}}});
rq({id:'duration',kind:'saq',paper:1,topic:'meas',make(){const s=R(72,114)*5,e=R(156,222)*5,d=e-s,L=pick([30,45,60]),w=d-L;
  return {stem:`Mr Tan was at work from ${clock(s)} to ${clock(e)}.`,parts:[{type:'multi',marks:1,v:[Math.floor(d/60),d%60],units:['h','min'],q:'How long was he at work?',work:[`${clock(s)} → 12.00 p.m. = ${tm(720-s)}`,`12.00 p.m. → ${clock(e)} = ${tm(e-720)}`,`Total = <b>${tm(d)}</b>`]},
    {type:'multi',marks:1,v:[Math.floor(w/60),w%60],units:['h','min'],q:`He took a lunch break of ${L} min. How long did he actually spend working?`,work:[`${tm(d)} − ${L} min = <b>${tm(w)}</b>`]}]}}});
rq({id:'pets',kind:'saq',paper:1,topic:'data',make(){const n=[R(20,70),R(20,60),R(10,40),R(4,20)];
  return {stem:'The table shows the number of pets each student in a class level keeps at home.',fig:tableH(['Number of pets per student','0','1','2','3'],[['Number of students',...n]]),
    parts:[num(n[2]+n[3],{q:'How many students keep at least 2 pets at home?',work:[`"At least 2" means 2 or more: ${n[2]} + ${n[3]} = <b>${n[2]+n[3]}</b>`]}),
      num(n[1]+2*n[2]+3*n[3],{q:'How many pets do these students keep altogether?',work:[`1 × ${n[1]} + 2 × ${n[2]} + 3 × ${n[3]} = ${n[1]} + ${2*n[2]} + ${3*n[3]} = <b>${n[1]+2*n[2]+3*n[3]}</b>`]})]}}});
rq({id:'pctinc2',kind:'saq',paper:1,topic:'pct',make(){const p=pick([10,20,25,50,40]),a=R(2,12)*20,b=a*(100+p)/100,P=R(3,30)*20,d=pick([10,15,20,25,30]),S=P*(100-d)/100;
  return {stem:'',parts:[num(p,{q:`The cost of a bag increased from ${$m(a)} to ${$m(b)}. What is the percentage increase in the cost of the bag?`,unit:'%',work:[`Increase = ${$m(b-a)}`,`${fr($m(b-a),$m(a))} × 100% = <b>${p}%</b>`]}),
    num(S,{q:`A pair of shoes costs ${$m(P)}. It is sold at a ${d}% discount. What is the sale price?`,pre:'$',work:[`${100-d}% of ${$m(P)} = ${fr(100-d,100)} × ${P} = <b>${$m(S)}</b>`]})]}}});
rq({id:'vertang',kind:'saq',paper:1,topic:'angle',make(){const x=R(25,75),O=[160,112],dir=(a,r)=>[O[0]+r*Math.cos(a*deg),O[1]-r*Math.sin(a*deg)];
  const A=dir(180,130),B=dir(0,130),C=dir(180-x,88),D=dir(-x,88);const g=ln(A,B)+ln(C,D)+angArc(O,A,C,x+'°',30)+lab(A,'A',-10,4)+lab(B,'B',10,4)+lab(C,'C',-8,-6)+lab(D,'D',8,14)+lab(O,'O',14,20);
  return {stem:`AB and CD are straight lines that cross at O. ∠AOC = ${x}°.`,fig:svgW(320,230,g,320),parts:[num(180-x,{q:'Find ∠BOC.',unit:'°',work:[`Angles on a straight line add up to 180°: ∠BOC = 180° − ${x}° = <b>${180-x}°</b>`]}),
    num(x,{q:'Find ∠BOD.',unit:'°',work:[`∠BOD and ∠AOC are vertically opposite angles, so they are equal: <b>${x}°</b>`]})]}}});
rq({id:'sumdiff',kind:'saq',paper:2,topic:'whole',make(){const i=R(500,3000)*10,D=R(100,Math.floor(i/10)-50)*10,T=2*i-D;
  return {stem:'',parts:[num(i/100,{marks:2,pre:'$',q:`Mrs Chia bought an iron and a kettle for ${$m(T/100)}. The kettle cost ${$m(D/100)} less than the iron. How much did the iron cost?`,work:[`If the kettle cost the same as the iron, the total would be ${$m(T/100)} + ${$m(D/100)} = ${$m((T+D)/100)}`,`Iron = ${$m((T+D)/100)} ÷ 2 = <b>${$m(i/100)}</b>`]})]}}});
rq({id:'Lelec',kind:'long',topic:'rate',make(){let U1,r1,r2,U,B,Bu;do{U1=pick([150,180,200]);r1=pick([20,25,30]);r2=r1+pick([5,10,15]);U=U1+R(2,30)*5;Bu=U1+R(2,40)*5;B=U1*r1+(Bu-U1)*r2}while((U1*r1+(U-U1)*r2)%100);const c=U1*r1+(U-U1)*r2,g=c*109/100;
  const fig=tableH(['Usage','Charges'],[[`First ${U1} units`,`${$m(r1/100)} per unit`],[`Any usage above ${U1} units`,`${$m(r2/100)} per unit`]]);
  return {stem:'The table shows how much an electricity company charges for electricity. The charges are before GST.',fig,
    parts:[num(g/100,{marks:2,pre:'$',tol:.006,q:`In January, the Wang family used ${U} units of electricity. How much did they pay after including 9% GST?`,work:[`First ${U1} units: ${U1} × ${$m(r1/100)} = ${$m(U1*r1/100)}`,`Next ${U-U1} units: ${U-U1} × ${$m(r2/100)} = ${$m((U-U1)*r2/100)}`,`Before GST = ${$m(c/100)}; with GST: 109% × ${$m(c/100)} = <b>${$m(g/100)}</b>`]}),
      num(Bu,{q:`In February, their charges were ${$m(B/100)} before GST. How many units did they use?`,work:[`First ${U1} units cost ${$m(U1*r1/100)}`,`${$m(B/100)} − ${$m(U1*r1/100)} = ${$m((B-U1*r1)/100)} → ${$m((B-U1*r1)/100)} ÷ ${$m(r2/100)} = ${Bu-U1} more units`,`Total = ${U1} + ${Bu-U1} = <b>${Bu}</b> units`]})]}}});
rq({id:'Lfilepen',kind:'long',topic:'whole',make(){const p=R(5,30)*10,d=p+R(3,30)*10,f=R(3,12),T=f*(p+d)+2*f*p,x=f*(d-p);
  return {stem:`A file cost ${$m(d/100)} more than a pen. Hakim bought twice as many pens as files. He spent a total of ${$m(T/100)}. He spent ${$m(x/100)} more on the files than on the pens.`,
    parts:[num((2*p+d)/100,{marks:3,pre:'$',q:'Find the total cost of a pen and a file.',work:[`Files + pens = ${$m(T/100)}; files − pens = ${$m(x/100)}`,`All files = (${$m(T/100)} + ${$m(x/100)}) ÷ 2 = ${$m(f*(p+d)/100)}; all pens = ${$m(2*f*p/100)}`,`Half the pens = the same number as the files = ${$m(f*p/100)}`,
      `So (file − pen) × number of files = ${$m(f*(p+d)/100)} − ${$m(f*p/100)} = ${$m(f*d/100)} → ${$m(f*d/100)} ÷ ${$m(d/100)} = ${f} files`,`File = ${$m((p+d)/100)}, pen = ${$m(p/100)}: total = <b>${$m((2*p+d)/100)}</b>`]})]}}});
rq({id:'Lclub',kind:'long',topic:'pct',make(){let M,a,b,c,fe,ma,Fn,mn;do{M=R(10,40)*20;a=pick([35,40,45,60]);b=pick([12.5,20,25,37.5,50]);c=pick([10,20,25,30,40]);fe=M*a/100;ma=M-fe;mn=ma*(100+b)/100;Fn=fe*(100-c)/100}while(![fe,mn,Fn].every(Number.isInteger));
  return {stem:`A fitness club had ${M} members in 2023. ${a}% of the members were females and the rest were males. In 2024, the number of male members increased by ${b}% and the number of female members dropped to ${Fn}.`,
    parts:[num(c,{marks:2,unit:'%',q:'Find the percentage decrease in the number of female members from 2023 to 2024.',work:[`Females in 2023 = ${a}% × ${M} = ${fe}`,`Decrease = ${fe} − ${Fn} = ${fe-Fn}`,`${fr(fe-Fn,fe)} × 100% = <b>${c}%</b>`]}),
      num(mn+Fn,{marks:2,q:'What was the total number of members in the club in 2024?',work:[`Males in 2023 = ${M} − ${fe} = ${ma}`,`Males in 2024 = ${100+b}% × ${ma} = ${mn}`,`Total = ${mn} + ${Fn} = <b>${mn+Fn}</b>`]})]}}});
rq({id:'Lcurry',kind:'long',topic:'alg',make(){const k=pick([2,3]),A=R(10,50),m=R(4,9),Bb=R(2,9),W=R(10,30),cst=pick([1.5,2,2.5]),ca=5*k+1+m,cb=A-Bb;
  return {stem:`The table shows the number of curry puffs sold at a shop last week.`,fig:tableH(['Day','Number of curry puffs sold'],[['Monday to Friday',`${k}${vi('w')} per day`],['Saturday',`${vi('w')} + ${A}`],['Sunday',`${m}${vi('w')} − ${Bb}`]]),
    parts:[{type:'expr',marks:1,v:{c:ca,k:cb,x:'w'},show:lin(ca,'w',cb),q:`How many curry puffs were sold altogether last week? Give your answer in terms of ${vi('w')} in the simplest form.`,work:[`Monday to Friday: 5 × ${k}${vi('w')} = ${5*k}${vi('w')}`,`${5*k}${vi('w')} + ${vi('w')} + ${A} + ${m}${vi('w')} − ${Bb} = <b>${lin(ca,'w',cb)}</b>`]},
      num(ca*W+cb,{q:`How many curry puffs were sold altogether when ${vi('w')} = ${W}?`,work:[`${ca} × ${W} + ${cb} = <b>${ca*W+cb}</b>`]}),
      num(r6((W+A)*cst),{q:`Each curry puff cost ${$m(cst)}. How much money was collected on Saturday when ${vi('w')} = ${W}?`,pre:'$',work:[`Saturday = ${W} + ${A} = ${W+A} puffs`,`${W+A} × ${$m(cst)} = <b>${$m((W+A)*cst)}</b>`]})]}}});

/* ---------- difficulty: 1 Foundation, 2 Standard, 3 Challenge ---------- */
const RQLV={sqangle:3,givenaway:3,overlap:3,discount:2,shortleft:2,patsum:2,steprate:2,rolls:2,ring:2,
  cloth:2,paraang:2,ratio2:2,plantbar:2,rectY:3,pietfn:2,gst:2,
  Lalgcost:2,Lpct2:2,Lcourt:3,Lrhombus:2,Lcookies:3,Ltanks:3,Lsemi:2,Lstickers:2,Lmuffin:3,Lpie:2,Lcubetank:2,Lbeads:2,Lcamp:3,Lpoints:3,Lequal:3,Ljackets:3,Lboxes:2,Lelec:2,Lfilepen:3,Lclub:2};
RQB.forEach(g=>{g.lv=RQLV[g.id]||1});
