import React from "react";
import Layout from "../../components/Layout/Layout";
import { useState } from "react";
import {toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../../style/AuthStyles.css";

const Register = () => {

    const[name , setName] = useState("")
    const[email , setEmail] = useState("")
    const[password , setPassword] = useState("")
    const[answer , setAnwer] = useState("")
    const[address , setAddress] = useState("")
    const[phone , setPhone] = useState("")
    const navigate = useNavigate();


    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {
                name, email, password, address, phone , answer
            });
    
            console.log(res.data.message);
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
    <Layout title="Register - Ecommerce App">
      <div className="form-container ">
      <h4 className="title">REGISTER FORM</h4>
        <form onSubmit={handleOnSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              onChange={(e)=>setName(e.target.value)}
              required
            />
          </div>

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
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="What is your favourite sports"
              onChange={(e)=>setAnwer(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={address}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Address"
              onChange={(e)=>setAddress(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={phone}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Phone Number"
              onChange={(e)=>setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
