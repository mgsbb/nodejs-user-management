import { google } from 'googleapis';

export function getOAuth2Client() {
    console.log(process.env.GOOGLE_CLIENT_ID);
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;

    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    // if oauth2Client is exported directly without being inside a function, this file would require dotenv.config(), which is currently in index.ts
    // hence anytime getOAuth2Client is called, process.env will be available
    return oauth2Client;
}
