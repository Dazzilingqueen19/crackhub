import React, { useState } from 'react';
import { Card, Badge, Container } from 'react-bootstrap';

const QuestionAnalysis = ({ analysis, onClose }) => {
    if (!analysis) return null;

    // Define badge colors for different types
    const typeColors = {
        coding: 'primary',
        theory: 'info',
        database: 'warning',
        system_design: 'danger'
    };

    const difficultyColors = {
        easy: 'success',
        medium: 'warning',
        hard: 'danger'
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title className="mb-0">Question Analysis</Card.Title>
                    <button 
                        className="close-button" 
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div className="mb-3">
                    <h6>Question Type</h6>
                    <Badge bg={typeColors[analysis.type] || 'secondary'}>
                        {analysis.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                </div>
                <div className="mb-3">
                    <h6>Difficulty</h6>
                    <Badge bg={difficultyColors[analysis.difficulty] || 'secondary'}>
                        {analysis.difficulty.toUpperCase()}
                    </Badge>
                </div>
                <div className="mb-3">
                    <h6>Keywords</h6>
                    <div>
                        {analysis.keywords.map((keyword, index) => (
                            <Badge 
                                bg="light" 
                                text="dark" 
                                className="me-2 mb-2" 
                                key={index}
                            >
                                {keyword}
                            </Badge>
                        ))}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default QuestionAnalysis;