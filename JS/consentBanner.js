
function createCookieRow(cookie) {
    // Configuration pour Dark Mode (Fonds sombres, bordures subtiles)
    const backgroundColors = {
        'necessaire': 'bg-slate-900/40 border-slate-800',
        'statistique': 'bg-amber-900/20 border-amber-900/30', 
        'preference': 'bg-purple-900/20 border-purple-900/30',
        'marketing': 'bg-red-900/20 border-red-900/30',
    };

    // Couleurs d'impact vibrantes pour ressortir sur le sombre
    const impactColors = {
        'Nul': 'emerald',
        'Faible': 'blue',
        'Moyen': 'orange',
        'Élevé': 'rose',
        'Maximum': 'red'
    };

    const bgColorClass = backgroundColors[cookie.category] || 'bg-zinc-900 border-zinc-800';
    const color = impactColors[cookie.impact] || 'slate';
    const initial = cookie.id ? cookie.id.charAt(0).toUpperCase() : 'O';

    return `
        <tr class="border-b transition-colors ${bgColorClass} hover:bg-opacity-60 group">
            <td class="p-8">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center font-bold text-${color}-400 text-lg border border-${color}-500/30">
                        ${initial}
                    </div>
                    <span class="font-bold text-${color}-300">${cookie.id}</span>
                </div>
            </td>
            <td class="p-8 text-zinc-400 group-hover:text-zinc-300 transition-colors">${cookie.description}</td>
            <td class="p-8 text-center">
                <span class="px-3 py-1 bg-${color}-500/10 border border-${color}-500/20 rounded-full text-xs font-semibold text-${color}-400">
                    ${cookie.duree === 0 ? 'Session' : cookie.duree + ' jours'}
                </span>
            </td>
        </tr>`;
}

function renderCookieTable(isStatistic,isPreference,isMarketing) {

    const tableBody = document.querySelector('#cookie-table-body');

    const filters = { 
        statistique: isStatistic, 
        preference: isPreference, 
        marketing: isMarketing,
        necessaire: true // Toujours vrai car obligatoire
    };
    
    let htmlContent = cookieData
        // On garde le système avec ce qui est coché dans les filtres
        .filter(cookie => filters[cookie.category])
        // On transforme chaque objet filtré en HTML via notre fonction composant
        .map(cookie => createCookieRow(cookie))
        .join('');

    tableBody.innerHTML = htmlContent;
}



function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    
    // Ajout de SameSite et Secure pour la compatibilité moderne
    document.cookie = `${cname}=${encodeURIComponent(cvalue)}; ${expires}; path=/; SameSite=Lax;`;
}



function cleanString(str) {
    return str
        // 1. Décompose les caractères accentués (ex: 'é' devient 'e' + '´')
        .normalize("NFD")
        // 2. Supprime les marques d'accents via une RegEx de blocs Unicode
        .replace(/[\u0300-\u036f]/g, "")
        // 3. Remplace les espaces et les tirets par des underscores
        .replace(/[\s-]/g, "_")
        // 4. Supprime tout ce qui n'est pas une lettre, un chiffre ou un underscore
        .replace(/[^a-zA-Z0-9_]/g, "")
        // 5. Nettoie les doubles underscores potentiels
        .replace(/__+/g, "_")
        // 6. Passage en minuscule pour la cohérence des ID
        .toLowerCase();
}

function CreateAllCookie(isStatistic,isPreference,isMarketing) {

    const filters = { 
        statistique: isStatistic, 
        preference: isPreference, 
        marketing: isMarketing,
        necessaire: true // Toujours vrai car obligatoire
    };


    let htmlContent = cookieData
        // On garde le système avec ce qui est coché dans les filtres
        .filter(cookie => cookie.category === 'system' || filters[cookie.category])
        // On transforme chaque objet filtré en HTML via notre fonction composant
        .map(cookie => setCookie(cookie.id, cleanString(cookie.description), cookie.duree))
        .join('');

}


function clearAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + window.location.hostname;
    }
    
    console.log("Tous les cookies ont été réinitialisés.");
}


function setConsent(acceptAll) {

    clearAllCookies();
    ButtonStatistic = document.getElementById('toggle-statistic');
    ButtonFunctionnel = document.getElementById('toggle-functionnel');
    ButtonMarketing = document.getElementById('toggle-marketing');

    switch(acceptAll) {
        case true:
            isStatistic = true;
            isFunctionnel = true;
            isMarketing = true;
            break;
        case false:
            isStatistic = false;
            isFunctionnel = false;
            isMarketing = false;
            break;
        default:
            isStatistic = ButtonStatistic.checked;
            isFunctionnel = ButtonFunctionnel.checked;
            isMarketing = ButtonMarketing.checked;
    }

    ButtonStatistic.checked = isStatistic;
    ButtonFunctionnel.checked = isFunctionnel;
    ButtonMarketing.checked = isMarketing;


    setCookie("consent_timestamp", new Date().toISOString(), 30); 
    setCookie("user_statistic", isStatistic ? 'granted' : 'denied', 30); 
    setCookie("user_functionnel", isFunctionnel ? 'granted' : 'denied', 30); 
    setCookie("user_marketing", isMarketing ? 'granted' : 'denied', 30);  

    CreateAllCookie(isStatistic,isFunctionnel,isMarketing)
    console.log("Consentement mis à jour :\n" + document.cookie);

    
    renderCookieTable(isStatistic,isFunctionnel,isMarketing);   
    fetchUserData().then(all_information => {
        renderTerminal(all_information,isStatistic,isFunctionnel,isMarketing);
    })
}


const modal = document.getElementById('modal-overlay');

function toggleModal(show) {
    if (show) {
        modal.classList.remove('hidden');
        // Petit délai pour l'animation d'entrée si souhaité
    } else {
        modal.classList.add('hidden');
    }
}

const modalAnalyseData = document.getElementById('modal-analyse-data-overlay');
function toggleModalAnalyseData(show) {
    if (show) {
        modalAnalyseData.classList.remove('hidden');
        // Petit délai pour l'animation d'entrée si souhaité
    } else {
        modalAnalyseData.classList.add('hidden');
    }
}

// Fermer si on clique sur l'overlay (en dehors de la boîte)
window.onclick = function(event) {
    if (event.target == modal || event.target == modalAnalyseData) {
        toggleModal(false);
        toggleModalAnalyseData(false);
    }
}


function generateAIPrompt(groupedData) {
    // 1. Extraction et simplification des données (on ne garde que l'essentiel)
    const simplifiedItems = groupedData.flatMap(group => 
        group.items.map(item => ({
            p: item.label,       // "p" pour Paramètre
            v: item.value,       // "v" pour Valeur
        }))
    );

    // 2. Construction du coeur du prompt
    const introduction = `Agis en tant qu'expert senior en cybersécurité, spécialiste du profilage numérique et du fingerprinting. 
    Ta mission est d'analyser un dump de données de navigation pour un utilisateur novice. 
    Vulgarise les concepts complexes sans perdre en précision technique.

    Voici les données brutes extraites de la session :
    --- DONNÉES COLLECTÉES ---
    `;

    const dataString = simplifiedItems.map(i => `- ${i.p} : ${i.v}`).join('\n');

    const instructions = `

    --- DIRECTIVES D'ANALYSE ---

    1. DIAGNOSTIC DE CONFIDENTIALITÉ :
    Attribue un score sur 10 (1 = exposition totale, 10 = anonymat parfait) et justifie-le brièvement.

    2. LE FINGERPRINTING EXPLIQUÉ :
    Identifie la "signature unique" de cet appareil. Explique comment la combinaison (GPU + Résolution + CPU) crée une empreinte aussi précise qu'une empreinte digitale. Utilise une analogie simple (ex: une plaque d'immatriculation personnalisée).

    3. PROFILAGE PRÉDICTIF (Portrait-robot) :
    Déduis le profil le plus probable selon ces critères :
    - Tranche d'âge : (15-25 ; 25-35 ; 35-45 ; 45-55 ; 55-65 ; 65-75)
    - Pouvoir d'achat : (Économique, Moyen, Aisé)
    - Type d'appareil : (ex: PC fixe monté main, Laptop gamer d'occasion, station de travail reconditionnée)
    - Usage principal : (Gaming, Professionnel, Bureautique, Création)
    - Genre & Style de vie : Déduis une tendance basée sur l'heure de navigation (nocturne) et la configuration.

    4. DÉMONSTRATION DE MANIPULATION :
    En tant que "Data Broker", rédige une publicité chirurgicale :
    - Titre : [Accroche personnalisée]
    - Texte : [Argumentaire utilisant au moins 3 données du dump pour manipuler l'utilisateur].

    5. PROTOCOLE DE PROTECTION :
    Donne 3 actions radicales pour "empoisonner" ce profilage (ex: Canvas poisoning, navigateurs durcis, extensions de bruitage de paramètres). Évite les conseils basiques comme "effacer les cookies".`;

    const fullPrompt = introduction + dataString + instructions;
    navigator.clipboard.writeText(fullPrompt);

    return "Le profil est trop long pour être envoyé automatiquement. Le prompt a été copié dans votre presse-papiers. Collez-le dans l'interface de votre choix pour l'analyser.";

}

function openGeminiWithPrompt() {

    fetchUserData().then(all_information => {
        const encodedPrompt = encodeURIComponent(generateAIPrompt(all_information));

        alert("Le prompt a été copié. Collez-le (Ctrl+V) dans ChatGPT !");

        setTimeout(() => {
            // Cette ligne sera probablement bloquée par le navigateur
            window.open('https://chatgpt.com/', '_blank');
        }, 3000);
        
    });
}
 
const cookieData = [
    {
        id: "User_ID",
        description: "addresse ip de l'utilisateur, utilisée pour le ciblage publicitaire.",
        duree: 0,
        impact: "élevé", 
        category: "marketing" 
    },
    {
        id: "Addrese IP",
        description: "Adresse IP de l'utilisateur",
        duree: 0,
        impact: "élevé", 
        category: "necessaire" 
    },
    {
        id: "ANTI_DDOS",
        description: "Analyse comportementale pour la détection de bots et la prévention des attaques DDoS.",
        duree: 0,
        impact: "faible", 
        category: "necessaire" 
    },
    {
        id: "User_Location",
        description: "Géolocalisation approximative de l'utilisateur utilisé pour le ciblage publicitaire.",
        duree: 390,
        impact: "élevé",
        category: "marketing"
    },
    {
        id: "Horodatage_Visite",
        description: "Heure de visite de l'utilisateur pour des statistiques",
        duree: 425,
        impact: "moyen",
        category: "statistique"
    },
    {
        id: "reseau_quality",
        description: "Information sur la qualité du réseau pour un profilage publicitaire",
        duree: 360,
        impact: "faible",
        category: "marketing"
    },
    {
        id: "consent",
        description: "Enregistrement des choix de l'utilisateur concernant les traceurs et preuve de lecture des mentions légales.",
        duree: 180,
        impact: "faible",
        category: "necessaire"
    }, 
    {
        id: "lang",
        description: "enregistement du choix de la langue de l'utilisateur pour un confort personnalisé",
        duree: 180,
        impact: "faible",
        category: "preference"
    },
    {
        id: "lang_marketing",
        description: "enregistement du choix de la langue de l'utilisateur pour un profilage publicitaire",
        duree: 180,
        impact: "faible",
        category: "marketing"
    },
    {
        id: "screen_resolution",
        description: "Résolution d'écran",
        duree: 180,
        impact: "moyen",
        category: "preference"
    },
    {
        id: "mobile_device",
        description: "Type d'appareil (mobile/desktop)",
        duree: 180,
        impact: "moyen",
        category: "preference"
    },
    {
        id: "device_information",
        description: "Informations sur l'appareil resolution,size,os,model pour du profilage publicitaire",
        duree: 360,
        impact: "important",
        category: "marketing" 
    },
    {
        id: "website_interactions",
        description: "Analyse des interactions sur le site.",
        duree: 360,
        impact: "moyen",
        category: "statistique"
    },
    {
        id: "website_legalspagescheck",
        description: "Vérification de la lecture des mentions légales.",
        duree: 360,
        impact: "faible",
        category: "statistique"
    },
    {
        id: "check_Adblock",
        description: "Vérification de la présence d'un bloqueur de publicité.",
        duree: 360,
        impact: "moyen",
        category: "marketing"
    },
    {
        id: "browser_information",
        description: "Détails techniques du navigateur pour du fingerprinting : nom, version",
        duree: 0,
        impact: "élevé",
        category: "marketing"
    },
    {
        id: "material information",
        description: "Détails techniques du matériel pour du fingerprinting : CPU, RAM, GPU",
        duree: 0,
        impact: "élevé",
        category: "marketing"
    },
    {
        id: "batterie_status",
        description: "État de la batterie pour une analyse comportementale et du fingerprinting.",
        duree: 0,
        impact: "élevé",
        category: "marketing"
    }
];

renderCookieTable(false,false,false);

