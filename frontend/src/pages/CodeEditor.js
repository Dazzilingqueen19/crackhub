import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import MonacoEditor from 'react-monaco-editor';
import './styles/CodeEditor.css';

const CodeEditor = () => {
    const [code, setCode] = useState('// Write your code here');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [output, setOutput] = useState('');

    const languages = [
        'javascript',
        'python',
        'java',
        'cpp',
        'csharp'
    ];

    const themes = [
        { value: 'vs-dark', label: 'Dark' },
        { value: 'vs-light', label: 'Light' }
    ];

    const editorOptions = {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: true,
        minimap: {
            enabled: false
        }
    };

    const handleRunCode = () => {
        // TODO: Implement code execution
        setOutput('Code execution feature coming soon...');
    };

    return (
        <Container fluid className="py-4 code-editor-page" style={{ background: 'var(--bg-light)', color: 'var(--text-primary)' }}>
            <style>{`
                .code-editor-page, .code-editor-page h1, .code-editor-page h2, .code-editor-page h3, .code-editor-page h4, .code-editor-page h5, .code-editor-page h6,
                .code-editor-page p, .code-editor-page small, .code-editor-page .text-muted, .code-editor-page .badge,
                .code-editor-page .card, .code-editor-page .editor-card, .code-editor-page .output-card, .code-editor-page .form-control,
                .code-editor-page .btn {
                    color: #000000 !important;
                }
                .code-editor-page .form-control::placeholder { color: #6b7280 !important; }
            `}</style>
            <h2 className="mb-4" style={{ color: 'var(--text-primary)' }}>Interactive Code Editor</h2>
            <Row>
                <Col md={9}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-3">
                                <Form.Select 
                                    style={{ width: 'auto' }}
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    {languages.map(lang => (
                                        <option key={lang} value={lang}>
                                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Select
                                    style={{ width: 'auto' }}
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                >
                                    {themes.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label} Theme
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>
                            <div style={{ height: '500px', border: '1px solid #ccc' }}>
                                <MonacoEditor
                                    width="100%"
                                    height="100%"
                                    language={language}
                                    theme={theme}
                                    value={code}
                                    options={editorOptions}
                                    onChange={setCode}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <h5 className="mb-3">Actions</h5>
                            <Button 
                                variant="primary" 
                                className="w-100 mb-3"
                                onClick={handleRunCode}
                            >
                                Run Code
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                className="w-100"
                                onClick={() => setCode('// Write your code here')}
                            >
                                Reset Code
                            </Button>
                        </Card.Body>
                    </Card>
                    <Card className="shadow-sm">
                        <Card.Header>Output</Card.Header>
                        <Card.Body>
                            <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                {output || 'No output yet'}
                            </pre>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CodeEditor;