import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./Components/Header";
import Landing from "./Pages/Landing/Landing";
import { CampaignProvider } from './CampaignContext';
import { ENDPOINT } from './Endpoints';
import ProtectedRoute from './ProtectedRoute';
import Footer from './Components/Footer';
import {Box} from '@mui/material'

const CampaignTopLevel = lazy(() => import('./Pages/Campaign/CampaignTopLevel'));
const CreateCampaign = lazy(() => import('./Pages/Admin/Create'));
const Edit = lazy(() => import('./Pages/Admin/Edit'));
const AdminDashboard = lazy(() => import('./Pages/Admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./Pages/Admin/AdminLogin'));

const LoadingFallback = () => (
  <Box
    sx={{
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 700,
    }}
  >
    Loading...
  </Box>
);

const WithCampaigns = ({ children }) => (
  <CampaignProvider>{children}</CampaignProvider>
);

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    fetch(`${ENDPOINT}verify`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) setIsAdmin(true);
      })
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  if (checkingAuth) {
    return <div>Checking authentication...</div>;
  }

  return (
   <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',   // fill the viewport height
        }}
        className="content"
      >        <Router>
          <Header />

             <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

          <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/act/:campaignId" element={<WithCampaigns><CampaignTopLevel /></WithCampaigns>} />


			<Route path="/login"   element={<AdminLogin onLogin={() => setIsAdmin(true)} />}
			/>

            {/* Protected admin routes */}
            <Route
              path="/create"
              element={
                <ProtectedRoute isLoggedIn={isAdmin}>
                  <WithCampaigns><CreateCampaign /></WithCampaigns>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:campaignId"
              element={
                <ProtectedRoute isLoggedIn={isAdmin}>
                  <WithCampaigns><Edit /></WithCampaigns>
                </ProtectedRoute>
              }
            />
            <Route
              path="/Admin"
              element={
                <ProtectedRoute isLoggedIn={isAdmin}>
                  <WithCampaigns><AdminDashboard /></WithCampaigns>
                </ProtectedRoute>
              }
            />


          </Routes>
          </Suspense>

          </Box>
          <Footer />
        </Router>
      </Box>
  );
}

export default App;
