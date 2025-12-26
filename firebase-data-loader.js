// ╔══════════════════════════════════════════════════════════════╗
// ║  🔄 FIREBASE DATA LOADER                                     ║
// ║  Tüm sayfalarda Firebase'den veri yükleme                    ║
// ╚══════════════════════════════════════════════════════════════╝

// Bu script firebase-config.js'den sonra yüklenmeli
// TribeData'yı Firebase verisiyle günceller

let firebaseDataLoaded = false;

// Firebase'den veri yükle ve TribeData'yı güncelle
async function loadDataFromFirebase() {
    if (firebaseDataLoaded) return;

    try {
        console.log('🔄 Firebase\'den veri yükleniyor...');

        const data = await getAllDataFromFirebase();

        if (data) {
            // TribeData'yı güncelle (fonksiyonları koruyarak)
            if (data.teams) TribeData.teams = data.teams;
            if (data.matches) TribeData.matches = data.matches;
            if (data.scorers) TribeData.scorers = data.scorers;
            if (data.assists) TribeData.assists = data.assists;
            if (data.fixtures) TribeData.fixtures = data.fixtures;
            if (data.ziraatKupasi) TribeData.ziraatKupasi = data.ziraatKupasi;
            if (data.superKupa) TribeData.superKupa = data.superKupa;

            firebaseDataLoaded = true;
            console.log('✅ Firebase verisi yüklendi!', {
                teams: Object.keys(data.teams || {}).length,
                matches: (data.matches || []).length,
                lastUpdate: data.lastUpdate
            });

            // Özel event fırlat - sayfalar bunu dinleyebilir
            window.dispatchEvent(new CustomEvent('firebaseDataLoaded', { detail: data }));

            return data;
        } else {
            console.log('ℹ️ Firebase\'de veri yok, local data.js kullanılıyor.');
        }
    } catch (error) {
        console.warn('⚠️ Firebase verisi yüklenemedi, local data.js kullanılıyor:', error);
    }

    return null;
}

// Real-time güncellemeleri dinle
function startFirebaseSync() {
    console.log('🔄 Firebase senkronizasyonu başlatılıyor...');

    listenAllData((data) => {
        if (data) {
            // TribeData'yı güncelle
            if (data.teams) TribeData.teams = data.teams;
            if (data.matches) TribeData.matches = data.matches;
            if (data.scorers) TribeData.scorers = data.scorers;
            if (data.assists) TribeData.assists = data.assists;
            if (data.fixtures) TribeData.fixtures = data.fixtures;
            if (data.ziraatKupasi) TribeData.ziraatKupasi = data.ziraatKupasi;
            if (data.superKupa) TribeData.superKupa = data.superKupa;

            console.log('🔥 Firebase güncellemesi alındı!');

            // Özel event fırlat
            window.dispatchEvent(new CustomEvent('firebaseDataUpdated', { detail: data }));
        }
    });
}

// Sayfa yüklendiğinde otomatik başlat
document.addEventListener('DOMContentLoaded', async () => {
    // Önce veriyi yükle
    await loadDataFromFirebase();

    // Sonra real-time sync başlat
    startFirebaseSync();
});

console.log('🔄 Firebase Data Loader hazır!');
