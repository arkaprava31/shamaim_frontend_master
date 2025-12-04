import { useContext, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { getGuestUserId } from './constants';
import { AppContext } from './Context';

const AutoExpire = () => {

    const alert = useAlert();

    const { updateCart, handleLoggedInOrGuest } = useContext(AppContext);

    useEffect(() => {
        if (getGuestUserId()) {
            const interval = setInterval(() => {
                const expiryTime = localStorage.getItem('guestUserExpiry');
                const currentTime = new Date().getTime();

                if (expiryTime && currentTime >= expiryTime) {
                    localStorage.removeItem('guestUserId');
                    localStorage.removeItem('guestUserExpiry');
                    updateCart();
                    handleLoggedInOrGuest();
                    alert.info('Your session has expired!');
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);

    return null;
};

export default AutoExpire;
