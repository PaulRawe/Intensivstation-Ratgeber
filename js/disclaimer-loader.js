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

    // Disclaimer laden
    fetch('includes/disclaimer-include.html')
        .then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP-Status ' + response.status);
            }
            return response.text();
        })
        .then(function (html) {
            inner.innerHTML = html;
        })
        .catch(function () {
            // Fallback (rechtlich ausreichend)
            inner.innerHTML = `
                 Die Inhalte dieser Website dienen der allgemeinen Information und
        ersetzen keine ärztliche oder pflegerische Beratung im Einzelfall.
            `;
        });
});

