import ConfirmationPanel from './Modules/ConfirmationPanel/ConfirmationPanel';
import DoctorPanel from './Modules/DoctorPanel/DoctorPanel';
import LoginPanel from './Modules/LoginPanel/LoginPanel';
import AdminPanel from './Modules/AdminPanel/AdminPanel';
import Registration from './Modules/Registration/Registration';
import QueDisplay from './Modules/QueDisplay/QueDisplay';
import PersistLogin from './Components/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './Components/RequireAuth';
function App() {
	return (
		<Routes>
			{/* Not protected */}
			<Route path="/" element={<Registration />} />
			<Route path="login-panel" element={<LoginPanel />} />
			{/* Protected */}
			<Route element={<PersistLogin />}>
				<Route element={<RequireAuth allowedRoles={['staff', 'admin']} />}>
					<Route path="/que-display" element={<QueDisplay />} />
					<Route path="/confirmation-panel" element={<ConfirmationPanel />} />
				</Route>
				<Route element={<RequireAuth allowedRoles={['doctor', 'admin']} />}>
					<Route path="/doctor-panel" element={<DoctorPanel />} />
				</Route>
				<Route element={<RequireAuth allowedRoles={['admin']} />}>
					<Route path="/admin-panel" element={<AdminPanel />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
