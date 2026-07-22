import { obtenirProjets, obtenirCategories } from './api.js';

const projets = await obtenirProjets();
const categories = await obtenirCategories();
const gallery = document.querySelector(".gallery");
const filtres = document.querySelector(".filtres");
const token = localStorage.getItem("token");
const modeEdition = document.querySelector(".mode-edition");
const btnModifier = document.querySelector(".btn-modifier");
const filtresDiv = document.querySelector(".filtres");
const lienConnexion = document.querySelector(".lien-connexion");

//FUNCTIONS
function afficherGalerie(projetsAAfficher) {
    gallery.innerHTML = ""
    projetsAAfficher.forEach((projet) => {
        const figureProjet = document.createElement("figure");

        const imgProjet = document.createElement("img");
        imgProjet.src = projet.imageUrl;

        const titreProjet = document.createElement("figcaption");
        titreProjet.innerText = projet.title;

        figureProjet.appendChild(imgProjet);
        figureProjet.appendChild(titreProjet);

        // Ajouter figure dans la section principale
        gallery.appendChild(figureProjet);
    });
}

function changerBoutonActif(bouton) {
    const boutonActif = filtres.querySelector(".actif");

    if (boutonActif) {
        boutonActif.classList.remove("actif");
    }

    bouton.classList.add("actif");
}

if (token) {
    modeEdition.style.display = "flex";
    btnModifier.style.display = "flex";
    filtresDiv.style.display = "none";
    lienConnexion.textContent = "logout";
    lienConnexion.href = "#";

    lienConnexion.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
}


afficherGalerie(projets)

// Creer "Tous" button
const buttonFiltreTous = document.createElement("button");
buttonFiltreTous.innerText = "Tous";
buttonFiltreTous.classList.add("actif");
filtres.appendChild(buttonFiltreTous);

buttonFiltreTous.addEventListener("click", () => {
    changerBoutonActif(buttonFiltreTous);
    afficherGalerie(projets);
});

// Creer categorie buttons
categories.forEach((categorie) => {
    const buttonFiltre = document.createElement("button");
    buttonFiltre.innerText = categorie.name;
    filtres.appendChild(buttonFiltre);

    buttonFiltre.addEventListener("click", () => {
        changerBoutonActif(buttonFiltre);

        const filtreCategorie = projets.filter(
            (projet) => projet.categoryId === categorie.id
        );

        afficherGalerie(filtreCategorie);
    });
});
