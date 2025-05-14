document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Basic validation
        if (!email || !password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, mot_de_passe: password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || 'Erreur lors de la connexion.');
                return;
            }

            const data = await response.json();

            // Store token and role in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            // Redirect to profile page
            window.location.href = 'profile.html';
        } catch (err) {
            console.error('Erreur lors de la connexion:', err.message);
            alert('Erreur serveur.');
        }
    });
});


// Handle login button click
  document.getElementById('login-btn').addEventListener('click', () => {
    localStorage.setItem('isAuthenticated', 'true'); // Set user as authenticated
    window.location.href = 'index.html'; // Redirect to home page
  });
