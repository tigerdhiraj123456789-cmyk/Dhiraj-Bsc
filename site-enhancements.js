/* Dhiraj B.Sc - stable page persistence */
(function(){
'use strict';
if(window.__DHIRAJ_STABLE_NAV__) return;
window.__DHIRAJ_STABLE_NAV__=true;
const NAV_KEY='dhiraj_current_page_v1';
const $=id=>document.getElementById(id);
const pages=['loginSection','signupSection','accountSection','courseSection','adminSection'];
function savePage(page,course){try{localStorage.setItem(NAV_KEY,JSON.stringify({page:page||'home',course:course||''}));}catch(e){}}
function readPage(){try{const x=JSON.parse(localStorage.getItem(NAV_KEY));if(x&&(['home'].concat(pages)).includes(x.page))return x;}catch(e){}return{page:'home',course:''};}
function addHomeButton(){const card=$('accountSection')?.querySelector('.card');if(!card||card.querySelector('.dhirajStableHome'))return;const b=document.createElement('button');b.className='blue dhirajStableHome';b.textContent='← Home';b.style.marginBottom='16px';b.onclick=function(){savePage('home','');if(typeof window.home==='function')window.home();};card.insertBefore(b,card.firstChild);}
function restorePage(){const x=readPage();if(x.page==='home')return;if(x.page==='courseSection'&&$('courseHeading')&&x.course)$('courseHeading').textContent=x.course;if(x.page==='accountSection'&&$('accountEmail')&&window.currentUser)$('accountEmail').textContent=window.currentUser.email||'';if(typeof window.show==='function')window.show(x.page);if(x.page==='accountSection')addHomeButton();}
function patch(){if(typeof window.show==='function'&&!window.__DHIRAJ_SHOW_STABLE__){const old=window.show;window.show=function(id){old(id);savePage(id,id==='courseSection'?($('courseHeading')?.textContent||''):'');if(id==='accountSection')addHomeButton();};window.__DHIRAJ_SHOW_STABLE__=true;}if(typeof window.home==='function'&&!window.__DHIRAJ_HOME_STABLE__){const old=window.home;window.home=function(){old();savePage('home','');};window.__DHIRAJ_HOME_STABLE__=true;}if(typeof window.openCourse==='function'&&!window.__DHIRAJ_COURSE_STABLE__){const old=window.openCourse;window.openCourse=function(name){old(name);savePage('courseSection',name);};window.__DHIRAJ_COURSE_STABLE__=true;}}
function boot(){patch();setTimeout(function(){patch();restorePage();addHomeButton();},900);}
window.addEventListener('pageshow',function(){setTimeout(function(){patch();restorePage();addHomeButton();},900);});setTimeout(boot,300);
})();