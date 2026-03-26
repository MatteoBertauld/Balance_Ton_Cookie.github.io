
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


function renderCookieTable() {


    const tableBody = document.querySelector('#cookie-table-body');
    const isStatistic = document.getElementById('toggle-statistic').checked;
    const isPreferences =  document.getElementById('toggle-preferences').checked;
    const isMarketing = document.getElementById('toggle-marketing').checked;

    const filters = { analytics: isStatistic, preferences: isPreferences, marketing:isMarketing};
    
    let htmlContent = cookieData
        // On garde le système avec cequi est coché dans les filtres
        .filter(cookie => cookie.category === 'system' || filters[cookie.category])
        // On transforme chaque objet filtré en HTML via notre fonction composant
        .map(cookie => createCookieRow(cookie))
        .join('');

    tableBody.innerHTML = htmlContent;
}





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
    ButtonStatistic = document.getElementById('toggle-statistic');
    ButtonPreferences = document.getElementById('toggle-preferences');
    ButtonMarketing = document.getElementById('toggle-marketing');

    let isStatistic = false;
    let isPreferences = false;
    let isMarketing = false;

    if(acceptAll) {
        isStatistic = true;
        isPreferences = true;
        isMarketing = true
    }
    if(acceptAll == null) {
        isStatistic = ButtonStatistic.checked;
        isPreferences = ButtonPreferences.checked;
        isMarketing = ButtonMarketing.checked;
    }

    ButtonStatistic.checked = isStatistic;
    ButtonPreferences.checked = isPreferences;
    ButtonMarketing.checked = isMarketing;



    setCookie("consent_timestamp", new Date().toISOString(), 30); 
    setCookie("user_statistic", isStatistic ? 'granted' : 'denied', 30); 
    setCookie("user_preferences", isPreference ? 'granted' : 'denied', 30); 
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
    Necessaire: {
        Utility: "Assurer la sécurité, la gestion de la session et la mémorisation de vos choix de confidentialité.",
        donnees: "Identifiant de session, statut du consentement (autorisé/refusé).",
        duree: "Session (fermeture du navigateur) ou Persistant",
        Origine : "Interne (site web)",
        consentement: "Non (Exempté)"
    },
    Statistic: {
        Utility: "Compter le nombre de visiteurs et identifier les pages les plus lues ou les bugs.",
        donnees: "Adresse IP (anonymisée), type de navigateur, temps passé par page.",
        duree: "Persistant",
        Origine : "Interne (site web) ou Tier",
        consentement: "Non (Recommandé)"
    },
    preferences: {
        Utility: "Personnaliser l'affichage selon vos réglages (langue, mode sombre, région).",
        donnees: "Code pays, préférence d'affichage (CSS), dernière recherche effectuée.",
        duree: "Persistant.",
        Origine : "Souvent Interne (site web)",
        consentement: "Oui"
    },
    marketing: {
        Utility: "Assurer la sécurité, la gestion de la session et la mémorisation de vos choix de confidentialité.",
        donnees: "Identifiant de session, statut du consentement (autorisé/refusé).",
        duree: "Session (fermeture du navigateur) ou 6 mois (pour votre choix de cookies).",
        Origine : "Souvent service tier",
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




const content = {
    "0": {
        title: "Canada",

        def: {
            Necessaire: "Aucune définition au Canada.",
            Statistic: "Aucune définition au Canada.",      
            preferences: "Aucune définition au Canada.", 
            marketing: "Aucune définition au Canada."   
        },

        Necessaire: "Strictement Necessaire",
        Statistic: "Analytique",
        Preference: "Functionnel",
        Marketing: "Marketing",

    },
    "1": {
        title: "Royaume-Uni",

        def: {
            Necessaire: "These cookies are essential in order to enable you to move around the website and use its features, such as accessing secure areas of the website. Without these cookies services you have asked for, like shopping baskets or e-billing, cannot be provided.",
            Statistic: "These cookies collect information about how visitors use a website. These cookies don’t collect information that identifies a visitor. All information these cookies collect is aggregated and therefore anonymous. It is only used to improve how a website works.",        
            preferences:"These cookies allow the website to remember choices you make (such as your user name, language or the region you are in) and provide enhanced, more personal features. The information these cookies collect may be anonymised and they cannot track your browsing activity on other websites.",   
            marketing: "These cookies are used to deliver adverts more relevant to you and your interests They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaigns. They are usually placed by advertising networks with the website operator’s permission.",   
        },
    
        Necessaire: "Strictly necessary",
        Statistic: "Performance",
        Preference: "Functionnality",
        Marketing: "Advertising",
    },
    "2": {
        title: "Union Européenne",

        def: {
            Necessaire: "These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site. Cookies that allow web shops to hold your items in your cart while you are shopping online are an example of strictly necessary cookies. These cookies will generally be first-party session cookies. While it is not required to obtain consent for these cookies, what they do and why they are necessary should be explained to the user.",
            Statistic: "Also known as “performance cookies,” these cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized. Their sole purpose is to improve website functions. This includes cookies from third-party analytics services as long as the cookies are for the exclusive use of the owner of the website visited.",        
            preferences: "Also known as “functionality cookies,” these cookies allow a website to remember choices you have made in the past, like what language you prefer, what region you would like weather reports for, or what your user name and password are so you can automatically log in.",   
            marketing: "These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers. These are persistent cookies and almost always of third-party provenance.",   
        },

        Necessaire: "Strictly necessary ",
        Statistic: "Statistics",
        Preference: "Preference",
        Marketing: "Marketing",
    },
    "3": {
        title: "France",

        def: {
            Necessaire: "Pas de définition francaise (UE) : Also known as “performance cookies,” these cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized. Their sole purpose is to improve website functions. This includes cookies from third-party analytics services as long as the cookies are for the exclusive use of the owner of the website visited.",
            Statistic: "Pas de définition francaise (UE) : Also known as “functionality cookies,” these cookies allow a website to remember choices you have made in the past, like what language you prefer, what region you would like weather reports for, or what your user name and password are so you can automatically log in.",
            preferences: "Pas de définition francaise (UE) : These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers. These are persistent cookies and almost always of third-party provenance.",   
            marketing: "Pas de définition francaise (UE) : These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers. These are persistent cookies and almost always of third-party provenance.",      
        },

        Necessaire: "Strictement Necessaire",
        Statistic: "Statistiques",
        Preference: "Préférences",
        Marketing: "Marketing",
    }
};

const slider = document.getElementById('step-slider')

const TextCatNecessaire = document.querySelectorAll('.Necessaire');
const TextCatStatistic = document.querySelectorAll('.Statistic');
const TextCatPreference = document.querySelectorAll('.Preference');
const TextCatMarketing = document.querySelectorAll('.Marketing');
const TextDefCat = document.querySelectorAll('.def');

const TextCat = document.querySelectorAll('.cookie_category');

function updateContent() {
    val = slider.value;
    
    TextCat.forEach(element => {
        element.classList.add('opacity-0');
    });

    setTimeout(() => {

        TextCatNecessaire.forEach(element => {
            element.innerText = content[val].Necessaire
        });
        TextCatStatistic.forEach(element => {
            element.innerText = content[val].Statistic
        });
        TextCatPreference.forEach(element => {
            element.innerText = content[val].Preference
        });
        TextCatMarketing.forEach(element => {
            element.innerText = content[val].Marketing
        });
        
        TextCat.forEach(element => {
            element.classList.remove('opacity-0');
        });
    }, 250);
}


slider.addEventListener('input', updateContent);
updateContent();


function showDetail(category) {
    const data = cookieDetails[category];
    document.getElementById('det-utility').innerText = data.Utility;
    document.getElementById('det-donnees').innerText = data.donnees;
    document.getElementById('det-duree').innerText = data.duree;
    document.getElementById('det-origine').innerText = data.Origine;
    document.getElementById('det-consentement').innerText = data.consentement;
    // Visual feedback for interaction
    const panel = document.getElementById('detail-panel');
    panel.classList.remove('animate-none');
    panel.style.animation = 'none';
    panel.offsetHeight;
    panel.style.animation = null; 

    TextDefCat.forEach(element => {
        console.log(content[val].def)
        console.log(category)
        element.innerText = content[val].def[category]
    });
};

showDetail('Necessaire')