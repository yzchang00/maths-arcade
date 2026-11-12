/* ================= QR CODE (for sharing online-room links) =================
   Small QR encoder: byte mode, error correction level M, versions 1 to 10 (links up to about 210 characters).
   qrSvg(text) returns an SVG string. */
const QR=(()=>{
  const ECC=[-1,10,16,26,18,24,16,18,22,22,26],BLK=[-1,1,1,1,2,2,4,4,4,5,5];
  const raw=v=>{let r=(16*v+128)*v+64;if(v>=2){const n=Math.floor(v/7)+2;r-=(25*n-10)*n-55;if(v>=7)r-=36}return r};
  const dataCw=v=>Math.floor(raw(v)/8)-ECC[v]*BLK[v];
  const mul=(x,y)=>{let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11D);z^=((y>>>i)&1)*x}return z};
  const divisor=d=>{const r=new Array(d).fill(0);r[d-1]=1;let root=1;for(let i=0;i<d;i++){for(let j=0;j<d;j++){r[j]=mul(r[j],root);if(j+1<d)r[j]^=r[j+1]}root=mul(root,2)}return r};
  const remainder=(data,div)=>{const r=new Array(div.length).fill(0);for(const b of data){const f=b^r.shift();r.push(0);div.forEach((c,i)=>r[i]^=mul(c,f))}return r};
  const bit=(x,i)=>((x>>>i)&1)!==0;
  function encode(text){
    const bytes=[...new TextEncoder().encode(text)];let v=1;
    for(;v<=10;v++){const cc=v<10?8:16;if(4+cc+bytes.length*8<=dataCw(v)*8)break}
    if(v>10)throw new Error('Text too long for QR');
    const bb=[],put=(val,len)=>{for(let i=len-1;i>=0;i--)bb.push((val>>>i)&1)};
    put(4,4);put(bytes.length,v<10?8:16);bytes.forEach(b=>put(b,8));
    const cap=dataCw(v)*8;put(0,Math.min(4,cap-bb.length));put(0,(8-bb.length%8)%8);
    for(let p=0xEC;bb.length<cap;p^=0xEC^0x11)put(p,8);
    const data=[];for(let i=0;i<bb.length;i+=8){let b=0;for(let j=0;j<8;j++)b=(b<<1)|bb[i+j];data.push(b)}
    // split into blocks, add error correction, interleave
    const nb=BLK[v],el=ECC[v],rc=Math.floor(raw(v)/8),nShort=nb-rc%nb,shortLen=Math.floor(rc/nb),div=divisor(el),blocks=[];
    for(let i=0,k=0;i<nb;i++){const d=data.slice(k,k+shortLen-el+(i<nShort?0:1));k+=d.length;const e=remainder(d,div);if(i<nShort)d.push(0);blocks.push(d.concat(e))}
    const cw=[];for(let i=0;i<blocks[0].length;i++)blocks.forEach((b,j)=>{if(i!==shortLen-el||j>=nShort)cw.push(b[i])});
    // modules
    const n=v*4+17,M=[...Array(n)].map(()=>new Array(n).fill(false)),F=[...Array(n)].map(()=>new Array(n).fill(false));
    const set=(x,y,d)=>{M[y][x]=d;F[y][x]=true};
    for(let i=0;i<n;i++){set(6,i,i%2===0);set(i,6,i%2===0)}
    [[3,3],[n-4,3],[3,n-4]].forEach(([cx,cy])=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const x=cx+dx,y=cy+dy,d=Math.max(Math.abs(dx),Math.abs(dy));if(x>=0&&x<n&&y>=0&&y<n)set(x,y,d!==2&&d!==4)}});
    if(v>1){const na=Math.floor(v/7)+2,step=Math.ceil((v*4+4)/(na*2-2))*2,pos=[6];for(let p=n-7;pos.length<na;p-=step)pos.splice(1,0,p);
      pos.forEach((a,i)=>pos.forEach((b,j)=>{if((i===0&&j===0)||(i===0&&j===na-1)||(i===na-1&&j===0))return;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(a+dx,b+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1)}))}
    const fmt=mask=>{const d=(0<<3)|mask;let r=d;for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);const b=((d<<10)|r)^0x5412;
      for(let i=0;i<=5;i++)set(8,i,bit(b,i));set(8,7,bit(b,6));set(8,8,bit(b,7));set(7,8,bit(b,8));for(let i=9;i<15;i++)set(14-i,8,bit(b,i));
      for(let i=0;i<8;i++)set(n-1-i,8,bit(b,i));for(let i=8;i<15;i++)set(8,n-15+i,bit(b,i));set(8,n-8,true)};
    fmt(0);
    if(v>=7){let r=v;for(let i=0;i<12;i++)r=(r<<1)^((r>>>11)*0x1F25);const b=(v<<12)|r;for(let i=0;i<18;i++){const a=n-11+i%3,c=Math.floor(i/3);set(a,c,bit(b,i));set(c,a,bit(b,i))}}
    let k=0;for(let right=n-1;right>=1;right-=2){if(right===6)right=5;for(let vert=0;vert<n;vert++)for(let j=0;j<2;j++){const x=right-j,up=((right+1)&2)===0,y=up?n-1-vert:vert;
      if(!F[y][x]&&k<cw.length*8){M[y][x]=bit(cw[k>>>3],7-(k&7));k++}}}
    const MASKS=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
    const apply=m=>{for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!F[y][x]&&MASKS[m](x,y))M[y][x]=!M[y][x]};
    const penalty=()=>{let p=0,dark=0;
      for(let y=0;y<n;y++)for(const hz of [true,false]){let run=1;for(let x=1;x<=n;x++){const a=hz?M[y][x]:(x<n?M[x][y]:undefined),b=hz?M[y][x-1]:M[x-1][y];if(x<n&&a===b)run++;else{if(run>=5)p+=run-2;run=1}}}
      for(let y=0;y<n-1;y++)for(let x=0;x<n-1;x++){const c=M[y][x];if(c===M[y][x+1]&&c===M[y+1][x]&&c===M[y+1][x+1])p+=3}
      for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(M[y][x])dark++;p+=Math.floor(Math.abs(dark*20-n*n*10)/(n*n))*10;return p};
    let best=0,bp=Infinity;for(let m=0;m<8;m++){apply(m);fmt(m);const p=penalty();if(p<bp){bp=p;best=m}apply(m)}
    apply(best);fmt(best);return M}
  return {encode};
})();
function qrSvg(text){const M=QR.encode(text),n=M.length,q=4;let d='';
  M.forEach((row,y)=>row.forEach((on,x)=>{if(on)d+=`M${x+q} ${y+q}h1v1h-1z`}));
  return `<svg class="qrsvg" viewBox="0 0 ${n+2*q} ${n+2*q}" role="img" aria-label="QR code to join this room" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`}
