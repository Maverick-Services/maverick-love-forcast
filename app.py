# import pickle
# from flask import Flask, request, jsonify , render_template 
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
# from nltk.sentiment.vader import SentimentIntensityAnalyzer
# from flask_cors import CORS
# from textblob import TextBlob
# import nltk
# import joblib
# import random
# # Download necessary NLTK data
# nltk.download('punkt')
# nltk.download('vader_lexicon')
# nltk.download('stopwords')

# # Initialize VADER sentiment analyzer
# sia = SentimentIntensityAnalyzer()

# # Function to preprocess the response
# def preprocess_response(response):
#     # Correct spelling errors
#     corrected_response = str(TextBlob(response).correct())
#     stop_words = set(stopwords.words('english'))
#     tokens = word_tokenize(corrected_response.lower())
#     tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
#     return " ".join(tokens)

# # Function to analyze the sentiment of the response
# def analyze_sentiment(response):
#     sentiment_score = sia.polarity_scores(response)
#     return sentiment_score['compound']

# # Function to predict love or not love based on multiple responses
# def love_prediction(responses):
#     sentiments = []

#     for response in responses:
#         processed_response = preprocess_response(response)

#         # Handle short responses explicitly
#         if processed_response in ["yes", "no"]:
#             sentiment_score = 1.0 if processed_response == "yes" else -1.0
#         else:
#             sentiment_score = analyze_sentiment(processed_response)

#         sentiments.append(sentiment_score)

#     positive_count = sum(1 for score in sentiments if score > 0)
#     negative_count = len(sentiments) - positive_count

#     if positive_count > negative_count:
#         return "Love"
#     else:
#         return "Not Love"

# # Load the saved model
# # with open("love_prediction_model.pkl", "rb") as file:
# #     loaded_model = pickle.load(file)
# loaded_model = joblib.load("love_prediction_model.pkl")
# # Create Flask app
# app = Flask(__name__)
# CORS(app)


# app.jinja_env.variable_start_string = '%%'
# app.jinja_env.variable_end_string = '%%'
# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json
#     print(f"Received data: {data}")
#     responses = data.get('responses', [])
#     print(responses)
#     prediction = loaded_model(responses)
#     return jsonify({'prediction': prediction})

# if __name__ == '__main__':
#     app.run(debug=True)




# app.py
from utils import love_prediction
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import nltk
import os
import joblib

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('vader_lexicon')
nltk.download('stopwords')

# Create Flask app
app = Flask(__name__)
CORS(app , resources={r"/*": {"origins": "*"}})

app.jinja_env.variable_start_string = '%%'
app.jinja_env.variable_end_string = '%%'

# Save the model
joblib.dump(love_prediction, "love_prediction_model.pkl")

# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    print("Received data:", data)
    responses = data.get('responses', [])
    prediction = love_prediction(responses)
    print("Prediction:", prediction) 
    return jsonify({'prediction': prediction})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
