// ╔══════════════════════════════════════════════════════════════╗
// ║  � TRIBE LEAGUE - VERİ SENKRONİZASYONU                     ║
// ║  Canlı veri senkronizasyon sistemi                          ║
// ╚══════════════════════════════════════════════════════════════╝

const _dbConfig = {
    apiKey: "AIzaSyAOgPe8C5MUYbo_SJ0yVQjqGCb8_irn7xc",
    authDomain: "tribe-league.firebaseapp.com",
    databaseURL: "https://tribe-league-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tribe-league",
    storageBucket: "tribe-league.firebasestorage.app",
    messagingSenderId: "818000202306",
    appId: "1:818000202306:web:f0946a5371365bc48efbdb",
    measurementId: "G-5XNVDPBDWW"
};

let _dbApp = null;
let _dbInstance = null;
let _dbReady = false;

// Veritabanını başlat
async function initFirebase() {
    if (_dbReady) return true;

    try {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getDatabase, ref, set, get, onValue, push, remove, update } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js');

        _dbApp = initializeApp(_dbConfig);
        _dbInstance = getDatabase(_dbApp);

        window.firebaseDb = _dbInstance;
        window.firebaseRef = ref;
        window.firebaseSet = set;
        window.firebaseGet = get;
        window.firebaseOnValue = onValue;
        window.firebasePush = push;
        window.firebaseRemove = remove;
        window.firebaseUpdate = update;

        _dbReady = true;
        return true;
    } catch (error) {
        console.error('Bağlantı hatası');
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════
// 🎮 CANLI MAÇ FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════

async function saveLiveMatchToFirebase(data) {
    if (!_dbReady) await initFirebase();
    try {
        await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'liveMatch'), data);
        return true;
    } catch (error) {
        return false;
    }
}

async function getLiveMatchFromFirebase() {
    if (!_dbReady) await initFirebase();
    try {
        const snapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'liveMatch'));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        return null;
    }
}

function listenLiveMatch(callback) {
    initFirebase().then(() => {
        window.firebaseOnValue(window.firebaseRef(window.firebaseDb, 'liveMatch'), (snapshot) => {
            // Veri varsa veya null ise callback çağır (silme durumu için)
            callback(snapshot.exists() ? snapshot.val() : { activeMatchId: 0, matches: [] });
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// 📊 TÜM VERİLER FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════

async function saveAllDataToFirebase(data) {
    if (!_dbReady) await initFirebase();
    try {
        await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'tribeData'), data);
        return true;
    } catch (error) {
        return false;
    }
}

async function getAllDataFromFirebase() {
    if (!_dbReady) await initFirebase();
    try {
        const snapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'tribeData'));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        return null;
    }
}

function listenAllData(callback) {
    initFirebase().then(() => {
        window.firebaseOnValue(window.firebaseRef(window.firebaseDb, 'tribeData'), (snapshot) => {
            if (snapshot.exists()) callback(snapshot.val());
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// 🏆 KUPA VERİLERİ
// ═══════════════════════════════════════════════════════════════

async function saveZiraatKupasiToFirebase(data) {
    if (!_dbReady) await initFirebase();
    try {
        await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'ziraatKupasi'), data);
        return true;
    } catch (error) {
        return false;
    }
}

async function saveSuperKupaToFirebase(data) {
    if (!_dbReady) await initFirebase();
    try {
        await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'superKupa'), data);
        return true;
    } catch (error) {
        return false;
    }
}

function listenZiraatKupasi(callback) {
    initFirebase().then(() => {
        window.firebaseOnValue(window.firebaseRef(window.firebaseDb, 'ziraatKupasi'), (snapshot) => {
            if (snapshot.exists()) callback(snapshot.val());
        });
    });
}

function listenSuperKupa(callback) {
    initFirebase().then(() => {
        window.firebaseOnValue(window.firebaseRef(window.firebaseDb, 'superKupa'), (snapshot) => {
            if (snapshot.exists()) callback(snapshot.val());
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// 🧪 TEST
// ═══════════════════════════════════════════════════════════════

async function testFirebaseConnection() {
    const success = await initFirebase();
    if (!success) return false;

    try {
        const testData = { test: true, timestamp: Date.now() };
        await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'connectionTest'), testData);
        const snapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'connectionTest'));
        return snapshot.exists();
    } catch (error) {
        return false;
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', initFirebase);
