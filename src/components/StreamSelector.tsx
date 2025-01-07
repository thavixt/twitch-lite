import { useCallback, useEffect, useRef, useState } from 'react';
import { StreamInfo } from './StreamInfo';
import { LoginButton } from './LoginButton';
import { useFollowedList } from '../api/hooks';

interface StreamSelectorProps {
    streamName: string;
}

export function StreamSelector({ streamName }: StreamSelectorProps) {
    const list = useFollowedList();
    const ref = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    const changeStream = useCallback((stream: string) => {
        if (ref?.current) {
            ref.current.value = stream;
        }
        const event = new CustomEvent('streamChange', { detail: { streamName: stream } });
        window.dispatchEvent(event);
    }, []);

    const favourites = list.map(stream =>
        <li key={stream.id}>
            <StreamInfo
                loginName={stream.user_login}
                onClick={() => changeStream(stream.user_login)}
            />
        </li>
    );

    return (
        <form
            className='StreamSelector'
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <label htmlFor='stream'>Stream:</label>
            <span className='streamInputContainer'>
                <input
                    ref={ref}
                    id='stream'
                    name='stream'
                    type='text'
                    defaultValue={streamName}
                    onFocus={e => e.target.select()}
                />
                {/* <button type='submit' title='Follow'>+</button> */}
            </span>
            <button
                type='button'
                className={open ? 'open' : ''}
                title={`${open ? 'Open' : 'Close'} Favourites list`}
            >
                v
            </button>
            <LoginButton />
            {open && <div className='favourites' >
                <small>Followed channels: ({favourites.length})</small>
                <ul>
                    {favourites.length ? favourites : '- no followed streams -'}
                </ul>
            </div>}
        </form >
    );
}

export function UnauthenticatedStreamSelector({ streamName }: StreamSelectorProps) {
    const ref = useRef<HTMLInputElement>(null);
    const [favouritesOpen, setFavouritesOpen] = useState(false);
    const [savedList, setSavedList] = useState(new Set<string>());

    const getSavedList = useCallback(() => {
        const json = window.localStorage.getItem('savedList') || '[]';
        const list = new Set<string>([...JSON.parse(json).sort()]);
        setSavedList(list);
        return list;
    }, []);
    const saveSavedList = useCallback((list: Set<string>) => {
        setSavedList(new Set([...list]));
        window.localStorage.setItem('savedList', JSON.stringify([...list]));
    }, []);

    const addToSavedList = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        // @todo: fix type
        const channelName = (e.target as any).stream.value as string;
        savedList.add(channelName);
        saveSavedList(savedList);
    }, [saveSavedList, savedList]);
    const removeFromSavedList = useCallback((stream: string) => {
        const list = getSavedList();
        list.delete(stream);
        saveSavedList(list);
    }, [getSavedList, saveSavedList]);

    const changeStream = useCallback((stream: string) => {
        if (ref?.current) {
            ref.current.value = stream;
        }
        const event = new CustomEvent('streamChange', { detail: { streamName: stream } });
        window.dispatchEvent(event);
    }, []);

    const onStreamNameChange = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        e.preventDefault();
        changeStream(e.target.value);
    }, [changeStream]);

    const handleEnter = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode && e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            // @todo: fix type
            changeStream((e.target as any).value);
        }
    }, [changeStream]);

    const hideFavourites = useCallback(() => setFavouritesOpen(false), []);
    const showFavourites = useCallback(() => setFavouritesOpen(true), []);

    useEffect(() => {
        getSavedList();
    }, [getSavedList]);

    const favourites = Array.from(savedList).map(stream =>
        <li key={stream}>
            <StreamInfo loginName={stream} onClick={() => changeStream(stream)}>
                <button
                    className='border border-transparent rounded-md hover:border-slate-600 p-1'
                    title='Remove from Favourites list'
                    onClick={() => removeFromSavedList(stream)}
                >
                    x
                </button>
            </StreamInfo>
        </li>
    );

    return (
        <form
            className='flex space-x-2 items-center px-2'
            onBlur={hideFavourites}
            onFocus={showFavourites}
            onMouseEnter={showFavourites}
            onMouseLeave={hideFavourites}
            onSubmit={addToSavedList}
        >
            <label htmlFor='stream'>Stream:</label>
            <input
                ref={ref}
                id='stream'
                name='stream'
                type='text'
                defaultValue={streamName}
                onBlur={onStreamNameChange}
                onFocus={e => e.target.select()}
                onKeyDown={handleEnter}
                onKeyUp={handleEnter}
            />
            <button type='submit' title='Add to Favourites' className='border border-transparent rounded-md hover:border-slate-600 p-1'>+</button>
            <LoginButton />
            {favouritesOpen &&
                <div className='border border-gray-300 rounded-md p-1 top-8 absolute bg-slate-700'>
                    <small>Favourites list</small>
                    <ul>
                        {favourites.length ? favourites : '- no favourites saved -'}
                    </ul>
                </div>
            }
        </form >
    );
}
