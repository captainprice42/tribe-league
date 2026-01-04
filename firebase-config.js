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
        const { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js');

        _dbApp = initializeApp(_dbConfig);
        _dbInstance = getDatabase(_dbApp);

        // Auth instance
        const auth = getAuth(_dbApp);

        window.firebaseDb = _dbInstance;
        window.firebaseRef = ref;
        window.firebaseSet = set;
        window.firebaseGet = get;
        window.firebaseOnValue = onValue;
        window.firebasePush = push;
        window.firebaseRemove = remove;
        window.firebaseUpdate = update;

        // Auth functions
        window.firebaseAuth = auth;
        window.firebaseGoogleProvider = new GoogleAuthProvider();
        window.firebaseSignInWithPopup = signInWithPopup;
        window.firebaseSignOut = signOut;
        window.firebaseOnAuthStateChanged = onAuthStateChanged;

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

// Alias for easier access
const getAllData = getAllDataFromFirebase;

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
// 👥 KULLANICI YÖNETİMİ (Admin için)
// ═══════════════════════════════════════════════════════════════

async function getAllUsers() {
    if (!_dbReady) await initFirebase();
    try {
        const snapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'users'));
        return snapshot.exists() ? snapshot.val() : {};
    } catch (error) {
        console.error('Kullanıcı listesi alınamadı:', error);
        return {};
    }
}

async function deleteUserFromFirebase(userId) {
    if (!_dbReady) await initFirebase();
    try {
        await window.firebaseRemove(window.firebaseRef(window.firebaseDb, `users/${userId}`));
        return true;
    } catch (error) {
        console.error('Kullanıcı silinemedi:', error);
        return false;
    }
}

async function updateUserInFirebase(userId, data) {
    if (!_dbReady) await initFirebase();
    try {
        await window.firebaseUpdate(window.firebaseRef(window.firebaseDb, `users/${userId}`), data);
        return true;
    } catch (error) {
        console.error('Kullanıcı güncellenemedi:', error);
        return false;
    }
}

function listenUsers(callback) {
    initFirebase().then(() => {
        window.firebaseOnValue(window.firebaseRef(window.firebaseDb, 'users'), (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : {});
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// 🗳️ OYLAMA SİSTEMİ
// ═══════════════════════════════════════════════════════════════

async function saveVotingData(data) {
    if (!_dbReady) await initFirebase();
    try {
        await window.firebaseSet(window.firebaseRef(window.firebaseDb, 'voting'), data);
        return true;
    } catch (error) {
        console.error('Oylama kayıt hatası:', error);
        return false;
    }
}

async function getVotingData() {
    if (!_dbReady) await initFirebase();
    try {
        const snapshot = await window.firebaseGet(window.firebaseRef(window.firebaseDb, 'voting'));
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        return null;
    }
}

function listenVoting(callback) {
    initFirebase().then(() => {
        window.firebaseOnValue(window.firebaseRef(window.firebaseDb, 'voting'), (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : null);
        });
    });
}

async function submitVote(voterId, votes) {
    if (!_dbReady) await initFirebase();
    try {
        // Daha önce oy kullandı mı kontrol et
        const voterRef = window.firebaseRef(window.firebaseDb, `voting/voters/${voterId}`);
        const voterSnapshot = await window.firebaseGet(voterRef);
        if (voterSnapshot.exists()) {
            return { success: false, error: 'already_voted' };
        }

        // Oyu kaydet
        await window.firebaseSet(voterRef, { timestamp: Date.now(), votes });

        // Her mevki için oy sayısını artır
        for (const [position, playerName] of Object.entries(votes)) {
            const votingData = await getVotingData();
            if (votingData?.positions?.[position]) {
                const playerIdx = votingData.positions[position].findIndex(p => p.name === playerName);
                if (playerIdx !== -1) {
                    votingData.positions[position][playerIdx].votes = (votingData.positions[position][playerIdx].votes || 0) + 1;
                    await saveVotingData(votingData);
                }
            }
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Kullanıcı fingerprint oluştur (basit)
function generateVoterId() {
    const stored = localStorage.getItem('tribe_voter_id');
    if (stored) return stored;

    const id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('tribe_voter_id', id);
    return id;
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

// ═══════════════════════════════════════════════════════════════
// 📦 TribeData UYUMLULUK KATMANI (data.js yerine)
// ═══════════════════════════════════════════════════════════════

// Global TribeData objesi - Firebase'den doldurulacak
window.TribeData = {
    teams: {},
    matches: [],
    scorers: [],
    assists: [],
    fixtures: [],
    ziraatKupasi: { round: "Son 16", matches: [] },
    superKupa: { matches: [], standings: [] },

    // Helper fonksiyonlar
    getTeamLogo: function (teamName) {
        return this.teams[teamName]?.logo || 'https://via.placeholder.com/50?text=' + (teamName?.charAt(0) || '?');
    },

    calculateStandings: function () {
        const standings = {};
        Object.keys(this.teams).forEach(name => {
            standings[name] = { name, played: 0, won: 0, draw: 0, lost: 0, gf: 0, ga: 0, points: 0 };
        });

        this.matches.forEach(m => {
            const home = standings[m.home];
            const away = standings[m.away];
            if (!home || !away) return;

            home.played++; away.played++;
            home.gf += m.homeScore; home.ga += m.awayScore;
            away.gf += m.awayScore; away.ga += m.homeScore;

            if (m.homeScore > m.awayScore) {
                home.won++; home.points += 3; away.lost++;
            } else if (m.homeScore < m.awayScore) {
                away.won++; away.points += 3; home.lost++;
            } else {
                home.draw++; away.draw++; home.points++; away.points++;
            }
        });

        return Object.values(standings)
            .filter(t => t.played > 0)
            .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
    }
};

// Firebase'den TribeData'yı doldur
async function loadTribeDataFromFirebase() {
    try {
        const data = await getAllDataFromFirebase();
        if (data) {
            Object.assign(window.TribeData, data);
            console.log('📊 TribeData yüklendi!');
        }
    } catch (e) {
        console.log('TribeData yüklenemedi');
    }
}

// Sayfa yüklenince TribeData'yı doldur
document.addEventListener('DOMContentLoaded', loadTribeDataFromFirebase);

// ═══════════════════════════════════════════════════════════════
// 🔐 OWNER KORUMA SİSTEMİ (IP + Ekran Doğrulama)
// ═══════════════════════════════════════════════════════════════

const TribeOwner = {
    // Sabit değerler - sadece sen!
    config: {
        allowedIP: '88.241.180.6',
        allowedScreen: '2560x1440',
        firebasePath: 'adminSecurity/ownerAccess'
    },

    // Mevcut değerleri al
    async getCurrentInfo() {
        let ip = null;
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            ip = data.ip;
        } catch (e) {
            ip = 'unknown';
        }

        return {
            ip: ip,
            screen: `${screen.width}x${screen.height}`,
            timestamp: Date.now()
        };
    },

    // Frontend kontrolü - IP ve ekran doğrulama
    async verifyOwner() {
        const info = await this.getCurrentInfo();

        const ipMatch = info.ip === this.config.allowedIP;
        const screenMatch = info.screen === this.config.allowedScreen;

        console.log('🔐 Owner kontrolü:', {
            ip: info.ip,
            ipMatch: ipMatch,
            screen: info.screen,
            screenMatch: screenMatch
        });

        return ipMatch && screenMatch;
    },

    // Backend kontrolü - Firebase'den de kontrol et
    async verifyWithBackend() {
        const info = await this.getCurrentInfo();
        const isOwnerFrontend = await this.verifyOwner();

        if (!isOwnerFrontend) {
            // Log suspicious access attempt
            if (window.firebasePush && window.firebaseDb) {
                await window.firebasePush(
                    window.firebaseRef(window.firebaseDb, 'adminSecurity/suspiciousAccess'),
                    {
                        ip: info.ip,
                        screen: info.screen,
                        timestamp: info.timestamp,
                        page: window.location.href
                    }
                );
            }
            return false;
        }

        // Log successful access
        if (window.firebaseSet && window.firebaseDb) {
            await window.firebaseSet(
                window.firebaseRef(window.firebaseDb, this.config.firebasePath + '/lastAccess'),
                {
                    ip: info.ip,
                    screen: info.screen,
                    timestamp: info.timestamp
                }
            );
        }

        return true;
    },

    // Settings panelini göster/gizle
    async checkSettingsAccess() {
        const isOwner = await this.verifyWithBackend();

        const settingsTab = document.getElementById('settingsTab');
        const settingsPanel = document.getElementById('panel-settings');

        if (isOwner) {
            console.log('✅ Owner erişimi onaylandı!');
            if (settingsTab) {
                settingsTab.style.display = 'flex';
                settingsTab.style.background = 'linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(255, 71, 87, 0.05))';
                settingsTab.style.border = '1px solid rgba(255, 71, 87, 0.3)';
            }
            return true;
        } else {
            console.log('🚫 Owner erişimi reddedildi!');
            if (settingsTab) settingsTab.style.display = 'none';
            if (settingsPanel) settingsPanel.innerHTML = '<p style="text-align:center; color: var(--danger);">Erişim Reddedildi</p>';
            return false;
        }
    }
};

// Global export
window.TribeOwner = TribeOwner;

