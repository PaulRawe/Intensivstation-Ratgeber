(function () {

    const CONSENT_KEY = 'cookie_consent_status';

    function hasConsent() {
        return localStorage.getItem(CONSENT_KEY) === 'accepted';
    }

    function saveConsent(status) {
        localStorage.setItem(CONSENT_KEY, status);
    }

    function loadGoatCounter() {
        const s = document.createElement('script');
        s.src = 'https://gc.zgo.at/count.js';
        s.async = true;
        s.setAttribute('data-goatcounter', 'https://intensivstation-ratgeber.goatcounter.com/count');
        document.head.appendChild(s);
    }

    function loadGoogleAds() {
        const s = document.createElement('script');
        s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        s.async = true;
        s.crossOrigin = 'anonymous';
        document.head.appendChild(s);
    }

    function acceptCookies() {
        saveConsent('accepted');
        hideBanner();
        loadGoatCounter();
        // Google Ads NUR laden, wenn du sie wirklich aktivierst
        // loadGoogleAds();
    }

    function declineCookies() {
        saveConsent('declined');
        hideBanner();
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.style.display = 'none';
    }

    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) banner.style.display = 'block';
    }

    document.addEventListener('DOMContentLoaded', function () {

        if (hasConsent()) {
            loadGoatCounter();
            // loadGoogleAds(); // erst aktivieren, wenn Ads live gehen
        } else {
            showBanner();
        }

        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', declineCookies);
        }
    });

})();
