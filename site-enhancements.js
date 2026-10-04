/* Dhiraj B.Sc - simple page navigation
   No hash (#), no query string. Refresh keeps the current page in this tab.
*/
(function () {
  if (window.__dhirajNavigationLoaded) return;
  window.__dhirajNavigationLoaded = true;

  var KEY = 'dhiraj_bsc_current_page';
  var TITLE_KEY = 'dhiraj_bsc_course_title';
  var pages = ['loginSection', 'signupSection', 'accountSection', 'courseSection', 'adminSection'];
  var restoring = false;
  var originalShow = null;
  var originalHome = null;
  var originalOpenCourse = null;

  function safeGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) {}
  }

  function addHomeButton(id) {
    var section = document.getElementById(id);
    if (!section || id === 'adminSection') return;
    if (section.querySelector('.dhiraj-home-button')) return;

    var btn = document.createElement('button');
    btn.className = 'back dhiraj-home-button';
    btn.type = 'button';
    btn.textContent = '← Home';
    btn.onclick = function () { window.dhirajGoHome(); };
    section.insertBefore(btn, section.firstChild);
  }

  function addHomeButtons() {
    pages.forEach(addHomeButton);
  }

  function setHistory(page, replace) {
    try {
      var state = { dhirajPage: page };
      if (replace) history.replaceState(state, '', location.href.split('#')[0]);
      else history.pushState(state, '', location.href.split('#')[0]);
    } catch (e) {}
  }

  function remember(page) {
    safeSet(KEY, page);
  }

  function showPage(page, push) {
    if (!page || pages.indexOf(page) === -1) page = 'home';
    restoring = !push;
    remember(page);

    if (page === 'home') {
      originalHome();
    } else {
      originalShow(page);
    }

    addHomeButtons();
    if (push) setHistory(page, false);
    restoring = false;
  }

  window.dhirajGoHome = function () {
    showPage('home', true);
  };

  function patchNavigation() {
    if (typeof window.show !== 'function' || typeof window.home !== 'function') return false;

    originalShow = window.show;
    originalHome = window.home;
    originalOpenCourse = window.openCourse;

    window.show = function (id) {
      showPage(id, !restoring);
    };

    window.home = function () {
      showPage('home', !restoring);
    };

    if (typeof originalOpenCourse === 'function') {
      window.openCourse = function (name) {
        try { document.getElementById('courseHeading').textContent = name; } catch (e) {}
        safeSet(TITLE_KEY, name || 'Course');
        showPage('courseSection', !restoring);
      };
    }

    window.addEventListener('popstate', function (event) {
      var page = event.state && event.state.dhirajPage;
      if (!page) page = safeGet(KEY) || 'home';
      showPage(page, false);
      if (page === 'courseSection') {
        var title = safeGet(TITLE_KEY) || 'Course';
        var heading = document.getElementById('courseHeading');
        if (heading) heading.textContent = title;
      }
    });

    addHomeButtons();

    var saved = safeGet(KEY);
    if (saved && pages.indexOf(saved) !== -1) {
      setTimeout(function () {
        showPage(saved, false);
        if (saved === 'courseSection') {
          var title = safeGet(TITLE_KEY) || 'Course';
          var heading = document.getElementById('courseHeading');
          if (heading) heading.textContent = title;
        }
      }, 50);
    } else {
      safeSet(KEY, 'home');
      setHistory('home', true);
      setTimeout(function () { originalHome(); addHomeButtons(); }, 50);
    }

    return true;
  }

  function addPortrait() {
    var img = document.querySelector('.hero-img img');
    if (img) {
      img.src = 'dhiraj-home-photo.jpg?v=3';
      img.loading = 'eager';
    }
  }

  function boot() {
    addPortrait();
    addHomeButtons();

    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (patchNavigation() || tries > 40) clearInterval(timer);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();