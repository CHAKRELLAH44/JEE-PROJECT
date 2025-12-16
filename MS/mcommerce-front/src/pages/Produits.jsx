import React, { useEffect, useState } from "react";
import {
  getProduits,
  createProduit,
  updateProduit,
  deleteProduit,
  uploadImage
} from "../services/produits.service";
import "../styles/ecommerce.css";

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
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceFilter, setPriceFilter] = useState("all");

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
    // Afficher l'image existante avec l'URL complète du backend
    setPreviewImage(p.image ? `http://localhost:9103/PRODUITS${p.image}` : null);
    setFile(null);
    setShowModal(true);
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
    setShowModal(false);
  };

  // Open modal for adding product
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...produits];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter !== "all") {
      if (priceFilter === "low") {
        filtered = filtered.filter(p => p.prix < 100);
      } else if (priceFilter === "medium") {
        filtered = filtered.filter(p => p.prix >= 100 && p.prix <= 500);
      } else if (priceFilter === "high") {
        filtered = filtered.filter(p => p.prix > 500);
      }
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.prix - b.prix);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.prix - a.prix);
    } else if (sortBy === "name-asc") {
      filtered.sort((a, b) => a.titre.localeCompare(b.titre));
    } else if (sortBy === "name-desc") {
      filtered.sort((a, b) => b.titre.localeCompare(a.titre));
    }

    return filtered;
  };

  const filteredProduits = getFilteredProducts();

  if (loading) return (
    <div className="ecommerce-container">
      <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px' }}>
        <h2>Chargement des produits...</h2>
      </div>
    </div>
  );

  return (
    <>
      <div className="ecommerce-container">
        {/* Header */}
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1>Gestion des Produits</h1>
              <p>Gérez votre catalogue de produits</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={openAddModal}>
              + Nouveau Produit
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Produits</span>
            </div>
            <div className="stat-value">{produits.length}</div>
            <div className="stat-change">Produits en catalogue</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Prix Moyen</span>
            </div>
            <div className="stat-value">
              {produits.length > 0
                ? Math.round(produits.reduce((sum, p) => sum + p.prix, 0) / produits.length)
                : 0} DH
            </div>
            <div className="stat-change">Moyenne des prix</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Valeur Stock</span>
            </div>
            <div className="stat-value">
              {produits.reduce((sum, p) => sum + p.prix, 0)} DH
            </div>
            <div className="stat-change">Valeur totale</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Trier par:</label>
            <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Par défaut</option>
              <option value="name-asc">Nom (A-Z)</option>
              <option value="name-desc">Nom (Z-A)</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Prix:</label>
            <select className="form-select" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="all">Tous</option>
              <option value="low">&lt; 100 DH</option>
              <option value="medium">100 - 500 DH</option>
              <option value="high">&gt; 500 DH</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProduits.map((p) => (
            <div key={p.id} className="product-card">
              <img
                src={p.image ? `http://localhost:9103/PRODUITS${p.image}` : 'https://via.placeholder.com/300x220?text=No+Image'}
                alt={p.titre}
                className="product-image"
              />

              <div className="product-body">
                <h3 className="product-title">{p.titre}</h3>
                <p className="product-description">{p.description}</p>
                <div className="product-price">{p.prix} DH</div>

                <div className="product-actions">
                  <button
                    className="btn btn-warning btn-icon"
                    onClick={() => editProduit(p)}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => {
                      if (window.confirm(`Supprimer "${p.titre}" ?`)) {
                        deleteProd(p.id);
                      }
                    }}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProduits.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280', background: 'white', borderRadius: '8px' }}>
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos filtres ou ajoutez un nouveau produit</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="page-footer">
        <div className="footer-content">
          <div className="footer-brand">JOSKA</div>
          <p className="footer-text">Plateforme E-Commerce Professionnelle</p>
          <div className="footer-divider"></div>
          <p className="footer-text">Project made by Joska Power © 2025 - Tous droits réservés</p>
          <div className="footer-links">
            <a href="#" className="footer-link">À propos</a>
            <a href="#" className="footer-link">Contact</a>
            <a href="#" className="footer-link">Conditions</a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? "Modifier le produit" : "Nouveau produit"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="filter-label">Titre</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nom du produit"
                    value={titre}
                    onChange={e => setTitre(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="filter-label">Description</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Description du produit"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="filter-label">Prix (DH)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Prix"
                    value={prix}
                    onChange={e => setPrix(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="filter-label">Image</label>
                  <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {previewImage && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <img
                    src={previewImage}
                    alt="preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button className="btn btn-primary" onClick={submitProduit} style={{ flex: 1 }}>
                  {editingId ? "Mettre à jour" : "Ajouter"}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

