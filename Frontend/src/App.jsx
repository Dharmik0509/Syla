import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy Load Pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const CollectionPage = React.lazy(() => import('./pages/CollectionPage'));
const PolicyPage = React.lazy(() => import('./pages/PolicyPage'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ProductManager = React.lazy(() => import('./pages/admin/ProductManager'));
const HeroManager = React.lazy(() => import('./pages/admin/HeroManager'));
const CategoryManager = React.lazy(() => import('./pages/admin/CategoryManager'));

// ... (Layout component remains same) ...

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/collections/:categoryId" element={<CollectionPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/pages/:pageId" element={<PolicyPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductManager />} />
              <Route path="/admin/categories" element={<CategoryManager />} />
              <Route path="/admin/hero" element={<HeroManager />} />
            </Routes>
          </Suspense>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
