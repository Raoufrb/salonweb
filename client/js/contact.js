document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('contact-name').value,
    email: document.getElementById('contact-email').value,
    phone: document.getElementById('contact-phone').value,
    message: document.getElementById('contact-message').value
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ Message bien envoyé');
      document.getElementById('contactForm').reset();
    } else {
      alert('❌ Erreur serveur : ' + result.error);
    }
  } catch (error) {
    console.error('Erreur réseau 🛑', error);
    alert('Erreur réseau. Veuillez réessayer.');
  }
});
