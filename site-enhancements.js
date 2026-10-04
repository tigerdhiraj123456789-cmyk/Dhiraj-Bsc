/* Dhiraj B.Sc navigation v6 */
(function(){
  if(window.__dhirajNavigationV6)return;
  window.__dhirajNavigationV6=true;

  const PAGE='dhiraj_page_v6';
  const COURSE='dhiraj_course_v6';
  const TAB='dhiraj_bsc_tab_v6';
  const pages=['loginSection','signupSection','accountSection','courseSection','adminSection'];

  function get(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
  function set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}
  function del(k){try{sessionStorage.removeItem(k)}catch(e){}}

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
        const u=window.currentUser;
        const email=document.getElementById('accountEmail');
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
    const old=get(PAGE);
    if(old!==id){try{history.pushState({page:id},'',location.pathname)}catch(e){}}
    render(id,true);
  }

  function addAccountHome(){
    const s=document.getElementById('accountSection');
    if(!s)return;
    const card=s.querySelector('.card');
    if(!card||card.querySelector('.dhiraj-home-v6'))return;
    const b=document.createElement('button');
    b.type='button';b.className='blue dhiraj-home-v6';b.textContent='← Home';
    b.style.marginBottom='16px';b.onclick=()=>go('home');
    card.insertBefore(b,card.firstChild);
  }

  function removeLoginBack(){
    const s=document.getElementById('loginSection');if(!s)return;
    s.querySelectorAll('button').forEach(b=>{
      const t=(b.textContent||'').trim().toLowerCase();
      if(t.includes('back')||t.startsWith('←'))b.remove();
    });
  }

  function patchFunctions(){
    if(typeof window.show==='function'&&!window.__showV6){
      const original=window.show;
      window.show=function(id){original(id);go(id)};
      window.__showV6=true;
    }
    if(typeof window.home==='function'&&!window.__homeV6){
      const original=window.home;
      window.home=function(){original();go('home')};
      window.__homeV6=true;
    }
    if(typeof window.openCourse==='function'&&!window.__courseV6){
      const original=window.openCourse;
      window.openCourse=function(name){set(COURSE,name);original(name);go('courseSection')};
      window.__courseV6=true;
    }
  }

  function start(){
    patchFunctions();

    // window.name survives reload but is empty for a newly opened tab/window.
    const isSameTab=window.name===TAB;
    window.name=TAB;
    const saved=get(PAGE);

    if(!isSameTab){
      del(PAGE);del(COURSE);
      render('loginSection',true);
      try{history.replaceState({page:'loginSection'},'',location.pathname)}catch(e){}
    }else if(saved==='accountSection'||saved==='courseSection'||saved==='adminSection'||saved==='signupSection'||saved==='loginSection'||saved==='home'){
      render(saved,false);
    }else{
      render('loginSection',true);
    }
  }

  window.addEventListener('popstate',function(){render(get(PAGE)||'loginSection',false)});
  window.addEventListener('pageshow',function(){setTimeout(()=>{patchFunctions();addAccountHome();removeLoginBack()},50)});
  setTimeout(start,200);
})();
