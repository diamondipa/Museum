// ====================== CONSTANTS ======================
const CART_KEY = 'museumCartV1';
const TAX_RATE = 0.102;
const MEMBER_DISCOUNT_RATE = 0.15;
const SHIPPING_RATE = 25.00;
const VOLUME_DISCOUNT_TIERS = [
    { min: 0, max: 49.99, rate: 0 },
    { min: 50, max: 99.99, rate: 0.05 },
    { min: 100, max: 199.99, rate: 0.10 },
    { min: 200, max: Infinity, rate: 0.15 }
];

// ====================== GLOBAL VARIABLES ======================
let applyMemberDiscount = false;
let activeDiscount = 'none'; // 'member', 'volume', or 'none'

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
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// ====================== FORMAT CURRENCY ======================
function formatCurrency(amount) {
    if (amount < 0) {
        return `($${Math.abs(amount).toFixed(2)})`;
    }
    return `$${amount.toFixed(2)}`;
}

// ====================== CALCULATE VOLUME DISCOUNT ======================
function calculateVolumeDiscount(subtotal) {
    for (const tier of VOLUME_DISCOUNT_TIERS) {
        if (subtotal >= tier.min && subtotal <= tier.max) {
            return subtotal * tier.rate;
        }
    }
    return 0;
}

// ====================== PROMPT DISCOUNT CHOICE ======================
function promptDiscountChoice(subtotal) {
    const volumeDiscountAmount = calculateVolumeDiscount(subtotal);
    const memberDiscountAmount = subtotal * MEMBER_DISCOUNT_RATE;
    
    const choice = confirm(
        `Both Member Discount (15%) and Volume Discount (${(volumeDiscountAmount/subtotal*100).toFixed(0)}%) can apply.\n` +
        `Only one discount may be used.\n\n` +
        `Click OK to use Member Discount (15% off).\n` +
        `Click Cancel to use Volume Discount (${(volumeDiscountAmount/subtotal*100).toFixed(0)}% off).`
    );
    
    return choice ? 'member' : 'volume';
}

// ====================== RENDER CART ======================
function render() {
    const cart = readCart();
    const container = document.getElementById('cart-container');
    
    if (!container) return;
    
    // Filter out items with price 0 or qty 0
    const validCart = cart.filter(item => item.unitPrice > 0 && item.qty > 0);
    
    // Empty cart state
    if (validCart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Browse our <a href="shop.html">souvenir shop</a> to add items.</p>
                <button onclick="location.href='shop.html'" class="keep-shopping-btn">Keep Shopping</button>
            </div>
        `;
        return;
    }
    
    // Calculate ItemTotal
    let itemTotal = 0;
    let cartHTML = `
        <h2>Shopping Cart</h2>
        <div class="cart-layout">
            <div class="cart-items">
                <table class="cart-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // BONUS: Table with thumbnails
    validCart.forEach(item => {
        const lineTotal = item.unitPrice * item.qty;
        itemTotal += lineTotal;
        
        cartHTML += `
            <tr>
                <td class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-thumbnail">
                    <span class="cart-item-name">${item.name}</span>
                </td>
                <td class="cart-price">${formatCurrency(item.unitPrice)}</td>
                <td class="cart-qty">
                    <button class="qty-btn" onclick="decrementQty('${item.id}')">−</button>
                    <span class="qty-display">${item.qty}</span>
                    <button class="qty-btn" onclick="incrementQty('${item.id}')">+</button>
                </td>
                <td class="cart-line-total">${formatCurrency(lineTotal)}</td>
                <td>
                    <button class="remove-btn" onclick="removeItem('${item.id}')">Remove</button>
                </td>
            </tr>
        `;
    });
    
    cartHTML += `
                    </tbody>
                </table>
            </div>
            
            <div class="cart-summary">
                <h3>Order Summary</h3>
    `;
    
    // Calculate discounts
    let volumeDiscount = 0;
    let memberDiscount = 0;
    
    // Check if both discounts could apply
    const volumeDiscountAmount = calculateVolumeDiscount(itemTotal);
    const memberDiscountAmount = itemTotal * MEMBER_DISCOUNT_RATE;
    const bothCanApply = (volumeDiscountAmount > 0 || applyMemberDiscount);
    
    // If both could apply and no discount selected yet, prompt
    if (bothCanApply && activeDiscount === 'none' && itemTotal > 0) {
        if (volumeDiscountAmount > 0 && applyMemberDiscount) {
            activeDiscount = promptDiscountChoice(itemTotal);
        } else if (volumeDiscountAmount > 0) {
            activeDiscount = 'volume';
        } else if (applyMemberDiscount) {
            activeDiscount = 'member';
        }
    }
    
    // Apply selected discount
    if (activeDiscount === 'volume') {
        volumeDiscount = calculateVolumeDiscount(itemTotal);
        applyMemberDiscount = false;
    } else if (activeDiscount === 'member') {
        memberDiscount = itemTotal * MEMBER_DISCOUNT_RATE;
        applyMemberDiscount = true;
    }
    
    // Calculate subtotal, tax, total
    const subtotalAfterDiscounts = itemTotal - volumeDiscount - memberDiscount;
    const taxableAmount = subtotalAfterDiscounts + SHIPPING_RATE;
    const taxAmount = taxableAmount * TAX_RATE;
    const invoiceTotal = taxableAmount + taxAmount;
    
    // Summary HTML with right-aligned amounts
    cartHTML += `
        <div class="summary-row">
            <span>Subtotal (Item Total):</span>
            <span class="summary-amount">${formatCurrency(itemTotal)}</span>
        </div>
    `;
    
    if (volumeDiscount > 0) {
        cartHTML += `
            <div class="summary-row discount">
                <span>Volume Discount (${(volumeDiscount/itemTotal*100).toFixed(0)}%):</span>
                <span class="summary-amount">-${formatCurrency(volumeDiscount)}</span>
            </div>
        `;
    }
    
    if (memberDiscount > 0) {
        cartHTML += `
            <div class="summary-row discount">
                <span>Member Discount (15%):</span>
                <span class="summary-amount">-${formatCurrency(memberDiscount)}</span>
            </div>
        `;
    }
    
    cartHTML += `
        <div class="summary-row">
            <span>Shipping:</span>
            <span class="summary-amount">${formatCurrency(SHIPPING_RATE)}</span>
        </div>
        <div class="summary-row subtotal">
            <span>Subtotal (Taxable):</span>
            <span class="summary-amount">${formatCurrency(taxableAmount)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (${(TAX_RATE * 100).toFixed(1)}%):</span>
            <span class="summary-amount">${formatCurrency(taxAmount)}</span>
        </div>
        <div class="summary-row total">
            <span>Invoice Total:</span>
            <span class="summary-amount">${formatCurrency(invoiceTotal)}</span>
        </div>
    `;
    
    // Member discount checkbox
    const memberChecked = applyMemberDiscount ? 'checked' : '';
    cartHTML += `
        <div class="member-discount-section">
            <label class="member-checkbox">
                <input type="checkbox" id="memberDiscountCheck" ${memberChecked} onchange="toggleMemberDiscount(this.checked)">
                Apply Member Discount (15% off)
            </label>
        </div>
    `;
    
    // Cart action buttons
    cartHTML += `
        <div class="cart-actions">
            <button onclick="clearCart()" class="clear-cart-btn">Clear Cart</button>
            <button onclick="location.href='shop.html'" class="keep-shopping-btn">Keep Shopping</button>
        </div>
    `;
    
    cartHTML += `
            </div>
        </div>
    `;
    
    container.innerHTML = cartHTML;
    updateCartCount();
}

// ====================== CART ACTIONS ======================
function toggleMemberDiscount(checked) {
    applyMemberDiscount = checked;
    activeDiscount = 'none'; // Reset discount choice on toggle
    render();
}

function incrementQty(id) {
    let cart = readCart();
    const item = cart.find(it => it.id === id);
    if (item) {
        item.qty += 1;
        writeCart(cart);
        render();
    }
}

function decrementQty(id) {
    let cart = readCart();
    const item = cart.find(it => it.id === id);
    if (item) {
        item.qty -= 1;
        if (item.qty <= 0) {
            cart = cart.filter(it => it.id !== id);
        }
        writeCart(cart);
        render();
    }
}

function removeItem(id) {
    let cart = readCart();
    cart = cart.filter(it => it.id !== id);
    writeCart(cart);
    render();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        writeCart([]);
        activeDiscount = 'none';
        applyMemberDiscount = false;
        render();
    }
}

// ====================== INITIALIZATION ======================
document.addEventListener('DOMContentLoaded', function() {
    // Reset discount state on page load
    activeDiscount = 'none';
    applyMemberDiscount = false;
    render();
});
