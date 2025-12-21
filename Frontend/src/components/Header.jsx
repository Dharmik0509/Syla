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
  { name: '3pc set kurti', image: imgSuits, path: '/collections/3pc-set-kurti' },
  { name: 'Casual dress', image: imgFabrics, path: '/collections/casual-dress' },
  { name: 'Gown', image: imgLehengas, path: '/collections/gown' },
  { name: 'Indo western', image: imgBlouses, path: '/collections/indo-western' },
  { name: 'Choli saree', image: imgSarees, path: '/collections/choli-saree' },
  { name: 'Chaniya choli', image: imgDupattas, path: '/collections/chaniya-choli' },
  { name: 'Choli suit', image: imgGifts, path: '/collections/choli-suit' },
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
            <Link to="/" className="logo-link">
              <img src="/Sylalogo.png" alt="Syla" className="logo-img" />
            </Link>
          </div>

          <div className="header-right">
            {/* Icons removed as per request */}
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
