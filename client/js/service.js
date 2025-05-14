document.addEventListener('DOMContentLoaded', async () => {
    const serviceGrid = document.querySelector('.service-grid');
  
    try {
      const response = await fetch('/services'); // Fetch services from the backend
      const services = await response.json();
  
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