import {useState, useCallback, useEffect} from 'react';

let logoutTimer;
const useAuth = () => {
    console.log("auth-hook")
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);
    const [userImage, setUserImage] = useState(null);

    const login = useCallback((uid, userImage, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setUserImage(userImage);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData', 
            JSON.stringify({
            userId: uid, 
            userImage: userImage,
            token: token,
            expiration: tokenExpirationDate.toISOString()
            })
        );

    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUserImage(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));

        if (
            storedData && 
            storedData.token && 
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.userImage, storedData.token, new Date(storedData.expiration));
        }
    }, [login])

    return { token, userId, userImage, login, logout }

}

export default useAuth;