document.addEventListener('DOMContentLoaded', () => {
  // Elements du DOM
  const rdvForm = document.getElementById('rdvForm');
  const serviceSelect = document.getElementById('service');
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const notesTextarea = document.getElementById('notes');
  const authBtn = document.getElementById('rdv-auth-btn');

  // Récapitulatif
  const summaryService = document.getElementById('summary-service');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  const summaryTotal = document.getElementById('summary-total');

  // Variables globales
  let selectedPrice = 0;
  let selectedServiceName = '';

  // Authentification utilisateur
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userName = localStorage.getItem('userName') || 'Client';
  const userTel = localStorage.getItem('userTel') || '0000000000';

  // Définir la date min
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  // Peupler la liste déroulante des services
  async function populateServices() {
    try {
      const res = await fetch('/api/services');
      const services = await res.json();

      serviceSelect.innerHTML = `<option value="">Sélectionnez un service</option>`;
      services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.name;
        option.dataset.price = service.price;
        option.textContent = `${service.name} (${service.price} DA)`;
        serviceSelect.appendChild(option);
      });
    } catch (err) {
      console.error('❌ Erreur chargement services:', err);
      serviceSelect.innerHTML = `<option value="">Erreur de chargement</option>`;
    }
  }

  // Mettre à jour le résumé
  function updateSummary() {
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    selectedPrice = selectedOption?.dataset.price || 0;
    selectedServiceName = selectedOption?.value || '-';

    summaryService.textContent = selectedServiceName;
    summaryDate.textContent = dateInput.value || '-';
    summaryTime.textContent = timeSelect.value || '-';
    summaryTotal.textContent = `${selectedPrice} DA`;
  }

  // Soumettre le formulaire
  rdvForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour prendre rendez-vous.');
      return window.location.href = 'login.html';
    }

    if (!serviceSelect.value || !dateInput.value || !timeSelect.value) {
      return alert('Veuillez remplir tous les champs.');
    }

    const rdvData = {
      nom: userName,
      tel: userTel,
      service: selectedServiceName,
      date: dateInput.value,
      heure: timeSelect.value,
      statut: 'en attente',
      prix: selectedPrice
    };

    try {
      const res = await fetch('/api/rdvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rdvData)
      });

      const result = await res.json();

      if (res.ok) {
        alert('✅ Rendez-vous confirmé !');
        rdvForm.reset();
        updateSummary();
      } else {
        alert('❌ ' + (result.error || 'Erreur lors de l\'enregistrement'));
      }
    } catch (err) {
      console.error('❌ Erreur réseau:', err.message);
      alert('❌ Une erreur est survenue.');
    }
  });

  // Mise à jour du résumé à chaque changement
  serviceSelect.addEventListener('change', updateSummary);
  dateInput.addEventListener('change', updateSummary);
  timeSelect.addEventListener('change', updateSummary);

  // Redirection bouton auth
  if (authBtn) {
    authBtn.textContent = isAuthenticated ? 'Profil' : 'Connexion';
    authBtn.onclick = () => {
      window.location.href = isAuthenticated ? 'profile.html' : 'login.html';
    };
  }

  // Lancement initial
  populateServices();
  updateSummary();
});