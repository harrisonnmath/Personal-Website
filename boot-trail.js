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
const lifetime = 1100, stride = 44;
// Chunky hiking-boot tread: curved toe rim, separate lugs, and curved heel.
const sole=document.createElement('canvas');sole.width=96;sole.height=144;
const ink=sole.getContext('2d');ink.scale(2,2);ink.translate(24,32);ink.fillStyle='#424a38';
function tread(points){ink.beginPath();points.forEach(([x,y],i)=>i?ink.lineTo(x,y):ink.moveTo(x,y));ink.closePath();ink.fill();}
ink.beginPath();ink.moveTo(-17,-12);ink.bezierCurveTo(-18,-34,13,-38,17,-15);ink.lineTo(10,-11);ink.bezierCurveTo(8,-26,-9,-27,-11,-9);ink.closePath();ink.fill();
for(let row=0;row<4;row++){
 const y=-7+row*7,outer=17-row*1.3,inner=8-row*.8;
 tread([[-outer,y],[-inner,y-3],[-inner+1,y+2],[-outer+1,y+5]]);
 tread([[inner,y-3],[outer,y-1],[outer-1,y+4],[inner-1,y+2]]);
}
for(let row=0;row<3;row++){
 const y=-9+row*8;
 tread([[-3,y],[-6,y+4],[-5,y+7],[-1,y+3]]);
 tread([[1,y+3],[5,y+7],[6,y+4],[3,y]]);
}
// A distinct heel with widely spaced blocks and a rounded rear rim.
tread([[-11,24],[-5,22],[-4,27],[-10,29]]);tread([[4,22],[11,24],[10,29],[4,27]]);
ink.beginPath();ink.moveTo(-11,31);ink.quadraticCurveTo(0,42,12,31);ink.lineTo(9,27);ink.quadraticCurveTo(0,34,-8,27);ink.closePath();ink.fill();
// Stable fine gaps give the tread an inked, slightly worn print texture.
ink.globalCompositeOperation='destination-out';let grain=941;
const random=()=>{grain=(grain*1664525+1013904223)>>>0;return grain/4294967296;};
for(let i=0;i<260;i++){const x=random()*38-19,y=random()*72-33;ink.beginPath();ink.arc(x,y,.18+random()*.48,0,Math.PI*2);ink.fill();}
function available(){return enabled && !reduced.matches && fine.matches && ctx;}
function clear(){prints=[];previous=null;distance=0;cancelAnimationFrame(frame);frame=0;ctx?.clearRect(0,0,innerWidth,innerHeight);}
function resize(){const ratio=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*ratio;canvas.height=innerHeight*ratio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx?.setTransform(ratio,0,0,ratio,0,0);clear();}
function updateToggle(){toggle.hidden=!fine.matches;toggle.disabled=reduced.matches;toggle.textContent=reduced.matches?'Boot prints off':'Boot prints '+(enabled?'on':'off');toggle.setAttribute('aria-pressed',String(Boolean(available())));}
function draw(now){
 frame=0;ctx.clearRect(0,0,innerWidth,innerHeight);
 prints=prints.filter(p=>now-p.time<lifetime);
 for(const p of prints){
  const fade=Math.min(1,(lifetime-(now-p.time))/750);
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale(p.foot,1);ctx.globalAlpha=.28*fade;
  ctx.drawImage(sole,-18,-24,36,54);
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

