import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import PaymentSuccess from './pages/PaymentSuccess';
import WhatsAppButton from './components/WhatsAppButton';

type Page = 'home' | 'product' | 'dashboard' | 'profile' | 'support' | 'payment-success';

function App() {
  // Check URL path for initial page state (needed for payment callbacks)
  const getInitialPage = (): Page => {
    const path = window.location.pathname;
    if (path === '/payment-success') return 'payment-success';
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
    } else if (page === 'payment-success') {
      // Clear URL query params if any
      window.history.replaceState({}, '', '/payment-success');
      setCurrentPage('payment-success');
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
        {currentPage === 'payment-success' && <PaymentSuccess onNavigate={handleNavigate} />}
        <WhatsAppButton />
      </div>
    </AuthProvider>
  );
}

export default App;
