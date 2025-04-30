document.addEventListener('DOMContentLoaded', () => {
    console.log("signup.js loaded"); // Debug log to confirm the script is loaded

    const signupForm = document.getElementById('signupForm');
    if (!signupForm) {
        console.error("Form with ID 'signupForm' not found"); // Debug log if the form is not found
        return;
    }

    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission (page refresh)
        console.log("Form submission intercepted"); // Debug log to confirm the event listener is working

        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Debugging logs
        console.log("Form submitted with data:", { fullname, email, phone, password, confirmPassword });

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
            console.log("Server response:", result); // Debug log

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