import React, { useCallback, useEffect, useState } from 'react';

export enum SplitterEvent {
    show,
    hide,
    reset,
    reverse,
}

interface SplitterProps {
    children: React.ReactChild[];
    onChange: (event: SplitterEvent) => void;
}

const MIN_SIZE = 400;

export function Splitter({ children, onChange }: SplitterProps) {
    // const [dragging, setDragging] = useState(false); // TODO: ?
    const [hidden, setHidden] = useState(false);
    const [reversed, setReversed] = useState(false);
    const [orientation, setOrientation] = useState('horizontal');
    const [size, setSize] = useState('1px');

    const toggleChatVisibility = useCallback(() => {
        setHidden(!hidden);
        onChange(!hidden ? SplitterEvent.hide : SplitterEvent.show);
    }, [hidden, onChange]);

    const toggleLayout = useCallback(() => {
        setReversed(!reversed);
        onChange(!reversed ? SplitterEvent.reverse : SplitterEvent.reset);
        window.localStorage.setItem('splitter-layout', !reversed ? 'reverse' : 'default');
    }, [reversed, onChange]);

    const handleMediaChange = useCallback((event) => setOrientation(event.matches ? 'horizontal' : 'vertical'), []);

    const onDragEnd = useCallback((event) => {
        const newSize = event.target.offsetParent.offsetWidth - event.clientX;
        const validSize = Math.max(MIN_SIZE, newSize);
        window.localStorage.setItem('splitter', validSize.toString());
        setSize(`${validSize}px`);
    }, []);

    useEffect(() => {
        const storedSize = window.localStorage.getItem('splitter');
        setSize(storedSize ? `${storedSize}px` : '1fr');
        const layout = window.localStorage.getItem('splitter-layout');
        setReversed(layout === 'reverse' ? true : false);

        const match = window.matchMedia('(orientation: landscape)');
        setOrientation(match.matches ? 'horizontal' : 'vertical')
        match.addEventListener('change', handleMediaChange);

        return () => match.removeEventListener('change', handleMediaChange);
    }, [handleMediaChange]);

    const childrenArray = React.Children.toArray(children);

    return (
        <div
            className={`Splitter grid ${orientation}`}
            style={{ gridTemplateColumns: hidden ? '1fr' : `1fr 5px ${size}` }}
        >
            <div className="splitterControls">
                {childrenArray[0]}
                <div className="control hideChatToggle" onClick={toggleChatVisibility}>
                    <span>{hidden ? 'Show' : 'Hide'}<br />chat</span>
                </div>
                <div className="control reverseLayoutToggle" onClick={toggleLayout}>
                    <span>{hidden ? 'Revert' : 'Reverse'}<br />layout</span>
                </div>
            </div>
            {!hidden && <div
                className={`drag ${orientation}`}
                draggable={true}
                onDragEnd={onDragEnd}
                title={'Drag to resize'}
            />}
            {!hidden && (childrenArray[1] ?? null)}
        </div>
    );
}
