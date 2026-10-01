import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Terminal, Sun, Moon } from 'lucide-react';
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
      <header
        style={{
          position: 'fixed',
          top: isScrolled ? '1rem' : '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          transition: 'all var(--transition-normal)',
          width: 'calc(100% - 2rem)',
          maxWidth: '800px',
        }}
      >
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          background: isScrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          border: isScrolled ? '1px solid var(--glass-border-light)' : '1px solid transparent',
          borderRadius: 'var(--radius-pill)',
          boxShadow: isScrolled ? '0 10px 40px var(--shadow-strong)' : 'none'
        }}>
          <NavLink to="/" onClick={() => window.scrollTo(0,0)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: 'Clash Display', textDecoration: 'none' }}>
            <Terminal size={20} className="text-gradient-gold" />
            <span style={{ display: 'none' }} className="nav-brand-text">Vasundhara</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.path}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  transition: 'color var(--transition-fast)',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'background var(--transition-fast)'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--glass-border-light)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Toggle */}
            <div className="mobile-toggle" style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                style={{ color: 'var(--text-primary)', background: 'transparent', border: 'none', padding: '0.5rem' }}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'var(--nav-bg)',
                backdropFilter: 'blur(8px)',
                zIndex: 90
              }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '80%',
                maxWidth: '300px',
                background: 'var(--bg-secondary)',
                zIndex: 100,
                padding: '2rem',
                borderLeft: '1px solid var(--glass-border-light)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <span style={{ fontWeight: 600, fontSize: '1.25rem', fontFamily: 'Clash Display', color: 'var(--text-primary)' }}>Navigation</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', padding: '0.5rem' }}
                >
                  <X size={24} />
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      textDecoration: 'none'
                    }}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav {
          display: none !important;
        }
        .nav-brand-text {
          display: block !important;
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
