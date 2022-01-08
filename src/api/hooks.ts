import { useCallback, useState } from "react";
import { isLoggedIn } from ".";
import { Channel, Maybe, TwitchApiData } from "../types";
import { useInterval } from "../utils";
import { getChannelInfo, getFollowedList, getMe } from "./requests";

export function useAuthenticated() {
    const [name, setName] = useState<Maybe<string>>(null);

    const checkAuth = useCallback(async () => {
        const res = await isLoggedIn();
        if (!res) {
            return;
        }
        const me = await getMe();
        if (!me) {
            return;
        }
        setName(me.login);
    }, []);
    useInterval(checkAuth, 5 * 60_000);

    return name;
}

export function useStreamInfo(loginName: string) {
    const [info, setInfo] = useState<Channel>();

    const refreshInfo = useCallback(async () => {
        const res = await getChannelInfo(loginName);
        if (res) {
            setInfo(res);
        }
    }, [loginName]);

    useInterval(refreshInfo, 5 * 60_000);

    return info;
}

export function useFollowedList() {
    const [list, setList] = useState<TwitchApiData['streams']>([]);

    const refreshList = useCallback(async () => {
        const res = await getFollowedList();
        if (res) {
            setList(res);
        }
    }, []);

    useInterval(refreshList, 5 * 60_000);

    return list;
}
