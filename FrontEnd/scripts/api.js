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