import React from 'react';

export default function TwitchChat(props) {
    const { streamName } = props;
    const IFrameSource = `https://www.twitch.tv/embed/${streamName}/chat?darkpopout`;

    return (
        <div className='TwitchChat'>
            <iframe title='Twitch Chat' src={IFrameSource} frameBorder='0' />
        </div>
    );
}
