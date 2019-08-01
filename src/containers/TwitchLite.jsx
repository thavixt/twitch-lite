import React from 'react';

import StreamSelector from '../components/StreamSelector';
import TwitchChat from '../components/TwitchChat';
import TwitchPlayer from '../components/TwitchPlayer';

const DEFAULT_STREAM = 'monstercat'

class TwitchLite extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            streamName: this.getQuery() || DEFAULT_STREAM,
            chatHidden: false,
        };

        window.addEventListener('streamChange', (e) => {
            this.setQuery(e.detail.streamName);
            this.setState({ streamName: e.detail.streamName });
        });
    }

    render() {
        return (
            <div className={'TwitchLite grid' + (this.state.chatHidden ? ' hide-chat' : '')}>
                <div className="playerPanel">
                    <TwitchPlayer streamName={this.state.streamName} />
                    <div className="hideChatToggle" onClick={this.toggleChatVisibility}>
                        <span>{this.state.chatHidden ? 'Show' : 'Hide'}</span>
                    </div>
                </div>
                {!this.state.chatHidden && <div className='chatPanel'>
                    <StreamSelector streamName={this.state.streamName} />
                    <TwitchChat streamName={this.state.streamName} />
                </div>}
            </div>
        );
    }

    getQuery = () => {
        const queryValue = (new URLSearchParams(window.location.search)).get('stream');
        if (!queryValue) {
            return window.localStorage.getItem('lastWatched') || null;
        }
        return queryValue;
    }

    setQuery = (stream) => {
        window.localStorage.setItem('lastWatched', stream);
        const params = new URLSearchParams(window.location.search);
        params.set('stream', stream);
        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    };

    toggleChatVisibility = () => {
        this.setState({ chatHidden: !this.state.chatHidden });
    }
}

export default TwitchLite;
