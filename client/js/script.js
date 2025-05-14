
// Filter services by gender
const genderTabs = document.querySelectorAll('.gender-tab');
genderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        genderTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const gender = tab.dataset.gender;
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            if (gender === 'all' || card.dataset.gender === gender) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Filter services by category
const categoryBtns = document.querySelectorAll('.category-btn');
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Login button functionality
document.querySelector('.login-btn').addEventListener('click', () => {
    window.location.href = 'login.html';
});

// Book button functionality
document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Vous allez être redirigé vers notre système de réservation. Connectez-vous pour continuer.');
        window.location.href = 'login.html';
    });
});

// CTA button functionality
document.querySelector('.cta-btn').addEventListener('click', () => {
    alert('Découvrez nos disponibilités et réservez votre créneau en ligne.');
    window.location.href = 'login.html';
});

// Fetch all products from the API and render them
async function fetchAndRenderAllProducts() {
    try {
      const response = await fetch('/api/products'); // Fetch all products from the backend API
      const products = await response.json();
  
      const productGrid = document.getElementById('productGrid');
      productGrid.innerHTML = ''; // Clear any existing content
  
      // Loop through the products and create product cards
      products.forEach(product => {
        const productCard = `
          <div class="product-card">
            <div class="product-img">
              <img src="/uploads/products/${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <div class="product-meta">
                <span class="price">${product.price}€</span>
                <button class="shop-btn">Voir produit</button>
              </div>
            </div>
          </div>
        `;
        productGrid.innerHTML += productCard; // Append the product card to the grid
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des produits:', err.message);
    }
  }
  
  // Call the function to fetch and render all products
  fetchAndRenderAllProducts();

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
            <img src="${service.image_url || 'default-image.jpg'}" alt="${service.name}">
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