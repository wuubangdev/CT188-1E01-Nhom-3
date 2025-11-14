// app.js
document.addEventListener('DOMContentLoaded', () => {
    const CART_KEY = 'phonestore_cart';
    const AUTH_KEY = 'phonestore_auth';

    const VALID_USERNAME = 'user';
    const VALID_PASSWORD = '123456';

    let cart = [];
    let authUser = null;

    // DOM refs
    const cartCountEl = document.getElementById('cart-count');
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const cartCloseBtn = document.getElementById('cart-close');
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmptyEl = document.getElementById('cart-empty');
    const cartSummaryEl = document.querySelector('.cart-summary');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    const loginModal = document.getElementById('login-modal');
    const loginOpenBtn = document.getElementById('login-open');
    const loginCloseBtn = document.getElementById('login-close');
    const loginForm = document.getElementById('login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');

    const userGreetingEl = document.getElementById('user-greeting');
    const userNameEl = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    // ===== STATE LOAD / SAVE =====
    function loadState() {
        try {
            cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        } catch {
            cart = [];
        }

        try {
            authUser = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
        } catch {
            authUser = null;
        }
    }

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function saveAuth() {
        if (authUser) {
            localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
        } else {
            localStorage.removeItem(AUTH_KEY);
        }
    }

    // ===== UI UPDATE =====
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }

    function renderAuth() {
        if (!userGreetingEl || !userNameEl || !loginOpenBtn || !logoutBtn) return;

        if (authUser) {
            userGreetingEl.classList.remove('hidden');
            logoutBtn.classList.remove('hidden');
            loginOpenBtn.classList.add('hidden');
            userNameEl.textContent = authUser.username;
        } else {
            userGreetingEl.classList.add('hidden');
            logoutBtn.classList.add('hidden');
            loginOpenBtn.classList.remove('hidden');
            userNameEl.textContent = '';
        }
    }

    function renderCartModal() {
        if (!cartItemsEl || !cartEmptyEl || !cartSummaryEl || !cartTotalEl) return;

        if (cart.length === 0) {
            cartItemsEl.innerHTML = '';
            cartEmptyEl.style.display = 'block';
            cartSummaryEl.style.display = 'none';
            cartTotalEl.textContent = '0₫';
            return;
        }

        cartEmptyEl.style.display = 'none';
        cartSummaryEl.style.display = 'flex';

        let total = 0;
        const html = cart.map(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-main">
                        <span class="cart-item-title">${item.name}</span>
                        <span class="cart-item-meta">
                            SL: ${item.qty} × ${item.price.toLocaleString('vi-VN')}₫
                        </span>
                    </div>
                    <div>
                        <div class="cart-item-price">
                            ${subtotal.toLocaleString('vi-VN')}₫
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            Xóa
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        cartItemsEl.innerHTML = html;
        cartTotalEl.textContent = total.toLocaleString('vi-VN') + '₫';
    }

    // ===== MODAL HELPERS =====
    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove('hidden');
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.add('hidden');
    }

    // ===== CART LOGIC =====
    function addToCartFromButton(button) {
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseInt(button.dataset.price, 10);

        if (!id || !name || isNaN(price)) return;

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price, qty: 1 });
        }

        saveCart();
        updateCartCount();
    }

    // Remove item (event delegation)
    if (cartItemsEl) {
        cartItemsEl.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('cart-item-remove')) {
                const id = target.dataset.id;
                cart = cart.filter(item => item.id !== id);
                saveCart();
                updateCartCount();
                renderCartModal();
            }
        });
    }

    // ===== LOGIN LOGIC =====
    function handleLoginSubmit(e) {
        e.preventDefault();
        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value;

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            authUser = { username };
            saveAuth();
            renderAuth();
            closeModal(loginModal);
            loginForm.reset();
        } else {
            alert('Sai tên đăng nhập hoặc mật khẩu (demo: user / 123456).');
        }
    }

    function handleLogout() {
        authUser = null;
        saveAuth();
        renderAuth();
    }

    // ===== EVENT BINDINGS =====
    // Add to cart buttons
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            addToCartFromButton(btn);
        });
    });

    // Cart open/close
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            renderCartModal();
            openModal(cartModal);
        });
    }

    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', () => {
            closeModal(cartModal);
        });
    }

    // Close modal when click backdrop
    [cartModal, loginModal].forEach(modalEl => {
        if (!modalEl) return;
        modalEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                closeModal(modalEl);
            }
        });
    });

    // Login open/close
    if (loginOpenBtn) {
        loginOpenBtn.addEventListener('click', () => {
            openModal(loginModal);
            loginUsernameInput.focus();
        });
    }

    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', () => {
            closeModal(loginModal);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Checkout demo
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Giỏ hàng đang trống.');
                return;
            }
            alert('Đây chỉ là màn hình demo thanh toán (chưa kết nối backend).');
        });
    }

    // ===== INIT =====
    loadState();
    updateCartCount();
    renderAuth();
});
