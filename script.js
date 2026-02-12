
function createCookieRow(cookie) {
    // Configuration des couleurs selon la catégorie
    const backgroundColors = {
        'system': 'bg-slate',
        'analytics': 'bg-amber',
        'marketing': 'bg-purple',
        'social': 'bg-blue',
        'setting': 'bg-grey',
        'security': 'bg-red',
    };

    const impactColors = {
        'Nul': 'emerald',
        'Faible': 'blue',
        'Moyen': 'orange',
        'Élevé': 'rose',
        'Maximum': 'red'
    };

    return `
        <tr class="border-b border-slate-50 group ${backgroundColors[cookie.category]}-100/70 hover:${backgroundColors[cookie.category]}-100/50 transition-colors">
            <td class="p-8">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-${impactColors[cookie.impact]}-200 flex items-center justify-center font-bold text-${impactColors[cookie.impact]}-500 text-lg">
                        ${cookie.initial}
                    </div>
                    <span class="font-bold text-${impactColors[cookie.impact]}-800">${cookie.name}</span>
                </div>
            </td>
            <td class="p-8 text-${impactColors[cookie.impact]}-500">${cookie.description}</td>
            <td class="p-8 text-center">
                <span class="px-3 py-1 bg-${impactColors[cookie.impact]}-200 rounded-full text-xs font-medium text-${impactColors[cookie.impact]}-600">
                    ${cookie.duration}
                </span>
            </td>
            
        </tr>`;
}
/*
<td class="p-8 text-right font-medium text-${impactColors[cookie.impact]}-500">
    ${cookie.impact}
</td>
*/

function renderCookieTable() {
    const tableBody = document.querySelector('#cookie-table-body');
    const isAnalytics = document.getElementById('toggle-analytics').checked;
    const isMarketing = document.getElementById('toggle-marketing').checked;
    const isSocial = document.getElementById('toggle-social').checked;
    const isSetting = document.getElementById('toggle-setting').checked;
    const isSecurity = document.getElementById('toggle-security').checked;

    const filters = { analytics: isAnalytics, marketing: isMarketing, social:isSocial,setting:isSetting,security:isSecurity};
    
    let htmlContent = cookieData
        // On garde le système avec cequi est coché dans les filtres
        .filter(cookie => cookie.category === 'system' || filters[cookie.category])
        // On transforme chaque objet filtré en HTML via notre fonction composant
        .map(cookie => createCookieRow(cookie))
        .join('');

    tableBody.innerHTML = htmlContent;
}


function showDetail(category) {
    const data = cookieDetails[category];
    document.getElementById('det-finalite').innerText = data.finalite;
    document.getElementById('det-type').innerText = data.type;
    document.getElementById('det-donnees').innerText = data.donnees;
    document.getElementById('det-duree').innerText = data.duree;
    document.getElementById('det-stockage').innerText = data.stockage;
    document.getElementById('det-impact').innerText = data.impact;
    document.getElementById('det-consentement').innerText = data.consentement;
    // Visual feedback for interaction
    const panel = document.getElementById('detail-panel');
    panel.classList.remove('animate-none');
    panel.style.animation = 'none';
    panel.offsetHeight;
    panel.style.animation = null; 
};



function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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


function setConsent(acceptAll) {

    clearAllCookies();
    ButtonAnalytics = document.getElementById('toggle-analytics');
    ButtonMarketing = document.getElementById('toggle-marketing');
    ButtonSocial = document.getElementById('toggle-social');
    ButtonSetting = document.getElementById('toggle-setting');
    ButtonSecurity = document.getElementById('toggle-security');

    let isAnalytics = false;
    let isMarketing = false;
    let isSocial = false;
    let isSetting = false;
    let isSecurity = false;
    if(acceptAll) {
        isAnalytics = true;
        isMarketing = true;
        isSocial = true;
        isSetting = true;
        isSecurity = true;
    }
    if(acceptAll == null) {
        isAnalytics = ButtonAnalytics.checked;
        isMarketing = ButtonMarketing.checked;
        isSocial = ButtonSocial.checked;
        isSetting = ButtonSetting.checked;
        isSecurity = ButtonSecurity.checked;
    }

    ButtonAnalytics.checked = isAnalytics;
    ButtonMarketing.checked = isMarketing;
    ButtonSocial.checked = isSocial;
    ButtonSetting.checked = isSetting;
    ButtonSecurity.checked = isSecurity;



    setCookie("consent_timestamp", new Date().toISOString(), 30); 
    setCookie("user_analytics", isAnalytics ? 'granted' : 'denied', 30); 
    setCookie("user_marketing", isMarketing ? 'granted' : 'denied', 30); 
    setCookie("user_setting", isSetting ? 'granted' : 'denied', 30); 
    setCookie("user_social", isSocial ? 'granted' : 'denied', 30); 
    setCookie("user_security", isSecurity ? 'granted' : 'denied', 30); 

    console.log("Consentement mis à jour :\n" + document.cookie);

    renderCookieTable();
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


function handleSubmit() {
    

    let consent = getCookie("user_analytics");

    if(consent == "granted") {
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        setCookie("user_name", name, 30); 
        setCookie("user_surname", surname, 30); 
        setCookie("user_gender", gender, 30); 
        setCookie("user_email", email, 30); 
        setCookie("user_phone", phone, 30);

        console.log("Formulaire soumis avec succès ! \n" + document.cookie);
    }
    else {
        console.log("Vous n'avez pas autorisé le consentement des cookies analytiques! \n" + document.cookie);
    }
}




const cookieDetails = {
    necessary: {
        finalite: "Sécurité et fonctions de base",
        type: "Interne / Système",
        donnees: "ID de session chiffré",
        duree: "Session",
        stockage: "Navigateur",
        impact: "Nul",
        consentement: "Non (Exempté)"
    },
    marketing: {
        finalite: "Profilage publicitaire",
        type: "Cookie Tiers (AdNetwork)",
        donnees: "Centres d'intérêt, Historique",
        duree: "30 jours",
        stockage: "Base de données tiers",
        impact: "Élevé",
        consentement: "Oui"
    },
    analytics: {
        finalite: "Analyse d'audience",
        type: "Mesure statistique",
        donnees: "Clics, Temps passé, Parcours",
        duree: "13 mois",
        stockage: "Cloud / Dashboard",
        impact: "Faible",
        consentement: "Oui"
    },
    preferences: {
        finalite: "Personnalisation UI",
        type: "Préférences locales",
        donnees: "Langue, Mode sombre, Filtres",
        duree: "1 an",
        stockage: "Local storage",
        impact: "Nul",
        consentement: "Oui"
    },
    social: {
        finalite: "Interaction réseaux sociaux",
        type: "Pixel de tracking",
        donnees: "Profil social, Partages",
        duree: "2 ans",
        stockage: "Serveurs externes",
        impact: "Élevé",
        consentement: "Oui"
    },
    security: {
        finalite: "Prévention de la fraude",
        type: "Sécurité anti-robot",
        donnees: "Signature hardware, IP",
        duree: "Indéfini",
        stockage: "Hybride",
        impact: "Moyen",
        consentement: "Oui"
    },
    
};


const cookieData = [
    {
        category: 'system',
        initial: 'S',
        name: 'Session_ID',
        description: 'Identifiant unique de session pour maintenir votre connexion active.',
        duration: 'Session',
        impact: 'Nul',
    },
    {
        category: 'system',
        initial: 'X',
        name: 'XSRF-TOKEN',
        description: 'Protection contre les attaques de type Cross-Site Request Forgery.',
        duration: '2 heures',
        impact: 'Nul',
    },
    {
        category: 'system',
        initial: 'L',
        name: 'Language_Pref',
        description: 'Mémorise la langue choisie par l\'utilisateur (ex: FR/EN).',
        duration: '2 ans',
        impact: 'Nul',
    },
    {
        category: 'analytics',
        initial: 'H',
        name: 'Hotjar_Tracking',
        description: 'Analyse des zones de clic et du comportement de navigation thermique.',
        duration: '6 mois',
        impact: 'Moyen',
    },
    {
        category: 'analytics',
        initial: 'M',
        name: 'Mixpanel_Event',
        description: 'Suivi anonyme des interactions spécifiques sur les fonctionnalités.',
        duration: '1 an',
        impact: 'Faible',
    },
    {
        category: 'marketing',
        initial: 'F',
        name: 'Facebook Pixel',
        description: 'Mesure l\'efficacité des campagnes publicitaires sur Meta.',
        duration: '90 jours',
        impact: 'Élevé',
    },
    {
        category: 'marketing',
        initial: 'L',
        name: 'LinkedIn Insight',
        description: 'Suivi de conversion pour les campagnes B2B professionnelles.',
        duration: '180 jours',
        impact: 'Maximum',
    },
    {
        category: 'setting',
        initial: 'L',
        name: 'lang',
        description: 'Mémorise votre langue préférée pour afficher le contenu automatiquement dans la bonne version.',
        duration: '1 an',
        impact: 'Faible',
    },
    {
        category: 'setting',
        initial: 'T',
        name: 'theme_mode',
        description: "Enregistre votre choix d'affichage (sombre ou clair) pour un confort visuel personnalisé.",
        duration: 'Indéfinie',
        impact: 'Nul',
    },
    {
        category: 'setting',
        initial: 'C',
        name: 'consent_status',
        description: 'Stocke vos préférences de cookies pour ne pas vous les redemander à chaque visite.',
        duration: '6 mois',
        impact: 'Faible',
    },
    {
        category: 'social',
        initial: 'F',
        name: 'facebook_pixel',
        description: 'Mesure l’efficacité des publicités et analyse votre navigation pour proposer des contenus pertinents sur Meta.',
        duration: '3 mois',
        impact: 'Maximum',
    },
    {
        category: 'social',
        initial: 'I',
        name: 'insta_widget',
        description: 'Permet l’affichage de notre flux de photos Instagram et l’interaction directe avec nos publications.',
        duration: 'Session',
        impact: 'Moyen',
    },
    {
        category: 'social',
        initial: 'X',
        name: 'twitter_share',
        description: 'Facilite le partage de nos articles sur la plateforme X et mesure l’audience générée par ces partages.',
        duration: '2 ans',
        impact: 'Élevé',
    },
    {
        category: 'security',
        initial: 'C',
        name: 'cloudflare_id',
        description: 'Protège le site contre les attaques par déni de service (DDoS) et filtre le trafic malveillant.',
        duration: '24 heures',
        impact: 'Faible',
    },
    {
        category: 'security',
        initial: 'R',
        name: 'google_recaptcha',
        description: 'Vérifie que vous êtes un humain et non un robot lors de l’envoi de formulaires pour éviter le spam.',
        duration: '6 mois',
        impact: 'Moyen',
    },
    {
        category: 'security',
        initial: 'T',
        name: 'csrf_token',
        description: 'Garantit la sécurité de vos formulaires en empêchant les tentatives de falsification de requêtes.',
        duration: 'Session',
        impact: 'Nul',
    }
];
renderCookieTable();