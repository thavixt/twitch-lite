import React from 'react';

export default function TwitchChat(props) {
    const { streamName } = props;
    const IFrameSource = `https://www.twitch.tv/embed/${streamName}/chat?darkpopout&parent=${process.env.REACT_APP_PUBLIC_URL}`;

    return (
        <div className='TwitchChat'>
            <iframe title='Twitch Chat' src={IFrameSource} frameBorder='0' />
        </div>
    );
}
