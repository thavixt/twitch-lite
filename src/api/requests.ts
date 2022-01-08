import { AccessToken, Channel, Maybe, TwitchApiData, TwitchEndpoint } from "../types";

const CACHE = new Map<string, { data: TwitchApiData[keyof TwitchApiData], timestamp: number }>();
const CACHE_EXPIRY_MS = 10 * 60 * 1000;
// (window as any).CACHE = CACHE; // just to debug from console

const TWITCH_ENDPOINT_BASE = 'https://api.twitch.tv/helix/';

export async function getMe(): Promise<Maybe<TwitchApiData['users'][0]>> {
    const me = await twitchApiRequest('users', {});
    if (me) {
        return me[0];
    }
}

export async function getFollowedList(): Promise<TwitchApiData['streams']> {
    const me = await getMe();
    if (me) {
        const followList = await twitchApiRequest('streams/followed', { user_id: me.id });
        if (followList) {
            // return followList.slice(0, 1);
            return followList;
        }
    }
    return [];
}

export async function getChannelInfo(loginName: string): Promise<Channel> {
    const channel = await twitchApiRequest('users', { login: loginName });
    if (channel && channel[0].id) {
        const stream = await twitchApiRequest('streams', { first: 1, user_id: channel[0].id });
        if (stream) {
            return { user: channel[0], stream: stream[0] };
        }
    }
    // fallback default structure
    return {
        user: {
            broadcaster_type: "",
            created_at: "",
            description: "",
            id: "",
            login: loginName,
            offline_image_url: "",
            profile_image_url: "",
            type: "",
            view_count: undefined,
        },
        stream: {
            game_id: "",
            game_name: "",
            id: "",
            is_mature: "",
            language: "",
            started_at: "",
            tag_ids: [],
            thumbnail_url: "",
            title: "",
            type: "",
            user_id: "",
            user_login: loginName,
            user_name: loginName,
            viewer_count: undefined,
        }
    };
};

function getCached<T extends keyof TwitchApiData>(key: string): Maybe<TwitchApiData[T]> {
    if (!CACHE.has(key)) {
        return null;
    }

    const cached = CACHE.get(key);
    // cache expired
    if (!cached || cached.timestamp < Date.now() - CACHE_EXPIRY_MS) {
        return null;
    }

    return cached.data as TwitchApiData[T];
}

function twitchApiRequest<T extends keyof TwitchEndpoint>(
    endpoint: T,
    query: TwitchEndpoint[T],
    fallback?: TwitchApiData[T],
): Promise<Maybe<TwitchApiData[T]>> {
    return new Promise<TwitchApiData[T]>(async (resolve, reject) => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            reject(`[API] Access token not found.`);
            return;
        }
        try {
            const uri = `${endpoint}${getQueryString(query)}`;
            const cached = getCached<T>(uri);
            if (cached) {
                resolve(cached);
                return;
            }
            console.info('[API] Not cached', uri)
            const response = await fetch(
                `${TWITCH_ENDPOINT_BASE}${uri}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${getAccessToken()}`,
                        'Content-Type': 'application/json',
                        'Client-Id': process.env.REACT_APP_REDDIT_API_CLIENT_ID as string,
                    }
                },
            );
            const json = await response.json();
            if (json?.data?.length) {
                CACHE.set(uri, { data: json.data, timestamp: Date.now() })
                resolve(json.data);
            }
            reject(`[API] "${endpoint}" query failed.`)
        } catch (ex) {
            if (fallback) {
                console.warn(`[API] "${endpoint}" query failed, using fallback.`);
                resolve(fallback);
            }
            reject(`[API] "${endpoint}" query failed.\n\n${ex}`)
        }
    });
}

function getQueryString(data: Record<string, string | number>): string {
    const search = Object.keys(data)
        .reduce<string[]>((p, c) => [...p, `${c}=${data[c]}`], [])
        .join('&');
    return search ? `?${search}` : '';
}

function getAccessToken(): Maybe<AccessToken['access_token']> {
    const stored = localStorage.getItem('twitchAccessToken');
    if (!stored) {
        return null;
    }
    return (JSON.parse(stored) as AccessToken).access_token;
}
