// ═══════════════════════════════════════════════════════════════
// 🔍 IP LOGGER - Ziyaretçi Takip Scripti
// Kullanım: Bu scripti takip etmek istediğiniz sayfalara ekleyin
// Veriler Firebase'de 'visitorLogs' altında saklanır
// ═══════════════════════════════════════════════════════════════

(function () {
    // IP al ve Firebase'e kaydet
    async function logVisitor() {
        try {
            // IP adresini al (ipify API)
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const ip = ipData.ip;

            // Ek bilgiler
            const now = new Date();
            const logEntry = {
                ip: ip,
                timestamp: now.toISOString(),
                date: now.toLocaleDateString('tr-TR'),
                time: now.toLocaleTimeString('tr-TR'),
                page: window.location.pathname,
                fullUrl: window.location.href,
                referrer: document.referrer || 'Doğrudan giriş',
                userAgent: navigator.userAgent,
                screenSize: `${screen.width}x${screen.height}`,
                language: navigator.language
            };

            // Firebase'e kaydet
            if (typeof window.firebaseDb !== 'undefined' && typeof window.firebasePush === 'function') {
                await window.firebasePush(
                    window.firebaseRef(window.firebaseDb, 'visitorLogs'),
                    logEntry
                );
                console.log('📍 Ziyaretçi loglandı');
            } else {
                // Firebase yoksa localStorage'a kaydet
                const logs = JSON.parse(localStorage.getItem('visitorLogs') || '[]');
                logs.push(logEntry);
                localStorage.setItem('visitorLogs', JSON.stringify(logs));
                console.log('📍 Ziyaretçi local olarak loglandı');
            }
        } catch (error) {
            console.log('Log hatası:', error);
        }
    }

    // Sayfa yüklenince çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', logVisitor);
    } else {
        logVisitor();
    }
})();
