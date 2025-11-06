import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import './styles/APIIntegration.css';
import { io } from 'socket.io-client';

// Socket server URL (adjust via env if needed)
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const APIIntegration = () => {
    const [connectedApis, setConnectedApis] = useState({
        github: false,
        linkedin: false,
        leetcode: false,
        hackerrank: false
    });

    const socketRef = useRef(null);

    useEffect(() => {
        // Connect to the backend Socket.IO namespace for integrations
        const socket = io(`${SOCKET_URL}/integrations`, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.debug('Connected to integrations socket');
        });

        socket.on('platform_status', (payload) => {
            // payload: { platform, connected, timestamp }
            if (payload && payload.platform) {
                setConnectedApis(prev => ({ ...prev, [payload.platform]: !!payload.connected }));
            }
        });

        socket.on('disconnect', () => {
            console.debug('Disconnected from integrations socket');
        });

        return () => {
            try { socket.disconnect(); } catch (e) {}
        };
    }, []);

    const handleConnect = (platform) => {
        const currently = connectedApis[platform];
        const action = currently ? 'disconnect' : 'connect';

        // If socket is connected, emit real-time request to backend
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('connect_platform', { platform, action });
            // optimistic UI update (actual state will be driven by server event)
            setConnectedApis(prev => ({ ...prev, [platform]: !currently }));
        } else {
            // fallback: toggle locally and try to reconnect socket
            setConnectedApis(prev => ({ ...prev, [platform]: !currently }));
            try {
                socketRef.current = io(`${SOCKET_URL}/integrations`, { transports: ['websocket'] });
            } catch (e) {
                console.error('Socket connect error', e);
            }
        }
    };

    return (
        <Container className="py-4 api-integration-page" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>
            <style>{`
                .api-integration-page, .api-integration-page h1, .api-integration-page h2, .api-integration-page h3, .api-integration-page h4, .api-integration-page h5, .api-integration-page h6,
                .api-integration-page p, .api-integration-page small, .api-integration-page .text-muted, .api-integration-page .badge,
                .api-integration-page .card, .api-integration-page .integration-card, .api-integration-page .form-control,
                .api-integration-page .btn {
                    color: #000000 !important;
                }
                .api-integration-page .form-control::placeholder { color: #6b7280 !important; }
            `}</style>
            <h2 className="mb-4" style={{ color: 'var(--text-primary)' }}>API Integrations</h2>
            
            <Row>
                <Col md={6} lg={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="mb-0">
                                    <GithubOutlined className="me-2" />
                                    GitHub
                                </h4>
                                <Button
                                    variant={connectedApis.github ? "danger" : "primary"}
                                    onClick={() => handleConnect('github')}
                                >
                                    {connectedApis.github ? 'Disconnect' : 'Connect'}
                                </Button>
                            </div>
                            <p className="text-muted">
                                Connect your GitHub profile to showcase your projects and contributions.
                            </p>
                            {connectedApis.github && (
                                <div className="mt-3">
                                    <small className="text-success">✓ Connected</small>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="mb-0">
                                    <LinkedinOutlined className="me-2" />
                                    LinkedIn
                                </h4>
                                <Button
                                    variant={connectedApis.linkedin ? "danger" : "primary"}
                                    onClick={() => handleConnect('linkedin')}
                                >
                                    {connectedApis.linkedin ? 'Disconnect' : 'Connect'}
                                </Button>
                            </div>
                            <p className="text-muted">
                                Import your professional experience and network from LinkedIn.
                            </p>
                            {connectedApis.linkedin && (
                                <div className="mt-3">
                                    <small className="text-success">✓ Connected</small>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="mb-0">
                                    LeetCode
                                </h4>
                                <Button
                                    variant={connectedApis.leetcode ? "danger" : "primary"}
                                    onClick={() => handleConnect('leetcode')}
                                >
                                    {connectedApis.leetcode ? 'Disconnect' : 'Connect'}
                                </Button>
                            </div>
                            <p className="text-muted">
                                Sync your LeetCode progress and solutions.
                            </p>
                            {connectedApis.leetcode && (
                                <div className="mt-3">
                                    <small className="text-success">✓ Connected</small>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={4} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="mb-0">
                                    HackerRank
                                </h4>
                                <Button
                                    variant={connectedApis.hackerrank ? "danger" : "primary"}
                                    onClick={() => handleConnect('hackerrank')}
                                >
                                    {connectedApis.hackerrank ? 'Disconnect' : 'Connect'}
                                </Button>
                            </div>
                            <p className="text-muted">
                                Import your HackerRank achievements and certificates.
                            </p>
                            {connectedApis.hackerrank && (
                                <div className="mt-3">
                                    <small className="text-success">✓ Connected</small>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default APIIntegration;