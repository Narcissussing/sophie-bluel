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

export function tokenEstValide() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export async function supprimerProjet(id) {
  if (!tokenEstValide()) return { ok: false, status: 401 };
  const token = localStorage.getItem("token");
  try {
    const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: reponse.ok, status: reponse.status };
  } catch (erreur) {
    return { ok: false, status: null };
  }
}

export async function ajouterProjet(donnees) {
  if (!tokenEstValide()) return { ok: false, status: 401 };
  const token = localStorage.getItem("token");
  try {
    const reponse = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: donnees,
    });
    const nouveauProjet = await reponse.json();
    return { ok: reponse.ok, nouveauProjet, status: reponse.status };
  } catch (erreur) {
    return { ok: false, nouveauProjet: null, status: null };
  }
}