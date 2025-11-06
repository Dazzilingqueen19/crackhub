import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faThumbsUp, faComment, faShare, faEye 
} from '@fortawesome/free-solid-svg-icons';
import './styles/Community.css';

const Community = () => {
    const [discussions, setDiscussions] = useState([
        {
            id: 1,
            title: 'Tips for System Design Interviews',
            author: {
                username: 'techie123',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techie123'
            },
            content: 'Here are my top tips for acing system design interviews...',
            upvotes: 45,
            replies: [
                {
                    id: 101,
                    author: {
                        username: 'seniordev',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seniordev'
                    },
                    content: 'Great tips! I would also add that understanding scalability patterns is crucial.',
                    upvotes: 12,
                    timestamp: '1 hour ago'
                },
                {
                    id: 102,
                    author: {
                        username: 'codepro',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=codepro'
                    },
                    content: 'Load balancing and caching strategies are often overlooked. Make sure to cover these!',
                    upvotes: 8,
                    timestamp: '30 minutes ago'
                }
            ],
            tags: ['system-design', 'interview-prep', 'architecture'],
            views: 234,
            timestamp: '2 hours ago'
        },
        {
            id: 2,
            title: 'How to prepare for Google interviews?',
            author: {
                username: 'googler',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=googler'
            },
            content: 'Sharing my experience and preparation strategy for Google interviews...',
            upvotes: 78,
            replies: [
                {
                    id: 201,
                    author: {
                        username: 'algopro',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=algopro'
                    },
                    content: 'LeetCode premium helped me a lot with Google-specific questions.',
                    upvotes: 15,
                    timestamp: '45 minutes ago'
                }
            ],
            tags: ['google', 'faang', 'interview-prep'],
            views: 567,
            timestamp: '5 hours ago'
        }
    ]);

    return (
        <Container className="py-4 community-page" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>
            <style>{`
                .community-page, .community-page h1, .community-page h2, .community-page h3, .community-page h4, .community-page h5, .community-page h6,
                .community-page p, .community-page small, .community-page .text-muted, .community-page .badge,
                .community-page .list-group-item, .community-page .discussion-card, .community-page .reply-card,
                .community-page .card, .community-page .card-body, .community-page .form-control, .community-page .btn {
                    color: #000000 !important;
                }
                .community-page .form-control::placeholder { color: #6b7280 !important; }
            `}</style>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Community Discussions</h2>
                <Button variant="primary" className="sparkle-btn">
                    <FontAwesomeIcon icon={faComment} className="me-2" />
                    Start New Discussion
                </Button>
            </div>

            <Row>
                <Col md={9}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Form className="mb-4">
                                <Form.Control
                                    type="search"
                                    placeholder="Search discussions..."
                                    className="mb-3"
                                />
                                <div className="d-flex gap-2">
                                    <Form.Select style={{ width: 'auto' }}>
                                        <option>All Categories</option>
                                        <option>Interview Experience</option>
                                        <option>Problem Solving</option>
                                        <option>Career Advice</option>
                                    </Form.Select>
                                    <Form.Select style={{ width: 'auto' }}>
                                        <option>Most Recent</option>
                                        <option>Most Viewed</option>
                                        <option>Most Replies</option>
                                    </Form.Select>
                                </div>
                            </Form>

                            <ListGroup>
                                {discussions.map(discussion => (
                                    <ListGroup.Item 
                                        key={discussion.id}
                                        className="discussion-card p-3"
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center">
                                                <Image 
                                                    src={discussion.author.avatar} 
                                                    alt={discussion.author.username}
                                                    roundedCircle 
                                                    className="me-2"
                                                    width={40}
                                                    height={40}
                                                />
                                                <div>
                                                    <h6 className="mb-0">{discussion.author.username}</h6>
                                                    <small className="text-muted">{discussion.timestamp}</small>
                                                </div>
                                            </div>
                                            <div>
                                                {discussion.tags.map(tag => (
                                                    <Badge 
                                                        key={tag} 
                                                        bg="primary" 
                                                        className="me-1"
                                                    >
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <h5>{discussion.title}</h5>
                                        <p className="mb-3">{discussion.content}</p>
                                        
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                className="d-flex align-items-center gap-1"
                                            >
                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                {discussion.upvotes}
                                            </Button>
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                className="d-flex align-items-center gap-1"
                                            >
                                                <FontAwesomeIcon icon={faComment} />
                                                Reply
                                            </Button>
                                            <div className="ms-auto d-flex align-items-center text-muted">
                                                <FontAwesomeIcon icon={faEye} className="me-1" />
                                                {discussion.views} views
                                            </div>
                                        </div>

                                        <div className="replies-section">
                                            {discussion.replies.map(reply => (
                                                <div key={reply.id} className="reply-card p-3 mb-2 bg-light rounded">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <Image 
                                                            src={reply.author.avatar} 
                                                            alt={reply.author.username}
                                                            roundedCircle 
                                                            className="me-2"
                                                            width={30}
                                                            height={30}
                                                        />
                                                        <div>
                                                            <h6 className="mb-0">{reply.author.username}</h6>
                                                            <small className="text-muted">{reply.timestamp}</small>
                                                        </div>
                                                    </div>
                                                    <p className="mb-2">{reply.content}</p>
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        className="d-flex align-items-center gap-1"
                                                    >
                                                        <FontAwesomeIcon icon={faThumbsUp} />
                                                        {reply.upvotes}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm mb-4">
                        <Card.Header>Top Contributors</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <div className="d-flex justify-content-between">
                                    <span>@techie123</span>
                                    <span>543 pts</span>
                                </div>
                            </ListGroup.Item>
                            {/* Add more contributors */}
                        </ListGroup>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Header>Trending Tags</Card.Header>
                        <Card.Body>
                            <Button variant="outline-primary" size="sm" className="me-2 mb-2">
                                #systemdesign
                            </Button>
                            <Button variant="outline-primary" size="sm" className="me-2 mb-2">
                                #algorithms
                            </Button>
                            {/* Add more tags */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Community;