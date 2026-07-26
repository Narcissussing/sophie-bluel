export async function obtenirProjets() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      return [];
    }
    const donnees = await response.json();
    return Array.isArray(donnees) ? donnees : [];
  } catch (erreur) {
    return [];
  }
}

export async function obtenirCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      return [];
    }
    const donnees = await response.json();
    return Array.isArray(donnees) ? donnees : [];
  } catch (erreur) {
    return [];
  }
}

export async function seConnecter(email, motDePasse) {
  try {
    const reponse = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: motDePasse }),
    });
    return await reponse.json();
  } catch (erreur) {
    return { token: null };
  }
}

export async function supprimerProjet(id) {
  const token = localStorage.getItem("token");
  try {
    const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: reponse.ok };
  } catch (erreur) {
    return { ok: false };
  }
}

export async function ajouterProjet(donnees) {
  const token = localStorage.getItem("token");
  try {
    const reponse = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: donnees,
    });
    const nouveauProjet = await reponse.json();
    return { ok: reponse.ok, nouveauProjet };
  } catch (erreur) {
    return { ok: false, nouveauProjet: null };
  }
}