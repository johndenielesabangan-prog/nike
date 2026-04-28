// Define Product Data
const products = [
  {
    id: 1,
    name: "Aura Pro X1",
    category: "running",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    colors: ["#e50914", "#000000"]
  },
  {
    id: 2,
    name: "Aura Stealth Runner",
    category: "running",
    price: 180.00,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
    colors: ["#000000", "#ffffff"]
  },
  {
    id: 3,
    name: "Aura Hoop Elite",
    category: "basketball",
     price: 200.00,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop",
    colors: ["#333333", "#ffffff"]
  },
  {
    id: 4,
    name: "Aura Baseline",
    category: "casual",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop",
    colors: ["#ffffff", "#e50914"]
  },
  {
    id: 5,
    name: "Aura Flex Trainer",
    category: "training",
    price: 140.00,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
    colors: ["#000000", "#888888"]
  },
  {
    id: 6,
    name: "Aura Retro High",
    category: "casual",
    price: 160.00,
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&h=600&fit=crop",
    colors: ["#000099", "#ffffff"]
  },
  {
    id: 7,
    name: "Aura Velocity",
    category: "running",
    price: 190.00,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop",
    colors: ["#ff00ff", "#000000"]
  },
  {
    id: 8,
    name: "Aura Court Master",
    category: "basketball",
    price: 220.00,
    image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&h=600&fit=crop",
    colors: ["#ffffff", "#000000", "#e50914"]
  }
];

// Initialize Cart
let cart = JSON.parse(localStorage.getItem('auraCart')) || [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCartUI();
  
  // Specific page initializations
  if (document.getElementById('shop-product-grid')) {
    initShopPage();
  }
  
  if (document.getElementById('featured-products-grid')) {
    initHomePage();
  }

  if (document.getElementById('contact-form')) {
    initContactForm();
  }

  updateCartCount();
});

// --- NAVIGATION & UI ---
function initNavigation() {
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

// --- CART FUNCTIONALITY ---
function initCartUI() {
  const cartIcon = document.getElementById('cart-icon');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCartBtn = document.getElementById('close-cart');
  const cartOverlay = document.getElementById('cart-overlay');

  if (cartIcon && cartSidebar && cartOverlay && closeCartBtn) {
    cartIcon.addEventListener('click', () => {
      cartSidebar.classList.add('open');
      cartOverlay.classList.add('show');
      renderCartItems();
    });

    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
  }
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('show');
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    
    // Optional: open cart when added
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('show');
    renderCartItems();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCartItems();
}

function saveCart() {
  localStorage.setItem('auraCart', JSON.stringify(cart));
}

function updateCartCount() {
  const cartCountEl = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.forEach(el => {
    el.textContent = totalItems;
  });
}

function renderCartItems() {
  const cartContainer = document.getElementById('cart-items-container');
  const cartTotalEl = document.getElementById('cart-total-price');
  
  if (!cartContainer || !cartTotalEl) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalEl.textContent = '$0.00';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
          <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  });

  cartContainer.innerHTML = html;
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

// --- RENDER PRODUCT CARDS ---
function createProductCardHTML(product) {
  const colorDots = product.colors.map(color => `<div class="color-dot" style="background-color: ${color}"></div>`).join('');
  
  return `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="color-options">${colorDots}</div>
        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `;
}

// --- HOME PAGE SPECIFIC ---
function initHomePage() {
  const grid = document.getElementById('featured-products-grid');
  // Just show first 4 items as featured
  const featured = products.slice(0, 4);
  grid.innerHTML = featured.map(p => createProductCardHTML(p)).join('');
}

// --- SHOP PAGE SPECIFIC ---
function initShopPage() {
  const grid = document.getElementById('shop-product-grid');
  const catFilter = document.getElementById('category-filter');
  const sortFilter = document.getElementById('sort-filter');

  function renderShop(items) {
    grid.innerHTML = items.map(p => createProductCardHTML(p)).join('');
  }

  function handleFilterSort() {
    let filtered = [...products];
    const cat = catFilter.value;
    const sort = sortFilter.value;

    // Filter
    if (cat !== 'all') {
      filtered = filtered.filter(p => p.category === cat);
    }

    // Sort
    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } // 'newest' default order

    renderShop(filtered);
  }

  if (catFilter && sortFilter) {
    catFilter.addEventListener('change', handleFilterSort);
    sortFilter.addEventListener('change', handleFilterSort);
  }

  // Initial render
  renderShop(products);
}

// --- CONTACT PAGE SPECIFIC ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  const messageEl = document.getElementById('form-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
      messageEl.textContent = 'Please fill out all fields.';
      messageEl.className = 'form-message error';
      return;
    }

    // Simulate sending
    messageEl.textContent = 'Thank you for your message! Our team will get back to you shortly.';
    messageEl.className = 'form-message success';
    form.reset();

    setTimeout(() => {
      messageEl.style.display = 'none';
      messageEl.className = 'form-message';
    }, 5000);
  });
}
