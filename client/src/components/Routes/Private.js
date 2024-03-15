import { useState ,  useEffect} from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";

export default function PrivateRoute() {
    const [ok , setOk] = useState(false);
    const[auth , setAuth] = useAuth();
    console.log("token ",auth.token);

    useEffect(()=>{
        const authCheck = async() =>{
            const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/user-auth`);
            console.log(res.data);
            if(res.data.ok){
                setOk(true);
            }
            else{
                setOk(false);
            }
        };
        if(auth?.token) authCheck();
    } , [auth.token])
    return ok ? <Outlet/>: <Spinner/>
    
}