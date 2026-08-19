import { obtenirProjets, obtenirCategories, tokenEstValide, supprimerProjet, ajouterProjet } from './api.js';

// ---------- DONNÉES ----------
let projets = await obtenirProjets();
const categories = await obtenirCategories();

// ---------- DOM : PAGE PRINCIPALE ----------
const galerie = document.querySelector(".galerie");
const filtres = document.querySelector(".filtres");
const btnModifier = document.querySelector(".btn-modifier");

// ---------- DOM : MODALE, STRUCTURE ----------
const modale = document.querySelector("#modale");
const btnFermerModale = document.querySelector(".fermer-modale");
const vueGalerie = document.querySelector(".vue-galerie");
const vueFormulaire = document.querySelector(".vue-formulaire");

// ---------- DOM : MODALE, UPLOAD IMAGE ----------
const btnChoisirPhoto = document.querySelector(".btn-choisir-photo");
const inputFichier = document.getElementById("inputFichier");
const apercuImage = document.getElementById("apercuImage");
const apercuDefaut = document.getElementById("apercu-defaut");
const uploadInfo = document.querySelector(".upload-info");
const messageErreurImage = document.querySelector(".message-erreur-image");

// ---------- DOM : MODALE, FORMULAIRE D'AJOUT ----------
const inputTitre = document.getElementById("titre");
const select = document.getElementById("categorie");
const formAjoutPhoto = document.getElementById("form-ajout-photo");
const messageErreurAPI = document.querySelector(".message-erreur-api");

// ---------- AFFICHAGE GALERIE ----------
function afficherGalerie(projetsAAfficher) {
    galerie.innerHTML = ""
    projetsAAfficher.forEach((projet) => {
        const figureProjet = document.createElement("figure");
        figureProjet.dataset.categoryId = String(projet.categoryId);
        figureProjet.dataset.projectId = projet.id;

        const imgProjet = document.createElement("img");
        imgProjet.src = projet.imageUrl;
        imgProjet.alt = projet.title;

        const titreProjet = document.createElement("figcaption");
        titreProjet.innerText = projet.title;

        figureProjet.appendChild(imgProjet);
        figureProjet.appendChild(titreProjet);

        galerie.appendChild(figureProjet);
    });
}

const modaleGalerie = document.querySelector(".modale-galerie");
function afficherGalerieModale(projetsAAfficher) {
    modaleGalerie.innerHTML = "";

    projetsAAfficher.forEach((projet) => {
        const figureProjet = document.createElement("figure");

        const imgProjet = document.createElement("img");
        imgProjet.src = projet.imageUrl;
        imgProjet.alt = projet.title;

        const btnSupprimer = document.createElement("button");
        btnSupprimer.dataset.projectId = String(projet.id);
        btnSupprimer.innerHTML = `
            <img
                src="./assets/icons/supprimer.svg"
                alt="Supprimer"
                width="9"
                height="11"
            >
        `;
        btnSupprimer.classList.add("btn-supprimer");

        figureProjet.appendChild(imgProjet);
        figureProjet.appendChild(btnSupprimer);

        modaleGalerie.appendChild(figureProjet);
    });
}
modaleGalerie.addEventListener("click", async (event) => {
    event.preventDefault();
    const btnSupprimer = event.target.closest(".btn-supprimer");
    if (!btnSupprimer) {
        return;
    }
    const messageErreurSuppression = document.querySelector(
        ".message-erreur-suppression"
    );
    const idProjet = Number(btnSupprimer.dataset.projectId);
    const reponse = await supprimerProjet(idProjet);
    if (reponse.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }
    if (reponse.ok) {
        projets = projets.filter((projet) => {
            return projet.id !== idProjet;
        });
        afficherGalerie(projets);
        afficherGalerieModale(projets);
        messageErreurSuppression.style.visibility = "hidden";
    } else {
        messageErreurSuppression.textContent =
            "Une erreur est survenue, veuillez réessayer.";
        messageErreurSuppression.style.visibility = "visible";
    }
});

// ---------- FILTRES : HELPER ----------
function changerBoutonActif(bouton) {
    const boutonActif = filtres.querySelector(".actif");
    if (boutonActif) {
        boutonActif.classList.remove("actif");
    }
    bouton.classList.add("actif");
}

// ---------- MODE ÉDITION ----------
if (tokenEstValide()) {
    const lienConnexion = document.querySelector(".lien-connexion");
    const modeEdition = document.querySelector(".mode-edition");
    modeEdition.style.display = "flex";
    btnModifier.style.display = "flex";
    filtres.style.display = "none";
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
    const titre = inputTitre.value;
    const categorie = select.value;
    const image = inputFichier.files[0];
    const btnValider = document.getElementById("btn-valider");

    const estValide = titre.trim() !== "" && categorie !== "" && image !== undefined;

    btnValider.disabled = !estValide;
}

function reinitialiserFormulaireAjout() {
    if (apercuImage.src.startsWith("blob:")) {
        URL.revokeObjectURL(apercuImage.src);
    }
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

const optionPlaceholder = document.createElement("option");
optionPlaceholder.value = "";
optionPlaceholder.textContent = "";
optionPlaceholder.disabled = true;
optionPlaceholder.selected = true;
optionPlaceholder.setAttribute("selected", "");

select.appendChild(optionPlaceholder);


// ---------- FILTRES ----------
const filtresDisponibles = [
    { id: "all", name: "Tous" },
    ...categories,
];

filtresDisponibles.forEach((categorie) => {
    const buttonFiltre = document.createElement("button");
    buttonFiltre.innerText = categorie.name;
    buttonFiltre.dataset.categoryId = String(categorie.id);

    if (categorie.id === "all") {
        buttonFiltre.classList.add("actif");
    }

    buttonFiltre.addEventListener("click", () => {
        changerBoutonActif(buttonFiltre);

        const categorieId = buttonFiltre.dataset.categoryId;
        galerie.querySelectorAll("figure").forEach((figure) => {
            figure.hidden =
                categorieId !== "all" &&
                figure.dataset.categoryId !== categorieId;
        });
    });

    filtres.appendChild(buttonFiltre);

    if (categorie.id !== "all") {
        const option = document.createElement("option");
        option.value = categorie.id;
        option.textContent = categorie.name;

        select.appendChild(option);
    }
});

// ---------- MODALE : OUVERTURE / FERMETURE ----------
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

// Piège à focus
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

document
    .querySelector(".btn-ajouter-photo")
    .addEventListener("click", () => {
        vueGalerie.style.display = "none";
        vueFormulaire.style.display = "flex";
    });

document
    .querySelector(".btn-retour")
    .addEventListener("click", () => {
        reinitialiserFormulaireAjout();
        vueFormulaire.style.display = "none";
        vueGalerie.style.display = "block";
    });

// ---------- MODALE : UPLOAD IMAGE ----------
btnChoisirPhoto.addEventListener("click", () => {
    inputFichier.click();
});

inputFichier.addEventListener("change", (event) => {
    const image = event.target.files[0];
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
    if (apercuImage.src.startsWith("blob:")) {
        URL.revokeObjectURL(apercuImage.src);
    }
    apercuImage.src = URL.createObjectURL(image);
    apercuImage.style.display = "block";
    uploadInfo.style.display = "none";
    apercuDefaut.style.display = "none";
    btnChoisirPhoto.style.display = "none";
    verifierFormulaire();
});
inputTitre.addEventListener("input", verifierFormulaire);
select.addEventListener("change", verifierFormulaire);

// ---------- MODALE : AJOUT PROJET ----------
formAjoutPhoto.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageErreurAPI.style.visibility = "hidden";

    const donnees = new FormData();
    const titre = inputTitre.value;
    const categorie = Number(select.value);
    const image = inputFichier.files[0];

    donnees.append("title", titre);
    donnees.append("image", image);
    donnees.append("category", categorie);

    const { ok, status, nouveauProjet } = await ajouterProjet(donnees);

    if (status === 401) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }

    if (ok) {
        projets.push(nouveauProjet);
        afficherGalerie(projets);
        afficherGalerieModale(projets);
        fermerModale();
    } else {
        messageErreurAPI.textContent = "Une erreur est survenue, veuillez réessayer.";
        messageErreurAPI.style.visibility = "visible";
    }
});