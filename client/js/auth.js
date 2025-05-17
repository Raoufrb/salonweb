document.addEventListener('DOMContentLoaded', () => {
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
});

document.addEventListener('DOMContentLoaded', () => {
  const rdvBtn = document.getElementById('rdv-btn');

  rdvBtn.addEventListener('click', () => {
    const token = localStorage.getItem('token');

    if (token) {
      // Utilisateur connecté → redirection vers rdv
      window.location.href = 'rdv.html';
    } else {
      // Non connecté → affiche alerte + redirige vers login
      alert('Veuillez vous connecter pour prendre un rendez-vous.');
      window.location.href = 'login.html';
    }
  });
});