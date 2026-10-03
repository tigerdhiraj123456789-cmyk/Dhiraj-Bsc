/* Dhiraj B.Sc — safe content enhancements */
(function(){
  var SB_URL='https://afvvxtfdwdvjkmezjgwv.supabase.co';
  var SB_KEY='sb_publishable_IbbUW-sDSwf7kkpYYRWn_w_TF613T9Z';
  var client=(window.supabase&&window.supabase.createClient)?window.supabase.createClient(SB_URL,SB_KEY):null;

  /* Stop the old load-time redirect in index.html. It ran before Supabase finished restoring the session,
     which caused a brief Student Login flash after refresh. */
  window.addEventListener('load',function(e){e.stopImmediatePropagation();},true);

  function splitUrls(v){return String(v||'').split(/\r?\n|\s*,\s*/).map(function(x){return x.trim()}).filter(Boolean)}
  function ytId(url){var m=String(url||'').match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);return m?m[1]:null}
  function renderMany(urls){var b=document.getElementById('recordingBox');if(!b)return;if(!urls.length){b.innerHTML='<p class="muted">Admin ne abhi recording add nahi ki hai.</p>';return}b.innerHTML=urls.map(function(url){var id=ytId(url);if(id)return '<div class="video-box" style="margin-bottom:14px"><iframe src="https://www.youtube.com/embed/'+id+'" allowfullscreen></iframe></div>';return '<div class="video-box" style="margin-bottom:14px"><video controls src="'+url.replace(/"/g,'&quot;')+'"></video></div>'}).join('')}
  function refreshEnhanced(){if(!client)return;client.from('site_content').select('*').eq('id',1).maybeSingle().then(function(r){if(r.error||!r.data)return;var d=r.data;renderMany(splitUrls(d.recording_url));var n=document.getElementById('notesLink'),notes=splitUrls(d.notes_url);if(n){if(notes.length){n.classList.remove('hidden');n.href=notes[0]}else n.classList.add('hidden')}})}
  function addPanel(){var dash=document.querySelector('#adminSection .dashboard');if(!dash||document.getElementById('adminEnhancedBox'))return;var box=document.createElement('div');box.id='adminEnhancedBox';box.innerHTML='<h3>👨‍🏫 Teacher & Multiple Content</h3>';dash.appendChild(box)}
  function removeStudentBack(){var btn=document.querySelector('#loginSection .back');if(btn)btn.remove()}
  function boot(){
    var style=document.createElement('style');
    style.textContent='#loginSection .back{display:none !important;visibility:hidden !important;}';
    document.head.appendChild(style);
    removeStudentBack();
    setTimeout(removeStudentBack,100);setTimeout(removeStudentBack,500);setTimeout(removeStudentBack,1000);setTimeout(removeStudentBack,2000);
    var observer=new MutationObserver(removeStudentBack);observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(refreshEnhanced,700);setTimeout(addPanel,700);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
