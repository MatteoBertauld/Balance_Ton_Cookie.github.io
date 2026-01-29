


// JS - La Logique
let count = 0;
const counterDisplay = document.getElementById('counter');
const cookieBtn = document.getElementById('cookie-btn');

cookieBtn.addEventListener('click', () => {
count++;
counterDisplay.innerText = count;
document.cookie = `cookieCount=${count}; path=/; max-age=31536000;`;

// Petit bonus : effet de vibration aléatoire au clic
cookieBtn.style.transform = `scale(0.95) rotate(${Math.random() * 10 - 5}deg)`;
setTimeout(() => {
        cookieBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 50);
});


window.dataLayer = window.dataLayer || [];
function gtag(){
	dataLayer.push(arguments);
}
gtag('consent', 'default', {
	'ad_storage': 'denied',
	'ad_user_data': 'denied',
	'ad_personalization': 'denied',
	'analytics_storage': 'denied'
});


function setConsent() {
    setCookie("user_consent", "accepted", 30);
    
    // Cacher la bannière
   // document.getElementById('cookie-banner').style.display = 'none';
    
    // Charger les scripts de suivi maintenant que c'est accepté
    //startTracking();
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}