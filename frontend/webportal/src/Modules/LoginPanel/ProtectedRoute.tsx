import { Navigate,Outlet} from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios"
import LoginPanel from "./LoginPanel";

const ProtectedRoute = ({redirectPath ='/LoginPanel',roleNeeded,directTo}:any)=> {
    const [auth, setAuth] = useState(false);
    const [loading,setLoading] = useState(true);
    const [roles,setRoles] = useState<Array<String>>([]);
    useEffect(()=>{
        const token:any = localStorage.getItem('token');
        axios.get("http://localhost:3000/user/protected",{
            headers: {
                 Authorization: token,
            },
        })
        .then((res:any) => {
                setLoading(false);
                setAuth(true); 
                setRoles(res.data.user.roles)  
                
        })
        .catch(err => {
            setLoading(false)
        }) 
    },[])

    if(loading) {
        return <div>Is losading</div>
    }
    if(!auth || !roles.includes(roleNeeded)){
        return <Navigate to={"loginPanel"+directTo}/>
    }
    return <Outlet/>
}

export default ProtectedRoute;
