import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

// Import Sidebar Images
import imgSarees from '../assets/images/IMG_6925.JPG';
import imgLehengas from '../assets/images/IMG_6926.JPG';
import imgSuits from '../assets/images/IMG_6929.JPG';
import imgDupattas from '../assets/images/IMG_6930.JPG';
import imgFabrics from '../assets/images/IMG_6931.JPG';
import imgBlouses from '../assets/images/IMG_6935.JPG';
import imgGifts from '../assets/images/IMG_6939.JPG';

const menuItems = [
  { name: 'SAREES', image: imgSarees, path: '/collections/sarees' },
  { name: 'LEHENGAS', image: imgLehengas, path: '/collections/lehengas' },
  { name: 'SUITS', image: imgSuits, path: '/collections/suits' },
  { name: 'DUPATTAS', image: imgDupattas, path: '/collections/dupattas' },
  { name: 'FABRICS', image: imgFabrics, path: '/collections/fabrics' },
  { name: 'BLOUSES', image: imgBlouses, path: '/collections/blouses' },
  { name: 'GIFTS', image: imgGifts, path: '/collections/gifts' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    toggleSidebar();
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>


        <div className="main-header">
          <div className="header-left">
            <button className="icon-btn hamburger-btn" onClick={toggleSidebar} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

          </div>

          <div className="logo-container">
            <Link to="/" className="logo-text">Syla</Link>
          </div>

          <div className="header-right">
            <button className="icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button className="icon-btn" aria-label="Account">
              <Link to="/contact" style={{ color: 'inherit' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </Link>
            </button>
            <button className="icon-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
          </div>
        </div>


      </header>

      {/* Sidebar / Drawer */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}></div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-left">
          <div className="sidebar-header">
            <span className="sidebar-title">MENU</span>
            <button className="close-btn" onClick={toggleSidebar}>
              <span className="close-text">CLOSE</span> &times;
            </button>
          </div>
          <div className="sidebar-content">
            <ul className="sidebar-links">
              <li><Link to="/" onClick={toggleSidebar}>HOME</Link></li>
              <li><Link to="/about" onClick={toggleSidebar}>ABOUT US</Link></li>
              {menuItems.map((item) => (
                <li key={item.name}
                  onMouseEnter={() => setActiveImage(item.image)}
                  onClick={() => setActiveImage(item.image)}
                >
                  <span onClick={() => handleNavigation(item.path)} style={{ cursor: 'pointer' }}>{item.name}</span>
                </li>
              ))}
              <li><Link to="/contact" onClick={toggleSidebar}>CONTACT</Link></li>
            </ul>
          </div>
        </div>

        <div className="sidebar-right">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`sidebar-image-container ${((activeImage === item.image) || (!activeImage && item === menuItems[0])) ? 'active' : ''}`}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="sidebar-image-overlay"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
