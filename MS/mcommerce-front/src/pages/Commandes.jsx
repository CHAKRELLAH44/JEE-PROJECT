import React, { useEffect, useState } from "react";
import {
  getCommandes,
  createCommande,
  updateCommande,
  deleteCommande
} from "../services/commandes.service";

import { getProduits } from "../services/produits.service";

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);

  const [quantite, setQuantite] = useState("");
  const [description, setDescription] = useState("");
  const [idProduit, setIdProduit] = useState("");
  const [montant, setMontant] = useState(0);

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    chargerCommandes();
    chargerProduits();
  }, []);

  const chargerCommandes = () => {
    getCommandes().then(res => setCommandes(res.data));
  };

  const chargerProduits = () => {
    getProduits().then(res => setProduits(res.data));
  };

  // 🔥 Recalcul automatique du prix
  useEffect(() => {
    if (!idProduit || !quantite) {
      setMontant(0);
      return;
    }
    const produit = produits.find(p => p.id === Number(idProduit));
    if (produit) {
      setMontant(produit.prix * Number(quantite));
    }
  }, [idProduit, quantite, produits]);

  // 🔥 Créer ou modifier
  const save = () => {
    if (!idProduit) {
      alert("Veuillez choisir un produit !");
      return;
    }

    const cmd = {
      quantite: Number(quantite),
      description,
      idProduit: Number(idProduit),
      montant
    };

    if (editingId) {
      // 🔥 Mode modification
      updateCommande(editingId, cmd).then(() => {
        resetForm();
        chargerCommandes();
      });
    } else {
      // 🔥 Mode création
      createCommande(cmd).then(() => {
        resetForm();
        chargerCommandes();
      });
    }
  };

  const supprimer = (id) => {
    deleteCommande(id).then(() => {
      chargerCommandes();   // 🔥 refresh du tableau
    });
  };

  const edit = (c) => {
    setEditingId(c.id);
    setQuantite(c.quantite);
    setDescription(c.description);
    setIdProduit(c.idProduit);
  };

  const resetForm = () => {
    setEditingId(null);
    setQuantite("");
    setDescription("");
    setIdProduit("");
    setMontant(0);
  };

  return (
    <div>
      <h2>🧾 Gestion des commandes</h2>

      <div style={{ marginBottom: "20px" }}>
        
        {/* PRODUITS */}
        <select value={idProduit} onChange={e => setIdProduit(e.target.value)}>
          <option value="">-- Choisir un produit --</option>
          {produits.map(p => (
            <option key={p.id} value={p.id}>
              {p.titre} — {p.prix} DH
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantité"
          value={quantite}
          onChange={e => setQuantite(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <input
          type="text"
          value={montant + " DH"}
          readOnly
          style={{ background: "#eee" }}
        />

        <button onClick={save}>
          {editingId ? "✏ Modifier" : "➕ Ajouter"}
        </button>

        {editingId && <button onClick={resetForm}>Annuler</button>}
      </div>

      {/* TABLEAU */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Montant</th>
            <th>Description</th>
            <th>Modifier</th>
            <th>Supprimer</th>
          </tr>
        </thead>

        <tbody>
          {commandes.map(c => {
            const prod = produits.find(p => p.id === c.idProduit);
            return (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{prod ? prod.titre : "Produit supprimé"}</td>
                <td>{c.quantite}</td>
                <td>{c.montant} DH</td>
                <td>{c.description}</td>

                <td>
                  <button onClick={() => edit(c)}>✏</button>
                </td>

                <td>
                  <button onClick={() => supprimer(c.id)}>❌</button>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}
