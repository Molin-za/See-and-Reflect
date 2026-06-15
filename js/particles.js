// 粒子背景系统
window.SR=window.SR||{};
(function(){
var P=function(w,h){this.x=Math.random()*w;this.y=Math.random()*h;this.vx=(Math.random()-.5)*.25;this.vy=(Math.random()-.5)*.25;this.r=Math.random()*2+.5;this.bo=Math.random()*.4+.08;this.o=this.bo;this.ts=Math.random()*.02+.004;this.to=Math.random()*6.28};
P.prototype.up=function(w,h,t){this.x+=this.vx;this.y+=this.vy;if(this.x<-10)this.x=w+10;if(this.x>w+10)this.x=-10;if(this.y<-10)this.y=h+10;if(this.y>h+10)this.y=-10;this.o=this.bo+Math.sin(t*this.ts+this.to)*.12;this.o=Math.max(.04,Math.min(.6,this.o))};
P.prototype.dr=function(c){c.beginPath();c.arc(this.x,this.y,this.r,0,6.28);c.fillStyle='rgba(130,160,210,'+this.o+')';c.fill()};
window.SR.BG=function(cv,n){var s=this;s.cv=cv;s.c=cv.getContext('2d');s.ps=[];s.n=n||70;s.rs=function(){s.cv.width=innerWidth;s.cv.height=innerHeight;s.ps=[];for(var i=0;i<s.n;i++)s.ps.push(new P(s.cv.width,s.cv.height))};s.rs();window.addEventListener('resize',function(){s.rs()})};
window.SR.BG.prototype.fr=function(t){var c=this.c,w=this.cv.width,h=this.cv.height;var g=c.createRadialGradient(w*.3,h*.4,0,w*.5,h*.5,Math.max(w,h)*.8);g.addColorStop(0,'#0c1a30');g.addColorStop(.5,'#070d1c');g.addColorStop(1,'#03050e');c.fillStyle=g;c.fillRect(0,0,w,h);for(var i=0;i<this.ps.length;i++)this.ps[i].dr(c)};
})();
