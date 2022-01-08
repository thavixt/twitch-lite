import { useAuthenticated } from "../api";

const SCOPES = [
    'user:read:follows',
    'user:read:subscriptions',
    // probably don't need more - the embedded chat handles the rest ...
].join(' ');

const URL = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_REDDIT_API_CLIENT_ID}&redirect_uri=${window.location.href}&response_type=code&scope=${SCOPES}`;

export function LoginButton() {
    const userName = useAuthenticated();

    return <span className='auth'>
        {userName
            ? <span className='loggedIn'>{`(logged in as ${userName})`}</span>
            : <a href={URL}>Log in</a>
        }
    </span>
}
