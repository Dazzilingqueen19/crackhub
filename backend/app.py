from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import datetime
from api import init_api
from auth import auth_bp
from models import db, init_db
from code_execution import init_code_execution_api

# Socket.IO for real-time integrations
from flask_socketio import SocketIO, emit

def create_app():
    app = Flask(__name__, static_folder=None)
    app.config.from_pyfile('config.py')
    
    # Configure CORS with error handling
    # Allow both 3000 and 3001 during development (frontend may run on either port)
    cors = CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://localhost:3001"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "expose_headers": ["Content-Type"],
            "supports_credentials": True,
            "send_wildcard": False,
            "max_age": 86400  # 24 hours
        }
    })
    
    # Initialize database (this creates tables)
    init_db(app)
    
    # Register blueprints and APIs
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    init_api(app)
    init_code_execution_api(app)
    
    return app

app = create_app()

# Initialize SocketIO for real-time events (integration status updates)
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000", "http://localhost:3001"], async_mode='eventlet')


@socketio.on('connect', namespace='/integrations')
def integrations_connect():
    print('Socket client connected to /integrations')
    emit('connected', {'msg': 'Welcome to integrations namespace'})


@socketio.on('disconnect', namespace='/integrations')
def integrations_disconnect():
    print('Socket client disconnected from /integrations')


@socketio.on('connect_platform', namespace='/integrations')
def handle_connect_platform(data):
    """Handle client request to connect/disconnect a platform.
    Broadcasts platform status to all connected clients so UI updates in real-time.
    data: { platform: 'github'|'linkedin'|'leetcode'|'hackerrank', action: 'connect'|'disconnect' }
    """
    try:
        platform = data.get('platform')
        action = data.get('action')
        connected = True if action == 'connect' else False
        ts = str(datetime.datetime.utcnow())
        payload = {
            'platform': platform,
            'connected': connected,
            'timestamp': ts
        }
        print('Platform status change:', payload)
        # Broadcast the platform status to all clients connected to /integrations
        emit('platform_status', payload, broadcast=True, namespace='/integrations')
    except Exception as e:
        print('Error in handle_connect_platform:', e)

@app.route('/health')
def health():
    try:
        # Check database connection
        db.session.execute('SELECT 1')
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'ok',
        'version': '2.0.0',
        'database': db_status,
        'timestamp': str(datetime.datetime.now())
    })

if __name__ == '__main__':
    # Use socketio.run to enable WebSocket support via eventlet
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
