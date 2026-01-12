// Fixed Download Button & zentrale Verkaufssteuerung
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    const isDownloadPage = window.location.pathname.endsWith('/download.html');

    /* ===================================
       1) VERKAUFSBOXEN ZENTRAL STEUERN
       =================================== */

    // Alles, was wie eine Download-Verkaufsbox aussieht
    const salesSelectors = [
      '#sidebar-downloads',
      '.sidebar-download',
      '.sidebar-box.sidebar-download',
      '.sidebar-box.download',
      '.download-box',
      '.download-offer'
    ];

    document.querySelectorAll(salesSelectors.join(',')).forEach(el => {
      if (!isDownloadPage) {
        el.style.display = 'none';
      }
    });

    /* ===================================
       2) FIXER DOWNLOAD-BUTTON
       =================================== */

    // Auf der Download-Seite keinen Button anzeigen
    if (isDownloadPage) {
      return;
    }

    // Alten Sticky-Sales-Button ausblenden
    const oldSticky = document.querySelector('.sticky-sales-button');
    if (oldSticky) {
      oldSticky.style.display = 'none';
    }

    // Neuen fixen Button erstellen
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
