from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import mysql.connector
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)

db_config = {
    "user": "root",
    "password": "Christ4all@@@@@",
    "host": "localhost",
    "database": "chat_bot",
}

RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"





@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    print(f"Received data: {data}") #log incoming data
    user_message = data.get("message")
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")

    if not user_message or not user_id or not conversation_id:
        return jsonify({"error": "No message, user_id, or conversation_id provided"}), 400

    print(f"Received message from user {user_id} in conversation {conversation_id}: {user_message}")

    #send message to rasa
    response = requests.post(RASA_SERVER_URL, json={"sender": user_id, "message": user_message})

    if response.status_code != 200:
        print(f"Error sending message to Uju: {response.status_code}")
        return jsonify({"error": "Error communicating with Uju"}), 500

    bot_response = response.json()
    print(f"Received response from Uju: {bot_response}")

    #save user message and bot response to MySQL
    save_chat_to_db(user_id, conversation_id, user_message, bot_response[0]['text'])

    return jsonify(bot_response)

def save_chat_to_db(user_id, conversation_id, user_message, bot_response):
    # conn = mysql.connector.connect(**db_config)
    # cursor = conn.cursor()
    # cursor.execute("""
    # INSERT INTO messages (id, conversation_id, user_message, bot_response, timestamp)
    # VALUES (%s, %s, %s, %s, %s)
    # """, (id, conversation_id, user_message, bot_response, datetime.now(timezone.utc)))
    # conn.commit()
    # cursor.close()
    # conn.close()

    if not isinstance(user_id, str) or not isinstance(conversation_id, str):
        raise ValueError("user_id and conversation_id must be strings")

    if not isinstance(user_message, str):
        user_message = str(user_message)

    if not isinstance(bot_response, str):
        bot_response = str(bot_response)

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Check if conversation exists
    cursor.execute("SELECT conversation_id FROM conversations WHERE conversation_id = %s", (conversation_id,))
    existing_conversation = cursor.fetchone()

    if not existing_conversation:
        print(f"⚠️ Conversation {conversation_id} does not exist. Creating new conversation.")
        cursor.execute("INSERT INTO conversations (user_id, conversation_id) VALUES (%s, %s)",
                       (user_id, conversation_id))
        conn.commit()  # Commit immediately to avoid foreign key errors

    #Now insert the message
    query = """
            INSERT INTO messages (conversation_id, user_message, bot_response)
            VALUES (%s, %s, %s)
            """
    cursor.execute(query, (conversation_id, user_message, bot_response))

    conn.commit()
    cursor.close()
    conn.close()
    print(
        f"✅ Saved chat to database: user_id={user_id}, conversation_id={conversation_id}, user_message={user_message}, bot_response={bot_response}")

def get_chat_history(user_id, conversation_id):
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
        SELECT user_message, bot_response
        FROM messages
        WHERE conversation_id = %s
        ORDER BY timestamp ASC
        """, (conversation_id,))
        history = cursor.fetchall()
        cursor.close()
        conn.close()
        print(f"Retrieved chat history for user {user_id} in conversation {conversation_id}: {history}")
        return history

@app.route("/history", methods=["GET"])
def get_chat_history_endpoint():
    user_id = request.args.get("user_id")
    conversation_id = request.args.get("conversation_id") #Get conversation_id from query params

    if not user_id or not conversation_id:
        return jsonify({"error": "No user_id or conversation_id provided"}), 400

    history = get_chat_history(user_id, conversation_id)
    return jsonify(history)

@app.route("/new_conversation", methods=["POST"])
def new_conversation():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400

    #create a new conversation ID(could be a UUID or a timestamp-based string
    conversation_id = str(datetime.now(timezone.utc).timestamp()) #use timezone-aware datetime

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO conversations (user_id, conversation_id, timestamp)
    VALUES (%s, %s, %s)
    """, (user_id, conversation_id, datetime.now(timezone.utc)))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"conversation_id": conversation_id})

@app.route("/conversations", methods=["GET"])
def get_conversations():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
    SELECT conversation_id
    FROM conversations
    WHERE user_id = %s
    """, (user_id,))
    conversations = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(conversations)


@app.route('/conversation', methods = ['DELETE'])
def delete_conversation():
    data = request.json
    user_id = data.get('user_id')
    conversation_id = data.get('conversation_id')

    if not user_id or not conversation_id:
        return jsonify({"error": "No user_id or conversation_id provided"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
    DELETE FROM  messages WHERE conversation_id = %s
    """, (conversation_id,))
    cursor.execute("""
        DELETE FROM conversations WHERE conversation_id = %s
    """, (conversation_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Conversation deleted successfully"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)