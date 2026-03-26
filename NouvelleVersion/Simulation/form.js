document.getElementById('CreateAccountForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const formData = new FormData(this);

    // Enregistrement des cookies
    formData.forEach((value, key) => {
        setCookie(key, value, 7);
    });

    // Feedback visuel
    submitBtn.textContent = "Données Enregistrées";
    submitBtn.classList.add('success-state');
    submitBtn.disabled = true;

    console.log("Cookies enregistrés :", document.cookie);
});