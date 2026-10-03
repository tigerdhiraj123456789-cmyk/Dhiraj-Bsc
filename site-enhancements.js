/* Dhiraj B.Sc: initial screen + session behavior + home portrait */
(function () {
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
    var style = document.createElement('style');
    style.textContent = '#homeHero{background:#05070b!important;min-height:520px;position:relative;overflow:hidden}#homeHero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 78% 50%,rgba(9,105,215,.18),transparent 38%);pointer-events:none}.hero>div:first-child{position:relative;z-index:2}.hero-img{position:relative;z-index:2!important;width:min(44vw,480px);height:520px;padding:0!important;background:transparent!important;border-radius:24px!important;overflow:hidden;display:flex!important;align-items:flex-end;justify-content:center;box-shadow:0 0 45px rgba(9,105,215,.22)}#dhirajHomePortrait{width:100%;height:100%;object-fit:cover;object-position:center 18%;display:block;filter:saturate(1.03) contrast(1.04);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,#000 8%,#000 92%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0%,#000 8%,#000 92%,transparent 100%)}@media(max-width:800px){#homeHero{min-height:auto}.hero-img{width:min(88vw,420px);height:500px;margin-top:10px}}@media(max-width:500px){.hero-img{height:430px;width:92vw}}';
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { startScreen(); addHomePortrait(); });
  } else {
    startScreen();
    addHomePortrait();
  }
})();
