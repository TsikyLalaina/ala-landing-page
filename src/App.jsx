import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import NewPost from './pages/NewPost'
import Feed from './pages/Feed'
import PostDetails from './pages/PostDetails'
import GroupPostDetails from './pages/GroupPostDetails'
import Groups from './pages/Groups'
import CreateGroup from './pages/CreateGroup'
import GroupDetails from './pages/GroupDetails'
import Marketplace from './pages/Marketplace'
import CreateListing from './pages/CreateListing'
import ListingDetails from './pages/ListingDetails'
import Resources from './pages/Resources'
import ResourceDetails from './pages/ResourceDetails'
import UploadResource from './pages/UploadResource'
import Grievances from './pages/Grievances'
import FileGrievance from './pages/FileGrievance'
import GrievanceDetails from './pages/GrievanceDetails'
import CrisisAlerts from './pages/CrisisAlerts'
import CreateAlert from './pages/CreateAlert'
import CrisisDetails from './pages/CrisisDetails'
import Compliance from './pages/Compliance'
import Messages from './pages/Messages'
import Events from './pages/Events'
import Analytics from './pages/Analytics'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" />
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

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            
            <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />
            
            <Route 
              path="/feed" 
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/:id" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post/:id" 
              element={
                <ProtectedRoute>
                  <PostDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/group-post/:id" 
              element={
                <ProtectedRoute>
                  <GroupPostDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/groups" 
              element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-group" 
              element={
                <ProtectedRoute>
                  <CreateGroup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/group/:id" 
              element={
                <ProtectedRoute>
                  <GroupDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-listing" 
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/listing/:id" 
              element={
                <ProtectedRoute>
                  <ListingDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources" 
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resource/:id" 
              element={
                <ProtectedRoute>
                  <ResourceDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload-resource" 
              element={
                <ProtectedRoute>
                  <UploadResource />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/grievances" 
              element={
                <ProtectedRoute>
                  <Grievances />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/file-grievance" 
              element={
                <ProtectedRoute>
                  <FileGrievance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/grievance/:id" 
              element={
                <ProtectedRoute>
                  <GrievanceDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crisis" 
              element={
                <ProtectedRoute>
                  <CrisisAlerts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-alert" 
              element={
                <ProtectedRoute>
                  <CreateAlert />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crisis/:id" 
              element={
                <ProtectedRoute>
                  <CrisisDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/compliance" 
              element={
                <ProtectedRoute>
                  <Compliance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages/:userId" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/new-post" 
              element={
                <ProtectedRoute>
                  <NewPost />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
