import { useEffect } from 'react';
import { checkAccessToken } from './api/login';
import './App.css';
import TwitchLite from './containers/TwitchLite';

export default function App() {
    useEffect(() => {
        checkAccessToken();
    }, []);

    return (
        <div className='App'>
            <TwitchLite></TwitchLite>
        </div>
    );
}
