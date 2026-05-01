import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '80px 16px' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#C0272D' }}>Page Not Found</h2>
                  <a href="/" className="btn-primary" style={{ marginTop: 16, display: 'inline-block' }}>Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}