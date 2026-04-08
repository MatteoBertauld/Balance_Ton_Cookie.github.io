const contents = {
    qui: `
        <div class="flex items-center space-x-6 mb-8">
            <div class="w-20 h-20 bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span class="material-symbols-outlined text-4xl text-primary" style="font-variation-settings: 'FILL' 1;">person</span>
            </div>
            <div>
                <h3 class="text-3xl font-black uppercase text-on-surface">Mattéo Bertauld</h3>
                <p class="font-label text-primary tracking-widest uppercase">Étudiant UQAC 2026</p>
            </div>
        </div>
        <div class="prose prose-invert max-w-none">
            <p class="text-on-surface-variant text-xl leading-relaxed">
                Passionné par la cybersécurité et l'éthique numérique, je développe ce projet pour sensibiliser le grand public à l'opacité du traitement des données personnelles. 
            </p>
            <p class="text-on-surface-variant/80">
                Mon objectif est de transformer une donnée abstraite en une expérience visuelle concrète, permettant à chacun de reprendre le contrôle sur son identité numérique.
            </p>
        </div>
    `,
    projet: `
        <h3 class="text-3xl font-black uppercase text-on-surface mb-6">Le Projet Balance</h3>
        <div class="prose prose-invert max-w-none space-y-4">
            <p class="text-on-surface-variant text-lg">
                'Balance tes données' est une plateforme expérimentale conçue comme un miroir numérique. Ce n'est pas seulement un site, c'est un <span class="text-primary font-bold">outil pédagogique</span>.
            </p>
            <div class="p-4 bg-surface-container-high border-l-4 border-primary">
                <p class="text-sm font-label uppercase tracking-wider text-on-surface-variant">Mission</p>
                <p class="text-on-surface">Démystifier le tracking publicitaire et gouvernemental via une immersion visuelle brutale.</p>
            </div>
        </div>
    `,
    cred: `
        <h3 class="text-3xl font-black uppercase text-on-surface mb-6">Inégrité des Sources</h3>
        <div class="prose prose-invert max-w-none space-y-6">
            <p class="text-slate-300 text-lg leading-relaxed">
                Ce dispositif de simulation est le fruit d'une synthèse rigoureuse issue de sources institutionnelles, de portails gouvernementaux de protection des données, ainsi que de publications scientifiques certifiées.
            </p>

            <ul class="font-mono-tech text-sm text-cyan-500 space-y-2">
                <li>> Documentation technique officiels : RGPD (UE), LPRPDE (Canada), DPA (UK)</li>
                <li>> Publications scientifiques certifiées :  PETs (Privacy-Enhancing Technologies)</li>
                <li>> Études de cas : Traceurs réels extraits de plateformes actives</li>
            </ul>

            <div class="space-y-2 border-t border-slate-800 pt-4">
                <p class="text-slate-400 text-sm">
                    En tant que <span class="italic">travail étudiant</span>, cette interface est une interprétation pédagogique. Des erreurs ou des décalages avec les dernières mises à jour réglementaires peuvent subsister malgré la rigueur apportée.
                </p>
                
                <p class="text-[10px] text-rose-500 uppercase tracking-[0.2em] font-bold mt-4">
                    [!] Dernière mise à jour : Avril 2026
                </p>
            </div>
        </div>
    `,
    use: `
        <h3 class="text-3xl font-black uppercase text-on-surface mb-6">Usage des Données</h3>
        <div class="prose prose-invert max-w-none space-y-4">
            <p class="text-on-surface-variant text-lg">
                Vos données ne sont utilisées qu'en local, pour votre propre visionnage. 
            </p>
            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 border border-outline-variant/20 bg-surface-container-highest">
                    <span class="material-symbols-outlined text-primary mb-2">lock</span>
                    <p class="text-xs font-bold uppercase">Zéro Persistance</p>
                </div>
                <div class="p-4 border border-outline-variant/20 bg-surface-container-highest">
                    <span class="material-symbols-outlined text-primary mb-2">visibility_off</span>
                    <p class="text-xs font-bold uppercase">Anonymat Total</p>
                </div>
            </div>
        </div>
    `
};

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.menu-btn');
    const display = document.getElementById('content-display');

    // Init initial content
    display.innerHTML = contents.qui;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active Class
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Content
            const key = btn.getAttribute('data-content');
            display.innerHTML = contents[key];
        });
    });
});


