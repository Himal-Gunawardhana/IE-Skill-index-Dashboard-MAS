# IE Skill Index Analytics Dashboard

🔍 Real-time web dashboard for visualizing Industrial Engineering skill assessment data from MAS Kreeda Balangoda's sewing operations.

![Dashboard](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange)
![Material--UI](https://img.shields.io/badge/Material--UI-5.14.20-blue)

## ✨ Features

- 📊 **Real-time Analytics** - Live data updates using Firebase Firestore listeners
- 📈 **Interactive Charts** - Efficiency trends, skill distribution, shift comparisons
- 👥 **Worker Performance Tracking** - Individual and team performance metrics
- 🏭 **Operations Analysis** - Machine type performance and operation efficiency
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- 🔐 **Secure Authentication** - Firebase admin authentication
- 📥 **Data Export** - Export data to Excel/CSV formats
- 🎨 **Modern UI** - Material Design components with custom theming

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI)
- **Charts**: Recharts
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: React Context API + Hooks
- **Date Handling**: date-fns
- **Routing**: React Router v6
- **Export**: xlsx library

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 16+ installed
- npm or yarn package manager
- Firebase account with Firestore database
- Admin access credentials

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd "IE Skill index dashboard"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   The environment variables are already configured in `.env`:

   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyCH_1AIHw6KQRl_l961rpFTSaEFKPkZGxw
   REACT_APP_FIREBASE_AUTH_DOMAIN=ie-skill-index.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=ie-skill-index
   REACT_APP_FIREBASE_STORAGE_BUCKET=ie-skill-index.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=600671008111
   REACT_APP_FIREBASE_APP_ID=1:600671008111:web:709d08386b58f52000649a
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Login

1. Navigate to the login page
2. Enter admin credentials (Firebase authenticated email/password)
3. Access the dashboard

### Dashboard Features

#### **Dashboard Overview**

- View KPI cards: Total Assessments, Average Efficiency, Average FTT, Total Workers, Active Styles, Active Operations
- Filter data by time range (7 days, 30 days, 90 days, All time)
- View efficiency trends, skill level distribution, shift comparisons, and top performers

#### **Assessments Page**

- View all assessments in a sortable, filterable data table
- Filter by shift, skill level, EPF, or worker name
- Click on any row to view detailed assessment information
- Export data to Excel or CSV

#### **Workers Analytics**

- View all workers with performance metrics
- Sort by efficiency, FTT, or assessment count
- Analyze individual worker performance

#### **Operations Analytics**

- View all operations with machine type information
- Compare performance across different operations
- Identify high/low performing operations

#### **Styles Analytics**

- Analyze performance by garment style
- See operation count per style
- Compare efficiency across styles

#### **Machine Types**

- View performance by machine type
- Pie chart showing machine type distribution
- Bar chart comparing efficiency

#### **Reports**

- Generate daily production reports
- View module performance (1-26)
- Compare shift A vs shift B
- Export reports to Excel

## 📊 Data Structure

The dashboard reads from the following Firestore collections:

### Assessments Collection

```typescript
{
  styleId: string
  styleName: string
  operationId: string
  operationName: string
  smv: number
  machineType: string
  shift: "A" | "B"
  teamMember: string
  epf: string
  date: Timestamp
  responsibleIE: string
  moduleNumber: number (1-26)
  timerValues: number[]
  numberOfGoodGarments: number
  ssv: number
  averageTime: number
  efficiency: number
  ftt: number
  skillLevel: number (1-4)
  createdBy: string
}
```

### Skill Levels

- **Level 1 (Beginner)**: FTT 100%, Efficiency < 40% - Red
- **Level 2 (Intermediate)**: FTT 100%, Efficiency 40-60% - Orange
- **Level 3 (Advanced)**: FTT 100%, Efficiency 60-80% - Blue
- **Level 4 (Expert)**: FTT 100%, Efficiency > 80% - Green

## 🚢 Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Option 2: GitHub Pages

1. Update `package.json` homepage field:

   ```json
   "homepage": "https://[username].github.io/[repo-name]"
   ```

2. Add GitHub secrets for environment variables

3. Deploy:
   ```bash
   npm run deploy
   ```

### GitHub Actions Workflow

A GitHub Actions workflow is included in `.github/workflows/deploy.yml` for automatic deployment.

## 🔒 Security

### Firebase Security Rules

Ensure your Firestore has proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /assessments/{document} {
      allow read: if request.auth != null;
      allow write: if false; // Dashboard is read-only
    }
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
    }
    match /styles/{document} {
      allow read: if request.auth != null;
    }
    match /operations/{document} {
      allow read: if request.auth != null;
    }
  }
}
```

## 📁 Project Structure

```
src/
├── components/
│   ├── cards/          # KPI and metric cards
│   ├── charts/         # Recharts components
│   ├── layout/         # Layout and navigation
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── hooks/
│   └── useAssessments.ts # Custom hooks
├── pages/
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Assessments.tsx # Assessments table
│   ├── Workers.tsx     # Worker analytics
│   ├── Operations.tsx  # Operations analytics
│   ├── Styles.tsx      # Styles analytics
│   ├── MachineTypes.tsx # Machine type analytics
│   ├── Reports.tsx     # Reports page
│   └── Login.tsx       # Login page
├── services/
│   ├── firebase.ts     # Firebase configuration
│   ├── assessmentService.ts
│   └── analyticsService.ts
├── types/
│   └── index.ts        # TypeScript interfaces
├── utils/
│   ├── calculations.ts # Calculation functions
│   ├── dateHelpers.ts  # Date utilities
│   └── exportHelpers.ts # Export functions
├── App.tsx
├── index.tsx
└── index.css
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## 📊 Performance

- Lighthouse Score: 90+
- Real-time data updates
- Optimized chart rendering
- Lazy loading for large datasets
- Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

MIT License - MAS Kreeda Balangoda

## 📧 Support

For support or questions, contact: [your-email@example.com]

## 🎉 Acknowledgments

- MAS Kreeda Balangoda Industrial Engineering Team
- React and Material-UI communities
- Firebase team

---

**Built with ❤️ for MAS Kreeda Balangoda**
