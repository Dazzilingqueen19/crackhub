import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isLanding = path === '/';
  const isDashboard = path === '/dashboard';
  const isLogin = path === '/login';
  const isMockTest = path === '/mock-test';
  const isCompanyPage = path.startsWith('/company');
  const isFeedbackPage = path === '/feedback';
  const isInterviewExperience = path === '/interview-experience';
  const isAdvancedSearch = path === '/advanced-search';
  const isCodeEditor = path === '/code-editor';
  const isCommunity = path === '/community';
  const isApiIntegration = path === '/api-integration';

  // Hide header on specific pages that render their own navigation
  if (isCompanyPage || isFeedbackPage || isLogin || isMockTest || 
      isInterviewExperience || isAdvancedSearch || isCodeEditor || 
      isCommunity || isApiIntegration) return null;

  const handleLogout = () => {
    // Remove auth data (if any) and navigate to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="site-header"
    >
      <Navbar expand="lg" variant="dark">
        <Container>
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Navbar.Brand as={Link} to="/">
              <span className="brand-text">CrackHub</span>
            </Navbar.Brand>
          </motion.div>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            {/* Landing page: keep brand + auth on the left, nothing on right */}
            {isLanding && (
              <>
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                </Nav>
                <Nav className="ms-auto" />
              </>
            )}

            {/* Dashboard page: show Home + Feedback; put Take Mock Test on the right and remove Login */}
            {isDashboard && (
              <>
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/feedback">Feedback</Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                  <Button 
                    as={Link} 
                    to="/mock-test"
                    variant="warning"
                    className="ms-2"
                  >
                    🎯 Take Mock Test
                  </Button>
                </Nav>
              </>
            )}

            {/* Default: show Home, Dashboard, Feedback and full auth controls */}
            {!isLanding && !isDashboard && (
              <>
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/feedback">Feedback</Nav.Link>
                  <Button 
                    as={Link} 
                    to="/mock-test"
                    variant="warning"
                    className="ms-2"
                  >
                    🎯 Take Mock Test
                  </Button>
                </Nav>
                <Nav>
                  <Button variant="outline-light" as={Link} to="/login" className="me-2">Login</Button>
                  <Button variant="primary" as={Link} to="/signup" className="me-2">Sign Up</Button>
                  <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </motion.header>
  );
};

export default Header;