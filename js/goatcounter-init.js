/**
 * GOATCOUNTER ANALYTICS SCRIPT
 * 
 * GoatCounter ist eine datenschutzfreundliche Alternative zu Google Analytics.
 * 
 * Anleitung:
 * 1. Erstelle einen kostenlosen Account bei https://www.goatcounter.com
 * 2. Wähle deinen Code (z.B. "intensivstation-ratgeber")
 * 3. Ersetze unten "DEIN-CODE" mit deinem Code
 * 4. Fertig!
 * 
 * GoatCounter:
 * - Keine Cookies
 * - Keine persönlichen Daten
 * - DSGVO-konform
 * - Kostenlos für kleine Websites
 */

// Ersetze "DEIN-CODE" mit deinem GoatCounter-Code
const GOATCOUNTER_CODE = 'DEIN-CODE';

// GoatCounter Script laden
if (GOATCOUNTER_CODE !== 'DEIN-CODE') {
    window.goatcounter = {
        path: function(p) { return location.host + p }
    };

    var script = document.createElement('script');
    script.async = true;
    script.src = `https://${GOATCOUNTER_CODE}.goatcounter.com/count.js`;
    script.setAttribute('data-goatcounter', `https://${GOATCOUNTER_CODE}.goatcounter.com/count`);
    document.head.appendChild(script);
    
    console.log('GoatCounter geladen:', GOATCOUNTER_CODE);
} else {
    console.warn('GoatCounter: Bitte GOATCOUNTER_CODE in goatcounter-init.js konfigurieren!');
}
