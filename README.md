# NeuroCart - AI-Powered E-Commerce Platform

NeuroCart is a modern, production-grade e-commerce application featuring an AI-powered shopping assistant, dynamic product filtering, real-time search, and a localized shopping experience in Indian Rupees (₹).

## 🚀 Key Features
- **AI Shopping Assistant:** Personalized product recommendations via a smart chatbot.
- **Localized Catalog:** 80+ human-curated products with realistic Rupee-based pricing.
- **Advanced Filtering:** Dynamic category filtering and multi-criteria sorting (Price, Rating).
- **User Authentication:** Complete Login and Registration system with session persistence.
- **Responsive Design:** Premium UI built with React and Vanilla CSS.
- **Wishlist & Cart:** Full state management for a seamless shopping journey.

## 🛠️ Technology Stack
- **Frontend:** React, Vite, Lucide Icons, Axios.
- **Backend:** Node.js, Express, Sequelize, SQLite.
- **AI Simulation:** Custom recommendation engine for personalized experiences.

## 📦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/neurocart.git
   cd neurocart
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm run install-all
   ```

### Running Locally
To run both the frontend and backend in development mode:
```bash
npm run dev
```
- Frontend will be available at `http://localhost:5173`
- Backend will be available at `http://localhost:3000`

### Deployment
NeuroCart is designed for single-service deployment (where the backend serves the frontend).

1. Build the project:
   ```bash
   npm run build
   ```
   This will build the React app and move the `dist` folder into the backend.

2. Start the production server:
   ```bash
   npm start
   ```

## 📄 License
This project is licensed under the MIT License.
