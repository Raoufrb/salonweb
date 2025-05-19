document.addEventListener('DOMContentLoaded', () => {
    console.log("signup.js loaded"); // Confirm the script is loaded

    const signupForm = document.getElementById('signupForm');
    if (!signupForm) {
        console.error("Form with ID 'signupForm' not found");
        return;
    }

    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate passwords match
        if (password !== confirmPassword) {
            document.getElementById('err-confirm-password').style.display = 'block';
            return;
        } else {
            document.getElementById('err-confirm-password').style.display = 'none';
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, phone, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = "login.html"; // Redirect to login
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error('Erreur:', err);
            alert('Erreur serveur');
        }
    });
});