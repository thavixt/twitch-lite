interface TwitchChatProps {
    streamName: string;
}

export function TwitchChat({ streamName }: TwitchChatProps) {
    const IFrameSource = `https://www.twitch.tv/embed/${streamName}/chat?darkpopout&parent=${process.env.REACT_APP_PUBLIC_URL}`;

    return (
        <div className='TwitchChat'>
            <iframe title='Twitch Chat' src={IFrameSource} frameBorder='0' />
        </div>
    );
}
