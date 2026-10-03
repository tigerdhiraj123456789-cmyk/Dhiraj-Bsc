/* Dhiraj B.Sc — safe content enhancements */
(function(){
  var originalShow = window.show;
  var ready = false;

  /* Block the old load-handler from showing Student Login while Supabase restores the saved session. */
  window.show = function(id){
    if(id === 'loginSection' && !ready) return;
    return originalShow(id);
  };

  async function restoreSession(){
    if(typeof loadSession !== 'function') return;
    try{
      await loadSession();
      ready = true;
      if(typeof currentUser !== 'undefined' && currentUser){
        if(typeof currentProfile !== 'undefined' && currentProfile && currentProfile.role === 'admin'){
          originalShow('adminSection');
          if(typeof loadAdmin === 'function') await loadAdmin();
        }else{
          originalShow('accountSection');
          var e=document.getElementById('accountEmail');
          if(e) e.textContent=currentUser.email || '';
        }
      }else{
        home();
      }
    }catch(e){
      ready = true;
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
