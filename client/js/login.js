// public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
  
    // 👁 Afficher/Masquer mot de passe
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (!email || !password) {
        alert('Veuillez remplir tous les champs.');
        return;
      }
  
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, mot_de_passe: password })
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          alert(data.error || 'Erreur lors de la connexion.');
          return;
        }
  
        // Stocke le token et le rôle
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('isAuthenticated', 'true');
  
        // Stocke les infos utilisateur
        if (data.role === 'client') {
          localStorage.setItem('userName', data.client.nom);
          localStorage.setItem('userTel', data.client.tel);
        } else if (data.role === 'employe') {
          localStorage.setItem('userName', data.employe.nom);
        }
  
        // Redirige vers profil
        window.location.href = 'profile.html';
      } catch (err) {
        alert('Erreur serveur.');
        console.error(err);
      }
    });
  });