import { useState, useCallback, useRef, useEffect } from "react"

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);
    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        const httpAbortCtrl = new AbortController();
        
        activeHttpRequests.current.push(httpAbortCtrl);
        
        try {
            setIsLoading(true);
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });       
           
            const responseData = await response.json();       
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);
            if (!response.ok) {
                throw new Error(responseData.message);
            }
            
            setIsLoading(false);
            return responseData;
            
        } catch(err) {
            setIsLoading(false);
            setError(err.message);
            throw new Error(err.message);     
        } 
    }, []);
    const clearError = () => {
        setError();
    }
    
    useEffect(() => {
       
        return () => {  
            activeHttpRequests.current.forEach(abortCtrl => {abortCtrl.abort()});
        };
    }, [])

    return { isLoading, error, sendRequest, clearError };
}