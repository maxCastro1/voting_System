import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route {...rest} element={
      isAuthenticated
        ? <Component />
        : <Navigate to="home/" />
    } />
  );
};

export default ProtectedRoute;