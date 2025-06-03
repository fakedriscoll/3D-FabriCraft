// Import the functions you need from the SDKs you need
import { auth } from './firebase-config.js'; // Import auth from config
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Dados dos produtos (simulação de banco de dados)
const products = [
    {
        id: 1,
        name: "Vaso Geométrico Moderno",
        category: "decoracao",
        price: 89.90,
        description: "Vaso decorativo com design geométrico moderno, perfeito para plantas pequenas ou suculentas. Impresso em PLA de alta qualidade com acabamento texturizado.",
        images: ["images/vaso-geometrico-1.jpg", "images/vaso-geometrico-2.jpg", "images/vaso-geometrico-3.jpg"],
        featured: true
    },
    {
        id: 2,
        name: "Organizador de Mesa",
        category: "utilidades",
        price: 45.50,
        description: "Organizador de mesa para canetas, clipes e pequenos objetos. Design funcional com compartimentos de diferentes tamanhos.",
        images: ["images/organizador-1.jpg", "images/organizador-2.jpg"],
        featured: true
    },
    {
        id: 3,
        name: "Miniatura de Dragão",
        category: "jogos",
        price: 120.00,
        description: "Miniatura detalhada de dragão para colecionadores e jogadores de RPG. Impresso com alta resolução e pintado à mão.",
        images: ["images/dragao-1.jpg", "images/dragao-2.jpg", "images/dragao-3.jpg"],
        featured: true
    },
    {
        id: 4,
        name: "Porta-Retrato Personalizado",
        category: "personalizados",
        price: 65.00,
        description: "Porta-retrato personalizado com o nome ou frase de sua escolha. Disponível em várias cores e tamanhos.",
        images: ["images/porta-retrato-1.jpg", "images/porta-retrato-2.jpg"],
        featured: false
    },
    {
        id: 5,
        name: "Suporte para Celular",
        category: "utilidades",
        price: 35.90,
        description: "Suporte ergonômico para celular, ideal para assistir vídeos ou fazer chamadas. Design estável e compacto.",
        images: ["images/suporte-celular-1.jpg", "images/suporte-celular-2.jpg"],
        featured: false
    },
    {
        id: 6,
        name: "Luminária LED Personalizada",
        category: "decoracao",
        price: 1.00,
        description: "Luminária LED com design personalizado. Iluminação suave e aconchegante para qualquer ambiente.",
        images: ["images/luminaria-1.jpg", "images/luminaria-2.jpg", "images/luminaria-3.jpg"],
        featured: true
    },
    {
        id: 7,
        name: "Miniaturas para Jogos de Tabuleiro",
        category: "jogos",
        price: 75.00,
        description: "Conjunto de miniaturas para jogos de tabuleiro. Peças detalhadas que elevam a experiência de jogo.",
        images: ["images/miniaturas-1.jpg", "images/miniaturas-2.jpg"],
        featured: false
    },
    {
        id: 8,
        name: "Chaveiro Personalizado",
        category: "personalizados",
        price: 25.00,
        description: "Chaveiro personalizado com nome, iniciais ou logotipo. Presente ideal para ocasiões especiais.",
        images: ["images/chaveiro-1.jpg", "images/chaveiro-2.jpg"],
        featured: false
    },
    {
        id: 9,
        name: "Escultura Abstrata",
        category: "decoracao",
        price: 199.90,
        description: "Escultura abstrata moderna para decoração de ambientes. Peça única com design exclusivo.",
        images: ["images/escultura-1.jpg", "images/escultura-2.jpg", "images/escultura-3.jpg"],
        featured: true
    },
    {
        id: 10,
        name: "Organizador de Cabos",
        category: "utilidades",
        price: 29.90,
        description: "Organizador de cabos para manter sua mesa arrumada. Solução prática para gerenciamento de fios.",
        images: ["images/organizador-cabos-1.jpg", "images/organizador-cabos-2.jpg"],
        featured: false
    },
    {
        id: 11,
        name: "Dados de RPG Personalizados",
        category: "jogos",
        price: 55.00,
        description: "Conjunto de dados de RPG personalizados com números em alto relevo. Disponível em várias cores.",
        images: ["images/dados-1.jpg", "images/dados-2.jpg"],
        featured: false
    },
    {
        id: 12,
        name: "Placa Decorativa com Nome",
        category: "personalizados",
        price: 45.00,
        description: "Placa decorativa personalizada com nome ou frase. Ideal para decoração de quartos ou escritórios.",
        images: ["images/placa-1.jpg", "images/placa-2.jpg"],
        featured: false
    }
];

// Elementos DOM
const categoryTabs = document.getElementById('category-tabs');
const productsContainer = document.getElementById('products-container');
const featuredProductsContainer = document.getElementById('featured-products-container');
const currentCategoryTitle = document.getElementById('current-category-title');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');
const productModal = document.getElementById('product-modal');
const registerModal = document.getElementById('register-modal');
const cartModal = document.getElementById('cart-modal'); // Novo modal do carrinho
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerLink = document.getElementById('register-link');
const loginLinkFromRegister = document.getElementById('login-link-from-register');
const whatsappLink = document.getElementById('whatsapp-link');
const modalProductImage = document.getElementById('modal-product-image');
const modalProductName = document.getElementById('modal-product-name');
const modalProductPrice = document.getElementById('modal-product-price');
const modalProductDescription = document.getElementById('modal-product-description');
const thumbnailContainer = document.getElementById('thumbnail-container');
const quantityInput = document.getElementById('product-quantity');
const quantityBtns = document.querySelectorAll('.quantity-btn');
const addToCartBtn = document.querySelector('.add-to-cart-btn');
let whatsappOrderBtn = document.querySelector('.whatsapp-order-btn'); // Use let for reassignment
const userActionsContainer = document.querySelector('.user-actions'); // Container for login/logout buttons

// Elementos do Carrinho
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyCartMessage = document.getElementById('empty-cart-message');
const continueShopping = document.querySelector('.continue-shopping-btn');

// Elementos de Avaliação
const productRatingsList = document.getElementById('product-ratings-list');
const noRatingsMessage = document.getElementById('no-ratings-message');
const starRating = document.querySelector('.star-rating');
const stars = document.querySelectorAll('.star');
const ratingText = document.querySelector('.rating-text');
const ratingComment = document.getElementById('rating-comment');
const submitRatingBtn = document.getElementById('submit-rating-btn');

// Carrinho de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Avaliações de produtos
let productRatings = JSON.parse(localStorage.getItem('productRatings')) || {};

// Variáveis para controle de avaliação
let currentRating = 0;
let currentProductId = null;

// Função para salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para salvar avaliações no localStorage
function saveRatings() {
    localStorage.setItem('productRatings', JSON.stringify(productRatings));
}

// Função para formatar preço
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

// Função para formatar data
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para criar card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    // Calcular avaliação média se existir
    let ratingHtml = '';
    if (productRatings[product.id] && productRatings[product.id].length > 0) {
        const avgRating = calculateAverageRating(product.id);
        ratingHtml = `<div class="product-card-rating">
            ${getStarIcons(avgRating)}
            <span class="rating-count">(${productRatings[product.id].length})</span>
        </div>`;
    }

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.images[0]}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-category">${getCategoryName(product.category)}</div>
            <div class="product-price">${formatPrice(product.price)}</div>
            ${ratingHtml}
            <div class="product-actions">
                <button class="btn btn-primary view-details-btn">Ver Detalhes</button>
            </div>
        </div>
    `;

    card.querySelector('.view-details-btn').addEventListener('click', () => {
        openProductModal(product);
    });

    return card;
}

// Função para obter nome da categoria
function getCategoryName(categoryId) {
    const categories = {
        'decoracao': 'Decoração',
        'utilidades': 'Utilidades',
        'jogos': 'Jogos e Hobbies',
        'personalizados': 'Personalizados'
    };
    return categories[categoryId] || 'Categoria Desconhecida';
}

// Função para exibir produtos por categoria
function displayProductsByCategory(category) {
    productsContainer.innerHTML = '';
    let filteredProducts;
    if (category === 'todos') {
        filteredProducts = products;
        currentCategoryTitle.textContent = 'Todos os Produtos';
    } else {
        filteredProducts = products.filter(product => product.category === category);
        currentCategoryTitle.textContent = getCategoryName(category);
    }
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Nenhum produto encontrado nesta categoria.</p>';
        return;
    }
    filteredProducts.forEach(product => {
        productsContainer.appendChild(createProductCard(product));
    });
}

// Função para exibir produtos em destaque
function displayFeaturedProducts() {
    featuredProductsContainer.innerHTML = '';
    const featured = products.filter(product => product.featured);
    featured.forEach(product => {
        featuredProductsContainer.appendChild(createProductCard(product));
    });
}

// Função para pesquisar produtos
function searchProducts(query) {
    productsContainer.innerHTML = '';
    currentCategoryTitle.textContent = `Resultados para: "${query}"`;
    document.querySelectorAll('#category-tabs li').forEach(tab => tab.classList.remove('active'));
    const results = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        getCategoryName(p.category).toLowerCase().includes(query.toLowerCase())
    );
    if (results.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Nenhum produto encontrado para sua pesquisa.</p>';
        return;
    }
    results.forEach(product => {
        productsContainer.appendChild(createProductCard(product));
    });
}

// Função para abrir modal de produto
function openProductModal(product) {
    modalProductName.textContent = product.name;
    modalProductName.dataset.id = product.id;
    modalProductPrice.textContent = formatPrice(product.price);
    modalProductDescription.textContent = product.description;
    modalProductImage.src = product.images[0];
    quantityInput.value = 1;
    currentProductId = product.id;

    // Resetar avaliação
    resetRatingForm();
    
    // Carregar avaliações existentes
    loadProductRatings(product.id);

    thumbnailContainer.innerHTML = '';
    product.images.forEach((image, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail' + (index === 0 ? ' active' : '');
        thumb.innerHTML = `<img src="${image}" alt="${product.name} - Imagem ${index + 1}">`;
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            modalProductImage.src = image;
        });
        thumbnailContainer.appendChild(thumb);
    });

    const newWhatsappBtn = whatsappOrderBtn.cloneNode(true);
    whatsappOrderBtn.parentNode.replaceChild(newWhatsappBtn, whatsappOrderBtn);
    whatsappOrderBtn = newWhatsappBtn;
    whatsappOrderBtn.addEventListener('click', () => {
        const quantity = quantityInput.value;
        const message = `Olá! Estou interessado no produto "${product.name}" (ID: ${product.id}). Gostaria de encomendar ${quantity} unidade(s).`;
        window.open(`https://wa.me/5511945037976?text=${encodeURIComponent(message)}`, '_blank');
    });

    productModal.style.display = 'block';
}

// --- Funções de Avaliação ---

// Função para resetar o formulário de avaliação
function resetRatingForm() {
    currentRating = 0;
    stars.forEach(star => {
        star.innerHTML = '<i class="far fa-star"></i>';
    });
    ratingText.textContent = 'Selecione uma avaliação';
    ratingComment.value = '';
    submitRatingBtn.disabled = true;
}

// Função para carregar avaliações de um produto
function loadProductRatings(productId) {
    const ratingsContainer = document.getElementById('product-ratings-list');
    ratingsContainer.innerHTML = '';
    
    if (!productRatings[productId] || productRatings[productId].length === 0) {
        ratingsContainer.appendChild(noRatingsMessage);
        return;
    }
    
    // Ocultar mensagem de "sem avaliações"
    noRatingsMessage.style.display = 'none';
    
    // Ordenar avaliações da mais recente para a mais antiga
    const sortedRatings = [...productRatings[productId]].sort((a, b) => b.date - a.date);
    
    sortedRatings.forEach(rating => {
        const ratingItem = document.createElement('div');
        ratingItem.className = 'rating-item';
        
        ratingItem.innerHTML = `
            <div class="rating-header">
                <div>
                    <span class="rating-user">${rating.user || 'Usuário anônimo'}</span>
                    <span class="rating-stars">${getStarIcons(rating.rating)}</span>
                </div>
                <span class="rating-date">${formatDate(rating.date)}</span>
            </div>
            <div class="rating-comment">${rating.comment || 'Sem comentário.'}</div>
        `;
        
        ratingsContainer.appendChild(ratingItem);
    });
}

// Função para obter ícones de estrelas baseado na avaliação
function getStarIcons(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>'; // Estrela cheia
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>'; // Meia estrela
        } else {
            stars += '<i class="far fa-star"></i>'; // Estrela vazia
        }
    }
    return stars;
}

// Função para calcular a média de avaliações de um produto
function calculateAverageRating(productId) {
    if (!productRatings[productId] || productRatings[productId].length === 0) {
        return 0;
    }
    
    const sum = productRatings[productId].reduce((total, rating) => total + rating.rating, 0);
    return sum / productRatings[productId].length;
}

// Função para adicionar uma nova avaliação
function addRating(productId, rating, comment) {
    if (!productRatings[productId]) {
        productRatings[productId] = [];
    }
    
    // Obter informações do usuário atual
    let userName = 'Usuário anônimo';
    if (auth.currentUser) {
        userName = auth.currentUser.email.split('@')[0];
    }
    
    const newRating = {
        user: userName,
        rating: rating,
        comment: comment,
        date: Date.now()
    };
    
    productRatings[productId].push(newRating);
    saveRatings();
    
    // Recarregar avaliações
    loadProductRatings(productId);
    
    // Resetar formulário
    resetRatingForm();
    
    // Mostrar notificação
    showNotification('Sua avaliação foi enviada com sucesso!', 'success');
}

// --- Funções do Carrinho ---

// Função para adicionar produto ao carrinho
function addToCart(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            name: product.name,
            price: product.price,
            image: product.images[0]
        });
    }
    
    updateCartCount();
    saveCart();
    showNotification(`${quantity} unidade(s) de "${product.name}" adicionado(s) ao carrinho!`, 'success');
}

// Função para remover produto do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartCount();
    updateCartDisplay();
    saveCart();
    showNotification("Produto removido do carrinho.", 'info');
}

// Função para atualizar quantidade de um produto no carrinho
function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartCount();
            updateCartDisplay();
            saveCart();
        }
    }
}

// Função para limpar o carrinho
function clearCart() {
    cart = [];
    updateCartCount();
    updateCartDisplay();
    saveCart();
    showNotification("Carrinho esvaziado com sucesso.", 'info');
}

// Função para calcular o total do carrinho
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Função para atualizar o contador do carrinho
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Função para criar um item do carrinho
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.productId;
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-quantity">
                <button class="quantity-btn cart-minus">-</button>
                <input type="number" value="${item.quantity}" min="1" class="cart-quantity-input">
                <button class="quantity-btn cart-plus">+</button>
            </div>
            <div class="cart-item-subtotal">
                <span>Subtotal: ${formatPrice(item.price * item.quantity)}</span>
            </div>
        </div>
        <button class="cart-item-remove"><i class="fas fa-trash"></i></button>
    `;
    
    // Adicionar eventos aos botões de quantidade
    const minusBtn = cartItem.querySelector('.cart-minus');
    const plusBtn = cartItem.querySelector('.cart-plus');
    const quantityInput = cartItem.querySelector('.cart-quantity-input');
    const removeBtn = cartItem.querySelector('.cart-item-remove');
    
    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            updateCartItemQuantity(item.productId, currentValue - 1);
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        updateCartItemQuantity(item.productId, currentValue + 1);
    });
    
    quantityInput.addEventListener('change', () => {
        const newValue = parseInt(quantityInput.value);
        if (newValue >= 1) {
            updateCartItemQuantity(item.productId, newValue);
        } else {
            quantityInput.value = 1;
            updateCartItemQuantity(item.productId, 1);
        }
    });
    
    removeBtn.addEventListener('click', () => {
        removeFromCart(item.productId);
    });
    
    return cartItem;
}

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartTotalPrice.textContent = formatPrice(0);
        clearCartBtn.style.display = 'none';
        checkoutBtn.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';
    clearCartBtn.style.display = 'inline-block';
    checkoutBtn.style.display = 'inline-block';
    
    cart.forEach(item => {
        cartItemsContainer.appendChild(createCartItemElement(item));
    });
    
    cartTotalPrice.textContent = formatPrice(calculateCartTotal());
}

// Função para abrir o modal do carrinho
function openCartModal() {
    updateCartDisplay();
    cartModal.style.display = 'block';
}

// --- Event Listeners Base ---
categoryTabs.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        document.querySelectorAll('#category-tabs li').forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        displayProductsByCategory(e.target.dataset.category);
    }
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) searchProducts(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) searchProducts(query);
    }
});

// --- Autenticação e Modais ---

// Função para feedback visual nos botões
function setButtonLoading(button, isLoading, originalText) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...'; // Adiciona ícone de loading
    } else {
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

// Função para atualizar UI após login/logout
function updateUIAfterLogin(user) {
    userActionsContainer.innerHTML = ''; // Limpa botões existentes

    if (user) {
        // Usuário logado: Mostrar nome e botão de Sair
        const welcomeMessage = document.createElement('span');
        welcomeMessage.className = 'user-welcome';
        welcomeMessage.innerHTML = `<i class="fas fa-user"></i> Olá, ${user.email.split('@')[0]}!`;

        const logoutButton = document.createElement('button');
        logoutButton.id = 'logout-button';
        logoutButton.className = 'btn btn-secondary'; // Estilo diferente para logout
        logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
        logoutButton.addEventListener('click', () => {
            signOut(auth).then(() => {
                showNotification('Você saiu da sua conta.', 'info');
                // A UI será atualizada pelo onAuthStateChanged
            }).catch((error) => {
                console.error("Erro ao sair:", error);
                showNotification('Erro ao tentar sair.', 'error');
            });
        });

        const cartBtn = document.createElement('button');
        cartBtn.id = 'cart-button';
        cartBtn.className = 'btn';
        cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> <span id="cart-count">0</span>';
        cartBtn.addEventListener('click', openCartModal);

        userActionsContainer.appendChild(welcomeMessage);
        userActionsContainer.appendChild(cartBtn);
        userActionsContainer.appendChild(logoutButton);

        // Atualizar contagem do carrinho
        updateCartCount();

    } else {
        // Usuário deslogado: Mostrar botão Entrar e Carrinho
        const loginBtn = document.createElement('button');
        loginBtn.id = 'login-button';
        loginBtn.className = 'btn';
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Entrar';
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
            registerModal.style.display = 'none';
        });

        const cartBtn = document.createElement('button');
        cartBtn.id = 'cart-button';
        cartBtn.className = 'btn';
        cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> <span id="cart-count">0</span>';
        cartBtn.addEventListener('click', openCartModal);

        userActionsContainer.appendChild(loginBtn);
        userActionsContainer.appendChild(cartBtn);
        
        // Atualizar contagem do carrinho
        updateCartCount();
    }
}

// Observador do estado de autenticação
onAuthStateChanged(auth, (user) => {
    updateUIAfterLogin(user);
});

// Abrir Modal de Cadastro a partir do Modal de Login
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

// Voltar para Modal de Login a partir do Modal de Cadastro
loginLinkFromRegister.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
});

// Fechar Modais
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        productModal.style.display = 'none';
        registerModal.style.display = 'none';
        cartModal.style.display = 'none';
    });
});

// Fechar Modais ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === productModal) productModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
    if (e.target === cartModal) cartModal.style.display = 'none';
});

// Evento para formulário de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    setButtonLoading(submitButton, true);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showNotification(`Bem-vindo de volta, ${user.email}!`, 'success');
            loginModal.style.display = 'none';
            // UI será atualizada pelo onAuthStateChanged
        })
        .catch((error) => {
            console.error("Erro de login:", error);
            let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
            // **Mensagem específica para usuário não encontrado**
            if (error.code === 'auth/user-not-found') {
                errorMessage = "Não encontramos o seu cadastro. Por favor, cadastre-se.";
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = "E-mail ou senha inválidos.";
            }
            showNotification(errorMessage, 'error');
        })
        .finally(() => {
            setButtonLoading(submitButton, false, originalButtonText);
        });
});

// Evento para formulário de cadastro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
    }
    if (password.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }

    setButtonLoading(submitButton, true);

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showNotification(`Conta criada com sucesso para ${user.email}!`, 'success');
            registerModal.style.display = 'none';
            // UI será atualizada pelo onAuthStateChanged
        })
        .catch((error) => {
            console.error("Erro de cadastro:", error);
            let errorMessage = "Erro ao criar conta.";
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = "Este e-mail já está cadastrado.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Formato de e-mail inválido.";
            } else if (error.code === 'auth/weak-password') {
                errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
            }
            showNotification(errorMessage, 'error');
        })
        .finally(() => {
            setButtonLoading(submitButton, false, originalButtonText);
        });
});

// --- Eventos de Avaliação ---

// Evento para selecionar estrelas
stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating);
        
        // Atualizar visual das estrelas
        stars.forEach(s => {
            const starRating = parseInt(s.dataset.rating);
            if (starRating <= rating) {
                s.innerHTML = '<i class="fas fa-star"></i>'; // Estrela cheia
            } else {
                s.innerHTML = '<i class="far fa-star"></i>'; // Estrela vazia
            }
        });
        
        // Atualizar texto
        updateRatingText(rating);
    });
    
    star.addEventListener('mouseleave', () => {
        // Restaurar visual baseado na avaliação atual
        stars.forEach(s => {
            const starRating = parseInt(s.dataset.rating);
            if (starRating <= currentRating) {
                s.innerHTML = '<i class="fas fa-star"></i>'; // Estrela cheia
            } else {
                s.innerHTML = '<i class="far fa-star"></i>'; // Estrela vazia
            }
        });
        
        // Restaurar texto
        updateRatingText(currentRating);
    });
    
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        
        // Atualizar visual das estrelas
        stars.forEach(s => {
            const starRating = parseInt(s.dataset.rating);
            if (starRating <= currentRating) {
                s.innerHTML = '<i class="fas fa-star"></i>'; // Estrela cheia
            } else {
                s.innerHTML = '<i class="far fa-star"></i>'; // Estrela vazia
            }
        });
        
        // Atualizar texto
        updateRatingText(currentRating);
        
        // Habilitar botão de envio
        submitRatingBtn.disabled = false;
    });
});

// Função para atualizar o texto da avaliação
function updateRatingText(rating) {
    const texts = [
        'Selecione uma avaliação',
        'Péssimo',
        'Ruim',
        'Regular',
        'Bom',
        'Excelente'
    ];
    
    ratingText.textContent = rating > 0 ? texts[rating] : texts[0];
}

// Evento para enviar avaliação
submitRatingBtn.addEventListener('click', () => {
    if (currentRating === 0) {
        showNotification('Por favor, selecione uma avaliação.', 'error');
        return;
    }
    
    if (!auth.currentUser) {
        showNotification('Você precisa estar logado para avaliar produtos.', 'error');
        loginModal.style.display = 'block';
        return;
    }
    
    addRating(currentProductId, currentRating, ratingComment.value.trim());
});

// --- Eventos do Carrinho ---

// Adicionar ao carrinho
addToCartBtn.addEventListener('click', () => {
    const productId = parseInt(modalProductName.dataset.id);
    const quantity = parseInt(quantityInput.value);
    
    addToCart(productId, quantity);
    productModal.style.display = 'none';
});

// Botão para limpar carrinho
clearCartBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
        clearCart();
    }
});

// Botão para finalizar compra
checkoutBtn.addEventListener('click', () => {
    // Fechar o modal do carrinho
    cartModal.style.display = 'none';
    
    // Verificar se a função startCheckout existe (definida em checkout.js)
    if (typeof window.startCheckout === 'function') {
        // Chamar a função de checkout do checkout.js
        window.startCheckout();
    } else {
        // Fallback caso o checkout.js não esteja carregado
        showNotification('Funcionalidade de checkout em desenvolvimento.', 'info');
    }
});

// Botão para continuar comprando
continueShopping.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Configurar botão de WhatsApp flutuante
whatsappLink.href = 'https://wa.me/5511945037976?text=Olá! Estou interessado em seus produtos de impressão 3D.';

// Controles de quantidade no modal de produto
quantityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (btn.classList.contains('minus') && currentValue > 1) {
            quantityInput.value = currentValue - 1;
        } else if (btn.classList.contains('plus')) {
            quantityInput.value = currentValue + 1;
        }
    });
});

// Função de Notificação
function showNotification(message, type = 'info') {
    const notificationArea = document.getElementById('notification-area') || createNotificationArea();
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    notificationArea.appendChild(notification);
    setTimeout(() => { notification.classList.add('show'); }, 10);
    const closeBtn = notification.querySelector('.notification-close');
    const timer = setTimeout(() => { closeNotification(notification); }, 5000);
    closeBtn.addEventListener('click', () => {
        clearTimeout(timer);
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
        const notificationArea = document.getElementById('notification-area');
        if (notificationArea && !notificationArea.hasChildNodes()) {
            notificationArea.remove(); // Remove a área se estiver vazia
        }
    }, 300);
}

function createNotificationArea() {
    let area = document.getElementById('notification-area');
    if (!area) {
        area = document.createElement('div');
        area.id = 'notification-area';
        document.body.appendChild(area);
    }
    return area;
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedProducts();
    displayProductsByCategory('todos');
    document.querySelector('#category-tabs li[data-category="todos"]').classList.add('active');
    updateCartCount();
    
    // Adicionar evento de clique ao botão do carrinho no cabeçalho
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', openCartModal);
    }
});
