import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

interface AuthProps {
	allowedRoles: string[];
}

const RequireAuth = ({ allowedRoles }: AuthProps) => {
	const { auth }: any = useAuth();
	const location = useLocation();
	const redirectTo = () => {
		if (!auth.roles) {
			return (
				<Navigate to="/login-panel" state={{ from: location, roleExists: false, roleAllowed: false, rolesAllowed: allowedRoles }} replace />
			);
		} else if (auth?.roles?.find((role: string) => allowedRoles?.includes(role))) {
			return <Outlet />;
		} else {
			return <Navigate to="/login-panel" state={{ from: location, roleExists: true, roleAllowed: true, rolesAllowed: allowedRoles }} replace />;
		}
	};

	return redirectTo();
};
export default RequireAuth;
