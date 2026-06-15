// 首页交互
window.SR=window.SR||{};
window.SR.UI=function(){
  var btn=document.getElementById('start-btn');
  if(btn)btn.addEventListener('click',function(){window.dispatchEvent(new CustomEvent('nav',{detail:'chapters'}))});
};
