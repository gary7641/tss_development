// Theme Manager
const themes = ['gold', 'wood', 'water', 'fire', 'earth'];

function switchTheme(mode, element) {
  document.documentElement.setAttribute('data-mode', mode);
  document.documentElement.setAttribute('data-theme', element);
  localStorage.setItem('theme', element);
}

// User Menu with Magic Orbs
// ... (可擴展)
