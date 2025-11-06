import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../styles/Feedback.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [submissions, setSubmissions] = useState([]); // questions submitted from company pages
  const [form, setForm] = useState({ rating: 5, comment: '', company: '' });

  const navigate = useNavigate();

  // clickable stars
  const setRating = (r) => setForm({ ...form, rating: r });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('feedbacks') || '[]');
    const subs = JSON.parse(localStorage.getItem('submissions') || '[]');
    setFeedbacks(saved);
    setSubmissions(subs);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      rating: form.rating,
      comment: form.comment,
      company: form.company || 'General',
      created_at: new Date().toISOString()
    };
    const updated = [entry, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem('feedbacks', JSON.stringify(updated));
    setForm({ rating: 5, comment: '', company: '' });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-animated-bg" aria-hidden="true"></div>
      <div className="container content-overlay">
        <div className="d-flex align-items-center mb-3">
          <Button variant="outline-primary" className="me-3" onClick={() => navigate('/dashboard')}>← Back to Dashboard</Button>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-0">Feedback & Submissions</motion.h2>
        </div>

        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Submit Feedback</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g., Amazon"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <div className="star-row mb-2">
                      {[1,2,3,4,5].map((s) => (
                        <button type="button" key={s} className={`star-btn ${s <= form.rating ? 'active' : ''}`} onClick={() => setRating(s)} aria-label={`Rate ${s}`}>
                          {s <= form.rating ? '★' : '☆'}
                        </button>
                      ))}
                      <small className="ms-2 text-muted">{form.rating} / 5</small>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Comments</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      placeholder="Share your thoughts..."
                    />
                  </Form.Group>
                  <div className="text-end">
                    <Button type="submit" variant="success" className="send-btn">Send Feedback</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Card.Title>Recent Feedback</Card.Title>
                {feedbacks.length === 0 && <p className="text-muted">No feedback yet.</p>}
                {feedbacks.map((f) => (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-3 feedback-item p-3 rounded-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <strong className="company-name">{f.company}</strong>
                        <div className="rating-small">{Array.from({length:5}).map((_,i)=> <span key={i} className={`mini-star ${i < f.rating ? 'filled' : ''}`}>★</span>)}</div>
                      </div>
                      <small className="text-muted">{new Date(f.created_at).toLocaleString()}</small>
                    </div>
                    <p className="mb-0 text-muted">{f.comment}</p>
                  </motion.div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Submitted Questions / Company Submissions</Card.Title>
                {submissions.length === 0 && <p className="text-muted">No submissions yet.</p>}
                {submissions.map((s) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-3 submission-item p-3 rounded-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <strong className="company-name">{s.company || 'Unknown'}</strong>
                        <div className="text-muted small">{s.type || 'Question Submission'}</div>
                      </div>
                      <small className="text-muted">{new Date(s.created_at).toLocaleString()}</small>
                    </div>
                    <p className="mb-0">{s.text}</p>
                  </motion.div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Feedback;
