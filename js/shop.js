// Shop functionality for Museum Souvenir Shop
console.log("Shop page loaded");

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('museumCart')) || [];
let cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

// Update cart count in navigation
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Set up image click events for modal
    document.querySelectorAll('.item-image').forEach(img => {
        img.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item');
            openModal(itemId);
        });
    });
    
    // Set up modal close button
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    document.getElementById('itemModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Add to cart function (Phase 1 stub)
function addToCart(itemId) {
    const itemElement = document.querySelector(`[data-item="${itemId}"]`);
    if (!itemElement) return;
    
    const item = {
        id: itemId,
        title: itemElement.getAttribute('data-title') || 'Unknown Item',
        price: parseFloat(itemElement.getAttribute('data-price').replace('$', '')) || 0,
        image: itemElement.getAttribute('src') || '',
        quantity: 1
    };
    
    // Check if item already in cart
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push(item);
    }
    
    // Save to localStorage
    localStorage.setItem('museumCart', JSON.stringify(cart));
    
    // Update cart count
    cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    updateCartCount();
    
    // Show confirmation (Phase 1 requirement)
    alert(`Added "${item.title}" to cart!\n\nPrice: $${item.price.toFixed(2)}\n\nIn Phase 2, you'll be able to view your cart and checkout.`);
    
    // Visual feedback on button
    const button = event?.target;
    if (button && button.classList.contains('add-to-cart-btn')) {
        const originalText = button.textContent;
        button.textContent = '✓ Added to Cart!';
        button.style.backgroundColor = '#0066cc';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Modal functionality
function openModal(itemId) {
    const itemElement = document.querySelector(`[data-item="${itemId}"]`);
    if (!itemElement) return;
    
    const modal = document.getElementById('itemModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalAddToCart = document.getElementById('modalAddToCart');
    
    // Populate modal with item data
    modalImage.src = itemElement.getAttribute('src') || '';
    modalImage.alt = itemElement.getAttribute('alt') || '';
    modalTitle.textContent = itemElement.getAttribute('data-title') || 'Unknown Item';
    modalPrice.textContent = itemElement.getAttribute('data-price') || '$0.00';
    modalDescription.textContent = itemElement.getAttribute('data-description') || 'No description available.';
    
    // Set up add to cart button in modal
    modalAddToCart.onclick = function() {
        addToCart(itemId);
        closeModal();
    };
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Item data for reference (not used in current implementation but available for Phase 2)
const itemDatabase = {
    'item001': {
        title: 'Starbone Fossil',
        price: 89.99,
        description: 'From the Celestial Collection. Material: Resin composite with mineral flecks. Location: Discovered in the Mariana Trench. Purpose: Ritual object used in ancient star-navigation ceremonies. Believed to have fallen from celestial oceans during the Great Alignment.',
        collection: 'Celestial Collection'
    },
    'item002': {
        title: 'Coral Queen Incense',
        price: 34.99,
        description: 'From the Ritual Collection. Material: Sea salt, dried algae, and essential oils. Location: Based on artifacts from the Pacific Abyssal Plain. Purpose: Used in purification rituals by Deep Ur priests. Each set includes 12 incense cones and a ceramic burner.',
        collection: 'Ritual Collection'
    },
    'item003': {
        title: 'Abyssal Pearl Pendant',
        price: 149.99,
        description: 'From the Jewelry Collection. Material: Cultured pearl with sterling silver setting. Location: Inspired by deep-sea oyster beds. Purpose: Worn as protective talismans by ancient divers. Each pearl is unique, formed under intense pressure in complete darkness.',
        collection: 'Jewelry Collection'
    },
    'item004': {
        title: 'Nautilus Navigator',
        price: 199.99,
        description: 'From the Navigation Collection. Material: Brass and glass. Location: Replica of instruments found in sunken exploration vessels. Purpose: Used for deep-sea navigation. Features the golden ratio spiral of the nautilus shell for precise directional measurement.',
        collection: 'Navigation Collection'
    }
};
