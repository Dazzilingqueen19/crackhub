import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { Button, Badge } from 'react-bootstrap';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questions, setQuestions] = useState([]);

  // ✅ Fetch company list from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/companies");
        setCompanies(res.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // ✅ Fetch questions for a company
  const viewQuestions = async (id) => {
    try {
      const r = await axios.get(`http://localhost:5000/api/company/${id}/questions`);
      setQuestions(r.data);
      setSelectedCompany(id);
    } catch (err) {
      console.error("Error loading questions:", err);
    }
  };

  // Quick preview popup state
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFull, setPreviewFull] = useState('');
  const [previewTyped, setPreviewTyped] = useState('');
  const [previewCompanyName, setPreviewCompanyName] = useState('');

  const openPreview = (company) => {
    const msg = `You're going to ace ${company.name} interviews! ✨`;
    setPreviewCompanyName(company.name);
    setPreviewFull(msg);
    setPreviewTyped('');
    setPreviewVisible(true);
  };

  // Typewriter effect
  React.useEffect(() => {
    if (!previewVisible || !previewFull) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setPreviewTyped(previewFull.slice(0, i));
      if (i >= previewFull.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [previewVisible, previewFull]);


  return (
    <div className="dashboard-container">
      <div className="dashboard-animated-bg" aria-hidden="true"></div>
      <div className="container content-overlay">
      <motion.div className="dashboard-hero text-center mb-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}>
        <h1 className="fw-bold display-5">⚡ CrackHub — Interview Intelligence Dashboard</h1>
        <p className="lead text-muted mx-auto hero-desc" style={{maxWidth:800}}>
          Study efficiently with curated company questions, targeted study tracks and performance insights. Pick a company to view common interview questions and recommended study resources (data-structures, system design, behavioral prep).
        </p>
        <div className="nav-menu mt-4 mb-3">
          <Link to="/advanced-search" className="nav-item">
            <Button variant="light" className="nav-btn">
              <i className="fas fa-search"></i>
              Advanced Search
            </Button>
          </Link>
          <Link to="/code-editor" className="nav-item">
            <Button variant="light" className="nav-btn">
              <i className="fas fa-code"></i>
              Code Editor
            </Button>
          </Link>
          <Link to="/community" className="nav-item">
            <Button variant="light" className="nav-btn">
              <i className="fas fa-users"></i>
              Community
            </Button>
          </Link>
          <Link to="/interview-experience" className="nav-item">
            <Button variant="light" className="nav-btn">
              <i className="fas fa-briefcase"></i>
              Interview Experience
            </Button>
          </Link>
          <Link to="/api-integration" className="nav-item">
            <Button variant="light" className="nav-btn">
              <i className="fas fa-cloud"></i>
              API Integration
            </Button>
          </Link>
        </div>
        <div className="mt-3">
          <Button variant="light" className="me-2" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>Explore Companies</Button>
          <Link to="/mock-test" className="me-2"><Button variant="outline-light">Mock Test</Button></Link>
          <Link to="/feedback"><Button variant="outline-light">Give Feedback</Button></Link>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center mt-5">
          <div className="loading-spinner mx-auto" role="status"></div>
          <p className="mt-3 fw-semibold text-muted">Loading companies...</p>
        </div>
      ) : (
        <div className="row">
          {companies.map((c, index) => (
            <motion.div
              key={c.id}
              className="col-lg-4 col-md-6 mb-4"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.25 }}
            >
              <div className="company-card p-3 h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h4 className="card-title fw-bold mb-0">{c.name}</h4>
                  <Badge bg="primary">{c.question_count}</Badge>
                </div>
                <p className="card-text">Common topics: <small className="text-muted">{(c.topics || 'DS, Algorithms, System Design')}</small></p>
                <p className="card-text text-muted">{c.description || 'Real interview questions gathered from community contributions and public sources — practice with realistic prompts.'}</p>
                <div className="d-grid gap-2 mt-3">
                  <Link to={`/company/${c.id}`} className="btn practice-btn">View Questions</Link>
                  <Button variant="outline-light" onClick={() => openPreview(c)}>Quick Preview</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview cloud popup */}
      {previewVisible && (
        <div className="preview-overlay" onClick={() => setPreviewVisible(false)}>
          <div className="preview-cloud" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="preview-close" onClick={() => setPreviewVisible(false)} aria-label="Close">×</button>
            <div className="preview-sparkles" aria-hidden="true">
              <span className="sp s1">✨</span>
              <span className="sp s2">✨</span>
              <span className="sp s3">✨</span>
            </div>
            <div className="preview-content">
              <h5 className="mb-2">Quick Preview — {previewCompanyName}</h5>
              <div className="typewriter"><span className="typed">{previewTyped}</span><span className="cursor">|</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Questions Section */}
      {selectedCompany && (
        <motion.div
          className="mt-5 p-4 tips-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-center text-white fw-bold mb-3">
            Interview Questions for {companies.find((c) => c.id === selectedCompany)?.name}
          </h3>
          {questions.length > 0 ? (
            <div className="row">
              {questions.map((q, i) => (
                <motion.div key={i} className="col-md-12 mb-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  <div className="tip-card p-3">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Q{i + 1}</strong>
                      <Badge bg="info">Difficulty: {(q.difficulty || 'Medium')}</Badge>
                    </div>
                    {/* Force dark, readable color inline to avoid stylesheet conflicts */}
                    <p className="mb-0 question-text" style={{ color: '#0b1220', textShadow: 'none' }}>{q.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary">No questions found.</p>
          )}
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
