/* Dhiraj B.Sc — safe content enhancements */
(function(){
  function splitUrls(v){return String(v||'').split(/\r?\n|\s*,\s*/).map(function(x){return x.trim()}).filter(Boolean)}
  function ytId(url){var m=String(url||'').match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);return m?m[1]:null}
  function renderMany(urls){
    var b=document.getElementById('recordingBox'); if(!b)return;
    if(!urls.length){b.innerHTML='<p class="muted">Admin ne abhi recording add nahi ki hai.</p>';return}
    b.innerHTML=urls.map(function(url,i){var id=ytId(url); if(id)return '<div class="video-box" style="margin-bottom:14px"><iframe src="https://www.youtube.com/embed/'+id+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" allowfullscreen></iframe></div>';
      return '<div class="video-box" style="margin-bottom:14px"><video controls src="'+url.replace(/"/g,'&quot;')+'"></video></div>'}).join('')
  }
  async function refreshEnhanced(){
    if(!window.sb)return;
    var r=await window.sb.from('site_content').select('*').eq('id',1).maybeSingle();
    if(r.error||!r.data)return;
    var d=r.data;
    var title=d.recording_title||'Recorded Class';
    var parts=title.split(' | '), teacher=parts.length>1?parts[0]:'';
    document.getElementById('recordingTitle').textContent=parts.length>1?parts.slice(1).join(' | '):title;
    renderMany(splitUrls(d.recording_url));
    var n=document.getElementById('notesLink');
    var notes=splitUrls(d.notes_url);
    if(n){
      if(notes.length){n.classList.remove('hidden');n.href=notes[0];n.innerHTML='<button class="white">📄 Open Notes / PDF'+(notes.length>1?' ('+notes.length+')':'')+'</button>';n.onclick=function(e){if(notes.length>1){e.preventDefault();notes.forEach(function(u){window.open(u,'_blank')})}}}
      else n.classList.add('hidden');
    }
    var box=document.getElementById('adminEnhancedBox');
    if(box){
      var t=box.querySelector('#enhTeacher'); if(t)t.value=teacher;
      var ru=box.querySelector('#enhRecordings'); if(ru)ru.value=splitUrls(d.recording_url).join('\n');
      var nu=box.querySelector('#enhNotes'); if(nu)nu.value=notes.join('\n');
    }
  }
  async function saveEnhanced(){
    if(!window.currentUser||!window.currentProfile||window.currentProfile.role!=='admin')return alert('Admin permission nahi hai.');
    var teacher=(document.getElementById('enhTeacher').value||'').trim();
    var title=(document.getElementById('recordingTitleInput').value||'Recorded Class').trim();
    var urls=splitUrls(document.getElementById('enhRecordings').value);
    var notes=splitUrls(document.getElementById('enhNotes').value);
    var fullTitle=teacher?(teacher+' | '+title):title;
    var r=await window.sb.from('site_content').upsert({id:1,recording_title:fullTitle,recording_url:urls.join('\n'),notes_url:notes.join('\n'),updated_at:new Date().toISOString()},{onConflict:'id'});
    if(r.error)return alert(r.error.message);
    alert('Recording, Teacher aur Notes save ho gaye ✓');
    await refreshEnhanced();
    if(window.loadAdmin)await window.loadAdmin();
  }
  function addPanel(){
    var dash=document.querySelector('#adminSection .dashboard'); if(!dash||document.getElementById('adminEnhancedBox'))return;
    var box=document.createElement('div');box.id='adminEnhancedBox';box.className='card';box.style.marginTop='24px';
    box.innerHTML='<h3>👨‍🏫 Teacher & Multiple Content</h3><p class="muted small">One URL per line. You can add multiple YouTube/MP4 recordings and multiple PDF/Drive links.</p><label>Teacher name</label><input id="enhTeacher" placeholder="Teacher name"><label>Recordings — one URL per line</label><textarea id="enhRecordings" rows="5" style="width:100%;padding:13px;border:1px solid #ccd5e3;border-radius:9px;font-size:15px;resize:vertical"></textarea><label>Notes / PDFs — one URL per line</label><textarea id="enhNotes" rows="4" style="width:100%;padding:13px;border:1px solid #ccd5e3;border-radius:9px;font-size:15px;resize:vertical"></textarea><br><br><button class="blue" id="enhSave">💾 Save Teacher / Content</button>';
    dash.appendChild(box);document.getElementById('enhSave').onclick=saveEnhanced;refreshEnhanced();
  }
  function boot(){
    var old=window.show;
    if(typeof old==='function')window.show=function(id){old.apply(this,arguments);if(id==='adminSection')setTimeout(addPanel,100)};
    var oldHome=window.home;
    if(typeof oldHome==='function')window.home=function(){oldHome.apply(this,arguments)};
    setTimeout(function(){refreshEnhanced();addPanel()},700);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
