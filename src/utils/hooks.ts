import { useEffect } from "react";

export function useInterval(callback: Function, interval = 60_000) {
    useEffect(() => {
        callback();
        const id = setInterval(callback, interval);
        return () => clearInterval(id);
    }, [callback, interval]);
}
