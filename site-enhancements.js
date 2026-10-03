/* Dhiraj B.Sc: screen behavior, home portrait, and Admin-controlled courses */
(function () {
  var DEFAULT_COURSES = [
    { id: 'course-1', title: 'B.Sc 1st Semester', description: 'Anatomy • Physiology • Psychology', icon: '🫀', visible: true }
  ];
  var courses = [];
  var wrapperReady = false;

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function normalize(list) {
    if (!Array.isArray(list)) return DEFAULT_COURSES.slice();
    var out = list.filter(function (x) { return x && x.title; }).map(function (x, i) {
      return {
        id: String(x.id || ('course-' + Date.now() + '-' + i)),
        title: String(x.title),
        description: String(x.description || ''),
        icon: String(x.icon || '📚'),
        visible: x.visible !== false
      };
    });
    return out.length ? out : DEFAULT_COURSES.slice();
  }

  function hideStaticGrid() {
    var grid = document.querySelector('#courses .grid');
    if (grid) grid.style.visibility = 'hidden';
  }

  function renderCourses() {
    var grid = document.querySelector('#courses .grid');
    if (!grid) return;
    grid.innerHTML = '';
    courses.filter(function (c) { return c.visible !== false; }).forEach(function (c) {
      var card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = '<div class="course-icon">' + esc(c.icon) + '</div>' +
        '<h3>' + esc(c.title) + '</h3>' +
        '<p>' + esc(c.description) + '</p>' +
        '<button class="blue" type="button">Open Course</button>';
      card.querySelector('button').addEventListener('click', function () {
        if (typeof window.openCourse === 'function') window.openCourse(c.title);
      });
      grid.appendChild(card);
    });
    if (!grid.children.length) {
      var empty = document.createElement('div');
      empty.className = 'card';
      empty.innerHTML = '<h3>No courses available</h3><p class="muted">Admin ne abhi koi course show nahi kiya hai.</p>';
      grid.appendChild(empty);
    }
    grid.style.visibility = 'visible';
  }

  async function loadCourses() {
    courses = DEFAULT_COURSES.slice();
    try {
      var savedLocal = localStorage.getItem('dhiraj_bsc_courses');
      if (savedLocal) courses = normalize(JSON.parse(savedLocal));
    } catch (e) {}
    try {
      if (typeof sb === 'undefined') return renderCourses();
      var r = await sb.from('site_content').select('courses').eq('id', 1).maybeSingle();
      if (!r.error && r.data && r.data.courses) {
        courses = normalize(r.data.courses);
        try { localStorage.setItem('dhiraj_bsc_courses', JSON.stringify(courses)); } catch (e) {}
      }
    } catch (e) {}
    renderCourses();
  }

  function ensureStyles() {
    if (document.getElementById('courseManagerStyles')) return;
    var s = document.createElement('style');
    s.id = 'courseManagerStyles';
    s.textContent = '#courses .grid{min-height:20px}.course-manager{margin-top:28px;padding:20px;background:#f7faff;border:1px solid #dce7f5;border-radius:16px}.course-manager-list{display:grid;gap:12px;margin:15px 0}.course-admin-row{background:#fff;border:1px solid #dce4ef;border-radius:12px;padding:14px}.course-admin-row-top{display:flex;align-items:center;gap:10px}.course-admin-icon{font-size:28px;width:42px;text-align:center}.course-admin-title{font-weight:700;flex:1}.course-admin-actions{display:flex;gap:7px;flex-wrap:wrap}.course-admin-actions button{padding:8px 11px}.course-manager-form{display:grid;grid-template-columns:80px 1fr 1.5fr auto;gap:10px;align-items:end;margin-top:15px}.course-manager-form input{margin:0}.course-manager-note{font-size:13px;color:#6b7890}@media(max-width:700px){.course-manager-form{grid-template-columns:1fr}.course-admin-row-top{align-items:flex-start}.course-admin-actions{margin-top:10px}}';
    document.head.appendChild(s);
  }

  function getManagerHost() {
    var dashboard = document.querySelector('#adminSection .dashboard');
    if (!dashboard) return null;
    var host = document.getElementById('courseManager');
    if (!host) {
      host = document.createElement('section');
      host.id = 'courseManager';
      host.className = 'course-manager';
      dashboard.appendChild(host);
    }
    return host;
  }

  function renderManager() {
    var host = getManagerHost();
    if (!host) return;
    host.innerHTML = '<h3>📚 Course Control</h3>' +
      '<p class="course-manager-note">Home page par wahi courses dikhenge jo <b>Show</b> hain. Delete ki jagah Hide rakha gaya hai, taaki baad me wapas la sako.</p>' +
      '<div class="course-manager-list" id="courseManagerList"></div>' +
      '<div class="course-manager-form">' +
      '<div><label>Icon</label><input id="newCourseIcon" maxlength="4" placeholder="📚"></div>' +
      '<div><label>Course name</label><input id="newCourseTitle" placeholder="B.Sc 2nd Semester"></div>' +
      '<div><label>Subjects / details</label><input id="newCourseDesc" placeholder="Biochemistry • Nutrition • Nursing"></div>' +
      '<button class="blue" type="button" id="addCourseBtn">＋ Add Course</button>' +
      '</div>' +
      '<div style="margin-top:14px"><button class="blue" type="button" id="saveCoursesBtn">💾 Save Courses</button> <span id="courseSaveMsg" class="muted"></span></div>';

    var list = host.querySelector('#courseManagerList');
    courses.forEach(function (c, i) {
      var row = document.createElement('div');
      row.className = 'course-admin-row';
      row.innerHTML = '<div class="course-admin-row-top"><div class="course-admin-icon">' + esc(c.icon) + '</div>' +
        '<div class="course-admin-title">' + esc(c.title) + '<div class="course-manager-note">' + esc(c.description) + '</div></div>' +
        '<div class="course-admin-actions"><button class="white" type="button" data-edit="' + i + '">✏️ Edit</button>' +
        '<button class="' + (c.visible ? 'yellow' : 'blue') + '" type="button" data-toggle="' + i + '">' + (c.visible ? '🙈 Hide' : '👁️ Show') + '</button>' +
        '<button class="danger" type="button" data-delete="' + i + '">🗑️ Delete</button></div></div>';
      list.appendChild(row);
    });

    host.querySelector('#addCourseBtn').addEventListener('click', function () {
      var title = host.querySelector('#newCourseTitle').value.trim();
      var desc = host.querySelector('#newCourseDesc').value.trim();
      var icon = host.querySelector('#newCourseIcon').value.trim() || '📚';
      if (!title) return alert('Course name bhariye.');
      courses.push({ id: 'course-' + Date.now(), title: title, description: desc, icon: icon, visible: true });
      renderManager();
    });

    host.querySelectorAll('[data-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-edit')), c = courses[i];
        var title = prompt('Course name:', c.title);
        if (title === null) return;
        title = title.trim();
        if (!title) return alert('Course name khali nahi ho sakta.');
        var desc = prompt('Subjects / details:', c.description || '');
        if (desc === null) return;
        var icon = prompt('Course icon:', c.icon || '📚');
        if (icon === null) return;
        courses[i] = { id: c.id, title: title, description: desc.trim(), icon: icon.trim() || '📚', visible: c.visible !== false };
        renderManager();
      });
    });

    host.querySelectorAll('[data-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-toggle'));
        courses[i].visible = !courses[i].visible;
        renderManager();
      });
    });

    host.querySelectorAll('[data-delete]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var i = Number(btn.getAttribute('data-delete'));
        if (!confirm('Is course ko remove karna hai? Baad me Add Course se dobara add kar sakte ho.')) return;
        courses.splice(i, 1);
        renderManager();
      });
    });

    host.querySelector('#saveCoursesBtn').addEventListener('click', saveCourses);
  }

  async function saveCourses() {
    if (typeof sb === 'undefined' || !currentUser || !currentProfile || currentProfile.role !== 'admin') {
      return alert('Admin permission nahi hai.');
    }
    var clean = courses.map(function (c, i) {
      return { id: String(c.id || ('course-' + i)), title: String(c.title).trim(), description: String(c.description || '').trim(), icon: String(c.icon || '📚').trim(), visible: c.visible !== false };
    }).filter(function (c) { return c.title; });
    if (!clean.length) return alert('Kam se kam 1 course rakhiye.');
    try { localStorage.setItem('dhiraj_bsc_courses', JSON.stringify(clean)); } catch (e) {}
    var r = await sb.from('site_content').upsert({ id: 1, courses: clean }, { onConflict: 'id' });
    var msg = document.getElementById('courseSaveMsg');
    if (r.error) {
      if (String(r.error.message || '').toLowerCase().indexOf('courses') !== -1) {
        courses = clean;
        renderCourses();
        if (msg) { msg.textContent = 'Saved on this device ✓ (Supabase column pending)'; setTimeout(function () { msg.textContent = ''; }, 3500); }
        return;
      }
      return alert(r.error.message);
    }
    courses = clean;
    renderCourses();
    if (msg) { msg.textContent = 'Saved ✓'; setTimeout(function () { msg.textContent = ''; }, 2500); }
  }

  function patchAdminFunctions() {
    if (wrapperReady || typeof window.loadAdmin !== 'function' || typeof window.saveAdminContent !== 'function') return;
    wrapperReady = true;
    var originalLoadAdmin = window.loadAdmin;
    var originalSaveAdmin = window.saveAdminContent;
    window.loadAdmin = async function () {
      await originalLoadAdmin();
      if (currentProfile && currentProfile.role === 'admin') {
        try {
          var r = await sb.from('site_content').select('courses').eq('id', 1).maybeSingle();
          if (!r.error && r.data && r.data.courses) courses = normalize(r.data.courses);
        } catch (e) {}
        ensureStyles();
        renderManager();
      }
    };
    window.saveAdminContent = async function () {
      await originalSaveAdmin();
      if (currentProfile && currentProfile.role === 'admin') await saveCourses();
    };
  }

  function startScreen() {
    setTimeout(function () {
      if (typeof currentUser !== 'undefined' && currentUser) {
        if (typeof home === 'function') home();
      } else if (typeof show === 'function') {
        show('loginSection');
      }
    }, 800);
  }

  function addHomePortrait() {
    var hero = document.getElementById('homeHero');
    if (!hero || document.getElementById('dhirajHomePortrait')) return;
    var old = hero.querySelector('.hero-img');
    if (!old) return;
    old.innerHTML = '<img id="dhirajHomePortrait" src="dhiraj-home-photo.jpg" alt="Dhiraj B.Sc" loading="eager">';
    old.setAttribute('aria-label', 'Dhiraj B.Sc');
  }

  function boot() {
    ensureStyles();
    hideStaticGrid();
    addHomePortrait();
    patchAdminFunctions();
    loadCourses();
    startScreen();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
