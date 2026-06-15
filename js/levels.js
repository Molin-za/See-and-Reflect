// 关卡选择
window.SR=window.SR||{};
window.SR.LevelScreen=function(gid,tid){
  this.g=document.getElementById(gid);
  this.t=document.getElementById(tid);
};
window.SR.LevelScreen.prototype.show=function(ch){
  this.ch=ch;this.t.textContent=ch.title+' — Select Level';this.r();
};
window.SR.LevelScreen.prototype.r=function(){
  this.g.innerHTML='';
  var reg=window.SR._reg||{},ls=[];
  for(var k in reg){var p=k.split('-');if(parseInt(p[0])===this.ch.id)ls.push({k:k,n:reg[k].name,i:parseInt(p[1])})}
  ls.sort(function(a,b){return a.i-b.i});
  for(var j=0;j<ls.length;j++){(function(l,s){
    var d=document.createElement('div');d.className='card unlocked';
    d.innerHTML='<span class="card-num">Level '+(l.i+1)+'</span><span class="card-title">'+l.n+'</span><span class="card-icon">▶</span>';
    d.addEventListener('click',function(){window.dispatchEvent(new CustomEvent('nav',{detail:{screen:'game',key:l.k}}))});
    s.g.appendChild(d);
  })(ls[j],this)}
};
