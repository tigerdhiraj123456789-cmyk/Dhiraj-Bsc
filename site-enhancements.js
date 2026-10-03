/* Dhiraj B.Sc — login session helper */
(function(){
  function removeStudentBack(){var b=document.querySelector('#loginSection .back');if(b)b.remove();}
  function boot(){
    var s=document.createElement('style');
    s.textContent='#loginSection .back{display:none!important}';
    document.head.appendChild(s);
    removeStudentBack();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
