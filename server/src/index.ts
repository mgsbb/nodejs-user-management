import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import crypto from 'crypto';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(cookieParser());

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET!;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/auth/google', (req, res) => {
    // Direct URL without using client library
    // const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline`;

    // SCOPES DOCS:  https://developers.google.com/identity/protocols/oauth2/scopes

    // these scopes require app verification
    // const scopes = [
    //     'https://www.googleapis.com/auth/drive.metadata.readonly',
    //     'https://www.googleapis.com/auth/calendar.readonly',
    // ];

    // const scopes = ['email', 'profile'];

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ];

    const state = crypto.randomBytes(32).toString('hex');

    const authorizationUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
         * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true,
        // Include the state parameter to reduce the risk of CSRF attacks.
        state: state,
        // prompt: 'consent',
        // prompt: 'select_account',
    });
    res.redirect(authorizationUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    // req.query contains { state, code, scope, authuser, prompt }
    // console.log(req.query);

    const code = req.query?.code as string;

    try {
        // Important Note - The refresh_token is only returned on the first authorization.
        // also return res, console.log(res) to see url as: 'https://oauth2.googleapis.com/token', and res.data same as tokens
        // tokens contains { access_token, scope, token_type, id_token, expiry_date }
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });

        // GET request made to URL: https://www.googleapis.com/oauth2/v2/userinfo
        // data contains { id, email, verified_email, name, given_name, family_name, picture }
        const { data: userInfo } = await oauth2.userinfo.get();

        const token = jwt.sign(userInfo, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: false });
        res.redirect('http://localhost:5173');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to authenticate' });
    }

    // Without googleapis client library to get tokens and userinfo
    /* 
    try {
        // data contains { access_token, expires_in, scope, token_type, id_token }
        const { data } = await axios.post(
            'https://oauth2.googleapis.com/token',
            null,
            {
                params: {
                    code,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    redirect_uri: REDIRECT_URI,
                    grant_type: 'authorization_code',
                },
            }
        );

        const { access_token } = data;

        // userInfo contains { sub, name, given_name, family_name, picture, email, email_verified }
        const { data: userInfo } = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const token = jwt.sign(userInfo, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: false });
        res.redirect('http://localhost:5173');
    } catch (err) {
        console.error('Failed to exchange token:', err);
        res.status(500).json({ error: 'Failed to authenticate' });
    }
    */
});

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
