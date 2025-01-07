import { useEffect } from "react";

interface TwitchChatProps {
    streamName: string;
    collapsed?: boolean;
}

export function TwitchChat({ streamName, collapsed }: TwitchChatProps) {
    const IFrameSource = `https://www.twitch.tv/embed/${streamName}/chat?darkpopout&parent=${import.meta.env.VITE_PUBLIC_URL}`;

    useEffect(() => console.info(collapsed ? 'Chat collapsed' : 'Chat expanded'), [collapsed]);

    if (collapsed) {
        return null;
    }
    return (
        <iframe title='Twitch Chat' className="size-full" src={IFrameSource} frameBorder='0' />
    );
}
