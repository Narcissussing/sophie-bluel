export async function obtenirProjets() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  return data;
}

export async function obtenirCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const data = await response.json();
  return data;
}

export async function seConnecter(email, motDePasse) {
  const reponse = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: motDePasse }),
  });
  const donnees = await reponse.json();
  return donnees;
}