/* Dhiraj B.Sc navigation v8 */
(function(){
  if(window.__dhirajNavigationV8)return;
  window.__dhirajNavigationV8=true;

  const PAGE='dhiraj_page_v8';
  const COURSE='dhiraj_course_v8';
  const pages=['loginSection','signupSection','accountSection','courseSection','adminSection'];

  function get(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
  function set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}
  function del(k){try{sessionStorage.removeItem(k)}catch(e){}}

  function navType(){
    try{
      const n=performance.getEntriesByType('navigation')[0];
      if(n&&n.type)return n.type;
    }catch(e){}
    return 'navigate';
  }

  function hideAll(){
    ['homeHero','homeMain'].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.add('hidden')});
    pages.forEach(id=>{const e=document.getElementById(id);if(e)e.classList.add('hidden')});
  }

  function render(id,save){
    hideAll();
    if(id==='home'){
      document.getElementById('homeHero')?.classList.remove('hidden');
      document.getElementById('homeMain')?.classList.remove('hidden');
    }else{
      document.getElementById(id)?.classList.remove('hidden');
      if(id==='accountSection'){
        const email=document.getElementById('accountEmail');
        const u=window.currentUser;
        if(email&&u)email.textContent=u.email||'';
      }
      if(id==='courseSection'){
        const c=document.getElementById('courseHeading'),n=get(COURSE);
        if(c&&n)c.textContent=n;
      }
    }
    if(save)set(PAGE,id);
    window.scrollTo(0,0);
    addAccountHome();
    removeLoginBack();
  }

  function go(id){
    if(get(PAGE)!==id){
      try{history.pushState({page:id},'',location.pathname)}catch(e){}
    }
    render(id,true);
  }

  function addAccountHome(){
    const s=document.getElementById('accountSection');
    if(!s)return;
    const card=s.querySelector('.card');
    if(!card||card.querySelector('.dhiraj-home-v8'))return;
    const b=document.createElement('button');
    b.type='button';b.className='blue dhiraj-home-v8';b.textContent='← Home';
    b.style.marginBottom='16px';
    b.onclick=function(){go('home')};
    card.insertBefore(b,card.firstChild);
  }

  function removeLoginBack(){
    const s=document.getElementById('loginSection');
    if(!s)return;
    s.querySelectorAll('button').forEach(b=>{
      const t=(b.textContent||'').trim().toLowerCase();
      if(t.includes('back')||t.startsWith('←'))b.remove();
    });
  }

  function patchFunctions(){
    if(typeof window.show==='function'&&!window.__showV8){
      const original=window.show;
      window.show=function(id){original(id);go(id)};
      window.__showV8=true;
    }
    if(typeof window.home==='function'&&!window.__homeV8){
      const original=window.home;
      window.home=function(){original();go('home')};
      window.__homeV8=true;
    }
    if(typeof window.openCourse==='function'&&!window.__courseV8){
      const original=window.openCourse;
      window.openCourse=function(name){set(COURSE,name);original(name);go('courseSection')};
      window.__courseV8=true;
    }
  }

  function start(){
    patchFunctions();
    const type=navType();
    const saved=get(PAGE);

    if(type==='reload' && saved){
      render(saved,false);
      // The original index.html currently calls home() after loadSession().
      // Re-apply the saved page after that async initialization finishes.
      const wanted=saved;
      setTimeout(function(){
        patchFunctions();
        if(get(PAGE)===wanted)render(wanted,false);
      },1200);
    }else{
      del(PAGE);del(COURSE);
      render('loginSection',true);
      try{history.replaceState({page:'loginSection'},'',location.pathname)}catch(e){}
    }
  }

  window.addEventListener('popstate',function(){
    render(get(PAGE)||'loginSection',false);
  });

  window.addEventListener('pageshow',function(){
    setTimeout(function(){patchFunctions();addAccountHome();removeLoginBack()},50);
  });

  setTimeout(start,250);
})();
