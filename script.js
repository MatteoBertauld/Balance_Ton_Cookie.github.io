


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