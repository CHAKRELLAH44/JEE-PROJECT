import React, { useEffect, useState } from "react";
import {
  getCommandes,
  createCommande,
  updateCommande,
  deleteCommande
} from "../services/commandes.service";

import { getProduits } from "../services/produits.service";
import { generateCommandesPDF } from "../services/pdf.service";
import "../styles/ecommerce.css";

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);

  const [quantite, setQuantite] = useState("");
  const [description, setDescription] = useState("");
  const [idProduit, setIdProduit] = useState("");
  const [montant, setMontant] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setQuantite("");
    setDescription("");
    setIdProduit("");
    setMontant(0);
    setShowModal(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleGeneratePDF = async () => {
    try {
      await generateCommandesPDF(commandes, produits);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const totalCommandes = commandes.reduce((sum, c) => sum + c.montant, 0);
  const totalArticles = commandes.reduce((sum, c) => sum + c.quantite, 0);

  return (
    <>
      <div className="ecommerce-container">
        {/* Header */}
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1>Gestion des Commandes</h1>
              <p>Gérez votre panier et vos commandes</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {commandes.length > 0 && (
                <button
                  className="btn-pdf"
                  onClick={handleGeneratePDF}
                  title="Télécharger le reçu PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Générer Reçu PDF
                </button>
              )}
              <button className="btn btn-success btn-lg" onClick={openAddModal}>
                + Passer une Commande
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Commandes</span>
            </div>
            <div className="stat-value">{commandes.length}</div>
            <div className="stat-change">Commandes passées</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Montant Total</span>
            </div>
            <div className="stat-value">{totalCommandes} DH</div>
            <div className="stat-change">Chiffre d'affaires</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Articles Vendus</span>
            </div>
            <div className="stat-value">{totalArticles}</div>
            <div className="stat-change">Total articles</div>
          </div>
        </div>



      {/* Cart Table */}
      {commandes.length > 0 ? (
        <table className="cart-table">
          <thead>
            <tr>
              <th>🖼️ Image</th>
              <th>📦 Produit</th>
              <th>📊 Quantité</th>
              <th>💵 Prix Unitaire</th>
              <th>💰 Montant</th>
              <th>📝 Description</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>

          <tbody>
            {commandes.map(c => {
              const prod = produits.find(p => p.id === c.idProduit);
              return (
                <tr key={c.id}>
                  <td>
                    {prod && prod.image ? (
                      <img
                        src={`http://localhost:9103/PRODUITS${prod.image}`}
                        alt={prod.titre}
                        className="cart-item-image"
                      />
                    ) : (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#e5e7eb',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        📦
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{prod ? prod.titre : "Produit supprimé"}</strong>
                  </td>
                  <td>
                    <span className="badge badge-success">x{c.quantite}</span>
                  </td>
                  <td>{prod ? prod.prix : 0} DH</td>
                  <td>
                    <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>
                      {c.montant} DH
                    </strong>
                  </td>
                  <td>{c.description || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-warning btn-icon"
                        onClick={() => edit(c)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-danger btn-icon"
                        onClick={() => {
                          if (window.confirm('Supprimer cette commande ?')) {
                            supprimer(c.id);
                          }
                        }}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr style={{ background: '#f3f4f6', fontWeight: 'bold' }}>
              <td colSpan="4" style={{ textAlign: 'right', padding: '15px' }}>
                💰 TOTAL GÉNÉRAL :
              </td>
              <td colSpan="3" style={{ fontSize: '1.3rem', color: '#10b981' }}>
                {totalCommandes} DH
              </td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', color: '#6b7280' }}>
          <h3>🛒 Votre panier est vide</h3>
          <p>Ajoutez votre première commande pour commencer !</p>
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
            <h2>{editingId ? "Modifier la commande" : "Nouvelle commande"}</h2>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
          </div>

          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="filter-label">Produit</label>
                <select
                  className="form-select"
                  value={idProduit}
                  onChange={e => setIdProduit(e.target.value)}
                >
                  <option value="">Choisir un produit</option>
                  {produits.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.titre} — {p.prix} DH
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="filter-label">Quantité</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Quantité"
                  value={quantite}
                  onChange={e => setQuantite(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="filter-label">Montant Total</label>
                <input
                  type="text"
                  className="form-input"
                  value={montant + " DH"}
                  readOnly
                  style={{ background: '#e0f2fe', fontWeight: 'bold', color: '#0369a1' }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="filter-label">Description (optionnel)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button className="btn btn-success" onClick={save} style={{ flex: 1 }}>
                {editingId ? "Mettre à jour" : "Ajouter au panier"}
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
