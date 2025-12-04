import { useEffect } from 'react';
import { selectLoggedInUser, signOutAsync } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Logout() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(() => {
    const getsignOut = async () => {
      await dispatch(signOutAsync());
    };
    getsignOut();

  }, [dispatch]);

  return (
    <>
      {!user && <Navigate to="/login" replace={true} />}
    </>
  );
}

export default Logout;
