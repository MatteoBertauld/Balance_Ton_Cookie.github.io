const modal_profil = document.getElementById('modal-profil');
const openBtn_profil = document.getElementById('open-modal-profil');
const closeBtn_profil = document.getElementById('close-modal-profil');
const confirmBtn_profil = document.getElementById('confirm-selection-profil');
const currentAvatarImg = document.getElementById('current-avatar');
const avatarGrid = document.getElementById('avatar-grid');

// Configuration des options d'images
const avatarOptions = [
    "../image/profil/profil_1.png",
    "../image/profil/profil_2.png",
    "../image/profil/profil_3.png",
    "../image/profil/profil_4.png",
    "../image/profil/profil_5.png",
    "../image/profil/profil_6.png"
];

let selectedProfilSrc = currentAvatarImg.src;

// 1. Générer la grille d'avatars
avatarOptions.forEach((src) => {
    const container = document.createElement('div');
    container.className = `cursor-pointer rounded-xl border-2 border-transparent p-1 transition-all hover:scale-105 bg-[#020617]`;
    container.innerHTML = `<img src="${src}" class="w-full h-auto rounded-lg" alt="Option">`;
    
    container.onclick = () => {
        // Retirer la bordure active des autres
        document.querySelectorAll('#avatar-grid div').forEach(el => el.classList.replace('border-[#8aebff]', 'border-transparent'));
        // Ajouter la bordure à l'élément cliqué
        container.classList.replace('border-transparent', 'border-[#8aebff]');
        selectedProfilSrc = src;
    };
    
    avatarGrid.appendChild(container);
});

// 2. Fonctions d'affichage Modale
function toggleModalProfil(show) {
    if (show) {
        modal_profil.classList.remove('hidden');
        setTimeout(() => modal_profil.classList.add('opacity-100'), 10);
    } else {
        modal_profil.classList.remove('opacity-100');
        setTimeout(() => modal_profil.classList.add('hidden'), 300);
    }
}

openBtn_profil.onclick = () => toggleModalProfil(true);
closeBtn_profil.onclick = () => toggleModalProfil(false);

// 3. Validation
confirmBtn_profil.onclick = () => {
    currentAvatarImg.src = selectedProfilSrc;
    toggleModalProfil(false);
    console.log("Système : Avatar mis à jour avec succès.");
};

// Fermeture au clic à l'extérieur
modal_profil.onclick = (e) => { if(e.target === modal_profil) toggleModalProfil(false); };