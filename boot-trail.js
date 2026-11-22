// A distance-based walking trail: alternating feet, oriented along the path.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(any-pointer: fine)');
const toggle = document.querySelector('#boot-trail-toggle');
const canvas = document.createElement('canvas');
canvas.className = 'boot-trail';canvas.setAttribute('aria-hidden','true');
document.body.append(canvas);
const ctx = canvas.getContext('2d');
let enabled = true;
try { enabled = localStorage.getItem('boot-trail') !== 'off'; } catch {}
let prints = [], previous = null, distance = 0, foot = 1, frame = 0;
const lifetime = 3600, stride = 44;
function available(){return enabled && !reduced.matches && fine.matches && ctx;}
function clear(){prints=[];previous=null;distance=0;cancelAnimationFrame(frame);frame=0;ctx?.clearRect(0,0,innerWidth,innerHeight);}
function resize(){const ratio=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*ratio;canvas.height=innerHeight*ratio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx?.setTransform(ratio,0,0,ratio,0,0);clear();}
function updateToggle(){toggle.hidden=!fine.matches;toggle.disabled=reduced.matches;toggle.textContent=reduced.matches?'Boot prints off':'Boot prints '+(enabled?'on':'off');toggle.setAttribute('aria-pressed',String(Boolean(available())));}
function draw(now){
 frame=0;ctx.clearRect(0,0,innerWidth,innerHeight);
 prints=prints.filter(p=>now-p.time<lifetime);
 for(const p of prints){
  const fade=Math.min(1,(lifetime-(now-p.time))/1000);
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale(p.foot,1);ctx.globalAlpha=.23*fade;ctx.fillStyle='#596148';
  // Toe, forefoot lugs, narrow arch, and a separate block heel.
  ctx.beginPath();ctx.ellipse(0,-14,7.5,4,0,Math.PI,0);ctx.lineTo(7.5,-10);ctx.lineTo(-7.5,-10);ctx.closePath();ctx.fill();
  for(const y of [-7,-1,5]){
   ctx.beginPath();ctx.moveTo(-7,y-2);ctx.lineTo(-1,y);ctx.lineTo(-1,y+3);ctx.lineTo(-7,y+1);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(1,y);ctx.lineTo(7,y-2);ctx.lineTo(7,y+1);ctx.lineTo(1,y+3);ctx.closePath();ctx.fill();
  }
  ctx.fillRect(-4,9,8,3);ctx.fillRect(-5,16,10,4);ctx.fillRect(-5,22,10,3);
  ctx.restore();
 }
 if(prints.length)frame=requestAnimationFrame(draw);
}
document.addEventListener('pointermove',event=>{
 if(event.pointerType!=='mouse'||!available())return;
 const current={x:event.clientX,y:event.clientY};
 if(!previous){previous=current;return;}
 const dx=current.x-previous.x,dy=current.y-previous.y,length=Math.hypot(dx,dy);
 if(length>500){previous=current;distance=0;return;}
 if(length<.5)return;
 const ux=dx/length,uy=dy/length;
 for(let along=stride-distance;along<=length;along+=stride){
  prints.push({x:previous.x+ux*along-ux*22-uy*foot*9,y:previous.y+uy*along-uy*22+ux*foot*9,angle:Math.atan2(dy,dx)+Math.PI/2,foot,time:performance.now()});foot*=-1;
 }
 distance=(distance+length)%stride;previous=current;
 if(prints.length>65)prints.splice(0,prints.length-65);
 if(prints.length&&!frame)frame=requestAnimationFrame(draw);
},{passive:true});
toggle.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem('boot-trail',enabled?'on':'off');}catch{}clear();updateToggle();});
window.addEventListener('resize',resize,{passive:true});
window.addEventListener('scroll',clear,{passive:true});
window.addEventListener('blur',clear);
window.addEventListener('hashchange',clear);
document.addEventListener('pointerout',event=>{if(!event.relatedTarget)previous=null;});
document.addEventListener('visibilitychange',clear);
reduced.addEventListener('change',()=>{clear();updateToggle();});
fine.addEventListener('change',()=>{clear();updateToggle();});
resize();updateToggle();
