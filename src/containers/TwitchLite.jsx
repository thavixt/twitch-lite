import React from 'react';

import StreamSelector from '../components/StreamSelector';
import TwitchChat from '../components/TwitchChat';
import TwitchPlayer from '../components/TwitchPlayer';

class TwitchLite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            streamName: this.getQuery() || 'monstercat'
        }

        window.addEventListener('streamChange', (e) => {
            this.setQuery(e.detail.streamName);
            this.changeStream(e.detail.streamName);
        })
    }

    getQuery = () => {
        const queryValue = (new URLSearchParams(window.location.search)).get('stream');
        if (!queryValue) {
            return window.localStorage.getItem('stream') || null;
        }
        return queryValue;
    }

    setQuery = (stream) => {
        window.localStorage.setItem('stream', stream);
        const params = new URLSearchParams(window.location.search);
        params.set('stream', stream);
        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    };

    render() {
        return (
            <div className='TwitchLite grid'>
                <TwitchPlayer streamName={this.state.streamName} />
                <div className='chatPanel'>
                    <StreamSelector streamName={this.state.streamName} />
                    <TwitchChat streamName={this.state.streamName} />
                </div>
            </div>
        )
    }

    changeStream = (streamName) => {
        this.setState({ streamName });
    }
}

export default TwitchLite;
