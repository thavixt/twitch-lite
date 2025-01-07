import { Children, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { StreamSelector, UnauthenticatedStreamSelector } from '../components/StreamSelector';
import { TwitchChat } from '../components/TwitchChat';
import { TwitchPlayer } from '../components/TwitchPlayer';
import { getQuery, setQuery } from '../utils';
import { useAuthenticated } from '../api';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const DEFAULT_STREAM = 'monstercat'

export default function TwitchLite() {
    const authName = useAuthenticated();
    const [streamName, setStreamName] = useState(getQuery() || DEFAULT_STREAM);
    const [collapsed, setCollapsed] = useState(false);
    const [reversed, setReversed] = useState(false);
    const [isHorizontal, setIsHorizontal] = useState(false);

    const onResizeClick = useCallback(() => {
        console.log('click');
        setReversed(reversed => !reversed);
    }, []);

    const handleEvent = useCallback((e: CustomEvent) => {
        setQuery(e.detail.streamName);
        setStreamName(e.detail.streamName);
    }, []);

    const handleMediaChange = useCallback((event: MediaQueryListEvent) => setIsHorizontal(event.matches), []);

    useEffect(() => {
        const match = window.matchMedia('(orientation: landscape)');
        setIsHorizontal(match.matches)
        match.addEventListener('change', handleMediaChange);
        return () => match.removeEventListener('change', handleMediaChange);
    }, [handleMediaChange]);

    useEffect(() => {
        window.addEventListener('streamChange' as any, handleEvent);
        return () => window.removeEventListener('streamChange' as any, handleEvent);
    }, [handleEvent]);

    return (
        <div id="twitch-lite" className={'flex flex-1 size-full bg-hintedgray-1'}>
            <ReversiblePanelGroup horizontal={isHorizontal}>
                <Panel
                    id='twitch-lite-video'
                    collapsible
                    defaultSize={30}
                    minSize={isHorizontal ? 15 : 70}
                    maxSize={isHorizontal ? 30 : 70}
                    onCollapse={() => setCollapsed(true)}
                    onExpand={() => setCollapsed(false)}
                    order={reversed ? 2 : 1}
                >
                    <div className='grid grid-rows-[35px_1fr] size-full'>
                        {authName
                            ? <StreamSelector streamName={streamName} />
                            : <UnauthenticatedStreamSelector streamName={streamName} />
                        }
                        <TwitchChat streamName={streamName} collapsed={collapsed} />
                    </div>
                </Panel>
                <PanelResizeHandle
                    id="resize-handle"
                    className='w-2 hover:bg-purple-600'
                    title='Drag to resize the chat panel'
                    // @todo implement reversing the panels
                    // onClick={onResizeClick}
                />
                <Panel id='twitch-lite-chat' order={reversed ? 1 : 2}>
                    <div className="flex flex-col size-full justify-center">
                        <TwitchPlayer streamName={streamName} />
                    </div>
                </Panel>
            </ReversiblePanelGroup>
        </div>
    );
}

interface ReversiblePanelGroupProps {
    horizontal?: boolean,
    reversed?: boolean,
}

function ReversiblePanelGroup({ children, horizontal, reversed }: PropsWithChildren<ReversiblePanelGroupProps>) {
    const childrenList = Children.toArray(children);

    return (
        <PanelGroup direction={horizontal ? 'horizontal' : 'vertical'} autoSaveId="twitch-lite">
            {childrenList[0]}
            {childrenList[1]}
            {childrenList[2]}
            {/* {horizontal ? (
                <>
                    {childrenList[0]}
                    {childrenList[1]}
                    {childrenList[2]}
                </>
            ) : (
                <>
                    {childrenList[2]}
                    {childrenList[1]}
                    {childrenList[0]}
                </>
            )} */}
        </PanelGroup>
    );
}