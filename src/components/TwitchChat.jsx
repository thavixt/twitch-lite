import React from 'react';

class TwitchChat extends React.Component {

    render() {
        return (
            <div className='TwitchChat'>
                <iframe
                    title='Twitch Chat'
                    src={this.getIFrameSource(this.props.streamName)}
                    frameBorder='0'
                />
            </div>
        );
    }

    getIFrameSource = (channel) => `https://www.twitch.tv/embed/${channel}/chat?darkpopout`;
}

export default TwitchChat;
