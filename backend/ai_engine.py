# Advanced adaptive mock test engine with customization support
import random
from sqlalchemy import func, or_
from models import Question, db

def analyze_question_type(text):
    """Analyze question text to determine its type and generate appropriate test cases."""
    if not text:
        return 'unknown', []
        
    text = text.lower()
    
    # Common problem patterns and their test cases
    patterns = {
        'array_sum': {
            'keywords': ['sum', 'total', 'add', 'calculate sum', 'find sum'],
            'test_cases': [
                {'input': '[1, 2, 3, 4, 5]', 'output': '15', 'description': 'Test with positive numbers'},
                {'input': '[-1, -2, -3, -4, -5]', 'output': '-15', 'description': 'Test with negative numbers'},
                {'input': '[0]', 'output': '0', 'description': 'Test with single zero'},
                {'input': '[]', 'output': '0', 'description': 'Test with empty array'}
            ]
        },
        'two_sum': {
            'keywords': ['two sum', 'pair', 'adds up to', 'target sum', 'two numbers sum'],
            'test_cases': [
                {'input': '[2, 7, 11, 15], 9', 'output': '[0, 1]', 'description': 'Test with valid pair'},
                {'input': '[3, 2, 4], 6', 'output': '[1, 2]', 'description': 'Test with pair in different order'},
                {'input': '[3, 3], 6', 'output': '[0, 1]', 'description': 'Test with duplicate numbers'},
                {'input': '[1, 2, 3], 7', 'output': '[]', 'description': 'Test with no valid pair'}
            ]
        },
        'palindrome': {
            'keywords': ['palindrome', 'reads the same', 'reverse', 'same forwards and backwards'],
            'test_cases': [
                {'input': '"racecar"', 'output': 'true', 'description': 'Test with palindrome word'},
                {'input': '"hello"', 'output': 'false', 'description': 'Test with non-palindrome word'},
                {'input': '"A man a plan a canal Panama"', 'output': 'true', 'description': 'Test with palindrome sentence'},
                {'input': '""', 'output': 'true', 'description': 'Test with empty string'}
            ]
        },
        'string_reverse': {
            'keywords': ['reverse string', 'reverse order', 'reverse characters'],
            'test_cases': [
                {'input': '"hello"', 'output': '"olleh"', 'description': 'Test with simple word'},
                {'input': '"python"', 'output': '"nohtyp"', 'description': 'Test with another word'},
                {'input': '""', 'output': '""', 'description': 'Test with empty string'},
                {'input': '"a"', 'output': '"a"', 'description': 'Test with single character'}
            ]
        },
        'binary_search': {
            'keywords': ['search', 'find index', 'sorted array', 'binary search'],
            'test_cases': [
                {'input': '[1, 2, 3, 4, 5], 3', 'output': '2', 'description': 'Test with element in middle'},
                {'input': '[1, 3, 5, 7, 9], 9', 'output': '4', 'description': 'Test with element at end'},
                {'input': '[2, 4, 6, 8], 5', 'output': '-1', 'description': 'Test with element not found'},
                {'input': '[], 1', 'output': '-1', 'description': 'Test with empty array'}
            ]
        }
    }
    
    # Try to match question to known patterns
    for qtype, data in patterns.items():
        if any(keyword in text for keyword in data['keywords']):
            return qtype, data['test_cases']
            
    # Default test cases for array manipulation
    default_cases = [
        {'input': '[1, 2, 3]', 'output': '[1, 2, 3]'},
        {'input': '[5, 4, 3, 2, 1]', 'output': '[1, 2, 3, 4, 5]'},
        {'input': '[]', 'output': '[]'}
    ]
    
    return 'array_manipulation', default_cases

def generate_mock_test(company_id=None, num_questions=10, difficulty='medium', topics=None):
    """
    Generate a customized mock test based on parameters.
    
    Args:
        company_id (int, optional): Filter questions for specific company
        num_questions (int): Number of questions to include (default: 10)
        difficulty (str): Target difficulty level ('easy', 'medium', 'hard')
        topics (list, optional): List of topics to focus on
    
    Returns:
        list: List of question dictionaries with metadata
    """
    # Start with base query
    qset = Question.query

    # Apply company filter if specified
    if company_id:
        qset = qset.filter(Question.company_id == company_id)
    
    # Apply difficulty filter with some variance
    difficulties = {
        'easy': ['easy', 'medium'],
        'medium': ['easy', 'medium', 'hard'],
        'hard': ['medium', 'hard']
    }
    target_difficulties = difficulties.get(difficulty.lower(), ['medium'])
    qset = qset.filter(Question.difficulty.in_(target_difficulties))

    # Apply topic filter if specified
    if topics and len(topics) > 0:
        topic_conditions = []
        for topic in topics:
            topic_conditions.append(Question.tags.contains(topic))
        if topic_conditions:
            from sqlalchemy import or_
            qset = qset.filter(or_(*topic_conditions))

    # Fetch all matching questions
    all_qs = qset.all()
    
    if len(all_qs) == 0:
        # Fallback to any questions if no matches
        all_qs = Question.query.limit(1000).all()
    
    # Sample questions with weighting based on difficulty
    def get_weight(q):
        if not q.difficulty or q.difficulty == difficulty:
            return 1.0
        return 0.5
    
    weighted_qs = [(q, get_weight(q)) for q in all_qs]
    total_weight = sum(w for _, w in weighted_qs)
    
    if total_weight == 0:
        # Fallback to random sampling if no weights
        sampled = random.sample(all_qs, min(num_questions, len(all_qs)))
    else:
        # Weighted random sampling
        sampled = []
        for _ in range(min(num_questions, len(all_qs))):
            r = random.uniform(0, total_weight)
            curr_weight = 0
            for q, w in weighted_qs:
                curr_weight += w
                if curr_weight >= r:
                    sampled.append(q)
                    break

    # Transform questions into response format with metadata
    response = []
    for q in sampled:
        # Determine question type and get appropriate test cases
        question_type = 'array_sum'  # Default type
        if 'two sum' in q.text.lower():
            question_type = 'two_sum'
        elif 'palindrome' in q.text.lower():
            question_type = 'palindrome'
        
        # Analyze question and get test cases
        question_type, test_cases = analyze_question_type(q.text)
        
        question_data = {
            'id': q.id,
            'text': q.text,
            'difficulty': q.difficulty or 'medium',
            'title': generate_title(q.text),
            'topics': q.tags.split(',') if q.tags else [],
            'company': q.company.name if q.company else None,
            'sample_input': test_cases[0]['input'],
            'sample_output': test_cases[0]['output'],
            'test_cases': test_cases,
            'question_type': question_type
        }
        response.append(question_data)
    
    return response

def generate_title(question_text):
    """Generate a concise title from question text."""
    # Basic implementation - take first sentence or truncate
    title = question_text.split('.')[0]
    if len(title) > 100:
        title = title[:97] + '...'
    return title
