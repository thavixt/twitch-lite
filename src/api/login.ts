import { AccessToken } from "../types";
import { cleanSearchParams } from "../utils";

const getUrl = (code: string) => `https://id.twitch.tv/oauth2/token?client_id=${import.meta.env.VITE_REDDIT_API_CLIENT_ID}&client_secret=${import.meta.env.VITE_REDDIT_API_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${new URL(window.location.pathname, window.location.href).href}`;

const getRefreshUrl = (token: string) => `https://id.twitch.tv/oauth2/token?client_id=${import.meta.env.VITE_REDDIT_API_CLIENT_ID}&client_secret=${import.meta.env.VITE_REDDIT_API_CLIENT_SECRET}&refresh_token=${token}&grant_type=refresh_token`;

console.log(import.meta.env.VITE_REDDIT_API_CLIENT_SECRET);

export async function isLoggedIn(): Promise<boolean> {
    const stored = window.localStorage.getItem('twitchAccessToken');
    if (!stored) {
        return false;
    }
    const token: AccessToken = JSON.parse(stored);
    if (token.expires_in > 0) { // TODO: fix token refresh ASAP
        return true;
    }

    if (token.refresh_token) {
        const res = await fetch(getRefreshUrl(token.refresh_token), { method: 'POST' });
        const newToken: AccessToken = await res.json();
        if (newToken) {
            window.localStorage.setItem('twitchAccessToken', JSON.stringify(newToken));
            cleanSearchParams();
            return true;
        }
    }

    return false;
}

export async function checkAccessToken(): Promise<void> {
    const code = (new URLSearchParams(window.location.search)).get('code');
    if (code) {
        const res = await fetch(getUrl(code), { method: 'POST' });
        const token: AccessToken = await res.json();
        if (token) {
            window.localStorage.setItem('twitchAccessToken', JSON.stringify(token));
            cleanSearchParams();
            console.info('[Reddit-lite] Authenticated with Twitch, reload page...');
            window.location.reload();
        }
    } else {
        const stored = window.localStorage.getItem('twitchAccessToken');
        if (!stored) {
            return;
        }
        const token: AccessToken = JSON.parse(stored);
        if (token) {
            cleanSearchParams();
        }
    }
}
