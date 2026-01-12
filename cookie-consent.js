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
  
  // Kommunikation
  {title: "Wie läuft ein Arztgespräch ab?", url: "fragen/arztgespraech.html", category: "Kommunikation"},
  {title: "Welche Fragen sollte ich im Arztgespräch stellen?", url: "fragen/welche-fragen-stellen.html", category: "Kommunikation"},
  {title: "Wer gibt mir Auskunft über meinen Angehörigen?", url: "fragen/wer-gibt-auskunft.html", category: "Kommunikation"},
  {title: "Kann ich telefonisch Auskunft bekommen?", url: "fragen/telefonisch-auskunft.html", category: "Kommunikation"},
  {title: "Kann ich eine zweite Meinung einholen?", url: "fragen/zweite-meinung.html", category: "Kommunikation"},
  
  // Emotionale Belastung
  {title: "Wie halte ich diese Situation aus?", url: "fragen/wie-aushalten.html", category: "Emotionale Belastung"},
  {title: "Darf ich vor meinem Angehörigen weinen?", url: "fragen/darf-ich-weinen.html", category: "Emotionale Belastung"},
  {title: "Wie gehe ich mit Schuldgefühlen um?", url: "fragen/schuldgefuehle.html", category: "Emotionale Belastung"},
  {title: "Wo bekomme ich als Angehöriger Hilfe?", url: "fragen/hilfe-fuer-angehoerige.html", category: "Emotionale Belastung"},
  {title: "Wie sorge ich für mich selbst?", url: "fragen/selbstfuersorge.html", category: "Emotionale Belastung"},
  {title: "Wie erkläre ich die Situation meinen Kindern?", url: "fragen/kinder-informieren.html", category: "Emotionale Belastung"},
  {title: "Wie kann ich Hoffnung behalten?", url: "fragen/hoffnung-behalten.html", category: "Emotionale Belastung"},
  
  // Organisatorisches
  {title: "Wer bezahlt die Intensivstation?", url: "fragen/kosten-intensivstation.html", category: "Organisatorisches"},
  {title: "Brauche ich eine Vollmacht oder Betreuung?", url: "fragen/vollmacht-betreuung.html", category: "Organisatorisches"},
  {title: "Was ist eine Patientenverfügung?", url: "fragen/patientenverfuegung.html", category: "Organisatorisches"},
  {title: "Muss ich meinen Arbeitgeber informieren?", url: "fragen/arbeitgeber-informieren.html", category: "Organisatorisches"},
  {title: "Gibt es Pflegezeit für Angehörige?", url: "fragen/pflegezeit.html", category: "Organisatorisches"},
  {title: "Brauche ich eine Krankschreibung als Angehöriger?", url: "fragen/krankschreibung-angehoerige.html", category: "Organisatorisches"},
  {title: "Wie organisiere ich Langzeitbesuche von weit her?", url: "fragen/langzeitbesuche-organisieren.html", category: "Organisatorisches"},
  {title: "Was mache ich mit der Arbeit meines Angehörigen?", url: "fragen/arbeit-des-angehoerigen.html", category: "Organisatorisches"}
];

// Suchbox automatisch nach der Navigation einfügen
function insertSearchBox() {
  // Finde das <nav> Element
  const nav = document.querySelector('nav');
  
  // Wenn Navigation nicht gefunden, abbrechen
  if (!nav) return;
  
  // Prüfe ob Suchbox bereits existiert (verhindert doppeltes Einfügen)
  if (document.getElementById('auto-search-box')) return;
  
  // Erstelle die Suchbox
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
  
  // Füge Suchbox nach der Navigation ein
  nav.insertAdjacentHTML('afterend', searchBoxHTML);
}
// Funktion um den richtigen Pfad zu berechnen
function getCorrectPath(url) {
  // Prüfe ob wir in einem Unterordner sind (z.B. fragen/)
  const currentPath = window.location.pathname;
  
  // Wenn wir in einem Unterordner sind (enthält /fragen/)
  if (currentPath.includes('/fragen/')) {
    // Füge ../ vor die URL um eine Ebene nach oben zu gehen
    return '../' + url;
  }
  
  // Ansonsten nutze die URL wie sie ist (für Startseite)
  return url;
}
// Suchfunktion
function performSearch() {
  const searchInput = document.getElementById('searchInput');
  const resultsDiv = document.getElementById('searchResults');
  
  // Prüfen ob Elemente existieren
  if (!searchInput || !resultsDiv) return;
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  
  // Leere Suche
  if (searchTerm === '') {
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'none';
    return;
  }
  
  // Suche durchführen
  const results = searchData.filter(item => {
    return item.title.toLowerCase().includes(searchTerm) || 
           item.category.toLowerCase().includes(searchTerm);
  });
  
  // Ergebnisse anzeigen
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
  // Suchbox automatisch einfügen
  insertSearchBox();
  
  // Event Listener für Suchfeld hinzufügen
  // Warte kurz, damit die Suchbox sicher eingefügt ist
  setTimeout(function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      // Live-Suche während der Eingabe
      searchInput.addEventListener('input', performSearch);
      
      // Suche auch bei Enter
      searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
          performSearch();
        }
      });
    }
  }, 100);
});

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

