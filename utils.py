# utils.py

def preprocess_response(response):
    from textblob import TextBlob
    from nltk.tokenize import word_tokenize
    from nltk.corpus import stopwords
    corrected_response = str(TextBlob(response).correct())
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(corrected_response.lower())
    tokens = [word for word in tokens if word.isalpha() and word not in stop_words]
    return " ".join(tokens)

def analyze_sentiment(response):
    from nltk.sentiment.vader import SentimentIntensityAnalyzer
    sia = SentimentIntensityAnalyzer()
    sentiment_score = sia.polarity_scores(response)
    return sentiment_score['compound']

def love_prediction(responses):
    sentiments = []
    for response in responses:
        processed_response = preprocess_response(response)
        if processed_response in ["yes", "no"]:
            sentiment_score = 1.0 if processed_response == "yes" else -1.0
        else:
            sentiment_score = analyze_sentiment(processed_response)
        sentiments.append(sentiment_score)
    positive_count = sum(1 for score in sentiments if score > 0)
    negative_count = len(sentiments) - positive_count
    if positive_count > negative_count:
        return "Love"
    else:
        return "Not Love"
