from flask import jsonify, request
from models import db, Company, Question, User
from scraper_core import fetch_all_sources
from admin_routes import register_admin_routes
from nlp_processor import NLPProcessor

# Initialize NLP processor
nlp_processor = NLPProcessor()
from ai_engine import generate_mock_test
import traceback

def init_api(app):
    # Database is already initialized in app.py
    with app.app_context():

        # Seed data for companies
        if Company.query.count() == 0:
            seed = [
                ('Hexaware', 'https://www.geeksforgeeks.org/hexaware-interview-experience/', 'geeksforgeeks'),
                ('Google', 'https://www.geeksforgeeks.org/google-interview-experience/', 'geeksforgeeks'),
                ('Amazon', 'https://leetcode.com/problemset/all/', 'leetcode'),
                ('Microsoft', 'https://www.glassdoor.com/Interview/microsoft-interview-questions-SRCH_KE0,9.htm', 'glassdoor'),
            ]
            for name, url, source_type in seed:
                db.session.add(Company(name=name, source=url, source_type=source_type))
            db.session.commit()

            # Auto-scrape seeded companies
            try:
                print('Starting auto-scrape for seeded companies...')
                results = fetch_all_sources(Company.query.all(), limit_per_source=8)
                print('Auto-scrape results summary:')
                for source, items in results.items():
                    print(source, '->', len(items), 'items')
            except Exception as e:
                print('Auto-scrape failed:', e)
                traceback.print_exc()

    # Register admin routes
    register_admin_routes(app)

    # Public API endpoints
    @app.route('/api/companies')
    def companies():
        """Fetch all companies."""
        comps = Company.query.all()
        return jsonify([{'id': c.id, 'name': c.name, 'source': c.source, 'type': c.source_type} for c in comps])

    @app.route('/api/company/<int:cid>/questions')
    def company_questions(cid):
        """Fetch questions for a specific company."""
        qs = Question.query.filter_by(company_id=cid).all()
        return jsonify([{'id': q.id, 'text': q.text, 'tags': q.tags} for q in qs])

    @app.route('/api/process_question', methods=['POST'])
    def process_question():
        """Process a question through NLP analysis."""
        data = request.json or {}
        question_id = data.get('question_id')
        question_text = data.get('text')

        if not question_id and not question_text:
            return jsonify({
                'success': False,
                'error': 'Either question_id or text must be provided'
            }), 400

        try:
            if question_id:
                question = Question.query.get(question_id)
                if not question:
                    return jsonify({
                        'success': False,
                        'error': 'Question not found'
                    }), 404
                analysis = nlp_processor.analyze_question(question.text)
            else:
                analysis = nlp_processor.analyze_question(question_text)

            return jsonify({
                'success': True,
                'analysis': analysis
            })
        except Exception as e:
            print('Error processing question:', str(e))
            return jsonify({
                'success': False,
                'error': 'Failed to process question'
            }), 500

    @app.route('/api/generate_test', methods=['POST'])
    def generate_test():
        """Generate a customized mock test."""
        data = request.json or {}
        company_id = data.get('company_id')
        num_questions = data.get('num_questions', 10)
        difficulty = data.get('difficulty', 'medium')
        topics = data.get('topics', [])
        
        try:
            test = generate_mock_test(
                company_id=company_id,
                num_questions=num_questions,
                difficulty=difficulty,
                topics=topics
            )
            return jsonify({
                'success': True,
                'test': test
            })
        except Exception as e:
            print('Error generating test:', str(e))
            return jsonify({
                'success': False,
                'error': 'Failed to generate test. Please try again.'
            }), 500
