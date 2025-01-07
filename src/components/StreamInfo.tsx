import { useStreamInfo } from '../api/hooks';

interface StreamInfoProps {
    children?: React.ReactChild;
    loginName: string;
    onClick(): void;
}

export function StreamInfo({ children, loginName, onClick }: StreamInfoProps) {
    return <div className='flex space-x-4 items-center'>
        {children}
        <span onClick={onClick} className='hover:underline cursor-pointer'>{loginName}</span>
    </div>
}

// export function StreamInfo({ children, loginName, onClick }: StreamInfoProps) {
//     const details = useStreamInfo(loginName);

//     if (!details) {
//         return <span>'... loading ...'</span>
//     };

//     return (
//         <span className='stream StreamInfo' title={details.stream.title} onClick={onClick}>
//             <img className="profile" src={details.user.profile_image_url} alt="Profile" />
//             <span>{details.stream.user_name}</span>
//             <span className={`circle ${details.stream.type}`}>
//                 <svg width="10" height="10" viewBox="0 0 10 10">
//                     <circle cx="5" cy="5" r="5" />
//                 </svg>
//             </span>
//             <span className='count'>{details.stream.viewer_count?.toLocaleString()}</span>
//             <span className='game'> watching {details.stream.game_name}</span>
//             {children}
//         </span>
//     );
// }
