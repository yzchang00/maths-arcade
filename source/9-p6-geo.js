/* ================= P6 MEASUREMENT, GEOMETRY AND STATISTICS ================= */

/* P6-5. Circle Lab — Area and circumference of circle, semicircle, quarter circle, composite figures */
const r2=v=>Math.round(v*100)/100;
function circleShape(kind,v){
  const T=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle" style="font:800 14px var(--body);fill:var(--ink);paint-order:stroke;stroke:var(--surface);stroke-width:4px">${t}</text>`;
  if(kind==='circ')return {pcs:[{d:'M80,130 A100,100 0 1 1 280,130 A100,100 0 1 1 80,130',b:1,n:'the curved edge (circumference)'},{d:'M180,130 L280,130',b:0,n:'the radius'}],labs:T(230,122,v.lab)+`<circle cx="180" cy="130" r="3.5" style="fill:var(--ink)"/>`};
  if(kind==='semi')return {pcs:[{d:'M60,190 A120,120 0 0 1 300,190',b:1,n:'the curved edge'},{d:'M60,190 L300,190',b:1,n:'the diameter'},{d:'M180,190 L180,70',b:0,n:'the radius inside'}],labs:T(180,214,v.lab)};
  if(kind==='quarter')return {pcs:[{d:'M250,210 A160,160 0 0 0 90,50',b:1,n:'the curved edge'},{d:'M90,210 L250,210',b:1,n:'one radius'},{d:'M90,210 L90,50',b:1,n:'the other radius'},{d:'M90,50 L250,210',b:0,n:'the slanted line'}],labs:T(170,234,v.lab)+`<path d="M90,196 L104,196 L104,210" fill="none" stroke="var(--ink)" stroke-width="2"/>`};
  if(kind==='rsemi')return {pcs:[{d:'M40,60 L220,60',b:1,n:'the top side'},{d:'M40,200 L220,200',b:1,n:'the bottom side'},{d:'M40,60 L40,200',b:1,n:'the left side'},{d:'M220,60 A70,70 0 0 1 220,200',b:1,n:'the curved edge'},{d:'M220,60 L220,200',b:0,n:'the shared side inside'}],labs:T(130,52,v.L+' cm')+T(22,134,v.W+' cm')};
  return {pcs:[{d:'M110,60 L250,60',b:1,n:'the top side'},{d:'M110,200 L250,200',b:1,n:'the bottom side'},{d:'M110,60 A70,70 0 0 0 110,200',b:1,n:'the left curve'},{d:'M250,60 A70,70 0 0 1 250,200',b:1,n:'the right curve'},{d:'M110,60 L110,200',b:0,n:'a side inside'},{d:'M250,60 L250,200',b:0,n:'a side inside'}],labs:T(180,52,v.L+' cm')+T(180,134,v.W+' cm')}}
addGame('p6-circle',{level:'P6',strand:'geo',glyph:'π',title:'Circle Lab',topic:'Area and circumference of circles, semicircles, quarter circles and composite figures',
 how:'For perimeter, first tap every edge that goes around the outside. For area, pick the right formula. Then calculate.',rounds:8,
 round(api,r){const kind=['circP','circA','semiP','quarterA','quarterP','rsemiP','trackP','rsemiA'][r];let v={},ans,form,work,piTxt;
  const pi7=Math.random()<.5,PI=pi7?22/7:3.14;piTxt=pi7?fr(22,7):'3.14';const rad=pi7?pick([7,14,21]):pick([5,6,8,10,12,20]);
  if(kind==='circP'){const useD=Math.random()<.5;v.lab=useD?`d = ${2*rad} cm`:`r = ${rad} cm`;ans=r2(2*PI*rad);work=[useD?`Circumference = π × d = ${piTxt} × ${2*rad} = <b>${ans} cm</b>`:`Circumference = 2 × π × r = 2 × ${piTxt} × ${rad} = <b>${ans} cm</b>`]}
  if(kind==='circA'){v.lab=`r = ${rad} cm`;ans=r2(PI*rad*rad);form=['π × r × r','2 × π × r','π × d','½ × π × r × r'];work=[`Area = π × r × r = ${piTxt} × ${rad} × ${rad} = <b>${ans} cm²</b>`]}
  if(kind==='semiP'){v.lab=`${2*rad} cm`;const arc=r2(PI*rad);ans=r2(PI*rad+2*rad);work=[`Curved edge = half the circumference = ½ × ${piTxt} × ${2*rad} = ${arc} cm`,`Perimeter = curved edge + diameter = ${arc} + ${2*rad} = <b>${ans} cm</b>`]}
  if(kind==='quarterA'){v.lab=`${rad} cm`;ans=r2(PI*rad*rad/4);form=['¼ × π × r × r','π × r × r','½ × π × r × r','¼ × 2 × π × r'];work=[`A quarter circle is ¼ of a whole circle.`,`Area = ¼ × ${piTxt} × ${rad} × ${rad} = <b>${ans} cm²</b>`]}
  if(kind==='quarterP'){v.lab=`${rad} cm`;const arc=r2(PI*rad/2);ans=r2(PI*rad/2+2*rad);work=[`Curved edge = ¼ × 2 × ${piTxt} × ${rad} = ${arc} cm`,`Perimeter = curved edge + 2 radii = ${arc} + ${rad} + ${rad} = <b>${ans} cm</b>`]}
  if(kind==='rsemiP'||kind==='rsemiA'||kind==='trackP'){v.W=2*rad;v.L=pick([10,15,20,25,30].filter(x=>x!==v.W));const arc=r2(PI*v.W/2);
    if(kind==='rsemiP'){ans=r2(2*v.L+v.W+arc);work=[`Curved edge = ½ × ${piTxt} × ${v.W} = ${arc} cm`,`Perimeter = ${v.L} + ${v.L} + ${v.W} + ${arc} = <b>${ans} cm</b>`,'The dashed side is inside the figure, so it is not part of the perimeter.']}
    else if(kind==='trackP'){ans=r2(2*v.L+PI*v.W);work=[`The two semicircles make one whole circle: ${piTxt} × ${v.W} = ${r2(PI*v.W)} cm`,`Perimeter = ${v.L} + ${v.L} + ${r2(PI*v.W)} = <b>${ans} cm</b>`]}
    else{const semi=r2(PI*rad*rad/2);ans=r2(v.L*v.W+PI*rad*rad/2);form=['L × W + ½ × π × r × r','L × W + π × r × r','2 × (L + W) + ½ × π × d','L × W × π'];work=[`Rectangle = ${v.L} × ${v.W} = ${v.L*v.W} cm²`,`Semicircle (r = ${rad} cm) = ½ × ${piTxt} × ${rad} × ${rad} = ${semi} cm²`,`Total area = ${v.L*v.W} + ${semi} = <b>${ans} cm²</b>`]}}
  const S=circleShape(kind==='trackP'?'track':kind.replace(/[PA]$/,''),v),isP=kind.endsWith('P'),unit=isP?'cm':'cm²';
  api.q(`<p class="qt">Find the ${isP?'perimeter':'area'} of the figure.</p><p class="qs">Take π = ${piTxt}. Give your answer to 2 decimal places if needed.</p>`);
  api.body.innerHTML=`<svg viewBox="0 0 360 260" class="msvg" style="max-width:400px" id="clS" role="img" aria-label="Figure">${S.pcs.map((p,i)=>`<path d="${p.d}" fill="none" stroke="var(--ink)" stroke-width="3" ${p.b?'':'stroke-dasharray="7 6"'} data-i="${i}" class="clp"/><path d="${p.d}" fill="none" stroke="transparent" stroke-width="22" data-i="${i}" class="clh" style="cursor:pointer"/>`).join('')}${S.labs}</svg><div id="clS1"></div><div id="clS2"></div>`;
  const step2=s1=>{$('clS2').innerHTML=`<div class="row"><b>${isP?'Perimeter':'Area'} =</b><input class="num" id="clIn" inputmode="decimal" aria-label="Answer"><span>${unit}</span><button class="btn primary" id="clChk">Check</button></div>`;
    $('clChk').onclick=()=>{const g=parseFloat($('clIn').value);if(isNaN(g))return;$('clIn').disabled=true;const o=Math.abs(g-ans)<.015;api.done(s1&&o,`The ${isP?'perimeter':'area'} is ${ans} ${unit}.`,work,(s1?4:0)+(o?6:0))}};
  if(isP){const sel=new Set();$('clS1').innerHTML=`<div class="row"><b>Step 1: Tap every edge of the perimeter.</b><button class="btn" id="clOk">Done</button></div>`;
    api.body.querySelectorAll('.clh').forEach(h=>h.addEventListener('click',()=>{if($('clOk').disabled)return;const i=+h.dataset.i;sel.has(i)?sel.delete(i):sel.add(i);sfx.tap();
      api.body.querySelector(`.clp[data-i="${i}"]`).style.stroke=sel.has(i)?'var(--tomato)':'var(--ink)';api.body.querySelector(`.clp[data-i="${i}"]`).style.strokeWidth=sel.has(i)?6:3}));
    $('clOk').onclick=()=>{const want=S.pcs.map((p,i)=>p.b?i:-1).filter(i=>i>=0),ok=want.length===sel.size&&want.every(i=>sel.has(i));if(!ok&&api.first('edges')){let m=$('clR');if(!m){$('clS1').insertAdjacentHTML('beforeend','<div id="clR"></div>');m=$('clR')}api.retry(m,`Not quite. ${sel.size<want.length?'You have missed some edges.':'Some of those edges are inside the shape, not around the outside.'} Change your edges and press Done again.`);return}$('clR')&&$('clR').remove();$('clOk').disabled=true;ok?sfx.pop():sfx.soft();
      S.pcs.forEach((p,i)=>{const el=api.body.querySelector(`.clp[data-i="${i}"]`);el.style.stroke=p.b?'var(--good)':'var(--ink)';el.style.strokeWidth=p.b?6:3});
      $('clS1').insertAdjacentHTML('beforeend',`<p style="margin:6px 0 0;font-weight:800">${ok?'Correct edges! Now work out the perimeter.':'Not quite. The green edges make the perimeter.'} The perimeter is made of ${S.pcs.filter(p=>p.b).map(p=>p.n).join(', ')}.</p>`);step2(ok)}}
  else{$('clS1').innerHTML=`<b>Step 1: Which formula gives the area?</b>`;const right=form[0];
    choiceRow(api,'clF',form,right,ok=>{ok?sfx.pop():sfx.soft();api.body.appendChild($('clS2'));step2(ok)},'formula');
    $('clF').querySelectorAll('button').forEach(b=>b.style.fontSize='1.05rem')}}});

/* P6-6. Crate Cracker — Volume: finding an edge, height or face area; square and cube roots */
function isoSolid(L,B,H,labs){const sc=170/(L+B+H*.8),c=.866,P=(x,y,z)=>[(x-y)*sc*c,(x+y)*sc*.5-z*sc],pt=p=>P(...p).map(v=>v.toFixed(1)).join(',');
  const f=(a,col)=>`<polygon points="${a.map(pt).join(' ')}" fill="${col}" stroke="#16233a" stroke-width="2" stroke-linejoin="round"/>`;
  const lab=(p,t,dx,dy)=>`<text x="${(P(...p)[0]+dx).toFixed(1)}" y="${(P(...p)[1]+dy).toFixed(1)}" text-anchor="middle" style="font:800 13px var(--body);fill:var(--ink)">${t}</text>`;
  const xs=[P(0,B,0)[0],P(L,0,0)[0]],y0=P(0,0,H)[1],y1=P(L,B,0)[1];
  return `<svg viewBox="${xs[0]-50} ${y0-14} ${xs[1]-xs[0]+100} ${y1-y0+40}" style="width:100%;max-width:360px;height:auto" role="img" aria-label="Box">
    ${f([[0,0,H],[L,0,H],[L,B,H],[0,B,H]],'#e7c38a')}${f([[L,0,0],[L,B,0],[L,B,H],[L,0,H]],'#c9974d')}${f([[0,B,0],[L,B,0],[L,B,H],[0,B,H]],'#b07d36')}
    ${labs[0]?lab([L/2,B,0],labs[0],-14,22):''}${labs[1]?lab([L,B/2,0],labs[1],24,18):''}${labs[2]?lab([L,0,H/2],labs[2],34,0):''}</svg>`}
addGame('p6-cuberoot',{level:'P6',strand:'geo',glyph:'∛',title:'Crate Cracker',topic:'Volume of cube and cuboid: finding an edge, height or face',
 how:'Crack the crate’s missing measurement. For cubes, try an edge length and see its volume until you find the right one.',rounds:8,
 round(api,r){const type=['cube','square','height','cube','face','tank','height','face2'][r];
  const ans1=(q,ans,u,work,pic)=>{api.q(`<p class="qt">${q}</p>`);api.body.innerHTML=pic+`<div class="row"><input class="num" id="crIn" inputmode="numeric" aria-label="Answer"><span>${u}</span><button class="btn primary" id="crChk">Check</button></div>`;
    $('crChk').onclick=()=>{const v=parseFloat($('crIn').value);if(isNaN(v))return;$('crIn').disabled=true;api.done(v===ans,`The answer is ${ans} ${u}.`,work)}};
  if(type==='cube'){const n=R(r<3?2:5,r<3?6:12),V=n**3;let tries=0;
    api.q(`<p class="qt">A cube-shaped crate has a volume of <b>${fmt(V)} cm³</b>. How long is each edge?</p><p class="qs">Try an edge length. You have 4 tries.</p>`);
    api.body.innerHTML=`<div id="crP">${isoSolid(1,1,1,['?','?','?'])}</div><div class="row"><b>Edge =</b><input class="num" id="crIn" inputmode="numeric" aria-label="Edge length"><span>cm</span><button class="btn primary" id="crTry">Try</button></div><div class="hist" id="crH"></div>`;
    $('crTry').onclick=()=>{const g=parseInt($('crIn').value,10);if(isNaN(g)||g<1||g>50)return;tries++;const gv=g**3;$('crIn').value='';
      $('crH').insertAdjacentHTML('beforeend',`<div>${g} × ${g} × ${g} = ${fmt(gv)} cm³ ${gv===V?'✓ cracked!':gv<V?'→ too small':'→ too big'}</div>`);
      if(gv===V||tries>=4){$('crTry').disabled=true;$('crIn').disabled=true;$('crP').innerHTML=isoSolid(1,1,1,[n+' cm',n+' cm',n+' cm']);
        api.done(gv===V,gv===V?`Each edge is ${n} cm.`:`Each edge is ${n} cm.`,[`Find the number that multiplies by itself 3 times to make ${fmt(V)}: ${n} × ${n} × ${n} = ${fmt(V)}`,`So the edge = ∛${fmt(V)} = <b>${n} cm</b>`,'Know your cubes: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000.'],gv===V?[10,10,8,6][tries-1]:0)}else sfx.soft()};return}
  if(type==='square'){const n=R(4,15);ans1(`A square garden has an area of <b>${n*n} m²</b>. How long is each side?`,n,'m',[`${n} × ${n} = ${n*n}`,`Side = √${n*n} = <b>${n} m</b>`],
    `<svg viewBox="0 0 160 160" style="width:150px" role="img" aria-label="Square"><rect x="20" y="20" width="120" height="120" fill="#bfe8cf" stroke="var(--ink)" stroke-width="3"/><text x="80" y="86" text-anchor="middle" class="nlab">${n*n} m²</text><text x="80" y="155" text-anchor="middle" class="nlab" style="font-size:14px">?</text></svg>`);return}
  if(type==='height'){const L=R(4,15),B=R(3,10),H=R(2,12),V=L*B*H;ans1(`A cuboid has a volume of <b>${fmt(V)} cm³</b>. Its base is ${L} cm by ${B} cm. What is its height?`,H,'cm',
    [`Base area = ${L} × ${B} = ${L*B} cm²`,`Height = volume ÷ base area = ${fmt(V)} ÷ ${L*B} = <b>${H} cm</b>`],isoSolid(L,B,H,[L+' cm',B+' cm','?']));return}
  if(type==='face'){const n=R(3,10),V=n**3;ans1(`A cube has a volume of <b>${fmt(V)} cm³</b>. What is the area of one face?`,n*n,'cm²',
    [`Edge = ∛${fmt(V)} = ${n} cm`,`Area of one face = ${n} × ${n} = <b>${n*n} cm²</b>`],isoSolid(1,1,1,['','','']));return}
  if(type==='face2'){const L=R(4,12),B=R(3,10),H=R(2,9),V=L*B*H;ans1(`A cuboid has a volume of <b>${fmt(V)} cm³</b> and a height of ${H} cm. What is the area of its base?`,L*B,'cm²',
    [`Volume = base area × height`,`Base area = ${fmt(V)} ÷ ${H} = <b>${L*B} cm²</b>`],isoSolid(L,B,H,['','',H+' cm']));return}
  const n=pick([10,20,30,40,50]),lit=n**3/1000;ans1(`A cube-shaped tank holds exactly <b>${fmt(lit)} litres</b> of water when full. What is the length of each edge?`,n,'cm',
    [`1 ℓ = 1000 cm³, so ${fmt(lit)} ℓ = ${fmt(n**3)} cm³`,`Edge = ∛${fmt(n**3)} = <b>${n} cm</b>`],isoSolid(1,1,1,['','','']))}});

/* P6-7. Angle Chain — Unknown angles in composite figures with special quadrilaterals */
function chainSVG(pts,segs,labs,ticks){const xs=Object.values(pts).map(p=>p[0]),ys=Object.values(pts).map(p=>p[1]),ox=Math.min(...xs)-34,oy=Math.min(...ys)-34,W=Math.max(...xs)-ox+34,H=Math.max(...ys)-oy+34;
  let s=segs.map(([a,b])=>`<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>`).join('');
  (ticks||[]).forEach(([a,b])=>{const p=pts[a],q=pts[b],m=[(p[0]+q[0])/2,(p[1]+q[1])/2],dx=q[0]-p[0],dy=q[1]-p[1],l=Math.hypot(dx,dy),n=[-dy/l*7,dx/l*7];s+=`<line x1="${m[0]-n[0]}" y1="${m[1]-n[1]}" x2="${m[0]+n[0]}" y2="${m[1]+n[1]}" stroke="var(--tomato)" stroke-width="3"/>`});
  Object.entries(pts).forEach(([k,p])=>{const cx=xs.reduce((a,b)=>a+b,0)/xs.length,cy=ys.reduce((a,b)=>a+b,0)/ys.length,dx=p[0]-cx,dy=p[1]-cy,l=Math.hypot(dx,dy)||1;
    s+=`<text x="${(p[0]+dx/l*18).toFixed(1)}" y="${(p[1]+dy/l*18+5).toFixed(1)}" text-anchor="middle" style="font:800 15px var(--body);fill:var(--muted)">${k}</text>`});
  labs.forEach(([v,a,b,t])=>{const p=pts[v],u=[a,b].map(k=>{const dx=pts[k][0]-p[0],dy=pts[k][1]-p[1],l=Math.hypot(dx,dy);return [dx/l,dy/l]}),bx=u[0][0]+u[1][0],by=u[0][1]+u[1][1],bl=Math.hypot(bx,by)||1,d=t==='x'||t==='y'?30:36;
    s+=`<text x="${(p[0]+bx/bl*d).toFixed(1)}" y="${(p[1]+by/bl*d+5).toFixed(1)}" text-anchor="middle" style="font:800 14px var(--body);fill:${t==='x'?'var(--tomato)':t==='y'?'var(--violet)':'var(--ink)'}">${t}</text>`});
  return `<svg viewBox="${ox} ${oy} ${W} ${H}" class="msvg" style="max-width:380px" role="img" aria-label="Geometric figure">${s}</svg>`}
addGame('p6-chain',{level:'P6',strand:'geo',glyph:'⊿',title:'Angle Chain',topic:'Unknown angles in composite figures',
 how:'Follow the chain: find angle y first, then use it to find x. Use the properties of triangles and special quadrilaterals. Not drawn to scale.',rounds:8,
 round(api,r){const T=['rh','rect','pg','sq','rh','rect','pg','sq'][r];let pts,segs,labs,ticks,y,x,txt,wy,wx,nm;
  if(T==='rh'){let a;do{a=R(25,65)*2}while(a>78&&a<102);const t=a*Math.PI/180,B=[40,200],C=[200,200],A=[B[0]+160*Math.cos(t),B[1]-160*Math.sin(t)],D=[A[0]+160,A[1]];
    pts={A,B,C,D};segs=[['A','B'],['B','C'],['C','D'],['D','A'],['A','C']];ticks=[['A','B'],['B','C'],['C','D'],['D','A']];y=(180-a)/2;x=180-a-y;
    labs=[['B','A','C',a+'°'],['C','A','B','y'],['C','A','D','x']];txt='ABCD is a rhombus.';nm=['∠ACB','∠ACD'];
    wy=[`In a rhombus all sides are equal, so triangle ABC is isosceles (AB = BC).`,`y = (180° − ${a}°) ÷ 2 = <b>${y}°</b>`];wx=[`In a rhombus, angles next to each other add up to 180°: ∠BCD = 180° − ${a}° = ${180-a}°`,`x = ${180-a}° − ${y}° = <b>${x}°</b>`]}
  else if(T==='rect'){const a=R(20,50),b=R(20,50),A=[30,40],B=[290,40],C=[290,190],D=[30,190],E=[30+260*Math.tan(a*Math.PI/180)/(Math.tan(a*Math.PI/180)+Math.tan(b*Math.PI/180)),190];
    pts={A,B,C,D,E};segs=[['A','B'],['B','C'],['C','D'],['D','A'],['A','E'],['B','E']];y=90-a;x=a+b;
    labs=[['A','D','E',a+'°'],['B','E','C',b+'°'],['A','E','B','y'],['E','A','B','x']];txt='ABCD is a rectangle. E is on DC.';nm=['∠EAB','∠AEB'];
    wy=[`All angles of a rectangle are 90°, so ∠DAB = 90°.`,`y = 90° − ${a}° = <b>${y}°</b>`];wx=[`Similarly ∠ABE = 90° − ${b}° = ${90-b}°`,`Angles in triangle ABE add up to 180°: x = 180° − ${y}° − ${90-b}° = <b>${x}°</b>`]}
  else if(T==='pg'){const a=R(50,80),t=a*Math.PI/180,A=[30,200],B=[310,200],D=[A[0]+110*Math.cos(t),A[1]-110*Math.sin(t)],C=[D[0]+280,D[1]],E=[A[0]+220*Math.cos(t),200];
    pts={A,B,C,D,E};segs=[['A','B'],['B','C'],['C','D'],['D','A'],['D','E']];ticks=[['A','D'],['D','E']];y=a;x=180-a;
    labs=[['A','E','D',a+'°'],['E','A','D','y'],['E','D','B','x']];txt='ABCD is a parallelogram. E is on AB and AD = DE.';nm=['∠DEA','∠DEB'];
    wy=['AD = DE, so triangle ADE is isosceles and its base angles are equal.',`y = ∠DAE = <b>${a}°</b>`];wx=['AEB is a straight line, so angles on it add up to 180°.',`x = 180° − ${y}° = <b>${x}°</b>`]}
  else{const out=Math.random()<.5,A=[40,40],B=[200,40],C=[200,200],D=[40,200],E=out?[40-160*Math.cos(Math.PI/6),120]:[40+160*Math.cos(Math.PI/6),120];
    // equilateral triangle on side AD (outside on the left, or inside the square)
    pts={A,B,C,D,E};segs=[['A','B'],['B','C'],['C','D'],['D','A'],['A','E'],['D','E'],['B','E']];ticks=[['A','B'],['B','C'],['C','D'],['D','A'],['A','E'],['D','E']];
    y=out?150:30;x=(180-y)/2;labs=[['A','B','E','y'],['B','A','E','x']];txt=`ABCD is a square. ADE is an equilateral triangle ${out?'outside':'inside'} the square.`;nm=['∠BAE','∠ABE'];
    wy=['Every angle of a square is 90° and every angle of an equilateral triangle is 60°.',out?`y = 90° + 60° = <b>150°</b>`:`y = 90° − 60° = <b>30°</b>`];wx=['AB = AD (square) and AD = AE (equilateral triangle), so AB = AE: triangle ABE is isosceles.',`x = (180° − ${y}°) ÷ 2 = <b>${x}°</b>`]}
  api.q(`<p class="qt">${txt} Find ${nm[0]} (y), then ${nm[1]} (x).</p><p class="qs">Not drawn to scale.</p>`);
  api.body.innerHTML=chainSVG(pts,segs,labs,ticks)+`<div class="row"><b style="color:var(--violet)">y =</b><input class="num" id="chY" inputmode="numeric" aria-label="y"><span>°</span><b style="color:var(--tomato)">x =</b><input class="num" id="chX" inputmode="numeric" aria-label="x"><span>°</span><button class="btn primary" id="chChk">Check</button></div>`;
  $('chChk').onclick=()=>{const gy=parseInt($('chY').value,10),gx=parseInt($('chX').value,10);if(isNaN(gx))return;$('chY').disabled=$('chX').disabled=true;const oy=gy===y,ox=gx===x;
    api.done(oy&&ox,`y = ${y}°, x = ${x}°`,[...wy,...wx],(oy?4:0)+(ox?6:0))}}});

/* P6-8. Average Leveller — Average of a set of data */
addGame('p6-average',{level:'P6',strand:'stat',glyph:'x̄',title:'Average Leveller',topic:'Average: total value ÷ number of data',
 how:'Move blocks between towers until they are level: that height is the average. Later rounds use total = average × number.',rounds:8,
 round(api,r){const type=['level','level','total','missing','level','new','missing','word'][r];
  const ans1=(q,ans,u,work)=>{api.q(`<p class="qt">${q}</p>`);api.body.innerHTML=`<div class="row"><input class="num" id="avIn" inputmode="decimal" aria-label="Answer"><span>${u}</span><button class="btn primary" id="avChk">Check</button></div>`;
    $('avChk').onclick=()=>{const v=parseFloat($('avIn').value);if(isNaN(v))return;$('avIn').disabled=true;api.done(v===ans,`The answer is ${ans} ${u}.`,work)}};
  if(type==='level'){const n=R(3,5),m=R(3,7);let h;do{h=Array.from({length:n},()=>R(1,10));const s=h.reduce((a,b)=>a+b,0);const d=n*m-s;h[R(0,n-1)]+=d}while(h.some(v=>v<1||v>11)||new Set(h).size<2);
    const who=shuffle(['Ali','Bala','Chen','Dina','Ema']).slice(0,n),orig=[...h];let sel=null,moves=0;
    api.q(`<p class="qt">These towers show how many stamps each child has. Move blocks to make all towers the same height. What is the average number of stamps?</p><p class="qs">Tap a tower to pick up its top block, then tap another tower to drop it.</p>`);
    api.body.innerHTML=`<div class="towers" id="avT"></div><div class="row"><span class="pill" id="avM">Moves: 0</span><b>Average =</b><input class="num" id="avIn" inputmode="numeric" aria-label="Average"><button class="btn primary" id="avChk">Check</button></div>`;
    const draw=()=>{$('avT').innerHTML=h.map((v,i)=>`<button class="tower ${sel===i?'sel':''}" data-i="${i}" aria-label="${who[i]}: ${v}"><span class="tv">${v}</span>${Array.from({length:v},(_,k)=>`<i style="background:${k<m?'#7fb3ff':'#ffb38a'}"></i>`).join('')}<b>${who[i]}</b></button>`).join('');
      $('avT').querySelectorAll('.tower').forEach(t=>t.onclick=()=>{if(api.answered)return;const i=+t.dataset.i;if(sel===null){if(h[i]>0){sel=i;sfx.tap()}}else{if(i!==sel){h[sel]--;h[i]++;moves++;sfx.pop()}sel=null}
        $('avM').textContent=`Moves: ${moves}${h.every(v=>v===h[0])?' · Level!':''}`;draw()})};draw();
    $('avChk').onclick=()=>{const v=parseFloat($('avIn').value);if(isNaN(v))return;$('avIn').disabled=true;const tot=n*m;
      api.done(v===m,`The average is ${m} stamps.`,[`Total = ${orig.join(' + ')} = ${tot} stamps`,`Average = total ÷ number of children = ${tot} ÷ ${n} = <b>${m}</b>`,'Levelling the towers shares the total out equally, which is exactly what an average does.'])};return}
  if(type==='total'){const n=R(4,8),m=R(8,25);ans1(`The average height of ${n} plants is ${m} cm. What is the total height of the plants?`,n*m,'cm',[`Total = average × number = ${m} × ${n} = <b>${n*m} cm</b>`]);return}
  if(type==='missing'){const n=R(4,6),m=R(10,30);let vals;do{vals=Array.from({length:n-1},()=>m+R(-8,8))}while(n*m-vals.reduce((a,b)=>a+b,0)<1);const last=n*m-vals.reduce((a,b)=>a+b,0);
    ans1(`The average of ${n} numbers is ${m}. ${n-1} of them are ${vals.join(', ')}. What is the missing number?`,last,'',
      [`Total of all ${n} numbers = ${m} × ${n} = ${n*m}`,`Total of the known numbers = ${vals.join(' + ')} = ${vals.reduce((a,b)=>a+b,0)}`,`Missing number = ${n*m} − ${vals.reduce((a,b)=>a+b,0)} = <b>${last}</b>`]);return}
  if(type==='new'){const n=R(3,6),m=R(35,45),m2=m+R(1,3)*(Math.random()<.7?1:-1),ans=(n+1)*m2-n*m;
    ans1(`The average mass of ${n} boys is ${m} kg. When Ali joins them, the average mass becomes ${m2} kg. What is Ali's mass?`,ans,'kg',
      [`Total before = ${m} × ${n} = ${n*m} kg`,`Total after = ${m2} × ${n+1} = ${(n+1)*m2} kg`,`Ali's mass = ${(n+1)*m2} − ${n*m} = <b>${ans} kg</b>`]);return}
  const s=[R(60,90),R(60,90),R(60,90)],tgt=R(72,85),need=4*tgt-s.reduce((a,b)=>a+b,0);if(need>100||need<40)return this.round(api,r);
  ans1(`Siti scored ${s.join(', ')} in three tests. What must she score in the fourth test to get an average of ${tgt} marks?`,need,'marks',
    [`Total needed for 4 tests = ${tgt} × 4 = ${4*tgt}`,`Total so far = ${s.join(' + ')} = ${s.reduce((a,b)=>a+b,0)}`,`Fourth test = ${4*tgt} − ${s.reduce((a,b)=>a+b,0)} = <b>${need}</b>`])}});
