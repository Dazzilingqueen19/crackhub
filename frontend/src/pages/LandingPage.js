import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Header is rendered globally in App.js — don't render it here to avoid duplicates
import Footer from '../components/Footer';
import '../styles/LandingPage.css';
import { Button, Form, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';
import QuestionAnalysis from '../components/QuestionAnalysis';

const LandingPage = () => {
    const [questionText, setQuestionText] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef(null);
  const howRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToHow = () => {
    if (howRef.current) howRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className={`landing-container ${isVisible ? 'visible' : ''}`}>
        <div className="landing-overlay" />
        <div className="particles" />
        <div className="animated-gradient" />

        <div className="landing-content">
          <motion.h1
            className="landing-title"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            CrackHub
          </motion.h1>

          <motion.p
            className="landing-subtitle"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Ultimate Interview Preparation Platform
          </motion.p>

          <motion.div
            className="glitter-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Empowering Your Journey to Success
          </motion.div>

          <div ref={featuresRef} className="features-grid">
            <div className="feature-card">
              <span className="feature-emoji">💻</span>
              <h3>Company Questions</h3>
              <p>Access real interview questions from top tech companies</p>
            </div>
            <div className="feature-card">
              <span className="feature-emoji">🧠</span>
              <h3>Smart Practice</h3>
              <p>AI-powered question recommendations</p>
            </div>
            <div className="feature-card">
              <span className="feature-emoji">👥</span>
              <h3>Community</h3>
              <p>Learn from peer experiences</p>
            </div>
            <div className="feature-card">
              <span className="feature-emoji">📈</span>
              <h3>Track Progress</h3>
              <p>Monitor your preparation journey</p>
            </div>
          </div>

          {/* Question Analysis Demo */}
          <Card className="question-demo mb-4">
            <Card.Body>
              <Card.Title>Try Our AI Question Analysis</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Paste an interview question here..."
                  />
                </Form.Group>
                <Button 
                  variant="primary"
                  disabled={isAnalyzing || !questionText}
                  onClick={async () => {
                    try {
                      setIsAnalyzing(true);
                      setError(null);
                      const response = await axios.post('http://localhost:5000/api/process_question', {
                        text: questionText
                      });
                      setAnalysis(response.data.analysis);
                    } catch (err) {
                      setError('Failed to analyze question. Please try again.');
                      console.error('Analysis error:', err);
                    } finally {
                      setIsAnalyzing(false);
                    }
                  }}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Question'}
                </Button>
              </Form>
              {error && <div className="text-danger mt-2">{error}</div>}
              {analysis && (
                <QuestionAnalysis 
                  analysis={analysis} 
                  onClose={() => {
                    setAnalysis(null);
                    setQuestionText('');
                  }}
                />
              )}
            </Card.Body>
          </Card>

          <div className="cta-buttons">
            <Button
              variant="primary"
              className="get-started-btn btn-lg"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>

            <Button
              variant="outline-light"
              className="learn-more-btn btn-lg"
              onClick={scrollToHow}
            >
              Learn More
            </Button>
          </div>

          <div className="landing-stats">
            <div className="stat-item">
              <h4>1000+</h4>
              <p>Questions</p>
              <div className="stat-sparkle" />
            </div>
            <div className="stat-item">
              <h4>50+</h4>
              <p>Companies</p>
              <div className="stat-sparkle" />
            </div>
            <div className="stat-item">
              <h4>10K+</h4>
              <p>Users</p>
              <div className="stat-sparkle" />
            </div>
          </div>
        </div>
      </div>

      {/* How it works / Goals section */}
      <section ref={howRef} className="how-section">
        <div className="how-inner">
          <h2>How CrackHub Works</h2>
          <p className="how-intro">
            We combine real interview questions, AI-driven practice, and community insights to help you prepare better and faster. Our goals: surface the most relevant problems, provide fast feedback, and track progress over time.
          </p>

          <div className="how-grid">
            <div className="how-card">
              <h4>Discover</h4>
              <p>
                Find authentic interview questions from companies and tag them by topic and difficulty so you can target your practice.
              </p>
            </div>

            <div className="how-card">
              <h4>Practice</h4>
              <p>
                Take timed mock tests, run sample code with test cases, and get instant feedback to iterate quickly.
              </p>
            </div>

            <div className="how-card">
              <h4>Improve</h4>
              <p>
                Track your strengths and weaknesses with performance analytics and community tips to focus your learning.
              </p>
            </div>
          </div>

          <div className="how-goal">
            <h3>Our Goal</h3>
            <p>
              Make interview prep feel less like guesswork and more like a guided, measurable journey — so you show up confident on interview day.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;