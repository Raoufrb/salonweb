document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !role) {
    alert('Vous devez être connecté pour accéder à cette page.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const endpoint = role === 'client' ? '/api/client/profile' : '/api/employe/profile';

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération du profil');

    const data = await response.json();
    const user = role === 'client' ? data.client : data.employe;

    document.getElementById('user-fullname').textContent = user.nom;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('username-display').textContent = user.nom;

    if (role === 'client') {
      document.getElementById('user-phone').textContent = user.tel;
    } else {
      document.getElementById('phone-container').style.display = 'none';
    }

    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';

    if (!data.rdvs || data.rdvs.length === 0) {
      appointmentsList.innerHTML = '<p>Aucun Rendez-vous</p>';
    } else {
      data.rdvs.forEach((rdv) => {
        const item = document.createElement('div');
        item.classList.add('appointment-item');
        item.innerHTML = `
          <p><strong>Service:</strong> ${rdv.service}</p>
          <p><strong>Date:</strong> ${rdv.date}</p>
          <p><strong>Heure:</strong> ${rdv.heure}</p>
          <p><strong>Prix:</strong> ${rdv.prix} DA</p>
          <p><strong>Statut:</strong> ${rdv.statut}</p>
        `;

        if (role === 'employe' && rdv.statut === 'en attente') {
          const actions = document.createElement('div');
          actions.className = 'appointment-actions';
          actions.innerHTML = `
            <button class="accept-btn" data-id="${rdv.id}">Valider</button>
            <button class="decline-btn" data-id="${rdv.id}">Refuser</button>
          `;
          item.appendChild(actions);
        }

        appointmentsList.appendChild(item);
      });

      if (role === 'employe') {
        document.querySelectorAll('.accept-btn').forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            await updateRdvStatus(id, 'validé');
          });
        });

        document.querySelectorAll('.decline-btn').forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            await updateRdvStatus(id, 'refusé');
          });
        });
      }
    }

    if (role === 'client') {
      const ordersSection = document.getElementById('orders-section');
      const ordersList = document.getElementById('orders-list');
      ordersSection.style.display = 'block';
      ordersList.innerHTML = '';
    
      if (!data.commandes || data.commandes.length === 0) {
        ordersList.innerHTML = '<p>Aucune commande.</p>';
      } else {
        data.commandes.forEach((commande) => {
          const div = document.createElement('div');
          div.className = 'order-item';
          div.innerHTML = `
            <p><strong>ID:</strong> ${commande.id}</p>
            <p><strong>Produits:</strong> ${commande.produits.join(', ')}</p>
            <p><strong>Total:</strong> ${commande.total} DA</p>
            <p><strong>Date:</strong> ${new Date(commande.created_at).toLocaleString()}</p>
            <p><strong>Statut:</strong> ${commande.status}</p>
          `;
          ordersList.appendChild(div);
        });
      }
    }
  } catch (err) {
    console.error(err.message);
    alert('Erreur lors de la récupération du profil.');
  }

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });

  document.getElementById('edit-profile-btn').addEventListener('click', async () => {
    const newName = prompt("Entrez votre nouveau nom :");

    if (!newName || newName.trim() === '') {
      alert("Le nom ne peut pas être vide.");
      return;
    }

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    try {
      const response = await fetch(`/api/${role}/change-name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom: newName.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Erreur lors de la mise à jour du nom.");
        return;
      }

      document.getElementById('user-fullname').textContent = newName.trim();
      document.getElementById('username-display').textContent = newName.trim();

      alert("✅ Nom mis à jour avec succès !");
    } catch (err) {
      console.error("❌ Erreur:", err.message);
      alert("Erreur serveur.");
    }
  });

  document.getElementById('change-password-btn').addEventListener('click', async () => {
    const oldPassword = prompt("Entrez votre ancien mot de passe :");
    if (!oldPassword || oldPassword.trim() === "") {
      alert("L'ancien mot de passe est requis.");
      return;
    }

    const newPassword = prompt("Entrez votre nouveau mot de passe :");
    if (!newPassword || newPassword.trim().length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Erreur lors du changement de mot de passe.');
      } else {
        alert('✅ Mot de passe mis à jour avec succès.');
      }
    } catch (err) {
      console.error('❌ Erreur:', err.message);
      alert('Erreur serveur.');
    }
  });
});

async function updateRdvStatus(rdvId, statut) {
const token = localStorage.getItem('token');
try {
  const response = await fetch(`/api/employe/rdvs/${rdvId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ statut }),
  });

  const result = await response.json();

  if (response.ok) {
    alert(`RDV ${statut === 'validé' ? 'validé' : 'refusé'} avec succès.`);
    location.reload();
  } else {
    alert(result.error || 'Erreur lors de la mise à jour du RDV.');
  }
} catch (err) {
  console.error('❌ Erreur réseau:', err.message);
  alert('Erreur serveur.');
}
}
