/* Dhiraj B.Sc navigation fix */
(function(){
'use strict';
if(window.__DHIRAJ_NAV_FIX__)return;window.__DHIRAJ_NAV_FIX__=true;
const pages=['loginSection','signupSection','accountSection','courseSection','adminSection'];
const $=id=>document.getElementById(id);
function page(){try{const p=new URLSearchParams(location.search).get('page');return pages.includes(p)?p:'home'}catch(e){return'home'}}
function setPage(p,c,replace){const u=new URL(location.href);if(p==='home')u.searchParams.delete('page');else u.searchParams.set('page',p);if(p==='courseSection'&&c)u.searchParams.set('course',c);else u.searchParams.delete('course');const url=u.pathname+(u.search?'?'+u.searchParams.toString():'');if(replace)history.replaceState({page:p,course:c||''},'',url);else history.pushState({page:p,course:c||''},'',url)}
function patch(){
 if(typeof window.home==='function'&&!window.__NAV_HOME__){const old=window.home;window.home=function(){old();setPage('home','')};window.__NAV_HOME__=true}
 if(typeof window.show==='function'&&!window.__NAV_SHOW__){const old=window.show;window.show=function(id){old(id);setPage(id,'');if(id==='accountSection')addAccountHome()};window.__NAV_SHOW__=true}
 if(typeof window.openCourse==='function'&&!window.__NAV_COURSE__){const old=window.openCourse;window.openCourse=function(n){old(n);setPage('courseSection',n)};window.__NAV_COURSE__=true}
 if(typeof window.login==='function'&&!window.__NAV_LOGIN__){const old=window.login;window.login=async function(){await old();setTimeout(function(){const a=$('headerActions');if(a&&/My Account/i.test(a.textContent||'')){setPage('home','');if(typeof window.home==='function')window.home()}},700)};window.__NAV_LOGIN__=true}
}
function addAccountHome(){const card=$('accountSection')?.querySelector('.card');if(!card||card.querySelector('.dhirajNavHome'))return;const b=document.createElement('button');b.className='blue dhirajNavHome';b.textContent='← Home';b.style.marginBottom='16px';b.onclick=function(){setPage('home','');if(typeof window.home==='function')window.home()};card.insertBefore(b,card.firstChild)}
function restore(){
 const p=page();
 if(p==='home'){
   // An explicit ?page=home means the user is already on Home.
   // Do not check window.currentUser here because currentUser is a
   // top-level let in index.html and is not exposed as window.currentUser.
   if(typeof window.home==='function')window.home();
   return;
 }
 if(p==='accountSection')addAccountHome();
 if(p==='courseSection'){const q=new URLSearchParams(location.search).get('course');if(q&&$('courseHeading'))$('courseHeading').textContent=q}
 if(typeof window.show==='function')window.show(p)
}
function start(){restore();setTimeout(patch,50)}
addEventListener('pageshow',function(){setTimeout(function(){restore();patch()},700)});
addEventListener('popstate',function(){restore();patch()});
setTimeout(start,500);
})();