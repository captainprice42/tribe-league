// ╔══════════════════════════════════════════════════════════════╗
// ║  🎨 TRIBE LEAGUE THEME SYSTEM                               ║
// ║  14 Takım Teması + Karanlık/Aydınlık                        ║
// ║  LocalStorage ile kalıcı                                     ║
// ╚══════════════════════════════════════════════════════════════╝

(function () {
    'use strict';

    const STORAGE_KEY = 'tribe-league-theme';

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  TEMALAR - Her tema kontrast için optimize edildi           ║
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
        galatasaray: {
            name: "Galatasaray",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#1a0808",
                "--bg-card": "#2a1212",
                "--bg-glass": "rgba(42, 18, 18, 0.95)",
                "--primary": "#ffd700",
                "--primary-glow": "rgba(255, 215, 0, 0.4)",
                "--accent": "#ff0000",
                "--text-main": "#ffffff",
                "--text-muted": "#ffcccc",
                "--text-on-primary": "#000000",
                "--border": "rgba(255, 215, 0, 0.2)",
                "--header-bg": "linear-gradient(135deg, #8b0000 0%, #4a0000 100%)"
            }
        },
        fenerbahce: {
            name: "Fenerbahçe",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#0a0a1a",
                "--bg-card": "#12123a",
                "--bg-glass": "rgba(18, 18, 58, 0.95)",
                "--primary": "#ffed00",
                "--primary-glow": "rgba(255, 237, 0, 0.4)",
                "--accent": "#0033a0",
                "--text-main": "#ffffff",
                "--text-muted": "#ccccff",
                "--text-on-primary": "#000000",
                "--border": "rgba(255, 237, 0, 0.2)",
                "--header-bg": "linear-gradient(135deg, #0033a0 0%, #001a50 100%)"
            }
        },
        besiktas: {
            name: "Beşiktaş",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#0a0a0a",
                "--bg-card": "#1a1a1a",
                "--bg-glass": "rgba(26, 26, 26, 0.95)",
                "--primary": "#ffffff",
                "--primary-glow": "rgba(255, 255, 255, 0.3)",
                "--accent": "#e0e0e0",
                "--text-main": "#ffffff",
                "--text-muted": "#999999",
                "--text-on-primary": "#000000",
                "--border": "rgba(255, 255, 255, 0.15)",
                "--header-bg": "linear-gradient(135deg, #333333 0%, #1a1a1a 100%)"
            }
        },
        trabzonspor: {
            name: "Trabzonspor",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#0a0510",
                "--bg-card": "#1a1025",
                "--bg-glass": "rgba(26, 16, 37, 0.95)",
                "--primary": "#00bfff",
                "--primary-glow": "rgba(0, 191, 255, 0.4)",
                "--accent": "#8b0000",
                "--text-main": "#ffffff",
                "--text-muted": "#ccaaff",
                "--text-on-primary": "#000000",
                "--border": "rgba(0, 191, 255, 0.2)",
                "--header-bg": "linear-gradient(135deg, #6b0000 0%, #400000 100%)"
            }
        },
        basaksehir: {
            name: "Başakşehir",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#100a05",
                "--bg-card": "#201510",
                "--bg-glass": "rgba(32, 21, 16, 0.95)",
                "--primary": "#ff6600",
                "--primary-glow": "rgba(255, 102, 0, 0.4)",
                "--accent": "#1a1a80",
                "--text-main": "#ffffff",
                "--text-muted": "#ffcc99",
                "--text-on-primary": "#000000",
                "--border": "rgba(255, 102, 0, 0.2)",
                "--header-bg": "linear-gradient(135deg, #1a1a80 0%, #0d0d40 100%)"
            }
        },
        alanyaspor: {
            name: "Alanyaspor",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#051005",
                "--bg-card": "#0a200a",
                "--bg-glass": "rgba(10, 32, 10, 0.95)",
                "--primary": "#ff8c00",
                "--primary-glow": "rgba(255, 140, 0, 0.4)",
                "--accent": "#228b22",
                "--text-main": "#ffffff",
                "--text-muted": "#aaffaa",
                "--text-on-primary": "#000000",
                "--border": "rgba(255, 140, 0, 0.2)",
                "--header-bg": "linear-gradient(135deg, #228b22 0%, #145214 100%)"
            }
        },
        antalyaspor: {
            name: "Antalyaspor",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#100505",
                "--bg-card": "#200a0a",
                "--bg-glass": "rgba(32, 10, 10, 0.95)",
                "--primary": "#ff3333",
                "--primary-glow": "rgba(255, 51, 51, 0.4)",
                "--accent": "#ffffff",
                "--text-main": "#ffffff",
                "--text-muted": "#ffaaaa",
                "--text-on-primary": "#ffffff",
                "--border": "rgba(255, 51, 51, 0.2)",
                "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)"
            }
        },
        konyaspor: {
            name: "Konyaspor",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#051005",
                "--bg-card": "#0a1f0a",
                "--bg-glass": "rgba(10, 31, 10, 0.95)",
                "--primary": "#00cc00",
                "--primary-glow": "rgba(0, 204, 0, 0.4)",
                "--accent": "#ffffff",
                "--text-main": "#ffffff",
                "--text-muted": "#aaffaa",
                "--text-on-primary": "#000000",
                "--border": "rgba(0, 204, 0, 0.2)",
                "--header-bg": "linear-gradient(135deg, #228b22 0%, #145214 100%)"
            }
        },
        samsunspor: {
            name: "Samsunspor",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#100505",
                "--bg-card": "#1f0a0a",
                "--bg-glass": "rgba(31, 10, 10, 0.95)",
                "--primary": "#ff4444",
                "--primary-glow": "rgba(255, 68, 68, 0.4)",
                "--accent": "#ffffff",
                "--text-main": "#ffffff",
                "--text-muted": "#ffaaaa",
                "--text-on-primary": "#ffffff",
                "--border": "rgba(255, 68, 68, 0.2)",
                "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)"
            }
        },
        kayserispor: {
            name: "Kayserispor",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#0f0a00",
                "--bg-card": "#1f1505",
                "--bg-glass": "rgba(31, 21, 5, 0.95)",
                "--primary": "#ffd700",
                "--primary-glow": "rgba(255, 215, 0, 0.4)",
                "--accent": "#cc0000",
                "--text-main": "#ffffff",
                "--text-muted": "#ffeeaa",
                "--text-on-primary": "#000000",
                "--border": "rgba(255, 215, 0, 0.2)",
                "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)"
            }
        },
        goztepe: {
            name: "Göztepe",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#0f0a00",
                "--bg-card": "#1f1500",
                "--bg-glass": "rgba(31, 21, 0, 0.95)",
                "--primary": "#ffd700",
                "--primary-glow": "rgba(255, 215, 0, 0.4)",
                "--accent": "#cc0000",
                "--text-main": "#ffffff",
                "--text-muted": "#ffeeaa",
                "--text-on-primary": "#000000",
                "--border": "rgba(255, 215, 0, 0.2)",
                "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)"
            }
        },
        gaziantep: {
            name: "Gaziantep FK",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#100505",
                "--bg-card": "#1f0a0a",
                "--bg-glass": "rgba(31, 10, 10, 0.95)",
                "--primary": "#ff3333",
                "--primary-glow": "rgba(255, 51, 51, 0.4)",
                "--accent": "#1a1a1a",
                "--text-main": "#ffffff",
                "--text-muted": "#ffaaaa",
                "--text-on-primary": "#ffffff",
                "--border": "rgba(255, 51, 51, 0.2)",
                "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)"
            }
        },
        eyupspor: {
            name: "Eyüpspor",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#0a0510",
                "--bg-card": "#150a1f",
                "--bg-glass": "rgba(21, 10, 31, 0.95)",
                "--primary": "#9932cc",
                "--primary-glow": "rgba(153, 50, 204, 0.4)",
                "--accent": "#ffd700",
                "--text-main": "#ffffff",
                "--text-muted": "#ddaaff",
                "--text-on-primary": "#ffffff",
                "--border": "rgba(153, 50, 204, 0.2)",
                "--header-bg": "linear-gradient(135deg, #6b0099 0%, #3d0057 100%)"
            }
        },
        genclerbirligi: {
            name: "Gençlerbirliği",
            icon: "fa-futbol",
            vars: {
                "--bg-body": "#0a0510",
                "--bg-card": "#150a1a",
                "--bg-glass": "rgba(21, 10, 26, 0.95)",
                "--primary": "#ff3333",
                "--primary-glow": "rgba(255, 51, 51, 0.4)",
                "--accent": "#1a1a1a",
                "--text-main": "#ffffff",
                "--text-muted": "#ffaacc",
                "--text-on-primary": "#ffffff",
                "--border": "rgba(255, 51, 51, 0.2)",
                "--header-bg": "linear-gradient(135deg, #cc0000 0%, #660000 100%)"
            }
        }
    };

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  TEMA UYGULA                                                ║
    // ╚══════════════════════════════════════════════════════════════╝
    function applyTheme(themeKey) {
        const theme = THEMES[themeKey];
        if (!theme) return;

        // Apply CSS variables
        Object.entries(theme.vars).forEach(([prop, value]) => {
            document.documentElement.style.setProperty(prop, value);
        });

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, themeKey);

        // Update active state in dropdown
        document.querySelectorAll('.tribe-theme-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.theme === themeKey);
        });

        // Update button icon
        const btn = document.querySelector('.tribe-theme-btn i');
        if (btn) {
            btn.className = `fas ${theme.icon}`;
        }
    }

    // ╔══════════════════════════════════════════════════════════════╗
    // ║  TEMA SEÇİCİ OLUŞTUR                                        ║
    // ╚══════════════════════════════════════════════════════════════╝
    function createThemeSwitcher() {
        // Prevent duplicate
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
                    box-shadow: 0 0 25px var(--primary-glow, rgba(196, 255, 14, 0.4));
                }
                .tribe-theme-dropdown {
                    position: absolute;
                    bottom: 65px;
                    right: 0;
                    background: var(--bg-card, #141419);
                    border: 1px solid var(--border, rgba(255,255,255,0.1));
                    border-radius: 16px;
                    padding: 15px;
                    min-width: 200px;
                    max-height: 60vh;
                    overflow-y: auto;
                    display: none;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                .tribe-theme-dropdown.active {
                    display: block;
                    animation: slideUp 0.3s ease;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .tribe-theme-title {
                    font-family: 'Teko', sans-serif;
                    font-size: 1.2rem;
                    color: var(--primary, #c4ff0e);
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--border, rgba(255,255,255,0.1));
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
                .tribe-theme-option:hover {
                    background: rgba(255,255,255,0.1);
                }
                .tribe-theme-option.active {
                    background: var(--primary, #c4ff0e);
                    color: var(--text-on-primary, #000);
                }
                .tribe-theme-icon {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    flex-shrink: 0;
                }
                .tribe-theme-option[data-theme="dark"] .tribe-theme-icon { background: #1a1a1a; color: #c4ff0e; }
                .tribe-theme-option[data-theme="light"] .tribe-theme-icon { background: #f0f2f5; color: #1a5c1a; border: 1px solid #ccc; }
                .tribe-theme-option[data-theme="galatasaray"] .tribe-theme-icon { background: linear-gradient(135deg, #ffd700, #ff0000); }
                .tribe-theme-option[data-theme="fenerbahce"] .tribe-theme-icon { background: linear-gradient(135deg, #ffed00, #0033a0); }
                .tribe-theme-option[data-theme="besiktas"] .tribe-theme-icon { background: linear-gradient(135deg, #fff, #000); }
                .tribe-theme-option[data-theme="trabzonspor"] .tribe-theme-icon { background: linear-gradient(135deg, #00bfff, #8b0000); }
                .tribe-theme-option[data-theme="basaksehir"] .tribe-theme-icon { background: linear-gradient(135deg, #ff6600, #1a1a80); }
                .tribe-theme-option[data-theme="alanyaspor"] .tribe-theme-icon { background: linear-gradient(135deg, #ff8c00, #228b22); }
                .tribe-theme-option[data-theme="antalyaspor"] .tribe-theme-icon { background: linear-gradient(135deg, #ff3333, #fff); }
                .tribe-theme-option[data-theme="konyaspor"] .tribe-theme-icon { background: linear-gradient(135deg, #00cc00, #fff); }
                .tribe-theme-option[data-theme="samsunspor"] .tribe-theme-icon { background: linear-gradient(135deg, #ff4444, #fff); }
                .tribe-theme-option[data-theme="kayserispor"] .tribe-theme-icon { background: linear-gradient(135deg, #ffd700, #cc0000); }
                .tribe-theme-option[data-theme="goztepe"] .tribe-theme-icon { background: linear-gradient(135deg, #ffd700, #cc0000); }
                .tribe-theme-option[data-theme="gaziantep"] .tribe-theme-icon { background: linear-gradient(135deg, #ff3333, #1a1a1a); }
                .tribe-theme-option[data-theme="eyupspor"] .tribe-theme-icon { background: linear-gradient(135deg, #9932cc, #ffd700); }
                .tribe-theme-option[data-theme="genclerbirligi"] .tribe-theme-icon { background: linear-gradient(135deg, #ff3333, #1a1a1a); }
                
                .tribe-theme-dropdown::-webkit-scrollbar { width: 6px; }
                .tribe-theme-dropdown::-webkit-scrollbar-track { background: transparent; }
                .tribe-theme-dropdown::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
            </style>
            
            <button class="tribe-theme-btn" onclick="TribeTheme.toggle()">
                <i class="fas fa-palette"></i>
            </button>
            
            <div class="tribe-theme-dropdown" id="tribeThemeDropdown">
                <div class="tribe-theme-title"><i class="fas fa-paint-brush"></i> Tema Seç</div>
                
                <div class="tribe-theme-section">Ana Temalar</div>
                <button class="tribe-theme-option" data-theme="dark" onclick="TribeTheme.apply('dark')">
                    <span class="tribe-theme-icon"><i class="fas fa-moon"></i></span>
                    <span>Karanlık</span>
                </button>
                <button class="tribe-theme-option" data-theme="light" onclick="TribeTheme.apply('light')">
                    <span class="tribe-theme-icon"><i class="fas fa-sun"></i></span>
                    <span>Aydınlık</span>
                </button>
                
                <div class="tribe-theme-section">Takım Temaları</div>
                ${Object.entries(THEMES).filter(([k]) => k !== 'dark' && k !== 'light').map(([key, theme]) => `
                    <button class="tribe-theme-option" data-theme="${key}" onclick="TribeTheme.apply('${key}')">
                        <span class="tribe-theme-icon"><i class="fas fa-futbol"></i></span>
                        <span>${theme.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        document.body.appendChild(container);

        // Close on outside click
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
