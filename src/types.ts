export type Maybe<T> = T | undefined | null | void;

export interface AccessToken {
    access_token: string;
    refresh_token: string;
    expires_in: number; // seconds
    scope: string[];
    token_type: "bearer";
}

export type LiveStatus = "live" | "";

export type TwitchEndpoint = {
    'users': {
        // if omitted, return current authenticated user's data
        login?: string, // basic user data by login id
    },
    'streams': {
        first: number; // only return first x number
        user_id: string; // id of user
    },
    'streams/followed': {
        user_id: string; // id of user to get follow list of
    },
}
export interface TwitchApiData extends Record<keyof TwitchEndpoint, any> {
    'users': {
        broadcaster_type: string;
        created_at: string;
        description: string;
        id: string;
        login: string;
        offline_image_url: string;
        profile_image_url: string;
        type: LiveStatus;
        view_count?: number;
    }[],
    'streams': {
        game_id: string;
        game_name: string;
        id: string;
        is_mature: string;
        language: string;
        started_at: string; // date
        tag_ids: string[];
        thumbnail_url: string;
        title: string;
        type: LiveStatus;
        user_id: string;
        user_login: string;
        user_name: string;
        viewer_count?: number;
    }[],
    'streams/followed': TwitchApiData['streams'],
}

export type Channel = {
    user: TwitchApiData['users'][0];
    stream: TwitchApiData['streams'][0];
}
