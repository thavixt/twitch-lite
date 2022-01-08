export function getQuery() {
    const queryValue = (new URLSearchParams(window.location.search)).get('stream');
    if (!queryValue) {
        return window.localStorage.getItem('lastWatched') || null;
    }
    return queryValue;
}

export function setQuery(stream: string) {
    window.localStorage.setItem('lastWatched', stream);
    const params = new URLSearchParams(window.location.search);
    params.set('stream', stream);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

export function cleanSearchParams(refresh = true) {
    const cleaned = window.location.href.split('?')[0];
    window.history.replaceState(null, '', cleaned);
    if (refresh) {
        console.info('[Reddit-lite] Authenticated with Twitch, reload page...');
        window.location.reload();
    }
}
