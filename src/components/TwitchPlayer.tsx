const AUTOPLAY = 'true';

interface TwitchPlayerProps {
    streamName: string;
}

export function TwitchPlayer({ streamName }: TwitchPlayerProps) {
    const IFrameSource = `https://player.twitch.tv/?volume=0.5&channel=${streamName}&autoplay=${AUTOPLAY}&parent=${process.env.REACT_APP_PUBLIC_URL}`;

    return (
        <div className='TwitchPlayer'>
            <iframe title='Twitch Player' src={IFrameSource} frameBorder='0' allowFullScreen />
        </div>
    );
}
