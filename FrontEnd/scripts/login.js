import { seConnecter } from "./api.js";

const formulaire = document.querySelector("form");
const messageErreur = document.querySelector(".message-erreur");

formulaire.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Cache l'erreur au cas où c'est une deuxième tentative
    messageErreur.style.display = "none";

    // Récupère les valeurs des champs
    const email = document.querySelector("#email").value;
    const motDePasse = document.querySelector("#password").value;

    // Envoie les informations à l'API
    const resultat = await seConnecter(email, motDePasse);

    // Vérifie si la connexion a réussi
    if (resultat.token) {
        // Sauvegarde le token
        localStorage.setItem("token", resultat.token);

        // Redirige vers la page d'accueil
        window.location.href = "index.html";
    } else {
        // Affiche l'erreur
        messageErreur.textContent = "Email ou mot de passe incorrect.";
        messageErreur.style.display = "block";
    }
});