# Bean Counter - Coffee Shop ERP System (Next.js Version)

Bean Counter is a comprehensive web-based ERP (Enterprise Resource Planning) system designed specifically for small coffee shops. This system combines essential business management tools in one integrated package, helping coffee shop owners streamline operations and make data-driven decisions.

This is the Next.js version of the application, which utilizes Material-UI for a consistent and responsive user interface, allowing for easy deployment to Vercel and other platforms.

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

### Inventory Management
- Stock level tracking
- Automatic reordering notifications
- Waste recording
- Ingredient usage analytics
- Vendor management
- Transaction history with support for different transaction types (restock, usage, etc.)
- Stock level indicators and low stock warnings

### Employee Management
- Staff scheduling
- Time and attendance tracking
- Performance metrics
- Staff profiles with contact information
- Training record views
- Department filtering and search

### Customer Relationship Management
- Customer profiles and preferences
- Loyalty program management
- Customer transaction recording
- Customer feedback collection and management
- Customer listing with search and filtering capabilities

### Financial Management
- Daily sales reports
- Expense tracking
- Profit and loss reporting
- Tax calculations
- Budget management
- Account tracking
- Financial transaction management
- Comprehensive financial reporting

### Recipe and Menu Management
- Standardized recipes
- Cost calculations
- Menu pricing optimization
- Seasonal menu planning
- Recipe categories management
- Ingredient tracking integrated with inventory

### Reporting and Analytics
- Customizable reports
- Sales trends analysis
- Inventory optimization
- Customer insights
- Product performance metrics
- Interactive data visualization
- Multiple report types (sales, products, customers, inventory)
- Export capabilities

## 💻 Technologies Used

- Next.js 15.2.3
- React 19.0.0
- TypeScript
- Material-UI (MUI v6.4.8)
- Emotion (for styled components)
- MUI Icons
- MUI X Date Pickers
- Chart.js for data visualization
- date-fns for date handling

## 🚀 Getting Started

### Prerequisites
- Node.js 14.0.0 or later
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/bean-counter-erp.git
```

2. Navigate to the project directory:
```bash
cd bean-counter-erp
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

### Running the Application

#### Development Mode
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

#### Production Build
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 📱 Responsive Design

Bean Counter ERP is fully responsive and works on devices of all sizes:
- Desktop computers
- Laptops
- Tablets
- Mobile phones

The layout automatically adjusts to provide the best user experience on any screen, thanks to Material-UI's responsive design system.

## 🎨 Theming

The application uses Material-UI's theming system, making it easy to customize:

- Consistent color palette throughout the application
- Typography system for readable text at all sizes
- Customizable component styles
- Light/dark mode support (coming soon)

## 🚀 Deployment

This application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically deploy your application

For more information on deploying Next.js applications, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## 🛠️ Customization

The system is designed to be easily customizable:

- **Branding**: Update the theme in `styles/theme.ts` to match your brand
- **Menu Items**: Edit the product data to reflect your menu
- **Features**: Enable or disable features based on your business needs

## 🗂️ Project Structure

```
bean-counter-erp/
├── components/        # Reusable UI components
├── context/           # React Context for state management
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages
│   ├── api/           # API endpoints
│   ├── customers/     # Customer management pages
│   ├── finance/       # Financial management pages
│   ├── inventory/     # Inventory management pages
│   ├── pos/           # Point of Sale pages
│   ├── recipes/       # Recipe & menu management pages
│   ├── reports/       # Reporting and analytics pages
│   └── staff/         # Staff management pages
├── data/              # Mock data JSON files
├── public/            # Static assets
├── styles/            # CSS styles and theme configuration
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── next.config.js     # Next.js configuration
└── README.md          # Project documentation
```

## 📝 To-Do / Future Development

- Add user authentication and role-based access control
- Implement data persistence with a database
- Create print-friendly layouts for receipts
- Add multi-language support
- Develop mobile apps for iOS and Android
- PDF export for invoices and reports
- Unit and integration testing
- Performance optimizations
- Implement real-time notifications
- Add advanced analytics capabilities

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or feedback, please contact:
- Email: contact@beancounter-erp.com
- Twitter: @BeanCounterERP

---

*This project is a demonstration of a comprehensive coffee shop management system with a modern, responsive interface.* 