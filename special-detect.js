// ╔══════════════════════════════════════════════════════════════╗
// ║  🔒 TRIBE LEAGUE - SPECIAL DETECTION SYSTEM                   ║
// ║  Hidden Settings Panel & Owner-Only Access Control           ║
// ╚══════════════════════════════════════════════════════════════╝

const TribeSpecialPanel = {
    // ═══════════════════════════════════════════════════════════════
    // 🔐 Owner Configuration
    // ═══════════════════════════════════════════════════════════════
    config: {
        // Bu fingerprint'ler sadece senin cihazlarından kaydedilecek
        ownerFingerprints: [],

        // Ayarlar paneli Firebase path'i
        settingsPanelPath: 'adminSecurity/settingsPanelHTML',
        ownerFingerprintsPath: 'adminSecurity/ownerFingerprints',

        // DevTools koruma
        devToolsProtection: true,

        // Panel yüklenme durumu
        panelLoaded: false
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔍 Owner Detection
    // ═══════════════════════════════════════════════════════════════
    async isOwner() {
        try {
            // Mevcut fingerprint'i al
            const currentFP = await TribeAuthControl.fingerprint.generate();

            // Firebase'den kayıtlı owner fingerprint'leri al
            if (window.firebaseGet && window.firebaseDb) {
                const snapshot = await window.firebaseGet(
                    window.firebaseRef(window.firebaseDb, this.config.ownerFingerprintsPath)
                );

                if (snapshot.exists()) {
                    const ownerFPs = snapshot.val();

                    // Array veya object olabilir
                    const fpArray = Array.isArray(ownerFPs) ? ownerFPs : Object.values(ownerFPs);

                    // Fingerprint eşleşiyor mu?
                    if (fpArray.includes(currentFP)) {
                        console.log('✅ Owner verified!');
                        return true;
                    }
                }
            }

            console.log('❌ Not owner');
            return false;
        } catch (e) {
            console.error('Owner check error:', e);
            return false;
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 📝 Owner Registration (İlk kurulum için)
    // ═══════════════════════════════════════════════════════════════
    async registerAsOwner() {
        try {
            const currentFP = await TribeAuthControl.fingerprint.generate();

            // Mevcut owner listesini al
            let ownerFPs = [];
            if (window.firebaseGet && window.firebaseDb) {
                const snapshot = await window.firebaseGet(
                    window.firebaseRef(window.firebaseDb, this.config.ownerFingerprintsPath)
                );

                if (snapshot.exists()) {
                    const existing = snapshot.val();
                    ownerFPs = Array.isArray(existing) ? existing : Object.values(existing);
                }
            }

            // Zaten kayıtlı mı?
            if (ownerFPs.includes(currentFP)) {
                console.log('ℹ️ Bu cihaz zaten owner olarak kayıtlı');
                return { success: true, message: 'Zaten kayıtlı', fingerprint: currentFP };
            }

            // Yeni fingerprint ekle
            ownerFPs.push(currentFP);

            // Firebase'e kaydet
            if (window.firebaseSet && window.firebaseDb) {
                await window.firebaseSet(
                    window.firebaseRef(window.firebaseDb, this.config.ownerFingerprintsPath),
                    ownerFPs
                );

                // Log kaydet
                await TribeAuthControl.logger.logAction('owner_registered', {
                    fingerprint: currentFP
                });

                console.log('✅ Owner olarak kaydedildi:', currentFP);
                return { success: true, message: 'Owner olarak kaydedildin!', fingerprint: currentFP };
            }

            return { success: false, message: 'Firebase bağlantısı yok' };
        } catch (e) {
            console.error('Owner registration error:', e);
            return { success: false, message: e.message };
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🎨 Hidden Settings Panel Loader
    // ═══════════════════════════════════════════════════════════════
    async loadSecretPanel() {
        try {
            // Owner kontrolü
            const isOwner = await this.isOwner();
            if (!isOwner) {
                console.log('🚫 Settings panel yüklenmedi - Owner değilsin');
                return false;
            }

            // Firebase'den şifreli HTML al
            if (window.firebaseGet && window.firebaseDb) {
                const snapshot = await window.firebaseGet(
                    window.firebaseRef(window.firebaseDb, this.config.settingsPanelPath)
                );

                if (snapshot.exists()) {
                    const encryptedHTML = snapshot.val();

                    // HTML'i decrypt et
                    const decryptedHTML = await TribeAuthControl.utils.decrypt(encryptedHTML);

                    // Settings tab'ı göster
                    this.showSettingsTab();

                    // Panel içeriğini inject et
                    const panelContainer = document.getElementById('panel-settings');
                    if (panelContainer) {
                        panelContainer.innerHTML = decryptedHTML;
                    }

                    this.config.panelLoaded = true;
                    console.log('✅ Secret panel yüklendi!');

                    // Log
                    await TribeAuthControl.logger.logAction('secret_panel_loaded');

                    return true;
                } else {
                    // Panel henüz Firebase'e yüklenmemiş, varsayılan panel oluştur
                    console.log('ℹ️ Settings panel Firebase\'de bulunamadı, varsayılan yükleniyor...');
                    this.showSettingsTab();
                    this.loadDefaultSettingsPanel();
                    return true;
                }
            }

            return false;
        } catch (e) {
            console.error('Secret panel load error:', e);
            return false;
        }
    },

    // Settings tab'ı göster
    showSettingsTab() {
        const settingsTab = document.getElementById('settingsTab');
        if (settingsTab) {
            settingsTab.style.display = 'flex';
            settingsTab.style.background = 'linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(255, 71, 87, 0.05))';
            settingsTab.style.border = '1px solid rgba(255, 71, 87, 0.3)';
        }
    },

    // Varsayılan settings paneli
    loadDefaultSettingsPanel() {
        const panelContainer = document.getElementById('panel-settings');
        if (!panelContainer) return;

        panelContainer.innerHTML = `
            <div class="panel-title" style="color: #ff4757;">
                <i class="fas fa-user-shield"></i> Özel Ayarlar (Sadece Owner)
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(255, 71, 87, 0.1), rgba(255, 71, 87, 0.02)); border: 1px solid rgba(255, 71, 87, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 25px;">
                <h3 style="color: #ff4757; margin: 0 0 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-fingerprint"></i> Cihaz Yönetimi
                </h3>
                <p style="color: var(--text-muted); margin-bottom: 15px;">
                    Bu cihaz owner olarak kayıtlı. Fingerprint: <code id="currentFingerprint" style="color: var(--primary); background: rgba(196,255,14,0.1); padding: 2px 8px; border-radius: 4px;"></code>
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-danger" onclick="TribeSpecialPanel.showOwnerList()">
                        <i class="fas fa-list"></i> Owner Listesi
                    </button>
                    <button class="btn btn-warning" onclick="TribeSpecialPanel.removeOwner()">
                        <i class="fas fa-user-minus"></i> Owner Kaldır
                    </button>
                </div>
                <div id="ownerListContainer" style="margin-top: 20px; display: none;"></div>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.02)); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 25px;">
                <h3 style="color: var(--accent); margin: 0 0 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-key"></i> 2FA Yönetimi
                </h3>
                <div id="2faStatusContainer">
                    <p style="color: var(--text-muted);">2FA durumu yükleniyor...</p>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;">
                    <button class="btn btn-success" onclick="TribeSpecialPanel.setup2FA()">
                        <i class="fas fa-qrcode"></i> 2FA Kur
                    </button>
                    <button class="btn btn-danger" onclick="TribeSpecialPanel.disable2FA()">
                        <i class="fas fa-times"></i> 2FA Kapat
                    </button>
                </div>
                <div id="2faSetupContainer" style="margin-top: 20px; display: none;"></div>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(46, 213, 115, 0.1), rgba(46, 213, 115, 0.02)); border: 1px solid rgba(46, 213, 115, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 25px;">
                <h3 style="color: var(--success); margin: 0 0 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-history"></i> Aktivite Logları
                </h3>
                <button class="btn btn-accent" onclick="TribeSpecialPanel.loadActivityLogs()">
                    <i class="fas fa-sync"></i> Logları Yükle
                </button>
                <div id="activityLogsContainer" style="margin-top: 20px; max-height: 400px; overflow-y: auto;"></div>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(255, 165, 2, 0.1), rgba(255, 165, 2, 0.02)); border: 1px solid rgba(255, 165, 2, 0.3); border-radius: 16px; padding: 25px; margin-bottom: 25px;">
                <h3 style="color: var(--warning); margin: 0 0 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-shield-alt"></i> Güvenlik Ayarları
                </h3>
                <div style="display: grid; gap: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                        <span><i class="fas fa-user-lock"></i> Rate Limiting</span>
                        <span style="color: var(--success);">✅ Aktif</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                        <span><i class="fas fa-fingerprint"></i> Fingerprint Kontrolü</span>
                        <span style="color: var(--success);">✅ Aktif</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                        <span><i class="fas fa-bell"></i> Email Bildirimleri</span>
                        <span id="emailStatus" style="color: var(--warning);">⚠️ Yapılandırılmamış</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                        <span><i class="fas fa-database"></i> IndexedDB</span>
                        <span style="color: var(--success);">✅ Aktif</span>
                    </div>
                </div>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(196, 255, 14, 0.1), rgba(196, 255, 14, 0.02)); border: 1px solid rgba(196, 255, 14, 0.3); border-radius: 16px; padding: 25px;">
                <h3 style="color: var(--primary); margin: 0 0 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-cloud-upload-alt"></i> Panel Yönetimi
                </h3>
                <p style="color: var(--text-muted); margin-bottom: 15px;">
                    Bu ayarlar panelinin HTML'ini Firebase'e yükle. Böylece HTML kodda görünmez.
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="TribeSpecialPanel.uploadPanelToFirebase()">
                        <i class="fas fa-upload"></i> Firebase'e Yükle
                    </button>
                    <button class="btn btn-accent" onclick="TribeSpecialPanel.clearAllSessions()">
                        <i class="fas fa-broom"></i> Tüm Oturumları Temizle
                    </button>
                </div>
            </div>
        `;

        // Fingerprint göster
        this.showCurrentFingerprint();

        // 2FA durumunu göster
        this.check2FAStatus();
    },

    async showCurrentFingerprint() {
        const fp = await TribeAuthControl.fingerprint.generate();
        const el = document.getElementById('currentFingerprint');
        if (el) {
            el.textContent = fp.substring(0, 16) + '...';
            el.title = fp;
        }
    },

    async check2FAStatus() {
        const container = document.getElementById('2faStatusContainer');
        if (!container) return;

        const isEnabled = await TribeAuthControl.totp.isEnabled();

        container.innerHTML = isEnabled
            ? '<p style="color: var(--success);"><i class="fas fa-check-circle"></i> 2FA aktif</p>'
            : '<p style="color: var(--warning);"><i class="fas fa-exclamation-circle"></i> 2FA aktif değil</p>';
    },

    async setup2FA() {
        const container = document.getElementById('2faSetupContainer');
        if (!container) return;

        // Secret oluştur
        const secret = await TribeAuthControl.totp.generateSecret();
        const qrUrl = TribeAuthControl.totp.generateQRCodeURL(secret);

        container.style.display = 'block';
        container.innerHTML = `
            <div style="background: rgba(0,0,0,0.3); border-radius: 16px; padding: 20px; text-align: center;">
                <p style="color: #fff; margin-bottom: 15px;">Microsoft Authenticator ile QR kodu tara:</p>
                <img src="${qrUrl}" alt="QR Code" style="background: white; padding: 10px; border-radius: 10px; margin-bottom: 15px;">
                <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px;">
                    Manuel giriş için kod: <code style="color: var(--primary); word-break: break-all;">${secret}</code>
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <input type="text" id="verify2FACode" placeholder="6 haneli kod" maxlength="6" 
                        style="padding: 12px; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 10px; color: #fff; text-align: center; font-size: 1.2rem; width: 150px;">
                    <button class="btn btn-success" onclick="TribeSpecialPanel.verify2FASetup('${secret}')">
                        <i class="fas fa-check"></i> Doğrula
                    </button>
                </div>
            </div>
        `;
    },

    async verify2FASetup(secret) {
        const codeInput = document.getElementById('verify2FACode');
        if (!codeInput) return;

        const code = codeInput.value.trim();
        if (code.length !== 6) {
            alert('6 haneli kod girin!');
            return;
        }

        const isValid = await TribeAuthControl.totp.verifyCode(secret, code);

        if (isValid) {
            // Secret'ı kaydet
            await TribeAuthControl.totp.saveSecret(secret);
            alert('✅ 2FA başarıyla kuruldu!');
            this.check2FAStatus();
            document.getElementById('2faSetupContainer').style.display = 'none';

            // Log
            await TribeAuthControl.logger.logAction('2fa_enabled');
        } else {
            alert('❌ Kod yanlış! Tekrar deneyin.');
        }
    },

    async disable2FA() {
        if (!confirm('2FA\'yı devre dışı bırakmak istediğinize emin misiniz?')) {
            return;
        }

        await TribeAuthControl.totp.disable();
        alert('2FA devre dışı bırakıldı.');
        this.check2FAStatus();

        // Log
        await TribeAuthControl.logger.logAction('2fa_disabled');
    },

    async showOwnerList() {
        const container = document.getElementById('ownerListContainer');
        if (!container) return;

        container.style.display = 'block';
        container.innerHTML = '<p style="color: var(--text-muted);">Yükleniyor...</p>';

        try {
            if (window.firebaseGet && window.firebaseDb) {
                const snapshot = await window.firebaseGet(
                    window.firebaseRef(window.firebaseDb, this.config.ownerFingerprintsPath)
                );

                if (snapshot.exists()) {
                    const ownerFPs = snapshot.val();
                    const fpArray = Array.isArray(ownerFPs) ? ownerFPs : Object.values(ownerFPs);
                    const currentFP = await TribeAuthControl.fingerprint.generate();

                    let html = '<div style="display: grid; gap: 10px;">';
                    fpArray.forEach((fp, i) => {
                        const isCurrent = fp === currentFP;
                        html += `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: rgba(0,0,0,0.3); border-radius: 10px; ${isCurrent ? 'border: 1px solid var(--primary);' : ''}">
                                <span style="font-family: monospace; font-size: 0.85rem;">
                                    ${isCurrent ? '👤 ' : ''}${fp.substring(0, 20)}...
                                    ${isCurrent ? '<span style="color: var(--primary); margin-left: 10px;">(Bu cihaz)</span>' : ''}
                                </span>
                                <button class="btn btn-danger" style="padding: 6px 12px; font-size: 0.8rem;" onclick="TribeSpecialPanel.removeOwnerByFP('${fp}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    });
                    html += '</div>';
                    container.innerHTML = html;
                } else {
                    container.innerHTML = '<p style="color: var(--warning);">Kayıtlı owner yok!</p>';
                }
            }
        } catch (e) {
            container.innerHTML = `<p style="color: var(--danger);">Hata: ${e.message}</p>`;
        }
    },

    async removeOwnerByFP(fingerprint) {
        if (!confirm('Bu cihazı owner listesinden kaldırmak istediğinize emin misiniz?')) {
            return;
        }

        try {
            if (window.firebaseGet && window.firebaseDb) {
                const snapshot = await window.firebaseGet(
                    window.firebaseRef(window.firebaseDb, this.config.ownerFingerprintsPath)
                );

                if (snapshot.exists()) {
                    let ownerFPs = snapshot.val();
                    const fpArray = Array.isArray(ownerFPs) ? ownerFPs : Object.values(ownerFPs);

                    const newFPs = fpArray.filter(fp => fp !== fingerprint);

                    await window.firebaseSet(
                        window.firebaseRef(window.firebaseDb, this.config.ownerFingerprintsPath),
                        newFPs
                    );

                    await TribeAuthControl.logger.logAction('owner_removed', { fingerprint });

                    alert('Owner kaldırıldı!');
                    this.showOwnerList();
                }
            }
        } catch (e) {
            alert('Hata: ' + e.message);
        }
    },

    async removeOwner() {
        const currentFP = await TribeAuthControl.fingerprint.generate();

        if (!confirm('Kendinizi owner listesinden kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
            return;
        }

        await this.removeOwnerByFP(currentFP);
    },

    async loadActivityLogs() {
        const container = document.getElementById('activityLogsContainer');
        if (!container) return;

        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;"><i class="fas fa-spinner fa-spin"></i> Yükleniyor...</p>';

        try {
            const logs = await TribeAuthControl.logger.getRecentLogs(100);

            if (logs.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Henüz log yok.</p>';
                return;
            }

            let html = '';
            logs.forEach(log => {
                const typeColors = {
                    'login': log.success ? 'var(--success)' : 'var(--danger)',
                    'action': 'var(--accent)',
                    'suspicious_activity': 'var(--danger)'
                };

                const typeIcons = {
                    'login': log.success ? 'fa-sign-in-alt' : 'fa-times-circle',
                    'action': 'fa-cog',
                    'suspicious_activity': 'fa-exclamation-triangle'
                };

                const color = typeColors[log.type] || 'var(--text-muted)';
                const icon = typeIcons[log.type] || 'fa-info-circle';

                const date = new Date(log.timestamp).toLocaleString('tr-TR');

                html += `
                    <div style="display: grid; grid-template-columns: 40px 1fr auto; gap: 12px; align-items: center; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 10px; margin-bottom: 8px; border-left: 3px solid ${color};">
                        <div style="width: 40px; height: 40px; background: ${color}20; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas ${icon}" style="color: ${color};"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #fff; font-size: 0.9rem;">
                                ${log.type === 'login' ? (log.success ? 'Başarılı Giriş' : 'Başarısız Giriş') : (log.action || log.type)}
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">
                                ${log.ip || 'IP yok'} | ${log.browser || ''} ${log.os || ''}
                            </div>
                        </div>
                        <div style="text-align: right; font-size: 0.75rem; color: var(--text-muted);">
                            ${date}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        } catch (e) {
            container.innerHTML = `<p style="color: var(--danger);">Hata: ${e.message}</p>`;
        }
    },

    async uploadPanelToFirebase() {
        try {
            const panelContainer = document.getElementById('panel-settings');
            if (!panelContainer) {
                alert('Panel bulunamadı!');
                return;
            }

            const html = panelContainer.innerHTML;
            const encrypted = await TribeAuthControl.utils.encrypt(html);

            if (window.firebaseSet && window.firebaseDb) {
                await window.firebaseSet(
                    window.firebaseRef(window.firebaseDb, this.config.settingsPanelPath),
                    encrypted
                );

                await TribeAuthControl.logger.logAction('panel_uploaded_to_firebase');

                alert('✅ Panel Firebase\'e yüklendi! Artık HTML\'de görünmeyecek.');
            }
        } catch (e) {
            alert('Hata: ' + e.message);
        }
    },

    async clearAllSessions() {
        if (!confirm('Tüm oturumları temizlemek istediğinize emin misiniz? Herkes çıkış yapmak zorunda kalacak.')) {
            return;
        }

        try {
            if (window.firebaseRemove && window.firebaseDb) {
                await window.firebaseRemove(
                    window.firebaseRef(window.firebaseDb, 'adminSecurity/sessions')
                );

                await TribeAuthControl.logger.logAction('all_sessions_cleared');

                alert('✅ Tüm oturumlar temizlendi!');
            }
        } catch (e) {
            alert('Hata: ' + e.message);
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🛡️ DOM Protection (DevTools Detection)
    // ═══════════════════════════════════════════════════════════════
    initDOMProtection() {
        if (!this.config.devToolsProtection) return;

        // DevTools açılma tespiti (basit)
        let devToolsOpen = false;

        const checkDevTools = () => {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;

            if (widthThreshold || heightThreshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    console.log('🔍 DevTools tespit edildi');
                    TribeAuthControl.logger.logAction('devtools_opened');
                }
            } else {
                devToolsOpen = false;
            }
        };

        // Her saniye kontrol et
        setInterval(checkDevTools, 1000);

        // Console.log override (opsiyonel)
        // Dikkat: Bu production'da problemli olabilir
    },

    // ═══════════════════════════════════════════════════════════════
    // 🔍 Access Check (Ana fonksiyon)
    // ═══════════════════════════════════════════════════════════════
    async checkAccess() {
        console.log('🔒 Checking special access...');

        // TribeOwner kontrolü (IP + ekran) - önce bunu kontrol et
        let isOwnerIPScreen = false;
        if (window.TribeOwner) {
            isOwnerIPScreen = await window.TribeOwner.verifyOwner();
        }

        // Fingerprint kontrolü
        const isOwnerFingerprint = await this.isOwner();

        // IP+ekran doğruysa ama fingerprint kayıtlı değilse, otomatik kaydet
        if (isOwnerIPScreen && !isOwnerFingerprint) {
            console.log('📝 IP+ekran eşleşti, fingerprint otomatik kaydediliyor...');
            await this.registerAsOwner();
        }

        // VEYA mantığı: IP+ekran VEYA fingerprint yeterli
        const hasAccess = isOwnerIPScreen || isOwnerFingerprint;

        console.log('🔐 Access check result:', {
            ipScreenMatch: isOwnerIPScreen,
            fingerprintMatch: isOwnerFingerprint,
            hasAccess: hasAccess
        });

        if (hasAccess) {
            console.log('✅ Owner access granted');

            // Settings tab'ı göster
            const settingsTab = document.getElementById('settingsTab');
            if (settingsTab) {
                settingsTab.style.display = 'flex';
                settingsTab.style.background = 'linear-gradient(135deg, rgba(255, 71, 87, 0.2), rgba(255, 71, 87, 0.05))';
                settingsTab.style.border = '1px solid rgba(255, 71, 87, 0.3)';
            }

            // Fingerprint göster
            this.showCurrentFingerprint();

            // 2FA durumu göster
            this.check2FAStatus();

            // DOM protection başlat
            this.initDOMProtection();

            return true;
        }

        console.log('🚫 Access denied - not owner');
        // Settings tab'ı gizle
        const settingsTab = document.getElementById('settingsTab');
        if (settingsTab) settingsTab.style.display = 'none';

        return false;
    },

    // ═══════════════════════════════════════════════════════════════
    // 🚀 Initialization
    // ═══════════════════════════════════════════════════════════════
    async init() {
        console.log('🔒 TribeSpecialPanel initializing...');

        // TribeAuthControl hazır mı bekle
        let attempts = 0;
        while (!window.TribeAuthControl && attempts < 20) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
        }

        if (!window.TribeAuthControl) {
            console.error('TribeAuthControl not found!');
            return false;
        }

        console.log('🔒 TribeSpecialPanel ready!');
        return true;
    }
};

// Global export
window.TribeSpecialPanel = TribeSpecialPanel;

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    TribeSpecialPanel.init();
});
