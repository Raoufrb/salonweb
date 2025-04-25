
// Product Data
const products = [
    {
        id: 1,
        name: "Shampooing Réparateur Kératine",
        category: "hair",
        price: 24.99,
        image: "",
        description: "Formule professionnelle pour cheveux abîmés avec kératine végétale",
        badge: "Best-seller",
        popular: true
    },
    {
        id: 2,
        name: "Masque Hydratant Intense",
        category: "hair",
        price: 29.99,
        image: "",
        description: "Nutrition profonde avec huile d'argan et beurre de karité",
        popular: true
    },
    {
        id: 3,
        name: "Huile de Barbe Premium",
        category: "beard",
        price: 19.99,
        image: "",
        description: "Adoucit et conditionne avec senteur boisée de santal",
        badge: "Nouveau"
    },
    {
        id: 4,
        name: "Sérum Éclat Vitaminé",
        category: "skin",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Vitamine C pure pour un teint radieux et unifié",
        popular: true
    },
    {
        id: 5,
        name: "Gommage Corps Douceur",
        category: "body",
        price: 22.99,
        image: "",
        description: "Exfoliant aux cristaux de sucre et huile de coco",
        badge: "Bio"
    },
    {
        id: 6,
        name: "Spray Texturisant Volume",
        category: "hair",
        price: 18.99,
        image: "",
        description: "Volume immédiat sans effet croustillant"
    },
    {
        id: 7,
        name: "Crème Visage Hydratante",
        category: "skin",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        description: "Hydratation 24h avec acide hyaluronique",
        popular: true
    },
    {
        id: 8,
        name: "Huile Sèche Relaxante",
        category: "body",
        price: 27.99,
        image: "",
        description: "Texture légère avec lavande et camomille",
        badge: "Détente"
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const cartCountEl = document.querySelector('.cart-count');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const filterButtons = document.querySelectorAll('.filter-btn');

// Render Products
function renderProducts(productsToRender) {
    productGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-popular="${product.popular || false}">
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">${product.price.toFixed(2)}€</span>
                    <button class="add-to-cart">
                        <i class="fas fa-plus"></i> Ajouter
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

// Add to Cart
function addToCart(e) {
    const productId = parseInt(e.target.closest('.product-card').dataset.id);
    const product = products.find(p => p.id === productId);
    
    // Check if already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Visual feedback
    const button = e.target.closest('button');
    button.innerHTML = '<i class="fas fa-check"></i> Ajouté';
    button.style.backgroundColor = 'var(--gold)';
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-plus"></i> Ajouter';
        button.style.backgroundColor = 'var(--primary)';
    }, 1000);
}

// Update Cart
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart UI
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="empty-cart">
                <p>Votre panier est vide</p>
                <a href="products.html" class="view-all-btn">Parcourir la boutique</a>
            </div>
        `;
    } else {
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">${item.price.toFixed(2)}€</span>
                    <div class="cart-item-qty">
                        <button class="qty-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus">+</button>
                    </div>
                </div>
                <button class="cart-item-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `${total.toFixed(2)}€`;
    
    // Update cart count
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = itemCount;
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

// Cart Quantity Functions
function decreaseQuantity(e) {
    const productId = parseInt(e.target.closest('.cart-item').dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.closest('.cart-item').dataset.id);
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

function removeItem(e) {
    const productId = parseInt(e.target.closest('.cart-item').dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Filter Products
function filterProducts() {
    const activeCategory = document.querySelector('.filter-btn[data-category].active')?.dataset.category || 'all';
    const activePrice = document.querySelector('.filter-btn[data-price].active')?.dataset.price || 'all';
    const activeSort = document.querySelector('.filter-btn[data-sort].active')?.dataset.sort || 'price-asc';
    
    let filteredProducts = [...products];
    
    // Category filter
    if (activeCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
    }
    
    // Price filter
    if (activePrice === '0-30') {
        filteredProducts = filteredProducts.filter(p => p.price < 30);
    } else if (activePrice === '30-50') {
        filteredProducts = filteredProducts.filter(p => p.price >= 30 && p.price <= 50);
    } else if (activePrice === '50+') {
        filteredProducts = filteredProducts.filter(p => p.price > 50);
    }
    
    // Sort products
    if (activeSort === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (activeSort === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (activeSort === 'popular') {
        filteredProducts.sort((a, b) => (b.popular || false) - (a.popular || false));
    }
    
    renderProducts(filteredProducts);
}

// Event Listeners
filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Get filter group
        const filterGroup = this.closest('.filter-options');
        
        // Remove active class from siblings
        filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Filter products
        filterProducts();
    });
});

cartToggle.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Initialize
renderProducts(products);
updateCart();
filterProducts();