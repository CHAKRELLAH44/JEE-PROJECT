import React, { useEffect, useState } from "react";
import {
  getCommandes,
  createCommande,
  updateCommande,
  deleteCommande
} from "../services/commandes.service";

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [montant, setMontant] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET commandes
  useEffect(() => {
    chargerCommandes();
  }, []);

  const chargerCommandes = () => {
    getCommandes()
      .then(res => {
        setCommandes(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur backend");
        console.error(err);
      });
  };

  // POST / PUT
  const submitCommande = () => {
    const commande = { montant };

    if (editingId) {
      updateCommande(editingId, commande).then(() => {
        resetForm();
        chargerCommandes();
      });
    } else {
      createCommande(commande).then(() => {
        resetForm();
        chargerCommandes();
      });
    }
  };

  // DELETE
  const supprimerCommande = (id) => {
    deleteCommande(id).then(() => {
      setCommandes(commandes.filter(c => c.id !== id));
    });
  };

  // EDIT
  const editCommande = (c) => {
    setEditingId(c.id);
    setMontant(c.montant);
  };

  const resetForm = () => {
    setEditingId(null);
    setMontant("");
  };

  if (loading) return <p>Chargement…</p>;

  return (
    <div>
      <h2>🧾 Gestion des commandes</h2>

      <input
        type="number"
        placeholder="Montant (DH)"
        value={montant}
        onChange={e => setMontant(e.target.value)}
      />
      <button onClick={submitCommande}>
        {editingId ? "Modifier" : "Ajouter"}
      </button>
      {editingId && <button onClick={resetForm}>Annuler</button>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Montant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commandes.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.montant}</td>
              <td>
                <button onClick={() => editCommande(c)}>✏</button>
                <button onClick={() => supprimerCommande(c.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
