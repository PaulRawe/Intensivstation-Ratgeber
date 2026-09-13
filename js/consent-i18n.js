/* =========================================================
   consent-i18n.js
   Cookie-Consent für die Sprachbereiche /tr/, /ru/, /pl/.

   BEWUSST NICHT ENTHALTEN (im Gegensatz zu js/cookie-consent.js):
     - Quick-Check-Funnel mit Produktempfehlungen
     - Gumroad-/Amazon-Links
     - deutschsprachige Suchfunktion
     - Auto-Scroll zum Sales-Banner

   Grund: js/cookie-consent.js aktiviert den Produkt-Funnel über
   path.includes('/fragen/'). Das würde auch auf Sprachseiten
   greifen. Die deutsche Datei bleibt unverändert; die
   Sprachversionen laden stattdessen ausschließlich diese Datei.

   GoatCounter wird hier NUR nach ausdrücklicher Zustimmung
   geladen (nicht wie in js/goatcounter-init.js beim Seitenaufruf).
   ========================================================= */
(function () {
    'use strict';

    var CONSENT_KEY = 'cookie_consent_status';

    function hasConsent() {
        try {
            return localStorage.getItem(CONSENT_KEY) === 'accepted';
        } catch (e) {
            return false;
        }
    }

    function saveConsent(status) {
        try {
            localStorage.setItem(CONSENT_KEY, status);
        } catch (e) {
            /* Private-Mode o. Ä. – Consent gilt dann nur für diese Sitzung */
        }
    }

    function loadGoatCounter() {
        if (document.querySelector('script[data-goatcounter]')) return;
        var s = document.createElement('script');
        s.src = 'https://gc.zgo.at/count.js';
        s.async = true;
        s.setAttribute(
            'data-goatcounter',
            'https://intensivstation-ratgeber.goatcounter.com/count'
        );
        document.head.appendChild(s);
    }

    function setBanner(show) {
        var banner = document.getElementById('cookie-banner');
        if (banner) banner.style.display = show ? 'block' : 'none';
    }

    function init() {
        if (hasConsent()) {
            loadGoatCounter();
            setBanner(false);
        } else {
            setBanner(true);
        }

        var accept = document.getElementById('cookie-accept');
        var decline = document.getElementById('cookie-decline');

        if (accept) {
            accept.addEventListener('click', function () {
                saveConsent('accepted');
                setBanner(false);
                loadGoatCounter();
            });
        }

        if (decline) {
            decline.addEventListener('click', function () {
                saveConsent('declined');
                setBanner(false);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
