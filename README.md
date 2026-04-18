# Knowva Admin Dashboard

A comprehensive admin dashboard for managing the Knowva learning management system.

## 🚨 Quick Fix for ES Module Error

If you're seeing the "module is not defined in ES module scope" error, run:

```cmd
cd admin
ultimate-fix.bat
```

Or manually:
```cmd
cd admin
rm -rf node_modules package-lock.json .vite postcss.config.js
npm install
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account and deployment

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` file with:
   ```env
   VITE_CONVEX_URL=your_convex_deployment_url
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

## 📋 Features

### 🏠 Dashboard
- **Real-time Analytics**: Live stats on courses, students, and engagement
- **Payment Monitoring**: Track pending payment approvals
- **Quick Actions**: Fast access to common tasks
- **System Status**: Monitor platform health

### 📚 Course Management
- **Course Builder**: Create and edit courses with rich content
- **Curriculum Structure**: Organize content into units, subunits, and lessons
- **Quiz Builder**: Create assessments with multiple question types
- **Publishing Controls**: Draft and publish workflow

### 📊 Analytics & Insights
- **Student Enrollment Tracking**: Monitor registration and completion rates
- **Lesson Performance**: Identify popular and struggling content
- **Learning Progress Heatmaps**: Visualize student engagement
- **Time Analytics**: Track learning patterns and session duration

### 💳 Payment Management
- **Receipt Review**: Approve/reject payment submissions
- **User Status Management**: Control course access based on payment
- **Audit Trail**: Complete payment verification history

### 🎥 Live Sessions
- **Session Scheduling**: Plan and manage live learning events
- **Attendance Tracking**: Monitor participation
- **Meeting Integration**: Connect with video platforms

### 💬 Discussion Forums
- **Course Forums**: Manage discussions per course
- **Moderation Tools**: Pin, lock, and manage topics
- **Community Engagement**: Foster student interaction

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time database)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── QuickActionCard.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatCard.tsx
│   ├── pages/              # Main application pages
│   │   ├── Analytics.tsx
│   │   ├── CourseEditor.tsx
│   │   ├── CourseList.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Forums.tsx
│   │   ├── LiveSessions.tsx
│   │   ├── PaymentApprovals.tsx
│   │   └── QuizBuilder.tsx
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── convexClient.ts    # Convex configuration
├── public/                # Static assets
├── package.json          # Dependencies and scripts
└── vite.config.ts       # Vite configuration
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CONVEX_URL` | Convex deployment URL | Yes |

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🔐 Authentication & Security

- **Role-based Access**: Admin, instructor, and student roles
- **Payment Verification**: Manual approval workflow
- **Data Validation**: Input sanitization and validation
- **Error Handling**: Comprehensive error boundaries

## 📱 Responsive Design

The admin dashboard is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (320px - 767px)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark/Light Mode**: Automatic theme detection
- **Animations**: Smooth transitions and micro-interactions
- **Loading States**: Skeleton screens and spinners
- **Error States**: User-friendly error messages

## 🔍 Troubleshooting

### Common Issues

1. **Convex Connection Error**
   - Check `VITE_CONVEX_URL` in `.env.local`
   - Verify Convex deployment is active

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes

### Getting Help

- Check the [Convex Documentation](https://docs.convex.dev)
- Review [React Documentation](https://react.dev)
- Open an issue in the project repository

## 📈 Performance

- **Bundle Size**: Optimized with Vite tree-shaking
- **Loading Speed**: Code splitting and lazy loading
- **Real-time Updates**: Efficient Convex subscriptions
- **Caching**: Browser and CDN caching strategies

## 🔄 Updates & Maintenance

- Regular dependency updates
- Security patches
- Feature enhancements based on user feedback
- Performance optimizations

---

**Built with ❤️ for the Knowva Learning Platform**