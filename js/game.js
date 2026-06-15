// 游戏引擎 — 支持线段反射板、多边形、多方向光源
window.SR=window.SR||{};
window.SR._reg={};
window.SR.reg=function(k,d){window.SR._reg[k]=d};

function rd(d){return d*Math.PI/180}
function d2(x1,y1,x2,y2){var dx=x2-x1,dy=y2-y1;return Math.sqrt(dx*dx+dy*dy)}
function li(x1,y1,x2,y2,x3,y3,x4,y4){var d=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);if(Math.abs(d)<1e-10)return null;var t=((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/d,u=-((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/d;if(t>=0&&t<=1&&u>=0&&u<=1)return{x:x1+t*(x2-x1),y:y1+t*(y2-y1)};return null}
function sd(sx,sy,ex,ey,px,py){var dx=ex-sx,dy=ey-sy;if(!dx&&!dy)return d2(sx,sy,px,py);var t=((px-sx)*dx+(py-sy)*dy)/(dx*dx+dy*dy);t=Math.max(0,Math.min(1,t));return d2(sx+t*dx,sy+t*dy,px,py)}
function rrh(rx,ry,rw,rh,ox,oy,odx,ody){var mt=1/0,hp=null,nm='',ex=ox+odx*5000,ey=oy+ody*5000,es=[{ax:rx,ay:ry,bx:rx+rw,by:ry,n:'top'},{ax:rx+rw,ay:ry,bx:rx+rw,by:ry+rh,n:'right'},{ax:rx,ay:ry+rh,bx:rx+rw,by:ry+rh,n:'bottom'},{ax:rx,ay:ry,bx:rx,by:ry+rh,n:'left'}];for(var i=0;i<4;i++){var e=es[i],p=li(ox,oy,ex,ey,e.ax,e.ay,e.bx,e.by);if(p){var dd=d2(ox,oy,p.x,p.y);if(dd<mt&&dd>1){mt=dd;hp=p;nm=e.n}}}return{pt:hp,n:nm,d:mt}}
function rsh(ox,oy,odx,ody,x1,y1,x2,y2){var sx=x2-x1,sy=y2-y1,d=odx*sy-ody*sx;if(Math.abs(d)<1e-10)return null;var t=((x1-ox)*sy-(y1-oy)*sx)/d,u=((x1-ox)*ody-(y1-oy)*odx)/d;if(t>1&&u>=-.01&&u<=1.01){u=Math.max(0,Math.min(1,u));return{x:ox+t*odx,y:oy+t*ody,u:u,d:t}}return null}
function rs(sr,ox,oy,ar,hr){var dx=Math.cos(ar),dy=Math.sin(ar),bi=-1,bd=1/0;for(var i=0;i<sr.length;i++){var s=sr[i],d=sd(ox,oy,ox+dx*5000,oy+dy*5000,s.x,s.y);if(d<s.r+hr&&d<bd){if((s.x-ox)*dx+(s.y-oy)*dy>0){bi=i;bd=d}}}return bi}

window.SR.Game=function(cvid){
  var s=this;s.cv=document.getElementById(cvid);s.c=s.cv.getContext('2d');
  s.sr=[];s.rf=[];s.sg=[];s.ry=[];s.srR=16;s.glit=null;s.done=false;s.prev=false;s.hitR=4;
  s.svl=null;s.sgv=null;s.svry=null;s.svd=false;
  s.cv.addEventListener('click',function(e){
    if(s.done)return;var r=s.cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
    for(var i=0;i<s.sr.length;i++){var sr=s.sr[i];if(sr.t!=='e')continue;if(d2(mx,my,sr.x,sr.y)<sr.r+s.hitR){if(sr.lit)s.off(i);else s.on(i);return}}
  });
};

window.SR.Game.prototype.ld=function(k){
  var d=window.SR._reg[k];if(!d)return;
  this.key=k;this.done=false;this.glit=d.goalLit||null;this.hitR=d.hitR||4;
  this.cv.width=innerWidth;this.cv.height=innerHeight-48;
  var w=this.cv.width,h=this.cv.height,sc=d.scale||6;
  this.sr=[];for(var i=0;i<d.sources.length;i++){
    var s=d.sources[i],sx,sy,as=[];
    if(s.gx!==undefined){sx=w*(.5+s.gx/sc);sy=h*(.5-s.gy/sc);
      if(s.type!=='r'){
        if(s.dxs){for(var di=0;di<s.dxs.length;di++)as.push(Math.atan2(-s.dys[di]*h/sc,s.dxs[di]*w/sc))}
        else as.push(Math.atan2(-s.dy*h/sc,s.dx*w/sc));
    }}else{sx=s.ax*w;sy=s.ay*h;if(s.type!=='r')as.push(rd(s.angle||0))}
    this.sr.push({x:sx,y:sy,t:s.type||'e',as:as,lit:s.type==='n',r:this.srR,hc:0});
  }
  // 矩形反射板
  this.rf=[];for(var j=0;j<(d.reflectors||[]).length;j++){var r=d.reflectors[j];
    if(r.gx!==undefined){var t=Math.max(r.gy1,r.gy2),b=Math.min(r.gy1,r.gy2);this.rf.push({x:w*(.5+(r.gx-r.gw/2)/sc),y:h*(.5-t/sc),w:r.gw/sc*w,h:(t-b)/sc*h,lit:false})}
    else this.rf.push({x:r.rx*w,y:r.ry*h,w:r.rw*w,h:r.rh*h,lit:false});
  }
  // 线段反射板
  this.sg=[];for(var l=0;l<(d.segs||[]).length;l++){var g=d.segs[l];this.sg.push({x1:w*(.5+g.gx1/sc),y1:h*(.5-g.gy1/sc),x2:w*(.5+g.gx2/sc),y2:h*(.5-g.gy2/sc),lit:false})}
  // 多边形 → 线段
  for(var p=0;p<(d.polys||[]).length;p++){var pts=d.polys[p];for(var m=0;m<pts.length;m++){var a=pts[m],b=pts[(m+1)%pts.length];if(b===undefined)b=pts[0];this.sg.push({x1:w*(.5+a[0]/sc),y1:h*(.5-a[1]/sc),x2:w*(.5+b[0]/sc),y2:h*(.5-b[1]/sc),lit:false})}}
  this.ry=[];this.rc();this.dr();
  document.getElementById('goal-btn').textContent='目标';
  document.getElementById('preview-badge').style.display='none';
  document.getElementById('complete-badge').style.display='none';
};

window.SR.Game.prototype.on=function(i){try{this.sr[i].lit=true;this.rc();this.dr();var s=this;setTimeout(function(){s.ck()},50)}catch(e){console.error(e)}};
window.SR.Game.prototype.off=function(i){try{this.sr[i].lit=false;this.rc();this.dr();var s=this;setTimeout(function(){s.ck()},50)}catch(e){console.error(e)}};

window.SR.Game.prototype.rc=function(){
  for(var i=0;i<this.sr.length;i++){if(this.sr[i].t==='r')this.sr[i].lit=false;if(this.sr[i].t==='x')this.sr[i].lit=false;if(this.sr[i].t==='a'){this.sr[i].hc=0;this.sr[i].lit=false}if(this.sr[i].t==='n')this.sr[i].lit=true}
  for(var j=0;j<this.rf.length;j++)this.rf[j].lit=false;
  for(var k=0;k<this.sg.length;k++)this.sg[k].lit=false;
  this.ry=[];
  for(var m=0;m<this.sr.length;m++){var s=this.sr[m];if((s.t==='e'||s.t==='x'||s.t==='n'||s.t==='a')&&s.lit)for(var d=0;d<s.as.length;d++)this.tr(s.x,s.y,s.as[d],0)}
};

window.SR.Game.prototype.tr=function(ox,oy,a,dp){
  dp=dp||0;if(dp>20)return;
  var dx=Math.cos(a),dy=Math.sin(a);
  // 光源碰撞
  var hi=rs(this.sr,ox,oy,a,this.hitR),hs=hi>=0?this.sr[hi]:null,hsd=hs?d2(ox,oy,hs.x,hs.y):1/0;
  // 矩形反射板碰撞
  var nr=null,nd=1/0;
  for(var i=0;i<this.rf.length;i++){var r=this.rf[i],rr=rrh(r.x,r.y,r.w,r.h,ox,oy,dx,dy);if(rr.pt&&rr.d<nd){nr={i:i,t:'r',p:rr.pt,n:rr.n,d:rr.d};nd=rr.d}}
  // 线段反射板碰撞
  for(var j=0;j<this.sg.length;j++){var g=this.sg[j],rr=rsh(ox,oy,dx,dy,g.x1,g.y1,g.x2,g.y2);if(rr&&rr.d<nd){nr={i:j,t:'g',p:{x:rr.x,y:rr.y},ns:g,d:rr.d};nd=rr.d}}
  if(!hs&&!nr){var ex=3000;this.ry.push({x1:ox,y1:oy,x2:ox+dx*ex,y2:oy+dy*ex,c:'100,180,255'});return}
  if(hs&&hsd<=nd){this.ry.push({x1:ox,y1:oy,x2:hs.x,y2:hs.y,c:hs.t==='r'?'100,255,180':hs.t==='x'||hs.t==='n'||hs.t==='a'?'255,200,80':'100,180,255'});if(hs.t==='r'||hs.t==='x'||hs.t==='n'||hs.t==='a'){if(hs.t==='n')hs.lit=false;else if(hs.t==='a'){hs.hc++;if(hs.hc>=2)hs.lit=true}else hs.lit=true;if(hs.lit&&(hs.t==='x'||hs.t==='a'))for(var d=0;d<hs.as.length;d++)this.tr(hs.x,hs.y,hs.as[d],dp)}return}
  if(nr){
    this.ry.push({x1:ox,y1:oy,x2:nr.p.x,y2:nr.p.y,c:'100,180,255'});
    if(nr.t==='r'){this.rf[nr.i].lit=true;var na=nr.n==='top'||nr.n==='bottom'?-a:Math.PI-a;this.tr(nr.p.x,nr.p.y,na,dp+1)}
    else{this.sg[nr.i].lit=true;var sx=nr.ns.x2-nr.ns.x1,sy=nr.ns.y2-nr.ns.y1,phi=Math.atan2(sy,sx),na=2*phi-a;this.tr(nr.p.x,nr.p.y,na,dp+1)}
  }
};

window.SR.Game.prototype.ck=function(){
  if(!this.glit||!this.glit.length)return;var ok=true;
  for(var i=0;i<this.glit.length;i++){if(this.glit[i]===null)continue;if(this.sr[i].lit!==this.glit[i]){ok=false;break}}
  if(ok){this.done=true;document.getElementById('complete-badge').style.display='block'}
};

window.SR.Game.prototype.reset=function(){
  for(var i=0;i<this.sr.length;i++){this.sr[i].lit=this.sr[i].t==='n';this.sr[i].hc=0}
  for(var j=0;j<this.rf.length;j++)this.rf[j].lit=false;
  for(var k=0;k<this.sg.length;k++)this.sg[k].lit=false;
  this.ry=[];this.rc();this.done=false;document.getElementById('complete-badge').style.display='none';this.dr();
};

window.SR.Game.prototype.preview=function(){
  if(this.prev)return;this.prev=true;
  this.svl=this.sr.map(function(s){return s.lit});this.sgv=this.sg.map(function(g){return g.lit});this.svry=this.ry.slice();this.svd=this.done;
  for(var i=0;i<this.sr.length;i++)this.sr[i].lit=(this.glit&&this.glit[i]!==null)?this.glit[i]:false;
  this.ry=[];for(var j=0;j<this.sr.length;j++){var s=this.sr[j];if((s.t==='e'||s.t==='x'||s.t==='n'||s.t==='a')&&s.lit)for(var d=0;d<s.as.length;d++)this.tr(s.x,s.y,s.as[d],0)}
  this.dr();document.getElementById('preview-badge').style.display='block';
};

window.SR.Game.prototype.unpreview=function(){
  if(!this.prev)return;this.prev=false;
  for(var i=0;i<this.sr.length;i++)this.sr[i].lit=this.svl[i];
  for(var j=0;j<this.sg.length;j++)this.sg[j].lit=this.sgv[j];
  this.ry=this.svry;this.done=this.svd;
  if(!this.svd)document.getElementById('complete-badge').style.display='none';
  this.dr();document.getElementById('preview-badge').style.display='none';
};

window.SR.Game.prototype.dr=function(){
  var c=this.c,w=this.cv.width,h=this.cv.height;
  c.clearRect(0,0,w,h);c.fillStyle='#060a14';c.fillRect(0,0,w,h);
  c.strokeStyle='rgba(90,120,160,.03)';c.lineWidth=.5;
  for(var x=0;x<w;x+=48){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke()}
  for(var y=0;y<h;y+=48){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke()}
  for(var i=0;i<this.ry.length;i++){var r=this.ry[i];c.save();c.beginPath();c.moveTo(r.x1,r.y1);c.lineTo(r.x2,r.y2);var g=c.createLinearGradient(r.x1,r.y1,r.x2,r.y2);g.addColorStop(0,'rgba('+r.c+',.7)');g.addColorStop(1,'rgba('+r.c+',.1)');c.strokeStyle=g;c.lineWidth=2.5;c.stroke();c.strokeStyle='rgba('+r.c+',.2)';c.lineWidth=6;c.stroke();c.restore()}
  for(var j=0;j<this.rf.length;j++){var rf=this.rf[j],rd=4;c.save();c.fillStyle=rf.lit?'rgba(100,180,240,.4)':'rgba(70,80,100,.25)';c.strokeStyle=rf.lit?'rgba(100,180,240,.6)':'rgba(90,100,120,.3)';c.lineWidth=1.5;c.beginPath();c.moveTo(rf.x+rd,rf.y);c.lineTo(rf.x+rf.w-rd,rf.y);c.arcTo(rf.x+rf.w,rf.y,rf.x+rf.w,rf.y+rf.h,rd);c.lineTo(rf.x+rf.w,rf.y+rf.h-rd);c.arcTo(rf.x+rf.w,rf.y+rf.h,rf.x+rf.w-rd,rf.y+rf.h,rd);c.lineTo(rf.x+rd,rf.y+rf.h);c.arcTo(rf.x,rf.y+rf.h,rf.x,rf.y+rf.h-rd,rd);c.lineTo(rf.x,rf.y+rd);c.arcTo(rf.x,rf.y,rf.x+rd,rf.y,rd);c.closePath();c.fill();c.stroke();c.restore()}
  for(var k=0;k<this.sg.length;k++){var sg=this.sg[k];c.save();c.strokeStyle=sg.lit?'rgba(100,200,255,.7)':'rgba(90,110,140,.3)';c.lineWidth=sg.lit?3:1.5;c.beginPath();c.moveTo(sg.x1,sg.y1);c.lineTo(sg.x2,sg.y2);c.stroke();c.restore()}
  for(var m=0;m<this.sr.length;m++){var sr=this.sr[m];c.save();if(sr.lit){var gl=c.createRadialGradient(sr.x,sr.y,sr.r*.3,sr.x,sr.y,sr.r*1.6);var gc=sr.t==='x'||sr.t==='n'||sr.t==='a'?'rgba(240,180,60,.45)':'rgba(80,200,255,.45)';gl.addColorStop(0,gc);gl.addColorStop(1,sr.t==='x'||sr.t==='n'||sr.t==='a'?'rgba(200,140,40,0)':'rgba(80,160,255,0)');c.fillStyle=gl;c.beginPath();c.arc(sr.x,sr.y,sr.r*1.6,0,6.28);c.fill()}var bg=c.createRadialGradient(sr.x-3,sr.y-3,1,sr.x,sr.y,sr.r);if(sr.t==='x'||sr.t==='n'||sr.t==='a'){sr.lit?(bg.addColorStop(0,'#fff0d0'),bg.addColorStop(.4,'#e0b040'),bg.addColorStop(1,'#805020')):(bg.addColorStop(0,'#b0a090'),bg.addColorStop(.4,'#706050'),bg.addColorStop(1,'#383020'))}else{sr.lit?(bg.addColorStop(0,'#e0f0ff'),bg.addColorStop(.4,'#70b8f0'),bg.addColorStop(1,'#1858a0')):(bg.addColorStop(0,'#98a0b0'),bg.addColorStop(.4,'#586070'),bg.addColorStop(1,'#283040'))}c.fillStyle=bg;c.beginPath();c.arc(sr.x,sr.y,sr.r,0,6.28);c.fill();c.strokeStyle=sr.t==='x'||sr.t==='n'||sr.t==='a'?(sr.lit?'rgba(220,160,40,.5)':'rgba(150,120,80,.35)'):(sr.lit?'rgba(90,190,255,.5)':'rgba(110,120,140,.35)');c.lineWidth=1.5;c.stroke();if(sr.t==='e'||sr.t==='x'||sr.t==='n'||sr.t==='a'){var tc=sr.t==='x'||sr.t==='n'||sr.t==='a'?(sr.lit?'#ffe0a0':'#908070'):(sr.lit?'#b8e0ff':'#788898');for(var d=0;d<sr.as.length;d++){c.save();c.translate(sr.x,sr.y);c.rotate(sr.as[d]);c.fillStyle=tc;c.beginPath();c.moveTo(sr.r+6,0);c.lineTo(sr.r-2,-5);c.lineTo(sr.r-2,5);c.closePath();c.fill();c.restore()}if(sr.t==='n'){c.font='12px system-ui';c.fillStyle='#c0a060';c.textAlign='center';c.fillText('非',sr.x,sr.y-sr.r-10)}if(sr.t==='a'){c.font='12px system-ui';c.fillStyle='#c0a060';c.textAlign='center';c.fillText('与',sr.x,sr.y-sr.r-10)}if(sr.t==='x'){c.font='12px system-ui';c.fillStyle='#c0a060';c.textAlign='center';c.fillText('或',sr.x,sr.y-sr.r-10)}}c.restore()}
};
