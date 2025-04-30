// Function to create a product card
function createProductCard(product, index) {
  return `
    <div class="product-card" data-product-index="${index}">
      <img src="/uploads/products/${product.image}" alt="${product.name}" class="product-img">
      <h3 class="product-title">${product.name}</h3>
      <p class="price">${product.price} DA</p>
      <div class="product-description">${product.description}</div>
      <button class="add-to-cart" data-index="${index}">Ajouter au Panier</button>
    </div>
  `;
}
// Fetch products from the API and render them
async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();

    // Store products globally for search functionality
    window.products = products;

    renderProducts(products); // Render all products initially
  } catch (err) {
    console.error('Erreur lors de la récupération des produits :', err);
    document.getElementById('productGrid').innerHTML = '<p>Erreur de chargement des produits.</p>';
  }
}

// Render products in the product grid
function renderProducts(products) {
  const productGrid = document.getElementById('productGrid');
  productGrid.innerHTML = '';

  if (products.length === 0) {
    productGrid.innerHTML = '<p>Aucun produit disponible.</p>';
    return;
  }

  const productCards = products.map((p, i) => createProductCard(p, i)).join('');
  productGrid.innerHTML = productCards;

  attachCartButtons(products); // Attach cart functionality to buttons
}

// Attach "Ajouter au Panier" buttons to products
function attachCartButtons(products) {
  const buttons = document.querySelectorAll('.add-to-cart');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      const selectedProduct = products[index];
      addToCart(selectedProduct);

      // Replace button with link
      btn.outerHTML = `<a href="panier.html" class="view-cart-btn">Voir le Panier</a>`;

      // Show cart preview
      showCartPreview();
    });
  });
}

// Add a product to the cart
function addToCart(product) {
  const panier = JSON.parse(localStorage.getItem('panier')) || [];
  panier.push(product);
  localStorage.setItem('panier', JSON.stringify(panier));
}

// Show the floating cart preview
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

// Get the cart from localStorage
function getPanier() {
  return JSON.parse(localStorage.getItem('panier')) || [];
}

// Handle search functionality
function handleSearch() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const filteredProducts = window.products.filter(product =>
    product.name.toLowerCase().includes(searchInput)
  );
  renderProducts(filteredProducts); // Re-render the product grid with filtered products
}

// Add event listener for the search input
document.getElementById('searchInput').addEventListener('input', handleSearch);

// Initial fetch of products
fetchProducts();