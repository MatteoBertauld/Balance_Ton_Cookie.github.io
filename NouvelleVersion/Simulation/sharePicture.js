const modal_image = document.getElementById('modal-image');
const openBtn_image = document.getElementById('open-modal-image');
const closeBtn_image = document.getElementById('close-modal-image');
const confirmBtn_image = document.getElementById('confirm-selection-image');
const currentImage = document.getElementById('current-image');
const imageGrid = document.getElementById('image-grid');

console.log(modal_image);

// Configuration des options d'images
const imageOptions = [
    "../image/post/bar.jpg",
    "../image/post/escalade.jpg",
    "../image/post/luge.png",
    "../image/post/newyork.jpg",
    "../image/post/pianiste.jpg",
    "../image/post/uqac.jpg"
];

let selectedImageSrc = currentImage.src;

// 1. Générer la grille d'images
imageOptions.forEach((src) => {
    const container = document.createElement('div');
    container.className = `cursor-pointer rounded-xl border-2 border-transparent p-1 transition-all hover:scale-105 bg-[#020617]`;
    container.innerHTML = `<img src="${src}" class="w-full h-auto rounded-lg" alt="Option">`;
    
    container.onclick = () => {
        // Retirer la bordure active des autres
        document.querySelectorAll('#image-grid div').forEach(el => el.classList.replace('border-[#8aebff]', 'border-transparent'));
        // Ajouter la bordure à l'élément cliqué
        container.classList.replace('border-transparent', 'border-[#8aebff]');
        selectedImageSrc = src;
    };
    
    imageGrid.appendChild(container);
});

// 2. Fonctions d'affichage Modale
function toggleModalImage(show) {
    console.log("Système : toggleModalImage appelé avec show =", show);
    if (show) {
        modal_image.classList.remove('hidden');
        setTimeout(() => modal_image.classList.add('opacity-100'), 10);
    } else {
        modal_image.classList.remove('opacity-100');
        setTimeout(() => modal_image.classList.add('hidden'), 300);
    }
}

openBtn_image.onclick = () => toggleModalImage(true);
closeBtn_image.onclick = () => toggleModalImage(false);

// 3. Validation
confirmBtn_image.onclick = () => {
    currentImage.src = selectedImageSrc;
    toggleModalImage(false);
    console.log("Système : Image mise à jour avec succès.");
};

// Fermeture au clic à l'extérieur
modal_image.onclick = (e) => { if(e.target === modal_image) toggleModalImage(false); };