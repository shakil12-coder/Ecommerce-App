import { useState ,  useEffect} from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";

export default function PrivateRoute() {
    const [ok , setOk] = useState(false);
    const[auth , setAuth] = useAuth();

    useEffect(()=>{
        const authCheck = async() =>{
            const res = await axios.get('/api/v1/auth//user-auth' , {
                // if(res.data.ok){
                //     setOk(true);
                // }
                // else{
                //     setOk(false);
                // }
            })
        }
    } , [])
    return ok ? <Outlet/>: 'spinner'
}