import {
    getCommandesFiltréesAvecNoms,
    updateCommandeStatus
  } from '../models/commande.model.js';
  
  export async function showCommandes(req, res) {
    const { status = 'toutes', client = '', date = '' } = req.query;
    try {
      const commandes = await getCommandesFiltréesAvecNoms({ status, client, date });
      res.render('admin/commandes.ejs', {
        commandes,
        filters: { status, client, date }
      }); // 👈 C’est ici que le moteur EJS cherche le fichier commandes.ejs
    } catch (err) {
      console.error('❌ Erreur showCommandes :', err);
      res.status(500).send('Erreur serveur');
    }
  }
  
  export async function validerCommande(req, res) {
    try {
      const id = req.params.id;
      await updateCommandeStatus(id, 'acceptée');
      res.status(200).json({ message: 'Commande acceptée ✅' });
    } catch (err) {
      console.error('❌ Erreur validerCommande :', err);
      res.status(500).json({ error: 'Erreur validation' });
    }
  }
  
  
  
  export async function refuserCommande(req, res) {
    try {
      await updateCommandeStatus(req.params.id, 'refusée');
      res.json({ message: 'Commande refusée ❌' });
    } catch (err) {
      console.error('❌ Erreur refuserCommande :', err);
      res.status(500).json({ error: 'Erreur refus commande' });
    }
  }
  
  
  