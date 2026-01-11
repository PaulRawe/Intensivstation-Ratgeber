// Sticky Sales Button - Dezent & nicht nervig
(function() {
    'use strict';
    
    const DISMISSED_KEY = 'sticky_sales_dismissed';
    const SCROLL_THRESHOLD = 800; // Nach 800px Scrollen erscheint der Button
    
    // Prüfen ob Button bereits dismissed wurde
    function isDismissed() {
        return sessionStorage.getItem(DISMISSED_KEY) === 'true';
    }
    
    // Button dismissed speichern
    function setDismissed() {
        sessionStorage.setItem(DISMISSED_KEY, 'true');
    }
    
    // Sticky Button erstellen
    function createStickyButton() {
        if (isDismissed()) return;
        
        const button = document.createElement('div');
        button.id = 'sticky-sales-button';
        button.className = 'sticky-sales-button';
        button.innerHTML = `
            <button class="sticky-sales-close" aria-label="Schließen">×</button>
            <div class="sticky-sales-content">
                <div class="sticky-sales-icon">📚</div>
                <div class="sticky-sales-text">
                    <strong>Ratgeber</strong>
                    <span>ab 4,99 €</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(button);
        
        // Close-Button Event
        const closeBtn = button.querySelector('.sticky-sales-close');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            button.classList.remove('visible');
            setTimeout(() => button.remove(), 300);
            setDismissed();
        });
        
        // Klick auf Button = Scroll zur Sidebar
        button.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        
        return button;
    }
    
    // Scroll-Handler
    function handleScroll() {
        const button = document.getElementById('sticky-sales-button');
        if (!button) return;
        
        const scrolled = window.scrollY;
        
        if (scrolled > SCROLL_THRESHOLD) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }
    
    // Init
    document.addEventListener('DOMContentLoaded', function() {
        // Nur auf Artikel-Seiten, nicht auf Startseite
        const isArticlePage = document.querySelector('main .article-content');
        if (!isArticlePage || isDismissed()) return;
        
        createStickyButton();
        
        // Scroll-Listener mit Throttling
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    });
})();
