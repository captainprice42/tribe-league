// ╔══════════════════════════════════════════════════════════════╗
// ║  🎨 TRIBE LEAGUE THEME & NAVIGATION SYSTEM                  ║
// ║  14 Takım Teması + Karanlık/Aydınlık + Navigasyon           ║
// ║  LocalStorage ile kalıcı                                     ║
// ╚══════════════════════════════════════════════════════════════╝

(function () {
    'use strict';

    const STORAGE_KEY = 'tribe-league-theme';

    // Sayfa path'ini belirle (pages/ içinde mi değil mi)
    const isInPagesFolder = window.location.pathname.includes('/pages/');
    const basePath = isInPagesFolder ? '../' : './';
    const pagesPath = isInPagesFolder ? './' : './pages/';

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  NAVİGASYON MENÜSÜ                                          ║
    // ╚══════════════════════════════════════════════════════════════╝
    const NAV_ITEMS = [
        { name: 'Ana Sayfa', href: 'index.html', icon: 'fa-home', isRoot: true },
        { name: 'Puan Durumu', href: 'standings.html', icon: 'fa-trophy' },
        { name: 'Fikstür', href: 'fixtures.html', icon: 'fa-calendar-alt' },
        { name: 'Gol Kralları', href: 'scorers.html', icon: 'fa-futbol' },
        { name: 'Asist Kralları', href: 'assists.html', icon: 'fa-hands-helping' },
        { name: 'Ziraat Kupası', href: 'ziraatkupasison16.html', icon: 'fa-award' },
        { name: 'H2H', href: 'h2h-pro.html', icon: 'fa-exchange-alt' }
    ];

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  TEMALAR                                                    ║
    // ╚══════════════════════════════════════════════════════════════╝
    const THEMES = {
        dark: {
            name: "Karanlık",
            icon: "fa-moon",
            vars: {
                "--bg-body": "#0a0a0e",
                "--bg-card": "#141419",
                "--bg-glass": "rgba(20, 20, 25, 0.95)",
                "--primary": "#c4ff0e",
                "--primary-glow": "rgba(196, 255, 14, 0.4)",
                "--accent": "#00d4ff",
                "--text-main": "#ffffff",
                "--text-muted": "#8b8b96",
                "--text-on-primary": "#000000",
                "--header-text": "#c4ff0e",
                "--border": "rgba(255, 255, 255, 0.08)",
                "--header-bg": "linear-gradient(135deg, #222 0%, #111 100%)"
            }
        },
        light: {
            name: "Aydınlık",
            icon: "fa-sun",
            vars: {
                "--bg-body": "#f0f2f5",
                "--bg-card": "#ffffff",
                "--bg-glass": "rgba(255, 255, 255, 0.95)",
                "--primary": "#1a1a1a",
                "--primary-glow": "rgba(0, 0, 0, 0.2)",
                "--accent": "#555555",
                "--text-main": "#1a1a1a",
                "--text-muted": "#666666",
                "--text-on-primary": "#ffffff",
                "--header-text": "#ffffff",
                "--border": "rgba(0, 0, 0, 0.1)",
                "--header-bg": "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)"
            }
        },
        galatasaray: { name: "Galatasaray", icon: "fa-futbol", vars: { "--bg-body": "#1a0808", "--bg-card": "#2a1212", "--bg-glass": "rgba(42, 18, 18, 0.95)", "--primary": "#ffd700", "--primary-glow": "rgba(255, 215, 0, 0.4)", "--accent": "#ff0000", "--text-main": "#ffffff", "--text-muted": "#ffcccc", "--text-on-primary": "#000000", "--border": "rgba(255, 215, 0, 0.2)", "--header-bg": "linear-gradient(135deg, #8b0000 0%, #4a0000 100%)" } },
        fenerbahce: { name: "Fenerbahçe", icon: "fa-futbol", vars: { "--bg-body": "#0a0a1a", "--bg-card": "#12123a", "--bg-glass": "rgba(18, 18, 58, 0.95)", "--primary": "#ffed00", "--primary-glow": "rgba(255, 237, 0, 0.4)", "--accent": "#0033a0", "--text-main": "#ffffff", "--text-muted": "#ccccff", "--text-on-primary": "#000000", "--border": "rgba(255, 237, 0, 0.2)", "--header-bg": "linear-gradient(135deg, #0033a0 0%, #001a50 100%)" } },
        besiktas: { name: "Beşiktaş", icon: "fa-futbol", vars: { "--bg-body": "#0a0a0a", "--bg-card": "#1a1a1a", "--bg-glass": "rgba(26, 26, 26, 0.95)", "--primary": "#ffffff", "--primary-glow": "rgba(255, 255, 255, 0.3)", "--accent": "#e0e0e0", "--text-main": "#ffffff", "--text-muted": "#999999", "--text-on-primary": "#000000", "--border": "rgba(255, 255, 255, 0.15)", "--header-bg": "linear-gradient(135deg, #333333 0%, #1a1a1a 100%)" } },
        trabzonspor: { name: "Trabzonspor", icon: "fa-futbol", vars: { "--bg-body": "#0a0510", "--bg-card": "#1a1025", "--bg-glass": "rgba(26, 16, 37, 0.95)", "--primary": "#00bfff", "--primary-glow": "rgba(0, 191, 255, 0.4)", "--accent": "#8b0000", "--text-main": "#ffffff", "--text-muted": "#ccaaff", "--text-on-primary": "#000000", "--border": "rgba(0, 191, 255, 0.2)", "--header-bg": "linear-gradient(135deg, #6b0000 0%, #400000 100%)" } },
        basaksehir: { name: "Başakşehir", icon: "fa-futbol", vars: { "--bg-body": "#100a05", "--bg-card": "#201510", "--bg-glass": "rgba(32, 21, 16, 0.95)", "--primary": "#ff6600", "--primary-glow": "rgba(255, 102, 0, 0.4)", "--accent": "#1a1a80", "--text-main": "#ffffff", "--text-muted": "#ffcc99", "--text-on-primary": "#000000", "--border": "rgba(255, 102, 0, 0.2)", "--header-bg": "linear-gradient(135deg, #1a1a80 0%, #0d0d40 100%)" } },
        alanyaspor: { name: "Alanyaspor", icon: "fa-futbol", vars: { "--bg-body": "#051005", "--bg-card": "#0a200a", "--bg-glass": "rgba(10, 32, 10, 0.95)", "--primary": "#ff8c00", "--primary-glow": "rgba(255, 140, 0, 0.4)", "--accent": "#228b22", "--text-main": "#ffffff", "--text-muted": "#aaffaa", "--text-on-primary": "#000000", "--border": "rgba(255, 140, 0, 0.2)", "--header-bg": "linear-gradient(135deg, #228b22 0%, #145214 100%)" } },
        antalyaspor: { name: "Antalyaspor", icon: "fa-futbol", vars: { "--bg-body": "#100505", "--bg-card": "#200a0a", "--bg-glass": "rgba(32, 10, 10, 0.95)", "--primary": "#ff3333", "--primary-glow": "rgba(255, 51, 51, 0.4)", "--accent": "#ffffff", "--text-main": "#ffffff", "--text-muted": "#ffaaaa", "--text-on-primary": "#ffffff", "--border": "rgba(255, 51, 51, 0.2)", "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)" } },
        konyaspor: { name: "Konyaspor", icon: "fa-futbol", vars: { "--bg-body": "#051005", "--bg-card": "#0a1f0a", "--bg-glass": "rgba(10, 31, 10, 0.95)", "--primary": "#00cc00", "--primary-glow": "rgba(0, 204, 0, 0.4)", "--accent": "#ffffff", "--text-main": "#ffffff", "--text-muted": "#aaffaa", "--text-on-primary": "#000000", "--border": "rgba(0, 204, 0, 0.2)", "--header-bg": "linear-gradient(135deg, #228b22 0%, #145214 100%)" } },
        samsunspor: { name: "Samsunspor", icon: "fa-futbol", vars: { "--bg-body": "#100505", "--bg-card": "#1f0a0a", "--bg-glass": "rgba(31, 10, 10, 0.95)", "--primary": "#ff4444", "--primary-glow": "rgba(255, 68, 68, 0.4)", "--accent": "#ffffff", "--text-main": "#ffffff", "--text-muted": "#ffaaaa", "--text-on-primary": "#ffffff", "--border": "rgba(255, 68, 68, 0.2)", "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)" } },
        kayserispor: { name: "Kayserispor", icon: "fa-futbol", vars: { "--bg-body": "#0f0a00", "--bg-card": "#1f1505", "--bg-glass": "rgba(31, 21, 5, 0.95)", "--primary": "#ffd700", "--primary-glow": "rgba(255, 215, 0, 0.4)", "--accent": "#cc0000", "--text-main": "#ffffff", "--text-muted": "#ffeeaa", "--text-on-primary": "#000000", "--border": "rgba(255, 215, 0, 0.2)", "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)" } },
        goztepe: { name: "Göztepe", icon: "fa-futbol", vars: { "--bg-body": "#0f0a00", "--bg-card": "#1f1500", "--bg-glass": "rgba(31, 21, 0, 0.95)", "--primary": "#ffd700", "--primary-glow": "rgba(255, 215, 0, 0.4)", "--accent": "#cc0000", "--text-main": "#ffffff", "--text-muted": "#ffeeaa", "--text-on-primary": "#000000", "--border": "rgba(255, 215, 0, 0.2)", "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)" } },
        gaziantep: { name: "Gaziantep FK", icon: "fa-futbol", vars: { "--bg-body": "#100505", "--bg-card": "#1f0a0a", "--bg-glass": "rgba(31, 10, 10, 0.95)", "--primary": "#ff3333", "--primary-glow": "rgba(255, 51, 51, 0.4)", "--accent": "#1a1a1a", "--text-main": "#ffffff", "--text-muted": "#ffaaaa", "--text-on-primary": "#ffffff", "--border": "rgba(255, 51, 51, 0.2)", "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)" } },
        eyupspor: { name: "Eyüpspor", icon: "fa-futbol", vars: { "--bg-body": "#0a0510", "--bg-card": "#150a1f", "--bg-glass": "rgba(21, 10, 31, 0.95)", "--primary": "#9932cc", "--primary-glow": "rgba(153, 50, 204, 0.4)", "--accent": "#ffd700", "--text-main": "#ffffff", "--text-muted": "#ddaaff", "--text-on-primary": "#ffffff", "--border": "rgba(153, 50, 204, 0.2)", "--header-bg": "linear-gradient(135deg, #6b0099 0%, #3d0057 100%)" } },
        genclerbirligi: { name: "Gençlerbirliği", icon: "fa-futbol", vars: { "--bg-body": "#0a0510", "--bg-card": "#150a1a", "--bg-glass": "rgba(21, 10, 26, 0.95)", "--primary": "#ff3333", "--primary-glow": "rgba(255, 51, 51, 0.4)", "--accent": "#1a1a1a", "--text-main": "#ffffff", "--text-muted": "#ffaacc", "--text-on-primary": "#ffffff", "--border": "rgba(255, 51, 51, 0.2)", "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)" } }
    };

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  TEMA UYGULA                                                ║
    // ╚══════════════════════════════════════════════════════════════╝
    function applyTheme(themeKey) {
        const theme = THEMES[themeKey];
        if (!theme) return;

        Object.entries(theme.vars).forEach(([prop, value]) => {
            document.documentElement.style.setProperty(prop, value);
        });

        localStorage.setItem(STORAGE_KEY, themeKey);

        document.querySelectorAll('.tribe-theme-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.theme === themeKey);
        });

        const btn = document.querySelector('.tribe-theme-btn i');
        if (btn) btn.className = `fas ${theme.icon}`;
    }

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  NAVİGASYON OLUŞTUR                                         ║
    // ╚══════════════════════════════════════════════════════════════╝
    function createNavigation() {
        if (document.getElementById('tribeNavigation')) return;

        // Viewport meta tag ekle (yoksa)
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }

        // Global mobil stilleri ekle
        const globalStyles = document.createElement('style');
        globalStyles.id = 'tribeMobileStyles';
        globalStyles.textContent = `
            /* Global Mobile Fixes */
            html, body {
                overflow-x: hidden !important;
                width: 100% !important;
                max-width: 100vw !important;
            }
            * {
                box-sizing: border-box !important;
            }
            @media (max-width: 768px) {
                .special-container, .container, .content-wrapper, main {
                    padding: 10px !important;
                    margin: 10px auto !important;
                    max-width: 100% !important;
                    overflow-x: hidden !important;
                }
                table {
                    display: block !important;
                    overflow-x: auto !important;
                    white-space: nowrap !important;
                    max-width: 100% !important;
                    font-size: 0.8rem !important;
                }
                .header-banner h1, h1 {
                    font-size: 1.8rem !important;
                }
                .header-banner h2, h2 {
                    font-size: 1.2rem !important;
                }
            }
        `;
        document.head.appendChild(globalStyles);

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        const nav = document.createElement('nav');
        nav.id = 'tribeNavigation';
        nav.innerHTML = `
            <style>
                #tribeNavigation {
                    background: var(--header-bg, linear-gradient(135deg, #222 0%, #111 100%));
                    border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
                    padding: 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    font-family: 'Outfit', sans-serif;
                    width: 100%;
                }
                .tribe-nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 15px;
                    min-height: 60px;
                }
                .tribe-nav-logo {
                    font-family: 'Teko', sans-serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: var(--primary, #c4ff0e);
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 0;
                    text-shadow: 0 0 20px var(--primary-glow, rgba(196, 255, 14, 0.4));
                    flex-shrink: 0;
                }
                .tribe-nav-logo i {
                    font-size: 1.3rem;
                }
                .tribe-nav-links {
                    display: flex;
                    gap: 3px;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }
                .tribe-nav-link {
                    color: var(--text-main, #fff);
                    text-decoration: none;
                    padding: 10px 12px;
                    border-radius: 8px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    white-space: nowrap;
                }
                .tribe-nav-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--primary, #c4ff0e);
                }
                .tribe-nav-link.active {
                    background: var(--primary, #c4ff0e);
                    color: var(--text-on-primary, #000);
                }
                .tribe-nav-link i {
                    font-size: 0.8rem;
                }
                .tribe-nav-toggle {
                    display: none;
                    background: var(--bg-card, #141419);
                    border: 2px solid var(--border, rgba(255,255,255,0.1));
                    color: var(--primary, #c4ff0e);
                    font-size: 1.3rem;
                    cursor: pointer;
                    padding: 10px 14px;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                .tribe-nav-toggle:hover {
                    border-color: var(--primary, #c4ff0e);
                }
                
                /* Tablet */
                @media (max-width: 1024px) {
                    .tribe-nav-link {
                        padding: 8px 10px;
                        font-size: 0.8rem;
                    }
                    .tribe-nav-link span.nav-text {
                        display: none;
                    }
                }
                
                /* Mobile */
                @media (max-width: 768px) {
                    .tribe-nav-container {
                        padding: 0 10px;
                    }
                    .tribe-nav-logo {
                        font-size: 1.4rem;
                    }
                    .tribe-nav-logo i {
                        font-size: 1.1rem;
                    }
                    .tribe-nav-links {
                        display: none;
                        position: fixed;
                        top: 60px;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: var(--bg-body, #0a0a0e);
                        flex-direction: column;
                        padding: 20px;
                        gap: 10px;
                        overflow-y: auto;
                        z-index: 999;
                    }
                    .tribe-nav-links.active {
                        display: flex;
                    }
                    .tribe-nav-toggle {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .tribe-nav-link {
                        padding: 15px 20px;
                        font-size: 1rem;
                        border-radius: 12px;
                        background: var(--bg-card, #141419);
                        border: 1px solid var(--border, rgba(255,255,255,0.08));
                    }
                    .tribe-nav-link span.nav-text {
                        display: inline;
                    }
                    .tribe-nav-link i {
                        font-size: 1rem;
                        width: 24px;
                    }
                }
            </style>
            <div class="tribe-nav-container">
                <a href="${basePath}index.html" class="tribe-nav-logo">
                    <i class="fas fa-futbol"></i>
                    <span>TRIBE</span>
                </a>
                <button class="tribe-nav-toggle" onclick="document.querySelector('.tribe-nav-links').classList.toggle('active'); this.querySelector('i').classList.toggle('fa-bars'); this.querySelector('i').classList.toggle('fa-times');">
                    <i class="fas fa-bars"></i>
                </button>
                <ul class="tribe-nav-links">
                    ${NAV_ITEMS.map(item => {
            const href = item.isRoot ? basePath + item.href : pagesPath + item.href;
            const isActive = currentPage === item.href;
            return `<li><a href="${href}" class="tribe-nav-link ${isActive ? 'active' : ''}"><i class="fas ${item.icon}"></i> <span class="nav-text">${item.name}</span></a></li>`;
        }).join('')}
                </ul>
            </div>
        `;

        document.body.insertBefore(nav, document.body.firstChild);

        // Menü dışına tıklanınca kapat
        document.addEventListener('click', (e) => {
            const navLinks = document.querySelector('.tribe-nav-links');
            const toggle = document.querySelector('.tribe-nav-toggle');
            if (navLinks && toggle && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }


    // ╔══════════════════════════════════════════════════════════════╗
    // ║  TEMA SEÇİCİ OLUŞTUR                                        ║
    // ╚══════════════════════════════════════════════════════════════╝
    function createThemeSwitcher() {
        if (document.getElementById('tribeThemeSwitcher')) return;

        const container = document.createElement('div');
        container.id = 'tribeThemeSwitcher';
        container.innerHTML = `
            <style>
                #tribeThemeSwitcher {
                    position: fixed;
                    bottom: 25px;
                    right: 25px;
                    z-index: 9999;
                    font-family: 'Outfit', sans-serif;
                }
                .tribe-theme-btn {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    background: var(--bg-card, #141419);
                    border: 2px solid var(--border, rgba(255,255,255,0.1));
                    color: var(--primary, #c4ff0e);
                    font-size: 1.4rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                }
                .tribe-theme-btn:hover {
                    transform: scale(1.1);
                    border-color: var(--primary, #c4ff0e);
                }
                .tribe-theme-dropdown {
                    position: absolute;
                    bottom: 65px;
                    right: 0;
                    background: var(--bg-card, #141419);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 15px;
                    min-width: 200px;
                    max-height: 60vh;
                    overflow-y: auto;
                    display: none;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                .tribe-theme-dropdown.active { display: block; }
                .tribe-theme-title {
                    font-family: 'Teko', sans-serif;
                    font-size: 1.2rem;
                    color: var(--primary, #c4ff0e);
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .tribe-theme-section {
                    font-size: 0.7rem;
                    color: var(--text-muted, #888);
                    text-transform: uppercase;
                    padding: 10px 0 5px;
                    letter-spacing: 1px;
                }
                .tribe-theme-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 12px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: 0.2s;
                    margin-bottom: 4px;
                    background: transparent;
                    border: none;
                    width: 100%;
                    color: var(--text-main, #fff);
                    font-family: 'Outfit', sans-serif;
                    font-size: 0.9rem;
                    text-align: left;
                }
                .tribe-theme-option:hover { background: rgba(255,255,255,0.1); }
                .tribe-theme-option.active { background: var(--primary, #c4ff0e); color: var(--text-on-primary, #000); }
                .tribe-theme-icon {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                }
            </style>
            <button class="tribe-theme-btn" onclick="TribeTheme.toggle()">
                <i class="fas fa-palette"></i>
            </button>
            <div class="tribe-theme-dropdown" id="tribeThemeDropdown">
                <div class="tribe-theme-title"><i class="fas fa-paint-brush"></i> Tema Seç</div>
                <div class="tribe-theme-section">Ana Temalar</div>
                <button class="tribe-theme-option" data-theme="dark" onclick="TribeTheme.apply('dark')">
                    <span class="tribe-theme-icon"><i class="fas fa-moon"></i></span><span>Karanlık</span>
                </button>
                <button class="tribe-theme-option" data-theme="light" onclick="TribeTheme.apply('light')">
                    <span class="tribe-theme-icon"><i class="fas fa-sun"></i></span><span>Aydınlık</span>
                </button>
                <div class="tribe-theme-section">Takım Temaları</div>
                ${Object.entries(THEMES).filter(([k]) => k !== 'dark' && k !== 'light').map(([key, theme]) => `
                    <button class="tribe-theme-option" data-theme="${key}" onclick="TribeTheme.apply('${key}')">
                        <span class="tribe-theme-icon"><i class="fas fa-futbol"></i></span><span>${theme.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        document.body.appendChild(container);

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                document.getElementById('tribeThemeDropdown')?.classList.remove('active');
            }
        });
    }

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  GLOBAL API                                                 ║
    // ╚══════════════════════════════════════════════════════════════╝
    window.TribeTheme = {
        apply: applyTheme,
        toggle: function () {
            document.getElementById('tribeThemeDropdown')?.classList.toggle('active');
        },
        init: function () {
            createNavigation();
            createThemeSwitcher();
            const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
            applyTheme(saved);
        }
    };

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TribeTheme.init());
    } else {
        TribeTheme.init();
    }
})();
