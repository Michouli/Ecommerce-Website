// =========================
// 1) Script for navigation bar
// =========================
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// =========================
// 2) Click cart icon on product card -> go to sproduct.html
//    (stores selected product)
// =========================
document.querySelectorAll(".cart").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const pro = icon.closest(".pro");
    if (!pro) return;

    const productData = {
      id: pro.dataset.id || pro.dataset.img,
      img: pro.dataset.img,
      name: pro.dataset.name,
      price: Number(pro.dataset.price),
    };

    localStorage.setItem("selectedProduct", JSON.stringify(productData));
    window.location.href = "sproduct.html";
  });
});

// =========================
// 3) Cart storage helpers
// =========================
function getCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];


  return cart.map((item) => {
    const id = item.id || item.img; 
    const size = item.size || "NA"; 
    const key = item.key || (id + "-" + size);

    return {
      ...item,
      id,
      size,
      key,
      price: Number(item.price),
      qty: Math.max(1, Number(item.qty || 1)),
    };
  });
}


function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatMoney(n) {
  return n.toFixed(2) + "$";
}

// =========================
// 4) sproduct.html: Add to Cart button (requires size)
// =========================
const addBtn = document.getElementById("addToCartBtn");

if (addBtn) {
  addBtn.addEventListener("click", () => {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!product) return;

    const size = document.getElementById("sizeSelect")?.value;
    if (!size) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const qtyInput = document.querySelector('#prodetails input[type="number"]');
    const qty = Math.max(1, Number(qtyInput?.value || 1));

    const key = product.id + "-" + size;

    const cart = getCart();
    const existing = cart.find((item) => item.key === key);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key,
        id: product.id,
        img: product.img,
        name: product.name,
        price: Number(product.price),
        size,
        qty,
      });
    }

    saveCart(cart);
    window.location.href = "cart.html";
  });
}

// =========================
// 5) cart.html: render cart table + remove + qty + totals
// =========================
function updateTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const subEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  if (subEl) subEl.textContent = formatMoney(subtotal);
  if (totalEl) totalEl.textContent = formatMoney(subtotal);
}

function renderCartPage() {
  const tbody = document.getElementById("cart-items");
  if (!tbody) return;

  const cart = getCart();
  tbody.innerHTML = "";

  cart.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <a href="#" class="remove-item" data-key="${item.key}">
          <i class="far fa-times-circle"></i>
        </a>
      </td>
      <td><img src="${item.img}" alt=""></td>
      <td>
        ${item.name}<br>
        <small>Size: ${item.size}</small>
      </td>
      <td>${formatMoney(item.price)}</td>
      <td>
        <input class="qty" type="number" min="1" value="${item.qty}" data-key="${item.key}">
      </td>
      <td>${formatMoney(item.price * item.qty)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Remove item
  tbody.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const key = btn.dataset.key;

      const newCart = getCart().filter((x) => x.key !== key);
      saveCart(newCart);
      renderCartPage();
    });
  });

  // Quantity change
  tbody.querySelectorAll(".qty").forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.key;
      const cart = getCart();
      const item = cart.find((x) => x.key === key);
      if (!item) return;

      item.qty = Math.max(1, Number(input.value || 1));
      saveCart(cart);
      renderCartPage();
    });
  });

  updateTotals();
}

renderCartPage();
