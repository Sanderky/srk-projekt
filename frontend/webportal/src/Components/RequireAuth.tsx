import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const RequireAuth = ({ allowedRoles }: any) => {
	const { auth }: any = useAuth();
	const location = useLocation();

	const redirectTo = () => {
		if (auth?.roles?.find((role: string) => allowedRoles?.includes(role))) {
			return <Outlet />;
		} else if (!auth.roles) {
			return <Navigate to="/login-panel" state={{ from: location, error: false }} replace />;
		} else {
			return <Navigate to="/login-panel" state={{ from: location, error: true }} replace />;
		}
	};

	return redirectTo();
};
export default RequireAuth;
