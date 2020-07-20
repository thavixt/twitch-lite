const USER_CACHE = new Map(); // [key: {data}]
const STREAM_CACHE = new Map(); // [key: {data, timestamp}]
const CACHE_EXPIRY_MS = 1 * 60 * 1000;

export async function getStreamInfo(channelName) {
    const channel = await getChannelData(channelName);
    if (channel && channel.id) {
        const stream = await getStreamData(channel.id, channel.login);
        return stream;
    }
    return { title: channelName, type: '', viewer_count: '' };
};

export async function getChannelData(loginName) {
    if (USER_CACHE.has(loginName)) {
        return USER_CACHE.get(loginName).data;
    }

    return new Promise(async (resolve, reject) => {
        fetch(`https://api.twitch.tv/helix/users?login=${loginName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': process.env.REACT_APP_REDDIT_API_CLIENT_ID,
            }
        })
            .then(response => response.json())
            .then(json => {
                if (!json.data.length) {
                    reject(`Request error: no user '${loginName}' found.`);
                } else {
                    USER_CACHE.set(loginName, { data: json.data[0], timestamp: Date.now() })
                    resolve(json.data[0]);
                }
            })
            .catch((e) => {
                console.error(`Request error:\nError while requesting user data for '${loginName}'.\n(Will be fixed soon)`);
                resolve({ display_name: loginName });
            });
    })
}

async function getStreamData(id, loginName) {
    if (STREAM_CACHE.has(loginName)) {
        const cached = STREAM_CACHE.get(loginName);
        if (cached.timestamp > Date.now() - CACHE_EXPIRY_MS) {
            return cached.data;
        }
    }

    return new Promise(async (resolve, reject) => {
        fetch(`https://api.twitch.tv/helix/streams?first=1&user_id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': process.env.REACT_APP_REDDIT_API_CLIENT_ID,
            }
        })
            .then(response => response.json())
            .then(json => {
                if (!json.data.length) {
                    resolve(null);
                } else {
                    STREAM_CACHE.set(loginName, { data: json.data[0], timestamp: Date.now() })
                    resolve(json.data[0]);
                }
            })
            .catch((e) => {
                console.error(`Request error:\nError while requesting stream info for '${loginName}'. (Will be fixed soon)`);
                resolve({ id, loginName });
            });
    })
}
