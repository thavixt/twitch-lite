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
    const [savedList, setSavedList] = useState(new Set<any>());

    const getSavedList = useCallback(() => {
        const json = window.localStorage.getItem('savedList') || '[]';
        const list = new Set([...JSON.parse(json).sort()]);
        setSavedList(list);
        return list;
    }, []);
    const saveSavedList = useCallback((list) => {
        setSavedList(new Set([...list]));
        window.localStorage.setItem('savedList', JSON.stringify([...list]));
    }, []);

    const addToSavedList = useCallback(async (e) => {
        e.preventDefault();
        const channelName = e.target.stream.value;
        savedList.add(channelName);
        saveSavedList(savedList);
    }, [saveSavedList, savedList]);
    const removeFromSavedList = useCallback((stream) => {
        const list = getSavedList();
        list.delete(stream);
        saveSavedList(list);
    }, [getSavedList, saveSavedList]);

    const changeStream = useCallback((stream) => {
        if (ref?.current) {
            ref.current.value = stream;
        }
        const event = new CustomEvent('streamChange', { detail: { streamName: stream } });
        window.dispatchEvent(event);
    }, []);

    const onStreamNameChange = useCallback((e) => {
        e.preventDefault();
        changeStream(e.target.value);
    }, [changeStream]);

    const handleEnter = useCallback((e) => {
        if (e.keyCode && e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            changeStream(e.target.value);
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
                    title='Remove from Favourites list'
                    onClick={() => removeFromSavedList(stream)}
                >
                    Remove
                </button>
            </StreamInfo>
        </li>
    );

    return (
        <form
            className='StreamSelector'
            onBlur={hideFavourites}
            onFocus={showFavourites}
            onMouseEnter={showFavourites}
            onMouseLeave={hideFavourites}
            onSubmit={addToSavedList}
        >
            <label htmlFor='stream'>Stream:</label>
            <span className='streamInputContainer'>
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
                <button type='submit' title='Add to Favourites'>+</button>
            </span>
            <button
                type='button'
                className={favouritesOpen ? 'open' : ''}
                title={`${favouritesOpen ? 'Open' : 'Close'} Favourites list`}
                onClick={favouritesOpen ? hideFavourites : showFavourites}>
                v
            </button>
            <LoginButton />
            {favouritesOpen &&
                <div className='favourites'>
                    <small>Favourites list</small>
                    <ul>
                        {favourites.length ? favourites : '- no favourites saved -'}
                    </ul>
                </div>
            }
        </form >
    );
}
