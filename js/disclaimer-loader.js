document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    if (!header) {
        return;
    }

    // Disclaimer-Wrapper erstellen
    const wrapper = document.createElement('div');
    wrapper.className = 'medical-disclaimer-wrapper';

    const inner = document.createElement('div');
    inner.className = 'medical-disclaimer-inner';
    wrapper.appendChild(inner);

    // Direkt nach dem Header einfügen
    header.insertAdjacentElement('afterend', wrapper);

 // Auto-Scroll für Unterseiten zur Verkaufsbox unter dem Disclaimer
window.addEventListener('load', function () {
  const istIndexSeite =
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('/');

  if (!istIndexSeite) {
    const salesBox = document.getElementById('sales-banner-container');

    if (salesBox) {
      setTimeout(function () {
        salesBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
});
