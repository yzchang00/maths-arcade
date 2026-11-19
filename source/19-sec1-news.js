/* ---------- Sec 1 · Fake News Desk (percentage) ----------
   Pupils work the news desk of "The Daily Percent", with Editor Qubi. Reporters rush in with percentage headlines.
   Each round: 1) stamp it TRUE or FAKE on a gut feeling, 2) investigate with a hands-on tool (price machines,
   unit bars, a sale bar, a chart, twin calculators), 3) the evidence decides: publish, or restamp a wrong guess.
   Reader trust rises and falls with your calls. The misconceptions come from Lee Peng Yee, Teaching Secondary School
   Mathematics (Ch 1 percentage true/false list; Ch 22 "B is 25% more than A, so A is 25% less than B").
   Secret bonus (Solo, 80%+): stop a viral fake post before it reaches a million shares. */
document.head.insertAdjacentHTML('beforeend',`<style>
.fnroom{position:relative;max-width:760px;width:100%;margin:0 auto;border:3px solid #16233a;border-radius:18px;overflow:hidden;background:linear-gradient(#cfe0f5 0 62%,#8a6b4f 62%);color:#16233a;box-sizing:border-box}
.fnmast{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 12px;background:#16233a;color:#fff;padding:6px 12px}
.fnmast b{font:700 clamp(1rem,4.4vw,1.35rem) Georgia,'Times New Roman',serif;letter-spacing:.06em}
.fntr{display:flex;align-items:center;gap:8px;font:800 12px var(--body)}.fntr span{display:block;width:clamp(70px,22vw,140px);height:10px;border-radius:99px;background:#ffffff33;overflow:hidden}
.fntr i{display:block;height:100%;background:linear-gradient(90deg,#ef5240,#ffb81f,#45d08a);background-size:140px 100%;transition:width .9s cubic-bezier(.3,1.4,.5,1)}
.fntick{position:relative;height:20px;background:#ef5240;color:#fff;font:800 12px/20px var(--body);white-space:nowrap;overflow:hidden}
.fntick span{position:absolute;left:0;top:0;padding-left:100%;animation:fntick 26s linear infinite}@keyframes fntick{to{transform:translateX(-100%)}}
.fndesk{position:relative;height:200px}@media (max-width:600px){.fndesk{height:178px}}
.fnwin{position:absolute;right:4%;top:10px;width:22%;height:44%;border:3px solid #16233a;border-radius:6px;background:linear-gradient(#7fc4ff,#d9f0ff);overflow:hidden}
.fnwin:before{content:'';position:absolute;left:0;right:0;bottom:0;height:45%;background:repeating-linear-gradient(90deg,#5b6b8a 0 14px,#46556f 14px 22px,transparent 22px 26px)}
.fnrep{position:absolute;bottom:12px;left:2%;width:clamp(56px,13vw,74px);transition:left .9s cubic-bezier(.3,1.3,.5,1);z-index:3}.fnrep svg{width:100%;height:auto;display:block}
.fnrep.in{animation:fnrun .9s cubic-bezier(.3,1.3,.5,1) both}@keyframes fnrun{from{transform:translateX(-160%) rotate(-8deg)}70%{transform:translateX(8%) rotate(4deg)}}
.fnrep .m,.fnrep .e2,.fnrep .tear{display:none}.fnrep .m0{display:inline}.fnrep.happy .m0{display:none}.fnrep.happy .m1{display:inline}.fnrep.sad .m0{display:none}.fnrep.sad .m2,.fnrep.sad .tear{display:inline}
.fnrep em{position:absolute;left:50%;transform:translateX(-50%);bottom:-13px;font:800 10px var(--body);font-style:normal;color:#fff;background:#16233a;border-radius:99px;padding:0 6px;white-space:nowrap}
.fned{position:absolute;bottom:10px;right:3%;width:clamp(54px,12vw,70px);z-index:3}.fned svg{width:100%;height:auto}
.fned em{position:absolute;left:50%;transform:translateX(-50%);bottom:-12px;font:800 10px var(--body);font-style:normal;color:#16233a;background:#ffd257;border-radius:99px;padding:0 6px;white-space:nowrap}
.fnpaper{position:absolute;left:50%;bottom:14px;width:min(52%,330px);transform:translateX(-50%) rotate(-1.5deg);background:#fffdf5;color:#16233a;border:2.5px solid #16233a;border-radius:6px;padding:8px 12px 10px;box-shadow:4px 5px 0 #0003;z-index:2;animation:fnslide .7s .55s cubic-bezier(.3,1.3,.5,1) both}
@keyframes fnslide{from{transform:translate(-160%,30px) rotate(-14deg);opacity:0}}
.fnpaper small{display:block;font:800 9px var(--body);letter-spacing:.14em;color:#ef5240}
.fnpaper h3{margin:2px 0 3px;font:700 clamp(.88rem,3.4vw,1.08rem)/1.2 Georgia,'Times New Roman',serif;color:#16233a}
.fnpaper p{margin:0;font:600 clamp(.68rem,2.6vw,.8rem)/1.3 var(--body);color:#3b4558}
.fnpaper.pub{animation:fnpub .8s cubic-bezier(.3,1.4,.5,1) both}@keyframes fnpub{40%{transform:translateX(-50%) rotate(2deg) scale(1.08)}}
.fnstamp{position:absolute;right:-12px;top:-18px;background:#fffdf5;font:900 clamp(.85rem,3.4vw,1.15rem) var(--body);letter-spacing:.08em;padding:2px 8px;border:4px solid currentColor;border-radius:8px;transform:rotate(-14deg);opacity:0;pointer-events:none}
.fnstamp.t{color:#0b968b}.fnstamp.f{color:#de3f46}.fnstamp.on{animation:fnslam .45s cubic-bezier(.2,1.6,.5,1) both}.fnstamp.draft{opacity:.55!important;border-style:dashed}
@keyframes fnslam{from{opacity:0;transform:rotate(-14deg) scale(3)}to{opacity:.92;transform:rotate(-14deg) scale(1)}}
.fnstamp.x:after{content:'';position:absolute;left:-6px;right:-6px;top:50%;height:4px;background:#16233a;transform:rotate(-8deg)}
.fnfeed{position:absolute;inset:0;pointer-events:none;z-index:5;overflow:hidden}
.fnfeed span{position:absolute;bottom:20px;font:800 13px var(--body);background:#fff;color:#16233a;border:2px solid #16233a;border-radius:14px;padding:3px 9px;white-space:nowrap;animation:fnup 2.6s ease-out both}
@keyframes fnup{from{transform:translateY(20px) scale(.6);opacity:0}15%{opacity:1;transform:translateY(0) scale(1)}to{transform:translateY(-150px);opacity:0}}
.fnstamps{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.fnsb{font:900 1.15rem var(--body);letter-spacing:.06em;min-width:130px;padding:12px 18px;border-radius:14px;border:3px solid currentColor;background:var(--surface);cursor:pointer;box-shadow:3px 4px 0 currentColor;transition:transform .15s}
.fnsb.t{color:#0b968b}.fnsb.f{color:#de3f46}.fnsb:hover:not(:disabled){transform:translateY(-2px) rotate(-2deg)}.fnsb:disabled{opacity:.45;cursor:default}.fnsb.pick{opacity:1;background:currentColor}.fnsb.pick b{color:#fff}
.fnsb b{color:inherit}
.fnlab{display:grid;gap:10px;justify-items:center;width:100%;max-width:700px;margin:0 auto;background:var(--surface);color:var(--ink);border:2.5px solid var(--ink);border-radius:16px;padding:12px;box-sizing:border-box}
.fnlab h4{margin:0;font:800 13px var(--body);letter-spacing:.08em;text-transform:uppercase;opacity:.75}
.fnline{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:6px}
.fntag{font:700 1.15rem var(--display);background:#ffd257;color:#16233a;border:2.5px solid #16233a;border-radius:8px 18px 18px 8px;padding:4px 12px 4px 18px;position:relative;transition:transform .5s}
.fntag:before{content:'';position:absolute;left:6px;top:50%;width:7px;height:7px;margin-top:-4px;border-radius:50%;background:#fff;border:2px solid #16233a}
.fntag.hop{animation:fnhop .6s ease}@keyframes fnhop{40%{transform:translateY(-14px) scale(1.12)}}
.fnmach{font:800 15px var(--body);color:#fff;background:#5f50ec;border:2.5px solid #16233a;border-radius:10px;padding:6px 10px;position:relative}
.fnmach.dn{background:#de3f46}.fnmach.on{animation:fnbuzz .5s ease-in-out infinite alternate;outline:3px solid #ffd257}.fnmach.ok:after{content:'✓';position:absolute;right:-8px;top:-10px;background:#45d08a;color:#16233a;border:2px solid #16233a;border-radius:50%;width:20px;height:20px;font-size:12px;display:grid;place-items:center}
@keyframes fnbuzz{to{transform:translateY(-2px) rotate(1deg)}}
.fnarr{font:900 18px var(--body);opacity:.5}
.fnbars{display:grid;gap:5px;width:100%;max-width:560px}.fnbr{display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center;gap:8px;font:800 12px var(--body)}
.fnbr div{height:22px;border-radius:6px;position:relative;background:#00000010}.fnbr i{display:block;height:100%;border-radius:6px;transition:width .8s cubic-bezier(.3,1.3,.5,1)}
.fnbr.s i{background:repeating-linear-gradient(45deg,#9aa6ba 0 6px,#b8c2d4 6px 12px)}.fnbr.n i{background:linear-gradient(90deg,#ffb81f,#ff8a3d)}
.fnbr b{position:absolute;right:6px;top:2px;font:800 12px var(--body);color:var(--ink)}
.fnu{display:flex;gap:3px;min-height:34px;align-items:stretch;flex-wrap:wrap}
.fnu i{width:clamp(30px,7vw,46px);height:32px;border:2.5px solid #16233a;border-radius:6px;display:grid;place-items:center;font:800 11px var(--body);font-style:normal;color:#16233a;animation:ftin .35s cubic-bezier(.3,1.5,.5,1) both}
.fnu.a i{background:#b9b2ff}.fnu.b i{background:#ffc79a}.fnu i.ex{background:#ffd257}
.fnurow b{font-size:13px}.fnurow{display:grid;grid-template-columns:minmax(52px,auto) minmax(0,1fr);align-items:center;gap:8px;width:100%;max-width:560px;font:800 15px var(--body)}
.fnsale{display:flex;width:100%;max-width:600px;border:2.5px solid #16233a;border-radius:8px;overflow:hidden}
.fnsale i{flex:1;min-width:0;height:40px;display:grid;place-items:center;font:800 clamp(9px,2.2vw,12px) var(--body);font-style:normal;color:#16233a;border-right:2px solid #16233a;background:#fff;transition:background .4s}
.fnsale i:last-child{border-right:0}.fnsale i.paid{background:#9be7c4}.fnsale i.off{background:repeating-linear-gradient(45deg,#ffd6d2 0 6px,#fff 6px 12px)}.fnsale i.lit{background:#ffd257}
.fnsale i.big{flex:100}.fnsale i.sm{flex:9;background:#ffc79a}
.fnbrace{display:flex;width:100%;max-width:600px;font:800 13px var(--body);text-align:center}.fnbrace span{border-top:3px solid currentColor;padding-top:2px;margin:0 2px}
.fnchart{display:flex;align-items:flex-end;justify-content:center;gap:clamp(18px,8vw,60px);height:170px;width:100%;max-width:420px;border-bottom:3px solid var(--ink);position:relative;padding-top:6px}
.fnchart .c{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;width:clamp(60px,18vw,90px)}
.fnchart .c i{display:block;width:100%;height:0;border:2.5px solid #16233a;border-bottom:0;border-radius:8px 8px 0 0;transition:height 1s cubic-bezier(.3,1.2,.5,1)}
.fnchart .c b{font:800 15px var(--body)}.fnchart .c small{font:700 11px var(--body);opacity:.75;position:absolute;bottom:-18px}
.fnchart .c:first-child i{background:#b9b2ff}.fnchart .c:last-child i{background:#ffb81f}
#fnSyP{grid-template-columns:1fr!important}#fnSyP .btn{font-size:1rem!important;text-align:left}
.fnppl{display:flex;flex-wrap:wrap;gap:4px}.fnppl i{width:clamp(11px,3vw,16px);height:clamp(11px,3vw,16px);border-radius:50%;border:2px solid #16233a;background:#fff;transition:background .3s,transform .3s}.fnppl i.on{background:#5f50ec}.fnppl i.ex{background:#ffb81f;transform:scale(1.2)}
.fncal{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.fncal div{min-width:140px;border:2.5px solid #16233a;border-radius:14px;padding:8px 12px;background:#16233a;color:#9be7c4;text-align:center;font:700 1.1rem var(--display);transition:transform .5s}
.fncal div small{display:block;color:#fff;font:800 11px var(--body);opacity:.8}.fncal div.flip{animation:fnflip .6s ease}@keyframes fnflip{50%{transform:rotateY(90deg)}}
.fnphone{max-width:360px;width:100%;box-sizing:border-box;margin:0 auto;background:#fff;color:#16233a;border:4px solid #16233a;border-radius:26px;padding:14px 14px 12px;box-shadow:0 12px 30px -10px #0006}
.fnphone .who{display:flex;align-items:center;gap:8px;font:800 14px var(--body)}.fnphone .who i{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#ff8a3d,#e0559a);display:block}
.fnphone p{font:600 15px/1.4 var(--body);margin:8px 0}.fnphone .sh{display:flex;justify-content:space-between;font:800 14px var(--body);color:#5b6475}
.fnphone .sh b{color:#de3f46;font-size:1.1rem}.fnphone .bar{height:8px;border-radius:99px;background:#eee;overflow:hidden;margin-top:6px}.fnphone .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffb81f,#de3f46)}
.fnphone.stop{border-color:#0b968b}.fnphone.viral{border-color:#de3f46;animation:fnshake .4s 3}@keyframes fnshake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
</style>`);
const fnR2=x=>Math.round(x*100)/100;
const fn$=x=>{x=fnR2(x);return '$'+(Number.isInteger(x)?x:x.toFixed(2))};
const fnPc=x=>+(+x).toFixed(2)+'%';
const FNREP=[['Rookie Ray','#3aa0ff'],['Gossip Gwen','#e0559a'],['Speedy Sam','#45d08a'],['Clickbait Kai','#ff8a3d'],['Hasty Hui Min','#5f50ec'],['Breaking Bala','#0b968b']];
const FNTICK='BREAKING · Kopi price war heats up · New MRT line opens early · Bubble tea up 20%?! · Durian season starts · Class 1E smashes recycling record · Hawker queue hits 2 hours · ';
/* reader trust from this game's results so far: right first time +7, helped +3, wrong −12 */
const fnTrust=()=>Math.max(5,Math.min(100,50+((ctx&&ctx.res)||[]).reduce((a,v)=>a+(v===2?7:v===1?3:-12),0)));
function fnScene(rep,head,sub,kick){const t=fnTrust();
  return `<div class="fnroom"><div class="fnmast"><b>📰 THE DAILY PERCENT</b><span class="fntr">Reader trust <span><i id="fnTr" style="width:${t}%"></i></span>${t}%</span></div>
   <div class="fntick" aria-hidden="true"><span>${FNTICK+FNTICK}</span></div>
   <div class="fndesk"><div class="fnwin"></div><div class="fnrep in" id="fnRep">${pbGuySvg(rep[1],0)}<em>${rep[0]}</em></div>
    <div class="fnpaper" id="fnPaper"><small>${kick||'EXCLUSIVE'}</small><h3>${head}</h3>${sub?`<p>${sub}</p>`:''}<span class="fnstamp" id="fnStamp"></span></div>
    <div class="fned">${QB()}<em>Editor Qubi</em></div><div class="fnfeed" id="fnFeed"></div></div></div>`}
function fnReact(good){const f=$('fnFeed');if(!f)return;const L=good?['👍 Great reporting!','❤️ Trusted source','👏 Facts checked','✅ Shared!','🧠 Smart!']:['😡 FAKE!','🤨 Fact-check this','👎 Unsubscribe','😤 Not true!','🙄 Clickbait'];
  shuffle(L).slice(0,4).forEach((t,i)=>setTimeout(()=>{if(!f.isConnected)return;const s=document.createElement('span');s.textContent=t;s.style.left=(6+i*22+Math.random()*6)+'%';f.appendChild(s);setTimeout(()=>s.remove(),2700)},i*260));
  const rp=$('fnRep');if(rp){rp.classList.remove('in','happy','sad');rp.classList.add(good?'happy':'sad')}
  const tr=$('fnTr');if(tr)setTimeout(()=>{tr.style.width=fnTrust()+'%';if(tr.parentNode&&tr.parentNode.nextSibling)tr.parentNode.nextSibling.textContent=fnTrust()+'%'},400)}
function fnStampOn(v,draft){const s=$('fnStamp');if(!s)return;s.className='fnstamp '+(v==='T'?'t':'f')+(draft?' draft':'');s.textContent=v==='T'?(draft?'TRUE?':'TRUE'):(draft?'FAKE?':'FAKE');void s.offsetWidth;s.classList.add('on')}
/* Step 1: a gut call before any working. Returns the call to then(v). */
function fnGut(api,then){const K=ctx.keep;
  api.body.insertAdjacentHTML('beforeend',`<div class="askwrap"><p class="asklab"><b>Step 1: your gut call.</b> Stamp the story <b>TRUE</b> or <b>FAKE</b>. Don't work it out yet: you'll check the facts next.</p>
   <div class="fnstamps" id="fnGut"><button class="fnsb t" data-v="T"><b>✅ TRUE</b></button><button class="fnsb f" data-v="F"><b>❌ FAKE</b></button></div><div id="fnGutM"></div></div>`);
  const go=v=>{K.gut=v;[...$('fnGut').children].forEach(b=>{b.disabled=true;if(b.dataset.v===v)b.classList.add('pick')});fnStampOn(v,true);
    $('fnGutM').innerHTML=`<p class="askok">You stamped it <b>${v==='T'?'TRUE':'FAKE'}?</b> in pencil. Editor Qubi: "Prove it before we print!"</p>`;then(v)};
  $('fnGut').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(api.answered||b.disabled)return;sfx.pop();go(b.dataset.v)});
  if(K.gut)go(K.gut)}
/* Last step: the evidence decides. A wrong gut call can be fixed by restamping (6 points);
   a wrong gut call AND a step that needed the answer shown loses the round. */
function fnVerdict(api,truth,why,work){const K=ctx.keep;if(Object.values(K).includes('pen'))K.pen=1;const T=truth?'T':'F',name=truth?'TRUE':'FAKE';
  const publish=(ok,msg,pts)=>{fnStampOn(T,false);const p=$('fnPaper');if(p){p.classList.remove('pub');void p.offsetWidth;p.classList.add('pub')}api.done(ok,msg,work,pts,{noRetry:1});fnReact(ok)};
  if(K.gut===T)return publish(true,`Your call was right: the headline is <b>${name}</b>. ${why}${K.pen?' (You needed some help along the way, so this round scores less.)':' Published! 🗞️'}`);
  api.body.insertAdjacentHTML('beforeend',`<div class="askwrap"><p class="asklab"><b>The evidence is in.</b> You stamped it ${K.gut==='T'?'TRUE':'FAKE'}?, but your working says something else. ${K.pen?'':'Restamp the story:'}</p><div class="fnstamps" id="fnRe"><button class="fnsb t" data-v="T"><b>✅ TRUE</b></button><button class="fnsb f" data-v="F"><b>❌ FAKE</b></button></div><div id="fnReM"></div></div>`);
  if(K.pen){[...$('fnRe').children].forEach(b=>b.disabled=true);const s=$('fnStamp');if(s)s.classList.add('x');return publish(false,`The headline is <b>${name}</b>. ${why} Gut calls are fine, but check before you print!`,0)}
  $('fnRe').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(api.answered)return;
    if(b.dataset.v!==T){sfx.no();b.disabled=true;$('fnReM').innerHTML=`<p class="askneed">Look at your working again. Does it match what the headline says?</p>`;K.pen=1;return}
    sfx.ok();b.classList.add('pick');publish(true,`Good detective work: the evidence fixed your first guess. The headline is <b>${name}</b>. ${why}`,6)})}

/* ---- Tool 1: the price machines. Pick a test price, feed it through each machine, then compare with the start. ---- */
function fnChain(api,o){const K=ctx.keep,steps=o.steps,fmt=v=>(v>0?'+':'−')+Math.abs(v)+'%';
  api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: price machines</h4><div class="fnline" id="fnLine"><span class="fntag" id="fnTag">$ ?</span>${steps.map((s,i)=>`<span class="fnarr">→</span><span class="fnmach${s<0?' dn':''}" id="fnM${i}">${fmt(s)}</span>`).join('')}</div>
    <div class="fnbars"><div class="fnbr s"><span>Start</span><div><i id="fnBs" style="width:0"></i><b id="fnBsv"></b></div></div><div class="fnbr n"><span>Now</span><div><i id="fnBn" style="width:0"></i><b id="fnBnv"></b></div></div></div></div>`);
  api.body.insertAdjacentHTML('beforeend',`<div class="askwrap"><p class="asklab"><b>Step 2:</b> pick a price to test the claim. Any price works: a good test is one easy to work with.</p><div class="choices" id="fnPick"></div></div>`);
  const vals=S=>{const v=[S];steps.forEach(p=>v.push(fnR2(v[v.length-1]*(1+p/100))));return v};
  const run=S=>{K.S=S;[...$('fnPick').children].forEach(b=>{b.disabled=true;if(+b.dataset.v===S)b.classList.add('ok')});
    const v=vals(S),mx=Math.max(...v)*1.08,bar=(i,x)=>{$(i).style.width=(x/mx*100)+'%';$(i+'v').textContent=fn$(x)};
    bar('fnBs',S);bar('fnBn',S);$('fnTag').textContent=fn$(S);
    const ask=i=>{if(i>=steps.length)return o.then(S,v);const m=$('fnM'+i);m.classList.add('on');const p=steps[i],naive=fnR2(v[i]+S*p/100);
      askOne(api,{id:'fnC'+i,label:`<b>Machine ${i+1} (${fmt(p)}):</b> ${fn$(v[i])} goes in. What comes out?`,pre:'<span class="askunit">$</span>',w:6,right:v[i+1],
        traps:[...(i&&Math.abs(naive-v[i+1])>.001?[[naive,`You took ${Math.abs(p)}% of the <b>starting</b> price. Each machine works on the price that comes <b>in</b>: ${Math.abs(p)}% of ${fn$(v[i])}.`]]:[]),[fnR2(v[i]*Math.abs(p)/100),`That is the ${p>0?'increase':'discount'} itself. Now ${p>0?'add it to':'take it away from'} ${fn$(v[i])}.`]],
        hint:`${Math.abs(p)}% of ${fn$(v[i])} = ${Math.abs(p)} ÷ 100 × ${fnR2(v[i])}. Then ${p>0?'add':'subtract'}.`,
        then:()=>{m.classList.remove('on');m.classList.add('ok');const t=$('fnTag');t.textContent=fn$(v[i+1]);t.classList.remove('hop');void t.offsetWidth;t.classList.add('hop');bar('fnBn',v[i+1]);sfx.tap();ask(i+1)}})};
    ask(0)};
  o.starts.forEach(S=>{const b=document.createElement('button');b.className='btn';b.dataset.v=S;b.innerHTML=`🏷️ ${fn$(S)}`;b.onclick=()=>{if(api.answered||b.disabled)return;sfx.pop();run(S)};$('fnPick').appendChild(b)});
  if(K.S)run(K.S)}
/* after the machines: compare the final price with the start, in two plain questions:
   higher, lower or the same? then: the change as a percentage of the start. ("Over 100%" claims ask "how many times as much?") */
function fnFinalPct(api,S,v,then,kind){const F=v[v.length-1],pc=fnR2(F/S*100),diff=fnR2(Math.abs(F-S)),chg=fnR2(diff/S*100);
  if(kind==='over')return askOne(api,{id:'fnCx',label:`<b>Last step:</b> the old price was ${fn$(S)} and the new price is ${fn$(F)}. The new price is how many times the old price?`,w:4,unit:'times',right:fnR2(F/S),
    traps:[[fnR2(F/S-1),`That is how many times the old price was <b>added</b>. Count the old price itself too: ${fn$(F)} ÷ ${fn$(S)}.`]],hint:`${fn$(F)} ÷ ${fn$(S)}`,then:()=>then(pc)});
  const dir=F>S+.001?'Higher':F<S-.001?'Lower':'The same';
  stepPick(api,{id:'fnCd',keepOrder:true,label:`<b>Compare:</b> it started at ${fn$(S)} and ended at ${fn$(F)}. Compared with the start, the final price is …`,options:['Higher','Lower','The same'],right:dir,pen:'fnCP',
    hint:()=>`Compare ${fn$(F)} with ${fn$(S)}.`,reveal:()=>`${fn$(F)} is ${dir==='The same'?'the same as':dir.toLowerCase()+' than'} ${fn$(S)}. Tap <b>${dir}</b> to carry on.`,
    okMsg:`<p class="askok">${dir==='The same'?`Yes: exactly back to ${fn$(S)}.`:`Yes: ${dir.toLowerCase()} by ${fn$(diff)}.`}</p>`,
    then:()=>{if(dir==='The same')return then(pc);
      askOne(api,{id:'fnCP',label:`<b>Last step:</b> the price is ${fn$(diff)} ${dir.toLowerCase()} than at the start. Write this change as a percentage of the starting price (${fn$(S)}).`,w:5,unit:`% ${dir==='Higher'?'more':'less'} than the start`,right:chg,
        traps:[...(Math.abs(diff-chg)>.001?[[diff,`${diff} is the change in <b>dollars</b>. As a percentage: ${fn$(diff)} ÷ ${fn$(S)} × 100%.`]]:[]),[pc,`${pc}% is the whole final price compared with the start. We only want the <b>change</b>: ${fn$(diff)} ÷ ${fn$(S)} × 100%.`]],
        hint:`${fn$(diff)} ÷ ${fn$(S)} × 100%`,then:()=>then(pc)})}})}
const FNSTUFF=[['🧋','a cup of bubble tea'],['👟','a pair of sneakers'],['🎮','a video game'],['🎧','a pair of earbuds'],['🎒','a school bag'],['⌚','a smart watch']];
function fnChainRound(api,T,kind){const [em,thing]=pick(FNSTUFF),rep=pick(FNREP);let steps,head,sub,truth,why;
  const starts=[[100,200,50],[80,120,250],[60,160,240]][T];
  if(kind==='back'){const a=pick([[10,20,50],[20,25,40],[15,30,35]][T]);steps=[a,-a];head=`${em} Price of ${thing} goes UP ${a}%, then DOWN ${a}%. "Back to the old price!"`;sub='Shoppers say: no harm done.'}
  else if(kind==='add'){const [a,b]=pick([[[10,10],[10,20],[20,10]],[[20,30],[10,15],[30,20]],[[15,20],[25,40],[40,15]]][T]);steps=[a,b];head=`${em} ${thing[0].toUpperCase()+thing.slice(1)} goes up ${a}%, then another ${b}%. "That's ${a+b}% more in total!"`;sub='Our reporter just added them.'}
  else if(kind==='down2'){const [a,b]=pick([[[50,20],[20,20],[40,10]],[[40,20],[30,30],[50,50]],[[35,20],[25,40],[60,25]]][T]);steps=[-a,-b];head=`🛍️ Great Singapore Sale: ${a}% off ${thing}, then an EXTRA ${b}% off at the till. "That's ${a+b}% off!"`;sub='Queues form outside the mall.'}
  else if(kind==='true25'){const [a,b]=pick([[[25,20],[100,50]],[[25,20],[100,50],[150,60]],[[150,60],[400,80],[25,20]]][T]);steps=[a,-b];head=`${em} ${thing[0].toUpperCase()+thing.slice(1)} goes up ${a}%, then down ${b}%. "Back to the old price!"`;sub='Is our reporter right this time?'}
  else if(kind==='double'){const [a,b]=pick([[[50,50],[60,40]],[[50,50],[40,40],[30,60]],[[40,40],[45,40],[30,60]]][T]);steps=[a,b];head=`📈 Shop rent goes up ${a}%, then up ${b}% the next year. "Rent has MORE than doubled!"`;sub='Shop owners are worried.'}
  else{const a=pick([[150,200],[150,200,300],[200,300,250]][T]);steps=[a];head=a===200||a===300?`🚀 Concert tickets up ${a}%! "So they now cost 3 times as much."`:`🚀 "Prices can NEVER go up by more than 100%. A ${a}% rise is impossible!"`;sub='Concert fans are confused.'}
  api.q(fnScene(rep,head,sub)+`<p class="qt">📰 <b>${rep[0]}</b> rushes in with a scoop. Is it TRUE or FAKE?</p>`);
  fnGut(api,()=>fnChain(api,{steps,starts,then:(S,v)=>fnFinalPct(api,S,v,pc=>{
    const ch=fnR2(pc-100),stepsTxt=steps.map(p=>(p>0?'× ':'× ')+fnR2(1+p/100)).join(' ');
    if(kind==='back'){truth=false;why=`The ${steps[0]}% down is taken from a <b>bigger</b> price, so it takes away more than the ${steps[0]}% added. You end up ${fnR2(100-pc)}% <b>lower</b> than the start, not back to it.`}
    else if(kind==='add'){truth=false;why=`The second ${steps[1]}% is taken of the <b>new, bigger</b> price, so the total rise is ${ch}%, more than ${steps[0]+steps[1]}%.`}
    else if(kind==='down2'){truth=false;why=`The extra ${-steps[1]}% comes off the <b>sale</b> price, not the original. You pay ${pc}% of the price, so it is only ${fnR2(100-pc)}% off, not ${-(steps[0]+steps[1])}%.`}
    else if(kind==='true25'){truth=Math.abs(pc-100)<.001;why=truth?`Up ${steps[0]}% gives ${fnR2(1+steps[0]/100)} times the price; down ${-steps[1]}% keeps ${fnR2(1+steps[1]/100)} of that. ${fnR2(1+steps[0]/100)} × ${fnR2(1+steps[1]/100)} = 1, so you really are back to 100%.`:`You end at ${pc}%, not 100%.`}
    else if(kind==='double'){truth=pc>200;why=`${fnR2(1+steps[0]/100)} × ${fnR2(1+steps[1]/100)} = ${fnR2(pc/100)}, so the rent went up by ${fnR2(pc-100)}% in total. Doubling means going up by 100%, so this is ${truth?'more':'less'} than double.`}
    else{const a=steps[0];truth=a===200;why=a===150||a===250?`A rise of ${a}% gives ${pc}% of the old price. Increases <b>can</b> be more than 100%; only a <b>decrease</b> can't go past 100% (you can't pay less than $0).`:`Up ${a}% means old price + ${a}% = ${pc}% of the old price, which is ${fnR2(pc/100)} times as much${a===300?', not 3 times':''}.`;}
    fnVerdict(api,truth,why,[`Test price ${fn$(S)}: ${v.map(fn$).join(' → ')}`,`Change: ${fn$(Math.abs(v[v.length-1]-S))} ÷ ${fn$(S)} × 100% = ${fnR2(Math.abs(pc-100))}% ${pc>100?'more':pc<100?'less':''} than the start`,`Each step multiplies: ${stepsTxt}`])},kind==='over'?'over':'')}))}

/* ---- Tool 2: unit bars. "B is p% more than A, so A is p% less than B" ---- */
function fnUnitsRound(api,T){const [n,k]=pick([[[4,1],[1,1]],[[4,1],[5,3],[2,3]],[[5,3],[2,3],[1,3]]][T]),p=fnR2(k/n*100),q=fnR2(k/(n+k)*100),rep=pick(FNREP);
  const [A,B,what]=pick([['Ali','Ben','pocket money'],['Mei','Nora','savings'],['Class 1A','Class 1B','recycling'],['Tampines','Jurong','visitors']]),truth=Math.random()<.4,claimQ=truth?q:p;
  api.q(fnScene(rep,`💸 ${B}'s ${what} is ${p}% MORE than ${A}'s. "So ${A}'s is ${claimQ}% LESS than ${B}'s!"`,'Our reporter flipped it around.')+`<p class="qt">📰 <b>${rep[0]}</b> has a story about two people. Is the second part TRUE or FAKE?</p>`);
  fnGut(api,()=>{const K=ctx.keep;
    api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: unit bars</h4><div class="fnurow"><b>${esc(A)}</b><div class="fnu a" id="fnUA">${Array(n).fill('<i>1 u</i>').join('')}</div></div><div class="fnurow"><b>${esc(B)}</b><div class="fnu b" id="fnUB"></div></div>
      <p style="margin:0;font:700 13px var(--body)">${esc(A)} has <b>${n}</b> unit${n>1?'s':''}. Build ${esc(B)}'s bar: ${p}% more than ${esc(A)}.</p><div class="row" style="justify-content:center"><button class="btn" id="fnUm">− unit</button><button class="btn" id="fnUp">+ unit</button><button class="btn primary" id="fnUc">Check ${esc(B)}'s bar</button></div><div id="fnUmsg"></div></div>`);
    let c=n;const draw=()=>{$('fnUB').innerHTML=Array(c).fill(0).map((_,i)=>`<i class="${i>=n?'ex':''}">1 u</i>`).join('')};draw();
    const next=()=>{['fnUm','fnUp','fnUc'].forEach(i=>$(i).disabled=true);c=n+k;draw();
      $('fnUmsg').innerHTML=`<p class="askok">${esc(B)} = ${n} + ${k} = <b>${n+k} units</b>. The gap is ${k} unit${k>1?'s':''}.</p>`;
      askOne(api,{id:'fnUq',label:`<b>Step 3:</b> ${esc(A)} is less than ${esc(B)} by ${k} unit${k>1?'s':''}. As a percentage of <b>${esc(B)}</b> (${n+k} units), that is`,w:5,unit:'%',right:q,
        traps:[[p,`${p}% compares the gap with <b>${esc(A)}</b> (${n} units). "Less than ${esc(B)}" compares it with <b>${esc(B)}</b>: ${k} out of ${n+k} units.`]],hint:`${k} ÷ ${n+k} × 100%`,
        then:()=>fnVerdict(api,truth,`The same gap (${k} unit${k>1?'s':''}) is ${p}% of ${esc(A)} but only ${q}% of ${esc(B)}, because ${esc(B)} is bigger. "More than" and "less than" compare with different amounts.`,
          [`${A}: ${n} units, ${B}: ${n+k} units`,`${B} is more by ${k}/${n} = ${p}%`,`${A} is less by ${k}/${n+k} = ${q}%`])})};
    $('fnUp').onclick=()=>{if(c<12){c++;sfx.pop();draw()}};$('fnUm').onclick=()=>{if(c>1){c--;sfx.tap();draw()}};
    $('fnUc').onclick=()=>{if(api.answered)return;if(c===n+k){sfx.ok();next();return}
      if(api.first('fnU')){sfx.no();$('fnUmsg').innerHTML=`<p class="askneed">${p}% of ${esc(A)}'s ${n} unit${n>1?'s':''} is how many units? Add that many to a bar the same as ${esc(A)}'s.</p>`;return}
      sfx.no();K.pen=1;$('fnUmsg').innerHTML='';next()};
  })}

/* ---- Tool 3: the sale bar (reverse percentage) ---- */
function fnRevRound(api,T){const rep=pick(FNREP),truth=Math.random()<.35,[em,thing]=pick(FNSTUFF);
  if(T===2&&Math.random()<.6){const B=pick([200,300,400,500,800,1200]),Q=fnR2(B*1.09),naive=fnR2(Q-Q*.09),claim=truth?B:naive;
    api.q(fnScene(rep,`🧾 A restaurant bill is ${fn$(Q)} including 9% GST. "So before GST it was ${fn$(Q)} − 9% of ${fn$(Q)} = ${fn$(claim)}."`,'Our reporter checked the receipt.')+`<p class="qt">📰 <b>${rep[0]}</b> has a story about GST. Is it TRUE or FAKE?</p>`);
    return fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: the bill bar</h4><div class="fnsale"><i class="big" id="fnBig">before GST = 100% = ?</i><i class="sm">9%</i></div><div class="fnbrace"><span style="flex:109">whole bill = 109% = ${fn$(Q)}</span></div></div>`);
      askOne(api,{id:'fnG1',label:`<b>Step 2:</b> the whole bill is 109% of the price before GST. So 1% =`,pre:'<span class="askunit">$</span>',w:6,right:fnR2(Q/109),traps:[[fnR2(Q/100),'The bill is 109%, not 100%. Divide by 109.']],hint:`${fn$(Q)} ÷ 109`,
        then:()=>askOne(api,{id:'fnG2',label:`<b>Step 3:</b> price before GST (100%) =`,pre:'<span class="askunit">$</span>',w:6,right:B,traps:[[naive,'That takes 9% of the bill (with GST). The 9% was worked out on the price <b>before</b> GST.']],hint:`1% × 100`,
          then:()=>{$('fnBig').textContent=`before GST = 100% = ${fn$(B)}`;fnVerdict(api,truth,`GST is 9% of the price <b>before</b> GST, so the bill is 109%. Taking 9% of the bill takes off too much: ${fn$(naive)} is wrong; it was ${fn$(B)}.`,
            [`109% = ${fn$(Q)}`,`1% = ${fn$(Q)} ÷ 109 = ${fn$(Q/109)}`,`100% = ${fn$(B)}`])}})})})}
  const a=pick([[20,25,50],[10,30,40],[15,35,15]][T]),u={20:20,25:25,50:50,10:10,30:10,40:20,15:5,35:5}[a],N=100/u,paid=(100-a)/u,m=R(...[[4,15],[3,12],[2,9]][T]),O=N*m,P=paid*m,naive=fnR2(P*(1+a/100)),claim=truth?O:naive;
  api.q(fnScene(rep,`${em} ${a}% OFF! ${thing[0].toUpperCase()+thing.slice(1)} now costs ${fn$(P)}. "So the old price was ${fn$(P)} + ${a}% of ${fn$(P)} = ${fn$(claim)}."`,'Our reporter worked backwards.')+`<p class="qt">📰 <b>${rep[0]}</b> has a sale story. Is it TRUE or FAKE?</p>`);
  fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: the sale bar</h4><p style="margin:0;font:700 13px var(--body)">The original price is 100%, cut into ${N} equal parts of ${u}%. The ${a}% off is striped.</p>
     <div class="fnsale" id="fnSale">${Array(N).fill(0).map((_,i)=>`<i class="${i<paid?'paid':'off'}">${u}%</i>`).join('')}</div><div class="fnbrace"><span style="flex:${paid};color:#0b968b">${100-a}% = ${fn$(P)} (you pay)</span><span style="flex:${N-paid};color:#de3f46">${a}% off</span></div></div>`);
    askOne(api,{id:'fnR1',label:`<b>Step 2:</b> ${paid} parts (${100-a}%) cost ${fn$(P)}. So 1 part (${u}%) =`,pre:'<span class="askunit">$</span>',w:6,right:m,traps:[[fnR2(P/N),`Only ${paid} parts are paid for, not all ${N}. Divide by ${paid}.`]],hint:`${fn$(P)} ÷ ${paid}`,
      then:()=>{[...$('fnSale').children].forEach((x,i)=>setTimeout(()=>{x.classList.add('lit');x.textContent=fn$(m)},i*70));
        askOne(api,{id:'fnR2',label:`<b>Step 3:</b> the original price (all ${N} parts, 100%) =`,pre:'<span class="askunit">$</span>',w:6,right:O,traps:[[naive,`That adds ${a}% of the <b>sale</b> price. The ${a}% was taken off the <b>original</b> price, which is bigger.`]],hint:`${fn$(m)} × ${N}`,
          then:()=>fnVerdict(api,truth,`The ${a}% was ${a}% of the <b>original</b> price. So ${fn$(P)} is ${100-a}% of the original: ${fn$(P)} ÷ ${100-a} × 100 = ${fn$(O)}. Adding ${a}% of the sale price gives ${fn$(naive)}, which is wrong.`,
            [`${100-a}% = ${fn$(P)}`,`${u}% = ${fn$(P)} ÷ ${paid} = ${fn$(m)}`,`100% = ${fn$(m)} × ${N} = ${fn$(O)}`])})}})})}

/* ---- Tool 4: the class. "The pass rate went from 40% to 50%, so 10% more students passed" ----
   No jargon: pupils count real students. Before: o% of N. After: n% of N. The extra students compared with the number before. */
function fnPtsRound(api,T){const pairs=[[[40,50],[20,30],[50,60],[25,30]],[[60,75],[20,25],[30,36],[45,54]],[[80,60],[50,40],[75,60],[40,30]]][T];
  let o,n,N;for(let k=0;k<50;k++){[o,n]=pick(pairs);N=pick([20,40,30,25]);if(o*N%100===0&&n*N%100===0)break}
  const ob=o*N/100,nb=n*N/100,up=nb>ob,d=Math.abs(nb-ob),r=fnR2(d/ob*100),rate=Math.abs(n-o),rep=pick(FNREP);
  const [grp,verb,what]=pick([['Class 1E','passed the test','pass rate'],['Class 1A','cycle to school','share who cycle'],['Class 1C','chose kaya toast','share who chose kaya toast'],['Class 1F','joined a CCA','share who joined a CCA']]);
  const truth=Math.random()<.4,claim=truth?r:rate,more=up?'more':'fewer';
  api.q(fnScene(rep,`📊 ${grp}: ${o}% ${verb} last term, ${n}% this term. "So ${claim}% ${more} students ${verb}!"`,`${grp} has ${N} students both terms.`)+`<p class="qt">📰 <b>${rep[0]}</b> brings class data. Is the headline TRUE or FAKE?</p>`);
  fnGut(api,()=>{const dots=(id)=>`<div class="fnppl" id="${id}">${Array(N).fill('<i></i>').join('')}</div>`;
    api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: count the class (${N} students)</h4><div class="fnurow"><b>Last term</b>${dots('fnPa')}</div><div class="fnurow"><b>This term</b>${dots('fnPb')}</div><p style="margin:0;font:700 12px var(--body)">● = a student who ${verb}</p></div>`);
    const fill=(id,k,from)=>[...$(id).children].forEach((x,i)=>{if(i<k)setTimeout(()=>{x.className=i>=from?'ex':'on'},i*40)});
    askOne(api,{id:'fnP1',label:`<b>Step 2:</b> last term, ${o}% of the ${N} students ${verb}. How many students is that?`,w:4,unit:'students',right:ob,hint:`${o} ÷ 100 × ${N}`,
      then:()=>{fill('fnPa',ob,N);
        askOne(api,{id:'fnP2',label:`<b>Step 3:</b> this term, ${n}% of the ${N} students ${verb}. How many students is that?`,w:4,unit:'students',right:nb,hint:`${n} ÷ 100 × ${N}`,
          then:()=>{fill('fnPb',nb,up?ob:N);
            askOne(api,{id:'fnP3',label:`<b>Step 4:</b> that is ${d} ${more} students (${ob} → ${nb}). Compared with the <b>${ob}</b> students last term, how many percent ${more} is that?`,w:5,unit:`% ${more}`,right:r,
              traps:[[rate,`${rate} is how much the <b>class percentage</b> changed (${n}% − ${o}%). The headline is about the number of <b>students</b>: compare the ${d} extra with the ${ob} from last term.`],[fnR2(d/N*100),`Compare with the ${ob} students who ${verb} last term, not the whole class of ${N}.`]],
              hint:`${d} ÷ ${ob} × 100%`,
              then:()=>fnVerdict(api,truth,`The class percentage went from ${o}% to ${n}%, but the number of students went from ${ob} to ${nb}: that is ${d} ${more}, and ${d} out of ${ob} is <b>${r}%</b> ${more}. "${rate}% ${more}" just subtracts the two percentages, which compares the wrong things.`,
                [`Last term: ${o}% of ${N} = ${ob} students`,`This term: ${n}% of ${N} = ${nb} students`,`${d} ${more}: ${d} ÷ ${ob} × 100% = ${r}%`])})}})}})})}

/* ---- Tool 5: twin calculators. a% of b and b% of a ----
   Step 2: pick the easier side and work it out (the lab works out the other side, so nothing is typed twice).
   Step 3: one example is not proof: choose the reason it ALWAYS works (a × b ÷ 100 = b × a ÷ 100).
   Step 4: use the hack on a new pair. */
function fnSwapRound(api,T){const [a,b]=pick([[[8,50],[4,25],[12,50],[16,25]],[[18,50],[32,25],[24,25],[44,50]],[[7,20],[15,40],[35,60],[13,20]]][T]),v=fnR2(a*b/100),rep=pick(FNREP),truth=Math.random()<.65;
  const [c,d]=pick([[[18,50],[36,25],[14,50],[28,25]],[[46,50],[64,25],[52,25],[38,50]],[[17,20],[45,40],[26,50],[55,60]]][T].filter(([x,y])=>x!==a)),w=fnR2(c*d/100);
  const head=truth?`🤯 Maths hack goes viral: "${a}% of ${b} is the SAME as ${b}% of ${a}. It works for ANY two numbers!"`:`🤓 "${a}% of ${b} is much SMALLER than ${b}% of ${a}. Obviously!"`;
  api.q(fnScene(rep,head,'Thousands of students share it.')+`<p class="qt">📰 <b>${rep[0]}</b> found a trending post. Is it TRUE or FAKE?</p>`);
  fnGut(api,()=>{const L=`${a}% of ${b}`,Rt=`${b}% of ${a}`;
    api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: twin calculators</h4><div class="fncal"><div id="fnK1"><small>${L}</small><span>?</span></div><div id="fnK2"><small>${Rt}</small><span>?</span></div></div></div>`);
    const show=(i,x)=>{const k=$(i);k.querySelector('span').textContent=x;k.classList.remove('flip');void k.offsetWidth;k.classList.add('flip')};
    api.body.insertAdjacentHTML('beforeend',`<div class="askwrap"><p class="asklab"><b>Step 2:</b> work out <b>one</b> side. Which is easier to do in your head? The lab calculator will do the other one.</p><div class="choices" id="fnSw"><button class="btn" data-v="1">${L}</button><button class="btn" data-v="2">${Rt}</button></div></div>`);
    const go=k=>{ctx.keep.sw=k;[...$('fnSw').children].forEach(x=>{x.disabled=true;if(x.dataset.v===k)x.classList.add('ok')});const mine=k==='1'?[a,b]:[b,a];
      askOne(api,{id:'fnS1',label:`${mine[0]}% of ${mine[1]} =`,w:5,right:v,traps:[[fnR2(mine[1]*100/mine[0]),'Percent means "out of 100": multiply by '+mine[0]+', then divide by 100.']],hint:`${mine[0]} ÷ 100 × ${mine[1]}`,
        then:()=>{show(k==='1'?'fnK1':'fnK2',v);api.later(()=>{show(k==='1'?'fnK2':'fnK1',v);sfx.tap()},700);
          /* Step 3: write both sides as ONE multiplication, so pupils see the same two numbers in a different order */
          const step4=()=>askOne(api,{id:'fnS3',label:`<b>Step 4:</b> use the hack. ${c}% of ${d} =`,w:5,right:w,hint:`Swap it: ${d}% of ${c} is easier.`,traps:[[fnR2(d*100/c),'Multiply, then divide by 100. Or swap it round to make it easier.']],
              then:()=>fnVerdict(api,truth,`${a}% of ${b} and ${b}% of ${a} are both ${a} × ${b} ÷ 100. Multiplying in a different order gives the same answer, so this works for <b>any</b> two numbers. ${truth?'':`So neither one is smaller: they are equal. `}Use it to pick the easier side: ${c}% of ${d} = ${d}% of ${c} = ${w}.`,
                [`${a}% of ${b} = ${a} ÷ 100 × ${b} = ${a} × ${b} ÷ 100 = ${v}`,`${b}% of ${a} = ${b} ÷ 100 × ${a} = ${b} × ${a} ÷ 100 = ${v}`,`Hack: ${c}% of ${d} = ${d}% of ${c} = ${w}`])});
          const ib=k=>inBox('fnSy',k,'Number',3);
          askBox(api,{id:'fnSy',label:`<b>Step 3: why are they always equal?</b> Both came out as ${v}, but that is just one example. Write each side as one multiplication:`,
            html:`<div style="display:grid;gap:6px;font:700 1.05rem var(--body)"><div>${a}% of ${b} = ${a} ÷ 100 × ${b} = <b>${a} × ${b} ÷ 100</b></div><div>${b}% of ${a} = ${b} ÷ 100 × ${a} = ${ib('x')} × ${ib('y')} ÷ 100</div></div>`,
            hint:`${b}% means ${b} ÷ 100. So ${b}% of ${a} = ${b} ÷ 100 × ${a}. Which two numbers are multiplied?`,
            judge:o=>(o.x===b&&o.y===a)||(o.x===a&&o.y===b),
            onRight:()=>{api.body.insertAdjacentHTML('beforeend',`<p class="askok">Yes! Both sides multiply <b>${a}</b> and <b>${b}</b>, then divide by 100. ${a} × ${b} = ${b} × ${a}, so the answers are always equal, whatever the numbers.</p>`);step4()},
            onWrong:()=>{ctx.keep.pen=1;api.body.insertAdjacentHTML('beforeend',`<p class="retrymsg">${b}% of ${a} = ${b} × ${a} ÷ 100. Both sides multiply the same two numbers, ${a} and ${b}, so they are always equal.</p>`);step4()}});
}})};
    $('fnSw').querySelectorAll('button').forEach(x=>x.onclick=()=>{if(api.answered||x.disabled)return;sfx.pop();go(x.dataset.v)});if(ctx.keep.sw)go(ctx.keep.sw)})}

const FNTYPES=['swap','back','pts','addDown','units','rev','trueish','mix'];
addGame('s1-news',{level:'Sec 1',sec:'s1',strand:'num',glyph:'📰',music:'news',title:'Fake News Desk',topic:'Percentage change and reverse percentage',
 how:'Reporters rush in with percentage headlines. Stamp each one TRUE or FAKE, investigate with hands-on tools, then publish or fix your call. Keep your readers\' trust!',rounds:8,
 round(api,r){const T=TIER();let t=FNTYPES[r];
  if(t==='mix')t=pick(['back','addDown','pts','units','rev','trueish']);
  if(t==='swap')return fnSwapRound(api,T);if(t==='pts')return fnPtsRound(api,T);if(t==='units')return fnUnitsRound(api,T);if(t==='rev')return fnRevRound(api,T);
  if(t==='back')return fnChainRound(api,T,'back');if(t==='addDown')return fnChainRound(api,T,pick(['add','down2']));
  return fnChainRound(api,T,pick(['true25','double','over']))},
 bonus(api){const [a,ans,wr]=pick([[50,75,[100,50,125]],[20,96,[100,80,104]],[30,91,[100,70,109]],[40,84,[100,60,116]]]),LIM=1000000,DUR=22000;
  api.q(cpBanNews()+`<p class="qt">🚨 <b>A fake is going viral!</b> Debunk it before it hits <b>1 million shares</b>. Tap the right answer fast.</p>`);
  api.body.insertAdjacentHTML('beforeend',`<div class="fnphone" id="fnPh"><div class="who"><i></i>@kopi_king_88 · 2 min</div><p>My boss gave me a <b>${a}% pay rise</b>, then cut my pay by <b>${a}%</b> 😅 Back to my old pay, no harm done! #blessed</p><div class="sh"><span>🔁 Shares</span><b id="fnSh">0</b></div><div class="bar"><i id="fnShB"></i></div></div>
    <div class="askwrap"><p class="asklab">The new pay is what percent of the old pay?</p><div class="choices" id="fnBo" style="grid-template-columns:repeat(2,minmax(0,1fr))"></div><div id="fnBoM"></div></div>`);
  const t0=Date.now();let over=false;const tick=()=>{if(api.answered)return;const f=Math.min(1,(Date.now()-t0)/DUR),n=Math.round(LIM*f*f);$('fnSh').textContent=n.toLocaleString('en-SG');$('fnShB').style.width=f*100+'%';
    if(f>=1){over=true;$('fnPh').classList.add('viral');[...$('fnBo').children].forEach(b=>b.disabled=true);api.done(false,`Too late: it went viral! The new pay is ${ans}% of the old pay: × ${fnR2(1+a/100)} then × ${fnR2(1-a/100)}.`,[`${fnR2(1+a/100)} × ${fnR2(1-a/100)} = ${fnR2(ans/100)}`],0,{noRetry:1});return}
    api.later(tick,100)};tick();
  shuffle([ans,...wr]).forEach(v=>{const b=document.createElement('button');b.className='btn';b.style.fontSize='1.15rem';b.textContent=v+'%';b.onclick=()=>{if(api.answered||over)return;[...$('fnBo').children].forEach(x=>x.disabled=true);
    const ok=v===ans,sh=$('fnSh').textContent;b.classList.add(ok?'ok':'no');if(ok)$('fnPh').classList.add('stop');
    api.done(ok,ok?`Debunked at ${sh} shares! Up ${a}% then down ${a}% leaves ${ans}% of the old pay, because the cut is taken from the <b>bigger</b> pay.`:`Not quite, and the post keeps spreading. The new pay is ${ans}% of the old pay.`,[`Old pay 100% → × ${fnR2(1+a/100)} → × ${fnR2(1-a/100)}`,`${fnR2(1+a/100)} × ${fnR2(1-a/100)} = ${fnR2(ans/100)} = ${ans}%`],undefined,{noRetry:1})};$('fnBo').appendChild(b)})}});
const cpBanNews=()=>`<div class="cpban" style="background:radial-gradient(circle at 50% 0,#c2410c,#3b0d0d 75%)">📰 STOP THE PRESSES 📰<small>Secret level</small></div>`;
/* Ask Qubi hints, one list per round type (in FNTYPES order) */
const FNHINTS=[
 ['Pick the easier side: 50% is half, 25% is a quarter, 20% is a fifth.','One example can show a claim is FAKE, but it can\'t prove it is always TRUE. Write each side as a × b ÷ 100.','To use the hack, swap the numbers round: 16% of 25 = 25% of 16.'],
 ['Each machine works on the price that comes IN, not the starting price.','The second % is taken of a different (bigger) amount than the first.','Final ÷ start × 100% tells you where you ended up.'],
 ['Turn each percentage into a number of students first: % ÷ 100 × class size.','Find how many more (or fewer) students there are now.','Compare that with the number of students LAST term: change ÷ old number × 100%.'],
 ['Each machine works on the price that comes IN.','Two discounts in a row: the second one comes off the sale price.','Final ÷ start × 100% tells you where you ended up.'],
 ['Draw A with its units. p% more means add p% of A\'s units.','"Less than B" compares the gap with B, not A.','Gap ÷ B\'s units × 100%.'],
 ['The % off was taken from the ORIGINAL price, not the sale price.','The sale price is (100 − discount)% of the original.','Find 1 part (or 1%), then multiply up to 100%.'],
 ['Run the price through each machine one at a time.','Multiply the changes: up 25% is × 1.25, down 20% is × 0.8.','Final ÷ start × 100% tells you where you ended up.'],
 ['Read the claim carefully: which amount is each % taken from?','Pick an easy test number like $100 and try it.','Change ÷ original × 100% gives the percentage change.']];
