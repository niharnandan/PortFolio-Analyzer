import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import axios from 'axios';

// Firebase setup - Load credentials from the environment variable
const firebaseCredentials = process.env.FIREBASE_CREDENTIALS;

if (!firebaseCredentials) {
    throw new Error("FIREBASE_CREDENTIALS environment variable is missing");
}

// Parse the credentials JSON
const credDict = JSON.parse(firebaseCredentials);

// Initialize Firebase Admin with credentials
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(credDict)
});
const db = firebaseAdmin.firestore();

// E*TRADE API setup
const ETRADE_API_KEY = process.env.ETRADE_API_KEY;
const ETRADE_API_SECRET = process.env.ETRADE_API_SECRET;

if (!ETRADE_API_KEY || !ETRADE_API_SECRET) {
    throw new Error("E*TRADE API keys are missing");
}

// OAuth setup (simplified, ensure correct OAuth flow)
async function getAccessToken(): Promise<string> {
    // Implement your OAuth flow here to return the access token
    throw new Error('OAuth implementation is required');
}

// Store portfolio value in Firestore
function storeInFirestore(portfolioValue: number): void {
    const docRef = db.collection('portfolios').doc('latest');
    docRef.set({
        value: portfolioValue
    });
}

// Fetch portfolio data from E*TRADE API
async function fetchPortfolioData(): Promise<number> {
    const accessToken = await getAccessToken();
    const response = await axios.get('https://apisb.etrade.com/v1/user/portfolio', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = response.data;
    return data.portfolio_value;  // Adjust depending on the actual response structure
}

// This function will be triggered as the serverless function on Vercel
export const handler = functions.https.onRequest(async (req, res) => {
    try {
        const portfolioValue = await fetchPortfolioData();
        storeInFirestore(portfolioValue);
        res.status(200).json({
            status: 'success',
            portfolio_value: portfolioValue
        });
    } catch (error) {
        // Log the error for debugging
        console.error('Error occurred:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});
