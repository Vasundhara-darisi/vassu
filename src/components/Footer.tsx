export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--glass-border-light)',
      padding: '2rem 0',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          <p style={{ color: 'var(--text-muted)' }}>&copy; {currentYear} Darisi Vasundhara. All rights reserved.</p>
          <a href="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} aria-label="Portfolio Admin">
            Portfolio Admin
          </a>
        </div>
      </div>
    </footer>
  );
};
