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
.ftv.next{position:relative;margin-bottom:24px}.ftv.next:before{content:'👆';position:absolute;left:50%;top:100%;transform:translateX(-50%);font-size:22px;animation:ftpoint .9s ease-in-out infinite;pointer-events:none}
@keyframes ftpoint{50%{transform:translate(-50%,6px)}}
.ftguide{margin:0 0 6px;padding:8px 12px 8px 30px;border:2px dashed var(--line,#c9cfdb);border-radius:12px;font:600 14px/1.45 var(--body);text-align:left;width:100%;max-width:560px;box-sizing:border-box;color:var(--muted)}
.ftguide li.on{color:var(--ink);font-weight:800}.ftguide li.on::marker{color:#5f50ec}
.ftkey{display:inline-block;padding:0 6px;border:2px solid #16233a;border-radius:8px;color:#16233a;font-weight:800}.ftkey.cp{background:#e7f0ff}.ftkey.pr{background:#ffd257}
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
.cpmgr{transition:right .9s ease}.cpmgr.palm:after{content:'✋';position:absolute;left:-14px;top:30%;font-size:20px;animation:pbgpop .3s both}
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
.ptlab2{display:grid;gap:8px;justify-items:center;width:100%;max-width:700px;margin:0 auto;background:var(--surface);color:var(--ink);border:2.5px solid var(--ink);border-radius:16px;padding:12px;box-sizing:border-box}
.ptlab2 h4{margin:0;font:800 13px var(--body);letter-spacing:.08em;text-transform:uppercase;opacity:.75}.ptin{margin:0;font:700 1.15rem var(--body)}.ptsm{margin:0;font:600 14px/1.45 var(--body);text-align:center}
.ptnums{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.ptnums .btn{min-width:46px;font-size:1.05rem}.ptnums .btn.ok{background:#9be7c4;color:#16233a}.ptnums .btn.tried{opacity:.6}
.ptbags{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;min-height:10px}
.ptbin{font:800 15px var(--body)}.ptbin .y,.ptstat .y,.ptchk .y{color:#0b968b}.ptbin .n,.ptstat .n,.ptchk .n{color:#c2410c}
.ptlog tr.cf td{background:#9be7c4;color:#16233a;font-weight:800}.ptlog{border-collapse:collapse;font:700 13px var(--body)}.ptlog th,.ptlog td{border:1.5px solid var(--line,#c9cfdb);padding:3px 8px;text-align:center}
.ptstk{display:flex;gap:clamp(16px,6vw,48px);justify-content:center;align-items:flex-end}.ptstk .col{display:grid;justify-items:center;gap:6px}.ptstk .tot{font:800 1.2rem var(--body)}
.ptstk .pile{display:flex;flex-direction:column-reverse;align-items:center;width:clamp(80px,22vw,120px);min-height:20px}.ptstk .pile i{display:grid;place-items:center;width:100%;border:2px solid #16233a;border-radius:5px;margin-top:2px;font:800 11px var(--body);font-style:normal;color:#16233a;box-sizing:border-box;animation:ftin .25s both}
.ptstk .row{display:flex;gap:6px}.ptstat{margin:0;font:800 15px var(--body);text-align:center}
.ptls{display:grid;gap:6px;width:100%;text-align:left;font:800 14px var(--body)}.ptls div{display:flex;flex-wrap:wrap;gap:5px}
.ptc{min-width:40px;padding:5px 8px;border:2px solid var(--ink);border-radius:10px;background:var(--surface);color:var(--ink);font:800 1rem var(--body);cursor:pointer}.ptc.both{background:#ffd257;color:#16233a}.ptc.tried{opacity:.45}
.pttray{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.ptm{display:grid;justify-items:center;min-width:48px;padding:4px 8px;border:2.5px solid #16233a;border-radius:12px;font:800 1.2rem var(--display);color:#16233a;cursor:pointer;transition:transform .15s}
.ptm small{font:700 10px var(--body)}.ptm.a{background:#d8d3ff}.ptm.b{background:#ffe0c7}.ptm.in{transform:translateY(-6px);box-shadow:0 0 0 4px #ffd257}.ptm.lnk{position:relative}.ptm.lnk:after{content:'🔗';position:absolute;top:-14px;right:-8px;font-size:14px}
.ptcand{font:700 1.05rem var(--body)}.ptcand b{font-size:1.4rem}.ptchk{display:grid;gap:2px;font:700 14px var(--body)}
.ptcols table{border-collapse:separate;border-spacing:3px 4px;font:800 1.15rem var(--body);margin:0 auto}.ptcols th{text-align:right;padding-right:6px}.ptcols td{min-width:26px;text-align:center}.ptcols td.sh{background:#ffd257;color:#16233a;border-radius:6px}.ptcols td.x{min-width:12px;opacity:.6}
.ptkey{font:600 13px var(--body);margin:6px 0 0;text-align:center}.ptkey .sh{background:#ffd257;color:#16233a;padding:0 6px;border-radius:6px}
.ptbw{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;width:100%;align-items:start}@media (min-width:760px){.ptbw{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)}}
.ptbl{display:grid;gap:8px;justify-items:center}.ptbr{display:grid;gap:8px;justify-items:center;border:2.5px dashed var(--line,#c9cfdb);border-radius:14px;padding:8px;min-height:150px;align-content:start}
.ptbr h5{margin:0;font:800 12px var(--body);letter-spacing:.08em;text-transform:uppercase;opacity:.7}
.ptbag{display:grid;gap:2px;justify-items:center;align-content:start;background:#fff6e0;color:#16233a;border:2px solid #16233a;border-radius:10px;padding:3px 4px;min-width:50px;min-height:44px;transition:box-shadow .15s,background .3s}
.ptbag b{font:800 10px var(--body)}.ptbag .it,.ptbin .it{display:flex;flex-wrap:wrap;justify-content:center;gap:1px;max-width:92px;font-size:14px;line-height:1.1}
.ptbag.flash{box-shadow:0 0 0 4px #ffd257}.ptbag.good{background:#dff7ec;border-color:#0b968b}
.ptbin.box{display:grid;justify-items:center;gap:2px;padding:4px 10px;border-radius:10px;border:2.5px dashed #9aa6ba;color:#16233a;background:#f3f5f9;font:800 12px var(--body)}
.ptbin.box.has{border-color:#c2410c;background:#ffe1dc;box-shadow:0 0 0 3px #ffb4a8}.ptbin.box.none{border-color:#0b968b;background:#dff7ec}.ptbin .it{max-width:220px;font-size:16px}
.ptic{display:inline-block;animation:ftin .18s both}.ptcap{margin:0;font:700 14px/1.5 var(--body);text-align:center}.ptcap .y{color:#0b968b}.ptcap .n{color:#c2410c}
.ldwrap{display:flex;justify-content:center}.ldtab{border-collapse:collapse;font:800 1.25rem var(--display)}.ldtab td{padding:3px 12px;min-width:34px;text-align:center}.ldtab td.p{border-right:3px solid currentColor;color:#5f50ec}.ldtab tr:not(:last-child) td.v{border-bottom:3px solid currentColor}.ldtab tr.new td{animation:ftin .3s both}
.vggs{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.vgg{background:#ffd257;color:#16233a;border:2.5px solid #16233a;border-radius:10px;padding:3px 10px;font:800 1rem var(--body);animation:ftin .3s both}
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
/* Qubi walks from the door to a guest (left %), or back to the door */
function cpWalk(mg,toLeft){if(!mg)return;const q=mg.querySelector('.qubi');if(q){q.classList.remove('idle');q.classList.add('walking')}
  mg.style.right=toLeft==null?'21%':Math.max(2,100-toLeft-(innerWidth<600?26:18))+'%';setTimeout(()=>{if(q){q.classList.remove('walking');q.classList.add('idle')}},950)}
function cpAlley(id){return `<div class="cpscene alley" id="${id}"><div class="cpdoor"></div><div class="cpmgr">${QB()}</div><div class="cpsay" id="${id}S"></div></div>`}
function cpAlleySync(id){const sc=$(id),map=new Map(),slots=n=>{const nar=innerWidth<600,lo=2,hi=nar?52:58;return Array.from({length:n},(_,i)=>n===1?(lo+hi)/2-8:lo+i*(hi-lo)/(n-1))};
  const say=t=>{const s=$(id+'S');if(s){s.innerHTML=t;s.className='cpsay on'}};
  let warned=false;
  return {say,sync(leaves,first){if(!sc)return;const ids=new Set(leaves.map(x=>x.id)),gone=[...map.keys()].filter(k=>!ids.has(k));let from=null;
    gone.forEach(k=>{const e=map.get(k);from=parseFloat(e.style.left);e.classList.add('pop');setTimeout(()=>e.remove(),450);map.delete(k)});
    const comps=leaves.filter(x=>!isPrime(x.v)),pos=slots(comps.length);let inNow=[];
    leaves.forEach(x=>{if(map.has(x.id))return;const d=document.createElement('div');d.innerHTML=cpGuy(x.v,{left:from==null?-15:from});const g=d.firstChild;sc.appendChild(g);map.set(x.id,g);if(isPrime(x.v))inNow.push(g)});
    requestAnimationFrame(()=>requestAnimationFrame(()=>{comps.forEach((x,i)=>{const g=map.get(x.id);if(g)g.style.left=pos[i]+'%'});
      inNow.forEach((g,i)=>{g.classList.add('jump');setTimeout(()=>{g.style.left='84%';g.style.opacity='0'},500+i*180)})}));
    if(inNow.length&&!first)say(inNow.length>1?`${inNow.map(g=>g.querySelector('.cpnum').textContent).join(' and ')} are prime: straight in! ✨`:`${inNow[0].querySelector('.cpnum').textContent} is prime: straight in! ✨`);
    if(!comps.length)setTimeout(()=>say('Every member is prime. Welcome to Club Prime! 🎉'),600);
    if(first&&comps.length&&!warned){warned=true;const mg=sc.querySelector('.cpmgr'),v=comps[0].v;
      setTimeout(()=>{if(!sc.isConnected)return;cpWalk(mg,pos[0]);setTimeout(()=>{if(!sc.isConnected)return;mg.classList.add('palm');say(`"Hold on, <b>${v}</b>! You're not prime. You need to <b>split up</b> before heading in."`);
        setTimeout(()=>{if(!sc.isConnected)return;mg.classList.remove('palm');cpWalk(mg,null)},2600)},1000)},1500)}}}}
const mmRoom=t=>`<div class="mm2">${MM2}<p>${t}</p></div>`;

/* ---- factor tree: tap a composite member to split it; primes walk into the club ---- */
function ftPairs(v){const ps=[];for(let a=2;a*a<=v;a++)if(v%a===0)ps.push([a,v/a]);
  if(ps.length<=5)return ps;const keep=[ps[0],ps[ps.length-1]];shuffle(ps.slice(1,-1)).slice(0,3).forEach(p=>keep.push(p));return keep.sort((x,y)=>x[0]-y[0])}
function ftTree(api,n,done,o={}){let uid=0;const root={v:n,id:uid++,k:null},nodes={},club=[];nodes[root.id]=root;let sel=null;const prefix=o.prefix||'ft';
  api.body.insertAdjacentHTML('beforeend',`<div class="ftwrap" id="${prefix}W"><ol class="ftguide" id="${prefix}G"><li class="on"><b>Tap</b> a number in a <span class="ftkey cp">blue</span> bubble. It isn't prime, so it must split.</li><li><b>Choose</b> two numbers that multiply to make it.</li><li><b>Repeat</b> until every bubble is <span class="ftkey pr">yellow ✨</span> (prime). Yellow members walk into the club.</li></ol><div id="${prefix}T"></div><div class="ftclub" id="${prefix}C"><span>Inside the club:</span></div><div class="ftpanel" id="${prefix}P"></div><div class="ftmsg" id="${prefix}M" role="status"></div></div>`);
  const leaves=()=>{const out=[];const walk=x=>x.k?x.k.forEach(walk):out.push(x);walk(root);return out};
  const draw=()=>{const d=x=>`<div class="ftn"><button class="ftv ${x.k?'sp':isPrime(x.v)?'pr':'cp'}${sel===x.id?' sel':''}" data-id="${x.id}" ${x.k?'disabled':''} aria-label="${x.v}${x.k?' (split)':isPrime(x.v)?' (prime)':' (tap to split)'}">${x.v}</button>${x.k?`<div class="ftk">${d(x.k[0])}${d(x.k[1])}</div>`:''}</div>`;
    if(o.scene)o.scene.sync(leafList(),!draw.done);draw.done=1;$(prefix+'T').innerHTML=d(root);$(prefix+'T').querySelectorAll('.ftv:not([disabled])').forEach(b=>b.onclick=()=>tap(+b.dataset.id));
    const cm=leaves().filter(x=>!isPrime(x.v));
    if(!cm.length){$(prefix+'P').innerHTML='<b style="color:var(--teal)">✓ Every member is prime. They all walk in!</b>';done&&done(pfArr(n));done=null;return}
    if(sel===null||!nodes[sel]||nodes[sel].k||isPrime(nodes[sel].v)){$(prefix+'P').innerHTML=`<span>👆 <b>Tap the blue ${cm[0].v}</b> to split it.</span>`;guide(0);
      const b=$(prefix+'T').querySelector(`[data-id="${cm[0].id}"]`);if(b)b.classList.add('next')}};
  const guide=k=>{const g=$(prefix+'G');if(g)[...g.children].forEach((li,i)=>li.classList.toggle('on',i===k))};
  const leafList=()=>leaves().map(x=>({id:x.id,v:x.v}));
  const addClub=v=>{club.push(v);$(prefix+'C').insertAdjacentHTML('beforeend',`<i>${v}</i>`)};
  const tap=id=>{const x=nodes[id];sfx.tap();$(prefix+'M').textContent='';
    if(isPrime(x.v)){$(prefix+'M').innerHTML=`<span style="color:#b07d00">${x.v} is prime already, so it walks straight into the club. ✨</span>`;return}
    sel=id;draw();const pairs=ftPairs(x.v);
    guide(1);$(prefix+'P').innerHTML=`<span><b>${x.v}</b> = ? × ?  Which two numbers multiply to make ${x.v}?</span><div class="row" style="gap:6px;flex-wrap:wrap">${[[1,x.v],...pairs].map(([a,b])=>`<button class="btn" data-a="${a}" data-b="${b}">${a} × ${b}</button>`).join('')}</div>`;
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
/* ---- Ladder (repeated division): divide by a prime again and again until you reach 1 ---- */
function ftLadder(api,n,done){const rows=[];let cur=n,miss=0;
  api.body.insertAdjacentHTML('beforeend',`<div class="ptlab2"><h4>🪜 The ladder method</h4><p class="ptsm">Divide <b>${n}</b> by a prime that divides it exactly. Keep going with the answer until you reach <b>1</b>.</p>
   <div class="ldwrap"><table class="ldtab" id="ldT"><tr><td class="p"></td><td class="v">${n}</td></tr></table></div>
   <div class="ptnums" id="ldP">${[2,3,5,7,11,13].map(p=>`<button class="btn" data-p="${p}">÷ ${p}</button>`).join('')}</div><p class="ptstat" id="ldM" role="status"></p></div>`);
  const btns=[...api.body.querySelectorAll('#ldP .btn')];
  btns.forEach(b=>b.onclick=()=>{if(api.answered||cur===1)return;const p=+b.dataset.p;
    if(cur%p){sfx.no();miss++;$('ldM').innerHTML=`<span class="n">${cur} ÷ ${p} = ${Math.floor(cur/p)} remainder ${cur%p}: ${p} doesn't divide ${cur} exactly. Try another prime.</span>`;if(miss>=4)ctx.keep.pen=1;return}
    sfx.tap();rows.push(p);const T=$('ldT');T.rows[T.rows.length-1].cells[0].textContent=p;cur/=p;T.insertAdjacentHTML('beforeend',`<tr class="new"><td class="p"></td><td class="v">${cur}</td></tr>`);
    $('ldM').innerHTML=cur===1?`<span class="y">✓ Reached 1! The primes down the side are the prime factors: ${n} = ${rows.join(' × ')}.</span>`:`${n===cur*rows.reduce((a,b)=>a*b,1)?'':''}${cur} ${isPrime(cur)?`is prime, so the last step is ÷ ${cur}.`:'is not 1 yet. Keep dividing.'}`;
    if(cur===1){btns.forEach(x=>x.disabled=true);done(rows)}})}
/* ---- grouping tool for the VIP Squares room: tap identical primes to put them in pairs (or threes) ---- */
function ftGroups(api,n,size,allowLeft,done){const ps=pfArr(n).map((v,i)=>({v,i,g:-1}));let sel=[],groups=0,miss=0;const word=size===2?'pair':'group of three';
  api.body.insertAdjacentHTML('beforeend',`<div class="ptlab2"><h4>👯 VIP Squares room</h4><p class="ptsm">${n} = ${pfArr(n).join(' × ')}</p><p class="ptsm">Tap ${size} <b>identical</b> primes to make a ${word}.</p>
   <div class="pttray" id="vgT"></div><div class="vggs" id="vgG"></div>${allowLeft?`<button class="btn" id="vgNo">No more ${word}s can be made</button>`:''}<p class="ptstat" id="vgM" role="status"></p></div>`);
  const draw=()=>{$('vgT').innerHTML=ps.filter(c=>c.g<0).map(c=>`<button class="ptm a${sel.includes(c.i)?' in':''}" data-i="${c.i}">${c.v}</button>`).join('')||'<span class="ptsm">All grouped!</span>';
    api.body.querySelectorAll('#vgT .ptm').forEach(b=>b.onclick=()=>tap(+b.dataset.i))};
  const left=()=>ps.filter(c=>c.g<0);const canMore=()=>{const c={};left().forEach(x=>c[x.v]=(c[x.v]||0)+1);return Object.values(c).some(k=>k>=size)};
  const fin=()=>{api.body.querySelectorAll('#vgT .ptm,#vgNo').forEach(b=>b.disabled=true);done(groups,left().map(x=>x.v))};
  const tap=i=>{if(api.answered)return;sel.includes(i)?sel=sel.filter(x=>x!==i):sel.push(i);sfx.tap();
    if(sel.length===size){const vs=sel.map(j=>ps[j].v);if(vs.every(v=>v===vs[0])){sel.forEach(j=>ps[j].g=groups);groups++;$('vgG').insertAdjacentHTML('beforeend',`<span class="vgg">${vs.join(' × ')}</span>`);sfx.ok();$('vgM').innerHTML=`<span class="y">✓ A ${word} of ${vs[0]}s.</span>`}
      else{sfx.no();miss++;$('vgM').innerHTML=`<span class="n">A ${word} must be the <b>same</b> prime.</span>`;if(miss>=3)ctx.keep.pen=1}sel=[]}
    draw();if(!left().length)fin()};
  if(allowLeft)$('vgNo').onclick=()=>{if(canMore()){sfx.no();$('vgM').innerHTML=`<span class="n">Look again: there is still a prime that appears ${size} times.</span>`;miss++;return}fin()};
  draw()}
function vipNum(kind){const pick2=a=>a[Math.floor(Math.random()*a.length)];
  if(kind==='sqrt'){const r=pick2([12,18,20,24,30,36,15,21,28,42]);return [r*r,r]}
  if(kind==='cbrt'){const r=pick2([6,10,12,14,15]);return [r**3,r]}
  if(kind==='ksq'){const n=pick2([72,48,108,50,98,180,200,147,75,28,45,63,12,20]),f=PF(n);let k=1;Object.keys(f).forEach(p=>{if(f[p]%2)k*=+p});return [n,k]}
  const n=pick2([24,54,72,108,40,135,16,81]),f=PF(n);let k=1;Object.keys(f).forEach(p=>{const e=f[p]%3;if(e)k*=(+p)**(3-e)});return [n,k]}
addGame('s1-split',{level:'Sec 1',sec:'s1',strand:'num',glyph:'🌳',title:'Club Prime: Split to Get In',topic:'Prime factorisation and index notation',
 how:'Composite numbers can only enter Club Prime by splitting into their prime members. Core: factor trees and index notation. Stretch adds the ladder method. Challenge opens the VIP Squares room: square roots, cube roots and perfect squares.',rounds:8,
 round(api,r){const T=TIER(),type=[['tree','stop','one','index','build','same','tree','tree'],['tree','ladder','same','stop','one','build','ladder','index'],['ladder','sqrt','cbrt','ksq','same','kcube','index','tree']][T][r],K=ctx.keep=ctx.keep||{};
  /* Stretch adds the ladder method and the two-trees discovery; Challenge adds the VIP Squares room (√, ∛, smallest k) */
  if(type==='ladder'){const f=pfGen(T),n=fromF(f);
    api.q(cpClub(pfArr(n))+`<p class="qt">🪜 Another way to split <b>${n}</b>: the <b>ladder</b>. Keep dividing by primes until you reach 1. The primes down the side are ${n}'s prime members.</p>`);
    ftLadder(api,n,rows=>{api.body.insertAdjacentHTML('beforeend',`<p class="asklab"><b>Step 2:</b> write ${n} as a product of primes, in index notation.</p>`);
      secChoice(api,'cpLd',pfChoices(f),[`Ladder: ${rows.join(', ')} down the side`,`${n} = ${rows.join(' × ')} = ${pfs(f)}`,'A factor tree gives the same primes.'],`Right: ${n} = ${pfs(f)}. A factor tree would give exactly the same primes.`)});return}
  if(type==='sqrt'||type==='cbrt'){const sq=type==='sqrt',[n,r]=vipNum(type),f=PF(n);
    api.q(cpBan('VIP SQUARES ROOM',sq?'Square roots':'Cube roots')+`<p class="qt">💎 <b>${n}</b> wants the VIP room. Only numbers whose primes come in ${sq?'<b>identical pairs</b>':'<b>identical threes</b>'} get in. Group its primes.</p>`);
    ftGroups(api,n,sq?2:3,false,g=>askOne(api,{id:'vpR',label:`<b>Step 2:</b> every ${sq?'pair':'three'} gives <b>one</b> prime to the ${sq?'square':'cube'} root. ${sq?'√':'∛'}${n} =`,w:5,right:r,traps:[[n/2,`That halves ${n}. Take one prime from each ${sq?'pair':'group of three'} and multiply.`]],hint:`Multiply one prime from each ${sq?'pair':'three'}.`,
      ok:`${sq?'√':'∛'}${n} = ${r}, because ${r} ${sq?'×':'×'} ${r}${sq?'':` × ${r}`} = ${n}.`,bad:`${sq?'√':'∛'}${n} = ${r}.`,work:[`${n} = ${pfs(f)}`,`${sq?'Halve':'Divide by 3'} each index: ${sq?'√':'∛'}${n} = ${pfs(Object.fromEntries(Object.entries(f).map(([p,e])=>[p,e/(sq?2:3)])))} = ${r}`]}));return}
  if(type==='ksq'||type==='kcube'){const sq=type==='ksq',[n,k]=vipNum(type),f=PF(n),m=n*k,root=Math.round(sq?Math.sqrt(m):Math.cbrt(m));
    api.q(cpBan('VIP SQUARES ROOM','Almost there')+`<p class="qt">💎 <b>${n}</b> is <b>not</b> a perfect ${sq?'square':'cube'}. What is the smallest whole number <b>k</b> so that ${n} × k is a perfect ${sq?'square':'cube'}?</p>`);
    ftGroups(api,n,sq?2:3,true,(g,left)=>{api.body.insertAdjacentHTML('beforeend',`<p class="askok">Left without a ${sq?'partner':'full group'}: <b>${left.join(', ')||'none'}</b>.</p>`);
      askOne(api,{id:'vpK',label:`<b>Step 2:</b> k must give every leftover prime ${sq?'a partner':'enough copies to make a three'}. Smallest k =`,w:5,right:k,traps:[[left.reduce((a,b)=>a*b,1),`That just multiplies the leftovers. Each needs ${sq?'one more copy':'enough copies to reach three'}.`]].filter(([v])=>v!==k),hint:sq?'Multiply one copy of each leftover prime.':'Each leftover prime needs copies until there are three of it.',
        then:()=>askOne(api,{id:'vpK2',label:`<b>Step 3:</b> then ${n} × ${k} = ${m}. ${sq?'√':'∛'}${m} =`,w:5,right:root,hint:`Every prime now comes in ${sq?'pairs':'threes'}.`,
          ok:`k = ${k}: ${n} × ${k} = ${m} = ${root}${sq?'²':'³'}.`,bad:`k = ${k}, and ${n} × ${k} = ${m} = ${root}${sq?'²':'³'}.`,work:[`${n} = ${pfs(f)}`,`Leftovers: ${left.join(', ')} → k = ${k}`,`${m} = ${pfs(PF(m))} = ${root}${sq?'²':'³'}`]})})});return}

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
      if(v===String(c)){/* right: Qubi walks up to the composite and stops it; the primes walk past into the club; it splits, then its members go in */
        G.forEach(x=>x.classList.remove('tap'));const h=document.querySelector('#cpSt .cphint');if(h)h.remove();const mg=$('cpStQ'),gx=parseFloat(g.style.left);
        g.classList.remove('bob');g.classList.add('sad','stopped');
        G.filter(x=>x!==g).forEach((x,k)=>api.later(()=>{x.classList.remove('bob');x.classList.add('happy','jump');api.later(()=>{x.style.left='84%';x.style.opacity='0'},300)},250+k*220));
        stS(`"Primes, straight in! ✨"`);cpWalk(mg,gx);
        api.later(()=>{mg.classList.add('block','palm');stS(`"Hold on, <b>${c}</b>! You're not prime: ${c} = ${pfArr(c).join(' × ')}. You need to <b>split up</b> before heading in."`)},1000);
        api.later(()=>{g.classList.add('pop');mg.classList.remove('palm');pfArr(c).forEach((p,k)=>{const d=document.createElement('div');d.innerHTML=cpGuy(p,{left:gx+k*7});const ng=d.firstChild;ng.classList.add('jump');$('cpSt').appendChild(ng);G.push(ng)});
          stS(`"That's better: ${pbList([...new Set(pfArr(c))])} ${new Set(pfArr(c)).size>1?'are':'is'} prime. In you go!"`);
          api.later(()=>{cpWalk(mg,null);G.filter(x=>!x.classList.contains('pop')&&x.style.opacity!=='0').forEach((x,k)=>api.later(()=>{x.classList.remove('bob','sad');x.classList.add('happy','jump');api.later(()=>{x.style.left='84%';x.style.opacity='0'},350)},k*200))},1100)},3000)}
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
/* ---------- Club Prime: Party Tables, rebuilt 20 Nov ----------
   Meaning first (after a colleague's HCF/LCM applet, auggy98.github.io/HCF_LCM):
   Core (G1-friendly): concrete party problems. Pack party bags with nothing left over (HCF); buy packs until both totals match (LCM);
     list factors / multiples and spot the common ones.
   Stretch: the concrete tools again, then BUILD the HCF and LCM from prime members with live checks, so pupils see WHY:
     the HCF must go into both numbers, so it can only use primes both have; the LCM must contain both numbers, so it needs
     every member of each, but a shared member only once. Then the column method as the shortcut, and stories.
   Challenge: builders, index notation, three numbers, no shared primes, stories.
   Every story asks first: HCF or LCM? with the reason in the choice. */
const ptE=[['🍬','sweets'],['🎀','stickers'],['🍪','cookies'],['🧃','drinks'],['🎈','balloons'],['🏷️','badges']];
function ptPair(){const s=shuffle(ptE.slice());return [s[0],s[1]]}
/* Tool 1: party bags. Try a number of bags; see the share in each bag and what is left over. */
function ptBags(api,a,b,ea,eb){const mx=Math.min(12,a,b);let run=0;
  api.body.insertAdjacentHTML('beforeend',`<div class="ptlab2"><h4>🛍️ Party bag packer</h4><p class="ptin">${ea[0]} <b>${a}</b> ${ea[1]} &nbsp; ${eb[0]} <b>${b}</b> ${eb[1]}</p>
   <div class="ptbw"><div class="ptbl"><p class="ptsm">How many bags? Tap a number to try. Every bag must get the <b>same</b>, with <b>nothing left over</b>.</p>
     <div class="ptnums">${Array.from({length:mx-1},(_,i)=>i+2).map(k=>`<button class="btn" data-k="${k}">${k}</button>`).join('')}</div>
     <table class="ptlog"><thead><tr><th>Bags</th><th>${ea[0]} each</th><th>${eb[0]} each</th><th>Left over</th></tr></thead><tbody id="ptLg"></tbody></table></div>
    <div class="ptbr"><h5>📦 Packing</h5><div class="ptbags" id="ptBg"><p class="ptsm">Tap a number of bags to watch Qubi pack them.</p></div><div class="ptbin" id="ptBin"></div><p class="ptcap" id="ptCap" role="status"></p></div></div></div>`);
  const btns=[...api.body.querySelectorAll('.ptnums .btn')];
  btns.forEach(bt=>bt.onclick=()=>{const k=+bt.dataset.k,qa=Math.floor(a/k),qb=Math.floor(b/k),ra=a%k,rb=b%k,ok=!ra&&!rb,me=++run;sfx.tap();
    btns.forEach(x=>x.setAttribute('aria-pressed',x===bt));btns.forEach(x=>x.disabled=true);
    $('ptBg').innerHTML=Array.from({length:k},(_,i)=>`<div class="ptbag"><b>Bag ${i+1}</b><div class="it"></div></div>`).join('');
    $('ptBin').className='ptbin box';$('ptBin').innerHTML='<b>🗑️ Left over</b><div class="it"></div>';$('ptCap').innerHTML='';
    const bags=[...$('ptBg').children],bin=$('ptBin').querySelector('.it');
    /* deal one at a time, round and round: first one kind of item, then the other */
    /* deal a whole round at a time (one item into every bag), then drop the leftovers into the bin together */
    const seq=[];[[ea[0],qa,a%k],[eb[0],qb,b%k]].forEach(([e,q,r])=>{for(let j=0;j<q;j++)seq.push([e,'all']);if(r)seq.push([e,'bin',r])});
    const dt=TIER()===0?Math.min(260,1800/seq.length):Math.min(130,800/seq.length);let n=0;
    const step=()=>{if(me!==run||!bags[0]||!bags[0].isConnected)return;if(n>=seq.length)return finish();const [e,t,r]=seq[n++];
      const ic=()=>{const x=document.createElement('span');x.className='ptic';x.textContent=e;return x};
      if(t==='bin'){for(let j=0;j<r;j++)bin.appendChild(ic());$('ptBin').classList.add('has');bags.forEach(x=>x.classList.remove('flash'))}
      else{bags.forEach(g=>{g.querySelector('.it').appendChild(ic());g.classList.remove('flash');void g.offsetWidth;g.classList.add('flash')})}
      setTimeout(step,dt)};
    const finish=()=>{bags.forEach(x=>{x.classList.remove('flash');if(ok)x.classList.add('good')});btns.forEach(x=>x.disabled=false);
      if(ok){$('ptBin').classList.add('none');bin.textContent='nothing! ✓';sfx.ok&&sfx.pop()}
      $('ptCap').innerHTML=`${ea[0]} ${a} shared into ${k} bags: <b>${qa} each</b>${ra?`, <span class="n">${ra} left over</span>`:', none left'}.<br>${eb[0]} ${b} shared into ${k} bags: <b>${qb} each</b>${rb?`, <span class="n">${rb} left over</span>`:', none left'}.<br>${ok?`<span class="y">✓ ${k} bags works: ${k} divides ${a} and ${b} exactly (no remainder).</span>`:`<span class="n">✗ ${k} bags doesn't work.</span>`}`;
      bt.classList.add(ok?'ok':'tried');
      if(!$('ptLg').querySelector(`[data-k="${k}"]`)){const row=`<tr data-k="${k}"><td>${k}</td><td>${qa}</td><td>${qb}</td><td>${ok?'✓ none':`${ra?ea[0]+' '+ra:''} ${rb?eb[0]+' '+rb:''}`}</td></tr>`;
        const after=[...$('ptLg').children].find(r=>+r.dataset.k>k);after?after.insertAdjacentHTML('beforebegin',row):$('ptLg').insertAdjacentHTML('beforeend',row)}};
    step()})}
/* Tool 2: packs. Add packs of x and packs of y until the two totals are equal. */
function ptStacks(api,x,y,ex,ey){let m=0,n=0;const L=lcm2(x,y),H=L*1.25,CAP=2*L;
  api.body.insertAdjacentHTML('beforeend',`<div class="ptlab2"><h4>🛒 Shopping for the party</h4><p class="ptsm">${ex[0]} ${ex[1]} come in packs of <b>${x}</b>. ${ey[0]} ${ey[1]} come in packs of <b>${y}</b>. Buy packs until you have the <b>same number</b> of each.</p>
   <div class="ptstk"><div class="col"><div class="tot" id="ptTa">0</div><div class="pile" id="ptPa"></div><div class="row"><button class="btn" id="ptAm">−</button><button class="btn primary" id="ptAp">+ pack of ${x}</button></div></div>
   <div class="col"><div class="tot" id="ptTb">0</div><div class="pile" id="ptPb"></div><div class="row"><button class="btn" id="ptBm">−</button><button class="btn primary" id="ptBp">+ pack of ${y}</button></div></div></div><p class="ptstat" id="ptSt" role="status"></p></div>`);
  const draw=()=>{const blk=(k,v,e,c)=>Array.from({length:k},()=>`<i style="height:${(v/H*150).toFixed(1)}px;background:${c}">${v/H*150>16?e+' '+v:''}</i>`).join('');
    $('ptPa').innerHTML=blk(m,x,ex[0],'#b9b2ff');$('ptPb').innerHTML=blk(n,y,ey[0],'#ffc79a');$('ptTa').textContent=`${ex[0]} ${m*x}`;$('ptTb').textContent=`${ey[0]} ${n*y}`;
    $('ptSt').innerHTML=!m||!n?'':m*x===n*y?`<span class="y">✓ Equal! ${m} pack${m>1?'s':''} of ${x} = ${n} pack${n>1?'s':''} of ${y} = <b>${m*x}</b></span>`:`${m*x} and ${n*y} are not equal yet.`};
  $('ptAp').onclick=()=>{if((m+1)*x<=CAP){m++;sfx.pop();draw()}};$('ptBp').onclick=()=>{if((n+1)*y<=CAP){n++;sfx.pop();draw()}};
  $('ptAm').onclick=()=>{if(m){m--;sfx.tap();draw()}};$('ptBm').onclick=()=>{if(n){n--;sfx.tap();draw()}};draw()}
/* Tool 3: lists. Tap the numbers that appear in BOTH lists. */
function ptLists(api,a,b,kind,then){const listA=kind==='f'?pbFactors(a):Array.from({length:10},(_,i)=>a*(i+1)),listB=kind==='f'?pbFactors(b):Array.from({length:10},(_,i)=>b*(i+1)),com=listA.filter(v=>listB.includes(v));
  api.body.insertAdjacentHTML('beforeend',`<div class="ptlab2"><h4>📝 ${kind==='f'?'Factor lists':'Multiple lists'}</h4><p class="ptsm">Tap every number that is in <b>both</b> lists.</p>
   <div class="ptls"><b>${kind==='f'?`Factors of ${a}`:`Multiples of ${a}`}</b><div>${listA.map(v=>`<button class="ptc" data-v="${v}">${v}</button>`).join('')}</div>
   <b>${kind==='f'?`Factors of ${b}`:`Multiples of ${b}`}</b><div>${listB.map(v=>`<button class="ptc" data-v="${v}">${v}</button>`).join('')}</div></div><p class="ptstat" id="ptLm" role="status"></p></div>`);
  const found=new Set();let miss=0;
  api.body.querySelectorAll('.ptc').forEach(c=>c.onclick=()=>{if(c.disabled)return;const v=+c.dataset.v;
    if(com.includes(v)){found.add(v);api.body.querySelectorAll(`.ptc[data-v="${v}"]`).forEach(x=>{x.classList.add('both');x.disabled=true});sfx.pop();
      $('ptLm').innerHTML=`<span class="y">✓ ${v} is in both lists.</span> ${found.size<com.length?`${com.length-found.size} more to find.`:''}`;
      if(found.size===com.length){$('ptLm').innerHTML=`<span class="y">✓ All found: ${com.join(', ')}${kind==='m'?' (in these lists)':''}.</span> These are <b>common ${kind==='f'?'factors':'multiples'}</b> of ${a} and ${b}.`;then(com)}}
    else{sfx.no();c.classList.add('tried');miss++;$('ptLm').innerHTML=`<span class="n">${v} is only in one list.</span>`;if(miss>=4)ctx.keep.pen=1}})}
/* Tool 4: the builder. Tap prime members to build a number; live checks show WHY the HCF / LCM is what it is. */
function ptBuild(api,fa,fb,mode,then){const A=fromF(fa),B=fromF(fb),H=fromF(fMin([fa,fb])),L=fromF(fMax([fa,fb])),isH=mode==='h',goal=isH?H:L;
  const tray=[...pfArr(A).map(v=>({v,s:'a'})),...pfArr(B).map(v=>({v,s:'b'}))].map((c,i)=>({...c,i}));const pickd=new Set();let tries=0;const mate={};
  if(isH){const used=new Set();tray.filter(c=>c.s==='a').forEach(c=>{const m=tray.find(d=>d.s==='b'&&d.v===c.v&&!used.has(d.i));if(m){used.add(m.i);mate[c.i]=m.i;mate[m.i]=c.i}})}
  api.body.insertAdjacentHTML('beforeend',`<div class="ptlab2"><h4>🧱 ${isH?'HCF':'LCM'} builder</h4>
   <p class="ptsm"><b>${A}</b> = ${pfArr(A).join(' × ')} &nbsp;·&nbsp; <b>${B}</b> = ${pfArr(B).join(' × ')}</p>
   <p class="ptsm">${isH?`Build the <b>biggest</b> number that divides <b>both</b> ${A} and ${B} exactly.`:`Build the <b>smallest</b> number that is a multiple of <b>both</b> ${A} and ${B}.`} ${isH?'Tap a member to add it. If <b>both</b> numbers have it, its partner 🔗 lights up too: a shared member counts <b>once</b>.':'Tap members to add or remove them.'}</p>
   <div class="pttray">${tray.map(c=>`<button class="ptm ${c.s}" data-i="${c.i}">${c.v}<small>from ${c.s==='a'?A:B}</small></button>`).join('')}</div>
   <div class="ptcand">Your number: <b id="ptCv">1</b> <span id="ptCx"></span></div><div class="ptchk" id="ptCk"></div>
   <button class="btn primary" id="ptGo">✅ This is the ${isH?'HCF':'LCM'}</button><p class="ptstat" id="ptBm" role="status"></p></div>`);
  const dup=i=>isH&&mate[i]!==undefined&&pickd.has(mate[i])&&mate[i]<i;const val=()=>[...pickd].reduce((p,i)=>dup(i)?p:p*tray[i].v,1);
  const show=()=>{const c=val(),ch=[...pickd].filter(i=>!dup(i)).map(i=>tray[i].v).sort((x,y)=>x-y);$('ptCv').textContent=c;$('ptCx').textContent=ch.length?'= '+ch.join(' × '):'';
    const t=(x,y)=>x%y===0?`<span class="y">✅ ${x} ÷ ${y} = ${x/y}</span>`:`<span class="n">❌ ${x} ÷ ${y} = ${Math.floor(x/y)} remainder ${x%y}</span>`;
    $('ptCk').innerHTML=isH?`<div>Divides ${A} exactly? ${t(A,c)}</div><div>Divides ${B} exactly? ${t(B,c)}</div>`:`<div>A multiple of ${A}? ${t(c,A)}</div><div>A multiple of ${B}? ${t(c,B)}</div>`};
  api.body.querySelectorAll('.ptm').forEach(b=>b.onclick=()=>{if(b.disabled)return;const i=+b.dataset.i,on=!pickd.has(i),m=isH?mate[i]:undefined;
    [i,...(m!==undefined?[m]:[])].forEach(j=>{on?pickd.add(j):pickd.delete(j);const e=api.body.querySelector(`.ptm[data-i="${j}"]`);e.classList.toggle('in',on);e.classList.toggle('lnk',on&&m!==undefined)});sfx.tap();show()});
  const finish=()=>{api.body.querySelectorAll('.ptm').forEach(b=>b.disabled=true);$('ptGo').disabled=true;then()};
  $('ptGo').onclick=()=>{if(api.answered)return;const c=val();
    if(c===goal){sfx.ok();$('ptBm').innerHTML=isH?`<span class="y">✓ ${H} is the HCF.</span> Notice: you could only use members that <b>both</b> numbers have. Add a member only one of them has, and it no longer divides the other one exactly. That's why the HCF uses the <b>shared</b> primes.`
        :`<span class="y">✓ ${L} is the LCM.</span> Notice: it needs <b>every</b> member of ${A} and <b>every</b> member of ${B}, or it won't be a multiple of both. But a shared member only needs to be there <b>once</b>: it serves both. That's why the LCM takes each prime once, shared ones not doubled.`;finish();return}
    tries++;sfx.no();
    let why;if(isH){const okA=A%c===0,okB=B%c===0;why=!okA||!okB?`${c} doesn't divide ${!okA?A:B} exactly. You used a member that only ${!okA?B:A} has. The HCF can only use members <b>both</b> numbers share (the ones that light up with a 🔗 partner).`:`${c} divides both exactly, but it's not the <b>biggest</b>. Is there another member that <b>both</b> numbers have?`}
    else{const okA=c%A===0,okB=c%B===0;why=!okA||!okB?`${c} is not a multiple of ${!okA?A:B}. Your number is missing a member of ${!okA?A:B}.`:`${c} is a multiple of both, so it's a common multiple. But is it the <b>lowest</b>? A shared member may be in there twice. Take one out and check.`}
    $('ptBm').innerHTML=`<span class="n">${why}</span>`;
    if(tries>=3){ctx.keep.pen=1;pickd.clear();const need=pfArr(goal).slice();tray.forEach(c=>{const k=need.indexOf(c.v);if(k>=0&&(!isH||c.s==='a')){need.splice(k,1);pickd.add(c.i);if(isH&&mate[c.i]!==undefined)pickd.add(mate[c.i])}});
      api.body.querySelectorAll('.ptm').forEach(b=>{b.classList.toggle('in',pickd.has(+b.dataset.i));b.classList.toggle('lnk',isH&&pickd.has(+b.dataset.i)&&mate[+b.dataset.i]!==undefined)});show();$('ptBm').innerHTML='';$('ptBm').innerHTML+=`<br>Here it is: <b>${goal}</b> = ${pfArr(goal).join(' × ')}. ${isH?'Only the shared members.':'Every member, shared ones once.'}`;finish()}};
  show()}
/* the column table, with the reason for each rule */
function ptCols(fa,fb){const A=fromF(fa),B=fromF(fb),ps=[...new Set([...pfArr(A),...pfArr(B)])].sort((x,y)=>x-y),C=[];ps.forEach(p=>{const ea=fa[p]||0,eb=fb[p]||0;for(let k=0;k<Math.max(ea,eb);k++)C.push({p,a:k<ea,b:k<eb})});
  const row=(key,n)=>`<tr><th>${n} =</th>${C.map((c,i)=>{const on=c[key],nxt=C.slice(i+1).some(d=>d[key]);return `<td class="${on&&c.a&&c.b?'sh':''}">${on?c.p:''}</td>${i<C.length-1?`<td class="x">${on&&nxt?'×':''}</td>`:''}`}).join('')}</tr>`;
  return `<div class="ptcols"><table>${row('a',A)}${row('b',B)}</table><p class="ptkey"><span class="sh">Shaded</span> columns: both numbers have that prime.</p></div>`}
const STH2=[(a,b)=>({art:cpArt([['🇸🇬',`${a} flags`],['🍫',`${b} snacks`],['→'],['🎁','? funpacks']]),q:`For National Day, <b>${a} flags</b> and <b>${b} snacks</b> go into identical funpacks, with nothing left over. What is the <b>largest</b> number of funpacks?`,q2:h=>[`How many flags are in each funpack?`,a/h]}),
  (a,b)=>({art:cpArt([['⚽',`${a} boys`],['🏸',`${b} girls`],['→'],['👥','? groups']]),q:`A CCA has <b>${a} boys</b> and <b>${b} girls</b>. The teacher makes identical groups (same number of boys and of girls in each), with nobody left out. What is the <b>largest</b> number of groups?`,q2:h=>[`How many boys are in each group?`,a/h]})];
const STL2=[(x,y)=>({art:cpArt([['🚌',`Bus A: every ${x} min`,x],['🚌',`Bus B: every ${y} min`,y]]),q:`At the bus interchange, Bus A leaves every <b>${x} min</b> and Bus B every <b>${y} min</b>. Both leave together now. After how many minutes do they <b>next</b> leave together?`,q2:L=>[`How many times does Bus A leave in that time (not counting now)?`,L/x]}),
  (x,y)=>({art:cpArt([['🚆',`MRT: every ${x} min`,x],['🚈',`LRT: every ${y} min`,y]]),q:`At a station, an MRT train arrives every <b>${x} min</b> and an LRT train every <b>${y} min</b>. They arrive together now. After how many minutes do they <b>next</b> arrive together?`,q2:L=>[`How many MRT trains arrive in that time (not counting now)?`,L/x]})];
const PTH={bags:['Try a number of bags. Look at the "left over" column.','The number of bags must divide BOTH amounts exactly (nothing left over).','Try the bigger numbers too: which is the most bags with nothing left?'],
 stacks:['Add one pack at a time to the side with fewer.','The totals are multiples: count in steps of each pack size.','Stop at the FIRST time the two totals are equal.'],
 listF:['A factor divides the number exactly (no remainder).','Tap the numbers you can see in both lists.','The highest one in both lists is the HCF.'],
 listM:['A multiple is in the number\'s times table.','Tap the numbers you can see in both rows.','The lowest one in both rows is the LCM.'],
 buildH:['The HCF must divide both numbers exactly.','Only use members that both numbers have.','Use each shared member as many times as both numbers have it.'],
 buildL:['The LCM must be a multiple of both numbers, so it needs every member of each.','A shared member only needs to be there once.','If it is a multiple of both, try taking a member out: is it still a common multiple?'],
 cols:['Line the primes up in columns.','HCF: it must divide both exactly, so use only the shaded (shared) columns.','LCM: it must be a multiple of both, so take one prime from every column.'],
 idx:['HCF: primes in every number, lowest power.','LCM: every prime that appears, highest power.','Write powers out (2³ = 2 × 2 × 2) if it helps.'],
 coprime:['Do they share any prime?','Every whole number has 1 as a factor.','No shared primes: LCM = the two numbers multiplied.'],
 story:['Is it sharing out equally with nothing left over? Or waiting until two repeating things match?','Sharing out equally: the answer must divide both numbers exactly → HCF.','Repeating until they match: the answer must be a multiple of both numbers → LCM.']};
const PTTYPES=[['bags','stacks','listF','listM','bags','stacks','story','story'],['buildH','buildL','cols','story','story','cols','story','story'],['cols','idx','idx','coprime','story','story','story','story']];
function ptIdx(api,isH,three){const T=TIER(),fs=vnGen(T,{three}),ns=fs.map(fromF),H=fMin(fs),Lf=fMax(fs),right=isH?H:Lf,mixed={};
  Object.keys(H).forEach(p=>mixed[p]=Lf[p]);const prod=fSum(fs);
  const opts=[...new Set([pfsU(right),pfsU(isH?Lf:H),pfsU(isH?mixed:prod),pfsU(isH?prod:mixed)])].filter(Boolean);
  api.q(cpClub([...new Set(ns.flatMap(pfArr))])+`<p class="qt">📋 The guest lists: ${ns.map((n,i)=>`<b>${n}</b> = ${pfs(fs[i])}`).join(three?'<br>':' and ')}</p><p class="qs">Find the ${isH?'<b>HCF</b>: it must divide '+(three?'all three':'both')+' exactly, so it can only use primes they all have, as many times as the one with fewest.':'<b>LCM</b>: it must be a multiple of '+(three?'all three':'both')+', so it needs every prime that appears, as many times as the one with most.'}</p>`);
  const why=v=>v===pfsU(isH?Lf:H)?(isH?'That takes the highest powers: that is the LCM.':'That takes only the shared primes with the lowest powers: that is the HCF.'):v===pfsU(prod)?'That multiplies the numbers together, so shared primes are counted more than once.':isH?'Only shared primes count, but take the lowest power each time.':'Every prime that appears must be included, with its highest power.';
  stepPick(api,{id:'cpIx',label:`<b>Step 1:</b> which is the ${isH?'HCF':'LCM'} in index notation?`,options:opts,right:pfsU(right),pen:'cpIv',hint:v=>why(v),
    reveal:v=>`${why(v)} The ${isH?'HCF':'LCM'} is <b>${pfsU(right)}</b>. Tap it to carry on.`,okMsg:`<p class="askok">Yes! ${isH?'Shared primes, lowest powers':'Every prime, highest powers'}: ${pfs(right)}.</p>`,
    then:()=>askOne(api,{id:'cpIv',label:`<b>Step 2:</b> work it out. ${isH?'HCF':'LCM'} =`,w:6,right:fromF(right),traps:[[fromF(isH?Lf:H),isH?'That is the LCM.':'That is the HCF.']],hint:'Write each power as repeated multiplication, then multiply.',
      ok:`${pfs(right)} = ${fromF(right)}.`,bad:`${pfs(right)} = ${fromF(right)}.`,work:[`${isH?'HCF':'LCM'} = ${pfs(right)} = ${fromF(right)}`]})})}
addGame('s1-tables',{level:'Sec 1',sec:'s1',strand:'num',glyph:'🍹',title:'Club Prime: Party Tables',topic:'HCF and LCM',
 how:'Plan the Club Prime party. Pack party bags with nothing left over and buy packs until the totals match, to see what the HCF and LCM mean. Higher levels build them from prime members and solve party problems.',rounds:8,
 round(api,r){const T=TIER(),type=PTTYPES[T][r],K=ctx.keep=ctx.keep||{};
  try{(QHINTS['s1-tables']=QHINTS['s1-tables']||[])[r]=PTH[type]}catch(e){}
  if(type==='bags'){const h=pick([[4,6,6],[6,8,12]][T]); /* HCFs with several common factors, so 'tap all that worked' means something */let x,y,a,b,fail;
    for(let k=0;k<200;k++){x=R(2,[5,6][T]);y=R(2,[5,6][T]);if(x===y||gcdN(x,y)!==1)continue;a=h*x;b=h*y;
      const mx=Math.min(12,a,b),one=[];for(let d=2;d<=mx;d++){if((a%d===0)!==(b%d===0))one.push(d)}if(one.length){fail=pick(one.slice(0,2));break}}
    const [ea,eb]=ptPair(),mx=Math.min(12,a,b),cf=[];for(let d=2;d<=mx;d++)if(a%d===0&&b%d===0)cf.push(d);
    const inA=a%fail===0,big=inA?a:b,other=inA?b:a;
    api.q(`<p class="qt">🛍️ <b>Party bags!</b> Qubi has ${ea[0]} <b>${a}</b> ${ea[1]} and ${eb[0]} <b>${b}</b> ${eb[1]} for party bags. Every bag must get the <b>same</b>, with <b>nothing left over</b>.</p>`);
    ptBags(api,a,b,ea,eb);
    api.body.insertAdjacentHTML('beforeend',`<div class="askwrap"><p class="asklab"><b>Step 1:</b> use the packer to find <b>every</b> number of bags that works (nothing left over). The ones that work turn green.</p><button class="btn primary" id="ptCfGo">✅ I've found every number that works</button><div id="ptCfM"></div></div>`);
    let miss=0;const tried=()=>[...api.body.querySelectorAll('.ptnums .btn.ok')].map(x=>+x.dataset.k);
    const step3=()=>{const NA=`the ${a} ${ea[1]}`,NB=`the ${b} ${eb[1]}`,A1=`Both ${NA} and ${NB} share equally into ${fail} bags`,A2=`${NA[0].toUpperCase()+NA.slice(1)} share equally into ${fail} bags, but ${NB} have some left over`,A3=`${NB[0].toUpperCase()+NB.slice(1)} share equally into ${fail} bags, but ${NA} have some left over`,A4=`Neither shares equally: both have some left over`,R1=inA?A2:A3;
      const how=`${a} ${ea[1]} into ${fail} bags: ${a%fail?`${Math.floor(a/fail)} each, ${a%fail} left over`:`${a/fail} each, none left over`}. ${b} ${eb[1]} into ${fail} bags: ${b%fail?`${Math.floor(b/fail)} each, ${b%fail} left over`:`${b/fail} each, none left over`}.`;
      stepPick(api,{id:'ptWhy',keepOrder:true,label:`<b>Step 2:</b> why didn't <b>${fail}</b> bags work? (Tap ${fail} in the packer to watch.)`,options:[A1,A2,A3,A4],right:R1,pen:'ptB1',
        hint:()=>`Check each one: ${how}`,reveal:()=>`${how} Tap the right reason to carry on.`,
        okMsg:`<p class="askok">Yes! In maths words: ${fail} is a <b>factor</b> of ${big} (${big} ÷ ${fail} has no remainder), but not a factor of ${other}. A number of bags only works if it is a factor of <b>both</b> numbers: a <b>common factor</b>.</p>`,
        then:()=>askOne(api,{id:'ptB1',label:`<b>Step 3:</b> so what is the <b>most</b> bags Qubi can pack?`,w:4,unit:'bags',right:h,traps:cf.filter(d=>d!==h).map(d=>[d,`${d} works, but it's not the most. Look at your list of bags that worked.`]),hint:`The biggest number in your list: ${cf.join(', ')}.`,
          ok:`${h} bags. ${h} is the <b>highest</b> number that divides ${a} <b>and</b> ${b} exactly: the <b>Highest Common Factor (HCF)</b> of ${a} and ${b}. Each bag gets ${a/h} ${ea[1]} and ${b/h} ${eb[1]}.`,
          bad:`The most is ${h} bags: the <b>Highest Common Factor (HCF)</b> of ${a} and ${b}.`,work:[`Bags that work (common factors): 1, ${cf.join(', ')}`,`${fail} fails: it divides ${big} exactly but not ${other}`,`Highest common factor: HCF = ${h}`]})})};
    $('ptCfGo').onclick=()=>{if(api.answered||$('ptCfGo').disabled)return;const got=tried(),missing=cf.filter(k=>!got.includes(k));
      if(!missing.length){sfx.ok();$('ptCfGo').disabled=true;api.body.querySelectorAll('.ptnums .btn').forEach(bt=>bt.disabled=true);
        document.querySelectorAll('#ptLg tr').forEach(tr=>tr.classList.toggle('cf',cf.includes(+tr.dataset.k)));
        $('ptCfM').innerHTML=`<p class="askok">Yes! ${cf.join(', ')} bags work (and so does 1 big bag). Each of these numbers divides ${a} <b>and</b> ${b} exactly. They are called the <b>common factors</b> of ${a} and ${b}.</p>`;step3();return}
      sfx.no();miss++;if(miss>=2)ctx.keep.pen=1;
      $('ptCfM').innerHTML=`<p class="askneed">Not yet: ${got.length?`besides ${pbList(got)}, `:''}${missing.length>1?'there are more numbers of bags':'there is another number of bags'} that work${missing.length>1?'':'s'}. Keep trying in the packer.</p>`};
    return}
  if(type==='stacks'){const [x,y]=pick([[[2,3],[3,4],[4,6],[2,5],[3,5],[4,5],[6,8]],[[4,6],[6,8],[6,9],[8,12],[10,15],[9,12],[6,10]]][T]),L=lcm2(x,y),[ex,ey]=ptPair();
    api.q(`<p class="qt">🛒 <b>Shopping for the party.</b> Qubi wants the <b>same number</b> of ${ex[1]} and ${ey[1]}.</p>`);ptStacks(api,x,y,ex,ey);
    askOne(api,{id:'ptS1',label:`<b>Step 2:</b> Qubi wants exactly the same number of ${ex[1]} and ${ey[1]}. What is the <b>smallest</b> number of each he can buy? (Use the buttons above.)`,w:5,unit:'of each',right:L,traps:x*y!==L?[[x*y,`${x*y} of each works too, but it is not the smallest. Try fewer packs.`]]:[],hint:`Count in ${x}s and in ${y}s. Where do they first meet?`,
      then:()=>askOne(api,{id:'ptS2',label:`<b>Step 3:</b> if Qubi keeps buying packs, what is the <b>next</b> number where he has the same number of ${ex[1]} and ${ey[1]}?`,w:5,unit:'of each',right:2*L,traps:[[L,`That's the smallest. Keep adding packs: when are the two numbers equal again?`]],hint:`Keep counting in ${x}s and ${y}s past ${L}.`,
        then:()=>{api.body.insertAdjacentHTML('beforeend',`<p class="askok">${L}, ${2*L}, ${3*L}… are all in the ${x} times table <b>and</b> the ${y} times table. They are called the <b>common multiples</b> of ${x} and ${y}.</p>`);
          askOne(api,{id:'ptS3',label:`<b>Step 4:</b> which common multiple is the <b>lowest</b>?`,w:5,right:L,traps:[[2*L,`${2*L} is a common multiple, but not the lowest.`]],hint:`The first match you found.`,
            ok:`${L} is the <b>lowest</b> number in both the ${x} and ${y} times tables: the <b>Lowest Common Multiple (LCM)</b> of ${x} and ${y}. Qubi buys ${L/x} packs of ${x} and ${L/y} packs of ${y}.`,
            bad:`The LCM of ${x} and ${y} is ${L}: the first total where they match.`,work:[`Multiples of ${x}: ${Array.from({length:2*L/x},(_,i)=>x*(i+1)).join(', ')}`,`Multiples of ${y}: ${Array.from({length:2*L/y},(_,i)=>y*(i+1)).join(', ')}`,`Common multiples: ${L}, ${2*L}, … → LCM = ${L}`]})}})});return}
  if(type==='listF'){const [a,b]=pick([[12,18],[16,24],[20,30],[12,30],[18,24],[24,36],[20,28]]),H=gcdN(a,b);
    api.q(`<p class="qt">📝 Qubi lists the factors of <b>${a}</b> and of <b>${b}</b>.</p>`);
    ptLists(api,a,b,'f',com=>askOne(api,{id:'ptL1',label:`The <b>highest common factor</b> (HCF) of ${a} and ${b} is the biggest number in both lists. HCF =`,w:4,right:H,traps:com.filter(v=>v!==H).map(v=>[v,`${v} is a common factor, but not the highest.`]),hint:'Look at the numbers you tapped. Which is the biggest?',
      ok:`HCF of ${a} and ${b} = ${H}: the biggest number that divides both exactly.`,bad:`The common factors are ${com.join(', ')}, so the HCF is ${H}.`,work:[`Common factors: ${com.join(', ')}`,`HCF = ${H}`]}));return}
  if(type==='listM'){const [a,b]=pick([[4,6],[6,8],[3,4],[4,10],[6,9],[8,12],[6,10]]),L=lcm2(a,b);
    api.q(`<p class="qt">📝 Qubi lists the first 10 multiples of <b>${a}</b> and of <b>${b}</b>.</p>`);
    ptLists(api,a,b,'m',com=>askOne(api,{id:'ptL2',label:`The <b>lowest common multiple</b> (LCM) of ${a} and ${b} is the smallest number in both lists. LCM =`,w:4,right:L,traps:com.filter(v=>v!==L).map(v=>[v,`${v} is a common multiple, but not the lowest.`]),hint:'Look at the numbers you tapped. Which is the smallest?',
      ok:`LCM of ${a} and ${b} = ${L}: the smallest number that is a multiple of both.`,bad:`The common multiples in the lists are ${com.join(', ')}, so the LCM is ${L}.`,work:[`Common multiples: ${com.join(', ')}…`,`LCM = ${L}`]}));return}
  if(type==='buildH'||type==='buildL'){const isH=type==='buildH',[fa,fb]=vnGen(T),A=fromF(fa),B=fromF(fb),H=fromF(fMin([fa,fb])),L=fromF(fMax([fa,fb]));
    api.q(cpClub([...new Set([...pfArr(A),...pfArr(B)])])+`<p class="qt">🧱 <b>Build the ${isH?'HCF':'LCM'}</b> of <b>${A}</b> and <b>${B}</b> from their prime members. The checks tell you if your number works.</p>`);
    ptBuild(api,fa,fb,isH?'h':'l',()=>{const pen=!!K.pen;api.done(!pen,pen?`The ${isH?'HCF':'LCM'} is ${isH?H:L}.`:`${isH?`HCF = ${H}`:`LCM = ${L}`}. You built it!`,[`${A} = ${pfs(fa)}, ${B} = ${pfs(fb)}`,isH?`HCF: only the shared members → ${pfs(fMin([fa,fb]))} = ${H}`:`LCM: every member, shared ones once → ${pfs(fMax([fa,fb]))} = ${L}`],pen?0:undefined,{noRetry:1})});return}
  if(type==='cols'){const [fa,fb]=vnGen(T),A=fromF(fa),B=fromF(fb),H=fromF(fMin([fa,fb])),L=fromF(fMax([fa,fb]));
    api.q(cpClub([...new Set([...pfArr(A),...pfArr(B)])])+`<p class="qt">📐 <b>The column method:</b> a quick way to do what the builders showed. ${A} and ${B} are lined up, prime under prime.</p>`);
    api.body.insertAdjacentHTML('beforeend',ptCols(fa,fb));
    askOne(api,{id:'ptC1',label:`<b>HCF:</b> it must go <b>into both</b> numbers, so use only the <b>shaded</b> (shared) columns, one prime from each. HCF =`,w:6,right:H,traps:[[L,'That is the LCM (every column). The HCF uses only the shaded columns.'],[A*B,'That multiplies the two numbers. The HCF uses only the shaded columns.']],hint:'Multiply one prime from each shaded column.',
      then:()=>askOne(api,{id:'ptC2',label:`<b>LCM:</b> both numbers must go <b>into it</b>, so take one prime from <b>every</b> column (a shared column counts once). LCM =`,w:6,right:L,traps:[[A*B,`That is ${A} × ${B}: the shared primes are counted twice. Each column counts once.`],[H,'That is the HCF. The LCM uses every column.']],hint:'Multiply one prime from each column.',
        ok:`HCF = ${H} and LCM = ${L}.`,bad:`HCF = ${H} (shaded columns) and LCM = ${L} (every column).`,work:[`HCF = ${pfs(fMin([fa,fb]))} = ${H}`,`LCM = ${pfs(fMax([fa,fb]))} = ${L}`]})});return}
  if(type==='idx')return ptIdx(api,r===PTTYPES[T].indexOf('idx'),r!==PTTYPES[T].indexOf('idx'));
  if(type==='coprime'){const [fa,fb]=vnGen(T,{coprime:1}),A=fromF(fa),B=fromF(fb);
    api.q(cpClub([...new Set([...pfArr(A),...pfArr(B)])])+`<p class="qt">🤔 Nothing in common? <b>${A}</b> = ${pfs(fa)} and <b>${B}</b> = ${pfs(fb)}.</p>`);
    askOne(api,{id:'cpC',label:`<b>Step 1:</b> what is the HCF of ${A} and ${B}?`,w:4,right:1,traps:[[0,'0 is not a factor of anything. Every whole number has 1 as a factor, so the HCF is at least 1.']],hint:'Do they share any prime? If not, what is the only factor they both have?',
      then:()=>askOne(api,{id:'cpC2',label:`<b>Step 2:</b> no shared primes, so the LCM needs every member of both. LCM of ${A} and ${B} =`,w:6,right:A*B,traps:[[A+B,'Multiply, don\'t add.']],hint:'With no shared members, the LCM is the two numbers multiplied.',
        ok:`No shared primes, so HCF = 1 and LCM = ${A} × ${B} = ${A*B}.`,bad:`HCF = 1, so LCM = ${A} × ${B} = ${A*B}.`,work:[`${A} = ${pfs(fa)}, ${B} = ${pfs(fb)}: no shared primes`,`HCF = 1, LCM = ${A*B}`]})});return}
  /* story: decide HCF or LCM first, with the reason in the choice */
  const kind=r===PTTYPES[T].indexOf('story')?'h':r===PTTYPES[T].indexOf('story')+1?'l':pick(['h','l']),[a,b]=stNums(T,kind),H=gcdN(a,b),L=lcm2(a,b),S=(kind==='h'?pick([...STH,...STH2]):pick([...STL,...STL2]))(a,b),ans=kind==='h'?H:L,[q2,a2]=S.q2(ans);
  const OH=`HCF: share out equally, nothing left over. The answer must divide ${a} and ${b} exactly.`,OL=`LCM: two things repeat until they match. The answer must be a multiple of ${a} and ${b}.`;
  api.q(cpClub([2,3,5,7])+`<p class="qt">🎉 <b>Party planning.</b> ${S.q}</p>`);api.body.insertAdjacentHTML('beforeend',S.art||'');
  stepPick(api,{id:'cpK',keepOrder:true,label:'<b>Step 1:</b> what does this question need?',options:[OH,OL],right:kind==='h'?OH:OL,pen:'cpT',
    hint:()=>'',reveal:()=>`${kind==='h'?'This is sharing out equally with nothing left over, so the answer must divide both numbers exactly: the <b>HCF</b>.':'This is two repeating things lining up again, so the answer must be a multiple of both numbers: the <b>LCM</b>.'} Tap it to carry on.`,
    okMsg:`<p class="askok">Yes: ${kind==='h'?'sharing equally → a number that divides both exactly → HCF.':'repeating until they match → a multiple of both → LCM.'}</p>`,
    then:()=>askOne(api,{id:'cpT',label:'<b>Step 2:</b> work it out.',w:6,right:ans,
      traps:[[kind==='h'?L:H,kind==='h'?'That is the LCM. Sharing into identical groups needs the HCF.':'That is the HCF. Waiting for things to line up again needs the LCM.'],[a*b,kind==='h'?'Too big: you need a number that divides both exactly.':`${a} × ${b} works, but it is not the first time they line up. Look for the lowest common multiple.`]],
      hint:kind==='h'?`Find the HCF of ${a} and ${b}.`:`Find the LCM of ${a} and ${b}.`,
      then:()=>askOne(api,{id:'cpT2',label:`<b>Step 3:</b> ${q2}`,w:6,right:a2,hint:kind==='h'?'Divide by the number of groups.':'Divide by how often it happens.',
        ok:`${kind==='h'?`HCF(${a}, ${b}) = ${H}`:`LCM(${a}, ${b}) = ${L}`}, and the answer is ${a2}.`,bad:`${kind==='h'?`HCF(${a}, ${b}) = ${H}`:`LCM(${a}, ${b}) = ${L}`}. The answer is ${a2}.`,
        work:[`${a} = ${pfs(PF(a))}, ${b} = ${pfs(PF(b))}`,kind==='h'?`HCF = ${pfs(fMin([PF(a),PF(b)]))} = ${H}`:`LCM = ${pfs(fMax([PF(a),PF(b)]))} = ${L}`,`${q2.replace(/\?$/,'')}: ${a2}`]})})})},

 bonus(api){const h=pick([2,4,6,8]),pr=shuffle([[2,3],[3,4],[2,5],[3,5],[4,5],[5,6],[3,7],[2,7]].filter(([x,y])=>gcdN(x,y)===1))[0],[x,y]=pr,a=h*x,b=h*y,L=h*x*y;
  api.q(cpBan('THE VIP ROOM','Secret level')+mmRoom(`"Welcome, clever one. I am <b>2</b>, the Mastermind. Here is my riddle: I know two numbers. Their <b>HCF is ${h}</b> and their <b>LCM is ${L}</b>. One of them is <b>${a}</b>. What is the other?"`));
  askOne(api,{id:'mmR',w:6,right:b,traps:[[L/a,`${L} ÷ ${a} = ${L/a}, but check: is the HCF of ${a} and ${L/a} equal to ${h}?`],[L/h,`Close: try using HCF × LCM = first number × second number.`]].filter(([v])=>v!==b),
    hint:'For any two numbers, HCF × LCM = the first number × the second number.',
    ok:`"Correct! ${h} × ${L} = ${h*L} = ${a} × ${b}. The HCF and LCM always multiply to the same as the two numbers."`,bad:`"The other number is ${b}: ${h} × ${L} = ${a} × ${b}."`,work:[`HCF × LCM = ${h} × ${L} = ${h*L}`,`${h*L} ÷ ${a} = ${b}`,`Check: HCF(${a}, ${b}) = ${gcdN(a,b)}, LCM = ${lcm2(a,b)}`]})}});
const x0=(a,b)=>`${a} and ${b}`;
/* Secondary 1 order: Prime Bouncer, then the two Club Prime games */
['s1-tables','s1-split'].forEach(id=>{ORDER.splice(ORDER.indexOf(id),1);ORDER.splice(ORDER.indexOf('s1-bouncer')+1,0,id)});
