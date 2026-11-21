/* ================= THEME MUSIC =================
   Every game gets its own original chiptune, composed live in the browser from the game's name:
   key, mode, tempo, chord progression, melody motifs and instruments all come from a seeded random generator.
   No audio files, so there is nothing to license. */
const MUSIC={on:true,key:null,timer:null,gain:null,song:null,n:0,next:0,noise:null};
try{MUSIC.on=localStorage.getItem('arcMusic')!=='0'}catch(e){}
function hashStr(s){let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function compose(key){const base=key.replace('~secret',''),G0=GAMES[base];
  if(G0&&G0.music==='news')return newsSong(key.endsWith('~secret'));
  if(G0&&G0.music==='hawker')return {hawker:true,bpm:96};
  if(G0&&G0.music==='warehouse')return whSong(key.endsWith('~secret'));
  if(G0&&G0.music==='paint')return {paint:true,secret:key.endsWith('~secret'),bpm:key.endsWith('~secret')?150:100};
  const rnd=mulberry(hashStr(key)),pk=a=>a[Math.floor(rnd()*a.length)];
  const secret=key.endsWith('~secret'),chill=key==='secondary'||!!(GAMES[key]&&GAMES[key].sec),minor=!secret&&rnd()<.3,scale=chill?[0,2,3,5,7,9,10]:minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11],root=pk([0,2,3,5,7,-3,-2]),bpm=secret?150:chill?84:pk([100,108,116,124,132]);
  const prog=chill?[0,3,6,4]:pk(minor?[[0,5,2,6],[0,3,4,0],[0,6,5,4],[0,3,6,4]]:[[0,4,5,3],[0,5,3,4],[5,3,0,4],[0,3,4,3],[0,3,5,4],[0,4,3,4]]);
  const motif=()=>{const ev=[];let s=0;while(s<16){const len=pk([2,2,2,4,1,1,3,4]);if(rnd()<.18){s+=len;continue}ev.push({s,len:Math.min(len,16-s),d:pk([0,2,4,4,7,1,3,5,2])});s+=len}return ev};
  const A=motif(),B=motif(),C=motif();
  /* secondary games: same laid-back feel, but each game picks its own tempo, chords and lead sound (a separate seed, so primary songs don't change) */
  if(chill&&!secret&&G0){const r2=mulberry(hashStr(key+'#sec')),p2=a=>a[Math.floor(r2()*a.length)];
    return {bpm:p2([80,86,92,98,104]),root,scale,prog:p2([[0,3,6,4],[0,5,3,4],[0,4,5,3],[5,3,0,4],[0,6,5,4]]),form:[A,B,A,C,A,B,C,A],chill,lead:p2(['triangle','sine','triangle']),arp:r2()<.8,hat:true,secret,bassPat:p2([[0,8],[0,6,8,14],[0,10],[0,3,8,11]])}}
  return {bpm,root,scale,prog,form:[A,B,A,C,A,B,C,A],chill,lead:secret?'square':chill?'triangle':pk(['square','triangle','square','sawtooth']),arp:secret||rnd()<.7,hat:secret||rnd()<.85,secret,bassPat:pk([[0,8],[0,6,8,14],[0,4,8,12],[0,10]])}}
/* Fake News Desk: a breaking-news theme. Driving beat, typewriter clicks with a bell at the end of each line,
   3-3-2 brass stabs and a short fanfare. The secret round adds a siren and goes faster. */
function newsSong(secret){const n=(s,len,d)=>({s,len,d});
  return {news:true,secret,bpm:secret?152:132,root:-3,scale:[0,2,3,5,7,8,10],prog:[0,5,3,6],lead:'sawtooth',bassPat:[],
    form:[[n(0,3,0),n(3,3,2),n(6,2,4),n(8,6,7)],[n(0,2,7),n(2,2,6),n(4,2,4),n(6,10,2)],[n(0,3,4),n(3,3,6),n(6,2,7),n(8,6,9)],[n(0,4,7),n(4,4,4),n(8,8,0)],
          [n(0,3,0),n(3,3,2),n(6,2,4),n(8,6,7)],[n(0,2,7),n(2,2,9),n(4,2,7),n(6,10,4)],[],[n(0,2,4),n(2,2,4),n(4,4,6),n(8,8,7)]]}}
function mslide(t,f1,f2,dur,vol){const c=AC,o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(f1,t);o.frequency.linearRampToValueAtTime(f2,t+dur/2);o.frequency.linearRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(MUSIC.gain);o.start(t);o.stop(t+dur+.05)}
const TYPE=[1,0,1,1,0,1,1,0,1,0,1,1,1,0,1,0];
function newsStep(S,n,t){const st=60/S.bpm/4,s=n%16,bar=Math.floor(n/16)%8,ch=S.prog[bar%4];
  if(s===0||s===6||s===8||(S.secret&&s===14))mtone(t,120,.16,'sine',.17),mtone(t,55,.18,'sine',.12);   /* kick */
  if(s===4||s===12)mnoise(t,.1,.07,2000);                                                                /* snare */
  if(TYPE[(s+bar*3)%16])mnoise(t,.018,s%4===0?.05:.03,5000);                                             /* typewriter keys */
  if(bar%2===1&&s===15)mtone(t,2093,.5,'sine',.05),mtone(t,3136,.35,'sine',.025);                       /* the carriage-return bell */
  if(s===0||s===3||s===6)[0,2,4].forEach(k=>mtone(t,midiF(mnote(S,ch+k,0)),st*1.4,'square',.022));       /* 3-3-2 news stabs */
  if(s%2===0)mtone(t,midiF(mnote(S,ch,-2)),st*1.6,'square',.05);                                         /* pulsing bass */
  if(S.secret&&s===0&&bar%2===0)mslide(t,660,880,st*14,.035);                                            /* siren */
  S.form[bar].forEach(ev=>{if(ev.s===s)mtone(t,midiF(mnote(S,ch+ev.d,1)),ev.len*st*.85,S.lead,.03)})}
/* Triangle Sorter's warehouse: a bouncy, friendly groove. Soft triangle-wave tune, conveyor clunks on the off-beats,
   a shaker, a walking bass and a little scanner beep every few bars. No harsh square or sawtooth leads. */
function whSong(secret){const n=(s,len,d)=>({s,len,d});
  const A=[n(0,2,4),n(2,2,4),n(4,2,5),n(6,2,4),n(8,4,2),n(12,4,0)],B=[n(0,2,2),n(2,2,4),n(4,4,5),n(8,2,4),n(10,2,2),n(12,4,4)],
    C=[n(0,3,7),n(3,3,5),n(6,2,4),n(8,4,5),n(12,4,4)],D=[n(0,2,4),n(2,2,2),n(4,2,1),n(6,2,2),n(8,8,0)];
  return {wh:true,secret,bpm:secret?128:108,root:0,scale:[0,2,4,5,7,9,11],prog:[0,3,4,0],lead:'triangle',bassPat:[0,6,8,14],form:[A,B,A,D,C,B,C,D]}}
function whStep(S,n,t){const st=60/S.bpm/4,s=n%16,bar=Math.floor(n/16)%8,ch=S.prog[bar%4];
  if(s===0||s===8)mtone(t,100,.16,'sine',.15),mtone(t,55,.18,'sine',.1);                                 /* soft kick */
  if(s===4||s===12)mtone(t,190,.07,'triangle',.07),mnoise(t,.06,.05,700);                              /* conveyor clunk */
  if(s%2===1)mnoise(t,.025,.016,6500);                                                                   /* shaker */
  if(s===0)[0,2,4].forEach(k=>mtone(t,midiF(mnote(S,ch+k,0)),st*14,'sine',.026));                       /* warm chord */
  if(S.bassPat.includes(s))mtone(t,midiF(mnote(S,ch+(s===6||s===14?4:0),-2)),st*2.5,'triangle',.1);     /* walking bass */
  if(bar%4===3&&(s===13||s===15))mtone(t,1568,.06,'sine',.035);                                         /* scanner beep-beep */
  if(S.secret&&s%4===2)mtone(t,midiF(mnote(S,ch+[4,7,9,11][(n>>2)%4],2)),st*.9,'sine',.025);
  S.form[bar].forEach(ev=>{if(ev.s===s)mtone(t,midiF(mnote(S,ch+ev.d,1)),ev.len*st*.9,S.lead,.06)})}
const midiF=m=>440*Math.pow(2,(m-69)/12);
/* Hawker Centre Tycoon: a warm, easy-going hawker-centre tune. A plucked lead on the five-note (pentatonic) scale,
   soft chords, a walking bass and a light hand-drum and shaker groove. Written for this game. */
const HWPENT=[0,2,4,7,9],HWMEL=[[[0,2,4],[2,2,3],[4,4,2],[8,2,3],[10,2,4],[12,4,5]],[[0,2,4],[2,2,2],[4,2,3],[6,2,1],[8,8,2]],[[0,2,2],[2,2,3],[4,4,4],[8,2,6],[10,2,5],[12,4,4]],[[0,4,3],[4,4,2],[8,8,0]],
  [[0,2,4],[2,2,3],[4,4,2],[8,2,3],[10,2,4],[12,4,5]],[[0,2,4],[2,2,5],[4,4,7],[8,2,6],[10,2,5],[12,4,4]],[[0,2,3],[2,2,4],[4,2,2],[6,2,1],[8,8,2]],[[0,4,1],[4,4,2],[8,8,0]]];
const HWCH=[[0,4,7],[9,12,16],[5,9,12],[7,11,14],[0,4,7],[5,9,12],[2,5,9],[0,4,7]];
function hawkerStep(S,n,t){const st=60/S.bpm/4,s=n%16,bar=Math.floor(n/16)%8,K=65,pm=d=>K+HWPENT[((d%5)+5)%5]+12*Math.floor(d/5),ch=HWCH[bar];
  if(s===0||s===6||s===10)mtone(t,s===0?150:190,.16,'sine',s===0?.14:.08);   /* hand drum */
  if(s===4||s===12)mnoise(t,.06,.035,3000);                                   /* soft slap */
  if(s%2===0)mnoise(t,.025,s%4===0?.018:.011,9000);                           /* shaker */
  if(s===0)ch.forEach(k=>mtone(t,midiF(K-12+k),st*15,'sine',.022));           /* chord pad */
  if(s===0||s===8)mtone(t,midiF(K-24+ch[0]),st*5,'triangle',.1);             /* bass */
  if(s===12)mtone(t,midiF(K-24+ch[0]+7),st*3,'triangle',.07);
  if(s%4===2)mtone(t,midiF(K+ch[(s>>2)%3]),st*1.2,'triangle',.018);          /* off-beat pluck */
  HWMEL[bar].forEach(([b,len,d])=>{if(b===s){const f=midiF(pm(d));mtone(t,f,Math.min(len*st,.55),'triangle',.07);mtone(t,f*2,Math.min(len*st,.3),'sine',.015)}})}
/* Qubi's Paint Shop: a bouncy "ukulele and brushes" shop tune in F major (I-vi-IV-V). Soft kick, brush snare,
   strummed off-beat chords and a sing-along melody. The secret Mural Rush round plays it faster with a sparkle. */
const PSCH=[[0,4,7],[9,12,16],[5,9,12],[7,11,14]],PSBASS=[0,9,5,7],PSMEL=[[0,7],[3,9],[6,12],[10,11],[12,9],[16,7],[19,4],[22,5],[24,7],[28,12],[32,14],[35,12],[38,11],[40,9],[44,7],[48,9],[51,7],[54,4],[56,5],[60,4]];
function paintStep(S,n,t){const st=60/S.bpm/4,s=n%16,bar=Math.floor(n/16)%4,ch=PSCH[bar],R=65;
  if(s===0||s===10)mtone(t,92,.2,'sine',.16);                                   /* soft kick */
  if(s===4||s===12)mnoise(t,.09,.05,2500);if(s%2===0)mnoise(t,.025,.018,8000);  /* brushes */
  if(s===0||s===6||s===8||s===14)mtone(t,midiF(R-24+PSBASS[bar]+(s===6||s===14?7:0)),st*2.4,'triangle',.11);
  if(s%4===2)ch.forEach((k,i)=>mtone(t+i*.012,midiF(R+k),st*1.6,'triangle',.03)); /* strum */
  const pos=n%64;PSMEL.forEach(([p,d])=>{if(p===pos)mtone(t,midiF(R+12+d),st*1.8,'sine',.07)});
  if(S.secret&&s%2===1)mtone(t,midiF(R+24+ch[(s>>1)%3]),st*.8,'square',.012)}
function mnote(S,d,oct){const o=Math.floor(d/7),i=((d%7)+7)%7;return 60+S.root+S.scale[i]+12*(o+oct)}
function mtone(t,f,dur,type,vol){const c=AC,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(MUSIC.gain);o.start(t);o.stop(t+dur+.05)}
function mnoise(t,dur,vol,hp){const c=AC;if(!MUSIC.noise){const b=c.createBuffer(1,c.sampleRate*.5,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;MUSIC.noise=b}
  const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=MUSIC.noise;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f).connect(g).connect(MUSIC.gain);s.start(t);s.stop(t+dur+.02)}
function mstep(S,n,t){if(S.news)return newsStep(S,n,t);if(S.hawker)return hawkerStep(S,n,t);if(S.wh)return whStep(S,n,t);if(S.paint)return paintStep(S,n,t);const st=60/S.bpm/4,s=n%16,bar=Math.floor(n/16)%8,ch=S.prog[bar%4];
  if(S.chill){ /* the secondary theme: slower, laid-back beat with soft chords */
    if(s===0||s===10)mtone(t,90,.22,'sine',.18),mtone(t,55,.24,'sine',.13);if(s===8)mnoise(t,.14,.06,1500);if(s%4===2)mnoise(t,.03,.022,8000);
    if(s===0)[0,2,4,6].forEach(k=>mtone(t,midiF(mnote(S,ch+k,0)),st*15,'sine',.034))}
  else{if(s===0||s===8)mtone(t,110,.18,'sine',.16),mtone(t,60,.2,'sine',.12);
  if(s===4||s===12)mnoise(t,.12,.06,1800);
  if(S.hat&&s%2===0)mnoise(t,.04,.025,7000)}
  if(S.bassPat.includes(s))mtone(t,midiF(mnote(S,ch,-2)),st*3,'triangle',.11);
  if(S.arp&&s%2===1){const k=[0,2,4,7][(s>>1)%4];mtone(t,midiF(mnote(S,ch+k,0)),st*1.5,'sine',.028)}
  if(S.secret&&s%4===2)mtone(t,midiF(mnote(S,ch+[4,7,9,11][(n>>2)%4],2)),st*.9,'sine',.03); /* twinkles in the secret round */
  S.form[bar].forEach(ev=>{if(ev.s===s)mtone(t,midiF(mnote(S,ch+ev.d,S.chill?0:1)),ev.len*st*.92,S.lead,S.chill?.085:.045)})}
function playMusic(key){if(!MUSIC.on)return stopMusic();const c=ac();if(!c||c.state!=='running')return;if(MUSIC.key===key&&MUSIC.timer)return;
  stopMusic(true);MUSIC.key=key;MUSIC.song=compose(key);MUSIC.gain=c.createGain();MUSIC.gain.gain.setValueAtTime(.0001,c.currentTime);MUSIC.gain.gain.exponentialRampToValueAtTime(Math.max(.0001,.55*VOL.m),c.currentTime+.8);MUSIC.gain.connect(c.destination);
  MUSIC.n=0;MUSIC.next=c.currentTime+.1;MUSIC.timer=setInterval(()=>{const S=MUSIC.song,st=60/S.bpm/4;while(MUSIC.next<c.currentTime+.15){mstep(S,MUSIC.n,MUSIC.next);MUSIC.n++;MUSIC.next+=st}},30)}
function stopMusic(keepKey){clearInterval(MUSIC.timer);MUSIC.timer=null;if(MUSIC.gain&&AC){const g=MUSIC.gain;try{g.gain.cancelScheduledValues(AC.currentTime);g.gain.setValueAtTime(g.gain.value||.3,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+.4)}catch(e){}setTimeout(()=>g.disconnect(),600)}MUSIC.gain=null;if(!keepKey)MUSIC.key=null}
/* three theme songs: 'hub' is the main Maths Arcade theme (start screen), 'primary' and 'secondary' have their own */
const musicKey=()=>{const h=location.hash.slice(1);if(!GAMES[h])return h==='secondary'?'secondary':h==='start'||(typeof START_SEEN!=='undefined'&&!START_SEEN)?'hub':'primary';return typeof ctx!=='undefined'&&ctx&&ctx.id===h&&ctx.inBonus&&document.body.classList.contains('playing')?h+'~secret':h};
function setMusic(on){MUSIC.on=on;try{localStorage.setItem('arcMusic',on?'1':'0')}catch(e){}$('music').innerHTML='♪<span class="tl"> Music: '+(on?'on':'off')+'</span>';$('music').setAttribute('aria-label','Music '+(on?'on':'off'));$('music').setAttribute('aria-pressed',String(on));$('music').classList.toggle('off',!on);$('music').title=on?'Turn off the background song':'Turn on the background song';on?playMusic(musicKey()):stopMusic()}
$('music').onclick=()=>{ac();setMusic(!MUSIC.on)};
/* browsers only allow sound after the first tap, so start the music then */
addEventListener('pointerdown',()=>{const c=ac();if(c&&c.state!=='running')c.resume().then(()=>playMusic(musicKey()));else playMusic(musicKey())},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();else if(AC&&AC.state==='running')playMusic(musicKey())});
setMusic(MUSIC.on);
/* volume panel: two sliders, remembered on this device */
(()=>{const btn=$('vol'),pn=$('volPanel');if(!btn||!pn)return;
  const pct=v=>v<=0?'Off':Math.round(v*100)+'%';
  /* the old on/off buttons are gone: anyone who had switched music or sound effects off now has that slider at 0 */
  try{if(!MUSIC.on){VOL.m=0;localStorage.setItem('arcVol_m','0');setMusic(true)}if(muted){VOL.s=0;localStorage.setItem('arcVol_s','0');setMute(false)}}catch(e){}
  const set=(k,v,quiet)=>{VOL[k]=v;try{localStorage.setItem('arcVol_'+k,String(v))}catch(e){}$('vol_'+k+'v').textContent=pct(v);
    if(k==='m'&&MUSIC.gain&&AC){try{MUSIC.gain.gain.cancelScheduledValues(AC.currentTime);MUSIC.gain.gain.setTargetAtTime(Math.max(.0001,.55*v),AC.currentTime,.05)}catch(e){}}
    if(k==='s'){if(SFXBUS)SFXBUS.gain.value=v;if(!quiet)sfx.pop()}};
  ['m','s'].forEach(k=>{const r=$('vol_'+k);r.value=Math.round(VOL[k]*100);$('vol_'+k+'v').textContent=pct(VOL[k]);r.oninput=()=>set(k,r.value/100,true);r.onchange=()=>set(k,r.value/100)});
  btn.onclick=e=>{e.stopPropagation();ac();pn.hidden=!pn.hidden;btn.setAttribute('aria-expanded',String(!pn.hidden))};
  pn.onclick=e=>e.stopPropagation();document.addEventListener('click',()=>{pn.hidden=true;btn.setAttribute('aria-expanded','false')});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')pn.hidden=true})})();
window.MUSICREADY=true;
