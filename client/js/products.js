// Function to create a product card
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

// Fetch products from the API and render them
async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();

    console.log("✅ Produits récupérés :", products); // 👈 Vérifie ici

    window.products = products;

    renderProducts(products);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des produits :', err);
    document.getElementById('productGrid').innerHTML = '<p>Erreur de chargement des produits.</p>';
  }
}

// Render products in the product grid
function renderProducts(products) {
  const productGrid = document.getElementById('productGrid');
  productGrid.innerHTML = '';

  // Lire la limite depuis l’attribut data-limit
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
// Attach "Ajouter au Panier" buttons to products
function attachCartButtons(products) {
  const buttons = document.querySelectorAll('.add-to-cart');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const selectedProduct = products[index]; // Get the product using the index
      addToCart(selectedProduct.name, selectedProduct.price); // Pass name and price to addToCart

      // Replace button with link
      btn.outerHTML = `<a href="panier.html" class="view-cart-btn">Voir le Panier</a>`;

      // Show cart preview
      showCartPreview();
    });
  });
}

// Add a product to the cart
function addToCart(name, price) {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  panier.push({ name, price });
  localStorage.setItem('panier', JSON.stringify(panier));
  alert(`${name} a été ajouté au panier.`);
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

  // Toggle Show More / Show Less for descriptions
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("show-more-btn")) {
      const desc = e.target.previousElementSibling;
      desc.classList.toggle("expanded");
      e.target.textContent = desc.classList.contains("expanded") ? "Voir moins" : "Voir plus";
    }
  });
