// 章节选择
window.SR=window.SR||{};
window.SR.ChapterScreen=function(gid){
  this.g=document.getElementById(gid);
  this.chs=[{id:1,title:'入门',open:true},{id:2,title:'逻辑门',open:true}];
  this.r();
  var s=this;
  document.getElementById('chapter-back').addEventListener('click',function(){window.dispatchEvent(new CustomEvent('nav',{detail:'home'}))});
};
window.SR.ChapterScreen.prototype.r=function(){
  this.g.innerHTML='';
  for(var i=0;i<this.chs.length;i++){(function(c,s){
    var d=document.createElement('div');d.className='card '+(c.open?'unlocked':'locked');
    d.innerHTML='<span class="card-num">Chapter '+c.id+'</span><span class="card-title">'+c.title+'</span><span class="card-icon">'+(c.open?'▶':'🔒')+'</span>';
    if(c.open)d.addEventListener('click',function(){window.dispatchEvent(new CustomEvent('nav',{detail:{screen:'levels',chapter:c}}))});
    s.g.appendChild(d);
  })(this.chs[i],this)}
};
