// 光线动画系统
window.SR=window.SR||{};
(function(){
var R=function(w,h){this.w=w;this.h=h;this.rst()};
R.prototype.rst=function(){var e=Math.floor(Math.random()*4);var w=this.w,h=this.h;switch(e){case 0:this.x1=Math.random()*w;this.y1=0;this.a=Math.random()*1.9+Math.PI*.2;break;case 1:this.x1=w;this.y1=Math.random()*h;this.a=Math.random()*1.9+Math.PI*1.2;break;case 2:this.x1=Math.random()*w;this.y1=h;this.a=Math.random()*1.9+Math.PI*1.7;break;default:this.x1=0;this.y1=Math.random()*h;this.a=Math.random()*1.9-Math.PI*.3}this.ln=Math.random()*240+100;this.o=0;this.to=Math.random()*.16+.03;this.lf=Math.random()*1800+2200;this.age=0;this.fi=true;this.fd=500+Math.random()*400;this.cl=Math.random()>.5?'100,170,240':'130,190,250'};
R.prototype.up=function(dt){this.age+=dt;if(this.fi){this.o+=dt/this.fd*this.to;if(this.o>=this.to){this.o=this.to;this.fi=false}}if(this.age>this.lf*.7){var r=this.lf-this.age;this.o=this.to*Math.max(0,r/(this.lf*.3))}if(this.age>=this.lf){this.rst();this.age=0;this.fi=true}};
R.prototype.dr=function(c){if(this.o<.004)return;var x2=this.x1+Math.cos(this.a)*this.ln,y2=this.y1+Math.sin(this.a)*this.ln;c.save();c.beginPath();c.moveTo(this.x1,this.y1);c.lineTo(x2,y2);var g=c.createLinearGradient(this.x1,this.y1,x2,y2);g.addColorStop(0,'rgba('+this.cl+','+(this.o*1.2)+')');g.addColorStop(.6,'rgba('+this.cl+','+(this.o*.4)+')');g.addColorStop(1,'rgba('+this.cl+',0)');c.strokeStyle=g;c.lineWidth=1.2;c.stroke();c.beginPath();c.arc(this.x1,this.y1,3,0,6.28);c.fillStyle='rgba('+this.cl+','+(this.o*.7)+')';c.fill();c.restore()};
R.prototype.rs=function(w,h){this.w=w;this.h=h};
window.SR.Rays=function(cv,n){this.cv=cv;this.c=cv.getContext('2d');this.rs=[];this.lt=0;this.n=n||5;this.init()};
window.SR.Rays.prototype.init=function(){this.rs=[];for(var i=0;i<this.n;i++)this.rs.push(new R(this.cv.width,this.cv.height))};
window.SR.Rays.prototype.fr=function(t){if(!this.lt){this.lt=t;return}var dt=Math.min(t-this.lt,50);this.lt=t;for(var i=0;i<this.rs.length;i++)this.rs[i].up(dt);for(var j=0;j<this.rs.length;j++)this.rs[j].dr(this.c)};
window.SR.Rays.prototype.rsz=function(){for(var i=0;i<this.rs.length;i++)this.rs[i].rs(this.cv.width,this.cv.height)};
})();
