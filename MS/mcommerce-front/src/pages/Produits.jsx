import React, { useEffect, useState } from "react";
import {
  getProduits,
  createProduit,
  updateProduit,
  deleteProduit,
  uploadImage
} from "../services/produits.service";

export default function Produits() {
  const [produits, setProduits] = useState([]);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");

  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger produits
  const chargerProduits = () => {
    getProduits().then(res => {
      setProduits(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    chargerProduits();
  }, []);

  // Upload file → preview
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setPreviewImage(URL.createObjectURL(f));
  };

const submitProduit = async () => {
  if (!titre || prix === "") {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  let finalImageName = image;

  // Upload si nouvelle image
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("prix", prix);

    const res = await uploadImage(formData);
    finalImageName = res.data;   // backend renvoie /uploads/xxxx.png
  }

  const produit = {
    titre,
    description,
    prix: Number(prix),
    image: finalImageName
  };

  if (editingId) {
    await updateProduit(editingId, produit);
  } else {
    await createProduit(produit);
  }

  resetForm();
  chargerProduits();
};



  // Delete
  const deleteProd = async (id) => {
    await deleteProduit(id);
    setProduits(produits.filter(p => p.id !== id));
  };

  // Edit
  const editProduit = (p) => {
    setEditingId(p.id);
    setTitre(p.titre);
    setDescription(p.description);
    setPrix(p.prix);
    setImage(p.image);
    // 🔥 Afficher l'image existante avec l'URL complète du backend
    setPreviewImage(p.image ? `http://localhost:9103/PRODUITS${p.image}` : null);
    setFile(null);
  };

  // Reset
  const resetForm = () => {
    setEditingId(null);
    setTitre("");
    setDescription("");
    setPrix("");
    setImage("");
    setPreviewImage(null);
    setFile(null);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>📦 Gestion des produits</h2>

      <div style={{ marginBottom: "20px" }}>
        <input type="text" placeholder="Titre"
          value={titre} onChange={e => setTitre(e.target.value)} />

        <input type="text" placeholder="Description"
          value={description} onChange={e => setDescription(e.target.value)} />

        {/* Choisir une image */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {previewImage && (
          <img src={previewImage} width="90" alt="preview" style={{ marginLeft: 10 }} />
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
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {produits.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.titre}</td>
              <td>{p.description}</td>

              <td>
                {p.image ? (
                  <img src={`http://localhost:9103/PRODUITS${p.image}`} width="70" alt={p.titre} />
                ) : "Aucune image"}
              </td>

              <td>{p.prix} DH</td>

              <td>
                <button onClick={() => editProduit(p)}>✏</button>
                <button onClick={() => deleteProd(p.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
