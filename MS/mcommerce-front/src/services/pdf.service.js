import { jsPDF } from 'jspdf';

// Fonction pour convertir une image en base64 (qualité maximale)
const getImageBase64 = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0);
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.95); // Qualité 95% au lieu de 80%
        resolve(dataURL);
      } catch (e) {
        resolve(null); // Si erreur CORS, on retourne null
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
};

export const generateCommandesPDF = async (commandes, produits) => {
  const doc = new jsPDF();

  // Configuration
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  
  // Header avec logo et titre (plus compact)
  doc.setFillColor(255, 107, 69); // Orange
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Logo JOSKA
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('JOSKA', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('E-Commerce Platform', pageWidth / 2, 20, { align: 'center' });

  // Titre du document
  doc.setTextColor(61, 48, 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REÇU DE COMMANDES', pageWidth / 2, 40, { align: 'center' });

  // Date de génération
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Généré le: ${today}`, pageWidth / 2, 48, { align: 'center' });

  // Ligne de séparation
  doc.setDrawColor(232, 217, 193);
  doc.setLineWidth(0.5);
  doc.line(margin, 52, pageWidth - margin, 52);

  // Calculer le total
  const totalMontant = commandes.reduce((sum, c) => sum + c.montant, 0);
  const totalQuantite = commandes.reduce((sum, c) => sum + c.quantite, 0);

  // Position de départ pour les cartes (plus compact)
  let currentY = 58;

  // Dessiner chaque commande comme une carte
  for (let i = 0; i < commandes.length; i++) {
    const commande = commandes[i];
    const produit = produits.find(p => p.id === commande.idProduit);

    // Vérifier si on a besoin d'une nouvelle page
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 15;
    }

    // Fond de la carte (hauteur réduite à 35mm)
    doc.setFillColor(253, 251, 247);
    doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 35, 2, 2, 'F');

    // Bordure de la carte
    doc.setDrawColor(232, 217, 193);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 35, 2, 2, 'S');

    // Numéro de commande (badge plus petit)
    doc.setFillColor(255, 107, 69);
    doc.circle(margin + 6, currentY + 6, 4.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}`, margin + 6, currentY + 8, { align: 'center' });

    // Charger et afficher l'image du produit (taille augmentée pour meilleure qualité)
    if (produit && produit.image) {
      try {
        const imageUrl = `http://localhost:9103/PRODUITS${produit.image}`;
        const imgData = await getImageBase64(imageUrl);

        if (imgData) {
          // Dessiner l'image (28x28mm pour meilleure qualité)
          doc.addImage(imgData, 'JPEG', margin + 15, currentY + 3.5, 28, 28);

          // Bordure autour de l'image
          doc.setDrawColor(232, 217, 193);
          doc.setLineWidth(0.3);
          doc.rect(margin + 15, currentY + 3.5, 28, 28);
        } else {
          // Placeholder si l'image ne charge pas
          doc.setFillColor(240, 230, 214);
          doc.rect(margin + 15, currentY + 3.5, 28, 28, 'F');
          doc.setTextColor(107, 93, 82);
          doc.setFontSize(7);
          doc.text('Image', margin + 29, currentY + 18, { align: 'center' });
        }
      } catch (e) {
        // Placeholder en cas d'erreur
        doc.setFillColor(240, 230, 214);
        doc.rect(margin + 15, currentY + 3.5, 28, 28, 'F');
      }
    } else {
      // Placeholder si pas d'image
      doc.setFillColor(240, 230, 214);
      doc.rect(margin + 15, currentY + 3.5, 28, 28, 'F');
      doc.setTextColor(107, 93, 82);
      doc.setFontSize(7);
      doc.text('Pas d\'image', margin + 29, currentY + 18, { align: 'center' });
    }

    // Informations du produit (plus compact)
    const infoX = margin + 48;

    // Titre du produit
    doc.setTextColor(61, 48, 40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const titre = produit ? produit.titre : 'Produit supprimé';
    doc.text(titre, infoX, currentY + 8);

    // Description (plus petite)
    if (commande.description) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(107, 93, 82);
      const maxWidth = pageWidth - infoX - 55;
      const descLines = doc.splitTextToSize(commande.description, maxWidth);
      doc.text(descLines[0], infoX, currentY + 14); // Seulement la première ligne
    }

    // Quantité et Prix sur la même ligne
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(61, 48, 40);
    doc.text(`Qté: `, infoX, currentY + 22);
    doc.setFont('helvetica', 'bold');
    doc.text(`${commande.quantite}`, infoX + 8, currentY + 22);

    // Prix unitaire
    doc.setFont('helvetica', 'normal');
    doc.text(`Prix unit: `, infoX, currentY + 28);
    doc.setFont('helvetica', 'bold');
    doc.text(`${produit ? produit.prix : 0} DH`, infoX + 18, currentY + 28);

    // Montant total (à droite, plus compact)
    doc.setFillColor(255, 107, 69);
    doc.roundedRect(pageWidth - margin - 38, currentY + 10, 33, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${commande.montant} DH`, pageWidth - margin - 21.5, currentY + 18, { align: 'center' });

    currentY += 38; // Espacement réduit entre les cartes (de 52 à 38)
  }

  // Résumé en bas (plus compact)
  let finalY = currentY + 3;

  if (finalY < pageHeight - 45) {
    doc.setFillColor(240, 230, 214);
    doc.roundedRect(margin, finalY, pageWidth - 2 * margin, 25, 2, 2, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(61, 48, 40);
    doc.text('RÉSUMÉ', margin + 5, finalY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Commandes: ${commandes.length}`, margin + 5, finalY + 15);
    doc.text(`Articles: ${totalQuantite}`, margin + 5, finalY + 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`TOTAL: ${totalMontant} DH`, pageWidth - margin - 5, finalY + 17, { align: 'right' });
  }

  // Footer (plus compact)
  const footerY = pageHeight - 15;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(107, 93, 82);
  doc.text('Project made by Joska Power © 2025 - Tous droits réservés', pageWidth / 2, footerY, { align: 'center' });
  doc.text('JOSKA E-Commerce Platform', pageWidth / 2, footerY + 4, { align: 'center' });
  
  // Sauvegarder le PDF
  const fileName = `JOSKA_Commandes_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

