/* ================= THEME MUSIC =================
   Every game gets its own original chiptune, composed live in the browser from the game's name:
   key, mode, tempo, chord progression, melody motifs and instruments all come from a seeded random generator.
   No audio files, so there is nothing to license. */
const MUSIC={on:true,key:null,timer:null,gain:null,song:null,n:0,next:0,noise:null};
try{MUSIC.on=localStorage.getItem('arcMusic')!=='0'}catch(e){}
function hashStr(s){let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function compose(key){const rnd=mulberry(hashStr(key)),pk=a=>a[Math.floor(rnd()*a.length)];
  const minor=rnd()<.3,scale=minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11],root=pk([0,2,3,5,7,-3,-2]),bpm=pk([100,108,116,124,132]);
  const prog=pk(minor?[[0,5,2,6],[0,3,4,0],[0,6,5,4],[0,3,6,4]]:[[0,4,5,3],[0,5,3,4],[5,3,0,4],[0,3,4,3],[0,3,5,4],[0,4,3,4]]);
  const motif=()=>{const ev=[];let s=0;while(s<16){const len=pk([2,2,2,4,1,1,3,4]);if(rnd()<.18){s+=len;continue}ev.push({s,len:Math.min(len,16-s),d:pk([0,2,4,4,7,1,3,5,2])});s+=len}return ev};
  const A=motif(),B=motif(),C=motif();
  return {bpm,root,scale,prog,form:[A,B,A,C,A,B,C,A],lead:pk(['square','triangle','square','sawtooth']),arp:rnd()<.7,hat:rnd()<.85,bassPat:pk([[0,8],[0,6,8,14],[0,4,8,12],[0,10]])}}
const midiF=m=>440*Math.pow(2,(m-69)/12);
function mnote(S,d,oct){const o=Math.floor(d/7),i=((d%7)+7)%7;return 60+S.root+S.scale[i]+12*(o+oct)}
function mtone(t,f,dur,type,vol){const c=AC,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(MUSIC.gain);o.start(t);o.stop(t+dur+.05)}
function mnoise(t,dur,vol,hp){const c=AC;if(!MUSIC.noise){const b=c.createBuffer(1,c.sampleRate*.5,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;MUSIC.noise=b}
  const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=MUSIC.noise;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f).connect(g).connect(MUSIC.gain);s.start(t);s.stop(t+dur+.02)}
function mstep(S,n,t){const st=60/S.bpm/4,s=n%16,bar=Math.floor(n/16)%8,ch=S.prog[bar%4];
  if(s===0||s===8)mtone(t,110,.18,'sine',.16),mtone(t,60,.2,'sine',.12);
  if(s===4||s===12)mnoise(t,.12,.06,1800);
  if(S.hat&&s%2===0)mnoise(t,.04,.025,7000);
  if(S.bassPat.includes(s))mtone(t,midiF(mnote(S,ch,-2)),st*3,'triangle',.11);
  if(S.arp&&s%2===1){const k=[0,2,4,7][(s>>1)%4];mtone(t,midiF(mnote(S,ch+k,0)),st*1.5,'sine',.028)}
  S.form[bar].forEach(ev=>{if(ev.s===s)mtone(t,midiF(mnote(S,ch+ev.d,1)),ev.len*st*.92,S.lead,.045)})}
function playMusic(key){if(!MUSIC.on)return stopMusic();const c=ac();if(!c||c.state!=='running')return;if(MUSIC.key===key&&MUSIC.timer)return;
  stopMusic(true);MUSIC.key=key;MUSIC.song=compose(key);MUSIC.gain=c.createGain();MUSIC.gain.gain.setValueAtTime(.0001,c.currentTime);MUSIC.gain.gain.exponentialRampToValueAtTime(.55,c.currentTime+.8);MUSIC.gain.connect(c.destination);
  MUSIC.n=0;MUSIC.next=c.currentTime+.1;MUSIC.timer=setInterval(()=>{const S=MUSIC.song,st=60/S.bpm/4;while(MUSIC.next<c.currentTime+.15){mstep(S,MUSIC.n,MUSIC.next);MUSIC.n++;MUSIC.next+=st}},30)}
function stopMusic(keepKey){clearInterval(MUSIC.timer);MUSIC.timer=null;if(MUSIC.gain&&AC){const g=MUSIC.gain;try{g.gain.cancelScheduledValues(AC.currentTime);g.gain.setValueAtTime(g.gain.value||.3,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+.4)}catch(e){}setTimeout(()=>g.disconnect(),600)}MUSIC.gain=null;if(!keepKey)MUSIC.key=null}
const musicKey=()=>{const h=location.hash.slice(1);return GAMES[h]?h:'hub'};
function setMusic(on){MUSIC.on=on;try{localStorage.setItem('arcMusic',on?'1':'0')}catch(e){}$('music').innerHTML='♪<span class="tl"> Music: '+(on?'on':'off')+'</span>';$('music').setAttribute('aria-label','Music '+(on?'on':'off'));$('music').setAttribute('aria-pressed',String(on));$('music').classList.toggle('off',!on);$('music').title=on?'Turn off the background song':'Turn on the background song';on?playMusic(musicKey()):stopMusic()}
$('music').onclick=()=>{ac();setMusic(!MUSIC.on)};
/* browsers only allow sound after the first tap, so start the music then */
addEventListener('pointerdown',()=>{const c=ac();if(c&&c.state!=='running')c.resume().then(()=>playMusic(musicKey()));else playMusic(musicKey())},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();else if(AC&&AC.state==='running')playMusic(musicKey())});
setMusic(MUSIC.on);
window.MUSICREADY=true;
