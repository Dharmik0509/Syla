import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App">
        {/* Simple component to scroll to top on route change */}
        <ScrollToTop />
        <Header />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/collections/:categoryId" element={<CollectionPage />} />
              <Route path="/pages/:pageId" element={<PolicyPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
