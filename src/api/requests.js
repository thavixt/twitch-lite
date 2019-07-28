const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const CLIENT_ID = '***'; // twitch api client id -> https://dev.twitch.tv/console/apps/

const CACHE = new Map(); // [key: {data, timestamp}]

export const getChannelData = async (channelName) => {

    if (CACHE.has(channelName)) {
        const item = CACHE.get(channelName);
        if (item.timestamp > Date.now() - 5 * 60 * 1000) {
            return item.data;
        }
    }

    return new Promise(async (resolve, reject) => {
        const channelId = await getChannelIdByDisplayName(channelName);
        fetch(`https://api.twitch.tv/helix/streams?user_id=${channelId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': CLIENT_ID,
            }
        })
            .then(response => response.json())
            .then(json => {
                CACHE.set(channelName, { data: json.data[0], timestamp: Date.now() })
                return json;
            })
            .then(json => resolve(json.data[0]))
            .catch((e) => reject(`getChannelData rejected (${channelName})` + e));
    });
};

const getChannelIdByDisplayName = async (displayName) =>
    (await searchChannelsByDisplayName(displayName)).channels[0]._id;


const searchChannelsByDisplayName = async (channel) => {
    return new Promise((resolve, reject) => {
        const query = encodeURI(channel);
        fetch(PROXY_URL + `https://api.twitch.tv/kraken/search/channels?query=${query}&limit=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Client-ID': CLIENT_ID,
            }
        })
            .then(response => response.json())
            .then(json => resolve(json))
            .catch((e) => reject(`searchChannelsByDisplayName rejected (${channel})` + e));
    });
};
