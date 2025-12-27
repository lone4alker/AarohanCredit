# AarohanCredit

> **A Modern Credit Platform Connecting MSMEs with Lenders**

AarohanCredit is a comprehensive financial technology platform that bridges the gap between Micro, Small, and Medium Enterprises (MSMEs) seeking credit and financial institutions offering loans. The platform provides intelligent loan matching, financial health analysis, and streamlined application management for both borrowers and lenders.

---

## 🌟 Features

### For MSMEs (Borrowers)
- **Smart Loan Discovery**: Search and filter loans based on eligibility, amount, tenure, and interest rates
- **Financial Health Dashboard**: Real-time analysis of business financial metrics
- **Application Tracking**: Monitor loan application status and approvals
- **Data Synchronization**: Seamless integration with accounting platforms (Tally, QuickBooks, Zoho Books)
- **Credit Score Visualization**: Interactive gauge showing creditworthiness
- **Notifications**: Real-time updates on application status and opportunities

### For Lenders (Financial Institutions)
- **Application Management**: Review and process loan applications with detailed applicant insights
- **Policy Configuration**: Define lending criteria, interest rates, and eligibility requirements
- **Analytics & Reporting**: Comprehensive dashboards with approval rates, disbursement trends, and portfolio health
- **Risk Assessment**: Automated financial health scoring and analysis
- **Notification System**: Stay updated on new applications and policy matches

---

## 🏗️ Architecture

```
AarohanCredit/
├── frontend/          # React SPA (Vite)
├── backend/           # Node.js + Express API
└── agents_platform/   # AI/ML agents for analysis
```

### Tech Stack

#### **Frontend**
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.9.6
- **Styling**: Tailwind CSS 3.4.18
- **UI Components**: 
  - Lucide React (Icons)
  - Recharts (Data Visualization)
  - OGL (WebGL Graphics)
- **State Management**: React Hooks & Context API

#### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 9.0.0
- **Authentication**: bcryptjs for password hashing
- **Environment**: dotenv for configuration
- **Development**: Nodemon for hot-reloading

#### **Deployment**
- **Frontend**: Vercel (with SPA routing configuration)
- **Backend**: Node.js hosting (configurable via environment variables)
- **Database**: MongoDB Atlas (cloud-hosted)

---

## 📁 Project Structure

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, registration components
│   │   ├── common/            # Reusable UI components
│   │   ├── Lender/            # Lender-specific components
│   │   ├── msme/              # MSME-specific components
│   │   ├── sync-modal/        # Data synchronization modals
│   │   ├── Header.jsx         # Navigation header
│   │   ├── Sidebar.jsx        # Dashboard sidebar
│   │   ├── StatCard.jsx       # Statistics display card
│   │   └── CreditScoreGauge.jsx
│   ├── pages/
│   │   ├── Landing.jsx        # Marketing landing page
│   │   ├── Login.jsx          # Authentication page
│   │   ├── MsmeDashboard.jsx  # MSME main dashboard
│   │   ├── SearchLoans.jsx    # Loan search interface
│   │   ├── LoanApplications.jsx
│   │   ├── FinHealthAnalysis.jsx
│   │   ├── LenderDashboard.jsx
│   │   ├── LenderApplications.jsx
│   │   ├── LenderPolicies.jsx
│   │   ├── LenderReports.jsx
│   │   └── LenderNotifications.jsx
│   ├── data/                  # Mock data and constants
│   ├── App.jsx                # Root component with routing
│   └── main.jsx               # Application entry point
├── public/                    # Static assets
├── vercel.json                # Vercel deployment config
├── vite.config.js             # Vite build configuration
└── tailwind.config.js         # Tailwind CSS settings
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controller/
│   │   ├── authController.js
│   │   └── loanController.js
│   ├── model/
│   │   ├── user.js            # User schema (MSME/Lender)
│   │   ├── loanApplication.js # Loan application schema
│   │   ├── policy.js          # Lender policy schema
│   │   ├── financialHealth.js # Financial metrics schema
│   │   ├── financialRecord.js # Transaction records
│   │   └── healthAnalysis.js  # Analysis results
│   └── routes/
│       ├── authRoutes.js
│       ├── loanApplicationRoutes.js
│       ├── policyRoutes.js
│       ├── financialHealthRoutes.js
│       ├── healthAnalysisRoutes.js
│       └── syncRoutes.js
├── scripts/
│   └── seedUsers.js           # Database seeding script
├── server.js                  # Express server entry point
└── .env                       # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB** (local or Atlas)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AarohanCredit.git
   cd AarohanCredit
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=your_mongodb_connection_string" > .env
   echo "PORT=5000" >> .env
   echo "NODE_ENV=development" >> .env
   
   # Seed initial data (optional)
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 🔧 Configuration

### Environment Variables

### Environment Variables

The project uses `.env` files for configuration. We have provided `.env.example` files in each directory to help you get started.

#### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and update the values:
```bash
cp backend/.env.example backend/.env
```

Required variables:
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

#### Agents Platform (`agents_platform/.env`)
Copy `agents_platform/.env.example` to `agents_platform/.env` and update the values:
```bash
cp agents_platform/.env.example agents_platform/.env
```

Required variables:
- `GEMINI_API_KEY`: Google AI Studio API Key (Required for AI features)
- `API_PORT`: Port for the Python agent service (default: 8000)
- `DB_PATH`: Path to SQLite database
- Other configuration for weights and timeouts (see file)

#### Frontend
Update API endpoints in your components to point to:
- **Development**: `http://localhost:5000/api`
- **Production**: Your deployed backend URL

### Vercel Deployment

The frontend is configured for Vercel deployment with SPA routing:

**`vercel.json`**:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Deployment Steps**:
1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend/`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Loan Applications (MSME)
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application

### Policies (Lender)
- `GET /api/policies` - Get all policies
- `POST /api/policies` - Create new policy
- `PUT /api/policies/:id` - Update policy
- `DELETE /api/policies/:id` - Delete policy

### Financial Health
- `GET /api/financial-health/:userId` - Get financial metrics
- `POST /api/financial-health` - Update financial data

### Data Sync
- `POST /api/sync/tally` - Sync Tally data
- `POST /api/sync/quickbooks` - Sync QuickBooks data
- `POST /api/sync/zoho` - Sync Zoho Books data

---

## 🧪 Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm run seed     # Seed database with initial data
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---