import React, { useEffect, useState } from 'react'
import Layout from "../../components/Layout/Layout"
import AdminMenu from '../../components/Layout/AdminMenu'
import { useAuth } from '../../context/auth'
import axios from 'axios'
import { useSearch } from '../../context/search'
import { Link } from 'react-router-dom'
import '../../style/AdminDashBoardStyle.css'

const AdminDashboard = () => {
    const [auth] = useAuth();
    const [allOrders, setAllOrders] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allProducts, setAllProducts] = useState([])

    const getAllOrders = async () => {
        try {
            const orders = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`);
            setAllOrders(orders.data);
        } catch (error) {
            console.log(error);
        }

    }

    const getAllUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`);
            setAllUsers(data.users);
        } catch (error) {
            console.log(error);
        }
    };

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            setAllProducts(data.products);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllOrders();
        getAllUsers();
        getAllProducts();

    }, [])

    let totalAmount = 0;
    allOrders && allOrders.map(orders => {
        orders.products.map((product) => {
            totalAmount += (product.price * product.quantity);
        })
    })

    return (
        <Layout>


            <div className="dashboard">
                <AdminMenu />
                <div className="dashboardContainer">
                    <h1>Dashboard</h1>

                    <div className="dashboardSummary">
                        <div>
                            <p>
                                {/* Total Amount <br /> ₹{totalAmount} */}
                                Total Amount <br /> ${totalAmount}

                            </p>
                        </div>
                        <div className="dashboardSummaryBox2">
                            <Link to="/dashboard/admin/products">
                                <p className='text-dark'>Product</p>
                                <p className='text-dark'>{allProducts && allProducts.length}</p>
                            </Link>
                            <Link to="/dashboard/admin/orders">
                                <p className='text-dark'>Orders</p>
                                <p className='text-dark'>{allOrders && allOrders.length}</p>
                            </Link>
                            <Link to="/dashboard/admin/users">
                                <p className='text-dark'>Users</p>
                                <p className='text-dark'>{allUsers && allUsers.length}</p>
                            </Link>
                        </div>
                    </div>


                </div>
            </div>





        </Layout>
    )
}

export default AdminDashboard