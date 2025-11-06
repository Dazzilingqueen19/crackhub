import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCode, faSearch, faUserGroup, faBriefcase, faCloud, faBuilding, faClock, faDollarSign, faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './styles/InterviewExperience.css';

const InterviewExperience = () => {
    const navigate = useNavigate();

    const [experiences, setExperiences] = useState([
        {
            id: 1,
            company: 'Google',
            role: 'Senior Software Engineer',
            author: {
                name: 'John Doe',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
            },
            rounds: [
                {
                    title: 'Technical Round 1',
                    content: 'Deep dive into system design...',
                    difficulty: 'Hard'
                },
                {
                    title: 'Technical Round 2',
                    content: 'Data structures and algorithms...',
                    difficulty: 'Medium'
                }
            ],
            salary: '$150-180K',
            location: 'Mountain View, CA',
            date: '2 weeks ago',
            likes: 245,
            comments: 56
        },
        {
            id: 2,
            company: 'Microsoft',
            role: 'Software Engineer II',
            author: {
                name: 'Jane Smith',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
            },
            rounds: [
                {
                    title: 'Coding Round',
                    content: 'Questions on dynamic programming...',
                    difficulty: 'Medium'
                },
                {
                    title: 'System Design',
                    content: 'Designed a distributed cache...',
                    difficulty: 'Hard'
                }
            ],
            salary: '$140-160K',
            location: 'Redmond, WA',
            date: '1 week ago',
            likes: 189,
            comments: 42
        }
    ]);

    return (
        <Container className="py-4 interview-page" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>
            <style>{`
                .interview-page, .interview-page h1, .interview-page h2, .interview-page h3, .interview-page h4, .interview-page h5, .interview-page h6,
                .interview-page p, .interview-page small, .interview-page .text-muted, .interview-page .badge,
                .interview-page .card, .interview-page .experience-card, .interview-page .round-card, .interview-page .form-control,
                .interview-page .btn {
                    color: #000000 !important;
                }
                .interview-page .form-control::placeholder { color: #6b7280 !important; }
            `}</style>
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: 'var(--text-primary)' }}>Interview Experiences</h2>
                <Button variant="primary" className="sparkle-btn">
                    <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                    Share Your Experience
                </Button>
            </div>

            {/* Filters */}
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Select className="custom-select mb-2">
                        <option>All Companies</option>
                        <option>Google</option>
                        <option>Microsoft</option>
                        <option>Amazon</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select className="custom-select mb-2">
                        <option>All Roles</option>
                        <option>Software Engineer</option>
                        <option>Senior Engineer</option>
                        <option>Tech Lead</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select className="custom-select mb-2">
                        <option>Experience Level</option>
                        <option>Entry Level</option>
                        <option>Mid Level</option>
                        <option>Senior Level</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select className="custom-select mb-2">
                        <option>Sort By</option>
                        <option>Most Recent</option>
                        <option>Most Liked</option>
                        <option>Most Discussed</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Experience Cards */}
            {experiences.map(exp => (
                <Card key={exp.id} className="experience-card mb-4">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center">
                                <Image 
                                    src={exp.author.avatar} 
                                    alt={exp.author.name} 
                                    roundedCircle 
                                    className="me-3"
                                    width={50}
                                    height={50}
                                />
                                <div>
                                    <h5 className="mb-0">{exp.company}</h5>
                                    <p className="mb-0 text-muted">{exp.role}</p>
                                    <small className="text-muted">By {exp.author.name} • {exp.date}</small>
                                </div>
                            </div>
                            <div className="text-end">
                                <Badge bg="primary" className="me-2">
                                    <FontAwesomeIcon icon={faBuilding} className="me-1" />
                                    {exp.location}
                                </Badge>
                                <Badge bg="success">
                                    <FontAwesomeIcon icon={faDollarSign} className="me-1" />
                                    {exp.salary}
                                </Badge>
                            </div>
                        </div>

                        <div className="interview-rounds">
                            {exp.rounds.map((round, index) => (
                                <div key={index} className="round-card mb-3">
                                    <h6 className="d-flex justify-content-between">
                                        <span>{round.title}</span>
                                        <Badge bg={
                                            round.difficulty === 'Hard' ? 'danger' : 
                                            round.difficulty === 'Medium' ? 'warning' : 'success'
                                        }>
                                            {round.difficulty}
                                        </Badge>
                                    </h6>
                                    <p className="mb-0">{round.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex gap-3 mt-3">
                            <Button variant="outline-primary" className="interaction-btn">
                                <FontAwesomeIcon icon={faThumbsUp} className="me-2" />
                                {exp.likes}
                            </Button>
                            <Button variant="outline-primary" className="interaction-btn">
                                <FontAwesomeIcon icon={faComment} className="me-2" />
                                {exp.comments}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default InterviewExperience;
