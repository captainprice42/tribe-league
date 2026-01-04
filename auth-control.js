// ╔══════════════════════════════════════════════════════════════╗
// ║  🛡️ TRIBE LEAGUE - ADVANCED AUTH CONTROL SYSTEM              ║
// ║  Rate Limiting, Fingerprinting, 2FA, Activity Logging        ║
// ╚══════════════════════════════════════════════════════════════╝

const TribeAuthControl = {
    // ═══════════════════════════════════════════════════════════════
    // 📧 Email Configuration
    // ═══════════════════════════════════════════════════════════════
    config: {
        alertEmail: 'akanhamza441@protonmail.com',
        emailServiceId: 'service_tribeleague',
        emailTemplateId: 'template_security',
        emailPublicKey: '', // EmailJS public key - kullanıcı dolduracak
        maxLoginAttempts: 5,
        lockoutDuration5: 5 * 60 * 1000,  // 5 dakika
        lockoutDuration10: 30 * 60 * 1000, // 30 dakika
        sessionExpiry: 2 * 60 * 60 * 1000, // 2 saat
        totpWindow: 30, // 30 saniye
    },

    // ═══════════════════════════════════════════════════════════════
    // 🗄️ IndexedDB Manager (localStorage alternatifi - daha güvenli)
    // ═══════════════════════════════════════════════════════════════
    indexedDB: {
        dbName: 'TribeLeagueAuth',
        dbVersion: 1,
        db: null,

        async init() {
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.open(this.dbName, this.dbVersion);

                request.onerror = () => reject(request.error);

                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db);
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;

                    // Session store
                    if (!db.objectStoreNames.contains('sessions')) {
                        db.createObjectStore('sessions', { keyPath: 'id' });
                    }

                    // Fingerprint store
                    if (!db.objectStoreNames.contains('fingerprints')) {
                        db.createObjectStore('fingerprints', { keyPath: 'id' });
                    }

                    // Rate limit store
                    if (!db.objectStoreNames.contains('rateLimits')) {
                        db.createObjectStore('rateLimits', { keyPath: 'id' });
                    }

                    // TOTP store
                    if (!db.objectStoreNames.contains('totp')) {
                        db.createObjectStore('totp', { keyPath: 'id' });
                    }
                };
            });
        },

        async get(storeName, key) {
            if (!this.db) await this.init();
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(storeName, 'readonly');
                const store = tx.objectStore(storeName);
                const request = store.get(key);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },

        async set(storeName, data) {
            if (!this.db) await this.init();
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const request = store.put(data);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },

        async delete(storeName, key) {
            if (!this.db) await this.init();
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const request = store.delete(key);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },

        async clear(storeName) {
            if (!this.db) await this.init();
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🚫 Rate Limiting System
    // ═══════════════════════════════════════════════════════════════
    rateLimiter: {
        async getAttempts() {
            try {
                const ipHash = await TribeAuthControl.utils.getIPHash();

                // Firebase'den kontrol et
                if (window.firebaseGet && window.firebaseDb) {
                    const snapshot = await window.firebaseGet(
                        window.firebaseRef(window.firebaseDb, `adminSecurity/rateLimiting/${ipHash}`)
                    );
                    if (snapshot.exists()) {
                        return snapshot.val();
                    }
                }

                // IndexedDB'den kontrol et
                const local = await TribeAuthControl.indexedDB.get('rateLimits', ipHash);
                return local || { attempts: 0, lockedUntil: 0, lastAttempt: 0 };
            } catch (e) {
                console.error('Rate limit check error:', e);
                return { attempts: 0, lockedUntil: 0, lastAttempt: 0 };
            }
        },

        async check() {
            const data = await this.getAttempts();
            const now = Date.now();

            // Kilitli mi kontrol et
            if (data.lockedUntil > now) {
                const remainingTime = Math.ceil((data.lockedUntil - now) / 1000 / 60);
                return {
                    allowed: false,
                    remainingMinutes: remainingTime,
                    message: `Çok fazla yanlış deneme! ${remainingTime} dakika bekleyin.`
                };
            }

            // Kilit süresi geçtiyse sıfırla
            if (data.lockedUntil > 0 && data.lockedUntil <= now) {
                await this.reset();
                return { allowed: true };
            }

            return { allowed: true };
        },

        async incrementAttempt() {
            try {
                const ipHash = await TribeAuthControl.utils.getIPHash();
                const data = await this.getAttempts();
                const now = Date.now();

                data.attempts = (data.attempts || 0) + 1;
                data.lastAttempt = now;

                // 10+ deneme = 30 dakika kilit
                if (data.attempts >= 10) {
                    data.lockedUntil = now + TribeAuthControl.config.lockoutDuration10;
                    await TribeAuthControl.alerts.sendSuspiciousAlert('10+ yanlış giriş denemesi tespit edildi!');
                }
                // 5+ deneme = 5 dakika kilit
                else if (data.attempts >= 5) {
                    data.lockedUntil = now + TribeAuthControl.config.lockoutDuration5;
                    await TribeAuthControl.alerts.sendSuspiciousAlert('5+ yanlış giriş denemesi tespit edildi!');
                }

                // Firebase'e kaydet
                if (window.firebaseSet && window.firebaseDb) {
                    await window.firebaseSet(
                        window.firebaseRef(window.firebaseDb, `adminSecurity/rateLimiting/${ipHash}`),
                        data
                    );
                }

                // IndexedDB'ye kaydet
                await TribeAuthControl.indexedDB.set('rateLimits', { id: ipHash, ...data });

                return data.attempts;
            } catch (e) {
                console.error('Rate limit increment error:', e);
                return 0;
            }
        },

        async reset() {
            try {
                const ipHash = await TribeAuthControl.utils.getIPHash();

                // Firebase'den sil
                if (window.firebaseRemove && window.firebaseDb) {
                    await window.firebaseRemove(
                        window.firebaseRef(window.firebaseDb, `adminSecurity/rateLimiting/${ipHash}`)
                    );
                }

                // IndexedDB'den sil
                await TribeAuthControl.indexedDB.delete('rateLimits', ipHash);
            } catch (e) {
                console.error('Rate limit reset error:', e);
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔍 Fingerprint System (Cihaz Kimliği)
    // ═══════════════════════════════════════════════════════════════
    fingerprint: {
        async generate() {
            const components = [];

            // 1. Canvas fingerprint
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 200;
                canvas.height = 50;
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillStyle = '#f60';
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = '#069';
                ctx.fillText('TribeLeague🛡️', 2, 15);
                ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
                ctx.fillText('TribeLeague🛡️', 4, 17);
                components.push(canvas.toDataURL());
            } catch (e) {
                components.push('canvas-error');
            }

            // 2. WebGL fingerprint
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
                        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
                    }
                }
            } catch (e) {
                components.push('webgl-error');
            }

            // 3. Screen info
            components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
            components.push(screen.pixelDepth);

            // 4. Timezone
            components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
            components.push(new Date().getTimezoneOffset());

            // 5. Navigator properties
            components.push(navigator.language);
            components.push(navigator.languages?.join(',') || '');
            components.push(navigator.platform);
            components.push(navigator.hardwareConcurrency || 0);
            components.push(navigator.deviceMemory || 0);
            components.push(navigator.maxTouchPoints || 0);

            // 6. User agent
            components.push(navigator.userAgent);

            // 7. Installed plugins
            const plugins = [];
            for (let i = 0; i < navigator.plugins.length; i++) {
                plugins.push(navigator.plugins[i].name);
            }
            components.push(plugins.join(','));

            // 8. Audio fingerprint
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const analyser = audioContext.createAnalyser();
                const gainNode = audioContext.createGain();
                gainNode.gain.value = 0;
                oscillator.connect(analyser);
                analyser.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.start(0);
                const frequencyData = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(frequencyData);
                components.push(frequencyData.slice(0, 30).join(','));
                oscillator.stop();
                audioContext.close();
            } catch (e) {
                components.push('audio-error');
            }

            // Hash oluştur
            const fingerprint = await TribeAuthControl.utils.sha256(components.join('|||'));
            return fingerprint.substring(0, 32);
        },

        async store(fingerprint) {
            try {
                // IndexedDB'ye kaydet
                await TribeAuthControl.indexedDB.set('fingerprints', {
                    id: 'current',
                    fingerprint: fingerprint,
                    createdAt: Date.now()
                });

                return true;
            } catch (e) {
                console.error('Fingerprint store error:', e);
                return false;
            }
        },

        async validate(expectedFingerprint) {
            const currentFP = await this.generate();
            return currentFP === expectedFingerprint;
        },

        async getCurrent() {
            try {
                const stored = await TribeAuthControl.indexedDB.get('fingerprints', 'current');
                return stored?.fingerprint || null;
            } catch (e) {
                return null;
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔐 TOTP 2FA System (Google Authenticator Compatible)
    // ═══════════════════════════════════════════════════════════════
    totp: {
        // Base32 karakterleri
        base32Chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',

        // Base32 encode
        base32Encode(buffer) {
            const bytes = new Uint8Array(buffer);
            let result = '';
            let bits = 0;
            let value = 0;

            for (let i = 0; i < bytes.length; i++) {
                value = (value << 8) | bytes[i];
                bits += 8;

                while (bits >= 5) {
                    result += this.base32Chars[(value >>> (bits - 5)) & 31];
                    bits -= 5;
                }
            }

            if (bits > 0) {
                result += this.base32Chars[(value << (5 - bits)) & 31];
            }

            return result;
        },

        // Base32 decode
        base32Decode(str) {
            str = str.toUpperCase().replace(/[^A-Z2-7]/g, '');
            const bytes = [];
            let value = 0;
            let bits = 0;

            for (let i = 0; i < str.length; i++) {
                const idx = this.base32Chars.indexOf(str[i]);
                if (idx === -1) continue;

                value = (value << 5) | idx;
                bits += 5;

                if (bits >= 8) {
                    bytes.push((value >>> (bits - 8)) & 255);
                    bits -= 8;
                }
            }

            return new Uint8Array(bytes);
        },

        // Yeni secret oluştur
        async generateSecret() {
            const buffer = new Uint8Array(20);
            crypto.getRandomValues(buffer);
            return this.base32Encode(buffer);
        },

        // HMAC-SHA1 hesapla
        async hmacSHA1(key, message) {
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                key,
                { name: 'HMAC', hash: 'SHA-1' },
                false,
                ['sign']
            );

            const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
            return new Uint8Array(signature);
        },

        // TOTP token hesapla
        async generateToken(secret, timeStep = null) {
            if (timeStep === null) {
                timeStep = Math.floor(Date.now() / 1000 / TribeAuthControl.config.totpWindow);
            }

            const key = this.base32Decode(secret);

            // Time counter'ı 8 byte big-endian olarak encode et
            const time = new ArrayBuffer(8);
            const timeView = new DataView(time);
            timeView.setUint32(4, timeStep, false);

            const hmac = await this.hmacSHA1(key, new Uint8Array(time));

            // Dynamic truncation
            const offset = hmac[hmac.length - 1] & 0x0f;
            const code = (
                ((hmac[offset] & 0x7f) << 24) |
                ((hmac[offset + 1] & 0xff) << 16) |
                ((hmac[offset + 2] & 0xff) << 8) |
                (hmac[offset + 3] & 0xff)
            ) % 1000000;

            return code.toString().padStart(6, '0');
        },

        // Kod doğrula (±1 zaman penceresi toleransı)
        async verifyCode(secret, code) {
            const timeStep = Math.floor(Date.now() / 1000 / TribeAuthControl.config.totpWindow);

            // Mevcut, önceki ve sonraki zaman pencerelerini kontrol et
            for (let i = -1; i <= 1; i++) {
                const expectedCode = await this.generateToken(secret, timeStep + i);
                if (expectedCode === code) {
                    return true;
                }
            }

            return false;
        },

        // QR kod URL'i oluştur (Google Authenticator için)
        generateQRCodeURL(secret, accountName = 'TribeAdmin') {
            const issuer = 'TribeLeague';
            const uri = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}&algorithm=SHA1&digits=6&period=30`;
            return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`;
        },

        // 2FA etkin mi kontrol et
        async isEnabled() {
            try {
                if (window.firebaseGet && window.firebaseDb) {
                    const snapshot = await window.firebaseGet(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/totpSecrets/admin/enabled')
                    );
                    return snapshot.exists() && snapshot.val() === true;
                }
                return false;
            } catch (e) {
                return false;
            }
        },

        // Secret'ı Firebase'e kaydet
        async saveSecret(secret) {
            try {
                if (window.firebaseSet && window.firebaseDb) {
                    await window.firebaseSet(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/totpSecrets/admin'),
                        {
                            secret: await TribeAuthControl.utils.encrypt(secret),
                            enabled: true,
                            createdAt: Date.now()
                        }
                    );
                    return true;
                }
                return false;
            } catch (e) {
                console.error('TOTP save error:', e);
                return false;
            }
        },

        // Secret'ı Firebase'den al
        async getSecret() {
            try {
                if (window.firebaseGet && window.firebaseDb) {
                    const snapshot = await window.firebaseGet(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/totpSecrets/admin/secret')
                    );
                    if (snapshot.exists()) {
                        return await TribeAuthControl.utils.decrypt(snapshot.val());
                    }
                }
                return null;
            } catch (e) {
                console.error('TOTP get error:', e);
                return null;
            }
        },

        // 2FA'yı devre dışı bırak
        async disable() {
            try {
                if (window.firebaseRemove && window.firebaseDb) {
                    await window.firebaseRemove(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/totpSecrets/admin')
                    );
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🎫 Session Management
    // ═══════════════════════════════════════════════════════════════
    session: {
        async create(fingerprint) {
            try {
                const sessionId = TribeAuthControl.utils.generateId();
                const now = Date.now();
                const deviceInfo = await TribeAuthControl.logger.getDeviceInfo();

                const sessionData = {
                    id: sessionId,
                    fingerprint: fingerprint,
                    createdAt: now,
                    expiresAt: now + TribeAuthControl.config.sessionExpiry,
                    ip: deviceInfo.ip,
                    userAgent: deviceInfo.userAgent,
                    valid: true
                };

                // Token oluştur (fingerprint + session id + timestamp hash)
                const tokenData = `${sessionId}|${fingerprint}|${now}|tribe-secret-key`;
                const token = await TribeAuthControl.utils.sha256(tokenData);
                sessionData.token = token;

                // Firebase'e kaydet
                if (window.firebaseSet && window.firebaseDb) {
                    await window.firebaseSet(
                        window.firebaseRef(window.firebaseDb, `adminSecurity/sessions/${sessionId}`),
                        sessionData
                    );
                }

                // IndexedDB'ye kaydet
                await TribeAuthControl.indexedDB.set('sessions', sessionData);

                // LocalStorage'a sadece session ID'yi kaydet (eski uyumluluk için)
                localStorage.setItem('tribe-admin-session', sessionId);
                localStorage.setItem('tribe-admin-token', token);
                localStorage.setItem('tribe-admin-auth', 'true'); // Eski uyumluluk

                return sessionData;
            } catch (e) {
                console.error('Session create error:', e);
                return null;
            }
        },

        async verify() {
            try {
                const sessionId = localStorage.getItem('tribe-admin-session');
                const storedToken = localStorage.getItem('tribe-admin-token');

                if (!sessionId || !storedToken) {
                    return false;
                }

                // Firebase'den session'ı al
                let sessionData = null;
                if (window.firebaseGet && window.firebaseDb) {
                    const snapshot = await window.firebaseGet(
                        window.firebaseRef(window.firebaseDb, `adminSecurity/sessions/${sessionId}`)
                    );
                    if (snapshot.exists()) {
                        sessionData = snapshot.val();
                    }
                }

                // Firebase'de yoksa IndexedDB'den al
                if (!sessionData) {
                    sessionData = await TribeAuthControl.indexedDB.get('sessions', sessionId);
                }

                if (!sessionData) {
                    return false;
                }

                // Session geçerliliğini kontrol et
                const now = Date.now();

                // Süre dolmuş mu?
                if (sessionData.expiresAt < now) {
                    await this.destroy();
                    return false;
                }

                // Token eşleşiyor mu?
                if (sessionData.token !== storedToken) {
                    await this.destroy();
                    await TribeAuthControl.alerts.sendSuspiciousAlert('Token uyuşmazlığı tespit edildi!');
                    return false;
                }

                // Fingerprint eşleşiyor mu?
                const currentFP = await TribeAuthControl.fingerprint.generate();
                if (sessionData.fingerprint !== currentFP) {
                    await this.destroy();
                    await TribeAuthControl.alerts.sendSuspiciousAlert('Farklı cihazdan oturum erişimi tespit edildi!');
                    return false;
                }

                // Session hala valid mi?
                if (!sessionData.valid) {
                    await this.destroy();
                    return false;
                }

                return true;
            } catch (e) {
                console.error('Session verify error:', e);
                return false;
            }
        },

        async refresh() {
            try {
                const sessionId = localStorage.getItem('tribe-admin-session');
                if (!sessionId) return false;

                const now = Date.now();
                const newExpiry = now + TribeAuthControl.config.sessionExpiry;

                // Firebase'de güncelle
                if (window.firebaseUpdate && window.firebaseDb) {
                    await window.firebaseUpdate(
                        window.firebaseRef(window.firebaseDb, `adminSecurity/sessions/${sessionId}`),
                        { expiresAt: newExpiry }
                    );
                }

                // IndexedDB'de güncelle
                const sessionData = await TribeAuthControl.indexedDB.get('sessions', sessionId);
                if (sessionData) {
                    sessionData.expiresAt = newExpiry;
                    await TribeAuthControl.indexedDB.set('sessions', sessionData);
                }

                return true;
            } catch (e) {
                console.error('Session refresh error:', e);
                return false;
            }
        },

        async destroy() {
            try {
                const sessionId = localStorage.getItem('tribe-admin-session');

                if (sessionId) {
                    // Firebase'den sil
                    if (window.firebaseRemove && window.firebaseDb) {
                        await window.firebaseRemove(
                            window.firebaseRef(window.firebaseDb, `adminSecurity/sessions/${sessionId}`)
                        );
                    }

                    // IndexedDB'den sil
                    await TribeAuthControl.indexedDB.delete('sessions', sessionId);
                }

                // localStorage temizle
                localStorage.removeItem('tribe-admin-session');
                localStorage.removeItem('tribe-admin-token');
                localStorage.removeItem('tribe-admin-auth');
                localStorage.removeItem('tribe-admin-time');

                return true;
            } catch (e) {
                console.error('Session destroy error:', e);
                return false;
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 📧 Email Alerts System
    // ═══════════════════════════════════════════════════════════════
    alerts: {
        async sendLoginAlert() {
            const deviceInfo = await TribeAuthControl.logger.getDeviceInfo();
            const message = `
🔐 YENİ ADMİN GİRİŞİ

📅 Tarih: ${new Date().toLocaleString('tr-TR')}
🌐 IP: ${deviceInfo.ip}
💻 Cihaz: ${deviceInfo.browser} - ${deviceInfo.os}
🔍 Fingerprint: ${await TribeAuthControl.fingerprint.generate()}
📍 Konum: ${deviceInfo.timezone}
            `;

            await this.sendEmail('Admin Paneli - Yeni Giriş', message);
            await TribeAuthControl.logger.logLogin(true);
        },

        async sendSuspiciousAlert(reason) {
            const deviceInfo = await TribeAuthControl.logger.getDeviceInfo();
            const message = `
⚠️ ŞÜPHELİ AKTİVİTE TESPİT EDİLDİ!

❌ Sebep: ${reason}
📅 Tarih: ${new Date().toLocaleString('tr-TR')}
🌐 IP: ${deviceInfo.ip}
💻 Cihaz: ${deviceInfo.browser} - ${deviceInfo.os}
🔍 Fingerprint: ${await TribeAuthControl.fingerprint.generate()}
📍 Konum: ${deviceInfo.timezone}
🖥️ User Agent: ${deviceInfo.userAgent}
            `;

            await this.sendEmail('⚠️ GÜVENLİK UYARISI - Şüpheli Aktivite', message);
            await TribeAuthControl.logger.logAction('suspicious_activity', { reason });
        },

        async sendEmail(subject, body) {
            try {
                // EmailJS yüklü mü kontrol et
                if (typeof emailjs !== 'undefined' && TribeAuthControl.config.emailPublicKey) {
                    await emailjs.send(
                        TribeAuthControl.config.emailServiceId,
                        TribeAuthControl.config.emailTemplateId,
                        {
                            to_email: TribeAuthControl.config.alertEmail,
                            subject: `[Tribe League] ${subject}`,
                            message: body
                        },
                        TribeAuthControl.config.emailPublicKey
                    );
                    console.log('📧 Email gönderildi:', subject);
                    return true;
                }

                // Firebase'e kaydet (backup olarak)
                if (window.firebasePush && window.firebaseDb) {
                    await window.firebasePush(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/emailQueue'),
                        {
                            to: TribeAuthControl.config.alertEmail,
                            subject: `[Tribe League] ${subject}`,
                            body: body,
                            timestamp: Date.now(),
                            sent: false
                        }
                    );
                    console.log('📧 Email Firebase kuyruğuna eklendi');
                }

                return true;
            } catch (e) {
                console.error('Email send error:', e);
                return false;
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 📊 Activity Logger (Detaylı Loglama)
    // ═══════════════════════════════════════════════════════════════
    logger: {
        async getDeviceInfo() {
            try {
                // IP adresini al
                let ip = 'unknown';
                try {
                    const response = await fetch('https://api.ipify.org?format=json');
                    const data = await response.json();
                    ip = data.ip;
                } catch (e) {
                    ip = 'fetch-error';
                }

                // User agent parse et
                const ua = navigator.userAgent;
                let browser = 'Unknown';
                let os = 'Unknown';

                // Browser detection
                if (ua.includes('Chrome')) browser = 'Chrome';
                else if (ua.includes('Firefox')) browser = 'Firefox';
                else if (ua.includes('Safari')) browser = 'Safari';
                else if (ua.includes('Edge')) browser = 'Edge';
                else if (ua.includes('Opera')) browser = 'Opera';

                // OS detection
                if (ua.includes('Windows')) os = 'Windows';
                else if (ua.includes('Mac')) os = 'MacOS';
                else if (ua.includes('Linux')) os = 'Linux';
                else if (ua.includes('Android')) os = 'Android';
                else if (ua.includes('iOS')) os = 'iOS';

                return {
                    ip: ip,
                    userAgent: ua,
                    browser: browser,
                    os: os,
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    screenResolution: `${screen.width}x${screen.height}`,
                    colorDepth: screen.colorDepth,
                    platform: navigator.platform,
                    cookiesEnabled: navigator.cookieEnabled,
                    doNotTrack: navigator.doNotTrack,
                    online: navigator.onLine,
                    memory: navigator.deviceMemory || 'unknown',
                    cores: navigator.hardwareConcurrency || 'unknown'
                };
            } catch (e) {
                console.error('Device info error:', e);
                return {
                    ip: 'error',
                    userAgent: navigator.userAgent,
                    browser: 'Unknown',
                    os: 'Unknown'
                };
            }
        },

        async logLogin(success) {
            try {
                const deviceInfo = await this.getDeviceInfo();
                const fingerprint = await TribeAuthControl.fingerprint.generate();

                const logEntry = {
                    type: 'login',
                    success: success,
                    fingerprint: fingerprint,
                    ip: deviceInfo.ip,
                    browser: deviceInfo.browser,
                    os: deviceInfo.os,
                    userAgent: deviceInfo.userAgent,
                    timezone: deviceInfo.timezone,
                    screenResolution: deviceInfo.screenResolution,
                    language: deviceInfo.language,
                    platform: deviceInfo.platform,
                    memory: deviceInfo.memory,
                    cores: deviceInfo.cores,
                    timestamp: Date.now(),
                    date: new Date().toISOString()
                };

                // Anomaly detection
                await this.detectAnomaly(logEntry);

                // Firebase'e kaydet
                if (window.firebasePush && window.firebaseDb) {
                    await window.firebasePush(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/activityLogs'),
                        logEntry
                    );
                }

                console.log('📝 Login logged:', success ? '✅ Başarılı' : '❌ Başarısız');
                return true;
            } catch (e) {
                console.error('Log login error:', e);
                return false;
            }
        },

        async logAction(action, details = {}) {
            try {
                const deviceInfo = await this.getDeviceInfo();
                const fingerprint = await TribeAuthControl.fingerprint.generate();

                const logEntry = {
                    type: 'action',
                    action: action,
                    details: details,
                    fingerprint: fingerprint,
                    ip: deviceInfo.ip,
                    browser: deviceInfo.browser,
                    os: deviceInfo.os,
                    timestamp: Date.now(),
                    date: new Date().toISOString()
                };

                // Firebase'e kaydet
                if (window.firebasePush && window.firebaseDb) {
                    await window.firebasePush(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/activityLogs'),
                        logEntry
                    );
                }

                console.log('📝 Action logged:', action);
                return true;
            } catch (e) {
                console.error('Log action error:', e);
                return false;
            }
        },

        async detectAnomaly(logEntry) {
            try {
                // 1. Gece girişi kontrolü (00:00 - 06:00)
                const hour = new Date().getHours();
                if (hour >= 0 && hour < 6) {
                    await TribeAuthControl.alerts.sendSuspiciousAlert(
                        `Gece saatlerinde giriş denemesi (Saat: ${hour}:${new Date().getMinutes()})`
                    );
                }

                // 2. Farklı IP'den art arda giriş
                if (window.firebaseGet && window.firebaseDb) {
                    const snapshot = await window.firebaseGet(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/activityLogs')
                    );

                    if (snapshot.exists()) {
                        const logs = Object.values(snapshot.val());
                        const recentLogs = logs
                            .filter(l => l.type === 'login' && l.success)
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .slice(0, 5);

                        if (recentLogs.length >= 2) {
                            const lastLog = recentLogs[0];
                            const prevLog = recentLogs[1];

                            // Farklı IP ve 5 dakikadan kısa sürede
                            if (lastLog.ip !== prevLog.ip &&
                                (lastLog.timestamp - prevLog.timestamp) < 5 * 60 * 1000) {
                                await TribeAuthControl.alerts.sendSuspiciousAlert(
                                    `Kısa sürede farklı IP'den giriş: ${prevLog.ip} → ${lastLog.ip}`
                                );
                            }

                            // Farklı fingerprint
                            if (lastLog.fingerprint !== prevLog.fingerprint) {
                                await TribeAuthControl.alerts.sendSuspiciousAlert(
                                    `Farklı cihazdan giriş tespit edildi`
                                );
                            }
                        }
                    }
                }

                // 3. Hızlı art arda işlemler (Brute force)
                // Bu kontrol rate limiter tarafından yapılıyor

            } catch (e) {
                console.error('Anomaly detection error:', e);
            }
        },

        async getRecentLogs(limit = 50) {
            try {
                if (window.firebaseGet && window.firebaseDb) {
                    const snapshot = await window.firebaseGet(
                        window.firebaseRef(window.firebaseDb, 'adminSecurity/activityLogs')
                    );

                    if (snapshot.exists()) {
                        const logs = Object.entries(snapshot.val())
                            .map(([id, log]) => ({ id, ...log }))
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .slice(0, limit);

                        return logs;
                    }
                }
                return [];
            } catch (e) {
                console.error('Get logs error:', e);
                return [];
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔧 Utility Functions
    // ═══════════════════════════════════════════════════════════════
    utils: {
        async sha256(message) {
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        },

        generateId() {
            return 'sess_' + Date.now().toString(36) + '_' +
                Math.random().toString(36).substring(2, 15);
        },

        async getIPHash() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return await this.sha256(data.ip);
            } catch (e) {
                // Fallback: fingerprint + timestamp
                const fp = await TribeAuthControl.fingerprint.generate();
                return await this.sha256(fp + navigator.userAgent);
            }
        },

        // UTF-8 destekli şifreleme
        async encrypt(text) {
            const key = 'TrIbE_LeAgUe_EnCrYpT_2024';
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const keyBytes = encoder.encode(key);

            const encryptedBytes = new Uint8Array(data.length);
            for (let i = 0; i < data.length; i++) {
                encryptedBytes[i] = data[i] ^ keyBytes[i % keyBytes.length];
            }

            // Binary to Base64
            let binary = '';
            for (let i = 0; i < encryptedBytes.length; i++) {
                binary += String.fromCharCode(encryptedBytes[i]);
            }
            return btoa(binary);
        },

        // UTF-8 destekli şifre çözme
        async decrypt(encoded) {
            const key = 'TrIbE_LeAgUe_EnCrYpT_2024';
            const encoder = new TextEncoder();
            const keyBytes = encoder.encode(key);

            // Base64 to Binary
            const binary = atob(encoded);
            const encryptedBytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                encryptedBytes[i] = binary.charCodeAt(i);
            }

            // Decrypt
            const decryptedBytes = new Uint8Array(encryptedBytes.length);
            for (let i = 0; i < encryptedBytes.length; i++) {
                decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
            }

            // Bytes to UTF-8 string
            const decoder = new TextDecoder();
            return decoder.decode(decryptedBytes);
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🚀 Initialization
    // ═══════════════════════════════════════════════════════════════
    async init() {
        console.log('🛡️ TribeAuthControl initializing...');

        try {
            // IndexedDB başlat
            await this.indexedDB.init();
            console.log('✅ IndexedDB ready');

            // Fingerprint oluştur
            const fp = await this.fingerprint.generate();
            console.log('✅ Fingerprint generated:', fp.substring(0, 8) + '...');

            console.log('🛡️ TribeAuthControl ready!');
            return true;
        } catch (e) {
            console.error('TribeAuthControl init error:', e);
            return false;
        }
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    TribeAuthControl.init();
});

// Global export
window.TribeAuthControl = TribeAuthControl;
