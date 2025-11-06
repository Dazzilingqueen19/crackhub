import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar, Nav } from 'react-bootstrap';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/MockTest.css';

const MockTest = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('code');
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [testResults, setTestResults] = useState([]);
  const [testConfig, setTestConfig] = useState({
    duration: 60,
    numQuestions: 10,
    difficulty: 'medium',
    topics: [],
    targetCompany: ''
  });
  const [companies, setCompanies] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [results, setResults] = useState(null);

  const topics = [
    'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
    'Dynamic Programming', 'System Design', 'Database Design',
    'Object-Oriented Design', 'Behavioral'
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/companies');
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    let timer;
    if (isTestActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTestActive) {
      submitTest();
    }
    return () => clearInterval(timer);
  }, [isTestActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/generate_test', {
        company_id: testConfig.targetCompany || undefined,
        num_questions: testConfig.numQuestions,
        difficulty: testConfig.difficulty,
        topics: testConfig.topics
      });
      setCurrentTest(response.data.test);
      setTimeLeft(testConfig.duration * 60);
      setIsTestActive(true);
      setAnswers({});
    } catch (err) {
      console.error('Error generating test:', err);
    }
  };

  const submitTest = () => {
    setIsTestActive(false);
    const totalQuestions = currentTest?.length || 0;
    const attempted = Object.keys(answers).length;
    setResults({
      totalQuestions,
      attempted,
      timeSpent: testConfig.duration * 60 - timeLeft,
      score: Math.floor(Math.random() * 100)
    });
  };

  const getLanguageTemplate = (lang) => {
    switch(lang) {
      case 'python':
        return `def solution(input_str):
    # Parse input - modify based on your input format
    # Example for array input: nums = eval(input_str)
    nums = eval(input_str)
    
    # Write your solution here
    # Example: Calculate sum of array
    return sum(nums)

# Read input and print output
if __name__ == "__main__":
    input_data = input().strip()
    result = solution(input_data)
    print(str(result).lower())  # Convert bool to lowercase string if needed`;
      case 'javascript':
        return `function solution(input_str) {
    // Parse input - modify based on your input format
    // Example for array input: let nums = JSON.parse(input_str)
    let nums = JSON.parse(input_str);
    
    // Write your solution here
    // Example: Calculate sum of array
    return nums.reduce((a, b) => a + b, 0);
}

// Read input and print output
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.on('line', (input_str) => {
    const result = solution(input_str);
    console.log(typeof result === 'boolean' ? result.toString() : result);
    readline.close();
});`;
      case 'java':
        return `import java.util.*;

public class Solution {
    public static String solution(String input) {
        // Parse input - modify based on your input format
        // Example for array input:
        String[] nums = input.replaceAll("\\\\[|\\\\]", "").split(",");
        int[] arr = Arrays.stream(nums)
                         .map(String::trim)
                         .mapToInt(Integer::parseInt)
                         .toArray();
        
        // Write your solution here
        // Example: Calculate sum of array
        int sum = Arrays.stream(arr).sum();
        return String.valueOf(sum);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine().trim();
        System.out.println(solution(input));
        scanner.close();
    }
}`;
      default:
        return '';
    }
  };

  const runCode = async () => {
    try {
      const currentQuestion = currentTest[0];
      if (!currentQuestion) {
        toast.error('No question available to run');
        return;
      }

      if (!answers[0] || answers[0].trim() === '') {
        toast.error('Please write some code before running');
        return;
      }

      toast.info('Running code...');
      
      // Get test cases and use only the first one for sample run
      const testCases = getTestCases(currentQuestion);
      if (!testCases || testCases.length === 0) {
        toast.error('Test cases not available. Please try again.');
        return;
      }
      const sampleTestCase = testCases[0];
      
      const response = await axios.post('http://localhost:5000/api/execute_code', {
        code: answers[0].trim(),
        language: selectedLanguage.toLowerCase(),
        testCases: [sampleTestCase]
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data.success) {
        const results = response.data.results;
        if (!Array.isArray(results)) {
          toast.error('Invalid response from server');
          return;
        }

        setTestResults(results);
        setActiveTab('testcases');

        const firstResult = results[0];
        if (firstResult.passed) {
          toast.success('Sample test case passed! Try submitting your solution.');
        } else {
          toast.warning('Sample test case failed. Check the error and try again.');
        }
      } else {
        const errorMessage = response.data.error || 'Failed to run code';
        console.error('Run error:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error running code:', err);
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Failed to run code. Please try again.';
      toast.error(errorMessage);
      
      // Clear any stale results
      setTestResults([]);
    }
  };

  const getTestCases = (question) => {
    // If test cases are available, use them
    if (question.test_cases && question.test_cases.length > 0) {
      return question.test_cases;
    }

    // If no test cases, generate some based on question type
    const defaultTestCases = {
      array_manipulation: [
        { input: '[1, 2, 3]', output: '[1, 2, 3]' },
        { input: '[5, 4, 3, 2, 1]', output: '[1, 2, 3, 4, 5]' },
        { input: '[]', output: '[]' }
      ],
      array_sum: [
        { input: '[1, 2, 3, 4, 5]', output: '15' },
        { input: '[-1, -2, -3]', output: '-6' },
        { input: '[0]', output: '0' }
      ],
      string_manipulation: [
        { input: '"hello"', output: '"olleh"' },
        { input: '"python"', output: '"nohtyp"' },
        { input: '""', output: '""' }
      ]
    };

    return defaultTestCases.array_manipulation; // Default to array manipulation
  };

  const submitCode = async () => {
    try {
      const currentQuestion = currentTest[0];
      if (!currentQuestion) {
        toast.error('No question available to submit');
        return;
      }

      if (!answers[0] || answers[0].trim() === '') {
        toast.error('Please write some code before submitting');
        return;
      }

      // Get test cases, either from question or generate them
      const testCases = getTestCases(currentQuestion);
      if (!testCases || testCases.length === 0) {
        toast.error('Test cases not available. Please try again.');
        return;
      }

      toast.info('Submitting code...');
      
      const response = await axios.post('http://localhost:5000/api/execute_code', {
        code: answers[0].trim(),
        language: selectedLanguage.toLowerCase(),
        testCases: testCases
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      if (response.data.success) {
        const results = response.data.results;
        if (!Array.isArray(results)) {
          toast.error('Invalid response from server');
          return;
        }

        const allPassed = results.every(r => r.passed);
        setTestResults(results);
        setActiveTab('testcases');

        if (allPassed) {
          toast.success('All test cases passed! Moving to next question...');
          // Logic to move to next question or end test
        } else {
          const failedCount = results.filter(r => !r.passed).length;
          toast.warning(`${failedCount} out of ${results.length} test cases failed. Please check the results.`);
        }
      } else {
        const errorMessage = response.data.error || 'Failed to submit code';
        console.error('Submission error:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Error submitting code:', err);
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Failed to submit code. Please try again.';
      toast.error(errorMessage);
      
      // Clear any stale results
      setTestResults([]);
    }
  };

  return (
    <div className="mock-test-container">
      <div className="test-header">
        <div className="d-flex align-items-center">
          <a href="/dashboard" className="brand me-4">← CrackHub</a>
          <div className="timer-display">{formatTime(timeLeft)}</div>
        </div>
        <div>
          <Button variant="outline-light" size="sm" className="me-2" onClick={() => navigate('/dashboard')}>Exit</Button>
          {isTestActive && <Button variant="danger" size="sm" onClick={submitTest}>End Test</Button>}
        </div>
      </div>

      {!currentTest ? (
        <div className="test-config p-4">
          <Card className="config-card">
            <Card.Body>
              <h3 className="mb-4">Configure Your Test</h3>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration (minutes)</Form.Label>
                      <Form.Control
                        type="number"
                        value={testConfig.duration}
                        onChange={(e) => setTestConfig({...testConfig, duration: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Number of Questions</Form.Label>
                      <Form.Control
                        type="number"
                        value={testConfig.numQuestions}
                        onChange={(e) => setTestConfig({...testConfig, numQuestions: parseInt(e.target.value)})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Difficulty Level</Form.Label>
                  <Form.Select
                    value={testConfig.difficulty}
                    onChange={(e) => setTestConfig({...testConfig, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Target Company (Optional)</Form.Label>
                  <Form.Select
                    value={testConfig.targetCompany}
                    onChange={(e) => setTestConfig({...testConfig, targetCompany: e.target.value})}
                  >
                    <option value="">Any Company</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Topics</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {topics.map(topic => (
                      <Badge
                        key={topic}
                        bg={testConfig.topics.includes(topic) ? 'primary' : 'secondary'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setTestConfig(prev => ({
                            ...prev,
                            topics: prev.topics.includes(topic)
                              ? prev.topics.filter(t => t !== topic)
                              : [...prev.topics, topic]
                          }));
                        }}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </Form.Group>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  onClick={startTest}
                >
                  Start Mock Test
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="test-body">
          <div className="question-panel">
            <div className="current-question">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4>{currentTest[0]?.title || 'Problem'}</h4>
                <span className={`difficulty-badge ${currentTest[0]?.difficulty?.toLowerCase()}`}>
                  {currentTest[0]?.difficulty || 'Medium'}
                </span>
              </div>
              
              <div className="description-section mb-4">
                <p>{currentTest[0]?.text}</p>
              </div>

              <div className="topic-tags mb-4">
                {currentTest[0]?.topics?.map((topic, idx) => (
                  <span key={idx} className="topic-tag">{topic}</span>
                ))}
              </div>

              <div className="test-cases-section">
                <div className="sample-test">
                  <h5>Sample Test Cases</h5>
                  {currentTest[0] && (
                    <>
                      <div className="io-box">
                        <strong>Input:</strong>
                        <pre>{(() => {
                          const testCases = getTestCases(currentTest[0]);
                          return testCases[0]?.input || 'nums = [2, 7, 11, 15], target = 9';
                        })()}</pre>
                      </div>
                      <div className="io-box">
                        <strong>Expected Output:</strong>
                        <pre>{(() => {
                          const testCases = getTestCases(currentTest[0]);
                          return testCases[0]?.output || '[0, 1]';
                        })()}</pre>
                      </div>
                      <div className="mt-3">
                        <small className="text-muted">
                          Question Type: {currentTest[0].question_type || 'Array Manipulation'}
                        </small>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="constraints-section">
                <h5>Constraints:</h5>
                <ul>
                  <li>2 ≤ nums.length ≤ 10^4</li>
                  <li>-10^9 ≤ nums[i] ≤ 10^9</li>
                  <li>Only one valid answer exists</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="editor-panel">
            <div className="editor-header">
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="language-selector">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                  </select>
                </div>
                <div>
                  <Button variant="success" size="sm" className="me-2" onClick={runCode}>Run Code</Button>
                  <Button variant="primary" size="sm" onClick={submitCode}>Submit</Button>
                </div>
              </div>
              <Nav className="editor-nav">
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'code'}
                    onClick={() => setActiveTab('code')}
                  >
                    Code
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeTab === 'testcases'}
                    onClick={() => setActiveTab('testcases')}
                  >
                    Test Cases
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            <div className="editor-content">
              {activeTab === 'code' ? (
                <div className="code-editor">
                  <Form.Control
                    as="textarea"
                    rows={20}
                    value={answers[0] || getLanguageTemplate(selectedLanguage)}
                    onChange={(e) => setAnswers({...answers, 0: e.target.value})}
                    style={{ 
                      background: 'transparent',
                      color: '#e2e8f0',
                      border: 'none',
                      fontFamily: "'JetBrains Mono', monospace"
                    }}
                  />
                </div>
              ) : (
                <div className="test-cases-panel">
                  {testResults.length > 0 ? (
                    testResults.map((result, idx) => (
                      <div key={idx} className="test-case">
                        <div className="test-case-header">
                          <span>Test Case #{idx + 1}</span>
                          <Badge bg={result.passed ? "success" : "danger"}>
                            {result.passed ? "Passed" : "Failed"}
                          </Badge>
                        </div>
                        <div className="test-case-content">
                          <div className="test-io">
                            <strong>Input:</strong>
                            <pre>{result.input}</pre>
                          </div>
                          {result.passed ? (
                            <div className="test-io">
                              <strong>Output:</strong>
                              <pre>{result.actual}</pre>
                            </div>
                          ) : (
                            <>
                              <div className="test-io">
                                <strong>Expected:</strong>
                                <pre>{result.expected}</pre>
                              </div>
                              <div className="test-io">
                                <strong>Actual:</strong>
                                <pre>{result.actual}</pre>
                              </div>
                              {result.error && (
                                <div className="test-error">
                                  <strong>Error:</strong>
                                  <pre>{result.error}</pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted py-4">
                      Run your code to see test results here
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="status-bar">
              <div className="status-text">Ready</div>
              <div style={{ width: 200 }}>
                <div className="test-progress">
                  <div 
                    className="test-progress-bar"
                    style={{ width: `${(Object.keys(answers).length / currentTest.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTest;