import Layout from "../../components/Layout/Layout";
import { useState } from "react";
import {toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../../style/AuthStyles.css";

const ForgotPassword = () => {



    const[email , setEmail] = useState("")
    const[newPassword , setNewPassword] = useState("")
    const[answer , setAnwer] = useState("")
    const navigate = useNavigate();
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {
                 email, 
                 newPassword,
                 answer
            });
    
            if (res.data.success) {
                toast.success(res.data.message);                
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
    
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };



  return (
    <Layout title="Forgot - Ecommerce App">
    <div className="form-container ">
    <h4 className="title">RESET PASSWORD</h4>
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
            type="text"
            value={answer}
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your Favourite Sports"
            onChange={(e)=>setAnwer(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            value={newPassword}
            className="form-control"
            id="exampleInputEmail1"
            placeholder="Enter Your Password"
            onChange={(e)=>setNewPassword(e.target.value)}
            required
          />
        </div>


        <button type="submit" className="btn btn-primary" onClick={()=>{navigate('/forgot-password')}}>
          Reset
        </button>
        
      </form>
    </div>
    </Layout>
  )
}

export default ForgotPassword