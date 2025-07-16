import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/StoreList';
import OwnerDashboard from './pages/owner/OwnerDashboard';

import ProtectedRoute from './routes/ProtectedRoute';
import UpdatePass from './pages/user/UpdatePass';
import Navbar from './components/Navbar';

const App = () => {
  return (

    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user/*" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        <Route path='/user/UpdatePass' element={<ProtectedRoute role="user"><UpdatePass /></ProtectedRoute>} />
        <Route path="/owner/dashboard" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
