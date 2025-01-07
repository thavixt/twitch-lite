const AUTOPLAY = 'true';

interface TwitchPlayerProps {
    streamName: string;
}

export function TwitchPlayer({ streamName }: TwitchPlayerProps) {
    const IFrameSource = `https://player.twitch.tv/?volume=0.5&channel=${streamName}&autoplay=${AUTOPLAY}&parent=${import.meta.env.VITE_PUBLIC_URL}`;

    return (
        <iframe title='Twitch Player' src={IFrameSource} frameBorder='0' allowFullScreen height="100%" />
    );
}
