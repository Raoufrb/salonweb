// Créer une carte produit
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
        <button class="add-to-cart" data-index="${index}">Ajouter au panier</button>
      </div>
    </div>
  `;
}

// Récupérer les produits de l'API
async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    window.products = products;
    renderProducts(products);
  } catch (err) {
    document.getElementById('productGrid').innerHTML = '<p>Erreur de chargement des produits.</p>';
  }
}

// Afficher les produits dans la grille
function renderProducts(products) {
  const productGrid = document.getElementById('productGrid');
  productGrid.innerHTML = '';

  const limit = parseInt(productGrid.dataset.limit);
  const visibleProducts = isNaN(limit) ? products : products.slice(0, limit);

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = '<p>Aucun produit disponible.</p>';
    return;
  }

  const productCards = visibleProducts.map((p, i) => createProductCard(p, i)).join('');
  productGrid.innerHTML = productCards;

  attachCartButtons(visibleProducts);
}

// Ajouter les boutons "Ajouter au panier"
function attachCartButtons(products) {
  const buttons = document.querySelectorAll('.add-to-cart');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const selectedProduct = products[index];
      addToCart(selectedProduct.name, selectedProduct.price);

      btn.outerHTML = `<a href="panier.html" class="view-cart-btn">Voir le Panier</a>`;
      showCartPreview();
    });
  });
}

// Ajouter un produit au panier
function addToCart(name, price) {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  panier.push({ name, price });
  localStorage.setItem('panier', JSON.stringify(panier));
}

// Récupérer le panier
function getPanier() {
  return JSON.parse(localStorage.getItem('panier')) || [];
}

// Afficher l’aperçu flottant du panier
function showCartPreview() {
  const cartItems = getPanier();
  let preview = document.getElementById('cartPreview');

  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'cartPreview';
    preview.className = 'cart-float';
    preview.innerHTML = `
      <p class="cart-text">🛒 ${cartItems.length} produit(s) dans le panier</p>
      <a href="panier.html" class="btn-panier">Voir le Panier</a>
    `;
    document.body.appendChild(preview);
  } else {
    const textElement = preview.querySelector('.cart-text');
    if (textElement) {
      textElement.textContent = `🛒 ${cartItems.length} produit(s) dans le panier`;
    }
  }
}

// Gérer la recherche en direct
function handleSearch() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const filteredProducts = window.products.filter(product =>
    product.name.toLowerCase().includes(searchInput)
  );
  renderProducts(filteredProducts);
}

// Afficher/masquer la description complète
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".show-more-btn");
  if (!btn) return;

  const desc = btn.previousElementSibling;
  if (!desc) return;

  desc.classList.toggle("expanded");
  btn.textContent = desc.classList.contains("expanded") ? "Voir moins" : "Voir plus";
});

// Lancer la recherche
document.getElementById('searchInput').addEventListener('input', handleSearch);

// Récupérer les produits au chargement
fetchProducts();