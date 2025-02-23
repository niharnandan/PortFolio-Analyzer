import firebase_admin
from firebase_admin import credentials, firestore
import requests
from requests_oauthlib import OAuth2Session
import os
import json

# Firebase setup - Load Firebase credentials from environment variable
firebase_credentials = os.getenv('FIREBASE_CREDENTIALS_JSON')
cred_dict = json.loads(firebase_credentials)
cred = credentials.Certificate(cred_dict)  # Use the credentials from the JSON string
firebase_admin.initialize_app(cred)
db = firestore.client()

# E*TRADE API setup
ETRADE_API_KEY = os.environ['ETRADE_API_KEY']
ETRADE_API_SECRET = os.environ['ETRADE_API_SECRET']

# OAuth setup (simplified, ensure correct OAuth flow)
def get_access_token():
    # Implement your OAuth flow here
    pass

def store_in_firestore(portfolio_value):
    # Store portfolio value in Firestore
    doc_ref = db.collection('portfolios').document('latest')
    doc_ref.set({
        'value': portfolio_value
    })

def fetch_portfolio_data():
    access_token = get_access_token()
    # Fetch portfolio data from E*TRADE API
    response = requests.get(
        'https://apisb.etrade.com/v1/user/portfolio',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    data = response.json()
    return data['portfolio_value']  # Adjust depending on the actual response structure

# This function will be triggered as the serverless function
def handler(request):
    portfolio_value = fetch_portfolio_data()
    store_in_firestore(portfolio_value)
    return {"status": "success", "portfolio_value": portfolio_value}
