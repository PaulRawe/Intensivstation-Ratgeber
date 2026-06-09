// Fixed Download Button & zentrale Verkaufssteuerung
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var isDownloadPage = window.location.pathname.endsWith('/download.html');

    // Verkaufsboxen auf Nicht-Download-Seiten ausblenden
    var salesSelectors = [
      '#sidebar-downloads',
      '.sidebar-download',
      '.sidebar-box.sidebar-download',
      '.sidebar-box.download',
      '.download-box',
      '.download-offer'
    ];
    document.querySelectorAll(salesSelectors.join(',')).forEach(function(el) {
      if (!isDownloadPage) {
        el.style.display = 'none';
      }
    });

    // Auf der Download-Seite keinen Button anzeigen
    if (isDownloadPage) {
      return;
    }

    // Alten Sticky-Sales-Button ausblenden
    var oldSticky = document.querySelector('.sticky-sales-button');
    if (oldSticky) {
      oldSticky.style.display = 'none';
    }

    // Neuen fixen Button erstellen
    var fixedBtn = document.createElement('a');
    fixedBtn.href = '/download.html';
    fixedBtn.className = 'fixed-download-button';
    fixedBtn.innerHTML = '<strong>Zu den Download-Ratgebern</strong><span>PDF-Ratgeber für Angehörige &amp; Patienten</span>';
    document.body.appendChild(fixedBtn);

    // Erst nach 20% Scroll anzeigen
    function toggleButton() {
      var scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent > 0.2) {
        fixedBtn.classList.add('visible');
      } else {
        fixedBtn.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', toggleButton);
  });
})();
