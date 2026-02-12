// Shop functionality for Museum Souvenir Shop
console.log("Shop page loaded");

// ====================== CONSTANTS ======================
const CART_KEY = 'museumCartV1';

// ====================== LOCAL STORAGE FUNCTIONS ======================
function readCart() {
    try { 
        return JSON.parse(localStorage.getItem(CART_KEY)) || []; 
    }
    catch { 
        return []; 
    }
}

function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ====================== CART COUNT UPDATE ======================
function updateCartCount() {
    const cart = readCart();
    const totalItems = cart.reduce((total, item) => total + (item.qty || 1), 0);
    const viewCartBtn = document.getElementById('viewCartBtn');
    if (viewCartBtn) {
        viewCartBtn.textContent = `VIEW CART (${totalItems})`;
    }
}

// ====================== ADD TO CART FUNCTION ======================
function addToCart(btn) {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const unitPrice = Number(btn.dataset.price);
    const image = btn.dataset.image;

    let cart = readCart();
    const idx = cart.findIndex(it => it.id === id);
    
    if (idx >= 0) {
        cart[idx].qty += 1;
    } else {
        cart.push({ id, name, unitPrice, qty: 1, image });
    }
    
    writeCart(cart);
    updateCartCount();

    // Update the item card's qty badge
    const card = btn.closest('.souvenir-item');
    if (card) {
        const badge = card.querySelector('.qty-badge');
        if (badge) {
            const item = cart.find(it => it.id === id);
            badge.textContent = item ? `${item.qty}` : '';
            badge.style.display = item ? 'inline-block' : 'none';
        }
    }

    // Visual feedback on button
    const originalText = btn.textContent;
    btn.textContent = '✓ ADDED!';
    btn.style.backgroundColor = '#00a36c';
    btn.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.transform = '';
    }, 1000);
}

// ====================== MODAL FUNCTIONALITY ======================
function openModal(itemId) {
    const itemElement = document.querySelector(`[data-item="${itemId}"]`);
    if (!itemElement) return;
    
    const modal = document.getElementById('itemModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalAddToCart = document.getElementById('modalAddToCart');
    
    modalImage.src = itemElement.getAttribute('src') || '';
    modalImage.alt = itemElement.getAttribute('alt') || '';
    modalTitle.textContent = itemElement.getAttribute('data-title') || 'Unknown Item';
    modalPrice.textContent = itemElement.getAttribute('data-price') || '$0.00';
    modalDescription.textContent = itemElement.getAttribute('data-description') || 'No description available.';
    
    modalAddToCart.onclick = function() {
        const btn = document.querySelector(`button[data-id="${itemId}"]`);
        if (btn) addToCart(btn);
        closeModal();
    };
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ====================== INITIALIZATION ======================
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Initialize qty badges on page load
    const cart = readCart();
    document.querySelectorAll('.souvenir-item').forEach(card => {
        const id = card.querySelector('.item-id')?.textContent;
        if (id) {
            const badge = card.querySelector('.qty-badge');
            const item = cart.find(it => it.id === id);
            if (badge) {
                badge.textContent = item ? `${item.qty}` : '';
                badge.style.display = item ? 'inline-block' : 'none';
            }
        }
    });
    
    // Set up image click events for modal
    document.querySelectorAll('.item-image').forEach(img => {
        img.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item');
            openModal(itemId);
        });
    });
    
    // Set up modal close button
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('itemModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
