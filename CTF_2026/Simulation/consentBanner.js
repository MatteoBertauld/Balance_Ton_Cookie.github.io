/*
function createCookieRow(cookie) {
    // Configuration des couleurs selon la catégorie
    const textColor = {
        'system': 'bg-slate',
        'statistic': 'bg-amber', 
        'functional': 'bg-purple',
        'marketing': 'bg-red',
    };


    return `
        <tr class="border-b border-slate-50 group bg-surface -100/70 transition-colors">
            <td class="p-8">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-${textColor[cookie.category]}-200 flex items-center justify-center font-bold text-${textColor[cookie.category]}-500 text-lg">
                        ${cookie.initial}
                    </div>
                    <span class="font-bold text-${textColor[cookie.category]}-800">${cookie.name}</span>
                </div>
            </td>
            <td class="p-8 text-${textColor[cookie.category]}-500">${cookie.description}</td>
            <td class="p-8 text-center">
                <span class="px-3 py-1 bg-${textColor[cookie.category]}-200 rounded-full text-xs font-medium text-${textColor[cookie.category]}-600">
                    ${cookie.duration}
                </span>
            </td>
            
        </tr>`;
}
        */
  function createCookieRow(cookie) {
    // Configuration pour Dark Mode (Fonds sombres, bordures subtiles)
    const backgroundColors = {
        'system': 'bg-slate-900/40 border-slate-800',
        'statistic': 'bg-amber-900/20 border-amber-900/30', 
        'functional': 'bg-purple-900/20 border-purple-900/30',
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

    return `
        <tr class="border-b transition-colors ${bgColorClass} hover:bg-opacity-60 group">
            <td class="p-8">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center font-bold text-${color}-400 text-lg border border-${color}-500/30">
                        ${cookie.initial}
                    </div>
                    <span class="font-bold text-${color}-300">${cookie.name}</span>
                </div>
            </td>
            <td class="p-8 text-zinc-400 group-hover:text-zinc-300 transition-colors">${cookie.description}</td>
            <td class="p-8 text-center">
                <span class="px-3 py-1 bg-${color}-500/10 border border-${color}-500/20 rounded-full text-xs font-semibold text-${color}-400">
                    ${cookie.duration}
                </span>
            </td>
        </tr>`;
}

function renderCookieTable() {


    const tableBody = document.querySelector('#cookie-table-body');

    const isStatistic = document.getElementById('toggle-statistic').checked;
    const isFunctionnel = document.getElementById('toggle-functionnel').checked;
    const isMarketing = document.getElementById('toggle-marketing').checked;



    const filters = { statistic: isStatistic, functional: isFunctionnel, marketing:isMarketing};
    
    let htmlContent = cookieData
        // On garde le système avec ce qui est coché dans les filtres
        .filter(cookie => cookie.category === 'system' || filters[cookie.category])
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
    ButtonStatistic = document.getElementById('toggle-statistic');
    ButtonFunctionnel = document.getElementById('toggle-functionnel');
    ButtonMarketing = document.getElementById('toggle-marketing');

    /*
    let isStatistic = false;
    let isFunctionnel = false;
    let isMarketing = false;
    */

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


 const modal = document.getElementById('modal-overlay');

function toggleModal(show) {
    if (show) {
        modal.classList.remove('hidden');
        // Petit délai pour l'animation d'entrée si souhaité
    } else {
        modal.classList.add('hidden');
    }
}

// Fermer si on clique sur l'overlay (en dehors de la boîte)
window.onclick = function(event) {
    if (event.target == modal) {
        toggleModal(false);
    }
}


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
        category: 'statistic',
        initial: 'H',
        name: 'Hotjar_Tracking',
        description: 'Analyse des zones de clic et du comportement de navigation thermique.',
        duration: '6 mois',
        impact: 'Moyen',
    },
    {
        category: 'statistic',
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
        category: 'functional',
        initial: 'L',
        name: 'lang',
        description: 'Mémorise votre langue préférée pour afficher le contenu automatiquement dans la bonne version.',
        duration: '1 an',
        impact: 'Faible',
    },
    {
        category: 'functional',
        initial: 'T',
        name: 'theme_mode',
        description: "Enregistre votre choix d'affichage (sombre ou clair) pour un confort visuel personnalisé.",
        duration: 'Indéfinie',
        impact: 'Nul',
    },
    {
        category: 'functional',
        initial: 'C',
        name: 'consent_status',
        description: 'Stocke vos préférences de cookies pour ne pas vous les redemander à chaque visite.',
        duration: '6 mois',
        impact: 'Faible',
    },
];
renderCookieTable();