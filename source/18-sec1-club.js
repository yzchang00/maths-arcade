/* ---------- Sec 1 · Club Prime: the story continues inside the Primes Only club ----------
   Game 1 "Club Prime: Split to Get In" (prime factorisation): composite numbers can only enter by splitting into their
   prime members. Pupils build factor trees; every prime that pops out walks into the club.
   Game 2 "Club Prime: Party Tables" (HCF and LCM): two teams share a table. Matching primes pair up on shared seats and are
   lined up in columns (the Sec 1 method; no Venn diagrams, since sets come later): HCF = one from each shared column;
   LCM = one from every column.
   Secret bonus (Solo, 80%+): the VIP room of the Mastermind, the special 2 (the only even prime).
   Replaces Prime Factory. */
document.head.insertAdjacentHTML('beforeend',`<style>
.cpban{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:2px 10px;text-align:center;background:radial-gradient(circle at 50% 0,#4b3aa8,#1c1640 75%);color:#ffd257;border:3px solid #16233a;border-radius:16px;padding:8px 12px;font:700 clamp(1rem,4vw,1.35rem) var(--display);letter-spacing:.12em;text-shadow:0 0 8px #ffb81f;max-width:760px;margin:0 auto 4px;width:100%;box-sizing:border-box}
.cpban small{display:block;flex-basis:100%;font:700 12px var(--body);letter-spacing:.04em;color:#fff;text-shadow:none;opacity:.85}
.ftwrap{display:grid;gap:10px;justify-items:center;margin:0 auto;background:var(--surface);color:var(--ink);border:2.5px solid var(--ink);border-radius:16px;padding:12px 8px;max-width:760px;width:100%;box-sizing:border-box;overflow-x:auto}
.ftn{display:flex;flex-direction:column;align-items:center;min-width:0}
.ftk{display:flex;gap:clamp(4px,2vw,14px);padding-top:18px;position:relative;align-items:flex-start}
.ftk:before{content:'';position:absolute;top:4px;left:calc(25% - 2px);right:calc(25% - 2px);height:14px;border:2.5px solid var(--ink);border-bottom:0;border-radius:10px 10px 0 0}
.ftv{min-width:42px;padding:6px 10px;border-radius:12px;border:2.5px solid var(--ink);background:#fff;color:#16233a;font:700 1.15rem var(--display);cursor:pointer;box-shadow:2px 2px 0 var(--ink)}
.ftv.cp{background:#e7f0ff;animation:ftpulse 1.4s ease-in-out infinite}.ftv.sp{background:#eef0f4;color:#5b6475;cursor:default;box-shadow:none}
.ftv.pr{background:#ffd257;border-color:#b07d00;cursor:pointer}.ftv.pr:after{content:' ✨'}.ftv.sel{outline:4px solid #5f50ec}
@keyframes ftpulse{50%{box-shadow:2px 2px 0 var(--ink),0 0 0 5px #5f50ec44}}
.ftpanel{display:grid;gap:8px;justify-items:center;text-align:center}.ftpanel .row{justify-content:center}.ftpanel .btn{min-width:84px}
.ftclub{display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;font:800 14px var(--body)}
.ftclub i{font-style:normal;background:#ffd257;color:#16233a;border:2px solid #b07d00;border-radius:999px;padding:2px 10px;font:700 1rem var(--display);animation:ftin .5s cubic-bezier(.3,1.5,.5,1) both}
@keyframes ftin{from{transform:translateY(10px) scale(.5);opacity:0}}
.ftmsg{font:800 14px var(--body);min-height:1.2em}
.vnwrap{display:grid;gap:8px;justify-items:center;width:100%}
.pt{display:grid;gap:8px;width:100%;max-width:640px}.ptrow{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;gap:10px;border:2.5px solid var(--ink);border-radius:14px;padding:8px 10px;background:var(--surface);color:var(--ink)}
.ptrow.a{border-color:#5f50ec;background:#5f50ec14}.ptrow.b{border-color:#ff8a3d;background:#ff8a3d14}.ptrow.m{border-style:dashed;border-color:#b07d00;background:#ffd25722;min-height:64px}
.ptlab{font:800 13px var(--body);white-space:nowrap}.ptchips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.ptempty{font:600 13px var(--body);opacity:.6}
.vnc.pair{flex-direction:column;gap:0;padding:2px 8px;border-radius:12px}.vnc.pair>span{display:inline-flex;align-items:center;gap:3px}
.ptcols{background:var(--surface);color:var(--ink);border:2.5px solid var(--ink);border-radius:14px;padding:8px 12px;max-width:640px;width:100%;box-sizing:border-box;overflow-x:auto}
.ptcols table{border-collapse:collapse;font:700 1.1rem var(--display);margin:0 auto}.ptcols th{padding:2px 8px;text-align:right;white-space:nowrap}.ptcols td{min-width:26px;height:30px;text-align:center}
.ptcols td.sh{background:#ffd257;color:#16233a;border-radius:6px}.ptcols td.x{min-width:14px;opacity:.6;font-size:.9rem}.ptkey{margin:4px 0 0;font:600 13px var(--body);text-align:center}.ptkey .sh{background:#ffd257;color:#16233a;border-radius:6px;padding:0 6px;font-weight:800}
.vn{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.75fr) minmax(0,1fr);width:100%;max-width:640px;min-height:190px;color:#16233a}
.vn .vbg{position:absolute;top:2%;bottom:2%;width:66%;border-radius:50%;z-index:0}.vn .vbg.a{left:1%;background:#5f50ec22;border:2.5px solid #5f50ec}.vn .vbg.b{right:1%;background:#ff8a3d22;border:2.5px solid #ff8a3d}
.vncol{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px}
.vncol h4{margin:0;font:800 12px var(--body);text-align:center;color:#16233a}.vnchips{display:flex;flex-wrap:wrap;gap:5px;justify-content:center;align-content:center;flex:1}
.vnc{min-width:36px;padding:4px 8px;border-radius:999px;border:2.5px solid #16233a;background:#fff;color:#16233a;font:700 1.05rem var(--display);cursor:pointer}
.vnc.sel{outline:4px solid #5f50ec;background:#e9e6ff}.vnc.mid{background:#ffd257;border-color:#b07d00}
.vnc:disabled{cursor:default}
.cpscene{position:relative;height:230px;max-width:760px;margin:0 auto;width:100%;border:3px solid #16233a;border-radius:18px;overflow:hidden;--g:58px}
@media (max-width:600px){.cpscene{height:190px;--g:44px}}
.cpscene.alley{background:repeating-linear-gradient(0deg,#00000022 0 2px,transparent 2px 22px),repeating-linear-gradient(90deg,#00000018 0 2px,transparent 2px 44px),linear-gradient(#6b3b33 0 70%,#3b3247 70%)}
.cpscene.club{background:radial-gradient(circle at 50% -10%,#6a4bd8,#1c1640 70%)}
.cpfloor{position:absolute;left:0;right:0;bottom:0;height:30%;background:repeating-conic-gradient(#2a2160 0 25%,#3e2f8c 0 50%) 0 0/36px 36px;opacity:.9}
.cpball{position:absolute;left:50%;top:-4px;transform:translateX(-50%);font-size:clamp(30px,7vw,44px);animation:cpspin 3s linear infinite;filter:drop-shadow(0 0 10px #fff8)}
.cpball:before{content:'';position:absolute;left:50%;top:-40px;width:2px;height:40px;background:#ccc}
@keyframes cpspin{to{transform:translateX(-50%) rotate(360deg)}}
.cpbeam{position:absolute;top:0;width:34%;height:120%;opacity:.28;mix-blend-mode:screen;transform-origin:50% 0;animation:cpbeam 4s ease-in-out infinite alternate}
.cpbeam.b1{left:20%;background:linear-gradient(#ff5fa2,transparent 80%);clip-path:polygon(45% 0,55% 0,100% 100%,0 100%)}
.cpbeam.b2{left:46%;background:linear-gradient(#45d08a,transparent 80%);clip-path:polygon(45% 0,55% 0,100% 100%,0 100%);animation-delay:-2s}
@keyframes cpbeam{from{transform:rotate(-22deg)}to{transform:rotate(22deg)}}
.cpdj{position:absolute;left:3%;bottom:18%;width:calc(var(--g)*1.25);z-index:2}.cpdj svg{width:100%;height:auto}
.cpdj:after{content:'🎧 DJ Qubi';position:absolute;left:50%;transform:translateX(-50%);bottom:-18px;white-space:nowrap;font:800 11px var(--body);color:#ffd257}
.cpbooth{position:absolute;left:1%;bottom:8%;width:calc(var(--g)*1.6);height:24%;background:#16233a;border:3px solid #d4af37;border-radius:10px 10px 0 0;z-index:3}
.cpguy{position:absolute;bottom:10%;width:var(--g);transition:left .8s ease,bottom .5s ease,opacity .5s,transform .4s;z-index:4}
.cpguy svg{width:100%;height:auto;display:block}
.cpguy .m,.cpguy .e2,.cpguy .tear,.vnav .m,.vnav .e2,.vnav .tear{display:none}.cpguy .m0,.vnav .m0{display:inline}
.cpguy.gold .m0,.cpguy.happy .m0,.vnc.mid .m0{display:none}.cpguy.gold .m1,.cpguy.happy .m1,.vnc.mid .m1{display:inline}
.cpguy.sad .m0{display:none}.cpguy.sad .m2,.cpguy.sad .tear{display:inline}
.cpguy.bob{animation:cpbob 1.1s ease-in-out infinite alternate}.cpguy.bob:nth-of-type(odd){animation-delay:-.55s}
@keyframes cpbob{from{transform:translateY(0)}to{transform:translateY(-6px)}}
.cpguy.tap{cursor:pointer}.cpguy.tap:hover{filter:brightness(1.1) drop-shadow(0 0 6px #fff)}
.cpguy.shake{animation:cpshake .45s ease}@keyframes cpshake{25%{transform:translateX(-6px) rotate(-6deg)}75%{transform:translateX(6px) rotate(6deg)}}
.cpguy.stopped{transform:translateY(-4px) scale(1.08)}.cpmgr.block{animation:pbjump .4s ease}
.cphint{text-align:center;font:800 13px var(--body);color:#ffd257;position:absolute;left:0;right:0;bottom:3px;z-index:6;text-shadow:0 1px 2px #000}.cpguy .cpnum{position:absolute;left:50%;top:79%;transform:translate(-50%,-50%);background:#fff;color:#16233a;border:2px solid #16233a;border-radius:999px;padding:0 6px;font:700 clamp(12px,3vw,16px)/1.3 var(--display);white-space:nowrap}
.cpguy.gold .cpnum{background:#ffd257}.cpguy.dance{animation:cpdance .6s ease-in-out infinite alternate}.cpguy.dance:nth-child(even){animation-delay:-.3s}
@keyframes cpdance{from{transform:translateY(0) rotate(-6deg)}to{transform:translateY(-10px) rotate(6deg)}}
.cpguy.jump{animation:pbjump .45s ease 2}.cpguy.pop{transform:scale(1.3);opacity:0}
.cpdoor{position:absolute;right:4%;bottom:28%;width:15%;min-width:60px;height:52%;background:#0e0b1f;border:4px solid #d4af37;border-bottom:0;border-radius:36px 36px 0 0;box-shadow:inset 0 0 20px #ffb81f55}
.cpdoor:before{content:'CLUB PRIME';position:absolute;left:50%;top:-30px;transform:translateX(-50%);white-space:nowrap;font:700 clamp(11px,2.6vw,14px) var(--display);letter-spacing:.08em;color:#ffd257;text-shadow:0 0 6px #ffb81f;border:2px solid #ffd257;border-radius:8px;padding:0 6px;background:#1c1640}
.cpdoor:after{content:'back door';position:absolute;left:50%;bottom:4px;transform:translateX(-50%);font:800 10px var(--body);color:#ffd25799;white-space:nowrap}
.cpmgr{position:absolute;right:21%;bottom:26%;width:calc(var(--g)*1.05);z-index:3}.cpmgr svg{width:100%;height:auto}
.cpsay{position:absolute;left:3%;top:5%;max-width:62%;background:#fff;color:#16233a;border:2.5px solid #16233a;border-radius:12px;padding:4px 10px;font:800 13px/1.3 var(--body);box-shadow:3px 3px 0 #16233a;z-index:6;opacity:0;transition:.2s}.cpsay.on{opacity:1}
.cpart{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;background:var(--surface);color:var(--ink);border:2.5px solid var(--ink);border-radius:16px;padding:10px 14px;max-width:760px;margin:0 auto;width:100%;box-sizing:border-box;font:800 15px var(--body)}
.cpart .it{display:grid;justify-items:center;gap:2px;min-width:90px}.cpart .em{font-size:34px;line-height:1}.cpart .em.blink{animation:cpblink var(--p) steps(1) infinite}
@keyframes cpblink{0%{filter:none;transform:scale(1.25);text-shadow:0 0 18px #ffd257}12%{filter:grayscale(1) brightness(.7);transform:none;text-shadow:none}}
.cpart .bar{height:16px;border:2px solid #16233a;border-radius:8px}
.cpart .vs{font-size:22px;opacity:.6}
.vnc{display:inline-flex;align-items:center;gap:3px}.vnc .vnav{width:22px;display:inline-block}.vnc .vnav svg{width:100%;height:auto;display:block}
.mm2{display:flex;align-items:center;gap:12px;background:radial-gradient(circle at 30% 20%,#3a2a6e,#120d29 80%);border:3px solid #d4af37;border-radius:18px;padding:10px 14px;color:#fff;max-width:760px;width:100%;box-sizing:border-box}
.mm2 svg{width:min(120px,28vw);height:auto;flex:none}.mm2 p{margin:0;font:600 15px/1.45 var(--body)}.mm2 b{color:#ffd257}
</style>`);
const supU=e=>e===1?'':String(e).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join(''),pfsU=f=>Object.keys(f).filter(p=>f[p]>0).sort((a,b)=>a-b).map(p=>`${p}${supU(f[p])}`).join(' × ')||'1';
const pfArr=n=>{const a=[];for(let p=2;n>1;p++)while(n%p===0){a.push(p);n/=p}return a};
const fMin=(fs)=>{const o={};Object.keys(fs[0]).forEach(p=>{const e=Math.min(...fs.map(f=>f[p]||0));if(e>0)o[p]=e});return o};
const fMax=(fs)=>{const o={};fs.forEach(f=>Object.keys(f).forEach(p=>{o[p]=Math.max(o[p]||0,f[p])}));return o};
const fSum=(fs)=>{const o={};fs.forEach(f=>Object.keys(f).forEach(p=>{o[p]=(o[p]||0)+f[p]}));return o};
const cpBan=(t,s)=>`<div class="cpban">🪩 ${t} 🪩${s?`<small>${s}</small>`:''}</div>`;
const MM2=`<svg viewBox="0 0 120 150" aria-hidden="true"><path d="M20 70 Q60 40 100 70 L108 140 L12 140Z" fill="#7b2cbf" stroke="#16233a" stroke-width="3"/>
 <path d="M38 22 L44 2 L52 16 L60 0 L68 16 L76 2 L82 22Z" fill="#ffd257" stroke="#16233a" stroke-width="3"/><circle cx="60" cy="12" r="3" fill="#ef5240"/>
 <text x="60" y="128" text-anchor="middle" font-family="Fredoka,Arial Rounded MT Bold,sans-serif" font-weight="700" font-size="128" fill="#ffd257" stroke="#16233a" stroke-width="5" paint-order="stroke">2</text>
 <circle cx="48" cy="52" r="6" fill="#fff" stroke="#16233a" stroke-width="2"/><circle cx="72" cy="52" r="6" fill="#fff" stroke="#16233a" stroke-width="2"/><circle cx="49" cy="53" r="3" fill="#16233a"/><circle cx="73" cy="53" r="3" fill="#16233a"/>
 <path d="M42 42 l12 4 M78 42 l-12 4" stroke="#16233a" stroke-width="3" stroke-linecap="round"/></svg>`;
const cpCol=n=>isPrime(n)?'#ffd257':['#6aa5ff','#ff8a3d','#e0559a','#45d08a','#5f50ec','#3aa0ff'][Math.abs(n)%6];
const cpGuy=(n,o={})=>`<div class="cpguy${isPrime(n)?' gold':''}${o.cls?' '+o.cls:''}" style="left:${o.left||0}%${o.z?';z-index:'+o.z:''}"${o.id?` id="${o.id}"`:''}>${pbGuySvg(cpCol(n),isPrime(n)?3:0)}<span class="cpnum">${n}</span></div>`;
const QB=()=>QUBI.replace('class="qubi"','class="qubi idle"');
/* the dance floor inside the club: DJ Qubi, a disco ball, light beams and dancing prime members */
function cpClub(dancers){const ds=dancers.slice(0,6),w=ds.length;return `<div class="cpscene club"><div class="cpbeam b1"></div><div class="cpbeam b2"></div><div class="cpball">🪩</div><div class="cpfloor"></div><div class="cpbooth"></div><div class="cpdj">${QB()}</div>
  ${ds.map((n,i)=>cpGuy(n,{left:28+i*(62/Math.max(w,1)),cls:'dance'})).join('')}</div>`}
/* the back-door alley for Split to Get In. The guests are the members of the factor tree that are not in the club yet */
function cpAlley(id){return `<div class="cpscene alley" id="${id}"><div class="cpdoor"></div><div class="cpmgr">${QB()}</div><div class="cpsay" id="${id}S"></div></div>`}
function cpAlleySync(id){const sc=$(id),map=new Map(),slots=n=>{const nar=innerWidth<600,lo=2,hi=nar?52:58;return Array.from({length:n},(_,i)=>n===1?(lo+hi)/2-8:lo+i*(hi-lo)/(n-1))};
  const say=t=>{const s=$(id+'S');if(s){s.innerHTML=t;s.className='cpsay on'}};
  return {say,sync(leaves,first){if(!sc)return;const ids=new Set(leaves.map(x=>x.id)),gone=[...map.keys()].filter(k=>!ids.has(k));let from=null;
    gone.forEach(k=>{const e=map.get(k);from=parseFloat(e.style.left);e.classList.add('pop');setTimeout(()=>e.remove(),450);map.delete(k)});
    const comps=leaves.filter(x=>!isPrime(x.v)),pos=slots(comps.length);let inNow=[];
    leaves.forEach(x=>{if(map.has(x.id))return;const d=document.createElement('div');d.innerHTML=cpGuy(x.v,{left:from==null?-15:from});const g=d.firstChild;sc.appendChild(g);map.set(x.id,g);if(isPrime(x.v))inNow.push(g)});
    requestAnimationFrame(()=>requestAnimationFrame(()=>{comps.forEach((x,i)=>{const g=map.get(x.id);if(g)g.style.left=pos[i]+'%'});
      inNow.forEach((g,i)=>{g.classList.add('jump');setTimeout(()=>{g.style.left='84%';g.style.opacity='0'},500+i*180)})}));
    if(inNow.length&&!first)say(inNow.length>1?`${inNow.map(g=>g.querySelector('.cpnum').textContent).join(' and ')} are prime: straight in! ✨`:`${inNow[0].querySelector('.cpnum').textContent} is prime: straight in! ✨`);
    if(!comps.length)setTimeout(()=>say('Every member is prime. Welcome to Club Prime! 🎉'),600)}}}
const mmRoom=t=>`<div class="mm2">${MM2}<p>${t}</p></div>`;

/* ---- factor tree: tap a composite member to split it; primes walk into the club ---- */
function ftPairs(v){const ps=[];for(let a=2;a*a<=v;a++)if(v%a===0)ps.push([a,v/a]);
  if(ps.length<=5)return ps;const keep=[ps[0],ps[ps.length-1]];shuffle(ps.slice(1,-1)).slice(0,3).forEach(p=>keep.push(p));return keep.sort((x,y)=>x[0]-y[0])}
function ftTree(api,n,done,o={}){let uid=0;const root={v:n,id:uid++,k:null},nodes={},club=[];nodes[root.id]=root;let sel=null;const prefix=o.prefix||'ft';
  api.body.insertAdjacentHTML('beforeend',`<div class="ftwrap" id="${prefix}W"><div id="${prefix}T"></div><div class="ftclub" id="${prefix}C"><span>Inside the club:</span></div><div class="ftpanel" id="${prefix}P"></div><div class="ftmsg" id="${prefix}M" role="status"></div></div>`);
  const leaves=()=>{const out=[];const walk=x=>x.k?x.k.forEach(walk):out.push(x);walk(root);return out};
  const draw=()=>{const d=x=>`<div class="ftn"><button class="ftv ${x.k?'sp':isPrime(x.v)?'pr':'cp'}${sel===x.id?' sel':''}" data-id="${x.id}" ${x.k?'disabled':''} aria-label="${x.v}${x.k?' (split)':isPrime(x.v)?' (prime)':' (tap to split)'}">${x.v}</button>${x.k?`<div class="ftk">${d(x.k[0])}${d(x.k[1])}</div>`:''}</div>`;
    if(o.scene)o.scene.sync(leafList(),!draw.done);draw.done=1;$(prefix+'T').innerHTML=d(root);$(prefix+'T').querySelectorAll('.ftv:not([disabled])').forEach(b=>b.onclick=()=>tap(+b.dataset.id));
    const cm=leaves().filter(x=>!isPrime(x.v));
    if(!cm.length){$(prefix+'P').innerHTML='<b style="color:var(--teal)">✓ Every member is prime. They all walk in!</b>';done&&done(pfArr(n));done=null;return}
    if(sel===null||!nodes[sel]||nodes[sel].k||isPrime(nodes[sel].v))$(prefix+'P').innerHTML=`<span>Tap a <b>blue</b> member (not prime yet) to split it.</span>`};
  const leafList=()=>leaves().map(x=>({id:x.id,v:x.v}));
  const addClub=v=>{club.push(v);$(prefix+'C').insertAdjacentHTML('beforeend',`<i>${v}</i>`)};
  const tap=id=>{const x=nodes[id];sfx.tap();$(prefix+'M').textContent='';
    if(isPrime(x.v)){$(prefix+'M').innerHTML=`<span style="color:#b07d00">${x.v} is prime already, so it walks straight into the club. ✨</span>`;return}
    sel=id;draw();const pairs=ftPairs(x.v);
    $(prefix+'P').innerHTML=`<span>Split <b>${x.v}</b> into two factors:</span><div class="row" style="gap:6px;flex-wrap:wrap">${[[1,x.v],...pairs].map(([a,b])=>`<button class="btn" data-a="${a}" data-b="${b}">${a} × ${b}</button>`).join('')}</div>`;
    $(prefix+'P').querySelectorAll('[data-a]').forEach(bt=>bt.onclick=()=>{const a=+bt.dataset.a,b=+bt.dataset.b;
      if(a===1){$(prefix+'M').innerHTML='<span style="color:#c2410c">1 is not prime, and 1 × '+x.v+' leaves '+x.v+' just as it was. Pick another split.</span>';sfx.no();return}
      x.k=[{v:a,id:uid++,k:null},{v:b,id:uid++,k:null}];x.k.forEach(c=>{nodes[c.id]=c;if(isPrime(c.v))addClub(c.v)});sel=null;sfx.tap();draw()})};
  if(o.auto){const grow=x=>{if(isPrime(x.v))return addClub(x.v);const p=pfArr(x.v)[0];x.k=[{v:p,id:uid++,k:null},{v:x.v/p,id:uid++,k:null}];x.k.forEach(c=>{nodes[c.id]=c;grow(c)})};grow(root)}
  draw()}
/* wrong ways to write a prime factorisation, each with the reason it is wrong */
function pfWrongs(f){const n=fromF(f),ps=Object.keys(f).map(Number).sort((a,b)=>a-b),out=[];
  const big=ps.find(p=>f[p]>1);
  if(big){const g={...f};g[big]--;out.push({t:pfsU(g),why:`That multiplies to ${fromF(g)}, not ${n}. A member is missing: ${big} appears ${f[big]} times.`});
    const h={...f};delete h[big];const c=big**f[big];out.push({t:[`${c}`,...Object.keys(h).sort((a,b)=>a-b).map(p=>`${p}${supU(h[p])}`)].join(' × '),why:`${c} is not prime. Split it into ${Array(f[big]).fill(big).join(' × ')}.`})}
  out.push({t:pfsU(f)+' × 1',why:'1 is not prime, so it is never part of a prime factorisation.'});
  const s={};ps.forEach(p=>s[p]=1);if(Object.values(f).some(e=>e>1))out.push({t:ps.join(' × '),why:`That is only ${fromF(s)}. Each prime must appear as many times as it divides ${n}.`});
  const two=ps.find(p=>f[p]>1);if(two){const w={...f};w[two]=f[two]+1;out.push({t:pfsU(w),why:`That multiplies to ${fromF(w)}, which is too big.`})}
  return out}
function pfChoices(f){return [{t:pfsU(f),ok:1},...shuffle(pfWrongs(f)).slice(0,3)]}
addGame('s1-split',{level:'Sec 1',sec:'s1',strand:'num',glyph:'🌳',title:'Club Prime: Split to Get In',topic:'Prime factorisation and index notation',
 how:'Composite numbers can only enter Club Prime by splitting into their prime members. Build factor trees and write numbers as products of primes.',rounds:8,
 round(api,r){const T=TIER(),type=['tree','stop','one','index','build','same','tree','tree'][r],K=ctx.keep=ctx.keep||{};
  if(type==='tree'){const f=pfGen(r===7?Math.min(2,T+1):T),n=fromF(f);
    api.q(`<p class="qt"><b>${n}</b> isn't prime, so the bouncer turned it away. But its <b>prime members</b> can go in! Split ${n} until every member is prime.</p>`);
    api.body.insertAdjacentHTML('beforeend',cpAlley('cpA'));const scn=cpAlleySync('cpA');scn.say(`"I'm ${n}. I'm not prime… but my members are!"`);
    ftTree(api,n,()=>{K.ft=1;api.body.insertAdjacentHTML('beforeend',`<p class="asklab"><b>Step 2:</b> write ${n} as a product of its prime members, in index notation.</p>`);
      secChoice(api,'cpI',pfChoices(f),[`${n} = ${pfArr(n).join(' × ')}`,`= ${pfs(f)}`],`Yes! ${n} = ${pfs(f)}.`)},{auto:!!K.ft,scene:scn});return}
  if(type==='stop'){let f,n,c,rest;for(let k=0;k<300;k++){f=pfGen(T);n=fromF(f);const cs=[];for(let d=4;d<n;d++)if(n%d===0&&!isPrime(d)&&n/d>1)cs.push(d);if(cs.length){c=pick(cs.filter(d=>d<=50).length?cs.filter(d=>d<=50):cs);rest=n/c;break}}
    const lv=[...pfArr(rest),c];
    api.q(`<p class="qt">Qubi split <b>${n}</b> and shouted "Done! Everyone can go in!" His members are: <b>${lv.join(', ')}</b>.</p><p class="qs">${n} = ${lv.join(' × ')}</p>`);
    const nar=innerWidth<600,xs=lv.map((v,i)=>2+i*((nar?50:56)/Math.max(lv.length-1,1)));
    api.body.insertAdjacentHTML('beforeend',`<div class="cpscene alley" id="cpSt"><div class="cpdoor"></div><div class="cpmgr" id="cpStQ">${QB()}</div><div class="cpsay on" id="cpStS">"All done! In you go, everyone!"</div>${lv.map((v,i)=>`<div class="cpguy tap" data-v="${v}" data-x="${xs[i]}" style="left:-18%">${pbGuySvg(['#6aa5ff','#ff8a3d','#e0559a','#45d08a','#5f50ec'][i%5])}<span class="cpnum">${v}</span></div>`).join('')}<div class="cphint">👆 Tap the guest who must be stopped</div></div>`);
    const G=[...document.querySelectorAll('#cpSt .cpguy')],stS=t=>{$('cpStS').innerHTML=t};
    G.forEach((g,i)=>api.later(()=>{g.style.left=g.dataset.x+'%';api.later(()=>g.classList.add('bob'),850)},120+i*220));
    G.forEach(g=>g.onclick=()=>{const b=[...($('cpSP')||{children:[]}).children].find(x=>x.dataset.v===g.dataset.v&&!x.disabled);if(b)b.click()});
    const react=v=>{const g=G.find(x=>x.dataset.v===v);if(!g)return;
      if(v===String(c)){/* right: Qubi blocks it, it splits into primes, then everyone walks in */
        G.forEach(x=>x.classList.remove('tap'));document.querySelector('#cpSt .cphint').remove();$('cpStQ').classList.add('block');stS(`"Stop right there, <b>${c}</b>! You're not prime: ${c} = ${pfArr(c).join(' × ')}."`);g.classList.remove('bob');g.classList.add('sad','stopped');
        api.later(()=>{const x=parseFloat(g.style.left);g.classList.add('pop');pfArr(c).forEach((p,k)=>{const d=document.createElement('div');d.innerHTML=cpGuy(p,{left:x+k*7});const ng=d.firstChild;ng.classList.add('jump');$('cpSt').appendChild(ng);G.push(ng)});
          stS(`"That's better: ${pbList([...new Set(pfArr(c))])} ${new Set(pfArr(c)).size>1?'are':'is'} prime. Now everyone can go in!"`);
          api.later(()=>{G.filter(x=>!x.classList.contains('pop')).forEach((x,k)=>api.later(()=>{x.classList.remove('bob','sad');x.classList.add('happy','jump');api.later(()=>{x.style.left='84%';x.style.opacity='0'},350)},k*200))},900)},900)}
      else{g.classList.remove('bob');void g.offsetWidth;g.classList.add('shake','sad');stS(`"Hey! I'm <b>${v}</b> and I'm prime! My only factors are 1 and ${v}."`);api.later(()=>{g.classList.remove('shake','sad');g.classList.add('bob')},900)}};
    api.body.addEventListener('click',e=>{const b=e.target.closest('#cpSP button');if(b)react(b.dataset.v)});
    stepPick(api,{id:'cpS',label:'<b>Step 1:</b> which member is <b>not</b> prime, so the bouncer will stop it?',options:[...new Set(lv)].map(String),right:String(c),pen:'cpS2',
      hint:v=>`${v} is prime: its only factors are 1 and ${v}. Look for a member that can still be split.`,reveal:()=>`${c} = ${pfArr(c).join(' × ')}, so it is not prime. Tap ${c} to carry on.`,
      okMsg:`<p class="askok">Yes! ${c} = ${pfArr(c).join(' × ')}, so it still needs splitting.</p><p class="asklab"><b>Step 2:</b> so what is ${n} as a product of primes?</p>`,
      then:()=>secChoice(api,'cpS2',pfChoices(f),[`${c} = ${pfArr(c).join(' × ')}`,`${n} = ${pfArr(n).join(' × ')} = ${pfs(f)}`],`Right: ${n} = ${pfs(f)}.`)});return}
  if(type==='one'){const f=pfGen(T),n=fromF(f);
    api.q(cpClub(pfArr(n))+`<p class="qt">📋 Guest list check! The list must show <b>${n}</b> as a product of <b>prime</b> numbers only. Which entry is correct?</p>`);
    secChoice(api,'cpO',pfChoices(f),[`${n} = ${pfArr(n).join(' × ')} = ${pfs(f)}`,'Every number in a prime factorisation must be prime, and 1 is not prime.'],`Correct: ${n} = ${pfs(f)}.`);return}
  if(type==='index'){const f=pfGen(T),n=fromF(f),wrong=Object.keys(f).reduce((a,p)=>a*(f[p]>1?p*f[p]:+p),1),add=Object.keys(f).reduce((a,p)=>a+(+p)*f[p],0);
    api.q(`<p class="qt">A member's card is written in index notation. Which number is it?</p>`);
    api.body.insertAdjacentHTML('beforeend',`<div class="cpscene club"><div class="cpbeam b1"></div><div class="cpball">🪩</div><div class="cpfloor"></div><div class="cpbooth"></div><div class="cpdj">${QB()}</div><div class="pbcard on" style="left:58%;top:16%;transform:translateX(-50%) rotate(-3deg)"><span>🪪 Membership card</span><b style="font-size:clamp(1.2rem,5vw,2.2rem);white-space:nowrap">${pfs(f)}</b></div></div>`);
    askOne(api,{id:'cpX',w:6,right:n,traps:[[wrong,`Careful: ${Object.keys(f).filter(p=>f[p]>1).map(p=>`${p}${sup(f[p])} means ${Array(f[p]).fill(p).join(' × ')}`).join(', ')}, not ${Object.keys(f).filter(p=>f[p]>1).map(p=>`${p} × ${f[p]}`).join(' or ')}.`],[add,'Members of a factorisation are multiplied, not added.']].filter(([x])=>x!==n),
      hint:'Write out each power as repeated multiplication, then multiply everything.',ok:`${pfs(f)} = ${pfArr(n).join(' × ')} = ${n}.`,bad:`${pfs(f)} = ${pfArr(n).join(' × ')} = ${n}.`,work:[`${pfs(f)} = ${pfArr(n).join(' × ')} = ${n}`]});return}
  if(type==='build'){const f=pfGen(T),n=fromF(f),a=shuffle(pfArr(n)),sum=a.reduce((x,y)=>x+y,0);
    api.q(cpClub(a)+`<p class="qt">These prime members walked in together: <b>${a.join(', ')}</b>. Which composite number did they come from?</p>`);
    askOne(api,{id:'cpB',w:6,right:n,traps:[[sum,'Members of a number are multiplied, not added.']],hint:'Multiply all the members together. Start with the small ones.',ok:`${a.slice().sort((x,y)=>x-y).join(' × ')} = ${n}.`,bad:`${a.slice().sort((x,y)=>x-y).join(' × ')} = ${n}.`,work:[`${pfs(f)} = ${n}`]});return}
  /* same: two different first splits end with the same primes */
  let f,n,p1,p2;for(let k=0;k<300;k++){f=pfGen(T);n=fromF(f);const ds=[];for(let d=2;d*d<=n;d++)if(n%d===0)ds.push(d);if(ds.length>=2){[p1,p2]=shuffle(ds).slice(0,2);break}}
  const tr=(a)=>`${n} = ${a} × ${n/a} → ${[...pfArr(a),...pfArr(n/a)].join(' × ')}`;
  api.q(cpClub(pfArr(n))+`<p class="qt">Two bouncers split <b>${n}</b> in different ways.</p><p class="qs">Bouncer A: ${tr(p1)}<br>Bouncer B: ${tr(p2)}</p>`);
  stepPick(api,{id:'cpM',keepOrder:true,label:'<b>Step 1:</b> do they end with the same prime members?',options:['Yes, the same primes','No, different primes'],right:'Yes, the same primes',pen:'cpM2',
    hint:()=>'',reveal:()=>'Sort both lists of primes: they match. Tap "Yes, the same primes" to carry on.',
    okMsg:`<p class="askok">Yes! However you split a number, you always end with the same primes. Every number has only <b>one</b> prime factorisation.</p><p class="asklab"><b>Step 2:</b> so ${n} =</p>`,
    then:()=>secChoice(api,'cpM2',pfChoices(f),[`Both trees give ${pfArr(n).join(' × ')} = ${pfs(f)}`],`Right: ${n} = ${pfs(f)}.`)})},
 bonus(api){const k=pick([3,4,5,6]),m=pick([1,3,5,7,9,15,25,45,49]),n=2**k*m,f=PF(n),sq=Object.values(f).every(e=>e%2===0);
  api.q(cpBan('THE VIP ROOM','Secret level')+mmRoom(`"So you found my room! I am <b>2</b>, the Mastermind: the only even prime. I am a member of <b>every</b> even number. Tell me: how many of me are hiding inside <b>${n}</b>?"`));
  askOne(api,{id:'mmK',w:4,right:k,traps:[[n/2,'That is half of '+n+'. The Mastermind wants to know how many 2s are in its prime factorisation.'],[k-1,'Keep halving: count every time you can divide by 2 exactly.']].filter(([x])=>x!==k&&x>0),
    hint:`Keep halving ${n} until you get an odd number. Count the halvings.`,
    then:()=>stepPick(api,{id:'mmSq',keepOrder:true,label:`<b>Step 2:</b> "${n} = ${pfs(f)}. Is ${n} a perfect square?"`,options:['Yes','No'],right:sq?'Yes':'No',
      hint:()=>'',reveal:()=>`${sq?'Every':'Not every'} prime appears an even number of times, so ${n} is ${sq?'':'not '}a perfect square. Tap ${sq?'Yes':'No'} to carry on.`,
      okMsg:'',then:()=>api.done(true,`"Impressive! ${n} = ${pfs(f)}, so there are ${k} of me. A number is a perfect square when every prime appears an even number of times${sq?`: ${n} = (${pfs(Object.fromEntries(Object.entries(f).map(([p,e])=>[p,e/2])))})²`:''}."`,[`${n} = ${pfs(f)}`,sq?`All powers even → ${n} = ${Math.round(Math.sqrt(n))}²`:'Not all powers are even → not a perfect square'])})})}});

/* ---- party tables: pair up shared primes, then line them up in columns ---- */
function vnGen(T,o={}){const P=T===0?[2,3,5]:T===1?[2,3,5,7]:[2,3,5,7,11],lim=[[12,90],[24,300],[60,900]][T];
  for(let k=0;k<800;k++){const mk=()=>{const f={};shuffle(P).slice(0,R(1,3)).forEach(p=>f[p]=R(1,p===2?(T?3:2):p===3?2:1));return f};const A=mk(),B=mk(),C=o.three?mk():null,all=C?[A,B,C]:[A,B];
    const ns=all.map(fromF),h=fromF(fMin(all));if(ns.some(x=>x<lim[0]||x>lim[1])||new Set(ns).size<ns.length)continue;
    if(o.coprime?h!==1:h===1)continue;if(!o.coprime&&ns.some(x=>x===h))continue;if(all.some(f=>pfArr(fromF(f)).length>6))continue;return all}
  return o.three?[{2:2,3:1},{2:1,3:2},{2:1,3:1,5:1}]:[{2:2,3:1,5:1},{2:3,3:2}]}
function vnTable(api,fa,fb,done,auto){const A=fromF(fa),B=fromF(fb);let left=pfArr(A).map((v,i)=>({v,i})),right=pfArr(B).map((v,i)=>({v,i})),mid=[],sel=null;
  api.body.insertAdjacentHTML('beforeend',`<div class="vnwrap"><div class="pt">
    <div class="ptrow a"><span class="ptlab">Team ${A}</span><div class="ptchips" id="vnL"></div></div>
    <div class="ptrow m"><span class="ptlab">🤝 Shared seats</span><div class="ptchips" id="vnM"></div></div>
    <div class="ptrow b"><span class="ptlab">Team ${B}</span><div class="ptchips" id="vnR"></div></div></div>
    <p class="ftmsg" id="vnMsg" role="status">Tap a member of Team ${A}, then the <b>same</b> prime in Team ${B}, to pair them up on a shared seat.</p><div id="vnCols" style="width:100%;display:grid;justify-items:center"></div><button class="btn primary" id="vnDone">Everyone is seated ✅</button></div>`);
  const need=fMin([fa,fb]),needN=Object.values(need).reduce((a,b)=>a+b,0);
  /* the lined-up prime factors, as written in class: shared columns are highlighted */
  const cols=()=>{const ps=[...new Set([...pfArr(A),...pfArr(B)])].sort((x,y)=>x-y),C=[];ps.forEach(p=>{const ea=fa[p]||0,eb=fb[p]||0;for(let k=0;k<Math.max(ea,eb);k++)C.push({p,a:k<ea,b:k<eb})});
    const row=(key,n)=>`<tr><th>${n} =</th>${C.map((c,i)=>{const on=c[key],nxt=C.slice(i+1).some(d=>d[key]);return `<td class="${on&&c.a&&c.b?'sh':''}">${on?c.p:''}</td>${i<C.length-1?`<td class="x">${on&&nxt?'×':''}</td>`:''}`}).join('')}</tr>`;
    $('vnCols').innerHTML=`<div class="ptcols"><p class="asklab" style="margin:0 0 4px">Lined up in columns:</p><table>${row('a',A)}${row('b',B)}</table><p class="ptkey"><span class="sh">Shared</span> columns: both numbers have that prime.</p></div>`};
  const draw=()=>{const av=v=>`<span class="vnav">${pbGuySvg(side==='M'?'#ffd257':'#6aa5ff')}</span>`,chip=(x,side)=>`<button class="vnc${sel&&sel.side===side&&sel.i===x.i?' sel':''}" data-s="${side}" data-i="${x.i}"><span class="vnav">${pbGuySvg(side==='L'?'#8f84ff':'#ffad75')}</span>${x.v}</button>`;
    $('vnL').innerHTML=left.map(x=>chip(x,'L')).join('');$('vnR').innerHTML=right.map(x=>chip(x,'R')).join('');$('vnM').innerHTML=mid.length?mid.map((x,j)=>`<button class="vnc mid pair" data-m="${j}" title="Tap to undo"><span><span class="vnav">${pbGuySvg('#ffd257',1)}</span>${x.v}</span><span><span class="vnav">${pbGuySvg('#ffd257',1)}</span>${x.v}</span></button>`).join(''):'<span class="ptempty">Pairs of the same prime sit here</span>';
    document.querySelectorAll('#vnL .vnc,#vnR .vnc').forEach(b=>b.onclick=()=>pickChip(b.dataset.s,+b.dataset.i));document.querySelectorAll('#vnM .vnc').forEach(b=>b.onclick=()=>undo(+b.dataset.m))};
  const pickChip=(side,i)=>{sfx.tap();const list=side==='L'?left:right,x=list.find(y=>y.i===i);if(!sel||sel.side===side){sel={side,i,v:x.v};draw();return}
    if(sel.v!==x.v){$('vnMsg').innerHTML=`<span style="color:#c2410c">Only the <b>same</b> prime can share a seat: ${sel.v} and ${x.v} are different.</span>`;sfx.no();sel=null;draw();return}
    const a=sel.side==='L'?sel.i:i,b=sel.side==='L'?i:sel.i;left=left.filter(y=>y.i!==a);right=right.filter(y=>y.i!==b);mid.push({v:x.v,a,b});sel=null;$('vnMsg').innerHTML='<span style="color:var(--teal)">Paired up on a shared seat. ✓</span>';draw()};
  const undo=j=>{const m=mid[j];mid.splice(j,1);left.push({v:m.v,i:m.a});right.push({v:m.v,i:m.b});left.sort((x,y)=>x.v-y.v);right.sort((x,y)=>x.v-y.v);sfx.tap();draw()};
  $('vnDone').onclick=()=>{if(mid.length<needN){const miss=left.find(x=>right.some(y=>y.v===x.v));$('vnMsg').innerHTML=`<span style="color:#c2410c">Not yet: there is still a <b>${miss.v}</b> in both teams that could share a seat.</span>`;sfx.no();ctx.keep.vnMiss=1;return}
    $('vnDone').disabled=true;document.querySelectorAll('.pt .vnc').forEach(b=>b.disabled=true);cols();done(mid.map(x=>x.v),left.map(x=>x.v),right.map(x=>x.v))};
  if(auto){Object.keys(need).forEach(p=>{for(let e=0;e<need[p];e++){const a=left.find(y=>y.v===+p),b=right.find(y=>y.v===+p);left=left.filter(y=>y!==a);right=right.filter(y=>y!==b);mid.push({v:+p,a:a.i,b:b.i})}});draw();$('vnDone').disabled=true;cols();done(mid.map(x=>x.v),left.map(x=>x.v),right.map(x=>x.v));return}
  draw()}
const STH=[ /* HCF stories: split into identical groups, as many as possible / as big as possible */
  (a,b)=>({art:cpArt([['🍬',`${a} sweets`],['🏷️',`${b} stickers`],['→'],['🎁','? bags']]),q:`<b>${a} sweets</b> and <b>${b} stickers</b> are packed into identical party bags, with nothing left over. What is the <b>largest</b> number of party bags?`,q2:h=>[`How many sweets are in each bag?`,a/h]}),
  (a,b)=>({art:`<div class="cpart" style="display:grid;justify-items:start;gap:6px">${[[a,'#ff5fa2'],[b,'#5f50ec']].map(([v,c])=>`<div style="display:flex;align-items:center;gap:8px;width:100%"><span class="bar" style="width:${Math.round(v/Math.max(a,b)*80)}%;background:${c}"></span><span>${v} cm</span></div>`).join('')}</div>`,q:`Two streamers are <b>${a} cm</b> and <b>${b} cm</b> long. They are cut into pieces all of the <b>same length</b>, with nothing left over. What is the <b>longest</b> each piece can be (in cm)?`,q2:h=>[`How many pieces are there altogether?`,(a+b)/h]}),
  (a,b)=>({art:cpArt([['👦',`${a} boys`],['👧',`${b} girls`],['→'],['🍽️','? tables']]),q:`<b>${a} boys</b> and <b>${b} girls</b> sit at party tables. Every table has the same number of boys and the same number of girls. What is the <b>largest</b> number of tables?`,q2:h=>[`How many girls sit at each table?`,b/h]})];
const STL=[ /* LCM stories: things that repeat, when do they line up again? */
  (x,y)=>({art:cpArt([['💡',`A: every ${x} s`,x],['💡',`B: every ${y} s`,y]]),q:`Disco light A flashes every <b>${x} s</b> and light B every <b>${y} s</b>. They flash together now. After how many seconds do they <b>next</b> flash together?`,q2:L=>[`How many times does light A flash in that time (not counting the start)?`,L/x]}),
  (x,y)=>({art:cpArt([['🥁',`drum: every ${x} s`,x],['🎺',`horn: every ${y} s`,y]]),q:`DJ Qubi plays a drum beat every <b>${x} s</b> and a horn every <b>${y} s</b>. Both play together now. After how many seconds do they <b>next</b> play together?`,q2:L=>[`How many horns are played in that time (not counting the start)?`,L/y]}),
  (x,y)=>({art:cpArt([['🍿',`snacks: every ${x} min`,x],['🥤',`drinks: every ${y} min`,y]]),q:`The snack table is refilled every <b>${x} min</b> and the drinks every <b>${y} min</b>. Both were refilled at the start of the party. After how many minutes are both <b>next</b> refilled together?`,q2:L=>[`How many times are the snacks refilled in that time (not counting the start)?`,L/x]})];
/* a picture row for party problems; a third value makes the icon flash at that rhythm (scaled down) */
const cpArt=items=>`<div class="cpart">${items.map(([e,l,p])=>l===undefined?`<span class="vs">${e}</span>`:`<div class="it"><span class="em${p?' blink':''}"${p?` style="--p:${(p*.25).toFixed(2)}s"`:''}>${e}</span><span>${l}</span></div>`).join('')}</div>`;
function stNums(T,kind){for(let k=0;k<400;k++){if(kind==='h'){const h=pick([[2,3,4,5,6],[4,6,8,9,12],[8,12,14,15,18]][T]),x=R(2,[4,6,8][T]),y=R(2,[5,7,9][T]);if(x===y||gcdN(x,y)!==1)continue;return [h*x,h*y]}
  const g=pick([[2,3,4],[2,3,4,5,6],[3,4,6,8,10]][T]),x=R(2,[5,6,8][T]),y=R(2,[6,7,9][T]);if(x===y||gcdN(x,y)!==1)continue;const a=g*x,b=g*y,L=g*x*y;if(L>[90,360,900][T])continue;return [a,b]}return kind==='h'?[24,36]:[12,18]}
function vnAsk(api,id,label,right,traps,work,ok){askOne(api,{id,label,w:6,right,traps:traps.filter(([x])=>x!==right),hint:'Multiply the members in the right part of the diagram.',ok,bad:ok,work})}
addGame('s1-tables',{level:'Sec 1',sec:'s1',strand:'num',glyph:'🍹',title:'Club Prime: Party Tables',topic:'HCF and LCM using prime factorisation',
 how:'Two teams share a party table. Pair up their shared prime members and line them up in columns to find the HCF and LCM, then solve party problems.',rounds:8,
 round(api,r){const T=TIER(),type=['vhcf','vlcm','ihcf','ilcm','coprime','sh','sl','mix'][r],K=ctx.keep=ctx.keep||{};
  if(type==='vhcf'||type==='vlcm'){const [fa,fb]=vnGen(T),A=fromF(fa),B=fromF(fb),H=fromF(fMin([fa,fb])),L=fromF(fMax([fa,fb]));
    api.q(cpClub([...new Set([...pfArr(A),...pfArr(B)])])+`<p class="qt">🍹 <b>Party tables!</b> <b>${A}</b> = ${pfs(fa)} and <b>${B}</b> = ${pfs(fb)} want to share a table. Pair up the prime members that both teams have.</p>`);
    vnTable(api,fa,fb,(mid,lo,ro)=>{K.vn=1;const all=[...lo,...mid,...ro];
      if(type==='vhcf')vnAsk(api,'cpH',`<b>Step 2:</b> the <b>HCF</b> is one prime from each <b>shared</b> column, multiplied (${mid.join(' × ')}). HCF of ${A} and ${B} =`,H,
        [[L,'That is the LCM: one from every column. The HCF uses only the shared columns.'],[mid.reduce((a,b)=>a+b,0),'Multiply the shared members, don\'t add them.'],[A*B,'That multiplies the two numbers. The HCF uses only the shared members.']],
        [`Shared: ${mid.join(' × ')} = ${H}`,`HCF = ${H}`],`HCF = ${mid.join(' × ')} = ${H}.`);
      else vnAsk(api,'cpL',`<b>Step 2:</b> the <b>LCM</b> is one prime from <b>every</b> column, multiplied: each shared pair counts once (${all.sort((a,b)=>a-b).join(' × ')}). LCM of ${A} and ${B} =`,L,
        [[A*B,`That is ${A} × ${B}: the shared members (${mid.join(', ')}) were counted twice. Count each seat once.`],[H,'That is the HCF (only the shared columns). The LCM uses one from every column.']],
        [`Everyone: ${all.join(' × ')} = ${L}`,`LCM = ${L}`],`LCM = ${L}.`)},!!K.vn);return}
  if(type==='ihcf'||type==='ilcm'){const three=T===2,fs=vnGen(T,{three}),ns=fs.map(fromF),H=fMin(fs),Lf=fMax(fs),isH=type==='ihcf',right=isH?H:Lf,mixed={};
    Object.keys(H).forEach(p=>mixed[p]=Lf[p]);const prod=fSum(fs);
    const opts=[...new Set([pfsU(right),pfsU(isH?Lf:H),pfsU(isH?mixed:prod),pfsU(isH?prod:mixed)])].filter(Boolean);
    api.q(cpClub([...new Set(ns.flatMap(pfArr))])+`<p class="qt">📋 The guest lists: ${ns.map((n,i)=>`<b>${n}</b> = ${pfs(fs[i])}`).join(three?'<br>':' and ')}</p><p class="qs">Find the ${isH?'<b>HCF</b> (highest common factor)':'<b>LCM</b> (lowest common multiple)'}${three?' of all three':''}.</p>`);
    const why=v=>v===pfsU(isH?Lf:H)?(isH?'That takes the highest powers: that is the LCM.':'That takes only the shared primes with the lowest powers: that is the HCF.'):v===pfsU(prod)?'That multiplies the numbers together, so shared primes are counted more than once.':isH?'Only shared primes count, but take the lowest power each time.':'Every prime that appears must be included, with its highest power.';
    stepPick(api,{id:'cpIx',label:`<b>Step 1:</b> which is the ${isH?'HCF':'LCM'} in index notation?`,options:opts,right:pfsU(right),pen:'cpIv',hint:v=>why(v),
      reveal:v=>`${why(v)} The ${isH?'HCF':'LCM'} is <b>${pfsU(right)}</b>. Tap it to carry on.`,
      okMsg:`<p class="askok">Yes! ${isH?'Shared primes, lowest powers':'Every prime, highest powers'}: ${pfs(right)}.</p>`,
      then:()=>askOne(api,{id:'cpIv',label:`<b>Step 2:</b> work it out. ${isH?'HCF':'LCM'} =`,w:6,right:fromF(right),traps:[[fromF(isH?Lf:H),isH?'That is the LCM.':'That is the HCF.']],hint:'Write each power as repeated multiplication, then multiply.',
        ok:`${pfs(right)} = ${fromF(right)}.`,bad:`${pfs(right)} = ${fromF(right)}.`,work:[`${isH?'HCF':'LCM'} = ${pfs(right)} = ${fromF(right)}`]})});return}
  if(type==='coprime'){const [fa,fb]=vnGen(T,{coprime:1}),A=fromF(fa),B=fromF(fb);
    api.q(cpClub([...new Set([...pfArr(A),...pfArr(B)])])+`<p class="qt">🤔 Nothing in common? <b>${A}</b> = ${pfs(fa)} and <b>${B}</b> = ${pfs(fb)} share a table.</p>`);
    askOne(api,{id:'cpC',label:`<b>Step 1:</b> what is the HCF of ${A} and ${B}?`,w:4,right:1,traps:[[0,'0 is not a factor of anything. Every whole number has 1 as a factor, so the HCF is at least 1.']],hint:'Do they share any prime members? If not, what is the only factor they both have?',
      then:()=>askOne(api,{id:'cpC2',label:`<b>Step 2:</b> nobody shares a seat, so everyone sits at the table. LCM of ${A} and ${B} =`,w:6,right:A*B,traps:[[A+B,'Multiply, don\'t add.']],hint:'With no shared members, the LCM is everyone multiplied together.',
        ok:`No shared primes, so HCF = 1 and LCM = ${A} × ${B} = ${A*B}.`,bad:`HCF = 1, so LCM = ${A} × ${B} = ${A*B}.`,work:[`${A} = ${pfs(fa)}, ${B} = ${pfs(fb)}: no shared primes`,`HCF = 1, LCM = ${A*B}`]})});return}
  const kind=type==='mix'?pick(['h','l']):type==='sh'?'h':'l',[a,b]=stNums(T,kind),H=gcdN(a,b),L=lcm2(a,b),S=(kind==='h'?pick(STH):pick(STL))(a,b),ans=kind==='h'?H:L,[q2,a2]=S.q2(ans);
  const step=()=>askOne(api,{id:'cpT',label:type==='mix'?'<b>Step 2:</b> work it out.':'<b>Step 1:</b> work it out.',w:6,right:ans,
    traps:[[kind==='h'?L:H,kind==='h'?'That is the LCM. Sharing into identical groups needs the HCF.':'That is the HCF. Waiting for things to line up again needs the LCM.'],[a*b,kind==='h'?'Too big: you need a number that divides both.':`${a} × ${b} works, but it is not the first time they line up. Look for the lowest common multiple.`]],
    hint:kind==='h'?`Find the HCF of ${a} and ${b}.`:`Find the LCM of ${x0(a,b)}.`,
    then:()=>askOne(api,{id:'cpT2',label:`<b>${type==='mix'?'Step 3':'Step 2'}:</b> ${q2}`,w:6,right:a2,hint:kind==='h'?'Divide by the number of groups.':'Divide by how often it happens.',
      ok:`${kind==='h'?`HCF(${a}, ${b}) = ${H}`:`LCM(${a}, ${b}) = ${L}`}, and the answer is ${a2}.`,bad:`${kind==='h'?`HCF(${a}, ${b}) = ${H}`:`LCM(${a}, ${b}) = ${L}`}. The answer is ${a2}.`,
      work:[`${a} = ${pfs(PF(a))}, ${b} = ${pfs(PF(b))}`,kind==='h'?`HCF = ${pfs(fMin([PF(a),PF(b)]))} = ${H}`:`LCM = ${pfs(fMax([PF(a),PF(b)]))} = ${L}`,`${q2.replace(/\?$/,'')}: ${a2}`]})});
  api.q(cpClub([2,3,5,7])+`<p class="qt">🎉 <b>Party planning.</b> ${S.q}</p>`);api.body.insertAdjacentHTML('beforeend',S.art||'');
  if(type==='mix')stepPick(api,{id:'cpK',keepOrder:true,label:'<b>Step 1:</b> do you need the HCF or the LCM?',options:['HCF','LCM'],right:kind==='h'?'HCF':'LCM',pen:'cpT',
    hint:()=>'',reveal:()=>`${kind==='h'?'Sharing into identical groups, as many or as big as possible, needs the <b>HCF</b>.':'Waiting until repeating things line up again needs the <b>LCM</b>.'} Tap ${kind==='h'?'HCF':'LCM'} to carry on.`,
    okMsg:`<p class="askok">Yes: ${kind==='h'?'equal groups with nothing left over → HCF.':'repeating until they line up → LCM.'}</p>`,then:step});else step()},
 bonus(api){const h=pick([2,4,6,8]),pr=shuffle([[2,3],[3,4],[2,5],[3,5],[4,5],[5,6],[3,7],[2,7]].filter(([x,y])=>gcdN(x,y)===1))[0],[x,y]=pr,a=h*x,b=h*y,L=h*x*y;
  api.q(cpBan('THE VIP ROOM','Secret level')+mmRoom(`"Welcome, clever one. I am <b>2</b>, the Mastermind. Here is my riddle: I know two numbers. Their <b>HCF is ${h}</b> and their <b>LCM is ${L}</b>. One of them is <b>${a}</b>. What is the other?"`));
  askOne(api,{id:'mmR',w:6,right:b,traps:[[L/a,`${L} ÷ ${a} = ${L/a}, but check: is the HCF of ${a} and ${L/a} equal to ${h}?`],[L/h,`Close: try using HCF × LCM = first number × second number.`]].filter(([v])=>v!==b),
    hint:'For any two numbers, HCF × LCM = the first number × the second number.',
    ok:`"Correct! ${h} × ${L} = ${h*L} = ${a} × ${b}. The HCF and LCM always multiply to the same as the two numbers."`,bad:`"The other number is ${b}: ${h} × ${L} = ${a} × ${b}."`,work:[`HCF × LCM = ${h} × ${L} = ${h*L}`,`${h*L} ÷ ${a} = ${b}`,`Check: HCF(${a}, ${b}) = ${gcdN(a,b)}, LCM = ${lcm2(a,b)}`]})}});
const x0=(a,b)=>`${a} and ${b}`;
/* Secondary 1 order: Prime Bouncer, then the two Club Prime games */
['s1-tables','s1-split'].forEach(id=>{ORDER.splice(ORDER.indexOf(id),1);ORDER.splice(ORDER.indexOf('s1-bouncer')+1,0,id)});
