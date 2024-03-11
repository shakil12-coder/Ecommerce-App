import React, { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useState } from 'react'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import {toast } from 'react-toastify';

const Profile = () => {

    //context
    const[auth , setAuth] = useAuth();

    //state
    const[name , setName] = useState("")
    const[email , setEmail] = useState("")
    const[password , setPassword] = useState("")
    const[phone , setPhone] = useState("")
    const[address , setAddress] = useState("")


    //get user data
    useEffect(()=>{
      const {email , name , phone , address} = auth?.user;
      setName(name)
      setPhone(phone);
      setAddress(address)
      setEmail(email)
    } , [auth?.user])

    const handleOnSubmit = async (e) => {
      e.preventDefault();
      try {
          const {data} = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`, {
              name,
              email,
              password,
              address,
              phone 
          });
          if(data?.error){
            toast.error("Something went wrong in updating profile")
          }
          else{
            setAuth({...auth , user : data?.updatedUser})
            let ls = localStorage.getItem('auth');
            ls = JSON.parse(ls);
            ls.user = data.updatedUser;
            localStorage.setItem('auth' , JSON.stringify(ls));
            toast.success("Profile updated successfully");
          }
          
  
      } catch (error) {
          console.log(error);
          toast.error("Something went wrong");
      }
  };
  return (
    <Layout>
    <div className="container-fluid p-3 m-3">
        <div className="row">
            <div className="col-md-3">
                <UserMenu/>
            </div>
            <div className="col-md-9">
                <h1>Your profile</h1>
                <div className="form-container ">
      <h4 className="title">UPDATE FORM</h4>
        <form onSubmit={handleOnSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Name"
              onChange={(e)=>setName(e.target.value)}
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
              disabled
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
            UPDATE
          </button>
        </form>
      </div>
            </div>
        </div>
    </div>
    </Layout>
  )
}

export default Profile