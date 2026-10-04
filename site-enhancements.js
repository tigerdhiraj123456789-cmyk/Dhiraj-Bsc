/* Dhiraj B.Sc - navigation persistence + course control */
(function(){
'use strict';
if(window.__DHIRAJ_NAV_V4__) return;
window.__DHIRAJ_NAV_V4__=true;
const pages=['loginSection','signupSection','accountSection','courseSection','adminSection'];
const COURSE_KEY='dhiraj_courses_v4';
const defaults=[
{name:'B.Sc 1st Semester',subjects:'Anatomy • Physiology • Psychology',icon:'🫀',visible:true},
{name:'B.Sc 2nd Semester',subjects:'Biochemistry • Nutrition • Nursing',icon:'🧬',visible:false},
{name:'B.Sc 3rd Semester',subjects:'Microbiology • Pathology • Pharmacology',icon:'🦠',visible:false},
{name:'B.Sc 4th Semester',subjects:'Advanced Nursing & Medical Subjects',icon:'👥',visible:false},
{name:'B.Sc 5th Semester',subjects:'Advanced Clinical Studies',icon:'🧠',visible:false},
{name:'B.Sc 6th Semester',subjects:'Final Semester Complete Preparation',icon:'💊',visible:false}];
const $=id=>document.getElementById(id);
let restoring=false;
function readCourses(){try{const x=JSON.parse(localStorage.getItem(COURSE_KEY));return Array.isArray(x)&&x.length===6?x:defaults.map(x=>({...x}));}catch(e){return defaults.map(x=>({...x}));}}
function saveCoursesLocal(c){try{localStorage.setItem(COURSE_KEY,JSON.stringify(c));}catch(e){}}
function applyCourses(c){document.querySelectorAll('#courses .grid>.card').forEach((card,i)=>{const x=c[i];if(!x)return;card.style.display=x.visible?'':'none';const h=card.querySelector('h3'),p=card.querySelector('p'),ic=card.querySelector('.course-icon');if(h)h.textContent=x.name;if(p)p.textContent=x.subjects;if(ic)ic.textContent=x.icon;});}
async function loadCourses(){let c=readCourses();try{if(typeof sb!=='undefined'){const r=await sb.from('site_content').select('courses').eq('id',1).maybeSingle();if(r.data&&Array.isArray(r.data.courses)&&r.data.courses.length===6){c=r.data.courses;saveCoursesLocal(c);}}}catch(e){}applyCourses(c);}
function getPage(){try{const p=new URLSearchParams(location.search).get('page');return pages.includes(p)?p:'home';}catch(e){return'home';}}
function getCourse(){try{return new URLSearchParams(location.search).get('course')||'';}catch(e){return'';}}
function setPage(page,course,replace){const u=new URL(location.href);if(page==='home'){u.searchParams.delete('page');u.searchParams.delete('course');}else{u.searchParams.set('page',page);if(page==='courseSection'&&course)u.searchParams.set('course',course);else u.searchParams.delete('course');}history[replace?'replaceState':'pushState']({page,course:course||''},'',u.pathname+(u.searchParams.toString()?'?'+u.searchParams.toString():''));}
function directRender(page){
 const hero=$('homeHero'),main=$('homeMain');
 if(page==='home'){hero?.classList.remove('hidden');main?.classList.remove('hidden');pages.forEach(id=>$(id)?.classList.add('hidden'));return;}
 hero?.classList.add('hidden');main?.classList.add('hidden');pages.forEach(id=>$(id)?.classList.add('hidden'));$(page)?.classList.remove('hidden');
 if(page==='accountSection'){const e=$('accountEmail');if(e&&typeof currentUser!=='undefined'&&currentUser)e.textContent=currentUser.email||'';const card=$('accountSection')?.querySelector('.card');if(card&&!card.querySelector('.dhirajHomeBtn')){const b=document.createElement('button');b.className='blue dhirajHomeBtn';b.textContent='← Home';b.style.marginBottom='16px';b.onclick=()=>{setPage('home','',false);directRender('home');};card.insertBefore(b,card.firstChild);}}
 if(page==='courseSection'){const h=$('courseHeading'),c=getCourse();if(h&&c)h.textContent=c;}
 window.scrollTo(0,0);
}
function restoreRequestedPage(){const wanted=getPage();if(wanted==='home')return;restoring=true;directRender(wanted);restoring=false;}
function patchNavigation(){
 if(typeof window.show==='function'&&!window.__DHIRAJ_SHOW_V4__){const original=window.show;window.show=function(id){original(id);if(!restoring){setPage(id,'',false);}};window.__DHIRAJ_SHOW_V4__=true;}
 if(typeof window.home==='function'&&!window.__DHIRAJ_HOME_V4__){const original=window.home;window.home=function(){const wanted=getPage();original();if(!restoring&&wanted!=='home'){setTimeout(()=>restoreRequestedPage(),20);}else if(!restoring){setPage('home','',false);}};window.__DHIRAJ_HOME_V4__=true;}
 if(typeof window.openCourse==='function'&&!window.__DHIRAJ_COURSE_V4__){const original=window.openCourse;window.openCourse=function(name){original(name);if(!restoring)setPage('courseSection',name,false);};window.__DHIRAJ_COURSE_V4__=true;}
}
function addCourseControl(){const d=document.querySelector('#adminSection .dashboard');if(!d||d.querySelector('.dhirajCourseControl'))return;const box=document.createElement('div');box.className='dhirajCourseControl';box.style.marginTop='28px';box.innerHTML='<hr style="margin:25px 0;border:0;border-top:1px solid #ddd"><h3>📚 Course Control</h3><p class="small muted">1st Semester abhi visible hai. Baaki semesters ko yahin se Show/Hide kar sakte hain.</p><div id="dhirajCourseRows"></div><button class="blue" id="dhirajSaveCourses">💾 Save Courses</button> <span id="dhirajCourseMsg" class="muted"></span>';d.appendChild(box);drawCourseRows();$('dhirajSaveCourses').onclick=saveCourseControl;}
function drawCourseRows(){const w=$('dhirajCourseRows');if(!w)return;w.innerHTML='';readCourses().forEach((x,i)=>{const r=document.createElement('div');r.style.cssText='border:1px solid #dbe2ed;border-radius:12px;padding:12px;margin:8px 0;background:#fafcff';r.innerHTML='<label><input type="checkbox" data-show="'+i+'" '+(x.visible?'checked':'')+' style="width:auto;margin-right:7px"> Show on Home</label><input data-name="'+i+'" value="'+String(x.name).replace(/"/g,'&quot;')+'" placeholder="Course name"><input data-sub="'+i+'" value="'+String(x.subjects).replace(/"/g,'&quot;')+'" placeholder="Subjects"><input data-icon="'+i+'" value="'+String(x.icon).replace(/"/g,'&quot;')+'" placeholder="Icon">';w.appendChild(r);});}
async function saveCourseControl(){const c=readCourses();c.forEach((x,i)=>{x.visible=!!document.querySelector('[data-show="'+i+'"]')?.checked;x.name=document.querySelector('[data-name="'+i+'"]')?.value.trim()||x.name;x.subjects=document.querySelector('[data-sub="'+i+'"]')?.value.trim()||x.subjects;x.icon=document.querySelector('[data-icon="'+i+'"]')?.value.trim()||x.icon;});saveCoursesLocal(c);applyCourses(c);try{if(typeof sb!=='undefined'){const r=await sb.from('site_content').upsert({id:1,courses:c},{onConflict:'id'});if(r.error)throw r.error;}}catch(e){alert('Course save error: '+(e.message||e));return;}$('dhirajCourseMsg').textContent='Saved ✓';setTimeout(()=>{$('dhirajCourseMsg').textContent='';},2000);}
function start(){
 patchNavigation();
 loadCourses();
 addCourseControl();
 restoreRequestedPage();
 [1000,2000,3500,5000].forEach(ms=>setTimeout(()=>{patchNavigation();restoreRequestedPage();addCourseControl();},ms));
 window.addEventListener('popstate',()=>{patchNavigation();restoreRequestedPage();});
 window.addEventListener('pageshow',()=>[300,1200,2500].forEach(ms=>setTimeout(()=>{patchNavigation();restoreRequestedPage();},ms)));
}
setTimeout(start,700);
})();