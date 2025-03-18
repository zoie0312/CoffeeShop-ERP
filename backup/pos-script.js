// POS System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // State management
    const state = {
        order: {
            items: [],
            customer: null,
            subtotal: 0,
            tax: 0,
            total: 0,
            paymentMethod: null
        },
        currentItemId: null,
        nextItemId: 1
    };

    // DOM Elements
    const productCards = document.querySelectorAll('.product-card');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const orderItemsContainer = document.getElementById('orderItems');
    const clearOrderBtn = document.getElementById('clearOrder');
    const customizationPanel = document.getElementById('itemCustomization');
    const cancelCustomizationBtn = document.getElementById('cancelCustomization');
    const applyCustomizationBtn = document.getElementById('applyCustomization');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const addCustomerBtn = document.getElementById('addCustomer');
    const paymentButtons = document.querySelectorAll('.payment-btn');
    const completeOrderBtn = document.getElementById('completeOrder');
    const customerModal = document.getElementById('customerModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const customerItems = document.querySelectorAll('.customer-item');

    // Event listeners
    
    // Product selection
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.id;
            const productName = card.dataset.name;
            const productPrice = parseFloat(card.dataset.price);
            
            // Add item to order
            addItemToOrder(productId, productName, productPrice);
        });
    });

    // Category switching
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // In a real app, we would filter products here based on category
            // For this prototype, we'll just show a message
            console.log('Category selected:', button.dataset.category);
            
            // Simulate category change (in a real app, we would fetch or filter products)
            simulateCategoryChange(button.dataset.category);
        });
    });

    // Clear order
    clearOrderBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the current order?')) {
            clearOrder();
        }
    });

    // Customization panel
    cancelCustomizationBtn.addEventListener('click', () => {
        closeCustomizationPanel();
    });

    applyCustomizationBtn.addEventListener('click', () => {
        applyCustomization();
    });

    // Add customer
    addCustomerBtn.addEventListener('click', () => {
        openCustomerModal();
    });

    // Payment method selection
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            paymentButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Set payment method
            state.order.paymentMethod = button.dataset.method;
            
            // Enable complete order button if there are items in the order
            if (state.order.items.length > 0) {
                completeOrderBtn.disabled = false;
            }
        });
    });

    // Complete order
    completeOrderBtn.addEventListener('click', () => {
        processOrder();
    });

    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Customer selection
    customerItems.forEach(item => {
        item.addEventListener('click', () => {
            const customerName = item.querySelector('h4').textContent;
            selectCustomer(customerName);
            closeAllModals();
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });

    // Functions

    // Add item to order
    function addItemToOrder(productId, productName, productPrice) {
        const itemId = state.nextItemId++;
        
        const newItem = {
            id: itemId,
            productId: productId,
            name: productName,
            price: productPrice,
            quantity: 1,
            options: {
                size: 'medium',
                milk: 'whole',
                extras: []
            },
            totalPrice: productPrice
        };
        
        state.order.items.push(newItem);
        renderOrderItems();
        updateOrderTotals();
        
        // Show customization panel for coffee items
        if (productId >= 1 && productId <= 8) {
            state.currentItemId = itemId;
            openCustomizationPanel();
        }
    }

    // Render order items
    function renderOrderItems() {
        orderItemsContainer.innerHTML = '';
        
        if (state.order.items.length === 0) {
            orderItemsContainer.innerHTML = '<div class="empty-order">No items added yet</div>';
            return;
        }
        
        state.order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');
            itemElement.dataset.id = item.id;
            
            // Build options string
            let optionsText = `${item.options.size}, ${item.options.milk} milk`;
            if (item.options.extras.length > 0) {
                optionsText += `, ${item.options.extras.join(', ')}`;
            }
            
            itemElement.innerHTML = `
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-options">${optionsText}</div>
                </div>
                <div class="item-actions">
                    <div class="item-quantity">
                        <button class="qty-btn qty-decrease">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn qty-increase">+</button>
                    </div>
                    <div class="item-price">$${(item.totalPrice).toFixed(2)}</div>
                    <button class="btn-icon remove-item"><i class="fa-solid fa-times"></i></button>
                </div>
            `;
            
            orderItemsContainer.appendChild(itemElement);
            
            // Add event listeners to buttons
            const qtyDecreaseBtn = itemElement.querySelector('.qty-decrease');
            const qtyIncreaseBtn = itemElement.querySelector('.qty-increase');
            const removeItemBtn = itemElement.querySelector('.remove-item');
            
            qtyDecreaseBtn.addEventListener('click', () => {
                updateItemQuantity(item.id, -1);
            });
            
            qtyIncreaseBtn.addEventListener('click', () => {
                updateItemQuantity(item.id, 1);
            });
            
            removeItemBtn.addEventListener('click', () => {
                removeItem(item.id);
            });
        });
    }

    // Update item quantity
    function updateItemQuantity(itemId, change) {
        const item = state.order.items.find(item => item.id === itemId);
        
        if (!item) return;
        
        item.quantity += change;
        
        // Remove item if quantity is 0
        if (item.quantity <= 0) {
            removeItem(itemId);
            return;
        }
        
        // Update total price
        item.totalPrice = item.price * item.quantity;
        
        renderOrderItems();
        updateOrderTotals();
    }

    // Remove item
    function removeItem(itemId) {
        state.order.items = state.order.items.filter(item => item.id !== itemId);
        renderOrderItems();
        updateOrderTotals();
        
        // Disable complete order button if no items
        if (state.order.items.length === 0) {
            completeOrderBtn.disabled = true;
        }
    }

    // Clear order
    function clearOrder() {
        state.order.items = [];
        state.order.customer = null;
        state.order.paymentMethod = null;
        
        renderOrderItems();
        updateOrderTotals();
        
        // Reset payment buttons
        paymentButtons.forEach(btn => btn.classList.remove('active'));
        
        // Reset customer display
        document.getElementById('addCustomer').innerHTML = '<i class="fa-solid fa-user-plus"></i> <span>Add Customer</span>';
        
        // Disable complete order button
        completeOrderBtn.disabled = true;
    }

    // Open customization panel
    function openCustomizationPanel() {
        customizationPanel.classList.add('active');
        
        // Reset options
        const optionButtons = customizationPanel.querySelectorAll('.option-btn');
        optionButtons.forEach(btn => {
            // For size and milk, set only medium and whole as active
            if ((btn.dataset.value === 'medium' && btn.parentElement.parentElement.querySelector('label').textContent === 'Size') || 
                (btn.dataset.value === 'whole' && btn.parentElement.parentElement.querySelector('label').textContent === 'Milk')) {
                btn.classList.add('active');
            } else if (btn.parentElement.parentElement.querySelector('label').textContent === 'Extras') {
                btn.classList.remove('active'); // All extras off by default
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Add event listeners to option buttons
        optionButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const optionGroup = this.parentElement.parentElement.querySelector('label').textContent.toLowerCase();
                
                if (optionGroup === 'size' || optionGroup === 'milk') {
                    // For size and milk, only one option can be selected
                    const siblings = this.parentElement.querySelectorAll('.option-btn');
                    siblings.forEach(sib => sib.classList.remove('active'));
                    this.classList.add('active');
                } else {
                    // For extras, toggle active state
                    this.classList.toggle('active');
                }
            });
        });
    }

    // Close customization panel
    function closeCustomizationPanel() {
        customizationPanel.classList.remove('active');
    }

    // Apply customization
    function applyCustomization() {
        const itemId = state.currentItemId;
        const item = state.order.items.find(item => item.id === itemId);
        
        if (!item) {
            closeCustomizationPanel();
            return;
        }
        
        // Get selected options
        const sizeBtn = document.querySelector('.option-group:nth-child(1) .option-btn.active');
        const milkBtn = document.querySelector('.option-group:nth-child(2) .option-btn.active');
        const extraBtns = document.querySelectorAll('.option-group:nth-child(3) .option-btn.active');
        
        // Update item options
        item.options.size = sizeBtn ? sizeBtn.dataset.value : 'medium';
        item.options.milk = milkBtn ? milkBtn.dataset.value : 'whole';
        
        item.options.extras = [];
        extraBtns.forEach(btn => {
            item.options.extras.push(btn.dataset.value);
        });
        
        // Adjust price based on options
        let priceAdjustment = 0;
        
        // Size adjustments
        if (item.options.size === 'large') {
            priceAdjustment += 0.75;
        } else if (item.options.size === 'small') {
            priceAdjustment -= 0.50;
        }
        
        // Milk adjustments
        if (item.options.milk === 'almond' || item.options.milk === 'oat') {
            priceAdjustment += 0.75;
        }
        
        // Extras adjustments
        priceAdjustment += item.options.extras.length * 0.50;
        
        // Update item price and total
        item.price = parseFloat((parseFloat(item.price) + priceAdjustment).toFixed(2));
        item.totalPrice = item.price * item.quantity;
        
        // Close panel and update display
        closeCustomizationPanel();
        renderOrderItems();
        updateOrderTotals();
    }

    // Update order totals
    function updateOrderTotals() {
        // Calculate subtotal
        state.order.subtotal = state.order.items.reduce((sum, item) => sum + item.totalPrice, 0);
        
        // Calculate tax (8%)
        state.order.tax = state.order.subtotal * 0.08;
        
        // Calculate total
        state.order.total = state.order.subtotal + state.order.tax;
        
        // Update display
        subtotalElement.textContent = `$${state.order.subtotal.toFixed(2)}`;
        taxElement.textContent = `$${state.order.tax.toFixed(2)}`;
        totalElement.textContent = `$${state.order.total.toFixed(2)}`;
    }

    // Open customer modal
    function openCustomerModal() {
        customerModal.classList.add('active');
    }

    // Close all modals
    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Select customer
    function selectCustomer(name) {
        state.order.customer = name;
        document.getElementById('addCustomer').innerHTML = `
            <i class="fa-solid fa-user"></i>
            <span>${name}</span>
        `;
    }

    // Process order
    function processOrder() {
        if (!state.order.paymentMethod) {
            alert('Please select a payment method');
            return;
        }
        
        if (state.order.items.length === 0) {
            alert('Your order is empty');
            return;
        }
        
        // In a real application, we would send the order to a server
        console.log('Processing order:', state.order);
        
        // Show confirmation
        alert(`Order #${document.querySelector('.order-number').textContent.replace('#', '')} completed successfully!`);
        
        // Clear order after processing
        clearOrder();
        
        // Update order number for next order
        const orderNumberElement = document.querySelector('.order-number');
        const currentOrderNumber = parseInt(orderNumberElement.textContent.replace('#', ''));
        orderNumberElement.textContent = `#${currentOrderNumber + 1}`;
    }

    // Simulate category change (in a real app, this would filter products)
    function simulateCategoryChange(category) {
        const productGrid = document.getElementById('coffeeProducts');
        
        // Simulate loading with a brief fade
        productGrid.style.opacity = '0.5';
        
        setTimeout(() => {
            productGrid.style.opacity = '1';
            
            // Placeholder messages - in a real app, we'd load different products
            switch(category) {
                case 'tea':
                    console.log('Tea products would be loaded here');
                    break;
                case 'cold-drinks':
                    console.log('Cold drinks would be loaded here');
                    break;
                case 'pastries':
                    console.log('Pastries would be loaded here');
                    break;
                case 'snacks':
                    console.log('Snacks would be loaded here');
                    break;
                default:
                    console.log('Coffee products are already loaded');
            }
        }, 300);
    }

    // Initialize POS system
    function initPOS() {
        // Set initial state
        renderOrderItems();
        updateOrderTotals();
        
        // Set customization panel default options
        customizationPanel.classList.remove('active');
        
        // Disable complete order button initially
        completeOrderBtn.disabled = true;
    }

    // Initialize on load
    initPOS();
}); 