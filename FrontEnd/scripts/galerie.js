import { obtenirProjets, obtenirCategories } from './api.js';

//Recuperation des projets et categories depuis l'API
const projets = await obtenirProjets();
const categories = await obtenirCategories();

//Recuperation du token pour le mode edition
const token = localStorage.getItem("token");

//Recuperation des elements du DOM
const galerie = document.querySelector(".galerie");
const filtres = document.querySelector(".filtres");
const modeEdition = document.querySelector(".mode-edition");
const btnModifier = document.querySelector(".btn-modifier");
const filtresDiv = document.querySelector(".filtres");
const lienConnexion = document.querySelector(".lien-connexion");

//Modale
const modale = document.querySelector("#modale");
const btnFermerModale = document.querySelector(".fermer-modale");
const modaleGalerie = document.querySelector(".modale-galerie");

//FUNCTIONS
function afficherGalerie(projetsAAfficher) {
    galerie.innerHTML = ""
    projetsAAfficher.forEach((projet) => {
        const figureProjet = document.createElement("figure");

        const imgProjet = document.createElement("img");
        imgProjet.src = projet.imageUrl;

        const titreProjet = document.createElement("figcaption");
        titreProjet.innerText = projet.title;

        figureProjet.appendChild(imgProjet);
        figureProjet.appendChild(titreProjet);

        // Ajouter figure dans la section principale
        galerie.appendChild(figureProjet);
    });
}

function afficherGalerieModale(projetsAAfficher) {
    modaleGalerie.innerHTML = ""
    projetsAAfficher.forEach((projet) => {
        const figureProjet = document.createElement("figure");

        const imgProjet = document.createElement("img");
        imgProjet.src = projet.imageUrl;

        const btnSupprimer = document.createElement("button");
        btnSupprimer.innerHTML = `<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.71607 0.35558C2.82455 0.136607 3.04754 0 3.29063 0H5.70938C5.95246 0 6.17545 0.136607 6.28393 0.35558L6.42857 0.642857H8.35714C8.71272 0.642857 9 0.930134 9 1.28571C9 1.64129 8.71272 1.92857 8.35714 1.92857H0.642857C0.287277 1.92857 0 1.64129 0 1.28571C0 0.930134 0.287277 0.642857 0.642857 0.642857H2.57143L2.71607 0.35558ZM0.642857 2.57143H8.35714V9C8.35714 9.70915 7.78058 10.2857 7.07143 10.2857H1.92857C1.21942 10.2857 0.642857 9.70915 0.642857 9V2.57143ZM2.57143 3.85714C2.39464 3.85714 2.25 4.00179 2.25 4.17857V8.67857C2.25 8.85536 2.39464 9 2.57143 9C2.74821 9 2.89286 8.85536 2.89286 8.67857V4.17857C2.89286 4.00179 2.74821 3.85714 2.57143 3.85714ZM4.5 3.85714C4.32321 3.85714 4.17857 4.00179 4.17857 4.17857V8.67857C4.17857 8.85536 4.32321 9 4.5 9C4.67679 9 4.82143 8.85536 4.82143 8.67857V4.17857C4.82143 4.00179 4.67679 3.85714 4.67679 3.85714ZM6.42857 3.85714C6.25179 3.85714 6.10714 4.00179 6.10714 4.17857V8.67857C6.10714 8.85536 6.25179 9 6.42857 9C6.60536 9 6.75 8.85536 6.75 8.67857V4.17857C6.75 4.00179 6.60536 3.85714 6.60536 3.85714Z" fill="white"/></svg>`;
        btnSupprimer.classList.add("btn-supprimer");

        figureProjet.appendChild(imgProjet);
        figureProjet.appendChild(btnSupprimer);

        // Ajouter figure dans la section principale
        modaleGalerie.appendChild(figureProjet);
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


afficherGalerie(projets);
afficherGalerieModale(projets);

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

// 1.Le comportement de la modale 
btnModifier.addEventListener("click", () => {
    modale.style.display = "flex";
});

btnFermerModale.addEventListener("click", () => {
    modale.style.display = "none";
});

modale.addEventListener("click", (event) => {
    if (event.target === modale) {
        modale.style.display = "none";
    }
});


