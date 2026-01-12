/**
 * GOATCOUNTER ANALYTICS SCRIPT
 * 
 * GoatCounter ist eine datenschutzfreundliche Alternative zu Google Analytics.
 * 
 * GoatCounter:
 * - Keine Cookies
 * - Keine persönlichen Daten
 * - DSGVO-konform
 * - Kostenlos für kleine Websites
 */

// GoatCounter Code für intensivstation-ratgeber.de
const GOATCOUNTER_CODE = 'pauleheissta';

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
