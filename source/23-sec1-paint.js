/* ---------- Sec 1 · Qubi's Paint Shop (ratio) ----------
   Customers bring a paint swatch and a recipe, and the recipe is a ratio. The order IS the question.
   A wrong amount gets poured: the tin fills with the colour that answer would make, next to the swatch ("too yellow!").
   8 customers per game: 7 question types (share a tin, one colour already poured, same shade, fraction of the tin,
   ml and L label, recipe in cups, coverage rate + recipe) plus one repeat. Every type at Core, Stretch and Challenge;
   only the numbers get harder. Two- and three-step customers: a step opens only when the step before is right.
   Two misses on a step show Qubi's hint and the working. Units, not parts (model method wording).
   Answers in simplest form: unsimplified fractions get a retry; improper fractions count, with a tip on presentation.
   Misconceptions from Lee Peng Yee, Teaching Secondary School Mathematics, Ch 1 (ratio and rate, part-part vs part-whole).
   Secret bonus (Solo, 80%+): Mural Rush, pour exactly the right number of cups before the school bell. */
document.head.insertAdjacentHTML('beforeend',`<style>
.rpshop{position:relative;max-width:760px;width:100%;margin:0 auto;height:230px;border:3px solid #16233a;border-radius:18px;overflow:hidden;color:#16233a;box-sizing:border-box;
  background:linear-gradient(#fbe3c4 0 66%,#a26b43 66% 70%,#c98b5a 70%)}
@media (max-width:480px){.rpshop{height:236px}}
.rpshelf{position:absolute;left:0;right:0;height:34px;display:flex;gap:6px;padding:0 10px;align-items:flex-end;justify-content:center;border-bottom:6px solid #8c5a36;overflow:hidden}
.rpshelf i{width:20px;height:24px;border:2px solid #16233a;border-radius:3px 3px 5px 5px;display:block;flex:none;position:relative}
.rpshelf i:before{content:'';position:absolute;left:2px;right:2px;top:-6px;height:5px;border:2px solid #16233a;border-bottom:0;border-radius:6px 6px 0 0}
.rpshelf.s1{top:8px}.rpshelf.s2{top:56px}
.rpsign{position:absolute;right:10px;top:96px;font:700 12px var(--display);background:#16233a;color:#ffd257;border-radius:8px;padding:2px 8px;transform:rotate(3deg)}
.rpcust{position:absolute;bottom:42px;left:3%;width:clamp(62px,15vw,84px);z-index:3;transition:transform .7s cubic-bezier(.3,1.3,.5,1)}
.rpcust svg{display:block;width:100%;height:auto}
.rpcust.in{animation:rpwalk .9s cubic-bezier(.3,1.3,.5,1) both}
@keyframes rpwalk{from{transform:translateX(-170%) rotate(-6deg)}70%{transform:translateX(6%) rotate(3deg)}}
.rpcust .m{display:none}.rpcust .m0{display:inline}.rpcust.happy .m0,.rpcust.sad .m0{display:none}.rpcust.happy .m1{display:inline}.rpcust.sad .m2{display:inline}
.rpcust.happy{animation:rphop .5s ease 2}@keyframes rphop{50%{transform:translateY(-10px)}}
.rpcust em{position:absolute;left:50%;transform:translateX(-50%);bottom:-16px;font:800 10px var(--body);font-style:normal;color:#fff;background:#16233a;border-radius:99px;padding:0 6px;white-space:nowrap}
.rpbub{position:absolute;left:2%;top:8px;max-width:min(40%,250px);background:#fff;border:2.5px solid #16233a;border-radius:14px;padding:4px 10px;font:700 12.5px/1.3 var(--body);z-index:4;box-shadow:2px 3px 0 #16233a33}
.rpbub:after{content:'';position:absolute;left:22px;bottom:-11px;border:6px solid transparent;border-top:8px solid #16233a}
.rpbub.pop{animation:rpbpop .35s cubic-bezier(.3,1.6,.5,1)}@keyframes rpbpop{from{transform:scale(.6);transform-origin:left bottom}}
.rpsw{position:absolute;bottom:44px;left:calc(3% + clamp(62px,15vw,84px) + 4px);width:46px;background:#fff;border:2.5px solid #16233a;border-radius:6px;padding:3px 3px 1px;z-index:3;transform:rotate(-5deg);text-align:center;transition:transform .4s}
.rpsw i{display:block;height:34px;border-radius:3px;border:1.5px solid #16233a33}
.rpsw b{display:block;font:800 8.5px/1.4 var(--body);letter-spacing:.04em}
.rpsw.cmp{transform:rotate(0) scale(1.12)}
.rptinw{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);width:88px;z-index:2}
.rptin{position:relative;height:96px;border:3px solid #16233a;border-radius:6px 6px 12px 12px;background:linear-gradient(90deg,#d5dbe3,#f4f6f8 40%,#c3cad4);overflow:hidden}
.rptin .fill{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column-reverse}
.rptin .fill i{display:block;height:0;transition:height .9s cubic-bezier(.4,1.2,.5,1)}
.rptin .mix{position:absolute;left:0;right:0;bottom:0;opacity:0;transition:opacity .9s,height .6s,background .4s}
.rptin .mix.on{opacity:1}
.rptin .mix.on:before{content:'';position:absolute;left:50%;top:10%;width:36px;height:36px;margin-left:-18px;border-radius:50%;border:3px solid #ffffff66;border-left-color:transparent;animation:rpspin .9s linear 2}
@keyframes rpspin{to{transform:rotate(360deg)}}
.rplid{height:10px;margin:0 -4px -3px;border:3px solid #16233a;border-radius:6px;background:#9aa5b4;position:relative;z-index:1}
.rptinw em{display:block;width:max-content;margin:3px auto 0;font:800 10px var(--body);font-style:normal;color:#16233a;border-radius:99px;padding:0 6px}
.rptinw em.yours{background:#de3f46;color:#fff}
.rpqb{position:absolute;right:3%;bottom:26px;width:clamp(56px,13vw,74px);z-index:3}
.rpqb svg{width:100%;height:auto;display:block}
.rpqb em{position:absolute;left:50%;transform:translateX(-50%);bottom:-12px;font:800 10px var(--body);font-style:normal;color:#16233a;background:#ffd257;border-radius:99px;padding:0 6px;white-space:nowrap}
.rpfx{position:absolute;inset:0;pointer-events:none;z-index:6;overflow:hidden}
.rpfx span{position:absolute;bottom:60px;font:800 14px var(--body);background:#fff;border:2px solid #16233a;border-radius:14px;padding:2px 9px;white-space:nowrap;animation:rpup 2.2s ease-out both}
@keyframes rpup{from{transform:translateY(20px) scale(.6);opacity:0}15%{opacity:1;transform:none}to{transform:translateY(-120px);opacity:0}}
.rpticket{position:relative;max-width:760px;width:100%;margin:14px auto 0;box-sizing:border-box;background:#fffdf5;color:#16233a;border:2.5px solid #16233a;border-radius:6px;padding:10px 14px 12px;box-shadow:4px 5px 0 #16233a22;animation:rpslide .6s cubic-bezier(.3,1.3,.5,1) both}
.rpticket:before{content:'';position:absolute;left:-2.5px;right:-2.5px;top:-9px;height:9px;background:radial-gradient(circle at 6px 9px,transparent 5px,#16233a 5.5px,#16233a 6.5px,#fffdf5 7px) 0 0/12px 9px repeat-x}
@keyframes rpslide{from{transform:translateY(20px) rotate(-2deg);opacity:0}}
.rpticket small{display:block;font:900 10px var(--body);letter-spacing:.14em;text-transform:uppercase;color:#ef5240}
.rpticket p{margin:4px 0 0;font:600 1.05rem/1.45 var(--body)}
.rpticket b{font-weight:900;white-space:nowrap}
.rpchip{display:inline-block;width:.85em;height:.85em;border-radius:3px;border:1.5px solid #16233a;vertical-align:-.08em;margin-right:3px}
.rpstep{background:var(--surface);color:var(--ink);border:2.5px solid var(--ink);border-radius:16px;padding:12px 14px;display:grid;gap:8px;transition:opacity .3s}
.rpstep.locked{opacity:.5;border-style:dashed}.rpstep.done{border-color:var(--good)}
.rpstep h3{margin:0;font:800 12px var(--body);letter-spacing:.1em;text-transform:uppercase;color:var(--muted);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.rpstep h3 span{background:var(--ink);color:var(--bg);border-radius:99px;padding:0 8px;letter-spacing:.04em}
.rpstep.done h3 span{background:var(--good);color:#fff}
.rpstep .q{margin:0;font:700 1.08rem/1.4 var(--body)}
.rpans{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.rpans input{font:700 1.2rem var(--display);width:5.2em;padding:6px 8px;border:2.5px solid var(--ink);border-radius:10px;background:var(--bg);color:var(--ink);text-align:center;min-width:0}
.rpans input.r{width:3.4em}
.rpans .colon{font:700 1.5rem var(--display)}.rpans .unit{font:800 1.05rem var(--body)}
.rpans .fm{flex:1 1 100%;order:9;font:700 12px var(--body);color:var(--muted)}
.rpfrac{display:inline-flex;flex-direction:column;align-items:center;gap:3px}.rpfrac hr{width:100%;border:0;border-top:3px solid var(--ink);margin:0}
.rpans.ok input{border-color:var(--good)}
.rpans.no input{animation:rpshake .4s}@keyframes rpshake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.rpfb{margin:0;font:700 .98rem/1.4 var(--body);min-height:1.4em}.rpfb.good{color:var(--good)}.rpfb.bad{color:var(--bad)}
.rphint,.rprev{border-radius:12px;padding:8px 12px;font:600 .98rem/1.45 var(--body);display:grid;gap:6px}
.rphint{background:color-mix(in srgb,var(--sun) 22%,var(--surface));border:2px solid var(--sun)}
.rprev{background:color-mix(in srgb,var(--violet) 12%,var(--surface));border:2px solid var(--violet)}
.rphint>b:first-child,.rprev>b:first-child{font:900 11px var(--body);letter-spacing:.1em;text-transform:uppercase}
.rpbar{display:grid;gap:2px;max-width:100%;overflow-x:auto;padding-bottom:2px}
.rpbar .boxes{display:flex;gap:3px}
.rpbar .boxes i{flex:none;width:34px;height:26px;border:2px solid #16233a;border-radius:4px;animation:rpbox .35s cubic-bezier(.3,1.5,.5,1) both}
@keyframes rpbox{from{transform:scale(.3);opacity:0}}
.rpbar .brace{display:flex;gap:3px;font:800 12px var(--body);text-align:center}.rpbar .brace span{border-top:3px solid currentColor;padding-top:1px}
.rpmc{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}
.rpmc button{border:2.5px solid var(--ink);border-radius:14px;background:var(--surface);color:var(--ink);padding:8px 6px 6px;cursor:pointer;display:grid;gap:4px;justify-items:center;font:700 1.2rem var(--display)}
.rpmc button:hover:not(:disabled){transform:translateY(-2px)}
.rpmc .can{width:44px;height:44px;border:2.5px solid #16233a;border-radius:4px 4px 9px 9px;background:linear-gradient(90deg,#d5dbe3,#f4f6f8 40%,#c3cad4);position:relative;overflow:hidden}
.rpmc .can i{position:absolute;inset:auto 0 0;height:0;transition:height .7s}
.rpmc button.right{border-color:var(--good);box-shadow:0 0 0 3px var(--good)}.rpmc button.wrong{border-color:var(--bad);opacity:.6}
.rpmc small{font:800 11px var(--body);color:var(--muted)}
.rppour{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.rppb{border:2.5px solid #16233a;border-radius:12px;padding:6px 12px;font:800 15px var(--body);cursor:pointer;color:#16233a;min-height:44px}
.rptimer{height:10px;border-radius:99px;background:var(--soft);overflow:hidden;width:100%;max-width:420px;margin:0 auto}
.rptimer i{display:block;height:100%;background:linear-gradient(90deg,var(--bad),var(--sun),var(--good));transition:width .2s linear}
@media (prefers-reduced-motion:reduce){.rpshop *,.rpticket,.rpstep *{animation:none!important;transition:none!important}}
</style>`);

const RPPAINT={blue:[34,104,214],yellow:[255,206,40],red:[226,48,62],white:[250,248,242]};
const rpCss=c=>`rgb(${c.map(Math.round).join(',')})`;
function rpMix(c1,c2,a,b){const w=a/(a+b);return c1.map((v,i)=>Math.exp(w*Math.log(Math.max(v,10))+(1-w)*Math.log(Math.max(c2[i],10))))}
const rp3=x=>Math.round(x*1000)/1000,rpF=n=>String(rp3(n)),rpSame=(x,y)=>Math.abs(x-y)<1e-6,rpProp=(p,q)=>rpSame(p[0]*q[1],p[1]*q[0]);
const rpGcd=(a,b)=>{a=Math.round(Math.abs(a));b=Math.round(Math.abs(b));while(b){[a,b]=[b,a%b]}return a};
const rpChip=p=>`<span class="rpchip" style="background:${rpCss(RPPAINT[p])}"></span>${p}`;
const RPFR=[[1/2,'½'],[1/4,'¼'],[3/4,'¾'],[1/3,'⅓'],[2/3,'⅔'],[1/5,'⅕'],[2/5,'⅖'],[3/5,'⅗'],[4/5,'⅘']];
function rpFrac(x){for(const [v,s] of RPFR)if(rpSame(v,x))return s;const w=Math.floor(x+1e-9),f=x-w;if(w&&f>1e-6)for(const [v,s] of RPFR)if(rpSame(v,f))return w+s;return rpF(x)}
function rpNice(x){if(Number.isInteger(x))return String(x);for(let q=2;q<=100;q++){const p=Math.round(x*q);if(rpSame(p/q,x)){const w=Math.floor(p/q),r=p-w*q,g=rpGcd(r,q);return (w?w+' ':'')+(r/g)+'/'+(q/g)}}return rpF(x)}
/* reads 12, 2.5, 5/2 or 2 1/2. form 'ok' = whole number, decimal, proper fraction or mixed number in simplest form */
function rpParse(raw){const t=String(raw).trim().replace(/[^0-9.\/\s-]/g,'').replace(/\s+/g,' ').trim();if(!t)return {v:NaN};
  let m=t.match(/^(\d+) (\d+)\/(\d+)$/);if(m){const w=+m[1],p=+m[2],q=+m[3];if(!q)return {v:NaN};return {v:w+p/q,form:(p<q&&p>0&&rpGcd(p,q)===1)?'ok':(p>=q?'improper':'unsimp')}}
  m=t.match(/^(\d+)\/(\d+)$/);if(m){const p=+m[1],q=+m[2];if(!q)return {v:NaN};if(rpGcd(p,q)!==1)return {v:p/q,form:'unsimp'};if(q===1||p>q)return {v:p/q,form:'improper'};return {v:p/q,form:'ok'}}
  if(/^\d*\.?\d+$|^\d+\.$/.test(t))return {v:+t,form:'ok'};return {v:NaN}}
const RPPEOPLE={
  lim:{n:'Mrs Lim',skin:'#f1c9a5',shirt:'#5f50ec',hair:'#2b2b2b',bun:1},
  arjun:{n:'Arjun',skin:'#a86b45',shirt:'#ef5240',hair:'#1b1b1b'},
  raj:{n:'Coach Raj',skin:'#8d5a3b',shirt:'#0b968b',hair:'#1b1b1b',cap:'#ffb81f'},
  tan:{n:'Mr Tan',skin:'#f0c7a0',shirt:'#3f7bd6',hair:'#888',glasses:1},
  siti:{n:'Auntie Siti',skin:'#c99a72',shirt:'#e0559a',scarf:'#12985a'},
  weiling:{n:'Wei Ling',skin:'#f3cfae',shirt:'#ffb81f',hair:'#3a2a1f',pony:1},
  ong:{n:'Grandpa Ong',skin:'#eec39b',shirt:'#8a6b4f',hair:'#ddd',glasses:1,bald:1},
  kaur:{n:'Ms Kaur',skin:'#c58c62',shirt:'#5f50ec',hair:'#1b1b1b',bun:1}};
function rpPerson(p){
  const back=p.scarf?`<path d="M13,46 Q13,7 40,7 Q67,7 67,46 L68,70 Q40,80 12,70Z" fill="${p.scarf}" stroke="#16233a" stroke-width="2.5"/>`:'';
  const hair=p.scarf?'':p.bald?`<path d="M20,34 Q22,28 26,30 M60,34 Q58,28 54,30" stroke="${p.hair}" stroke-width="5" stroke-linecap="round" fill="none"/>`
    :`<path d="M20,36 Q18,12 40,12 Q62,12 60,36 Q52,24 40,25 Q28,24 20,36Z" fill="${p.hair}" stroke="#16233a" stroke-width="2.5"/>`+(p.bun?`<circle cx="40" cy="9" r="7" fill="${p.hair}" stroke="#16233a" stroke-width="2.5"/>`:'')+(p.pony?`<path d="M58,26 Q72,34 64,52" stroke="${p.hair}" stroke-width="7" stroke-linecap="round" fill="none"/>`:'');
  const cap=p.cap?`<path d="M19,28 Q20,10 40,10 Q60,10 61,28Z" fill="${p.cap}" stroke="#16233a" stroke-width="2.5"/><path d="M58,27 L74,29" stroke="#16233a" stroke-width="4" stroke-linecap="round"/>`:'';
  const gl=p.glasses?`<g fill="none" stroke="#16233a" stroke-width="2"><circle cx="32" cy="38" r="6"/><circle cx="48" cy="38" r="6"/><path d="M38,38h4"/></g>`:'';
  return `<svg viewBox="0 0 80 130" aria-hidden="true"><rect x="26" y="98" width="11" height="28" rx="5" fill="#16233a"/><rect x="43" y="98" width="11" height="28" rx="5" fill="#16233a"/>
  <path d="M14,104 Q14,64 40,62 Q66,64 66,104Z" fill="${p.shirt}" stroke="#16233a" stroke-width="2.5"/><path d="M64,74 Q76,82 72,94" stroke="${p.shirt}" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="72" cy="95" r="5" fill="${p.skin}" stroke="#16233a" stroke-width="2"/>
  ${back}<circle cx="40" cy="38" r="22" fill="${p.skin}" stroke="#16233a" stroke-width="2.5"/>${hair}${cap}
  <circle cx="32" cy="38" r="2.6" fill="#16233a"/><circle cx="48" cy="38" r="2.6" fill="#16233a"/>${gl}
  <circle cx="27" cy="47" r="3.5" fill="#ff8fa3" opacity=".6"/><circle cx="53" cy="47" r="3.5" fill="#ff8fa3" opacity=".6"/>
  <path class="m m0" d="M34,50 Q40,53 46,50" stroke="#16233a" stroke-width="2.5" fill="none" stroke-linecap="round"/><path class="m m1" d="M32,48 Q40,59 48,48Z" fill="#16233a"/><path class="m m2" d="M34,53 Q40,47 46,53" stroke="#16233a" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`}
function rpBar(a,b,c1,c2,lab,brace){
  const box=(n,c)=>Array.from({length:n},(_,i)=>`<i style="background:${rpCss(RPPAINT[c])};animation-delay:${i*50}ms"></i>`).join(''),w=n=>`flex:none;width:${n*34+(n-1)*3}px`;
  const br=brace==='all'?`<div class="brace"><span style="${w(a+b)}">${lab}</span></div>`:brace==='a'?`<div class="brace"><span style="${w(a)}">${lab}</span></div>`:'';
  return `<div class="rpbar"><div class="boxes">${box(a,c1)}${box(b,c2)}</div>${br}</div>`}
const rpS=n=>n>1?'s':'';

/* ---------- question generators: one per type, every level (T = 0 Core, 1 Stretch, 2 Challenge) ---------- */
function rpShare(T){const L=(c,s,ch)=>[c,s,ch][T];
  const [a,b]=pick(L([[3,2],[1,4],[2,3],[1,2],[3,1]],[[5,3],[4,5],[7,2],[3,5],[5,4]],[[5,3],[4,5],[7,3],[3,5],[5,7]]));
  const p=pick(L([2,3,4,5],[3,4,6,7,8,12],[1.5,2.5,0.75,1.25])),Tot=rp3((a+b)*p);
  return {who:'lim',c1:'blue',c2:'yellow',a,b,amt:[a*p,b*p],shade:'Sea Green',hello:'Hi! Can you mix my Sea Green?',
   order:`I need <b>${rpF(Tot)} L</b> of Sea Green paint. The recipe is <b>${rpChip('blue')} : ${rpChip('yellow')} = ${a} : ${b}</b>.`,
   steps:[{q:`How many litres is <b>1 unit</b>?`,kind:'num',unit:'L',ans:p,
     hint:`Draw the tin as a bar: ${a} blue unit${rpS(a)} and ${b} yellow unit${rpS(b)}. All the units together hold ${rpF(Tot)} L. Every unit holds the same amount.`+rpBar(a,b,'blue','yellow',rpF(Tot)+' L','all'),
     reveal:`${a} + ${b} = ${a+b} units. 1 unit = ${rpF(Tot)} ÷ ${a+b} = <b>${rpF(p)} L</b>`,
     traps:[[v=>rpSame(v,Tot/a)||rpSame(v,Tot/b),`You divided by one colour's units only. The whole tin is blue and yellow together.`],[v=>rpSame(v,Tot/2)&&a+b!==2,`Units are not halves. Count all the units in the recipe.`]]},
    {q:`How many litres of <b>blue</b> paint go into the tin?`,kind:'num',unit:'L',ans:a*p,
     hint:`Blue takes ${a} of the units. Each unit holds the amount you found in step 1.`+rpBar(a,b,'blue','yellow','',''),
     reveal:`Blue = ${a} × ${rpF(p)} = <b>${rpF(a*p)} L</b> (yellow = ${b} × ${rpF(p)} = ${rpF(b*p)} L)`,
     mixOf:v=>v>0&&v<Tot?[v,Tot-v]:null,
     traps:[[v=>rpSame(v,p)&&a>1,`That is just 1 unit. Blue has ${a} units.`],[v=>rpSame(v,b*p),`That is the yellow paint. The question asks for blue.`]]}]}}
function rpPart(T){const L=(c,s,ch)=>[c,s,ch][T];
  const [a,b]=pick(L([[3,2],[2,1],[3,4],[2,5],[4,3]],[[5,3],[4,7],[7,4],[5,8],[6,5]],[[5,3],[4,7],[7,4],[5,8],[3,8]]));
  const p=pick(L([2,3,4],[3,4,5,6,9],[0.5,1.5,2.5,0.4])),X=rp3(a*p);
  return {who:'arjun',c1:'red',c2:'yellow',a,b,amt:[a*p,b*p],shade:'Sunset Orange',hello:'I started mixing but I need help!',
   order:`I've already poured <b>${rpF(X)} L of red</b> into my tin. The recipe for Sunset Orange is <b>${rpChip('red')} : ${rpChip('yellow')} = ${a} : ${b}</b>. I want exactly that shade.`,
   steps:[{q:`How many litres is <b>1 unit</b>?`,kind:'num',unit:'L',ans:p,
     hint:`The red paint fills the red units only. ${a} red unit${rpS(a)} hold ${rpF(X)} L together.`+rpBar(a,b,'red','yellow',rpF(X)+' L','a'),
     reveal:`${a} units = ${rpF(X)} L, so 1 unit = ${rpF(X)} ÷ ${a} = <b>${rpF(p)} L</b>`,
     traps:[[v=>rpSame(v,X/(a+b)),`${rpF(X)} L is only the red paint, not the whole tin. Share it among the red units only.`]]},
    {q:`How many litres of <b>yellow</b> paint must Arjun add?`,kind:'num',unit:'L',ans:b*p,
     hint:`Yellow takes ${b} units, and each unit holds the amount from step 1.`+rpBar(a,b,'red','yellow','',''),
     reveal:`Yellow = ${b} × ${rpF(p)} = <b>${rpF(b*p)} L</b>`,mixOf:v=>v>0?[X,v]:null,
     traps:[[v=>rpSame(v,X+(b-a)),`Ratios don't work by adding or taking away. ${a} : ${b} means each colour is a number of equal units, so multiply.`],[v=>rpSame(v,X),`Equal amounts would be 1 : 1, but the recipe is ${a} : ${b}.`],[v=>rpSame(v,(a+b)*p),`That is the whole tin. The question asks for yellow only.`]]}]}}
function rpShade(T){const L=(c,s,ch)=>[c,s,ch][T];
  const base=pick(L([[3,2],[2,1],[1,3],[3,4],[2,5]],[[3,5],[4,7],[5,2],[2,7],[5,6]],[[3,2],[4,3],[5,2],[3,4],[2,5]]));
  const k=pick(L([2,3],[3,4,5,6],[0.2,0.3,0.4,0.6])),lab=[rp3(base[0]*k),rp3(base[1]*k)],st=T===2?0.2:1;
  const cand=[[base[1],base[0]],[rp3(lab[0]+2*st),rp3(lab[1]+2*st)],[rp3(lab[0]-st),rp3(lab[1]-st)],[base[0]+1,base[1]+1],[base[0],base[1]+1],[base[0]+1,base[1]]].filter(c=>c[0]>0&&c[1]>0&&!rpProp(c,base));
  const seen=new Set([base.join(':')]),opts=[];for(const c of cand){const key=c.join(':');if(!seen.has(key)){seen.add(key);opts.push(c)}if(opts.length===3)break}
  opts.push(base);const sh=shuffle(opts);
  return {who:'raj',c1:'blue',c2:'yellow',a:base[0],b:base[1],amt:base,shade:'Field Green',hello:'Our team needs more Field Green!',
   order:`Our team colour, Field Green, is mixed <b>${rpChip('blue')} : ${rpChip('yellow')} = ${rpF(lab[0])} : ${rpF(lab[1])}</b>. I want a can from your shelf in the <b>exact same shade</b>.`,
   steps:[{q:`Which can on the shelf is the <b>exact same shade</b>? Each can shows its blue : yellow recipe.`,kind:'mc',opts:sh,ans:base,
     hint:`Same shade means the recipe was scaled: <b>both</b> numbers multiplied or divided by the <b>same</b> number. Adding the same amount to both does not keep the shade. Also check the order: blue comes first.`,
     reveal:`${rpF(lab[0])} : ${rpF(lab[1])}: divide both by ${rpF(k)} to get <b>${base[0]} : ${base[1]}</b>`}]}}
function rpWhole(T){let x,y,ans,amtTxt,step1;
  if(T===0){[x,y]=pick([[1,3],[3,5],[2,5],[1,4],[3,4],[2,3]]);ans=[x,x+y];
    amtTxt=`My Sky Blue is mixed <b>${rpChip('blue')} : ${rpChip('white')} = ${x} : ${y}</b>.`;
    step1={q:`How many units make up the <b>whole tin</b>?`,kind:'num',unit:'units',ans:x+y,
      hint:`Draw the tin as a bar. Count every unit, blue and white.`+rpBar(x,y,'blue','white','whole tin','all'),
      reveal:`${x} + ${y} = <b>${x+y} units</b>`,traps:[[v=>rpSame(v,y),`That is only the white paint. The tin holds blue and white.`]]}}
  else{[x,y]=pick(T===1?[[6,9],[4,10],[8,12],[6,10],[9,12]]:[[1.5,2.5],[0.6,0.9],[1.2,0.8],[2.25,0.75],[0.9,1.5]]);
    const X=Math.round(x*100),Tt=Math.round((x+y)*100),G=rpGcd(X,Tt);ans=[X/G,Tt/G];
    amtTxt=`I mixed <b>${rpF(x)} L of ${rpChip('blue')}</b> with <b>${rpF(y)} L of ${rpChip('white')}</b> for my Sky Blue.`;
    step1={q:`How many litres of paint are in the <b>whole tin</b>?`,kind:'num',unit:'L',ans:rp3(x+y),
      hint:`The whole tin is the blue paint and the white paint together.`,
      reveal:`${rpF(x)} + ${rpF(y)} = <b>${rpF(x+y)} L</b>`,traps:[[v=>rpSame(v,y),`That is only the white paint.`]]}}
  const g2=rpGcd(Math.round(x*100),Math.round(y*100)),wrong=[Math.round(x*100)/g2,Math.round(y*100)/g2];
  const right=Math.random()<.4,claim=right?ans:wrong,ct=`${claim[0]}/${claim[1]}`,at=`${ans[0]}/${ans[1]}`;
  return {who:'tan',c1:'blue',c2:'white',a:x,b:y,amt:[x,y],shade:'Sky Blue',hello:'Quick question about my Sky Blue.',
   order:`${amtTxt} My grandson says <b>${ct} of the tin is blue</b>. Is he right?`,
   steps:[step1,
    {q:`What fraction of the whole tin is <b>blue</b>? Give it in simplest form.`,kind:'frac',ans,
     hint:`A fraction of the tin compares one colour with the <b>whole</b> tin. ${T===2?'Make both numbers whole first (multiply top and bottom by 10 or 100). ':''}Then divide top and bottom by a common factor.`,
     reveal:T===0?`Blue is ${x} out of ${x+y} units, so <b>${at}</b> of the tin is blue.`:`Blue ÷ whole tin = ${rpF(x)}/${rpF(x+y)} = <b>${at}</b>`,
     traps:[[v=>rpProp(v,wrong),`That compares blue with white. A fraction of the tin is blue out of the whole tin.`]]},
    {q:`So, is Mr Tan's grandson right that <b>${ct}</b> of the tin is blue?`,kind:'mc',yn:true,opts:['Yes, he is right','No, he is wrong'],ans:right?0:1,
     hint:`Compare his fraction with the fraction you worked out in step 2.`,
     reveal:right?`<b>Yes.</b> Blue is ${at} of the whole tin, just as he said.`:`<b>No.</b> ${ct} compares blue with white, which is the ratio. Blue is <b>${at}</b> of the whole tin.`,
     good:right?`Yes! He got it right: ${at} of the tin is blue.`:`Right, he is wrong. ${ct} compares blue with white. Blue is ${at} of the whole tin.`}]}}
function rpUnits(T){
  const [A,uA,B,uB,s]=pick([
    [[500,'ml',1,'L',[1,2]],[500,'ml',1.5,'L',[1,3]],[500,'ml',2,'L',[1,4]],[250,'ml',1,'L',[1,4]],[200,'ml',1,'L',[1,5]]],
    [[750,'ml',1,'L',[3,4]],[600,'ml',1.5,'L',[2,5]],[750,'ml',1.25,'L',[3,5]],[400,'ml',1.2,'L',[1,3]],[900,'ml',1.5,'L',[3,5]]],
    [[1.2,'L',450,'ml',[8,3]],[1.5,'L',400,'ml',[15,4]],[0.6,'L',750,'ml',[4,5]],[2.4,'L',900,'ml',[8,3]],[1.75,'L',500,'ml',[7,2]]]][T]);
  const Lv=uA==='L'?A:B,whichL=uA==='L'?'red':'white',mlA=uA==='L'?A*1000:A,mlB=uB==='L'?B*1000:B;
  return {who:'siti',c1:'red',c2:'white',a:s[0],b:s[1],amt:s,shade:'Rose Pink',hello:'Can you read my old tin?',
   order:`My old tin of Rose Pink says <b>${rpChip('red')} ${rpF(A)} ${uA} : ${rpChip('white')} ${rpF(B)} ${uB}</b>. Please write the recipe as a ratio in simplest form so I can mix it again.`,
   steps:[{q:`The units don't match yet. Change <b>${rpF(Lv)} L</b> of ${whichL} into millilitres.`,kind:'num',unit:'ml',ans:Lv*1000,
     hint:`1 L = 1000 ml. Multiply the litres by 1000.`,reveal:`${rpF(Lv)} L × 1000 = <b>${rpF(Lv*1000)} ml</b>`,traps:[[v=>rpSame(v,Lv*100),`1 L is 1000 ml, not 100 ml.`]]},
    {q:`Write <b>red : white</b> in simplest form.`,kind:'ratio',ans:s,
     hint:`Now both are in ml: ${rpF(mlA)} : ${rpF(mlB)}. Divide both numbers by the same number, again and again, until no common factor is left.`,
     reveal:`${rpF(mlA)} : ${rpF(mlB)} = <b>${s[0]} : ${s[1]}</b>`,
     traps:[[v=>rpProp(v,[A,B])&&!rpProp(s,[A,B]),`Those numbers came from different units. Use the ml values from step 1.`],[v=>rpProp(v,[s[1],s[0]]),`Red comes first in the recipe, then white.`]]}]}}
function rpCups(T){
  const [p,q,s]=pick([
    [[0.5,0.75,[2,3]],[0.5,1,[1,2]],[0.25,0.75,[1,3]],[0.75,0.5,[3,2]],[0.25,0.5,[1,2]]],
    [[2/3,0.5,[4,3]],[1/3,0.5,[2,3]],[0.4,0.5,[4,5]],[1.5,2,[3,4]],[0.75,2/3,[9,8]]],
    [[0.75,0.5,[3,2]],[1.25,0.75,[5,3]],[0.4,0.6,[2,3]],[2.5,1.5,[5,3]],[1.2,0.8,[3,2]]]][T]);
  const P=T===2?rpF(p):rpFrac(p),Q=rpFrac(q),m=pick([[2,3,4],[2,3,5],[1.5,2.5,3]][T]),Tot=rp3((s[0]+s[1])*m);
  return {who:'weiling',c1:'red',c2:'yellow',a:s[0],b:s[1],amt:[s[0]*m,s[1]*m],shade:'Mango Orange',hello:"It's Grandma's recipe!",
   order:`Grandma's Mango Orange recipe is <b>${P} cup ${rpChip('red')} : ${Q} cup ${rpChip('yellow')}</b>. I need <b>${rpF(Tot)} L</b> of it for my bedroom.`,
   steps:[{q:`Write <b>red : yellow</b> as whole numbers in simplest form.`,kind:'ratio',ans:s,
     hint:`Multiply <b>both</b> amounts by the same number so that neither has a fraction or decimal left. Then check whether the two whole numbers share a common factor.`,
     reveal:`${P} : ${Q} = <b>${s[0]} : ${s[1]}</b>`,traps:[[v=>rpProp(v,[s[1],s[0]]),`Red comes first in the recipe.`]]},
    {q:`How many litres of <b>yellow</b> does Wei Ling need for ${rpF(Tot)} L?`,kind:'num',unit:'L',ans:s[1]*m,
     hint:`Use your whole-number ratio: ${s[0]} + ${s[1]} units make ${rpF(Tot)} L. Find 1 unit first.`+rpBar(s[0],s[1],'red','yellow',rpF(Tot)+' L','all'),
     reveal:`1 unit = ${rpF(Tot)} ÷ ${s[0]+s[1]} = ${rpF(m)} L. Yellow = ${s[1]} × ${rpF(m)} = <b>${rpF(s[1]*m)} L</b>`,
     mixOf:v=>v>0&&v<Tot?[Tot-v,v]:null,traps:[[v=>rpSame(v,s[0]*m),`That is the red paint.`],[v=>rpSame(v,m),`That is 1 unit. Yellow has ${s[1]} units.`]]}]}}
function rpRate(T){const L=(c,s,ch)=>[c,s,ch][T];
  const [a,b]=pick(L([[1,2],[1,3],[2,3],[1,4]],[[2,3],[3,5],[2,5],[3,4]],[[2,3],[3,5],[2,5],[3,7]]));
  const cov=pick(L([4,5,6],[8,10,12],[7.5,12.5,6.4])),N=rp3((a+b)*pick(L([1,2],[1,2,3],[0.5,1.5]))),W=rp3(N*cov);
  return {who:'ong',c1:'blue',c2:'white',a,b,amt:[N*a/(a+b),N*b/(a+b)],shade:'Ocean Blue',hello:'My wall needs Ocean Blue.',
   order:`My living room wall is <b>${rpF(W)} m²</b>. One litre of paint covers <b>${rpF(cov)} m²</b>. I want Ocean Blue, mixed <b>${rpChip('blue')} : ${rpChip('white')} = ${a} : ${b}</b>.`,
   steps:[{q:`How many litres of paint does the wall need altogether?`,kind:'num',unit:'L',ans:N,
     hint:`"${rpF(cov)} m² per litre" is a <b>rate</b>: it links two different things, area and paint. How many lots of ${rpF(cov)} m² fit into ${rpF(W)} m²?`,
     reveal:`${rpF(W)} ÷ ${rpF(cov)} = <b>${rpF(N)} L</b>`,traps:[[v=>rpSame(v,W*cov),`Check the units: m² × m² per litre doesn't give litres. Divide instead.`]]},
    {q:`How many litres of <b>blue</b> go into the mix?`,kind:'num',unit:'L',ans:rp3(N*a/(a+b)),
     hint:`Now it's a <b>ratio</b>: it compares two amounts of paint. ${a} + ${b} units make ${rpF(N)} L.`+rpBar(a,b,'blue','white',rpF(N)+' L','all'),
     reveal:`1 unit = ${rpF(N)} ÷ ${a+b} = ${rpF(N/(a+b))} L. Blue = ${a} × ${rpF(N/(a+b))} = <b>${rpF(N*a/(a+b))} L</b>`,
     mixOf:v=>v>0&&v<N?[v,N-v]:null,traps:[[v=>rpSame(v,N*a/b),`${a} : ${b} means ${a} units out of ${a+b}, not ${a} out of ${b}.`]]}]}}
const RPGEN={share:rpShare,part:rpPart,shade:rpShade,whole:rpWhole,units:rpUnits,cups:rpCups,rate:rpRate};
/* Ask Qubi hints (nudge, method, worked example), never the answer to the customer's own question */
const RPH={
 share:['How many units are in the whole tin? Add both numbers in the recipe.','Total amount ÷ total units = 1 unit. Then multiply by the units of the colour asked for.','Example: 10 L at 3 : 2 → 5 units, 1 unit = 2 L, so the first colour is 3 × 2 = 6 L.'],
 part:['The amount already poured belongs to ONE colour only. Which units does it fill?','Amount poured ÷ that colour\'s units = 1 unit. Then multiply by the other colour\'s units.','Example: 6 L of red at red : yellow = 3 : 4 → 1 unit = 2 L, yellow = 4 × 2 = 8 L.'],
 shade:['Same shade means the same ratio. Which can is a scaled copy of the recipe?','Divide (or multiply) BOTH numbers by the same number. Adding the same to both changes the shade.','Example: 8 : 6 → divide both by 2 → 4 : 3. So 4 : 3 is the same shade, but 9 : 7 is not.'],
 whole:['A fraction of the tin compares one colour with the WHOLE tin, not with the other colour.','Fraction = that colour\'s units ÷ total units, then simplify.','Example: red : white = 2 : 3 → 5 units in all, so 2/5 of the tin is red (2/3 is the ratio).'],
 units:['A ratio only works when both amounts use the same unit.','Change litres to millilitres first (× 1000), then simplify.','Example: 250 ml : 1 L → 250 : 1000 → divide both by 250 → 1 : 4.'],
 cups:['Make both amounts whole numbers first. What can you multiply both by?','Multiply both by the same number to clear the fractions or decimals, then simplify.','Example: ½ : ¼ → × 4 → 2 : 1.'],
 rate:['Two different things here: a rate (m² per litre) and a ratio (blue : white).','Use the rate first to find how much paint, then the ratio to share it.','Example: 24 m² at 6 m² per litre → 4 L. At 1 : 3, 1 unit = 1 L.']};

/* ---------- the round ---------- */
function rpRound(api,R){
  const P=RPPEOPLE[R.who],shelf=k=>Array.from({length:18},(_,i)=>`<i style="background:${['#226ad6','#ffce28','#e2303e','#faf8f2','#0b968b','#e0559a','#5f50ec','#ff8a3d','#45d08a','#8a6b4f','#9be7c4','#16233a'][(i*5+k)%12]}"></i>`).join('');
  api.q(`<div class="rpshop"><div class="rpshelf s1">${shelf(0)}</div><div class="rpshelf s2">${shelf(3)}</div><div class="rpsign">MIX BAR</div>
    <div class="rpbub" id="rpBub">${R.hello}</div><div class="rpcust in" id="rpCust">${rpPerson(P)}<em>${P.n}</em></div>
    <div class="rpsw" id="rpSw"><i style="background:${rpCss(rpMix(RPPAINT[R.c1],RPPAINT[R.c2],R.a,R.b))}"></i><b>${R.shade.toUpperCase()}</b></div>
    <div class="rptinw"><div class="rplid"></div><div class="rptin"><div class="fill"><i id="rpL1"></i><i id="rpL2"></i></div><div class="mix" id="rpMix"></div></div><em id="rpTinL">Mixing tin</em></div>
    <div class="rpqb">${QB()}<em>Qubi</em></div><div class="rpfx" id="rpFx"></div></div>
    <div class="rpticket"><small>Order from ${P.n}</small><p>${R.order}</p></div>`);
  if(ctx)ctx.rpCur=R;
  const S={i:0,miss:0,reveals:0,cleanSteps:0,busy:false};
  const say=t=>{const b=$('rpBub');if(!b)return;b.innerHTML=t;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')};
  const H=94,max=()=>(R.amt[0]+R.amt[1])*1.05;
  const setTin=(x,y,mx)=>{if(!$('rpL1'))return;$('rpMix').classList.remove('on');$('rpL1').style.height=(x/mx*H)+'px';$('rpL1').style.background=rpCss(RPPAINT[R.c1]);$('rpL2').style.height=(y/mx*H)+'px';$('rpL2').style.background=rpCss(RPPAINT[R.c2])};
  const stir=(x,y,mx)=>{const m=$('rpMix');if(!m)return;m.style.height=((x+y)/mx*H)+'px';m.style.background=rpCss(rpMix(RPPAINT[R.c1],RPPAINT[R.c2],x,y));api.later(()=>m.classList.add('on'),950)};
  const empty=()=>{if(!$('rpL1'))return;$('rpMix').classList.remove('on');$('rpL1').style.height=0;$('rpL2').style.height=0;$('rpTinL').classList.remove('yours');$('rpTinL').textContent='Mixing tin'};
  const cust=c=>{const e=$('rpCust');if(!e)return;e.classList.remove('in','happy','sad');void e.offsetWidth;if(c)e.classList.add(c)};
  const inp=(s,k)=>s.kind==='num'?`<input id="rpIn${k}" inputmode="text" autocomplete="off" aria-label="answer"><span class="unit">${s.unit}</span>${s.unit!=='units'?'<small class="fm">Simplest form: a whole number, a decimal, or a fraction or mixed number in lowest terms</small>':''}`
    :s.kind==='ratio'?`<input class="r" id="rpIn${k}a" inputmode="decimal" autocomplete="off" aria-label="first number"><span class="colon">:</span><input class="r" id="rpIn${k}b" inputmode="decimal" autocomplete="off" aria-label="second number">`
    :`<span class="rpfrac"><input class="r" id="rpIn${k}a" inputmode="numeric" autocomplete="off" aria-label="numerator"><hr><input class="r" id="rpIn${k}b" inputmode="numeric" autocomplete="off" aria-label="denominator"></span>`;
  api.body.innerHTML=R.steps.map((s,k)=>`<div class="rpstep${k?' locked':''}" id="rpSt${k}"><h3><span>Step ${k+1}</span>${k?`<em class="lk" style="font-style:normal">Opens when step ${k} is right</em>`:''}</h3>
    <p class="q">${s.q}${s.kind==='num'&&s.unit!=='units'?' Give your answer in simplest form.':''}</p>
    ${s.kind==='mc'?`<div class="rpmc" id="rpMc${k}">${s.opts.map((o,j)=>s.yn?`<button data-j="${j}" style="font-size:1.05rem;padding:12px 8px">${o}</button>`:`<button data-j="${j}"><span class="can"><i></i></span>${rpF(o[0])} : ${rpF(o[1])}<small>blue : yellow</small></button>`).join('')}</div><div class="row"><button class="btn" id="rpHb${k}">Hint</button></div>`
     :`<div class="rpans" id="rpAn${k}">${inp(s,k)}<button class="btn primary" id="rpCk${k}">Check</button><button class="btn" id="rpHb${k}">Hint</button></div>`}
    <p class="rpfb" id="rpFb${k}" aria-live="polite"></p><div class="rphint" id="rpHi${k}" hidden></div><div class="rprev" id="rpRv${k}" hidden></div></div>`).join('');
  const lock=(k,on)=>{const st=$('rpSt'+k);st.classList.toggle('locked',on);st.querySelectorAll('input,button').forEach(e=>e.disabled=on);if(!on){const l=st.querySelector('.lk');if(l)l.remove()}};
  const freeze=k=>$('rpSt'+k).querySelectorAll('input,.rpans button,.rpmc button').forEach(e=>e.disabled=true);
  const showHint=k=>{const h=$('rpHi'+k);h.hidden=false;h.innerHTML=`<b>Qubi's hint</b><div>${R.steps[k].hint}</div>`};
  const cans=k=>{const s=R.steps[k];if(s.yn)return;$('rpMc'+k).querySelectorAll('button').forEach((b,j)=>{const o=s.opts[j],i=b.querySelector('i');i.style.background=rpCss(rpMix(RPPAINT.blue,RPPAINT.yellow,o[0],o[1]));i.style.height='100%';if(rpSame(o[0],s.ans[0])&&rpSame(o[1],s.ans[1]))b.classList.add('right')})};
  const wrongMix=(x,y)=>{const mx=Math.max(x+y,R.amt[0]+R.amt[1])*1.05;S.busy=true;setTin(x,y,mx);stir(x,y,mx);$('rpTinL').textContent='Your mix';$('rpTinL').classList.add('yours');
    const t=R.a/(R.a+R.b),col=x/(x+y)>t?R.c1:R.c2;api.later(()=>{$('rpSw').classList.add('cmp');say(`Look at my swatch! That would come out too ${col}.`)},1000);
    api.later(()=>{empty();$('rpSw').classList.remove('cmp');S.busy=false},2900)};
  const next=k=>{if(k<R.steps.length-1){S.i=k+1;S.miss=0;api.later(()=>{lock(k+1,false);const f=$('rpSt'+(k+1)).querySelector('input');if(f)f.focus({preventScroll:true});$('rpSt'+(k+1)).scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})},450);say(pick(['Good, keep going!','Yes, that\'s it.','Nice. Now the next bit.']));return}
    finish()};
  const finish=()=>{const [x,y]=R.amt,mx=max(),clean=S.reveals===0;S.busy=true;setTin(x,y,mx);stir(x,y,mx);
    api.later(()=>{$('rpSw').classList.add('cmp');cust('happy');say(clean?'Perfect match! Thank you!':'That matches. Thanks for showing me how!');
      const f=$('rpFx');if(f){const s=document.createElement('span');s.textContent=clean?'★ Perfect match':'Matched';s.style.left='38%';f.appendChild(s)}},1100);
    const work=R.steps.map((s,k)=>`Step ${k+1}: ${s.reveal}`);
    api.later(()=>api.done(clean,clean?`${P.n} is delighted: a perfect ${R.shade}!`:`${P.n} got the right shade in the end. Qubi had to show ${S.reveals===1?'one step':'some steps'}, so read the working below.`,work,clean?10:(S.cleanSteps?3:0),{noRetry:1}),1700)};
  const check=(k,mcVal,btn)=>{if(api.answered||S.busy||k!==S.i)return;const s=R.steps[k],fb=$('rpFb'+k);
    let v,ok,near=false,tip='';
    if(s.kind==='mc')v=mcVal;else if(s.kind==='num')v=rpParse($('rpIn'+k).value).v;else v=[rpParse($('rpIn'+k+'a').value).v,rpParse($('rpIn'+k+'b').value).v];
    if(s.kind!=='mc'&&(s.kind==='num'?isNaN(v):v.some(isNaN))){fb.className='rpfb bad';fb.textContent=s.kind==='num'?'Type a number first.':'Fill in both boxes first.';return}
    if(s.kind==='num'){ok=rpSame(v,s.ans);const f=rpParse($('rpIn'+k).value).form;
      if(ok&&f==='unsimp'){fb.className='rpfb bad';fb.textContent='That is the right amount, but the fraction is not in simplest form. Simplify it, or write it as a decimal.';return}
      if(ok&&f==='improper')tip=`Correct! Next time, present it as ${rpNice(s.ans)} ${s.unit}${Number.isInteger(s.ans)?'':' or '+rpF(s.ans)+' '+s.unit}. Answers are usually written as a whole number, a mixed number or a decimal.`}
    else if(s.yn)ok=v===s.ans;
    else{ok=rpSame(v[0],s.ans[0])&&rpSame(v[1],s.ans[1]);near=!ok&&s.kind!=='mc'&&rpProp(v,s.ans)}
    if(ok){fb.className='rpfb good';fb.textContent=tip||s.good||pick(['Spot on!','Exactly right.','Perfect.','Yes!']);sfx.pop();
      $('rpSt'+k).classList.add('done');if($('rpAn'+k))$('rpAn'+k).classList.add('ok');if(btn){btn.classList.add('right');cans(k)}
      freeze(k);if(S.miss<2)S.cleanSteps++;if(s.mixOf){const [x,y]=s.mixOf(s.ans);setTin(x,y,max())}next(k);return}
    if(near){fb.className='rpfb bad';fb.textContent=s.kind==='frac'?'That is the right size, but it is not in simplest form yet. Divide top and bottom by a common factor.':'Same shade, but it can be simpler. Divide both numbers by a common factor.';return}
    S.miss++;sfx.no();const an=$('rpAn'+k);if(an){an.classList.remove('no');void an.offsetWidth;an.classList.add('no')}
    if(btn){btn.classList.add('wrong');btn.disabled=true}
    const trap=(s.traps||[]).find(t=>t[0](v));cust('sad');api.later(()=>cust(''),1600);
    if(s.mixOf&&s.kind==='num'&&s.mixOf(v))wrongMix(...s.mixOf(v));else say(pick(['Hmm, are you sure?','That doesn\'t look right to me.','Can you check that again?']));
    if(S.miss>=2){fb.className='rpfb bad';fb.textContent=trap?trap[1]:'Not quite.';showHint(k);S.reveals++;freeze(k);if(btn)cans(k);
      const r=$('rpRv'+k);r.hidden=false;r.innerHTML=`<b>Here's how</b><div>${s.reveal}</div><div class="row"><button class="btn primary" id="rpGo${k}">${k<R.steps.length-1?'Got it, open step '+(k+2):'Got it, finish the order'}</button></div>`;
      $('rpGo'+k).onclick=()=>{$('rpGo'+k).disabled=true;sfx.tap();if(s.mixOf){const [x,y]=s.mixOf(s.ans);setTin(x,y,max())}next(k)}}
    else{fb.className='rpfb bad';fb.textContent=(trap?trap[1]+' ':'Not quite. ')+'Try once more, or tap Hint.'}};
  R.steps.forEach((s,k)=>{$('rpHb'+k).onclick=()=>{sfx.tap();showHint(k);if(ctx)ctx.hint=1};
    if(s.kind==='mc')$('rpMc'+k).querySelectorAll('button').forEach(b=>b.onclick=()=>check(k,s.yn?+b.dataset.j:s.opts[+b.dataset.j],b));
    else{$('rpCk'+k).onclick=()=>check(k);$('rpAn'+k).querySelectorAll('input').forEach(i=>i.onkeydown=e=>{if(e.key==='Enter')check(k)})}
    if(k)lock(k,true)})}

const RPFIRST='share',RPREST=['part','shade','whole','units','cups','rate'];
addGame('s1-ratio',{level:'Sec 1',sec:'s1',strand:'num',glyph:'🎨',music:'paint',title:'Qubi’s Paint Shop',topic:'Ratio',
 how:'Customers bring a swatch and a recipe, and the recipe is a ratio. Work out each order step by step to mix the exact shade. A wrong amount gets poured, so you can see the colour come out wrong. Core, Stretch and Challenge have the same question types with harder numbers.',rounds:8,
 round(api,r){const T=TIER();if(r===0||!ctx.rpPlan){ctx.rpPlan=[RPFIRST,...shuffle([...RPREST]),pick(['share','part','cups','rate'])]}
  const t=ctx.rpPlan[r];try{(QHINTS['s1-ratio']=QHINTS['s1-ratio']||[])[r]=RPH[t]}catch(e){}
  rpRound(api,RPGEN[t](T))},
 bonus(api){const T=TIER(),[a,b]=pick([[[3,4],[2,3],[1,4]],[[3,5],[5,4],[2,7]],[[5,7],[4,9],[7,6]]][T]),m=pick([[3,4,5],[4,5,6],[5,6,7]][T]),Tot=(a+b)*m,DUR=60;
  const P=RPPEOPLE.kaur,col=rpCss(rpMix(RPPAINT.blue,RPPAINT.yellow,a,b));
  api.q(`<div class="cpban" style="background:radial-gradient(circle at 50% 0,#0b968b,#123 75%)">🎨 MURAL RUSH 🎨<small>Secret level</small></div>
    <div class="rpshop"><div class="rpshelf s1"></div><div class="rpsign" style="top:20px">MIX BAR</div><div class="rpbub" id="rpBub">Rush order for the school mural!</div><div class="rpcust in" id="rpCust">${rpPerson(P)}<em>${P.n}</em></div>
    <div class="rpsw" id="rpSw"><i style="background:${col}"></i><b>MURAL GREEN</b></div>
    <div class="rptinw"><div class="rplid"></div><div class="rptin"><div class="fill"><i id="rpL1"></i><i id="rpL2"></i></div><div class="mix" id="rpMix"></div></div><em id="rpTinL">Mixing tin</em></div><div class="rpqb">${QB()}<em>Qubi</em></div></div>
    <div class="rpticket"><small>Secret order · ${P.n}</small><p>The whole class is painting a mural today. I need exactly <b>${Tot} cups</b> of Mural Green, mixed <b>${rpChip('blue')} : ${rpChip('yellow')} = ${a} : ${b}</b>. Pour the cups before the bell rings!</p></div>`);
  api.body.innerHTML=`<div class="rptimer"><i id="rpT" style="width:100%"></i></div>
    <div class="rppour"><button class="rppb" style="background:${rpCss(RPPAINT.blue)};color:#fff" data-c="x" data-n="1">+1 blue</button><button class="rppb" style="background:${rpCss(RPPAINT.blue)};color:#fff" data-c="x" data-n="5">+5 blue</button><button class="rppb" style="background:${rpCss(RPPAINT.yellow)}" data-c="y" data-n="1">+1 yellow</button><button class="rppb" style="background:${rpCss(RPPAINT.yellow)}" data-c="y" data-n="5">+5 yellow</button></div>
    <p style="margin:0;text-align:center;font:800 1.1rem var(--body)" id="rpBc">Blue 0 cups · Yellow 0 cups · Total 0</p>
    <div class="row" style="justify-content:center"><button class="btn" id="rpBu">Empty the tin</button><button class="btn primary" id="rpBd">Deliver</button></div><p class="rpfb" id="rpBf" aria-live="polite"></p>`;
  let x=0,y=0;const t0=Date.now(),mx=Tot*1.4;
  const upd=()=>{$('rpBc').textContent=`Blue ${x} cups · Yellow ${y} cups · Total ${x+y}`;$('rpL1').style.height=(x/mx*94)+'px';$('rpL1').style.background=rpCss(RPPAINT.blue);$('rpL2').style.height=(y/mx*94)+'px';$('rpL2').style.background=rpCss(RPPAINT.yellow);
    const m=$('rpMix');if(x+y){m.style.height=Math.min(94,(x+y)/mx*94)+'px';m.style.background=rpCss(rpMix(RPPAINT.blue,RPPAINT.yellow,x||.001,y||.001));m.classList.add('on')}else m.classList.remove('on')};
  api.body.querySelectorAll('.rppb').forEach(bn=>bn.onclick=()=>{if(api.answered)return;sfx.pop();if(bn.dataset.c==='x')x+=+bn.dataset.n;else y+=+bn.dataset.n;upd()});
  $('rpBu').onclick=()=>{if(api.answered)return;sfx.tap();x=0;y=0;upd()};
  const work=[`${a} + ${b} = ${a+b} units = ${Tot} cups, so 1 unit = ${Tot} ÷ ${a+b} = ${m} cups`,`Blue = ${a} × ${m} = ${a*m} cups, yellow = ${b} × ${m} = ${b*m} cups`];
  const end=win=>{api.body.querySelectorAll('button').forEach(e=>e.disabled=true);const left=Math.max(0,DUR-Math.round((Date.now()-t0)/1000));
    if(win){const c=$('rpCust');if(c)c.classList.add('happy');$('rpSw').classList.add('cmp')}
    api.done(win,win?`Mural saved with ${left} seconds to spare! Exactly ${a*m} cups of blue and ${b*m} cups of yellow.`:`The bell rang! Ms Kaur needed ${a*m} cups of blue and ${b*m} cups of yellow.`,work,undefined,{noRetry:1})};
  $('rpBd').onclick=()=>{if(api.answered)return;if(x===a*m&&y===b*m)return end(true);sfx.no();const f=$('rpBf');f.className='rpfb bad';
    f.textContent=x+y!==Tot?`Ms Kaur needs ${Tot} cups altogether. You have ${x+y}.`:`${Tot} cups, but the colour is too ${x/(x+y)>a/(a+b)?'blue':'yellow'}. Check the swatch.`;
    $('rpSw').classList.add('cmp');api.later(()=>$('rpSw').classList.remove('cmp'),900)};
  const tick=()=>{if(api.answered)return;const left=DUR-(Date.now()-t0)/1000;$('rpT').style.width=Math.max(0,left/DUR*100)+'%';if(left<=0)return end(false);api.later(tick,200)};tick()}});
