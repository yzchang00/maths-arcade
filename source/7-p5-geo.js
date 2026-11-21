/* ================= P5 MEASUREMENT AND GEOMETRY ================= */

/* P5-7. Height Finder — Area of triangle */
addGame('p5-tarea',{level:'P5',strand:'geo',glyph:'◺',title:'Height Finder',topic:'Area of triangle: base and height',
 how:'The base is the thick orange side. Pick the line that is the height for that base, then work out the area. Each square is 1 cm by 1 cm.',rounds:8,
 round(api,r){const vert=r>=5&&r%2===1,G=12,cs=24;let x1,bl,yb,h,xa;
  for(;;){bl=R(4,7);x1=R(1,G-1-bl);yb=R(8,11);h=R(4,yb-1);
    xa=r<2?R(x1+1,x1+bl-1):r<4?pick([x1,x1+bl]):pick([x1-R(2,3),x1+bl+R(2,3)]);if(xa>=0&&xa<=G&&!(r<2&&xa*2===2*x1+bl))break}
  const ya=yb-h,A=[xa,ya],B1=[x1,yb],B2=[x1+bl,yb],F=[xa,yb],mid=[x1+bl/2,yb];
  const side=xa===x1?B2:B1,other=side===B1?B2:B1;const cands=shuffle([{p:[A,F],ok:true},{p:[A,side]},{p:[A,xa===mid[0]?other:mid]}]);
  const T=p=>vert?[p[1],p[0]]:p,P=p=>{const q=T(p);return [q[0]*cs+10,q[1]*cs+10]},ln=(a,b)=>`x1="${P(a)[0]}" y1="${P(a)[1]}" x2="${P(b)[0]}" y2="${P(b)[1]}"`;
  let g='';for(let i=0;i<=G;i++)g+=`<line x1="${10+i*cs}" y1="10" x2="${10+i*cs}" y2="${10+G*cs}" stroke="var(--line)"/><line x1="10" y1="${10+i*cs}" x2="${10+G*cs}" y2="${10+i*cs}" stroke="var(--line)"/>`;
  const ext=xa<x1?ln(F,B1):xa>x1+bl?ln(B2,F):'';const cc=['var(--teal)','var(--violet)','#c98a00'],L=['A','B','C'];
  const segs=cands.map((c,i)=>{const f=[.3,.55,.8][i],m=P([c.p[0][0]+(c.p[1][0]-c.p[0][0])*f,c.p[0][1]+(c.p[1][1]-c.p[0][1])*f]);return `<line ${ln(...c.p)} stroke="${cc[i]}" stroke-width="3.5" stroke-dasharray="7 5"/><circle cx="${m[0]}" cy="${m[1]}" r="11" style="fill:${cc[i]}" stroke="var(--surface)" stroke-width="2"/><text x="${m[0]}" y="${m[1]+5}" text-anchor="middle" style="fill:#fff;font-weight:800;font-size:13px">${L[i]}</text>`}).join('');
  api.q(`<p class="qt">The base is <b>${bl} cm</b>. Which dashed line is the <b>height</b> for this base?</p>`);
  api.body.innerHTML=`<svg viewBox="0 0 ${G*cs+20} ${G*cs+20}" class="msvg" style="max-width:340px" role="img" aria-label="Triangle on a square grid">${g}
    <polygon points="${[A,B1,B2].map(p=>P(p).join(',')).join(' ')}" style="fill:color-mix(in srgb,var(--sun) 30%,transparent)" stroke="var(--ink)" stroke-width="2.5"/>
    ${ext?`<line ${ext} stroke="var(--ink)" stroke-width="2" stroke-dasharray="2 4"/>`:''}<line ${ln(B1,B2)} stroke="var(--tomato)" stroke-width="6" stroke-linecap="round"/>${segs}</svg>
    <div class="row" id="hC">${L.map((l,i)=>`<button class="btn" data-i="${i}" style="border-color:${cc[i]}">Line ${l}</button>`).join('')}</div><div id="hS"></div>`;
  let pk=null,hMiss=ctx.keep.h==='pen';
  $('hC').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(pk!==null||api.answered)return;if(!cands[+b.dataset.i].ok&&api.first('h')){b.disabled=true;b.classList.add('no');api.retry($('hS'),'Not that one. The height must meet the base at a right angle. Try again!');return}
    if(!cands[+b.dataset.i].ok){hMiss=true;b.disabled=true;b.classList.add('no');sfx.no();$('hC').querySelectorAll('button').forEach((x,i)=>{if(cands[i].ok){x.disabled=false;x.style.boxShadow='0 0 0 4px #ffd257'}else x.disabled=true});$('hS').innerHTML=`<p class="retrymsg">Not quite. Line ${L[cands.findIndex(c=>c.ok)]} is the height: it meets the base at a right angle. Tap it to carry on.</p>`;return}
    pk=+b.dataset.i;const ok=!hMiss;ctx.keep.h=ok?'ok':'pen';b.style.boxShadow='';
    $('hC').querySelectorAll('button').forEach((x,i)=>{x.disabled=true;if(cands[i].ok)x.classList.add('ok')});sfx.pop();
    $('hS').innerHTML=`<p style="margin:0 0 8px;font-weight:800">${ok?'Yes!':'Now you have the height.'} The height is ${h} cm.</p>
      <div class="row"><b>Area =</b><input class="num" id="hIn" inputmode="decimal" aria-label="Area"><span>cm²</span><button class="btn primary" id="hChk">Check</button></div>`;
    $('hChk').onclick=()=>{const v=parseFloat($('hIn').value);if(isNaN(v))return;const ar=bl*h/2,o2=Math.abs(v-ar)<.001;$('hIn').disabled=true;
      api.done(o2,`Area = ${ar} cm²`,['The height goes from the opposite corner and meets the base (or the base extended) at a right angle.',
        xa<x1||xa>x1+bl?'Here the height falls outside the triangle, so the base is extended with a dotted line.':xa===x1||xa===x1+bl?'Here one side of the triangle is already at right angles to the base, so that side is the height.':'',
        `Area = ½ × base × height = ½ × ${bl} × ${h} = <b>${ar} cm²</b>`].filter(Boolean),(ok?4:0)+(o2?6:0))}});
  if(ctx.keep.h)$('hC').querySelectorAll('button')[cands.findIndex(c=>c.ok)].click()}});

/* P5-8. Cube Builder — Volume of cube and cuboid, liquid in a tank */
function isoCubes(L,B,H){const s=20,c=.866,P=(x,y,z)=>[(x-y)*s*c,(x+y)*s*.5-z*s],cubes=[];
  for(let z=0;z<H;z++)for(let y=0;y<B;y++)for(let x=0;x<L;x++)cubes.push([x,y,z]);cubes.sort((p,q)=>(p[0]+p[1]+p[2])-(q[0]+q[1]+q[2]));
  const poly=(pts,f)=>`<polygon points="${pts.map(p=>P(...p).map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="${f}" stroke="#16233a" stroke-width="1.2" stroke-linejoin="round"/>`;
  const body=cubes.map(([x,y,z])=>poly([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],'#9fd8f5')+poly([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],'#4fa3d1')+poly([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],'#2f7fae')).join('');
  const xs=[P(0,B,0)[0],P(L,0,0)[0]],y0=P(0,0,H)[1],y1=P(L,B,0)[1];
  return `<svg viewBox="${xs[0]-6} ${y0-6} ${xs[1]-xs[0]+12} ${y1-y0+12}" style="width:${Math.min(320,(xs[1]-xs[0])*1.6)}px;max-width:100%;height:auto" role="img" aria-label="Cuboid made of ${L*B*H} unit cubes">${body}</svg>`}
function isoTank(L,B,H,w){const sc=200/(L+B+H*.6),c=.866,P=(x,y,z)=>[(x-y)*sc*c,(x+y)*sc*.5-z*sc],pt=p=>P(...p).map(v=>v.toFixed(1)).join(',');
  const face=(a,f,o)=>`<polygon points="${a.map(pt).join(' ')}" style="fill:${f};fill-opacity:${o}" stroke="none"/>`;
  const water=face([[0,0,w],[L,0,w],[L,B,w],[0,B,w]],'#5ab8f0',.75)+face([[L,0,0],[L,B,0],[L,B,w],[L,0,w]],'#2f8fd0',.75)+face([[0,B,0],[L,B,0],[L,B,w],[0,B,w]],'#2378b5',.75);
  const E=[[[0,0,0],[L,0,0]],[[0,0,0],[0,B,0]],[[0,0,0],[0,0,H]],[[L,0,0],[L,B,0]],[[L,0,0],[L,0,H]],[[0,B,0],[L,B,0]],[[0,B,0],[0,B,H]],[[L,B,0],[L,B,H]],[[0,0,H],[L,0,H]],[[0,0,H],[0,B,H]],[[L,0,H],[L,B,H]],[[0,B,H],[L,B,H]]];
  const edges=E.map(([a,b],i)=>`<line x1="${P(...a)[0]}" y1="${P(...a)[1]}" x2="${P(...b)[0]}" y2="${P(...b)[1]}" stroke="var(--ink)" stroke-width="2" ${i<3?'stroke-dasharray="4 4" stroke-opacity=".5"':''}/>`).join('');
  const lab=(p,t,dx,dy)=>`<text x="${P(...p)[0]+dx}" y="${P(...p)[1]+dy}" text-anchor="middle" class="axl" style="font-size:12px;fill:var(--ink)">${t}</text>`;
  const xs=[P(0,B,0)[0],P(L,0,0)[0]],y0=P(0,0,H)[1],y1=P(L,B,0)[1];
  return `<svg viewBox="${xs[0]-60} ${y0-14} ${xs[1]-xs[0]+130} ${y1-y0+40}" style="width:100%;max-width:380px;height:auto" role="img" aria-label="Tank partly filled with water">${water}${edges}
    ${lab([L/2,B,0],L+' cm',-10,22)}${lab([L,B/2,0],B+' cm',22,18)}${lab([L,0,H/2],H+' cm',30,0)}${lab([0,B,w/2],w+' cm',-32,0).replace('fill:var(--ink)','fill:#2378b5;font-weight:800')}</svg>`}
addGame('p5-volume',{level:'P5',strand:'geo',glyph:'▣',title:'Cube Builder',topic:'Volume of cubes and cuboids; liquid in a tank',
 how:'Count, build and calculate volumes. Each small cube is 1 cm by 1 cm by 1 cm, so its volume is 1 cm³.',rounds:8,
 round(api,r){const type=['count','count','build','build','miss','miss','tank','tank'][r];
  const ans1=(ans,u,work,q,pic,dec)=>{api.q(`<p class="qt">${q}</p>`);api.body.innerHTML=pic+`<div class="row"><input class="num" id="cuIn" inputmode="${dec?'decimal':'numeric'}" aria-label="Answer"><span>${u}</span><button class="btn primary" id="cuChk">Check</button></div>`;
    $('cuChk').onclick=()=>{const v=parseFloat($('cuIn').value);if(isNaN(v))return;$('cuIn').disabled=true;const ok=Math.abs(v-ans)<.001;api.done(ok,`The answer is ${ans} ${u}.`,work)}};
  if(type==='count'){const L=R(2,5),B=R(2,4),H=R(2,4);
    ans1(L*B*H,'cm³',[`Each layer has ${L} × ${B} = ${L*B} cubes.`,`There are ${H} layers: ${L*B} × ${H} = <b>${L*B*H} cm³</b>`,'Volume of a cuboid = length × breadth × height'],'What is the volume of this cuboid?</p><p class="qs">Each small cube is 1 cm by 1 cm by 1 cm, so it has a volume of <b>1 cm³</b>.',isoCubes(L,B,H))}
  else if(type==='miss'){const L=R(2,6),B=R(2,5),H=R(2,6),V=L*B*H;
    ans1(H,'cm',[`Base area = ${L} × ${B} = ${L*B} cm²`,`Height = volume ÷ base area = ${V} ÷ ${L*B} = <b>${H} cm</b>`],
      `A cuboid has a volume of <b>${V} cm³</b>. Its base is ${L} cm by ${B} cm (one layer is shown). What is its height?</p><p class="qs">Each small cube is 1 cm by 1 cm by 1 cm, so it has a volume of <b>1 cm³</b>.`,isoCubes(L,B,1))}
  else if(type==='tank'){const L=pick([20,25,30,40,50]),B=pick([10,15,20,25,30]),H=pick([20,25,30,35,40]),w=pick([5,10,15,20].filter(x=>x<H)),V=L*B*w;
    ans1(V/1000,'ℓ',[`Volume of water = ${L} × ${B} × ${w} = ${fmt(V)} cm³`,`1000 cm³ = 1 ℓ, so ${fmt(V)} cm³ = ${fmt(V)} ÷ 1000 = <b>${V/1000} ℓ</b>`],
      `A tank ${L} cm long, ${B} cm wide and ${H} cm high has water ${w} cm deep. How many litres of water are in the tank?`,isoTank(L,B,H,w),true)}
  else{const L0=R(2,6),B0=R(2,6),h=R(2,4),V=L0*B0*h;const d={L:1,B:1,H:1};
    api.q(`<p class="qt">Build a cuboid with volume <b>${V} cm³</b> and height <b>${h} cm</b>.</p><p class="qs">Each small cube is 1 cm³ (1 cm by 1 cm by 1 cm). There may be more than one way.</p>`);
    api.body.innerHTML=`<div id="cuP" style="min-height:160px;display:grid;place-items:start"></div><div class="row" id="cuS"></div><div class="row"><span class="pill" id="cuV" style="font-size:1.05rem"></span><button class="btn primary" id="cuChk">Check</button></div>`;
    const draw=()=>{$('cuP').innerHTML=isoCubes(d.L,d.B,d.H);$('cuV').textContent=`Volume: ${d.L} × ${d.B} × ${d.H} = ${d.L*d.B*d.H} cm³`;
      $('cuS').innerHTML=[['L','Length'],['B','Breadth'],['H','Height']].map(([k,n])=>`<div class="stepper"><span>${n}</span><button class="btn" data-k="${k}" data-d="-1" aria-label="${n} down">−</button><b>${d[k]}</b><button class="btn" data-k="${k}" data-d="1" aria-label="${n} up">+</button></div>`).join('');
      $('cuS').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(api.answered)return;const k=b.dataset.k;d[k]=Math.max(1,Math.min(6,d[k]+ +b.dataset.d));sfx.tap();draw()})};draw();
    $('cuChk').onclick=()=>{const v=d.L*d.B*d.H,ok=v===V&&d.H===h;api.done(ok,ok?`${d.L} cm × ${d.B} cm × ${d.H} cm = ${V} cm³`:`Your cuboid is ${v} cm³ with height ${d.H} cm.`,
      [`With height ${h} cm, the base area must be ${V} ÷ ${h} = ${V/h} cm².`,`Any length × breadth that makes ${V/h} works, for example ${L0} × ${B0}.`])}}}});

/* P5-9. Angle Detective — Angles on a straight line, at a point, vertically opposite */
function angSVG(dirs,secs,lines){const cx=170,cy=140,Lr=120,pt=(a,l)=>[(cx+l*Math.cos(a*Math.PI/180)).toFixed(1),(cy-l*Math.sin(a*Math.PI/180)).toFixed(1)];
  let s=lines.map(([a,b])=>`<line x1="${pt(a,Lr)[0]}" y1="${pt(a,Lr)[1]}" x2="${pt(b,Lr)[0]}" y2="${pt(b,Lr)[1]}" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>`).join('');
  s+=dirs.map(a=>`<line x1="${cx}" y1="${cy}" x2="${pt(a,Lr)[0]}" y2="${pt(a,Lr)[1]}" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/>`).join('');
  secs.forEach(({a,b,lab,hot})=>{const rr=hot?30:24,[x0,y0]=pt(a,rr),[x1,y1]=pt(b,rr),m=(a+b)/2,span=b-a,lr=span<35?70:52,[lx,ly]=pt(m,lr);
    s+=`<path d="M${x0},${y0} A${rr},${rr} 0 ${span>180?1:0} 0 ${x1},${y1}" fill="none" stroke="${hot?'var(--tomato)':'var(--teal)'}" stroke-width="${hot?3:2.5}"/>`;
    s+=`<text x="${lx}" y="${(+ly+5).toFixed(1)}" text-anchor="middle" style="font:800 ${hot?17:15}px var(--body);fill:${hot?'var(--tomato)':'var(--ink)'}">${lab}</text>`});
  return `<svg viewBox="20 10 300 260" class="msvg" style="max-width:360px" role="img" aria-label="Angle diagram">${s}<circle cx="${cx}" cy="${cy}" r="3.5" style="fill:var(--ink)"/></svg>`}
const PROPS={line:'Angles on a straight line add up to 180°',point:'Angles at a point add up to 360°',vert:'Vertically opposite angles are equal'};
addGame('p5-angles',{level:'P5',strand:'geo',glyph:'∡',title:'Angle Detective',topic:'Angles on a straight line, at a point, vertically opposite',
 how:'Find the unknown angle x. First choose the angle fact you need, then work out x. Diagrams are not drawn to scale.',rounds:8,
 round(api,r){const type=['line','point','vert','line','point','vadj','vert','point'][r],rot=R(0,40);let secs,dirs=[],lines=[],x,prop,work;
  const parts=(n,tot,mn,mx)=>{for(;;){const p=Array.from({length:n-1},()=>R(mn,mx)),last=tot-p.reduce((a,b)=>a+b,0);if(last>=mn&&last<=mx)return [...p,last]}};
  if(type==='line'||type==='point'){const ps=type==='line'?parts(3,180,25,110):parts(4,360,40,140),xi=R(0,ps.length-1);let a=rot;
    secs=ps.map((p,i)=>{const s={a,b:a+p,lab:i===xi?'x':p+'°',hot:i===xi};a+=p;return s});
    if(type==='line'){lines=[[rot,rot+180]];dirs=[secs[1].a,secs[2].a]}else dirs=secs.map(s=>s.a);
    x=ps[xi];prop=type;const kn=ps.filter((_,i)=>i!==xi);work=[`${PROPS[type]}.`,`x = ${type==='line'?180:360}° − ${kn.join('° − ')}° = <b>${x}°</b>`]}
  else{let th;do{th=R(35,145)}while(Math.abs(th-90)<8);lines=[[rot,rot+180],[rot+th,rot+180+th]];const val=[th,180-th,th,180-th],xi=type==='vert'?2:pick([1,3]);
    secs=val.map((v,i)=>({a:rot+[0,th,180,180+th][i],b:rot+[th,180,180+th,360][i],lab:i===0?th+'°':i===xi?'x':'',hot:i===xi})).filter(s=>s.lab);
    x=val[xi];prop=type==='vert'?'vert':'line';work=type==='vert'?[`${PROPS.vert}.`,`x is opposite the ${th}° angle, so x = <b>${th}°</b>`]:[`x and ${th}° sit next to each other on a straight line.`,`${PROPS.line}, so x = 180° − ${th}° = <b>${x}°</b>`]}
  api.q(`<p class="qt">Find the value of <b>x</b>.</p>`);
  api.body.innerHTML=angSVG(dirs,secs,lines)+`<div style="font-weight:800">Step 1: Which angle fact do you need?</div><div class="choices one" id="adP">${Object.entries(PROPS).map(([k,t])=>`<button class="btn" data-k="${k}">${t}</button>`).join('')}</div><div id="adS"></div>`;
  let pOk=null,fMiss=ctx.keep.fact==='pen';
  $('adP').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(pOk!==null)return;if(b.dataset.k!==prop&&api.first('fact')){b.disabled=true;b.classList.add('no');api.retry($('adS'),'That fact does not fit this diagram. Look at where x is and try another!');return}if(b.dataset.k!==prop){fMiss=true;b.disabled=true;b.classList.add('no');sfx.no();$('adP').querySelectorAll('button').forEach(y=>{if(y.dataset.k===prop){y.disabled=false;y.style.boxShadow='0 0 0 4px #ffd257'}else y.disabled=true});$('adS').innerHTML='<p class="retrymsg">Not quite. The fact you need is glowing. Tap it to carry on.</p>';return}pOk=!fMiss;ctx.keep.fact=pOk?'ok':'pen';b.style.boxShadow='';$('adP').querySelectorAll('button').forEach(y=>{y.disabled=true;if(y.dataset.k===prop)y.classList.add('ok')});sfx.pop();
    $('adS').innerHTML=`<div class="row"><b>Step 2: x =</b><input class="num" id="adIn" inputmode="numeric" aria-label="x"><span>°</span><button class="btn primary" id="adChk">Check</button></div>`;
    $('adChk').onclick=()=>{const v=parseInt($('adIn').value,10);if(isNaN(v))return;$('adIn').disabled=true;const o=v===x;api.done(o,`x = ${x}°`,work,(pOk?4:0)+(o?6:0))}});
  if(ctx.keep.fact)$('adP').querySelector(`[data-k="${prop}"]`).click()}});

/* P5-10. Triangle Sorter — Properties of triangles, angle sum.
   Two kinds of round take turns:
   • Triangle warehouse (even rounds): 5 parcels ride a belt one at a time; drag or tap each into the right crate before it drops off.
     Wrong bins are real mistakes and say why. 2 points a triangle.
   • Missing Corner Rescue (odd rounds): step 1 (a fact or a first angle) must be right before step 2 (find x) opens.
   Easy = rounds 0–3 (angle bins, side bins, angle-sum discovery, right angle); Hard = rounds 4–7 (impossible triangles,
   two-label bins with a hidden third angle, isosceles, extended side). */
document.head.insertAdjacentHTML('beforeend',`<style>
/* Triangle warehouse: scanner screen on top, a moving belt with the parcel, crates underneath. Cardboard and belt colours are object colours, the same in both themes. */
.tswh{--card:#d9a66b;--card2:#b98146;--cardInk:#5b3713;--belt:#2d3442;position:relative;max-width:440px;width:100%;margin:0 auto;box-sizing:border-box;border:3px solid var(--ink);border-radius:18px;overflow:hidden;
  background:linear-gradient(var(--soft) 0 0) top/100% 100%;display:grid;gap:10px;padding:10px 10px 12px}
.tswh::before{content:'';position:absolute;inset:0 0 auto;height:118px;opacity:.5;pointer-events:none;
  background:repeating-linear-gradient(0deg,transparent 0 34px,color-mix(in srgb,var(--ink) 18%,transparent) 34px 37px),repeating-linear-gradient(90deg,transparent 0 70px,color-mix(in srgb,var(--ink) 12%,transparent) 70px 73px)}
.tshud{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;font:800 13px var(--body)}
.tshud .tsk{background:var(--surface);border:2px solid var(--ink);border-radius:999px;padding:2px 10px}
.tshud .tsst{color:var(--tomato);font-size:15px;min-width:3em;text-align:right}
.tstime{flex:1;height:12px;border-radius:99px;background:var(--surface);border:2px solid var(--ink);overflow:hidden}
.tstime i{display:block;height:100%;width:100%;background:var(--teal)}
.tstime i.low{background:var(--tomato)}
.tsscan{position:relative;background:#0b1830;border:3px solid var(--ink);border-radius:14px;padding:20px 6px 6px;box-shadow:0 4px 0 var(--ink)}
.tsscan::before{content:'X-RAY SCREEN';position:absolute;left:10px;top:4px;font:800 10px var(--body);letter-spacing:.14em;color:#7ee0d6;z-index:1}
.tsscan::after{content:'';position:absolute;right:12px;top:7px;width:8px;height:8px;border-radius:50%;background:#3b4a63}
.tsscan.live::after{background:#4dff9a;box-shadow:0 0 8px #4dff9a}
.tsscr{position:relative;border-radius:9px;min-height:150px;display:grid;place-items:center;overflow:hidden;
  background:radial-gradient(circle at 50% 45%,#12305a,#071226 75%);background-image:radial-gradient(circle at 50% 45%,#12305a,#071226 75%),repeating-linear-gradient(0deg,#ffffff08 0 1px,transparent 1px 16px),repeating-linear-gradient(90deg,#ffffff08 0 1px,transparent 1px 16px);background-blend-mode:screen}
.tsscr .idle{font:800 13px var(--body);color:#7ee0d6;opacity:.8;letter-spacing:.06em;animation:tsblink 1.2s steps(2) infinite}
@keyframes tsblink{50%{opacity:.3}}
.tsscr .img{width:100%;display:grid;place-items:center}
.tsscr.scan .img{animation:tsreveal 1s linear}
.tsscr.scan::after{content:'';position:absolute;top:0;bottom:0;width:4px;left:0;background:#8ff8ff;box-shadow:0 0 14px 4px #8ff8ffaa;animation:tsline 1s linear forwards}
@keyframes tsreveal{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes tsline{from{left:0}to{left:100%;opacity:0}}
.tsscr svg{display:block;width:100%;height:auto;max-width:300px!important}
.tsscr svg polygon{fill:#8ff8ff22!important;stroke:#a9fbff;filter:drop-shadow(0 0 3px #8ff8ff)}
.tsscr svg text{fill:#effeff!important}
.tsscr svg text[style*="tomato"]{fill:#ff8f80!important}
.tsscr svg path[stroke="var(--ink)"]{stroke:#a9fbff}
.tshit{pointer-events:none}
.tsscr.tap .tshit{pointer-events:all;cursor:pointer;stroke:#8ff8ff;stroke-width:2;stroke-dasharray:4 5;animation:tsdash 1.2s linear infinite}
@keyframes tsdash{to{stroke-dashoffset:-18}}
.tsscr .tv.pick .tshit{fill:#4dff9a33;stroke:#4dff9a;stroke-width:3;stroke-dasharray:none;animation:none}
.tsscr .tv.miss .tshit{fill:#ff6b5733;stroke:#ff8f80;stroke-dasharray:none;animation:none}
.tsstep{position:relative;justify-self:stretch;margin:0 8px 8px;background:#16233ae6;color:#effeff;border:2px solid #8ff8ff;border-radius:10px;padding:4px 8px;font:800 13px/1.3 var(--body);text-align:center}
.tsstep.ok{border-color:#4dff9a}.tsstep.no{border-color:#ff8f80}
@media (prefers-reduced-motion:reduce){.tsscr.tap .tshit{animation:none}}
.tsbelt{position:relative;height:120px;touch-action:none}
.tsbelt .rail{position:absolute;left:26px;right:44px;bottom:6px;height:26px;border-radius:13px;background:var(--belt);border:3px solid var(--ink);overflow:hidden}
.tsbelt .rail::before{content:'';position:absolute;inset:3px 0;background:repeating-linear-gradient(90deg,#4a5366 0 14px,transparent 14px 28px);animation:tsroll .9s linear infinite}
.tsbelt.stop .rail::before{animation-play-state:paused}
@keyframes tsroll{to{background-position:28px 0}}
.tsbelt .chute{position:absolute;right:0;bottom:0;z-index:6;width:46px;height:44px;border:3px solid var(--ink);border-top:0;border-radius:0 0 10px 10px;background:repeating-linear-gradient(45deg,var(--sun) 0 8px,#16233a 8px 16px)}
.tsbelt .chute::after{content:'MISS';position:absolute;inset:auto 0 -1px;text-align:center;font:800 9px var(--body);color:#fff;background:#16233a}
.tsworker{position:absolute;left:-4px;bottom:0;width:50px;height:98px;z-index:7}
.tsworker svg{width:100%;height:100%;overflow:visible}
.tsworker .arm{transform-box:view-box;transform-origin:39.5px 42px;transition:transform .3s}
.tsworker.lift .arm{animation:tslift .7s ease-in-out}
@keyframes tslift{35%{transform:rotate(-115deg)}70%{transform:rotate(-60deg)}}
.tsworker.cheer{animation:tshop .5s 2}
.tsworker.cheer .arm{transform:rotate(-150deg)}
@keyframes tshop{50%{transform:translateY(-6px)}}
.tsworker.sad svg{transform:rotate(-6deg);transform-origin:bottom}
.tsworker .m2{display:none}.tsworker.sad .m1{display:none}.tsworker.sad .m2{display:inline}
.tsxray{position:absolute;left:48px;bottom:8px;width:88px;height:94px;z-index:6;pointer-events:none}
.tsxray .body{position:absolute;inset:0;background:linear-gradient(#cfd8e3,#aab6c5);border:3px solid var(--ink);border-radius:16px 16px 6px 6px;box-shadow:inset 0 -6px 0 #8e9bad}
.tsxray .hole{position:absolute;left:9px;right:9px;bottom:8px;height:50px;border:3px solid var(--ink);border-radius:8px 8px 2px 2px;background:#0b1830;overflow:hidden}
.tsxray .hole::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,#27416bcc 0 6px,#16233acc 6px 8px)}
.tsxray .sign{position:absolute;left:50%;top:7px;transform:translateX(-50%);background:var(--sun);border:2px solid var(--ink);border-radius:5px;font:800 10px/1 var(--body);color:#16233a;padding:3px 5px;letter-spacing:.06em;white-space:nowrap}
.tsxray .lamp{position:absolute;left:50%;top:-12px;width:16px;height:10px;margin-left:-8px;border:2.5px solid var(--ink);border-bottom:0;border-radius:8px 8px 0 0;background:#7a8597}
.tsxray.on .lamp{background:#4dff9a;box-shadow:0 0 12px 3px #4dff9a}
.tsxray.on .hole{box-shadow:inset 0 0 14px #8ff8ff}
.tsxray .cable{position:absolute;left:calc(50% + 14px);top:-31px;width:5px;height:33px;background:#16233a;border-radius:3px}
.tsparcel{position:absolute;bottom:28px;left:0;width:58px;height:44px;cursor:grab;z-index:5;touch-action:none;user-select:none;-webkit-user-select:none}
.tsparcel .bx{position:absolute;inset:0;background:var(--card);border:2.5px solid var(--cardInk);border-radius:5px;box-shadow:inset 0 -6px 0 var(--card2)}
.tsparcel .bx::before{content:'';position:absolute;left:50%;top:0;bottom:0;width:9px;margin-left:-4.5px;background:#e9cf9b;border-inline:1px solid var(--card2)}
.tsparcel svg{position:absolute;inset:6px 10px 9px;width:calc(100% - 20px);height:calc(100% - 15px)}
.tsparcel.drag{cursor:grabbing;transition:none!important;filter:drop-shadow(0 8px 6px #0005);z-index:20}
.tsparcel.fall{transition:none!important;animation:tsfall .9s ease-in forwards}
@keyframes tsfall{0%{transform:none}45%{transform:translateX(52px)}100%{transform:translate(52px,52px) scale(.8);opacity:.2}}
.tsparcel.fly{transition:transform .45s cubic-bezier(.5,-.3,.7,1),opacity .2s .4s!important}
.tscrates{display:grid;grid-template-columns:repeat(var(--n),1fr);gap:8px}
.tscrate{position:relative;appearance:none;border:0;background:none;padding:14px 0 0;cursor:pointer;font:inherit;color:inherit;min-width:0}
.tscrate .flap{position:absolute;top:2px;height:16px;width:46%;background:var(--card2);border:2.5px solid var(--cardInk);border-radius:3px}
.tscrate .flap.l{left:2%;transform:skewX(-18deg) rotate(-8deg);transform-origin:right bottom}
.tscrate .flap.r{right:2%;transform:skewX(18deg) rotate(8deg);transform-origin:left bottom}
.tscrate .front{position:relative;display:grid;align-content:center;gap:2px;min-height:76px;padding:8px 4px 6px;background:var(--card);border:2.5px solid var(--cardInk);border-radius:4px 4px 10px 10px;box-shadow:0 5px 0 var(--cardInk);text-align:center}
.tscrate .front b{font:800 clamp(12px,3.6vw,15px)/1.15 var(--body);color:#2b1a08;overflow-wrap:normal;hyphens:manual}
.tscrates.n4 .front b{text-transform:none;letter-spacing:0;font-size:clamp(11.5px,3.3vw,14px)}
.tscrate .front .ico{width:44px;height:28px;margin:0 auto;display:block;background:#f3dcb4;border-radius:6px;padding:2px 4px;box-sizing:content-box}
.tscrate .front small{font:700 11px/1.2 var(--body);color:#4a2e10}
.tscrate .cnt{position:absolute;top:-6px;right:-4px;min-width:22px;height:22px;border-radius:11px;background:var(--surface);border:2px solid var(--ink);font:800 12px/18px var(--body);color:var(--ink);text-align:center;z-index:2}
.tscrate:focus-visible .front{outline:3px solid var(--violet);outline-offset:2px}
.tscrate.hover .front,.tscrate:hover .front{filter:brightness(1.08)}
.tscrate.hover .flap.l{transform:skewX(-18deg) rotate(-28deg)}.tscrate.hover .flap.r{transform:skewX(18deg) rotate(28deg)}
.tscrate.ok .front{background:#7fd6a4;border-color:#0c5f37;box-shadow:0 5px 0 #0c5f37}
.tscrate.no .front{background:#f3a39a;border-color:#8f241c;box-shadow:0 5px 0 #8f241c}
.tscrate.glow .front{box-shadow:0 0 0 4px var(--sun),0 5px 0 var(--cardInk)}
.tscrate.bump{animation:tsbump .35s}
@keyframes tsbump{40%{transform:translateY(5px) scaleY(.94)}}
.tscrate[disabled]{cursor:default}
.tswhy{max-width:440px;width:100%;margin:0 auto;display:grid;gap:6px}
.tswhy p{margin:0}
.tsdisc{max-width:240px;margin:0 auto}
.tstip{font:700 12px var(--body);color:var(--muted);text-align:center;margin:-2px 0 0}
@media (prefers-reduced-motion:reduce){.tsbelt .rail::before,.tscrate.bump,.tsscan .tsscr.flash{animation:none}}
</style>`);
function triPts(al,be){const L=200,ga=(180-al-be)*Math.PI/180,a=al*Math.PI/180,b=be*Math.PI/180,AC=L*Math.sin(b)/Math.sin(ga);return [[0,0],[L,0],[AC*Math.cos(a),AC*Math.sin(a)]]}
/* ext: label for an outside angle, made by extending the side from corner 0 through corner 1 */
function triSVG(ang,labs,ticks,ext){const P=triPts(ang[0],ang[1]),E=[P[1][0]+90,0],xs=[...P,...(ext?[E]:[])].map(p=>p[0]),ys=P.map(p=>p[1]),mnx=Math.min(...xs),mxx=Math.max(...xs),mxy=Math.max(...ys),sc=Math.min(260/(mxx-mnx),170/mxy);
  const ox=(300-(mxx-mnx)*sc)/2,T=([x,y])=>[ox+(x-mnx)*sc,200-y*sc],Q=P.map(T);let s=`<polygon points="${Q.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" style="fill:color-mix(in srgb,var(--sun) 30%,transparent)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>`;
  const arc=(q,u,r,col)=>{const sw=(u[0][0]*u[1][1]-u[0][1]*u[1][0])>0?1:0;return `<path d="M${(q[0]+u[0][0]*r).toFixed(1)},${(q[1]+u[0][1]*r).toFixed(1)} A${r},${r} 0 0 ${sw} ${(q[0]+u[1][0]*r).toFixed(1)},${(q[1]+u[1][1]*r).toFixed(1)}" fill="none" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>`};
  const txt=(x,y,lab)=>{const hot=lab==='x';return `<text x="${x.toFixed(1)}" y="${(y+5).toFixed(1)}" text-anchor="middle" style="font:${hot?'italic 800 21px':'800 15px'} var(--body);fill:${hot?'var(--tomato)':'var(--ink)'}">${lab}</text>`};
  const unit=(q,p)=>{const dx=p[0]-q[0],dy=p[1]-q[1],l=Math.hypot(dx,dy);return [dx/l,dy/l]};
  if(ext){const QE=T(E),q=Q[1],u=[unit(q,QE),unit(q,Q[2])],bx=u[0][0]+u[1][0],by=u[0][1]+u[1][1],bl=Math.hypot(bx,by);
    s+=`<line x1="${q[0].toFixed(1)}" y1="${q[1].toFixed(1)}" x2="${QE[0].toFixed(1)}" y2="${QE[1].toFixed(1)}" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>`+arc(q,u,20,'var(--sun)')+txt(q[0]+bx/bl*40,q[1]+by/bl*40,ext)}
  Q.forEach((q,i)=>{const u=Q.filter((_,j)=>j!==i).map(p=>unit(q,p)),bx=u[0][0]+u[1][0],by=u[0][1]+u[1][1],bl=Math.hypot(bx,by);
    /* each corner is a group with a hit circle, so a round can ask pupils to tap a corner (Triangle warehouse) */
    const hit=dd=>`<circle class="tshit" cx="${(q[0]+bx/bl*dd).toFixed(1)}" cy="${(q[1]+by/bl*dd).toFixed(1)}" r="27" fill="transparent"/>`;
    if(labs[i]==='⊾'){s+=`<g class="tv" data-v="${i}"><path d="M${q[0]+u[0][0]*14},${q[1]+u[0][1]*14} L${q[0]+(u[0][0]+u[1][0])*14},${q[1]+(u[0][1]+u[1][1])*14} L${q[0]+u[1][0]*14},${q[1]+u[1][1]*14}" fill="none" stroke="var(--ink)" stroke-width="2"/>${hit(16)}</g>`;return}
    if(!labs[i])return;const r=ang[i]<45?24:ang[i]>100?16:19,d=r+(ang[i]<45?22:ang[i]<70?17:15);
    /* angle arc: sun-yellow for a given angle, tomato for the unknown x (same style as Quad Quest) */
    s+=`<g class="tv" data-v="${i}">`+arc(q,u,r,labs[i]==='x'?'var(--tomato)':'var(--sun)')+txt(q[0]+bx/bl*d,q[1]+by/bl*d,labs[i])+hit(d*.8)+'</g>'});
  (ticks||[]).forEach(([i,j])=>{const a=Q[i],b=Q[j],m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),n=[-dy/l*8,dx/l*8];s+=`<line x1="${m[0]-n[0]}" y1="${m[1]-n[1]}" x2="${m[0]+n[0]}" y2="${m[1]+n[1]}" stroke="var(--tomato)" stroke-width="3"/>`});
  const top=Math.max(0,Math.floor(Math.min(...Q.map(q=>q[1]))-30));return `<svg viewBox="0 ${top} 300 ${222-top}" class="msvg" style="max-width:340px" role="img" aria-label="Triangle">${s}</svg>`}
function genTri(kind){let a,b,c;
  if(kind==='equi')return {ang:[60,60,60],ticks:[[0,1],[1,2],[0,2]]};
  if(kind==='isoA'){const t=pick([30,40,50,70,80]);return {ang:[(180-t)/2,(180-t)/2,t],ticks:[[0,2],[1,2]],apex:2}}
  if(kind==='isoR')return {ang:[90,45,45],ticks:[[0,1],[0,2]],apex:0};
  if(kind==='isoO'){const t=pick([100,110,120,130,140]);return {ang:[(180-t)/2,(180-t)/2,t],ticks:[[0,2],[1,2]],apex:2}}
  if(kind==='scaR'){do{b=R(25,65)}while(b===45);return {ang:pick([[90,b,90-b],[b,90,90-b]])}}
  for(;;){if(kind==='scaO'){c=R(100,135);a=R(15,180-c-15);b=180-c-a}else{a=R(40,80);b=R(40,80);c=180-a-b}
    if(new Set([a,b,c]).size===3&&a>=15&&b>=15&&(kind==='scaO'||c<90&&c>30)){return {ang:shuffle([a,b,c])}}}}
const degs=a=>a.map(v=>v+'°');
const tsSum=a=>a.map(v=>v+'°').join(' + ')+' = '+a.reduce((x,y)=>x+y,0)+'°';
/* split tot into two different whole numbers, each at least mn */
const tsSplit=(tot,mn)=>{for(;;){const a=R(mn,tot-mn);if(a*2!==tot)return [a,tot-a]}};

/* ---------- Triangle warehouse rounds ---------- */
/* crate labels: a name plus a small picture of the idea (an angle, tick marks), not a rule to read */
const TSICO={"acute": "<svg class=\"ico\" viewBox=\"0 0 44 28\" aria-hidden=\"true\"><path d=\"M5 24 H39 M5 24 L33 5\" fill=\"none\" stroke=\"#2b1a08\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M17 24 A12 12 0 0 0 15 17.3\" stroke=\"#c2410c\" stroke-width=\"2.4\" fill=\"none\"/></svg>", "right": "<svg class=\"ico\" viewBox=\"0 0 44 28\" aria-hidden=\"true\"><path d=\"M10 24 H38 M10 24 V3\" fill=\"none\" stroke=\"#2b1a08\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M10 16 H18 V24\" stroke=\"#c2410c\" stroke-width=\"2.4\" fill=\"none\"/></svg>", "obtuse": "<svg class=\"ico\" viewBox=\"0 0 44 28\" aria-hidden=\"true\"><path d=\"M22 24 H40 M22 24 L4 8\" fill=\"none\" stroke=\"#2b1a08\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M32 24 A10 10 0 0 0 14.5 17.3\" stroke=\"#c2410c\" stroke-width=\"2.4\" fill=\"none\"/></svg>", "equi": "<svg class=\"ico\" viewBox=\"0 0 44 28\" aria-hidden=\"true\"><path d=\"M22 3 L39 25 H5 Z\" fill=\"none\" stroke=\"#2b1a08\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M11 13 l4 3 M33 13 l-4 3 M22 22 v6\" stroke=\"#c2410c\" stroke-width=\"2.4\" fill=\"none\"/></svg>", "iso": "<svg class=\"ico\" viewBox=\"0 0 44 28\" aria-hidden=\"true\"><path d=\"M22 2 L33 25 H11 Z\" fill=\"none\" stroke=\"#2b1a08\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M14 13 l4 2 M30 13 l-4 2\" stroke=\"#c2410c\" stroke-width=\"2.4\" fill=\"none\"/></svg>", "neither": "<svg class=\"ico\" viewBox=\"0 0 44 28\" aria-hidden=\"true\"><path d=\"M8 25 L38 25 L15 5 Z\" fill=\"none\" stroke=\"#2b1a08\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "real": "<svg class=\"ico\" viewBox=\"0 0 44 28\" aria-hidden=\"true\"><path d=\"M6 25 L22 4 L38 25 Z\" fill=\"none\" stroke=\"#2b1a08\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M15 16 l5 5 l9 -10\" stroke=\"#0c7a45\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "imp": "<svg class=\"ico\" viewBox=\"0 0 44 28\" aria-hidden=\"true\"><path d=\"M6 25 L22 4 L38 25 Z\" fill=\"none\" stroke=\"#2b1a08\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><path d=\"M15 10 l14 13 M29 10 l-14 13\" stroke=\"#c2231a\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/></svg>"};
const TSBINS={
  ang:[['acute','Acute angle'],['right','Right angle'],['obtuse','Obtuse angle']],
  side:[['equi','Equilateral'],['iso','Isosceles'],['neither','Neither']],
  real:[['real','Real triangle'],['imp','Impossible']],
  two:[['right','Right-angled'],['iso','Isosceles'],['equi','Equi&shy;lateral'],['imp','Impos&shy;sible']]};
function tsAngItem(kind){let ang,ticks;
  if(kind==='near'){const B=pick([88,89,91,92]);ang=shuffle([B,...tsSplit(180-B,22)])}
  else{const T=genTri(kind==='acute'?pick(['scaA','scaA','isoA']):kind==='right'?pick(['scaR','scaR','isoR']):pick(['scaO','scaO','isoO']));ang=T.ang;ticks=T.ticks}
  const B=Math.max(...ang),bin=B===90?'right':B>90?'obtuse':'acute',labs=ang.map(v=>v===90?'⊾':v+'°'),w={};
  const exp=bin==='right'?'The biggest angle has a square mark: it is a right angle (exactly 90°). So this is a right-angled triangle.':bin==='obtuse'?`The biggest angle, ${B}°, is more than 90°, so it is an obtuse angle.`:`The biggest angle, ${B}°, is less than 90°, so it is an acute angle.`;
  if(bin==='acute'){w.right=B>=88?`${B}° is close to 90°, but not 90°. A right angle is exactly 90°.`:`${B}° is not 90°. A right angle is exactly 90° and has a square mark.`;w.obtuse=`${B}° is less than 90°. An obtuse angle is more than 90°.`}
  if(bin==='right'){w.acute='The square mark means exactly 90°. An acute angle is less than 90°.';w.obtuse='The square mark means exactly 90°. An obtuse angle is more than 90°.'}
  if(bin==='obtuse'){w.acute=`${B}° is more than 90°. An acute angle is less than 90°.`;w.right=B<=92?`${B}° is just over 90°, so it is obtuse, not a right angle.`:`There is no square mark. ${B}° is more than 90°.`}
  return {ang,svg:triSVG(ang,labs,ticks),bin,exp,w}}
function tsSideItem(kind){let ang,labs,ticks=null,byAng=false;
  if(kind==='equi'){byAng=Math.random()<.5;ang=[60,60,60];labs=byAng?degs(ang):['','',''];if(!byAng)ticks=[[0,1],[1,2],[0,2]]}
  else if(kind==='isoT'){const T=genTri(pick(['isoA','isoO','isoR']));ang=T.ang;ticks=T.ticks;labs=['','','']}
  else if(kind==='isoA'){const T=genTri(pick(['isoA','isoO']));byAng=true;const k=shuffle([0,1,2]);ang=k.map(i=>T.ang[i]);labs=degs(ang)}
  else{let a;do{a=genTri(pick(['scaA','scaO','scaA'])).ang}while(Math.max(...a)-Math.min(...a)>60&&Math.random()<.6);ang=a;labs=degs(ang)}
  const bin=kind==='equi'?'equi':kind==='sca'?'neither':'iso',w={},eq=ang.find((v,i)=>ang.indexOf(v)!==i);
  const exp=bin==='equi'?(byAng?'All three angles are 60°, so all three sides are equal: equilateral.':'All three sides have equal marks: equilateral.'):bin==='iso'?(byAng?`${eq}° appears twice. Two equal angles mean two equal sides, so it is isosceles.`:'Two sides have equal marks, so it is isosceles.'):`All three angles are different (${degs(ang).join(', ')}), so no two sides are equal. It is neither isosceles nor equilateral.`;
  if(bin==='equi'){w.iso='It does have two equal sides, but in fact all three are equal. The best name is equilateral.';w.neither=byAng?'All three angles are 60°. Equal angles mean equal sides, so all three sides are equal.':'All three sides have the same mark, so they are all equal.'}
  if(bin==='iso'){w.equi=byAng?`Only two angles are equal. Equilateral needs all three angles to be 60°.`:'Only two sides are marked equal. The third side has no mark.';w.neither=byAng?`Look again: ${eq}° appears twice. Two equal angles mean two equal sides, so it is isosceles.`:'The tick marks show two equal sides.'}
  if(bin==='neither'){w.iso=w.equi=`It may look balanced, but the angles are all different (${degs(ang).join(', ')}). Different angles mean different sides.`}
  return {ang,svg:triSVG(ang,labs,ticks),bin,exp,w}}
function tsRealItem(kind){let ang,labs,ticks=null,bin='imp',exp;
  if(kind==='real'){const T=genTri(pick(['scaA','scaO','scaO','scaR','isoO']));ang=T.ang;labs=degs(ang);ticks=T.ticks;bin='real';
    const B=Math.max(...ang);exp=`This one can exist: ${tsSum(ang)}.${B>90?' Only one angle is over 90°, which is allowed.':''}`}
  else if(kind==='equiR'){ang=[60,60,60];labs=degs(ang);ticks=[[0,1],[1,2],[0,2]];bin='real';exp=`This one can exist: three equal sides and three 60° angles, ${tsSum(ang)}.`}
  else if(kind==='sum'){const T=genTri(pick(['scaA','scaO']));ang=T.ang;const i=R(0,2),d=ang[i]<35?pick([10,20]):pick([-20,-10,10,20]),lv=ang.map((v,j)=>j===i?v+d:v);labs=degs(lv);
    exp=`Add them: ${tsSum(lv)}. The angles of a triangle always add up to exactly 180°.`}
  else if(kind==='obt2'){const a=R(92,110),b=R(91,100),c=R(8,25);ang=[35,40,105];labs=degs([c,b,a]);
    exp=`${a}° and ${b}° are both over 90°. Together they already make more than 180°, so no triangle can have them.`}
  else if(kind==='right2'){const c=R(10,40);ang=[75,70,35];labs=['90°','90°',c+'°'];exp='Two right angles already make 180°. There is nothing left for the third corner.'}
  else{const a=pick([50,55,65,70,75]);ang=[60,60,60];labs=degs([a,a,180-2*a]);ticks=[[0,1],[1,2],[0,2]];
    exp=`The angles do add up to 180°, but all three sides are marked equal. Three equal sides mean every angle must be 60°.`}
  return {ang,svg:triSVG(ang,labs,ticks),bin,exp,w:{}}}
function tsTwoItem(kind){let ang,show;
  if(kind==='right'){ang=genTri('scaR').ang;const ri=ang.indexOf(90);show=pick([[ri,ri===0?1:0],[0,1,2].filter(i=>i!==ri)])}
  else if(kind==='iso'){const t=pick([30,40,50,70,80,100,110,120,130,140]);ang=[(180-t)/2,(180-t)/2,t];show=pick([[0,1],[0,2],[1,2]])}
  else if(kind==='equi'){ang=[60,60,60];show=pick([[0,1],[0,2],[1,2]])}
  else{const a=R(91,125),b=R(180-a+1,180-a+25);ang=[45,35,100];show=[0,2];ang.lv=[b,0,a]}
  const lv=ang.lv||ang,labs=ang.map((v,i)=>show.includes(i)?(lv[i]===90?'⊾':lv[i]+'°'):''),[a,b]=show.map(i=>lv[i]);let exp;
  if(kind==='imp')exp=`${a}° + ${b}° = ${a+b}°, already more than 180°. There is nothing left for the third angle.`;
  else{const c=180-a-b,all=[a,b,c].sort((x,y)=>x-y).map(v=>v+'°').join(', ');
    exp=`Third angle: 180° − ${a}° − ${b}° = ${c}°. The angles are ${all}: `+(kind==='right'?'one of them is 90°, so it is a right-angled triangle.':kind==='iso'?'two angles are equal, so two sides are equal. It is an isosceles triangle.':'all three angles are 60°, so all three sides are equal. It is an equilateral triangle.')}
  return {ang,svg:triSVG(ang,labs),bin:kind,exp,w:{}}}
const TSWORKER=`<svg viewBox="0 0 54 104" aria-hidden="true"><rect x="17" y="70" width="8" height="32" rx="3" fill="#2f4a7a" stroke="#16233a" stroke-width="1.5"/><rect x="29" y="70" width="8" height="32" rx="3" fill="#2f4a7a" stroke="#16233a" stroke-width="1.5"/><rect x="13" y="38" width="28" height="36" rx="8" fill="#ef5240" stroke="#16233a" stroke-width="2"/><rect x="14" y="54" width="26" height="4" fill="#ffd257"/><rect x="14" y="62" width="26" height="3" fill="#ffd257"/><rect x="11" y="40" width="7" height="24" rx="3.5" fill="#ef5240" stroke="#16233a" stroke-width="2"/><g class="arm"><rect x="36" y="40" width="7" height="26" rx="3.5" fill="#ef5240" stroke="#16233a" stroke-width="2"/><circle cx="39.5" cy="67" r="4" fill="#f2c9a0" stroke="#16233a" stroke-width="1.5"/></g><circle cx="27" cy="27" r="11" fill="#f2c9a0" stroke="#16233a" stroke-width="2"/><circle cx="23" cy="27" r="1.6" fill="#16233a"/><circle cx="31" cy="27" r="1.6" fill="#16233a"/><path class="m1" d="M23 32 Q27 35.5 31 32" fill="none" stroke="#16233a" stroke-width="1.6" stroke-linecap="round"/><path class="m2" d="M23 34 Q27 30.5 31 34" fill="none" stroke="#16233a" stroke-width="1.6" stroke-linecap="round"/><path d="M15 21 Q27 5 39 21 Z" fill="#ffb81f" stroke="#16233a" stroke-width="2"/><rect x="12" y="19.5" width="30" height="4" rx="2" fill="#ffb81f" stroke="#16233a" stroke-width="1.5"/></svg>`;
function tsGlyph(ang){const P=triPts(ang[0],ang[1]),xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),mn=Math.min(...xs),w=Math.max(...xs)-mn,h=Math.max(...ys),sc=Math.min(36/w,26/h),ox=(40-w*sc)/2;
  return `<svg viewBox="0 0 40 30" aria-hidden="true"><polygon points="${P.map(([x,y])=>`${(ox+(x-mn)*sc).toFixed(1)},${(28-y*sc).toFixed(1)}`).join(' ')}" fill="#fff6e0" stroke="#5b3713" stroke-width="2" stroke-linejoin="round"/></svg>`}
function tsConveyor(api,r){
  /* 5 rounds: 0 warehouse (angles), 1 rescue, 2 warehouse, 3 rescue, 4 warehouse. Easy plays rounds 0–3, Hard rounds 2–4 with harder sets. */
  const hard=ctx&&ctx.level==='hard',set=r===0?'ang':r===2?(hard?'real':'side'):hard?'two':pick(['real','two']),BINS=TSBINS[set],secs={ang:20,side:16,real:18,two:24}[set];let items;
  /* 3 parcels a round, one of each crate where possible */
  if(set==='ang')items=shuffle([pick(['acute','near']),'right',pick(['obtuse','near'])]).map(tsAngItem);
  else if(set==='side')items=shuffle(['equi',pick(['isoT','isoA']),'sca']).map(tsSideItem); /* 'sca' items go in the Neither crate */
  else if(set==='real')items=shuffle([pick(['real','equiR']),pick(['sum','right2']),pick(['obt2','equiW','real'])]).map(tsRealItem);
  else items=shuffle(['right','iso',pick(['equi','imp'])]).map(tsTwoItem);
  const ask={ang:'Find the <b>biggest angle</b>. Is it an <b>acute</b>, <b>right</b> or <b>obtuse</b> angle?',side:'Is this triangle <b>equilateral</b>, <b>isosceles</b> or <b>neither</b>?',real:'Could this triangle <b>really exist</b>?',two:'Work out the <b>third angle</b>. Then, what kind of triangle is it?'}[set],
    tip={ang:'If the biggest angle is a right angle, the triangle is right-angled.',side:'Equal tick marks mean equal sides. Equal angles mean equal sides too.',real:'Check that the angles add up to 180° and match the marks.',two:'The three angles add up to 180°.'}[set];
  api.q(`<p class="qs">📦 Triangle warehouse · 3 parcels</p><p class="qt">${ask}</p><p class="qs">Each parcel goes through the X-ray. Drag it into the crate with the answer before it drops off the belt. ${tip} Not drawn to scale.</p>`);
  api.body.innerHTML=`<div class="tswh tmap-nozoom"><div class="tshud"><span class="tsk" id="tsK"></span><span class="tstime" aria-hidden="true"><i id="tsT"></i></span><span class="tsst" id="tsSt"></span></div>
    <div class="tsscan" id="tsScan"><div class="tsscr" id="tsScr"></div></div>
    <div class="tsbelt" id="tsBelt"><div class="rail"></div><div class="chute" aria-hidden="true"></div><div class="tsworker" id="tsMan">${TSWORKER}</div>
      <div class="tsxray" id="tsXr" aria-hidden="true"><span class="cable"></span><span class="lamp"></span><div class="body"></div><span class="sign">X-RAY</span><div class="hole"></div></div>
      <div class="tsparcel" id="tsPar" role="img" aria-label="Parcel on the belt"><div class="bx"></div></div></div>
    <div class="tscrates n${BINS.length}" id="tsBins" style="--n:${BINS.length}">${BINS.map(([k,t])=>`<button class="tscrate" data-k="${k}"><span class="flap l"></span><span class="flap r"></span><span class="cnt">0</span><span class="front">${BINS.length<4&&TSICO[k]?TSICO[k]:''}<b>${t}</b></span></button>`).join('')}</div>
    <p class="tstip">When the X-ray shows the triangle, drag the parcel into a crate (or tap a crate).</p></div><div class="tswhy" id="tsWhy" aria-live="polite"></div>`;
  const belt=$('tsBelt'),par=$('tsPar'),bins=[...$('tsBins').children],cnt={};let k=0,got=0,streak=0,live=false,tok=0,endX=0,drag=null;const log=[];
  const curX=()=>parseFloat(getComputedStyle(par).left)||0;
  const freeze=()=>{const x=curX(),bar=$('tsT'),bw=getComputedStyle(bar).width;bar.style.transition='none';bar.style.width=bw;par.style.transition='none';par.style.left=x+'px';tok++;belt.classList.add('stop');return x};
  const run=()=>{const x=curX(),left=Math.max(0,endX-x),t=secs*left/Math.max(1,endX-scanX),my=++tok;belt.classList.remove('stop');void par.offsetWidth;
    par.style.transition=`left ${t}s linear`;par.style.left=endX+'px';const bar=$('tsT');bar.style.transition=`width ${t}s linear`;bar.style.width='0%';api.later(()=>{if(my===tok&&live)bar.classList.add('low')},Math.max(0,t*1000-secs*300));api.later(()=>{if(my===tok&&live)answer(null)},t*1000+60)};
  const X0=28,man=$('tsMan'),xr=$('tsXr');let scanned=false,scanX=X0,ready=false,slip=false,sc=0;
  const scan=()=>{if(scanned||!live)return;scanned=true;const it=items[k];$('tsScr').classList.remove('scan');$('tsScr').innerHTML=`<div class="img">${it.svg}</div>`;void $('tsScr').offsetWidth;$('tsScr').classList.add('scan');
    $('tsScan').classList.add('live');xr.classList.add('on');sfx.pop();api.later(()=>xr.classList.remove('on'),1200);
    if(set!=='ang'){ready=true;bins.forEach(b=>b.disabled=false);return}
    /* angle round, step 1: a triangle is named by its biggest angle, so find that angle before packing */
    const scr=$('tsScr'),big=Math.max(...it.ang);ready=false;slip=false;scr.classList.add('tap');scr.insertAdjacentHTML('beforeend','<div class="tsstep" id="tsStep">Step 1: tap the <b>biggest</b> angle</div>');
    scr.querySelectorAll('.tv').forEach(g=>g.onclick=()=>{if(ready||!live)return;const v=it.ang[+g.dataset.v],st=$('tsStep');
      if(v===big){ready=true;g.classList.add('pick');scr.classList.remove('tap');sfx.pop();st.className='tsstep ok';
        st.innerHTML=`✓ The biggest angle is <b>${v}°</b>.<br>Step 2: What type of angle is ${v}°? Put the parcel in that crate.`;bins.forEach(b=>b.disabled=false);return}
      slip=true;sfx.no();g.classList.add('miss');st.className='tsstep no';st.innerHTML=`${v}° is not the biggest. Find a bigger angle!`})};
  const show=()=>{const it=items[k];live=true;scanned=false;ready=false;slip=false;$('tsWhy').innerHTML='';$('tsK').textContent=`Parcel ${k+1} of ${items.length}`;$('tsSt').textContent=streak>=2?`🔥 ×${streak}`:'';
    {const bar=$('tsT');bar.classList.remove('low');bar.style.transition='none';bar.style.width='100%'}$('tsScr').className='tsscr';$('tsScr').innerHTML='<span class="idle">WAITING FOR PARCEL…</span>';$('tsScan').classList.remove('live');man.className='tsworker';void man.offsetWidth;man.classList.add('lift');
    par.className='tsparcel';par.style.transform='translateY(-34px)';par.style.opacity='0';par.style.transition='none';par.style.left=X0+'px';par.innerHTML=`<div class="bx"></div>${tsGlyph(it.ang)}`;
    bins.forEach(b=>{b.disabled=true;b.classList.remove('ok','no','glow','hover')});endX=belt.clientWidth-58-50;
    /* the worker lifts the box onto the belt; it then rides into the X-ray, and the screen lights up when the box is inside */
    api.later(()=>{par.style.transition='transform .3s ease-in,opacity .15s';par.style.transform='';par.style.opacity='1'},calm?0:250);
    /* quick ride into the X-ray; the timed part of the belt starts once the screen shows the triangle */
    scanX=xr.offsetLeft+xr.offsetWidth/2-29;const my=++tok;
    api.later(()=>{if(my!==tok)return;belt.classList.remove('stop');par.style.transition='left 1.4s ease-in';par.style.left=scanX+'px';
      api.later(()=>{if(my!==tok||!live)return;scan();scanX=xr.offsetLeft+xr.offsetWidth+2;par.style.transition='left .5s ease-out';par.style.left=scanX+'px';
        api.later(()=>{if(my===tok&&live)run()},calm?50:1100)},1450)},calm?100:600)};
  const next=()=>{k++;if(k<items.length)return show();
    /* 3 points a parcel (2 if step 1 needed a second tap), plus 1 for a perfect round: 10 at most */
    const perfect=sc===items.length*3;api.done(got>=2,`You packed ${got} of ${items.length} parcels into the right crate.${perfect?' Perfect round: +1 bonus!':''}`,log,sc+(perfect?1:0),{noRetry:true})};
  const crateAt=(x,y)=>bins.find(b=>{const q=b.getBoundingClientRect();return x>=q.left-6&&x<=q.right+6&&y>=q.top-30&&y<=q.bottom+6});
  const answer=b=>{if(!live||api.answered)return;live=false;freeze();const it=items[k],ch=b&&b.dataset.k,ok=ch===it.bin;
    bins.forEach(x=>{x.disabled=true;x.classList.remove('hover');if(x.dataset.k===it.bin&&!ok)x.classList.add('glow')});
    if(!b){par.classList.add('fall')}
    else{const p=par.getBoundingClientRect(),q=b.getBoundingClientRect(),base=par.style.transform||'';const m=/translate\(([-\d.]+)px, ?([-\d.]+)px\)/.exec(base)||[0,0,0];
      const dx=+m[1]+(q.left+q.width/2)-(p.left+p.width/2),dy=+m[2]+(q.top+22)-(p.top+p.height/2);par.classList.remove('drag');par.classList.add('fly');void par.offsetWidth;par.style.transform=`translate(${dx}px,${dy}px) scale(.45)`;par.style.opacity='0'}
    if(ok){got++;sc+=slip?2:3;streak++;sfx.ok();man.className='tsworker cheer';api.later(()=>{b.classList.add('ok','bump');const c=b.querySelector('.cnt');cnt[ch]=(cnt[ch]||0)+1;c.textContent=cnt[ch]},calm?0:380);
      $('tsSt').textContent=streak>=2?`🔥 ×${streak}`:'';if(streak>=3)qubi('gQ','cheer',`Packing streak ×${streak}!`);log.push(`✔ ${it.exp}`);api.later(next,calm?500:1000);return}
    streak=0;$('tsSt').textContent='';sfx.no();man.className='tsworker sad';if(b)api.later(()=>b.classList.add('no'),calm?0:380);qubi('gQ','oops',b?'Wrong crate!':'It dropped off the belt!');
    const why=(b&&it.w[ch])||it.exp;log.push(`✘ ${it.exp}`);
    $('tsWhy').innerHTML=`<p class="retrymsg">${b?'':'⏰ Too slow, it fell off the belt! '}${why}</p>${b&&it.w[ch]&&it.w[ch]!==it.exp?`<p>${it.exp}</p>`:''}<div><button class="btn primary" id="tsGo">${k+1<items.length?'Next parcel ▶':'Finish'}</button></div>`;
    $('tsGo').onclick=()=>{sfx.tap();next()};$('tsGo').focus({preventScroll:true})};
  bins.forEach(b=>b.onclick=()=>{if(ready)answer(b)});
  /* drag the parcel: it stops while held, and carries on along the belt if dropped anywhere but a crate */
  par.addEventListener('pointerdown',e=>{if(!live||api.answered||!ready)return;e.preventDefault();freeze();par.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,moved:false};par.classList.add('drag');sfx.tap()});
  par.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>6)drag.moved=true;par.style.transform=`translate(${dx}px,${dy}px)`;
    const c=crateAt(e.clientX,e.clientY);bins.forEach(b=>b.classList.toggle('hover',b===c))});
  const drop=e=>{if(!drag)return;const d=drag;drag=null;const c=d.moved&&crateAt(e.clientX,e.clientY);if(c&&live)return answer(c);
    par.classList.remove('drag');par.style.transform='';bins.forEach(b=>b.classList.remove('hover'));if(live)run()};
  par.addEventListener('pointerup',drop);par.addEventListener('pointercancel',drop);
  show()}

/* ---------- Missing Corner Rescue rounds ---------- */
/* a choice step that must be right before the next step opens. First wrong pick: why it's wrong, try again.
   Second: the right choice glows and the round can score at most 6. */
function tsPick(api,o){const kk='tsP'+o.id;api.body.insertAdjacentHTML('beforeend',`<div class="askwrap"><p class="asklab">${o.label}</p><div class="choices one" id="${o.id}"></div><div id="${o.id}M"></div></div>`);
  const box=$(o.id),fin=()=>{[...box.children].forEach(b=>{b.disabled=true;b.style.boxShadow='';if(b.dataset.ok)b.classList.add('ok')});o.then()};
  shuffle(o.opts).forEach(op=>{const b=document.createElement('button');b.className='btn';b.innerHTML=op.t;if(op.ok)b.dataset.ok='1';
    b.onclick=()=>{if(api.answered||b.disabled)return;if(op.ok){sfx.pop();ctx.keep[kk]=1;$(o.id+'M').innerHTML='';return fin()}
      b.disabled=true;b.classList.add('no');if(api.first(o.id)){api.retry($(o.id+'M'),op.why);return}
      sfx.no();ctx.keep.pen=1;[...box.children].forEach(y=>{if(y.dataset.ok){y.disabled=false;y.style.boxShadow='0 0 0 4px var(--sun)'}else y.disabled=true});
      $(o.id+'M').innerHTML=`<p class="retrymsg">${op.why} The right one is glowing. Tap it to carry on.</p>`};box.appendChild(b)});
  if(ctx.keep[kk])fin()}
const tsTraps=(x,list)=>list.filter(([v])=>v!==x&&v>0);
function tsRescue(api,r){
  const mode=r===1?'sum':ctx&&ctx.level==='hard'?pick(['apex','base','ext']):pick(['right','apex']),tag='<p class="qt">🛟 Missing Corner Rescue: find the value of <b>x</b>.</p><p class="qs">Not drawn to scale.</p>';
  api.q(tag);
  if(mode==='sum'){const D=genTri(pick(['scaA','scaO','isoA'])).ang,T=genTri(pick(['scaA','scaO'])).ang,xi=R(0,2),x=T[xi],[a,b]=T.filter((_,i)=>i!==xi);
    api.body.innerHTML=`<div class="tsdisc">${triSVG(D,degs(D)).replace('max-width:340px','max-width:240px')}</div>`;
    askOne(api,{id:'tsD',label:`<b>Step 1:</b> Qubi measured every corner of this triangle. What do the three angles add up to?`,right:180,unit:'°',w:4,
      traps:[[360,'Add them carefully: '+D.map(v=>v+'°').join(' + ')+'. 360° is a full turn, not a triangle.']],hint:'Add the three angles: '+D.map(v=>v+'°').join(' + '),
      then:()=>{api.body.insertAdjacentHTML('beforeend',`<p class="asklab">🎉 It works for <b>every</b> triangle: the angles always add up to 180°. Now use that to rescue the missing corner.</p>${triSVG(T,T.map((v,i)=>i===xi?'x':v+'°'))}`);
        askOne(api,{id:'tsX',label:'<b>Step 2:</b> x =',right:x,unit:'°',w:4,ok:`x = ${x}°`,bad:`x = ${x}°.`,
          traps:tsTraps(x,[[180-a,`You took away only ${a}°. Take away ${b}° as well.`],[180-b,`You took away only ${b}°. Take away ${a}° as well.`],[a+b,`That is the two known angles added together. x is what is left: 180° − ${a+b}°.`],[360-a-b,'360° is for angles at a point. Angles in a triangle add up to 180°.']]),
          work:[`Step 1: ${tsSum(D)}, and the same is true for every triangle.`,`x = 180° − ${a}° − ${b}° = <b>${x}°</b>`]})}});return}
  if(mode==='right'){const T=genTri(pick(['scaR','scaR','isoR'])).ang,ri=T.indexOf(90),others=[0,1,2].filter(i=>i!==ri),xi=pick(others),ki=others.find(i=>i!==xi),x=T[xi],kv=T[ki];
    api.body.innerHTML=triSVG(T,T.map((v,i)=>i===ri?'⊾':i===xi?'x':v+'°'));
    tsPick(api,{id:'tsR',label:'<b>Step 1:</b> How big is the corner with the little square?',opts:[{t:'90°',ok:1},{t:'180°',why:'180° is a straight line. The little square shows a right angle.'},{t:'45°',why:'45° is half a right angle. The little square shows a whole right angle.'},{t:'Can’t tell, there is no number',why:'The little square is the number! It always means 90°.'}],
      then:()=>askOne(api,{id:'tsX',label:'<b>Step 2:</b> x =',right:x,unit:'°',w:4,ok:`x = ${x}°`,bad:`x = ${x}°.`,
        traps:tsTraps(x,[[180-kv,`You forgot the right angle. Take away 90° as well as ${kv}°.`],[90+kv,`You added. x is what is left after taking 90° and ${kv}° away from 180°.`],[270-kv,'360° is for angles at a point. Angles in a triangle add up to 180°.']]),
        work:['The little square means 90°.',`x = 180° − 90° − ${kv}° = <b>${x}°</b>`,`Shortcut: in a right-angled triangle the other two angles add up to 90°, so x = 90° − ${kv}°.`]})});return}
  if(mode==='apex'){const G=genTri(pick(['isoA','isoA','isoO'])),a=G.ang[0],x=G.ang[2];
    api.body.innerHTML=triSVG(G.ang,[a+'°','','x'],G.ticks);
    tsPick(api,{id:'tsI',label:'<b>Step 1:</b> The two marked sides are equal. How big is the other bottom angle?',opts:[{t:a+'°',ok:1},{t:(180-a)+'°',why:'That uses the straight-line rule, but there is no straight line here.'},{t:'90°',why:'Only a corner with a little square is 90°.'},{t:'Can’t tell',why:'The tick marks tell you! The two angles at the bottom of the equal sides are equal.'}],
      then:()=>askOne(api,{id:'tsX',label:'<b>Step 2:</b> x =',right:x,unit:'°',w:4,ok:`x = ${x}°`,bad:`x = ${x}°.`,
        traps:tsTraps(x,[[180-a,`You took away only one bottom angle. Both bottom angles are ${a}°.`],[2*a,`That is the two bottom angles added. x is what is left: 180° − ${2*a}°.`],[a,'x is the top angle, not a bottom angle.']]),
        work:[`The marked sides are equal, so both bottom angles are ${a}°.`,`x = 180° − ${a}° − ${a}° = <b>${x}°</b>`]})});return}
  if(mode==='base'){const G=genTri(pick(['isoA','isoO'])),t=G.ang[2],x=G.ang[0];
    api.body.innerHTML=triSVG(G.ang,['x','',t+'°'],G.ticks);
    tsPick(api,{id:'tsI',label:'<b>Step 1:</b> The two marked sides are equal. x and the other bottom angle…',opts:[{t:'are equal',ok:1},{t:'add up to 180°',why:'That is the rule for angles on a straight line. These two corners are not on a straight line.'},{t:'add up to 90°',why:'That only happens with the two smaller angles of a right-angled triangle.'}],
      then:()=>askOne(api,{id:'tsX',label:'<b>Step 2:</b> x =',right:x,unit:'°',w:4,ok:`x = ${x}°`,bad:`x = ${x}°.`,
        traps:tsTraps(x,[[180-t,`${180-t}° is both bottom angles together. They are equal, so share it: ÷ 2.`],[t,`x is a bottom angle. ${t}° is the top angle.`],[(360-t)/2,'360° is for angles at a point. Angles in a triangle add up to 180°.']]),
        work:[`Both bottom angles together: 180° − ${t}° = ${180-t}°`,`They are equal, so x = ${180-t}° ÷ 2 = <b>${x}°</b>`]})});return}
  /* ext: side extended at corner 1, outside angle e given; find the top angle x */
  let T;do{T=genTri(pick(['scaA','scaO'])).ang}while(T[0]+T[1]>=160||T[2]>=150||T[0]<25);const [a,b,x]=T,e=180-b;
  api.body.innerHTML=triSVG(T,[a+'°','','x'],null,e+'°');
  askOne(api,{id:'tsE',label:`<b>Step 1:</b> The bottom side is extended. Find the angle <b>inside</b> the triangle next to ${e}°.`,right:b,unit:'°',w:4,
    traps:tsTraps(b,[[e,`${e}° is the outside angle. The inside angle sits next to it on a straight line.`],[360-e,'360° is a full turn. Angles on a straight line add up to 180°.']]),hint:`Angles on a straight line add up to 180°: 180° − ${e}°`,
    then:()=>askOne(api,{id:'tsX',label:'<b>Step 2:</b> x =',right:x,unit:'°',w:4,ok:`x = ${x}°`,bad:`x = ${x}°.`,
      traps:tsTraps(x,[[180-a-e,`Use the inside angle (${b}°), not the outside angle (${e}°).`],[180-b,`You took away only ${b}°. Take away ${a}° as well.`],[180-a,`You took away only ${a}°. Take away ${b}° as well.`]]),
      work:[`Angles on a straight line: 180° − ${e}° = ${b}°`,`Angles in a triangle: x = 180° − ${a}° − ${b}° = <b>${x}°</b>`,`Shortcut: the outside angle equals the two far inside angles added, so ${e}° = ${a}° + x.`]})})}
addGame('p5-triangles',{level:'P5',strand:'geo',glyph:'△',title:'Triangle Sorter',topic:'Properties of triangles and angle sum',music:'warehouse',
 how:'5 rounds, two kinds take turns. Triangle warehouse: a worker loads each parcel and the X-ray shows the triangle inside; drag or tap it into the right crate before it drops off the belt, and build a streak. Missing Corner Rescue: get step 1 right, then find the missing angle x. Diagrams are not drawn to scale.',rounds:5,
 round(api,r){return r%2===0?tsConveyor(api,r):tsRescue(api,r)}});

/* P5-11. Quad Quest — Parallelogram, rhombus, trapezium */
const QSH={
  Square:{c:['I have 4 straight sides.','I have 2 pairs of parallel sides.','All 4 of my sides are equal.','All my angles are right angles.'],p:[[40,25],[150,25],[150,135],[40,135]]},
  Rectangle:{c:['I have 4 straight sides.','I have 2 pairs of parallel sides.','All my angles are right angles.','My 4 sides are not all equal.'],p:[[15,40],[205,40],[205,125],[15,125]]},
  Parallelogram:{c:['I have 4 straight sides.','I have 2 pairs of parallel sides.','My opposite angles are equal, but none of my angles is a right angle.','My 4 sides are not all equal.'],p:[[60,40],[210,40],[165,130],[15,130]]},
  Rhombus:{c:['I have 4 straight sides.','I have 2 pairs of parallel sides.','All 4 of my sides are equal.','None of my angles is a right angle.'],p:[[20,130],[120,130],[170,43.4],[70,43.4]]},
  Trapezium:{c:['I have 4 straight sides.','I have exactly 1 pair of parallel sides.'],p:[[60,40],[160,40],[210,130],[15,130]]}};
function quadAng(kind,a){const s=kind==='rh'?110:90,w=kind==='rh'?110:150,BL=[30,170],t=a*Math.PI/180,TL=[BL[0]+s*Math.cos(t),BL[1]-s*Math.sin(t)],TR=[TL[0]+w,TL[1]],BR=[BL[0]+w,BL[1]];return [BL,BR,TR,TL]}
function quadSVG(P,labs,marks){const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),ox=Math.min(...xs)-30,oy=Math.min(...ys)-30,W=Math.max(...xs)-ox+30,H=Math.max(...ys)-oy+30;
  let s=`<polygon points="${P.map(p=>p.join(',')).join(' ')}" style="fill:color-mix(in srgb,var(--violet) 18%,transparent)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>`;
  (marks||[]).forEach(([i,j,n])=>{const a=P[i],b=P[j],m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),u=[dx/l,dy/l];
    for(let k=0;k<n;k++){const c=[m[0]+u[0]*(k*7-3),m[1]+u[1]*(k*7-3)];s+=`<path d="M${c[0]-u[0]*7-u[1]*6},${c[1]-u[1]*7+u[0]*6} L${c[0]},${c[1]} L${c[0]-u[0]*7+u[1]*6},${c[1]-u[1]*7-u[0]*6}" fill="none" stroke="var(--tomato)" stroke-width="2.5"/>`}});
  (labs||[]).forEach((lb,i)=>{if(!lb)return;const q=P[i],o=[P[(i+1)%4],P[(i+3)%4]],u=o.map(p=>{const dx=p[0]-q[0],dy=p[1]-q[1],l=Math.hypot(dx,dy);return [dx/l,dy/l]}),bx=u[0][0]+u[1][0],by=u[0][1]+u[1][1],bl=Math.hypot(bx,by);
    {const r=19,col=lb==='x'?'var(--tomato)':'var(--sun)',sw=(u[0][0]*u[1][1]-u[0][1]*u[1][0])>0?1:0;
     s+=`<path d="M${(q[0]+u[0][0]*r).toFixed(1)},${(q[1]+u[0][1]*r).toFixed(1)} A${r},${r} 0 0 ${sw} ${(q[0]+u[1][0]*r).toFixed(1)},${(q[1]+u[1][1]*r).toFixed(1)}" fill="none" stroke="${col}" stroke-width="3"/>`}
    s+=`<text x="${(q[0]+bx/bl*36).toFixed(1)}" y="${(q[1]+by/bl*36+5).toFixed(1)}" text-anchor="middle" style="font:800 15px var(--body);fill:${lb==='x'?'var(--tomato)':'var(--ink)'}">${lb}</text>`});
  return `<svg viewBox="${ox} ${oy} ${W} ${H}" class="msvg" style="max-width:340px" role="img" aria-label="Quadrilateral">${s}</svg>`}
addGame('p5-quads',{level:'P5',strand:'geo',glyph:'▱',title:'Quad Quest',topic:'Parallelogram, rhombus and trapezium',
 how:'Guess the mystery shape from as few clues as possible, then use the shape’s properties to find unknown angles.',rounds:8,
 round(api,r){
  if(r%2===0){const names=Object.keys(QSH),ans=r===0?pick(['Parallelogram','Rhombus','Trapezium']):pick(names),S=QSH[ans];let shown=1;
    api.q(`<p class="qt">Who am I? Guess as early as you dare. Fewer clues = more points.</p>`);
    api.body.innerHTML=`<ol id="qqL" style="margin:0;padding-left:1.3em;font-weight:700;display:grid;gap:4px"></ol><div><button class="btn" id="qqN">Show another clue</button></div><div class="choices" id="qqC"></div><div id="qqP"></div>`;
    const draw=()=>{$('qqL').innerHTML=S.c.slice(0,shown).map(c=>`<li>${c}</li>`).join('');$('qqN').disabled=shown>=S.c.length||api.answered};draw();
    $('qqN').onclick=()=>{shown++;sfx.tap();draw()};
    names.forEach(n=>{const b=document.createElement('button');b.className='btn';b.style.fontSize='1.05rem';b.textContent=n;
      b.onclick=()=>{if(api.answered)return;const ok=n===ans;[...$('qqC').children].forEach(x=>{x.disabled=true;if(x.textContent===ans)x.classList.add('ok')});if(!ok)b.classList.add('no');$('qqN').disabled=true;
        const mk=ans==='Trapezium'?[[0,1,1],[3,2,1]]:[[0,1,1],[3,2,1],[1,2,2],[0,3,2]];
        $('qqP').innerHTML=quadSVG(S.p,null,mk);
        api.done(ok,`I am a ${ans.toLowerCase()}.`,['All clues: '+S.c.join(' '),'Arrow marks show parallel sides.',ans==='Trapezium'?'A trapezium has only one pair of parallel sides.':ans==='Rhombus'||ans==='Square'?'Squares and rhombuses both have 4 equal sides; only the square has right angles.':'Rectangles and parallelograms both have opposite sides parallel and equal; only the rectangle has right angles.'],
          ok?Math.max(4,10-2*(shown-1)):0)};$('qqC').appendChild(b)});return}
  const kind=['pg','rh','tz','pg'][(r-1)/2];let P,labs,x,work,marks;
  if(kind==='tz'){const a=R(55,80),b=R(50,80),s=95,t=a*Math.PI/180,u=b*Math.PI/180,BL=[30,170],BR=[260,170],TL=[BL[0]+s*Math.cos(t),BL[1]-s*Math.sin(t)],s2=s*Math.sin(t)/Math.sin(u),TR=[BR[0]-s2*Math.cos(u),BR[1]-s2*Math.sin(u)];
    P=[BL,BR,TR,TL];const top=Math.random()<.5;x=top?180-a:180-b;labs=[a+'°',b+'°',top?'':'x',top?'x':''];marks=[[0,1,1],[3,2,1]];
    work=['The top and bottom sides are parallel (arrow marks).','Angles between a pair of parallel sides add up to 180°.',`x = 180° − ${top?a:b}° = <b>${x}°</b>`]}
  else{const a=pick([R(55,80),R(100,125)]);P=quadAng(kind,a);const opp=Math.random()<.5;x=opp?a:180-a;labs=[a+'°',opp?'':'x',opp?'x':'',''];
    marks=[[0,1,1],[3,2,1],[0,3,2],[1,2,2]];const nm=kind==='rh'?'rhombus':'parallelogram';
    work=opp?[`In a ${nm}, opposite angles are equal.`,`x = <b>${a}°</b>`]:[`In a ${nm}, angles next to each other between parallel sides add up to 180°.`,`x = 180° − ${a}° = <b>${x}°</b>`]}
  api.q(`<p class="qt">This is a <b>${kind==='tz'?'trapezium':kind==='rh'?'rhombus':'parallelogram'}</b>. Find the value of x.</p><p class="qs">Not drawn to scale.</p>`);
  api.body.innerHTML=quadSVG(P,labs,marks)+`<div class="row"><b>x =</b><input class="num" id="qaIn" inputmode="numeric" aria-label="x"><span>°</span><button class="btn primary" id="qaChk">Check</button></div>`;
  $('qaChk').onclick=()=>{const v=parseInt($('qaIn').value,10);if(isNaN(v))return;$('qaIn').disabled=true;api.done(v===x,`x = ${x}°`,work)}}});
