import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Terminal, Sun, Moon, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Home', path: '#home' },
    { name: 'About', path: '#about' },
    { name: 'Skills', path: '#skills' },
    { name: 'Work', path: '#project' },
    { name: 'Journey', path: '#journey' },
    { name: 'Contact', path: '#contact' },
  ];

  return (
    <>
      <header className={`nav-header ${isScrolled ? 'scrolled' : ''}`}>
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          background: isScrolled ? 'var(--nav-bg)' : 'rgba(25,15,5,0.4)',
          backdropFilter: 'blur(30px)',
          border: isScrolled ? '1px solid var(--glass-border-light)' : '1px solid rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: isScrolled ? '0 10px 40px var(--shadow-strong)' : '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <NavLink to="/" onClick={scrollToTop} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: 'Clash Display', textDecoration: 'none' }}>
            <Terminal size={20} className="text-gradient-gold" />
            <span style={{ display: 'none' }} className="nav-brand-text">Vasundhara</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path}
                className="nav-link-hover"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none'
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="icon-btn-hover"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Scroll Up Feature Button */}
            {isScrolled && (
              <motion.button 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="icon-btn-hover scroll-up-btn text-gradient-orange"
              >
                <ArrowUp size={20} />
              </motion.button>
            )}

            {/* Mobile Toggle */}
            <div className="mobile-toggle" style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                className="icon-btn-hover text-gradient-gold"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Click-Up Bottom Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                zIndex: 90
              }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '75vh',
                background: 'var(--bg-secondary)',
                zIndex: 100,
                padding: '2rem',
                borderTop: '1px solid var(--accent-orange)',
                borderTopLeftRadius: '2rem',
                borderTopRightRadius: '2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -20px 60px rgba(230,161,71,0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <span style={{ fontWeight: 600, fontSize: '1.5rem', fontFamily: 'Clash Display', color: 'var(--text-primary)' }}>Navigate</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="icon-btn-hover"
                  style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}
                >
                  <X size={24} />
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
                {navLinks.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textDecoration: 'none',
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '1rem',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                    whileHover={{ scale: 1.02, x: 10, borderColor: 'var(--accent-orange)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .nav-header {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
          width: calc(100% - 2rem);
          max-width: 800px;
          top: 2rem;
        }
        .nav-header.scrolled {
          top: 1rem;
        }
        .icon-btn-hover {
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          alignItems: center;
          justifyContent: center;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .icon-btn-hover:hover {
          background: var(--glass-border-light);
          transform: scale(1.1);
        }
        .icon-btn-hover:active {
          transform: scale(0.95);
        }
        .nav-link-hover:hover {
          color: var(--text-primary) !important;
          transform: translateY(-2px);
        }
        .desktop-nav {
          display: none !important;
        }
        .nav-brand-text {
          display: block !important;
        }
        
        /* MOBILE RESPONSIVE CLICK-UP DOCK */
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
          .nav-header {
            top: auto !important;
            bottom: 2rem !important;
          }
          .nav-header.scrolled {
            bottom: 1.5rem !important;
            top: auto !important;
          }
        }
        
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
