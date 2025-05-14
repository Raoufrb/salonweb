document.addEventListener('DOMContentLoaded', () => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  // Get the auth button element
  const authButton = document.getElementById('auth-button');

  if (authButton) {
    if (isAuthenticated) {
      // If authenticated, show "Profile" button with a person icon
      authButton.innerHTML = '<i class="fas fa-user"></i> Profil';
      authButton.href = 'profile.html';
    } else {
      // If not authenticated, show "Connexion" button
      authButton.innerHTML = 'Connexion';
      authButton.href = 'login.html';
    }
  }
});