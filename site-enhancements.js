/* Dhiraj B.Sc navigation fix
   - First visit opens Student Login.
   - Refresh keeps the page currently open in this tab.
   - My Account has a Home button.
   - Login has NO back button.
   - Course/Admin/Signup are also restored after refresh.
   - No # hash is used.
*/
(function () {
  if (window.__dhirajNavigationLoaded) return;
  window.__dhirajNavigationLoaded = true;

  var KEY = 'dhiraj_bsc_current_page_v2';
  var TITLE_KEY = 'dhiraj_bsc_course_title_v2';
  var pages = ['loginSection','signupSection','accountSection','courseSection','adminSection'];
  var restoring = true;

  function getPage() {
    try { return sessionStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setPage(page) {
    try { sessionStorage.setItem(KEY, page); } catch (e) {}
  }
  function getTitle() {
    try { return sessionStorage.getItem(TITLE_KEY) || 'Course'; } catch (e) { return 'Course'; }
  }
  function setTitle(title) {
    try { sessionStorage.setItem(TITLE_KEY, title); } catch (e) {}
  }

  function hideAll() {
    var hero = document.getElementById('homeHero');
    var main = document.getElementById('homeMain');
    if (hero) hero.classList.add('hidden');
    if (main) main.classList.add('hidden');
    pages.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }

  function showPage(page, save) {
    if (page === 'home') {
      var hero = document.getElementById('homeHero');
      var main = document.getElementById('homeMain');
      pages.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });
      if (hero) hero.classList.remove('hidden');
      if (main) main.classList.remove('hidden');
      if (save) setPage('home');
      window.scrollTo(0, 0);
      return;
    }
    hideAll();
    var el = document.getElementById(page);
    if (el) el.classList.remove('hidden');
    if (save) setPage(page);
    window.scrollTo(0, 0);
  }

  function addAccountHomeButton() {
    var section = document.getElementById('accountSection');
    if (!section || section.querySelector('.dhiraj-home-btn')) return;
    var card = section.querySelector('.card');
    if (!card) return;
    var btn = document.createElement('button');
    btn.className = 'blue dhiraj-home-btn';
    btn.textContent = '← Home';
    btn.style.marginBottom = '16px';
    btn.onclick = function () { showPage('home', true); };
    card.insertBefore(btn, card.firstChild);
  }

  function removeLoginBackButtons() {
    var login = document.getElementById('loginSection');
    if (!login) return;
    Array.prototype.slice.call(login.querySelectorAll('button')).forEach(function (btn) {
      if (/back|←/i.test((btn.textContent || '').trim())) btn.remove();
    });
  }

  function patchFunctions() {
    if (typeof window.show === 'function' && !window.__dhirajShowPatched) {
      var oldShow = window.show;
      window.show = function (id) {
        oldShow(id);
        showPage(id, true);
        addAccountHomeButton();
        removeLoginBackButtons();
      };
      window.__dhirajShowPatched = true;
    }

    if (typeof window.home === 'function' && !window.__dhirajHomePatched) {
      var oldHome = window.home;
      window.home = function () {
        oldHome();
        showPage('home', true);
      };
      window.__dhirajHomePatched = true;
    }

    if (typeof window.openCourse === 'function' && !window.__dhirajCoursePatched) {
      var oldCourse = window.openCourse;
      window.openCourse = function (name) {
        setTitle(name);
        oldCourse(name);
        showPage('courseSection', true);
      };
      window.__dhirajCoursePatched = true;
    }
  }

  function restore() {
    patchFunctions();
    addAccountHomeButton();
    removeLoginBackButtons();

    var saved = getPage();
    if (!saved) {
      // Required first-open behavior: website opens at Student Login.
      showPage('loginSection', true);
      restoring = false;
      return;
    }

    if (saved === 'courseSection') {
      var heading = document.getElementById('courseHeading');
      if (heading) heading.textContent = getTitle();
    }
    showPage(saved, false);
    addAccountHomeButton();
    removeLoginBackButtons();
    restoring = false;
  }

  // Browser/phone back button: return to previous in-app page without adding hashes.
  window.addEventListener('popstate', function () {
    var saved = getPage() || 'loginSection';
    showPage(saved, false);
  });

  // Make refresh-safe state available before/after the original page script finishes.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(restore, 0); });
  } else {
    setTimeout(restore, 0);
  }
})();
