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
.fnstory{margin:0;padding-left:24px;text-align:left;font:600 15px/1.5 var(--body);display:grid;gap:4px}
.fnfrw{flex:1 1 100%;display:grid;gap:10px;font:700 1.05rem var(--body)}.fnfrw>div{display:flex;align-items:center;flex-wrap:wrap;gap:2px 4px}@media (max-width:600px){.fnfrw{font-size:.95rem}.fnfr>span{padding:2px 3px}}
.fnfr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 3px;line-height:1.25}.fnfr>span{display:flex;align-items:center;gap:4px;padding:2px 6px}.fnfr>span:first-child{border-bottom:2.5px solid currentColor}.fnfr input{width:2.4em!important;font-size:1.05rem!important;min-width:0!important;padding-left:4px!important;padding-right:4px!important;text-align:center}
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
  let starts=[[100,200,50],[80,120,250],[60,160,240]][T];
  if(kind==='back'){const a=pick([[10,20,50],[20,25,40],[15,30,35]][T]);steps=[a,-a];head=`${em} Price of ${thing} goes UP ${a}%, then DOWN ${a}%. "Back to the old price!"`;sub='Shoppers say: no harm done.'}
  else if(kind==='add'){const [a,b]=pick([[[10,10],[10,20],[20,10]],[[20,30],[10,15],[30,20]],[[15,20],[25,40],[40,15]]][T]);steps=[a,b];head=`${em} ${thing[0].toUpperCase()+thing.slice(1)} goes up ${a}%, then another ${b}%. "That's ${a+b}% more in total!"`;sub='Our reporter just added them.'}
  else if(kind==='down2'){const [a,b]=pick([[[50,20],[20,20],[40,10]],[[40,20],[30,30],[50,50]],[[35,20],[25,40],[60,25]]][T]);steps=[-a,-b];head=`🛍️ Great Singapore Sale: ${a}% off ${thing}, then an EXTRA ${b}% off at the till. "That's ${a+b}% off!"`;sub='Queues form outside the mall.'}
  else if(kind==='true25'){const [a,b]=pick([[[25,20],[100,50]],[[25,20],[100,50],[150,60]],[[150,60],[400,80],[25,20]]][T]);steps=[a,-b];head=`${em} ${thing[0].toUpperCase()+thing.slice(1)} goes up ${a}%, then down ${b}%. "Back to the old price!"`;sub='Is our reporter right this time?'}
  else if(kind==='double'){const [a,b]=pick([[[50,50],[60,40]],[[50,50],[40,40],[30,60]],[[40,40],[45,40],[30,60]]][T]);steps=[a,b];head=`📈 Shop rent goes up ${a}%, then up ${b}% the next year. "Rent has MORE than doubled!"`;sub='Shop owners are worried.'}
  else if(kind==='fare'){steps=[5,7];starts=[100,200,1000];head=`🚇 Bus and train fares rose 5% in Dec 2025, then 7% in Dec 2026. "So fares are now 12% higher than in 2024!"`;sub='Real Public Transport Council fare reviews. Test it on a monthly travel bill.'}
  else if(kind==='slow'){steps=[10,3];starts=T?[400000,500000,600000]:[100,200,1000];head=`🏠 HDB resale prices rose about 10% in 2024, but only about 3% in 2025. "So flat prices FELL in 2025!"`;sub='Real figures: up 9.7% in 2024, up 2.9% in 2025.'}
  else if(kind==='svc'){steps=[10,9];starts=[100,200,50];head=`🍽️ Restaurant bill: 10% service charge, then 9% GST. "So you pay 19% on top of the food price!"`;sub='The "++" on Singapore menus.'}
  else{const a=pick([[150,200],[150,200,300],[200,300,250]][T]);steps=[a];head=a===200||a===300?`🚀 Concert tickets up ${a}%! "So they now cost 3 times as much."`:`🚀 "Prices can NEVER go up by more than 100%. A ${a}% rise is impossible!"`;sub='Concert fans are confused.'}
  api.q(fnScene(rep,head,sub)+`<p class="qt">📰 <b>${rep[0]}</b> rushes in with a scoop. Is it TRUE or FAKE?</p>`);
  fnGut(api,()=>fnChain(api,{steps,starts,then:(S,v)=>fnFinalPct(api,S,v,pc=>{
    const ch=fnR2(pc-100),stepsTxt=steps.map(p=>(p>0?'× ':'× ')+fnR2(1+p/100)).join(' ');
    if(kind==='back'){truth=false;why=`The ${steps[0]}% down is taken from a <b>bigger</b> price, so it takes away more than the ${steps[0]}% added. You end up ${fnR2(100-pc)}% <b>lower</b> than the start, not back to it.`}
    else if(kind==='add'){truth=false;why=`The second ${steps[1]}% is taken of the <b>new, bigger</b> price, so the total rise is ${ch}%, more than ${steps[0]+steps[1]}%.`}
    else if(kind==='down2'){truth=false;why=`The extra ${-steps[1]}% comes off the <b>sale</b> price, not the original. You pay ${pc}% of the price, so it is only ${fnR2(100-pc)}% off, not ${-(steps[0]+steps[1])}%.`}
    else if(kind==='true25'){truth=Math.abs(pc-100)<.001;why=truth?`Up ${steps[0]}% gives ${fnR2(1+steps[0]/100)} times the price; down ${-steps[1]}% keeps ${fnR2(1+steps[1]/100)} of that. ${fnR2(1+steps[0]/100)} × ${fnR2(1+steps[1]/100)} = 1, so you really are back to 100%.`:`You end at ${pc}%, not 100%.`}
    else if(kind==='double'){truth=pc>200;why=`${fnR2(1+steps[0]/100)} × ${fnR2(1+steps[1]/100)} = ${fnR2(pc/100)}, so the rent went up by ${fnR2(pc-100)}% in total. Doubling means going up by 100%, so this is ${truth?'more':'less'} than double.`}
    else if(kind==='fare'){truth=false;why=`The 7% rise is taken of the <b>2025</b> fare, which is already 5% higher. × 1.05 × 1.07 = × 1.1235, so fares are 12.35% higher than in 2024: a little more than 12%.`}
    else if(kind==='slow'){truth=false;why=`Prices still went <b>up</b> in 2025, just more slowly. A smaller increase is still an increase: the price ended ${ch}% higher than at the start. "Growth slowed down" is not the same as "prices fell".`}
    else if(kind==='svc'){truth=false;why=`The 9% GST is charged on the food <b>and</b> the service charge, so it is 9% of a bigger amount. × 1.1 × 1.09 = × 1.199: you pay 19.9% on top, not 19%.`}
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
const fnFr=(n,d)=>`<span class="fnfr"><span>${n}</span><span>${d}</span></span>`;
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
          askBox(api,{id:'fnSy',label:`<b>Step 3: why are they always equal?</b> Both came out as ${v}, but that is just one example. Percent means "out of 100", so write each side as one fraction:`,
            html:`<div class="fnfrw"><div>${a}% of ${b} = ${fnFr(a,100)} × ${b} = ${fnFr(`<b>${a} × ${b}</b>`,100)}</div><div>${b}% of ${a} = ${fnFr(b,100)} × ${a} = ${fnFr(`${ib('x')} × ${ib('y')}`,100)}</div></div>`,
            hint:`${b}% means ${b} ÷ 100. So ${b}% of ${a} = ${b} ÷ 100 × ${a}. Which two numbers are multiplied?`,
            judge:o=>(o.x===b&&o.y===a)||(o.x===a&&o.y===b),
            onRight:()=>{api.body.insertAdjacentHTML('beforeend',`<p class="askok">Yes! Both sides are ${fnFr(`${a} × ${b}`,100)}: they multiply <b>${a}</b> and <b>${b}</b>, then divide by 100. ${a} × ${b} = ${b} × ${a}, so the answers are always equal, whatever the numbers.</p>`);step4()},
            onWrong:()=>{ctx.keep.pen=1;api.body.insertAdjacentHTML('beforeend',`<p class="retrymsg">${b}% of ${a} = ${b} × ${a} ÷ 100. Both sides multiply the same two numbers, ${a} and ${b}, so they are always equal.</p>`);step4()}});
}})};
    $('fnSw').querySelectorAll('button').forEach(x=>x.onclick=()=>{if(api.answered||x.disabled)return;sfx.pop();go(x.dataset.v)});if(ctx.keep.sw)go(ctx.keep.sw)})}

/* ===== More claim types (20 Nov), with Singapore contexts from real news ===== */
/* a "count it" lab: rows of dots (people, or $1 coins) */
const fnDots=(rows,cap)=>`<div class="fnlab"><h4>🔬 Test lab: ${cap}</h4>${rows.map(([lab,id,N])=>`<div class="fnurow"><b>${lab}</b><div class="fnppl" id="${id}">${Array(N).fill('<i></i>').join('')}</div></div>`).join('')}</div>`;
const fnFill=(id,k,from)=>[...$(id).children].forEach((x,i)=>{if(i<k)setTimeout(()=>{x.className=i>=from?'ex':'on'},i*30)});
/* simple one-step % increase: a hawker plate goes up by some cents (Core) */
function fnSimpleRound(api,T){const rep=pick(FNREP),[old,inc]=pick([[4,.5],[5,.5],[2.5,.5],[4,1],[3.5,.7],[1.6,.2]]),parts=Math.round(old/inc),pc=fnR2(100/parts),truth=Math.random()<.4,cents=Math.round(inc*100);
  const [em,dish]=pick([['🍗','chicken rice'],['🍜','fishball noodles'],['🧋','bubble tea'],['☕','kopi']]),claim=truth?`up ${pc}%`:`up ${cents}%`;
  api.q(fnScene(rep,`${em} ${dish[0].toUpperCase()+dish.slice(1)} goes from ${fn$(old)} to ${fn$(old+inc)}. "That's ${cents} cents more, so the price is ${claim}!"`,'Real news: hawker food prices rose 6.1% in 2023, the most since 2008.')+`<p class="qt">📰 <b>${rep[0]}</b> is at the hawker centre. Is the headline TRUE or FAKE?</p>`);
  fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: the price bar</h4><div class="fnsale" id="fnSb">${Array(parts).fill(0).map(()=>'<i class="paid">?</i>').join('')}<i class="lit" style="flex:1">+${fn$(inc)}</i></div><div class="fnbrace"><span style="flex:${parts}">old price ${fn$(old)} = 100%</span><span style="flex:1;color:#c2410c">rise</span></div></div>`);
    askOne(api,{id:'fnI1',label:`<b>Step 2:</b> the old price ${fn$(old)} is made of how many pieces of ${fn$(inc)}?`,w:4,right:parts,hint:`${fn$(old)} ÷ ${fn$(inc)}`,
      then:()=>{[...$('fnSb').children].forEach((x,i)=>{if(i<parts)x.textContent=fn$(inc)});
        askOne(api,{id:'fnI2',label:`<b>Step 3:</b> the rise is <b>1 piece</b> out of the ${parts} pieces in the old price. As a percentage of the old price, that is`,w:5,unit:'%',right:pc,traps:[[cents,`${cents} is the number of <b>cents</b>, not a percentage. Compare the rise with the old price: 1 out of ${parts}.`]],hint:`1 ÷ ${parts} × 100%`,
          then:()=>fnVerdict(api,truth,`The rise is ${fn$(inc)} out of an old price of ${fn$(old)}: 1 piece out of ${parts}, which is <b>${pc}%</b>. "${cents} cents" is an amount of money, not a percentage.`,[`${fn$(inc)} ÷ ${fn$(old)} × 100% = ${pc}%`])})}})})}
/* GST rate 8% → 9%: how much more GST do you pay? (Stretch) */
function fnGstRound(api,T){const rep=pick(FNREP),B=pick([100,200,300,400]),g8=B*.08,g9=B*.09,d=fnR2(g9-g8),r=12.5,truth=Math.random()<.35;
  api.q(fnScene(rep,`🧾 GST went from 8% to 9% on 1 Jan 2024. "So the GST you pay went up by ${truth?'12.5%':'just 1%'}!"`,`A family's ${fn$(B)} shopping, before GST.`)+`<p class="qt">📰 <b>${rep[0]}</b> has a story about GST. Is it TRUE or FAKE?</p>`);
  fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',fnDots([['GST at 8%','fnGa',9],['GST at 9%','fnGb',9]],`GST on ${fn$(B)} (each dot = ${fn$(B/100)})`));
    askOne(api,{id:'fnG8',label:`<b>Step 2:</b> GST at 8% on ${fn$(B)} =`,pre:'<span class="askunit">$</span>',w:5,right:g8,hint:`8 ÷ 100 × ${B}`,
      then:()=>{fnFill('fnGa',8,9);askOne(api,{id:'fnG9',label:`<b>Step 3:</b> GST at 9% on ${fn$(B)} =`,pre:'<span class="askunit">$</span>',w:5,right:g9,hint:`9 ÷ 100 × ${B}`,
        then:()=>{fnFill('fnGb',9,8);askOne(api,{id:'fnGc',label:`<b>Step 4:</b> the GST went up by ${fn$(d)}. Compared with the old GST (${fn$(g8)}), how many percent more is that?`,w:5,unit:'% more',right:r,traps:[[1,`1 is how much the GST <b>rate</b> changed (9% − 8%). Compare the extra ${fn$(d)} with the old GST of ${fn$(g8)}.`]],hint:`${fn$(d)} ÷ ${fn$(g8)} × 100%`,
          then:()=>fnVerdict(api,truth,`The rate went up from 8% to 9%, but the GST you pay went from ${fn$(g8)} to ${fn$(g9)}: 1 extra dot for every 8, which is <b>12.5% more</b> GST. "1%" just subtracts the two rates.`,[`8% of ${fn$(B)} = ${fn$(g8)}, 9% of ${fn$(B)} = ${fn$(g9)}`,`${fn$(d)} ÷ ${fn$(g8)} × 100% = 12.5% more`])})}})}})})}
/* order of two changes (Stretch/Challenge): +a then −b vs −b then +a */
function fnOrderRound(api,T){const rep=pick(FNREP),[a,b]=pick([[[5,10],[10,20],[20,10]],[[5,10],[10,20],[20,10]],[[5,10],[25,20],[15,40]]][T]),S=100,A=fnR2(S*(1+a/100)*(1-b/100)),truth=Math.random()<.6,ch=fnR2(100-A);
  const head=truth?`🔁 "Price up ${a}% then down ${b}% gives the SAME as down ${b}% then up ${a}%."`:`🔁 "Price up ${a}% then down ${b}%: that's exactly ${b-a}% down overall."`;
  api.q(fnScene(rep,head,'Two shops change prices in a different order.')+`<p class="qt">📰 <b>${rep[0]}</b> compares two shops. Is it TRUE or FAKE?</p>`);
  fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: two shops, start at $100</h4><div class="fncal"><div id="fnOa"><small>Shop A: +${a}% then −${b}%</small><span>?</span></div><div id="fnOb"><small>Shop B: −${b}% then +${a}%</small><span>?</span></div></div></div>`);
    const show=(i,x)=>{const k=$(i);k.querySelector('span').textContent=fn$(x);k.classList.add('flip')};
    askOne(api,{id:'fnO1',label:`<b>Step 2:</b> Shop A. $100 → up ${a}% → down ${b}%. Final price =`,pre:'<span class="askunit">$</span>',w:6,right:A,traps:[[100+a-b,`That adds and subtracts the percentages. The ${b}% comes off the <b>new</b> price, ${fn$(100+a)}.`]],hint:`$100 × ${fnR2(1+a/100)} × ${fnR2(1-b/100)}`,
      then:()=>{show('fnOa',A);askOne(api,{id:'fnO2',label:`<b>Step 3:</b> Shop B. $100 → down ${b}% → up ${a}%. Final price =`,pre:'<span class="askunit">$</span>',w:6,right:A,hint:`$100 × ${fnR2(1-b/100)} × ${fnR2(1+a/100)}`,
        then:()=>{show('fnOb',A);fnVerdict(api,truth,`Both shops end at ${fn$(A)}: each change <b>multiplies</b> the price (× ${fnR2(1+a/100)} and × ${fnR2(1-b/100)}), and multiplying in a different order gives the same answer. So the order doesn't matter, but the overall change is ${ch}% down, not ${b-a}%.`,[`A: 100 × ${fnR2(1+a/100)} × ${fnR2(1-b/100)} = ${A}`,`B: 100 × ${fnR2(1-b/100)} × ${fnR2(1+a/100)} = ${A}`])}})}})})}
/* ratio → percent: "boys : girls = 1 : 4, so 25% are boys" (Stretch/Challenge) */
function fnRatioRound(api,T){const rep=pick(FNREP),[a,b]=pick([[1,4],[3,5],[1,1],[3,2],[1,4]]),pc=fnR2(a/(a+b)*100),wrong=fnR2(a/b*100),truth=Math.random()<.35;
  const [grp,x,y]=pick([['the choir','boys','girls'],['the robotics club','Sec 1s','Sec 2s'],['the badminton CCA','boys','girls']]);
  api.q(fnScene(rep,`📊 In ${grp}, ${x} : ${y} = ${a} : ${b}. "So ${truth?pc:wrong}% of ${grp} are ${x}!"`,'Our reporter turned a ratio into a percentage.')+`<p class="qt">📰 <b>${rep[0]}</b> is writing about ${grp}. Is the headline TRUE or FAKE?</p>`);
  fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: unit bars</h4><div class="fnurow"><b>${x}</b><div class="fnu a">${Array(a).fill('<i>1 u</i>').join('')}</div></div><div class="fnurow"><b>${y}</b><div class="fnu b">${Array(b).fill('<i>1 u</i>').join('')}</div></div></div>`);
    askOne(api,{id:'fnRa1',label:`<b>Step 2:</b> the whole of ${grp} is how many units?`,w:4,unit:'units',right:a+b,traps:[[b,`That's just the ${y}. The whole group is ${x} <b>and</b> ${y}.`]],hint:`${a} + ${b}`,
      then:()=>askOne(api,{id:'fnRa2',label:`<b>Step 3:</b> ${x} are ${a} out of ${a+b} units. As a percentage of the whole group, that is`,w:5,unit:'%',right:pc,traps:[[wrong,`That compares ${x} with ${y}. "% of ${grp}" compares ${x} with the <b>whole group</b>: ${a} out of ${a+b}.`]],hint:`${a} ÷ ${a+b} × 100%`,
        then:()=>fnVerdict(api,truth,`${x} : ${y} = ${a} : ${b} means ${a} units of ${x} for every ${b} units of ${y}, so the whole group is ${a+b} units. ${x[0].toUpperCase()+x.slice(1)} are ${a} out of ${a+b} = <b>${pc}%</b>. ${a} ÷ ${b} compares ${x} with ${y}, not with everyone.`,[`Whole group = ${a} + ${b} = ${a+b} units`,`${a} ÷ ${a+b} × 100% = ${pc}%`])})})})}
/* "40% boys, 60% girls → 20% more girls than boys" vs "girls outnumber boys by 20% of the class" (Challenge) */
function fnGirlsRound(api,T){const rep=pick(FNREP),[pb,pg]=pick([[40,60],[25,75],[20,80]]),N=20,nb=pb*N/100,ng=pg*N/100,d=ng-nb,r=fnR2(d/nb*100),gap=pg-pb,v=pick(['wrong','right','class']);
  const claim=v==='wrong'?`So there are ${gap}% more girls than boys!`:v==='right'?`So there are ${r}% more girls than boys!`:`So girls outnumber boys by ${gap}% of the class!`,truth=v!=='wrong';
  api.q(fnScene(rep,`👫 Class 1G: ${pb}% boys, ${pg}% girls. "${claim}"`,'Class 1G has 20 students.')+`<p class="qt">📰 <b>${rep[0]}</b> brings class data. Read the claim carefully. TRUE or FAKE?</p>`);
  fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',fnDots([['Boys','fnBa',N],['Girls','fnBb',N]],'count Class 1G (20 students)'));
    askOne(api,{id:'fnBy1',label:`<b>Step 2:</b> ${pb}% of 20 students are boys. How many boys?`,w:4,right:nb,hint:`${pb} ÷ 100 × 20`,then:()=>{fnFill('fnBa',nb,N);
      askOne(api,{id:'fnBy2',label:`<b>Step 3:</b> how many girls?`,w:4,right:ng,hint:`${pg} ÷ 100 × 20`,then:()=>{fnFill('fnBb',ng,nb);
        askOne(api,{id:'fnBy3',label:`<b>Step 4:</b> there are ${d} more girls than boys. Compared with the <b>${nb} boys</b>, how many percent more is that?`,w:5,unit:'% more',right:r,traps:[[gap,`${gap}% is the gap as a share of the <b>whole class</b> (${d} out of 20). "More than boys" compares with the ${nb} boys.`]],hint:`${d} ÷ ${nb} × 100%`,
          then:()=>fnVerdict(api,truth,`There are ${d} more girls. Compared with the ${nb} boys, that is <b>${r}% more</b> girls than boys. Compared with the whole class of 20, the gap is ${gap}% of the class. Both are true facts, but they compare with different amounts, so "${gap}% more girls than boys" is wrong.`,[`Boys ${nb}, girls ${ng}, gap ${d}`,`${d} ÷ ${nb} × 100% = ${r}% more than boys`,`${d} ÷ 20 × 100% = ${gap}% of the class`])})}})}})})}
/* percentage of a percentage (Challenge) */
function fnPofPRound(api,T){const rep=pick(FNREP),[p,f,fn,N]=pick([[40,.5,'half',20],[60,.5,'half',20],[80,.25,'a quarter',20],[50,.25,'a quarter',40]]),c=p*N/100,h=c*f,pc=fnR2(h/N*100),wrongP=fnR2(f*100),truth=Math.random()<.35;
  api.q(fnScene(rep,`🚲 ${p}% of Class 1C cycle to school, and ${fn} of the cyclists wear a helmet. "So ${truth?pc:wrongP}% of the class wear a helmet!"`,`Class 1C has ${N} students.`)+`<p class="qt">📰 <b>${rep[0]}</b> has a road safety story. TRUE or FAKE?</p>`);
  fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',fnDots([['Class 1C','fnHa',N]],`count Class 1C (${N} students)`));
    askOne(api,{id:'fnH1',label:`<b>Step 2:</b> ${p}% of ${N} students cycle. How many cyclists?`,w:4,right:c,hint:`${p} ÷ 100 × ${N}`,then:()=>{fnFill('fnHa',c,N);
      askOne(api,{id:'fnH2',label:`<b>Step 3:</b> ${fn} of the ${c} cyclists wear a helmet. How many students?`,w:4,right:h,traps:[[N*f,`That's ${fn} of the whole <b>class</b>. It's ${fn} of the <b>cyclists</b>.`]],hint:`${c} × ${f}`,then:()=>{fnFill('fnHa',h,0);
        askOne(api,{id:'fnH3',label:`<b>Step 4:</b> ${h} out of ${N} students wear a helmet. As a percentage of the class, that is`,w:5,unit:'%',right:pc,traps:[[wrongP,`${wrongP}% is the share of the <b>cyclists</b>. As a share of the whole class: ${h} out of ${N}.`]],hint:`${h} ÷ ${N} × 100%`,
          then:()=>fnVerdict(api,truth,`${fn[0].toUpperCase()+fn.slice(1)} of the cyclists is ${fn} of ${p}% of the class: ${f} × ${p}% = <b>${pc}%</b> of the class, not ${wrongP}%.`,[`Cyclists: ${p}% of ${N} = ${c}`,`Helmets: ${fn} of ${c} = ${h}`,`${h} ÷ ${N} × 100% = ${pc}%`])})}})}})})}
/* find the flaw: classic fallacies as news stories (Challenge) */
const FNFLAW=[{head:'💸 MYSTERY: a dollar vanishes at the zi char stall!',lines:['Three friends pay $10 each for dinner: $30.','The bill is only $25, so the cashier gives the waiter $5 to return.','The waiter gives each friend $1 back and keeps $2.','So each friend paid $9, and 3 × $9 = $27.','$27 + the waiter\'s $2 = $29. One dollar has vanished!'],bad:4,
   why:'The $27 the friends paid <b>already includes</b> the waiter\'s $2 ($25 bill + $2). Adding the $2 again counts it twice. The right check is $27 paid + $3 returned = $30.',q:['The $27 the friends paid = $25 bill + $__ kept by the waiter',2]},
  {head:'💍 Shopper gets a $200 ring for $100, and says it is fair!',lines:['Mei buys a ring for $100.','The next day she swaps it for a $200 ring.','The jeweller asks her to pay $100 more.','Mei: "I paid you $100 yesterday, and I just gave you back a $100 ring. That makes $200, so I owe nothing!"'],bad:3,
   why:'The $100 ring she gave back was <b>bought with</b> the $100 she paid. It is the same $100 counted twice. The jeweller has only received $100 for a $200 ring.',q:['How much more must Mei pay?',100]},
  {head:'📚 MYSTERY: a dollar disappears when two bookmark stalls join up!',lines:['Stall A sells bookmarks at 2 for $1. Stall B sells them at 3 for $1.','Each stall has 30 bookmarks. Apart, A earns $15 and B earns $10: $25 in total.','They join up. "2 for $1 plus 3 for $1 is the same as 5 for $2," they say.','60 bookmarks make 12 bundles of 5, so they earn 12 × $2 = $24.','A dollar has disappeared!'],bad:2,
   why:'"5 for $2" is <b>not</b> the same deal. It would only match if the stalls sold their bookmarks in a 2 : 3 mix, but they have 30 each. At 5 for $2, every bookmark sells for 40 cents, but Stall A\'s really sold for 50 cents. Nothing disappeared: the joint price was just lower.',q:['At 5 for $2, how many cents is each bookmark?',40]}];
function fnFlawRound(api,T){const rep=pick(FNREP),F=pick(FNFLAW);
  api.q(fnScene(rep,F.head,'A story is going round. Something in it is wrong.')+`<p class="qt">📰 <b>${rep[0]}</b> brings a puzzling story. Is the headline TRUE or FAKE?</p>`);
  fnGut(api,()=>{api.body.insertAdjacentHTML('beforeend',`<div class="fnlab"><h4>🔬 Test lab: check the story, line by line</h4><ol class="fnstory">${F.lines.map(l=>`<li>${l}</li>`).join('')}</ol></div>`);
    const L=F.lines.map((l,i)=>`Line ${i+1}`);
    stepPick(api,{id:'fnFl',keepOrder:true,label:'<b>Step 2:</b> which line has the mistake?',options:L,right:L[F.bad],pen:'fnFq',hint:()=>'Check each line with the numbers. Which one adds or counts something that is already counted?',
      reveal:()=>`The mistake is in line ${F.bad+1}. Tap it to carry on.`,okMsg:`<p class="askok">Yes, line ${F.bad+1}. ${F.why}</p>`,
      then:()=>askOne(api,{id:'fnFq',label:`<b>Step 3:</b> ${F.q[0]}`,w:5,right:F.q[1],hint:'Use the numbers from the story.',
        then:()=>fnVerdict(api,false,F.why,F.lines.map((l,i)=>i===F.bad?`❌ ${l}`:l))})})})}

/* each game draws 8 claims from its level's pool (no repeats): Core = one-step claims with full scaffolding;
   Stretch = two-step changes, reverse %, real SG data; Challenge = ratio, compound and "find the flaw" claims */
const FNPOOL=[{first:'swap',rest:['simple','back','pts','rev','over','slow','ratio','simple']},
  {first:'back',rest:['add','down2','pts','units','rev','fare','gst','order','ratio','slow']},
  {first:'units',rest:['rev','fare','gst','order','ratio','girls','svc','pofp','flaw','double','true25']}];
const FNH={swap:['"Percent" means "out of 100". a% of b = a ÷ 100 × b.','Work out the easier side.','Write each side as one multiplication.'],
 simple:['How many pieces of the rise fit into the old price?','The rise is 1 of those pieces.','1 ÷ number of pieces × 100%.'],
 back:['Each machine works on the price that comes IN.','The second % is taken of a different (bigger) amount.','Compare the final price with the start.'],
 add:['Each machine works on the price that comes IN.','The second % is taken of the new, bigger price.','Compare the final price with the start.'],
 down2:['The second discount comes off the SALE price.','Run the price through each machine.','Compare the final price with the start.'],
 fare:['The 7% is taken of the 2025 fare, not the 2024 fare.','Run $100 through both machines.','Compare the final amount with $100.'],
 slow:['A smaller increase is still an increase.','Run the price through both machines.','Is the final price higher or lower than the start?'],
 svc:['GST is charged on the food AND the service charge.','Run $100 through both machines.','Compare the final bill with $100.'],
 pts:['Turn each percentage into a number of students first.','Find how many more (or fewer) students there are now.','Compare that with the number LAST term.'],
 gst:['Work out the GST in dollars at 8% and at 9%.','Find how much more GST that is.','Compare the extra with the OLD GST.'],
 units:['Draw A with its units. p% more means add p% of A\'s units.','"Less than B" compares the gap with B, not A.','Gap ÷ B\'s units × 100%.'],
 rev:['The % off was taken from the ORIGINAL price, not the sale price.','The sale price is (100 − discount)% of the original.','Find 1 part (or 1%), then multiply up to 100%.'],
 order:['Each change multiplies the price.','Run $100 through each shop.','Does the order of multiplying change the answer?'],
 ratio:['A ratio compares the two groups. A percentage of the group compares with EVERYONE.','Add the units to get the whole group.','Part ÷ whole × 100%.'],
 girls:['Work out how many boys and girls.','"More than boys" compares the gap with the boys.','"Of the class" compares the gap with everyone.'],
 pofp:['Find the number of cyclists first.','Then take the fraction of the cyclists, not of the class.','Compare with the whole class.'],
 flaw:['Check each line with the numbers.','Look for something counted twice.','Which line adds two amounts that overlap?'],
 over:['Up 100% means double. Up 200% means old + 2 × old.','Increases can be more than 100%.','How many times the old price is the new price?'],
 double:['Multiply the two changes: × 1.5 × 1.5…','Doubling is × 2.','Compare your answer with 2.'],
 true25:['Run the price through each machine.','Up 25% is × 1.25. Down 20% is × 0.8.','1.25 × 0.8 = ?']};
addGame('s1-news',{level:'Sec 1',sec:'s1',strand:'num',glyph:'📰',music:'news',title:'Fake News Desk',topic:'Percentage change and reverse percentage',
 how:'Reporters rush in with percentage headlines, many from real Singapore news. Stamp each one TRUE or FAKE, investigate with hands-on tools, then publish or fix your call. Core: one-step claims. Stretch: two-step changes and reverse percentage. Challenge: ratios, compound changes and spot-the-flaw stories.',rounds:8,
 round(api,r){const T=TIER();if(r===0||!ctx.fnPlan){const P=FNPOOL[T];ctx.fnPlan=[P.first,...shuffle([...new Set(P.rest)]).slice(0,7)];while(ctx.fnPlan.length<8)ctx.fnPlan.push(pick(P.rest))}
  let t=ctx.fnPlan[r];try{(QHINTS['s1-news']=QHINTS['s1-news']||[])[r]=FNH[t]||FNHINTS[0]}catch(e){}
  if(t==='simple')return fnSimpleRound(api,T);if(t==='gst')return fnGstRound(api,T);if(t==='order')return fnOrderRound(api,T);if(t==='ratio')return fnRatioRound(api,T);
  if(t==='girls')return fnGirlsRound(api,T);if(t==='pofp')return fnPofPRound(api,T);if(t==='flaw')return fnFlawRound(api,T);
  if(['back','add','down2','fare','slow','svc','over','double','true25'].includes(t))return fnChainRound(api,T,t);
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
