import React from 'react';

import ViewerCount from './ViewerCount';

class StreamSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            favouritesOpen: false,
        };
        this.ref = null;
    }

    render() {
        const favourites = [...this.getSavedList()].map(stream =>
            <li key={stream}>
                <span
                    className='stream'
                    onClick={() => this.changeStream(stream)}
                >
                    {stream}
                </span>
                <ViewerCount streamId={stream}></ViewerCount>
                <button
                    title='Remove from Favourites list'
                    onClick={() => this.removeFromSavedList(stream)}
                >
                    Remove
                </button>
            </li>
        );

        return (
            <form className='StreamSelector' onSubmit={this.addToSavedList}>
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
                    <div className='favourites'>
                        <small>Favourites list</small>
                        <ul>
                            {favourites.length ? favourites : '- no favourites saved -'}
                        </ul>
                    </div>
                }
            </form>
        );
    }

    handleEnter = (e) => {
        if (e.keyCode && e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            this.onStreamNameChange(e);
        }
    }

    addToSavedList = (e) => {
        e.preventDefault();
        const stream = e.target.stream.value;
        const list = this.getSavedList();
        list.add(stream);
        this.saveSavedList(list);
    }

    removeFromSavedList = (stream) => {
        const list = this.getSavedList();
        list.delete(stream);
        this.saveSavedList(list);
    }

    getSavedList = () => {
        const json = window.localStorage.getItem('savedList') || '[]';
        const list = JSON.parse(json).sort();
        return new Set([...list]);
    }

    saveSavedList = (list) => {
        window.localStorage.setItem('savedList', JSON.stringify([...list]));
        this.forceUpdate();
    }

    toggleFavourites = () => {
        this.setState({ favouritesOpen: !this.state.favouritesOpen });
    }

    onStreamNameChange = (e) => {
        e.preventDefault();
        if (e.target.value !== this.props.streamName) {
            this.changeStream(e.target.value);
        }
    }

    changeStream = (stream) => {
        if (this.ref) {
            this.ref.value = stream;
        }
        const event = new CustomEvent('streamChange', { detail: { streamName: stream } });
        window.dispatchEvent(event);
    }
}

export default StreamSelector;
