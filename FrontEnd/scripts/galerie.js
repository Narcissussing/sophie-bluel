import { obtenirProjets, obtenirCategories, supprimerProjet, ajouterProjet } from './api.js';

// ---------- DONNÉES ----------
let projets = await obtenirProjets();
const categories = await obtenirCategories();
const token = localStorage.getItem("token");

// ---------- DOM : PAGE PRINCIPALE ----------
const galerie = document.querySelector(".galerie");
const filtres = document.querySelector(".filtres");
const modeEdition = document.querySelector(".mode-edition");
const btnModifier = document.querySelector(".btn-modifier");
const filtresDiv = document.querySelector(".filtres");
const lienConnexion = document.querySelector(".lien-connexion");

// ---------- DOM : MODALE, STRUCTURE ----------
const modale = document.querySelector("#modale");
const btnFermerModale = document.querySelector(".fermer-modale");
const vueGalerie = document.querySelector(".vue-galerie");
const vueFormulaire = document.querySelector(".vue-formulaire");
const btnAjouterPhoto = document.querySelector(".btn-ajouter-photo");
const btnRetour = document.querySelector(".btn-retour");

// ---------- DOM : MODALE, GALERIE (SUPPRESSION) ----------
const modaleGalerie = document.querySelector(".modale-galerie");
const messageErreurSuppression = document.querySelector(".message-erreur-suppression");

// ---------- DOM : MODALE, UPLOAD IMAGE ----------
const zoneUpload = document.querySelector(".zone-upload");
const btnChoisirPhoto = document.querySelector(".btn-choisir-photo");
const inputFichier = document.getElementById("inputFichier");
const apercuImage = document.getElementById("apercuImage");
const apercuDefaut = document.getElementById("apercu-defaut");
const uploadInfo = document.querySelector(".upload-info");
const messageErreurImage = document.querySelector(".message-erreur-image");

// ---------- DOM : MODALE, FORMULAIRE D'AJOUT ----------
const select = document.getElementById("categorie");
const btnValider = document.getElementById("btn-valider");
const formAjoutPhoto = document.getElementById("form-ajout-photo");
const messageErreurAPI = document.querySelector(".message-erreur-api");

// ---------- AFFICHAGE GALERIE ----------
function afficherGalerie(projetsAAfficher) {
    galerie.innerHTML = ""
    projetsAAfficher.forEach((projet) => {
        const figureProjet = document.createElement("figure");

        const imgProjet = document.createElement("img");
        imgProjet.src = projet.imageUrl;
        imgProjet.alt = projet.title;

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
        imgProjet.alt = projet.title;

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
                messageErreurSuppression.style.visibility = "hidden";
            } else {
                messageErreurSuppression.textContent = "Une erreur est survenue, veuillez réessayer.";
                messageErreurSuppression.style.visibility = "visible";
            }
        });

        figureProjet.appendChild(imgProjet);
        figureProjet.appendChild(btnSupprimer);

        modaleGalerie.appendChild(figureProjet);
    });
}

// ---------- FILTRES : HELPER ----------
function changerBoutonActif(bouton) {
    const boutonActif = filtres.querySelector(".actif");
    if (boutonActif) {
        boutonActif.classList.remove("actif");
    }
    bouton.classList.add("actif");
}

// ---------- MODE ÉDITION ----------
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

// ---------- VALIDATION DU FORMULAIRE D'AJOUT ----------
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
    messageErreurAPI.style.visibility = "hidden";
    messageErreurImage.style.visibility = "hidden";
    verifierFormulaire();
}


// ---------- INITIALISATION ----------
afficherGalerie(projets);
afficherGalerieModale(projets);
verifierFormulaire();

// Défilement vers l'ancre une fois la galerie rendue
if (window.location.hash) {
    document.querySelector(window.location.hash)?.scrollIntoView();
}

// ---------- FILTRES ----------
// Bouton "Tous"
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

// ---------- MODALE : OUVERTURE / FERMETURE ----------
// Contenu de la page masqué aux lecteurs d'écran tant que la modale est ouverte
const contenuPrincipal = document.querySelectorAll("header, main > section, footer");

function ouvrirModale() {
    modale.style.display = "flex";
    vueGalerie.style.display = "block";
    vueFormulaire.style.display = "none";
    contenuPrincipal.forEach((element) => element.setAttribute("inert", ""));
    btnFermerModale.focus();
}

function fermerModale() {
    modale.style.display = "none";
    reinitialiserFormulaireAjout();
    vueFormulaire.style.display = "none";
    vueGalerie.style.display = "block";
    contenuPrincipal.forEach((element) => element.removeAttribute("inert"));
    btnModifier.focus();
}

btnModifier.addEventListener("click", ouvrirModale);

btnFermerModale.addEventListener("click", fermerModale);

modale.addEventListener("click", (event) => {
    if (event.target === modale) {
        fermerModale();
    }
});

// Fermeture avec Échap
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modale.style.display === "flex") {
        fermerModale();
    }
});

// Piège à focus : le Tab reste à l'intérieur de la modale
modale.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") {
        return;
    }

    const elementsFocusables = modale.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const visibles = Array.from(elementsFocusables).filter((element) => element.offsetParent !== null);
    const premier = visibles[0];
    const dernier = visibles[visibles.length - 1];

    if (event.shiftKey && document.activeElement === premier) {
        event.preventDefault();
        dernier.focus();
    } else if (!event.shiftKey && document.activeElement === dernier) {
        event.preventDefault();
        premier.focus();
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

// ---------- MODALE : UPLOAD IMAGE ----------
btnChoisirPhoto.addEventListener("click", () => {
    inputFichier.click();
});

inputFichier.addEventListener("change", (event) => {
    const image = event.target.files[0];

    // Annulation du sélecteur de fichier : aucune image choisie
    if (!image) {
        return;
    }

    if (image.size > 4 * 1024 * 1024) {
        messageErreurImage.textContent = "Image trop lourde (4mo max)";
        messageErreurImage.style.visibility = "visible";
        inputFichier.value = "";
        verifierFormulaire();
        return;
    }
    messageErreurImage.style.visibility = "hidden";
    apercuImage.src = URL.createObjectURL(image);
    apercuImage.style.display = "block";
    uploadInfo.style.display = "none";
    apercuDefaut.style.display = "none";
    btnChoisirPhoto.style.display = "none";
    verifierFormulaire();
});
document.getElementById("titre").addEventListener("input", verifierFormulaire);
document.getElementById("categorie").addEventListener("change", verifierFormulaire);

// ---------- MODALE : AJOUT PROJET ----------
formAjoutPhoto.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageErreurAPI.style.visibility = "hidden";

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
        messageErreurAPI.style.visibility = "visible";
    }
});