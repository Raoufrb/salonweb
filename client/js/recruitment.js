document.addEventListener('DOMContentLoaded', () => {
    console.log("recruitment.js loaded"); // Debug log to confirm the script is loaded

    const recruitmentForm = document.getElementById('recruitmentForm');

    if (!recruitmentForm) {
        console.error("Recruitment form not found!");
        return;
    }

    recruitmentForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log("Form submission intercepted"); // Debug log to confirm the event listener is working

        const formData = new FormData(recruitmentForm);

        try {
            const response = await fetch('/api/recruitment', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            console.log("Server response:", result);

            if (response.ok) {
                alert(result.message);
                recruitmentForm.reset(); // Reset the form
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error('Erreur:', err);
            alert('Erreur serveur');
        }
    });
});