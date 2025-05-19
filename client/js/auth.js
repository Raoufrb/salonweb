document.addEventListener('DOMContentLoaded', () => {
  // Handle authentication button
  const authButton = document.getElementById('auth-button');
  const token = localStorage.getItem('token');

  if (authButton) {
    if (token) {
      authButton.textContent = 'Profil';
      authButton.href = 'profile.html';
    } else {
      authButton.textContent = 'Connexion';
      authButton.href = 'login.html';
    }
  }

  // Handle RDV button
  const rdvBtn = document.getElementById('rdv-btn');
  if (rdvBtn) {
    rdvBtn.addEventListener('click', () => {
      const token = localStorage.getItem('token');

      if (token) {
        // User is logged in → redirect to RDV page
        window.location.href = 'rdv.html';
      } else {
        // User is not logged in → show alert and redirect to login
        alert('Veuillez vous connecter pour prendre un rendez-vous.');
        window.location.href = 'login.html';
      }
    });
  }
});