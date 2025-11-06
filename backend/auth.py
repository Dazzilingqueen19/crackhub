from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
import jwt
from datetime import datetime, timedelta
from functools import wraps
import os
import re

auth_bp = Blueprint('auth', __name__)

# Environment variables for security (should be in .env file in production)
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')  # Change in production
JWT_EXPIRATION = int(os.getenv('JWT_EXPIRATION', '24'))  # Hours

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def validate_password(password):
    """
    Validate password strength
    Returns (is_valid, message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"[0-9]", password):
        return False, "Password must contain at least one number"
    if not re.search(r"[!@#$%^&*]", password):
        return False, "Password must contain at least one special character"
    return True, "Password is valid"

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['username', 'password', 'email']):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    # Validate password strength
    is_valid, message = validate_password(data['password'])
    if not is_valid:
        return jsonify({'message': message}), 400
    
    # Create new user
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(
        username=data['username'],
        password_hash=hashed_password,
        email=data['email']
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error creating user', 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ['username', 'password']):
        return jsonify({'message': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid username or password'}), 401
    
    # Generate JWT token
    token = jwt.encode({
        'user_id': user.id,
        'username': user.username,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION)
    }, JWT_SECRET)
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'is_admin': user.is_admin
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_user_profile(current_user):
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'is_admin': current_user.is_admin
    }), 200

# Password reset functionality (optional)
@auth_bp.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user:
        # Don't reveal if email exists
        return jsonify({'message': 'If email exists, reset instructions will be sent'}), 200
    
    # In production, send email with reset token
    # For demo, we'll just return success
    return jsonify({'message': 'Reset instructions sent'}), 200