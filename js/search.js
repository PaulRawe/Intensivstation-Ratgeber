/* =========================================================
   search.js – sprachneutrale Suche für intensivstation-ratgeber.de

   Erkennt die Sprache an <html lang="…"> und lädt den passenden
   Index aus /search/index-<lang>.json. Neue Sprachen brauchen keine
   Anpassung an dieser Datei.

   Löst die alte Suche in js/cookie-consent.js ab, ohne diese zu
   verändern: Der Container bekommt bewusst die id "auto-search-box",
   weshalb insertSearchBox() dort früh zurückspringt. Die inneren
   Elemente heißen anders, damit der alte Handler nichts findet und
   kein zweites Ergebnis rendert.
   ========================================================= */
(function () {
    'use strict';

    var LANG = (document.documentElement.getAttribute('lang') || 'de')
        .toLowerCase().split('-')[0];

    // Oberflächentexte je Sprache. Fehlt eine Sprache, greift Deutsch.
    var UI = {
        de: {
            heading: 'Frage suchen',
            placeholder: 'z. B. Beatmung, Koma, Besuch …',
            none: 'Keine Frage gefunden. Versuchen Sie es mit einem anderen Wort.',
            one: 'Ergebnis',
            many: 'Ergebnisse'
        },
        tr: {
            heading: 'Soru ara',
            placeholder: 'örneğin solunum, koma, ziyaret …',
            none: 'Sonuç bulunamadı. Başka bir sözcük deneyin.',
            one: 'sonuç',
            many: 'sonuç'
        },
        ru: {
            heading: 'Поиск вопроса',
            placeholder: 'например: кома, аппарат, посещение …',
            none: 'Ничего не найдено. Попробуйте другое слово.',
            one: 'результат',
            many: 'результатов'
        },
        pl: {
            heading: 'Szukaj pytania',
            placeholder: 'np. śpiączka, oddech, odwiedziny …',
            none: 'Nic nie znaleziono. Spróbuj innego słowa.',
            one: 'wynik',
            many: 'wyników'
        }
    };

    var t = UI[LANG] || UI.de;

    /* ---------------------------------------------------------
       Normalisierung

       Türkisch braucht eine Sonderbehandlung: dotless ı und
       gepunktetes İ verhalten sich anders als im Lateinischen.
       Ein naives toLowerCase() lässt "IŞIK" nicht auf "ışık"
       passen. Zusätzlich werden Diakritika entfernt, damit
       jemand ohne türkische Tastatur "yogun bakim" tippen kann
       und trotzdem "yoğun bakım" findet – dasselbe gilt für
       deutsche Umlaute und polnische Sonderzeichen.
       --------------------------------------------------------- */
    var TR_MAP = { 'I': 'ı', 'İ': 'i', 'Ş': 'ş', 'Ğ': 'ğ', 'Ç': 'ç', 'Ö': 'ö', 'Ü': 'ü' };

    function normalize(s) {
        if (!s) return '';
        if (LANG === 'tr') {
            s = s.replace(/[IİŞĞÇÖÜ]/g, function (c) { return TR_MAP[c]; });
        }
        s = s.toLowerCase();
        // Diakritika entfernen, ß und ı gesondert behandeln
        s = s.replace(/ß/g, 'ss').replace(/ı/g, 'i').replace(/ł/g, 'l');
        if (s.normalize) {
            s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        return s;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    var items = [];
    var loaded = false;

    function insertBox() {
        if (document.getElementById('auto-search-box')) return null;
        var anchor = document.querySelector('nav');
        if (!anchor) {
            anchor = document.querySelector('main');
            if (!anchor) return null;
        }
        var box = document.createElement('div');
        box.className = 'search-box';
        box.id = 'auto-search-box';
        box.innerHTML =
            '<h2>' + escapeHtml(t.heading) + '</h2>' +
            '<input type="search" id="siteSearchInput" autocomplete="off" ' +
            'aria-label="' + escapeHtml(t.heading) + '" ' +
            'placeholder="' + escapeHtml(t.placeholder) + '">' +
            '<div id="siteSearchResults" role="region" aria-live="polite"></div>';

        if (anchor.tagName === 'NAV') {
            anchor.insertAdjacentElement('afterend', box);
        } else {
            anchor.insertAdjacentElement('afterbegin', box);
        }
        return box;
    }

    function render(results) {
        var div = document.getElementById('siteSearchResults');
        if (!div) return;

        if (!results.length) {
            div.innerHTML = '<div class="search-results-container">' +
                '<p class="search-empty">' + escapeHtml(t.none) + '</p></div>';
            div.style.display = 'block';
            return;
        }

        var label = results.length === 1 ? t.one : t.many;
        var html = '<div class="search-results-container">' +
            '<p class="search-count">' + results.length + ' ' + escapeHtml(label) + '</p>' +
            '<ul class="search-results-list">';
        results.forEach(function (r) {
            html += '<li class="search-result-item">' +
                '<a class="search-result-link" href="' + escapeHtml(r.u) + '">' +
                escapeHtml(r.t) + '</a></li>';
        });
        html += '</ul></div>';
        div.innerHTML = html;
        div.style.display = 'block';
    }

    function search() {
        var input = document.getElementById('siteSearchInput');
        var div = document.getElementById('siteSearchResults');
        if (!input || !div) return;

        var q = normalize(input.value).trim();
        if (q.length < 2) {
            div.style.display = 'none';
            div.innerHTML = '';
            return;
        }
        if (!loaded) return;

        var terms = q.split(/\s+/);

        var hits = items.map(function (it) {
            var title = it._nt;
            var keys = it._nk;
            var score = 0;
            for (var i = 0; i < terms.length; i++) {
                var term = terms[i];
                if (title.indexOf(term) !== -1) {
                    score += title.indexOf(term) === 0 ? 12 : 8;
                } else if (keys.indexOf(term) !== -1) {
                    score += 3;
                } else {
                    return null; // alle Begriffe müssen vorkommen
                }
            }
            return { it: it, score: score };
        }).filter(Boolean);

        hits.sort(function (a, b) {
            return b.score - a.score || a.it.t.localeCompare(b.it.t, LANG);
        });

        render(hits.slice(0, 25).map(function (h) { return h.it; }));
    }

    function load() {
        var url = '/search/index-' + LANG + '.json';
        fetch(url, { cache: 'no-cache' })
            .then(function (r) {
                if (!r.ok) throw new Error(r.status);
                return r.json();
            })
            .then(function (data) {
                items = (data.items || []).map(function (it) {
                    it._nt = normalize(it.t);
                    it._nk = normalize(it.k || '');
                    return it;
                });
                loaded = true;
                search(); // falls schon getippt wurde
            })
            .catch(function () {
                // Ohne Index bleibt die Maske stehen, aber stumm.
                // Besser als eine Suche, die falsche "keine Treffer" meldet.
                var box = document.getElementById('auto-search-box');
                if (box) box.style.display = 'none';
            });
    }

    function init() {
        if (!insertBox()) return;
        var input = document.getElementById('siteSearchInput');
        if (input) {
            input.addEventListener('input', search);
            input.addEventListener('search', search);
        }
        load();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
