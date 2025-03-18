# Bean Counter - Coffee Shop ERP System

Bean Counter is a comprehensive web-based ERP (Enterprise Resource Planning) system designed specifically for small coffee shops. This system combines essential business management tools in one integrated package, helping coffee shop owners streamline operations and make data-driven decisions.

## 🌟 Features

### Dashboard
- Real-time sales metrics and KPIs
- Inventory alerts for low stock items
- Staff scheduling overview
- Sales trends visualization
- Quick access to frequently used functions

### Point of Sale (POS)
- Fast, intuitive order processing
- Customizable drink options (size, milk type, extras)
- Customer management with loyalty tracking
- Multiple payment methods
- Order history tracking
- Receipt generation

### Inventory Management (Coming Soon)
- Stock level tracking
- Automatic reordering notifications
- Waste recording
- Ingredient usage analytics
- Vendor management

### Employee Management (Coming Soon)
- Staff scheduling
- Time and attendance tracking
- Performance metrics
- Payroll integration

### Customer Relationship Management (Coming Soon)
- Customer profiles and preferences
- Loyalty program management
- Marketing campaign tools
- Customer feedback collection

### Financial Management (Coming Soon)
- Daily sales reports
- Expense tracking
- Profit and loss reporting
- Tax calculations

### Recipe and Menu Management (Coming Soon)
- Standardized recipes
- Cost calculations
- Menu pricing optimization
- Seasonal menu planning

### Reporting and Analytics (Coming Soon)
- Customizable reports
- Sales trends analysis
- Inventory optimization
- Customer insights

## 💻 Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome Icons
- Google Fonts
- Node.js (optional, for running the local server)

No external frameworks or libraries are required for this project, making it lightweight and easy to deploy.

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of web technologies
- Node.js (optional, only if you want to use the included server)

### Installation

1. Clone this repository or download the files:
```
git clone https://github.com/yourusername/bean-counter-erp.git
```

2. Navigate to the project directory:
```
cd bean-counter-erp
```

### Running the Application

You have several options to run the application:

#### Option 1: Open Directly in Browser
Simply open the `index.html` file in your browser to access the dashboard.

#### Option 2: Using the Included Node.js Server
If you have Node.js installed, you can use the included server:

```bash
# Install dependencies (none required at the moment)
# Start the server
node server.js
```

Then visit `http://localhost:3000` in your browser.

#### Option 3: Using Python's HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then visit `http://localhost:8000` in your browser.

#### Option 4: Using npx serve
```bash
npx serve
```

Then visit the URL displayed in your terminal (typically `http://localhost:5000`).

## 📱 Responsive Design

Bean Counter ERP is fully responsive and works on devices of all sizes:
- Desktop computers
- Laptops
- Tablets
- Mobile phones

The layout automatically adjusts to provide the best user experience on any screen.

## 🔒 Security Considerations

This prototype does not include user authentication or data persistence. In a production environment, you would need to:

1. Implement user authentication and authorization
2. Set up a backend server with a database
3. Apply proper security measures for handling payments
4. Ensure data encryption for sensitive information

## 🛠️ Customization

The system is designed to be easily customizable:

- **Branding**: Update colors in the CSS variables in `styles.css` to match your brand
- **Menu Items**: Edit the products in the POS HTML to reflect your menu
- **Pricing**: Adjust prices and tax rates in the JavaScript files
- **Features**: Enable or disable features based on your business needs

## 🗂️ Project Structure

```
bean-counter-erp/
├── index.html           # Dashboard
├── pos.html             # Point of Sale system
├── 404.html             # Error page
├── styles.css           # Main stylesheet
├── pos-styles.css       # POS-specific styles
├── script.js            # Main JavaScript
├── pos-script.js        # POS-specific JavaScript
├── server.js            # Simple Node.js server
└── README.md            # This file
```

## 📝 To-Do / Future Development

- Complete additional modules (Inventory, Finance, etc.)
- Add user authentication
- Implement data persistence with a backend
- Develop reporting and analytics capabilities
- Create print-friendly layouts for receipts
- Add multi-language support
- Develop mobile apps for iOS and Android

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or feedback, please contact:
- Email: contact@beancounter-erp.com
- Twitter: @BeanCounterERP

---

*This project is a prototype created for demonstration purposes.* 