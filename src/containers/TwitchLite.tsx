import { useCallback, useEffect, useState } from 'react';
import { StreamSelector, UnauthenticatedStreamSelector } from '../components/StreamSelector';
import { Splitter, SplitterEvent } from '../components/Splitter';
import { TwitchChat } from '../components/TwitchChat';
import { TwitchPlayer } from '../components/TwitchPlayer';
import { getQuery, setQuery } from '../utils';
import { useAuthenticated } from '../api';

const DEFAULT_STREAM = 'monstercat'

export default function TwitchLite() {
    const [chatHidden, setChatHidden] = useState(false);
    const [reverseLayout, setReverseLayout] = useState(false); // TODO: implement
    const [streamName, setStreamName] = useState(getQuery() || DEFAULT_STREAM);
    const authName = useAuthenticated();

    const onChange = useCallback((event: SplitterEvent) => {
        switch (event) {
            case SplitterEvent.show:
                setChatHidden(false);
                break;
            case SplitterEvent.hide:
                setChatHidden(true);
                break;
            case SplitterEvent.reset:
                setReverseLayout(false);
                break;
            case SplitterEvent.reverse:
                setReverseLayout(true);
                break;
            default:
                break;
        }
    }, []);

    const handleEvent = useCallback((e: CustomEvent) => {
        setQuery(e.detail.streamName);
        setStreamName(e.detail.streamName);
    }, []);

    useEffect(() => {
        // fix types
        window.addEventListener('streamChange' as any, handleEvent);

        return () => window.removeEventListener('streamChange' as any, handleEvent);
    }, [handleEvent]);

    return (
        <div className={`TwitchLite${chatHidden ? ' hide-chat' : ''}${reverseLayout ? ' reverse' : ''}`}>
            <Splitter onChange={onChange}>
                <div className="playerPanel">
                    <TwitchPlayer streamName={streamName} />
                </div>
                <div className='chatPanel'>
                    {authName
                        ? <StreamSelector streamName={streamName} />
                        : <UnauthenticatedStreamSelector streamName={streamName} />
                    }
                    <TwitchChat streamName={streamName} />
                </div>
            </Splitter>
        </div>
    );
}
