document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) {
    console.error("Form with ID 'contactForm' not found");
    return;
  }

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      phone: document.getElementById('contact-phone').value.trim(),
      message: document.getElementById('contact-message').value.trim(),
    };

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      alert('❌ Les champs Nom, Email et Message sont obligatoires.');
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ Message bien envoyé');
        contactForm.reset();
      } else {
        alert('❌ Erreur serveur : ' + result.error);
      }
    } catch (error) {
      console.error('Erreur réseau 🛑', error);
      alert('Erreur réseau. Veuillez réessayer.');
    }
  });
});