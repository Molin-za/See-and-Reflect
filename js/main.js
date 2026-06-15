// 主入口
window.SR=window.SR||{};
(function(){
  var home=document.getElementById('home');
  var chScr=document.getElementById('chapters');
  var lvScr=document.getElementById('levels');
  var gmScr=document.getElementById('game');

  function show(id){home.classList.toggle('active',id==='home');chScr.classList.toggle('active',id==='chapters');lvScr.classList.toggle('active',id==='levels');gmScr.classList.toggle('active',id==='game')}

  new window.SR.UI();
  var chs=new window.SR.ChapterScreen('chapter-grid');
  var lvs=new window.SR.LevelScreen('level-grid','level-title');
  var gm=new window.SR.Game('game-canvas');

  document.getElementById('level-back').addEventListener('click',function(){show('chapters')});
  document.getElementById('game-back').addEventListener('click',function(){show('levels');lvs.show(lvs.ch)});
  document.getElementById('goal-btn').addEventListener('click',function(){
    var b=document.getElementById('goal-btn');
    if(gm.prev){gm.unpreview();b.textContent='目标'}else{gm.preview();b.textContent='现实'}
  });
  document.getElementById('reset-btn').addEventListener('click',function(){gm.reset()});

  window.addEventListener('nav',function(e){
    var d=e.detail;
    if(typeof d==='string'){show(d);return}
    if(d.screen==='home')show('home');
    else if(d.screen==='chapters')show('chapters');
    else if(d.screen==='levels'){show('levels');lvs.show(d.chapter)}
    else if(d.screen==='game'){show('game');setTimeout(function(){gm.ld(d.key)},60)}
  });

  var bgCv=document.getElementById('bg-canvas');
  if(bgCv){var bg=new window.SR.BG(bgCv,70);var ry=new window.SR.Rays(bgCv,5);(function l(t){bg.fr(t);ry.fr(t);requestAnimationFrame(l)})()}
})();
