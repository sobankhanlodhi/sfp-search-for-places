type CallbackFunction = (...args: any[]) => void;

export const debounce = (func: CallbackFunction, delay: number) => {
    let timeoutId: NodeJS.Timeout | null;

    return (...args: any[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null; 
        }, delay);
    };
};
