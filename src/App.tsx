import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import BookingPage from './pages/BookingPage';
import WhatsAppButton from './components/WhatsAppButton';

type Page = 'home' | 'product' | 'dashboard' | 'profile' | 'support' | 'payment-success' | 'payment-failure' | 'booking';

function App() {
  // Check URL path for initial page state (needed for payment callbacks)
  const getInitialPage = (): Page => {
    const path = window.location.pathname;
    if (path === '/payment-success') return 'payment-success';
    if (path === '/payment-failure') return 'payment-failure';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage());
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleNavigate = (page: string, productSlug?: string) => {
    // Update URL to match page (optional but good for UX)
    if (page === 'home') window.history.pushState({}, '', '/');

    if (page === 'product' && productSlug) {
      setSelectedProduct(productSlug);
      setCurrentPage('product');
    } else if (page === 'home') {
      setCurrentPage('home');
      setSelectedProduct(null);
    } else if (page === 'dashboard') {
      setCurrentPage('dashboard');
    } else if (page === 'profile') {
      setCurrentPage('profile');
    } else if (page === 'support') {
      setCurrentPage('support');
    } else if (page === 'booking') {
      setCurrentPage('booking');
    } else if (page === 'payment-success') {
      window.history.replaceState({}, '', '/payment-success');
      setCurrentPage('payment-success');
    } else if (page === 'payment-failure') {
      window.history.replaceState({}, '', '/payment-failure');
      setCurrentPage('payment-failure');
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navbar onNavigate={handleNavigate} />
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'product' && selectedProduct && (
          <ProductPage productSlug={selectedProduct} onNavigate={handleNavigate} />
        )}
        {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'support' && <SupportPage />}
        {currentPage === 'booking' && <BookingPage onNavigate={handleNavigate} />}
        {currentPage === 'payment-success' && <PaymentSuccess onNavigate={handleNavigate} />}
        {currentPage === 'payment-failure' && <PaymentFailure onNavigate={handleNavigate} />}
        <WhatsAppButton />
      </div>
    </AuthProvider>
  );
}

export default App;
