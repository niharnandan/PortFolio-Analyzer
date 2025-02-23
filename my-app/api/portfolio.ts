import firebaseAdmin from 'firebase-admin';  // Default import
import * as functions from 'firebase-functions';
import axios from 'axios';

// Firebase setup - Load credentials from the environment variable
const firebaseCredentials = process.env.FIREBASE_CREDENTIALS;

if (!firebaseCredentials) {
    throw new Error("FIREBASE_CREDENTIALS environment variable is missing");
}

const credDict = JSON.parse(firebaseCredentials);
console.log('HERE', credDict);

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
    const accessTokenUrl = 'https://apisb.etrade.com/v1/oauth/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Use the E*TRADE API key and secret to request an OAuth token
    const auth = Buffer.from(`${ETRADE_API_KEY}:${ETRADE_API_SECRET}`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');  // Or use another grant type if needed

    try {
        const response = await axios.post(accessTokenUrl, params, {
            headers: {
                ...headers,
                'Authorization': `Basic ${auth}`,
            }
        });

        // Return the access token
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to get access token:', error);
        throw new Error('Failed to authenticate with E*TRADE API');
    }
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

export default handler;
