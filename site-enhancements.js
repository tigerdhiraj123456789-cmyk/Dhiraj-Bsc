/* Dhiraj B.Sc — prevent login/account flash on refresh */
(function(){
  var userClicked=false;
  document.addEventListener('click',function(){userClicked=true;},true);
  function removeStudentBack(){var b=document.querySelector('#loginSection .back');if(b)b.remove();}
  function homeNow(){
    var hero=document.getElementById('homeHero'),main=document.getElementById('homeMain');
    var ids=['loginSection','signupSection','accountSection','courseSection','adminSection'];
    if(hero)hero.classList.remove('hidden');
    if(main)main.classList.remove('hidden');
    ids.forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden');});
  }
  function boot(){
    var s=document.createElement('style');
    s.textContent='#loginSection .back{display:none!important}';
    document.head.appendChild(s);
    removeStudentBack();
    if(typeof window.show==='function'){
      var originalShow=window.show;
      window.show=function(id){
        if(!userClicked && (id==='loginSection'||id==='accountSection'||id==='adminSection')){
          homeNow();
          return;
        }
        return originalShow.apply(this,arguments);
      };
    }
    homeNow();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
