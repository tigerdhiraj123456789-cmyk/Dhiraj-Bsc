/* Dhiraj B.Sc — session refresh fix */
(function(){
  var originalShow = window.show;
  var ready = false;

  window.show = function(id){
    if(id === 'loginSection' && !ready) return;
    return originalShow(id);
  };

  async function restoreSession(){
    if(typeof loadSession !== 'function') return;
    try{
      await loadSession();
      ready = true;
      /* On refresh, always return to Home. Keep the Supabase session active. */
      if(typeof currentUser !== 'undefined' && currentUser){
        home();
      }else{
        home();
      }
    }catch(e){
      ready = true;
      home();
    }
  }

  function removeStudentBack(){
    var btn=document.querySelector('#loginSection .back');
    if(btn) btn.remove();
  }

  function boot(){
    var style=document.createElement('style');
    style.textContent='#loginSection .back{display:none !important;visibility:hidden !important;}';
    document.head.appendChild(style);
    removeStudentBack();
    setTimeout(removeStudentBack,300);
    setTimeout(removeStudentBack,1000);
    restoreSession();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
