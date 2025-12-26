// ╔══════════════════════════════════════════════════════════════╗
// ║  ⚽ TRIBE LEAGUE - CANLI MAÇ VERİLERİ                        ║
// ║  Admin panelden yönetilen canlı maç bilgileri                ║
// ║  Son güncelleme: 2025-12-26                                  ║
// ╚══════════════════════════════════════════════════════════════╝

const LiveMatchData = {
    // Aktif olarak gösterilen maç ID'si
    activeMatchId: 0,

    // Tüm canlı maçlar
    matches: [

        {
            id: 0,
            homeTeam: "Konyaspor",
            awayTeam: "Antalyaspor",
            homeScore: 0,
            awayScore: 0,
            status: "firstHalf",
            startTimestamp: 1766748236929,
            halfStartTimestamp: null,
            endTimestamp: null,
            events: [

            ]
        }
        // Örnek maç yapısı:
        // {
        //     id: 0,
        //     homeTeam: "Konyaspor",
        //     awayTeam: "Antalyaspor",
        //     homeScore: 1,
        //     awayScore: 0,
        //     status: "waiting", // "waiting", "firstHalf", "halftime", "secondHalf", "ended"
        //     startTimestamp: null,      // 1. yarı başlangıç zamanı (Date.now())
        //     halfStartTimestamp: null,  // 2. yarı başlangıç zamanı
        //     endTimestamp: null,        // Maç bitiş zamanı
        //     events: [
        //         { minute: 23, type: "goal", player: "Oyuncu", team: "home", assist: "Oyuncu2" },
        //         { minute: 35, type: "yellow", player: "Oyuncu3", team: "away" },
        //         { minute: 67, type: "red", player: "Oyuncu4", team: "home" },
        //         { minute: 72, type: "sub", playerIn: "Oyuncu5", playerOut: "Oyuncu6", team: "away" }
        //     ]
        // }
    ],

    // ═══════════════════════════════════════════════════════════════
    // 🛠️ YARDIMCI FONKSİYONLAR
    // ═══════════════════════════════════════════════════════════════

    // Aktif maçı getir
    getActiveMatch() {
        return this.matches.find(m => m.id === this.activeMatchId) || null;
    },

    // Maçın mevcut dakikasını hesapla
    calculateMinute(match) {
        if (!match) return 0;

        const now = Date.now();

        switch (match.status) {
            case "waiting":
                return 0;

            case "firstHalf":
                if (!match.startTimestamp) return 0;
                const firstHalfMin = Math.floor((now - match.startTimestamp) / 60000);
                return Math.min(firstHalfMin, 45); // Maksimum 45

            case "halftime":
                return 45;

            case "secondHalf":
                if (!match.halfStartTimestamp) return 45;
                const secondHalfMin = Math.floor((now - match.halfStartTimestamp) / 60000);
                return 45 + Math.min(secondHalfMin, 45); // Maksimum 90

            case "ended":
                return 90;

            default:
                return 0;
        }
    },

    // Tüm canlı maçları getir (waiting olmayan)
    getLiveMatches() {
        return this.matches.filter(m => m.status !== "waiting" && m.status !== "ended");
    },

    // Biten maçları getir
    getEndedMatches() {
        return this.matches.filter(m => m.status === "ended");
    }
};

// Global olarak erişilebilir yap
window.LiveMatchData = LiveMatchData;

console.log('⚽ LiveMatchData yüklendi!', {
    maçlar: LiveMatchData.matches.length,
    aktifMaç: LiveMatchData.activeMatchId
});
