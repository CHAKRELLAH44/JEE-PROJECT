import React, { useEffect, useState } from "react";
import {
  getProduits,
  createProduit,
  updateProduit,
  deleteProduit
} from "../services/produits.service";

export default function Produits() {
  const [produits, setProduits] = useState([]);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");          // Nom du fichier
  const [previewImage, setPreviewImage] = useState(null); // Aperçu avant ajout
  const [prix, setPrix] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = () => {
    getProduits()
      .then(res => {
        setProduits(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur lors du chargement des produits");
        console.error(err);
      });
  };

  // 🔥 Gestion du fichier choisi
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file.name);

    // Aperçu affiché dans le formulaire
    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
  };

  const submitProduit = () => {
    if (!titre || prix === "") {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const produit = {
      titre,
      description,
      image,        // on envoie seulement le NOM du fichier
      prix: Number(prix)
    };

    if (editingId) {
      updateProduit(editingId, produit).then(() => {
        resetForm();
        chargerProduits();
      });
    } else {
      createProduit(produit).then(() => {
        resetForm();
        chargerProduits();
      });
    }
  };

  const supprimerProduit = (id) => {
    deleteProduit(id).then(() => {
      setProduits(produits.filter(p => p.id !== id));
    });
  };

  const editProduit = (p) => {
    setEditingId(p.id);
    setTitre(p.titre);
    setDescription(p.description);
    setImage(p.image);
    setPrix(p.prix);
    setPreviewImage(p.image ? `/images/${p.image}` : null);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitre("");
    setDescription("");
    setImage("");
    setPreviewImage(null);
    setPrix("");
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>📦 Gestion des produits</h2>

      <div style={{ marginBottom: "20px" }}>
        <input type="text" placeholder="Titre"
          value={titre} onChange={e => setTitre(e.target.value)} />

        <input type="text" placeholder="Description"
          value={description} onChange={e => setDescription(e.target.value)} />

        {/* Choix du fichier */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Aperçu */}
        {previewImage && (
          <img src={previewImage} width="80" alt="preview" style={{ marginLeft: "10px" }} />
        )}

        <input type="number" placeholder="Prix"
          value={prix} onChange={e => setPrix(e.target.value)} />

        <button onClick={submitProduit}>
          {editingId ? "✏ Modifier" : "➕ Ajouter"}
        </button>

        {editingId && <button onClick={resetForm}>Annuler</button>}
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Image</th>
            <th>Prix (DH)</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {produits.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.titre}</td>
              <td>{p.description}</td>

              <td>
                {p.image ? (
                  <img
                    src={`/images/${p.image}`}
                    width="60"
                    alt={p.titre}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  "Aucune image"
                )}
              </td>

              <td>{p.prix}</td>

              <td>
                <button onClick={() => editProduit(p)}>✏</button>
                <button onClick={() => supprimerProduit(p.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
