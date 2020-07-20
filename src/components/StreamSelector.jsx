import React from 'react';
import ViewerCount from './ViewerCount';

import { getChannelData } from '../api/requests';

export default class StreamSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            favouritesOpen: false,
            savedList: new Set(),
        };
        this.ref = null;
    }

    componentDidMount() {
        this.getSavedList();
    }

    render() {
        const favourites = [...this.state.savedList].map(stream =>
            <li key={stream}>
                <span
                    className='stream'
                    onClick={() => this.changeStream(stream)}
                >
                    {stream}
                </span>
                <ViewerCount channelId={stream}></ViewerCount>
                <button
                    title='Remove from Favourites list'
                    onClick={() => this.removeFromSavedList(stream)}
                >
                    Remove
                </button>
            </li>
        );

        return (
            <form
                className='StreamSelector'
                onBlur={this.hideFavourites}
                onFocus={this.showFavourites}
                onMouseEnter={this.showFavourites}
                onMouseLeave={this.hideFavourites}
                onSubmit={this.addToSavedList}
            >
                <label htmlFor='stream'>Stream:</label>
                <span className='streamInputContainer'>
                    <input
                        ref={ref => this.ref = ref}
                        id='stream'
                        name='stream'
                        type='text'
                        defaultValue={this.props.streamName}
                        onBlur={this.onStreamNameChange}
                        onFocus={e => e.target.select()}
                        onKeyDown={this.handleEnter}
                        onKeyUp={this.handleEnter}
                    />
                    <button type='submit' title='Add to Favourites'>+</button>
                </span>
                <button
                    type='button'
                    className={this.state.favouritesOpen ? 'open' : ''}
                    title={(this.state.favouritesOpen ? 'Open' : 'Close') + ' Favourites list'}
                    onClick={this.toggleFavourites}>
                    v
                </button>
                {this.state.favouritesOpen &&
                    <div
                        className='favourites'
                    >
                        <small>Favourites list</small>
                        <ul>
                            {favourites.length ? favourites : '- no favourites saved -'}
                        </ul>
                    </div>
                }
            </form>
        );
    }

    addToSavedList = async (e) => {
        e.preventDefault();
        const channelName = e.target.stream.value;
        const { display_name } = await getChannelData(channelName);
        const { savedList } = this.state;
        savedList.add(display_name);
        this.saveSavedList(savedList);
    }

    changeStream = (stream) => {
        if (this.ref) {
            this.ref.value = stream;
        }
        const event = new CustomEvent('streamChange', { detail: { streamName: stream } });
        window.dispatchEvent(event);
    }

    getSavedList = (setState = true) => {
        const json = window.localStorage.getItem('savedList') || '[]';
        const list = new Set([...JSON.parse(json).sort()]);
        if (setState) {
            this.setState({ savedList: list });
        } else {
            return list;
        }
    }

    handleEnter = (e) => {
        if (e.keyCode && e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            this.onStreamNameChange(e);
        }
    }

    onStreamNameChange = (e) => {
        e.preventDefault();
        if (e.target.value !== this.props.streamName) {
            this.changeStream(e.target.value);
        }
    }

    removeFromSavedList = (stream) => {
        const list = this.getSavedList(false);
        list.delete(stream);
        this.saveSavedList(list);
    }

    saveSavedList = (list) => {
        this.setState({ savedList: new Set([...list]) });
        window.localStorage.setItem('savedList', JSON.stringify([...list]));
        this.forceUpdate();
    }

    showFavourites = () => {
        this.setState({ favouritesOpen: true });
    }

    hideFavourites = (e) => {
        this.setState({ favouritesOpen: false });
    }
}
