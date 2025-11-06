import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, always navigate to dashboard
      // In production, you would want to properly validate credentials
      
      // Set mock data for demonstration
      const mockUser = {
        id: 1,
        username: formData.username,
        is_admin: false
      };
      const mockToken = 'demo-token';

      // Store mock data
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Navigate to dashboard after a short delay to simulate API call
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="animated-gradient"></div>
      </div>
      
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="auth-card">
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Login to your CrackHub account</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="auth-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="auth-input"
                  />
                  <div className="mt-2 text-end">
                    <Link to="/forgot-password" className="text-sm">
                      Forgot password?
                    </Link>
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 auth-button"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>

              <div className="auth-footer">
                <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
