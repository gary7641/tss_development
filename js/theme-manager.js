// ====================== Theme Manager ======================
class ThemeManager {
  constructor() {
    this.currentMode = localStorage.getItem('mode') || 'light';
    this.currentElement = localStorage.getItem('element') || 'wood';
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-mode', this.currentMode);
    document.documentElement.setAttribute('data-theme', this.currentElement);
    
    // Theme Switch
    const switchBtn = document.getElementById('theme-switch');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => this.toggleMode());
    }

    // Magic Orb Click
    document.querySelectorAll('.magic-orb').forEach(orb => {
      orb.addEventListener('click', () => {
        this.showThemeSelector();
      });
    });
  }

  toggleMode() {
    this.currentMode = this.currentMode === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-mode', this.currentMode);
    localStorage.setItem('mode', this.currentMode);
  }

  setElement(element) {
    this.currentElement = element;
    document.documentElement.setAttribute('data-theme', element);
    localStorage.setItem('element', element);
    console.log(`Theme changed to ${element} ${this.currentMode}`);
  }

  showThemeSelector() {
    // 可以彈 modal 或 dropdown 顯示 10 個 orb
    alert("Theme Selector (Magic Orbs) - Light/Dark + 金木水火土\n\n開發中...");
    // 之後可以擴展成 modal
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});
