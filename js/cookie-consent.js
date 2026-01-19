// ==========================================
// COOKIE CONSENT
// ==========================================
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

    function acceptCookies() {
        saveConsent('accepted');
        hideBanner();
        loadGoatCounter();
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
        } else {
            showBanner();
        }

        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');

        if (acceptBtn) acceptBtn.addEventListener('click', acceptCookies);
        if (declineBtn) declineBtn.addEventListener('click', declineCookies);
    });
})();

// ==========================================
// SUCHFUNKTION
// ==========================================
const searchData = [
    {title: "Was bedeutet Intensivstation überhaupt?", url: "fragen/was-bedeutet-intensivstation.html", category: "Erste Orientierung"},
    {title: "Wann darf ich meinen Angehörigen besuchen?", url: "fragen/wann-darf-ich-besuchen.html", category: "Erste Orientierung"},
    {title: "Wie sind die Besuchszeiten geregelt?", url: "fragen/besuchszeiten.html", category: "Erste Orientierung"},
    {title: "Wie viele Besucher dürfen gleichzeitig kommen?", url: "fragen/wieviele-besucher.html", category: "Erste Orientierung"},
    {title: "Was ziehe ich beim Besuch an?", url: "fragen/was-anziehen.html", category: "Erste Orientierung"},
    {title: "Darf ich Blumen mitbringen?", url: "fragen/blumen-mitbringen.html", category: "Erste Orientierung"},
    {title: "Kann ich auf der Intensivstation übernachten?", url: "fragen/uebernachten.html", category: "Erste Orientierung"},
    {title: "Was ist ein künstliches Koma?", url: "fragen/was-ist-kuenstliches-koma.html", category: "Künstliches Koma"},
    {title: "Wie lange dauert ein künstliches Koma?", url: "fragen/wie-lange-kuenstliches-koma.html", category: "Künstliches Koma"}
];

function insertSearchBox() {
    const nav = document.querySelector('nav');
    if (!nav || document.getElementById('auto-search-box')) return;
    
    const html = '<div class="search-box" id="auto-search-box">' +
        '<h2>Frage suchen</h2>' +
        '<input type="text" id="searchInput" placeholder="z.B. Beatmung, Koma, Besuchen..." autocomplete="off">' +
        '<div id="searchResults"></div>' +
        '</div>';
    
    nav.insertAdjacentHTML('afterend', html);
}

function getCorrectPath(url) {
    const currentPath = window.location.pathname;
    return currentPath.includes('/fragen/') ? '../' + url : url;
}

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
    
    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.category.toLowerCase().includes(searchTerm)
    );
    
    resultsDiv.style.display = 'block';
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>Keine Ergebnisse gefunden</p>';
    } else {
        let html = '<div class="search-results-container"><h3>Suchergebnisse (' + results.length + '):</h3><ul>';
        results.forEach(result => {
            const url = getCorrectPath(result.url);
            html += '<li><a href="' + url + '">' + result.title + '</a></li>';
        });
        html += '</ul></div>';
        resultsDiv.innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    insertSearchBox();
    setTimeout(function() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', performSearch);
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        }
    }, 100);
});

// ==========================================
// AUTO-SCROLL
// ==========================================
window.addEventListener('load', () => {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    const path = location.pathname;
    if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) return;
    
    const salesBox = document.getElementById('sales-banner-container');
    if (salesBox) {
        setTimeout(() => {
            salesBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
});

// ==========================================
// QUICK CHECK FUNNEL
// ==========================================
(function() {
    'use strict';

    function shouldLoadQuickCheck() {
        const path = window.location.pathname;
        
        if (path.includes('index.html') || path === '/' || 
            path.includes('download') || path.includes('impressum') || 
            path.includes('datenschutz') || path.includes('agb') || 
            path.includes('ueber-mich') || path.includes('fuer-mitarbeiter')) {
            return false;
        }
        
        return path.includes('/fragen/');
    }

    function getQuickCheckHTML() {
        const css = '<style>' +
            '.qc-container{max-width:1200px;margin:0 auto 3rem;padding:0 20px}' +
            '.quick-check-wrapper{background:linear-gradient(135deg,#ebf8ff 0%,#f8f9fa 100%);border:2px solid #5dade2;border-radius:12px;padding:2rem;margin:3rem 0 2rem;box-shadow:0 4px 16px rgba(93,173,226,.15)}' +
            '.quick-check-header{text-align:center;margin-bottom:2rem}' +
            '.quick-check-header h3{color:#2c3e50;font-size:1.6rem;margin-bottom:.5rem;line-height:1.3}' +
            '.quick-check-subtitle{color:#7f8c8d;font-size:1rem;font-style:italic}' +
            '.quick-check-question{background:#fff;padding:1.5rem;border-radius:8px;margin-bottom:1rem;box-shadow:0 2px 8px rgba(0,0,0,.05);display:none}' +
            '.quick-check-question.active{display:block;animation:qcFadeIn .4s ease-out}' +
            '@keyframes qcFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
            '.qc-question-text{font-size:1.15rem;font-weight:600;color:#2c3e50;margin-bottom:1.2rem}' +
            '.qc-question-number{display:inline-block;background:#5dade2;color:#fff;width:28px;height:28px;border-radius:50%;text-align:center;line-height:28px;margin-right:.5rem;font-size:.9rem;font-weight:600}' +
            '.qc-answer-options{display:flex;flex-direction:column;gap:.8rem}' +
            '.qc-answer-button{background:#fff;border:2px solid #e9ecef;padding:1rem 1.5rem;border-radius:8px;font-size:1rem;font-weight:500;color:#2c3e50;cursor:pointer;transition:all .3s ease;text-align:left;position:relative;width:100%}' +
            '.qc-answer-button:hover{border-color:#5dade2;background:#f0f9ff;transform:translateX(4px)}' +
            '.qc-progress-bar{background:#e9ecef;height:6px;border-radius:3px;overflow:hidden;margin-bottom:1rem}' +
            '.qc-progress-fill{background:linear-gradient(90deg,#5dade2,#3498db);height:100%;transition:width .4s ease}' +
            '.qc-progress-indicator{text-align:center;margin-bottom:1.5rem;font-size:.9rem;color:#7f8c8d}' +
            '.qc-results-section{display:none;text-align:center}' +
            '.qc-results-section.show{display:block}' +
            '.qc-results-title{font-size:1.5rem;color:#2c3e50;font-weight:600;margin-bottom:.5rem}' +
            '.qc-results-text{color:#7f8c8d;font-size:1.05rem;line-height:1.6;max-width:600px;margin:0 auto 2rem}' +
            '.qc-recommended-products{display:grid;gap:1.5rem;margin-top:2rem}' +
            '.qc-product-card{background:#fff;border:2px solid #e9ecef;border-radius:12px;padding:1.8rem;text-align:left;transition:all .3s ease;position:relative}' +
            '.qc-product-card:hover{border-color:#5dade2;box-shadow:0 6px 20px rgba(93,173,226,.15);transform:translateY(-2px)}' +
            '.qc-product-badge{position:absolute;top:-12px;right:20px;background:#ff6b35;color:#fff;padding:.4rem 1rem;border-radius:20px;font-size:.85rem;font-weight:600}' +
            '.qc-product-title{font-size:1.3rem;color:#2c3e50;font-weight:600;margin-bottom:.8rem}' +
            '.qc-product-description{color:#7f8c8d;font-size:.95rem;line-height:1.6;margin-bottom:1.2rem}' +
            '.qc-product-benefits{list-style:none;padding:0;margin:1rem 0}' +
            '.qc-product-benefits li{padding:.4rem 0 .4rem 1.8rem;position:relative;font-size:.95rem;color:#34495e}' +
            '.qc-product-benefits li::before{content:"✓";position:absolute;left:0;color:#27ae60;font-weight:700;font-size:1.1rem}' +
            '.qc-product-footer{display:flex;align-items:center;justify-content:space-between;margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #e9ecef}' +
            '.qc-product-price{font-size:1.8rem;font-weight:700;color:#2c3e50}' +
            '.qc-product-button{background:linear-gradient(135deg,#5dade2,#3498db);color:#fff;padding:.9rem 2rem;border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem;transition:all .3s ease;display:inline-block}' +
            '.qc-product-button:hover{transform:translateY(-2px);color:#fff}' +
            '.qc-restart-button{margin-top:2rem;padding:.8rem 1.5rem;background:#fff;border:2px solid #5dade2;color:#5dade2;border-radius:8px;font-weight:600;cursor:pointer;transition:all .3s ease;font-size:1rem}' +
            '.qc-restart-button:hover{background:#5dade2;color:#fff}' +
            '@media (max-width:768px){.quick-check-wrapper{padding:1.5rem}.qc-product-footer{flex-direction:column;gap:1rem}.qc-product-button{width:100%;text-align:center}}' +
            '</style>';
        
        const html = '<div class="qc-container"><div class="quick-check-wrapper">' +
            '<div class="quick-check-header">' +
            '<h3>✓ Quick Check – Bin ich richtig auf die Intensivstation vorbereitet?</h3>' +
            '<p class="quick-check-subtitle">3 kurze Fragen – direkte Empfehlung</p>' +
            '</div>' +
            '<div class="qc-progress-bar"><div class="qc-progress-fill" id="qcProgressFill" style="width:0%"></div></div>' +
            '<div class="qc-progress-indicator" id="qcProgressText">Frage 1 von 3</div>' +
            '<div class="quick-check-question active" data-qc-question="1">' +
            '<p class="qc-question-text"><span class="qc-question-number">1</span> In welcher Situation befinden Sie sich gerade?</p>' +
            '<div class="qc-answer-options">' +
            '<button class="qc-answer-button" data-qc-answer="angehoeriger-akut">Mein Angehöriger liegt jetzt auf der Intensivstation</button>' +
            '<button class="qc-answer-button" data-qc-answer="patient-geplant">Ich werde selbst bald auf die Intensivstation kommen (geplante OP)</button>' +
            '<button class="qc-answer-button" data-qc-answer="vorbereitung">Ich möchte mich allgemein informieren</button>' +
            '</div></div>' +
            '<div class="quick-check-question" data-qc-question="2">' +
            '<p class="qc-question-text"><span class="qc-question-number">2</span> Stehen bald wichtige Gespräche oder Entscheidungen an?</p>' +
            '<div class="qc-answer-options">' +
            '<button class="qc-answer-button" data-qc-answer="gespraech-heute">Ja, ich habe bald/heute ein Arztgespräch</button>' +
            '<button class="qc-answer-button" data-qc-answer="schwierige-entscheidung">Ja, es geht um schwierige medizinische Entscheidungen</button>' +
            '<button class="qc-answer-button" data-qc-answer="keine-gespraeche">Nein, noch nicht / weiß ich nicht</button>' +
            '</div></div>' +
            '<div class="quick-check-question" data-qc-question="3">' +
            '<p class="qc-question-text"><span class="qc-question-number">3</span> Was würde Ihnen jetzt am meisten helfen?</p>' +
            '<div class="qc-answer-options">' +
            '<button class="qc-answer-button" data-qc-answer="sofort-fragen">Konkrete Fragen, die ich jetzt sofort stellen kann</button>' +
            '<button class="qc-answer-button" data-qc-answer="verstehen">Verstehen, was auf der Intensivstation passiert</button>' +
            '<button class="qc-answer-button" data-qc-answer="alles">Umfassende Orientierung von A bis Z</button>' +
            '</div></div>' +
            '<div class="qc-results-section" id="qcResultsSection">' +
            '<div class="qc-results-header">' +
            '<div style="font-size:3rem;margin-bottom:1rem">📋</div>' +
            '<h4 class="qc-results-title">Ihre persönliche Empfehlung</h4>' +
            '<p class="qc-results-text" id="qcResultsText"></p>' +
            '</div>' +
            '<div class="qc-recommended-products" id="qcRecommendedProducts"></div>' +
            '<button class="qc-restart-button" id="qcRestartButton">← Nochmal von vorne</button>' +
            '</div></div></div>';
        
        return css + html;
    }

    function initQuickCheckFunctionality() {
        let qcCurrentQuestion = 1;
        let qcAnswers = {};
        const qcTotalQuestions = 3;

        const qcProducts = {
            soforthilfe: {
                title: "Arztgespräch auf der Intensivstation",
                badge: "Soforthilfe",
                description: "Kompakte Orientierung für das nächste Arztgespräch – mit konkreten Beispielfragen und Begriffserklärungen.",
                benefits: ["Direkt nutzbare Fragen fürs Arztgespräch", "Wichtigste medizinische Begriffe erklärt", "Passt in jede Tasche (15 Seiten)", "Sofort verfügbar als PDF"],
                price: "2,99 €",
                link: "https://paulrawe.gumroad.com/l/oroga"
            },
            schwierige: {
                title: "„Wir müssen reden"",
                badge: "Für schwierige Entscheidungen",
                description: "Orientierung bei Therapiebegrenzung, Palliativversorgung und schwierigen medizinischen Entscheidungen.",
                benefits: ["Die 10 wichtigsten Fragen für schwere Gespräche", "Wer entscheidet was? – Klarheit über Ihre Rolle", "Checklisten & Entscheidungshilfe zum Ausfüllen", "Beispielgespräche aus der Praxis"],
                price: "2,99 €",
                link: "https://paulrawe.gumroad.com/l/wtyksz"
            },
            angehoerige: {
                title: "Intensivstation Ratgeber für Angehörige",
                badge: "Umfassend",
                description: "Vollständiger Ratgeber mit allen wichtigen Informationen, Checklisten und Vorlagen für Angehörige.",
                benefits: ["Checklisten für die ersten 24 Stunden", "Alle medizinischen Begriffe verständlich erklärt", "Umgang mit schwierigen Situationen", "Vorlagen zum Ausfüllen & Ausdrucken"],
                price: "4,99 €",
                link: "https://paulrawe.gumroad.com/l/vniudu"
            },
            patienten: {
                title: "Intensivstation Ratgeber für Patienten",
                badge: "Für Patienten",
                description: "Umfassende Vorbereitung auf Ihren geplanten Aufenthalt – inkl. Checklisten und Packliste.",
                benefits: ["Checklisten zur Vorbereitung (2-3 Wochen vorher)", "Was Sie mitbringen sollten", "Beatmung und Aufwachphase erklärt", "Praktische Vorlagen & Notfallkontakte"],
                price: "4,99 €",
                link: "https://paulrawe.gumroad.com/l/hucwg"
            },
            bundle: {
                title: "Bundle: Beide Ratgeber kombiniert",
                badge: "Spare 20%",
                description: "Angehörigen- und Patienten-Ratgeber zusammen – für gemeinsame Orientierung.",
                benefits: ["Beide Perspektiven verstehen", "Vollständiges Paket mit allen Checklisten", "Sie sparen 1,99 €"],
                price: "7,99 €",
                link: "https://paulrawe.gumroad.com/l/otohnp"
            }
        };

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
                return {text: 'Sie brauchen jetzt sofort konkrete Hilfe. Diese Soforthilfe gibt Ihnen die wichtigsten Fragen und Begriffe an die Hand.', products: ['soforthilfe']};
            }
            if (q2 === 'schwierige-entscheidung') {
                return {text: 'Bei schwierigen Entscheidungen brauchen Sie klare Orientierung. Dieser Ratgeber hilft Ihnen, die richtigen Fragen zu stellen.', products: ['schwierige']};
            }
            if (q1 === 'patient-geplant') {
                if (q3 === 'alles') {
                    return {text: 'Als Patient brauchen Sie umfassende Vorbereitung. Dieser Ratgeber begleitet Sie durch alle Phasen.', products: ['patienten']};
                } else {
                    return {text: 'Bereiten Sie sich optimal vor. Diese Kombination gibt Ihnen sowohl Soforthilfe als auch Hintergrundwissen.', products: ['soforthilfe', 'patienten']};
                }
            }
            if (q1 === 'angehoeriger-akut') {
                if (q3 === 'alles') {
                    return {text: 'Sie brauchen umfassende Orientierung. Dieser Ratgeber beantwortet alle wichtigen Fragen für Angehörige.', products: ['angehoerige']};
                } else if (q3 === 'sofort-fragen') {
                    return {text: 'Sie brauchen jetzt konkrete Hilfe. Diese Soforthilfe gibt Ihnen die wichtigsten Fragen an die Hand.', products: ['soforthilfe']};
                } else {
                    return {text: 'Diese Kombination gibt Ihnen sowohl Soforthilfe als auch umfassendes Hintergrundwissen.', products: ['soforthilfe', 'angehoerige']};
                }
            }
            if (q1 === 'vorbereitung') {
                if (q3 === 'alles') {
                    return {text: 'Für umfassende Information empfehlen wir beide Ratgeber – so verstehen Sie beide Perspektiven.', products: ['bundle']};
                } else {
                    return {text: 'Starten Sie mit der Soforthilfe und erweitern Sie bei Bedarf mit dem vollständigen Ratgeber.', products: ['soforthilfe']};
                }
            }
            return {text: 'Basierend auf Ihren Antworten empfehlen wir Ihnen diese Ratgeber für optimale Orientierung.', products: ['soforthilfe', 'angehoerige']};
        }

        function qcRestart() {
            qcCurrentQuestion = 1;
            qcAnswers = {};
            document.querySelector('.qc-progress-bar').style.display = 'block';
            document.querySelector('.qc-progress-indicator').style.display = 'block';
            document.getElementById('qcProgressFill').style.width = '0%';
            document.getElementById('qcProgressText').textContent = 'Frage 1 von 3';
            document.querySelectorAll('.quick-check-question').forEach(q => {q.classList.remove('active');});
            document.querySelector('[data-qc-question="1"]').classList.add('active');
            document.getElementById('qcResultsSection').classList.remove('show');
        }

        const restartBtn = document.getElementById('qcRestartButton');
        if (restartBtn) {
            restartBtn.addEventListener('click', qcRestart);
        }
    }

    function injectQuickCheck() {
        if (!shouldLoadQuickCheck()) return;
        
        const footer = document.querySelector('footer');
        if (!footer) {
            console.log('Quick Check: Footer nicht gefunden');
            return;
        }
        
        if (document.querySelector('.qc-container')) return;
        
        const wrapper = document.createElement('div');
        wrapper.innerHTML = getQuickCheckHTML();
        footer.parentNode.insertBefore(wrapper, footer);
        
        setTimeout(function() {
            initQuickCheckFunctionality();
            console.log('Quick Check Funnel erfolgreich geladen!');
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectQuickCheck);
    } else {
        injectQuickCheck();
    }
})();
