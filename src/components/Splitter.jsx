import React from 'react';

export default class Splitter extends React.Component {
    constructor(props) {
        super(props);
        const media = window.matchMedia('(orientation: landscape)');
        const orientation = media.matches ? 'horizontal' : 'vertical';
        const size = window.localStorage.getItem('splitter');

        this.state = {
            dragging: false,
            hidden: false,
            orientation,
            size: size ? `${size}px` : '1fr',
        };

        matchMedia('(orientation: landscape)').addEventListener('change', (event) => {
            this.setState({ orientation: event.matches ? 'horizontal' : 'vertical' })
        });
    }

    render() {
        const { orientation, size, hidden } = this.state;
        const gridTemplate = hidden ? '1fr' : `1fr 5px ${size}`;

        return (
            <div
                className={`Splitter grid ${orientation}`}
                style={{ gridTemplateColumns: gridTemplate }}
            >
                <div className="hideChatToggleContainer">
                    {this.props.children[0]}
                    <div className="hideChatToggle" onClick={this.toggleChatVisibility}>
                        <span>{hidden ? 'Show' : 'Hide'}<br />chat</span>
                    </div>
                </div>
                {hidden ? null : <div
                    className={`drag ${orientation}`}
                    draggable={true}
                    onDragEnd={this.onDragEnd}
                    title={'Drag to resize'}
                />}
                {hidden ? null : this.props.children[1] || null}
            </div>
        );
    }

    onDragEnd = (event) => {
        const newSize = event.target.offsetParent.offsetWidth - event.clientX;
        window.localStorage.setItem('splitter', newSize);
        this.setState({ size: `${newSize}px` });
    }

    toggleChatVisibility = () => {
        this.setState({ hidden: !this.state.hidden });
    }
}
