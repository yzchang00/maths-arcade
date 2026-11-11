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
  let pk=null;
  $('hC').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(pk!==null||api.answered)return;if(!cands[+b.dataset.i].ok&&api.first('h')){b.disabled=true;b.classList.add('no');api.retry($('hS'),'Not that one. The height must meet the base at a right angle. Try again!');return}pk=+b.dataset.i;const ok=cands[pk].ok;
    $('hC').querySelectorAll('button').forEach((x,i)=>{x.disabled=true;if(cands[i].ok)x.classList.add('ok')});if(!ok)b.classList.add('no');ok?sfx.pop():sfx.soft();
    $('hS').innerHTML=`<p style="margin:0 0 8px;font-weight:800">${ok?'Yes!':`Not that one. Line ${L[cands.findIndex(c=>c.ok)]} is the height.`} The height is ${h} cm.</p>
      <div class="row"><b>Area =</b><input class="num" id="hIn" inputmode="decimal" aria-label="Area"><span>cm²</span><button class="btn primary" id="hChk">Check</button></div>`;
    $('hChk').onclick=()=>{const v=parseFloat($('hIn').value);if(isNaN(v))return;const ar=bl*h/2,o2=Math.abs(v-ar)<.001;$('hIn').disabled=true;
      api.done(ok&&o2,`Area = ${ar} cm²`,['The height goes from the opposite corner and meets the base (or the base extended) at a right angle.',
        xa<x1||xa>x1+bl?'Here the height falls outside the triangle, so the base is extended with a dotted line.':xa===x1||xa===x1+bl?'Here one side of the triangle is already at right angles to the base, so that side is the height.':'',
        `Area = ½ × base × height = ½ × ${bl} × ${h} = <b>${ar} cm²</b>`].filter(Boolean),(ok?4:0)+(o2?6:0))}})}});

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
    ans1(L*B*H,'cm³',[`Each layer has ${L} × ${B} = ${L*B} cubes.`,`There are ${H} layers: ${L*B} × ${H} = <b>${L*B*H} cm³</b>`,'Volume of a cuboid = length × breadth × height'],'What is the volume of this cuboid?',isoCubes(L,B,H))}
  else if(type==='miss'){const L=R(2,6),B=R(2,5),H=R(2,6),V=L*B*H;
    ans1(H,'cm',[`Base area = ${L} × ${B} = ${L*B} cm²`,`Height = volume ÷ base area = ${V} ÷ ${L*B} = <b>${H} cm</b>`],
      `A cuboid has a volume of <b>${V} cm³</b>. Its base is ${L} cm by ${B} cm (one layer is shown). What is its height?`,isoCubes(L,B,1))}
  else if(type==='tank'){const L=pick([20,25,30,40,50]),B=pick([10,15,20,25,30]),H=pick([20,25,30,35,40]),w=pick([5,10,15,20].filter(x=>x<H)),V=L*B*w;
    ans1(V/1000,'ℓ',[`Volume of water = ${L} × ${B} × ${w} = ${fmt(V)} cm³`,`1000 cm³ = 1 ℓ, so ${fmt(V)} cm³ = ${fmt(V)} ÷ 1000 = <b>${V/1000} ℓ</b>`],
      `A tank ${L} cm long, ${B} cm wide and ${H} cm high has water ${w} cm deep. How many litres of water are in the tank?`,isoTank(L,B,H,w),true)}
  else{const L0=R(2,6),B0=R(2,6),h=R(2,4),V=L0*B0*h;const d={L:1,B:1,H:1};
    api.q(`<p class="qt">Build a cuboid with volume <b>${V} cm³</b> and height <b>${h} cm</b>.</p><p class="qs">There may be more than one way.</p>`);
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
  let pOk=null;
  $('adP').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(pOk!==null)return;if(b.dataset.k!==prop&&api.first('fact')){b.disabled=true;b.classList.add('no');api.retry($('adS'),'That fact does not fit this diagram. Look at where x is and try another!');return}pOk=b.dataset.k===prop;$('adP').querySelectorAll('button').forEach(y=>{y.disabled=true;if(y.dataset.k===prop)y.classList.add('ok')});if(!pOk)b.classList.add('no');pOk?sfx.pop():sfx.soft();
    $('adS').innerHTML=`<div class="row"><b>Step 2: x =</b><input class="num" id="adIn" inputmode="numeric" aria-label="x"><span>°</span><button class="btn primary" id="adChk">Check</button></div>`;
    $('adChk').onclick=()=>{const v=parseInt($('adIn').value,10);if(isNaN(v))return;$('adIn').disabled=true;const o=v===x;api.done(pOk&&o,`x = ${x}°`,work,(pOk?4:0)+(o?6:0))}})}});

/* P5-10. Triangle Sorter — Properties of triangles, angle sum */
function triPts(al,be){const L=200,ga=(180-al-be)*Math.PI/180,a=al*Math.PI/180,b=be*Math.PI/180,AC=L*Math.sin(b)/Math.sin(ga);return [[0,0],[L,0],[AC*Math.cos(a),AC*Math.sin(a)]]}
function triSVG(ang,labs,ticks){const P=triPts(ang[0],ang[1]),xs=P.map(p=>p[0]),ys=P.map(p=>p[1]),mnx=Math.min(...xs),mxx=Math.max(...xs),mxy=Math.max(...ys),sc=Math.min(260/(mxx-mnx),170/mxy);
  const Q=P.map(([x,y])=>[20+(x-mnx)*sc,200-y*sc]);let s=`<polygon points="${Q.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" style="fill:color-mix(in srgb,var(--sun) 30%,transparent)" stroke="var(--ink)" stroke-width="2.5" stroke-linejoin="round"/>`;
  Q.forEach((q,i)=>{const o=Q.filter((_,j)=>j!==i),u=o.map(p=>{const dx=p[0]-q[0],dy=p[1]-q[1],l=Math.hypot(dx,dy);return [dx/l,dy/l]}),bx=u[0][0]+u[1][0],by=u[0][1]+u[1][1],bl=Math.hypot(bx,by);
    if(ang[i]===90&&labs[i]==='⊾'){s+=`<path d="M${q[0]+u[0][0]*14},${q[1]+u[0][1]*14} L${q[0]+(u[0][0]+u[1][0])*14},${q[1]+(u[0][1]+u[1][1])*14} L${q[0]+u[1][0]*14},${q[1]+u[1][1]*14}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;return}
    if(labs[i])s+=`<text x="${(q[0]+bx/bl*(ang[i]<60?46:32)).toFixed(1)}" y="${(q[1]+by/bl*(ang[i]<60?46:32)+5).toFixed(1)}" text-anchor="middle" style="font:800 14px var(--body);fill:${labs[i]==='x'?'var(--tomato)':'var(--ink)'}">${labs[i]}</text>`});
  (ticks||[]).forEach(([i,j])=>{const a=Q[i],b=Q[j],m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),n=[-dy/l*8,dx/l*8];s+=`<line x1="${m[0]-n[0]}" y1="${m[1]-n[1]}" x2="${m[0]+n[0]}" y2="${m[1]+n[1]}" stroke="var(--tomato)" stroke-width="3"/>`});
  return `<svg viewBox="0 0 300 220" class="msvg" style="max-width:340px" role="img" aria-label="Triangle">${s}</svg>`}
function genTri(kind){let a,b,c;
  if(kind==='equi')return {ang:[60,60,60],ticks:[[0,1],[1,2],[0,2]]};
  if(kind==='isoA'){const t=pick([20,30,40,50,70,80]);return {ang:[(180-t)/2,(180-t)/2,t],ticks:[[0,2],[1,2]],apex:2}}
  if(kind==='isoR')return {ang:[90,45,45],ticks:[[0,1],[0,2]],apex:0};
  if(kind==='isoO'){const t=pick([100,110,120,130,140]);return {ang:[(180-t)/2,(180-t)/2,t],ticks:[[0,2],[1,2]],apex:2}}
  if(kind==='scaR'){do{b=R(25,65)}while(b===45);return {ang:pick([[90,b,90-b],[b,90,90-b]])}}
  for(;;){if(kind==='scaO'){c=R(100,135);a=R(15,180-c-15);b=180-c-a}else{a=R(40,80);b=R(40,80);c=180-a-b}
    if(new Set([a,b,c]).size===3&&a>=15&&b>=15&&(kind==='scaO'||c<90&&c>30)){return {ang:shuffle([a,b,c])}}}}
const TPROP=['Isosceles','Equilateral','Right-angled','Acute-angled','Obtuse-angled'];
addGame('p5-triangles',{level:'P5',strand:'geo',glyph:'△',title:'Triangle Sorter',topic:'Properties of triangles and angle sum',
 how:'Some rounds: tick every name that describes the triangle. Other rounds: find the unknown angle using the angle sum of 180°.',rounds:8,
 round(api,r){
  if(r%2===0){const kind=pick(['equi','isoA','isoR','isoO','scaR','scaA','scaO']),T=genTri(kind);let ang=T.ang;
    const truth=new Set();if(kind==='equi'){truth.add('Equilateral')}else if(kind.startsWith('iso'))truth.add('Isosceles');
    if(ang.includes(90))truth.add('Right-angled');else if(ang.some(v=>v>90))truth.add('Obtuse-angled');else truth.add('Acute-angled');
    api.q(`<p class="qt">Tap <b>every</b> name that describes this triangle, then press Check.</p><p class="qs">Equal marks on two sides mean those sides are the same length.</p>`);
    api.body.innerHTML=triSVG(ang,ang.map(v=>v===90?'⊾':v+'°'),T.ticks)+`<div class="row" id="tsC">${TPROP.map(p=>`<button class="btn" aria-pressed="false">${p}</button>`).join('')}</div><div><button class="btn primary" id="tsChk">Check</button></div>`;
    const sel=new Set();$('tsC').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(api.answered)return;const p=b.textContent;sel.has(p)?sel.delete(p):sel.add(p);b.classList.toggle('sel',sel.has(p));b.setAttribute('aria-pressed',String(sel.has(p)));sfx.tap()});
    $('tsChk').onclick=()=>{const opt=kind==='equi'?['Isosceles']:[],need=[...truth],ok=need.every(p=>sel.has(p))&&[...sel].every(p=>truth.has(p)||opt.includes(p));
      $('tsC').querySelectorAll('button').forEach(b=>{b.disabled=true;b.classList.remove('sel');if(truth.has(b.textContent))b.classList.add('ok');else if(sel.has(b.textContent)&&!opt.includes(b.textContent))b.classList.add('no')});
      const big=Math.max(...ang);
      api.done(ok,`It is ${need.map(x=>x.toLowerCase()).join(' and ')}.`,[kind==='equi'?'All 3 sides are equal and every angle is 60°, so it is equilateral (it also counts as isosceles).':kind.startsWith('iso')?'Two sides are equal, so it is isosceles. The angles opposite the equal sides are equal too.':'No sides are equal.',
        big===90?'One angle is 90°, so it is right-angled.':big>90?`One angle is ${big}°, more than 90°, so it is obtuse-angled.`:'All three angles are less than 90°, so it is acute-angled.'])};return}
  const mode=['sum','isoBase','isoApex','right'][(r-1)/2];let ang,labs,x,work,ticks;
  if(mode==='sum'){const T=genTri(pick(['scaA','scaO']));ang=T.ang;const xi=R(0,2);x=ang[xi];labs=ang.map((v,i)=>i===xi?'x':v+'°');const kn=ang.filter((_,i)=>i!==xi);
    work=['The angles in a triangle add up to 180°.',`x = 180° − ${kn[0]}° − ${kn[1]}° = <b>${x}°</b>`]}
  else if(mode==='isoBase'){const T=genTri(pick(['isoA','isoO']));ang=T.ang;ticks=T.ticks;x=ang[0];labs=['x','',ang[2]+'°'];
    work=['The two marked sides are equal, so the two base angles are equal.',`180° − ${ang[2]}° = ${180-ang[2]}°`,`x = ${180-ang[2]}° ÷ 2 = <b>${x}°</b>`]}
  else if(mode==='isoApex'){const T=genTri(pick(['isoA','isoO']));ang=T.ang;ticks=T.ticks;x=ang[2];labs=[ang[0]+'°','','x'];
    work=['The two marked sides are equal, so both base angles are '+ang[0]+'°.',`x = 180° − ${ang[0]}° − ${ang[0]}° = <b>${x}°</b>`]}
  else{const T=genTri('scaR');ang=T.ang;const ri=ang.indexOf(90),others=[0,1,2].filter(i=>i!==ri),xi=pick(others),ki=others.find(i=>i!==xi);x=ang[xi];labs=ang.map((v,i)=>i===ri?'⊾':i===xi?'x':v+'°');
    work=['The square mark shows a right angle, 90°.',`x = 180° − 90° − ${ang[ki]}° = <b>${x}°</b>`]}
  api.q(`<p class="qt">Find the value of <b>x</b>.</p><p class="qs">Not drawn to scale.</p>`);
  api.body.innerHTML=triSVG(ang,labs,ticks)+`<div class="row"><b>x =</b><input class="num" id="tsIn" inputmode="numeric" aria-label="x"><span>°</span><button class="btn primary" id="tsChk">Check</button></div>`;
  $('tsChk').onclick=()=>{const v=parseInt($('tsIn').value,10);if(isNaN(v))return;$('tsIn').disabled=true;api.done(v===x,`x = ${x}°`,work)}}});

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
