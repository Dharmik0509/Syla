import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import AnnouncementBar from './components/AnnouncementBar';

// Lazy Load Pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const CollectionPage = React.lazy(() => import('./pages/CollectionPage'));
const PolicyPage = React.lazy(() => import('./pages/PolicyPage'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const GiveawayPage = React.lazy(() => import('./pages/GiveawayPage'));

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const ProductManager = React.lazy(() => import('./pages/admin/ProductManager'));
const HeroManager = React.lazy(() => import('./pages/admin/HeroManager'));
const CategoryManager = React.lazy(() => import('./pages/admin/CategoryManager'));
const DiscountManager = React.lazy(() => import('./pages/admin/DiscountManager'));
const AnnouncementManager = React.lazy(() => import('./pages/admin/AnnouncementManager'));
const GiveawayManager = React.lazy(() => import('./pages/admin/GiveawayManager'));

// Admin Context
import { AdminUIProvider } from './context/AdminUIContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isAnnouncementVisible, setIsAnnouncementVisible] = React.useState(false);

  return (
    <>
      {!isAdminRoute && <AnnouncementBar onActive={setIsAnnouncementVisible} />}
      {!isAdminRoute && <Header isAnnouncementVisible={isAnnouncementVisible} />}
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
              <Route path="/giveaway" element={<GiveawayPage />} />

              {/* Admin Routes - Wrapped in Provider */}
              <Route path="/admin/*" element={
                <AdminUIProvider>
                  <Routes>
                    <Route path="login" element={<AdminLogin />} />
                    <Route path="signup" element={<AdminSignup />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductManager />} />
                    <Route path="categories" element={<CategoryManager />} />
                    <Route path="hero" element={<HeroManager />} />
                    <Route path="discounts" element={<DiscountManager />} />
                    <Route path="announcements" element={<AnnouncementManager />} />
                    <Route path="giveaway" element={<GiveawayManager />} />
                  </Routes>
                </AdminUIProvider>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
