import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from '../authSlice';

function Protected({ children }) {
  // const user = useSelector(selectLoggedInUser);
  const user = localStorage.getItem("id");

  const guestUser = localStorage.getItem("guestUserId");

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
}

export default Protected;
