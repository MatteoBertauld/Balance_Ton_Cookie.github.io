// ndt
// Ne pas partager l'address ip à GPT ni aucune donnée identifiable



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
        batteryLevel = "Information bloquée par le navigateur";
    }

    


    // 2. Récupération de la connexion (Vitesse estimée)
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = conn ? `${conn.effectiveType} (~${conn.downlink} Mbps)` : "Information bloquée par le navigateur";

    // 3. Mémoire vive (RAM)
    const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Information bloquée par le navigateur";


    const hasRead_cookie = localStorage.getItem('read_cookie') === 'true';
    const hasRead_confidentialite = localStorage.getItem('read_confidentialite') === 'true';
    const hasRead_mention_legale = localStorage.getItem('read_mention_legale') === 'true';


    const data = {
        // Identité & Localisation sommaire
        USER_ID: getSimpleClientId(),
        IP: await GetIP(),
        
        LANG: navigator.language,
        TIMEZONE: Intl.DateTimeFormat().resolvedOptions().timeZone,

        COUPURE_INTERNET: reconnectCount,
        RECONNECTION: refreshCount,
        PAGE_VIEWS: tabSwitchCount,
        
        // Système & Hardware
        OS: getOSName(), 
        CORES: navigator.hardwareConcurrency || "Bloqué par le navigateur (Protection Fingerprinting)",
        RAM: ram,
        GPU: getGraphicsCard(),
        GPU_2: getGraphicsCardSimplified(),
        BROWSER: getBrowserName(),

        AD_BLOCK: await detectAdBlockerTruePositive(),

        SESSIONCLICK: sessionClicks,
        GLOBALCLICK: totalClicks,

        READ_MENTION_LEGALE: hasRead_mention_legale ? "Oui" : "Non",
        READ_CONFIDENTIALITE: hasRead_confidentialite ? "Oui" : "Non",
        READ_COOKIE: hasRead_cookie ? "Oui" : "Non",

                
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



const GetIP = async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
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

async function detectAdBlockerTruePositive() {
    const googleAdsUrl = 'https://static.ads-twitter.com/uwt.js';
    const neutralUrl = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';

    try {
        // 1. On vérifie si on peut charger un script NEUTRE (JQuery sur CDN)
        const neutralCheck = await fetch(neutralUrl, { method: 'HEAD', mode: 'no-cors' });
        
        // 2. Si le neutre passe, on teste la PUB
        try {
            await fetch(googleAdsUrl, { method: 'HEAD', mode: 'no-cors' });
            return "🟢 Pas de bloqueur";
        } catch (e) {
            return "🔴 Bloqueur de pub actif (Extension ou DNS)";
        }

    } catch (e) {
        // Si même le script neutre échoue, c'est un problème de connexion ou de pare-feu global
        return "⚠️ Erreur réseau globale (Pas d'internet ou Pare-feu strict)";
    }
}


let tabSwitchCount = 0;

let totalTimeActif = parseInt(localStorage.getItem('total_time_actif')) || 0;;
let LastTimeActif = Date.now();

let totalTime = parseInt(localStorage.getItem('total_time')) || 0;;
let FirstStartTime = Date.now();


// Fonction pour mettre à jour le temps accumulé
function updateActifTime() {
    
    if (document.visibilityState === 'visible') {
        tabSwitchCount++;
        const tabSwitchCountDisplay = document.getElementById('tab_switch_count');
        tabSwitchCountDisplay.innerText = tabSwitchCount;
    }
}
// Écouter les changements de visibilité (changement d'onglet, réduction de fenêtre)
document.addEventListener('visibilitychange', updateActifTime);


function convertTimetoString(Time){

    // Conversion en secondes totales
    const totalSeconds = Math.floor(Time / 1000);

    // Calcul des minutes et des secondes restantes
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Formatage avec "padStart" pour avoir toujours deux chiffres (ex: 05 au lieu de 5)
    const minStr = String(minutes).padStart(2, '0');
    const secStr = String(seconds).padStart(2, '0');

    return `${minStr}:${secStr}`;
}

function updateTime() {
    totalTime += 1000;
    localStorage.setItem('total_time', totalTime);

    if (document.visibilityState === 'visible') {
        totalTimeActif += 1000;
        localStorage.setItem('total_time_actif', totalTimeActif);
    } 
    const timeActifDisplay = document.getElementById('id_time');
    timeActifDisplay.innerText = convertTimetoString(totalTimeActif) + " (Total : " + convertTimetoString(totalTime) + ")";
}

const intervalID = setInterval(() => {
    updateTime();
}, 1000);





let refreshCount = parseInt(localStorage.getItem('refresh_count')) || 0;
let reconnectCount = parseInt(localStorage.getItem('reconnect_count')) || 0;

// --- 2. DÉTECTION DE L'ACTUALISATION (F5 / REFRESH) ---
const navEntries = performance.getEntriesByType("navigation");
if (navEntries.length > 0 && navEntries[0].type === "reload") {
    refreshCount++;
    localStorage.setItem('refresh_count', refreshCount);
}

// --- 3. DÉTECTION DU RETOUR D'INTERNET (ONLINE) ---
window.addEventListener('online', () => {
    reconnectCount++;
    localStorage.setItem('reconnect_count', reconnectCount);
    console.log(`[NETWORK] Connexion rétablie. Total : ${reconnectCount}`);
});


// Initialisation des compteurs
let sessionClicks = 0; // Clics depuis l'ouverture de l'onglet
let totalClicks = parseInt(localStorage.getItem('global_click_count')) || 0; // Clics historiques

// Écouteur global sur toute la fenêtre
window.addEventListener('click', () => {
    sessionClicks++;
    totalClicks++;
    
    // Sauvegarde immédiate dans le localStorage
    localStorage.setItem('global_click_count', totalClicks);

    const clickDisplay = document.getElementById('nombre-clicks');
    if (clickDisplay) {
        clickDisplay.innerText = `${sessionClicks} (Total: ${totalClicks})`;
    }
    
    console.log(`[USER_ACTION] Clic détecté. Session: ${sessionClicks} | Global: ${totalClicks}`);
});


const renderTerminal = (data) => {
    const terminal = document.getElementById('terminal-content');
    
    // Organisation par catégories
    const categories = [
        {
            title: "Utilisateur",
            items: [
                { id:"user-id",label: "ID utilisateur", value: data.USER_ID },
                { id:"ip-address", label: "Adresse IP", value: data.IP },
                { id:"location", label: "Localisation", value: data.TIMEZONE },
            ],
        },
        {
            title: "Navigateur",
            items: [
                { id:"os", label: "Système (OS)", value: data.OS },
                { id:"browser", label: "Navigateur", value: data.BROWSER },
                { id:"resolution", label: "Résolution", value: data.RES },
                { id:"dnt-tracking", label: "Suivi DNT", value: data.DNT },
                { id:"adblock", label: "Bloqueur de pub", value: data.AD_BLOCK },
            ]
        },
        {
            title: "Informations Machine",
            items: [
                { id:"network", label: "Réseau", value: data.CONNECTION },
                { id:"cpu", label: "Processeur", value: data.CORES + " Coeurs" },
                { id:"ram", label: "Mémoire RAM", value: data.RAM },
                { id:"gpu", label: "Carte Graphique", value: data.GPU_2 },
                { id:"battery", label: "Batterie", value: data.BATTERY }
            ]
        },
        {
            title: "Statistiques de navigation",
            items: [
                { id:"id_time", label: "Temps total (session, global)", value: "0 (Total : 0)" },
                { id:"tab_switch_count", label: "Nombre de changement de page", value: data.PAGE_VIEWS },
                { id:"reconnections", label: "Nombre de reconnexions", value: data.RECONNECTION },
                { id:"coupure-internet", label: "Nombre de coupures d'internet", value: data.COUPURE_INTERNET },
                { id:"nombre-clicks", label: "Nombre de clics (session, global)", value: data.SESSIONCLICK + " (Total: " + data.GLOBALCLICK + ")" },
                { id:"read_mention_legale", label: "Mentions Légales", value: data.READ_MENTION_LEGALE },
                { id:"read_confidentialite", label: "Confidentialité", value: data.READ_CONFIDENTIALITE },
                { id:"read_cookie", label: "Cookies", value: data.READ_COOKIE },
            ],
        },
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
                                <span id="${item.id}" class="text-brand text-right ml-4 font-medium">${item.value}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="mt-8 p-3 bg-brand/5 border border-brand/20 rounded text-[10px] text-brand/70 italic font-data leading-relaxed">
            <span class="font-bold uppercase block mb-1">Avertissement :</span>
            Si les lois (RGPD,Loi 25) impose un consentement explicite pour exploiter ces métadonnées, la réalité technique est plus sombre : de nombreux sites collectent ces signaux en silence, hors de tout cadre légal. [Plongez dans l'abîme] pour découvrir l'envers du décor.
        </div>
    `;
};
document.addEventListener('DOMContentLoaded', fetchUserData);

