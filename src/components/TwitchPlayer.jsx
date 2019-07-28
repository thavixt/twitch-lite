import React from 'react';

class TwitchPlayer extends React.Component {
    render() {
        return (
            <div className='TwitchPlayer'>
                <iframe
                    title='Twitch Player'
                    src={this.getIFrameSource(this.props.streamName)}
                    frameBorder='0'
                    allowFullScreen
                />
            </div>
        )
    }

    getIFrameSource = (channel) => `https://player.twitch.tv/?volume=0.3&channel=${channel}`;
}

export default TwitchPlayer;
