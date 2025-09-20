import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Routes>
            
            <Route path='/sign-in' element={currentUser ? <Navigate to="/" /> : <SignIn />} />
            <Route path='/sign-up' element={currentUser ? <Navigate to="/" /> : <SignUp />} />
            <Route path='/' element={<ProtectedRoute element={<Home />} />} />
            
            {/* Catching all route and redirecting to home if authenticated and signin if not */}
            <Route path="*" element={currentUser ? <Navigate to="/" /> : <Navigate to="/sign-in" />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}