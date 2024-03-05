import React from "react";
import Layout from "../../components/Layout/Layout";
import { useState } from "react";
import {toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../../style/AuthStyles.css";
import {useAuth} from "../../context/auth"

const Login = () => {

    const[email , setEmail] = useState("")
    const[password , setPassword] = useState("")
    const[auth , setAuth] = useAuth();
    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {
                 email, password
            });
    
            console.log(res.data.message);
            if (res.data.success) {
                toast.success(res.data.message);
                console.log("logged in succesfullly")
                setAuth({
                  ...auth , 
                  user : res.data.user,
                  token : res.data.token
                });
                localStorage.setItem("auth" , JSON.stringify(res.data));
                navigate("/");
            } else {
                toast.error(res.data.message);
            }
    
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };


  return (
    <Layout title="Login - Ecommerce App">
    <div className="form-container ">
    <h4 className="title">LOGIN FORM</h4>
      <form onSubmit={handleOnSubmit}>
        

        <div className="mb-3">
          <input
            type="text"
            value={email}
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your Email id"
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            value={password}
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your Password"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  </Layout>
  )
}

export default Login