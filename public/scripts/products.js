const CART_KEY = "geekstore_cart";
const WISHLIST_KEY = "geekstore_wishlist";

function readStorage(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function formatPrice(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getProductFromButton(button) {
    return {
        id: Number(button.dataset.id),
        nome: button.dataset.name,
        preco: Number(button.dataset.price),
        categoria: button.dataset.category || "",
        descricao: button.dataset.description || ""
    };
}

// Atualiza o número de itens no cabeçalho.
function updateCartCount() {
    const countElement = document.getElementById("cart-count");

    if (!countElement) return;

    const cart = readStorage(CART_KEY);
    const total = cart.reduce((sum, item) => sum + item.quantidade, 0);

    countElement.textContent = total;
}

// Adiciona um produto ao carrinho.
function addToCart(product) {
    if (!Number.isInteger(product.id) ||
        !Number.isFinite(product.preco) ||
        product.preco < 0) {
        return;
    }

    const cart = readStorage(CART_KEY);
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantidade += 1;
    } else {
        cart.push({
            ...product,
            quantidade: 1
        });
    }

    saveStorage(CART_KEY, cart);
    updateCartCount();
    renderCart();

    alert(`${product.nome} foi adicionado ao carrinho!`);
}

// Adiciona ou remove um produto dos favoritos.
function toggleWishlist(product) {
    const wishlist = readStorage(WISHLIST_KEY);
    const exists = wishlist.some(item => item.id === product.id);

    let updated;

    if (exists) {
        updated = wishlist.filter(item => item.id !== product.id);
    } else {
        updated = [...wishlist, product];
    }

    saveStorage(WISHLIST_KEY, updated);

    renderWishlist();
    updateFavoriteButtons();
}

// Atualiza a aparência dos botões de favoritos.
function updateFavoriteButtons() {
    const wishlist = readStorage(WISHLIST_KEY);

    document.querySelectorAll("[data-wishlist]").forEach(button => {
        const isFavorite = wishlist.some(
            item => item.id === Number(button.dataset.id)
        );

        button.classList.toggle("is-active", isFavorite);
        button.setAttribute("aria-pressed", String(isFavorite));
        button.textContent = isFavorite ? "♥" : "♡";
    });
}

// Monta a lista do carrinho.
function renderCart() {
    const container = document.getElementById("cart-items");

    if (!container) return;

    const cart = readStorage(CART_KEY);

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-symbol">▣</span>
                <h3>Seu carrinho está vazio</h3>
                <p>Explore a loja e adicione seus produtos favoritos.</p>
                <a href="/products" class="btn btn-primary">
                    Ir para a loja
                </a>
            </div>
        `;
    } else {
        container.innerHTML = cart.map(item => `
            <article class="cart-item">
                <div>
                    <h3>${escapeHTML(item.nome)}</h3>
                    <p>${escapeHTML(item.categoria)}</p>
                    <p>Unitário: ${formatPrice(item.preco)}</p>

                    <div class="cart-item-actions">
                        <button
                            type="button"
                            class="quantity-button"
                            data-cart-action="decrease"
                            data-id="${item.id}"
                            aria-label="Diminuir quantidade"
                        >−</button>

                        <span>${item.quantidade}</span>

                        <button
                            type="button"
                            class="quantity-button"
                            data-cart-action="increase"
                            data-id="${item.id}"
                            aria-label="Aumentar quantidade"
                        >+</button>

                        <button
                            type="button"
                            class="remove-button"
                            data-cart-action="remove"
                            data-id="${item.id}"
                        >Remover</button>
                    </div>
                </div>

                <div class="cart-item-price">
                    ${formatPrice(item.preco * item.quantidade)}
                </div>
            </article>
        `).join("");
    }

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantidade, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.preco * item.quantidade, 0
    );

    const itemsElement = document.getElementById("cart-total-items");
    const priceElement = document.getElementById("cart-total-price");

    if (itemsElement) itemsElement.textContent = totalItems;
    if (priceElement) priceElement.textContent = formatPrice(totalPrice);
}

// Monta a lista de desejos.
function renderWishlist() {
    const container = document.getElementById("wishlist-items");

    if (!container) return;

    const wishlist = readStorage(WISHLIST_KEY);

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-symbol">♡</span>
                <h3>Nenhum favorito por enquanto</h3>
                <p>Explore os produtos e salve os que você gostar.</p>
                <a href="/products" class="btn btn-primary">
                    Explorar loja
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <article class="product-card">
            <a class="product-image" href="/products/${item.id}">
                <img
                    src="https://placehold.co/600x420/191927/FFFFFF?text=${encodeURIComponent(item.nome)}"
                    alt="${escapeHTML(item.nome)}"
                    loading="lazy"
                >
            </a>

            <div class="product-info">
                <span class="product-category">
                    ${escapeHTML(item.categoria)}
                </span>

                <h3>
                    <a href="/products/${item.id}">
                        ${escapeHTML(item.nome)}
                    </a>
                </h3>

                <span class="product-price">
                    ${formatPrice(item.preco)}
                </span>

                <button
                    type="button"
                    class="btn btn-primary btn-full"
                    data-add-cart
                    data-id="${item.id}"
                    data-name="${escapeHTML(item.nome)}"
                    data-price="${item.preco}"
                    data-category="${escapeHTML(item.categoria)}"
                    data-description="${escapeHTML(item.descricao)}"
                >Adicionar ao carrinho</button>

                <button
                    type="button"
                    class="btn btn-outline btn-full"
                    data-wishlist
                    data-id="${item.id}"
                    data-name="${escapeHTML(item.nome)}"
                    data-price="${item.preco}"
                    data-category="${escapeHTML(item.categoria)}"
                    data-description="${escapeHTML(item.descricao)}"
                >Remover dos favoritos</button>
            </div>
        </article>
    `).join("");

    updateFavoriteButtons();
}

// Trata os cliques nos botões de produto.
document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-cart]");

    if (addButton) {
        addToCart(getProductFromButton(addButton));
        return;
    }

    const favoriteButton = event.target.closest("[data-wishlist]");

    if (favoriteButton) {
        toggleWishlist(getProductFromButton(favoriteButton));
        return;
    }

    const actionButton = event.target.closest("[data-cart-action]");

    if (actionButton) {
        const id = Number(actionButton.dataset.id);
        const action = actionButton.dataset.cartAction;

        let cart = readStorage(CART_KEY);
        const item = cart.find(product => product.id === id);

        if (!item) return;

        if (action === "increase") {
            item.quantidade += 1;
        } else if (action === "decrease") {
            item.quantidade -= 1;
        } else if (action === "remove") {
            cart = cart.filter(product => product.id !== id);
        }

        cart = cart.filter(product => product.quantidade > 0);

        saveStorage(CART_KEY, cart);
        renderCart();
        updateCartCount();
    }

    const scrollButton = event.target.closest("[data-scroll]");

    if (scrollButton) {
        const target = document.getElementById(
            scrollButton.dataset.target
        );

        if (target) {
            target.scrollBy({
                left: Number(scrollButton.dataset.scroll) * 280,
                behavior: "smooth"
            });
        }
    }
});

// O botão de finalizar é apenas demonstrativo.
document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById("checkout-button");

    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            const cart = readStorage(CART_KEY);

            if (cart.length === 0) {
                alert("Adicione pelo menos um produto ao carrinho.");
                return;
            }

            alert(
                "Esta é uma demonstração do frontend. " +
                "O checkout e o pagamento ainda não estão implementados."
            );
        });
    }

    updateCartCount();
    renderCart();
    renderWishlist();
    updateFavoriteButtons();
});