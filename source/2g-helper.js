/* ================= ASK QUBI: a scripted helper in the bottom-left corner =================
   No AI and no data leaves the page. Pupils tap choices; Qubi answers from the text below.
   "I'm stuck" gives hints one at a time (nudge -> method -> one worked step), never the final answer,
   only in Solo mode, and a round where a hint was used is recorded as "helped" on the teacher tracker.
   To add hints for another game: QHINTS['game-id']=[ [hint1,hint2,hint3], ... one list per question type, in the
   same order as the game's round types ]. Games without their own hints get the general thinking steps. */
const QHINTS={
  's1-split':[
    ['Tap a blue number and pick any factor pair. It doesn\'t matter which: you always end with the same primes.','Keep splitting every blue number. Stop only when every member is gold (prime).','Count how many times each prime appears. That number becomes its index, e.g. 2, 2, 2 → 2³.'],
    ['Check each member: can it still be split into two smaller factors?','Even numbers bigger than 2, and numbers like 9, 15 or 25, are not prime.','Split the member that isn\'t prime, then rewrite the whole list using only primes.'],
    ['Every number in a prime factorisation must be prime. Is 1 prime? Is 4?','Multiply each choice out. Only one gives exactly the right number with only primes.','Write the number as a factor tree first, then count each prime.'],
    ['An index tells you how many times to multiply the prime by itself.','2³ means 2 × 2 × 2 = 8, not 2 × 3.','Work out each power first, then multiply the results together.'],
    ['The members of a number are multiplied, not added.','Multiply the small primes first, e.g. 2 × 2 = 4, then 4 × 3 = 12…','Check: the product should be a composite number made only of those primes.'],
    ['Write both lists of primes in order from smallest to largest.','Compare them: are the same primes there the same number of times?','Every whole number greater than 1 has only one prime factorisation.'],
    ['Tap a blue number and pick any factor pair. It doesn\'t matter which: you always end with the same primes.','Keep splitting every blue number. Stop only when every member is gold (prime).','Count how many times each prime appears. That number becomes its index, e.g. 2, 2, 2 → 2³.'],
    ['Tap a blue number and pick any factor pair. It doesn\'t matter which: you always end with the same primes.','Keep splitting every blue number. Stop only when every member is gold (prime).','Count how many times each prime appears. That number becomes its index, e.g. 2, 2, 2 → 2³.']
  ],
  's1-tables':[
    ['Look for a prime that appears in both teams. Tap it in one team, then in the other.','Each matching pair takes one shared seat. Keep going until no prime appears in both teams.','The HCF is one prime from each shared pair, multiplied.'],
    ['Pair up the shared primes first, then look at every column.','The LCM takes one prime from every column: shared pairs count once.','Don\'t multiply the two numbers: that counts the shared primes twice.'],
    ['HCF: only primes that appear in every number.','Take the lowest power of each shared prime.','Example: 2³ and 2² share 2², so use 2².'],
    ['LCM: every prime that appears in any of the numbers.','Take the highest power of each prime.','Example: 2³ and 2² → use 2³.'],
    ['Do the two numbers share any prime members?','If they share none, the only common factor is 1.','With nothing shared, the LCM is the two numbers multiplied together.'],
    ['Splitting things into identical groups with nothing left over → HCF.','Write both numbers as products of primes, then multiply the shared primes.','For the second step, divide by the number of groups.'],
    ['Things that repeat until they happen together again → LCM.','List the multiples of each number, or use prime factorisation.','For the second step, divide the LCM by how often the event happens.'],
    ['Ask yourself: am I sharing into equal groups (HCF) or waiting for things to line up (LCM)?','Then write both numbers as products of primes.','HCF: shared primes, lowest powers. LCM: all primes, highest powers.']
  ],
  's1-integers':[
    /* order */ ['On a number line, numbers get bigger as you move right. Where do the negative numbers sit?',
      'Every negative number is smaller than 0, and every positive number is bigger than 0. Sort the negatives first.',
      'For negatives, the one further from 0 is smaller: −9 is further left than −2, so −9 < −2. Now place the rest.'],
    /* temp */ ['Picture a thermometer. Does the temperature go up or down? By how many degrees?',
      'Going up means adding, going down means subtracting. Count the steps on the number line, crossing 0 if you need to.',
      'Example: from −3 °C going up 5 degrees: −3 → 0 is 3 steps, then 2 more steps reaches 2 °C. Try yours the same way.'],
    /* add */ ['Are the two numbers the same sign or different signs?',
      'Same signs: add the sizes and keep the sign. Different signs: take the smaller size from the bigger one, and keep the sign of the bigger one.',
      'Example: −8 + 3. Different signs, 8 − 3 = 5, and 8 is bigger, so the answer is −5. Check yours the same way.'],
    /* sub */ ['Subtracting a negative number is the tricky one. Is there a "minus a negative" in this question?',
      'Subtracting a number is the same as adding its opposite: a − (−b) = a + b, and a − b = a + (−b).',
      'Example: 4 − (−6) = 4 + 6 = 10. And −4 − 6 = −4 + (−6) = −10. Rewrite yours as an addition first.'],
    /* muldiv */ ['Work out the size first, then decide the sign separately.',
      'Same signs give a positive answer. Different signs give a negative answer. This works for × and ÷.',
      'Example: (−12) ÷ 3: 12 ÷ 3 = 4, and the signs are different, so −4. Do the size, then the sign.'],
    /* ops */ ['Which part do you work out first? Brackets, then powers, then × and ÷, then + and −.',
      'Watch the power: −3² means −(3 × 3) = −9, but (−3)² means (−3) × (−3) = 9. The bracket decides.',
      'Write each step on its own line, and do one operation at a time. Check the sign after every step.'],
    /* story */ ['What do the positive and negative numbers stand for in this story (above or below, gain or loss)?',
      'Write the story as a number sentence first, using + for up or gain and − for down or loss.',
      'Example: a diver at −12 m rises 5 m: −12 + 5 = −7, so 7 m below the surface. Write yours the same way.'],
    /* missing */ ['What operation would undo the one in the question?',
      'Use the inverse: if ? + 5 = −2, then ? = −2 − 5. If ? × (−3) = 12, then ? = 12 ÷ (−3).',
      'Work it out, then put your answer back into the question to check that both sides match.']
  ]
};
if(typeof FNHINTS!=='undefined')QHINTS['s1-news']=QHINTS['s1-news']||[];
QHINTS['s1-ratio']=QHINTS['s1-ratio']||[]; /* filled per round by 23-sec1-paint.js */
const QGENERAL=['Read the question again slowly. What exactly is it asking you to find? Point to the key numbers and words.',
  'Choose a tool: a model or bar diagram, a number line, a table, or a quick sketch. Which one fits this question?',
  'Do one small step at a time and write it down. Then check: is your answer sensible? Estimate first and compare.'];
const QLEVELS={pri:'<b>Easy</b> has the basic question types. <b>Medium</b> mixes in harder ones. <b>Hard</b> uses the trickiest types and bigger numbers. Start on Easy for a new topic, and move up once you score 6 or more out of 8.',
  sec:'Every level has the same 8 question types. <b>Core</b> uses friendly numbers, <b>Stretch</b> uses bigger or trickier numbers, and <b>Challenge</b> adds harder twists. Start on Core for a new topic, and move up once you score 6 or more out of 8.'};
let qhOpen=false,qhHint=0,qhPick=null;
function qhWhere(){const h=location.hash.slice(1),g=GAMES[h];if(g)return{game:h,G:g};if(h==='secondary')return{home:'sec'};if(h==='start'||(h===''&&typeof START_SEEN!=='undefined'&&!START_SEEN))return{home:'start'};return{home:'pri'}}
function qhLevelNow(){const w=qhWhere();if(w.G)return w.G.level;if(w.home==='sec')return({s1:'Sec 1',s2:'Sec 2',s3:'Sec 3',am:'Additional Maths'})[typeof secLevel==='string'?secLevel:'s1']||'Sec 1';return typeof level==='string'?level:'P4'}
function qhGames(lv){return ORDER.filter(id=>{const g=GAMES[id];return g.level===lv&&g.strand!=='party'&&g.strand!=='rev'})}
function qhInRound(){return !!(typeof ctx!=='undefined'&&ctx&&ctx.G&&ctx.id===location.hash.slice(1)&&document.body.classList.contains('playing')&&!ctx.answered)}
function qhSay(html,chips){const b=$('qhBody');if(!b)return;
  b.innerHTML=`<div class="qhmsg">${html}</div>${chips&&chips.length?`<div class="qhchips">${chips.map((c,i)=>`<button class="qhchip" data-i="${i}">${c[0]}</button>`).join('')}</div>`:''}`;
  b.querySelectorAll('.qhchip').forEach(x=>x.onclick=()=>{sfx.tap&&sfx.tap();chips[+x.dataset.i][1]()});b.scrollTop=0}
function qhMenu(){const w=qhWhere(),c=[];
  if(w.G){c.push(['🎮 How do I play this game?',qhHow]);c.push(['🤔 I\'m stuck on this question',qhStuck])}
  else c.push(['🧭 Which game should I play?',qhWhich]);
  c.push(['📶 What do the levels mean?',qhLv],['☁️ How do I save my score?',qhSave],['🔊 The music is too loud',qhSound]);c.push(['💬 Send feedback to the teacher',qhFeedback]);
  if(w.G)c.push(['🏠 Back to all the games',()=>{qhClose();location.hash=homeHref().slice(1)}]);
  qhSay(w.G?`Hi! You're playing <b>${esc(w.G.title)}</b>. What do you need help with?`:'Hi, I\'m Qubi! What do you need help with?',c)}
const qhBack=()=>['← Something else',qhMenu];
function qhHow(){const w=qhWhere();if(!w.G)return qhMenu();
  qhSay(`<b>${esc(w.G.title)}</b><br>${esc(w.G.how||'Answer each round as well as you can.')}<br><br>There are ${w.G.rounds||8} rounds. Wrong the first time? You get one more try for fewer points. In two-step questions, Step 1 must be right before Step 2 appears.`,[['🤔 I\'m stuck on this question',qhStuck],qhBack()])}
function qhStuck(){const w=qhWhere();
  if(!w.G)return qhMenu();
  if(!qhInRound())return qhSay('Start a round first, then tap me when you\'re stuck on a question. I\'ll give you a hint, one step at a time.',[qhBack()]);
  if(ctx.mode!=='solo')return qhSay('Hints are only in <b>Solo</b> mode, so games against a robot or a friend stay fair. You can do it. Read the question once more!',[qhBack()]);
  if(ctx.G.ownHint){qhClose();return ctx.G.ownHint()} /* games with their own hint button */
  if(qhPick!==ctx.r+':'+ctx.try+':'+ctx.id){qhPick=ctx.r+':'+ctx.try+':'+ctx.id;qhHint=0}
  qhNextHint()}
function qhNextHint(again){if(!qhInRound())return qhStuck();
  const list=(!ctx.inBonus&&QHINTS[ctx.id]&&QHINTS[ctx.id][ctx.rr])||QGENERAL;if(!again){ctx.hint=(ctx.hint||0)+1;qhHint=Math.min(qhHint+1,list.length)}
  const steps=list.slice(0,qhHint).map((h,i)=>`<div class="qhhint"><span class="qhn">Hint ${i+1}</span>${esc(h)}</div>`).join('');
  const more=qhHint<list.length,c=[];if(more)c.push(['💡 Another hint',qhNextHint]);
  c.push(['✏️ I\'ll try now (tap Ask Qubi to see these hints again)',()=>{qhClose();const f=document.querySelector('#gStage input:not([disabled]), #gStage button:not([disabled])');if(f)f.focus()}]);
  qhSay(`${steps}${more?'':'<p class="qhnote">That\'s all my hints for this one. I can\'t tell you the answer, but you\'re close. Have a go!</p>'}`,c);
  if($('qhBtn'))$('qhBtn').classList.add('qhused')}
function qhWhich(pick){if(!pick&&qhWhere().home==='start')return qhSay('Which level are you in?',['P4','P5','P6','Sec 1'].map(l=>[l.startsWith('P')?'Primary '+l[1]:'Secondary 1',()=>qhWhich(l)]).concat([qhBack()]));
  const lv=pick||qhLevelNow(),ids=qhGames(lv);
  if(!ids.length)return qhSay(`There are no games for ${esc(lv)} yet. They are on the way!`,[qhBack()]);
  const topics={};ids.forEach(id=>{const k=STRANDS[GAMES[id].strand]?STRANDS[GAMES[id].strand].name:'Other';(topics[k]=topics[k]||[]).push(id)});
  const c=Object.keys(topics).map(k=>[k,()=>qhList(lv,topics[k],pick)]);
  c.push(['🎲 Surprise me!',()=>{qhClose();location.hash=ids[Math.floor(Math.random()*ids.length)]}],qhBack());
  qhSay(`Games for <b>${esc(lv)}</b>. Which area do you want to practise?${pick?'':' <span class="qhnote">(Change the level with the buttons at the top of the page.)</span>'}`,c)}
function qhList(lv,ids,pick){qhSay(`Pick a topic you're learning in class, or one you found hard:`,ids.map(id=>[`${esc(GAMES[id].title)} <small>${esc(GAMES[id].topic||'')}</small>`,()=>{qhClose();location.hash=id}]).concat([['← Other areas',()=>qhWhich(pick)]]))}
function qhLv(){const w=qhWhere();if(w.home==='start')return qhSay(QLEVELS.pri.replace('<b>Easy</b>','<b>Primary:</b> <b>Easy</b>')+'<br><br><b>Secondary:</b> '+QLEVELS.sec,[qhBack()]);const s=w.G?!!w.G.sec:w.home==='sec';qhSay(QLEVELS[s?'sec':'pri'],[qhBack()])}
function qhSave(){const u=window.ARCB&&window.ARCB.user;
  qhSay(u?'You\'re signed in, so your scores are saved and you can be on the leaderboard. Your teacher can see how you did in each game, to help you improve.':'Right now you\'re playing as a <b>guest</b>, so scores aren\'t saved. Tap <b>Sign in with Google</b> at the top of the home page to make a profile: your scores are saved and you can join the leaderboard.',[qhBack()])}
function qhSound(){qhSay('Tap <b>🔊 Sound</b> at the top right. Slide <b>Music</b> and <b>Sound effects</b> separately, all the way left to turn them off.',[qhBack()])}
function qhClose(){qhOpen=false;const p=$('qhPanel');if(p)p.hidden=true;const b=$('qhBtn');if(b)b.setAttribute('aria-expanded','false')}
function qhToggle(){if(qhOpen)return qhClose();qhOpen=true;$('qhPanel').hidden=false;$('qhBtn').setAttribute('aria-expanded','true');
  const w=qhWhere();if(w.G&&qhInRound()&&ctx.mode==='solo'){if(qhHint&&qhPick===ctx.r+':'+ctx.try+':'+ctx.id)qhNextHint(true);else qhStuckMenu()}else qhMenu()}
function qhStuckMenu(){const w=qhWhere();qhSay(`Stuck on this question in <b>${esc(w.G.title)}</b>? I can give you a hint, one small step at a time.`,[['💡 Give me a hint',qhStuck],['🎮 How do I play?',qhHow],qhBack()])}
/* ---------- Send feedback (inside Ask Qubi). Text plus up to 2 pictures or small files, saved for the admin to read on the tracker. ---------- */
const FBKINDS=[['bug','🐞 Something isn\'t working'],['unclear','❓ A question is confusing'],['idea','💡 I have an idea'],['other','💬 Something else']];
let fbFiles=[],fbKind='bug';
function fbShrink(file){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=()=>no(new Error('read'));r.onload=()=>{
  if(!/^image\//.test(file.type)){if(file.size>450000)return no(new Error('big'));return ok({name:file.name,type:file.type||'application/octet-stream',data:r.result})}
  const im=new Image();im.onerror=()=>no(new Error('image'));im.onload=()=>{const tryAt=(px,q)=>{const k=Math.min(1,px/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
    const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);return c.toDataURL('image/jpeg',q)};
    let d=tryAt(1200,.72);if(d.length>600000)d=tryAt(900,.6);if(d.length>600000)d=tryAt(700,.5);
    ok({name:(file.name||'picture').replace(/\.[^.]+$/,'')+'.jpg',type:'image/jpeg',data:d})};im.src=r.result};r.readAsDataURL(file)})}
function fbRecent(){try{const t=JSON.parse(localStorage.getItem('arcFb')||'[]').filter(x=>Date.now()-x<36e5);return t}catch(e){return[]}}
/* ---------- Moderation: block vulgar words and obvious spam before feedback is sent. ----------
   Reuses the nickname word list (BADWORDS / OKWORDS in 2-kit.js) so there is only one list to maintain.
   Look-alike characters are turned into letters ("sh1t", "f.u.c.k"), and runs of single letters are joined
   ("s h i t") so spacing a word out does not get past it. Whole-message squashing is avoided so innocent
   pairs like "is explained" are never flagged. */
let fbModStrikes=0;
function fbModLeet(s){return String(s||'').toLowerCase().replace(/[0-9@$!|*+]/g,c=>({'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','8':'b','9':'g','@':'a','$':'s','!':'i','|':'i','+':'t'}[c]||''));}
/* Innocent words that merely CONTAIN a bad fragment (BADWORDS matches substrings, so "grape"/"trapezium" hold
   "rape", "scrape" holds "crap", "homogeneous" holds "homo"). Stripped before testing. Bare "homo" is NOT listed,
   so it is still caught; concatenations like "grapefuck" still leave "fuck" behind and are caught. */
const fbModOK=NICEWORDS; /* the allow-list now lives in 2-kit.js, so nicknames use it too */
function fbModHit(w){if(!w)return false;const strip=x=>x.replace(OKWORDS,'').replace(fbModOK,'').replace(MILDWORDS,'');const c=w.replace(/(.)\1+/g,'$1');return BADWORDS.test(strip(c))||BADWORDS.test(strip(w));}
function fbModVulgar(text){const m=fbModLeet(text),toks=m.split(/[^a-z]+/).filter(Boolean);for(const t of toks)if(fbModHit(t))return true;let run=[];for(const t of toks){if(t.length===1)run.push(t);else{if(run.length>=3&&fbModHit(run.join('')))return true;run=[]}}if(run.length>=3&&fbModHit(run.join('')))return true;return false}
function fbModSpam(text){const t=String(text||'').trim(),letters=(t.match(/[a-z]/gi)||[]).length;
  if(t.length<2||letters<2)return 'Please write a little more so we understand your feedback.';
  if(/(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|xyz|io|co|ru|info|biz|shop|link|me)\b|t\.me\/|wa\.me\/|whats?app|telegram|discord\.gg|casino|crypto|bitcoin|promo ?code|click here|buy now|free money|earn \$|cheap|\bviagra\b|follow me|dm me|@[a-z0-9_]{3,})/i.test(t))return 'Links, adverts and contact details are not allowed here. Please tell us about the games instead.';
  if(/(.)\1{7,}/.test(t))return 'That looks like random typing. Please write a real sentence.';
  if(t.length>=6&&letters/t.length<0.3)return 'Please write your feedback in words.';
  const words=t.toLowerCase().match(/[a-z]{2,}/g)||[];if(words.length>=5){const u=new Set(words);if(u.size<=Math.max(1,Math.floor(words.length*0.3)))return 'That looks repetitive. Please write what you really think.'}
  const sq=t.toLowerCase().replace(/[^a-z]/g,'');if(sq.length>=8){const vo=(sq.match(/[aeiou]/g)||[]).length,mash=/(asdf|sdfg|dfgh|fghj|ghjk|hjkl|qwer|wert|erty|rtyu|tyui|yuiop|zxcv|xcvb|cvbn|vbnm|qazwsx|jkjk|lkjl|hjhj)/.test(sq),div=new Set(sq).size/sq.length;if(mash||vo/sq.length<0.12||(sq.length>=12&&div<0.18))return 'That looks like random typing. Please write a real sentence.'}
  return ''}
function fbModCheck(text){if(fbModVulgar(text))return{status:'vulgar'};const r=fbModSpam(text);return r?{status:'spam',reason:r}:{status:'clean'}}
function qhFeedback(){fbFiles=[];const b=$('qhBody');if(!b)return;
  b.innerHTML=`<div class="qhmsg">Thanks for helping make Maths Arcade better! What is it about?</div>
   <div class="fbkinds" role="radiogroup">${FBKINDS.map(([k,n])=>`<button type="button" class="qhchip fbk" role="radio" aria-checked="${k===fbKind}" data-k="${k}">${n}</button>`).join('')}</div>
   <label class="fblbl" for="fbMsg">Tell us more <span class="qhnote">(which game and question helps a lot)</span></label>
   <textarea id="fbMsg" maxlength="1000" rows="4" placeholder="e.g. In Below Zero round 3, the answer I typed was right but it said wrong."></textarea>
   <div class="fbrow"><label class="qhchip fbadd" tabindex="0">📎 Add a picture or file<input id="fbFile" type="file" accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx" multiple hidden></label><span class="qhnote" id="fbCount">Up to 2. Screenshots are great!</span></div>
   <div id="fbList" class="fblist"></div>
   <p class="qhnote">Please don't include your full name, address, phone number or photos of people. ${window.ARCB&&window.ARCB.user?'Your nickname and class are sent with this.':'You are a guest, so no name is sent.'} We also send which page you were on, to help find the problem.</p>
   <div id="fbMsgOut" class="qhnote" role="status"></div>
   <div class="qhchips"><button type="button" class="qhchip fbsend" id="fbSend">📨 Send feedback</button><button type="button" class="qhchip" id="fbBack">← Back</button></div>`;
  b.querySelectorAll('.fbk').forEach(x=>x.onclick=()=>{fbKind=x.dataset.k;b.querySelectorAll('.fbk').forEach(y=>y.setAttribute('aria-checked',y===x))});
  const inp=$('fbFile'),add=b.querySelector('.fbadd');add.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inp.click()}};
  inp.onchange=async()=>{const out=$('fbMsgOut');out.textContent='';for(const f of [...inp.files]){if(fbFiles.length>=2){out.textContent='You can add up to 2 files.';break}
      try{fbFiles.push(await fbShrink(f))}catch(e){out.textContent=e.message==='big'?`"${f.name}" is too big. Files must be under 450 KB (pictures are made smaller for you).`:`Couldn't read "${f.name}". Try a PNG or JPG screenshot.`}}
    inp.value='';fbDraw()};
  $('fbBack').onclick=()=>{sfx.tap&&sfx.tap();qhMenu()};$('fbSend').onclick=fbSend;fbDraw();b.scrollTop=0}
function fbDraw(){const l=$('fbList');if(!l)return;l.innerHTML=fbFiles.map((f,i)=>`<div class="fbitem">${/^image\//.test(f.type)?`<img src="${f.data}" alt="">`:'<span class="fbdoc">📄</span>'}<span>${esc(f.name)}<br><small>${Math.round(f.data.length*.75/1024)} KB</small></span><button type="button" aria-label="Remove ${esc(f.name)}" data-i="${i}">✕</button></div>`).join('');
  l.querySelectorAll('button').forEach(x=>x.onclick=()=>{fbFiles.splice(+x.dataset.i,1);fbDraw()});const c=$('fbCount');if(c)c.textContent=fbFiles.length?`${fbFiles.length} of 2 added`:'Up to 2. Screenshots are great!'}
async function fbSend(){const out=$('fbMsgOut'),msg=($('fbMsg').value||'').trim(),btn=$('fbSend');
  if(!msg&&!fbFiles.length){out.textContent='Write a message or add a picture first.';$('fbMsg').focus();return}
  if(msg){const mod=fbModCheck(msg);
    if(mod.status==='vulgar'){fbModStrikes++;sfx.no&&sfx.no();out.textContent=fbModStrikes>=2?'Please stop using that kind of language. Remove it and write a kind, proper message.':'Please keep it kind — that kind of language is not allowed here. Please remove it and write a proper message.';$('fbMsg').focus();return}
    if(mod.status==='spam'&&!fbFiles.length){sfx.no&&sfx.no();out.textContent=mod.reason;$('fbMsg').focus();return}}
  if(fbRecent().length>=5){out.textContent='Thanks! You have sent a lot of feedback this hour. Please try again later.';return}
  if(!window.ARCB||!window.ARCB.feedback){out.textContent='Feedback can\'t be sent right now (no connection to the server). Please try again later.';return}
  const w=qhWhere(),g=w.G,inG=g&&typeof ctx!=='undefined'&&ctx&&ctx.id===w.game;
  btn.disabled=true;out.textContent='Sending…';
  try{await window.ARCB.feedback({kind:fbKind,msg,page:location.hash||'#home',game:g?g.title:'',round:inG?(ctx.inBonus?'bonus round':`round ${ctx.r+1}${ctx.try===2?' (second try)':''}`):'',
      level:inG?String(lvn(ctx.level)||''):(g?g.level:''),mode:inG?String(ctx.mode||''):'',screen:innerWidth+'×'+innerHeight,files:fbFiles});
    try{localStorage.setItem('arcFb',JSON.stringify(fbRecent().concat(Date.now())))}catch(e){}
    fbFiles=[];qhSay('📨 <b>Sent! Thank you.</b> Your teacher will read it. 😊',[['💬 Send more feedback',qhFeedback],qhBack()])}
  catch(e){btn.disabled=false;out.textContent='Sorry, that didn\'t send. '+(e&&/size|large|exceeds/i.test(e.message||'')?'The files are too big together. Remove one and try again.':'Please check your internet and try again.')}}
(function(){const st=document.createElement('style');st.textContent=`
#qhBtn{position:fixed;left:12px;bottom:12px;z-index:41;display:flex;align-items:center;gap:6px;padding:4px 14px 4px 4px;border:2.5px solid var(--ink);border-radius:999px;background:var(--surface);color:var(--ink);font:800 14px var(--body);cursor:pointer;box-shadow:3px 3px 0 var(--ink)}
#qhBtn .qhhead{width:40px;height:40px;border-radius:50%;background:#fff4e8;border:2.5px solid var(--ink);overflow:hidden;display:grid;place-items:center}
#qhBtn .qhhead svg{width:36px;height:auto}#qhBtn .qhface .q-stars,#qhBtn .qhface .q-qm,#qhBtn .qhface .q-shadow{display:none}
#qhBtn:hover{transform:translateY(-2px)}#qhBtn.qhused{background:#fff3cc}
#qhPanel{position:fixed;left:12px;bottom:70px;z-index:41;width:min(360px,calc(100vw - 24px));max-height:min(70vh,560px);display:flex;flex-direction:column;background:var(--surface);color:var(--ink);border:2.5px solid var(--ink);border-radius:18px;box-shadow:5px 5px 0 var(--ink);overflow:hidden;animation:stdrop .35s ease both}
#qhPanel[hidden]{display:none!important}
#qhPanel .qhtop{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--violet);color:#fff}
#qhPanel .qhtop svg{width:40px;height:auto;flex:none}#qhPanel .qhtop b{font:700 1.15rem var(--display)}#qhPanel .qhtop small{display:block;font-weight:600;opacity:.85}
#qhPanel .qhx{margin-left:auto;background:none;border:0;color:#fff;font:700 22px var(--body);cursor:pointer;padding:0 4px}
#qhBody{padding:12px;overflow:auto;display:grid;gap:10px}
.qhmsg{font:600 15px/1.45 var(--body)}.qhmsg b{font-weight:800}
.qhchips{display:grid;gap:6px}
.qhchip{text-align:left;font:700 14px var(--body);color:var(--ink);background:var(--bg);border:2px solid var(--ink);border-radius:12px;padding:8px 12px;cursor:pointer}
.qhchip small{display:block;font-weight:600;opacity:.7}.qhchip:hover{background:var(--soft,#e6f5f2)}
.qhhint{border-left:4px solid var(--sun,#ffb81f);background:var(--bg);padding:8px 10px;border-radius:8px;margin-bottom:6px}
.qhn{display:block;font:800 11px var(--body);letter-spacing:.06em;text-transform:uppercase;opacity:.7}
.qhnote{font-size:13px;opacity:.8;font-weight:600}
.fbkinds{display:grid;grid-template-columns:1fr 1fr;gap:6px}.fbk{font-size:13px;padding:6px 8px}.fbk[aria-checked="true"]{background:var(--ink);color:var(--bg)}
.fblbl{font:800 14px var(--body)}#fbMsg{width:100%;box-sizing:border-box;font:600 14px var(--body);color:var(--ink);background:var(--bg);border:2px solid var(--ink);border-radius:12px;padding:8px 10px;resize:vertical;min-height:88px}
.fbrow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.fbadd{display:inline-block}.fbsend{background:var(--teal,#0b968b);color:#fff}.fbsend:disabled{opacity:.6}
.fblist{display:grid;gap:6px}.fbitem{display:flex;align-items:center;gap:8px;border:2px solid var(--line,#cfe3df);border-radius:10px;padding:4px 6px;font:600 13px var(--body)}
.fbitem img{width:44px;height:44px;object-fit:cover;border-radius:6px}.fbdoc{font-size:28px}.fbitem button{margin-left:auto;background:none;border:0;font:800 16px var(--body);color:var(--ink);cursor:pointer}
@media (max-width:420px){.fbkinds{grid-template-columns:1fr}}
@media (max-width:600px){#qhBtn .qhlbl{display:none}#qhBtn{padding:4px}body{padding-bottom:64px}#qhPanel{bottom:64px}}
@media print{#qhBtn,#qhPanel{display:none!important}}`;document.head.appendChild(st);
  const head=QUBI.replace('class="qubi"','class="qubi idle"'),face=QUBI.replace('viewBox="0 -18 120 168"','viewBox="14 0 92 118"').replace('class="qubi"','class="qubi qhface"');
  const b=document.createElement('button');b.id='qhBtn';b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','qhPanel');b.title='Ask Qubi for help';
  b.innerHTML=`<span class="qhhead">${face}</span><span class="qhlbl">Ask Qubi</span>`;b.onclick=()=>{sfx.tap&&sfx.tap();qhToggle()};
  const p=document.createElement('div');p.id='qhPanel';p.hidden=true;p.setAttribute('role','dialog');p.setAttribute('aria-label','Ask Qubi');
  p.innerHTML=`<div class="qhtop">${head}<div><b>Ask Qubi</b><small>Your maths helper</small></div><button class="qhx" aria-label="Close">×</button></div><div id="qhBody"></div>`;
  p.querySelector('.qhx').onclick=qhClose;document.body.appendChild(p);document.body.appendChild(b);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&qhOpen)qhClose()});
  addEventListener('hashchange',()=>{qhPick=null;if(qhOpen)qhMenu();const x=$('qhBtn');if(x)x.classList.remove('qhused')})})();
/* About: a button in the top bar opens a panel describing the site (its text is written into the page for search engines and web filters) */
(function(){const p=$('aboutPanel'),b=$('aboutBtn');if(!p||!b)return;document.body.appendChild(p); /* above everything, including Ask Qubi */const set=on=>{p.hidden=!on;b.setAttribute('aria-expanded',on);if(on)$('aboutX').focus();else b.focus()};
  b.onclick=()=>{sfx.tap&&sfx.tap();set(p.hidden)};$('aboutX').onclick=()=>set(false);p.addEventListener('click',e=>{if(e.target===p)set(false)});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!p.hidden)set(false)})})();
/* after the Primary or Secondary page is drawn, offer the guest / sign-in choice once */
(function(){const h0=hub,s0=secView;hub=function(){const r=h0.apply(this,arguments);arcAsk();return r};secView=function(){const r=s0.apply(this,arguments);arcAsk();return r}})();
