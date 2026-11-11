/* ---------- tap-to-zoom for graphs and figures ---------- */
const ZOOM={sc:1,x:0,y:0};
function zoomOpen(svg){const ov=document.createElement('div');ov.className='zoomov';ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Zoomed picture');
  const cl=svg.cloneNode(true);cl.removeAttribute('id');cl.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));cl.removeAttribute('style');cl.classList.add('zoomsvg');
  ov.innerHTML=`<div class="zoombar"><b>🔍 Zoomed picture</b><span class="zoomtip">Pinch, scroll or use + and − to zoom. Drag to move.</span><span class="zoomrot">Drag to move around. Tip: turn your phone sideways for a bigger view.</span><span style="flex:1"></span><button class="btn" data-z="-" aria-label="Zoom out">−</button><button class="btn" data-z="+" aria-label="Zoom in">+</button><button class="btn" data-z="0">Reset</button><button class="btn primary" data-z="x" aria-label="Close">✕ Close</button></div><div class="zoomstage"><div class="zoompan"></div></div>`;
  ov.querySelector('.zoompan').appendChild(cl);document.body.appendChild(ov);document.body.classList.add('zoomed');
  const pan=ov.querySelector('.zoompan'),st=ov.querySelector('.zoomstage');ZOOM.sc=innerWidth<600&&innerWidth<innerHeight?1.7:1;ZOOM.x=0;ZOOM.y=0;
  const apply=()=>{pan.style.transform=`translate(${ZOOM.x}px,${ZOOM.y}px) scale(${ZOOM.sc})`};apply();
  const zoomBy=f=>{ZOOM.sc=Math.max(1,Math.min(5,ZOOM.sc*f));if(ZOOM.sc===1){ZOOM.x=0;ZOOM.y=0}apply()};
  const close=()=>{ov.remove();document.body.classList.remove('zoomed');removeEventListener('keydown',kd)};
  const kd=e=>{if(e.key==='Escape')close();if(e.key==='+'||e.key==='=')zoomBy(1.25);if(e.key==='-')zoomBy(.8)};addEventListener('keydown',kd);
  ov.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{const z=b.dataset.z;if(z==='x')return close();if(z==='0'){ZOOM.sc=1;ZOOM.x=0;ZOOM.y=0;apply()}else zoomBy(z==='+'?1.4:1/1.4)});
  st.addEventListener('wheel',e=>{e.preventDefault();zoomBy(e.deltaY<0?1.15:1/1.15)},{passive:false});
  const pts=new Map();let last=null,pinch=0,tapT=0;
  st.addEventListener('pointerdown',e=>{st.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const [a,b]=[...pts.values()];pinch=Math.hypot(a[0]-b[0],a[1]-b[1])}last=[e.clientX,e.clientY];
    const now=Date.now();if(now-tapT<300&&pts.size===1){zoomBy(ZOOM.sc>1.5?0:2)}tapT=now});
  st.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);
    if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)zoomBy(d/pinch);pinch=d;return}
    if(last&&ZOOM.sc>1){ZOOM.x+=e.clientX-last[0];ZOOM.y+=e.clientY-last[1];apply()}last=[e.clientX,e.clientY]});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=0;if(!pts.size)last=null};st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  ov.querySelector('[data-z="x"]').focus();sfx.pop&&sfx.pop()}
function zoomScan(){const st=$('gStage');if(!st)return;
  st.querySelectorAll('svg').forEach(svg=>{if(svg.dataset.zb||svg.closest('.zoomov,.vmmap,.kitchen,.cust,.mcard,.rqcalc,.qubi,.choices,button,.facewrap,.pzrow,.tug,.fwall,.tmap-nozoom')||svg.classList.contains('tmap'))return;if(svg.classList.contains('qubi')||svg.classList.contains('kid')||svg.classList.contains('vmmap'))return;
    const r=svg.getBoundingClientRect();if(r.width<200||r.height<110)return;svg.dataset.zb='1';
    const holder=svg.parentElement;if(getComputedStyle(holder).position==='static')holder.style.position='relative';
    const b=document.createElement('button');b.type='button';b.className='zoombtn';b.innerHTML='🔍<span> Zoom</span>';b.setAttribute('aria-label','Zoom in on this picture');b.onclick=e=>{e.stopPropagation();zoomOpen(svg)};
    holder.appendChild(b);const place=()=>{if(!svg.isConnected){b.remove();return}const pr=holder.getBoundingClientRect(),sr=svg.getBoundingClientRect();b.style.left=(sr.right-pr.left-b.offsetWidth-6+holder.scrollLeft)+'px';b.style.top=Math.max(0,sr.top-pr.top-16)+'px'};place();
    (ZOOM.places=ZOOM.places||[]).push(place);
    if(svg.closest('.rqfig'))svg.addEventListener('click',()=>zoomOpen(svg))})}
addEventListener('resize',()=>{(ZOOM.places||[]).forEach(f=>f())});
{let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{zoomScan();(ZOOM.places||[]).forEach(f=>f())},120)}).observe(document.getElementById('view'),{childList:true,subtree:true})}
