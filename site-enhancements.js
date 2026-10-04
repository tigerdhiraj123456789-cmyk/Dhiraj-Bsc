/* Dhiraj B.Sc navigation */
(function(){
  if(window.__dhirajNavigationLoaded)return;
  window.__dhirajNavigationLoaded=true;
  var PAGE='dhiraj_page_v5', COURSE='dhiraj_course_v5';
  var pages=['loginSection','signupSection','accountSection','courseSection','adminSection'];
  function get(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
  function set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}
  function del(k){try{sessionStorage.removeItem(k)}catch(e){}}
  function hide(){
    var h=document.getElementById('homeHero'),m=document.getElementById('homeMain');
    if(h)h.classList.add('hidden'); if(m)m.classList.add('hidden');
    pages.forEach(function(id){var e=document.getElementById(id);if(e)e.classList.add('hidden')});
  }
  function showPage(id,save){
    hide();
    if(id==='home'){
      var h=document.getElementById('homeHero'),m=document.getElementById('homeMain');
      if(h)h.classList.remove('hidden');if(m)m.classList.remove('hidden');
    }else{var e=document.getElementById(id);if(e)e.classList.remove('hidden')}
    if(id==='courseSection'){
      var c=document.getElementById('courseHeading'),t=get(COURSE);if(c&&t)c.textContent=t;
    }
    if(save)set(PAGE,id);
    window.scrollTo(0,0);addHome();removeLoginBack();
  }
  function nav(id){
    var old=get(PAGE);
    if(old&&old!==id)try{history.pushState({page:id},'',location.pathname)}catch(e){}
    showPage(id,true);
  }
  function addHome(){
    var s=document.getElementById('accountSection');if(!s)return;
    var c=s.querySelector('.card');if(!c||c.querySelector('.dhiraj-home'))return;
    var b=document.createElement('button');b.type='button';b.className='blue dhiraj-home';b.textContent='← Home';b.style.marginBottom='16px';b.onclick=function(){nav('home')};c.insertBefore(b,c.firstChild);
  }
  function removeLoginBack(){
    var s=document.getElementById('loginSection');if(!s)return;
    Array.prototype.slice.call(s.querySelectorAll('button')).forEach(function(b){var t=(b.textContent||'').toLowerCase();if(t.indexOf('back')>=0||t.indexOf('←')>=0)b.remove()});
  }
  function patch(){
    if(typeof window.show==='function'&&!window.__show5){var f=window.show;window.show=function(id){f(id);nav(id)};window.__show5=true}
    if(typeof window.home==='function'&&!window.__home5){var f2=window.home;window.home=function(){f2();nav('home')};window.__home5=true}
    if(typeof window.openCourse==='function'&&!window.__course5){var f3=window.openCourse;window.openCourse=function(n){set(COURSE,n);f3(n);nav('courseSection')};window.__course5=true}
  }
  function start(){
    patch();
    var navEntry=null;try{navEntry=performance.getEntriesByType('navigation')[0]}catch(e){}
    var reload=navEntry&&navEntry.type==='reload';
    var saved=get(PAGE);
    /* New/direct opening = Login. Reload = restore current page. */
    if(!reload){del(PAGE);del(COURSE);showPage('loginSection',true);try{history.replaceState({page:'loginSection'},'',location.pathname)}catch(e){}}
    else if(saved&&(saved==='home'||pages.indexOf(saved)>=0))showPage(saved,false);
    else showPage('loginSection',true);
    addHome();removeLoginBack();
  }
  window.addEventListener('popstate',function(){showPage(get(PAGE)||'loginSection',false)});
  setTimeout(start,150);
})();
