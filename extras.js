// Funcionalidades extras para o site de vendas de impressão 3D

// Sistema de favoritos
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Função para adicionar/remover dos favoritos
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        // Adicionar aos favoritos
        favorites.push(productId);
        updateFavoritesUI(productId, true);
    } else {
        // Remover dos favoritos
        favorites.splice(index, 1);
        updateFavoritesUI(productId, false);
    }
    
    // Salvar no localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Atualizar contador de favoritos
    updateFavoritesCount();
}

// Função para atualizar a UI dos favoritos
function updateFavoritesUI(productId, isFavorite) {
    const favButtons = document.querySelectorAll(`.fav-button[data-id="${productId}"]`);
    
    favButtons.forEach(btn => {
        if (isFavorite) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            
            // Animação de adição aos favoritos
            btn.classList.add('pulse');
            setTimeout(() => {
                btn.classList.remove('pulse');
            }, 500);
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Função para atualizar contador de favoritos
function updateFavoritesCount() {
    const favCount = document.getElementById('favorites-count');
    if (favCount) {
        favCount.textContent = favorites.length;
        
        if (favorites.length > 0) {
            favCount.style.display = 'inline-block';
        } else {
            favCount.style.display = 'none';
        }
    }
}

// Função para mostrar produtos favoritos
function showFavorites() {
    if (favorites.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Você ainda não tem produtos favoritos.</p>';
        currentCategoryTitle.textContent = 'Meus Favoritos';
        return;
    }
    
    productsContainer.innerHTML = '';
    currentCategoryTitle.textContent = 'Meus Favoritos';
    
    const favoriteProducts = products.filter(product => favorites.includes(product.id));
    
    favoriteProducts.forEach(product => {
        const card = createProductCard(product);
        productsContainer.appendChild(card);
        
        // Atualizar botão de favorito
        const favButton = card.querySelector('.fav-button');
        if (favButton) {
            updateFavoritesUI(product.id, true);
        }
    });
}

// Sistema de tema claro/escuro
let darkMode = localStorage.getItem('darkMode') === 'true';

// Função para alternar entre tema claro e escuro
function toggleDarkMode() {
    darkMode = !darkMode;
    updateTheme();
    localStorage.setItem('darkMode', darkMode);
}

// Função para atualizar o tema
function updateTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (darkMode) {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('title', 'Mudar para tema claro');
        }
    } else {
        body.classList.remove('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('title', 'Mudar para tema escuro');
        }
    }
}

// Sistema de avaliações
const ratings = JSON.parse(localStorage.getItem('ratings')) || {};

// Função para adicionar avaliação
function rateProduct(productId, rating) {
    ratings[productId] = rating;
    localStorage.setItem('ratings', JSON.stringify(ratings));
    updateRatingUI(productId);
}

// Função para atualizar UI de avaliação
function updateRatingUI(productId) {
    const ratingContainers = document.querySelectorAll(`.rating-container[data-id="${productId}"]`);
    const rating = ratings[productId] || 0;
    
    ratingContainers.forEach(container => {
        container.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.innerHTML = i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
            
            star.addEventListener('click', () => {
                rateProduct(productId, i);
            });
            
            container.appendChild(star);
        }
    });
}

// Função para mostrar produtos relacionados
function showRelatedProducts(category, currentProductId) {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    
    relatedContainer.innerHTML = '<h3>Produtos Relacionados</h3><div class="related-slider"></div>';
    const slider = relatedContainer.querySelector('.related-slider');
    
    const relatedProducts = products
        .filter(p => p.category === category && p.id !== currentProductId)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        relatedContainer.style.display = 'none';
        return;
    }
    
    relatedProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'related-product';
        card.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}">
            <h4>${product.name}</h4>
            <div class="related-price">${formatPrice(product.price)}</div>
        `;
        
        card.addEventListener('click', () => {
            openProductModal(product);
        });
        
        slider.appendChild(card);
    });
    
    relatedContainer.style.display = 'block';
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Evento para fechar manualmente
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
}

// Função para fechar notificação
function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Função para adicionar botões de favoritos aos cards de produtos
function addFavoritesToProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productId = parseInt(card.dataset.id);
        const productActions = card.querySelector('.product-actions');
        
        if (productActions && !productActions.querySelector('.fav-button')) {
            const favButton = document.createElement('button');
            favButton.className = 'btn fav-button';
            favButton.dataset.id = productId;
            favButton.innerHTML = favorites.includes(productId) ? 
                '<i class="fas fa-heart"></i>' : 
                '<i class="far fa-heart"></i>';
            
            if (favorites.includes(productId)) {
                favButton.classList.add('active');
            }
            
            favButton.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(productId);
            });
            
            productActions.appendChild(favButton);
        }
    });
}

// Função para adicionar efeitos de zoom nas imagens
function addImageZoomEffect() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(container => {
        const img = container.querySelector('img');
        
        if (img) {
            container.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = container.getBoundingClientRect();
                const x = (e.clientX - left) / width * 100;
                const y = (e.clientY - top) / height * 100;
                
                img.style.transformOrigin = `${x}% ${y}%`;
            });
            
            container.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.5)';
            });
            
            container.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                img.style.transformOrigin = 'center center';
            });
        }
    });
}

// Inicialização das funcionalidades extras
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar botão de favoritos ao header
    const userActions = document.querySelector('.user-actions');
    
    if (userActions) {
        const favoritesButton = document.createElement('button');
        favoritesButton.id = 'favorites-button';
        favoritesButton.className = 'btn';
        favoritesButton.innerHTML = '<i class="far fa-heart"></i> <span id="favorites-count">0</span>';
        
        favoritesButton.addEventListener('click', () => {
            showFavorites();
            
            // Resetar abas ativas
            document.querySelectorAll('#category-tabs li').forEach(tab => {
                tab.classList.remove('active');
            });
        });
        
        userActions.insertBefore(favoritesButton, userActions.firstChild);
        updateFavoritesCount();
    }
    
    // Adicionar botão de tema
    const header = document.querySelector('header');
    
    if (header) {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'btn theme-btn';
        themeToggle.innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('title', darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro');
        
        themeToggle.addEventListener('click', toggleDarkMode);
        
        header.appendChild(themeToggle);
    }
    
    // Aplicar tema inicial
    updateTheme();
    
    // Observador de mutação para adicionar favoritos a novos cards
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addFavoritesToProductCards();
                addImageZoomEffect();
            }
        });
    });
    
    observer.observe(document.getElementById('products-container'), { childList: true });
    observer.observe(document.getElementById('featured-products-container'), { childList: true });
    
    // Adicionar botões de favoritos aos cards iniciais
    setTimeout(() => {
        addFavoritesToProductCards();
        addImageZoomEffect();
    }, 500);
    
    // Mostrar notificação de boas-vindas
    setTimeout(() => {
        showNotification('Bem-vindo à 3D FabriCraft! Explore nossos produtos de impressão 3D.', 'sucesso');
    }, 1000);
});

// Adicionar seção de produtos relacionados ao modal de produto
function enhanceProductModal() {
    const modalContent = document.querySelector('.product-modal-content');
    
    if (modalContent && !document.getElementById('related-products')) {
        const relatedSection = document.createElement('div');
        relatedSection.id = 'related-products';
        relatedSection.className = 'related-products-section';
        
        modalContent.appendChild(relatedSection);
    }
}

// Chamar função para melhorar o modal
enhanceProductModal();

// Sobrescrever a função openProductModal para incluir produtos relacionados
const originalOpenProductModal = window.openProductModal;
window.openProductModal = function(product) {
    originalOpenProductModal(product);
    showRelatedProducts(product.category, product.id);
    
    // Adicionar container de avaliação se não existir
    const productInfo = document.querySelector('.product-modal-content .product-info');
    
    if (productInfo && !productInfo.querySelector('.rating-container')) {
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'rating-container';
        ratingContainer.dataset.id = product.id;
        
        productInfo.insertBefore(ratingContainer, productInfo.querySelector('.product-description'));
        
        // Atualizar UI de avaliação
        updateRatingUI(product.id);
    }
};
    