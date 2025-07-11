import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CampaignTopLevel from './Pages/Campaign/CampaignTopLevel';
import Header from "./Components/Header";
import Landing from "./Pages/Landing/Landing";
import CreateCampaign from './Pages/Admin/Create';
import Edit from './Pages/Admin/Edit';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminLogin from './Pages/Admin/AdminLogin';
import { CampaignProvider } from './CampaignContext';
import { ENDPOINT } from './Endpoints';
import ProtectedRoute from './ProtectedRoute';

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
    <CampaignProvider>
      <div className="content">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/act/:campaignId" element={<CampaignTopLevel />} />


			<Route path="/login"   element={<AdminLogin onLogin={() => setIsAdmin(true)} />}
			/>

            {/* Protected admin routes */}
            <Route
              path="/create"
              element={
                <ProtectedRoute isLoggedIn={isAdmin}>
                  <CreateCampaign />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:campaignId"
              element={
                <ProtectedRoute isLoggedIn={isAdmin}>
                  <Edit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Admin"
              element={
                <ProtectedRoute isLoggedIn={isAdmin}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />


          </Routes>
        </Router>
      </div>
    </CampaignProvider>
  );
}

export default App;
