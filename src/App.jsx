import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import SideNav from './components/SideNav'
import TopBar from './components/TopBar'
import Landing from './pages/Landing'
import Movies from './pages/Movies'
import YourVideos from './pages/YourVideos'
import MovieDetail from './pages/MovieDetail'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

/*
 * Root app component. Defines the routing structure and wraps all pages
 * inside a navigation bar. Pages requiring authentication are wrapped
 * inside Clerk's SignedIn component; unauthenticated users are
 * redirected to sign in via RedirectToSignIn.
 */

export default function App () {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0d0f11', color: '#fff' }}>
      {/* Permanent sidebar */}
      <SideNav />
      {/* Main content area */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/movies' element={<Movies />} />
            <Route path='/movies/:id' element={<MovieDetail />} />
            <Route path='/your-videos' element={<YourVideos />} />
            <Route path='/profile' element={<Profile />} />
            <Route
              path='/dashboard'
              element={(
                <SignedIn>
                  <Dashboard />
                </SignedIn>
              )}
            />
            <Route
              path='/settings'
              element={(
                <SignedIn>
                  <Settings />
                </SignedIn>
              )}
            />
            {/* Fallback route for unknown paths */}
            <Route path='*' element={<Landing />} />
          </Routes>
        </div>
        {/* Redirect unauthenticated users visiting protected routes */}
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </div>
    </div>
  )
}