// Fixed Download Button – dezent & ruhig
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // Auf der Download-Seite keinen Button anzeigen
    if (window.location.pathname.endsWith('/download.html')) {
      return;
    }

    // Alten Sticky-Sales-Button ausblenden (falls vorhanden)
    const oldSticky = document.querySelector('.sticky-sales-button');
    if (oldSticky) {
      oldSticky.style.display = 'none';
    }

    // Fixen Button erstellen
    const fixedBtn = document.createElement('a');
    fixedBtn.href = '/download.html';
    fixedBtn.className = 'fixed-download-button';
    fixedBtn.innerHTML = `
      <strong>Zu den Download-Ratgebern</strong>
      <span>PDF-Ratgeber für Angehörige & Patienten</span>
    `;

    document.body.appendChild(fixedBtn);

    // Erst nach 20 % Scroll anzeigen
    function toggleButton() {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

      if (scrollPercent > 0.2) {
        fixedBtn.classList.add('visible');
      } else {
        fixedBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleButton);
  });

})();
