import { seConnecter } from "./api.js";

const formulaire = document.querySelector("form");
const messageErreur = document.querySelector(".message-erreur");

formulaire.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupère les valeurs au moment de la soumission
    const email = document.querySelector("#email").value;
    const motDePasse = document.querySelector("#password").value;

    const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!email.trim() || !motDePasse.trim()) {
        messageErreur.textContent = "Veuillez remplir tous les champs.";
        messageErreur.style.display = "block";
        return;
    }

    if (!emailValide) {
        messageErreur.textContent = "Format d'email invalide.";
        messageErreur.style.display = "block";
        return;
    }

    // Cache l'erreur au cas où c'est une deuxième tentative
    messageErreur.style.display = "none";

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