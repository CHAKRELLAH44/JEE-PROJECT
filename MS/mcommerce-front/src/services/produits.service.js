import api from "./api";

export const getProduits = () => api.get("/PRODUITS/api/products");
export const getProduitById = (id) => api.get(`/PRODUITS/api/products/${id}`);
export const createProduit = (produit) => api.post("/PRODUITS/api/products", produit);
export const updateProduit = (id, produit) => api.put(`/PRODUITS/api/products/${id}`, produit);
export const deleteProduit = (id) => api.delete(`/PRODUITS/api/products/${id}`);

