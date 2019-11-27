import React from 'react';
import { getStreamInfo } from '../api/requests';

export default class ViewerCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stream: null,
        };
    }

    async componentDidMount() {
        const stream = await getStreamInfo(this.props.channelId);
        if (stream) {
            this.setState({ stream });
        }
    }

    render() {
        if (!this.state.stream) {
            return null
        };

        const { title, type, viewer_count } = this.state.stream;
        const live = type === 'live' ? ' live' : '';

        return (
            <span className='ViewerCount' title={title}>
                <span className={'circle' + live}>
                    <svg width="10" height="10" viewBox="0 0 10 10">
                        <circle cx="5" cy="5" r="5" />
                    </svg>
                </span>
                <span className='count'>{viewer_count}</span>
            </span>
        );
    }
}
