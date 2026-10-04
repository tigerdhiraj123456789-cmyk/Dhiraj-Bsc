/* Dhiraj B.Sc - final navigation persistence */
(function(){
'use strict';
if(window.__DHIRAJ_FINAL_NAV__)return;
window.__DHIRAJ_FINAL_NAV__=true;
const KEY='dhiraj_current_page_v3';
const pages=['home','loginSection','signupSection','accountSection','courseSection','adminSection'];
let booting=true;
const $=id=>document.getElementById(id);
function read(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&pages.includes(x.page))return x;}catch(e){}return{page:'home',course:''};}
function save(page,course=''){try{localStorage.setItem(KEY,JSON.stringify({page,course}));}catch(e){}}
function addAccountHome(){const card=$('accountSection')?.querySelector('.card');if(!card||card.querySelector('.dhirajFinalHome'))return;const b=document.createElement('button');b.className='blue dhirajFinalHome';b.textContent='← Home';b.style.marginBottom='16px';b.onclick=()=>{save('home');if(typeof window.home==='function')window.home();};card.insertBefore(b,card.firstChild);}
function restore(){const x=read();if(x.page==='accountSection'){if($('accountEmail')&&window.currentUser)$('accountEmail').textContent=window.currentUser.email||'';addAccountHome();}else if(x.page==='courseSection'&&x.course&&$('courseHeading'))$('courseHeading').textContent=x.course;if(x.page!=='home'&&typeof window.show==='function')window.show(x.page);}
function patch(){
 if(typeof window.show==='function'&&!window.__DHIRAJ_SHOW_V3__){const old=window.show;window.show=function(id){save(id,id==='courseSection'?($('courseHeading')?.textContent||''):'');old(id);if(id==='accountSection')addAccountHome();};window.__DHIRAJ_SHOW_V3__=true;}
 if(typeof window.openCourse==='function'&&!window.__DHIRAJ_COURSE_V3__){const old=window.openCourse;window.openCourse=function(name){save('courseSection',name);old(name);};window.__DHIRAJ_COURSE_V3__=true;}
 if(typeof window.home==='function'&&!window.__DHIRAJ_HOME_V3__){const old=window.home;window.home=function(){const wanted=read().page;if(booting&&wanted!=='home'){return;}save('home');old();};window.__DHIRAJ_HOME_V3__=true;}
 if(typeof window.login==='function'&&!window.__DHIRAJ_LOGIN_V3__){const old=window.login;window.login=async function(){await old();save('home');};window.__DHIRAJ_LOGIN_V3__=true;}
}
function boot(){patch();restore();setTimeout(()=>{booting=false;patch();restore();},3500);}
window.addEventListener('pageshow',()=>{setTimeout(()=>{patch();restore();},1200);});
setTimeout(boot,400);
})();