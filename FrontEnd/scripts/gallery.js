import { getWorks } from './api.js';

const projets = await getWorks();

const gallery = document.querySelector(".gallery");

for (let index = 0; index < projets.length; index++) {
    const projet = projets[index];
    const figureProjet = document.createElement("figure");

    const imgProjet = document.createElement("img");
    imgProjet.src = projet.imageUrl;

    const titreProjet = document.createElement("figcaption");
    titreProjet.innerText = projet.title;

    // Ajouter les éléments dans figure
    figureProjet.appendChild(imgProjet);
    figureProjet.appendChild(titreProjet);

    // Ajouter figure dans la section principale
    gallery.append(figureProjet);
 
}


// function genererTrave() {
//   // Boucle pour parcourir toutes les pièces
//   for (let indexArticle = 0; indexArticle < pieces.length; indexArticle++) {
//     // Récupérer une pièce du tableau
//     const article = pieces[indexArticle];
//     // Création des éléments de contenu (image, nom, prix, etc.
//     const imageElement = document.createElement("img");
//     imageElement.src = article.image;

//     const nomElement = document.createElement("h2");
//     nomElement.innerText = article.nom;

//     const prixElement = document.createElement("p");
//     prixElement.innerText = `Prix : ${article.prix.toLocaleString("fr-FR", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })} €`;
//     const descriptionElement = document.createElement("p");
//     descriptionElement.innerText =
//       article.description ?? "Pas de description pour cet article";

//     const categorieElement = document.createElement("p");
//     categorieElement.innerText = article.categorie;

//     const disponibilteElement = document.createElement("p");
//     disponibilteElement.innerText = article.disponibilite
//       ? "En Stock"
//       : "En Rupture";

//     //Code ajouté
//     const avisBouton = document.createElement("button");
//     avisBouton.dataset.id = article.id;
//     avisBouton.textContent = "Afficher les avis";
//     //creer l'element  article
//     const articleElement = document.createElement("article");
//     articleElement.dataset.id = article.id;

//     // Ajouter les éléments dans la carte article
//     articleElement.appendChild(imageElement);
//     articleElement.appendChild(nomElement);
//     articleElement.appendChild(prixElement);
//     articleElement.appendChild(descriptionElement);
//     articleElement.appendChild(categorieElement);
//     articleElement.appendChild(disponibilteElement);
//     articleElement.appendChild(avisBouton);

//     // Ajouter l'article dans la section principale
//     sectionFiches.append(articleElement);
//   }
//   ajoutListenerAvis();
// }