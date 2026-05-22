from flask import Blueprint, request, jsonify
from app.models.chatbot_model import get_chatbot_response, delete_all_user_conversations
from app.utils.db import get_mongo
from app.config.settings import ALLOWED_ORIGINS
from flask_cors import CORS

# Create blueprint
bp = Blueprint('chatbot', __name__)

# Configure CORS for chatbot routes
CORS(bp, resources={
    r'/chat*': {
        'origins': ALLOWED_ORIGINS
    }
})

@bp.route('/chat', methods=['POST'])
def chat_endpoint():
    """
    Handle chat messages and return AI responses.
    """
    try:
        data = request.json
        message = data.get('message')
        username = data.get('username')
        
        # Validate required fields
        if not message:
            return jsonify({'error': 'Message is required'}), 400
            
        if not username:
            return jsonify({'error': 'Username is required'}), 400
        
        # Check database connection
        mongo = get_mongo()
        if mongo is None or mongo.db is None:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # User is already authenticated via Supabase on the frontend.
        # We just use the username for conversation tracking.
        user_role = 'customer'  # Default role; frontend can pass role if needed
        
        # Generate thread ID for conversation
        thread_id = f"{username}_main_thread"
        
        # Get chatbot response
        response = get_chatbot_response(message, username, thread_id)
        
        return jsonify({
            'bot': response,
            'username': username,
            'user_role': user_role,
            'thread_id': thread_id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/chat/delete-history', methods=['DELETE'])
def delete_chat_history():
    """
    Delete all chat history for a user.
    """
    try:
        data = request.json
        username = data.get('username')
        
        # Validate required fields
        if not username:
            return jsonify({'error': 'Username is required'}), 400
        
        # Check database connection
        mongo = get_mongo()
        if mongo is None or mongo.db is None:
            return jsonify({'error': 'Database connection not available'}), 500
        
        # User is already authenticated via Supabase on the frontend.
        user_role = 'customer'
        
        # Delete all conversations for the user
        deleted_count = delete_all_user_conversations(username)
        
        return jsonify({
            'message': f'Deleted {deleted_count} conversations for user {username}',
            'username': username,
            'user_role': user_role
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
