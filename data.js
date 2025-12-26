// ╔══════════════════════════════════════════════════════════════╗
// ║  📊 TRIBE LEAGUE - MERKEZİ VERİ DOSYASI                     ║
// ║  Tüm maç sonuçları, goller, asistler burada saklanır        ║
// ║  Son güncelleme: 2024-12-25                                 ║
// ╚══════════════════════════════════════════════════════════════╝

const TribeData = {

    // ═══════════════════════════════════════════════════════════════
    // 🏆 TAKIM BİLGİLERİ
    // ═══════════════════════════════════════════════════════════════
    teams: {
        "Galatasaray": {
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Galatasaray_Sports_Club_Logo.svg/1200px-Galatasaray_Sports_Club_Logo.svg.png",
            shortName: "GS",
            colors: { primary: "#FFD700", secondary: "#C8102E" },
            players: []
        },
        "Fenerbahçe": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/8/86/Fenerbah%C3%A7e_SK.png/250px-Fenerbah%C3%A7e_SK.png",
            shortName: "FB",
            colors: { primary: "#FFED00", secondary: "#00205B" },
            players: []
        },
        "Beşiktaş": {
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/BesiktasJK-Logo.svg/250px-BesiktasJK-Logo.svg.png",
            shortName: "BJK",
            colors: { primary: "#ffffff", secondary: "#1a1a1a" },
            players: []
        },
        "Trabzonspor": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/a/ab/TrabzonsporAmblemi.png",
            shortName: "TS",
            colors: { primary: "#6D1E2A", secondary: "#0E4C92" },
            players: []
        },
        "Başakşehir": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/c/cd/%C4%B0stanbul_Ba%C5%9Fak%C5%9Fehir_FK.png/250px-%C4%B0stanbul_Ba%C5%9Fak%C5%9Fehir_FK.png",
            shortName: "IBFK",
            colors: { primary: "#f26522", secondary: "#273a7e" },
            players: []
        },
        "Alanyaspor": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/2/29/Alanyaspor_logo.png/250px-Alanyaspor_logo.png",
            shortName: "ALN",
            colors: { primary: "#ff6600", secondary: "#228B22" },
            players: []
        },
        "Antalyaspor": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/b/b9/Antalyaspor_logo.png/250px-Antalyaspor_logo.png",
            shortName: "ANT",
            colors: { primary: "#CC0000", secondary: "#1a0000" },
            players: []
        },
        "Konyaspor": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/4/41/Konyaspor_1922.png/250px-Konyaspor_1922.png",
            shortName: "KON",
            colors: { primary: "#2E7D32", secondary: "#1a3d1c" },
            players: []
        },
        "Samsunspor": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/d/d2/Samsunspor_logo.png/250px-Samsunspor_logo.png",
            shortName: "SAM",
            colors: { primary: "#e31e24", secondary: "#1a0505" },
            players: []
        },
        "Kayserispor": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/c/c2/Kayserispor_logosu.png/250px-Kayserispor_logosu.png",
            shortName: "KAY",
            colors: { primary: "#FFD700", secondary: "#D4001F" },
            players: []
        },
        "Göztepe": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/thumb/f/fe/G%C3%B6ztepe.png/250px-G%C3%B6ztepe.png",
            shortName: "GOZ",
            colors: { primary: "#FFCC00", secondary: "#D4001F" },
            players: [
                { "number": 1, "name": "B. Bayazıt", "position": "GK" },
                { "number": 3, "name": "S. Denswil", "position": "DF" },
                { "number": 2, "name": "M. Hosseini", "position": "DF" },
                { "number": 4, "name": "R. Civelek", "position": "DF" },
                { "number": 5, "name": "L. Carole", "position": "DF" },
                { "number": 6, "name": "G. Jung", "position": "DF" },
                { "number": 7, "name": "D. Toköz", "position": "MF" },
                { "number": 8, "name": "João Mendes", "position": "MF" },
                { "number": 9, "name": "Youssef Aït Bennasser", "position": "MF" },
                { "number": 10, "name": "L. Benes", "position": "FW" },
                { "number": 11, "name": "Carlos Mané", "position": "FW" },
                { "number": 12, "name": "Miguel Cardoso", "position": "FW" },
                { "number": 13, "name": "German Onugkha", "position": "FW" }
            ]
        },
        "Gaziantep": {
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/GFK-Official-Logo.png/250px-GFK-Official-Logo.png",
            shortName: "GFK",
            colors: { primary: "#D4001F", secondary: "#000000" },
            players: []
        },
        "Eyüpspor": {
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/Ey%C3%BCpspor_Logosu.png",
            shortName: "EYP",
            colors: { primary: "#8B0000", secondary: "#FFD700" },
            players: []
        },
        "Gençlerbirliği": {
            logo: "https://upload.wikimedia.org/wikipedia/tr/f/f7/Genclerbirligi.png",
            shortName: "GB",
            colors: { primary: "#d20000", secondary: "#000000" },
            players: []
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ⚽ MAÇ SONUÇLARI - Format: "EvSahibi skor1 skor2 Deplasman"
    // ═══════════════════════════════════════════════════════════════
    matches: [
        // Hafta 1
        { week: 1, home: "Fenerbahçe", homeScore: 0, awayScore: 0, away: "Göztepe" },
        { week: 1, home: "Konyaspor", homeScore: 0, awayScore: 0, away: "Antalyaspor" },
        { week: 1, home: "Başakşehir", homeScore: 2, awayScore: 0, away: "Galatasaray" },
        { week: 1, home: "Eyüpspor", homeScore: 0, awayScore: 2, away: "Samsunspor" },
        { week: 1, home: "Trabzonspor", homeScore: 1, awayScore: 0, away: "Beşiktaş" },
        { week: 1, home: "Gaziantep", homeScore: 0, awayScore: 0, away: "Alanyaspor" },
        { week: 1, home: "Gençlerbirliği", homeScore: 4, awayScore: 0, away: "Kayserispor" },

        // Hafta 2
        { week: 2, home: "Beşiktaş", homeScore: 1, awayScore: 0, away: "Başakşehir" },
        { week: 2, home: "Alanyaspor", homeScore: 0, awayScore: 2, away: "Fenerbahçe" },
        { week: 2, home: "Antalyaspor", homeScore: 0, awayScore: 0, away: "Samsunspor" },
        { week: 2, home: "Galatasaray", homeScore: 1, awayScore: 1, away: "Konyaspor" },
        { week: 2, home: "Gençlerbirliği", homeScore: 0, awayScore: 2, away: "Gaziantep" },
        { week: 2, home: "Göztepe", homeScore: 2, awayScore: 1, away: "Trabzonspor" },
        { week: 2, home: "Başakşehir", homeScore: 2, awayScore: 0, away: "Konyaspor" },

        // Hafta 3
        { week: 3, home: "Galatasaray", homeScore: 2, awayScore: 0, away: "Samsunspor" },
        { week: 3, home: "Fenerbahçe", homeScore: 1, awayScore: 0, away: "Gençlerbirliği" },
        { week: 3, home: "Beşiktaş", homeScore: 0, awayScore: 0, away: "Göztepe" },
        { week: 3, home: "Eyüpspor", homeScore: 0, awayScore: 1, away: "Gaziantep" },
        { week: 3, home: "Antalyaspor", homeScore: 1, awayScore: 1, away: "Kayserispor" },
        { week: 3, home: "Trabzonspor", homeScore: 3, awayScore: 0, away: "Alanyaspor" },
        { week: 3, home: "Gençlerbirliği", homeScore: 1, awayScore: 2, away: "Trabzonspor" },

        // Hafta 4
        { week: 4, home: "Samsunspor", homeScore: 2, awayScore: 1, away: "Konyaspor" },
        { week: 4, home: "Kayserispor", homeScore: 1, awayScore: 2, away: "Galatasaray" },
        { week: 4, home: "Eyüpspor", homeScore: 2, awayScore: 1, away: "Fenerbahçe" },
        { week: 4, home: "Gaziantep", homeScore: 1, awayScore: 1, away: "Antalyaspor" },
        { week: 4, home: "Gençlerbirliği", homeScore: 0, awayScore: 2, away: "Trabzonspor" },
        { week: 4, home: "Beşiktaş", homeScore: 0, awayScore: 0, away: "Alanyaspor" },
        { week: 4, home: "Başakşehir", homeScore: 0, awayScore: 0, away: "Samsunspor" },

        // Hafta 5
        { week: 5, home: "Galatasaray", homeScore: 0, awayScore: 0, away: "Gaziantep" },
        { week: 5, home: "Antalyaspor", homeScore: 0, awayScore: 0, away: "Fenerbahçe" },
        { week: 5, home: "Beşiktaş", homeScore: 3, awayScore: 1, away: "Gençlerbirliği" },
        { week: 5, home: "Trabzonspor", homeScore: 1, awayScore: 1, away: "Eyüpspor" },
        { week: 5, home: "Alanyaspor", homeScore: 1, awayScore: 2, away: "Başakşehir" },
        { week: 5, home: "Fenerbahçe", homeScore: 0, awayScore: 4, away: "Galatasaray" },
        { week: 5, home: "Konyaspor", homeScore: 0, awayScore: 0, away: "Kayserispor" },

        // Hafta 6
        { week: 6, home: "Göztepe", homeScore: 1, awayScore: 0, away: "Alanyaspor" },
        { week: 6, home: "Kayserispor", homeScore: 0, awayScore: 0, away: "Samsunspor" },
        { week: 6, home: "Antalyaspor", homeScore: 0, awayScore: 0, away: "Trabzonspor" },
        { week: 6, home: "Gençlerbirliği", homeScore: 2, awayScore: 1, away: "Göztepe" },
        { week: 6, home: "Gaziantep", homeScore: 1, awayScore: 1, away: "Konyaspor" },
        { week: 6, home: "Eyüpspor", homeScore: 0, awayScore: 1, away: "Beşiktaş" },
        { week: 6, home: "Başakşehir", homeScore: 0, awayScore: 0, away: "Kayserispor" },

        // Hafta 7
        { week: 7, home: "Konyaspor", homeScore: 0, awayScore: 2, away: "Fenerbahçe" },
        { week: 7, home: "Gaziantep", homeScore: 1, awayScore: 0, away: "Samsunspor" },
        { week: 7, home: "Galatasaray", homeScore: 1, awayScore: 2, away: "Trabzonspor" },
        { week: 7, home: "Beşiktaş", homeScore: 1, awayScore: 1, away: "Antalyaspor" },
        { week: 7, home: "Alanyaspor", homeScore: 0, awayScore: 1, away: "Gaziantep" },
        { week: 7, home: "Göztepe", homeScore: 0, awayScore: 1, away: "Eyüpspor" },

        // Hafta 8
        { week: 8, home: "Fenerbahçe", homeScore: 0, awayScore: 1, away: "Samsunspor" },
        { week: 8, home: "Antalyaspor", homeScore: 1, awayScore: 0, away: "Göztepe" },
        { week: 8, home: "Galatasaray", homeScore: 1, awayScore: 1, away: "Beşiktaş" },
        { week: 8, home: "Gaziantep", homeScore: 1, awayScore: 1, away: "Kayserispor" },
        { week: 8, home: "Trabzonspor", homeScore: 0, awayScore: 0, away: "Konyaspor" },
        { week: 8, home: "Eyüpspor", homeScore: 0, awayScore: 1, away: "Alanyaspor" },
        { week: 8, home: "Gençlerbirliği", homeScore: 0, awayScore: 1, away: "Başakşehir" },

        // Hafta 9
        { week: 9, home: "Başakşehir", homeScore: 0, awayScore: 1, away: "Gaziantep" },
        { week: 9, home: "Göztepe", homeScore: 0, awayScore: 1, away: "Galatasaray" },
        { week: 9, home: "Kayserispor", homeScore: 0, awayScore: 2, away: "Fenerbahçe" },
        { week: 9, home: "Alanyaspor", homeScore: 1, awayScore: 2, away: "Antalyaspor" },
        { week: 9, home: "Samsunspor", homeScore: 0, awayScore: 0, away: "Trabzonspor" },
        { week: 9, home: "Konyaspor", homeScore: 0, awayScore: 3, away: "Beşiktaş" }
    ],

    // ═══════════════════════════════════════════════════════════════
    // ⚽ GOL KRALLARI
    // ═══════════════════════════════════════════════════════════════
    scorers: [
        { name: "Icardi", team: "Galatasaray", goals: 8, flag: "🇦🇷" },
        { name: "Dzeko", team: "Fenerbahçe", goals: 7, flag: "🇧🇦" },
        { name: "Immobile", team: "Beşiktaş", goals: 6, flag: "🇮🇹" },
        { name: "Onuachu", team: "Trabzonspor", goals: 5, flag: "🇳🇬" },
        { name: "Visca", team: "Başakşehir", goals: 5, flag: "🇧🇦" },
        { name: "Kruse", team: "Eyüpspor", goals: 4, flag: "🇩🇪" },
        { name: "Tosun", team: "Beşiktaş", goals: 4, flag: "🇹🇷" },
        { name: "Ndiaye", team: "Galatasaray", goals: 4, flag: "🇸🇳" },
        { name: "Barış Alper", team: "Galatasaray", goals: 3, flag: "🇹🇷" },
        { name: "Tadic", team: "Fenerbahçe", goals: 3, flag: "🇷🇸" }
    ],

    // ═══════════════════════════════════════════════════════════════
    // 🤝 ASİST KRALLARI
    // ═══════════════════════════════════════════════════════════════
    assists: [
        { name: "Mertens", team: "Galatasaray", assists: 7, flag: "🇧🇪" },
        { name: "Tadic", team: "Fenerbahçe", assists: 6, flag: "🇷🇸" },
        { name: "Gedson", team: "Beşiktaş", assists: 5, flag: "🇵🇹" },
        { name: "Visca", team: "Başakşehir", assists: 5, flag: "🇧🇦" },
        { name: "Icardi", team: "Galatasaray", assists: 4, flag: "🇦🇷" },
        { name: "Bakasetas", team: "Trabzonspor", assists: 4, flag: "🇬🇷" },
        { name: "Kahveci", team: "Fenerbahçe", assists: 3, flag: "🇹🇷" },
        { name: "Ghezzal", team: "Beşiktaş", assists: 3, flag: "🇩🇿" },
        { name: "Fred", team: "Fenerbahçe", assists: 3, flag: "🇧🇷" },
        { name: "Ndombele", team: "Galatasaray", assists: 2, flag: "🇫🇷" }
    ],

    // ═══════════════════════════════════════════════════════════════
    // 🏟️ FİKSTÜR - Oynanmamış maçlar
    // ═══════════════════════════════════════════════════════════════
    fixtures: [
        // Hafta 10
        { week: 10, home: "Eyüpspor", away: "Başakşehir" },
        { week: 10, home: "Fenerbahçe", away: "Gaziantep" },
        { week: 10, home: "Antalyaspor", away: "Gençlerbirliği" },
        { week: 10, home: "Trabzonspor", away: "Kayserispor" },
        { week: 10, home: "Galatasaray", away: "Alanyaspor" },
        { week: 10, home: "Beşiktaş", away: "Samsunspor" },
        { week: 10, home: "Konyaspor", away: "Göztepe" },

        // Hafta 11
        { week: 11, home: "Başakşehir", away: "Fenerbahçe" },
        { week: 11, home: "Eyüpspor", away: "Antalyaspor" },
        { week: 11, home: "Gaziantep", away: "Trabzonspor" },
        { week: 11, home: "Gençlerbirliği", away: "Galatasaray" },
        { week: 11, home: "Kayserispor", away: "Beşiktaş" },
        { week: 11, home: "Alanyaspor", away: "Konyaspor" },
        { week: 11, home: "Samsunspor", away: "Göztepe" },

        // Hafta 12
        { week: 12, home: "Antalyaspor", away: "Başakşehir" },
        { week: 12, home: "Trabzonspor", away: "Fenerbahçe" },
        { week: 12, home: "Galatasaray", away: "Eyüpspor" },
        { week: 12, home: "Beşiktaş", away: "Gaziantep" },
        { week: 12, home: "Konyaspor", away: "Gençlerbirliği" },
        { week: 12, home: "Göztepe", away: "Kayserispor" },
        { week: 12, home: "Samsunspor", away: "Alanyaspor" },

        // Hafta 13
        { week: 13, home: "Başakşehir", away: "Trabzonspor" },
        { week: 13, home: "Antalyaspor", away: "Galatasaray" },
        { week: 13, home: "Fenerbahçe", away: "Beşiktaş" },
        { week: 13, home: "Eyüpspor", away: "Konyaspor" },
        { week: 13, home: "Gaziantep", away: "Göztepe" },
        { week: 13, home: "Gençlerbirliği", away: "Samsunspor" },
        { week: 13, home: "Kayserispor", away: "Alanyaspor" }
    ],

    // ═══════════════════════════════════════════════════════════════
    // 🏆 ZİRAAT TÜRKİYE KUPASI - Son 16 Tur
    // ═══════════════════════════════════════════════════════════════
    ziraatKupasi: {
        round: "Son 16",
        season: "2024-2025",
        matches: [
            { id: 1, home: "Başakşehir", away: "Konyaspor", homeScore: null, awayScore: null, note: "" },
            { id: 2, home: "Beşiktaş", away: "Antalyaspor", homeScore: null, awayScore: null, note: "" },
            { id: 3, home: "Gaziantep", away: "Kayserispor", homeScore: null, awayScore: null, note: "" },
            { id: 4, home: "Trabzonspor", away: "Gençlerbirliği", homeScore: null, awayScore: null, note: "" },
            { id: 5, home: "Galatasaray", away: "Samsunspor", homeScore: null, awayScore: null, note: "" },
            { id: 6, home: "Alanyaspor", away: "Fenerbahçe", homeScore: null, awayScore: null, note: "" }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // 🥇 SÜPER KUPA
    // ═══════════════════════════════════════════════════════════════
    superKupa: {
        matches: [
            { id: 1, label: "Yarı Final 1", home: "Galatasaray", away: "Beşiktaş", homeScore: null, awayScore: null },
            { id: 2, label: "Yarı Final 2", home: "Fenerbahçe", away: "Trabzonspor", homeScore: null, awayScore: null },
            { id: 3, label: "Final", home: "", away: "", homeScore: null, awayScore: null }
        ],
        standings: [
            { team: "Galatasaray", played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, points: 0, form: [] },
            { team: "Fenerbahçe", played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, points: 0, form: [] },
            { team: "Beşiktaş", played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, points: 0, form: [] },
            { team: "Trabzonspor", played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, points: 0, form: [] }
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // 🛠️ YARDIMCI FONKSİYONLAR
    // ═══════════════════════════════════════════════════════════════

    // Takım logosu getir
    getTeamLogo(teamName) {
        return this.teams[teamName]?.logo || "https://via.placeholder.com/40?text=?";
    },

    // Takım kısa adı getir
    getTeamShortName(teamName) {
        return this.teams[teamName]?.shortName || teamName.substring(0, 3).toUpperCase();
    },

    // Puan durumu hesapla
    calculateStandings() {
        const standings = {};

        // Tüm takımları başlat
        Object.keys(this.teams).forEach(team => {
            standings[team] = {
                name: team,
                played: 0,
                won: 0,
                draw: 0,
                lost: 0,
                gf: 0,
                ga: 0,
                points: 0,
                form: []
            };
        });

        // Maçları işle
        this.matches.forEach(match => {
            const home = standings[match.home];
            const away = standings[match.away];

            if (!home || !away) return;

            home.played++;
            away.played++;
            home.gf += match.homeScore;
            home.ga += match.awayScore;
            away.gf += match.awayScore;
            away.ga += match.homeScore;

            if (match.homeScore > match.awayScore) {
                home.won++;
                home.points += 3;
                home.form.push('G');
                away.lost++;
                away.form.push('M');
            } else if (match.homeScore < match.awayScore) {
                away.won++;
                away.points += 3;
                away.form.push('G');
                home.lost++;
                home.form.push('M');
            } else {
                home.draw++;
                away.draw++;
                home.points++;
                away.points++;
                home.form.push('B');
                away.form.push('B');
            }
        });

        // Sıralama (puan, averaj, atılan gol)
        return Object.values(standings)
            .filter(t => t.played > 0)
            .sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                const gdA = a.gf - a.ga;
                const gdB = b.gf - b.ga;
                if (gdB !== gdA) return gdB - gdA;
                return b.gf - a.gf;
            });
    },

    // Belirli haftanın maçlarını getir
    getMatchesByWeek(week) {
        return this.matches.filter(m => m.week === week);
    },

    // Belirli haftanın fikstürünü getir
    getFixturesByWeek(week) {
        return this.fixtures.filter(f => f.week === week);
    },

    // İki takım arasındaki maçları getir
    getH2H(team1, team2) {
        return this.matches.filter(m =>
            (m.home === team1 && m.away === team2) ||
            (m.home === team2 && m.away === team1)
        );
    },

    // Toplam hafta sayısı
    getTotalWeeks() {
        const playedWeeks = Math.max(...this.matches.map(m => m.week), 0);
        const fixtureWeeks = Math.max(...this.fixtures.map(f => f.week), 0);
        return Math.max(playedWeeks, fixtureWeeks);
    },

    // Son oynanan hafta
    getLastPlayedWeek() {
        return Math.max(...this.matches.map(m => m.week), 0);
    }
};

// Global olarak erişilebilir yap
window.TribeData = TribeData;

// Konsola bilgi yaz
console.log('📊 TribeData yüklendi!', {
    takımlar: Object.keys(TribeData.teams).length,
    maçlar: TribeData.matches.length,
    golcüler: TribeData.scorers.length,
    asistler: TribeData.assists.length
});
