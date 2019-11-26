import React from 'react';

import { getChannelData } from '../api/requests';

export default class ViewerCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            channelData: null,
        };
    }

    async componentDidMount() {
        try {
            const channelData = await getChannelData(this.props.streamId);
            channelData && this.setState({
                channelData,
            });
        } catch (ex) {
            console.error(ex);
        }
    }

    render() {
        if (!this.state.channelData) return null;

        const live = (this.state.channelData.type === 'live') ? ' live' : '';
        return (
            <span className='ViewerCount' title={this.state.channelData.title}>
                <span className={'circle' + live}>
                    <svg width="10" height="10" viewBox="0 0 10 10">
                        <circle cx="5" cy="5" r="5" />
                    </svg>
                </span>
                <span className='count'>{this.state.channelData.viewer_count}</span>
            </span>
        );
    }
}
