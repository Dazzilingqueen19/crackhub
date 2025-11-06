import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCode, faSearch, faUserGroup, faBriefcase, faCloud } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';

const BaseLayout = ({ children, title }) => {
    const navigate = useNavigate();

    const dashboardLinks = [
        { path: '/advanced-search', icon: faSearch, text: 'Advanced Search' },
        { path: '/code-editor', icon: faCode, text: 'Code Editor' },
        { path: '/community', icon: faUserGroup, text: 'Community' },
        { path: '/interview-experience', icon: faBriefcase, text: 'Interview Experience' },
        { path: '/api-integration', icon: faCloud, text: 'API Integration' }
    ];

    return (
        <div className="page-container">
            <Container>
                {/* Dashboard Navigation */}
                <div className="nav-container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Button 
                            variant="outline-light" 
                            className="back-btn"
                            onClick={() => navigate('/dashboard')}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                            Back to Dashboard
                        </Button>
                        <div className="d-flex gap-3">
                            {dashboardLinks.map(link => (
                                <Button
                                    key={link.path}
                                    variant={window.location.pathname === link.path ? "primary" : "outline-light"}
                                    className="nav-link-btn"
                                    onClick={() => navigate(link.path)}
                                >
                                    <FontAwesomeIcon icon={link.icon} className="me-2" />
                                    {link.text}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Page Title */}
                {title && <h1 className="page-title mb-4">{title}</h1>}

                {/* Page Content */}
                {children}
            </Container>
        </div>
    );
};

export default BaseLayout;