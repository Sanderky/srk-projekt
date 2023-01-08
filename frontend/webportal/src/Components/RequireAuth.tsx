import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const RequireAuth = ({ allowedRoles }: any) => {
	const { auth }: any = useAuth();
	const location = useLocation();
	// console.log(auth.roles);
	return auth?.roles?.find((role: string) => allowedRoles?.includes(role)) ? <Outlet /> : <Navigate to="/login-panel" state={{ from: location }} replace />;
};
export default RequireAuth;
