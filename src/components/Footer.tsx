import { Mail, MessageCircle } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="giant-footer">
      <div className="container">
        
        <h1 className="giant-footer-title">GET IN TOUCH</h1>
        
        <div className="footer-cta-box">
          <h3 className="section-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Let's build something <span className="text-gradient-orange">extraordinary.</span></h3>
          <p className="body-large" style={{ marginBottom: '2rem' }}>Ready to take your digital presence to the next level? Drop a message or connect on WhatsApp.</p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:darisi.vasundhara@gmail.com" className="btn-primary">
              <Mail size={20} /> Email Me
            </a>
            <a href="https://wa.me/917729805155" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <MessageCircle size={20} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Darisi Vasundhara. All rights reserved.</p>
          <a href="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Portfolio Admin
          </a>
        </div>
      </div>
    </footer>
  );
};
