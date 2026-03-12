/* ══════════════════════════════════════════
   LOADER — counting pct
══════════════════════════════════════════ */
const pctEl=document.getElementById('ldPct');
let p=0;
const ti=setInterval(()=>{
  p=Math.min(p+Math.ceil(Math.random()*8+2),100);
  pctEl.textContent=p+'%';
  if(p>=100){clearInterval(ti);setTimeout(()=>document.getElementById('loader').classList.add('out'),300);}
},60);

/* ══════════════════════════════════════════
   CURSOR
══════════════════════════════════════════ */
const cur=document.getElementById('cur'),ring=document.getElementById('curRing');
let rx=0,ry=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;cur.style.left=cx+'px';cur.style.top=cy+'px';});
(function animRing(){rx+=(cx-rx)*.12;ry+=(cy-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing);})();

/* ══════════════════════════════════════════
   CANVAS PARTICLES
══════════════════════════════════════════ */
const canvas=document.getElementById('bgCanvas');
const ctx=canvas.getContext('2d');
let W,H,pts=[];
function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
resize();window.addEventListener('resize',()=>{resize();init();});
function init(){
  pts=[];
  const n=Math.floor(W*H/18000);
  for(let i=0;i<n;i++){
    pts.push({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,
      r:Math.random()*1.2+.3,
      a:Math.random()*.6+.1
    });
  }
}
init();
function drawCanvas(){
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<pts.length;i++){
    const p=pts[i];
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=W;if(p.x>W)p.x=0;
    if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(201,168,76,${p.a})`;ctx.fill();
    for(let j=i+1;j<pts.length;j++){
      const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<110){
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
        ctx.strokeStyle=`rgba(201,168,76,${.06*(1-dist/110)})`;
        ctx.lineWidth=.5;ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

/* ══════════════════════════════════════════
   NAV SCROLL
══════════════════════════════════════════ */
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  navEl.classList.toggle('scrolled',scrollY>60);
});

/* ══════════════════════════════════════════
   LIVE CLOCK
══════════════════════════════════════════ */
function tick(){
  const d=new Date();
  document.getElementById('clock').textContent=
    d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})+' IST';
}
tick();setInterval(tick,1000);

/* ══════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════ */
function toggleMob(){document.getElementById('mobMenu').classList.toggle('open');}
function closeMob(){document.getElementById('mobMenu').classList.remove('open');}

/* ══════════════════════════════════════════
   SCROLL REVEAL + SKILL BARS + COUNTERS
══════════════════════════════════════════ */
function animCount(el,target){
  let v=0;const step=Math.ceil(target/40);
  const t=setInterval(()=>{
    v=Math.min(v+step,target);
    el.textContent=v+(el.dataset.count==='100'?'%':'+');
    if(v>=target)clearInterval(t);
  },35);
}
const srObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('vis');
    e.target.querySelectorAll('.sk-fill').forEach(b=>b.style.width=b.dataset.w+'%');
    e.target.querySelectorAll('[data-count]').forEach(c=>animCount(c,+c.dataset.count));
    srObs.unobserve(e.target);
  });
},{threshold:.12});
document.querySelectorAll('[data-sr],.stats-strip .stat-cell').forEach(el=>srObs.observe(el));

/* ══════════════════════════════════════════
   MAGNETIC HOVER on project links
══════════════════════════════════════════ */
document.querySelectorAll('.proj-link').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    btn.style.transform=`translate(${x*.3}px,${y*.3}px) rotate(-45deg) scale(1.1)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='';});
});

/* ══════════════════════════════════════════
   FORM SUBMIT (visual only)
══════════════════════════════════════════ */
document.querySelector('.cf-submit').addEventListener('click',()=>{
  const btn=document.querySelector('.cf-submit');
  const inputs=document.querySelectorAll('.cf-input,.cf-textarea');
  let allFilled=true;
  inputs.forEach(inp=>{if(!inp.value.trim())allFilled=false;});
  if(!allFilled){
    btn.textContent='Please fill all fields ✕';
    btn.style.background='#c0392b';
    setTimeout(()=>{btn.textContent='Send Message →';btn.style.background='';},2000);
    return;
  }
  btn.textContent='Message Sent ✓';
  btn.style.background='#27ae60';
  inputs.forEach(inp=>inp.value='');
  setTimeout(()=>{btn.textContent='Send Message →';btn.style.background='';},3000);
});
