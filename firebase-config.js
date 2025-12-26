// ╔══════════════════════════════════════════════════════════════╗
// ║  🔥 FIREBASE CONFIG - TRIBE LEAGUE                          ║
// ║  Tüm veri yönetimi burada                                    ║
// ╚══════════════════════════════════════════════════════════════╝

// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyAOgPe8C5MUYbo_SJ0yVQjqGCb8_irn7xc",
    authDomain: "tribe-league.firebaseapp.com",
    databaseURL: "https://tribe-league-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tribe-league",
    storageBucket: "tribe-league.firebasestorage.app",
    messagingSenderId: "818000202306",
    appId: "1:818000202306:web:f0946a5371365bc48efbdb",
    measurementId: "G-5XNVDPBDWW"
};

// Firebase modüllerini yükle
let firebaseApp = null;
let firebaseDb = null;
let firebaseReady = false;

// Firebase'i başlat
async function initFirebase() {
    if (firebaseReady) return true;

    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getDatabase, ref, set, get, onValue, push, remove, update } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');

        firebaseApp = initializeApp(firebaseConfig);
        firebaseDb = getDatabase(firebaseApp);

        // Global olarak erişilebilir yap
        window.firebaseDb = firebaseDb;
        window.firebaseRef = ref;
        window.firebaseSet = set;
        window.firebaseGet = get;
        window.firebaseOnValue = onValue;
        window.firebasePush = push;
        window.firebaseRemove = remove;
        window.firebaseUpdate = update;

        firebaseReady = true;
        console.log('🔥 Firebase bağlantısı başarılı!');
        return true;
    } catch (error) {
        console.error('❌ Firebase bağlantı hatası:', error);
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════
// 📦 GENEL VERİ FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════

// Veri kaydet (herhangi bir path'e)
async function saveToFirebaseDB(path, data) {
    if (!firebaseReady) await initFirebase();

    try {
        const dbRef = window.firebaseRef(window.firebaseDb, path);
        await window.firebaseSet(dbRef, data);
        console.log(`✅ ${path} kaydedildi!`);
        return true;
    } catch (error) {
        console.error(`❌ ${path} kaydetme hatası:`, error);
        return false;
    }
}

// Veri oku (bir kerelik)
async function getFromFirebaseDB(path) {
    if (!firebaseReady) await initFirebase();

    try {
        const dbRef = window.firebaseRef(window.firebaseDb, path);
        const snapshot = await window.firebaseGet(dbRef);
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error(`❌ ${path} okuma hatası:`, error);
        return null;
    }
}

// Veri dinle (real-time)
function listenToFirebaseDB(path, callback) {
    if (!firebaseReady) {
        initFirebase().then(() => {
            const dbRef = window.firebaseRef(window.firebaseDb, path);
            window.firebaseOnValue(dbRef, (snapshot) => {
                callback(snapshot.exists() ? snapshot.val() : null);
            });
        });
    } else {
        const dbRef = window.firebaseRef(window.firebaseDb, path);
        window.firebaseOnValue(dbRef, (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : null);
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎮 CANLI MAÇ FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════

async function saveLiveMatchToFirebase(data) {
    return await saveToFirebaseDB('liveMatch', data);
}

async function getLiveMatchFromFirebase() {
    return await getFromFirebaseDB('liveMatch');
}

function listenLiveMatch(callback) {
    listenToFirebaseDB('liveMatch', callback);
}

// ═══════════════════════════════════════════════════════════════
// 📊 TÜM VERİ FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════

// Tüm TribeData'yı kaydet
async function saveAllDataToFirebase(data) {
    return await saveToFirebaseDB('tribeData', data);
}

// Tüm TribeData'yı oku
async function getAllDataFromFirebase() {
    return await getFromFirebaseDB('tribeData');
}

// Tüm TribeData'yı dinle
function listenAllData(callback) {
    listenToFirebaseDB('tribeData', callback);
}

// ═══════════════════════════════════════════════════════════════
// 🏆 BÖLÜM BÖLÜM KAYDETME
// ═══════════════════════════════════════════════════════════════

// Takımlar
async function saveTeamsToFirebase(teams) {
    return await saveToFirebaseDB('tribeData/teams', teams);
}

// Maçlar
async function saveMatchesToFirebase(matches) {
    return await saveToFirebaseDB('tribeData/matches', matches);
}

// Golcüler
async function saveScorersToFirebase(scorers) {
    return await saveToFirebaseDB('tribeData/scorers', scorers);
}

// Asistler
async function saveAssistsToFirebase(assists) {
    return await saveToFirebaseDB('tribeData/assists', assists);
}

// Fikstür
async function saveFixturesToFirebase(fixtures) {
    return await saveToFirebaseDB('tribeData/fixtures', fixtures);
}

// Ziraat Kupası
async function saveZiraatToFirebase(ziraat) {
    return await saveToFirebaseDB('tribeData/ziraatKupasi', ziraat);
}

// Süper Kupa
async function saveSuperKupaToFirebase(superKupa) {
    return await saveToFirebaseDB('tribeData/superKupa', superKupa);
}

// ═══════════════════════════════════════════════════════════════
// 🔄 BÖLÜM BÖLÜM DİNLEME
// ═══════════════════════════════════════════════════════════════

function listenTeams(callback) { listenToFirebaseDB('tribeData/teams', callback); }
function listenMatches(callback) { listenToFirebaseDB('tribeData/matches', callback); }
function listenScorers(callback) { listenToFirebaseDB('tribeData/scorers', callback); }
function listenAssists(callback) { listenToFirebaseDB('tribeData/assists', callback); }
function listenFixtures(callback) { listenToFirebaseDB('tribeData/fixtures', callback); }
function listenZiraat(callback) { listenToFirebaseDB('tribeData/ziraatKupasi', callback); }
function listenSuperKupa(callback) { listenToFirebaseDB('tribeData/superKupa', callback); }

// ═══════════════════════════════════════════════════════════════
// 🧪 TEST FONKSİYONU
// ═══════════════════════════════════════════════════════════════

async function testFirebaseConnection() {
    console.log('🧪 Firebase bağlantısı test ediliyor...');

    const success = await initFirebase();
    if (!success) {
        console.error('❌ Firebase başlatılamadı!');
        return false;
    }

    const testData = {
        test: true,
        timestamp: Date.now(),
        message: 'Tribe League Firebase bağlantısı çalışıyor!'
    };

    try {
        await saveToFirebaseDB('connectionTest', testData);
        const result = await getFromFirebaseDB('connectionTest');
        if (result) {
            console.log('✅ Firebase test BAŞARILI!');
            return true;
        }
    } catch (error) {
        console.error('❌ Test hatası:', error);
    }

    return false;
}

// Sayfa yüklendiğinde Firebase'i başlat
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
});

console.log('🔥 Firebase config yüklendi!');
