document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuthStatus();
    
    // Logout button functionality
    document.getElementById('logout-btn').addEventListener('click', function() {
        logout();
    });
    
    // Load user data
    loadUserData();
});

function checkAuthStatus() {
    const authButton = document.getElementById('auth-button');
    const authLink = document.getElementById('auth-link');
    
    // Check if user is logged in (you'll need to implement this check)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        authLink.textContent = 'Profile';
        authLink.href = 'profile.html';
    } else {
        authLink.textContent = 'Login';
        authLink.href = 'login.html';
    }
}

function loadUserData() {
    // Load user data from localStorage or your backend
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        username: 'User',
        fullname: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
    };
    
    document.getElementById('username-display').textContent = userData.username;
    document.getElementById('user-fullname').textContent = userData.fullname;
    document.getElementById('user-email').textContent = userData.email;
    document.getElementById('user-phone').textContent = userData.phone;
}

function logout() {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    
    // Redirect to home page
    window.location.href = 'index.html';
}