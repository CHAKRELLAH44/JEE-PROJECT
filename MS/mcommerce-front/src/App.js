import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Produits from "./pages/Produits";
import Commandes from "./pages/Commandes";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/ecommerce.css";

function Navigation() {
  const location = useLocation();

  const navStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)',
    borderBottom: '2px solid #e8d9c1',
    padding: '0',
    boxShadow: '0 2px 8px 0 rgba(61, 48, 40, 0.08)',
    marginBottom: '0',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const containerStyle = {
    maxWidth: '1600px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 40px'
  };

  const brandStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ff9a76 0%, #ff9eb7 50%, #c084fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textDecoration: 'none',
    padding: '20px 0',
    letterSpacing: '2px'
  };

  const linksStyle = {
    display: 'flex',
    gap: '8px'
  };

  const linkStyle = (path) => ({
    padding: '20px 24px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    color: location.pathname === path ? '#ff6b45' : '#6b5d52',
    borderBottom: location.pathname === path ? '3px solid #ff6b45' : '3px solid transparent',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: location.pathname === path ? 'rgba(255, 107, 69, 0.05)' : 'transparent'
  });

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={brandStyle}>
          JOSKA
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={linksStyle}>
            <Link to="/produits" style={linkStyle('/produits')}>
              Produits
            </Link>
            <Link to="/commandes" style={linkStyle('/commandes')}>
              Commandes
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Produits />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/commandes" element={<Commandes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
