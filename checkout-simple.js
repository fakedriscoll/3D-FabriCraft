// Checkout simples com Mercado Pago - Formulário de cartão de crédito
// Este arquivo implementa apenas o necessário para o botão "Finalizar Compra" funcionar

// Configuração do Mercado Pago
const MERCADO_PAGO_PUBLIC_KEY = 'APP_USR-59a2294d-000a-4df9-b912-b72f91d15c02'; // Substitua pela sua chave pública

// Definir a função global startCheckout que será chamada pelo script.js
window.startCheckout = function() {
    console.log("Iniciando checkout via função global");
    
    // Fechar o modal do carrinho
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
    
    // Abrir o modal de checkout
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.style.display = 'block';
        
        // Carregar o resumo do pedido
        updateOrderSummary();
        
        // Carregar o formulário de cartão
        loadCardForm();
    }
};

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log("Checkout simples inicializado");
    
    // Adicionar evento para fechar o modal de checkout
    const closeCheckoutBtn = document.querySelector('#checkout-modal .close');
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', function() {
            const checkoutModal = document.getElementById('checkout-modal');
            if (checkoutModal) {
                checkoutModal.style.display = 'none';
            }
        });
    }
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        const checkoutModal = document.getElementById('checkout-modal');
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
    
    // Carregar o SDK do Mercado Pago
    loadMercadoPagoSDK();
});

// Função para carregar o SDK do Mercado Pago
function loadMercadoPagoSDK() {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.type = 'text/javascript';
    document.body.appendChild(script);
    
    script.onload = function() {
        console.log('SDK do Mercado Pago carregado');
    };
}

// Função para atualizar o resumo do pedido
function updateOrderSummary() {
    // Obter o carrinho do localStorage
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Erro ao obter carrinho:", e);
        cart = [];
    }
    
    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        orderItem.innerHTML = `
            <div class="order-item-name">${item.name} x${item.quantity}</div>
            <div class="order-item-price">R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
        `;
        
        orderItemsContainer.appendChild(orderItem);
    });
    
    const orderTotal = document.getElementById('order-total');
    if (orderTotal) {
        orderTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

// Função para carregar o formulário de cartão
function loadCardForm() {
    const cardFormContainer = document.getElementById('checkout-button-container');
    if (!cardFormContainer) return;
    
    // Limpar o container
    cardFormContainer.innerHTML = '';
    
    // Esconder o loader
    const loader = document.getElementById('checkout-loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Verificar se o SDK do Mercado Pago está carregado
    if (typeof MercadoPago === 'undefined') {
        // Criar formulário simples como fallback
        cardFormContainer.innerHTML = `
            <div class="card-form-fallback">
                <h4>Dados do Cartão</h4>
                <div class="form-group">
                    <label>Número do Cartão</label>
                    <input type="text" placeholder="1234 5678 9012 3456" class="form-control">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Validade</label>
                        <input type="text" placeholder="MM/AA" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="text" placeholder="123" class="form-control">
                    </div>
                </div>
                <div class="form-group">
                    <label>Nome no Cartão</label>
                    <input type="text" placeholder="Nome como está no cartão" class="form-control">
                </div>
                <button class="btn btn-primary btn-block">Pagar Agora</button>
                <div class="payment-info">
                    <p><i class="fas fa-info-circle"></i> Este é um ambiente de demonstração. Para ativar pagamentos reais, você precisará configurar sua conta no Mercado Pago.</p>
                </div>
            </div>
        `;
        
        // Mostrar mensagem de demonstração
        const demoMessage = document.getElementById('checkout-demo-message');
        if (demoMessage) {
            demoMessage.style.display = 'block';
        }
        
        return;
    }
    
    // Inicializar o Mercado Pago com a chave pública
    const mp = new MercadoPago(MERCADO_PAGO_PUBLIC_KEY);
    
    // Criar o formulário de cartão usando o Brick do Mercado Pago
    const bricksBuilder = mp.bricks();
    
    // Criar o elemento de cartão
    bricksBuilder.create('cardPayment', 'checkout-button-container', {
        initialization: {
            amount: getCartTotal() // Função para obter o total do carrinho
        },
        callbacks: {
            onReady: () => {
                console.log('Brick de cartão pronto');
            },
            onSubmit: (cardFormData) => {
                // Aqui você enviaria os dados para seu backend processar o pagamento
                console.log('Dados do formulário:', cardFormData);
                
                // Simular processamento
                simulatePaymentProcessing();
            },
            onError: (error) => {
                console.error('Erro no formulário de cartão:', error);
            }
        },
        locale: 'pt-BR',
        customization: {
            visual: {
                style: {
                    theme: 'default'
                }
            },
            paymentMethods: {
                maxInstallments: 12
            }
        }
    });
    
    // Mostrar mensagem de demonstração
    const demoMessage = document.getElementById('checkout-demo-message');
    if (demoMessage) {
        demoMessage.style.display = 'block';
    }
}

// Função para obter o total do carrinho
function getCartTotal() {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Erro ao obter carrinho:", e);
        return 0;
    }
    
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Função para simular o processamento do pagamento
function simulatePaymentProcessing() {
    // Mostrar mensagem de processamento
    const cardFormContainer = document.getElementById('checkout-button-container');
    if (cardFormContainer) {
        cardFormContainer.innerHTML += `
            <div class="payment-processing">
                <i class="fas fa-spinner fa-spin"></i> Processando pagamento...
            </div>
        `;
    }
    
    // Simular tempo de processamento
    setTimeout(() => {
        // Mostrar mensagem de sucesso
        if (cardFormContainer) {
            cardFormContainer.innerHTML = `
                <div class="payment-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>Pagamento Aprovado!</h3>
                    <p>Seu pedido foi processado com sucesso.</p>
                    <p>O valor será transferido para a conta do vendedor.</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">Continuar Comprando</button>
                </div>
            `;
        }
        
        // Limpar o carrinho
        localStorage.setItem('cart', JSON.stringify([]));
    }, 2000);
}
