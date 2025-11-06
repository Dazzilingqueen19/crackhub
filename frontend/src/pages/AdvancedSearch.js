import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faClock, faCode, faBuilding, faTags, faBookmark, faStar } from '@fortawesome/free-solid-svg-icons';
import './styles/AdvancedSearch.css';

const AdvancedSearch = () => {
    const [filters, setFilters] = useState({
        company: '',
        difficulty: '',
        type: '',
        keywords: '',
        timeframe: 'all'
    });

    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage] = useState(10);
    const [totalQuestions, setTotalQuestions] = useState(0);

    // Sample data - Replace with actual API call
    // Generate 50+ sample questions
    const sampleQuestions = Array.from({ length: 55 }, (_, index) => {
        const companies = ["Google", "Microsoft", "Amazon", "Facebook", "Apple", "Netflix", "Uber", "Twitter", "LinkedIn"];
        const difficulties = ["Easy", "Medium", "Hard"];
        const types = ["Coding", "System Design", "Database", "Theory"];
        const titlePrefixes = [
            "Design a", "Implement", "Optimize", "Create", "Develop", "Analyze", 
            "Build", "Solve", "Debug", "Architect"
        ];
        const titleSubjects = [
            "Distributed Cache", "Load Balancer", "Message Queue", "Rate Limiter",
            "Binary Tree Algorithm", "Database Index", "Authentication System",
            "Real-time Chat", "Payment System", "Search Engine", "Social Network Feed",
            "Recommendation System", "Machine Learning Pipeline", "CI/CD Pipeline",
            "Microservices Architecture"
        ];
        const descriptions = [
            "Design a scalable system that can handle millions of requests...",
            "Implement an efficient algorithm to solve this problem...",
            "Create a robust architecture for high availability...",
            "Optimize the database queries for better performance...",
            "Develop a solution that works in distributed environments..."
        ];
        const allTags = [
            "algorithms", "data-structures", "system-design", "database",
            "frontend", "backend", "distributed-systems", "machine-learning",
            "optimization", "scalability", "security", "caching", "networking",
            "cloud", "microservices", "api-design", "performance", "architecture"
        ];

        // Select random values for each field
        const company = companies[Math.floor(Math.random() * companies.length)];
        const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const titlePrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
        const titleSubject = titleSubjects[Math.floor(Math.random() * titleSubjects.length)];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // Generate 3-5 random tags
        const numTags = Math.floor(Math.random() * 3) + 3;
        const shuffledTags = [...allTags].sort(() => 0.5 - Math.random());
        const tags = shuffledTags.slice(0, numTags);

        // Generate random stats
        const likes = Math.floor(Math.random() * 500) + 50;
        const bookmarks = Math.floor(Math.random() * 200) + 20;
        
        // Generate random time posted
        const timeUnits = ["hours", "days", "weeks"];
        const timeAmount = Math.floor(Math.random() * 10) + 1;
        const timeUnit = timeUnits[Math.floor(Math.random() * timeUnits.length)];
        const timePosted = `${timeAmount} ${timeUnit} ago`;

        return {
            id: index + 1,
            title: `${titlePrefix} ${titleSubject}`,
            company,
            difficulty,
            type,
            description,
            tags,
            likes,
            bookmarks,
            timePosted
        };
    });

    const difficulties = ['Easy', 'Medium', 'Hard'];
    const questionTypes = ['Coding', 'Theory', 'Database', 'System Design'];
    const timeframes = [
        { value: 'all', label: 'All Time' },
        { value: 'day', label: 'Last 24 Hours' },
        { value: 'week', label: 'Last Week' },
        { value: 'month', label: 'Last Month' }
    ];

    const popularTags = [
        'algorithms', 'data-structures', 'system-design', 'database',
        'frontend', 'backend', 'distributed-systems', 'machine-learning'
    ];

    useEffect(() => {
        // Simulating initial data load
        setQuestions(sampleQuestions);
        setTotalQuestions(sampleQuestions.length);
    }, []);

    // Get current questions for pagination
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setCurrentPage(1); // Reset to first page on new search

        // Simulate API call with filters
        setTimeout(() => {
            const filteredQuestions = sampleQuestions.filter(question => {
                const matchesCompany = !filters.company || 
                    question.company.toLowerCase().includes(filters.company.toLowerCase());
                const matchesDifficulty = !filters.difficulty || 
                    question.difficulty === filters.difficulty;
                const matchesType = !filters.type || 
                    question.type === filters.type;
                const matchesKeywords = !filters.keywords ||
                    question.title.toLowerCase().includes(filters.keywords.toLowerCase()) ||
                    question.description.toLowerCase().includes(filters.keywords.toLowerCase());
                const matchesTags = selectedTags.length === 0 ||
                    selectedTags.every(tag => question.tags.includes(tag));

                return matchesCompany && matchesDifficulty && 
                       matchesType && matchesKeywords && matchesTags;
            });

            setQuestions(filteredQuestions);
            setTotalQuestions(filteredQuestions.length);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <Container className="py-4 advanced-search-page" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>
            <style>{`
                .advanced-search-page, .advanced-search-page h1, .advanced-search-page h2, .advanced-search-page h3, .advanced-search-page h4, .advanced-search-page h5, .advanced-search-page h6,
                .advanced-search-page p, .advanced-search-page small, .advanced-search-page .text-muted, .advanced-search-page .badge,
                .advanced-search-page .card, .advanced-search-page .search-card, .advanced-search-page .filter-card, .advanced-search-page .form-control,
                .advanced-search-page .btn {
                    color: #000000 !important;
                }
                .advanced-search-page .form-control::placeholder { color: #6b7280 !important; }
            `}</style>
            <Row>
                <Col md={3}>
                    <Card className="filter-sidebar mb-4">
                        <Card.Header className="bg-primary text-white">
                            <FontAwesomeIcon icon={faFilter} className="me-2" />
                            Filters
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSearch}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faBuilding} className="me-2" />
                                        Company
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter company name"
                                        value={filters.company}
                                        onChange={(e) => setFilters({...filters, company: e.target.value})}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Difficulty</Form.Label>
                                    <Form.Select
                                        value={filters.difficulty}
                                        onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                                    >
                                        <option value="">All Difficulties</option>
                                        {difficulties.map(diff => (
                                            <option key={diff} value={diff}>
                                                {diff}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faCode} className="me-2" />
                                        Question Type
                                    </Form.Label>
                                    <Form.Select
                                        value={filters.type}
                                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                                    >
                                        <option value="">All Types</option>
                                        {questionTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faClock} className="me-2" />
                                        Time Frame
                                    </Form.Label>
                                    <Form.Select
                                        value={filters.timeframe}
                                        onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
                                    >
                                        {timeframes.map(({ value, label }) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <FontAwesomeIcon icon={faTags} className="me-2" />
                                        Popular Tags
                                    </Form.Label>
                                    <div className="popular-tags">
                                        {popularTags.map(tag => (
                                            <Badge
                                                key={tag}
                                                bg={selectedTags.includes(tag) ? "primary" : "secondary"}
                                                className="tag-badge me-1 mb-1"
                                                onClick={() => {
                                                    if (selectedTags.includes(tag)) {
                                                        setSelectedTags(selectedTags.filter(t => t !== tag));
                                                    } else {
                                                        setSelectedTags([...selectedTags, tag]);
                                                    }
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Keywords</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by keywords..."
                                        value={filters.keywords}
                                        onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                                    />
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 search-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Spinner animation="border" size="sm" className="me-2" />
                                    ) : (
                                        <FontAwesomeIcon icon={faSearch} className="me-2" />
                                    )}
                                    Search Questions
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={9}>
                    <Card className="mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="mb-0">Search Results</h4>
                                <span className="text-muted">
                                    Found {questions.length} questions
                                </span>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2 text-muted">Searching questions...</p>
                                </div>
                            ) : questions.length === 0 ? (
                                <div className="text-center py-5">
                                    <p className="text-muted">No questions found matching your criteria.</p>
                                </div>
                            ) : (
                                <>
                                    {currentQuestions.map((question, index) => (
                                        <Card 
                                            key={question.id} 
                                            className="question-card mb-3"
                                            style={{ '--animation-order': index }}
                                        >
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h5 className="question-title">{question.title}</h5>
                                                        <div className="mb-2">
                                                            <Badge bg="primary" className="me-2">
                                                                {question.company}
                                                            </Badge>
                                                            <Badge 
                                                                bg={
                                                                    question.difficulty === 'Hard' ? 'danger' :
                                                                    question.difficulty === 'Medium' ? 'warning' : 'success'
                                                                }
                                                                className="me-2"
                                                            >
                                                                {question.difficulty}
                                                            </Badge>
                                                            <Badge bg="info">{question.type}</Badge>
                                                        </div>
                                                    </div>
                                                    <div className="text-muted small">
                                                        <FontAwesomeIcon icon={faClock} className="me-1" />
                                                        {question.timePosted}
                                                    </div>
                                                </div>
                                                
                                                <p className="question-description mb-3">
                                                    {question.description}
                                                </p>

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        {question.tags.map(tag => (
                                                            <Badge 
                                                                key={tag}
                                                                className={`tag-badge me-1 ${
                                                                    selectedTags.includes(tag) ? 'selected' : ''
                                                                }`}
                                                                onClick={() => {
                                                                    if (selectedTags.includes(tag)) {
                                                                        setSelectedTags(selectedTags.filter(t => t !== tag));
                                                                    } else {
                                                                        setSelectedTags([...selectedTags, tag]);
                                                                    }
                                                                }}
                                                            >
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <Button variant="outline-primary" size="sm" className="me-2">
                                                            <FontAwesomeIcon icon={faStar} className="me-1" />
                                                            {question.likes}
                                                        </Button>
                                                        <Button variant="outline-secondary" size="sm">
                                                            <FontAwesomeIcon icon={faBookmark} className="me-1" />
                                                            {question.bookmarks}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))
                                }
                                    {/* Pagination */}
                                    {!isLoading && questions.length > 0 && (
                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <div className="text-muted">
                                                Showing {indexOfFirstQuestion + 1}-{Math.min(indexOfLastQuestion, questions.length)} of {questions.length} questions
                                            </div>
                                            <div>
                                                <ul className="pagination">
                                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => paginate(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            Previous
                                                        </button>
                                                    </li>
                                                    {[...Array(Math.ceil(questions.length / questionsPerPage))].map((_, index) => (
                                                        <li
                                                            key={index + 1}
                                                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                                        >
                                                            <button
                                                                className="page-link"
                                                                onClick={() => paginate(index + 1)}
                                                            >
                                                                {index + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === Math.ceil(questions.length / questionsPerPage) ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => paginate(currentPage + 1)}
                                                            disabled={currentPage === Math.ceil(questions.length / questionsPerPage)}
                                                        >
                                                            Next
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdvancedSearch;