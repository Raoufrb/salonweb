// Vérification JWT (client/employé)
function handleSuccessfulLogin(userData) {
    // Store login state and user data
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Redirect to profile page
    window.location.href = 'profile.html';
}

// Update your login form submission to call handleSuccessfulLogin
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Your existing login logic...
    // On successful login:
    const userData = {
        username: document.getElementById('username').value,
        fullname: "Fetched from your backend", // Replace with actual data
        email: "Fetched from your backend",    // Replace with actual data
        phone: "Fetched from your backend"     // Replace with actual data
    };
    
    handleSuccessfulLogin(userData);
});