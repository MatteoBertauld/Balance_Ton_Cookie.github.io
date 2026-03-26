// 1. Dictionnaire de données
const posts = [
    {
        image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1000",
        author: "@nature_explorer",
        description: "Une matinée paisible dans les Alpes."
    },
    {
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000",
        author: "@street_style",
        description: "Le minimalisme au cœur de la ville."
    },
    {
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000",
        author: "@foodie_vibes",
        description: "Le secret d'un bon dressage."
    }
];

let currentIndex = 0;

// 2. Sélection des éléments
const postImage = document.getElementById('post-image');
const postAuthor = document.getElementById('post-author');
const postDesc = document.getElementById('post-desc');
const nextBtn = document.getElementById('next-btn');
const likeBtn = document.getElementById('like-btn');
const heartIcon = document.getElementById('heart-icon');

// 3. Fonction de mise à jour
function updatePost(index) {
    const data = posts[index];
    
    // Reset l'animation de transition
    postImage.classList.remove('fade-in');
    void postImage.offsetWidth; // Force le reflow pour relancer l'animation
    postImage.classList.add('fade-in');

    // Mise à jour du contenu
    postImage.src = data.image;
    postAuthor.textContent = data.author;
    postDesc.textContent = data.description;

   // RESET DU BOUTON LIKE (Pour qu'il redevienne un contour blanc)
    heartIcon.classList.remove('text-red-500', 'heart-pop');
    heartIcon.setAttribute('fill', 'none'); 
    heartIcon.style.stroke = "white";
    heartIcon.setAttribute('stroke-width', '2');            
}

// 4. Événements
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % posts.length; // Boucle infinie
    updatePost(currentIndex);
});

likeBtn.addEventListener('click', () => {
    const isLiked = heartIcon.getAttribute('fill') === 'currentColor';
    
    if (!isLiked) {
        heartIcon.setAttribute('fill', 'currentColor');
        heartIcon.classList.add('text-red-500', 'heart-pop');
        heartIcon.style.stroke = "transparent";
    } else {
        heartIcon.setAttribute('fill', 'none');
        heartIcon.classList.remove('text-red-500', 'heart-pop');
        heartIcon.style.stroke = "currentColor";
    }
});

// Initialisation au chargement
updatePost(0);