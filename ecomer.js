const products = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 59.99,
    category: "Electronics",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2RLlJBjRXJ3oSf2faRAm7i0YDJ3PNPoRYjA&s",
    description: "High quality wireless headphones with noise cancellation and long battery life."
  },
  {
    id: 2,
    title: "Smartwatch",
    price: 99,
    category: "Electronics",
    image: "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1709052793/305114_0_ckgqk5.png?tr=w-600",
    description: "Stay connected and track your fitness with this stylish smartwatch."
  },
  {
    id: 3,
    title: "DSLR Camera",
    price: 499,
    category: "Photography",
    image: "https://futureforward.in/images/thumbs/008/0080012_nikon-d5300-dslr-camera-18-140mm-vr-kit-black_600.jpeg",
    description: "Capture stunning photos with this professional DSLR camera."
  },
  {
    id: 4,
    title: "Gaming Mouse",
    price: 299,
    category: "Gaming",
    image: "https://www.mytrendyphone.eu/images/6D-4-Speed-DPI-RGB-Gaming-Mouse-G5-Black-05042021-01-p.webp",
    description: "Ergonomic gaming mouse with customizable buttons and RGB lighting."
  },
  {
    id: 5,
    title: "Bluetooth Speaker",
    price: 395,
    category: "Electronics",
    image: "https://m.media-amazon.com/images/I/71x4QMTf7EL._AC_UF1000,1000_QL80_.jpg",
    description: "Portable Bluetooth speaker with powerful sound and waterproof design."
  },
  {
    id: 6,
    title: "Tripod Stand",
    price: 245,
    category: "Photography",
    image: "https://5.imimg.com/data5/FI/GZ/OJ/SELLER-71933611/amazonbasics-50-inch-lightweight-tripod-stand.jpg",
    description: "Lightweight tripod stand for steady shots and video recording."
  },
  {
    id: 7,
    title: "Mechanical Keyboard",
    price: 795,
    category: "Gaming",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81C65R8qml4DW-oRfMh409HLU0ZFR4B28dA&s",
    description: "Durable mechanical keyboard with tactile feedback and customizable keys."
  },
  {
    id: 8,
    title: "Action Camera",
    price: 11995,
    category: "Photography",
    image: "https://m.media-amazon.com/images/I/61Mv3GvgvhL.jpg",
    description: "Compact action camera for capturing adventures in 4K."
  },
  {
    id: 9,
    title: "AirPods",
    price: 500.2,
    category: "electronics",
    image: "https://i2-prod.manchestereveningnews.co.uk/article31549421.ece/ALTERNATES/s615/0_Amazon-Earbuds-Alt.jpg",
    description: "These earphones feature noise cancelling and a 40 hour battery life."
  }
];

const productsContainer = document.getElementById("products");
const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsList = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-button");

const productModal = document.getElementById("product-modal");
const closeProductModalBtn = document.getElementById("close-product-modal");
const modalProductImage = document.getElementById("modal-product-image");
const modalProductTitle = document.getElementById("product-modal-title");
const modalProductDescription = document.getElementById("modal-product-description");
const modalProductPrice = document.getElementById("modal-product-price");
const modalQuantityInput = document.getElementById("modal-quantity-input");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");

const searchInput = document.getElementById("search-input");
const categorySelect = document.getElementById("category-select");
const sortSelect = document.getElementById("sort-select");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const notification = document.getElementById("notification");

let cart = {};

let filteredProducts = [...products];

let currentModalProduct = null;

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch {
      cart = {};
    }
  }
}

function showNotification(message, duration = 3000) {
  notification.textContent = message;
  notification.classList.remove("hidden");
  setTimeout(() => {
    notification.classList.add("hidden");
  }, duration);
}

function updateCartCount() {
  const count = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = count;
}

function renderCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function filterAndSortProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;
  const sortOption = sortSelect.value;

  filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  switch (sortOption) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "name-desc":
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      filteredProducts.sort((a, b) => a.id - b.id);
  }

  renderProducts();
}

function renderProducts() {
  productsContainer.innerHTML = "";

  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View details for ${product.title}`);

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="product-title">${product.title}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Add ${product.title} to cart">Add to Cart</button>
    `;

    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-to-cart-btn")) {
        openProductModal(product.id);
      }
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProductModal(product.id);
      }
    });

    productsContainer.appendChild(card);
  });
}

function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentModalProduct = product;

  modalProductImage.src = product.image;
  modalProductImage.alt = product.title;
  modalProductTitle.textContent = product.title;
  modalProductDescription.textContent = product.description;
  modalProductPrice.textContent = `$${product.price.toFixed(2)}`;
  modalQuantityInput.value = 1;

  productModal.classList.remove("hidden");
  modalQuantityInput.focus();
}

function closeProductModal() {
  productModal.classList.add("hidden");
  currentModalProduct = null;
}

function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === parseInt(productId));
  if (!product) return;

  quantity = parseInt(quantity);
  if (quantity < 1) quantity = 1;

  if (cart[productId]) {
    cart[productId].quantity += quantity;
  } else {
    cart[productId] = {
      product,
      quantity,
    };
  }

  saveCart();
  updateCartCount();
  showNotification(`${product.title} added to cart.`);
}

function renderCart() {
  cartItemsList.innerHTML = "";

  const cartEntries = Object.values(cart);
  if (cartEntries.length === 0) {
    cartItemsList.innerHTML = "<li>Your cart is empty.</li>";
    cartTotal.textContent = "0.00";
    return;
  }

  let total = 0;

  cartEntries.forEach(({ product, quantity }) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${product.title}</div>
        <div class="cart-item-quantity">
          <label for="qty-${product.id}">Qty:</label>
          <input type="number" min="1" id="qty-${product.id}" value="${quantity}" aria-label="Quantity for ${product.title}" />
        </div>
      </div>
      <div>
        <span>$${(product.price * quantity).toFixed(2)}</span>
        <button class="remove-item-btn" data-id="${product.id}" aria-label="Remove ${product.title} from cart">&times;</button>
      </div>
    `;

    cartItemsList.appendChild(li);
    total += product.price * quantity;
  });

  cartTotal.textContent = total.toFixed(2);

  cartItemsList.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("change", (e) => {
      const id = e.target.id.split("-")[1];
      let val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) val = 1;
      e.target.value = val;
      cart[id].quantity = val;
      saveCart();
      renderCart();
      updateCartCount();
    });
  });

  cartItemsList.querySelectorAll(".remove-item-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      delete cart[id];
      saveCart();
      renderCart();
      updateCartCount();
      showNotification("Item removed from cart.");
    });
  });
}

function showCart() {
  renderCart();
  cartModal.classList.remove("hidden");
}

function hideCart() {
  cartModal.classList.add("hidden");
}

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Thank you for your purchase! Your order has been placed.");
  cart = {};
  saveCart();
  updateCartCount();
  hideCart();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  darkModeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}

function loadDarkMode() {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️";
  } else {
    darkModeToggle.textContent = "🌙";
  }
}

function init() {
  loadCart();
  updateCartCount();
  renderCategories();
  filterAndSortProducts();
  loadDarkMode();

  searchInput.addEventListener("input", filterAndSortProducts);
  categorySelect.addEventListener("change", filterAndSortProducts);
  sortSelect.addEventListener("change", filterAndSortProducts);

  productsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const id = e.target.dataset.id;
      addToCart(id);
    }
  });

  cartButton.addEventListener("click", showCart);
  closeCartBtn.addEventListener("click", hideCart);

  checkoutBtn.addEventListener("click", checkout);

  closeProductModalBtn.addEventListener("click", closeProductModal);

  modalAddToCartBtn.addEventListener("click", () => {
    if (!currentModalProduct) return;
    const qty = parseInt(modalQuantityInput.value);
    addToCart(currentModalProduct.id, qty);
    closeProductModal();
  });

  darkModeToggle.addEventListener("click", toggleDarkMode);

  window.addEventListener("click", (e) => {
    if (e.target === productModal) {
      closeProductModal();
    }
    if (e.target === cartModal) {
      hideCart();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!productModal.classList.contains("hidden")) closeProductModal();
      if (!cartModal.classList.contains("hidden")) hideCart();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
