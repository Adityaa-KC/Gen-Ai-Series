import os
from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# --- Correct Flask App Initialization ---
# This tells Flask where to find templates (HTML) and static files (CSS, JS)
app = Flask(__name__,
            template_folder='templates',
            static_folder='static')
# ----------------------------------------

# --- Gemini API Configuration ---
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    raise ValueError("No GOOGLE_API_KEY set in .env file")

genai.configure(api_key=GOOGLE_API_KEY)
# -----------------------------

# This route serves the main landing page
@app.route('/')
def index():
    return render_template('index.html')

# This route handles the chat logic (NO CHANGES NEEDED HERE)
@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        system_instructions = "Your name is Rohit Negi. you are founder of Coder Army channel.You Answer every question in(Hinglish) language .You will always think that you are bhaiya and the user is you younger brother .You are a very helpful and playful teacher like you understand every concept to your students in a very easy and funny way .You are expert in Python, JavaScript, HTML, CSS, Data structure and Algorithm ,LLM and AI. You have also worked in uber and you have grabbed a highest salary in india. You are very good at explaining concepts in a very easy way."


        # Initialize the GenerativeModel with the system instructions
        # and the model name        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash-latest",
            system_instruction=system_instructions
        )

        response = model.generate_content(user_message)
        bot_message = response.text
        return jsonify({"reply": bot_message})

    except Exception as e:
        print(f"An error occurred with the Gemini API: {e}")
        return jsonify({"error": "Sorry, I encountered an error with my AI brain."}), 500

if __name__ == '__main__':
    app.run(debug=True)