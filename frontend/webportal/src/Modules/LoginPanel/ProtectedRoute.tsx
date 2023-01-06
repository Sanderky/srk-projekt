import { Navigate, Outlet } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios"
import LoginPanel from "./LoginPanel";

const ProtectedRoute = ({ redirectPath = '/login-panel', roleNeeded, directTo }: any) => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Array<String>>([]);

    const styles = {
        margin: '3rem',
        fontWeight: 'bold',
    }

    useEffect(() => {
        const token: any = localStorage.getItem('token');
        axios.get("http://localhost:3000/user/protected", {
            headers: {
                Authorization: token,
            },
        })
            .then((res: any) => {
                setLoading(false);
                setAuth(true);
                setRoles(res.data.user.roles)

            })
            .catch(err => {
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div style={styles}>Ładowanie...</div>
    }
    if (!auth || !roles.includes(roleNeeded)) {
        return <Navigate to={"login-panel" + directTo} />
    }
    return <Outlet />
}

export default ProtectedRoute;
