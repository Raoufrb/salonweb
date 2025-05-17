// -------------------- AUTH BUTTON --------------------
document.addEventListener('DOMContentLoaded', () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const authButton = document.getElementById('auth-button');

  if (authButton) {
    if (isAuthenticated) {
      authButton.textContent = 'Profil';
      authButton.href = 'profile.html';
    } else {
      authButton.textContent = 'Connexion';
      authButton.href = 'login.html';
    }
  }
});

// -------------------- CTA / RDV Protection --------------------
const ctaBtn = document.getElementById('rdv-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Veuillez vous connecter pour prendre rendez-vous.");
      window.location.href = 'login.html';
    } else {
      window.location.href = 'rdv.html';
    }
  });
}

// -------------------- PRODUCTS (max 3) --------------------
async function fetchLimitedProducts(limit = 3) {
  try {
    const response = await fetch('/api/products');
    const allProducts = await response.json();
    const limitedProducts = allProducts.slice(0, limit);
    renderProducts(limitedProducts);
  } catch (err) {
    console.error('Erreur produits :', err);
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
      productGrid.innerHTML = '<p>Erreur de chargement des produits.</p>';
    }
  }
}

function createProductCard(product, index) {
  return `
    <div class="product-card" data-product-index="${index}">
      <div class="product-img-container">
        <img src="/uploads/products/${product.image}" alt="${product.name}" class="product-img">
      </div>
      <h3 class="product-title">${product.name}</h3>
      <div class="product-desc">${product.description}</div>
      <span class="show-more-btn">Voir plus</span>
      <div class="product-meta">
        <span class="product-price">${product.price} DA</span>
        <button class="add-to-cart">Ajouter au panier</button>
      </div>
    </div>
  `;
}

function renderProducts(products) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  productGrid.innerHTML = products.map((p, i) => createProductCard(p, i)).join('');
  attachCartButtons(products);
}

function attachCartButtons(products) {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const selectedProduct = products[index];
      addToCart(selectedProduct);
      btn.outerHTML = `<a href="panier.html" class="view-cart-btn">Voir le Panier</a>`;
      showCartPreview();
    });
  });
}

function addToCart(product) {
  const panier = JSON.parse(localStorage.getItem('panier')) || [];
  panier.push(product);
  localStorage.setItem('panier', JSON.stringify(panier));
}

function showCartPreview() {
  let preview = document.getElementById('cartPreview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'cartPreview';
    preview.innerHTML = `
      <div class="cart-float">
        <p>🛒 ${getPanier().length} produit(s) dans le panier</p>
        <a href="panier.html" class="btn-panier">Voir le Panier</a>
      </div>
    `;
    document.body.appendChild(preview);
  } else {
    preview.querySelector('p').textContent = `🛒 ${getPanier().length} produit(s) dans le panier`;
  }
}

function getPanier() {
  return JSON.parse(localStorage.getItem('panier')) || [];
}

// -------------------- SERVICES --------------------
async function loadServices() {
  const grid = document.querySelector('.service-grid');
  if (!grid) return;

  try {
    const res = await fetch('/api/services');
    const services = await res.json();

    grid.innerHTML = '';

    services.forEach(service => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.dataset.gender = service.gender;
      card.dataset.category = service.category;

      card.innerHTML = `
        <div class="service-img">
          <img src="/uploads/services/${service.image_url || 'default.jpg'}" alt="${service.name}">
        </div>
        <div class="service-info">
          <h3>${service.name}</h3>
          <p>${service.description}</p>
          <div class="service-meta">
            <span class="price">À partir de ${service.price} DA</span>
            <a href="rdv.html" class="book-btn">Réserver</a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Erreur chargement services:', err);
    grid.innerHTML = '<p>Erreur de chargement des services.</p>';
  }
}

// -------------------- FILTRAGE SERVICES --------------------
function setupServiceFilters() {
  const genderTabs = document.querySelectorAll('.gender-tab');
  const categoryBtns = document.querySelectorAll('.category-btn');

  genderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      genderTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterServices();
    });
  });

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterServices();
    });
  });
}

function getActiveGender() {
  const active = document.querySelector('.gender-tab.active');
  return active ? active.dataset.gender : 'all';
}

function getActiveCategory() {
  const active = document.querySelector('.category-btn.active');
  return active ? active.dataset.category : 'all';
}

function filterServices() {
  const gender = getActiveGender();
  const category = getActiveCategory();
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    const cardGender = card.dataset.gender;
    const cardCategory = card.dataset.category;

    const genderMatch = gender === 'all' || cardGender === gender || cardGender === 'all';
    const categoryMatch = category === 'all' || cardCategory === category;

    card.style.display = (genderMatch && categoryMatch) ? 'block' : 'none';
  });
}

// -------------------- INITIALISATION --------------------
document.addEventListener('DOMContentLoaded', () => {
  // Produits
  const productGrid = document.getElementById('productGrid');
  if (productGrid && productGrid.dataset.limit === '3') {
    fetchLimitedProducts(3);
  }

  // Services + filtres
  loadServices().then(setupServiceFilters);
});