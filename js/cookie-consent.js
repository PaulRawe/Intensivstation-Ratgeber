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

// ==========================================
// AUTOMATISCHE SUCHFUNKTION
// ==========================================

// Alle durchsuchbaren Fragen
const searchData = [
  // Erste Orientierung
  {title: "Was bedeutet Intensivstation überhaupt?", url: "fragen/was-bedeutet-intensivstation.html", category: "Erste Orientierung"},
  {title: "Wann darf ich meinen Angehörigen besuchen?", url: "fragen/wann-darf-ich-besuchen.html", category: "Erste Orientierung"},
  {title: "Wie sind die Besuchszeiten geregelt?", url: "fragen/besuchszeiten.html", category: "Erste Orientierung"},
  {title: "Wie viele Besucher dürfen gleichzeitig kommen?", url: "fragen/wieviele-besucher.html", category: "Erste Orientierung"},
  {title: "Was ziehe ich beim Besuch an?", url: "fragen/was-anziehen.html", category: "Erste Orientierung"},
  {title: "Darf ich Blumen mitbringen?", url: "fragen/blumen-mitbringen.html", category: "Erste Orientierung"},
  {title: "Kann ich auf der Intensivstation übernachten?", url: "fragen/uebernachten.html", category: "Erste Orientierung"},
  {title: "Wie lange bleibt man normalerweise auf der Intensivstation?", url: "fragen/wie-lange-intensivstation.html", category: "Erste Orientierung"},
  {title: "Wie bereite ich mich auf den ersten Besuch vor?", url: "fragen/wie-bereite-ich-mich-vor.html", category: "Erste Orientierung"},
  {title: "Darf ich mein Handy auf der Intensivstation benutzen?", url: "fragen/handy-auf-intensivstation.html", category: "Erste Orientierung"},
  {title: "Was bedeutet IMC (Intermediate Care)?", url: "fragen/was-ist-imc.html", category: "Erste Orientierung"},
  {title: "Wie finde ich die richtige Intensivstation im Krankenhaus?", url: "fragen/intensivstation-finden.html", category: "Erste Orientierung"},
  
  // Künstliches Koma
  {title: "Was ist ein künstliches Koma?", url: "fragen/was-ist-kuenstliches-koma.html", category: "Künstliches Koma"},
  {title: "Wie lange dauert ein künstliches Koma?", url: "fragen/wie-lange-kuenstliches-koma.html", category: "Künstliches Koma"},
  {title: "Wie gefährlich ist ein künstliches Koma?", url: "fragen/wie-gefaehrlich.html", category: "Künstliches Koma"},
  {title: "Wann wacht mein Angehöriger auf?", url: "fragen/wann-aufwachen.html", category: "Künstliches Koma"},
  {title: "Wie lange dauert die Aufwachphase?", url: "fragen/aufwachphase-dauer.html", category: "Künstliches Koma"},
  {title: "Was passiert beim Aufwachen?", url: "fragen/was-passiert-beim-aufwachen.html", category: "Künstliches Koma"},
  {title: "Bekommt mein Angehöriger im Koma alles mit?", url: "fragen/alles-mitbekommen.html", category: "Künstliches Koma"},
  {title: "Kann man im künstlichen Koma sterben?", url: "fragen/kann-man-sterben.html", category: "Künstliches Koma"},
  {title: "Warum wird jemand ins künstliche Koma versetzt?", url: "fragen/warum-kuenstliches-koma.html", category: "Künstliches Koma"},
  {title: "Träumt man im künstlichen Koma?", url: "fragen/traeumt-man-im-koma.html", category: "Künstliches Koma"},
  {title: "Wie wird das künstliche Koma beendet?", url: "fragen/koma-beenden.html", category: "Künstliches Koma"},
  
  // Beatmung
  {title: "Was bedeutet künstliche Beatmung?", url: "fragen/was-bedeutet-kuenstliche-beatmung.html", category: "Beatmung"},
  {title: "Wann braucht man eine Beatmung?", url: "fragen/wann-braucht-man-beatmung.html", category: "Beatmung"},
  {title: "Wie lange kann man beatmet werden?", url: "fragen/wie-lange-beatmet.html", category: "Beatmung"},
  {title: "Was ist ein Beatmungsschlauch (Tubus)?", url: "fragen/beatmungsschlauch.html", category: "Beatmung"},
  {title: "Was ist ein Luftröhrenschnitt (Tracheotomie)?", url: "fragen/luftroehrenschnitt.html", category: "Beatmung"},
  {title: "Kann mein Angehöriger während der Beatmung sprechen?", url: "fragen/sprechen-waehrend-beatmung.html", category: "Beatmung"},
  {title: "Was ist der Unterschied zwischen invasiver und nicht-invasiver Beatmung?", url: "fragen/invasive-nicht-invasive-beatmung.html", category: "Beatmung"},
  {title: "Kann man mit Beatmung essen und trinken?", url: "fragen/mit-beatmung-essen.html", category: "Beatmung"},
  
  // Kommunikation mit dem Team
  {title: "Wie läuft ein Arztgespräch ab?", url: "fragen/arztgespraech.html", category: "Kommunikation mit dem Team"},
  {title: "Welche Fragen sollte ich im Arztgespräch stellen?", url: "fragen/welche-fragen-stellen.html", category: "Kommunikation mit dem Team"},
  {title: "Wer gibt mir Auskunft über meinen Angehörigen?", url: "fragen/wer-gibt-auskunft.html", category: "Kommunikation mit dem Team"},
  {title: "Kann ich telefonisch Auskunft bekommen?", url: "fragen/telefonisch-auskunft.html", category: "Kommunikation mit dem Team"},
  {title: "Kann ich eine zweite Meinung einholen?", url: "fragen/zweite-meinung.html", category: "Kommunikation mit dem Team"},
  
  // Kommunikation mit dem Patienten
  {title: "Kann mein Angehöriger mich hören?", url: "fragen/kann-mich-hoeren.html", category: "Kommunikation mit dem Patienten"},
  {title: "Wie kommuniziere ich mit einem beatmeten Patienten?", url: "fragen/kommunikation-beatmeter-patient.html", category: "Kommunikation mit dem Patienten"},
  {title: "Warum erkennt mich mein Angehöriger nicht?", url: "fragen/erkennt-mich-nicht.html", category: "Kommunikation mit dem Patienten"},
  
  // Medizinische Begriffe und Geräte
  {title: "Was ist eine Sepsis?", url: "fragen/was-ist-sepsis.html", category: "Medizinische Begriffe"},
  {title: "Was ist ein Delir?", url: "fragen/was-ist-delir.html", category: "Medizinische Begriffe"},
  {title: "Was sind Katecholamine?", url: "fragen/was-sind-katecholamine.html", category: "Medizinische Begriffe"},
  {title: "Wann ist eine Dialyse nötig?", url: "fragen/dialyse-wann-noetig.html", category: "Medizinische Begriffe"},
  {title: "Was bedeuten die Werte auf dem Monitor?", url: "fragen/monitor-werte-bedeutung.html", category: "Medizinische Begriffe"},
  {title: "Warum hat mein Angehöriger so viele Schläuche?", url: "fragen/warum-viele-schlaeuche.html", category: "Medizinische Begriffe"},
  {title: "Warum reagiert mein Angehöriger nicht?", url: "fragen/warum-keine-reaktion.html", category: "Medizinische Begriffe"},
  {title: "Warum dauert alles so lange?", url: "fragen/warum-dauert-lange.html", category: "Medizinische Begriffe"},
  
  // Verlauf und Prognose
  {title: "Wie sind die Überlebenschancen?", url: "fragen/ueberlebenschancen.html", category: "Verlauf und Prognose"},
  {title: "Wird mein Angehöriger wieder gesund?", url: "fragen/wird-wieder-gesund.html", category: "Verlauf und Prognose"},
  {title: "Wann erfolgt die Verlegung von der Intensivstation?", url: "fragen/wann-verlegung.html", category: "Verlauf und Prognose"},
  {title: "Was kommt nach der Intensivstation?", url: "fragen/was-kommt-danach.html", category: "Verlauf und Prognose"},
  
  // Emotionale Belastung
  {title: "Wie halte ich diese Situation aus?", url: "fragen/wie-aushalten.html", category: "Emotionale Belastung"},
  {title: "Darf ich vor meinem Angehörigen weinen?", url: "fragen/darf-ich-weinen.html", category: "Emotionale Belastung"},
  {title: "Wie gehe ich mit Schuldgefühlen um?", url: "fragen/schuldgefuehle.html", category: "Emotionale Belastung"},
  {title: "Wo bekomme ich als Angehöriger Hilfe?", url: "fragen/hilfe-fuer-angehoerige.html", category: "Emotionale Belastung"},
  {title: "Wie sorge ich für mich selbst?", url: "fragen/selbstfuersorge.html", category: "Emotionale Belastung"},
  {title: "Wie erkläre ich die Situation meinen Kindern?", url: "fragen/kinder-informieren.html", category: "Emotionale Belastung"},
  {title: "Wie kann ich Hoffnung behalten?", url: "fragen/hoffnung-behalten.html", category: "Emotionale Belastung"},
  
  // Organisatorisches und Rechtliches
  {title: "Wer bezahlt die Intensivstation?", url: "fragen/kosten-intensivstation.html", category: "Organisatorisches"},
  {title: "Was kostet ein Tag auf der Intensivstation?", url: "fragen/was-kostet-intensivstation.html", category: "Organisatorisches"},
  {title: "Brauche ich eine Vollmacht oder Betreuung?", url: "fragen/vollmacht-betreuung.html", category: "Organisatorisches"},
  {title: "Was ist eine Patientenverfügung?", url: "fragen/patientenverfuegung.html", category: "Organisatorisches"},
  {title: "Muss ich meinen Arbeitgeber informieren?", url: "fragen/arbeitgeber-informieren.html", category: "Organisatorisches"},
  {title: "Gibt es Pflegezeit für Angehörige?", url: "fragen/pflegezeit.html", category: "Organisatorisches"},
  {title: "Brauche ich eine Krankschreibung als Angehöriger?", url: "fragen/krankschreibung-angehoerige.html", category: "Organisatorisches"},
  {title: "Wie organisiere ich Langzeitbesuche von weit her?", url: "fragen/langzeitbesuche-organisieren.html", category: "Organisatorisches"},
  {title: "Was mache ich mit der Arbeit meines Angehörigen?", url: "fragen/arbeit-des-angehoerigen.html", category: "Organisatorisches"},
  {title: "Wie informiere ich die Familie?", url: "fragen/familie-informieren.html", category: "Organisatorisches"}
];

// Suchbox automatisch nach der Navigation einfügen
function insertSearchBox() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  if (document.getElementById('auto-search-box')) return;
  
  const searchBoxHTML = `
    <div class="search-box" id="auto-search-box">
      <h2>Frage suchen</h2>
      <input 
        type="text" 
        id="searchInput" 
        placeholder="z.B. Beatmung, Koma, Besuchen..."
        autocomplete="off"
      >
      <div id="searchResults"></div>
    </div>
  `;
  
  nav.insertAdjacentHTML('afterend', searchBoxHTML);
}

// Funktion um den richtigen Pfad zu berechnen
function getCorrectPath(url) {
  const currentPath = window.location.pathname;
  
  // Wenn wir in einem Unterordner sind (enthält /fragen/)
  if (currentPath.includes('/fragen/')) {
    return '../' + url;
  }
  
  return url;
}

// Suchfunktion
function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const resultsDiv = document.getElementById('searchResults');
  
  if (!searchInput || !resultsDiv) return;
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'none';
    return;
  }
  
  const results = searchData.filter(item => {
    return item.title.toLowerCase().includes(searchTerm) || 
           item.category.toLowerCase().includes(searchTerm);
  });
  
  resultsDiv.style.display = 'block';
  
  if (results.length === 0) {
    resultsDiv.innerHTML = '<p class="search-no-results">Keine Ergebnisse gefunden für "' + searchTerm + '"</p>';
  } else {
    let html = '<div class="search-results-container">';
    html += '<h3>Suchergebnisse (' + results.length + '):</h3>';
    html += '<ul class="search-results-list">';
    
    results.forEach(result => {
      html += '<li class="search-result-item">';
      const correctUrl = getCorrectPath(result.url);
      html += '<a href="' + correctUrl + '" class="search-result-link">' + result.title + '</a>';
      html += '<span class="search-result-category">Kategorie: ' + result.category + '</span>';
      html += '</li>';
    });
    
    html += '</ul></div>';
    resultsDiv.innerHTML = html;
  }
}

// Initialisierung wenn Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
  insertSearchBox();
  
  setTimeout(function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', performSearch);
      searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
          performSearch();
        }
      });
    }
  }, 100);
});

// Auto-Scroll für Unterseiten zur Verkaufsbox unter dem Disclaimer
window.addEventListener('load', () => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const p = location.pathname;
  if (p.endsWith('index.html') || p === '/' || p.endsWith('/')) return;

  const salesBox = document.getElementById('sales-banner-container');
  if (!salesBox) return;

  setTimeout(() => {
    salesBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
});

// ==========================================
// QUICK CHECK FUNNEL - AUTOMATISCH LADEN
// ==========================================

(function() {
    'use strict';

    // Prüfen ob wir den Quick Check laden sollen
    function shouldLoadQuickCheck() {
        const path = window.location.pathname;
        
        // NICHT laden auf:
        if (path.includes('index.html') || 
            path === '/' || 
            path.includes('download') || 
            path.includes('impressum') || 
            path.includes('datenschutz') || 
            path.includes('agb') || 
            path.includes('ueber-mich') || 
            path.includes('fuer-mitarbeiter')) {
            return false;
        }

        // Laden auf Fragen-Seiten
        if (path.includes('/fragen/')) {
            return true;
        }

        return false;
    }

    // Quick Check HTML + CSS
    function getQuickCheckHTML() {
        return `
<style>
.qc-container {
    max-width: 1200px;
    margin: 0 auto 3rem;
    padding: 0 20px;
}

.quick-check-wrapper {
    background: linear-gradient(135deg, #ebf8ff 0%, #f8f9fa 100%);
    border: 2px solid #5dade2;
    border-radius: 12px;
    padding: 2rem;
    margin: 3rem 0 2rem 0;
    box-shadow: 0 4px 16px rgba(93, 173, 226, 0.15);
}

.quick-check-header {
    text-align: center;
    margin-bottom: 2rem;
}

.quick-check-header h3 {
    color: #2c3e50;
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
    line-height: 1.3;
}

.quick-check-subtitle {
    color: #7f8c8d;
    font-size: 1rem;
    font-style: italic;
}

.quick-check-question {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    display: none;
}

.quick-check-question.active {
    display: block;
    animation: qcFadeInSlide 0.4s ease-out;
}

@keyframes qcFadeInSlide {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.qc-question-text {
    font-size: 1.15rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1.2rem;
    line-height: 1.5;
}

.qc-question-number {
    display: inline-block;
    background: #5dade2;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    text-align: center;
    line-height: 28px;
    margin-right: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
}

.qc-answer-options {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.qc-answer-button {
    background: white;
    border: 2px solid #e9ecef;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    position: relative;
    font-family: inherit;
    width: 100%;
}

.qc-answer-button:hover {
    border-color: #5dade2;
    background: #f0f9ff;
    transform: translateX(4px);
}

.qc-answer-button::before {
    content: '→';
    position: absolute;
    right: 1.5rem;
    opacity: 0;
    transition: all 0.3s ease;
    color: #5dade2;
}

.qc-answer-button:hover::before {
    opacity: 1;
    right: 1rem;
}

.qc-progress-indicator {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #7f8c8d;
}

.qc-progress-bar {
    background: #e9ecef;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.qc-progress-fill {
    background: linear-gradient(90deg, #5dade2 0%, #3498db 100%);
    height: 100%;
    transition: width 0.4s ease;
    border-radius: 3px;
}

.qc-results-section {
    display: none;
    text-align: center;
}

.qc-results-section.show {
    display: block;
    animation: qcFadeInSlide 0.5s ease-out;
}

.qc-results-header {
    margin-bottom: 2rem;
}

.qc-results-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.qc-results-title {
    font-size: 1.5rem;
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.qc-results-text {
    color: #7f8c8d;
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto 2rem;
}

.qc-recommended-products {
    display: grid;
    gap: 1.5rem;
    margin-top: 2rem;
}

.qc-product-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 1.8rem;
    text-align: left;
    transition: all 0.3s ease;
    position: relative;
}

.qc-product-card:hover {
    border-color: #5dade2;
    box-shadow: 0 6px 20px rgba(93, 173, 226, 0.15);
    transform: translateY(-2px);
}

.qc-product-badge {
    position: absolute;
    top: -12px;
    right: 20px;
    background: #ff6b35;
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.qc-product-title {
    font-size: 1.3rem;
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 0.8rem;
}

.qc-product-description {
    color: #7f8c8d;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1.2rem;
}

.qc-product-benefits {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
}

.qc-product-benefits li {
    padding: 0.4rem 0;
    padding-left: 1.8rem;
    position: relative;
    font-size: 0.95rem;
    color: #34495e;
}

.qc-product-benefits li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #27ae60;
    font-weight: bold;
    font-size: 1.1rem;
}

.qc-product-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e9ecef;
}

.qc-product-price {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
}

.qc-product-button {
    background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
    color: white;
    padding: 0.9rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    display: inline-block;
    box-shadow: 0 4px 12px rgba(93, 173, 226, 0.3);
}

.qc-product-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(93, 173, 226, 0.4);
    color: white;
}

.qc-restart-button {
    margin-top: 2rem;
    padding: 0.8rem 1.5rem;
    background: white;
    border: 2px solid #5dade2;
    color: #5dade2;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    font-size: 1rem;
}

.qc-restart-button:hover {
    background: #5dade2;
    color: white;
}

@media (max-width: 768px) {
    .quick-check-wrapper {
        padding: 1.5rem;
        margin: 2rem 0 1.5rem 0;
    }
    .quick-check-header h3 {
        font-size: 1.3rem;
    }
    .qc-question-text {
        font-size: 1.05rem;
    }
    .qc-answer-button {
        padding: 0.9rem 1.2rem;
        font-size: 0.95rem;
    }
    .qc-product-card {
        padding: 1.5rem;
    }
    .qc-product-title {
        font-size: 1.15rem;
    }
    .qc-product-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    .qc-product-button {
        width: 100%;
        text-align: center;
    }
}
</style>

<div class="qc-container">
<div class="quick-check-wrapper">
    <div class="quick-check-header">
        <h3>✓ Quick Check – Bin ich richtig auf die Intensivstation vorbereitet?</h3>
        <p class="quick-check-subtitle">3 kurze Fragen – direkte Empfehlung</p>
    </div>

    <div class="qc-progress-bar">
        <div class="qc-progress-fill" id="qcProgressFill" style="width: 0%"></div>
    </div>
    <div class="qc-progress-indicator" id="qcProgressText">Frage 1 von 3</div>

    <div class="quick-check-question active" data-qc-question="1">
        <p class="qc-question-text">
            <span class="qc-question-number">1</span>
            In welcher Situation befinden Sie sich gerade?
        </p>
        <div class="qc-answer-options">
            <button class="qc-answer-button" data-qc-answer="angehoeriger-akut">
                Mein Angehöriger liegt jetzt auf der Intensivstation
            </button>
            <button class="qc-answer-button" data-qc-answer="patient-geplant">
                Ich werde selbst bald auf die Intensivstation kommen (geplante OP)
            </button>
            <button class="qc-answer-button" data-qc-answer="vorbereitung">
                Ich möchte mich allgemein informieren
            </button>
        </div>
    </div>

    <div class="quick-check-question" data-qc-question="2">
        <p class="qc-question-text">
            <span class="qc-question-number">2</span>
            Stehen bald wichtige Gespräche oder Entscheidungen an?
        </p>
        <div class="qc-answer-options">
            <button class="qc-answer-button" data-qc-answer="gespraech-heute">
                Ja, ich habe bald/heute ein Arztgespräch
            </button>
            <button class="qc-answer-button" data-qc-answer="schwierige-entscheidung">
                Ja, es geht um schwierige medizinische Entscheidungen
            </button>
            <button class="qc-answer-button" data-qc-answer="keine-gespraeche">
                Nein, noch nicht / weiß ich nicht
            </button>
        </div>
    </div>

    <div class="quick-check-question" data-qc-question="3">
        <p class="qc-question-text">
            <span class="qc-question-number">3</span>
            Was würde Ihnen jetzt am meisten helfen?
        </p>
        <div class="qc-answer-options">
            <button class="qc-answer-button" data-qc-answer="sofort-fragen">
                Konkrete Fragen, die ich jetzt sofort stellen kann
            </button>
            <button class="qc-answer-button" data-qc-answer="verstehen">
                Verstehen, was auf der Intensivstation passiert
            </button>
            <button class="qc-answer-button" data-qc-answer="alles">
                Umfassende Orientierung von A bis Z
            </button>
        </div>
    </div>

    <div class="qc-results-section" id="qcResultsSection">
        <div class="qc-results-header">
            <div class="qc-results-icon">📋</div>
            <h4 class="qc-results-title">Ihre persönliche Empfehlung</h4>
            <p class="qc-results-text" id="qcResultsText"></p>
        </div>

        <div class="qc-recommended-products" id="qcRecommendedProducts"></div>

        <button class="qc-restart-button" id="qcRestartButton">
            ← Nochmal von vorne
        </button>
    </div>
</div>
</div>
        `;
    }

    // Quick Check JavaScript - wird NACH dem Einfügen initialisiert
    function initQuickCheckFunctionality() {
        let qcCurrentQuestion = 1;
        let qcAnswers = {};
        const qcTotalQuestions = 3;

        const qcProducts = {
            soforthilfe: {
                title: "Arztgespräch auf der Intensivstation",
                badge: "Soforthilfe",
                description: "Kompakte Orientierung für das nächste Arztgespräch – mit konkreten Beispielfragen und Begriffserklärungen.",
                benefits: [
                    "Direkt nutzbare Fragen fürs Arztgespräch",
                    "Wichtigste medizinische Begriffe erklärt",
                    "Passt in jede Tasche (15 Seiten)",
                    "Sofort verfügbar als PDF"
                ],
                price: "2,99 €",
                link: "https://paulrawe.gumroad.com/l/oroga"
            },
            schwierige: {
                title: "„Wir müssen reden"",
                badge: "Für schwierige Entscheidungen",
                description: "Orientierung bei Therapiebegrenzung, Palliativversorgung und schwierigen medizinischen Entscheidungen.",
                benefits: [
                    "Die 10 wichtigsten Fragen für schwere Gespräche",
                    "Wer entscheidet was? – Klarheit über Ihre Rolle",
                    "Checklisten & Entscheidungshilfe zum Ausfüllen",
                    "Beispielgespräche aus der Praxis"
                ],
                price: "2,99 €",
                link: "https://paulrawe.gumroad.com/l/wtyksz"
            },
            angehoerige: {
                title: "Intensivstation Ratgeber für Angehörige",
                badge: "Umfassend",
                description: "Vollständiger Ratgeber mit allen wichtigen Informationen, Checklisten und Vorlagen für Angehörige.",
                benefits: [
                    "Checklisten für die ersten 24 Stunden",
                    "Alle medizinischen Begriffe verständlich erklärt",
                    "Umgang mit schwierigen Situationen",
                    "Vorlagen zum Ausfüllen & Ausdrucken"
                ],
                price: "4,99 €",
                link: "https://paulrawe.gumroad.com/l/vniudu"
            },
            patienten: {
                title: "Intensivstation Ratgeber für Patienten",
                badge: "Für Patienten",
                description: "Umfassende Vorbereitung auf Ihren geplanten Aufenthalt – inkl. Checklisten und Packliste.",
                benefits: [
                    "Checklisten zur Vorbereitung (2-3 Wochen vorher)",
                    "Was Sie mitbringen sollten",
                    "Beatmung und Aufwachphase erklärt",
                    "Praktische Vorlagen & Notfallkontakte"
                ],
                price: "4,99 €",
                link: "https://paulrawe.gumroad.com/l/hucwg"
            },
            bundle: {
                title: "Bundle: Beide Ratgeber kombiniert",
                badge: "Spare 20%",
                description: "Angehörigen- und Patienten-Ratgeber zusammen – für gemeinsame Orientierung.",
                benefits: [
                    "Beide Perspektiven verstehen",
                    "Vollständiges Paket mit allen Checklisten",
                    "Sie sparen 1,99 €"
                ],
                price: "7,99 €",
                link: "https://paulrawe.gumroad.com/l/otohnp"
            }
        };

        // Event-Listener für alle Antwort-Buttons
        document.querySelectorAll('.qc-answer-button').forEach(button => {
            button.addEventListener('click', function() {
                const answer = this.getAttribute('data-qc-answer');
                qcAnswers['q' + qcCurrentQuestion] = answer;
                qcNextQuestion();
            });
        });

        function qcNextQuestion() {
            document.querySelector('[data-qc-question="' + qcCurrentQuestion + '"]').classList.remove('active');
            qcCurrentQuestion++;
            const progress = (qcCurrentQuestion - 1) / qcTotalQuestions * 100;
            document.getElementById('qcProgressFill').style.width = progress + '%';
            
            if (qcCurrentQuestion <= qcTotalQuestions) {
                document.getElementById('qcProgressText').textContent = 'Frage ' + qcCurrentQuestion + ' von ' + qcTotalQuestions;
                document.querySelector('[data-qc-question="' + qcCurrentQuestion + '"]').classList.add('active');
            } else {
                qcShowResults();
            }
        }

        function qcShowResults() {
            document.querySelector('.qc-progress-bar').style.display = 'none';
            document.querySelector('.qc-progress-indicator').style.display = 'none';
            
            const recommendations = qcGetRecommendations();
            document.getElementById('qcResultsText').textContent = recommendations.text;
            
            const productsHTML = recommendations.products.map(productKey => {
                const product = qcProducts[productKey];
                return '<div class="qc-product-card">' +
                    (product.badge ? '<span class="qc-product-badge">' + product.badge + '</span>' : '') +
                    '<h4 class="qc-product-title">' + product.title + '</h4>' +
                    '<p class="qc-product-description">' + product.description + '</p>' +
                    '<ul class="qc-product-benefits">' +
                    product.benefits.map(benefit => '<li>' + benefit + '</li>').join('') +
                    '</ul>' +
                    '<div class="qc-product-footer">' +
                    '<div class="qc-product-price">' + product.price + '</div>' +
                    '<a href="' + product.link + '" target="_blank" rel="noopener" class="qc-product-button">Jetzt herunterladen →</a>' +
                    '</div></div>';
            }).join('');
            
            document.getElementById('qcRecommendedProducts').innerHTML = productsHTML;
            document.getElementById('qcResultsSection').classList.add('show');
        }

        function qcGetRecommendations() {
            const q1 = qcAnswers.q1;
            const q2 = qcAnswers.q2;
            const q3 = qcAnswers.q3;
            
            if (q2 === 'gespraech-heute' || q3 === 'sofort-fragen') {
                return {
                    text: 'Sie brauchen jetzt sofort konkrete Hilfe. Diese Soforthilfe gibt Ihnen die wichtigsten Fragen und Begriffe an die Hand.',
                    products: ['soforthilfe']
                };
            }
            
            if (q2 === 'schwierige-entscheidung') {
                return {
                    text: 'Bei schwierigen Entscheidungen brauchen Sie klare Orientierung. Dieser Ratgeber hilft Ihnen, die richtigen Fragen zu stellen.',
                    products: ['schwierige']
                };
            }
            
            if (q1 === 'patient-geplant') {
                if (q3 === 'alles') {
                    return {
                        text: 'Als Patient brauchen Sie umfassende Vorbereitung. Dieser Ratgeber begleitet Sie durch alle Phasen.',
                        products: ['patienten']
                    };
                } else {
                    return {
                        text: 'Bereiten Sie sich optimal vor. Diese Kombination gibt Ihnen sowohl Soforthilfe als auch Hintergrundwissen.',
                        products: ['soforthilfe', 'patienten']
                    };
                }
            }
            
            if (q1 === 'angehoeriger-akut') {
                if (q3 === 'alles') {
                    return {
                        text: 'Sie brauchen umfassende Orientierung. Dieser Ratgeber beantwortet alle wichtigen Fragen für Angehörige.',
                        products: ['angehoerige']
                    };
                } else if (q3 === 'sofort-fragen') {
                    return {
                        text: 'Sie brauchen jetzt konkrete Hilfe. Diese Soforthilfe gibt Ihnen die wichtigsten Fragen an die Hand.',
                        products: ['soforthilfe']
                    };
                } else {
                    return {
                        text: 'Diese Kombination gibt Ihnen sowohl Soforthilfe als auch umfassendes Hintergrundwissen.',
                        products: ['soforthilfe', 'angehoerige']
                    };
                }
            }
            
            if (q1 === 'vorbereitung') {
                if (q3 === 'alles') {
                    return {
                        text: 'Für umfassende Information empfehlen wir beide Ratgeber – so verstehen Sie beide Perspektiven.',
                        products: ['bundle']
                    };
                } else {
                    return {
                        text: 'Starten Sie mit der Soforthilfe und erweitern Sie bei Bedarf mit dem vollständigen Ratgeber.',
                        products: ['soforthilfe']
                    };
                }
            }
            
            return {
                text: 'Basierend auf Ihren Antworten empfehlen wir Ihnen diese Ratgeber für optimale Orientierung.',
                products: ['soforthilfe', 'angehoerige']
            };
        }

        function qcRestart() {
            qcCurrentQuestion = 1;
            qcAnswers = {};
            
            document.querySelector('.qc-progress-bar').style.display = 'block';
            document.querySelector('.qc-progress-indicator').style.display = 'block';
            document.getElementById('qcProgressFill').style.width = '0%';
            document.getElementById('qcProgressText').textContent = 'Frage 1 von 3';
            
            document.querySelectorAll('.quick-check-question').forEach(q => {
                q.classList.remove('active');
            });
            
            document.querySelector('[data-qc-question="1"]').classList.add('active');
            document.getElementById('qcResultsSection').classList.remove('show');
        }

        // Restart-Button Event Listener
        const restartBtn = document.getElementById('qcRestartButton');
        if (restartBtn) {
            restartBtn.addEventListener('click', qcRestart);
        }
    }

    // Quick Check vor dem Footer einfügen
    function injectQuickCheck() {
        if (!shouldLoadQuickCheck()) {
            return;
        }

        const footer = document.querySelector('footer');
        if (!footer) {
            console.log('Quick Check: Footer nicht gefunden');
            return;
        }

        // Prüfe ob schon eingefügt
        if (document.querySelector('.qc-container')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.innerHTML = getQuickCheckHTML();
        footer.parentNode.insertBefore(wrapper, footer);
        
        // Event-Listener NACH dem Einfügen binden
        setTimeout(function() {
            initQuickCheckFunctionality();
            console.log('Quick Check Funnel erfolgreich geladen!');
        }, 100);
    }

    // Wenn DOM geladen ist, Quick Check einfügen
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectQuickCheck);
    } else {
        injectQuickCheck();
    }

})();
