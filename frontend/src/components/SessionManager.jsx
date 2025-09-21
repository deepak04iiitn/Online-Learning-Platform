import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';

export default function SessionManager() {
  const { currentUser, sessionExpiry } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !sessionExpiry) return;

    const checkSessionExpiry = () => {
      const now = Date.now();
      if (now >= sessionExpiry) {
        handleAutoLogout();
      }
    };

    const handleAutoLogout = async () => {
      try {
        await fetch('/backend/auth/signout', {
          method: 'POST',
        });
      } catch (error) {
        console.log('Error during auto logout:', error);
      } finally {
        // Clearing the Redux state and redirecting to sign in
        dispatch(signoutSuccess());
        navigate('/sign-in', { replace: true });
      }
    };

    // Checking immediately when component mounts
    checkSessionExpiry();

    // Setting up interval to check every 30 seconds
    const interval = setInterval(checkSessionExpiry, 30000);

    // Also checking when the page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSessionExpiry();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, sessionExpiry, dispatch, navigate]);

  // This component doesn't render anything
  return null;
}