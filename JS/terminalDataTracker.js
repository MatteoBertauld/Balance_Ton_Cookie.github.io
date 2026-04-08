// ndt
// Ne pas partager l'address ip à GPT ni aucune donnée identifiable


async function analyserSetup() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
            console.log("Permission accordée !");
            // Maintenant, relance l'énumération
            return navigator.mediaDevices.enumerateDevices();
        })
        .then(devices => {
            console.table(devices); // Tu devrais voir apparaître les vrais noms de ton casque ici
        })
        .catch(err => console.log("L'utilisateur a refusé ou erreur :", err));

    navigator.geolocation.getCurrentPosition(success, error);
}

const fetchUserData = async () => {
    // 1. Récupération asynchrone groupée
    const [ip, browserData, languages, adBlock, cookies, battery, deviceType] = await Promise.all([
        GetIP(), getBrowserData(), getFullLanguagesString(),
        detectAdBlockerTruePositive(), detectCookieTierBlocker(),
        getBatteryLevel(), estimateDeviceType()
    ]);

    // 2. Centralisation de toutes les valeurs de données
    const values = {
        userId: getSimpleClientId(),
        ip: ip,
        allLang: languages,
        lang: navigator.language || "Inconnu",
        date: formatFullDate(new Date()),
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        profile: currentProfile,
        browser: browserData.browser,
        res: `${window.screen.width}x${window.screen.height}`,
        dnt: navigator.doNotTrack === "1" ? "Activé" : "Désactivé",
        adBlock: adBlock,
        cookieProt: cookies,
        device: deviceType,
        screen: FormatStringScreenInfo(),
        os: browserData.os,
        net: getConnectionInformation(),
        cores: (navigator.hardwareConcurrency || "Bloqué") + " Coeurs",
        ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Bloqué",
        gpu: getGraphicsCardSimplified(),
        batt: battery,
        gClick: totalClicks,
        sClick: sessionClicks,
        pViews: tabSwitchCount,
        recons: refreshCount,
        cuts: reconnectCount,
        cStat: hasConsentCookies().statistic === true ? "Oui" : "Non",
        cFonc: hasConsentCookies().functionnal === true ? "Oui" : "Non",
        cMark: hasConsentCookies().marketing === true ? "Oui" : "Non",
        rLeg: hasReadPage().mention_legale ? "Oui" : "Non",
        rConf: hasReadPage().confidentialite ? "Oui" : "Non",
        rCook: hasReadPage().cookie ? "Oui" : "Non"
    };

    // 3. Structure finale (Dictionnaire)
    return [
        {
            title: "Utilisateur",
            items: [
                { id: "user-id", label: "ID utilisateur", value: values.userId, category: "necessaire", duration: "Session", description: "Identifiant de session unique." },
                { id: "ip-address", label: "Adresse IP", value: values.ip, category: "marketing", duration: "6 mois", description: "Localisation réseau." },
                { id: "lang-all", label: "Langages", value: values.allLang, category: "preference", duration: "12 mois", description: "Langues supportées par le système." },
                { id: "lang", label: "Langage actuel", value: values.lang, category: "preference", duration: "12 mois", description: "Langue préférée." },
                { id: "date", label: "Date", value: values.date, category: "necessaire", duration: "Session", description: "Horodatage de la visite." },
                { id: "location", label: "Localisation", value: values.tz, category: "preference", duration: "Session", description: "Fuseau horaire de l'utilisateur." }
            ]
        },
        {
            title: "Navigateur",
            items: [
                { id: "browser", label: "Navigateur", value: values.browser, category: "necessaire", duration: "Session", description: "Nom et version du logiciel utilisé." },
                { id: "resolution", label: "Résolution", value: values.res, category: "preference", duration: "Session", description: "Définition de l'écran." },
                { id: "dnt-tracking", label: "Suivi DNT", value: values.dnt, category: "necessaire", duration: "12 mois", description: "Signal 'Do Not Track'." },
                { id: "adblock", label: "Bloqueur de pub", value: values.adBlock, category: "statistique", duration: "Session", description: "Présence d'un bloqueur." },
                { id: "anti_cookie", label: "Protection cookies", value: values.cookieProt, category: "necessaire", duration: "Session", description: "Blocage des cookies tiers." }
            ]
        },
        {
            title: "Informations Machine",
            items: [
                { id: "is_smartphone", label: "Appareil", value: values.device, category: "preference", duration: "Session", description: "Type de terminal (Mobile/Desktop)." },
                { id: "screen_size", label: "Écran", value: values.screen, category: "preference", duration: "Session", description: "Taille physique estimée." },
                { id: "os", label: "Système", value: values.os, category: "preference", duration: "Session", description: "OS de la machine." },
                { id: "network", label: "Réseau", value: values.net, category: "statistique", duration: "Session", description: "Type de connexion (4G/Wi-Fi)." },
                { id: "cpu", label: "Processeur", value: values.cores, category: "marketing", duration: "Session", description: "Nombre de coeurs processeur." },
                { id: "ram", label: "Mémoire RAM", value: values.ram, category: "marketing", duration: "Session", description: "Mémoire vive disponible." },
                { id: "gpu", label: "Carte Graphique", value: values.gpu, category: "marketing", duration: "Session", description: "Modèle du processeur graphique." },
                { id: "battery", label: "Batterie", value: values.batt, category: "marketing", duration: "Session", description: "Niveau et état de charge." }
            ]
        },
        {
            title: "Statistiques de navigation",
            items: [
                { id: "analyse_user", label: "Analyse user", value: values.profile, category: "statistique", duration: "13 mois", description: "Profilage comportemental." },
                { id: "id_time", label: "Temps total", value: "0 (Total : 0)", category: "statistique", duration: "13 mois", description: "Durée de présence." },
                { id: "tab_switch_count", label: "Vues pages", value: values.pViews, category: "statistique", duration: "Session", description: "Nombre de pages consultées." },
                { id: "reconnections", label: "Reconnexions", value: values.recons, category: "necessaire", duration: "Session", description: "Rafraîchissements page." },
                { id: "coupure-internet", label: "Coupures", value: values.cuts, category: "necessaire", duration: "Session", description: "Pertes de signal réseau." },
                { id: "nombre-clicks", label: "Clics", value: `${values.sClick} (Total: ${values.gClick})`, category: "statistique", duration: "13 mois", description: "Interactions souris." }
            ]
        },
        {
            title: "Légal & Consentement",
            items: [
                { id: "c_stat", label: "Consent. Stat", value: values.cStat, category: "necessaire", duration: "6 mois", description: "Accord pour les statistiques." },
                { id: "c_fonc", label: "Consent. Fonc", value: values.cFonc, category: "necessaire", duration: "6 mois", description: "Accord pour les fonctions." },
                { id: "c_mark", label: "Consent. Mark", value: values.cMark, category: "necessaire", duration: "6 mois", description: "Accord pour le marketing." },
            ]
        }
    ];

    /*
    { id: "r_leg", label: "Lu Mentions", value: values.rLeg, category: "statistique", duration: "12 mois", description: "Consultation mentions légales." },
    { id: "r_conf", label: "Lu Confid.", value: values.rConf, category: "statistique", duration: "12 mois", description: "Consultation politique de confidentialité." },
    { id: "r_cook", label: "Lu Cookies", value: values.rCook, category: "statistique", duration: "12 mois", description: "Consultation page cookies." }
    */
};




// --- 1. Stockage des données (State) ---
let navData = {
    totalDistance: 0,
    lastPosition: window.scrollY,
    lastTime: Date.now(),
    velocities: [],
    shortPauses: 0, // Pauses de réflexion (0.5s - 3s)
    readingSessions: 0, // Pauses de lecture (> 3s)
    startTime: Date.now()
};

let currentProfile = "Analyse en cours...";

// --- 2. Écouteur de mouvement (Scroll) ---
window.addEventListener('scroll', () => {
    const now = Date.now();
    const currentPos = window.scrollY;
    
    const diffPos = Math.abs(currentPos - navData.lastPosition);
    const diffTime = now - navData.lastTime;

    if (diffPos > 0) {
        const v = diffPos / diffTime; // pixels/ms
        navData.velocities.push(v);
        navData.totalDistance += diffPos;

        // Détection du type de pause au moment du redémarrage du scroll
        if (diffTime > 500 && diffTime < 3000) {
            navData.shortPauses++;
        } else if (diffTime >= 3000) {
            navData.readingSessions++;
        }
    }

    navData.lastPosition = currentPos;
    navData.lastTime = now;
}, { passive: true });

// --- 3. Analyseur de Profil (Boucle de décision) ---
setInterval(() => {
    const avgV = navData.velocities.length > 0 
        ? navData.velocities.reduce((a, b) => a + b) / navData.velocities.length 
        : 0;
    
    const timeOnPage = (Date.now() - navData.startTime) / 1000;

    // --- Logique de classification ---
    if (avgV > 8 && navData.velocities.length > 5) {
        currentProfile = "BOT (Vitesse inhumaine)";
    } 
    else if (navData.readingSessions > 1 && avgV < 1.2) {
        currentProfile = "LECTEUR ATTENTIF (Prend son temps)";
    } 
    else if (timeOnPage > 15 && navData.totalDistance < 200) {
        currentProfile = "PASSIF / ABSENT (Page en fond)";
    } 
    else {
        currentProfile = "NAVIGATION STANDARD";
    }

    const analyseUserDisplay = document.getElementById('analyse_user');
    if(analyseUserDisplay) {
        analyseUserDisplay.innerText = currentProfile;
    }

    // Affichage dans ton interface (ex: un élément avec id "status")
    //console.log(`PROFIL : ${currentProfile} | Dist: ${Math.round(navData.totalDistance)}px`);
}, 3000); // Mise à jour toutes les 3 secondes



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

async function GetIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return "IP Inconnue (Erreur de réseau)"; 
    }
};


function formatFullDate(date) {
  const options = { 
        weekday: 'long',  // "lundi"
        year: 'numeric',  // "2026"
        month: 'long',    // "mars"
        day: 'numeric',   // "27"
        hour: '2-digit',  // "13"
        minute: '2-digit',// "18"
    };

    const dateComplete = new Intl.DateTimeFormat('fr-FR', options).format(date);

  return dateComplete;
}

async function getFullLanguagesString() {
    const userLangs = navigator.languages || [navigator.language];
    
    // On crée un traducteur de noms de langues en Français
    const languageNames = new Intl.DisplayNames(['fr'], { type: 'language' });

    const fullNames = userLangs.map(code => {
        try {
            // On tente de traduire le code (ex: 'fr-CA' -> 'français (Canada)')
            let name = languageNames.of(code);
            // On met la première lettre en majuscule pour le style
            return name.charAt(0).toUpperCase() + name.slice(1);
        } catch (e) {
            // Si le code est bizarre/inconnu, on garde le code brut
            return code;
        }
    });

    // On rejoint le tout avec une virgule
    return fullNames.join(', ');
};

const getOS = (ua) => {
    switch (true) {
        case ua.includes("Win"):
            return "windows";
        
        case ua.includes("Android"):
            // On distingue smartphone/tablette ici si besoin
            return ua.includes("Mobile") ? "android smartphone" : "android tablette";
        
        case ua.includes("iPhone"):
        case ua.includes("iPad"):
            return "ios";
            
        case ua.includes("Mac"):
            // Détection iPad Pro (qui se fait passer pour un Mac)
            if (navigator.maxTouchPoints > 1) return "ios (iPad)";
            return "macos";
            
        case ua.includes("Linux"):
        case ua.includes("X11"):
            return "linux";
            
        default:
            return "Inconnu";
    }
};

function getBrowserData() {
    const ua = navigator.userAgent;

    // 2. Détection du Navigateur et de sa Version
    let browser = "Inconnu";

    if (ua.includes("Firefox/")) {
        browser = `Firefox ${ua.split("Firefox/")[1]}`;
    } 
    else if (ua.includes("Edg/")) {
        browser = `Edge ${ua.split("Edg/")[1]}`;
    } 
    else if (ua.includes("OPR/") || ua.includes("Opera/")) {
        const ver = ua.split("OPR/")[1] || ua.split("Version/")[1];
        browser = `Opera ${ver.split(" ")[0]}`;
    }
    else if (ua.includes("Brave")) {
        browser = "Brave Browser"; 
    }
    else if (ua.includes("Chrome/")) {
        browser = `Chrome ${ua.split("Chrome/")[1].split(" ")[0]}`;
    } 
    else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
        browser = `Safari ${ua.split("Version/")[1]?.split(" ")[0] || "N/A"}`;
    }

    return {
        os: getOS(ua),
        browser: browser
    };
};


async function estimateDeviceType() {
    os = getOS(navigator.userAgent);
    size = null;
    if(getScreenInfo() !== null)
    {
       size = getScreenInfo().size || null;
    }
    
    let hasBattery = false;
    let isCharging = false;

    // 1. Tentative de détection de la batterie (Asynchrone)
    try {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            hasBattery = true; 
            // Un PC fixe peut renvoyer une batterie à 100% (onduleur), 
            // mais ne se décharge jamais.
            isCharging = battery.charging;
        }
    } catch (e) {
        // API bloquée ou non supportée (souvent sur Firefox/Safari)
    }

    const s = parseFloat(size);
    const hasValidSize = !isNaN(size) && size > 0;

    // 1. PRIORITÉ ABSOLUE : L'OS (Même sans taille)
    if (os.includes("smartphone") || os === "iphone") return "Smartphone";
    if (os.includes("tablette") || os.includes("ipad")) return "Tablette";

    // 2. CAS DES PC (Windows, macOS, Linux)
    if (os.includes("windows") || os.includes("macos") || os.includes("linux")) 
    {
        if(hasBattery === null)
        {
            if (hasValidSize) {
                if (s >= 18.5) return "PC Fixe";
                if (s >= 13.5 && s < 18.5) return "PC";
            }
        }
        else  {
            return hasBattery ? "PC Portable" : "PC";
        }
        
    }

    // 3. ANALYSE PAR LA TAILLE (Si l'OS est "Inconnu")
    if (hasValidSize) {
        if (size < 7.5) return "Smartphone";
        if (size < 13.5) return "Tablette";
        if (size < 18.5) return "PC Portable";
        return "PC Fixe";
    }

    // 4. DERNIER RECOURS
    return "Autre";
}


const getDeviceCategory = () => {
    const ua = navigator.userAgent;

    // 1. Écosystème Apple (Très simple et stable)
    if (ua.includes("iPhone")) return "iphone";
    if (ua.includes("iPad")) return "ipad";
    
    // Cas particulier : iPad récents sur Safari "Desktop mode"
    if (ua.includes("Macintosh") && navigator.maxTouchPoints > 1) return "ipad";

    // 2. Écosystème Android
    if (ua.includes("Android")) {
        // Chrome sur Android retire le mot "Mobile" sur les tablettes
        if (ua.includes("Mobile")) {
            return "smartphone_android";
        } else {
            return "tablette_android";
        }
    }

    // 3. Ordinateurs
    if (ua.includes("Win")) return "pc_windows";
    if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "mac_os";

    // 4. Par défaut
    return "inconnue";
};

function getScreenInfo() {
    // 1. Récupération des dimensions de l'écran
    const width = window.screen.width;
    const height = window.screen.height;
    const diagonalPixels = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    const ppiDatabase = {
        "smartphone_android": {
            probable: 480, 
            standards: [320, 400, 420, 480, 560, 640],
            min_inches: 4.5,
            max_inches: 7.2
        },
        "tablette_android": {
            probable: 276,
            standards: [210, 240, 276, 280, 320],
            min_inches: 7.5,
            max_inches: 14.5
        },
        "iphone": {
            probable: 460, 
            standards: [326, 458, 460, 476],
            min_inches: 4.7,
            max_inches: 6.9
        },
        "ipad": {
            probable: 264,
            standards: [264, 326],
            min_inches: 7.9,
            max_inches: 13.0
        },
        "pc_windows": {
            probable: 120,
            standards: [96, 120, 144, 192],
            min_inches: 10.0,
            max_inches: 45.0
        },
        "mac_os": {
            probable: 220,
            standards: [110, 218, 220, 227, 254],
            min_inches: 11.0,
            max_inches: 32.0
        },
        "inconnue": {
            probable: 96,
            standards: [96],
            min_inches: 3.0,
            max_inches: 100.0
        }
    };

    const device = getDeviceCategory(); // Assure-toi que cette fonction est bien définie
    const config = ppiDatabase[device] || ppiDatabase["inconnue"];

    let possible_sizes = [];

    // 1. On boucle sur les standards pour trouver les tailles crédibles
    for (const ppi of config.standards) {
        // Formule : DiagonalePixels / (PPI_Logique * DPR)
        // Note: Pour Android/PC, le PPI standard inclut souvent déjà l'échelle, 
        let inches = (diagonalPixels / ppi).toFixed(1);
        
        if (inches >= config.min_inches && inches <= config.max_inches) {
            possible_sizes.push({ size: inches, ppi: ppi });
        }
    }

    // 2. Logique de décision
    let finalResult = null;

    if (possible_sizes.length === 1) {
        // Une seule option crédible, c'est forcément celle-là
        finalResult = {"size": possible_sizes[0].size, "othersize": null};
    } 
    else if (possible_sizes.length > 1) {

        ppi_probable = ppiDatabase[device].probable;
        probableDiagonalInches = (diagonalPixels / ppi_probable).toFixed(1);

        // On vérifie si notre valeur "probable" fait partie des tailles valides
        const isProbableValid = probableDiagonalInches >= ppiDatabase[device].min_inches && probableDiagonalInches <= ppiDatabase[device].max_inches;

        const uniqueSizes = [...new Set(possible_sizes.map(s => s.size))];
        const listStr = `[${uniqueSizes.join(", ")}]`;
        if (isProbableValid) {
            finalResult = {"size": probableDiagonalInches, "othersize": listStr};
        } else {
            // Si la valeur probable est hors-limites, on prend la première des tailles valides
            finalResult = {"size": null, "othersize":listStr};
        }
    } 
    
    return finalResult;
}

function FormatStringScreenInfo() {
    const screenInfo = getScreenInfo();
    if(screenInfo == null) {
        return "Information d'écran inconnue";
    }
    if (screenInfo.othersize === null) {
        return `Taille estimée : ${screenInfo.size} pouces `;
    }
    else {
        if (screenInfo.size !== null) {
            return `Tailles possibles ${screenInfo.othersize} <br>Plus probable : ${screenInfo.size} pouces`;
        }
        else {            
            return `Tailles possibles ${screenInfo.othersize}`;
        }
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
            return "Pas de bloqueur";
        } catch (e) {
            return "Bloqueur de pub actif (Extension ou DNS)";
        }

    } catch (e) {
        // Si même le script neutre échoue, c'est un problème de connexion ou de pare-feu global
        return "⚠️ Erreur réseau globale (Pas d'internet ou Pare-feu strict)";
    }
}


async function detectCookieTierBlocker() {
    try {
        // 1. On tente d'écrire un cookie de test
        document.cookie = "testcookie=1; SameSite=Lax";
        
        // 2. On vérifie s'il a été enregistré
        const isCookieSet = document.cookie.indexOf("testcookie=") !== -1;
        
        // 3. On fait le ménage (on le supprime)
        document.cookie = "testcookie=1; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        
        return isCookieSet ? "Les cookies de session sont acceptés." : "Blocage préventif détecté. Votre configuration interdit l'écriture de cookies locaux.";
    } catch (e) {
        return "Permissions insuffisantes pour tester le stockage local.";
    }
};

async function checkThirdPartyCookieSupport() {
    // Navigateur qui bloque nativement (Brave, Safari en mode strict)
    if (navigator.vendor === "Apple Computer, Inc." || navigator.userAgent.includes("Brave")) {
        // Souvent bloqué par défaut sur ces navigateurs
    }

    return new Promise((resolve) => {
        const frame = document.createElement('iframe');
        frame.id = '3p-cookie-test';
        frame.style.display = 'none';
        
        // Utilisation d'un service de test tiers (ex: un domaine dédié aux tests)
        // Note : Pour ton projet, tu devrais pointer vers un petit fichier HTML 
        // hébergé sur un autre domaine que le tien.
        frame.src = "https://third-party-test.glitch.me/check-cookie"; 

        window.addEventListener('message', function(event) {
            if (event.data.type === '3p-cookie-result') {
                resolve(event.data.allowed); // true ou false
                document.body.removeChild(frame);
            }
        }, { once: true });

        // Timeout au cas où le domaine tiers est bloqué par uBlock
        setTimeout(() => {
            if (document.getElementById('3p-cookie-test')) {
                resolve(false); 
                document.body.removeChild(frame);
            }
        }, 2000);

        document.body.appendChild(frame);
    });
}

function getConnectionInformation() {
    infoConnection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const StringInfoConnection = infoConnection ? `${infoConnection.effectiveType} (~${infoConnection.downlink} Mbps)` : "Information bloquée par le navigateur";
    return StringInfoConnection;
}

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



async function getBatteryLevel() {
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
    return batteryLevel;
}









let tabSwitchCount = 0;
function updateTabSwitchCount() {
    
    if (document.visibilityState === 'visible') {
        tabSwitchCount++;
        const tabSwitchCountDisplay = document.getElementById('tab_switch_count');
        if (tabSwitchCountDisplay) {
            tabSwitchCountDisplay.innerText = tabSwitchCount;
        }

    }
}
// Écouter les changements de visibilité (changement d'onglet, réduction de fenêtre)
document.addEventListener('visibilitychange', updateTabSwitchCount);



let totalTimeActif = parseInt(localStorage.getItem('total_time_actif')) || 0;;
let LastTimeActif = Date.now();

let totalTime = parseInt(localStorage.getItem('total_time')) || 0;;
let FirstStartTime = Date.now();

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
    if (timeActifDisplay) {
        timeActifDisplay.innerText = `${convertTimetoString(totalTimeActif)} (Total : ${convertTimetoString(totalTime)})`;
    } 
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


let sessionClicks = 0; // Clics depuis l'ouverture de l'onglet
let totalClicks = parseInt(localStorage.getItem('global_click_count')) || 0; // Clics historiques

window.addEventListener('click', () => {
    sessionClicks++;
    totalClicks++;
    
    // Sauvegarde immédiate dans le localStorage
    localStorage.setItem('global_click_count', totalClicks);

    const clickDisplay = document.getElementById('nombre-clicks');
    if (clickDisplay) {
        clickDisplay.innerText = `${sessionClicks} (Total: ${totalClicks})`;
    }
});

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function hasReadPage() {
    const hasRead_cookie = getCookie("user_statistic") === 'granted';
    const hasRead_confidentialite = getCookie("user_functionnel") === 'granted';
    const hasRead_mention_legale = getCookie("user_marketing") === 'granted';
    return {"cookie": hasRead_cookie, "confidentialite": hasRead_confidentialite, "mention_legale": hasRead_mention_legale};
}

function hasConsentCookies() {
    const hasStatisticConsent = getCookie("user_statistic") === 'granted';
    const hasFunctionnelConsent = getCookie("user_functionnel") === 'granted';
    const hasMarketingConsent = getCookie("user_marketing") === 'granted';
    return {"statistic": hasStatisticConsent, "functionnal": hasFunctionnelConsent, "marketing": hasMarketingConsent};
}




function renderTerminal(data,isStatistic = true, isPreference = true, isMarketing = true) {
    const terminal = document.getElementById('terminal-content');
        
    const filters = { 
        statistique: isStatistic, 
        preference: isPreference, 
        marketing: isMarketing,
        necessaire: true
    };

    //<div class="animate-pulse text-brand mb-6 font-bold uppercase tracking-widest text-[10px]">[SYSTEM_SCAN_COMPLETE] Empreinte générée...</div>
    terminal.innerHTML = `
        <div class="space-y-6">
            ${data.map(cat => `
                <div class="category-group">
                    <h4 class="text-brand/70 text-[10px] uppercase font-bold mb-2 tracking-tighter border-l-2 border-brand pl-2">
                        ${cat.title}
                    </h4>
                    <ul class="space-y-2 font-data text-xs md:text-sm">
                        ${cat.items
                            .filter(item => filters[item.category])
                            .map(item => `
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

fetchUserData().then(all_information => {
    renderTerminal(all_information);
})

document.addEventListener('DOMContentLoaded', fetchUserData);

