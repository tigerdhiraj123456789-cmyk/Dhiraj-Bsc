/* Dhiraj B.Sc: initial screen + session behavior */
(function () {
  function startScreen() {
    // Give Supabase a moment to restore the saved session.
    setTimeout(function () {
      if (typeof currentUser !== 'undefined' && currentUser) {
        // Logged-in users always start/stay on Home after refresh.
        if (typeof home === 'function') home();
      } else if (typeof show === 'function') {
        // Logged-out visitors see Student Login first.
        show('loginSection');
      }
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startScreen);
  } else {
    startScreen();
  }
})();
