import React, { createContext, useState} from 'react';
import { useSelector } from 'react-redux';
import { selectItems } from '../features/cart/cartSlice';
import { baseUrl, getGuestUserId, getId } from './constants';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const items = useSelector(selectItems);

    const [totalItems, setTotalItems] = useState(0);

    const updateCart = async () => {
        if (getGuestUserId()) {
            try {
                const res = await axios.get(`${baseUrl}/api/getCart/${getGuestUserId()}`);
                setTotalItems(res.data.cart.length);
            } catch (error) {
                console.log(error.response.data.message);
            }
        }
    };

    const updateLoggedInCart = async (items) => {
        setTotalItems(items.reduce((total, item) => item.quantity + total, 0) || 0);
    };

    const [isLoggedInOrGuest, setIsLoggedInOrGuest] = useState(false);

    const handleLoggedInOrGuest = () => {
        if (getGuestUserId() || getId()) {
            setIsLoggedInOrGuest(true);
        } else {
            setIsLoggedInOrGuest(false);
        }
    };

    const logout = async () => {
        localStorage.removeItem('guestUserId');
        localStorage.removeItem('guestUserExpiry');
    }

    return (
        <AppContext.Provider value={{ totalItems, updateCart, updateLoggedInCart, isLoggedInOrGuest, handleLoggedInOrGuest, logout }}>
            {children}
        </AppContext.Provider>
    );
};
