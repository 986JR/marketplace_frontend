import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PhoneDetailsPage from './pages/PhoneDetailsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProfile from './pages/AdminProfile';
import PhoneForm from './pages/PhoneForm';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protect Phone Details */}
          <Route 
            path="/phone/:id" 
            element={user ? <PhoneDetailsPage /> : <Navigate to="/login" />} 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/profile" 
            element={user?.role === 'ROLE_ADMIN' ? <AdminProfile /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin/add-phone" 
            element={user?.role === 'ROLE_ADMIN' ? <PhoneForm /> : <Navigate to="/" />} 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
