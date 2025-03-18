import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Product } from '../types';
import { FaPlus, FaMinus, FaTrash, FaCreditCard, FaMoneyBill } from 'react-icons/fa';

// Sample product data (in a real app this would come from a database)
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Espresso',
    price: 3.50,
    category: 'Coffee',
    image: '/images/espresso.jpg'
  },
  {
    id: '2',
    name: 'Cappuccino',
    price: 4.50,
    category: 'Coffee',
    image: '/images/cappuccino.jpg'
  },
  {
    id: '3',
    name: 'Latte',
    price: 4.00,
    category: 'Coffee',
    image: '/images/latte.jpg'
  },
  {
    id: '4',
    name: 'Americano',
    price: 3.00,
    category: 'Coffee',
    image: '/images/americano.jpg'
  },
  {
    id: '5',
    name: 'Mocha',
    price: 4.75,
    category: 'Coffee',
    image: '/images/mocha.jpg'
  },
  {
    id: '6',
    name: 'Croissant',
    price: 3.25,
    category: 'Food',
    image: '/images/croissant.jpg'
  },
  {
    id: '7',
    name: 'Blueberry Muffin',
    price: 3.50,
    category: 'Food',
    image: '/images/muffin.jpg'
  },
  {
    id: '8',
    name: 'Chocolate Chip Cookie',
    price: 2.50,
    category: 'Food',
    image: '/images/cookie.jpg'
  }
];

// Product categories
const categories = ['All', 'Coffee', 'Food', 'Tea', 'Cold Drinks'];

interface CartItem {
  product: Product;
  quantity: number;
  total: number;
  options?: {
    size: string;
    milk: string;
    extras: string[];
  };
}

const POS: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  
  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? sampleProducts 
    : sampleProducts.filter(product => product.category === activeCategory);
  
  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Check if product already in cart
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === product.id
      );
      
      if (existingItemIndex >= 0) {
        // Increment quantity of existing item
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        newCart[existingItemIndex].total = newCart[existingItemIndex].quantity * product.price;
        return newCart;
      } else {
        // Add new item to cart
        return [...prevCart, { 
          product, 
          quantity: 1, 
          total: product.price,
          options: {
            size: 'Regular',
            milk: 'Whole',
            extras: []
          }
        }];
      }
    });
  };
  
  // Remove product from cart
  const removeFromCart = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };
  
  // Update item quantity
  const updateQuantity = (index: number, delta: number) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
      newCart[index].total = newCart[index].quantity * newCart[index].product.price;
      return newCart;
    });
  };
  
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + tax;
  
  return (
    <Layout title="Point of Sale">
      <Head>
        <title>Point of Sale | Bean Counter Coffee Shop ERP</title>
      </Head>
      
      <div className="pos-container">
        {/* Products Section */}
        <section className="products-section">
          <div className="categories">
            {categories.map(category => (
              <button 
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
                <div className="product-image-container">
                  <div className="product-image-placeholder">
                    {product.category === 'Coffee' ? '☕' : '🍽️'}
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Order Section */}
        <section className="order-section">
          <div className="order-header">
            <h2>Current Order</h2>
            {cart.length > 0 && (
              <button className="clear-btn" onClick={() => setCart([])}>
                Clear
              </button>
            )}
          </div>
          
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>No items in cart</p>
              <p className="empty-cart-hint">Click on products to add them to your order</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="cart-item-details">
                      <h3>{item.product.name}</h3>
                      <p className="item-price">${item.product.price.toFixed(2)}</p>
                      {item.options && (
                        <p className="item-options">
                          {item.options.size}, {item.options.milk} milk
                          {item.options.extras.length > 0 && `, ${item.options.extras.join(', ')}`}
                        </p>
                      )}
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(index, -1)}>
                          <FaMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, 1)}>
                          <FaPlus />
                        </button>
                      </div>
                      <span className="item-total">${item.total.toFixed(2)}</span>
                      <button className="remove-item" onClick={() => removeFromCart(index)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              {showPayment ? (
                <div className="payment-methods">
                  <h3>Select Payment Method</h3>
                  <div className="payment-buttons">
                    <button className="payment-btn cash">
                      <FaMoneyBill />
                      <span>Cash</span>
                    </button>
                    <button className="payment-btn card">
                      <FaCreditCard />
                      <span>Card</span>
                    </button>
                  </div>
                  <button 
                    className="cancel-payment" 
                    onClick={() => setShowPayment(false)}
                  >
                    Back
                  </button>
                </div>
              ) : (
                <button 
                  className="checkout-btn" 
                  onClick={() => setShowPayment(true)}
                >
                  Proceed to Payment
                </button>
              )}
            </>
          )}
        </section>
      </div>
      
      <style jsx>{`
        .pos-container {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          height: calc(100vh - var(--header-height) - 3rem - 1.5rem);
          max-height: 800px;
        }
        
        .products-section {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }
        
        .categories {
          display: flex;
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
          overflow-x: auto;
        }
        
        .category-btn {
          padding: 0.5rem 1rem;
          background: none;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          margin-right: 0.5rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        
        .category-btn.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          padding: 1rem;
          overflow-y: auto;
          flex: 1;
        }
        
        .product-card {
          background: var(--background-light);
          border-radius: var(--radius-sm);
          padding: 0.5rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .product-image-container {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        
        .product-image-placeholder {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        
        .product-info {
          text-align: center;
        }
        
        .product-name {
          font-size: 0.875rem;
          margin: 0 0 0.25rem;
          font-weight: 500;
        }
        
        .product-price {
          font-size: 0.875rem;
          color: var(--primary-color);
          font-weight: 600;
          margin: 0;
        }
        
        .order-section {
          background: white;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }
        
        .order-header {
          padding: 1rem;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .order-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .clear-btn {
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .empty-cart {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
          padding: 2rem;
        }
        
        .empty-cart p {
          margin: 0.5rem 0;
        }
        
        .empty-cart-hint {
          font-size: 0.875rem;
          opacity: 0.7;
        }
        
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        
        .cart-item {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border-light);
        }
        
        .cart-item-details h3 {
          font-size: 1rem;
          margin: 0 0 0.25rem;
        }
        
        .item-price {
          font-size: 0.875rem;
          color: var(--text-light);
          margin: 0 0 0.25rem;
        }
        
        .item-options {
          font-size: 0.75rem;
          color: var(--text-light);
          margin: 0;
        }
        
        .cart-item-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }
        
        .quantity-control {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
        }
        
        .quantity-control button {
          background: none;
          border: none;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-medium);
        }
        
        .quantity-control span {
          padding: 0 0.5rem;
          font-size: 0.875rem;
        }
        
        .item-total {
          font-weight: 500;
        }
        
        .remove-item {
          background: none;
          border: none;
          color: var(--danger-color);
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .order-summary {
          padding: 1rem;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        .summary-row.total {
          font-weight: 600;
          font-size: 1rem;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px dashed var(--border-light);
        }
        
        .checkout-btn {
          margin: 1rem;
          padding: 0.75rem;
          background-color: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--radius-sm);
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .checkout-btn:hover {
          background-color: var(--primary-dark);
        }
        
        .payment-methods {
          padding: 1rem;
        }
        
        .payment-methods h3 {
          font-size: 1rem;
          margin: 0 0 1rem;
          text-align: center;
        }
        
        .payment-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .payment-btn {
          padding: 1.5rem 1rem;
          border: 1px solid var(--border-medium);
          background: var(--background-light);
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .payment-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        
        .payment-btn.cash {
          color: var(--secondary-color);
        }
        
        .payment-btn.card {
          color: var(--primary-color);
        }
        
        .cancel-payment {
          width: 100%;
          padding: 0.5rem;
          background: none;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        
        @media (max-width: 992px) {
          .pos-container {
            grid-template-columns: 1fr;
            height: auto;
            max-height: none;
          }
          
          .products-section, .order-section {
            height: auto;
          }
          
          .products-grid {
            max-height: 500px;
          }
          
          .cart-items {
            max-height: 300px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default POS; 