document.addEventListener('DOMContentLoaded', async () => {
  const serviceGrid = document.querySelector('.service-grid');

  if (!serviceGrid) {
    console.error("Element with class 'service-grid' not found");
    return;
  }

  try {
    // Fetch services from the backend
    const response = await fetch('/services');
    const services = await response.json();

    // Render each service as a card
    services.forEach(service => {
      const serviceCard = document.createElement('div');
      serviceCard.classList.add('service-card');
      serviceCard.setAttribute('data-gender', service.gender);
      serviceCard.setAttribute('data-category', service.category);

      serviceCard.innerHTML = `
        <div class="service-img">
          <img src="/uploads/${service.image_url || 'default-image.jpg'}" alt="${service.name}">
        </div>
        <div class="service-info">
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <div class="service-meta">
            <span class="price">À partir de ${service.price}€</span>
            <a href="rdv.html" class="book-btn">Réserver</a>
          </div>
        </div>
      `;

      serviceGrid.appendChild(serviceCard);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des services:', err);
  }
});