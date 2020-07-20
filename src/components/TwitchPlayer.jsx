import React from 'react';

export default function TwitchPlayer(props) {
    const { streamName } = props;
    const IFrameSource = `https://player.twitch.tv/?volume=0.3&channel=${streamName}&autoplay=false&parent=${process.env.REACT_APP_PUBLIC_URL}`;

    return (
        <div className='TwitchPlayer'>
            <iframe title='Twitch Player' src={IFrameSource} frameBorder='0' allowFullScreen />
        </div>
    );
}
