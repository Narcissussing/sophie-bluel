import { obtenirProjets, obtenirCategories, supprimerProjet, ajouterProjet } from './api.js';

//Projets et categories depuis l'API
let projets = await obtenirProjets();
const categories = await obtenirCategories();

//Recuperation du token pour le mode edition
const token = localStorage.getItem("token");

//Elements du DOM
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
const select = document.getElementById("categorie");
const btnAjouterPhoto = document.querySelector(".btn-ajouter-photo");
const btnRetour = document.querySelector(".btn-retour");
const vueGalerie = document.querySelector(".vue-galerie");
const vueFormulaire = document.querySelector(".vue-formulaire");
const btnChoisirPhoto = document.querySelector(".btn-choisir-photo");
const inputFichier = document.getElementById("inputFichier");
const apercuImage = document.getElementById("apercuImage");
const apercuDefaut = document.getElementById("apercu-defaut");
const uploadInfo = document.querySelector(".upload-info");
const zoneUpload = document.querySelector(".zone-upload");
const btnValider = document.getElementById("btn-valider");
const formAjoutPhoto = document.getElementById("form-ajout-photo");
const messageErreurAjout = document.querySelector(".message-erreur-ajout");


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
        btnSupprimer.innerHTML = `<img src="./assets/icons/supprimer.svg" alt="Supprimer" width="9" height="11">`;
        btnSupprimer.classList.add("btn-supprimer");
        btnSupprimer.addEventListener("click", async (event) => {
            event.preventDefault();
            const reponse = await supprimerProjet(projet.id);
            if (reponse.ok) {
                figureProjet.remove();
                projets = projets.filter((p) => p.id !== projet.id);
                afficherGalerie(projets);
            }
        });

        figureProjet.appendChild(imgProjet);
        figureProjet.appendChild(btnSupprimer);

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

function verifierFormulaire() {
    const titre = document.getElementById("titre").value;
    const categorie = document.getElementById("categorie").value;
    const image = document.getElementById("inputFichier").files[0];

    const estValide = titre.trim() !== "" && categorie !== "" && image !== undefined;

    btnValider.disabled = !estValide;
}

function reinitialiserFormulaireAjout() {
    formAjoutPhoto.reset();
    apercuImage.style.display = "none";
    apercuDefaut.style.display = "flex";
    btnChoisirPhoto.style.display = "flex";
    uploadInfo.style.display = "flex";
    messageErreurAjout.hidden = true;
    verifierFormulaire();
}


afficherGalerie(projets);
afficherGalerieModale(projets);
verifierFormulaire();

// Creer "Tous" button
const buttonFiltreTous = document.createElement("button");
buttonFiltreTous.innerText = "Tous";
buttonFiltreTous.classList.add("actif");
filtres.appendChild(buttonFiltreTous);

buttonFiltreTous.addEventListener("click", () => {
    changerBoutonActif(buttonFiltreTous);
    afficherGalerie(projets);
});

// Placeholder
const optionPlaceholder = document.createElement("option");
optionPlaceholder.value = "";
optionPlaceholder.textContent = "";
optionPlaceholder.disabled = true;
optionPlaceholder.selected = true;
optionPlaceholder.setAttribute("selected", "");

select.appendChild(optionPlaceholder);

// Categories
categories.forEach((categorie) => {
    const buttonFiltre = document.createElement("button");
    const option = document.createElement("option");

    buttonFiltre.innerText = categorie.name;
    filtres.appendChild(buttonFiltre);

    option.value = categorie.id;
    option.textContent = categorie.name;
    select.appendChild(option);

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
    vueGalerie.style.display = "block";
    vueFormulaire.style.display = "none";
});

btnFermerModale.addEventListener("click", () => {
    modale.style.display = "none";
    reinitialiserFormulaireAjout();
    vueFormulaire.style.display = "none";
    vueGalerie.style.display = "block";
});


modale.addEventListener("click", (event) => {
    if (event.target === modale) {
        modale.style.display = "none";
        reinitialiserFormulaireAjout();
        vueFormulaire.style.display = "none";
        vueGalerie.style.display = "block";
    }
});

btnAjouterPhoto.addEventListener("click", () => {
    vueGalerie.style.display = "none";
    vueFormulaire.style.display = "flex";
});

btnRetour.addEventListener("click", () => {
    vueFormulaire.style.display = "none";
    vueGalerie.style.display = "block";
});

btnChoisirPhoto.addEventListener("click", () => {
    inputFichier.click();
});

inputFichier.addEventListener("change", (event) => {
    const image = event.target.files[0];
    if (image.size > 4 * 1024 * 1024) {
        messageErreurAjout.textContent = "Image trop lourde (4mo max)";
        messageErreurAjout.hidden = false;
        inputFichier.value = "";
        verifierFormulaire();
        return;
    }
    messageErreurAjout.hidden = true;
    apercuImage.src = URL.createObjectURL(image);
    apercuImage.style.display = "block";
    uploadInfo.style.display = "none";
    apercuDefaut.style.display = "none";
    btnChoisirPhoto.style.display = "none";
    verifierFormulaire();
});
document.getElementById("titre").addEventListener("input", verifierFormulaire);
document.getElementById("categorie").addEventListener("change", verifierFormulaire);

formAjoutPhoto.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageErreurAjout.hidden = true;

    const donnees = new FormData();
    const titre = document.getElementById("titre").value;
    const categorie = Number(document.getElementById("categorie").value);
    const image = document.getElementById("inputFichier").files[0];

    donnees.append("title", titre);
    donnees.append("image", image);
    donnees.append("category", categorie);

    const { ok, nouveauProjet } = await ajouterProjet(donnees);

    if (ok) {
        projets.push(nouveauProjet);
        afficherGalerie(projets);
        afficherGalerieModale(projets);

        formAjoutPhoto.reset();
        apercuImage.style.display = "none";
        apercuDefaut.style.display = "flex";
        btnChoisirPhoto.style.display = "flex";
        uploadInfo.style.display = "flex";
        verifierFormulaire();

        modale.style.display = "none";
    } else {
        messageErreurAjout.hidden = false;
    }
});