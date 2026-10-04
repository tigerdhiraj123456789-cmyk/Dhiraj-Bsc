/* Dhiraj B.Sc navigation v9 - URL state, no hash */
(function(){
  if(window.__dhirajNavigationV9)return;
  window.__dhirajNavigationV9=true;
  const pages=['loginSection','signupSection','accountSection','courseSection','adminSection'];
  const valid=new Set(pages);
  function currentPage(){try{const p=new URLSearchParams(location.search).get('page');return valid.has(p)?p:'loginSection'}catch(e){return 'loginSection'}}
  function currentCourse(){try{return new URLSearchParams(location.search).get('course')||''}catch(e){return ''}}
  function writeUrl(page,course,replace){const u=new URL(location.href);u.searchParams.set('page',page);if(page==='courseSection'&&course)u.searchParams.set('course',course);else u.searchParams.delete('course');try{(replace?history.replaceState:history.pushState).call(history,{page,course:course||''},'',u.pathname+'?'+u.searchParams.toString())}catch(e){}}
  function hideAll(){['homeHero','homeMain'].forEach(id=>{const e=document.getElementById(id);if(e)e.classList.add('hidden')});pages.forEach(id=>{const e=document.getElementById(id);if(e)e.classList.add('hidden')})}
  function addHome(){const s=document.getElementById('accountSection');if(!s)return;const card=s.querySelector('.card');if(!card||card.querySelector('.dhiraj-home-v9'))return;const b=document.createElement('button');b.type='button';b.className='blue dhiraj-home-v9';b.textContent='← Home';b.style.marginBottom='16px';b.onclick=function(){writeUrl('loginSection','',false);render('loginSection')};card.insertBefore(b,card.firstChild)}
  function noLoginBack(){const s=document.getElementById('loginSection');if(!s)return;s.querySelectorAll('button').forEach(b=>{const t=(b.textContent||'').trim().toLowerCase();if(t.includes('back')||t.startsWith('←'))b.remove()})}
  function render(page){hideAll();if(page==='accountSection'){document.getElementById('accountSection')?.classList.remove('hidden');const e=document.getElementById('accountEmail');if(e&&window.currentUser)e.textContent=window.currentUser.email||'';addHome()}else if(page==='courseSection'){document.getElementById('courseSection')?.classList.remove('hidden');const h=document.getElementById('courseHeading'),c=currentCourse();if(h&&c)h.textContent=c}else{document.getElementById(page)?.classList.remove('hidden')}noLoginBack();window.scrollTo(0,0)}
  function patch(){
    if(typeof window.show==='function'&&!window.__showV9){const old=window.show;window.show=function(id){old(id);writeUrl(id,'',false);render(id)};window.__showV9=true}
    if(typeof window.home==='function'&&!window.__homeV9){const old=window.home;window.home=function(){old();writeUrl('loginSection','',false);render('loginSection')};window.__homeV9=true}
    if(typeof window.openCourse==='function'&&!window.__courseV9){const old=window.openCourse;window.openCourse=function(name){old(name);writeUrl('courseSection',name,false);render('courseSection')};window.__courseV9=true}
  }
  function start(){patch();render(currentPage())}
  window.addEventListener('popstate',function(){patch();render(currentPage())});
  window.addEventListener('pageshow',function(){setTimeout(function(){patch();render(currentPage())},100)});
  setTimeout(start,400);
})();
