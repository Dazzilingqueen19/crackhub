from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Create the SQLAlchemy instance
db = SQLAlchemy()

def init_db(app):
    """Initialize the database with the app context"""
    db.init_app(app)
    with app.app_context():
        db.create_all()

class User(db.Model):
    __tablename__='users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Company(db.Model):
    __tablename__='companies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    source = db.Column(db.String(1024))
    source_type = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    questions = db.relationship('Question', backref='company', lazy=True)

class QuestionTag(db.Model):
    __tablename__ = 'question_tags'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'))
    tag = db.Column(db.String(50))
    tag_type = db.Column(db.String(20))  # keyword, category, difficulty
    confidence = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<QuestionTag {self.tag}>'

class Question(db.Model):
    __tablename__='questions'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    source = db.Column(db.String(128))
    difficulty = db.Column(db.String(32))
    tags = db.Column(db.String(512))  # Legacy field
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Add relationship to tags
    question_tags = db.relationship('QuestionTag', backref='question', lazy=True)
