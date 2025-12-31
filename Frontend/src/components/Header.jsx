import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import API_HOST from '../config';

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

const isVideo = (url) => {
  if (!url) return false;
  return url.match(/\.(mp4|mov|avi|mkv)/i); // Removed $ anchor to handle query params
};

const Header = ({ isAnnouncementVisible }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_HOST}/api/get-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        // Map backend categories to menu structure
        // Assuming categories have name, slug (or we construct path from name)
        // If categories don't have images yet, we might need a placeholder or just omit image
        const dynamicItems = data.map(cat => ({
          name: cat.name,
          // Use category image if available, else fallback or random from assets? 
          // For now, let's try to pass the first product image or category image if available.
          // Adjusting based on Category Schema viewing previously, it has parentCategory etc.
          image: cat.image || imgSarees, // Fallback image for now
          path: `/collections/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`
        }));
        setCategories(dynamicItems);
      }
    } catch (error) {
      console.error("Failed to fetch menu items", error);
    }
  };

  const menuItemsToDisplay = categories.length > 0 ? categories : menuItems;


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    toggleSidebar();
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''} ${isAnnouncementVisible ? 'with-announcement' : ''}`}>


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
              <img src="/Syla3d_logo.png" alt="Syla" className="logo-img" />
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
              {(() => {
                const totalItems = 2 + menuItemsToDisplay.length + 1; // Home, About, Categories, Contact

                // Helper to get delay based on direction
                // OPEN (isSidebarOpen=true): Bottom -> Top (Reverse Index)
                // CLOSE (isSidebarOpen=false): Top -> Bottom (Normal Index)
                const getDelay = (index) => {
                  if (isSidebarOpen) {
                    // Opening: Start from bottom
                    return `${0.1 + ((totalItems - 1 - index) * 0.1)}s`;
                  } else {
                    // Closing: Start from top
                    return `${index * 0.1}s`;
                  }
                };

                return (
                  <>
                    <li style={{ transitionDelay: getDelay(0) }}>
                      <Link to="/" onClick={toggleSidebar}>HOME</Link>
                    </li>
                    {menuItemsToDisplay.map((item, index) => (
                      <li key={item.name}
                        style={{ transitionDelay: getDelay(index + 2) }}
                        onMouseEnter={() => setActiveImage(item.image)}
                        onClick={() => setActiveImage(item.image)}
                      >
                        <span onClick={() => handleNavigation(item.path)} style={{ cursor: 'pointer' }}>{item.name}</span>
                      </li>
                    ))}
                    <li style={{ transitionDelay: getDelay(totalItems - 1) }}>
                      <Link to="/contact" onClick={toggleSidebar}>CONTACT</Link>
                    </li>
                    <li style={{ transitionDelay: getDelay(1) }}>
                      <Link to="/about" onClick={toggleSidebar}>ABOUT US</Link>
                    </li>
                  </>
                );
              })()}
            </ul>
          </div>
        </div>

        <div className="sidebar-right">
          {menuItemsToDisplay.map((item) => (
            <div
              key={item.name}
              className={`sidebar-image-container ${((activeImage === item.image) || (!activeImage && item === menuItemsToDisplay[0])) ? 'active' : ''}`}
            >
              {item.image && isVideo(item.image) ? (
                <video
                  src={item.image}
                  className="sidebar-media"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <div
                  className="sidebar-media"
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
              )}
              <div className="sidebar-image-overlay"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
