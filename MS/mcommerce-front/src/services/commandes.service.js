import api from "./api";

// GET commandes
export const getCommandes = () => {
  return api.get("/COMMANDES/commandes");
};

// GET commande par id
export const getCommandeById = (id) => {
  return api.get(`/COMMANDES/commandes/${id}`);
};

// POST : ajouter commande
export const createCommande = (commande) => {
  return api.post("/COMMANDES/commandes", commande);
};

// PUT : modifier commande
export const updateCommande = (id, commande) => {
  return api.put(`/COMMANDES/commandes/${id}`, commande);
};

// DELETE : supprimer commande
export const deleteCommande = (id) => {
  return api.delete(`/COMMANDES/commandes/${id}`);
};
