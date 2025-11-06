import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Badge } from "react-bootstrap";
import '../styles/CompanyQuestions.css';

const CompanyQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [questions, setQuestions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let got = false;
    axios.get(`http://localhost:5000/api/company/${id}/questions`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setQuestions(res.data);
          got = true;
        }
      })
      .catch(() => {
        // ignore — fallback below
      })
      .finally(() => {
        // fetch company metadata
        axios.get(`http://localhost:5000/api/companies`)
          .then(res => {
            const comp = res.data.find(c => c.id === parseInt(id));
            if (comp) setCompany(comp.name);
          })
          .catch(() => {});

        // if no live questions, generate fallback samples
        setTimeout(() => {
          if (!got) {
            const companyName = company || `Company ${id}`;
            const fallback = generateFallbackQuestions(companyName, 60);
            setQuestions(fallback);
            setIsFallback(true);
          }
        }, 200); // slight delay so company name may resolve
      });
  }, [id]);


  // create 50+ randomized sample questions when live data unavailable
  const generateFallbackQuestions = (companyName, count = 60) => {
    const topics = [
      'Arrays', 'Strings', 'Hashing', 'Dynamic Programming', 'Graphs', 'Trees', 'Greedy', 'Two Pointers', 'Sliding Window', 'System Design'
    ];
    const verbs = [
      'Find', 'Compute', 'Determine', 'Design', 'Optimize', 'Count', 'Check', 'Return', 'Sort', 'Merge'
    ];
    const objects = [
      'maximum subarray sum', 'minimum operations', 'longest increasing subsequence', 'shortest path', 'balanced partitions', 'valid parentheses', 'unique triplets', 'pair sums', 'matrix rotations', 'kth largest element'
    ];
    const templates = [
      (v,o) => `${v} the ${o} in an array of integers`,
      (v,o) => `${v} whether a binary tree is ${o}`,
      (v,o) => `${v} the ${o} given constraints on time and memory`,
      (v,o) => `${v} an algorithm to ${o} with optimal complexity`,
      (v,o) => `${v} the ${o} and explain trade-offs`
    ];

    const out = [];
    for (let i = 0; i < count; i++) {
      const v = verbs[Math.floor(Math.random() * verbs.length)];
      const o = objects[Math.floor(Math.random() * objects.length)];
      const t = templates[Math.floor(Math.random() * templates.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      out.push({ text: t(v,o), difficulty: ['Easy','Medium','Hard'][Math.floor(Math.random()*3)], topic });
    }
    return out;
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      company,
      text: feedback,
      created_at: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('submissions') || '[]');
    existing.unshift(entry);
    localStorage.setItem('submissions', JSON.stringify(existing));
    // Simple UX feedback
    alert('Thanks — your submission was saved.');
    setFeedback("");
  };

  return (
    <Container className="company-questions-container mt-4">
      <div className="d-flex align-items-center mb-3">
        <Button variant="outline-primary" className="me-3" onClick={() => navigate('/dashboard')}>← Back to Dashboard</Button>
        <h2 className="mb-0">{company} Interview Questions</h2>
      </div>
      {questions.map((q, i) => (
        <Card key={i} className="mb-2 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <strong className="me-2">Q{i + 1}:</strong>
                {isFallback && <Badge bg="secondary" className="me-2">Sample</Badge>}
                {q.difficulty && <Badge bg={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'danger'} className="me-2">{q.difficulty}</Badge>}
                {q.topic && <Badge bg="info">{q.topic}</Badge>}
              </div>
            </div>
            <p className="mb-0">{q.text}</p>
          </Card.Body>
        </Card>
      ))}

      <h4 className="mt-4">💬 Give Your Feedback</h4>
      <Form onSubmit={submitFeedback}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Write your feedback or your answer..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" variant="primary">Submit Feedback</Button>
      </Form>
    </Container>
  );
};

export default CompanyQuestions;
