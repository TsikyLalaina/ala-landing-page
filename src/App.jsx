import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { lazy, Suspense, useEffect } from 'react'
import i18n from './i18n.js'

// Eager-load the landing page for instant LCP
import Landing from './pages/Landing'

// Lazy-load all other pages for code splitting
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Profile = lazy(() => import('./pages/Profile'))
const NewPost = lazy(() => import('./pages/NewPost'))
const Feed = lazy(() => import('./pages/Feed'))
const PostDetails = lazy(() => import('./pages/PostDetails'))
const GroupPostDetails = lazy(() => import('./pages/GroupPostDetails'))
const Groups = lazy(() => import('./pages/Groups'))
const CreateGroup = lazy(() => import('./pages/CreateGroup'))
const GroupDetails = lazy(() => import('./pages/GroupDetails'))
const Marketplace = lazy(() => import('./pages/marketplace/Marketplace'))
const CreateListing = lazy(() => import('./pages/CreateListing'))
const ListingDetails = lazy(() => import('./pages/ListingDetails'))
const MyOrders = lazy(() => import('./pages/MyOrders'))
const Resources = lazy(() => import('./pages/Resources'))
const ResourceDetails = lazy(() => import('./pages/ResourceDetails'))
const UploadResource = lazy(() => import('./pages/UploadResource'))
const Grievances = lazy(() => import('./pages/Grievances'))
const FileGrievance = lazy(() => import('./pages/FileGrievance'))
const GrievanceDetails = lazy(() => import('./pages/GrievanceDetails'))
const CrisisAlerts = lazy(() => import('./pages/CrisisAlerts'))
const CreateAlert = lazy(() => import('./pages/CreateAlert'))
const CrisisDetails = lazy(() => import('./pages/CrisisDetails'))
const Compliance = lazy(() => import('./pages/Compliance'))
const Messages = lazy(() => import('./pages/Messages'))
const Events = lazy(() => import('./pages/Events'))
const Analytics = lazy(() => import('./pages/Analytics'))
const AdminGrievances = lazy(() => import('./pages/AdminGrievances'))
const AdminUsers = lazy(() => import('./pages/AdminUsers'))

const LoadingFallback = () => (
  <div style={{
    minHeight: '100vh',
    background: '#0B3D2E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      width: 40,
      height: 40,
      border: '3px solid #2E5E4E',
      borderTopColor: '#4ADE80',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" />
  return children
}

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return null
  if (!user || !isAdmin) return <Navigate to="/feed" />
  return children
}

const OnboardingRoute = ({ children }) => {
  const { user, isOnboarded, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" />
  if (isOnboarded) return <Navigate to="/feed" />
  return children
}

const PublicRoute = ({ children }) => {
  const { user, isOnboarded, loading } = useAuth()
  if (loading) return null
  if (user) {
    if (!isOnboarded) return <Navigate to="/onboarding" />
    return <Navigate to="/feed" />
  }
  return children
}

// Dynamically update <html lang="..."> when language changes
function LanguageWatcher() {
  useEffect(() => {
    const updateLang = (lng) => {
      document.documentElement.lang = lng || 'en'
    }
    updateLang(i18n.language)
    i18n.on('languageChanged', updateLang)
    return () => i18n.off('languageChanged', updateLang)
  }, [])
  return null
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LanguageWatcher />
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              
              <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
              
              <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
              <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/post/:id" element={<ProtectedRoute><PostDetails /></ProtectedRoute>} />
              <Route path="/group-post/:id" element={<ProtectedRoute><GroupPostDetails /></ProtectedRoute>} />
              <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
              <Route path="/create-group" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
              <Route path="/group/:id" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
              <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
              <Route path="/listing/:id" element={<ProtectedRoute><ListingDetails /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
              <Route path="/resource/:id" element={<ProtectedRoute><ResourceDetails /></ProtectedRoute>} />
              <Route path="/upload-resource" element={<ProtectedRoute><UploadResource /></ProtectedRoute>} />
              <Route path="/admin/grievances" element={<AdminRoute><AdminGrievances /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/grievances" element={<ProtectedRoute><Grievances /></ProtectedRoute>} />
              <Route path="/file-grievance" element={<ProtectedRoute><FileGrievance /></ProtectedRoute>} />
              <Route path="/grievance/:id" element={<ProtectedRoute><GrievanceDetails /></ProtectedRoute>} />
              <Route path="/crisis" element={<ProtectedRoute><CrisisAlerts /></ProtectedRoute>} />
              <Route path="/create-alert" element={<ProtectedRoute><CreateAlert /></ProtectedRoute>} />
              <Route path="/crisis/:id" element={<ProtectedRoute><CrisisDetails /></ProtectedRoute>} />
              <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/new-post" element={<ProtectedRoute><NewPost /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
