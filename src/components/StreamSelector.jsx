import React from 'react';

class StreamSelector extends React.Component {
    render() {
        return (
            <div className='StreamSelector'>
                <label htmlFor='stream'>Stream:&nbsp;&nbsp;</label>
                <input
                    type='text'
                    name='stream'
                    id='stream'
                    defaultValue={this.props.streamName}
                    onFocus={e => e.target.select()}
                    onBlur={this.onStreamNameChange}
                    onKeyUp={e => e.keyCode && e.keyCode === 13 && this.onStreamNameChange(e)}
                />
            </div>
        )
    }

    onStreamNameChange = (e) => {
        if (e.target.value === this.props.streamName) return;

        const detail = { streamName: e.target.value };
        const event = new CustomEvent('streamChange', { detail });
        window.dispatchEvent(event);
    }
}

export default StreamSelector;
