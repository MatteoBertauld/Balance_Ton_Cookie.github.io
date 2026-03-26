const fetchUserData = async () => {
    // 1. Récupération du niveau de batterie (API Battery Status)
    let batteryLevel = "Erreur inconnue";
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            batteryLevel = `${Math.round(battery.level * 100)}% (${battery.charging ? 'En charge' : 'Sur batterie'})`;
        } catch (e) {
            return "Erreur d'accès";
        }
    } else {
        // C'est ici que Firefox arrive
        batteryLevel = "Bloqué par le navigateur (Protection Fingerprinting)";
    }

    // 2. Récupération de la connexion (Vitesse estimée)
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = conn ? `${conn.effectiveType} (~${conn.downlink} Mbps)` : "Bloqué par le navigateur (Protection Fingerprinting)";

    // 3. Mémoire vive (RAM)
    const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Bloqué par le navigateur (Protection Fingerprinting)";

    const data = {
        // Identité & Localisation sommaire
        USER_ID: getSimpleClientId(),
        IP: "192.168.1.XX (SIMULATED)",
        LANG: navigator.language,
        TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,
        
        // Système & Hardware
        OS: getOSName(), 
        CORES: navigator.hardwareConcurrency || "Bloqué par le navigateur (Protection Fingerprinting)",
        RAM: ram,
        GPU: getGraphicsCard(),
        GPU_2: getGraphicsCardSimplified(),
        BROWSER: getBrowserName(),
        
        // État de l'appareil
        BATTERY: batteryLevel,
        CONNECTION: connectionType,
        
        // Navigateur & Fenêtre
        UA: navigator.userAgent.split(') ')[1].split(' ')[0], // Version simplifiée
        RES: `${window.screen.width}x${window.screen.height}`,
        TOUCH: navigator.maxTouchPoints > 0 ? "Oui" : "Non",
        
        // Cookies & Stockage
        COOKIES: navigator.cookieEnabled ? "Activés" : "Désactivés",
        DNT: navigator.doNotTrack === "1" ? "Activé" : "Désactivé"
    };

    renderTerminal(data);
};

const getOSName = () => {
    const ua = navigator.userAgent;
    let os = "Système inconnu";

    // Détection Windows
    if (ua.indexOf("Windows NT 10.0") !== -1) os = "Windows 10/11";
    if (ua.indexOf("Windows NT 6.3") !== -1) os = "Windows 8.1";
    if (ua.indexOf("Windows NT 6.2") !== -1) os = "Windows 8";
    if (ua.indexOf("Windows NT 6.1") !== -1) os = "Windows 7";

    // Détection macOS
    if (ua.indexOf("Mac OS X") !== -1) {
        // On essaie d'extraire la version (ex: 10_15_7)
        const match = ua.match(/Mac OS X (\d+[._]\d+[._]\d+)/);
        const version = match ? match[1].replace(/_/g, '.') : "";
        os = `macOS ${version}`;
    }

    // Détection Linux & Android
    if (ua.indexOf("Android") !== -1) os = "Android";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";

    // Détection iOS (iPhone/iPad)
    if (/iPhone|iPad|iPod/.test(ua) && !window.MSStream) os = "iOS";

    return os;
};


const getBrowserName = () => {
    const ua = navigator.userAgent;
    let browser = "Inconnu";

    // L'ordre est important car Chrome est présent dans l'UA de Brave et Edge
    if (ua.includes("Edg")) {
        browser = "Microsoft Edge";
    } else if (ua.includes("Brave")) {
        browser = "Brave";
    } else if (ua.includes("Firefox")) {
        browser = "Mozilla Firefox";
    } else if (ua.includes("Chrome")) {
        browser = "Google Chrome";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
        browser = "Apple Safari";
    } else if (ua.includes("Opera") || ua.includes("OPR")) {
        browser = "Opera";
    }

    // Détection spécifique pour Brave (car ils cachent souvent leur nom dans l'UA)
    if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
        browser = "Brave";
    }

    return browser;
};

const getSimpleClientId = () => {
    // On cherche si un ID existe déjà dans le stockage du navigateur
    let id = localStorage.getItem('user_simple_id');
    
    if (!id) {
        // Génère un nombre aléatoire entre 100 et 999
        id = Math.floor(Math.random() * 900) + 100;
        // On l'enregistre pour la prochaine fois
        localStorage.setItem('user_simple_id', id);
    }
    return id;
};

// Fonction pour tenter de deviner la carte graphique (GPU)
function getGraphicsCard() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    } catch (e) {
        return "Inconnu";
    }
}


function getGraphicsCardSimplified() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const fullString = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        const isProtected = fullString.toLowerCase().includes("or similar");

        // 1. On enlève le "ANGLE (...)" autour de la chaîne si présent
        let extract = fullString.replace(/^ANGLE \((.*)\)$/, '$1');

        // 2. On sépare par les virgules et on prend la partie qui contient le modèle
        // Souvent c'est la deuxième partie : "NVIDIA, NVIDIA GeForce..."
        let parts = extract.split(',');
        let model = parts.length > 1 ? parts[1] : parts[0];

        // 3. Nettoyage final : 
        // - Enlève les codes hexadécimaux (0x...)
        // - Enlève les mentions Direct3D et versions de shaders
        // - Enlève les espaces en trop
        let cleaned = model
            .replace(/\(0x[0-9a-fA-F]+\)/g, '') 
            .replace(/Direct3D.*/g, '')
            .replace(/vs_.*ps_.*/g, '')
            .trim();

        if (isProtected) {
            cleaned += " (ou similaire) : Identité matérielle exacte masquée";
        }

        return cleaned || "GPU Inconnu";
    } catch (e) {
        return "Accès restreint";
    }
}


const renderTerminal = (data) => {
    const terminal = document.getElementById('terminal-content');
    
    // Organisation par catégories
    const categories = [
        {
            title: "Général",
            items: [
                { label: "ID utilisateur", value: data.USER_ID },
                { label: "Adresse IP", value: data.IP },
                { label: "Localisation", value: data.TIMEZONE },
                { label: "Système (OS)", value: data.OS },
                { label: "Navigateur", value: data.BROWSER },
                { label: "Résolution", value: data.RES },
                { label: "Suivi DNT", value: data.DNT }
            ]
        },
        {
            title: "Informations Machine",
            items: [
                { label: "Réseau", value: data.CONNECTION },
                { label: "Processeur", value: data.CORES + " Coeurs" },
                { label: "Mémoire RAM", value: data.RAM },
                { label: "Carte Graphique", value: data.GPU_2 },
                { label: "Batterie", value: data.BATTERY }
            ]
        }
    ];

    //<div class="animate-pulse text-brand mb-6 font-bold uppercase tracking-widest text-[10px]">[SYSTEM_SCAN_COMPLETE] Empreinte générée...</div>
    terminal.innerHTML = `
        <div class="space-y-6">
            ${categories.map(cat => `
                <div class="category-group">
                    <h4 class="text-brand/70 text-[10px] uppercase font-bold mb-2 tracking-tighter border-l-2 border-brand pl-2">
                        ${cat.title}
                    </h4>
                    <ul class="space-y-2 font-data text-xs md:text-sm">
                        ${cat.items.map(item => `
                            <li class="flex justify-between border-b border-stroke/10 pb-1">
                                <span class="text-txt-muted">${item.label}:</span>
                                <span class="text-brand text-right ml-4 font-medium">${item.value}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="mt-8 p-3 bg-brand/5 border border-brand/20 rounded text-[10px] text-brand/70 italic font-data leading-relaxed">
            <span class="font-bold uppercase block mb-1">Avertissement :</span>
            Toutes ces données machine sont accessibles sans votre consentement via des scripts de "fingerprinting" publicitaires.
        </div>
    `;
};
document.addEventListener('DOMContentLoaded', fetchUserData);
