import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from './LoadingSpinner'; // You'll need to create this

const ProtectedRoute = ({ redirectPath = '/login', children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;